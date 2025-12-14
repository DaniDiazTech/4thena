#!/bin/sh

set -e

cd /app

echo "Installing dependencias"

pip install \
    --root-user-action ignore \
    --disable-pip-version-check \
    -q -r requirements.txt --no-cache-dir \

echo "Starting the application"

uvicorn src.main:app --host 0.0.0.0 --port ${PORT} --reload
