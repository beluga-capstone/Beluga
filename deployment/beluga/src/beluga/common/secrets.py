import hashlib
from pathlib import Path
from typing import Self

import tomlkit as toml
from Crypto.Cipher import ChaCha20_Poly1305
from Crypto.Random import get_random_bytes

from beluga.common.utils import pythonize_toml_dict


class EncEntry:
    __slots__ = ("_data", "_encrypted")

    _data: bytes
    _encrypted: bool

    @classmethod
    def init_to_decrypt(cls, ctx: str) -> Self:
        self = cls()
        self._data = bytes.fromhex(ctx)
        self._encrypted = True
        return self

    @classmethod
    def init_to_encrypt(cls, ptx: bytes, password: bytes) -> Self:
        self = cls()
        self._encrypted = False
        self._encrypt(ptx, password)
        return self

    def _decrypt(self, password: bytes):
        if self._encrypted:
            tag, nonce, ctx = self._data[:16], self._data[16:40], self._data[40:]
            cipher = ChaCha20_Poly1305.new(
                key=hashlib.blake2b(password, digest_size=32).digest(), nonce=nonce
            )
            self._data = cipher.decrypt_and_verify(ctx, tag)
            self._encrypted = False

    def _encrypt(self, ptx: bytes, password: bytes):
        if not self._encrypted:
            nonce = get_random_bytes(24)
            cipher = ChaCha20_Poly1305.new(
                key=hashlib.blake2b(password, digest_size=32).digest(),
                nonce=nonce,
            )
            ctx, tag = cipher.encrypt_and_digest(ptx)
            self._data = tag + nonce + ctx
            self._encrypted = True

    def get(self, password: bytes) -> bytes:
        self._decrypt(password)
        return self._data

    def get_encrypted(self, password: bytes) -> bytes:
        self._encrypt(self._data, password)
        return self._data


class Secrets:
    def __init__(self, project_path: Path):
        self._secrets_path = project_path.joinpath("secrets.toml")
        with self._secrets_path.open("rb") as f:
            secrets = pythonize_toml_dict(toml.load(f))["secrets"]

        for k in secrets.keys():
            if k == "encrypted":
                for k, v in secrets[k].items():
                    setattr(self, k, EncEntry.init_to_decrypt(v))
            else:
                setattr(self, k, secrets[k])

    def create_plain(self, entry: str, value: str):
        setattr(self, entry, value)
        self._write()

    def create_encrypted(self, entry: str, ptx: str, password: str):
        setattr(
            self,
            entry,
            EncEntry.init_to_encrypt(ptx, password),
        )
        self._write(password)

    def _write(password: str = ""):
        entries = {"secrets": {"encrypted": dict()}}
        for k in self.__dict__.keys():
            if k == "_secrets_path":
                continue
            entry = getattr(self, k)
            if isinstance(entry, EncEntry):
                entries["secrets"]["encrypted"][k] = entry.get_encrypted(password).hex()
            else:
                entries["secrets"][k] = entry

        with self._secrets_path.open("w") as f:
            toml.dump(entries, f)
