from pathlib import Path
import log.log_manager as log_manager
import os

logger = log_manager.get_logger()

replay_dir = Path("/home/app/replays")
if not replay_dir.is_dir():
    raise FileNotFoundError(f"Directory {replay_dir} is not found")


class FileHandler:
    @staticmethod
    def store_replay_file(replay_id: str, rep_raw: bytes) -> dict:
        replay_file_path = replay_dir / replay_id
        if replay_file_path.is_file():
            raise FileExistsError(
                f"Cannot save file {replay_id} — file already exists."
            )
        with replay_file_path.open("xb") as fp:
            fp.write(rep_raw)
        logger.info(f"filename {replay_file_path} is stored")
        return {"state": "success"}

    @staticmethod
    def delete_replay_file(replay_id: str) -> dict:
        replay_file_path = replay_dir / replay_id
        if not replay_file_path.is_file():
            logger.warning(
                f"Replay file missing at deletion attempt: path={replay_file_path}, File may have been already removed or corrupted."
            )
        os.remove(replay_file_path)
        logger.info(f"filename {replay_file_path} is removed")
        return {"state": "success"}

    @staticmethod
    def get_replay_file_path(replay_id: str) -> dict:
        replay_file_path = replay_dir / replay_id
        if not replay_file_path.is_file():
            return {"state": "replay_file_not_found_in_directory"}
        return {"state": "success", "path": str(replay_file_path)}

    @staticmethod
    def select_all_file_name() -> list:
        return [
            f.name for f in replay_dir.iterdir() if f.is_file() and f.name.isdigit()
        ]

    @staticmethod
    def delete_replays(replay_ids: list):
        for replay_id in replay_ids:
            replay_file_path = replay_dir / replay_id
            if not replay_file_path.is_file():
                logger.warning(
                    f"try to delete replays: {replay_ids}, but not found. replay_id: {replay_id}"
                )
                continue
            os.remove(replay_file_path)
        logger.info(f"delete replays: {replay_ids}, delete replays")
