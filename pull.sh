git add .
if git commit -m "Commit current changes before reset"; then
    echo "Current changes committed."
    git push origin main
else
    echo "No changes to commit, proceeding to reset."
    # Buat branch recovery dengan timestamp
    branch="recovery-$(date +%Y%m%d%H%M%S)"
    git checkout -b "$branch"
    git add .
    git commit -m "Recovery commit: save uncommitted changes"
    git push origin "$branch"
    echo "Changes committed to new branch: $branch"
    # Kembali ke main dan reset
    git checkout main
    git reset --hard origin/main
    npm install
    git add .
    git commit -m "Reset to origin/main and reinstalled dependencies"
    git push origin main
    echo "Repository has been reset to origin/main and dependencies reinstalled."
fi