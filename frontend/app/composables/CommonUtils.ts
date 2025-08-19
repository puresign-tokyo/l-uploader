export function CommonUtils() {
  const gameMap: Record<string, { name: string }> = {
    th06: { name: "東方紅魔郷 ～ the Embodiment of Scarlet Devil." },
    th07: { name: "東方妖々夢 ～ Perfect Cherry Blossom." },
    th08: { name: "東方永夜抄 ～ Imperishable Night." },
    th09: { name: "東方花映塚 ～ Phantasmagoria of Flower View." },
    th95: { name: "東方文花帖 ～ Shoot the Bullet." },
    th10: { name: "東方風神録 ～ Mountain of Faith." },
    th11: { name: "東方地霊殿 ～ Subterranean Animism." },
    th12: { name: "東方星蓮船 ～ Undefined Fantastic Object." },
    th125: { name: "ダブルスポイラー ～ 東方文花帖" },
    th128: { name: "妖精大戦争 ～ 東方三月精" },
    th13: { name: "東方神霊廟 ～ Ten Desires." },
    th14: { name: "東方輝針城 ～ Double Dealing Character." },
    th143: { name: "弾幕アマノジャク ～ Impossible Spell Card." },
    th15: { name: "東方紺珠伝 ～ Legacy of Lunatic Kingdom." },
    th16: { name: "東方天空璋 ～ Hidden Star in Four Seasons." },
    th165: { name: "秘封ナイトメアダイアリー ～ Violet Detector." },
    th17: { name: "東方鬼形獣 ～ Wily Beast and Weakest Creature." },
    th18: { name: "東方虹龍洞 ～ Unconnected Marketeers" },
    th20: { name: "東方錦上京 ～ Fossilized Wonders." },
  };

  function convertGameId(game_id: string) {
    return gameMap[game_id] ?? { name: "不明なゲーム" };
  }

  return { convertGameId };
}
