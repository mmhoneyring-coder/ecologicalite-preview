from pathlib import Path
import hashlib
import re

path = Path('index.html')
text = path.read_text(encoding='utf-8')


def once(old, new, label):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 match, got {count}')
    text = text.replace(old, new, 1)


def regex_once(pattern, replacement, label, flags=0):
    global text
    text, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 match, got {count}')


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

once(
"""const resultCard=()=>document.querySelector('#result>.result-card');
const clearDetailBack=()=>document.getElementById('best-detail-back')?.remove();
function addDetailBack(){
  clearDetailBack();
  const b=document.createElement('button');b.id='best-detail-back';b.type='button';b.textContent='GAME SETへ戻る';
  b.onclick=()=>showCurrentRunDetail();resultCard()?.append(b);
}
""",
"""const resultCard=()=>document.querySelector('#result>.result-card');
const clearDetailBack=()=>document.getElementById('best-detail-back')?.remove();
function returnToBestScores(){
  const result=$('result');if(result)result.hidden=true;
  renderBestScores(currentNewRecord);
}
function addDetailBack(){
  clearDetailBack();
  const b=document.createElement('button');b.id='best-detail-back';b.type='button';b.textContent='BEST SCOREへ戻る';
  b.onclick=returnToBestScores;resultCard()?.append(b);
}
""",
'best detail back target')

once(
"function renderSnapshotDetail(record,{saved=false,rank=null}={}){",
"function renderSnapshotDetail(record,{saved=false,rank=null,current=false}={}){",
'render detail options')

once(
"""  if(saved){
    const meta=detailSection('記録','run-detail-meta');
    const grid=document.createElement('div');grid.className='run-meta-grid';
    makeKV(grid,'順位',`#${rank||'—'}`);
    makeKV(grid,'日時',compactDate(record.completedAt));
    makeKV(grid,'seed',record.seed||'—').classList.add('run-meta-seed');
    meta.append(grid);root.append(meta);
  }
""",
"""  if(saved||current){
    const meta=detailSection('記録','run-detail-meta');
    const grid=document.createElement('div');grid.className='run-meta-grid';
    makeKV(grid,saved?'順位':'区分',saved?`#${rank||'—'}`:'今回スコア');
    makeKV(grid,'日時',compactDate(record.completedAt));
    makeKV(grid,'seed',record.seed||'—').classList.add('run-meta-seed');
    meta.append(grid);root.append(meta);
  }
""",
'current score detail metadata')

regex_once(
    r"function applyResultHeader\(record,\{saved=false,rank=null\}=\{\}\)\{.*?\n\}\nfunction showSavedRunDetail\(record,rank\)\{.*?\n\}\nfunction showCurrentRunDetail\(\)\{.*?\n\}\nrenderResultDetails=function\(\)\{showCurrentRunDetail\(\);\};",
"""function applyResultHeader(record,{saved=false,rank=null,current=false}={}){
  $('final-score').textContent=formatScore(record.score);
  $('final-set1').textContent=formatScore(record.setScores?.[0]||0);
  $('final-set2').textContent=formatScore(record.setScores?.[1]||0);
  const heading=$('result-heading');
  if(saved){
    resultSnapshotMode='saved';heading.classList.add('best-detail-heading');heading.dataset.displayHeading=`BEST #${rank}`;
    heading.setAttribute('aria-label',`BEST #${rank}`);
  }else if(current){
    resultSnapshotMode='current-score';heading.classList.add('best-detail-heading');heading.dataset.displayHeading='今回スコア';
    heading.setAttribute('aria-label','今回スコア');
  }else{
    resultSnapshotMode='current';heading.classList.remove('best-detail-heading');delete heading.dataset.displayHeading;heading.setAttribute('aria-label','GAME SET');
  }
}
function prepareResultDetailView(){
  hideBestScores();
  const result=$('result');if(result){result.hidden=false;result.classList.remove('set-result-mode');result.classList.add('game-set-result-mode');}
  hideGameSetBestButton();
}
function showSavedRunDetail(record,rank){
  prepareResultDetailView();applyResultHeader(record,{saved:true,rank});renderSnapshotDetail(record,{saved:true,rank});
  const details=resultCard()?.querySelector('details');if(details)details.open=true;
  addDetailBack();
}
function showCurrentScoreDetail(){
  if(!session?.runDone)return;const record=buildRunSnapshot(session);
  prepareResultDetailView();applyResultHeader(record,{current:true});renderSnapshotDetail(record,{current:true});
  const details=resultCard()?.querySelector('details');if(details)details.open=true;
  addDetailBack();
}
function showCurrentRunDetail(){
  if(!session?.runDone)return;const record=buildRunSnapshot(session);
  applyResultHeader(record);renderSnapshotDetail(record);clearDetailBack();
}
renderResultDetails=function(){showCurrentRunDetail();};""",
'best/current detail navigation',
flags=re.S)

