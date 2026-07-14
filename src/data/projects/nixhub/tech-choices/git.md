### Why Git

Git is both the version-control system for NixHub itself and an active participant in the bootstrap workflow, not just a passive place the code happens to live:

- **The Repository *Is* the Machine's State**: Because a `nixos-rebuild switch --flake` always points directly at the repo's location (no `/etc/nixos` symlink indirection), the Git history of NixHub *is* the audit trail of every configuration change ever applied to any machine — `git blame` on `common/configuration.nix` answers "when and why did this default change" directly.
- **Bootstrap Commits Automatically**: `bootstrap.sh` calls `git commit` itself once a new host is scaffolded, using an explicit `user.name`/`user.email` so the commit succeeds even on a genuinely first-ever machine where global Git identity hasn't been configured through this repo's own Home Manager config yet.
- **`gh` as the Credential Helper**: Home Manager configures `credential.helper = "!gh auth git-credential"`, so pushes authenticate through the GitHub CLI's existing login rather than needing a separately managed SSH key or personal access token per machine.
