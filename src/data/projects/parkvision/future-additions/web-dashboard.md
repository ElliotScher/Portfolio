### Web Dashboard for Park Staff

The desktop app is built for the person actually running analyses - it assumes familiarity with folders, dialogs, and filter options. But the people who ultimately want the *results* (a superintendent planning a shuttle schedule, a researcher tracking seasonal trends) may just want to look at numbers and charts, on whatever device they happen to have.

#### Goals
- **Read-Only Access for Non-Technical Staff**: Let someone view visitor-use trends, dwell-time summaries, and speed data without installing the desktop app or learning its analysis workflow - a browser tab should be enough.
- **Complement the Desktop App, Not Replace It**: Analysis (running YOLO, tracking, calibration) is compute-heavy and benefits from running locally on a capable machine; a dashboard's job would be presenting the *results* of that work, already computed and stored in Park Vision's SQLite database, not re-running the pipeline itself.

#### Planned Approach
- **Serve Directly From the Existing Database**: Since every analysis result already lives in a structured SQLite database per folder, a lightweight local web server could expose that same data - the report summarizer's aggregate statistics (entity counts by type/direction, per-video breakdowns, speed distributions) map naturally onto dashboard charts without needing a new backend data model.
- **Static Export as a Stepping Stone**: A simpler first version could regenerate a static HTML report (building on the same `htmlreport.py` helpers already used for benchmark output) each time new data is analyzed, giving staff a shareable, no-install summary page before investing in a fully interactive, always-on dashboard.
