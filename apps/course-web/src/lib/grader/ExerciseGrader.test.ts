import { describe, it, expect } from 'vitest';
import { exerciseGrader } from './ExerciseGrader';

describe('ExerciseGrader', () => {
  it('passes a correct student submission', async () => {
    const studentCode = `\\version "2.24.0"
\\relative c' {
  c4 d e f
}`;
    const result = await exerciseGrader.gradeLilyPondChallenge(studentCode, ['c4', 'd4', 'e4', 'f4']);

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.diagnostics.length).toBe(0);
  });

  it('fails with diagnostic hint when note pitch is wrong', async () => {
    const studentCode = `\\version "2.24.0"
\\relative c' {
  c4 d g f
}`;
    const result = await exerciseGrader.gradeLilyPondChallenge(studentCode, ['c4', 'd4', 'e4', 'f4']);

    expect(result.passed).toBe(false);
    expect(result.diagnostics.length).toBeGreaterThan(0);
    expect(result.diagnostics[0]).toContain("Expected 'E4'");
  });

  it('grades multiple-choice theory quizzes', () => {
    const result = exerciseGrader.gradeTheoryQuiz(0, 0, 'Correct explanation');
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);

    const failResult = exerciseGrader.gradeTheoryQuiz(1, 0, 'Explanation');
    expect(failResult.passed).toBe(false);
    expect(failResult.score).toBe(0);
  });

  it('evaluates rhythm tapping accuracy', () => {
    // Exact taps
    const result = exerciseGrader.gradeRhythmTap([500, 1000, 1500, 2000], [500, 1000, 1500, 2000]);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);

    // Completely missed taps
    const emptyResult = exerciseGrader.gradeRhythmTap([], [500, 1000]);
    expect(emptyResult.passed).toBe(false);
  });

  it('grades score reconstruction accurately against target code', async () => {
    const targetCode = `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 d e f
}`;
    const correctUserCode = `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 d e f
}`;
    const result = await exerciseGrader.gradeReconstruction(correctUserCode, targetCode);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);

    const wrongUserCode = `\\version "2.24.0"
\\relative c' {
  \\clef treble
  c4 d g2
}`;
    const failResult = await exerciseGrader.gradeReconstruction(wrongUserCode, targetCode);
    expect(failResult.passed).toBe(false);
    expect(failResult.diagnostics.length).toBeGreaterThan(0);
  });
});
