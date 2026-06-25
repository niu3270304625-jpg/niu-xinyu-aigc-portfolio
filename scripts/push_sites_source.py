from __future__ import annotations

import os
import shutil
from pathlib import Path

from dulwich import porcelain
from dulwich.client import HttpGitClient
from dulwich.repo import Repo


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / ".sites-source"


def main() -> None:
    remote_url = os.environ["SITES_REMOTE_URL"]
    token = os.environ["SITES_TOKEN"]
    branch = os.environ.get("SITES_BRANCH", "main")

    git_dir = SOURCE / ".git"
    if git_dir.exists():
        shutil.rmtree(git_dir)
    porcelain.init(str(SOURCE), bare=False)

    porcelain.add(str(SOURCE), ".")
    commit_sha = porcelain.commit(
        str(SOURCE),
        message=b"Publish portfolio site",
        author=b"Codex <codex@openai.com>",
        committer=b"Codex <codex@openai.com>",
    ).decode("ascii")

    repo = Repo(str(SOURCE))
    client = HttpGitClient(
        remote_url,
        username="x-access-token",
        password=token,
    )
    ref = f"refs/heads/{branch}".encode("utf-8")
    target = commit_sha.encode("ascii")
    client.send_pack(
        remote_url,
        lambda refs: {ref: target},
        repo.object_store.generate_pack_data,
    )

    print(commit_sha)


if __name__ == "__main__":
    main()
