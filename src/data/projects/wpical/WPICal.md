## Summary

**WPICal** is a cross-platform camera and field calibration tool designed for the FIRST Robotics Competition (FRC) to empirically measure and calibrate the 3D positions and orientations of AprilTags on a playing field. Built as a desktop application and integrated directly into the official WPILib suite, WPICal streamlines the field calibration process by combining camera intrinsic calibration (via ChArUco boards) with multi-view relative tag pose estimation. By formulating the tag positions as a non-linear least squares optimization problem and solving it via Ceres Solver, the tool generates a high-accuracy, corrected JSON field map that accounts for physical assembly tolerances and setup variations, significantly improving vision-based robot localization.

***

## Context

In the FIRST Robotics Competition (FRC), modern robots rely heavily on vision-based localization to automate navigation and scoring. Using onboard cameras, robots detect 2D fiducial markers known as AprilTags and calculate the robot's global position relative to the field origin. This process relies on a crucial assumption: the physical AprilTags on the field must reside exactly at the 3D coordinates specified in the official game manual and CAD maps.

In practice, this assumption rarely holds. Even at official regional and championship events, AprilTags are hand-placed and subject to setup tolerances, tape wrinkles, and structure warping. On a practice field, variations are often much larger. An error of just a few inches or a couple of degrees in a tag's placement propagates through the pose estimation pipelines, causing significant drift and localized jumps in the robot's estimated position, which can render pre-programmed autonomous routines unreliable.

### Empirically Measuring Field Variations

To maintain high-precision localization, teams need a way to measure the actual, physical positions of AprilTags relative to one another and generate a custom field map:

* **Camera Calibration**: Before measuring tag positions, the system must accurately model the camera's lens characteristics. Subtle lens distortions or incorrect focal lengths will distort the perceived 3D distance and rotation to a tag. This is solved by analyzing frames of a high-contrast ChArUco (Checkerboard + ArUco) pattern to compute the camera's intrinsic calibration parameters.
* **Least Squares Bundle Adjustment**: By capturing video frames showing multiple tags simultaneously from different angles, the system establishes a web of spatial constraints. If Tag A and Tag B are visible in the same frame, the relative transform between them is measured. When the camera moves, additional constraints are gathered. WPICal aggregates all these measurements and runs a global optimization to solve for the tag positions that minimize the overall measurement error.

To solve these calibration challenges, I developed **WPICal**, inspired by the command-line "cowlibration-field" tool created by FRC Team 1538 (The Holy Cows). WPICal makes this mathematical process accessible to any FRC team through a graphical interface, and was subsequently integrated directly into WPILib as a standard tool. The design constraints for the project were as follows:

* Must integrate seamlessly with the WPILib tool ecosystem and installer across Windows, macOS, and Linux
* Must provide a unified, user-friendly GUI combining camera intrinsic calibration and field tag calibration
* Must support robust, multi-view least squares optimization to solve for relative tag poses
* Must output standard WPILib/Limelight/PhotonVision-compatible JSON field maps
* Must run efficiently and perform optimizations in a matter of seconds on standard laptops

## Tech Stack

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="WPICal"></div>

## Calibration Pipeline

The WPICal calibration workflow operates in 5 sequential stages, from video acquisition to the generation of combined field coordinate maps:

<div class="project-process-diagram"></div>

## Future Additions

Below are some of the planned improvements, architectural updates, and research initiatives for the next iterations of WPICal:

<div class="project-future-additions"></div>
