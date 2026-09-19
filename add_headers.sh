#!/usr/bin/env bash
# add_headers.sh
# Adds a standardised copyright header to every JS, CSS, and HTML file.
# Skips js/vendor/. Safe to re-run — checks for existing header first.
#
# The Sound Travels Ear Training
# Renato Fera P. — https://www.linkedin.com/in/renato-profeta/
# © 2026 The Sound Travels — MIT License

set -e

AUTHOR="Renato Fera P. — https://www.linkedin.com/in/renato-profeta/"
TITLE="The Sound Travels Ear Training"
COPYRIGHT="© 2026 The Sound Travels — MIT License"
MARKER="renato-profeta"

# ── JavaScript files ──────────────────────────────────────────────────────────

process_js() {
  local file="$1"

  if grep -q "@author" "$file" && grep -q "@copyright" "$file"; then
    echo "  [skip]  $file"
    return
  fi

  if grep -q "@copyright" "$file" && ! grep -q "@author" "$file"; then
    sed -i "s|.*@copyright.*|&\n * @author    ${AUTHOR}|" "$file"
    echo "  [patch] $file — @author added"
    return
  fi

  local header
  header="/**
 * @file
 * @author    ${AUTHOR}
 * @copyright ${COPYRIGHT}
 */"
  printf '%s\n\n' "$header" | cat - "$file" > /tmp/_hdr_tmp && mv /tmp/_hdr_tmp "$file"
  echo "  [add]   $file — full header prepended"
}

echo ""
echo "=== JS files ==="
find js/ -name "*.js" ! -path "js/vendor/*" | sort | while read -r f; do
  process_js "$f"
done

# ── CSS files ─────────────────────────────────────────────────────────────────

process_css() {
  local file="$1"
  if grep -q "$MARKER" "$file"; then
    echo "  [skip]  $file"
    return
  fi
  local header
  header="/* =============================================================================
   ${TITLE}
   ${AUTHOR}
   ${COPYRIGHT}
   ============================================================================= */"
  printf '%s\n\n' "$header" | cat - "$file" > /tmp/_hdr_tmp && mv /tmp/_hdr_tmp "$file"
  echo "  [add]   $file — header prepended"
}

echo ""
echo "=== CSS files ==="
find css/ -name "*.css" | sort | while read -r f; do
  process_css "$f"
done

# ── HTML files ────────────────────────────────────────────────────────────────

process_html() {
  local file="$1"
  if grep -q "$MARKER" "$file"; then
    echo "  [skip]  $file"
    return
  fi
  local header
  header="<!--
  ${TITLE}
  ${AUTHOR}
  ${COPYRIGHT}
-->"
  printf '%s\n\n' "$header" | cat - "$file" > /tmp/_hdr_tmp && mv /tmp/_hdr_tmp "$file"
  echo "  [add]   $file — header prepended"
}

echo ""
echo "=== HTML files ==="
process_html "index.html"

echo ""
echo "=== Done ==="
