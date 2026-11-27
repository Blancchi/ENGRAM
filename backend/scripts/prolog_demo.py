"""Kaneo Task 1.04: minimal Python -> SWI-Prolog demonstration.

Runs one goal against ``prolog/demo/stack_demo.pl`` using the SWI-Prolog
executable and prints a clear SUCCESS or FAILURE line.

Usage (from the ``backend/`` folder, venv active):
    python scripts/prolog_demo.py
    python scripts/prolog_demo.py "uses_paradigm(python, functional)"

SWI-Prolog is located via the ``SWIPL_PATH`` environment variable, then the
``PATH``, then the default Windows install folder. Arguments are passed to
``subprocess.run`` as a list (never through a shell), so paths containing
spaces such as ``C:\\Users\\Your Name\\...`` work without extra quoting.

This is a connectivity demo only, not the ENGRAM authorization system.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DEMO_FILE = REPO_ROOT / "prolog" / "demo" / "stack_demo.pl"
DEFAULT_GOAL = "uses_paradigm(prolog, logic)"
WINDOWS_DEFAULT_SWIPL = Path(r"C:\Program Files\swipl\bin\swipl.exe")
TIMEOUT_SECONDS = 15


@dataclass(frozen=True)
class PrologResult:
    goal: str
    succeeded: bool
    exit_code: int
    stdout: str
    stderr: str


def find_swipl() -> Path | None:
    """Return the SWI-Prolog executable, or ``None`` if it cannot be found."""
    configured = os.environ.get("SWIPL_PATH", "").strip()
    if configured:
        path = Path(configured)
        return path if path.is_file() else None

    on_path = shutil.which("swipl")
    if on_path:
        return Path(on_path)

    return WINDOWS_DEFAULT_SWIPL if WINDOWS_DEFAULT_SWIPL.is_file() else None


def run_goal(
    swipl: Path, pl_file: Path, goal: str, timeout: float = TIMEOUT_SECONDS
) -> PrologResult:
    """Consult ``pl_file`` and run ``goal`` through the file's ``check/1``."""
    completed = subprocess.run(
        [str(swipl), "-q", "-g", f"check(({goal}))", "-t", "halt(2)", str(pl_file)],
        capture_output=True,
        text=True,
        timeout=timeout,
        check=False,
    )
    return PrologResult(
        goal=goal,
        succeeded=completed.returncode == 0,
        exit_code=completed.returncode,
        stdout=completed.stdout.strip(),
        stderr=completed.stderr.strip(),
    )


def main(argv: list[str] | None = None) -> int:
    args = sys.argv[1:] if argv is None else argv
    goal = args[0] if args else DEFAULT_GOAL

    swipl = find_swipl()
    if swipl is None:
        print(
            "FAILURE: SWI-Prolog executable not found. Install SWI-Prolog, "
            "add it to PATH, or set SWIPL_PATH to the full path of swipl.exe."
        )
        return 1
    if not DEMO_FILE.is_file():
        print(f"FAILURE: Prolog demo file not found: {DEMO_FILE}")
        return 1

    print(f"SWI-Prolog : {swipl}")
    print(f"Prolog file: {DEMO_FILE}")
    print(f"Goal       : {goal}")

    try:
        result = run_goal(swipl, DEMO_FILE, goal)
    except subprocess.TimeoutExpired:
        print(f"FAILURE: SWI-Prolog did not finish within {TIMEOUT_SECONDS} seconds.")
        return 1

    if result.stdout:
        print(f"Prolog says: {result.stdout}")
    if result.stderr:
        print(f"Prolog errors: {result.stderr}")

    if result.succeeded:
        print(f"SUCCESS: Python called SWI-Prolog and proved {goal}")
        return 0
    print(f"FAILURE: SWI-Prolog could not prove {goal} (exit code {result.exit_code})")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
