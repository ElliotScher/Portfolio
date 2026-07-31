# Occupancy Profiling

Not every camera captures continuous video — some trail cameras only take a still photo every so often, which means the images arriving for analysis can be sparse and irregularly spaced in time. Frame-to-frame IOU tracking, which assumes consecutive frames are close together in time, doesn't apply here. Counting how many *distinct* visitors a folder of still images represents needs a different technique: re-identification.

## Recognizing the Same Visitor in Two Unrelated Photos

`image_occupancyprofiler.py` expects each image to already have its subject boxed in green (drawn by an earlier annotation step), which it locates with a strict color mask and contour search. For each boxed subject, it extracts a deep feature embedding from a ResNet-50 network — modified with a Generalized-Mean (GeM) pooling layer, a technique borrowed from image-retrieval research that sharpens how distinctive an embedding is — alongside a simpler color histogram and the box's aspect ratio.

Processing images strictly in chronological order, each new detection is compared against every previously seen visitor's stored embedding using a blend of deep-feature cosine similarity (weighted more heavily) and color-histogram similarity, further adjusted by how similar the two boxes' proportions are. A match only counts if it clears both an absolute similarity threshold *and* a "ratio test" — the best match has to be meaningfully better than the second-best candidate, not just barely ahead of it, a technique borrowed from classical image-matching research. Anything that doesn't confidently match becomes a brand-new visitor.

## Entry, Exit, and a Mirror-Image Trick

For parking lots watched by the same physical camera at both entry and exit, the pipeline supports a dual mode: exit-side crops are horizontally flipped before feature extraction, since a car photographed leaving shows the *opposite* side of the vehicle from when it arrived, and a mirrored comparison lines the two views back up. Every visitor's earliest sighting counts as an arrival, their latest as a departure, and merging all of those events into one running total produces an occupancy timeline — automatically adjusting its starting count upward if the data implies visitors were already present before the observation window began.

This subsystem is behind the project's other headline accuracy figure: **98% agreement with manually collected vehicle counts**, measured against ground truth at Acadia's Jordan Pond parking lot entrance.
