(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  let timer=null;
  const css=`
@media(min-width:1024px){
  .ui-pc-v18-left .card.score #score-label{
    font-size:0!important;
  }
  .ui-pc-v18-left .card.score #score-label>*{
    display:none!important;
  }
  .ui-pc-v18-left .card.score #score-label::before{
    content:'得点'!important;
    display:block!important;
    font-size:9px!important;
    line-height:1.1!important;
  }
  .ui-pc-v18-left .card.score #score-label::after{
    content:none!important;
    display:none!important;
  }

  .app.ui-pc-v18>.brand-button{
    top:19px!important;
    right:2px!important;
    height:22px!important;
    min-height:22px!important;
    padding:0!important;
    display:flex!important;
    align-items:flex-end!important;
    justify-content:flex-end!important;
    font-size:16px!important;
    line-height:1!important;
    letter-spacing:.06em!important;
  }
}
`;
  function apply(){
    let d;try{d=frame.contentDocument;}catch(_){return false;}
    if(!d?.head)return false;
    let style=d.getElementById('ui-v21-style');
    if(!style){style=d.createElement('style');style.id='ui-v21-style';d.head.append(style);}
    style.textContent=css;
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
