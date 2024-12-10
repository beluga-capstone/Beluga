import hashlib
from enum import StrEnum
from getpass import getpass
from typing import IO

from beluga.common.secrets import EncEntry
from beluga.core.cli import CliGroup, Beluga, beluga_cli

cli_group = CliGroup(beluga_cli.subparsers, "secrets")


class SecretsType(StrEnum):
    plain = "plain"
    encrypted = "encrypted"


class Secrets(Beluga):
    """
    Beluga secrets service.
    """

    @staticmethod
    def _get_scret(prompt: str = "Password") -> IO[bytes]:
        return getpass(f"[Beluga Secrets] {prompt.capitalize()}: ").encode()

    @staticmethod
    def _verified_secret(prompt: str = "Password") -> IO[bytes]:
        first = Secrets._get_secret(prompt)
        second = Secrets._get_secret(f"Verify {prompt.lower()}")

        first_hash = hashlib.blake2b(first).digest()
        second_hash = hashlib.blake2b(second).digest()
        if first_hash == second_hash:
            return second
        raise Exception(f"[Beluga Secrets] {prompt.capitalize()} does not match")

    @cli_group.option("--entry", "-e", help="name of entry")
    @cli_group.option(
        "--type", "-t", help="type of entry", choices=SecretsType, dest="etype"
    )
    @cli_group.command()
    def add(self, entry: str, etype: SecretsType, **_):
        """
        Add a new entry to secrets service.
        """
        prompt = f"value for {entry}"
        match SecretsType(etype):
            case SecretsType.plain:
                self._workspace.secrets.create_plain(
                    entry, input(f"{prompt.capitalize()}: ")
                )
            case SecretsType.encrypted:
                self._workspace.secrets.create_encrypted(
                    entry, self._get_secret(prompt), self._verified_secret()
                )

    @cli_group.option("--entry", "-e", help="name of entry")
    @cli_group.command()
    def get(self,entry: str, **_) -> str:
        """
        Get entry from secrets service.
        """
        entry_obj: str | EncEntry = getattr(self._workspace.secrets, entry)
        if isinstance(entry_obj, str):
            print(entry_obj)
        else:
            print(entry_obj.get(self._get_secret()).decode())


cli_group.parser.description = Secrets.__doc__
