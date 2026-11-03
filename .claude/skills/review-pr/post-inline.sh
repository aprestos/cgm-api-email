#!/usr/bin/env bash
# Posts one inline review comment on a pull request from a local session.
# In CI the GitHub Action's inline-comment tool is used instead.
#
# The line must be part of the PR diff (new side), or GitHub rejects it with
# a 422; such findings belong in the summary.
#
# Usage: post-inline.sh <pr-number> <path> <line> <body-file> [start-line]
set -euo pipefail

pr="$1"
path="$2"
line="$3"
file="$4"
start="${5:-}"
repo="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
sha="$(gh pr view "$pr" --json headRefOid -q .headRefOid)"
body="$(cat "$file")"
case "$body" in
  *'<!-- claude-review -->'*) ;;
  *) body="$body"$'\n\n<!-- claude-review -->' ;;
esac

args=(-f body="$body" -f path="$path" -F line="$line" -f side=RIGHT -f commit_id="$sha")
if [ -n "$start" ]; then
  args+=(-F start_line="$start" -f start_side=RIGHT)
fi

gh api -X POST "repos/$repo/pulls/$pr/comments" "${args[@]}" --jq .html_url
