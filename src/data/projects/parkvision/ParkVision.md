## Summary

**Park Vision** is a desktop application built by a WPI Interactive Qualifying Project (IQP) to help the National Park Service understand visitor use in Acadia National Park, using still images and video already captured by trail cameras deployed around the park. Rather than someone manually scrubbing through thousands of photos and hours of footage by hand, Park Vision runs a computer vision pipeline over that footage automatically: it detects and tracks people, bicycles, and vehicles; estimates their direction of travel and speed; reads license plates to compute how long a vehicle stays parked; and counts how many distinct visitors pass through a given location - exporting whichever of these results a researcher needs straight to a spreadsheet. In a live test at Acadia's Jordan Pond parking lot, the system matched manually collected vehicle counts with **98% accuracy** and read license plates correctly **93%** of the time.

***

## Context

### The Problem

Acadia is one of the most visited national parks in the country, and understanding *how* people move through it - where they park, how long they stay, how many cyclists versus pedestrians use a given trail - is central to how the National Park Service plans everything from shuttle routes to trail maintenance. Today, that understanding largely comes from someone sitting down and manually counting people, bikes, and cars in camera footage, frame by frame. It's slow, it doesn't scale to a whole season of cameras, and every hour spent counting is an hour not spent on other park work.

### The Partners

Park Vision was built as a WPI Interactive Qualifying Project (IQP), advised by faculty from WPI, in partnership with **Friends of Acadia** and the **National Park Service**. The IQP model is WPI's project-based degree requirement centered on applying technical work to a real, external problem; here, that meant sitting down with NPS staff to understand what they actually needed from a monitoring tool, not just what was technically interesting to build.

### Design Goals

Talking with NPS staff shaped a few concrete constraints for the system:

* **Automate the tedious part, not replace judgment.** The goal was to give researchers a toolkit of independent analyses they could mix and match, not a single black-box "visitor count" number they'd have to trust blindly.
* **Run on what NPS staff already have.** No GPU, no cloud account, no IT department standing up a server - a downloadable desktop app that works on an ordinary laptop.
* **Never touch the original footage.** Trail-camera archives are the park's data; every analysis result had to be stored separately from the source media, never overwriting it.
* **Be honest about accuracy.** Every capability needed to be validated against real, manually collected ground truth - not just demoed on a handful of cherry-picked clips.

## Tech Stack

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="ParkVision"></div>

## How It Works

At a high level, footage flows through Park Vision in one direction: raw media in, structured detections out, then several independent analyses that all read from those same detections, all of it stored in a small local database the desktop app reads from and writes back to.

<div class="project-hardware-image-wrapper">
    <img src="assets/projects/parkvision/system-architecture.svg" alt="Park Vision system architecture diagram" class="project-hardware-image">
    <p class="project-image-caption">Trail-camera media flows through detection, then fans out into four independent analysis modules that all write back to one local database the desktop app reads from.</p>
</div>

Detection comes first: every photo or video frame is run through YOLO, a real-time object detector, to find people, bicycles, and vehicles (and, on video, license plates). Everything after that point is built on top of those detections rather than re-examining the raw pixels from scratch. Frame-to-frame tracking follows one visitor across a video; a separate clustering step notices when several visitors are grouped together in the *same* frame; a third step catches a very specific double-counting problem - a cyclist normally shows up as two boxes (a person and a bicycle), and merging them keeps that from being counted as two visitors instead of one. From there, pose-based models work out which way a pedestrian or vehicle is facing, license plates get read and matched against themselves over time to compute how long a car stays parked, and a re-identification model compares still photos to each other to count distinct visitors even when they weren't continuously tracked on video. Every one of those results lands in a small SQLite database created *inside* the folder being analyzed - never modifying the original media - which is what the desktop app's galleries, filters, and CSV export are all built on top of.

Click through each stage below for a deeper technical walkthrough, including the specific algorithms, models, and a few hard-won lessons from testing them against real footage:

<div class="project-process-diagram"></div>

## Results & Validation

Every capability in Park Vision was validated against manually collected ground truth at a real Acadia location - Jordan Pond, one of the park's busiest parking areas - rather than just demoed on a handful of clips. Vehicle counts from the occupancy pipeline matched manual counts **98%** of the time, and license plates were read correctly **93%** of the time. Direction and speed estimation were separately validated against labeled benchmark datasets, detailed in the "Direction & Speed" step above.

Below is our team's research poster, presented to WPI and Friends of Acadia, walking through the full challenge, methods, and results in one view - click to zoom in:

<div class="project-media-gallery"></div>

## The Desktop Application

All of the analyses above are exposed through a cross-platform desktop app built with PySide6 (Qt's official Python bindings), rather than a command-line tool researchers would need to script by hand. Opening a folder of photos or videos builds a browsable, paginated gallery of everything in it; a matching Entities view lets you browse every tracked visitor instead of every photo. A composable filter system narrows either view down by date, time, entity type, direction, speed, or group size, and a family of analysis dialogs - one per capability described above - runs the underlying pipeline and writes results straight back to the database, all without freezing the interface, since long-running analyses run on background threads with a live progress indicator. When the numbers are ready, four different CSV export shapes (per image, per entity, per visitor group, or per fixed time interval) cover the range of questions a researcher might actually want answered.

The finished app is packaged with PyInstaller for Windows, macOS, and Linux, built automatically by GitHub Actions on every change, and published as a downloadable release - matching exactly how NPS staff are meant to install and run it in the field.

## Future Additions

Below are some of the improvements our team identified - both from our own testing and directly from conversations with National Park Service staff - as the natural next steps for Park Vision:

<div class="project-future-additions"></div>

## Full Report

For the complete methodology, evaluation, and results behind every number above, you can read the full IQP report below or download it directly.

<div class=pdf-embed-container>
    <div class=pdf-embed-header>
        <span class=pdf-embed-title>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pdf-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
            AI for Visitor Use Management Data Collection: Full IQP Report
        </span>
        <a href="assets/projects/parkvision/Report.pdf" target="_blank" class="pdf-download-btn" download>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download PDF
        </a>
    </div>
    <div class=pdf-embed-body>
        <iframe src="assets/projects/parkvision/Report.pdf"></iframe>
    </div>
    <div class=pdf-mobile-preview>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pdf-mobile-preview-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
        <div class=pdf-mobile-preview-title>Full IQP Report</div>
        <div class=pdf-mobile-preview-desc>For the best reading experience on mobile, you can view or download the full PDF report directly.</div>
        <a href="assets/projects/parkvision/Report.pdf" target="_blank" class="pdf-mobile-view-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            Open PDF in New Tab
        </a>
    </div>
</div>
