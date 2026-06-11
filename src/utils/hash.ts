export function parseHash() {
    const hash = window.location.hash || '#/';
    const cleanHash = hash.startsWith('#') ? hash.substring(1) : hash;
    const parts = cleanHash.split('#');
    const pathAndQuery = parts[0] || '/';
    const anchor = parts[1] || '';

    let path = pathAndQuery;
    const queryParams: Record<string, string> = {};
    const queryIndex = pathAndQuery.indexOf('?');
    if (queryIndex !== -1) {
        path = pathAndQuery.substring(0, queryIndex);
        const queryString = pathAndQuery.substring(queryIndex + 1);
        const pairs = queryString.split('&');
        for (const pair of pairs) {
            if (!pair) continue;
            const [key, value] = pair.split('=');
            if (key) {
                queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        }
    }

    return { path, queryParams, anchor };
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
