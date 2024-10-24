FROM python:3.9-slim

WORKDIR /api-test

COPY . /api-test

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python3", "app.py"]