import { describe, it, expect } from 'vitest';
import { FUNDAMENTALS_LESSONS } from './curriculumData';
import { SIGHT_READING_EXERCISES } from './sightReadingData';

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
});
