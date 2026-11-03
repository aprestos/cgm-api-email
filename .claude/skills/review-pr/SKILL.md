---
name: review-pr
description: Review a cgm-api-email pull request or the current branch before merging, using the email-reviewer agent and verifying its findings. Use when asked to review a PR, a branch, or "my changes".
argument-hint: "[PR number | branch | empty = current branch] [--post | --ci]"
---

# Review: $ARGUMENTS

## CI mode (`--ci`)

`.github/workflows/claude-review.yml` runs `/review-pr <n> --ci` on every pull request. In that mode:

- The PR is already checked out (its head merged into the base). Take the scope from `gh pr view <n> --json number,title,body,baseRefName,headRefName,files,url` and `gh pr diff <n>`, and review the files in place. No worktree, no checkout.
- This repo has no check workflow, so skip the checks and write `Checks: not run in CI` in the summary.
- Sibling repos are not checked out. Tell the reviewer it is running in CI: the review is read-only, it must not write to its memory, and it must not look in `../` sibling repos. For cross-repo impact, list the routes, fields or types that changed so their callers can be checked, and mark the impact "not verified in CI".
- Nobody reads the session output. The review exists only as what you publish (see **Publish**), so always publish.

1. **Scope.**
   - No argument: `git diff main...HEAD --stat` and `git log main..HEAD --oneline`. Mention uncommitted changes separately.
   - PR number: `gh pr view <n> --json number,title,body,baseRefName,headRefName,files,url` and `gh pr diff <n>`. If its head is not the current branch, review from the diff and `git show FETCH_HEAD:<path>` after `git fetch origin pull/<n>/head`, and skip the checks.
2. **Checks** on the current branch: `npm test` and `npm run typecheck`. A failure is a finding.
3. **Delegate** to the `email-reviewer` agent with the scope, intent (PR title and body, or commits), changed files and check results.
4. **Verify** every Critical and Should-fix finding against the code yourself. Drop or demote what you cannot confirm. Do not edit code.
5. **Report:**

```
**Verdict:** Approve | Approve with nits | Request changes — <one sentence>
**Checks:** tests ✅/❌ · types ✅/❌
### Critical
### Should fix
### Nits
### Questions
### Cross-repo impact (cgm-api-supabase senders)
```

## Publish (`--ci`, `--post`, or when Fábio asks)

Comments only. Never approve or request changes on GitHub.

1. **Avoid repeats.** Run `bash .claude/skills/review-pr/existing-comments.sh <n>` to list the inline comments Claude already left. Skip any finding already raised on the same lines.
2. **Inline comments:** one per verified Critical or Should-fix finding whose line is part of the diff (new side).
   - Body: `**Critical**` or `**Should fix**`, then the problem, why it matters, and the fix. When the fix replaces exactly the commented lines, include a ```` ```suggestion ```` block with the complete replacement. End every body with `<!-- claude-review -->`.
   - In CI, post with `mcp__github_inline_comment__create_inline_comment` (`path`, `line`, plus `startLine` for a range, `body`, `confirmed: true`).
   - Locally, write the body to a temp file and run `bash .claude/skills/review-pr/post-inline.sh <n> <path> <line> <body-file> [start-line]`.
   - Findings on lines outside the diff, Nits and Questions go in the summary only.
3. **Summary:** write the report in the shape above to a temp file and run `bash .claude/skills/review-pr/post-summary.sh <n> <file>`. It replaces Claude's previous summary on the PR rather than adding another, so the PR always shows one current review. Link each inline finding by `path:line`. When nothing was found, the summary is the verdict line and "No issues found."
