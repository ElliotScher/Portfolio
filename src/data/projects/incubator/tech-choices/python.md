### Python

Python was chosen for the desktop control application due to its rapid prototyping capabilities and extensive scientific library ecosystem:

*   **Tkinter & TTK**: Used to design a lightweight, responsive, and cross-platform desktop user interface without external framework overhead.
*   **SciPy (`scipy.optimize.curve_fit`)**: Critical for executing non-linear least squares regression to fit raw analog voltages to the logarithmic calibration curve.
*   **Matplotlib**: Utilized with the `TkAgg` backend to embed real-time, multi-line plots and standard curve diagrams directly into the Tkinter window layout.
*   **PySerial**: Provides a reliable, cross-platform interface for asynchronous serial communication over USB, allowing the GUI thread to coordinate with the Arduino micro-firmware.
