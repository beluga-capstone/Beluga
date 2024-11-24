import textwrap
from typing import Iterable

from beluga.common import run
from beluga.core.schema.workspace import (
    WorkspaceSchema,
    ContainerMachine,
)


class Docker:
    __slots__ = ("_workspace", "_registry", "_frontend")

    _workspace: WorkspaceSchema
    _registry: ContainerMachine

    def __init__(self, workspace: WorkspaceSchema):
        self._workspace = workspace
        self._registry = self._workspace.virtual_machines.registry

    def setup_context(self):
        for vm in self._workspace.virtual_machines.all():
            run.context.run_cmd(
                textwrap.dedent(
                    f"""
                    docker context create {vm.name}
                        --docker "host=ssh://{vm.name}"
                    """
                )
            )
        
    def setup_registry(self):
        self._pull_image(
            name="registry",
            image="registry:2",
            ports=["5000"],
            context=self._registry.name,
        )

    def setup_base_image(self, vm_name: str, containers: Iterable[str] = [], verbose: bool = False):
        pass

    def _pull_image(
        self,
        name: str,
        image: str,
        ports: Iterable[str],
        context: str,
        runtime: str = "",
    ):
        ports = " ".join((f"-p {p}" if ":" in p else f"-p {p}:{p}" for p in ports))

        run.context.run_cmd(f"docker pull {image}")
        run.context.run_cmd(
            f"docker save {image} | gzip | docker --context {context} load", shell=True
        )
        run.context.run_cmd(
            f"docker --context {context} run {runtime} --restart=always -d {ports} --name {name} {image}"
        )

    def _push_image(
        self,
        context: str,
        registry: str,
        image: str,
    ):
        tag = f"{registry}{image}"
        run.context.run_cmd(f"docker image tag {image} {tag}")
        run.context.run_cmd(f"docker push {tag}")
        run.context.run_cmd(f"docker --context {context} pull {tag}")

