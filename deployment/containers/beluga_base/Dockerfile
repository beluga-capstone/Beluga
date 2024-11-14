FROM python:3.10
WORKDIR /app

COPY websocket-pty.py requirements.txt /app/
RUN pip install -r requirements.txt

EXPOSE 5000 
CMD ["python","websocket-pty.py"]
