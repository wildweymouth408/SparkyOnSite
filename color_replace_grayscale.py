#!/usr/bin/env python3
import os
import re
import sys

# Mapping from hardcoded grayscale to design token hex values (dark theme)
# Source: globals.css dark theme variables
DESIGN_TOKENS = {
    '--background': '#09090b',
    '--foreground': '#fafafa',
    '--card': '#18181b',
    '--card-foreground': '#fafafa',
    '--popover': '#18181b',
    '--popover-foreground': '#fafafa',
    '--primary': '#f97316',
    '--primary-foreground': '#09090b',
    '--secondary': '#27272a',
    '--secondary-foreground': '#fafafa',
    '--muted': '#1c1c1f',
    '--muted-foreground': '#a1a1aa',
    '--accent': '#27272a',
    '--accent-foreground': '#fafafa',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#fafafa',
    '--border': '#27272a',
    '--input': '#1c1c1f',
    '--ring': '#f97316',
}

# Approximate mapping of common hardcoded colors to closest design token (by hex)
# We'll replace exact hex matches with token hex (not class names)
MAPPINGS = [
    # (pattern, replacement, description)
    ('#888', '#a1a1aa', 'muted-foreground'),
    ('#f0f0f0', '#fafafa', 'foreground'),
    ('#2a2a35', '#27272a', 'border'),
    ('#52525b', '#a1a1aa', 'muted-foreground'),
    ('#111', '#18181b', 'card'),
    ('#333', '#27272a', 'border'),
    ('#444', '#71717a', 'muted-foreground lighter'),
    ('#6B7280', '#a1a1aa', 'muted-foreground'),
    ('#6b7280', '#a1a1aa', 'muted-foreground'),
    ('#1e2028', '#18181b', 'card'),
    ('#09090b', '#09090b', 'background (same)'),
    ('#3f3f46', '#3f3f46', 'keep (close to border)'),
    ('#aaa', '#a1a1aa', 'muted-foreground'),
    ('#666', '#71717a', 'muted-foreground'),
    ('#222', '#18181b', 'card'),
    ('#555', '#71717a', 'muted-foreground'),
    ('#ff4444', '#ef4444', 'destructive'),
    ('#ff3333', '#ef4444', 'destructive'),
    ('#00ff88', '#22c55e', 'success'),
    ('#ff6b00', '#f97316', 'primary'),
    ('#ff8533', '#fb923c', 'primary hover'),
    # Add more as needed
]

def replace_in_file(filepath, dry_run=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for pattern, repl, desc in MAPPINGS:
        # Replace pattern even if followed by /number (opacity suffix)
        # Using regex with lookahead to keep suffix
        content = re.sub(re.escape(pattern) + r'(?=/?[0-9]*\b)', repl, content, flags=re.IGNORECASE)
    if content != original:
        print(f'Would update {filepath}' if dry_run else f'Updated {filepath}')
        if not dry_run:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
        return True
    return False

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true', help='Dry run')
    args = parser.parse_args()
    
    root = '.'
    updated = 0
    for dirpath, dirnames, filenames in os.walk(root):
        if 'node_modules' in dirpath or '.git' in dirpath:
            continue
        for fname in filenames:
            if fname.endswith(('.tsx', '.ts', '.css')):
                filepath = os.path.join(dirpath, fname)
                if replace_in_file(filepath, dry_run=args.dry_run):
                    updated += 1
    print(f'{"Would update" if args.dry_run else "Updated"} {updated} files')

if __name__ == '__main__':
    main()