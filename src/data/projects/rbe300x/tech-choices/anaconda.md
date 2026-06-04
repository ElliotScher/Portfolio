### Why Anaconda?

Anaconda (specifically Conda) was chosen to manage the execution environments and package dependencies for the RBE 300X projects:

* **Hermetic Environment Isolation**: Robotics projects often require precise versions of packages like PyYAML, ZeroMQ (pyzmq), and specialized testing tools. Conda ensures that these project dependencies do not interfere with system-wide Python runtimes.

* **Deterministic Package Versioning**: By pinning Python versions (e.g., Python 3.11) and library requirements inside a Conda environment, all developers and CI pipelines run the code under identical runtime conditions, eliminating the "works on my machine" class of bugs.

* **Cross-Platform Compatibility**: Conda handles binaries across Windows, macOS, and Linux seamlessly, ensuring the robotic simulator integration works regardless of the host OS.
