import { describe, it, expect } from 'vitest';
import { lilypondCompiler } from './LilyPondWasmCompiler';
import { renderClefSvg, renderAccidentalSvg, SMUFL_GLYPHS } from './MusicGlyphs';

describe('LilyPondWasmCompiler & MusicGlyphs', () => {
  it('renders authentic SMuFL clef glyphs without visual glitches', () => {
    const treble = renderClefSvg('treble', 50, 80, 10);
    expect(treble.svg).toContain('class="clef-glyph"');
    expect(treble.svg).toContain(SMUFL_GLYPHS.gClef);
    expect(treble.width).toBeGreaterThan(0);

    const bass = renderClefSvg('bass', 50, 80, 10);
    expect(bass.svg).toContain('class="clef-glyph"');
    expect(bass.svg).toContain(SMUFL_GLYPHS.fClef);
    expect(bass.width).toBeGreaterThan(0);

    const sharp = renderAccidentalSvg('sharp', 10, 20);
    expect(sharp).toContain('class="accidental-glyph"');
    expect(sharp).toContain(SMUFL_GLYPHS.sharp);
  });

  it('compiles a simple relative LilyPond score to SVG with authentic treble clef', async () => {
    const src = `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 d e f
}`;
    const result = await lilypondCompiler.compile(src);

    expect(result.ok).toBe(true);
    expect(result.pages.length).toBeGreaterThan(0);
    expect(result.pages[0]).toContain('<svg');
    expect(result.pages[0]).toContain('class="clef-glyph"');
    expect(result.pages[0]).toContain(SMUFL_GLYPHS.gClef);
    expect(result.midiNotes.length).toBe(4);
    expect(result.midiNotes[0].pitch).toBe('C4');
  });

  it('handles bass clef and accidentals with SMuFL vector glyphs', async () => {
    const src = `\\version "2.24.0"
\\relative c {
  \\clef bass
  c4 cis d ees
}`;
    const result = await lilypondCompiler.compile(src);

    expect(result.ok).toBe(true);
    expect(result.pages[0]).toContain('<svg');
    expect(result.pages[0]).toContain('class="clef-glyph"');
    expect(result.pages[0]).toContain('class="accidental-glyph"');
    expect(result.midiNotes.length).toBe(4);
    expect(result.midiNotes[1].pitch).toBe('CIS4');
    expect(result.midiNotes[3].pitch).toBe('EES4');
  });
});
