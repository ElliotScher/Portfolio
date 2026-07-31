# The App, Database & Export

None of the analysis above is useful to a park ranger if it lives only in a Python script's output. The last stage of Park Vision is the part actually meant to be *used*: a desktop application that ties every pipeline above together, stores their results safely, and gets that data into a spreadsheet.

## A Database That Never Touches the Original Photos

Opening a folder of media in Park Vision creates a small SQLite database file *inside that same folder*, sitting alongside — and never modifying — the original trail-camera images and video. Every detected box, tracked entity, calibrated speed, and computed direction lives entirely in that sidecar database. That separation means results can be regenerated, re-filtered, or deleted at any time without any risk to the source media the National Park Service actually owns.

## Two Tabs, Six Dialogs

The application's two main views — Images and Entities — are both backed by paginated, lazily-loaded gallery widgets so browsing a season's worth of photos stays smooth even at tens of thousands of images. Every analysis technique described earlier is exposed through its own dialog (detection, clustering, frame-by-frame tracking, speed calibration, pose-based direction, bike/rider merging), each one just a thin UI wrapper that calls straight into the same underlying pipeline code the command-line tools use, then writes the results back to the database. A composable filter system lets a user narrow either gallery down by date, time, entity type, direction, speed, or cluster size — all of it translated directly into SQL queries rather than filtered in Python, so it stays fast even on a large archive.

## Keeping the UI Responsive During a Multi-Minute Analysis

Running detection across thousands of images takes real time, and a frozen window would make that unbearable. Long-running analyses are pushed onto background Qt threads through a small `Async`/`ThreadTracker` wrapper, which reports live progress back to a status bar and progress indicator — while the actual database writes are deliberately deferred back onto the main GUI thread once a background job finishes, respecting Qt's rule that a given object should only ever be touched from the thread that owns it.

## From Database Back to a Spreadsheet

The whole point of the analysis is to hand usable numbers to park staff, so export supports four shapes of the same underlying data: one row per image, one row per tracked entity, one row per visitor cluster, or one row per fixed time interval (with optional per-direction breakdowns) — covering the range of questions a researcher might actually ask, from "how many people were in this specific photo" to "how many visitors passed per 15-minute bucket."

## Getting It Onto a Ranger's Computer

The finished app is packaged with PyInstaller into a single executable (with a splash screen shown while the model weights load), then wrapped further per platform — an Inno Setup installer on Windows, a `.app` bundle on macOS, a zipped binary on Linux. All three builds run automatically through GitHub Actions on every change and are published as a timestamped GitHub Release the moment a change is merged, matching exactly what the project's own README tells a park ranger to download.
