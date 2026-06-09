export function parseHash() {
    const hash = window.location.hash || '#/';
    const cleanHash = hash.startsWith('#') ? hash.substring(1) : hash;
    const parts = cleanHash.split('#');
    const path = parts[0] || '/';
    const anchor = parts[1] || '';
    return { path, anchor };
}

export function scrollToAnchor(anchor: string) {
    if (!anchor) return;
    const targetId = decodeURIComponent(anchor);
    const content = document.getElementById("content");
    if (!content) return;
    const targetElem = content.querySelector(`[id="${targetId}"]`);
    if (targetElem) {
        let parent = targetElem.parentElement;
        while (parent && parent !== content) {
            if (parent.tagName === "DETAILS" && !(parent as HTMLDetailsElement).open) {
                (parent as HTMLDetailsElement).open = true;
            }
            parent = parent.parentElement;
        }
        setTimeout(() => {
            targetElem.scrollIntoView({ behavior: "smooth" });
        }, 50);
    }
}
