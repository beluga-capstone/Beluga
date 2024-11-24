from enum import StrEnum

from beluga.core.cli import CliGroup, Beluga, beluga_cli
from beluga.plugins.services import api, db, ui

cli_group = CliGroup(beluga_cli.subparsers, "services")


class ServiceType(StrEnum):
    db = "db"
    api = "api"
    ui = "ui"


class Services(Beluga):
    """
    Helper functions for deploying standalone beluga services.
    """

    __slots__ = ("_api", "_db", "_ui")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._api = api.API(self._workspace)
        self._db = db.DB(self._workspace)
        self._ui = ui.UI(self._workspace)

    @cli_group.option(
        "--service-type", "-d", help="type of service to deploy", choices=ServiceType
    )
    @cli_group.option("--all", "-a", help="deploy all services", dest="_all")
    @cli_group.command()
    def deploy(self, service_type: ServiceType = None, _all: bool = False, **_):
        """
        Deploy service(s).
        """
        if service_type is None and _all is True:
            services = [getattr(ServiceType, t) for t in ServiceType]
        else:
            services = [ServiceType(service_type)]

        for service in services:
            match service:
                case ServiceType.db:
                    self._db.deploy()
                case ServiceType.api:
                    self._api.deploy()
                case ServiceType.ui:
                    self._db.deploy()

    @cli_group.option(
        "--service-type", "-d", help="type of service to deploy", choices=ServiceType
    )
    @cli_group.option("--all", "-a", help="deploy all services", dest="_all")
    @cli_group.command()
    def stop(self, service_type: ServiceType = None, _all: bool = False, **_):
        """
        Deploy service(s).
        """
        if service_type is None and _all is True:
            services = [getattr(ServiceType, t) for t in ServiceType]
        else:
            services = [ServiceType(service_type)]

        for service in services:
            match service:
                case ServiceType.db:
                    self._db.stop()
                case ServiceType.api:
                    self._api.stop()
                case ServiceType.ui:
                    self._db.stop()
