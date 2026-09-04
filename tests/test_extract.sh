#!/bin/bash
# test_extract.sh
output="tmp/office_bearers.txt"
if [ ! -f "$output" ]; then
  echo "FAIL: Expected output file $output not found"
  exit 1
fi
if [ ! -s "$output" ]; then
  echo "FAIL: Output file $output is empty"
  exit 1
fi
echo "PASS: Extracted content file exists and contains data"