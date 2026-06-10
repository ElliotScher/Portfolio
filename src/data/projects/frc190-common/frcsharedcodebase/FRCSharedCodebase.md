## Summary

**FRC Shared Codebase Design & Execution** is a highly modular, single-codebase multi-robot architecture designed and implemented for FRC Team 190. Unlike typical FRC development workflows where different robots are split across branch forks or multiple repositories, this architecture allows Team 190 to concurrently develop, test, and deploy code for multiple completely separate, ground-up robot builds (such as the V1, V2, and V3 competition robots) within a single unified repository. By combining a compile-time SSH safety check during deployment with a runtime configuration router, the codebase prevents hardware-mismatch failures and enables a seamless, concurrent software development cycle for multiple physical robots.

***

## Context & Challenge

Throughout a single competition season, FRC Team 190 builds multiple distinct robots. Rather than typical iterative prototypes, these are completely separate, ground-up mechanical builds (such as V1 and V2) that are deployed and competed with in parallel at different events. Because these robots represent completely different physical architectures, they possess distinct wiring schematics, motor controller configurations, port mappings, and mechanical capabilities.

Maintaining separate codebases or branches for each physical robot creates significant software fragmentation:
* Bug fixes made on one branch must be manually ported and merged into others.
* Divergent code structures complicate peer reviews and onboarding.
* Accidental deployment of one robot's control code to another could physically damage the custom-built actuators and hardware systems due to incorrect port mapping or sensor bindings.

To solve this, I designed a unified multi-robot codebase architecture. The design constraints were:
1. **Single Main Repository**: A single codebase branch must support all active robot builds concurrently.
2. **Automated Safety Checks**: The deploy pipeline must automatically verify the physical target robot hardware before flashing the compiled code.
3. **Clean Runtime Routing**: Runtime initialization must dynamically load the appropriate control bindings based on the active target robot.

## Architectural Overview

The system operates via a dual-layered verification and routing architecture:

![Shared Codebase Architecture](assets/projects/frcsharedcodebase/shared-codebase-architecture.svg)

### 1. Compile-Time SSH Safety Check
The primary innovation of this codebase is the automated hardware validation task configured in `build.gradle`. During the deployment process, the build script executes a custom task `checkRoboRIOtoRobotType` which hooks into the deploy process:

```groovy
task checkRoboRIOtoRobotType {
    dependsOn compileJava
    doLast {
        // Fetch the RoboRIO host comment/flag via SSH using JSch
        def ROBORIO_COMMENT = fetchNameUsingJSch(
                roboRIOHost, roboRIOUser, roboRIOPassword, machineInfoFile
        )
        println "RoboRIO Name: ${ROBORIO_COMMENT}"

        // Loadcompiled config classes reflectively
        def buildOutputDir = file('build/classes/java/main')
        URLClassLoader loader = new URLClassLoader([buildOutputDir.toURI().toURL()] as URL[], this.class.classLoader)
        def constantsClass = loader.loadClass('frc.robot.RobotConfig')
        def robotField = constantsClass.getDeclaredField('ROBOT')
        robotField.setAccessible(true)
        def robotEnumValue = robotField.get(null)

        // Validate that the target RoboRIO hostname/comment matches the compiled code target
        if (!ROBORIO_COMMENT.equalsIgnoreCase(robotEnumValue.name())) {
            throw new GradleException("Mismatch! The RoboRIO comment '${ROBORIO_COMMENT}' does not match the ROBOT value '${robotEnumValue.name()}'\nTo Fix: Match RoboRIO comment to ROBOT in file.")
        }
    }
}
deployroborio.dependsOn(checkRoboRIOtoRobotType)
```

This task SSHs into the connected RoboRIO to read the hardware comment/identity flag stored in `/etc/machine-info`. Crucially, because the Gradle build system executes in a separate process outside the JVM scope of the running robot application, the build script cannot access the code variables directly. To resolve which robot target the compiled codebase is configured to deploy to, the script must dynamically instantiate a `URLClassLoader` pointing to the build's output directory (`build/classes/java/main`) and load the compiled configuration class (e.g., `RobotConfig`) via reflection. It then inspects the static `ROBOT` field to extract the target enum constant. Finally, the script compares the hardware flag with the code target, immediately throwing a `GradleException` and halting the build if a mismatch is detected, preventing developers from accidentally flashing incompatible software configurations to active hardware builds.

### 2. Compile-Time Resource Routing
In addition to safety checks, the Gradle script dynamically adapts the static file deployment target based on the selected robot type. Folders containing robot-specific configuration parameters and path planning profiles are compiled and mapped to correct deploy destinations on the RoboRIO file system (e.g., `/home/lvuser/deploy/<robot_type>`), ensuring only relevant assets are loaded at runtime.

### 3. Runtime Switch and Execution routing
At the application layer, the target configuration is declared inside a centralized config file (e.g. `RobotConfig.java` or `Constants.java`):

```java
public final class RobotConfig {
  public static final RobotType ROBOT = RobotType.V2_ROBOT;

  public enum RobotType {
    V1_ROBOT,
    V2_ROBOT,
    V3_ROBOT;
  }
}
```

During initialization inside `Robot.java`, the main robot entry point instantiates the correct robot container dynamically:

```java
robotContainer = switch (RobotConfig.ROBOT) {
  case V1_ROBOT -> new V1_RobotContainer();
  case V2_ROBOT -> new V2_RobotContainer();
  case V3_ROBOT -> new V3_RobotContainer();
  default -> new RobotContainer() {};
};
```

This isolates the hardware mapping, button bindings, and controller layouts inside separate container subclasses while keeping common utilities, math modules, and custom drivers shared across all builds in the same project directory.

## Tech Stack

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="FRCSharedCodebase"></div>