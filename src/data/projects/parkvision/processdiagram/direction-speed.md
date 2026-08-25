# Direction & Speed Estimation

Knowing *that* someone passed the camera is only half of what the Park Service asked for - they also wanted to know which way visitors were headed and, for vehicles, how fast they were going. Park Vision answers direction differently for pedestrians than for vehicles, because the two use completely different pose models under the hood.

## Which Way Is a Person Facing?

Pedestrian direction (`pedestrian_direction.py`) works on a single still frame, using a body pose-keypoint model. It buckets each detected keypoint - shoulders, hips, ankles, and so on - into "anatomically left side," "right side," "front-facing," and "back-facing" groups, keeps only the keypoints confident enough to trust, and averages each group's horizontal position. Comparing those averages tells the algorithm which side of the body is closer to which side of the frame, which resolves to a left/right/front/back label without needing any motion history at all - no tracking across frames required.

## Which Way Is a Car Pointed?

Vehicles have no standard body-pose model, so this project uses a 14-keypoint pose model fine-tuned on the CarFusion dataset (its weights are fetched on first use from Google Drive, since it isn't hosted on any of the usual model registries). Six of those keypoints cluster around a car's front (headlight, front wheel, front roofline); six cluster around the rear. Comparing the average horizontal position of the confident front-cluster keypoints against the rear cluster reveals which way the car is oriented. One hard-won detail from testing: this model has to run on the **full, uncropped frame** - tightly cropping to just the vehicle first collapsed its accuracy from 94% down to 9%, so the pipeline always runs pose estimation on the whole image and then matches the result back to the right vehicle by box overlap.

## Turning Pixel Movement Into Miles Per Hour

Speed is a separate, motion-based measurement computed once a vehicle's full track is known (`video_entityprofiler.py`). Its *relative* speed is just how far its box center moved between its first and last sighting, divided by the elapsed time - a straightforward average pixel-velocity, not frame-by-frame instantaneous speed. Because a trail camera isn't calibrated (no known focal length, mounting height, or lane geometry), Park Vision can't derive real-world speed from pixels through geometry alone. Instead, it uses a single-point calibration: point at one vehicle whose real speed is already known (say, from a radar reading or a GPS-logged pass), and every other vehicle's relative speed is scaled by the same ratio. A separate recalibration tool can re-derive that scale factor against a *different* reference vehicle after the fact, without reprocessing any video - and it can calibrate left-traveling and right-traveling vehicles independently, since a camera's perspective compresses real-world distance into fewer pixels for traffic moving away from it than traffic approaching it.

## Checking the Work

Both direction classifiers and the speed estimator are validated against labeled ground truth, not just eyeballed: vehicle and pedestrian direction against hand-labeled image sets (scored with full confusion matrices), and speed against the BrnoCompSpeed traffic dataset, which pairs real dashcam-style footage with LiDAR-measured true speeds.
