### Arduino

The Arduino microcontroller handles real-time actuator control and analog sensor reading:

*   **Deterministic Execution**: Since it lacks a complex operating system scheduler, the Arduino guarantees millisecond-accurate timing required for stepper motor pulse generation and photodetector sampling.
*   **Analog Input (ADC)**: Utilizes the built-in Analog-to-Digital Converter on pin `A1` to sample the photodetector voltage output directly, filtering electrical noise before transmitting data.
*   **AccelStepper Library Support**: Leverages standard hardware-accelerated movement libraries to calculate smooth ramps, protecting the stepper driver from high-torque start-up stresses.
