(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  let currentDoc=null,timer=null;
  const css=`
@media(min-width:1024px){
  .app.ui-pc-v18{align-items:stretch!important;}

  .ui-pc-v18-left,
  .ui-pc-v18-right{
    height:auto!important;
    min-height:0!important;
    padding:0!important;
    align-self:stretch!important;
  }

  .ui-pc-v18-left>.stage{
    flex:0 0 60px!important;
    height:60px!important;
    min-height:60px!important;
    padding:7px 10px!important;
    border:1px solid var(--line)!important;
    border-radius:10px!important;
    background:var(--panel)!important;
    box-shadow:none!important;
  }

  .ui-pc-v18-left>.graph-panel{
    flex:1 1 auto!important;
    min-height:0!important;
  }

  .ui-pc-v18-right>.abilities-panel{
    flex:1 1 auto!important;
    min-height:0!important;
  }

  .ui-pc-v18-right>.bottom-runtime-actions{
    flex:0 0 40px!important;
    height:40px!important;
    min-height:40px!important;
    max-height:40px!important;
  }

  .ui-pc-v18-right>.bottom-runtime-actions button,
  .ui-pc-v18-right>.bottom-runtime-actions #back,
  .ui-pc-v18-right>.bottom-runtime-actions #new-run{
    height:40px!important;
    min-height:40px!important;
    max-height:40px!important;
    line-height:38px!important;
  }
}
`;
  function apply(){
    let d;try{d=frame.contentDocument;}catch(_){return false;}
    if(!d?.head)return false;
    let style=d.getElementById('ui-v20-style');
    if(!style){style=d.createElement('style');style.id='ui-v20-style';d.head.append(style);}
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
