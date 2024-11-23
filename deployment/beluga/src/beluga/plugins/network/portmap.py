from __future__ import annotations

import json
import socket
from dataclasses import asdict, dataclass, field
from ipaddress import IPv4Address
from pathlib import Path
from typing import Any, Self, cast

from beluga.core.schema.config import ConfigSchema
from beluga.core.schema.workspace import (
    Machine,
    MachineType,
    WorkspaceSchema,
)


@dataclass(kw_only=True, slots=True)
class Service:
    name: str
    port: int
    ssl_proxy: int
    type: NginxType
    
    def __post_init__(self):
        if not isinstance(self.type, NginxType):
            self.type = NginxType(self.type)

    def serialize(self) -> dict[str, Any]:
        return {self.name: {k: getattr(self, k) for k in self.__slots__ if k != "name"}}


@dataclass(kw_only=True, slots=True)
class Portmap:
    vm: str
    ip: IPv4Address
    services: list[Service] = field(default_factory=list)

    @classmethod
    def from_json(cls, path: Path) -> Self:
        with path.open() as f:
            portmap_json = json.load(f)

        services = (k for k in portmap_json.keys() if k not in cls.__annotations__)
        self = cls(vm=portmap_json["vm"], ip=portmap_json["ip"])

        for s, v in services.items():
            if s in Service.__slots__:
                continue
            self.services.append(Service(name=s, **v))

        return self

    def add_service(self, service: Service):
        self.service.append(service)

    def serialize(self) -> dict[str, Any]:
        services = [i.serialize() for i in self.services]
        builder = dict()

        builder["vm"] = self.vm
        builder["ip"] = str(self.ip)

        for s in services:
            builder.update(**s)
        return builder


class PortmapBuilder:
    __slots__ = ("_workspace", "_service_port", "_portmap_path")

    _workspace: WorkspaceSchema
    _chal_port: Port
    _portmap_path: Path

    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace
        self._service_port = Port(self._workspace.network.base_service_port)
        self._portmap_path = self._workspace.meta.deploy_data.joinpath("portmaps")
        self._portmap_path.mkdir(parents=True, exist_ok=True)

    def build(self, vm: Machine) -> Portmap:
        portmap = Portmap(vm=vm.name, ip=vm.ip)
