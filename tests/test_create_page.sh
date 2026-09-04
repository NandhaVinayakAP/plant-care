#!/bin/bash
# test_create_page.sh
output="tmp/office_bearers_page.pdf"
if [ ! -f "$output" ]; then
  echo "FAIL: Expected output file $output not found"
  exit 1
fi
# Check if it's a valid PDF by looking for PDF header
if ! head -c 5 "$output" | grep -q "%PDF"; then
  echo "FAIL: Output file $output is not a valid PDF"
  exit 1
fi
echo "PASS: Created valid PDF page from extracted text"