once(
"""function hideSetResultNext(){const button=$('set-result-next');if(button)button.hidden=true;}
function showSetResult(){
""",
"""function hideSetResultNext(){const button=$('set-result-next');if(button)button.hidden=true;}
function ensureGameSetBestButton(){
  let button=$('game-set-best');
  if(!button){
    button=document.createElement('button');button.id='game-set-best';button.type='button';button.className='primary game-set-best';button.textContent='BEST SCORE';button.setAttribute('aria-label','BEST SCOREを表示');
    button.onclick=()=>{const result=$('result');if(result)result.hidden=true;renderBestScores(currentNewRecord);};
  }
  const card=resultCard(),details=card?.querySelector('details');if(card)card.insertBefore(button,details||null);return button;
}
function hideGameSetBestButton(){const button=$('game-set-best');if(button)button.hidden=true;}
function showGameSetBestButton(){
  const result=$('result');if(result){result.classList.remove('set-result-mode');result.classList.add('game-set-result-mode');}
  const button=ensureGameSetBestButton();button.hidden=false;
}
function showSetResult(){
""",
'game set best button helpers')

once(
"""function showSetResult(){
  hideBestScores();clearDetailBack();document.body.classList.remove('ui-game-set');document.body.classList.add('ui-set-result');
  const setNo=session.set,record=buildSetSnapshot(session,setNo),result=$('result'),heading=$('result-heading');
  result.classList.add('set-result-mode');result.hidden=false;$('status').textContent=`SET ${setNo} COMPLETE`;$('result-eyebrow').textContent='SET COMPLETE';
""",
"""function showSetResult(){
  hideBestScores();hideGameSetBestButton();clearDetailBack();document.body.classList.remove('ui-game-set');document.body.classList.add('ui-set-result');
  const setNo=session.set,record=buildSetSnapshot(session,setNo),result=$('result'),heading=$('result-heading');
  result.classList.remove('game-set-result-mode');result.classList.add('set-result-mode');result.hidden=false;$('status').textContent=`SET ${setNo} COMPLETE`;$('result-eyebrow').textContent='SET COMPLETE';
""",
'set result hides game set button')

