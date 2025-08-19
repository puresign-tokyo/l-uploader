import { useTableUtils } from "./TableUtils";

const equipmentMap: Record<string, { label: string }> = {
  Red: { label: "赤1" },
  Red2: { label: "赤2" },
  Blue: { label: "青1" },
  Blue2: { label: "青2" },
  Yellow: { label: "黄1" },
  Yellow2: { label: "黄2" },
  Green: { label: "緑1" },
  Green2: { label: "緑2" },
  Common: { label: "コモン" },
};

function convertShotType(shot_type_id: string) {
  let character;
  let character_id;
  let main_equipment_id;
  let main_equipment;
  if (shot_type_id.startsWith("Reimu")) {
    character_id = "Reimu";
    character = useTableUtils().convertCharacter(character_id);
    main_equipment_id = shot_type_id.slice(5);
    main_equipment = equipmentMap[main_equipment_id];
  } else if (shot_type_id.startsWith("Marisa")) {
    character_id = "Marisa";
    character = useTableUtils().convertCharacter(character_id);
    main_equipment_id = shot_type_id.slice(6);
    main_equipment = equipmentMap[main_equipment_id];
  } else {
    return { label: "Unknown", color: "white" };
  }

  if (main_equipment === undefined || character === undefined) {
    return { label: "Unknown", color: "white" };
  } else {
    return {
      label: character.label + "-" + main_equipment.label,
      color: character.color,
    };
  }
}

interface Th20Replay {
  replay_id: string;
  game_id: string;
  user_name: string;
  uploaded_at: string;
  upload_comment: string;
  category: string;
  optional_tag: string;
  filename: string;
  parser_version: string;
  replay_meta: {
    name: string;
    shot_type: string;
    difficulty: string;
    total_score: string;
    slowdown: string;
    timestamp: string;
    replay_type: string;
    spell_card_id: string;
    stage_details: [
      {
        stage: string;
        score: string | null;
        power: string | null;
        piv: string | null;
        lives: string | null;
        life_pieces: string | null;
        bombs: string | null;
        bomb_pieces: string | null;
        graze: string | null;
      }
    ];
  };
}

export function Th20Table(replay: Th20Replay) {
  let optional_division = null;
  if (replay.replay_meta.replay_type === "spell_card") {
    optional_division = {
      label:
        "スペルカードID：" +
        String(Number(replay.replay_meta.spell_card_id) + 1),
      color: "light-blue-darken-3",
    };
  }

  return {
    game_meta: {
      theme_color: "#BCEDF0",
      img: {
        thumb: "/images/thumb/th20.png",
        full: "/images/full/th20.png",
        alt: "th20",
      },
      name: "東方錦上京 〜 Fossilized Wonders.",
    },
    filename: replay.filename,
    uploaded_at: new Date(replay.uploaded_at).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    user_name: replay.user_name,
    total_score: Number(replay.replay_meta.total_score).toLocaleString(),
    replay_name: replay.replay_meta.name,
    slowdown: Number(replay.replay_meta.slowdown).toFixed(2) + "%",
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    difficulty: useTableUtils().convertDifficulty(
      replay.replay_meta.difficulty
    ),
    shot_type: convertShotType(replay.replay_meta.shot_type),
    optional_division: optional_division,
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: useTableUtils().convertReplayType(
      replay.replay_meta.replay_type
    ),
    category: useTableUtils().convertCategory(replay.category),
    replay_id: replay.replay_id,
    stage_details: {
      headers: [],
      items: [],
    },
  };
}
