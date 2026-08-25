# Home Manager & Declarative GNOME Desktop

Home Manager configuration in `users/elliotscher/home.nix` covers the same ground a manual post-install setup script would - but declared, versioned, and reproduced identically on every machine that user logs into.

## Dotfiles and Packages

Editors, browsers, and CLI tools are declared through `home.packages`, including per-team FRC robotics tooling pulled in from a separate `frc-nix` flake input. `programs.git`, `programs.direnv` (with `nix-direnv`), and `programs.vscode` are configured declaratively rather than left for a first-login setup wizard - VS Code even gets two separate profiles, a `default` profile and an `frc` profile with WPILib-specific extensions and a custom `xdg.desktopEntries` launcher that forces X11 (`WAYLAND_DISPLAY=`) since the WPILib toolchain's GUI components don't behave correctly under Wayland.

## The Desktop Itself Is Configuration

GNOME isn't just enabled - its exact behavior is declared through `dconf.settings`: which shell extensions are active (`dash-to-dock`, `AppIndicator`, `GSConnect`), dock position and autohide behavior, dark GTK/Qt theming, keyboard repeat rate, touchpad gestures, idle and sleep timing, Nautilus's default view and hidden-file visibility, and even the desktop and lock-screen wallpapers. Like the system-level shell aliases, `dconf.settings` is given `lib.mkDefault` per top-level path rather than as one blob assignment, since Home Manager's `dconf` module has its own baseline that a single blob-level override would otherwise clobber wholesale.

## Working Around Tools That Fight Symlinks

Home Manager normally manages files like VS Code's `settings.json` as read-only symlinks into the Nix store. Some tools insist on writing directly to that file at runtime, which fails against a read-only symlink. A `home.activation` script (`makeVscodeSettingsWritable`) runs after Home Manager's own file-writing phase, detects when the target is still a symlink, and replaces it with a real, writable copy - so the declared starting state is preserved, but the file behaves normally afterward for tools that expect to mutate it directly.
