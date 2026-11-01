import { describe, it, expect } from 'vitest';
import { FUNDAMENTALS_LESSONS } from './curriculumData';
import { SIGHT_READING_EXERCISES } from './sightReadingData';
import { lilypondCompiler } from '../lib/lilypond/LilyPondWasmCompiler';

describe('Curriculum & Exercise Hints Verification (Issue #11)', () => {
  it('ensures no coding_challenge initial_code contains comment giveaways', () => {
    FUNDAMENTALS_LESSONS.forEach((lesson) => {
      const code = lesson.coding_challenge.initial_code;
      // Comments shouldn't give away exact note sequences like "c4 d e f" or "fis4"
      const commentLines = code
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('%'));

      commentLines.forEach((comment) => {
        expect(comment).not.toMatch(/%\s*(Type|Write|Add.*:)\s*[a-g]['|,]*[0-9]/i);
      });
    });
  });

  it('ensures no reconstruction scaffoldCode contains verbatim comment solutions', () => {
    FUNDAMENTALS_LESSONS.forEach((lesson) => {
      if (lesson.reconstruction) {
        const code = lesson.reconstruction.scaffoldCode;
        const commentLines = code
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.startsWith('%'));

        commentLines.forEach((comment) => {
          expect(comment).not.toMatch(/%\s*(Type|Write|Add.*:)\s*[a-g]['|,]*[0-9]/i);
        });
      }
    });

    SIGHT_READING_EXERCISES.forEach((ex) => {
      const code = ex.scaffoldCode;
      const commentLines = code
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('%'));

      commentLines.forEach((comment) => {
        expect(comment).not.toMatch(/%\s*(Type|Write|Add.*:)\s*[a-g]['|,]*[0-9]/i);
      });
    });
  });

  it('ensures all lesson capstone solution scores compile to valid SVG reference scores (Issue #13)', async () => {
    for (const lesson of FUNDAMENTALS_LESSONS) {
      const targetCode = lesson.capstone?.solutionCode || lesson.coding_challenge.solution_code;
      expect(targetCode).toBeDefined();
      const res = await lilypondCompiler.compile(targetCode);
      expect(res.ok).toBe(true);
      expect(res.pages.length).toBeGreaterThan(0);
      expect(res.pages[0]).toContain('<svg');
      expect(res.pages[0]).toContain('class="lilypond-score"');
    }
  });
});
