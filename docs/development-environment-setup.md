# Development Environment Setup

Follow these steps once on your own computer. When you finish, you should have the backend
running, the backend tests passing, the mobile app open on your phone, and the
Python → SWI-Prolog demo printing `SUCCESS`.

The commands are for **Windows PowerShell**. On macOS or Linux, use `source .venv/bin/activate`
instead of `.venv\Scripts\Activate.ps1`, and `/` instead of `\` in paths.

## 1. Install the tools

| Tool | Version | Download | Check it worked |
|---|---|---|---|
| Git | any recent | https://git-scm.com | `git --version` |
| Python | **3.13** | https://www.python.org/downloads/ (tick "Add python.exe to PATH") | `python --version` |
| Node.js | **24 LTS** (includes npm) | https://nodejs.org | `node --version` and `npm --version` |
| SWI-Prolog | 11.0.1 (installed, *not yet verified*, see note below) | https://www.swi-prolog.org/download/stable, or `winget install --id SWI-Prolog.SWI-Prolog -e --source winget` | `swipl --version` |
| Expo Go | matches Expo SDK 58 | Google Play Store on your Android phone | open the app |

**SWI-Prolog tip:** in the installer, choose the option to **add swipl to the PATH**. If
`swipl --version` still says "not recognized", close and reopen the terminal. If that does not help,
see the Troubleshooting section below.

**SWI-Prolog status:** the lead developer installed 11.0.1, but the Python → Prolog demo has
**not yet been verified** on any machine. If your antivirus flags `swipl.exe`, follow
[If antivirus software quarantines swipl.exe](#if-antivirus-software-quarantines-swiplexe).

## 2. Get the code

```powershell
git clone https://github.com/Blancchi/ENGRAM.git
cd ENGRAM
```

## 3. Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/health. You should see `"status": "ok"`. API docs are at
http://127.0.0.1:8000/docs. Press `Ctrl+C` to stop the server.

Optional: copy `backend/.env.example` to `backend/.env` to override settings. **Never commit `.env`.**

## 4. Backend tests

With the venv active, from `backend/`:

```powershell
python -m pytest
```

Everything should pass. The Prolog discovery tests always run. The three tests that actually call
SWI-Prolog show as **skipped** if it is not installed or cannot be found.

## 5. Python → SWI-Prolog demo

With the venv active, from `backend/`:

```powershell
swipl --version
python scripts/prolog_demo.py
```

Expected format (**illustrative only, not yet captured from a real run**; your paths will differ):

```
SWI-Prolog : C:\Program Files\swipl\bin\swipl.exe
Prolog file: C:\...\ENGRAM\prolog\demo\stack_demo.pl
Goal       : uses_paradigm(prolog, logic)
Prolog says: TRUE: uses_paradigm(prolog,logic)
SUCCESS: Python called SWI-Prolog and proved uses_paradigm(prolog, logic)
```

To see a failure being reported, run a goal that is false:

```powershell
python scripts/prolog_demo.py "uses_paradigm(prolog, functional)"
```

This should print `FAILURE: ...` and exit with code 1.

**For Kaneo:** take a screenshot of the `SUCCESS` output and of `swipl --version`, and attach both to
Task 1.04.

## 6. Mobile app

Open a **second** terminal:

```powershell
cd mobile
npm ci
npx expo start
```

Scan the QR code with Expo Go. If your phone and laptop are not on the same Wi-Fi, use
`npx expo start --tunnel`.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Activate.ps1 cannot be loaded because running scripts is disabled` | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or skip activation and call `.venv\Scripts\python.exe` directly |
| `swipl` is not recognized | Reopen the terminal. If it still fails, set the path for the session: `$env:SWIPL_PATH = "C:\Program Files\swipl\bin\swipl.exe"` |
| Demo says `SWI-Prolog executable not found` | Same as above. The demo checks `SWIPL_PATH`, then `PATH`, then `C:\Program Files\swipl\bin\swipl.exe` |
| Paths with spaces (for example `C:\Users\Your Name\...`) | Wrap the path in quotes when you type it: `cd "C:\Users\Your Name\ENGRAM"`. The demo passes paths to Prolog without a shell, which is designed to handle spaces |
| `python` opens the Microsoft Store | Reinstall Python with "Add to PATH" ticked, or use `py -3.13` instead of `python` |
| Expo Go says the SDK is incompatible | Update Expo Go from the Play Store |

## If antivirus software quarantines swipl.exe

Some antivirus products may flag or quarantine SWI-Prolog's `swipl.exe`. Signs include
`swipl` suddenly being "not recognized", `swipl.exe` missing from the `bin` folder after
installation, or an "Access is denied" error.

**Do not** disable your antivirus, restore the file from quarantine, or add an exclusion on your
own. Instead:

1. Write down the file path and the detection name your antivirus shows.
2. Confirm that you downloaded SWI-Prolog only from https://www.swi-prolog.org or through winget.
   A matching download or installer hash is **not** proof that a flagged executable is safe.
3. Report it to the lead developer and wait for the team's decision. The team may submit the file
   to the antivirus vendor for false-positive analysis.
4. You can keep working meanwhile: the backend, the tests and the mobile app do not need
   SWI-Prolog, and the Prolog tests are skipped automatically.
