#!/usr/bin/env bash
# Lists the inline comments Claude already left on a pull request, one per
# line as "path:line  first line of the comment", so a re-review after a new
# push does not raise the same finding twice.
#
# Usage: existing-comments.sh <pr-number>
set -euo pipefail

pr="$1"
repo="${GITHUB_REPOSITORY:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"

gh api "repos/$repo/pulls/$pr/comments" --paginate --jq '
  .[]
  | select(.body | contains("<!-- claude-review -->"))
  | "\(.path):\(.line // .original_line)  \(.body | split("\n")[0])"'
