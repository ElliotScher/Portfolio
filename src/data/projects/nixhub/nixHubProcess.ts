import type { ProcessNode } from "../../../components/processDiagram";

export const nixHubProcessData: ProcessNode[] = [
    {
        id: 'bootstrap',
        label: 'Bootstrap & Hostname',
        markdownFile: '../data/projects/nixhub/processdiagram/bootstrap.md'
    },
    {
        id: 'layered-config',
        label: 'Layered Configuration',
        markdownFile: '../data/projects/nixhub/processdiagram/layered-config.md'
    },
    {
        id: 'home-manager',
        label: 'Home Manager & Desktop',
        markdownFile: '../data/projects/nixhub/processdiagram/home-manager.md'
    },
    {
        id: 'dev-shells',
        label: 'Per-Project Dev Shells',
        markdownFile: '../data/projects/nixhub/processdiagram/dev-shells.md'
    },
    {
        id: 'ci-validation',
        label: 'CI Validation',
        markdownFile: '../data/projects/nixhub/processdiagram/ci-validation.md'
    }
];
