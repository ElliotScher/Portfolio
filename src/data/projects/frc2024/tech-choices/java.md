### Java for FRC 2024 Codebase

Java was selected as the primary language for FRC Team 190's 2024 robot software to leverage WPILib's native Command-Based framework and support clean object-oriented architecture:

* **Object-Oriented Subsystems**: Encapsulating hardware interfaces within clean class structures allows the robot software to easily manage complex mechanisms like Whiplash's pivot arm or Snapback's adjustable hood.
* **Type Safety & Enums**: Enums are heavily utilized to declare robot types (Whiplash vs. Snapback) and preset scoring states (Intake, Speaker, Amp), preventing runtime crashes from invalid states.
* **AdvantageKit Compatibility**: The AdvantageKit telemetry and simulation framework is natively built for Java, ensuring stable logging and deterministic replay pipelines.
