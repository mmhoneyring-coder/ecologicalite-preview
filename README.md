# EcologicaLite v1R

植物・草食・肉食の循環を観察しながら、能力選択によって生態系を育てる私用ブラウザゲーム。

**状態: 開発完了 / バランス調整フェーズ**

## Play

GitHub Pages:

https://mmhoneyring-coder.github.io/ecologicalite-preview/

PCとスマホは同じゲーム状態・同じシミュレーションを使用し、画面幅に応じてレイアウトだけを変更する。

## 完成基準

開発完了時点:

- commit: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`
- frozen branch: `snapshot/v1r-complete-2026-09-02`
- 完成日扱い: 2026-09-02

今後は原則として、必要に応じたバランス調整、不具合修正、軽微なUI修正を行う。

## ゲーム概要

- 2 SET × 6 STAGE = 12 STAGE
- 植物・草食・肉食・死体による生態系
- 能力選択による間接介入
- SET能力 + 通常能力
- 摂食・捕食・繁殖・生存を評価する得点
- seedによる再現
- 同seedの「やり直し」と新seedの「最初から」
- STAGE単位の分析CSVコピー
- 個体選択とHP表示
- 得点グラフ
- 取得能力の効果説明
- ゲームガイド / 詳細データ / 内部仕様
- 再生速度 1× / 4× / 8×

## 正本ドキュメント

現在仕様・履歴は以下を正本とする。

- [現在仕様](docs/SPEC.md)
- [現在のバランス基準値](docs/BALANCE.md)
- [主要な開発記録](docs/DEVELOPMENT_LOG.md)
- [生態系シミュレーション案件の系譜](docs/HISTORY.md)
- [v1.0完成仕様アーカイブ](docs/archive/v1.0/SPEC.md)
- [v1.0復元情報](docs/archive/v1.0/RESTORE.md)

旧Google Docs、旧runner、旧manifest、途中HTML等は履歴・検証資料であり、現在仕様の正本にはしない。

## v1.0との関係

v1.0は2026-08-29に一度完成したPCブラウザ版であり、現在のv1Rとは別の完成版として保存する。

v1Rはv1.0を土台に、マップ・移動テンポ・HP・繁栄設計を「個体を追って見て楽しい」方向へ再設計した系統。既存のv2構想とは別物。

## 現在のコード構成

`index.html` が唯一の正式runtimeであり、GitHub Pagesのルートから直接起動する。

現在の実行経路:

```text
index.html
```

- iframeは使用しない。
- `preview.html`、`base.html`、`ui-vXX`等へのruntime依存はない。
- PCとスマートフォンは、同一のゲーム状態・同一の実装を共有し、responsive配置だけを切り替える。

## バランス調整のルール

数値だけを調整する場合:

1. 現在値を `docs/BALANCE.md` で確認する。
2. 変更前後を同一seed等で比較する。
3. RNG・得点計算・ゲーム構造を意図せず変更していないことを確認する。
4. 採用した変更値を `BALANCE.md` に反映する。
5. 意味のある理由・検証結果を `DEVELOPMENT_LOG.md` に残す。

平均得点を揃えること自体を目的にはせず、循環、繁栄、難易度、失敗リスク、得点上限、能力相性を併せて評価する。

## 公開について

GitHub Pagesは実機確認・私用プレイのための配信経路として使用する。ページには検索エンジン向けの `noindex / nofollow / noarchive` を設定している。
