FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.docker.txt /app/requirements.docker.txt
RUN pip install --no-cache-dir -r /app/requirements.docker.txt

COPY . /app

COPY docker/entrypoint-wrapper.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh /app/docker/entrypoint.sh || true
RUN chmod +x /entrypoint.sh && chmod +x /app/docker/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD ["python", "config/manage.py", "runserver", "0.0.0.0:8000"]

