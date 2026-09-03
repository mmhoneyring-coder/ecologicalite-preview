from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')


def replace_once(old: str, new: str, label: str) -> None:
    global s
    count = s.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 occurrence, found {count}')
    s = s.replace(old, new, 1)


replace_once(
    "const BEST_STORAGE_KEY=`ecologicalite.bestRuns.${BEST_SCORE_VERSION}`;\nconst BEST_LIMIT=5;\nconst REPRO_FX_MS=400;",
    "const BEST_STORAGE_KEY=`ecologicalite.bestRuns.${BEST_SCORE_VERSION}`;\nconst MANUAL_STORAGE_KEY=`ecologicalite.savedRuns.${BEST_SCORE_VERSION}`;\nconst BEST_LIMIT=3;\nconst MANUAL_LIMIT=10;\nconst REPRO_FX_MS=400;",
    'storage constants',
)

replace_once(
    """const safeBestClear=()=>{
  try{localStorage.removeItem(BEST_STORAGE_KEY);return true;}
  catch(_error){return false;}
};
const compactDate=iso=>{""",
    """const safeBestClear=()=>{
  try{localStorage.removeItem(BEST_STORAGE_KEY);return true;}
  catch(_error){return false;}
};
const safeManualRead=()=>{
  try{
    const parsed=JSON.parse(localStorage.getItem(MANUAL_STORAGE_KEY)||'[]');
    return Array.isArray(parsed)?parsed.filter(x=>x&&Number.isFinite(Number(x.score))).slice(0,MANUAL_LIMIT):[];
  }catch(_error){return [];}
};
const safeManualWrite=list=>{
  try{localStorage.setItem(MANUAL_STORAGE_KEY,JSON.stringify(list.slice(0,MANUAL_LIMIT)));return true;}
  catch(_error){return false;}
};
const compactDate=iso=>{""",
    'manual storage helpers',
)

replace_once(
    """function returnToBestScores(){
  const result=$('result');if(result)result.hidden=true;
  renderBestScores(currentNewRecord);
}
function addDetailBack(){
  clearDetailBack();
  const b=document.createElement('button');b.id='best-detail-back';b.type='button';b.textContent='BEST SCOREへ戻る';
  b.onclick=returnToBestScores;resultCard()?.append(b);
}""",
    """function returnToBestScores(){
  const result=$('result');if(result)result.hidden=true;
  renderBestScores(currentNewRecord);
}
function returnToManualRuns(){
  const result=$('result');if(result)result.hidden=true;
  renderManualRuns();
}
function addDetailBack(text='BEST SCOREへ戻る',handler=returnToBestScores){
  clearDetailBack();
  const b=document.createElement('button');b.id='best-detail-back';b.type='button';b.textContent=text;
  b.onclick=handler;resultCard()?.append(b);
}""",
    'detail back navigation',
)

replace_once(
    "function renderSnapshotDetail(record,{saved=false,rank=null,current=false}={}){",
    "function renderSnapshotDetail(record,{saved=false,rank=null,current=false,manual=false}={}){",
    'detail options',
)

replace_once(
    """  if(saved||current){
    const meta=detailSection('記録','run-detail-meta');
    const grid=document.createElement('div');grid.className='run-meta-grid';
    makeKV(grid,saved?'順位':'区分',saved?`#${rank||'—'}`:'今回スコア');
    makeKV(grid,'日時',compactDate(record.completedAt));
    makeKV(grid,'seed',record.seed||'—').classList.add('run-meta-seed');
    meta.append(grid);root.append(meta);
  }""",
    """  if(saved||current||manual){
    const meta=detailSection('記録','run-detail-meta');
    const grid=document.createElement('div');grid.className='run-meta-grid';
    if(saved)makeKV(grid,'順位',`#${rank||'—'}`);
    else makeKV(grid,'区分',manual?'保存したラン':'今回スコア');
    makeKV(grid,manual?'保存日時':'日時',compactDate(manual?(record.savedAt||record.completedAt):record.completedAt));
    makeKV(grid,'seed',record.seed||'—').classList.add('run-meta-seed');
    meta.append(grid);root.append(meta);
  }""",
    'detail metadata',
)

replace_once(
    "function applyResultHeader(record,{saved=false,rank=null,current=false}={}){",
    "function applyResultHeader(record,{saved=false,rank=null,current=false,manual=false}={}){",
    'header options',
)

