from pathlib import Path
import log.log_manager as log_manager
import re

logger = log_manager.get_logger()

replay_dir = Path("/home/app/replays")
VALID_ID_RE = re.compile(r"^[0-9]{1,32}$")

if not replay_dir.is_dir():
    raise FileNotFoundError(f"Directory {replay_dir} is not found")


def safe_replay_file_path(replay_id: str):
    if not VALID_ID_RE.fullmatch(replay_id):
        raise ValueError(f"invalid replay_id {replay_id!r} is requested")

    file_path = (replay_dir / replay_id).resolve(strict=False)
    if file_path.parent != replay_dir:
        raise ValueError(f"path traversal detected: {replay_id}")
    return file_path


class FileHandler:
    @staticmethod
    def store_replay_file(replay_id: str, rep_raw: bytes) -> dict:
        replay_file_path = safe_replay_file_path(replay_id)
        with replay_file_path.open("xb") as fp:
            fp.write(rep_raw)
        logger.info(f"filename {replay_file_path} is stored")
        return {"state": "success"}

    @staticmethod
    def delete_replay_file(replay_id: str) -> dict:
        replay_file_path = safe_replay_file_path(replay_id)
        replay_file_path.unlink()
        logger.info(f"filename {replay_file_path} is removed")
        return {"state": "success"}

    @staticmethod
    def get_replay_file_path(replay_id: str) -> dict:
        replay_file_path = safe_replay_file_path(replay_id)
        if not replay_file_path.is_file():
            return {"state": "replay_file_not_found_in_directory"}
        return {"state": "success", "path": str(replay_file_path)}

    @staticmethod
    def select_all_file_name() -> list:
        return [
            f.name
            for f in replay_dir.iterdir()
            if f.is_file() and VALID_ID_RE.fullmatch(f.name)
        ]

    @staticmethod
    def delete_replays(replay_ids: list):
        for replay_id in replay_ids:
            try:
                replay_file_path = safe_replay_file_path(replay_id)
            except ValueError:
                logger.warning(
                    f"try to delete replays: {replay_ids}, but invalid replay_id: {replay_id}"
                )
                continue

            try:
                replay_file_path.unlink()
            except FileNotFoundError:
                logger.warning(
                    f"try to delete replays: {replay_ids}, but not found. replay_id: {replay_id}"
                )
                continue

        logger.info(f"delete replays: {replay_ids}, delete replays")
