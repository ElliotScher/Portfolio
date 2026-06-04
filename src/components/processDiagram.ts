import showdown from 'showdown';

export interface ProcessNode {
    id: string;
    label: string;
    markdownFile: string;
}

const converter = new showdown.Converter({
    ghCompatibleHeaderId: true,
    simpleLineBreaks: true,
});

// Map of projects modules
const markdownFiles = import.meta.glob('../data/projects/**/*.md', { query: '?raw', import: 'default' });

export function createProcessDiagram(container: HTMLElement, data: ProcessNode[]) {
    // Clear container
    container.innerHTML = '';

    if (!data || data.length === 0) return;

    const processContainer = document.createElement('div');
    processContainer.className = 'process-container';

    // 1. Create the Stepper Layout
    const stepper = document.createElement('div');
    stepper.className = 'process-stepper';

    const stepNodes: HTMLButtonElement[] = [];
    const stepConnectors: HTMLDivElement[] = [];

    data.forEach((nodeData, index) => {
        // Create Step Button Node
        const stepNode = document.createElement('button');
        stepNode.className = 'step-node';
        stepNode.setAttribute('type', 'button');
        stepNode.setAttribute('aria-label', `Go to stage ${index + 1}: ${nodeData.label}`);
        
        const badge = document.createElement('span');
        badge.className = 'step-badge';
        badge.textContent = (index + 1).toString();
        
        const label = document.createElement('span');
        label.className = 'step-label';
        label.textContent = nodeData.label;
        
        stepNode.appendChild(badge);
        stepNode.appendChild(label);
        
        stepNode.addEventListener('click', () => {
            setActiveStep(index);
        });

        stepper.appendChild(stepNode);
        stepNodes.push(stepNode);

        // Create Connector (if not the last step)
        if (index < data.length - 1) {
            const connector = document.createElement('div');
            connector.className = 'step-connector';
            
            // Inline SVG for the connection line
            connector.innerHTML = `
                <svg class="connector-svg" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <line x1="0" y1="5" x2="100" y2="5" class="connector-path" />
                </svg>
            `;
            
            stepper.appendChild(connector);
            stepConnectors.push(connector);
        }
    });

    // 2. Create the Detailed Content Card
    const detailCard = document.createElement('div');
    detailCard.className = 'process-detail-card';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'process-detail-content-wrapper';

    const detailContent = document.createElement('div');
    detailContent.className = 'process-detail-content';
    contentWrapper.appendChild(detailContent);

    // Navigation buttons container
    const navButtons = document.createElement('div');
    navButtons.className = 'process-nav-buttons';

    const btnPrev = document.createElement('button');
    btnPrev.className = 'btn-nav';
    btnPrev.type = 'button';
    btnPrev.innerHTML = '← Previous Stage';
    btnPrev.disabled = true;

    const btnNext = document.createElement('button');
    btnNext.className = 'btn-nav';
    btnNext.type = 'button';
    btnNext.innerHTML = 'Next Stage →';

    navButtons.appendChild(btnPrev);
    navButtons.appendChild(btnNext);

    detailCard.appendChild(contentWrapper);
    detailCard.appendChild(navButtons);

    processContainer.appendChild(stepper);
    processContainer.appendChild(detailCard);
    container.appendChild(processContainer);

    // State Variables
    let currentStepIndex = 0;
    const mdCache: Record<string, string> = {};

    // Click handlers for Next/Prev buttons
    btnPrev.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            setActiveStep(currentStepIndex - 1);
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentStepIndex < data.length - 1) {
            setActiveStep(currentStepIndex + 1);
        }
    });

    // Main step navigation function
    async function setActiveStep(targetIndex: number) {
        if (targetIndex < 0 || targetIndex >= data.length) return;

        currentStepIndex = targetIndex;

        // Update active step nodes classes
        stepNodes.forEach((node, idx) => {
            if (idx === currentStepIndex) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });

        // Update connector statuses (all connectors up to current active index are highlighted as active)
        stepConnectors.forEach((conn, idx) => {
            if (idx < currentStepIndex) {
                conn.classList.add('active');
            } else {
                conn.classList.remove('active');
            }
        });

        // Disable/enable navigation buttons at bounds
        btnPrev.disabled = currentStepIndex === 0;
        btnNext.disabled = currentStepIndex === data.length - 1;

        // Fetch and load projects content with animation transition
        const nodeData = data[currentStepIndex];

        // Trigger fade out
        detailContent.classList.add('transition-out');

        try {
            let htmlContent = '';
            if (nodeData.markdownFile) {
                if (mdCache[nodeData.markdownFile]) {
                    htmlContent = mdCache[nodeData.markdownFile];
                } else {
                    const loadMarkdown = markdownFiles[nodeData.markdownFile] as () => Promise<string>;
                    if (loadMarkdown) {
                        const mdContent = await loadMarkdown();
                        htmlContent = converter.makeHtml(mdContent);
                        mdCache[nodeData.markdownFile] = htmlContent;
                    } else {
                        htmlContent = '<p>Description file not found.</p>';
                    }
                }
            } else {
                htmlContent = '<p>No description available.</p>';
            }

            // Wait briefly for the fade-out animation to complete (200ms matches CSS transition)
            setTimeout(() => {
                detailContent.innerHTML = htmlContent;
                // Fade back in
                detailContent.classList.remove('transition-out');
            }, 200);

        } catch (error) {
            console.error('Failed to load projects:', error);
            setTimeout(() => {
                detailContent.innerHTML = '<p>Error loading description.</p>';
                detailContent.classList.remove('transition-out');
            }, 200);
        }
    }

    // Initialize first step
    setActiveStep(0);

    function adjustLayout() {
        const parent = container.parentElement;
        const availableWidth = parent ? parent.getBoundingClientRect().width : window.innerWidth;

        if (window.innerWidth <= 768 || availableWidth < 720) {
            container.classList.add('stacked-layout');
        } else {
            container.classList.remove('stacked-layout');
        }
    }

    const resizeHandler = () => {
        if (!document.body.contains(container)) {
            window.removeEventListener('resize', resizeHandler);
            return;
        }
        adjustLayout();
    };
    window.addEventListener('resize', resizeHandler);

    adjustLayout();
}