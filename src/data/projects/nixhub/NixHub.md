## Summary

**NixHub** is a single Nix flake that fully describes every one of my machines: complete NixOS system configuration (bootloader, networking, GNOME desktop, services) and per-user Home Manager dotfiles, plus a collection of standalone, per-project development-environment flakes. Cloning the repository and running one command reproduces an entire machine, desktop environment included, starting from a bare NixOS install.

***

## Context

Managing more than one personal machine imperatively drifts quickly: a package installed by hand on one laptop, a dotfile tweak made directly in `~/.config` on another, a GNOME setting toggled through Settings that never gets written down anywhere. Reinstalling the OS, or setting up a brand-new machine, meant hours of re-deriving "what did I actually have configured last time" from memory. NixOS and Home Manager solve the reproducibility half of that problem on their own, but a naive single `configuration.nix` per machine still duplicates everything that *is* shared, and offers no clean way to say "this option is the same everywhere except this one host."

### A Layered Configuration Model

NixHub solves this by splitting configuration into three tiers that compose through the standard NixOS module system instead of file duplication:

* **`common/configuration.nix`**: System configuration shared by every host, independent of who is logged in — bootloader, networking, GNOME/GDM, PipeWire audio, printing, firmware updates, shell aliases, and the base package set.
* **`users/<name>/`**: One user's `account.nix` (their `users.users.<name>` definition) and `home.nix` (their Home Manager config), shared across every host that user appears on.
* **`hosts/<name>/`**: Only what's specific to one physical machine — a machine-generated `hardware-configuration.nix` that is never hand-edited, a `users.nix` list of which users exist on that host, and optional `configuration.nix` / `home/<user>.nix` deltas.

Every overridable value in the shared `common/` and `users/<name>/home.nix` files is wrapped in `lib.mkDefault`, which gives it low module priority. A plain assignment in a host's own `configuration.nix` silently wins over it — no `lib.mkForce`, no conflict, no need to know the shared file even set that option. List-valued options (`environment.systemPackages`, `home.packages`, `dconf.settings`, etc.) are deliberately left *unwrapped*, since Nix module lists from multiple files at the same priority concatenate rather than conflict — so a host can add its own packages with a plain list assignment instead of having to redeclare and merge the shared list by hand. A handful of options (`environment.shellAliases`, `home.sessionVariables`, `dconf.settings`) get `lib.mkDefault` applied *per-key* rather than to the whole attribute set, because NixOS and Home Manager already ship their own baseline definitions for those exact options — a single blob-level `mkDefault` would lose to that baseline wholesale instead of merging key-by-key.

### Machine Bootstrapping and Hostnames

Machines are named after Quenya (Elvish) numerals — spelled without diacritics, since NixOS hostnames only allow ASCII letters, digits, hyphens, and underscores — assigned in order from `HOSTNAMES.md`. A new machine gets the first name in that list that doesn't already have a matching `hosts/<name>/` directory, which makes the list itself safe to freely reorder or append to after the fact, since assignment depends on which directories exist, not on the file's exact contents at any given moment.

Running `nix run github:ElliotScher/NixHub#bootstrap` on a new machine clones the repo (if needed), picks the next hostname, generates that host's `hardware-configuration.nix`, scaffolds empty `configuration.nix` / `users.nix` / `home/<user>.nix` files, and commits (and optionally pushes) the new host. It deliberately stops short of running the rebuild itself, printing the exact `nixos-rebuild switch --flake` command instead — leaving a checkpoint to review the generated files, and add any host-specific config, before the new configuration is actually applied.

### Declarative Desktop, Not Just Packages

Home Manager configuration isn't limited to dotfiles and CLI packages — the entire GNOME desktop is declared the same way: which shell extensions are enabled (`dash-to-dock`, `AppIndicator`, `GSConnect`), dock behavior, keyboard/touchpad settings, power and idle behavior, Nautilus preferences, wallpaper, and even a second VS Code profile (`code-frc`) with its own extension set and a custom desktop entry that forces X11 for a GUI toolkit that doesn't behave under Wayland. One activation script fixes a case where a specific tool insists on writing directly to `settings.json` — Home Manager normally manages that file as a read-only symlink, so the script detects the symlink on first activation and replaces it with a real, writable copy.

## Tech Stack

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="NixHub"></div>

## Architecture

NixHub's configuration flows through five stages, from a bare machine to a continuously-verified, fully declarative system:

<div class="project-process-diagram"></div>

## Future Additions

Below are some of the planned improvements and infrastructure upgrades for NixHub:

<div class="project-future-additions"></div>
