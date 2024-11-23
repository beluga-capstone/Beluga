from dataclasses import dataclass
from pathlib import Path

import tomlkit as toml

from beluga.common.utils import pythonize_toml_dict


@dataclass(kw_only=True, slots=True)
class Settings:
    subdomain: str


@dataclass(kw_only=True, slots=True)
class Nginx:
    port: int


@dataclass(kw_only=True, slots=True)
class Environ:
    host: str
    port: int


class ConfigSchema:
    __slots__ = (
        "name",
        "settings",
        "__dict__"
    )

    name: str
    settings: Settings
    nginx: Nginx
    environ: Environ

    def __init__(self, service_path: Path):
        with service_path.joinpath("config.toml").open("rb") as f:
            config = toml.load(f)
        config = pythonize_toml_dict(config)
    
        self.settings = Settings(**config["settings"])
        self.nginx = Nginx(**config["nginx"])
        self.environ = Environ(**config["environ"])
