export function Releases() {
  // 要素番号が小さいものほど最新であるようにすること
  const releases = [
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
