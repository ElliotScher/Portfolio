### Image-Level Direction for Occupancy Counts

The still-image occupancy pipeline currently has a known placeholder: `determine_image_direction` is a stub that just checks whether the word "left" or "right" happens to appear in a filename, rather than actually looking at the image. It works for the specific, pre-organized datasets it was tested against, but it isn't a real computer-vision solution.

#### Goals
- **Actually Classify Entering vs. Exiting**: Replace the filename heuristic with a model that looks at the image itself - vehicle orientation, or which way a pedestrian is facing - to determine direction of travel, consistent with how the video pipeline already does this for tracked entities.
- **Keep Entry/Exit Counting Working Without the Naming Convention**: Once direction comes from the image instead of the filename, occupancy profiling stops depending on files being pre-sorted into "left camera" and "right camera" folders, making it usable on more loosely organized photo archives.

#### Planned Approach
- **Reuse the Existing Direction Models**: The video pipeline already has working pedestrian pose-direction and vehicle pose-direction classifiers - the natural first step is applying those same single-image models to occupancy's still photos rather than building something new from scratch.
- **Fall Back Gracefully**: Since occupancy images can be lower-quality or more distant than dedicated tracking footage, a real classifier would need a documented low-confidence fallback (matching the existing filename heuristic, or simply "unknown") rather than forcing a guess the rest of the pipeline would treat as ground truth.
