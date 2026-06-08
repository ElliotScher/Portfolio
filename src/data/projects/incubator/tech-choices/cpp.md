### C++ (Arduino)

C++ was selected as the language for the Arduino micro-controller firmware to ensure high-performance, deterministic hardware execution:

*   **Low-Level Hardware Control**: Directly manipulates digital and analog pins for microsecond-level stepper pulse timing and precise photodetector ADC sampling.
*   **Object-Oriented Design**: Utilizes custom classes (`StepperHomer` and `ChannelStepper`) to abstract motor homing and backlash-compensated coordinate translation while preserving a clean codebase.
*   **Zero-Overhead Performance**: Compiles to raw machine code with minimal memory footprints, ensuring the microcontroller can maintain the state machine without latency or jitter.
