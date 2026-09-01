(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  let currentDoc=null,timer=null;
  const css=`
@media(max-width:639px){
  .overlay .choices .choice strong{font-size:11.5px!important;}
  .overlay .choices .choice span{font-size:8.8px!important;}
  #normal-choices .choice-stack{font-size:7.8px!important;}
  #normal-choices .choice-desc{font-size:8.8px!important;}
}
`;
  function apply(){
    let d;try{d=frame.contentDocument;}catch(_){return false;}
    if(!d?.head)return false;
    let style=d.getElementById('ui-v19-style');
    if(!style){style=d.createElement('style');style.id='ui-v19-style';d.head.append(style);}
    style.textContent=css;
    currentDoc=d;
    return true;
  }
  function wait(){
    if(timer)clearInterval(timer);
    let tries=0;
    timer=setInterval(()=>{
      tries++;
      if(apply()||tries>=120){clearInterval(timer);timer=null;}
    },100);
  }
  frame.addEventListener('load',()=>setTimeout(wait,50));
  wait();
})();
