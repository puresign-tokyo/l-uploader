#!/usr/bin/env bash
set -euo pipefail

cd /workspace/l-uploader

mkdir -p backend/src/parsers/py_code
find backend/src/parsers/threp-ksy -name "*.ksy" -exec \
  kaitai-struct-compiler -t python --outdir backend/src/parsers/py_code {} \;
