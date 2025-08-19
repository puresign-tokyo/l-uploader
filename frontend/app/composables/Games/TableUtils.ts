export function useTableUtils() {
  const categoryMap: Record<string, { label: string; color: string }> = {
    score_run: { label: "スコアアタック", color: "lime-darken-2" },
    no_miss: { label: "ノーミス", color: "light-blue darken-3" },
    no_bomb: { label: "ノーボム", color: "deep-orange darken-3" },
    clear: { label: "クリア", color: "green darken-2" },
    others: { label: "その他", color: "grey" },
  };

  function convertCategory(categoryId: string) {
    return categoryMap[categoryId] ?? { label: "未分類", color: "grey" };
  }

  const characterMap: Record<string, { label: string; color: string }> = {
    Reimu: { label: "霊夢", color: "#C62828" },
    Marisa: { label: "魔理沙", color: "#FBC02D" },
    Sakuya: { label: "咲夜", color: "#4169E1" },
    Youmu: { label: "妖夢", color: "#546E7A" },
    Reisen: { label: "鈴仙", color: "#C4A3BF" },
    Cirno: { label: "チルノ", color: "#00FFFF" },
    Aya: { label: "文", color: "#FF7043" },
    Sanae: { label: "早苗", color: "#00FF00" },
  };

  function convertCharacter(category_id: string) {
    return characterMap[category_id] ?? { color: "grey" };
  }

  const difficultyMap: Record<string, { label: string; color: string }> = {
    0: { label: "Easy", color: "blue lighten-2" },
    1: { label: "Normal", color: "green" },
    2: { label: "Hard", color: "orange darken-1" },
    3: { label: "Lunatic", color: "red darken-2" },
    4: { label: "Extra", color: "deep-purple darken-2" },
  };

  function convertDifficulty(difficulty_id: string) {
    return difficultyMap[difficulty_id] ?? { label: "Unknown", color: "grey" };
  }

  const replayTypeMap: Record<string, { label: string; color: string }> = {
    full_game: { label: "通しプレイ", color: "indigo darken-3" },
    stage_practice: { label: "ステージプラクティス", color: "blue darken-2" },
    spell_card: { label: "スペルプラクティス", color: "deep-purple darken-1" },
    player_vs_player: { label: "対戦モード", color: "grey darken-2" },
    cpu_vs_cpu: { label: "CPU観戦", color: "grey darken-2" },
    player_vs_cpu: { label: "CPU対戦モード", color: "grey darken-2" },
  };

  function convertReplayType(replay_type_id: string) {
    return replayTypeMap[replay_type_id] ?? { label: "不明", color: "grey" };
  }

  return {
    convertCategory,
    convertCharacter,
    convertDifficulty,
    convertReplayType,
  };
}
