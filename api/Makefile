PORT:=

run:
	waitress-serve --listen 127.0.0.1:${PORT} --call 'app:create_app' &

stop:
	pkill waitress-serve
