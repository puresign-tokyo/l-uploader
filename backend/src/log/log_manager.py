import logging
from logging import Formatter, Filter
from functools import cache

# from logging import _Level
from logging import StreamHandler
from fastapi import Request

from log.client_ip import client_ip_context


class ClientIpFilter(Filter):
    def filter(self, record):
        record.client_ip = client_ip_context.get()
        return True


@cache
def init_logger_alcostg(level: int):
    logging.basicConfig(level=level)

    logger = logging.getLogger("th-uploader")
    logger.propagate = False

    handler = StreamHandler()

    formatter = Formatter(
        "%(asctime)s - %(levelname)s - %(name)s - [%(client_ip)s] %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.addFilter(ClientIpFilter())


def get_logger():
    logger = logging.getLogger("th-uploader")
    logger.propagate = False
    return logger
