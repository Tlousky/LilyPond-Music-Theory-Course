import { describe, it, expect, vi } from 'vitest';
import {
  pitchToMidi,
  midiToFrequency,
  midiToPitchName,
  SoundFontAudioEngine,
} from './SoundFontAudioEngine';

describe('SoundFontAudioEngine', () => {
  it('converts pitch strings to accurate MIDI numbers', () => {
    expect(pitchToMidi('C4')).toBe(60);
    expect(pitchToMidi('A4')).toBe(69);
    expect(pitchToMidi('C5')).toBe(72);
    expect(pitchToMidi('F#4')).toBe(66);
    expect(pitchToMidi('Bb3')).toBe(58);
    expect(pitchToMidi('fis4')).toBe(66);
    expect(pitchToMidi('bes3')).toBe(58);
  });

  it('converts MIDI to standard frequencies (A4 = 440 Hz)', () => {
    expect(Math.round(midiToFrequency(69))).toBe(440);
    expect(Math.round(midiToFrequency(60))).toBe(262); // C4 ~261.63 Hz
  });

  it('converts MIDI to pitch names', () => {
    expect(midiToPitchName(60)).toBe('C4');
    expect(midiToPitchName(69)).toBe('A4');
    expect(midiToPitchName(70)).toBe('A#4');
  });

  it('initializes and plays metronome downbeat and alternate beats without throwing', () => {
    const engine = new SoundFontAudioEngine();
    expect(() => {
      engine.playMetronomeBeat(true, 1.0);
      engine.playMetronomeBeat(false, 0.7);
    }).not.toThrow();
  });
});
