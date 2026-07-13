# Continuous Integration & Validation

`nix flake check` is the single command that validates the entire repository, and it's what GitHub Actions runs on every push and pull request. It expands into four layers of increasing thoroughness:

## 1. Evaluation

Every `nixosConfigurations.<name>` and other flake output is evaluated for type errors, invalid option values, and `lib.mkDefault` priority conflicts. This is free and fast, and catches the large majority of configuration mistakes before anything is built.

## 2. Full System Closures

`checks.system-<name>` builds that host's complete bootable system closure (`config.system.build.toplevel`) — GNOME, every declared package, Home Manager activation — for each host under `hosts/`, without touching any real machine. This catches build failures that evaluation alone can't, such as a package that fails to compile or a service that references a missing binary.

## 3. Hostname Assignment Logic

`checks.pick-hostname-logic` is a pure, sandboxed test (`scripts/test-pick-hostname.sh`) of the bootstrap script's hostname-picking logic, covering the no-hosts-used, some-used, all-used, and mid-list-insertion cases — the actual `pick-hostname.sh` script runs against synthetic `HOSTNAMES.md` and `hosts/` fixtures rather than being tested indirectly through a full bootstrap run.

## 4. Booted VM Smoke Test

`checks.vm-smoke-test` boots `common/configuration.nix` plus `users/elliotscher/{account,home}.nix` — the configuration shared by every host, independent of any one host's real hardware — in a NixOS VM via `pkgs.testers.nixosTest`, and asserts that the system reaches `multi-user.target`, the `elliotscher` user and its packages exist, Home Manager activation completed (down to checking a specific dotfile was actually written), and GDM reaches `graphical.target`.

## Running in CI

The GitHub Actions workflow frees up disk space on the runner (VM builds are large), grants the runner's user access to `/dev/kvm` so the VM test can actually boot with hardware acceleration instead of falling back to slow software emulation, installs Nix via Determinate Systems' installer, and enables the Magic Nix Cache to avoid rebuilding unchanged derivations across runs — then runs `nix flake check -L` as the only build step.
