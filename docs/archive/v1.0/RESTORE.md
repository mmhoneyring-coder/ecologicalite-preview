# v1.0 復元情報

状態: **FROZEN / 復元用**  
対象: 生態系シミュレートゲーム v1.0 PC完成版

この文書は、v1.0を現在のEcologicaLite v1Rとは独立して復元するための情報をまとめたもの。

## 1. 完成checkpoint

| 項目 | 値 |
|---|---|
| PC完成commit | `471e4466ce851ff598a87ff24c0a71dc8ec411ed` |
| commit message | `fix: harden PC browser QA flow` |
| 完成HTML SHA-256 | `29b9107cbc60b083394831539883fade8f58ef3bcf4a52f5350f463470cf0f47` |
| 得点仕様commit | `d935eeba5183c21bd2b7c6859468d509f90d5a20` |
| 得点仕様tag | `v1-score-spec-final-2026-08-29` |

v1.0の最終復元基準はPC完成commit `471e4466...`。

得点仕様commit `d935eeba...` は、その履歴中の正式得点Decisionとして参照する。

## 2. Google Driveの完成資産

### 完成HTML

- ファイル名: `ecosystem_v1.0_完成版.html`
- Drive file ID: `1KL7GtRwKhiMy7Vd4vY23MjLY81Vw70Sm`
- 完成時SHA-256: `29b9107cbc60b083394831539883fade8f58ef3bcf4a52f5350f463470cf0f47`

### 復元情報 / browser manifest

- ファイル名: `ecosystem_v1.0_復元情報.md`
- Drive file ID: `1T1_j18BYHMBrZr-hlc24IPQlTATz-9Cd`

### 完成ブラウザGit bundle

- Drive file ID: `1cuEK8NewRCiWoaPo7LsA5jcJ4RRysSJw`
- 完成時SHA-256: `bb2bfda705377868b74d52e745557047ce776c0d52fa085e445975dd04005eab`
- `git bundle verify` 済み

このbundleを、v1.0 PC完成コード履歴の主要な復元元とする。

## 3. 得点仕様の独立checkpoint

v1.0得点仕様だけを確認・復元するための保存物も残す。

### score final manifest

- ファイル名: `ecosystem-roguelite-v1-score-final-manifest.md`
- Drive file ID: `18ymFo-zwXsbik-4M6_lhKbzDXNbtMNn_`

### score final bundle

- ファイル名: `ecosystem-roguelite-v1-score-final.bundle`
- Drive file ID: `1hCNwjVfcmvzDXC3zwcR-lu6dKEa35r25`
- SHA-256: `f3f9c06c0b7029276fd2c204a898e77ec2736ab05efed7e60ff0aaf51a7daa0b`
- `git bundle verify` 済み

得点仕様:

- 基礎点 `1 / 25 / 25 / 110 / 4 / 10`
- 絶滅回避ボーナスなし
- STAGE番号倍率なし
- 得点能力5種
- 通常3択 = 得点能力1枠 + 生態系能力2枠

## 4. 推奨復元手順

1. Google Driveから完成browser bundleを取得する。
2. 取得したbundleのSHA-256が保存値と一致するか確認する。
3. `git bundle verify` でbundleを検証する。
4. bundleから新しい作業フォルダへcloneする。
5. `git rev-parse HEAD` で完成commitを確認する。
6. 必要に応じて `471e4466ce851ff598a87ff24c0a71dc8ec411ed` をcheckoutする。
7. 完成HTMLのSHA-256が `29b9107c...` と一致するか確認する。
8. 得点仕様だけを独立確認する場合はscore final bundle / manifestも参照する。

例:

```bash
git bundle verify ecosystem-roguelite-v1-browser.bundle
git clone ecosystem-roguelite-v1-browser.bundle ecosystem-v1.0
git -C ecosystem-v1.0 rev-parse HEAD
```

実際のbundle名は取得時の保存名に合わせる。

## 5. 復元後の判定

復元したv1.0は、現在のEcologicaLite v1Rと比較して値が違っていて正常。

特に次を混同しない。

- STAGE時間
- マップサイズ
- 初期個体数
- HP・移動周期
- 得点基礎点
- SET能力の種類・効果
- 通常能力の効果量
- モバイル対応状態

v1.0の仕様確認は同階層の [`SPEC.md`](./SPEC.md) を使う。

## 6. 保存ルール

v1.0の完成HTML、完成browser bundle、復元情報、最終得点Decisionは削除しない。

開発途中のcheckpoint bundleについては、後工程で「完成bundleから同じcommitへ復元可能か」を確認した後、重複保存物として削減してよい。

ただし削減作業は、完成版の復元テストを行う前には実施しない。
