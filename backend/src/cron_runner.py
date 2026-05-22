import datetime as dt
import logging
import time
from urllib import request

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

JOBS = (
    ("POST", "http://localhost:5001/internal/integrity_sync"),
    ("DELETE", "http://localhost:5001/internal/replays"),
)
RUN_AT_UTC = dt.time(hour=5, minute=0, tzinfo=dt.timezone.utc)


def seconds_until_next_run(now: dt.datetime) -> float:
    next_run = dt.datetime.combine(now.date(), RUN_AT_UTC)
    if next_run <= now:
        next_run += dt.timedelta(days=1)
    return (next_run - now).total_seconds()


def run_job(method: str, url: str) -> None:
    req = request.Request(url, method=method)
    try:
        with request.urlopen(req, timeout=300) as response:
            logging.info("%s %s -> %s", method, url, response.status)
    except Exception:
        logging.exception("%s %s failed", method, url)


def main() -> None:
    while True:
        delay = seconds_until_next_run(dt.datetime.now(dt.timezone.utc))
        logging.info("next scheduled maintenance run in %.0f seconds", delay)
        time.sleep(delay)
        for method, url in JOBS:
            run_job(method, url)


if __name__ == "__main__":
    main()
