from pathlib import Path

runner = Path('tools/balance-diagnostics/runner.mjs')
readme = Path('tools/balance-diagnostics/README.md')
workflow = Path('.github/workflows/balance-diagnostic-runner.yml')

r = runner.read_text()

def rep(old, new, label):
    global r
    if old not in r:
        raise SystemExit(f'missing runner target: {label}')
    r = r.replace(old, new, 1)

rep(
"""const POLICIES=[
  {id:'tailored',label:'狙いビルド'},
  {id:'one-shot-first',label:'一時投入最優先'},
  {id:'no-one-shot',label:'一時投入なし'},
  {id:'score-first',label:'得点能力優先'},
  {id:'mixed',label:'混合基準'}
];""",
"""const POLICIES=[
  {id:'tailored',label:'狙いビルド'},
  {id:'one-shot-first',label:'一時投入最優先'},
  {id:'burst-plants-first',label:'植物+12優先'},
  {id:'burst-herbs-first',label:'草食+2優先'},
  {id:'no-one-shot',label:'一時投入なし'},
  {id:'score-first',label:'得点能力優先'},
  {id:'mixed',label:'混合基準'}
];""",
'policy list')

rep(
"""  if(policy.id==='one-shot-first')priority=uniq([...ONE_SHOT_IDS,...build.normal]);
  else if(policy.id==='no-one-shot'){""",
"""  if(policy.id==='one-shot-first')priority=uniq([...ONE_SHOT_IDS,...build.normal]);
  else if(policy.id==='burst-plants-first')priority=uniq(['N_BURST_PLANTS',...build.normal]);
  else if(policy.id==='burst-herbs-first')priority=uniq(['N_BURST_HERBS',...build.normal]);
  else if(policy.id==='no-one-shot'){""",
'individual burst policies')

rep(
"""      anchor_offer_rate:mean(rows.map(r=>r.anchor_offered?1:0)),preferred_pick_rate:mean(rows.map(r=>r.preferred_pick_rate)),target_stack_total_mean:mean(rows.map(r=>r.target_stack_total)),""",
"""      anchor_offer_rate:mean(rows.map(r=>r.anchor_offered?1:0)),preferred_pick_rate:mean(rows.map(r=>r.preferred_pick_rate)),target_stack_total_mean:mean(rows.map(r=>r.target_stack_total)),top_target_opportunities_mean:mean(rows.map(r=>r.top_target_opportunities)),""",
'aggregate build availability')

rep(
"""'| ビルド | 平均得点 | P10–P90 | 後半得点比 | 最終 植/草/肉 | 狙い能力取得率 |', '|---|---:|---:|---:|---:|---:|'""",
"""'| ビルド | 平均得点 | P10–P90 | 後半得点比 | 最終 植/草/肉 | 主要能力積み/10 | 初期SET出現率 |', '|---|---:|---:|---:|---:|---:|---:|'""",
'summary tailored header')

old_row = """| ${a.build_label} | ${Math.round(a.score_mean)} | ${Math.round(a.score_p10)}–${Math.round(a.score_p90)} | ${(a.late_share_mean*100).toFixed(1)}% | ${a.final_plants_mean.toFixed(1)} / ${a.final_herbs_mean.toFixed(1)} / ${a.final_carns_mean.toFixed(1)} | ${(a.preferred_pick_rate*100).toFixed(1)}% |"""
new_row = """| ${a.build_label} | ${Math.round(a.score_mean)} | ${Math.round(a.score_p10)}–${Math.round(a.score_p90)} | ${(a.late_share_mean*100).toFixed(1)}% | ${a.final_plants_mean.toFixed(1)} / ${a.final_herbs_mean.toFixed(1)} / ${a.final_carns_mean.toFixed(1)} | ${a.target_stack_total_mean.toFixed(2)} | ${(a.anchor_offer_rate*100).toFixed(1)}% |"""
rep(old_row, new_row, 'summary tailored row')

rep(
"""'| 初期SET | 狙いビルド | 一時最優先 | 一時なし | 得点優先 | 混合 |', '|---|---:|---:|---:|---:|---:|'""",
"""'| 初期SET | 狙いビルド | 一時最優先 | 植物+12優先 | 草食+2優先 | 一時なし | 得点優先 | 混合 |', '|---|---:|---:|---:|---:|---:|---:|---:|'""",
'one-shot table header')

rep(
"""['tailored','one-shot-first','no-one-shot','score-first','mixed']""",
"""['tailored','one-shot-first','burst-plants-first','burst-herbs-first','no-one-shot','score-first','mixed']""",
'one-shot policy table values')

rep(
"""- 一時投入最優先が各SET能力で一貫して勝つなら、一時投入が万能化していないか確認する。','- 一時投入なしが常に勝つなら、一時投入が弱すぎないか確認する。""",
"""- 一時投入最優先が各SET能力で一貫して勝つなら、一時投入が万能化していないか確認する。','- 植物+12優先 / 草食+2優先を比較し、片方だけ極端に弱い・強い状態がないか確認する。','- 一時投入なしが常に勝つなら、一時投入が弱すぎないか確認する。""",
'one-shot reading guidance')

runner.write_text(r)

rd = readme.read_text()
rd = rd.replace("""1. 狙いビルド
2. 一時投入最優先
3. 一時投入なし
4. 得点能力優先
5. 混合基準""", """1. 狙いビルド
2. 一時投入最優先
3. 植物+12優先
4. 草食+2優先
5. 一時投入なし
6. 得点能力優先
7. 混合基準""")
rd = rd.replace('8 × 5 × 30 = 1200', '8 × 7 × 30 = 1680')
rd = rd.replace("`一時投入最優先` と `一時投入なし` を `狙いビルド` と比較する。", "`一時投入最優先`、`植物+12優先`、`草食+2優先`、`一時投入なし` を `狙いビルド` と比較する。")
rd = rd.replace("- 一時投入なしが一貫して強い → 一時投入が弱すぎる疑い", "- 植物+12優先 / 草食+2優先の片方だけ明確に弱い → 個別の一時投入量を確認\n- 一時投入なしが一貫して強い → 一時投入が弱すぎる疑い")
rd = rd.replace("`preferred_pick_rate` は、そのビルドの主要通常能力が候補に出た機会のうち、主要能力を取得した割合。候補運そのものは `choices.csv` で確認する。", "`target_stack_total_mean` は、10回の通常能力取得のうち主要5能力を合計で何stack積めたかの平均。`anchor_offer_rate` は初期SET能力が実際の3択へ出た割合。候補運の詳細は `choices.csv` で確認する。")
readme.write_text(rd)

wf = workflow.read_text()
if ' -eq 1200' not in wf or ' -eq 14400' not in wf:
    raise SystemExit('missing workflow row-count targets')
wf = wf.replace(' -eq 1200', ' -eq 1680').replace(' -eq 14400', ' -eq 20160')
workflow.write_text(wf)

print('patched balance diagnostic runner v2')
