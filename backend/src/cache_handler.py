from redis.client import Redis
from getenv import getenv_secure
import json
import threading
from log.log_manager import get_logger
from typing import cast

logger = get_logger()

REDIS_HOST = getenv_secure("REDIS_HOST")
REDIS_PORT = int(getenv_secure("REDIS_PORT"))
REDIS_USER = getenv_secure("REDIS_USER")
REDIS_PASS = getenv_secure("REDIS_PASS")

NAMESPACE_CACHE = "cache"
NAMESPACE_COUNTER = "counter"

WINDOW_COUNTER_LUA = """
local c = redis.call('INCR', KEYS[1])
if c == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return c
"""


class CacheClient:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._inited = False

        return cls._instance

    def __init__(self):
        with type(self)._lock:
            if self._inited:
                return
            self.redis_client = Redis(
                host=REDIS_HOST,
                port=REDIS_PORT,
                username=REDIS_USER,
                password=REDIS_PASS,
                decode_responses=True,
            )

            logger.info("create redis client")
            self._inited = True

    def insert_if_not_exists(self, key: str, value, expire_sec: int):

        str_value = json.dumps(value)

        wrote = self.redis_client.set(
            f"{NAMESPACE_CACHE}:{key}", str_value, nx=True, ex=expire_sec
        )
        if wrote:
            logger.info(f"key {key} is registered in redis. value: {str_value}")
        else:
            logger.info(f"key {key} is already exists. skip registering")

    def get(self, key: str):
        cached_value = self.redis_client.get(f"{NAMESPACE_CACHE}:{key}")
        logger.info(f"key {key} fetched in redis. value: {cached_value}")
        if cached_value is None:
            logger.info(f"key {key} is not registed in redis")
            return None
        return json.loads(cached_value)  # type: ignore

    def delete_prefix_list(self, key_prefix: str, kind: str):
        if kind == "cache":
            namespace = NAMESPACE_CACHE
        elif kind == "counter":
            namespace = NAMESPACE_COUNTER
        else:
            raise ValueError(f"invalid redisdb kind: {kind}")
        deleted = 0
        logger.info(
            f"trying to delete keys in redis. key_prefix: {namespace}:{key_prefix}"
        )

        for key in self.redis_client.scan_iter(match=f"{namespace}:{key_prefix}*"):
            self.redis_client.delete(key)
            deleted += 1
            logger.info(f"Deleted redis key: {key}")
        logger.info(f"deleted {deleted} registrations.")

    def delete(self, key: str, kind: str):
        if kind == "cache":
            namespace = NAMESPACE_CACHE
        elif kind == "counter":
            namespace = NAMESPACE_COUNTER
        else:
            raise ValueError(f"invalid redisdb kind: {kind}")
        logger.info(f"trying to delete key in redis. key: {namespace}:{key}")
        deleted = self.redis_client.delete(f"{namespace}:{key}")
        if deleted:
            logger.info(f"delete {key} in redis.")
        else:
            logger.info(f"cannot delete {key} in redis. also didn't exists.")

    def counter(self, key: str, window_sec: int):

        register_key = f"{NAMESPACE_COUNTER}:{key}"
        logger.info(f"key {register_key} was setted.")

        count = self.redis_client.eval(
            WINDOW_COUNTER_LUA, 1, register_key, str(window_sec)
        )

        count = int(cast(str, count))

        logger.info(f"key {register_key} was incremented. count: {count}")

        return count
