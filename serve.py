#!/usr/bin/env python3
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HOST = "127.0.0.1"
PORT = 8000
ROOT = Path(__file__).resolve().parent / "prototype"

if not (ROOT / "index.html").exists():
    raise SystemExit(f"Prototype index not found: {ROOT / 'index.html'}")

handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
server = ThreadingHTTPServer((HOST, PORT), handler)

print(f"DEFENSOR prototype: http://{HOST}:{PORT}/")
print(f"Serving only: {ROOT}")
print("Press Ctrl+C to stop.")

try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