regex_once(
    r"function ensureBestOverlay\(\)\{.*?\n\}\nfunction positionBestOverlay\(\)\{.*?\n\}\nfunction renderBestScores\(newRecord=null\)\{.*?\n\}\nfunction hideBestScores\(\)\{const overlay=ensureBestOverlay\(\);overlay.hidden=true;\}",
"""function ensureBestOverlay(){
  if(bestScoreOverlay)return bestScoreOverlay;
  const overlay=document.createElement('div');overlay.id='best-score-overlay';overlay.hidden=true;
  overlay.innerHTML='<div class="best-score-card"><div class="best-score-head"><strong>BEST SCORE</strong><span id="best-new-record"></span></div><div id="best-score-list" class="best-score-list"></div><div id="best-current-score" class="best-current-score"></div></div>';
  document.body.append(overlay);bestScoreOverlay=overlay;return overlay;
}
function positionBestOverlay(){
  const overlay=ensureBestOverlay(),board=document.querySelector('.board'),card=overlay.querySelector('.best-score-card');
  if(overlay.hidden||!board||!card)return;
  const r=board.getBoundingClientRect(),inset=Math.max(5,Math.min(8,r.width*.012));
  card.style.left=`${r.left+inset}px`;card.style.top=`${r.top+inset}px`;card.style.width=`${Math.max(0,r.width-inset*2)}px`;card.style.height=`${Math.max(0,r.height-inset*2)}px`;
}
function makeBestScoreRow(record,rank,{current=false,newRecord=null}={}){
  const row=document.createElement('button');row.type='button';row.className='best-score-row';
  if(current)row.classList.add('best-current-row');
  if(!current&&newRecord?.isNew&&newRecord.rank===rank)row.classList.add('new-record');
  row.innerHTML=`<span class="best-rank">${current?'':rank}</span><strong>${formatScore(record.score)}</strong><small>詳細</small>`;
  row.onclick=()=>current?showCurrentScoreDetail():showSavedRunDetail(record,rank);return row;
}
function renderBestScores(newRecord=currentNewRecord){
  const overlay=ensureBestOverlay(),list=safeBestRead(),root=$('best-score-list'),tag=$('best-new-record'),currentRoot=$('best-current-score');
  root.replaceChildren();currentRoot.replaceChildren();tag.textContent=newRecord?.isNew?`NEW RECORD #${newRecord.rank}`:'';
  if(!list.length){
    const empty=document.createElement('div');empty.className='best-empty';empty.textContent='記録はまだありません';root.append(empty);
  }else list.forEach((record,index)=>root.append(makeBestScoreRow(record,index+1,{newRecord})));
  if(session?.runDone){
    const current=buildRunSnapshot(session),label=document.createElement('div');label.className='best-current-label';
    label.textContent=newRecord?.rank?`今回スコア · BEST #${newRecord.rank}`:'今回スコア';
    currentRoot.append(label,makeBestScoreRow(current,null,{current:true,newRecord}));
  }
  overlay.hidden=false;requestAnimationFrame(positionBestOverlay);
}
function hideBestScores(){const overlay=ensureBestOverlay();overlay.hidden=true;}""",
'board best score overlay',
flags=re.S)

once(
"""function recordCompletedRun(){
  if(!session?.runDone)return null;
  const outcome=storeBestSnapshot(buildRunSnapshot(session));currentNewRecord=outcome;
  renderBestScores(outcome);return outcome;
}
""",
"""function recordCompletedRun(){
  if(!session?.runDone)return null;
  const outcome=storeBestSnapshot(buildRunSnapshot(session));currentNewRecord=outcome;
  return outcome;
}
""",
'defer best score display')

once(
"""const legacyChoose=choose;
choose=function(){hideBestScores();currentNewRecord=null;clearDetailBack();return legacyChoose();};
const legacyRunStage=runStage;
runStage=function(){
  hideBestScores();reproFx=[];if(reproFxRaf){cancelAnimationFrame(reproFxRaf);reproFxRaf=0;}legacyRunStage();installReproductionObserver();
};
""",
"""const legacyChoose=choose;
choose=function(){hideBestScores();hideGameSetBestButton();currentNewRecord=null;clearDetailBack();const result=$('result');if(result)result.classList.remove('game-set-result-mode');return legacyChoose();};
const legacyRunStage=runStage;
runStage=function(){
  hideBestScores();hideGameSetBestButton();reproFx=[];if(reproFxRaf){cancelAnimationFrame(reproFxRaf);reproFxRaf=0;}legacyRunStage();installReproductionObserver();
};
""",
'run reset best UI')

once(
"""const legacyFinish=finish;
finish=function(){
  legacyFinish();
  if(session?.runDone){recordCompletedRun();positionBestOverlay();}
};
""",
"""const legacyFinish=finish;
finish=function(){
  legacyFinish();
  if(session?.runDone){recordCompletedRun();hideBestScores();showGameSetBestButton();}
};
""",
'game set waits for best button')

once(
"#best-score-overlay{position:fixed;inset:0;z-index:70;pointer-events:none}\n.best-shade{position:fixed;border-radius:10px;background:rgba(3,8,13,.54);backdrop-filter:blur(1.7px);-webkit-backdrop-filter:blur(1.7px);pointer-events:none}\n.best-score-card{position:fixed;z-index:2;padding:8px;border:1px solid rgba(91,116,141,.72);border-radius:10px;background:rgba(13,22,32,.91);box-shadow:0 12px 30px rgba(0,0,0,.3);pointer-events:auto;overflow:auto}",
"#best-score-overlay{position:fixed;inset:0;z-index:70;pointer-events:none}\n.best-score-card{position:fixed;z-index:2;padding:8px;border:1px solid rgba(91,116,141,.72);border-radius:10px;background:rgba(13,22,32,.93);box-shadow:0 12px 30px rgba(0,0,0,.3);pointer-events:auto;overflow:auto;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}",
'best overlay board styling')

