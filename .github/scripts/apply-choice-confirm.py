from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

replacements = [
    (
        "function selectNormal(){",
        """const CHOICE_CONFIRM_MS=700;\nlet choiceConfirmTimer=0;\nfunction cancelChoiceConfirm(){\n  if(choiceConfirmTimer){clearTimeout(choiceConfirmTimer);choiceConfirmTimer=0;}\n  document.querySelectorAll('.choice-confirm-selected,.choice-confirm-dimmed').forEach(el=>{\n    el.classList.remove('choice-confirm-selected','choice-confirm-dimmed');el.disabled=false;\n  });\n}\nfunction confirmAbilityChoice(button,action){\n  if(choiceConfirmTimer||!button)return;\n  const group=button.parentElement,buttons=[...(group?.querySelectorAll('.choice')||[])];\n  buttons.forEach(choice=>{\n    choice.disabled=true;\n    choice.classList.toggle('choice-confirm-selected',choice===button);\n    choice.classList.toggle('choice-confirm-dimmed',choice!==button);\n  });\n  choiceConfirmTimer=setTimeout(()=>{choiceConfirmTimer=0;action();},CHOICE_CONFIRM_MS);\n}\nfunction selectNormal(){"""
    ),
    (
        "b.append(name,stack,desc);b.onclick=()=>{session.beginNext(id);pointer=null;runStage();};return b;}));",
        "b.append(name,stack,desc);b.onclick=()=>confirmAbilityChoice(b,()=>{session.beginNext(id);pointer=null;runStage();});return b;}));"
    ),
    (
        "function choose(){\n  setBoardInspection(false);",
        "function choose(){\n  cancelChoiceConfirm();setBoardInspection(false);"
    ),
    (
        "b.append(name,desc,go);b.onclick=()=>start(id);return b;}));paint();",
        "b.append(name,desc,go);b.onclick=()=>confirmAbilityChoice(b,()=>start(id));return b;}));paint();"
    ),
    (
        "b.append(name,desc);b.onclick=()=>{session.beginSet(id);observation.reset();pointer=null;runStage();};return b;}));",
        "b.append(name,desc);b.onclick=()=>confirmAbilityChoice(b,()=>{session.beginSet(id);observation.reset();pointer=null;runStage();});return b;}));"
    ),
    (
        "featureStyle.textContent=`\n#best-score-overlay[hidden]{display:none!important}",
        """featureStyle.textContent=`\n.choice.choice-confirm-selected:disabled{opacity:1!important;cursor:default;filter:brightness(1.22);border-color:var(--accent)!important;background:#244535!important;box-shadow:0 0 0 2px rgba(153,217,191,.18),0 0 18px rgba(153,217,191,.16);transform:translateY(-1px)}\n.choice.choice-confirm-dimmed:disabled{opacity:.34!important;cursor:default;filter:brightness(.62);transform:none}\n#best-score-overlay[hidden]{display:none!important}"""
    ),
]

for old, new in replacements:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'Expected exactly one match, got {count}: {old[:80]!r}')
    text = text.replace(old, new, 1)

required = [
    'const CHOICE_CONFIRM_MS=700;',
    'confirmAbilityChoice(b,()=>start(id))',
    'confirmAbilityChoice(b,()=>{session.beginNext(id);pointer=null;runStage();})',
    'confirmAbilityChoice(b,()=>{session.beginSet(id);observation.reset();pointer=null;runStage();})',
    '.choice.choice-confirm-selected:disabled',
    '.choice.choice-confirm-dimmed:disabled',
]
for marker in required:
    if marker not in text:
        raise SystemExit(f'Missing required marker: {marker}')

path.write_text(text, encoding='utf-8')
