### Declarative NixOS Configuration

As an alternative to the standard Ubuntu-based system currently used by GompeiVision, we plan to support a declarative NixOS configuration. The primary goal is to use Nix to standardize and reproduce the *deployment* and environment configuration of the coprocessor, rather than rewriting the compilation/build pipeline of GompeiVision itself.

#### Goals
- **Ubuntu Alternative:** Provide a choice between the standard Ubuntu installer and a NixOS configuration for teams that prefer declarative, version-controlled operating system setups.
- **Standardized Deployment (Not Build):** Focus Nix's capabilities on deploying the pre-compiled GompeiVision binaries, managing system services, locking down library paths, and copying assets, rather than building the application itself.
- **Zero Configuration Drift:** Ensure every coprocessor runs the exact same OS configurations, udev rules, and network settings, preventing subtle runtime issues that occur when software environments diverge.
- **Atomic Updates & Rollbacks:** Safeguard competition setups by allowing instant rollbacks to the last-known-good OS and deployment state if a late-season configuration change causes issues.

#### Planned Tech Stack
- **NixOS / Nix Flakes:** Define the system configuration, systemd services, udev rules, and environment dependencies using Nix Flakes.