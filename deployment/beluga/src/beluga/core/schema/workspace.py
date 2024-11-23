import dataclasses
import shutil
from dataclasses import dataclass, field
from enum import StrEnum
from ipaddress import IPv4Address, IPv4Network
from itertools import islice
from pathlib import Path
from secrets import token_hex
from typing import Iterable

import tomlkit as toml

from beluga.common.secrets import Secrets
from beluga.common.utils import get_beluga_root, get_project_root, pythonize_toml_dict
from beluga.core.schema.config import ConfigSchema

"""
Define workspace.toml schema.
"""


@dataclass(kw_only=True, slots=True)
class Meta:
    project_path: Path = field(default_factory=lambda: get_project_root())
    deploy_data: Path = field(
        default_factory=lambda: get_project_root().joinpath("data")
    )
    services: dict[str, Path]


@dataclass(kw_only=True, slots=True)
class Nginx:
    domain: str
    become: str = field(default="")
    cert_path: str


@dataclass(kw_only=True, slots=True)
class Network:
    base_ssh_port: int
    base_pty_port: int
    frontend_proxy_port: int
    backend_proxy_port: int


@dataclass(kw_only=True, slots=True)
class Settings:
    ipv4_range: IPv4Network
    become: str = ""
    install_path: Path = field(
        default_factory=lambda: get_project_root()
        .joinpath("data")
        .joinpath("deploy")
        .joinpath("virtual-machines")
    )
    vnetif: str

    def __post_init__(self):
        self.ipv4_range = IPv4Network(self.ipv4_range)
        if not isinstance(self.install_path, Path):
            self.install_path = Path(self.install_path)


class MachineType(StrEnum):
    containers = "containers"
    images = "images"
    local = "local"


@dataclass(kw_only=True, slots=True)
class Machine:
    name: str
    cores: int = 0
    memory: int = 0
    disk_size: int = 0
    type: MachineType
    ip: IPv4Address

    def __post_init__(self):
        self.type = MachineType(self.type)
        self.ip = IPv4Address(self.ip)

@dataclass(kw_only=True, slots=True)
class ContainerMachine(Machine):
    ports: list[str]
    image: str
    static_dir_key: str = field(default="")

    def __post_init__(self):
        if not self.static_dir_key:
            self.static_dir_key = token_hex(16)
        Machine.__post_init__(self)


@dataclass(kw_only=True, slots=True)
class VirtualMachines:
    settings: Settings
    registry: Machine
    container: Machine

    def __post_init__(self):
        self.settings = Settings(**self.settings)
        
        self.registry = Machine(**self.registry)
        self.container = Machine(**self.container)

    def all(self) -> list[Machine]:
        return [self.registry, self.container]


class WorkspaceSchema:
    __slots__ = ("remote", "__dict__")

    meta: Meta = Meta
    secrets: Secrets = Secrets
    network: Network = Network
    nginx: Nginx = Nginx
    virtual_machines: VirtualMachines = VirtualMachines

    def __init__(self, project_path: Path):
        with project_path.joinpath("workspace.toml").open("rb") as f:
            workspace = toml.load(f)
        workspace = pythonize_toml_dict(workspace)

        self.meta = Meta(
            services={
                p.parent.name: p.parent for p in project_path.glob("*/config.toml")
            }
        )

        template = (
            get_beluga_root()
            .joinpath("templates")
            .joinpath("project")
            .joinpath("secrets.toml")
        )
        dst = get_project_root().joinpath("secrets.toml")
        if not dst.exists():
            shutil.copyfile(template, dst)
        self.secrets = Secrets(project_path)

        for k in self.__annotations__:
            if hasattr(self, k):
                obj = getattr(self, k)
                if isinstance(obj, Meta) or isinstance(obj, Secrets):
                    continue
                if dataclasses.is_dataclass(obj):
                    setattr(self, k, obj(**workspace[k]))
            else:
                if v := workspace["workspace"].get(k):
                    setattr(self, k, v)
