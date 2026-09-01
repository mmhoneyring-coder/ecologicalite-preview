(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  let currentDoc=null,waitTimer=null;
  const css=`
@media(max-width:639px){
  .spec-card.ui-v15-info .info-tier{padding:10px!important;margin-top:9px!important;}
  .spec-card.ui-v15-info .info-tier-head{grid-template-columns:30px minmax(0,1fr)!important;gap:9px!important;margin-bottom:8px!important;}
  .spec-card.ui-v15-info .info-tier-no{width:30px!important;height:30px!important;font-size:11px!important;}
  .spec-card.ui-v15-info .info-tier-head h2{font-size:15px!important;line-height:1.25!important;}
  .spec-card.ui-v15-info .info-details>summary{min-height:42px!important;font-size:12px!important;line-height:1.35!important;padding:0 3px!important;}
  .spec-card.ui-v15-info .info-details>summary::after{font-size:15px!important;}
  .spec-card.ui-v15-info .info-content{padding:0 3px 10px!important;}
  .spec-card.ui-v15-info .info-sub{padding:9px 0!important;}
  .spec-card.ui-v15-info .info-sub h3{margin-bottom:5px!important;font-size:10.5px!important;line-height:1.35!important;}
  .spec-card.ui-v15-info .info-sub p{font-size:10.5px!important;line-height:1.65!important;}
  .spec-card.ui-v15-info .info-pills{gap:5px!important;margin-top:6px!important;}
  .spec-card.ui-v15-info .info-pills span{padding:4px 7px!important;font-size:9.5px!important;line-height:1.2!important;}
  .spec-card.ui-v15-info .info-guide-steps{gap:6px!important;margin-top:6px!important;}
  .spec-card.ui-v15-info .info-guide-step{grid-template-columns:23px minmax(0,1fr)!important;gap:8px!important;padding:7px 8px!important;}
  .spec-card.ui-v15-info .info-guide-step b{width:23px!important;height:23px!important;font-size:9px!important;}
  .spec-card.ui-v15-info .info-guide-step span{font-size:10px!important;line-height:1.55!important;}
  .spec-card.ui-v15-info .info-stats{gap:6px!important;margin-top:6px!important;}
  .spec-card.ui-v15-info .info-stat{padding:7px 8px!important;}
  .spec-card.ui-v15-info .info-stat small{margin-bottom:3px!important;font-size:9px!important;line-height:1.25!important;}
  .spec-card.ui-v15-info .info-stat strong{font-size:11px!important;line-height:1.3!important;}
  .spec-card.ui-v15-info .info-table th,
  .spec-card.ui-v15-info .info-table td{padding:6px 4px!important;font-size:9.5px!important;line-height:1.4!important;}
}
@media(max-width:390px){
  .spec-card.ui-v15-info .info-tier-head h2{font-size:14px!important;}
  .spec-card.ui-v15-info .info-details>summary{font-size:11.5px!important;}
  .spec-card.ui-v15-info .info-sub h3{font-size:10px!important;}
  .spec-card.ui-v15-info .info-sub p{font-size:10px!important;}
  .spec-card.ui-v15-info .info-guide-step span{font-size:9.5px!important;}
  .spec-card.ui-v15-info .info-table th,
  .spec-card.ui-v15-info .info-table td{font-size:9px!important;}
}
`;
  function install(d){
    if(!d?.head||!d.getElementById('spec-overlay'))return false;
    let style=d.getElementById('ui-v17-style');
    if(!style){style=d.createElement('style');style.id='ui-v17-style';d.head.append(style);}
    style.textContent=css;
    currentDoc=d;
    return true;
  }
  function apply(){
    let d;try{d=frame.contentDocument;}catch(_){return false;}
    if(!d)return false;
    if(d!==currentDoc||!d.getElementById('ui-v17-style'))return install(d);
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
