(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  let currentDoc=null;
  let waitTimer=null;

  function install(d){
    if(!d?.head||!d.querySelector('.board-shell'))return false;

    if(!d.getElementById('ui-v14-style')){
      const style=d.createElement('style');
      style.id='ui-v14-style';
      style.textContent=`
        .brand{
          position:relative!important;
          top:7px!important;
          transform:none!important;
        }
      `;
      d.head.append(style);
    }

    const result=d.getElementById('result');
    const status=d.getElementById('status');
    const heading=d.getElementById('result-heading');

    const syncFinal=()=>{
      if(!result||result.hidden)return;
      if(status&&status.textContent!=='GAME SET')status.textContent='GAME SET';
      if(heading&&heading.textContent!=='GAME SET')heading.textContent='GAME SET';
    };

    if(result&&!result.dataset.uiV14Observed){
      result.dataset.uiV14Observed='1';
      new d.defaultView.MutationObserver(syncFinal).observe(result,{
        attributes:true,
        attributeFilter:['hidden']
      });
    }

    syncFinal();
    currentDoc=d;
    return true;
  }

  function apply(){
    let d;
    try{d=frame.contentDocument;}catch(_){return false;}
    if(!d)return false;
    if(d!==currentDoc||!d.getElementById('ui-v14-style'))return install(d);
    return Boolean(d.querySelector('.board-shell'));
  }

  function waitForFinalDocument(){
    if(waitTimer)clearInterval(waitTimer);
    let tries=0;
    waitTimer=setInterval(()=>{
      tries++;
      if(apply()||tries>=150){
        clearInterval(waitTimer);
        waitTimer=null;
      }
    },100);
  }

  frame.addEventListener('load',()=>{
    setTimeout(waitForFinalDocument,50);
  });
  waitForFinalDocument();
})();