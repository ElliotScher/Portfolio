# Robotics Engineering Portfolio & Modular LaTeX Resume System

Welcome to my portfolio and resume codebase. This repository contains a fully responsive, modern single-page application (SPA) portfolio website built with **Vite**, **TypeScript**, and **Vanilla CSS**, integrated with a modular, configuration-driven **LaTeX Resume** system compiled and distributed via automated **GitHub Actions** workflows.

---

## Repository Architecture

```text
├── .github/
│   └── workflows/
│       └── release-resumes.yml  # Compiles and publishes LaTeX resumes to Git releases
│       └── deploy-site.yml      # Builds and deploys Vite SPA to GitHub Pages
├── public/                      # Static assets (images, icons, favicon)
├── src/
│   ├── assets/                  # CSS/TS imported design assets
│   ├── components/              # Reusable UI widgets (ProcessDiagram, ProjectTree, etc.)
│   ├── data/
│   │   ├── projects/            # Markdown files and media specific to each robotics project
│   │   └── resume/
│   │       ├── configs/         # YAML files defining custom resume variations
│   │       ├── resume/          # Modular .tex sections (education, contact, skills)
│   │       ├── build_script.py  # Python LaTeX assembly compiler
│   │       └── main.tex         # Main LaTeX compiler template
│   ├── pages/                   # Main page layouts (Home, Projects, AboutMe, Resume)
│   ├── styles/                  # Styling tokens and CSS modules
│   ├── utils/                   # Code utilities (Markdown parsing, hash router, tracking)
│   ├── main.ts                  # App entrypoint
│   └── router.ts                # Client-side SPA hash router with view-time hooks
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 1. Portfolio Frontend (Vite + TypeScript SPA)

The portfolio frontend is optimized for loading speed, accessibility, and interactive responsiveness.

### Client-Side Hash Router
The custom hash router in [`src/router.ts`](file:///home/elliotscher/Documents/Misc/Portfolio/src/router.ts) maps URL hashes (e.g., `#/projects/GompeiVision`) to dynamic DOM rendering nodes. It manages page changes, highlights sidebar navigation buttons, handles page transitions, and controls browser viewport scrolls.

