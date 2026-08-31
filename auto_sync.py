#!/usr/bin/env python3
"""
SRFPC Auto-Sync to GitHub & Vercel
Continuously watches for file changes in the repository.
When changes are detected, it waits a short debounce period (10 seconds),
then automatically adds, commits, and pushes them to GitHub main.
GitHub then triggers an automatic deployment on Vercel.
"""

import subprocess
import time
from datetime import datetime

CHECK_INTERVAL = 5     # Check every 5 seconds
DEBOUNCE_DELAY = 10    # Wait 10s after changes to group edits together

def get_git_status():
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.SubprocessError:
        return ""

def push_changes():
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_msg = f"Auto-update: {now_str}"
    
    print(f"\n[{now_str}] 🔄 Changes detected. Staging and committing...")
    
    # 1. git add .
    add_res = subprocess.run(["git", "add", "."], capture_output=True, text=True)
    if add_res.returncode != 0:
        print(f"❌ Error adding files: {add_res.stderr}")
        return False

    # 2. git commit
    commit_res = subprocess.run(
        ["git", "commit", "-m", commit_msg],
        capture_output=True,
        text=True
    )
    if commit_res.returncode != 0:
        if "nothing to commit" in commit_res.stdout:
            print("ℹ️ Nothing to commit.")
            return True
        print(f"❌ Error committing: {commit_res.stderr}")
        return False

    # 3. git push origin main
    print(f"[{now_str}] 🚀 Pushing to GitHub (origin main)...")
    push_res = subprocess.run(
        ["git", "push", "origin", "main"],
        capture_output=True,
        text=True
    )
    if push_res.returncode == 0:
        print(f"[{now_str}] ✅ Successfully pushed to GitHub! Vercel is deploying the changes.\n")
        return True
    else:
        print(f"❌ Push error: {push_res.stderr}\n")
        return False

def main():
    print("=" * 60)
    print("🚀 SRFPC Auto-Sync Active (GitHub -> Vercel)")
    print(f"👀 Watching for changes every {CHECK_INTERVAL}s (Debounce: {DEBOUNCE_DELAY}s)...")
    print("Press Ctrl+C to stop auto-sync anytime.")
    print("=" * 60)

    while True:
        try:
            status = get_git_status()
            if status:
                # Changes detected, wait debounce period to group batch edits
                time.sleep(DEBOUNCE_DELAY)
                # Confirm changes still exist
                if get_git_status():
                    push_changes()
            time.sleep(CHECK_INTERVAL)
        except KeyboardInterrupt:
            print("\n🛑 Auto-sync stopped.")
            break
        except Exception as e:
            print(f"⚠️ Unexpected error: {e}")
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
