# Git Commit & Update Policy

Always commit and push code in **reasonable, functional, and atomic chunks** rather than monolithic single commits.

## Commit Guidelines

1. **Logical Separation**: Separate updates into distinct functional categories:
   - `build` / `chore`: Dependencies, config (`package.json`, `.gitignore`, tooling).
   - `content`: Markdown chapters, glossary, theory texts, or repertoire scores.
   - `graph`: Knowledge graph schema, data builders, and CLI tools.
   - `feat(web)`: Frontend components, editor integration, audio engine, or UI features.
   - `test`: Unit tests, integration suites, and verification scripts.
   - `docs`: Documentation, guides, and walkthroughs.

2. **Verify Before Committing**: Run relevant test suites (`npm test`, `python scripts/test_knowledge_graph.py`, `npm run build`) before making a commit to ensure zero broken builds.

3. **Atomic & Reversible**: Each commit should be self-contained, compile cleanly on its own, and provide a clear, descriptive conventional commit message.
