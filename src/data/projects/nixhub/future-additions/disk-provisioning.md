### Disko-Based Disk Provisioning

Bootstrapping a new machine today still assumes NixOS is already installed with partitions and filesystems set up by hand through the standard installer flow — `bootstrap.sh` picks up from there, generating `hardware-configuration.nix` and scaffolding the rest. The next step in closing that gap is folding disk partitioning itself into the flake using **disko**, so a brand-new machine can go from a bare NixOS installer ISO straight to a fully partitioned, formatted, and configured system without any manual `parted`, `mkfs`, or `mount` commands in between.

#### Goals
- **Declarative Disk Layout:** Describe each host's partition table, filesystem types, and mount points as Nix configuration alongside everything else in `hosts/<name>/`, instead of as a one-time imperative sequence of commands that leaves no record behind.
- **Reproducible from an Installer ISO:** Let a completely fresh machine be partitioned and installed in one pass by running disko's format-and-mount step immediately before `nixos-install`, rather than requiring the installer's manual partitioning tools first.
- **Safer Re-Provisioning:** Make wiping and re-provisioning a machine (e.g. after a hardware swap) a matter of re-running a known-good disk layout instead of re-deriving the original partition scheme from memory or old notes.
- **Bootstrap Script Integration:** Extend `bootstrap.sh` to optionally run the disko step for genuinely new installs, while leaving it untouched for the common case of bootstrapping onto an already-partitioned, already-installed system.

#### Planned Tech Stack
- **disko:** Add it as a flake input, with a `disko.nix` per host describing that machine's partition table, LUKS/encryption settings (if any), and filesystem layout as data rather than imperative shell commands.
- **nixos-anywhere:** Investigate pairing disko with `nixos-anywhere` for fully remote, unattended installs onto new hardware over SSH, extending automation past "run this after installing" to "run this instead of installing."
