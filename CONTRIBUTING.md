# Contributing & Commit Guidelines

To maintain clean project history and ease code reviews, all contributors and coding agents must follow these guidelines:

## Git Commit Policy

- **Commit in Reasonable Functional Chunks**: Do not bundle disparate features, data pipeline changes, content extractions, and UI edits into a single mega-commit.
- **Conventional Commits**: Format commit messages clearly using conventional prefixes:
  - `feat`: New user-facing feature or pedagogical component
  - `content`: Open Music Theory lessons, glossary, or LilyPond reference guides
  - `graph`: Knowledge Graph schema, database, or query tools
  - `fix`: Bug fix in parsing, grading, or playback
  - `test`: Automated unit or integration tests
  - `chore`: Tooling, scripts, configuration, or dependencies
- **Pre-Commit Verification**: Always run test suites before committing:
  ```bash
  # Python Knowledge Graph integrity tests
  python scripts/test_knowledge_graph.py

  # Frontend Vitest unit tests & production build
  cd apps/course-web
  npm test
  npm run build
  ```