replace_once(
    """  }else if(current){
    resultSnapshotMode='current-score';heading.classList.add('best-detail-heading');heading.dataset.displayHeading='今回スコア';
    heading.setAttribute('aria-label','今回スコア');
  }else{""",
    """  }else if(current){
    resultSnapshotMode='current-score';heading.classList.add('best-detail-heading');heading.dataset.displayHeading='今回スコア';
    heading.setAttribute('aria-label','今回スコア');
  }else if(manual){
    resultSnapshotMode='manual';heading.classList.add('best-detail-heading');heading.dataset.displayHeading='保存したラン';
    heading.setAttribute('aria-label','保存したラン');
  }else{""",
    'manual detail heading',
)

replace_once(
    """function showCurrentScoreDetail(){
  if(!session?.runDone)return;const record=buildRunSnapshot(session);
  prepareResultDetailView();applyResultHeader(record,{current:true});renderSnapshotDetail(record,{current:true});
  const details=resultCard()?.querySelector('details');if(details)details.open=true;
  addDetailBack();
}""",
    """function showManualRunDetail(record){
  if(!record)return;
  prepareResultDetailView();applyResultHeader(record,{manual:true});renderSnapshotDetail(record,{manual:true});
  const details=resultCard()?.querySelector('details');if(details)details.open=true;
  addDetailBack('保存したランへ戻る',returnToManualRuns);
}
function showCurrentScoreDetail(){
  if(!session?.runDone)return;const record=buildRunSnapshot(session);
  prepareResultDetailView();applyResultHeader(record,{current:true});renderSnapshotDetail(record,{current:true});
  const details=resultCard()?.querySelector('details');if(details)details.open=true;
  addDetailBack();
}""",
    'manual detail view',
)

