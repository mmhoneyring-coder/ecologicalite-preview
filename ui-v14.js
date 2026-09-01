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
        #result-heading{
          font-size:0!important;
        }
        #result-heading::after{
          content:'GAME SET';
          font-size:17px;
          line-height:1.25;
          font-weight:700;
          letter-spacing:.03em;
        }
        @media(max-width:390px){
          #result-heading::after{font-size:16px}
        }
      `;
      d.head.append(style);
    }

    const result=d.getElementById('result');
    const status=d.getElementById('status');
    const heading=d.getElementById('result-heading');

    const syncFinal=()=>{
      const done=Boolean(result&&!result.hidden);
      d.body?.classList.toggle('ui-game-set',done);
      if(!done)return;
      if(status&&status.textContent!=='GAME SET')status.textContent='GAME SET';
      if(heading)heading.setAttribute('aria-label','GAME SET');
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

  frame.addEventListener('load',()=>setTimeout(waitForFinalDocument,50));
  waitForFinalDocument();
})();