/**
 * ExerciseGrader.ts - Automated Music Theory & LilyPond Semantic Evaluator
 * Compares compiled musical events against expected criteria and generates diagnostic hints.
 */

import { lilypondCompiler } from '../lilypond/LilyPondWasmCompiler';

export interface GradeResult {
  passed: boolean;
  score: number; // 0 - 100
  feedback: string;
  diagnostics: string[];
  detectedNotes: string[];
}

export class ExerciseGrader {
  /**
   * Evaluates student LilyPond code against expected target pitches and constraints.
   */
  public async gradeLilyPondChallenge(
    userCode: string,
    expectedPitches: string[],
    targetClef?: string
  ): Promise<GradeResult> {
    const diagnostics: string[] = [];

    // 1. Check syntax and compilation
    const compileResult = await lilypondCompiler.compile(userCode);
    if (!compileResult.ok) {
      return {
        passed: false,
        score: 0,
        feedback: "Compilation Error: Your LilyPond code has syntax errors. Check missing braces or commands.",
        diagnostics: compileResult.logs.filter(l => l.includes('error')),
        detectedNotes: []
      };
    }

    const detectedPitches = compileResult.midiNotes.map(n => n.pitch.toLowerCase());

    if (detectedPitches.length === 0) {
      return {
        passed: false,
        score: 0,
        feedback: "No notes detected in your score. Write the required note names inside \\relative c' { ... }",
        diagnostics: ["No musical pitch tokens were found."],
        detectedNotes: []
      };
    }

    // 2. Check Clef if specified
    if (targetClef) {
      if (targetClef === 'bass' && !userCode.includes('\\clef bass')) {
        diagnostics.push("Missing \\clef bass command.");
      } else if (targetClef === 'treble' && userCode.includes('\\clef bass')) {
        diagnostics.push("Score is set to bass clef, but treble clef was expected.");
      }
    }

    // 3. Compare Pitches Semantically
    const expectedNormalized = expectedPitches.map(p => p.toLowerCase());
    let matchCount = 0;
    const totalExpected = expectedNormalized.length;

    for (let i = 0; i < totalExpected; i++) {
      const exp = expectedNormalized[i];
      const got = detectedPitches[i];

      if (!got) {
        diagnostics.push(`Missing note at position ${i + 1}: Expected '${exp.toUpperCase()}'.`);
        continue;
      }

      // Check letter name match (ignoring octave if user forgot quotes)
      const expLetter = exp.replace(/\d+/, '');
      const gotLetter = got.replace(/\d+/, '');

      if (exp === got) {
        matchCount++;
      } else if (expLetter === gotLetter) {
        diagnostics.push(
          `Note ${i + 1}: Correct pitch class (${gotLetter.toUpperCase()}), but in wrong octave! (Expected ${exp.toUpperCase()}, received ${got.toUpperCase()}). Check apostrophe ' or comma ,.`
        );
      } else {
        diagnostics.push(
          `Note ${i + 1} mismatch: Expected '${exp.toUpperCase()}', but received '${got.toUpperCase()}'.`
        );
      }
    }

    if (detectedPitches.length > totalExpected) {
      diagnostics.push(`Found ${detectedPitches.length - totalExpected} extra unexpected note(s).`);
    }

    const accuracy = Math.round((matchCount / Math.max(totalExpected, detectedPitches.length)) * 100);
    const passed = accuracy >= 90 && diagnostics.length === 0;

    return {
      passed,
      score: accuracy,
      feedback: passed
        ? "Excellent! Your LilyPond engraving matches the expected musical score perfectly! 🎵"
        : "Not quite there yet. Check the diagnostic hints below to refine your code.",
      diagnostics,
      detectedNotes: detectedPitches
    };
  }

