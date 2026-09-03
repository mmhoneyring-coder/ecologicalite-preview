from pathlib import Path

checkpoint = "1d0d05ae05b11d7954fdd6db63ae1889757505c5"
snapshot = "snapshot/v1r-final-2026-09-04"

p = Path("README.md")
s = p.read_text()
s = s.replace("**状態: 開発完了 / バランス調整フェーズ**", "**状態: 完成**")
old = """## 完成基準

開発完了時点:

- commit: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`
- frozen branch: `snapshot/v1r-complete-2026-09-02`
- 完成日扱い: 2026-09-02

今後は原則として、必要に応じたバランス調整、不具合修正、軽微なUI修正を行う。
"""
new = f"""## 完成基準

最終完成判定: **2026-09-04**

- 最終ゲーム内容checkpoint: `{checkpoint}`
- final snapshot: `{snapshot}`
- 初回開発完了checkpoint: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`
- initial snapshot: `snapshot/v1r-complete-2026-09-02`

2026-09-04にUI・演出・通常能力・SET能力・得点設計まで再確認し、現行状態を完成版とした。以後は明確な不具合、または実プレイで具体的な改善理由が出た場合のみ修正し、能動的なUI・演出・バランス探索は行わない。
"""
if old not in s:
    raise SystemExit("README completion block not found")
p.write_text(s.replace(old, new))

p = Path("docs/SPEC.md")
s = p.read_text()
old = "状態: **開発完了 / バランス調整フェーズ**  \n正本化日: 2026-09-02  \n完成基準コミット: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`"
new = f"状態: **完成**  \n最終正本化日: 2026-09-04  \n最終ゲーム内容checkpoint: `{checkpoint}`  \n初回開発完了コミット: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`"
if old not in s:
    raise SystemExit("SPEC header not found")
p.write_text(s.replace(old, new))

p = Path("docs/BALANCE.md")
s = p.read_text()
old = "状態: **完成時点の基準値 / 今後の調整対象**  \n基準日: 2026-09-04  \n完成基準コミット: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`"
new = f"状態: **完成版の基準値**  \n基準日: 2026-09-04  \n最終ゲーム内容checkpoint: `{checkpoint}`  \n初回開発完了コミット: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`"
if old not in s:
    raise SystemExit("BALANCE header not found")
s = s.replace(old, new)
s = s.replace(
    "ここにある値は「完成時点の基準値」であり、今後のプレイ結果に応じて調整してよい。変更時は、原則としてゲームロジックを変えず数値だけを比較し、変更理由を `DEVELOPMENT_LOG.md` に残す。",
    "ここにある値を完成版の基準値とする。実プレイで具体的な違和感や不具合が確認された場合のみ再調整候補とし、変更時は原則としてゲームロジックを変えず数値だけを比較し、変更理由を `DEVELOPMENT_LOG.md` に残す。",
)
final_row = "| 2026-09-04 | 完成判定 | 草食一時投入+3採用後にSET能力単独100seed比較と組み合わせ傾向を確認。現行能力・基準得点・UI・演出に追加調整が必須となる問題はなく、現行値を完成版基準として固定 |"
if final_row not in s:
    s = s.rstrip() + "\n" + final_row + "\n"
p.write_text(s)

p = Path("docs/DEVELOPMENT_LOG.md")
s = p.read_text()
section = f"""

## 19. バランス確認完了と最終完成判定

2026-09-04、草食一時投入を+3へ調整した後、現行v1Rについて完成判定のための追加確認を行った。

SET能力は、通常能力の提示候補と選択を能力間で一致させ、SET1の6 STAGEだけを比較する100seedの単独診断を実施した。被食植物の再生は強めだが双子の誕生・肉食の獲物察知と競合できる範囲で、万能な突出は確認しなかった。危険察知は平均得点が低めでも捕食抑制と草食保護の役割が明確であり、単純な弱能力とは判断しなかった。

通常能力とSET能力の組み合わせにも差があり、双子・植物循環・肉食系などで相性が変わることを確認した。得点能力では繁殖得点が強くなりやすいが、「繁殖して生態系が拡大するほど高得点になる」というゲームの中心コンセプトと一致するため、現行の得点基礎値は変更しない。今後、実プレイで得点配分に具体的な違和感が出た場合は、能力そのものより基準得点を小幅に再検討する余地を残す。

UI・操作・演出についても、現時点で追加必須の項目はないと判断した。新しい演出を足すためだけの変更や、数値を揃えるための追加バランス調整は行わない。

以上から、EcologicaLite v1Rは **2026-09-04を最終完成日** とし、能動的な開発・バランス調整フェーズを終了する。以後は、明確な不具合または実プレイで具体的な改善理由が生じた場合のみ修正する。

- 最終ゲーム内容checkpoint: `{checkpoint}`
- final snapshot: `{snapshot}`
- 初回開発完了checkpoint: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`
"""
if "## 19. バランス確認完了と最終完成判定" not in s:
    s = s.rstrip() + section + "\n"
p.write_text(s)

p = Path("docs/HISTORY.md")
s = p.read_text()
old = """### 完成基準

- completion commit: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`
- frozen branch: `snapshot/v1r-complete-2026-09-02`

### 現在の扱い

**現行版。**

2026-09-02時点で開発完了とし、今後は必要に応じたバランス調整・不具合修正・軽微なUI修正を中心とする。
"""
new = f"""### 完成基準

- 最終完成日: 2026-09-04
- 最終ゲーム内容checkpoint: `{checkpoint}`
- final snapshot: `{snapshot}`
- 初回開発完了commit: `b565c8bfa580c2730b4ce1c4b08e71bb287cfc83`
- initial snapshot: `snapshot/v1r-complete-2026-09-02`

### 現在の扱い

**現行完成版。**

2026-09-04に追加バランス診断まで完了し、UI・演出・能力・得点を含む現行状態を完成版として固定した。能動的な開発・バランス探索は終了し、以後は明確な不具合または実プレイで具体的な改善理由が生じた場合のみ修正する。
"""
if old not in s:
    raise SystemExit("HISTORY completion block not found")
p.write_text(s.replace(old, new))
