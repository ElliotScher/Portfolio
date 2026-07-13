### Why GitHub Actions

GitHub Actions is what turns `nix flake check` from a command I might remember to run into a guarantee that holds on every change:

- **Runs the Same Checks on Every Push and PR**: The CI workflow triggers on every `push` and `pull_request`, so a broken host configuration, a failing package build, or a regression in the hostname-assignment logic gets caught immediately instead of surfacing the next time that specific machine happens to rebuild.
- **Hosted Runners with KVM for a Real VM Boot**: The VM smoke test needs to actually boot a kernel, which needs hardware-accelerated virtualization. GitHub's runners support enabling `/dev/kvm` access via a udev rule, letting `checks.vm-smoke-test` boot at real speed instead of falling back to slow, timeout-prone software emulation.
- **Ecosystem of Nix-Specific Actions**: The workflow composes purpose-built community actions — Determinate Systems' Nix installer and Magic Nix Cache action for fast, cached `nix flake check` runs, and a disk-space-freeing action to make room for multiple full NixOS system closures — rather than hand-rolling Nix installation and caching logic in raw shell.
