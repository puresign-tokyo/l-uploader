export function useTableUtils() {
  const categoryMap: Record<string, { label: string, color: string}> = {
    score_run: { label: 'スコアアタック', color: 'lime-darken-2'},
    no_miss: { label: 'ノーミス', color: 'light-blue darken-3'},
    no_bomb: { label: 'ノーボム', color: 'deep-orange darken-3'},
    clear: { label: 'クリア', color: 'green darken-2'},
    others: { label: 'その他', color: 'grey'},
  }

  function convertCategory(categoryId: string) {
    return categoryMap[categoryId] ?? { label: '未分類', color: 'grey'}
  }


  const characterMap: Record<string, { color: string }>={
    Reimu:  { color: '#C62828' },
    Marisa: { color: '#FBC02D' },
    Youmu:  { color: '#546E7A' }
  }

  function convertCharacter(category_id: string) {
    return characterMap[category_id] ?? { color: 'grey'}
  }


  const replayTypeMap: Record<string, {label: string, color: string}> = {
    full_game:        { label: '通しプレイ',            color: 'indigo darken-3' },
    stage_practice:   { label: 'ステージプラクティス',  color: 'blue darken-2' },
    spell_practice:   { label: 'スペルプラクティス',    color: 'deep-purple darken-1' },
    player_vs_player: { label: '対戦モード',            color: 'grey darken-2' },
    cpu_vs_cpu:       { label: 'CPU観戦',               color: 'grey darken-2' },
    player_vs_cpu:    { label: 'CPU対戦モード',         color: 'grey darken-2' },
  }

  function convertReplayType(replay_type_id: string) {
    return replayTypeMap[replay_type_id] ?? {label: '不明なモードのリプレイ', color: 'grey'}
  }

  return {
    convertCategory,
    convertCharacter,
    convertReplayType
  }


}
