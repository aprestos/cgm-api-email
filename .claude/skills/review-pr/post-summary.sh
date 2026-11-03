#!/usr/bin/env bash
# Posts the Claude review summary on a pull request, or replaces the one it
# posted before, so a PR carries a single, current summary however many times
# it is reviewed.
#
# Usage: post-summary.sh <pr-number> <markdown-file>
set -euo pipefail

pr="$1"
file="$2"
repo="${GITHUB_REPOSITORY:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
marker='<!-- claude-review:summary -->'
body="$(cat "$file")"$'\n\n'"$marker"

existing="$(gh api "repos/$repo/issues/$pr/comments" --paginate \
  --jq ".[] | select(.body | contains(\"$marker\")) | .id" | tail -n 1)"

if [ -n "$existing" ]; then
  gh api -X PATCH "repos/$repo/issues/comments/$existing" -f body="$body" --jq .html_url
else
  gh api -X POST "repos/$repo/issues/$pr/comments" -f body="$body" --jq .html_url
fi
