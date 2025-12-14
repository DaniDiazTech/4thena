ARG PYTHON_VERSION=3.12.7-alpine3.20
FROM python:${PYTHON_VERSION} AS base

WORKDIR /app

ARG PORT=8000
EXPOSE ${PORT}

CMD [ "scripts/start.sh" ]
