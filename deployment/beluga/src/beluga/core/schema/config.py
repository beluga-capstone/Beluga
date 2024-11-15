from dataclasses import dataclass, field
from enum import StrEnum
from pathlib import Path
from typing import Optional, Pattern

import mistletoe
import tomlkit as toml

from beluga.common.utils import pythonize_toml_dict

@dataclass(kw_only=True, slots=True)
class Settings:
    deploy: bool 


class NginxType(StrEnum):
    site = "site"


class NginxBalanceMethod(StrEnum):
    proxy_hash = "hash $proxy_protocol_addr"
    ip_hash = "ip_hash"
    least_conn = "least_conn"


@dataclass(kw_only=True, slots=True)
class Nginx:
    balance_method: NginxBalanceMethod
    instances: int

    def __post__init(self):
        self.balance_method = NginxBalanceMethod(self.balance_method)


@dataclass(kw_only=True, slots=True)
class Service:
    name: str
    port: int
    type: NginxType


class ConfigSchema:
    __slots__ = (
        "name",
        "settings",
        "__dict__"
    )

    name: str
    settings: Settings
    service: Optional[Service]
    nginx: Optional[Nginx]

    def __init__(self, service_path: Path):
        with service_path.joinpath("config.toml").open("rb") as f:
            config = toml.load(f)
        config = pythonize_toml_dict(config)
    
        self.settings = Settings(dist=dist, **config["nginx"])
        self.nginx = Nginx(**config["nginx"])
        self.service = Service(**config["service"])

        assert self.service
        assert self.nginx

