ARG PYTHON_VERSION=3.12.7-alpine3.20
FROM python:${PYTHON_VERSION} AS base

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt --no-cache-dir

EXPOSE 8000

CMD [ "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000" ]