### Dynamic Project Showcase
The project explorer interface loads content from markdown files (e.g., [`GompeiVision.md`](file:///home/elliotscher/Documents/Misc/Portfolio/src/data/projects/gompeivision/GompeiVision.md)) dynamically and renders it using `showdown` to parse HTML, with `highlight.js` providing colorized syntax highlighting for code blocks. Many projects feature interactive media carousels, custom workflow diagrams, and embedded PDFs (such as lab reports).

### In-Memory Analytics & Dynamic Resume Tailoring
To personalize the visitor's experience, the site monitors which projects the visitor spends time viewing and highlights those specific projects on the resume in real-time.
*   **The Tracking Mechanism**: [`src/utils/analytics.ts`](file:///home/elliotscher/Documents/Misc/Portfolio/src/utils/analytics.ts) listens to router navigation events, browser tab switches (`visibilitychange`), and window closings (`beforeunload`). It tracks the active project and accumulates reading time.
*   **Resume Key Mapping**: Each project object in [`src/data/projects/projects.ts`](file:///home/elliotscher/Documents/Misc/Portfolio/src/data/projects/projects.ts) maps to a LaTeX resume key via `resumeTexFile` (e.g., the FRC 2024, 2025, 2026, and FRCSharedCodebase projects all map to `first_mentor.tex`). The tracker aggregates viewing duration under this single key.
*   **Real-Time Assembly**: When rendering the Resume page, the frontend fetches the top 3 viewed project keys based on reading duration.
*   **Graceful Fallback**: If a visitor hasn't browsed three projects yet, it fills the remaining spots using standard defaults: `GompeiVision`, `WPICal`, and FIRST Mentorship (`first_mentor`).
*   **Zero Footprint**: For privacy, all tracking is strictly in-memory and resets on page reload, leaving no persistent tracking files or cookies in the visitor's browser.

### Print-to-PDF CSS Layout Optimization
The resume page contains a "Print / Save PDF" button that triggers the browser's native print interface. The print output is optimized using `@media print` rules in [`src/styles/pages/resume.css`](file:///home/elliotscher/Documents/Misc/Portfolio/src/styles/pages/resume.css):
*   **Chrome Navigation Stripping**: Hides the sidebar, header, backdrop, print button, and layout wrappers (`display: none !important;`).
*   **Default Header/Footer Removal**: Applies `@page { size: letter; margin: 0; }` which strips browser-added headers and footers (such as URLs, dates, page numbers, and website titles).
*   **Document Centering**: Centers the resume page on the canvas with professional bounding padding (`0.5in 0.6in`).
*   **Height Clamping Prevention**: Overrides parent container heights from `100%` to `auto` to prevent layout clipping and image flattening by browser print subsystems.
*   **Link Preservation**: Styles contact links (`href`) with explicit underlines and dark text so that browser PDF converters map clickable hyperlink regions over LinkedIn, GitHub, and email text.
*   **Redacted Contact Information**: The resume page renders details using the redacted data schema from [`src/data/resume/resumeData.ts`](file:///home/elliotscher/Documents/Misc/Portfolio/src/data/resume/resumeData.ts), which strips the phone number to protect against web-scraping bots.

---

## 2. Modular LaTeX Resume System

Located in [`src/data/resume/`](file:///home/elliotscher/Documents/Misc/Portfolio/src/data/resume/), this subsystem generates customized PDF resume versions from a single, modular source of truth.

### Key Components
1.  **`resume/`**: Directory containing modular `.tex` blocks representing specific sections (e.g. `education/`, `experience/`, `skills/`).
2.  **`configs/`**: Contains YAML configs (e.g. `config_full.yml`, `config_redacted.yml`) defining which content fragments to stitch together for a given resume variation.
3.  **`main.tex`**: The global styling template defining layout, fonts, and packages. It inputs `build.tex` to compile.
4.  **`build_script.py`**: A Python script that parses the target configuration YAML using `PyYAML`, resolves references (automatically scanning both legacy paths and project folder structures), writes the temporary `build.tex`, and executes `pdflatex` to output the PDF.

### LaTeX Hyperlink Enhancements
*   **Clean Look**: Configured `hyperref` in [`main.tex`](file:///home/elliotscher/Documents/Misc/Portfolio/src/data/resume/main.tex#L6) with the `hidelinks` option (`\usepackage[hidelinks]{hyperref}`). This removes the colored rectangles that PDF readers draw over links, keeping the resume looking professional while remaining fully clickable.
*   **Correct Linking**: Corrected contact emails in the templates to point to `ecscher@wpi.edu`.

---

## 3. Automation CI/CD & Deployment

Automation is managed by GitHub Actions workflows in [`.github/workflows/`](file:///home/elliotscher/Documents/Misc/Portfolio/.github/workflows/):

### Site Deployment (`deploy-site.yml`)
Deploys the static client-side bundle to **GitHub Pages** on every push to the `main` branch.
1.  Checks out the code and installs Node.js.
2.  Runs `npm run build` to compile the Vite application.
3.  Uploads the resulting `dist/` build directory to the page-deployment runner.

### Resume Releases (`release-resumes.yml`)
Generates compiled PDF resume assets and registers them on GitHub releases.
1.  Checks out the repository and installs Python with `PyYAML` and a LaTeX package stack (`texlive-latex-base`, `texlive-fonts-recommended`, `texlive-latex-extra`).
2.  Executes `python3 build_script.py --output-dir generated` to compile all resume profiles inside the `configs/` folder.
3.  Obtains the current date and time (format: `YYYYMMDD-HHMMSS`).
4.  Creates a new GitHub Release tagged with the timestamp and attaches the freshly built PDF files as release assets.
5.  **Gitignore Cleanliness**: The generated PDFs are gitignored (`public/resumes/` and `src/data/resume/generated/`) so that compiled binaries do not clutter the source history.

---

## 4. Local Development Guide

### Frontend Development
To run the portfolio website locally:
```bash
# Install Node dependencies
npm install

# Start Vite local development server
npm run dev

# Build the production bundle
npm run build
```

### LaTeX Resumes
To build LaTeX resumes locally:
```bash
# Navigate to the resume directory
cd src/data/resume

# Install Python YAML parser dependency
pip install pyyaml

# Compile all resume configurations in 'configs/'
python3 build_script.py

# Compile a specific resume (e.g. config_redacted.yml)
python3 build_script.py redacted

# Output the PDFs to a target directory
python3 build_script.py --output-dir my_builds
```
