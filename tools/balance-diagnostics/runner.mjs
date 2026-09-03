#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const repoRoot=path.resolve(__dirname,'../..');

function parseArgs(argv){
  const out={seeds:30,out:path.join(repoRoot,'artifacts','balance-diagnostics'),index:path.join(repoRoot,'index.html')};
  for(const arg of argv){
    if(arg.startsWith('--seeds='))out.seeds=Math.max(1,Number.parseInt(arg.slice(8),10)||30);
    else if(arg.startsWith('--out='))out.out=path.resolve(arg.slice(6));
    else if(arg.startsWith('--index='))out.index=path.resolve(arg.slice(8));
  }
  return out;
}

function loadRuntime(indexPath){
  const html=fs.readFileSync(indexPath,'utf8');
  const match=html.match(/<script id="v1r-runtime">([\s\S]*?)<\/script>/);
  if(!match)throw new Error('index.html から v1r-runtime を抽出できません');
  const sandbox={console};
  sandbox.globalThis=sandbox;
  vm.createContext(sandbox);
  vm.runInContext(`${match[1]}\n;globalThis.__BALANCE_V1R__=V1R;`,sandbox,{filename:'index.html#v1r-runtime',timeout:10000});
  if(!sandbox.__BALANCE_V1R__)throw new Error('V1R runtime の初期化に失敗しました');
  return sandbox.__BALANCE_V1R__;
}

const SCORE_IDS=['N_FEED_SCORE','N_BIRTH_SCORE','N_SURV_SCORE','N_HERB_SCORE','N_CARN_SCORE'];
const ONE_SHOT_IDS=['N_BURST_PLANTS','N_BURST_HERBS'];
const PERSISTENT_IDS=['N_ACTIVITY_PLANTS','N_HERB_GAIN','N_CARN_GAIN','N_HERB_CHILD','N_CARN_CHILD'];