once(
".best-score-list{display:grid;gap:4px}.best-score-row{width:100%;min-height:29px;padding:3px 6px;display:grid;grid-template-columns:18px minmax(0,1fr) auto;gap:5px;align-items:center;border:1px solid rgba(64,86,111,.75);border-radius:7px;background:rgba(21,35,53,.92);text-align:left}\n.best-score-row .best-rank{color:#8295a9;font-size:8px;font-weight:800}.best-score-row strong{text-align:right;color:#edf4fb;font-size:13px;font-variant-numeric:tabular-nums}.best-score-row small{color:#99d9bf;font-size:7px}.best-score-row.new-record{border-color:#91cdb7;box-shadow:inset 0 0 0 1px rgba(153,217,191,.18)}",
".best-score-list{display:grid;gap:4px}.best-score-row{width:100%;min-height:29px;padding:3px 6px;display:grid;grid-template-columns:18px minmax(0,1fr) auto;gap:5px;align-items:center;border:1px solid rgba(64,86,111,.75);border-radius:7px;background:rgba(21,35,53,.92);text-align:left}\n.best-score-row .best-rank{color:#8295a9;font-size:8px;font-weight:800}.best-score-row strong{text-align:right;color:#edf4fb;font-size:13px;font-variant-numeric:tabular-nums}.best-score-row small{color:#99d9bf;font-size:7px}.best-score-row.new-record{border-color:#91cdb7;box-shadow:inset 0 0 0 1px rgba(153,217,191,.18)}\n.best-current-score{margin-top:6px;padding-top:6px;border-top:1px solid rgba(126,145,164,.18)}.best-current-label{margin:0 2px 4px;color:#72869a;font-size:7px;font-weight:650;letter-spacing:.02em}.best-current-row{border-color:rgba(64,86,111,.58);background:rgba(17,29,43,.82)}",
'current score subtle separator')

once(
"#result.set-result-mode{align-items:flex-end!important;padding-top:8px!important;padding-bottom:14px!important}\n#set-result-next{box-sizing:border-box!important;width:100%!important;height:44px!important;min-height:44px!important;margin-top:10px!important;padding:0 14px!important;border:1px solid #818b95!important;border-radius:10px!important;background:linear-gradient(180deg,#2a3036 0%,#20262c 100%)!important;color:#eef2f5!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.10)!important;font-size:14px!important;font-weight:800!important;line-height:42px!important;letter-spacing:.02em!important}\n#result.set-result-mode details{margin-top:12px!important;padding-top:8px!important;border-top:1px solid rgba(132,148,164,.28)!important}",
"#result.set-result-mode,#result.game-set-result-mode{align-items:flex-end!important;padding-top:8px!important;padding-bottom:14px!important}\n#set-result-next,#game-set-best{box-sizing:border-box!important;width:100%!important;height:44px!important;min-height:44px!important;margin-top:10px!important;padding:0 14px!important;border:1px solid #818b95!important;border-radius:10px!important;background:linear-gradient(180deg,#2a3036 0%,#20262c 100%)!important;color:#eef2f5!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.10)!important;font-size:14px!important;font-weight:800!important;line-height:42px!important;letter-spacing:.02em!important}\n#result.set-result-mode details,#result.game-set-result-mode details{margin-top:12px!important;padding-top:8px!important;border-top:1px solid rgba(132,148,164,.28)!important}",
'game set layout matches set result')

once(
"@media(max-width:390px){#result.set-result-mode{padding-top:6px!important;padding-bottom:10px!important}#set-result-next{height:44px!important;min-height:44px!important;font-size:13.5px!important;line-height:42px!important}}",
"@media(max-width:390px){#result.set-result-mode,#result.game-set-result-mode{padding-top:6px!important;padding-bottom:10px!important}#set-result-next,#game-set-best{height:44px!important;min-height:44px!important;font-size:13.5px!important;line-height:42px!important}}",
'game set mobile button layout')

core_after = hashlib.sha256(section(text, core_start, core_end).encode()).hexdigest()
session_after = hashlib.sha256(section(text, session_start, session_end).encode()).hexdigest()
if core_before != core_after or session_before != session_after:
    raise SystemExit('simulation/session code changed unexpectedly')

path.write_text(text, encoding='utf-8')
