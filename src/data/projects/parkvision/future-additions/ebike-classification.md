### E-Bike & Fine-Grained Vehicle Classification

Standard COCO-trained detectors only know "bicycle" — they have no concept of an e-bike as a distinct category. During the project, National Park Service staff specifically called this distinction out as something they'd want, since e-bikes affect trail planning and safety considerations differently than traditional bicycles.

#### Goals
- **A Real Category, Not a Guess**: Move from "every two-wheeled, pedal-shaped thing is a bicycle" to a classifier that can tell an e-bike apart from a standard bike, ideally without requiring a whole new detection model trained from scratch.
- **Extend, Don't Replace**: Fit into the existing pipeline the same way the current pose-based direction models do — as an additional classification pass over an already-detected bicycle box, rather than a wholesale replacement of the detection stage.

#### Planned Approach
- **A Focused Classifier on Top of Existing Detections**: Train a lightweight image classifier (fine-tuned on a small labeled e-bike/standard-bike dataset) that runs on the cropped bicycle region a detection has already found, similar in spirit to how vehicle direction runs a second, specialized model over an already-detected car box.
- **Fold Into the Existing Class-Merging Convention**: Park Vision already has a central place (`classes.py`) where detector class IDs get normalized into the categories the rest of the pipeline understands — e-bike would become a fourth first-class category there, flowing automatically into tracking, clustering, and CSV export without those modules needing to know anything changed.
