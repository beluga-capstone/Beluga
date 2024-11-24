import traceback

from beluga.common import run


def main():
    # initialize command execution context
    run.get_global_context()

    # cli decorators execute on import
    from beluga.core.cli import Deploy, Beluga, Secrets, beluga_cli
    from beluga.plugins.coreos.cli import CoreOS
    from beluga.plugins.virtualbox.cli import VirtualBox
    from beluga.plugins.network.cli import Nginx, Ssh
    from beluga.plugins.docker.cli import Docker
    
    # initialize cli
    args = beluga_cli.parser.parse_args()
    params = vars(args)

    try:
        if not hasattr(args, "func"):
            beluga_cli.parser.print_usage()
        elif (cls_name := args.__dict__.get("cls")) is not None:
            cls = locals()[cls_name]
            self = cls(**params)
            args.func(self, **params)
        else:
            args.func(**params)
    except Exception:
        beluga_cli.parser.print_usage()
        print(traceback.format_exc())


if __name__ == "__main__":
    main()
