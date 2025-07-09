import { useTableUtils } from "./TableUtils"

const routeMap: Record<string, {label: string, color: string} | null>={
  // 色の基準はステージセレクトの色から
  'A-1': {label: 'A-1ルート', color: 'light-green-darken-2'},
  'A-2': {label: 'A-2ルート', color: 'light-green-darken-2'},
  'B-1': {label: 'B-1ルート', color: 'cyan-darken-1'},
  'B-2': {label: 'B-2ルート', color: 'cyan-darken-1'},
  'C-1': {label: 'C-1ルート', color: 'pink-accent-1'},
  'C-2': {label: 'C-2ルート', color: 'pink-accent-1'},
}

function convertRoute(route_id: string){
  if (route_id==='extra'){
    return null
  }
  return routeMap[route_id] || {label: 'Unknown', color: 'white'}
}

interface Th128Replay{
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
    difficulty: string,
    route: string,
    total_score: string,
    slowdown: string,
    timestamp: string,
    replay_type: string,
    stage_details: [
      {
        stage: string,
        score: string | null,
        motivation: string | null,
        perfect_freeze: string | null,
        frozen_area: string | null,
        graze: string | null,
      }
    ]
  }
}

export function Th128Table(replay: Th128Replay){

  return{
    game_meta:{
      theme_color: '#00C8C8',
      img: {
        thumb: '/images/thumb/th128.png',
        full: '/images/full/th128.png',
        alt: 'th128'
      },
      name: '妖精大戦争 〜 東方三月精'
    },
    filename: replay.filename,
    uploaded_at: new Date(replay.uploaded_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    user_name: replay.user_name,
    total_score: Number(replay.replay_meta.total_score).toLocaleString(),
    replay_name: replay.replay_meta.name,
    slowdown: (Number(replay.replay_meta.slowdown)).toFixed(2) + '%',
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString('ja-JP', {year:'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}),
    difficulty: useTableUtils().convertDifficulty(replay.replay_meta.difficulty),
    shot_type: null,
    optional_division: convertRoute(replay.replay_meta.route),
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: useTableUtils().convertReplayType(replay.replay_meta.replay_type),
    category: useTableUtils().convertCategory(replay.category),
    replay_id: replay.replay_id,
    stage_details: {
      headers: [
        {
          title: 'ステージ',
          key: 'stage',
          sortable: false,
          fixed: true,
        },
        {
          title: 'スコア',
          key: 'score',
          sortable: false,
        },
        {
          title: 'やる気',
          key: 'motivation',
          sortable: false,
        },
        {
          title: 'パーフェクトフリーズ',
          key: 'perfect_freeze',
          sortable: false,
        },
        {
          title: 'こおらせた面積',
          key: 'frozen_area',
          sortable: false,
        },
        {
          title: 'グレイズ',
          key: 'graze',
          sortable: false,
        },
      ],
      items: replay.replay_meta.stage_details.map(stage => {
        let stageLabel
        if (stage.stage !== null){
          switch(String(stage.stage)){
            case '1':
              stageLabel = 'A-1'
              break
            case '2':
              stageLabel = 'A1-2'
              break
            case '3':
              stageLabel = 'A1-3'
              break
            case '4':
              stageLabel = 'A2-2'
              break
            case '5':
              stageLabel = 'A2-3'
              break
            case '6':
              stageLabel = 'B-1'
              break
            case '7':
              stageLabel = 'B1-2'
              break
            case '8':
              stageLabel = 'B1-3'
              break
            case '9':
              stageLabel = 'B2-2'
              break
            case '10':
              stageLabel = 'B2-3'
              break
            case '11':
              stageLabel = 'C-1'
              break
            case '12':
              stageLabel = 'C1-2'
              break
            case '13':
              stageLabel = 'C1-3'
              break
            case '14':
              stageLabel = 'C2-2'
              break
            case '15':
              stageLabel = 'C2-3'
              break
            case '16':
              stageLabel = 'Ex'
              break
            default:
              stageLabel = '-'
          }
        }else{
          stageLabel = '-'
        }

        return {
          stage: stageLabel,
          score: stage.score !== null ? Number(stage.score).toLocaleString() : '-',
          motivation: stage.motivation !== null ? String(Math.floor(Number(stage.motivation)/100)) + '%' : '-',
          perfect_freeze: stage.perfect_freeze !== null ? String(Math.floor(Number(stage.perfect_freeze)/100)) + '%' : '-',
        frozen_area: stage.frozen_area ? String(Math.floor(Number(stage.frozen_area))) + '%' : '-',
          graze: stage.graze !== null ? Number(stage.graze).toLocaleString() : '-',
        }
      })
    }
  }
}