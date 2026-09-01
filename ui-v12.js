(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  let currentDoc=null,observer=null;
  function apply(){
    let d;
    try{d=frame.contentDocument;}catch(_){return;}
    if(!d?.head)return;
    if(currentDoc!==d){
      currentDoc=d;
      observer?.disconnect();
      let style=d.getElementById('ui-v12-style');
      if(!style){
        style=d.createElement('style');
        style.id='ui-v12-style';
        style.textContent='.brand{transform:translateY(2px)!important}';
        d.head.append(style);
      }
      observer=new MutationObserver(()=>requestAnimationFrame(apply));
      observer.observe(d.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class']});
    }
    const result=d.getElementById('result');
    if(result&&!result.hidden){
      const heading=d.getElementById('result-heading');
      if(heading&&heading.textContent!=='GAME SET')heading.textContent='GAME SET';
    }
  }
  frame.addEventListener('load',()=>{setTimeout(apply,60);setTimeout(apply,300);setTimeout(apply,900)});
  const timer=setInterval(apply,300);
  setTimeout(()=>clearInterval(timer),15000);
})();
