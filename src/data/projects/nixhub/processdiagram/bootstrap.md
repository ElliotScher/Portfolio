# Bootstrap & Hostname Assignment

Setting up a new machine starts with a single command:

```bash
nix run github:ElliotScher/NixHub#bootstrap
```

On a completely fresh install, flakes aren't enabled yet, so the very first invocation on a brand-new machine needs the experimental features passed explicitly:

```bash
nix --extra-experimental-features "nix-command flakes" run github:ElliotScher/NixHub#bootstrap
```

## What the Script Does

`bootstrap.sh` is exposed as a flake app (`packages.<system>.bootstrap`, built with `pkgs.writeShellApplication` so it's linted and has its runtime dependencies - `git` and the NixOS install tools - pinned) and runs through a fixed sequence:

1. **Clone**, if `~/Documents/NixHub` doesn't already exist.
2. **Pick a hostname** by running `scripts/pick-hostname.sh HOSTNAMES.md hosts`, which walks `HOSTNAMES.md` in order and returns the first Quenya numeral that doesn't already have a matching `hosts/<name>/` directory.
3. **Generate hardware config** by running `nixos-generate-config` into a scratch directory and copying just the machine-generated `hardware-configuration.nix` into the new host directory - nothing else from a stock `nixos-generate-config` output is kept.
4. **Scaffold the host** with empty `configuration.nix`, a `users.nix` defaulting to `[ "elliotscher" ]`, and `home/elliotscher.nix`, each pre-populated with a comment explaining what belongs there.
5. **Commit**, and prompt before pushing - pushing requires `git` to already be authenticated against GitHub, which on a genuinely first-ever machine (before this repo's own Home Manager config has set up the `gh` credential helper) may not be true yet. If the push fails, the script leaves the commit local rather than failing outright.
6. **Print the rebuild command** (`sudo nixos-rebuild switch --flake ~/Documents/NixHub#<name>`) and prompt whether to run it now.

## Why the Script Stops Before Rebuilding

The bootstrap flow deliberately never rebuilds the system without a confirmation prompt. Hardware detection is generated automatically, but a new host frequently needs something the base template doesn't know about yet - a laptop-specific override, an extra system package - and the pause gives a chance to look over and edit the scaffolded files before they're applied to the running machine.
