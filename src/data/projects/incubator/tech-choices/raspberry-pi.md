### Raspberry Pi

The Raspberry Pi serves as the main Linux-based host computer and workstation for the instrument:

*   **Laboratory Workstation**: Combines a low-cost, compact physical footprint with a complete Linux operating system, making it easy to mount directly inside or next to the incubator.
*   **Automatic Media Mounting**: Utilizes Unix mount systems to handle automatic detection, power, and file-writing to external USB recovery drives during power-failure recovery sequences.
*   **I/O and Connectivity**: Provides standard high-speed USB ports to interface with the Arduino microcontroller and local storage configurations inside `/var/tmp/` to bypass user-profile directory constraints.
