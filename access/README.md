# access/

This folder holds the **GitHub access vault** — a password-protected zip containing the
fine-grained PAT used by the maintainer agent to push to this repository.

## Contents

- `vault.zip` — a password-protected zip containing `token.txt` (the PAT, with admin/push
  scope on this repo).

## About the password

The password is **not** stored anywhere in this repository, **not** embedded in the
filename, and **not** documented in the commit history. It is held only by the maintainer
(in the sandbox environment) so the token can be recovered after a sandbox reset.

## Security posture (acknowledged)

This repository is **public**. The user has explicitly accepted the risk of storing a
token (even password-protected) in a public repo, with a plan to **rotate the token** before
the project is published. See [`../memory/05-github-workflow.md`](../memory/05-github-workflow.md)
for the full decision record.

The maintainer agent flagged this once as a security risk (per `08-communication-protocol.md`),
the user acknowledged and set a rotation plan, and the matter is closed.

## Rotation

When the user rotates the token: delete `vault.zip`, rewrite git history to remove it from
past commits (if desired), issue a fresh token, and re-create the vault with a new password.
