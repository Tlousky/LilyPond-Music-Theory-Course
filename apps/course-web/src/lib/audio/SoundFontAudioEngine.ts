/**
 * SoundFontAudioEngine.ts - High-fidelity Web Audio Multi-Instrument Engine
 * Supports: Piano, Harpsichord, Strings, and Metronome
 * Includes MIDI event scheduling, note synthesis, and physical USB Web MIDI keyboard listeners.
 */

// Web MIDI types fallback
interface MIDIAccess {
  inputs: Map<string, MIDIInput>;
  onstatechange: ((e: any) => void) | null;
}
interface MIDIInput {
  onmidimessage: ((event: MIDIMessageEvent) => void) | null;
}
interface MIDIMessageEvent {
  data: Uint8Array;
}

export type InstrumentType = 'piano' | 'harpsichord' | 'strings' | 'metronome';

export interface NoteEvent {
  midi: number;
  pitch: string;
  timeSec: number;
  durationSec: number;
}

// Scientific pitch to MIDI number map
export function pitchToMidi(pitch: string): number {
  const noteRegex = /^([a-gA-G])([#b♯♭is|es]*)(-?\d+)$/;
  const match = pitch.trim().match(noteRegex);
  if (!match) return 60; // default C4

  const letter = match[1].toUpperCase();
  const acc = match[2];
  const octave = parseInt(match[3], 10);

  const baseNotes: Record<string, number> = {
    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
  };

  let semitone = baseNotes[letter] ?? 0;
  if (acc.includes('#') || acc.includes('♯') || acc.includes('is')) semitone += 1;
  if (acc.includes('b') || acc.includes('♭') || acc.includes('es')) semitone -= 1;

  return (octave + 1) * 12 + semitone;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function midiToPitchName(midi: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const name = names[midi % 12];
  return `${name}${octave}`;
}

export class SoundFontAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentInstrument: InstrumentType = 'piano';
  private activeVoices: Map<number, { stop: () => void }> = new Map();
  private midiAccess: MIDIAccess | null = null;
  private midiListeners: Set<(midi: number, velocity: number) => void> = new Set();
  private sampleBuffers: Map<string, AudioBuffer> = new Map();
  private sampleLoadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();

  private isSfxMuted: boolean = false;

  constructor() {
    // AudioContext is initialized lazily upon user gesture
  }

  public init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.preloadAllSamples();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSfxMuted(muted: boolean) {
    this.isSfxMuted = muted;
  }

  public getSfxMuted(): boolean {
    return this.isSfxMuted;
  }

  public toggleSfx(): boolean {
    this.isSfxMuted = !this.isSfxMuted;
    return this.isSfxMuted;
  }

  public async loadSample(name: string, url: string): Promise<AudioBuffer | null> {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return null;
    if (this.sampleBuffers.has(name)) return this.sampleBuffers.get(name)!;
    if (this.sampleLoadingPromises.has(name)) return this.sampleLoadingPromises.get(name)!;

    const promise = (async () => {
      try {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (!AudioCtx) return null;
          this.ctx = new AudioCtx();
        }
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        const audioBuf = await this.ctx.decodeAudioData(arrayBuf);
        this.sampleBuffers.set(name, audioBuf);
        return audioBuf;
      } catch (e) {
        console.warn(`Could not load audio sample ${name} from ${url}:`, e);
        return null;
      }
    })();

    this.sampleLoadingPromises.set(name, promise);
    return promise;
  }

  private preloadAllSamples() {
    const base = import.meta.env.BASE_URL?.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL || ''}/`;
    this.loadSample('metronome_high', `${base}sounds/metronome_high.wav`);
    this.loadSample('metronome_low', `${base}sounds/metronome_low.wav`);
    this.loadSample('ui_click', `${base}sounds/ui_click.wav`);
    this.loadSample('ui_select', `${base}sounds/ui_select.wav`);
    this.loadSample('ui_success', `${base}sounds/ui_success.wav`);
    this.loadSample('ui_error', `${base}sounds/ui_error.wav`);
    this.loadSample('ui_complete', `${base}sounds/ui_complete.wav`);
  }

  public playSample(name: string, volume: number = 0.5): boolean {
    if (this.isSfxMuted) return false;
    this.init();
    if (!this.ctx || !this.masterGain) return false;

    const buf = this.sampleBuffers.get(name);
    if (!buf) return false;

    const source = this.ctx.createBufferSource();
    source.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    source.connect(gain);
    gain.connect(this.masterGain);
    source.start(this.ctx.currentTime);
    return true;
  }

  /**
   * Subtle button click
   */
  public playUiClick(volume: number = 0.4): void {
    if (this.isSfxMuted) return;
    if (this.playSample('ui_click', volume)) return;

    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.connect(this.masterGain);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.02);

    gain.gain.setValueAtTime(volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.02);
  }

  /**
   * Option / tab selection
   */
  public playUiSelect(volume: number = 0.4): void {
    if (this.isSfxMuted) return;
    if (this.playSample('ui_select', volume)) return;

    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.connect(this.masterGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);

    gain.gain.setValueAtTime(volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Correct quiz answer or exercise passed
   */
  public playSuccessChime(volume: number = 0.6): void {
    if (this.isSfxMuted) return;
    if (this.playSample('ui_success', volume)) return;

    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    [523.25, 659.25].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      gain.connect(this.masterGain!);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.001, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(volume * 0.4, now + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

      osc.connect(gain);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.25);
    });
  }

  /**
   * Incorrect answer or grader diagnostic alert
   */
  public playErrorBuzz(volume: number = 0.5): void {
    if (this.isSfxMuted) return;
    if (this.playSample('ui_error', volume)) return;

    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.connect(this.masterGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.15);

    gain.gain.setValueAtTime(volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Celebratory lesson completion fanfare
   */
  public playCompletionFanfare(volume: number = 0.7): void {
    if (this.isSfxMuted) return;
    if (this.playSample('ui_complete', volume)) return;

    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      gain.connect(this.masterGain!);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(volume * 0.5, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  public playMetronomeBeat(isDownbeat: boolean = false, volume: number = 0.8): void {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const sampleName = isDownbeat ? 'metronome_high' : 'metronome_low';
    const buf = this.sampleBuffers.get(sampleName);
    const now = this.ctx.currentTime;

    if (buf) {
      const source = this.ctx.createBufferSource();
      source.buffer = buf;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * (isDownbeat ? 1.0 : 0.75), now);
      source.connect(gain);
      gain.connect(this.masterGain);
      source.start(now);
      return;
    }

    // High-definition procedural fallback if sample is loading or offline
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.connect(this.masterGain);

    osc.type = isDownbeat ? 'triangle' : 'sine';
    const startFreq = isDownbeat ? 1800 : 1000;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);

    gain.gain.setValueAtTime(volume * (isDownbeat ? 0.9 : 0.6), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public setInstrument(inst: InstrumentType) {
    this.currentInstrument = inst;
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  /**
   * Plays a note by MIDI number or pitch string (e.g. 60 or "C4")
   */
  public playNote(
    note: number | string,
    durationSec: number = 0.8,
    inst: InstrumentType = this.currentInstrument,
    velocity: number = 0.8
  ): void {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const midi = typeof note === 'number' ? note : pitchToMidi(note);
    const freq = midiToFrequency(midi);
    const now = this.ctx.currentTime;

    const voiceGain = this.ctx.createGain();
    voiceGain.connect(this.masterGain);

    if (inst === 'metronome') {
      this.playMetronomeBeat(midi >= 80, velocity);
      return;
    }

    if (inst === 'piano') {
      // Acoustic Grand Piano multi-harmonic physical model
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc3.type = 'sine';

      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now); // 2nd harmonic
      osc3.frequency.setValueAtTime(freq * 3, now); // 3rd harmonic

      const g1 = this.ctx.createGain();
      const g2 = this.ctx.createGain();
      const g3 = this.ctx.createGain();

      g1.gain.value = 0.7;
      g2.gain.value = 0.25;
      g3.gain.value = 0.1;

      osc1.connect(g1);
      osc2.connect(g2);
      osc3.connect(g3);

      g1.connect(voiceGain);
      g2.connect(voiceGain);
      g3.connect(voiceGain);

      // Piano ADSR envelope: punchy attack, natural decay
      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.exponentialRampToValueAtTime(velocity * 0.8, now + 0.015);
      voiceGain.gain.exponentialRampToValueAtTime(velocity * 0.4, now + 0.2);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      const stopTime = now + durationSec;
      osc1.stop(stopTime);
      osc2.stop(stopTime);
      osc3.stop(stopTime);
    } else if (inst === 'harpsichord') {
      // Crisp bright plucked timbre
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 6, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + durationSec * 0.5);

      voiceGain.gain.setValueAtTime(velocity * 0.6, now);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 0.7);

      osc.connect(filter);
      filter.connect(voiceGain);
      osc.start(now);
      osc.stop(now + durationSec);
    } else if (inst === 'strings') {
      // Warm bowed string ensemble
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3, now);

      // Bow attack and gentle release
      voiceGain.gain.setValueAtTime(0.001, now);
      voiceGain.gain.linearRampToValueAtTime(velocity * 0.5, now + 0.15);
      voiceGain.gain.setValueAtTime(velocity * 0.5, now + durationSec - 0.2);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(filter);
      filter.connect(voiceGain);
      osc.start(now);
      osc.stop(now + durationSec);
    }
  }

  /**
   * Connects to Physical USB / Bluetooth MIDI Keyboards via Web MIDI API
   */
  public async initWebMidi(): Promise<boolean> {
    if (typeof navigator.requestMIDIAccess !== 'function') {
      console.warn('Web MIDI API is not supported in this browser.');
      return false;
    }

    try {
      this.midiAccess = await (navigator as any).requestMIDIAccess();
      for (const input of this.midiAccess!.inputs.values()) {
        input.onmidimessage = this.handleMidiMessage.bind(this);
      }
      this.midiAccess!.onstatechange = (e: any) => {
        if (e.port?.type === 'input' && e.port?.state === 'connected') {
          (e.port as MIDIInput).onmidimessage = this.handleMidiMessage.bind(this);
        }
      };
      return true;
    } catch (err) {
      console.warn('Could not initialize Web MIDI:', err);
      return false;
    }
  }

  private handleMidiMessage(event: MIDIMessageEvent) {
    const [status, note, velocity] = event.data;
    const command = status >> 4;

    if (command === 9 && velocity > 0) {
      // Note On
      this.playNote(note, 0.8, this.currentInstrument, velocity / 127);
      for (const listener of this.midiListeners) {
        listener(note, velocity / 127);
      }
    }
  }

  public addMidiListener(listener: (midi: number, velocity: number) => void) {
    this.midiListeners.add(listener);
  }

  public removeMidiListener(listener: (midi: number, velocity: number) => void) {
    this.midiListeners.delete(listener);
  }
}

export const audioEngine = new SoundFontAudioEngine();
