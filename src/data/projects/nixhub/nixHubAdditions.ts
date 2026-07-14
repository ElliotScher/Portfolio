import type { FutureAddition } from "../../../components/futureAdditions";

export const nixHubAdditionsData: FutureAddition[] = [
    {
        id: 'secrets-management',
        title: 'Encrypted Secrets Management',
        summary: 'Integrate sops-nix so secrets can be committed to the repo encrypted-at-rest and decrypted only on the target host at activation time, instead of copied on by hand.',
        markdownFile: '../data/projects/nixhub/future-additions/secrets-management.md',
        icon: 'Nixos'
    },
    {
        id: 'disk-provisioning',
        title: 'Disko-Based Disk Provisioning',
        summary: 'Fold disk partitioning into the flake with disko, so bootstrap goes from a bare installer ISO straight to a fully partitioned and configured system.',
        markdownFile: '../data/projects/nixhub/future-additions/disk-provisioning.md',
        icon: 'Linux'
    }
];
