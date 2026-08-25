### Encrypted Secrets Management

Right now, anything genuinely secret - API tokens, private SSH keys, Wi-Fi passwords - has to live outside the repository and be copied onto each machine by hand, which is exactly the kind of manual, undocumented step NixHub otherwise exists to eliminate. The next infrastructure addition is integrating a secrets tool built for the Nix module system, most likely **sops-nix**, so secrets can be committed to the repo encrypted-at-rest and only decrypted on the target host at activation time.

#### Goals
- **Encrypted-at-Rest Secrets in Git:** Store secrets as `.enc.yaml`/`.enc.json` files directly in the repository, encrypted against each authorized host's SSH or age key, so the encrypted blob can be freely committed and diffed without exposing plaintext.
- **Per-Host Decryption Scope:** Ensure a given secret only decrypts on the hosts that are supposed to have it, using the same per-host, per-user layering NixHub already uses for regular configuration.
- **Declarative Secret Consumption:** Reference decrypted secrets directly from `home.nix` and host `configuration.nix` files (e.g. as `sops.secrets.<name>.path`) instead of expecting a service to read an environment variable that was set up manually outside of Nix.
- **CI-Safe by Construction:** Keep the `nix flake check` evaluation and system-closure checks passing in CI without access to any real decryption keys, since CI machines aren't (and shouldn't be) authorized decryption targets.

#### Planned Tech Stack
- **sops-nix:** Add it as a flake input and NixOS/Home Manager module, generating age keys from each host's existing SSH host key rather than managing a separate key pair per machine.
- **age / SOPS:** Use `age` as the encryption backend for its small, auditable implementation, with `sops` as the CLI for editing and re-encrypting secrets files against the current set of authorized recipients.
