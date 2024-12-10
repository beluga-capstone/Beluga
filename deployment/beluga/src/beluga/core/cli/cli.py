import argparse
import functools
import inspect
from typing import Callable, Optional, cast

from beluga.common.utils import snake_case


class Cli:
    __slots__ = ("parser", "subparsers", "subparser")

    parser: argparse.ArgumentParser
    subparsers: argparse._SubParsersAction
    subparser: Optional[argparse.ArgumentParser]

    def __init__(self, *args, **kwargs):
        self.parser = argparse.ArgumentParser(*args, **kwargs)
        self.subparsers = self.parser.add_subparsers()
        self.subparser = None

    def parse_str_list(self, arg: str) -> list[str]:
        return [i.strip() for i in arg.strip().split(",")]

    def command(self, name: str = ""):
        def inner(func: Callable):
            if name:
                _name = name
            else:
                _name = func.__name__
            
            self.subparser = self.subparsers.add_parser(
                _name, help=func.__doc__, description=func.__doc__
            )

            self.subparser = cast(argparse.ArgumentParser, self.subparser)

            if len(cls := func.__qualname__.split(".")) > 1:
                self.subparser.set_defaults(cls=cls[-2])
            self.subparser.set_defaults(func=func)

            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                return func(*args, **kwargs)

            return wrapper

        return inner

    def option(self, *fmt, dest: str = "", **kwargs):
        def inner(func: Callable):
            p = self.parser if self.subparser is None else self.subparser
            arg = inspect.signature(func).parameters[
                    dest if dest else snake_case(fmt[0].lstrip("-"))
            ]

            if dest:
                kwargs["dest"] = dest
            else:
                kwargs["dest"] = arg.name

            if arg.default is not inspect.Parameter.empty:
                kwargs["default"] = arg.default
            else:
                kwargs["required"] = True

            if arg.annotation is bool:
                p.add_argument(*fmt, action=argparse.BooleanOptionalAction, **kwargs)
            elif arg.annotation == list[str]:
                kwargs["type"] = self.parse_str_list
                if res := kwargs.get("help"):
                    kwargs["help"] = res + "\n(comma separated list e.g. 1,2,3)"
                else:
                    kwargs["help"] = res + "(comma separated list e.g. 1,2,3)"
                p.add_argument(*fmt, **kwargs)
            else:
                kwargs["type"] = arg.annotation
                p.add_argument(*fmt, **kwargs)

            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                return func(*args, **kwargs)

            return wrapper

        return inner


class CliGroup(Cli):
    __slots__ = ("parser", "subparsers", "subparser")

    parser: argparse.ArgumentParser
    subparsers: argparse._SubParsersAction
    subparser: Optional[argparse.ArgumentParser]

    def __init__(self, subparsers, *args, **kwargs):
        self.parser = subparsers.add_parser(*args, **kwargs)
        self.subparsers = self.parser.add_subparsers()
        self.subparser = None
