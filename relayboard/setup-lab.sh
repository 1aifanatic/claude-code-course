#!/usr/bin/env bash
set -euo pipefail
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source_dir="$script_dir/starter"
destination="${1:-$(dirname "$script_dir")/relayboard-work}"
if [[ -e "$destination" ]]; then echo "Destination already exists: $destination" >&2; exit 1; fi
mkdir -p "$(dirname "$destination")"
cp -R "$source_dir" "$destination"
git -C "$destination" init -b main
git -C "$destination" config user.name "Course Learner"
git -C "$destination" config user.email "learner@example.invalid"
git -C "$destination" add .
git -C "$destination" commit -m "course: RelayBoard starter"
git -C "$destination" tag course-start
git -C "$destination" switch -c learner-work
printf 'RelayBoard learner workspace created at %s
' "$destination"
