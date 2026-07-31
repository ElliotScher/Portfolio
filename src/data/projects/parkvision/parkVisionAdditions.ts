import type { FutureAddition } from "../../../components/futureAdditions";

export const parkVisionAdditionsData: FutureAddition[] = [
    {
        id: 'onboard-camera-processing',
        title: 'On-Camera Edge Processing & Remote Upload',
        summary: 'Move detection onto the camera itself and stream results back over a cellular or satellite uplink, instead of physically retrieving SD cards from the field.',
        markdownFile: '../data/projects/parkvision/future-additions/onboard-camera-processing.md',
        icon: 'Raspberry Pi'
    },
    {
        id: 'lora-connectivity',
        title: 'LoRa Wireless Camera Connectivity',
        summary: 'Give cameras in cellular dead zones a low-power, long-range radio link back to a gateway, instead of requiring coverage the park doesn\'t have.',
        markdownFile: '../data/projects/parkvision/future-additions/lora-connectivity.md',
        icon: 'Arduino'
    },
    {
        id: 'ebike-classification',
        title: 'E-Bike & Fine-Grained Vehicle Classification',
        summary: 'Train a dedicated classifier to distinguish e-bikes from standard bicycles, a distinction the National Park Service specifically asked for that a COCO-trained detector cannot make out of the box.',
        markdownFile: '../data/projects/parkvision/future-additions/ebike-classification.md',
        icon: 'PyTorch'
    },
    {
        id: 'gpu-acceleration',
        title: 'GPU-Accelerated Inference',
        summary: 'Add an optional CUDA code path so a ranger station with a discrete GPU can process a full season of footage in a fraction of the time the CPU-only pipeline currently takes.',
        markdownFile: '../data/projects/parkvision/future-additions/gpu-acceleration.md',
        icon: 'Nvidia'
    },
    {
        id: 'occupancy-direction',
        title: 'Image-Level Direction for Occupancy Counts',
        summary: 'Replace the current filename-substring placeholder with a real entering-vs-exiting classifier for the still-image occupancy pipeline.',
        markdownFile: '../data/projects/parkvision/future-additions/occupancy-direction.md',
        icon: 'OpenCV'
    },
    {
        id: 'automated-reporting',
        title: 'Scheduled Automated Reporting',
        summary: 'Run the CLI pipeline on a schedule and email park staff a standing visitor-use summary, instead of requiring someone to open the desktop app and run each analysis by hand.',
        markdownFile: '../data/projects/parkvision/future-additions/automated-reporting.md',
        icon: 'GitHub Actions'
    },
    {
        id: 'web-dashboard',
        title: 'Web Dashboard for Park Staff',
        summary: 'A lightweight, hosted dashboard so non-technical staff can browse visitor-use trends from any device, without installing or learning the desktop application.',
        markdownFile: '../data/projects/parkvision/future-additions/web-dashboard.md',
        icon: 'HTML'
    }
];
