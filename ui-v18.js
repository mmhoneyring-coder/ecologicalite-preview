(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  const desktop=matchMedia('(min-width:1024px)');
  let currentDoc=null,state=null,waitTimer=null;
  const css=`
@media(min-width:1024px){
  html,body{min-height:100%;overflow:auto!important}
  .app.ui-pc-v18{
    width:min(1130px,calc(100vw - 40px))!important;
    max-width:1130px!important;
    min-width:1000px!important;
    margin:0 auto!important;
    padding:46px 0 24px!important;
    display:grid!important;
    grid-template-columns:190px minmax(600px,730px) 190px!important;
    grid-template-rows:auto!important;
    gap:10px!important;
    align-items:start!important;
    position:relative!important;
  }
  .app.ui-pc-v18>.pc-headrow,
  .app.ui-pc-v18>.below.compact-below,
  .app.ui-pc-v18>.board-shell>.speed-row{display:none!important}
  .ui-pc-v18-left,.ui-pc-v18-right{
    height:500px;
    min-width:0;
    display:flex;
    flex-direction:column;
    gap:8px;
    align-self:start;
  }
  .ui-pc-v18-left{grid-column:1;grid-row:1}
  .app.ui-pc-v18>.board-shell{grid-column:2;grid-row:1;min-width:0;width:100%;margin:0!important;padding:8px 8px 6px!important;border-radius:11px!important}
  .ui-pc-v18-right{grid-column:3;grid-row:1;gap:6px}
  .app.ui-pc-v18>.brand-button{
    position:absolute!important;right:0!important;top:13px!important;height:auto!important;min-height:0!important;
    margin:0!important;padding:0 2px 3px!important;font-size:11px!important;line-height:1.1!important;z-index:30
  }

  .ui-pc-v18-left>.stage{
    flex:0 0 48px;height:48px;min-height:48px!important;padding:2px 0!important;
    border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;
    display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important
  }
  .ui-pc-v18-left>.stage span{font-size:9px!important;margin-bottom:4px!important}
  .ui-pc-v18-left>.stage strong{font-size:18px!important;line-height:1.05!important}
  .ui-pc-v18-left>.cards{
    flex:0 0 113px;display:grid!important;grid-template-columns:1fr 1fr!important;grid-template-rows:54px 54px!important;
    gap:5px!important;margin:0!important;min-width:0
  }
  .ui-pc-v18-left>.cards .card{height:54px!important;min-height:54px!important;margin:0!important;padding:6px 8px!important;border-radius:10px!important}
  .ui-pc-v18-left>.cards .card:not(.score) .label{display:none!important}
  .ui-pc-v18-left>.cards .card .ico{left:8px!important;bottom:10px!important;width:22px!important;height:22px!important}
  .ui-pc-v18-left>.cards .card .num{right:8px!important;bottom:9px!important;font-size:21px!important}
  .ui-pc-v18-left>.cards .card.score .label{left:8px!important;top:7px!important;font-size:9px!important}
  .ui-pc-v18-left>.graph-panel{
    flex:1 1 auto;min-height:0!important;height:auto!important;margin:0!important;padding:8px!important;border-radius:10px!important;
    display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important
  }
  .ui-pc-v18-left>.graph-panel .panelhead{margin-bottom:4px!important}
  .ui-pc-v18-left>.graph-panel .panelhead strong{font-size:9px!important}
  .ui-pc-v18-left>.graph-panel .panelhead span{font-size:7px!important}
  .ui-pc-v18-left>.graph-panel .graph-preview-wrap{height:100%!important;min-height:0!important;overflow:hidden!important;border-radius:7px;background:#0b111a}
  .ui-pc-v18-left>.graph-panel #score-graph{display:block!important;width:100%!important;height:100%!important;min-height:0!important;max-height:none!important}
  .ui-pc-v18-left>.graph-panel .graph-actions{margin-top:7px!important;gap:4px!important}
  .ui-pc-v18-left>.graph-panel .graph-actions button{height:24px!important;min-height:24px!important;padding:0 10px!important;font-size:9px!important;line-height:22px!important}

  .app.ui-pc-v18>.board-shell>.board{width:100%!important;aspect-ratio:var(--board-ratio)!important;border-radius:10px!important}
  .app.ui-pc-v18>.board-shell>.timeblock{padding:7px 0 0!important}
  .app.ui-pc-v18>.board-shell .control-meta{margin-top:5px!important;min-height:14px!important}
  .app.ui-pc-v18>.board-shell .control-meta .time{text-align:right!important;padding-right:2px!important;font-size:12px!important;line-height:1.1!important}

  .ui-pc-v18-right>.abilities-panel{
    flex:1 1 auto;min-height:0!important;height:auto!important;margin:0!important;padding:7px!important;border-radius:10px!important
  }
  .ui-pc-v18-right .ability-columns{
    height:100%!important;display:grid!important;grid-template-columns:1fr!important;grid-template-rows:1fr 1fr!important;gap:4px!important
  }
  .ui-pc-v18-right .ability-set{
    min-width:0!important;min-height:0!important;display:grid!important;grid-template-rows:repeat(6,minmax(0,1fr))!important;gap:2px!important
  }
  .ui-pc-v18-right .set-label{display:none!important}
  .ui-pc-v18-right .normal-abilities{display:contents!important;margin:0!important}
  .ui-pc-v18-right .set-ability,
  .ui-pc-v18-right .normal-abilities span{
    min-height:0!important;height:auto!important;margin:0!important;padding:0 5px!important;border-radius:5px!important;
    display:flex!important;align-items:center!important;justify-content:flex-start!important;
    font-size:7.5px!important;line-height:1.05!important;text-align:left!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
  }

  .ui-pc-v18-right>.hp-wrap{flex:0 0 72px;min-width:0;display:grid!important;grid-template-rows:auto 1fr!important;row-gap:4px!important}
  .ui-pc-v18-right .hp-head,.ui-pc-v18-right .speed-head{font-size:9px!important;line-height:1!important;margin:0 0 0 2px!important;color:var(--muted)!important}
  .ui-pc-v18-right #animal-hp.hp-compact{
    height:52px!important;min-height:52px!important;padding:6px 8px!important;display:grid!important;
    grid-template-columns:30px minmax(0,1fr)!important;grid-template-rows:auto 8px!important;column-gap:7px!important;row-gap:5px!important;align-items:center!important
  }
  .ui-pc-v18-right .ui-hp-species{
    display:block!important;position:static!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    grid-column:1!important;grid-row:1/3!important;width:26px!important;height:26px!important;margin:0!important;justify-self:center!important
  }
  .ui-pc-v18-right #animal-id{grid-column:2!important;grid-row:1!important;justify-self:start!important;min-width:0!important;font-size:10px!important;line-height:1!important;white-space:nowrap!important}
  .ui-pc-v18-right #animal-id #animal-species{display:none!important}
  .ui-pc-v18-right #animal-hp-values{grid-column:2!important;grid-row:1!important;justify-self:end!important;font-size:9px!important;line-height:1!important;white-space:nowrap!important}
  .ui-pc-v18-right .ui-hp-bar{
    display:block!important;grid-column:2!important;grid-row:2!important;position:relative!important;width:100%!important;height:8px!important;
    border:1px solid #40566f!important;border-radius:999px!important;background:#0b141e!important;overflow:hidden!important
  }
  .ui-pc-v18-right .ui-hp-bar>i{position:absolute!important;inset:0 auto 0 0!important;display:block!important;height:100%!important;border-radius:inherit!important;background:#99d9bf!important}

  .ui-pc-v18-right>.speed-wrap{flex:0 0 59px;min-width:0;display:grid!important;grid-template-rows:auto 1fr!important;row-gap:4px!important}
  .ui-pc-v18-right .playback-compact{height:42px!important;min-height:42px!important;display:grid!important;grid-template-columns:1.35fr .8fr!important;gap:5px!important}
  .ui-pc-v18-right .playback-compact button{height:42px!important;min-height:42px!important;padding:0!important;font-size:15px!important}
  .ui-pc-v18-right .playback-compact button:last-child{font-size:11px!important}
  .ui-pc-v18-right>.bottom-runtime-actions{
    flex:0 0 34px;height:34px!important;min-height:34px!important;padding:0!important;margin:0!important;
    display:grid!important;grid-template-columns:1fr 1fr!important;gap:5px!important
  }
  .ui-pc-v18-right>.bottom-runtime-actions button,
  .ui-pc-v18-right>.bottom-runtime-actions #back,
  .ui-pc-v18-right>.bottom-runtime-actions #new-run{
    width:100%!important;height:34px!important;min-height:34px!important;max-height:34px!important;margin:0!important;padding:0 7px!important;
    font-size:8px!important;line-height:32px!important;white-space:nowrap!important
  }

  .app.ui-pc-v18 .spec-card.ui-v15-info{width:min(900px,calc(100vw - 80px))!important;max-height:90vh!important}
  .app.ui-pc-v18 .spec-card.ui-v15-info .info-tier-head h2{font-size:14px!important}
  .app.ui-pc-v18 .spec-card.ui-v15-info .info-details>summary{font-size:11px!important;min-height:38px!important}
  .app.ui-pc-v18 .spec-card.ui-v15-info .info-sub h3{font-size:9px!important}
  .app.ui-pc-v18 .spec-card.ui-v15-info .info-sub p{font-size:9px!important}
}
`;

  const slot=el=>({parent:el.parentNode,next:el.nextSibling});
  const restore=(el,s)=>{if(!el||!s?.parent)return;const next=s.next&&s.next.parentNode===s.parent?s.next:null;s.parent.insertBefore(el,next);};

  function capture(d){
    const app=d.querySelector('.app'),head=d.querySelector('.pc-headrow'),cards=head?.querySelector('.cards'),top=head?.querySelector('.top');
    const stage=d.getElementById('stage-badge'),brand=d.getElementById('spec-open'),board=d.querySelector('.board-shell'),below=d.querySelector('.below.compact-below');
    const graph=d.getElementById('score-panel'),abilities=below?.querySelector('.abilities-panel'),speedRow=board?.querySelector('.speed-row'),speed=speedRow?.querySelector('.speed-wrap'),hp=speedRow?.querySelector('.hp-wrap'),actions=d.querySelector('.bottom-runtime-actions');
    if(!app||!head||!cards||!top||!stage||!brand||!board||!below||!graph||!abilities||!speedRow||!speed||!hp||!actions)return null;
    return {doc:d,app,head,cards,top,stage,brand,board,below,graph,abilities,speedRow,speed,hp,actions,
      slots:{cards:slot(cards),stage:slot(stage),brand:slot(brand),graph:slot(graph),abilities:slot(abilities),speed:slot(speed),hp:slot(hp),actions:slot(actions)},left:null,right:null,active:false};
  }

  function enter(s){
    if(s.active)return;
    const d=s.doc;
    s.left=d.createElement('aside');s.left.className='ui-pc-v18-left';s.left.setAttribute('aria-label','ゲーム状況と得点');
    s.right=d.createElement('aside');s.right.className='ui-pc-v18-right';s.right.setAttribute('aria-label','取得能力と操作');
    s.app.insertBefore(s.left,s.board);s.board.after(s.right);
    s.left.append(s.stage,s.cards,s.graph);
    s.right.append(s.abilities,s.hp,s.speed,s.actions);
    s.app.append(s.brand);
    s.app.classList.add('ui-pc-v18');
    s.active=true;
  }

  function leave(s){
    if(!s.active)return;
    s.app.classList.remove('ui-pc-v18');
    restore(s.cards,s.slots.cards);restore(s.stage,s.slots.stage);restore(s.brand,s.slots.brand);
    restore(s.graph,s.slots.graph);restore(s.abilities,s.slots.abilities);restore(s.speed,s.slots.speed);restore(s.hp,s.slots.hp);restore(s.actions,s.slots.actions);
    s.left?.remove();s.right?.remove();s.left=null;s.right=null;s.active=false;
  }

  function install(d){
    if(!d?.head||!d.querySelector('.app'))return false;
    let style=d.getElementById('ui-v18-style');
    if(!style){style=d.createElement('style');style.id='ui-v18-style';d.head.append(style);}
    style.textContent=css;
    state=capture(d);if(!state)return false;
    if(desktop.matches)enter(state);
    currentDoc=d;
    return true;
  }

  function apply(){
    let d;try{d=frame.contentDocument;}catch(_){return false;}
    if(!d)return false;
    if(d!==currentDoc||!state||state.doc!==d){if(state?.active)leave(state);return install(d);}
    if(desktop.matches)enter(state);else leave(state);
    return true;
  }

  function wait(){
    if(waitTimer)clearInterval(waitTimer);
    let tries=0;waitTimer=setInterval(()=>{tries++;if(apply()||tries>=150){clearInterval(waitTimer);waitTimer=null;}},100);
  }
  frame.addEventListener('load',()=>setTimeout(wait,50));
  desktop.addEventListener?.('change',()=>apply());
  wait();
})();
