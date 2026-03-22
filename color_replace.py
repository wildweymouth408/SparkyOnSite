#!/usr/bin/env python3
import os
import re
import sys

REPLACEMENTS = [
    # (pattern, replacement, description)
    (r'#ff6b00', '#f97316', 'primary orange'),
    (r'#ff8533', '#fb923c', 'orange hover'),
    (r'#ff3333', '#ef4444', 'destructive red'),
    (r'#00ff88', '#22c55e', 'success green'),
]

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for pattern, repl, _ in REPLACEMENTS:
        # Replace pattern even if followed by /number (opacity suffix)
        # Using regex with lookahead to keep suffix
        content = re.sub(pattern + r'(?=/?[0-9]*\b)', repl, content)
    if content != original:
        print(f'Updated {filepath}')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    root = '.'
    updated = 0
    for dirpath, dirnames, filenames in os.walk(root):
        # Exclude node_modules, .git, etc.
        if 'node_modules' in dirpath or '.git' in dirpath:
            continue
        for fname in filenames:
            if fname.endswith(('.tsx', '.ts', '.css')):
                filepath = os.path.join(dirpath, fname)
                if replace_in_file(filepath):
                    updated += 1
    print(f'Updated {updated} files')

if __name__ == '__main__':
    main()