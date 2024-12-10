from beluga.core.cli import CliGroup, Beluga, beluga_cli

import psycopg2

cli_group = CliGroup(beluga_cli.subparsers, "users")

class Users(Beluga):
    __slots__ = ("_constr")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        db = self._workspace.services.db
        self._constr = f"postgresql://beluga:{db.pwd}@127.0.0.1:{db.port}/{db.db}"

    @cli_group.option(
        "--email", "-e", help="Make user with email a professor"
    )
    @cli_group.command()
    def make_student(self, email: str, **_):
        conn = psycopg2.connect(self._constr)
        cursor = conn.cursor()
        cursor.execute(f'UPDATE "user" SET role_id = 8 WHERE email = \'{email}\'')
        conn.commit()
        cursor.close()

    @cli_group.option(
        "--email", "-e", help="Make user with email a professor"
    )
    @cli_group.command()
    def make_prof(self, email: str, **_):
        conn = psycopg2.connect(self._constr)
        cursor = conn.cursor()
        cursor.execute(f'UPDATE "user" SET role_id = 2 WHERE email = \'{email}\'')
        conn.commit()
        cursor.close()

    @cli_group.option(
        "--email", "-e", help="Make user with email a professor"
    )
    @cli_group.command()
    def make_admin(self, email: str, **_):
        conn = psycopg2.connect(self._constr)
        cursor = conn.cursor()
        cursor.execute(f'UPDATE "user" SET role_id = 1 WHERE email = \'{email}\'')
        conn.commit()
        cursor.close()
