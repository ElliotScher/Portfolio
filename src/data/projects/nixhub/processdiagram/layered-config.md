# Layered Configuration Model

Every `nixosConfigurations.<name>` is assembled by a single `mkHost` function in `flake.nix`, which auto-discovers hostnames by reading the directory names under `hosts/` and composes each system from the same fixed stack of modules:

```nix
modules = [
  ./common/configuration.nix
  { networking.hostName = name; }
  ./hosts/${name}/configuration.nix
  ./hosts/${name}/hardware-configuration.nix
  home-manager.nixosModules.home-manager
  { home-manager.users = lib.genAttrs hostUsers (user: {
      imports = [ ./users/${user}/home.nix ]
        ++ lib.optional (builtins.pathExists (hostUserHome user)) (hostUserHome user);
    });
  }
] ++ map (user: ./users/${user}/account.nix) hostUsers;
```

## Three Tiers, One Merge

* **`common/`** holds system config shared by every host, independent of who's logged in - bootloader, networking, the GNOME session, audio, printing, and the base package set.
* **`users/<name>/`** holds one user's account definition and Home Manager config, shared across every host they appear on.
* **`hosts/<name>/`** holds only what's specific to one machine: its `hardware-configuration.nix`, a `users.nix` list of which users actually exist on that host (most hosts are just `[ "elliotscher" ]`, but a shared machine can list more), and optional deltas.

## Overriding Without Conflict

Every overridable value in `common/configuration.nix` and `users/<name>/home.nix` is wrapped in `lib.mkDefault`, giving it low module priority. That lets a host's own `configuration.nix` override it with a plain assignment - no `lib.mkForce`, no evaluation-time conflict:

```nix
# hosts/<name>/configuration.nix
{ config, pkgs, lib, inputs, ... }:
{
  time.timeZone = "America/Los_Angeles";
}
```

List-valued options are left deliberately *unwrapped*. Nix module lists at the same priority concatenate instead of conflicting, so a host adds to `environment.systemPackages` or `home.packages` with a plain assignment of its own rather than having to redeclare the shared list:

```nix
environment.systemPackages = with pkgs; [ someExtraTool ];
```

For a value shared by *some* hosts but not all - not the "one host" tier and not the "every host" tier - a new file goes under `common/` (e.g. `common/laptop.nix`) and gets listed in the `modules` for just the hosts that need it in `flake.nix`, rather than forcing a choice between duplicating it per-host or promoting it to every machine.
