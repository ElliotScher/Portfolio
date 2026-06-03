### Custom Ubuntu Installer Fork

To streamline the deployment and configuration process for FRC teams, we plan to develop a customized fork of Canonical's Ubuntu installer (Subiquity). This will provide a bootable, self-installing ISO that automatically configures the OS, camera dependencies, real-time optimizations, and the GompeiVision runtime directly onto the coprocessor without requiring manual command-line installation.

#### Goals
- **Out-of-the-Box Deployment:** Eliminate manual installation steps (installing dependencies, building pipelines, mapping cameras) by providing an installation image that handles all setup automatically.
- **Pre-Optimized Linux Environment:** Automatically configure udev rules for persistent camera USB mapping, apply real-time kernel configurations, and configure local network interfaces (static IP / DHCP) for instant communication on the robot network.
- **Diagnostics & Recovery:** Integrate a recovery partition or boot option that allows teams to run automated diagnostic tests on their camera feeds and network connection directly from the installer GUI.

#### Planned Tech Stack
- **Ubuntu Subiquity / Autoinstall:** Leverage Canonical’s YAML-driven automated installer framework to pre-define the system partitioning, package installation, and initialization scripts.
- **Systemd & Udev Rules:** Package predefined systemd configurations to run the multi-process pipeline on system boot and udev rules to map physical USB ports to camera IDs.
