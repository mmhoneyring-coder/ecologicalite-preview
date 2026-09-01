(()=>{
  const frame=document.getElementById('app');if(!frame)return;
  const mobile=matchMedia('(max-width:639px)');let installedDoc=null,layoutState=null,waitTimer=null,infoMarkup='',css='';
  const assets=Promise.all([fetch('./game-info-v19.html?v=19').then(r=>r.text()),fetch('./ui-v15.css?v=15').then(r=>r.text())]).then(([h,c])=>{infoMarkup=h;css=c;return true;}).catch(e=>{console.error('ui-v15 assets',e);return false;});

  function updateHp(d){
    const root=d.getElementById('animal-hp'),source=d.getElementById('animal-species'),values=d.getElementById('animal-hp-values');
    if(!root||!source||!values)return;
    let icon=root.querySelector('.ui-hp-species');
    if(!icon){icon=d.createElement('i');icon.className='hp-species ui-hp-species none-icon';icon.setAttribute('aria-hidden','true');root.prepend(icon);}
    icon.className='hp-species ui-hp-species '+[...source.classList].filter(x=>x!=='hp-species').join(' ');
    let bar=root.querySelector('.ui-hp-bar');
    if(!bar){bar=d.createElement('span');bar.className='ui-hp-bar';bar.setAttribute('aria-hidden','true');bar.append(d.createElement('i'));root.append(bar);}
    const m=String(values.textContent||'').match(/([\d.]+)\s*\/\s*([\d.]+)/);const pct=m&&Number(m[2])>0?Math.max(0,Math.min(100,Number(m[1])/Number(m[2])*100)):0;bar.firstElementChild.style.width=pct+'%';
  }

  function renderInfo(d){
    const card=d.querySelector('#spec-overlay .spec-card'),head=d.querySelector('#spec-overlay .spec-head'),content=d.getElementById('spec-content');
    if(!card||!head||!content)return;
    card.classList.add('ui-v15-info');
    const small=head.querySelector('small'),title=head.querySelector('h2'),close=d.getElementById('spec-close');
    if(small)small.textContent='GAME GUIDE / SPEC';
    if(title)title.textContent='EcologicaLite';
    if(close){close.textContent='閉じる';close.setAttribute('aria-label','ゲーム情報を閉じる');}
    content.innerHTML=infoMarkup;
  }

  function installInfo(d){
    const open=d.getElementById('spec-open'),close=d.getElementById('spec-close');
    if(!open||!close)return;
    if(open.dataset.uiV15!=='1'){
      const oldOpen=open.onclick;
      open.onclick=function(e){if(typeof oldOpen==='function')oldOpen.call(this,e);queueMicrotask(()=>renderInfo(d));};
      open.dataset.uiV15='1';
    }
    if(close.dataset.uiV15!=='1'){
      const oldClose=close.onclick;
      close.onclick=function(e){if(typeof oldClose==='function')oldClose.call(this,e);};
      close.dataset.uiV15='1';
    }
    const overlay=d.getElementById('spec-overlay');
    if(overlay&&!overlay.dataset.uiV15Observed){
      overlay.dataset.uiV15Observed='1';
      new d.defaultView.MutationObserver(()=>{if(!overlay.hidden)renderInfo(d);}).observe(overlay,{attributes:true,attributeFilter:['hidden']});
    }
  }

  function setMobileLayout(d,on){
    if(!layoutState||layoutState.doc!==d){
      const below=d.querySelector('.below.compact-below'),ability=below?.querySelector('.abilities-panel'),actions=d.querySelector('.bottom-runtime-actions');
      if(!below||!ability||!actions)return;
      layoutState={doc:d,below,ability,actions,abilityParent:ability.parentNode,abilityNext:ability.nextSibling,actionsParent:actions.parentNode,actionsNext:actions.nextSibling,lower:null};
    }
    const s=layoutState;
    if(on){
      if(!s.lower){s.lower=d.createElement('div');s.lower.className='ui-v15-lower-right';}
      if(s.lower.parentNode!==s.below)s.below.append(s.lower);
      if(s.ability.parentNode!==s.lower)s.lower.append(s.ability);
      if(s.actions.parentNode!==s.lower)s.lower.append(s.actions);
    }else{
      if(s.ability.parentNode!==s.abilityParent)s.abilityParent.insertBefore(s.ability,s.abilityNext);
      if(s.actions.parentNode!==s.actionsParent)s.actionsParent.insertBefore(s.actions,s.actionsNext);
      if(s.lower?.parentNode)s.lower.remove();
    }
  }

  function install(d){
    if(!d?.head||!d.querySelector('.board-shell'))return false;
    if(!d.getElementById('ui-v15-style')){const style=d.createElement('style');style.id='ui-v15-style';style.textContent=css;d.head.append(style);}
    installInfo(d);
    updateHp(d);
    const hp=d.getElementById('animal-hp');
    if(hp&&!hp.dataset.uiV15Observed){hp.dataset.uiV15Observed='1';new d.defaultView.MutationObserver(()=>updateHp(d)).observe(hp,{subtree:true,childList:true,characterData:true,attributes:true});}
    setMobileLayout(d,mobile.matches);
    installedDoc=d;
    return true;
  }

  function apply(){let d;try{d=frame.contentDocument;}catch(_){return false;}if(!d)return false;if(d!==installedDoc){layoutState=null;return install(d);}installInfo(d);updateHp(d);setMobileLayout(d,mobile.matches);return true;}
  function wait(){if(waitTimer)clearInterval(waitTimer);let tries=0;waitTimer=setInterval(()=>{tries++;if(apply()||tries>=150){clearInterval(waitTimer);waitTimer=null;}},100);}
  frame.addEventListener('load',()=>setTimeout(wait,50));
  mobile.addEventListener?.('change',()=>apply());
  assets.then(ok=>{if(ok)wait();});
})();
