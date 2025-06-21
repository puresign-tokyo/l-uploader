import { useTableUtils } from "./TableUtils"

const shotTypeMap: Record<string, {label: string, color: string}> = {
  Reimu:      useTableUtils().convertCharacter('Reimu'),
  Marisa:     useTableUtils().convertCharacter('Marisa'),
  Sakuya:     useTableUtils().convertCharacter('Sakuya'),
  Youmu:      useTableUtils().convertCharacter('Youmu'),
  Reisen:     useTableUtils().convertCharacter('Reisen'),
  Cirno:      useTableUtils().convertCharacter('Cirno'),
  Lyrica:     {label: 'リリカ',     color: '#FF0000'},
  Mystia:     {label: 'ミスティア', color: '#A04F62'},
  Tewi:       {label: 'てゐ',       color: '#FFE4C4'},
  Yuuka:      {label: '幽香',       color: '#32CD32'},
  Aya:        useTableUtils().convertCharacter('Aya'),
  Medicine:   {label: 'メディスン', color: '#FFD700'},
  Komachi:    {label: '小町',       color: '#D33E43'},
  Eiki:       {label: '映姫',       color: '#2A306E'},
  Merlin:     {label: 'メルラン',   color: '#D6D2EC'},
  Lunasa:     {label: 'ルナサ',     color: '#35132F'}
}

function convertShotType(shot_type_id: string){
  return shotTypeMap[shot_type_id] || {label: 'Unknown', color: 'white'}
}

interface Th09Replay{
  replay_id: string,
  game_id: string,
  user_name: string,
  uploaded_at: string,
  upload_comment: string,
  category: string,
  optional_tag: string,
  filename: string,
  replay_meta: {
    name: string,
    shot_type: string,
    difficulty: string,
    total_score: string,
    timestamp: string,
    replay_type: string,
    stage_details: [
      {
        stage: string,
        score: string | null,
        lives: string | null,
        bombs: string | null,
        p1_cpu: string | null,
        p2_cpu: string | null,
        p2_shot: string | null,
        p2_score: string | null,
      }
    ]
  }
}

export function Th09Table(replay: Th09Replay){

  return{
    game_meta:{
      theme_color: '#FF9900',
      img: {img: '/images/th09.png', alt: 'th09'},
      name: '東方花映塚 〜 Phantasmagoria of Flower View.'
    },
    filename: replay.filename,
    uploaded_at: new Date(replay.uploaded_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    user_name: replay.user_name,
    total_score: Number(replay.replay_meta.total_score).toLocaleString(),
    replay_name: replay.replay_meta.name,
    // 処理落ち率がリプレイ内にない
    slowdown: null,
    // 年月日の情報しか入っていない
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString('ja-JP', {year:'numeric', month: '2-digit', day: '2-digit'}),
    difficulty: useTableUtils().convertDifficulty(replay.replay_meta.difficulty),
    shot_type: convertShotType(replay.replay_meta.shot_type),
    optional_division: null,
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: useTableUtils().convertReplayType(replay.replay_meta.replay_type),
    category: useTableUtils().convertCategory(replay.category),
    replay_id: replay.replay_id
  }
}