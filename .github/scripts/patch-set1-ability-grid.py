from pathlib import Path
import hashlib

path = Path('index.html')
text = path.read_text(encoding='utf-8')


def once(old, new, label):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 match, got {count}')
    text = text.replace(old, new, 1)


def section(src, start, end):
    a = src.index(start)
    b = src.index(end, a) + len(end)
    return src[a:b]


core_start = '/* BEGIN ./core.mjs — preserve ecology/progression; renderer and score-view are display code. */'
core_end = '/* END ./core.mjs */'
session_start = '/* BEGIN ./set1-session.mjs — preserve ecology/progression; renderer and score-view are display code. */'
session_end = '/* END ./set1-session.mjs */'
core_before = hashlib.sha256(section(text, core_start, core_end).encode()).hexdigest()
session_before = hashlib.sha256(section(text, session_start, session_end).encode()).hexdigest()

old = """  const abilities=detailSection('取得能力','run-detail-abilities');
  const setGrid=document.createElement('div');setGrid.className='run-set-grid set-result-single';
  const a=record.setAbilities?.find(x=>Number(x.set)===Number(setNo)),card=document.createElement('div');card.className='run-ability-card set';card.innerHTML=`<small>SET ${setNo}</small><strong>${a?.name||'—'}</strong>`;setGrid.append(card);abilities.append(setGrid);
  const normalGrid=document.createElement('div');normalGrid.className='run-normal-grid';
  for(const item of record.normalAbilities||[]){const el=document.createElement('div');el.className='run-ability-card normal';el.innerHTML=`<span>${item.name}</span><strong>×${item.count}</strong>`;normalGrid.append(el);}
  if(!normalGrid.childElementCount){const empty=document.createElement('span');empty.className='run-empty';empty.textContent='通常能力なし';normalGrid.append(empty);}abilities.append(normalGrid);"""

new = """  const abilities=detailSection('取得能力','run-detail-abilities');
  const abilityGrid=document.createElement('div');abilityGrid.className='run-normal-grid set-result-ability-grid';
  const a=record.setAbilities?.find(x=>Number(x.set)===Number(setNo)),card=document.createElement('div');card.className='run-ability-card set';card.innerHTML=`<small>SET ${setNo}</small><strong>${a?.name||'—'}</strong>`;abilityGrid.append(card);
  let normalAbilityCount=0;
  for(const item of record.normalAbilities||[]){const el=document.createElement('div');el.className='run-ability-card normal';el.innerHTML=`<span>${item.name}</span><strong>×${item.count}</strong>`;abilityGrid.append(el);normalAbilityCount++;}
  if(!normalAbilityCount){const empty=document.createElement('span');empty.className='run-empty';empty.textContent='通常能力なし';abilityGrid.append(empty);}abilities.append(abilityGrid);"""
once(old, new, 'SET result ability grid')

css_anchor = ".run-set-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px}.run-normal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px;margin-top:4px}"
css_add = "\n.set-result-ability-grid{margin-top:0}.set-result-ability-grid .run-ability-card.set{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px;align-items:center;padding:4px 5px}.set-result-ability-grid .run-ability-card.set small{white-space:nowrap}.set-result-ability-grid .run-ability-card.set strong{margin-top:0}"
once(css_anchor, css_anchor + css_add, 'SET result ability grid CSS')

core_after = hashlib.sha256(section(text, core_start, core_end).encode()).hexdigest()
session_after = hashlib.sha256(section(text, session_start, session_end).encode()).hexdigest()
if core_before != core_after or session_before != session_after:
    raise SystemExit('simulation/session code changed unexpectedly')

path.write_text(text, encoding='utf-8')
