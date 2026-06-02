### Why Linux was chosen for GompeiVision

One of the primary goals of GompeiVision was to remain hardware-agnostic, so I designed the deployment process around standard Ubuntu-based Linux systems rather than a specific vendor platform.

- **Flexible Targets**: For competition use, the system is typically deployed to an x86 mini PC, which provides enough processing power to handle multiple camera streams and localization pipelines while maintaining low latency.
- **Low-Cost Development**: The same codebase can also be deployed to ARM-based single-board computers (like the Raspberry Pi) running Ubuntu. This allows students to experiment with the system and validate changes without requiring access to the competition hardware.
- **Easy Distribution**: The build system packages GompeiVision as a standard Debian (`.deb`) package, allowing the software to be installed, updated, and removed using standard system package management tools.