const BUILDS=[
  {
    id:'stage-time',label:'時間延長・後半循環',anchor:'S_STAGE_TIME',
    normal:['N_ACTIVITY_PLANTS','N_HERB_GAIN','N_CARN_GAIN','N_HERB_CHILD','N_CARN_CHILD','N_BIRTH_SCORE','N_FEED_SCORE','N_SURV_SCORE','N_HERB_SCORE','N_CARN_SCORE','N_BURST_PLANTS','N_BURST_HERBS'],
    set2:['S_PLANT_LIFECYCLE','S_EATEN_PLANT_DORMANCY','S_DOUBLE_BIRTH','S_PREDATION_CORPSE','S_HERB_PLANT_SENSE','S_CARN_HIGH_HP_SENSE','S_HERB_DANGER_SENSE']
  },
  {
    id:'herb-plant-sense',label:'植物察知・草食摂食安定',anchor:'S_HERB_PLANT_SENSE',
    normal:['N_HERB_GAIN','N_HERB_CHILD','N_ACTIVITY_PLANTS','N_FEED_SCORE','N_HERB_SCORE','N_BIRTH_SCORE','N_SURV_SCORE','N_BURST_PLANTS','N_BURST_HERBS','N_CARN_GAIN','N_CARN_CHILD','N_CARN_SCORE'],
    set2:['S_HERB_DANGER_SENSE','S_EATEN_PLANT_DORMANCY','S_PLANT_LIFECYCLE','S_DOUBLE_BIRTH','S_STAGE_TIME','S_PREDATION_CORPSE','S_CARN_HIGH_HP_SENSE']
  },
  {
    id:'herb-danger-sense',label:'危険察知・草食生存繁殖',anchor:'S_HERB_DANGER_SENSE',
    normal:['N_HERB_CHILD','N_HERB_GAIN','N_ACTIVITY_PLANTS','N_SURV_SCORE','N_HERB_SCORE','N_BIRTH_SCORE','N_FEED_SCORE','N_BURST_HERBS','N_BURST_PLANTS','N_CARN_CHILD','N_CARN_GAIN','N_CARN_SCORE'],
    set2:['S_DOUBLE_BIRTH','S_HERB_PLANT_SENSE','S_PLANT_LIFECYCLE','S_EATEN_PLANT_DORMANCY','S_STAGE_TIME','S_CARN_HIGH_HP_SENSE','S_PREDATION_CORPSE']
  },
  {
    id:'plant-lifecycle',label:'植物周期・植物循環',anchor:'S_PLANT_LIFECYCLE',
    normal:['N_ACTIVITY_PLANTS','N_HERB_GAIN','N_HERB_CHILD','N_FEED_SCORE','N_HERB_SCORE','N_BIRTH_SCORE','N_BURST_HERBS','N_BURST_PLANTS','N_CARN_GAIN','N_CARN_CHILD','N_SURV_SCORE','N_CARN_SCORE'],
    set2:['S_EATEN_PLANT_DORMANCY','S_HERB_PLANT_SENSE','S_DOUBLE_BIRTH','S_STAGE_TIME','S_HERB_DANGER_SENSE','S_PREDATION_CORPSE','S_CARN_HIGH_HP_SENSE']
  },
  {
    id:'eaten-plant',label:'被食植物再生・摂食循環',anchor:'S_EATEN_PLANT_DORMANCY',
    normal:['N_HERB_GAIN','N_ACTIVITY_PLANTS','N_HERB_CHILD','N_FEED_SCORE','N_HERB_SCORE','N_BIRTH_SCORE','N_BURST_HERBS','N_BURST_PLANTS','N_SURV_SCORE','N_CARN_GAIN','N_CARN_CHILD','N_CARN_SCORE'],
    set2:['S_HERB_PLANT_SENSE','S_PLANT_LIFECYCLE','S_DOUBLE_BIRTH','S_STAGE_TIME','S_HERB_DANGER_SENSE','S_PREDATION_CORPSE','S_CARN_HIGH_HP_SENSE']
  },
  {
    id:'predation-corpse',label:'捕食還元・肉食死体循環',anchor:'S_PREDATION_CORPSE',
    normal:['N_CARN_GAIN','N_CARN_CHILD','N_ACTIVITY_PLANTS','N_CARN_SCORE','N_FEED_SCORE','N_BIRTH_SCORE','N_BURST_HERBS','N_SURV_SCORE','N_HERB_GAIN','N_HERB_CHILD','N_BURST_PLANTS','N_HERB_SCORE'],
    set2:['S_CARN_HIGH_HP_SENSE','S_DOUBLE_BIRTH','S_PLANT_LIFECYCLE','S_STAGE_TIME','S_EATEN_PLANT_DORMANCY','S_HERB_PLANT_SENSE','S_HERB_DANGER_SENSE']
  },
  {
    id:'double-birth',label:'双子・繁殖雪だるま',anchor:'S_DOUBLE_BIRTH',
    normal:['N_HERB_CHILD','N_CARN_CHILD','N_ACTIVITY_PLANTS','N_BIRTH_SCORE','N_HERB_GAIN','N_CARN_GAIN','N_SURV_SCORE','N_HERB_SCORE','N_CARN_SCORE','N_FEED_SCORE','N_BURST_HERBS','N_BURST_PLANTS'],
    set2:['S_HERB_PLANT_SENSE','S_CARN_HIGH_HP_SENSE','S_PLANT_LIFECYCLE','S_STAGE_TIME','S_EATEN_PLANT_DORMANCY','S_PREDATION_CORPSE','S_HERB_DANGER_SENSE']
  },
  {
    id:'carn-sense',label:'肉食察知・捕食繁殖',anchor:'S_CARN_HIGH_HP_SENSE',
    normal:['N_CARN_GAIN','N_CARN_CHILD','N_ACTIVITY_PLANTS','N_CARN_SCORE','N_FEED_SCORE','N_BIRTH_SCORE','N_BURST_HERBS','N_SURV_SCORE','N_HERB_GAIN','N_HERB_CHILD','N_BURST_PLANTS','N_HERB_SCORE'],
    set2:['S_PREDATION_CORPSE','S_DOUBLE_BIRTH','S_PLANT_LIFECYCLE','S_STAGE_TIME','S_EATEN_PLANT_DORMANCY','S_HERB_PLANT_SENSE','S_HERB_DANGER_SENSE']
  }
];

