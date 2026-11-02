/**
 * LilyPondWasmCompiler.ts - Official WebAssembly In-Browser LilyPond Engraving & Compilation
 * Powered by @sightread/lilypond-wasm (GNU LilyPond v2.26 WebAssembly) and @tonejs/midi.
 * Generates vector SVG scores with authentic Emmentaler glyphs and Type-1 binary MIDI files.
 */

import { createReusableCompiler, type ReusableCompiler, LilyPondCompileError } from '@sightread/lilypond-wasm';
import toneMidi from '@tonejs/midi';
const { Midi } = toneMidi;

export interface MidiNote {
  pitch: string;
  midi: number;
  duration: number;
  dots: number;
  durationBeats: number;
  timeBeats: number;
}

export interface CompileResult {
  ok: boolean;
  pages: string[];
  logs: string[];
  errors: number;
  warnings: number;
  midiNotes: MidiNote[];
  midiBytes?: Uint8Array;
}

export class LilyPondWasmCompiler {
  private compiler: ReusableCompiler | null = null;
  private isPreloading: boolean = false;
  private isReady: boolean = false;

  constructor() {
    // Reusable compiler is lazily initialized or preloaded
  }

  private getCompiler(): ReusableCompiler {
    if (!this.compiler) {
      this.compiler = createReusableCompiler();
      this.isReady = true;
    }
    return this.compiler;
  }

  /**
   * Preload the ~30MB WebAssembly LilyPond binary and unpacked runtime data.
   */
  public async preload(onProgress?: (loaded: number, total: number) => void): Promise<void> {
    if (this.isPreloading || this.isReady) return;
    this.isPreloading = true;
    try {
      const comp = this.getCompiler();
      await comp.preload({
        onProgress: ({ loadedBytes, totalBytes }) => {
          onProgress?.(loadedBytes, totalBytes);
        },
      });
      this.isReady = true;
    } finally {
      this.isPreloading = false;
    }
  }

  /**
   * Prepares arbitrary student or repertoire LilyPond code so that GNU LilyPond
   * outputs BOTH the vector SVG pages and the binary MIDI stream in a single compilation pass.
   */
  /**
   * Prepares user input code by ensuring version, point-and-click, and wrapping
   * inside a score block with layout (SVG) and midi outputs.
   * Returns the prepared code and the line number offset introduced before user code.
   */
  private prepareCode(src: string): { code: string; lineOffset: number } {
    let prepared = src.trim();

    // Ensure point-and-click links for interactive clickable note navigation
    if (!prepared.includes('point-and-click')) {
      prepared = `#(ly:set-option 'point-and-click #t)\n${prepared}`;
    }

    // Ensure version statement
    if (!prepared.includes('\\version')) {
      prepared = `\\version "2.26.0"\n${prepared}`;
    }

    // If score has explicit \midi block
    if (prepared.includes('\\midi')) {
      if (!prepared.includes('\\layout')) {
        prepared = prepared.replace(/\\midi\s*\{[^}]*\}/, '\\layout { }\n\\midi { }');
      }
      return { code: prepared, lineOffset: 0 };
    }

    // If score block exists but lacks \midi, insert \midi before its last closing brace
    if (prepared.includes('\\score')) {
      const lastBrace = prepared.lastIndexOf('}');
      if (lastBrace !== -1) {
        return {
          code: prepared.slice(0, lastBrace) + '\n  \\layout { }\n  \\midi { }\n}',
          lineOffset: 0,
        };
      }
      return { code: prepared + '\n\\score { \\layout { } \\midi { } }', lineOffset: 0 };
    }

    // Extract \version and \header if present so they sit at top-level outside \score
    let version = '\\version "2.26.0"';
    const verMatch = prepared.match(/\\version\s*"[^"]*"/);
    if (verMatch) version = verMatch[0];

