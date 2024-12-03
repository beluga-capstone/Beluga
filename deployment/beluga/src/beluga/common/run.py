import getpass
import re
import shlex
import sys
from functools import cache
from typing import Optional, Pattern, Self

import pexpect


class RunContext:
    """
    Run arbitrary shell commands with privilege escalation capabilities
    """
    __slots__ = ("_become_password", "_become_expect", "_become_prompt", "_context")

    _become_password: str
    _become_expect: Pattern[str]
    _become_prompt: str
    _context: Self

    def __init__(
        self,
        become_password: str = "",
        become_expect: str = rb"\[sudo via beluga\] password:",
        become_prompt: str = "[sudo via beluga] password:",
    ):
        self._become_password = become_password
        self._become_expect = re.compile(become_expect)
        self._become_prompt = become_prompt

    @cache
    @staticmethod
    def _getpass() -> str:
        return getpass.getpass("[Beluga] sudo password: ")

    def run_cmd(
        self,
        cmd: str,
        poll_stdout=True,
        become="",
        shell=False,
        timeout: Optional[int] = None,
    ) -> tuple[bytes, bool]:
        """
        Run a command. Polling mode will bridge stdout to the subprocess. Set
        `become` to a username to execute the command as that user using
        authenticated sudo. Returns captured stdout.
        """
        cmd_prefix = ""
        if become:
            cmd_prefix = f"sudo -sHp '{self._become_prompt}' -u {become} "
            
            if not self._become_password:
                self._become_password = RunContext._getpass()

        # merge multiline commands to single line
        cmd = " ".join([i.lstrip() for i in cmd.lstrip("\n").splitlines()])
        if shell:
            builder = shlex.split(f"{cmd_prefix}/bin/bash -c")
            builder.append(cmd)
            proc = pexpect.spawn(builder[0], builder[1:])
        else:
            proc = pexpect.spawn(f"{cmd_prefix}{cmd}")

        if poll_stdout:
            proc.logfile_read = sys.stdout.buffer

        if become:
            proc.expect(self._become_expect)
            proc.sendline(self._become_password)

        proc.expect(pexpect.EOF, timeout=timeout)
        proc.wait()
        return proc.before, proc.status == 0


context: RunContext


def get_global_context(become_password: str = ""):
    """
    Initialize global runtime
    """
    global context
    context = RunContext(become_password)