const POLICIES=[
  {id:'tailored',label:'狙いビルド'},
  {id:'one-shot-first',label:'一時投入最優先'},
  {id:'burst-plants-first',label:'植物+12優先'},
  {id:'burst-herbs-first',label:'草食+3優先'},
  {id:'no-one-shot',label:'一時投入なし'},
  {id:'score-first',label:'得点能力優先'},
  {id:'mixed',label:'混合基準'}
];

const GENERIC_MIXED=['N_ACTIVITY_PLANTS','N_HERB_GAIN','N_CARN_GAIN','N_HERB_CHILD','N_CARN_CHILD','N_BIRTH_SCORE','N_FEED_SCORE','N_SURV_SCORE','N_HERB_SCORE','N_CARN_SCORE','N_BURST_PLANTS','N_BURST_HERBS'];

function uniq(items){return [...new Set(items)];}
function rank(priority,id){const i=priority.indexOf(id);return i<0?1000:i;}
function chooseByPriority(offers,priority){return [...offers].sort((a,b)=>rank(priority,a)-rank(priority,b))[0];}

function chooseNormal(session,build,policy){
  const offers=session.offers();
  if(!offers.length)throw new Error('通常能力候補がありません');
  let priority=build.normal;
  if(policy.id==='one-shot-first')priority=uniq([...ONE_SHOT_IDS,...build.normal]);
  else if(policy.id==='burst-plants-first')priority=uniq(['N_BURST_PLANTS',...build.normal]);
  else if(policy.id==='burst-herbs-first')priority=uniq(['N_BURST_HERBS',...build.normal]);
  else if(policy.id==='no-one-shot'){
    const nonShot=offers.filter(id=>!ONE_SHOT_IDS.includes(id));
    if(nonShot.length)return {offers,chosen:chooseByPriority(nonShot,build.normal),priority:build.normal};
  }else if(policy.id==='score-first')priority=uniq([...SCORE_IDS,...build.normal]);
  else if(policy.id==='mixed'){
    const c=session.metrics();
    if(c.herbs<=2&&offers.includes('N_BURST_HERBS'))priority=['N_BURST_HERBS',...GENERIC_MIXED];
    else if(c.plants<=20&&offers.includes('N_BURST_PLANTS'))priority=['N_BURST_PLANTS',...GENERIC_MIXED];
    else priority=GENERIC_MIXED;
  }
  return {offers,chosen:chooseByPriority(offers,priority),priority};
}

function chooseSet2(session,build){
  const offers=session.setOffers();
  if(!offers.length)throw new Error('SET2能力候補がありません');
  return {offers,chosen:chooseByPriority(offers,build.set2)};
}

