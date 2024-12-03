from functools import cache
from pathlib import Path
from typing import Any

from beluga.common import run


@cache
def get_project_root() -> Path:
    stdout, status = run.context.run_cmd("git worktree list", poll_stdout = False)
    if status:
        return Path(stdout.decode().split()[0])
    else:
        return Path.cwd()


@cache
def get_beluga_root() -> Path:
    return Path(__file__).parent.parent


def snake_case(value: str) -> str:
    return value.replace("-", "_").lower()


def kebab_case(value: str):
    return value.replace("_", "-")


def pythonize_toml_dict(d: dict[str, Any]) -> dict[str, Any]:
    new_dict = dict()
    for k, v in d.items():
        new_key = snake_case(k)
        if isinstance(v, dict):
            new_dict[new_key] = pythonize_toml_dict(v)
        else:
            new_dict[new_key] = v
    return new_dict