  /**
   * Evaluates a multiple-choice Theory Quiz question.
   */
  public gradeTheoryQuiz(selectedIdx: number, correctIdx: number, explanation: string): GradeResult {
    const passed = selectedIdx === correctIdx;
    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed ? "Correct! Well done." : "Incorrect. Review the theory explanation.",
      diagnostics: [explanation],
      detectedNotes: []
    };
  }

  /**
   * Evaluates user rhythm tapping precision against beat intervals.
   */
  public gradeRhythmTap(
    userTapTimesMs: number[],
    targetBeatsMs: number[]
  ): GradeResult {
    if (userTapTimesMs.length === 0) {
      return {
        passed: false,
        score: 0,
        feedback: "No taps recorded. Press the spacebar in time with the metronome pulse.",
        diagnostics: [],
        detectedNotes: []
      };
    }

    let accurateTaps = 0;
    const diagnostics: string[] = [];

    targetBeatsMs.forEach((target, idx) => {
      const tap = userTapTimesMs[idx];
      if (tap === undefined) {
        diagnostics.push(`Missed beat ${idx + 1}`);
        return;
      }
      const delta = Math.abs(tap - target);
      if (delta <= 60) {
        accurateTaps++; // Perfect
      } else if (delta <= 130) {
        accurateTaps += 0.8; // Good
      } else {
        diagnostics.push(`Beat ${idx + 1} was off by ${Math.round(delta)}ms`);
      }
    });

    const score = Math.round((accurateTaps / targetBeatsMs.length) * 100);
    const passed = score >= 80;

    return {
      passed,
      score,
      feedback: passed
        ? `Great timing! Rhythm accuracy: ${score}% 🥁`
        : `Rhythm accuracy: ${score}%. Try to anticipate the pulse of the beat.`,
      diagnostics,
      detectedNotes: []
    };
  }

  /**
   * Compares a student's LilyPond reconstruction against a target score.
   */
  public async gradeReconstruction(
    userCode: string,
    targetCode: string
  ): Promise<GradeResult> {
    const diagnostics: string[] = [];
    const [userRes, targetRes] = await Promise.all([
      lilypondCompiler.compile(userCode),
      lilypondCompiler.compile(targetCode),
    ]);

    if (!userRes.ok) {
      return {
        passed: false,
        score: 0,
        feedback: "Syntax Error: Your reconstructed code failed to compile.",
        diagnostics: userRes.logs.filter((l) => l.includes('error')),
        detectedNotes: [],
      };
    }

    const userNotes = userRes.midiNotes;
    const targetNotes = targetRes.midiNotes;
    const detectedNotes = userNotes.map((n) => n.pitch);

    if (userNotes.length === 0) {
      return {
        passed: false,
        score: 0,
        feedback: "No notes detected. Write LilyPond notes to match the target score.",
        diagnostics: ["The score contains no notes."],
        detectedNotes: [],
      };
    }

    if (userNotes.length !== targetNotes.length) {
      diagnostics.push(
        `Note count difference: Expected ${targetNotes.length} notes, but found ${userNotes.length}.`
      );
    }

    let pitchMatches = 0;
    let durationMatches = 0;
    const checkCount = Math.max(userNotes.length, targetNotes.length);

    for (let i = 0; i < checkCount; i++) {
      const targetNote = targetNotes[i];
      const userNote = userNotes[i];

      if (!targetNote) {
        diagnostics.push(`Note ${i + 1}: Extra unexpected note '${userNote.pitch}'.`);
        continue;
      }
      if (!userNote) {
        diagnostics.push(`Note ${i + 1}: Missing note (expected '${targetNote.pitch}').`);
        continue;
      }

      if (userNote.pitch.toLowerCase() === targetNote.pitch.toLowerCase()) {
        pitchMatches++;
      } else {
        diagnostics.push(
          `Note ${i + 1}: Expected pitch '${targetNote.pitch}', but got '${userNote.pitch}'.`
        );
      }

      if (userNote.duration === targetNote.duration) {
        durationMatches++;
      } else {
        diagnostics.push(
          `Note ${i + 1}: Expected duration '${targetNote.duration}', but got '${userNote.duration}'.`
        );
      }
    }

    if (targetCode.includes('\\clef bass') && !userCode.includes('\\clef bass')) {
      diagnostics.push("Target score uses \\clef bass, but \\clef bass was not specified in your code.");
    }
    if (targetCode.includes('\\time') && !userCode.includes('\\time')) {
      diagnostics.push("Missing \\time signature command matching the target score.");
    }
    if (targetCode.includes('\\key') && !userCode.includes('\\key')) {
      diagnostics.push("Missing \\key signature command matching the target score.");
    }

    const totalPoints = targetNotes.length * 2;
    const earnedPoints = pitchMatches + durationMatches;
    const score = Math.max(0, Math.round((earnedPoints / Math.max(1, totalPoints)) * 100));
    const passed = diagnostics.length === 0 && score === 100;

    return {
      passed,
      score,
      feedback: passed
        ? "Flawless Reconstruction! Your LilyPond code perfectly replicates the target score. 🏆"
        : `Reconstruction differs from target score (${score}% match). Check diagnostics below.`,
      diagnostics,
      detectedNotes,
    };
  }
}

export const exerciseGrader = new ExerciseGrader();
