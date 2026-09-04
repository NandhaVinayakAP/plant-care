#!/bin/bash
# create_office_bearers_page.sh
mkdir -p tmp
# Convert text to PDF with simple formatting
enscript tmp/office_bearers.txt -o tmp/office_bearers.ps --font=Courier8
ps2pdf tmp/office_bearers.ps tmp/office_bearers_page.pdf