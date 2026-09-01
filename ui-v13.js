(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  let currentDoc=null;
  function apply(){
    let d;
    try{d=frame.contentDocument;}catch(_){return;}
    if(!d?.head)return;
    if(currentDoc!==d){
      currentDoc=d;
      let style=d.getElementById('ui-v13-style');
      if(!style){
        style=d.createElement('style');
        style.id='ui-v13-style';
        d.head.append(style);
      }
      style.textContent=`
        .brand{transform:translateY(7px)!important}
        #result-heading{font-size:0!important}
        #result-heading::after{content:'GAME SET';font-size:17px;line-height:1.25;font-weight:700;letter-spacing:.03em}
        @media(max-width:390px){#result-heading::after{font-size:16px}}
      `;
    }
  }
  frame.addEventListener('load',()=>{setTimeout(apply,50);setTimeout(apply,250);setTimeout(apply,800)});
  const timer=setInterval(apply,250);
  setTimeout(()=>clearInterval(timer),15000);
})();