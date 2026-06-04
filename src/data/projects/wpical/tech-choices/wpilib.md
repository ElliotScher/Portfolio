### Why WPILib was chosen for WPICal

WPILib is the official software library and tool ecosystem for the FIRST Robotics Competition (FRC).

- **Direct Tool Integration**: WPICal is packaged and distributed with the official WPILib installer. FRC teams can launch WPICal directly from Visual Studio Code or the WPILib launcher, ensuring immediate accessibility.
- **GUI and Desktop Framework**: WPICal's graphical user interface is built on `wpigui` (WPILib's wrapper around Dear ImGui). This provides a lightweight UI that matches the look, feel, and window behavior of other official WPILib tools.
- **Field Representation Standards**: By integrating with WPILib's geometry classes and utilizing its official AprilTag field JSON layouts, WPICal ensures that the generated, calibrated maps conform perfectly to the data structures used by robots on the field.
