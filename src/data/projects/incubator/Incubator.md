## Summary

The **Automated Laboratory Incubator** is a distributed, closed-loop laboratory automation system designed to monitor, calibrate, and track real-time optical density (OD) measurements for high-throughput biological or chemical experiments. The system coordinates a 50-channel rotating sample wheel driven by a stepper motor, performs high-precision analog photodetector readings, and handles bidirectional, asynchronous communication with a Python-based desktop dashboard. It features a non-blocking firmware state machine, SciPy-powered logarithmic calibration curve fitting, and a robust run resiliency pipeline for crash recovery.

***

## Context

In experimental microbiology and biochemistry, tracking the growth curves of cell cultures or the progression of chemical reactions requires continuous optical density (OD) measurements. Typically, this is done using spectrophotometers, which can be expensive and labor-intensive when running many samples in parallel.

To solve this, this custom **Automated Laboratory Incubator** allows scientists to track up to 50 channels simultaneously in a single automated system. It addresses three core engineering challenges:
1. **Mechanical Agitation**: Keeping cells or reactants in suspension requires physical agitation. The system performs periodic clockwise and counter-clockwise rotations between measurement cycles to prevent samples from settling.
2. **High-Precision Positioning**: Aligning the photodetector with each of the 50 tiny sample vials requires sub-millimeter motor control.
3. **Sensor Non-Linearity**: Analog photodetectors produce raw voltage outputs that do not scale linearly with optical density. The system resolves this using multi-run averaging and logarithmic curve-fitting algorithms.

## Tech Stack

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="Incubator"></div>

## System Architecture

The Automated Laboratory Incubator relies on a hardware-software co-design consisting of an Arduino-controlled physical actuator/sensor suite and a multi-threaded desktop GUI client.

![System Architecture](assets/projects/incubator/system-architecture.svg)

### 1. Hardware Integration & Pinout

The microcontroller firmware controls the stepper motor driver, reads the limit switch for homing, monitors a physical pause button, and samples the analog photodetector.

| Pin Name    | Pin Number | Type             | Description                                                           |
|:------------|:-----------|:-----------------|:----------------------------------------------------------------------|
| `pausePin`  | `4`        | `INPUT_PULLUP`   | Physical pause button (active low) for emergency interruption.        |
| `stepPin`   | `5`        | `OUTPUT`         | Stepper driver step command pin.                                      |
| `dirPin`    | `6`        | `OUTPUT`         | Stepper driver direction command pin.                                 |
| `homingPin` | `7`        | `INPUT`          | Limit switch to locate the physical reference zero position.          |
| `ODPin`     | `A1`       | `INPUT (Analog)` | Photodetector analog input for measuring transmitted light intensity. |

### 2. Non-Blocking Firmware Architecture

To ensure the serial interface remains responsive and safety checks (like the physical pause button) are polled instantly, the Arduino firmware ([arduino.ino](file:///home/elliotscher/Downloads/Incubator-main/arduino/arduino.ino)) runs a non-blocking Finite State Machine (FSM). It utilizes two custom C++ hardware abstraction helper classes:

*   **[StepperHomer](file:///home/elliotscher/Downloads/Incubator-main/arduino/StepperHomer.h)**: Manages a multi-stage homing sequence. It fast-seeks the homing switch, backs off by a few steps, and then performs a slow, high-precision homing check to establish absolute zero.
*   **[ChannelStepper](file:///home/elliotscher/Downloads/Incubator-main/arduino/ChannelStepper.h)**: Performs coordinate translations between channel indices (1 to 50) and motor steps.

![Firmware Finite State Machine](assets/projects/incubator/firmware-fsm.svg)

### 3. Serial Communication Protocol

The desktop GUI and Arduino communicate over a 9600 Baud UART serial connection using structured, newline-delimited command strings.

*   **GUI-to-Firmware Commands**:
    *   `CMD:TESTCONNECTION`: Triggers a diagnostic ping response.
    *   `CMD:CALIBRATE`: Initiates the calibration routine.
    *   `CMD:RUNREACTION`: Starts a standard reaction tracking run.
    *   `CMD:PAUSE_REACTION` / `CMD:RESUME_REACTION`: Pauses and resumes the active experiment.
    *   `CMD:CANCEL_REACTION`: Immediately halts all motion and resets the system state to `IDLE`.
    *   `CHANNELS:N` & `AGITATIONS:N`: Configures the active channel count and the number of agitation revolutions per cycle.
*   **Firmware-to-GUI Responses**:
    *   `ping\n`: Acknowledges connectivity.
    *   `OD:<val>\n`: Transmits raw photodetector analog measurements during calibration.
    *   `OD:<val>CH:<chan>\n`: Transmits raw measurements paired with their corresponding channel IDs during active runs.
    *   `CMD:CALIBRATION_FINISHED\n`: Signals completion of the calibration routine.

## Mathematical Calibration Model

Analog photodetectors output voltage values representing light transmission. According to the Beer-Lambert law, light transmission decays exponentially with concentration (and hence optical density). Consequently, raw sensor output $x$ (voltage) is mapped to optical density $y$ using a logarithmic model:

$$y = a \cdot \log_{10}(x) + b$$

### Regression and Curve Fitting

During a calibration sequence:
1. The user inputs the expected optical density values for reference standard vials in a spreadsheet-like grid.
2. The instrument runs **10 sequential calibration passes** over the active standard channels.
3. The system aggregates the raw voltage data, calculates the average voltage for each channel to filter out noise, and runs a **Non-Linear Least Squares** regression using SciPy's `scipy.optimize.curve_fit` to estimate the fitting parameters $a$ and $b$.
4. The application evaluates the goodness-of-fit by calculating the Coefficient of Determination ($R^2$):

$$R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$$

5. The resulting parameters ($a$, $b$, and $R^2$) are saved, and a calibration curve is dynamically generated alongside experimental standard deviations and error bars.

![Logarithmic Calibration Curve](assets/projects/incubator/calibration-curve.svg)

## Desktop Application Architecture

The user-facing dashboard is written in Python using **Tkinter** and organized as a Single Page Application (SPA) utilizing a multi-frame navigation stack.

*   **Diagnostics Hub (`connection_view.py`)**: Handles automatic port discovery, baud rate validation, and connection testing.
*   **Calibration Studio (`calibration_view.py`)**: Houses the configuration table, collects calibration sweeps, operates the curve-fitting regression, and visualizes the mathematical fit.
*   **Reaction Center (`run_view.py`)**: Combines configuration inputs (agitations, active channel checkmarks) with controls to start, pause, resume, or abort runs. It embeds a live-updating Matplotlib multi-line plot that graphs Optical Density ($y$) vs. Time ($t$) for all selected channels in real-time.

![Desktop Application Architecture](assets/projects/incubator/desktop-architecture.svg)

## Data Resiliency & Recovery

To protect experimental data from power failures or application crashes, the system features a local, auto-saving data buffer.

1. **Sandboxed Data Storage**: Rather than relying on user folders, telemetry is continually buffered in a system temp directory (`/var/tmp/incubator/`).
2. **Telemetry Staging**: Live runs log raw entries into temporary CSV buffers. Upon successful completion, these files are aggregated and exported into structured reports.
3. **Emergency USB Archiving**: If the application crashes or the system loses power mid-run, the GUI scans for leftover telemetry files in the buffer directory upon reboot. If it detects an incomplete run, it prompts the user to insert an external USB drive (automatically mounted at `/media/incubator/` on Linux) and exports a zipped archive containing all recovered data points up to the failure.
