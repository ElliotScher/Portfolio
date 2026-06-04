### Why Java was chosen for GompeiLib

Java is the primary programming language used for FRC robot code. Writing GompeiLib in Java provides several benefits:

- **FRC Integration**: Since the official FRC control system is natively compatible with Java, writing the library in the same language ensures it can be imported as a dependency without any conversion layer.
- **Object-Oriented Architecture**: Java's object-oriented features are heavily leveraged to define clean abstract interfaces (like `MotorController` and `Gyro`) and separate vendor-specific implementations (like CTRE TalonFX or REV SparkMax).
- **Ease of Use**: Most FRC student programmers on Team 190 are already familiar with Java through their standard coursework, reducing the barrier to entry for contributing to or using the library.
