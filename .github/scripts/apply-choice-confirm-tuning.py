from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

old_delay = 'const CHOICE_CONFIRM_MS=700;'
new_delay = 'const CHOICE_CONFIRM_MS=500;'
if old_delay not in s:
    raise SystemExit('expected choice delay marker not found')
s = s.replace(old_delay, new_delay, 1)

old_style = ".choice.choice-confirm-selected:disabled{opacity:1!important;cursor:default;filter:brightness(1.22);border-color:var(--accent)!important;background:#244535!important;box-shadow:0 0 0 2px rgba(153,217,191,.18),0 0 18px rgba(153,217,191,.16);transform:translateY(-1px)}"
new_style = ".choice,.choice *{user-select:none;-webkit-user-select:none}.choice{-webkit-touch-callout:none}\n" + old_style
if old_style not in s:
    raise SystemExit('expected choice style marker not found')
s = s.replace(old_style, new_style, 1)

p.write_text(s, encoding='utf-8')