    let header = '';
    const headMatch = prepared.match(/\\header\s*\{[^}]*\}/s);
    if (headMatch) header = headMatch[0];

    const pointAndClick = "#(ly:set-option 'point-and-click #t)";

    const music = prepared
      .replace(/\\version\s*"[^"]*"/, '')
      .replace(/\\header\s*\{[^}]*\}/s, '')
      .replace(/#\(ly:set-option\s+'point-and-click\s+#t\)/, '')
      .trim();

    const prefix = `${version}\n${header ? header + '\n' : ''}${pointAndClick}\n\\score {\n  {\n`;
    const lineOffset = prefix.split('\n').length - 1;

    // Wrap music in an authentic LilyPond score context with both layout (SVG) and midi
    return {
      code: `${prefix}${music}\n  }\n  \\layout { }\n  \\midi { }\n}`,
      lineOffset,
    };
  }

  /**
   * Converts duration in quarter beats to nominal note value and dot count.
   */
  private beatsToDuration(durBeats: number): { duration: number; dots: number } {
    const table: [number, number, number][] = [
      [1, 0, 4.0],
      [1, 1, 6.0],
      [2, 0, 2.0],
      [2, 1, 3.0],
      [4, 0, 1.0],
      [4, 1, 1.5],
      [8, 0, 0.5],
      [8, 1, 0.75],
      [16, 0, 0.25],
      [16, 1, 0.375],
      [32, 0, 0.125],
    ];

    for (const [dur, dots, beats] of table) {
      if (Math.abs(durBeats - beats) < 0.05) {
        return { duration: dur, dots };
      }
    }

    const nominal = Math.max(1, Math.round(4 / durBeats));
    return { duration: nominal, dots: 0 };
  }

  /**
   * Formats a scientific note name from @tonejs/midi into a LilyPond pitch format (e.g. C4, CIS4, FIS4, EES4).
   */
  private formatPitch(noteName: string, midiNum: number): string {
    const letter = noteName.replace(/[^A-Ga-g]/g, '').toUpperCase();
    const oct = Math.floor(midiNum / 12) - 1;
    if (noteName.includes('#')) return `${letter}IS${oct}`;
    if (noteName.includes('b')) return `${letter}ES${oct}`;
    return `${letter}${oct}`;
  }

  /**
   * Compiles LilyPond source code into authentic vector SVG pages and true MIDI notes
   * using the official WebAssembly GNU LilyPond engine.
   */
  public async compile(src: string): Promise<CompileResult> {
    const logs: string[] = [];
    const compiler = this.getCompiler();
    const { code: prepared, lineOffset } = this.prepareCode(src);

    try {
      const result = await compiler.compile(prepared, { format: 'svg' });
      logs.push(...result.logs);

      // Collect authentic binary MIDI notes
      const midiNotes: MidiNote[] = [];
      let midiBytes: Uint8Array | undefined;

      for (const [name, bytes] of Object.entries(result.files)) {
        if (name.endsWith('.midi') || name.endsWith('.mid')) {
          midiBytes = bytes;
          break;
        }
      }

      if (midiBytes && midiBytes.length > 0) {
        const parsedMidi = new Midi(midiBytes);
        const bpm = parsedMidi.header.tempos[0]?.bpm ?? 80;
        const secPerBeat = 60 / bpm;

        for (const track of parsedMidi.tracks) {
          for (const note of track.notes) {
            const durBeats = note.duration / secPerBeat;
            const timeBeats = note.time / secPerBeat;
            const pitch = this.formatPitch(note.name, note.midi);
            const { duration, dots } = this.beatsToDuration(durBeats);

            midiNotes.push({
              pitch,
              midi: note.midi,
              duration,
              dots,
              durationBeats: durBeats,
              timeBeats: timeBeats,
            });
          }
        }

        // Sort by start time, then pitch
        midiNotes.sort((a, b) => a.timeBeats - b.timeBeats || a.midi - b.midi);
      }

      // Collect vector SVG page(s)
      const pages: string[] = [];
      const svgEntries = Object.entries(result.files).filter(([name]) => name.endsWith('.svg'));
      // Sort SVG pages by name (score.svg, score-page1.svg, etc.)
      svgEntries.sort(([a], [b]) => a.localeCompare(b));

      let noteIndex = 0;
      for (const [, bytes] of svgEntries) {
        let svgMarkup = new TextDecoder().decode(bytes);
        // Ensure responsive width & height for container rendering
        svgMarkup = svgMarkup.replace(
          /<svg([^>]*)width="[^"]*"([^>]*)height="[^"]*"/,
          '<svg$1width="100%"$2height="auto" class="lilypond-score"'
        );

        // Adjust point-and-click line numbers to correspond with original user code
        if (lineOffset > 0) {
          svgMarkup = svgMarkup.replace(
            /(?:xlink:)?href="textedit:\/\/\/input\/score\.ly:(\d+):(\d+):(\d+)"/g,
            (_m, line, c1, c2) => {
              const origLine = Math.max(1, parseInt(line, 10) - lineOffset);
              return `xlink:href="textedit:///input/score.ly:${origLine}:${c1}:${c2}"`;
            }
          );
        }

        // Enrich clickable noteheads with interactive classes and MIDI data
        svgMarkup = svgMarkup.replace(
          /(<a\s+[^>]*xlink:href="textedit:[^"]*"[^>]*>)(\s*<g[^>]*>\s*<path[^>]*d="M0\s+-[0-9]+c[\s\S]*?<\/a>)/g,
          (_match, openTag: string, rest: string) => {
            const curNote = midiNotes[noteIndex++];
            const midiAttr = curNote ? ` data-midi="${curNote.midi}" data-pitch="${curNote.pitch}"` : '';
            const updatedOpen = openTag.replace(
              /<a\s+style="color:inherit;"/,
              `<a style="color:inherit;" class="interactive-note cursor-pointer"${midiAttr}`
            );
            return updatedOpen + rest;
          }
        );

        pages.push(svgMarkup);
      }

      logs.push(`LilyPond Wasm: Compiled ${pages.length} SVG page(s) and ${midiNotes.length} MIDI notes.`);

      return {
        ok: true,
        pages,
        logs,
        errors: 0,
        warnings: 0,
        midiNotes,
        midiBytes,
      };
    } catch (err: unknown) {
      if (err instanceof LilyPondCompileError) {
        return {
          ok: false,
          pages: [],
          logs: [...err.logs],
          errors: 1,
          warnings: 0,
          midiNotes: [],
        };
      }
      const message = String((err as any)?.message || err);
      return {
        ok: false,
        pages: [],
        logs: [message],
        errors: 1,
        warnings: 0,
        midiNotes: [],
      };
    }
  }
}

export const lilypondCompiler = new LilyPondWasmCompiler();
