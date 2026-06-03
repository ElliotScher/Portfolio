export interface MediaItem {
    src: string;
    title?: string;
    caption?: string;
    alt?: string;
}

function isVideo(src: string): boolean {
    const cleanSrc = src.split('?')[0].split('#')[0];
    return cleanSrc.toLowerCase().endsWith('.mp4') || 
           cleanSrc.toLowerCase().endsWith('.webm') || 
           cleanSrc.toLowerCase().endsWith('.ogg') ||
           cleanSrc.toLowerCase().endsWith('.mov');
}

export function createMediaGallery(container: HTMLElement, items: MediaItem[]) {
    container.innerHTML = '';

    let mediaItems: MediaItem[] = items || [];

    // Fallback: if still empty, try to parse from data-media attribute
    if (mediaItems.length === 0) {
        const dataMedia = container.getAttribute('data-media');
        if (dataMedia) {
            try {
                mediaItems = JSON.parse(dataMedia);
            } catch (e) {
                console.error("Failed to parse data-media attribute:", e);
            }
        }
    }

    if (mediaItems.length === 0) {
        return; // Nothing to render
    }

    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'media-gallery-container';

    const galleryGrid = document.createElement('div');
    galleryGrid.className = 'media-gallery-grid';

    mediaItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'media-gallery-card';
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${item.title || 'media'} in full screen`);
        card.setAttribute('tabindex', '0');

        const imgContainer = document.createElement('div');
        imgContainer.className = 'media-card-image-wrapper';
        
        // Dynamic base URL pathing
        const srcPath = item.src.startsWith('http://') || item.src.startsWith('https://') || item.src.startsWith('/')
            ? item.src
            : `${import.meta.env.BASE_URL}${item.src}`;

        if (isVideo(item.src)) {
            const video = document.createElement('video');
            video.className = 'media-card-image';
            video.src = srcPath;
            video.muted = true;
            video.playsInline = true;
            video.loop = true;
            video.preload = 'metadata';

            imgContainer.appendChild(video);

            // Play video on hover for rich, premium feedback
            card.addEventListener('mouseenter', () => {
                video.play().catch(err => console.log("Video autoplay blocked on hover:", err));
            });
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });

            // Standard overlay play button
            const playBtn = document.createElement('div');
            playBtn.className = 'media-card-play-button';
            playBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            `;
            imgContainer.appendChild(playBtn);
        } else {
            const img = document.createElement('img');
            img.className = 'media-card-image';
            img.src = srcPath;
            img.alt = item.alt || item.title || 'Project Media';
            img.loading = 'lazy';
            imgContainer.appendChild(img);
        }

        card.appendChild(imgContainer);

        // Information text container if title or caption exists
        if (item.title || item.caption) {
            const infoContainer = document.createElement('div');
            infoContainer.className = 'media-card-info';

            if (item.title) {
                const titleEl = document.createElement('h4');
                titleEl.className = 'media-card-title';
                titleEl.textContent = item.title;
                infoContainer.appendChild(titleEl);
            }

            if (item.caption) {
                const captionEl = document.createElement('p');
                captionEl.className = 'media-card-caption';
                captionEl.textContent = item.caption;
                infoContainer.appendChild(captionEl);
            }

            card.appendChild(infoContainer);
        }

        // Open Lightbox handler
        const openLightboxHandler = () => {
            openLightbox(index);
        };

        card.addEventListener('click', openLightboxHandler);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightboxHandler();
            }
        });

        galleryGrid.appendChild(card);
    });

    galleryContainer.appendChild(galleryGrid);
    container.appendChild(galleryContainer);

    function openLightbox(startIndex: number) {
        let currentIndex = startIndex;

        // Pause and reset all playing preview videos in the grid
        const gridVideos = container.querySelectorAll('video');
        gridVideos.forEach(v => {
            v.pause();
            v.currentTime = 0;
        });

        // Overlay element
        const lightbox = document.createElement('div');
        lightbox.className = 'media-lightbox-overlay';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close-btn';
        closeBtn.setAttribute('aria-label', 'Close lightbox');
        closeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;

        // Content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'lightbox-content-wrapper';

        // Image / Media container
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'lightbox-media-container';

        // Prev & Next navigation buttons
        let prevBtn: HTMLButtonElement | null = null;
        let nextBtn: HTMLButtonElement | null = null;

        if (mediaItems.length > 1) {
            prevBtn = document.createElement('button');
            prevBtn.className = 'lightbox-nav-btn prev';
            prevBtn.setAttribute('aria-label', 'Previous image');
            prevBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            `;

            nextBtn = document.createElement('button');
            nextBtn.className = 'lightbox-nav-btn next';
            nextBtn.setAttribute('aria-label', 'Next image');
            nextBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            `;

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate(-1);
            });
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate(1);
            });
        }

        // Captions block inside lightbox
        const infoOverlay = document.createElement('div');
        infoOverlay.className = 'lightbox-info-overlay';

        const infoTitle = document.createElement('h5');
        infoTitle.className = 'lightbox-info-title';

        const infoCaption = document.createElement('p');
        infoCaption.className = 'lightbox-info-caption';

        const counter = document.createElement('div');
        counter.className = 'lightbox-counter';

        infoOverlay.appendChild(infoTitle);
        infoOverlay.appendChild(infoCaption);
        infoOverlay.appendChild(counter);

        // Assembly
        contentWrapper.appendChild(mediaContainer);
        if (prevBtn) contentWrapper.appendChild(prevBtn);
        if (nextBtn) contentWrapper.appendChild(nextBtn);
        contentWrapper.appendChild(infoOverlay);

        lightbox.appendChild(closeBtn);
        lightbox.appendChild(contentWrapper);
        document.body.appendChild(lightbox);

        // Prevent body page scrolls while lightbox is active
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        updateLightbox();

        function updateLightbox() {
            const currentItem = mediaItems[currentIndex];
            if (!currentItem) return;

            const srcPath = currentItem.src.startsWith('http://') || currentItem.src.startsWith('https://') || currentItem.src.startsWith('/')
                ? currentItem.src
                : `${import.meta.env.BASE_URL}${currentItem.src}`;

            // Clear previous media to avoid background audio or overlapping elements
            mediaContainer.innerHTML = '';

            setTimeout(() => {
                if (isVideo(currentItem.src)) {
                    const activeVideo = document.createElement('video');
                    activeVideo.className = 'lightbox-image';
                    activeVideo.controls = true;
                    activeVideo.autoplay = true;
                    activeVideo.playsInline = true;
                    activeVideo.muted = true;
                    activeVideo.src = srcPath;
                    
                    activeVideo.style.opacity = '0';
                    activeVideo.style.transform = 'scale(0.97)';
                    mediaContainer.appendChild(activeVideo);

                    activeVideo.addEventListener('loadeddata', () => {
                        activeVideo.style.opacity = '1';
                        activeVideo.style.transform = 'scale(1)';
                    });
                } else {
                    const activeImg = document.createElement('img');
                    activeImg.className = 'lightbox-image';
                    activeImg.alt = currentItem.alt || currentItem.title || 'Expanded view';
                    activeImg.src = srcPath;
                    
                    activeImg.style.opacity = '0';
                    activeImg.style.transform = 'scale(0.97)';
                    mediaContainer.appendChild(activeImg);

                    activeImg.onload = () => {
                        activeImg.style.opacity = '1';
                        activeImg.style.transform = 'scale(1)';
                    };
                }
            }, 50);

            // Populate content details
            if (currentItem.title) {
                infoTitle.textContent = currentItem.title;
                infoTitle.style.display = 'block';
            } else {
                infoTitle.style.display = 'none';
            }

            if (currentItem.caption) {
                infoCaption.textContent = currentItem.caption;
                infoCaption.style.display = 'block';
            } else {
                infoCaption.style.display = 'none';
            }

            if (mediaItems.length > 1) {
                counter.textContent = `${currentIndex + 1} / ${mediaItems.length}`;
                counter.style.display = 'block';
            } else {
                counter.style.display = 'none';
            }
        }

        function navigate(direction: number) {
            currentIndex = (currentIndex + direction + mediaItems.length) % mediaItems.length;
            updateLightbox();
        }

        function closeLightbox() {
            lightbox.classList.add('closing');
            document.body.style.overflow = originalOverflow;
            
            lightbox.addEventListener('animationend', () => {
                lightbox.remove();
            }, { once: true });
            
            document.removeEventListener('keydown', handleKeyDown);
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft' && mediaItems.length > 1) {
                navigate(-1);
            } else if (e.key === 'ArrowRight' && mediaItems.length > 1) {
                navigate(1);
            }
        };

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === contentWrapper || e.target === mediaContainer) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', handleKeyDown);

        lightbox.setAttribute('tabindex', '-1');
        lightbox.focus();
    }
}
