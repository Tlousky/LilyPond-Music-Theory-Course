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

    // Verify Issue #9: Proper clef scaling and non-overlapping time signature
    expect(result.pages[0]).toMatch(/scale\(0\.019\d*,\s*-0\.019\d*\)/);
    expect(result.pages[0]).toContain('text-anchor="middle"');

    // Verify Issue #10: Interactive note attributes for click playback
    expect(result.pages[0]).toContain('data-midi="60"');
    expect(result.pages[0]).toContain('data-pitch="C4"');
    expect(result.pages[0]).toContain('class="interactive-note"');
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
    expect(result.midiNotes[0].pitch).toBe('C3');
    expect(result.midiNotes[1].pitch).toBe('CIS3');
    expect(result.midiNotes[3].pitch).toBe('EES3');
  });

  it('compiles snippet from issue 12 with full width and responsive attributes', async () => {
    const src = `\\version "2.24.0"
\\relative c' {
  c4 d e f
}`;
    const result = await lilypondCompiler.compile(src);
    expect(result.ok).toBe(true);
    expect(result.pages.length).toBe(1);
    expect(result.midiNotes.length).toBe(4);
    expect(result.pages[0]).toContain('width="100%"');
    expect(result.pages[0]).toContain('height="auto"');
  });

  // Issue #14: Note lengths, dotted notes, rests, chords, and rhythmic timing
  it('accurately computes note lengths and start times for dotted notes and rests (Issue #14)', async () => {
    const src = `\\version "2.24.0"
\\relative c' {
  fis4. e8 e2 |
  r4 c1
}`;
    const result = await lilypondCompiler.compile(src);
    expect(result.ok).toBe(true);
    expect(result.midiNotes.length).toBe(4);

    // Note 0: fis4. (1.5 beats, start at 0)
    expect(result.midiNotes[0].pitch).toBe('FIS4');
    expect(result.midiNotes[0].duration).toBe(4);
    expect(result.midiNotes[0].dots).toBe(1);
    expect(result.midiNotes[0].durationBeats).toBe(1.5);
    expect(result.midiNotes[0].timeBeats).toBe(0);

    // Note 1: e8 (0.5 beats, start at 1.5)
    expect(result.midiNotes[1].pitch).toBe('E4');
    expect(result.midiNotes[1].duration).toBe(8);
    expect(result.midiNotes[1].dots).toBe(0);
    expect(result.midiNotes[1].durationBeats).toBe(0.5);
    expect(result.midiNotes[1].timeBeats).toBe(1.5);

    // Note 2: e2 (2 beats, start at 2.0)
    expect(result.midiNotes[2].pitch).toBe('E4');
    expect(result.midiNotes[2].duration).toBe(2);
    expect(result.midiNotes[2].dots).toBe(0);
    expect(result.midiNotes[2].durationBeats).toBe(2);
    expect(result.midiNotes[2].timeBeats).toBe(2.0);

    // Rest r4 advances from 4.0 to 5.0
    // Note 3: c1 (4 beats, start at 5.0)
    expect(result.midiNotes[3].pitch).toBe('C4');
    expect(result.midiNotes[3].duration).toBe(1);
    expect(result.midiNotes[3].durationBeats).toBe(4);
    expect(result.midiNotes[3].timeBeats).toBe(5.0);

    // Augmentation dot rendered in SVG
    expect(result.pages[0]).toContain('class="note-dot"');
  });

  it('accurately parses chords with simultaneous start times (Issue #14)', async () => {
    const src = `\\version "2.24.0"
\\relative c' {
  <c e g>2. <c f a>4
}`;
    const result = await lilypondCompiler.compile(src);
    expect(result.ok).toBe(true);
    expect(result.midiNotes.length).toBe(6); // 3 notes in chord 1, 3 notes in chord 2

    // All notes in first chord start at timeBeats = 0 and last 3 beats (dotted half)
    expect(result.midiNotes[0].pitch).toBe('C4');
    expect(result.midiNotes[0].timeBeats).toBe(0);
    expect(result.midiNotes[0].durationBeats).toBe(3);

    expect(result.midiNotes[1].pitch).toBe('E4');
    expect(result.midiNotes[1].timeBeats).toBe(0);
    expect(result.midiNotes[1].durationBeats).toBe(3);

    expect(result.midiNotes[2].pitch).toBe('G4');
    expect(result.midiNotes[2].timeBeats).toBe(0);
    expect(result.midiNotes[2].durationBeats).toBe(3);

    // All notes in second chord start at timeBeats = 3 and last 1 beat (quarter)
    expect(result.midiNotes[3].pitch).toBe('C4');
    expect(result.midiNotes[3].timeBeats).toBe(3);
    expect(result.midiNotes[3].durationBeats).toBe(1);

    expect(result.midiNotes[4].pitch).toBe('F4');
    expect(result.midiNotes[4].timeBeats).toBe(3);
    expect(result.midiNotes[4].durationBeats).toBe(1);

    expect(result.midiNotes[5].pitch).toBe('A4');
    expect(result.midiNotes[5].timeBeats).toBe(3);
    expect(result.midiNotes[5].durationBeats).toBe(1);
  });

  it('parses multi-staff scores with independent parallel timelines (Issue #14)', async () => {
    const src = `\\version "2.24.0"
\\new PianoStaff <<
  \\new Staff {
    \\clef treble
    \\relative c'' {
      d4 g,8 a b c |
    }
  }
  \\new Staff {
    \\clef bass
    \\relative c' {
      <g b d>2. |
    }
  }
>>`;
    const result = await lilypondCompiler.compile(src);
    expect(result.ok).toBe(true);

    // Upper treble melody: 6 notes starting at beat 0
    expect(result.midiNotes[0].pitch).toBe('D5');
    expect(result.midiNotes[0].timeBeats).toBe(0);
    expect(result.midiNotes[0].durationBeats).toBe(1);

    expect(result.midiNotes[1].pitch).toBe('G4');
    expect(result.midiNotes[1].timeBeats).toBe(1);
    expect(result.midiNotes[1].durationBeats).toBe(0.5);

    // Lower bass accompaniment: 3 chord notes starting at beat 0
    const bassG = result.midiNotes.find(n => n.pitch === 'G3');
    expect(bassG).toBeDefined();
    expect(bassG?.timeBeats).toBe(0);
    expect(bassG?.durationBeats).toBe(3);
  });
});
