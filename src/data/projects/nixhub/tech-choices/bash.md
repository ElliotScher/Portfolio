### Why Bash

Bash handles the small number of genuinely imperative steps NixHub needs — the ones that happen *before* there's a NixOS system to declare anything with:

- **Bootstrapping a System That Doesn't Exist Yet**: `bootstrap.sh` runs before the target machine has any of NixHub's configuration applied, so it can't rely on anything from this repo's own Nix modules — it has to work with whatever's available at a bare shell prompt, which Bash reliably is.
- **Thin Wrapper Around Real Nix/Git Commands**: The script's job is orchestration — clone, generate hardware config, scaffold files, commit, prompt, print the next command — not computation, so a lightweight shell script is a better fit than reaching for a general-purpose language and its dependency management.
- **Testable in Isolation**: The hostname-picking logic lives in its own script, `scripts/pick-hostname.sh`, specifically so it can be unit-tested in a pure, sandboxed `nix flake check` derivation (`test-pick-hostname.sh`) independent of the rest of the bootstrap flow, using nothing but standard POSIX-ish shell tools (`grep`, `awk`) for easy sandboxed reproducibility.
