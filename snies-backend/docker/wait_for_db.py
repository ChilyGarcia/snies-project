import os
import socket
import time


def wait_for_port(host: str, port: int, timeout_seconds: int = 60) -> None:
    start = time.time()
    while True:
        try:
            with socket.create_connection((host, port), timeout=2):
                return
        except OSError:
            if time.time() - start > timeout_seconds:
                raise RuntimeError(
                    f"Database not reachable at {host}:{port} after {timeout_seconds}s"
                )
            time.sleep(1)


if __name__ == "__main__":
    host = os.getenv("DB_HOST", "db")
    port = int(os.getenv("DB_PORT", "5432"))
    timeout = int(os.getenv("DB_WAIT_TIMEOUT", "60"))
    wait_for_port(host, port, timeout_seconds=timeout)

