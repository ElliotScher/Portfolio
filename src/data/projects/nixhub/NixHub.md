## Summary

**NixHub** is a system for managing NixOS computers from one shared configuration. It covers everything from OS-level settings and the desktop environment down to individual user dotfiles and app preferences. Pointing a new machine at the repository and running one command reproduces a fully configured system, desktop included, from a bare install.

***

## Context

Setting up computers by hand doesn't scale: a package installed here, a settings toggle changed there, a dotfile tweaked on one machine but forgotten on another. Over time no one machine matches any other, and rebuilding one from scratch means trying to remember what was actually configured. NixHub solves this by keeping every machine's configuration in one place, so setup is repeatable and consistent instead of remembered.

### Shared Configuration, Per-Machine Overrides

Configuration is organized into three layers: settings shared by every machine, settings shared by a given user across whichever machines they use, and settings specific to one physical machine. Shared settings apply everywhere by default, but any machine can override them without needing to touch or duplicate the shared files — so common setup stays centralized while still leaving room for machine-specific differences.

### Adding a New Machine

New machines are assigned a name automatically from a preset list the first time they're set up. A single bootstrap command handles the rest: it detects the hardware, scaffolds the new machine's configuration files, and prints the exact command to apply them — leaving a deliberate checkpoint to review or adjust settings before anything is actually applied.

### A Fully Declarative Desktop

Configuration isn't limited to packages and dotfiles — the entire desktop environment is managed the same way, including installed extensions, keyboard and touchpad behavior, power settings, wallpaper, and app-specific preferences. That means restoring a machine also restores how it looks and feels, not just what's installed on it.

## Tech Stack

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="NixHub"></div>

## Architecture

NixHub's configuration flows through five stages, from a bare machine to a continuously-verified, fully declarative system:

<div class="project-process-diagram"></div>

## Future Additions

Below are some of the planned improvements and infrastructure upgrades for NixHub:

<div class="project-future-additions"></div>
