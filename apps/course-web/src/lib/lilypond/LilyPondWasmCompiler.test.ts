import { describe, it, expect } from 'vitest';
import { lilypondCompiler } from './LilyPondWasmCompiler';

describe('LilyPondWasmCompiler', () => {
  it('compiles a simple relative LilyPond score to SVG and MIDI', async () => {
    const src = `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 d e f
}`;
    const result = await lilypondCompiler.compile(src);

    expect(result.ok).toBe(true);
    expect(result.pages.length).toBeGreaterThan(0);
    expect(result.pages[0]).toContain('<svg');
    expect(result.pages[0]).toContain('class="lilypond-score"');
    expect(result.midiNotes.length).toBe(4);
    expect(result.midiNotes[0].pitch).toBe('C4');
    expect(result.midiNotes[1].pitch).toBe('D4');
    expect(result.midiNotes[2].pitch).toBe('E4');
    expect(result.midiNotes[3].pitch).toBe('F4');
  });

  it('handles bass clef and accidentals', async () => {
    const src = `\\version "2.24.0"
\\relative c {
  \\clef bass
  c4 cis d ees
}`;
    const result = await lilypondCompiler.compile(src);

    expect(result.ok).toBe(true);
    expect(result.pages[0]).toContain('<svg');
    expect(result.midiNotes.length).toBe(4);
    expect(result.midiNotes[1].pitch).toBe('CIS4');
    expect(result.midiNotes[3].pitch).toBe('EES4');
  });
});
