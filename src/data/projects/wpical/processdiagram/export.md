# Combine & Export

Once the optimization is complete, WPICal provides visual diagnostic utilities and exports the calibrated map to standard formats for consumption in robot software.

## Verification & Visualization

Before exporting, the user must verify the optimization results:

* **Visualization Window:** WPICal opens a visualization window showing the error delta between the reference (ideal) tag positions and the calibrated (measured) tag positions.
* **Focal & Reference Views:** Users can select a "Focused Tag" and a "Reference Tag" to view the precise linear distance (in meters) and rotational alignment (in degrees) between those tags. This allows immediate validation of tag clusters (e.g., scoring goals) relative to the field.

## Exporting Field Layouts

WPICal generates the calibrated map in two official file formats:

1. **WPILib JSON Layout (`.json`):** The standard AprilTag field layout format used natively in WPILib robot code.
2. **PhotonVision/Limelight Field Map (`.fmap` / `.json`):** Supported by popular vision coprocessor solutions to load empirical field maps.

## Combining Calibrations

Often, a single video pass cannot cover a full FRC field, or teams may calibrate different zones of a field separately.

* **Drag-and-Drop Combiner:** WPICal includes a "Combine Calibrations" tool. The user loads the ideal field map and multiple separate calibration JSON outputs.
* **Selective Association:** Users select which physical tags to merge. The interface allows dragging and dropping specific tag IDs to associate them with the desired calibration source.
* **Ideal Map Fallback:** Any tags that are not explicitly assigned to a calibration source automatically revert to their ideal CAD positions, resulting in a single combined field map.
