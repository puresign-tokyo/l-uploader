import logging
from logging import Formatter, Filter
from functools import cache

# from logging import _Level
from logging.handlers import RotatingFileHandler
from fastapi import Request

from log.client_ip import client_ip_context, real_client_ip_context


class ClientIpFilter(Filter):
    def filter(self, record):
        record.client_ip = client_ip_context.get()
        record.real_client_ip = real_client_ip_context.get()
        return True


@cache
def init_logger_alcostg(level: int):
    logging.basicConfig(level=level)

    logger = logging.getLogger("alcostg")
    logger.propagate = False

    handler = RotatingFileHandler(
        "/var/log/alcostg.log", maxBytes=1 * 1024 * 1024, backupCount=3
    )
    formatter = Formatter(
        "%(asctime)s - %(levelname)s - %(name)s - [%(real_client_ip)s][%(client_ip)s] %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.addFilter(ClientIpFilter())


def get_logger():
    logger = logging.getLogger("alcostg")
    logger.propagate = False
    return logger
