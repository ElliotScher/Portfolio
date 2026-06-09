### Java for FRC 2026 Codebase

Java was selected as the primary language for FRC Team 190's 2026 robot software to support modular subsystem development, clean object-oriented architecture, and robust state machines:

* **Object-Oriented Subsystems**: Encapsulating hardware interfaces within clean class structures allows the robot software to easily manage complex mechanisms like Turnover's indexer, shooter, and climb winch systems.
* **Type Safety & Enums**: Enums are heavily utilized to declare robot types (Turnover vs. prototypes) and preset states (Intake, Indexing, Shooting, Climbing), preventing runtime crashes from invalid states.
* **AdvantageKit Compatibility**: The AdvantageKit logging and replay framework is natively built for Java, ensuring stable telemetry recording and deterministic simulation pipelines.
