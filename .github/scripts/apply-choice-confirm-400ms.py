from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')
old = 'const CHOICE_CONFIRM_MS=500;'
new = 'const CHOICE_CONFIRM_MS=400;'
if old not in s:
    raise SystemExit('expected source not found')
if s.count(old) != 1:
    raise SystemExit(f'unexpected occurrence count: {s.count(old)}')
p.write_text(s.replace(old, new, 1), encoding='utf-8')
