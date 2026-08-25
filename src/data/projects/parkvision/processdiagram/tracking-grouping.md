# Entity Tracking & Grouping

A raw detection report is a pile of boxes - it doesn't yet know that the "person" box in frame 40 and the "person" box in frame 41 are the same visitor, or that a "bicycle" box and the "person" box overlapping it are one cyclist, not two separate people. Three purpose-built algorithms turn boxes into the entities everything else in Park Vision actually reasons about.

## Following One Visitor Across Frames

Frame-to-frame tracking (`entity_iou_tracking.py`) works directly against the database rather than the raw JSON report. For every new image, it compares each freshly detected box against every currently active track's most recent box, using Intersection-over-Union (IOU) - how much two rectangles overlap relative to their combined area - as the similarity score. Each detection greedily claims whichever active track it overlaps best with (as long as the classes match and that track hasn't already been claimed this frame); anything left over starts a brand-new track. A track that goes unmatched for longer than a configurable gap (one second by default) is considered finished, and its overall direction and raw pixel speed are computed from how far its very first and very last box moved.

## Telling a Group Visit from a Lone Visitor

Separately, `cluster.py` groups detections that appear *together in a single frame* - not across time - using a classic union-find (disjoint-set) structure. Two boxes only merge into the same cluster if they're both physically close *and* similarly sized. That size check matters: without it, a person standing far in the background could get lumped in with an unrelated person standing right next to the camera, just because their boxes happen to be pixel-adjacent. Requiring similar box sizes is a cheap proxy for "these two subjects are actually roughly the same distance from the camera," which keeps clusters meaningful as actual visitor groups rather than incidental screen-space neighbors.

## Not Double-Counting a Cyclist

The COCO detector sees a person riding a bike as *two* separate objects - a "person" box and a "bicycle" box - which, left alone, would count one cyclist as two visitors. `bike_rider_merging.py` fixes this with a simple geometric heuristic: for every detected bike, it looks for an unclaimed person whose center sits close to the bike's top-center anchor point, scaled by how large that person appears in frame (so the matching radius adapts to how close/far the rider is from the camera). Once matched, the person's box is absorbed into an expanded bounding box around the bike, and the redundant person detection is deleted - leaving one entity, the cyclist, instead of two.

Every one of these three algorithms writes its results back into Park Vision's SQLite `Entity`/`Instance` tables, which is what lets the desktop app's Entities tab show a visitor's full track, cluster membership, and merged rider status without re-running any of this logic on demand.