replace_once(
    """function renderBestScores(newRecord=currentNewRecord){
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
    """function isManualSaved(record){return !!record&&safeManualRead().some(x=>x.fingerprint===record.fingerprint);}
function saveCurrentRunManual(){
  if(!session?.runDone)return;
  const record=buildRunSnapshot(session),list=safeManualRead();
  if(list.some(x=>x.fingerprint===record.fingerprint)){renderBestScores(currentNewRecord);return;}
  if(list.length>=MANUAL_LIMIT){window.alert('保存できるランは10件までです。保存したランを削除してください。');return;}
  record.savedAt=new Date().toISOString();list.unshift(record);
  if(!safeManualWrite(list)){window.alert('保存に失敗しました。ブラウザの保存領域を確認してください。');return;}
  renderBestScores(currentNewRecord);
}
function makeManualRunRow(record){
  const wrap=document.createElement('div');wrap.className='manual-run-row';
  const detail=document.createElement('button');detail.type='button';detail.className='manual-run-detail';
  detail.innerHTML=`<span>${compactDate(record.savedAt||record.completedAt)}</span><strong>${formatScore(record.score)}</strong><small>詳細</small>`;
  detail.onclick=()=>showManualRunDetail(record);
  const del=document.createElement('button');del.type='button';del.className='manual-run-delete';del.textContent='削除';
  del.onclick=()=>{if(!window.confirm('この保存したランを削除します。'))return;const list=safeManualRead().filter(x=>x.fingerprint!==record.fingerprint);safeManualWrite(list);renderManualRuns();};
  wrap.append(detail,del);return wrap;
}
function renderManualRuns(){
  const overlay=ensureBestOverlay(),root=$('best-score-list'),tag=$('best-new-record'),currentRoot=$('best-current-score'),list=safeManualRead();
  const title=overlay.querySelector('.best-score-head strong');if(title)title.textContent='保存したラン';
  root.replaceChildren();currentRoot.replaceChildren();tag.textContent=`${list.length} / ${MANUAL_LIMIT}`;
  if(!list.length){const empty=document.createElement('div');empty.className='best-empty';empty.textContent='保存したランはありません';root.append(empty);}
  else list.forEach(record=>root.append(makeManualRunRow(record)));
  const back=document.createElement('button');back.type='button';back.className='saved-runs-back';back.textContent='BEST SCOREへ戻る';back.onclick=()=>renderBestScores(currentNewRecord);currentRoot.append(back);
  overlay.hidden=false;requestAnimationFrame(positionBestOverlay);
}
function renderBestScores(newRecord=currentNewRecord){
  const overlay=ensureBestOverlay(),list=safeBestRead(),root=$('best-score-list'),tag=$('best-new-record'),currentRoot=$('best-current-score');
  const title=overlay.querySelector('.best-score-head strong');if(title)title.textContent='BEST SCORE';
  root.replaceChildren();currentRoot.replaceChildren();tag.textContent=newRecord?.isNew?`NEW RECORD #${newRecord.rank}`:'';
  if(!list.length){
    const empty=document.createElement('div');empty.className='best-empty';empty.textContent='記録はまだありません';root.append(empty);
  }else list.forEach((record,index)=>root.append(makeBestScoreRow(record,index+1,{newRecord})));
  if(session?.runDone){
    const current=buildRunSnapshot(session),label=document.createElement('div');label.className='best-current-label';
    label.textContent=newRecord?.rank?`今回スコア · BEST #${newRecord.rank}`:'今回スコア';
    const actions=document.createElement('div');actions.className='best-current-actions';
    const savedNow=isManualSaved(current),save=document.createElement('button');save.type='button';save.className='current-run-save';save.textContent=savedNow?'保存済み':'保存';save.disabled=savedNow;save.onclick=saveCurrentRunManual;
    const saved=document.createElement('button');saved.type='button';saved.className='saved-runs-open';saved.textContent=`保存したラン (${safeManualRead().length})`;saved.onclick=renderManualRuns;
    actions.append(save,saved);currentRoot.append(label,makeBestScoreRow(current,null,{current:true,newRecord}),actions);
  }
  overlay.hidden=false;requestAnimationFrame(positionBestOverlay);
}
function hideBestScores(){const overlay=ensureBestOverlay();overlay.hidden=true;}""",
    'manual save and list rendering',
)

replace_once(
    "details.innerHTML='<summary>記録</summary><div class=\"info-content\"><div class=\"info-sub\"><h3>BEST SCORE</h3><p>このブラウザ・端末に上位5件を保存します。</p><button id=\"best-score-reset\" type=\"button\" class=\"best-score-reset\">BEST SCOREを削除</button></div></div>';",
    "details.innerHTML='<summary>記録</summary><div class=\"info-content\"><div class=\"info-sub\"><h3>BEST SCORE</h3><p>このブラウザ・端末に上位3件を自動保存します。残したいランはBEST SCORE画面から別枠で最大10件まで手動保存できます。</p><button id=\"best-score-reset\" type=\"button\" class=\"best-score-reset\">BEST SCOREを削除</button></div></div>';",
    'record info text',
)

replace_once(
    "if(!window.confirm('BEST SCOREの記録5件を削除します。元に戻せません。'))return;",
    "if(!window.confirm('BEST SCOREの記録3件を削除します。元に戻せません。'))return;",
    'best reset confirmation',
)

replace_once(
    ".best-current-score{margin-top:6px;padding-top:6px;border-top:1px solid rgba(126,145,164,.18)}.best-current-label{margin:0 2px 4px;color:#72869a;font-size:7px;font-weight:650;letter-spacing:.02em}.best-current-row{border-color:rgba(64,86,111,.58);background:rgba(17,29,43,.82)}",
    ".best-current-score{margin-top:6px;padding-top:6px;border-top:1px solid rgba(126,145,164,.18)}.best-current-label{margin:0 2px 4px;color:#72869a;font-size:7px;font-weight:650;letter-spacing:.02em}.best-current-row{border-color:rgba(64,86,111,.58);background:rgba(17,29,43,.82)}.best-current-actions{display:grid;grid-template-columns:.72fr 1.28fr;gap:4px;margin-top:4px}.best-current-actions button,.saved-runs-back{min-height:26px;padding:3px 7px;border-radius:7px;border:1px solid rgba(64,86,111,.68);background:rgba(18,31,46,.9);color:#cbd8e5;font-size:8px}.best-current-actions button:disabled{opacity:.55;cursor:default}.manual-run-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px;align-items:stretch}.manual-run-detail{min-width:0;min-height:31px;padding:3px 6px;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:6px;align-items:center;border:1px solid rgba(64,86,111,.75);border-radius:7px;background:rgba(21,35,53,.92);text-align:left}.manual-run-detail span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#8295a9;font-size:7px}.manual-run-detail strong{color:#edf4fb;font-size:12px;font-variant-numeric:tabular-nums}.manual-run-detail small{color:#99d9bf;font-size:7px}.manual-run-delete{min-width:38px;padding:0 7px;border:1px solid rgba(125,76,88,.7);border-radius:7px;background:rgba(48,28,35,.85);color:#d9aeb8;font-size:7px}.saved-runs-back{width:100%;margin-top:2px}",
    'manual list styles',
)

p.write_text(s, encoding='utf-8')
