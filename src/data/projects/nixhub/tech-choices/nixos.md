### Why NixOS

NixOS is the foundation NixHub is built on top of, and the reason the project is possible at all in its current form:

- **A Full System as One Evaluated Expression**: Unlike traditional distros where system state accumulates through a sequence of imperative commands, NixOS builds the entire system — kernel, services, desktop environment, user accounts, packages — from a single evaluated Nix expression. That's what makes it possible to reproduce a whole machine from one `nixos-rebuild switch --flake` invocation.
- **A Module System That Supports Real Layering**: NixOS's module system (`lib.mkDefault`, `lib.mkForce`, automatic list concatenation) is what makes NixHub's common/user/host layering possible without config duplication — a host overrides a shared default with a plain assignment instead of needing to know or repeat the value it's replacing.
- **Atomic, Reversible Upgrades**: Every `nixos-rebuild switch` builds a new, immutable system generation alongside the old ones rather than mutating files in place. If a change breaks something, the previous generation is still selectable from the bootloader — a safety net that's essential when experimenting with shared config that every machine depends on.
