#!/usr/bin/env python3
import sys
import re

file_path = 'components/reference-tab.tsx'
with open(file_path, 'r') as f:
    lines = f.readlines()

# Find start line of function CodeSection
start = None
for i, line in enumerate(lines):
    if line.strip() == 'function CodeSection() {':
        start = i
        break
if start is None:
    print('Could not find function CodeSection')
    sys.exit(1)

# Find matching closing brace after start
brace_count = 0
end = None
for i in range(start, len(lines)):
    brace_count += lines[i].count('{')
    brace_count -= lines[i].count('}')
    if brace_count == 0:
        end = i
        break
if end is None:
    print('Could not find matching closing brace')
    sys.exit(1)

print(f'Replacing lines {start+1} to {end+1}')

# Replace with new function
new_lines = lines[:start] + ['function CodeSection() {\n', '  return <NECLibrary />\n', '}\n'] + lines[end+1:]

with open(file_path, 'w') as f:
    f.writelines(new_lines)
print('Done')