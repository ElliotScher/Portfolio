### Java for FRC 2025 Codebase

Java was selected as the primary language for FRC Team 190's 2025 robot software to support modular subsystem development and complex state routing:

* **Graph Data Structures**: Leveraging Java collections and graph libraries (like `jgrapht`) makes it straightforward to model the robot's superstructure states as vertices and transitions as edges.
* **Type Safety**: Prevents runtime errors when defining targets across the elevator, pivot arm, and gripper configurations.
* **AdvantageKit Ecosystem**: Allows native integration with the AdvantageKit logging and replay framework to record and debug robot operations.
