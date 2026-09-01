(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  let currentDoc=null,waitTimer=null;
  const css=`
@media(max-width:639px){
  #animal-hp.hp-compact{
    position:relative!important;
    grid-template-columns:30px minmax(0,1fr)!important;
    column-gap:8px!important;
  }
  #animal-hp .ui-hp-species{
    position:static!important;
    inset:auto!important;
    left:auto!important;
    right:auto!important;
    top:auto!important;
    bottom:auto!important;
    transform:none!important;
    grid-column:1!important;
    grid-row:1/3!important;
    justify-self:center!important;
    align-self:center!important;
    margin:0!important;
    max-width:26px!important;
  }
  #animal-hp .ui-hp-bar{
    position:relative!important;
    grid-column:2!important;
    grid-row:2!important;
    justify-self:stretch!important;
    align-self:center!important;
    width:100%!important;
    min-width:0!important;
    margin:0!important;
    left:auto!important;
    right:auto!important;
    transform:none!important;
  }
}
@media(max-width:390px){
  #animal-hp.hp-compact{
    grid-template-columns:28px minmax(0,1fr)!important;
    column-gap:7px!important;
  }
  #animal-hp .ui-hp-species{max-width:24px!important;}
}
`;
  function install(d){
    if(!d?.head||!d.getElementById('animal-hp'))return false;
    let style=d.getElementById('ui-v16-style');
    if(!style){style=d.createElement('style');style.id='ui-v16-style';d.head.append(style);}
    style.textContent=css;
    currentDoc=d;
    return true;
  }
  function apply(){
    let d;try{d=frame.contentDocument;}catch(_){return false;}
    if(!d)return false;
    if(d!==currentDoc||!d.getElementById('ui-v16-style'))return install(d);
    return true;
  }
  function wait(){
    if(waitTimer)clearInterval(waitTimer);
    let tries=0;
    waitTimer=setInterval(()=>{
      tries++;
      if(apply()||tries>=150){clearInterval(waitTimer);waitTimer=null;}
    },100);
  }
  frame.addEventListener('load',()=>setTimeout(wait,50));
  wait();
})();
