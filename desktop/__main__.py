"""Allow ``python -m desktop`` to launch the daemon."""
from .shift_f3 import main

if __name__ == "__main__":
    raise SystemExit(main())
