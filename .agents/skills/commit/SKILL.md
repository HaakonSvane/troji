---
name: commit
description: Commit changes with semantic messages that describe the outcome of the work.
---

After each logical chunk of work concludes, commit with a semantic commit message that describes the **outcome** rather than implementation details.

If it is not clear from context what the change is about, use the diff to identify the outcome and write a message that focuses on the **what** and **why** of the change, not the **how**.

- Use conventional commit format: `<type>(<scope>): <message>`
  - `feat`: New user-facing capability (e.g., `feat(auth): add role-based access control`)
  - `fix`: Fixes a defect in existing behavior (e.g., `fix(registration): prevent empty names in database`)
  - `docs`: Updates to documentation or instruction files (e.g., `docs(agents): split instructions into nested structure`)
  - `refactor`: Internal restructuring with no behavior change (e.g., `refactor(repository): consolidate validation logic`)
  - `test`: Adds or updates tests (e.g., `test(graphql): add schema error mapping tests`)

- Focus the message on **what changed and why**, not on how the change was made:
  - ✓ `fix(errors): map GraphQL exceptions to proper error codes` (outcome)
  - ✗ `fix(errors): added IErrorFilter interface to Program.cs` (implementation)
  - ✓ `feat(registration): validate names before database persistence` (outcome)
  - ✗ `feat(registration): trim() and check for empty string` (how it works)