function mean(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:0;}
function median(a){if(!a.length)return 0;const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;}
function percentile(a,p){if(!a.length)return 0;const s=[...a].sort((x,y)=>x-y),i=Math.min(s.length-1,Math.max(0,Math.round((s.length-1)*p)));return s[i];}
function stdev(a){if(a.length<2)return 0;const m=mean(a);return Math.sqrt(mean(a.map(x=>(x-m)**2)));}
function sumBy(results,fn){return results.reduce((n,r)=>n+Number(fn(r)||0),0);}
function round(n,d=2){const p=10**d;return Math.round(Number(n||0)*p)/p;}
function csvEscape(value){const s=value===null||value===undefined?'':String(value);return /[",\n\r]/.test(s)?`"${s.replaceAll('"','""')}"`:s;}
function writeCsv(file,rows){
  if(!rows.length){fs.writeFileSync(file,'');return;}
  const columns=uniq(rows.flatMap(r=>Object.keys(r)));
  fs.writeFileSync(file,[columns.join(','),...rows.map(r=>columns.map(c=>csvEscape(r[c])).join(','))].join('\n'));
}
function stageIndex(r){return (Number(r.set)-1)*6+Number(r.stage)-1;}

function runOne({api,base,offerAbilities,build,policy,seed}){
  const initialOffers=offerAbilities(api.createEngine,base.values,seed);
  const session=V1R["./set1-session.mjs"].createRunSession(api,base,seed,build.anchor,2);
  const choiceRows=[{seed,build_id:build.id,build_label:build.label,policy_id:policy.id,policy_label:policy.label,type:'set',set:1,stage:1,offered_ids:initialOffers.join('|'),chosen_id:build.anchor,forced_anchor:true,anchor_offered:initialOffers.includes(build.anchor)}];
  let preferredOpportunities=0,preferredPicks=0,topTargetOpportunities=0,oneShotPicks=0,scorePicks=0,persistentPicks=0,set2='';
  const primaryTargets=build.normal.slice(0,5);

  while(!session.runDone){
    if(session.phase==='running'){
      session.step();
      continue;
    }
    if(session.phase==='stage-result'){
      const {offers,chosen,priority}=chooseNormal(session,build,policy);
      const offeredPrimary=offers.some(id=>primaryTargets.includes(id));
      const chosenPrimary=primaryTargets.includes(chosen);
      if(offeredPrimary)preferredOpportunities++;
      if(chosenPrimary)preferredPicks++;
      if(offers.includes(primaryTargets[0]))topTargetOpportunities++;
      if(ONE_SHOT_IDS.includes(chosen))oneShotPicks++;
      if(SCORE_IDS.includes(chosen))scorePicks++;
      if(PERSISTENT_IDS.includes(chosen))persistentPicks++;
      choiceRows.push({seed,build_id:build.id,build_label:build.label,policy_id:policy.id,policy_label:policy.label,type:'normal',set:session.set,stage:session.stage+1,offered_ids:offers.join('|'),chosen_id:chosen,chosen_rank:rank(priority,chosen)+1,primary_available:offeredPrimary,primary_picked:chosenPrimary,one_shot:ONE_SHOT_IDS.includes(chosen),score_ability:SCORE_IDS.includes(chosen)});
      session.beginNext(chosen);
      continue;
    }
    if(session.phase==='set-result'){
      const {offers,chosen}=chooseSet2(session,build);set2=chosen;
      choiceRows.push({seed,build_id:build.id,build_label:build.label,policy_id:policy.id,policy_label:policy.label,type:'set',set:2,stage:1,offered_ids:offers.join('|'),chosen_id:chosen,forced_anchor:false,anchor_offered:''});
      session.beginSet(chosen);
      continue;
    }
    throw new Error(`未知のphase: ${session.phase}`);
  }

  const results=session.results;
  const stageScores=Array(12).fill(0),plants=Array(12).fill(0),herbs=Array(12).fill(0),carns=Array(12).fill(0);
  for(const r of results){const i=stageIndex(r);stageScores[i]=r.score.total;plants[i]=r.counts.plants;herbs[i]=r.counts.herbs;carns[i]=r.counts.carns;}
  const set1=results.filter(r=>r.set===1),set2Results=results.filter(r=>r.set===2),final=results.at(-1);
  const earlyScore=sumBy(results,r=>r.stage<=3?r.score.total:0),lateScore=sumBy(results,r=>r.stage>=4?r.score.total:0);
  const targetStacks=Object.fromEntries(primaryTargets.map(id=>[id,Number(session.state.normalStacks[id]||0)]));
  const summary={
    seed,build_id:build.id,build_label:build.label,anchor_set:build.anchor,policy_id:policy.id,policy_label:policy.label,
    anchor_offered:initialOffers.includes(build.anchor),set2_ability:set2,
    run_score:session.runScore(),set1_score:sumBy(set1,r=>r.score.total),set2_score:sumBy(set2Results,r=>r.score.total),early_score:earlyScore,late_score:lateScore,late_score_share:(earlyScore+lateScore)?lateScore/(earlyScore+lateScore):0,
    final_plants:final?.counts?.plants||0,final_herbs:final?.counts?.herbs||0,final_carns:final?.counts?.carns||0,
    plant_eaten:sumBy(results,r=>r.events.plantEaten),herb_eaten:sumBy(results,r=>r.events.herbEaten),herb_births:sumBy(results,r=>r.events.herbBirths),carn_births:sumBy(results,r=>r.events.carnBirths),
    herb_natural_deaths:sumBy(results,r=>r.events.herbNaturalDeaths),carn_natural_deaths:sumBy(results,r=>r.events.carnNaturalDeaths),
    activity_plants:sumBy(results,r=>r.events.activityPlantsCreated),corpse_plants:sumBy(results,r=>r.events.corpsePlantsCreated),lifecycle_seeds:sumBy(results,r=>r.events.lifecycleSeedsCreated),regrown_plants:sumBy(results,r=>r.events.plantRegrown)+sumBy(results,r=>r.events.eatenPlantDormancyRegrow),
    one_shot_picks:oneShotPicks,score_picks:scorePicks,persistent_picks:persistentPicks,
    preferred_opportunities:preferredOpportunities,preferred_picks:preferredPicks,preferred_pick_rate:preferredOpportunities?preferredPicks/preferredOpportunities:0,top_target_opportunities:topTargetOpportunities,target_stack_total:Object.values(targetStacks).reduce((a,b)=>a+b,0),target_stacks:targetStacks,
    stage_scores:stageScores,stage_plants:plants,stage_herbs:herbs,stage_carns:carns,selected_normals:session.history.map(h=>h.id)
  };
  const stageRows=session.resultRows().map((row,i)=>({...row,build_id:build.id,build_label:build.label,anchor_set:build.anchor,policy_id:policy.id,policy_label:policy.label,stage_index:i+1}));
  return {summary,stageRows,choiceRows};
}

function aggregateRuns(runs){
  const groups=new Map();
  for(const r of runs){const key=`${r.build_id}|${r.policy_id}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
  const out=[];
  for(const [key,rows] of groups){
    const [buildId,policyId]=key.split('|'),first=rows[0];
    const score=rows.map(r=>r.run_score);
    out.push({
      build_id:buildId,build_label:first.build_label,anchor_set:first.anchor_set,policy_id:policyId,policy_label:first.policy_label,n:rows.length,
      score_mean:mean(score),score_median:median(score),score_p10:percentile(score,.1),score_p90:percentile(score,.9),score_sd:stdev(score),
      set1_mean:mean(rows.map(r=>r.set1_score)),set2_mean:mean(rows.map(r=>r.set2_score)),late_share_mean:mean(rows.map(r=>r.late_score_share)),
      final_plants_mean:mean(rows.map(r=>r.final_plants)),final_herbs_mean:mean(rows.map(r=>r.final_herbs)),final_carns_mean:mean(rows.map(r=>r.final_carns)),
      one_shot_picks_mean:mean(rows.map(r=>r.one_shot_picks)),score_picks_mean:mean(rows.map(r=>r.score_picks)),persistent_picks_mean:mean(rows.map(r=>r.persistent_picks)),
      anchor_offer_rate:mean(rows.map(r=>r.anchor_offered?1:0)),preferred_pick_rate:mean(rows.map(r=>r.preferred_pick_rate)),target_stack_total_mean:mean(rows.map(r=>r.target_stack_total)),top_target_opportunities_mean:mean(rows.map(r=>r.top_target_opportunities)),
      stage_score_mean:Array.from({length:12},(_,i)=>mean(rows.map(r=>r.stage_scores[i]))),
      stage_plants_mean:Array.from({length:12},(_,i)=>mean(rows.map(r=>r.stage_plants[i]))),
      stage_herbs_mean:Array.from({length:12},(_,i)=>mean(rows.map(r=>r.stage_herbs[i]))),
      stage_carns_mean:Array.from({length:12},(_,i)=>mean(rows.map(r=>r.stage_carns[i])))
    });
  }
  return out;
}

function trajectoryPairs(aggregates){
  const tailored=aggregates.filter(a=>a.policy_id==='tailored');
  const scales={
    plants:Math.max(1,...tailored.flatMap(a=>a.stage_plants_mean)),
    herbs:Math.max(1,...tailored.flatMap(a=>a.stage_herbs_mean)),
    carns:Math.max(1,...tailored.flatMap(a=>a.stage_carns_mean))
  };
  const pairs=[];
  for(let i=0;i<tailored.length;i++)for(let j=i+1;j<tailored.length;j++){
    const a=tailored[i],b=tailored[j];let path=0,n=0;
    for(let s=0;s<12;s++){
      path+=Math.abs(a.stage_plants_mean[s]-b.stage_plants_mean[s])/scales.plants;
      path+=Math.abs(a.stage_herbs_mean[s]-b.stage_herbs_mean[s])/scales.herbs;
      path+=Math.abs(a.stage_carns_mean[s]-b.stage_carns_mean[s])/scales.carns;n+=3;
    }
    const final=(Math.abs(a.final_plants_mean-b.final_plants_mean)/scales.plants+Math.abs(a.final_herbs_mean-b.final_herbs_mean)/scales.herbs+Math.abs(a.final_carns_mean-b.final_carns_mean)/scales.carns)/3;
    pairs.push({a:a.build_label,b:b.build_label,path_distance:path/n,final_distance:final});
  }
  return pairs.sort((x,y)=>y.path_distance-x.path_distance);
}

function buildMarkdown({seedCount,aggregates,pairs,meta}){
  const tailored=aggregates.filter(a=>a.policy_id==='tailored').sort((a,b)=>b.score_mean-a.score_mean);
  const byKey=new Map(aggregates.map(a=>[`${a.build_id}|${a.policy_id}`,a]));
  const lines=['# EcologicaLite v1R バランス診断','',`- seed数: ${seedCount}`,`- runtime version: ${meta.gameVersion}`,`- config hash: ${meta.configHash}`,'- 判定: 自動PASS/FAILなし。現状の問題有無を診断するための比較。','','## 狙いビルド','', '| ビルド | 平均得点 | P10–P90 | 後半得点比 | 最終 植/草/肉 | 主要能力積み/10 | 初期SET出現率 |', '|---|---:|---:|---:|---:|---:|---:|'];
  for(const a of tailored)lines.push(`| ${a.build_label} | ${Math.round(a.score_mean)} | ${Math.round(a.score_p10)}–${Math.round(a.score_p90)} | ${(a.late_share_mean*100).toFixed(1)}% | ${a.final_plants_mean.toFixed(1)} / ${a.final_herbs_mean.toFixed(1)} / ${a.final_carns_mean.toFixed(1)} | ${a.target_stack_total_mean.toFixed(2)} | ${(a.anchor_offer_rate*100).toFixed(1)}% |`);
  lines.push('','## 一時投入・通常能力方針比較','', '| 初期SET | 狙いビルド | 一時最優先 | 植物+12優先 | 草食+3優先 | 一時なし | 得点優先 | 混合 |', '|---|---:|---:|---:|---:|---:|---:|---:|');
  for(const b of BUILDS){
    const vals=['tailored','one-shot-first','burst-plants-first','burst-herbs-first','no-one-shot','score-first','mixed'].map(p=>byKey.get(`${b.id}|${p}`)?.score_mean||0);
    lines.push(`| ${b.label} | ${vals.map(v=>Math.round(v)).join(' | ')} |`);
  }
  lines.push('','## STAGE別平均得点（狙いビルド）','', '| ビルド | 1-1 | 1-2 | 1-3 | 1-4 | 1-5 | 1-6 | 2-1 | 2-2 | 2-3 | 2-4 | 2-5 | 2-6 |', '|---|'+Array(12).fill('---:').join('|')+'|');
  for(const a of tailored)lines.push(`| ${a.build_label} | ${a.stage_score_mean.map(v=>Math.round(v)).join(' | ')} |`);
  lines.push('','## 経路差','', '最終状態が似ていても、12 STAGEの植物・草食・肉食推移が違うかを見るための正規化距離。数値が大きいほど経路が異なる。','','| 組み合わせ | 経路差 | 最終差 |','|---|---:|---:|');
  for(const p of pairs.slice(0,8))lines.push(`| ${p.a} ↔ ${p.b} | ${p.path_distance.toFixed(3)} | ${p.final_distance.toFixed(3)} |`);
  lines.push('','### 経路差が小さい組み合わせ','', '| 組み合わせ | 経路差 | 最終差 |','|---|---:|---:|');
  for(const p of [...pairs].sort((a,b)=>a.path_distance-b.path_distance).slice(0,5))lines.push(`| ${p.a} ↔ ${p.b} | ${p.path_distance.toFixed(3)} | ${p.final_distance.toFixed(3)} |`);
  lines.push('','## 読み方','','- 終盤型は平均だけでなく、SET内S4–S6の伸びと好調seedでの上限を見る。','- 一時投入最優先が各SET能力で一貫して勝つなら、一時投入が万能化していないか確認する。','- 植物+12優先 / 草食+3優先を比較し、片方だけ極端に弱い・強い状態がないか確認する。','- 一時投入なしが常に勝つなら、一時投入が弱すぎないか確認する。','- 狙いビルドは「実際の通常3択」と「実際のSET2候補」から選ぶ。SET1能力だけ比較の軸として固定している。','- 最終状態が似ること自体は問題にせず、経路差と最終差を併記する。','- このランナーは数値を変更しない。');
  return lines.join('\n');
}

const opts=parseArgs(process.argv.slice(2));
fs.mkdirSync(opts.out,{recursive:true});
const V1R=loadRuntime(opts.index);
const {createEngine}=V1R['./core.mjs'];
const {pairedWorld,worldState}=V1R['./pairing.mjs'];
const {offerAbilities}=V1R['./session.mjs'];
const {loadConfig}=V1R['./environment.mjs'];
const base=await Promise.resolve(loadConfig());
const api={createEngine,pairedWorld,worldState};
const engine=createEngine(base.values);
const seeds=Array.from({length:opts.seeds},(_,i)=>`${base.worldSeedPrefix||'v1r-individual-363|run:'}${i+1}`);
const runs=[],stages=[],choices=[];

for(const build of BUILDS){
  if(!engine.SET_IDS.includes(build.anchor))throw new Error(`未知のSET能力: ${build.anchor}`);
  for(const policy of POLICIES){
    for(const seed of seeds){
      const out=runOne({api,base,offerAbilities,build,policy,seed});
      runs.push(out.summary);stages.push(...out.stageRows);choices.push(...out.choiceRows);
    }
  }
  console.log(`completed: ${build.label}`);
}

const aggregates=aggregateRuns(runs),pairs=trajectoryPairs(aggregates);
const meta={generatedAt:new Date().toISOString(),seedCount:opts.seeds,runCount:runs.length,gameVersion:engine.VERSION,configHash:stages[0]?.config_hash||'',sourceCommit:process.env.GITHUB_SHA||''};
const summary={meta,builds:BUILDS,policies:POLICIES,aggregates:aggregates.map(a=>({...a,score_mean:round(a.score_mean),score_median:round(a.score_median),score_p10:round(a.score_p10),score_p90:round(a.score_p90),score_sd:round(a.score_sd),late_share_mean:round(a.late_share_mean,4)})),trajectoryPairs:pairs.map(p=>({...p,path_distance:round(p.path_distance,5),final_distance:round(p.final_distance,5)}))};

writeCsv(path.join(opts.out,'runs.csv'),runs.map(r=>({...r,target_stacks:JSON.stringify(r.target_stacks),stage_scores:r.stage_scores.join('|'),stage_plants:r.stage_plants.join('|'),stage_herbs:r.stage_herbs.join('|'),stage_carns:r.stage_carns.join('|'),selected_normals:r.selected_normals.join('|')})));
writeCsv(path.join(opts.out,'stages.csv'),stages);
writeCsv(path.join(opts.out,'choices.csv'),choices);
fs.writeFileSync(path.join(opts.out,'runs.json'),JSON.stringify(runs,null,2));
fs.writeFileSync(path.join(opts.out,'summary.json'),JSON.stringify(summary,null,2));
fs.writeFileSync(path.join(opts.out,'SUMMARY.md'),buildMarkdown({seedCount:opts.seeds,aggregates,pairs,meta}));
console.log(`runs=${runs.length} stages=${stages.length} choices=${choices.length}`);
console.log(`output=${opts.out}`);
