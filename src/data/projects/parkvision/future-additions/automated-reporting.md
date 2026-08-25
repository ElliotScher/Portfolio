### Scheduled Automated Reporting

Every analysis in Park Vision today is triggered by hand - a person opens the desktop app, picks a folder, and runs a menu action. For an ongoing monitoring program, that means someone has to remember to do it, on top of everything else park staff are responsible for.

#### Goals
- **No One Has to Remember to Run It**: Turn "open the app and click Analyze" into a scheduled job that runs on its own, so visitor-use data stays current without a person in the loop for routine processing.
- **A Standing Summary, Not a Manual Export**: Deliver a regular digest - new camera footage processed, updated visitor counts, any dwell-time or speed flags worth a human's attention - straight to the people who need it.

#### Planned Approach
- **Reuse the Existing CLI Pipeline Directly**: Every GUI dialog in Park Vision is a thin wrapper around a command-line-runnable script (`video_yolo.py`, `video_entityprofiler.py`, `report_summarizer.py`, and so on) - a scheduled job could chain those same scripts together exactly as the desktop app does internally, with no separate "automation version" of the logic to maintain.
- **Build on the Existing Email-Ready Report Format**: `htmlreport.py` already generates styled HTML tables designed to survive being pasted directly into an email, originally built for the plate-OCR benchmark's output - the same approach extends naturally into a periodic visitor-use summary emailed to park staff.
- **A Cron-Style Trigger**: A scheduled task (whether a simple cron job on a park-office machine or a CI-style scheduled workflow) would periodically check watched camera folders for new, unanalyzed footage and run the pipeline automatically, similar in spirit to how this project's own GitHub Actions workflows already run on a trigger rather than by hand.
