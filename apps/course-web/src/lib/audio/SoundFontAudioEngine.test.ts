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

  it('manages sound effects mute toggle and plays UI sounds without throwing', () => {
    const engine = new SoundFontAudioEngine();
    expect(engine.getSfxMuted()).toBe(false);

    expect(engine.toggleSfx()).toBe(true);
    expect(engine.getSfxMuted()).toBe(true);

    engine.setSfxMuted(false);
    expect(engine.getSfxMuted()).toBe(false);

    expect(() => {
      engine.playUiClick();
      engine.playUiSelect();
      engine.playSuccessChime();
      engine.playErrorBuzz();
      engine.playCompletionFanfare();
    }).not.toThrow();
  });

  it('schedules score playback with rhythmic durations and provides cancellation (Issue #14)', () => {
    vi.useFakeTimers();
    const engine = new SoundFontAudioEngine();
    const playNoteSpy = vi.spyOn(engine, 'playNote').mockImplementation(() => {});

    const notes = [
      { midi: 60, timeBeats: 0, durationBeats: 1.5, duration: 4, dots: 1 }, // fis4.
      { midi: 62, timeBeats: 1.5, durationBeats: 0.5, duration: 8, dots: 0 }, // e8
      { midi: 64, timeBeats: 2.0, durationBeats: 2.0, duration: 2, dots: 0 }, // e2
    ];

    const onComplete = vi.fn();
    const stopPlayback = engine.playScore(notes, {
      bpm: 60, // 1 beat = 1000ms
      onComplete,
    });

    // At t = 0ms: First note plays (timeBeats = 0)
    vi.advanceTimersByTime(0);
    expect(playNoteSpy).toHaveBeenCalledTimes(1);
    expect(playNoteSpy).toHaveBeenLastCalledWith(60, 1.5 * 0.95, 'piano', 0.8);

    // Advance 1000ms: Still between beat 1 and 1.5
    vi.advanceTimersByTime(1000);
    expect(playNoteSpy).toHaveBeenCalledTimes(1);

    // Advance to 1500ms (beat 1.5): Second note plays
    vi.advanceTimersByTime(500);
    expect(playNoteSpy).toHaveBeenCalledTimes(2);
    expect(playNoteSpy).toHaveBeenLastCalledWith(62, 0.5 * 0.95, 'piano', 0.8);

    // Advance to 2000ms (beat 2.0): Third note plays
    vi.advanceTimersByTime(500);
    expect(playNoteSpy).toHaveBeenCalledTimes(3);
    expect(playNoteSpy).toHaveBeenLastCalledWith(64, 2.0 * 0.95, 'piano', 0.8);

    // Advance to completion (4000ms + 100ms)
    vi.advanceTimersByTime(2200);
    expect(onComplete).toHaveBeenCalledTimes(1);

    // Test cancellation
    const cancelSpy = vi.fn();
    const stop = engine.playScore(notes, { bpm: 60, onComplete: cancelSpy });
    stop();
    vi.advanceTimersByTime(5000);
    expect(cancelSpy).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
