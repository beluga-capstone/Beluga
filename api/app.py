import os
from src import create_app

config_name = os.getenv("CONFIG", "default")
app = create_app(config_name)

if __name__ == '__main__':
    app.run(host=app.config['FLASK_RUN_HOST'], port=app.config['FLASK_RUN_PORT'])