import signal
import subprocess
import sys
import time

children: list[subprocess.Popen[bytes]] = []
shutting_down = False


def terminate_children() -> None:
    for child in children:
        if child.poll() is None:
            child.terminate()
    deadline = time.monotonic() + 10
    for child in children:
        while child.poll() is None and time.monotonic() < deadline:
            time.sleep(0.1)
        if child.poll() is None:
            child.kill()


def handle_signal(signum: int, _frame: object) -> None:
    global shutting_down
    shutting_down = True
    terminate_children()
    raise SystemExit(128 + signum)


def main() -> int:
    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)

    cron = subprocess.Popen([sys.executable, "/app/cron_runner.py"])
    app = subprocess.Popen([sys.executable, "/app/app.py"])
    children.extend([cron, app])

    while not shutting_down:
        app_code = app.poll()
        cron_code = cron.poll()
        if app_code is not None:
            terminate_children()
            return app_code
        if cron_code is not None:
            terminate_children()
            return cron_code or 1
        time.sleep(1)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
