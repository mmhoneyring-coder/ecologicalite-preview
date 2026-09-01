(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  let currentDoc=null;
  function apply(){
    let d;
    try{d=frame.contentDocument;}catch(_){return;}
    if(!d?.head||!d.querySelector('.board-shell'))return;
    if(currentDoc!==d||!d.getElementById('ui-v14-style')){
      currentDoc=d;
      let style=d.getElementById('ui-v14-style');
      if(!style){
        style=d.createElement('style');
        style.id='ui-v14-style';
        style.textContent=`
          .brand{transform:translateY(7px)!important}
          #result-heading{font-size:0!important}
          #result-heading::after{content:'GAME SET';font-size:17px;line-height:1.25;font-weight:700;letter-spacing:.03em}
          @media(max-width:390px){#result-heading::after{font-size:16px}}
        `;
        d.head.append(style);
      }
    }
    const result=d.getElementById('result');
    const heading=d.getElementById('result-heading');
    if(result&&!result.hidden&&heading&&heading.textContent!=='GAME SET')heading.textContent='GAME SET';
  }
  frame.addEventListener('load',()=>{setTimeout(apply,80);setTimeout(apply,400);setTimeout(apply,1200)});
  const timer=setInterval(apply,200);
  setTimeout(()=>clearInterval(timer),20000);
})();