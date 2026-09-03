# 生態系シミュレーション案件の系譜

この文書は、生態系シミュレーション関連資産がどの系統に属するかを示す索引である。

現在のゲーム仕様は `SPEC.md`、現在の調整値は `BALANCE.md` を優先する。ここにある旧版・旧資料は、現在仕様へ値を持ち込むためではなく、開発経緯と復元先を識別するために残す。

## 1. 生態系箱庭シミュレーター

### 位置づけ

案件の最初期。

ブラウザ上で植物・草食・肉食・死体を動かし、個体数推移を眺めながらルールを調整する観察用シミュレーターとして開始した。

代表的な当時の条件には64×40マップ、植物300、草食40、肉食8等があるが、これらは現在のEcologicaLiteの値ではない。

### 主な資産

Google Drive archive:

- `生態系箱庭シミュレーター｜暫定仕様・検証・コード記録`
- 旧 `preview.html`
- 初期の比較・一括試験記録

`生態系箱庭シミュレーター｜基盤仕様・検証記録` は内容が空で、正本化対象となる情報はない。

### 現在の扱い

**開発史。**

現在仕様として参照しない。重要な知見のみ `DEVELOPMENT_LOG.md` へ移した。

---

## 2. v1 / v1.0

### 位置づけ

観察用シミュレーターを「能力を選びながら生態系を育て、得点を伸ばすゲーム」へ発展させた系統。

12 STAGE / 2 SET、SET能力、通常能力、6得点源など、後のv1Rへつながるゲーム構造を確立した。

2026-08-29のPCブラウザQA完了時点を **v1.0完成版** として区切った。

### 完成checkpoint

- PC完成commit: `471e4466ce851ff598a87ff24c0a71dc8ec411ed`
- 得点仕様commit: `d935eeba5183c21bd2b7c6859468d509f90d5a20`
- tag: `v1-score-spec-final-2026-08-29`

### 主なDrive構造

`01_v1.0_完成版`

- `ecosystem_v1.0_完成版.html`
- `ecosystem_v1.0_復元情報.md`
- `生態系シミュレートゲーム v1.0｜仕様・設計・検証整理（完成版）`

`99_archive/01_v1.0_開発履歴`

- baseline checkpoint
- new HP provisional checkpoint
- score fixed-slot candidate
- score validated
- score final
- 各manifest / Git bundle

### 現在の扱い

**独立した旧完成版として永久保存。**

v1Rの単なる途中版として上書きしない。

現在版の開発へ値を持ち込む場合は、v1Rで再採用されたことを確認する。v1.0だけに存在する値を現在仕様と誤認しない。

復元情報は `docs/archive/v1.0/` を参照する。

---

## 3. v1R seed / 独立runner期

### 位置づけ

v1.0完成後、「個体を追って見て楽しい」方向へ再設計するために分離した系統。

v1.0のGit履歴をそのまま継承せず、完成版をコード起点として独立したv1R repositoryを開始した。

### 目的

- マップを小さくし、個体を見やすくする。
- 移動テンポを落とす。
- 捕食・繁殖を盤面で追いやすくする。
- 厳密な均衡より繁栄の見た目を優先する。
- 新しい基礎生態系をrunnerで探索する。

### 主なDrive資産

`02_v1R_開発中`

- `v1R_README.md`
- `ecosystem_v1R_seed_from_v1.0.html`
- v1R runner群
- `ecosystem-v1R_current.bundle`
- `ecosystem-v1R_current_manifest.md`
- coarse search CSV / JSON
- 50Turn分析
- development timeline診断
- individual診断
- ability-screen等の検証資産

### 現在の扱い

**分析アーカイブ。**

現在のゲームコード正本ではないが、今後バランス調整を行う際に「以前どの条件を調べたか」「どの領域が破綻したか」を確認できるため保存価値が高い。

---

## 4. v1R実験checkpoint群

### 位置づけ

ミクロ寄り再設計の途中で作成した短期試験版。

### 代表例

`99_archive/02_v1R_実験履歴`

- microtest
- microexperience2
- microrhythm3
- microrhythm4-speedtune
- microrhythm7-carnstate
- microrhythm8-lifepulse
- 対応HTML
- 対応manifest
- 対応Git bundle

### 現在の扱い

**詳細実験履歴。**

正本ではない。重要な結論は `DEVELOPMENT_LOG.md` へ集約する。

最終Git履歴から復元可能であることを後工程で確認できれば、重複したbundle・HTMLの一部は削減候補とする。

---

## 5. EcologicaLite v1R

### 位置づけ

v1Rの生態系・ゲーム仕様を、スマホとPCで実際に遊べる完成ゲームへまとめた現行系統。

GitHub repository:

`mmhoneyring-coder/ecologicalite-preview`

### 主な完成要素

- 2 SET × 6 STAGE
- v1R向けの小型マップ
- 3/6/3の移動・HPテンポ
- 能力選択
- v1R得点
- seed再現
- Stage単位CSV
- 選択個体HP
- 得点グラフと詳細
- 取得能力説明
- ゲームガイド／詳細データ／内部仕様
- 同seedの「やり直し」
- 新seedの「最初から」
- スマホ実機レイアウト
- PC 3列レイアウト
- 1× / 4× / 8×再生

### 完成基準

- 最終完成日: 2026-09-04
- 最終ゲーム内容checkpoint: `1d0d05ae05b11d7954fdd6db63ae1889757505c5`
- final snapshot: `snapshot/v1r-final-2026-09-04`
- 初回開発完了commit: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`
- initial snapshot: `snapshot/v1r-complete-2026-09-02`

### 現在の扱い

**現行完成版。**

2026-09-04に追加バランス診断まで完了し、UI・演出・能力・得点を含む現行状態を完成版として固定した。能動的な開発・バランス探索は終了し、以後は明確な不具合または実プレイで具体的な改善理由が生じた場合のみ修正する。

現在仕様の正本:

- `docs/SPEC.md`
- `docs/BALANCE.md`
- `docs/DEVELOPMENT_LOG.md`

現在コードの正本:

- GitHub `main`

---

## 6. v2

v1/v1R開発中に、v2として別系統の構想・保留案が存在した。

v1Rはv2ではなく、v1.0から分岐したミクロ体験の再設計版である。

現時点でEcologicaLite v1R完成作業と一体化したv2実装は正本化しない。過去資料中の「v2送り」「将来案」は、明示的に再開するまで現在仕様へ混ぜない。

---

## 7. 正本優先順位

情報が矛盾した場合は、原則として次の順に優先する。

1. 現在のGitHub `main` の実装
2. `docs/SPEC.md` / `docs/BALANCE.md`
3. `docs/DEVELOPMENT_LOG.md`
4. v1Rの旧Google Docs・manifest・分析レポート
5. v1.0 archive
6. 最初期箱庭資料

ただし、文書と現在実装が意図せず食い違っている場合は「コードが正しい」と自動判定しない。完成時点のDecision・実装・再現テストを確認し、どちらを直すべきか判断する。

## 8. Google Docsの今後

Google Docsは開発中の一時的な仕様・検証・作業窓口として使用した。

正本化後は、Docを恒久的な開発ログ保管先にはしない。

重要な仕様・Decision・開発経緯をMarkdownへ移したことを確認してから、関連Google Docsは削除可能とする。旧完成HTML、Git bundle、分析用CSV/JSON等はDocsとは別に必要性を判断する。
