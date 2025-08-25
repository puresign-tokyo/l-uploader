export function Releases() {
  // 要素番号が小さいものほど最新であるようにすること
  const releases = [
    {
      version: "1.0.4",
      date: "2025-08-26",
      changes: ["ロード中画面の表示"],
    },
    {
      version: "1.0.3",
      date: "2025-08-25",
      changes: [
        "th6～th9までをth06のようにナンバリングを2桁にしていて、リプレイファイルが正しくゲームに読み込めまれなかったことの修正",
      ],
    },
    {
      version: "1.0.2",
      date: "2025-08-23",
      changes: ["虹龍洞と錦上京のスペカ名が間違って表示されることの修正"],
    },
    {
      version: "1.0.1",
      date: "2025-08-23",
      changes: ["錦上京のスペカ名が表示されるようになった"],
    },
    {
      version: "1.0.0",
      date: "2025-08-23",
      changes: ["それっぽく公開"],
    },
  ];
  return releases;
}
