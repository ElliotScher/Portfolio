export interface MediaItem {
    src: string;
    title?: string;
    caption?: string;
    alt?: string;
    startTime?: number;
    endTime?: number;
}

function isVideo(src: string): boolean {
    const cleanSrc = src.split('?')[0].split('#')[0];
    return cleanSrc.toLowerCase().endsWith('.mp4') || 
           cleanSrc.toLowerCase().endsWith('.webm') || 
           cleanSrc.toLowerCase().endsWith('.ogg') ||
           cleanSrc.toLowerCase().endsWith('.mov');
}

function applyVideoCrop(video: HTMLVideoElement, item: MediaItem) {
    if (item.startTime === undefined && item.endTime === undefined) {
        return;
    }

    const start = item.startTime !== undefined ? item.startTime : 0;

    const setInitialTime = () => {
        if (video.currentTime < start) {
            video.currentTime = start;
        }
    };

    video.addEventListener('loadedmetadata', setInitialTime);
    video.addEventListener('loadeddata', setInitialTime);

    video.addEventListener('timeupdate', () => {
        if (item.endTime !== undefined && video.currentTime >= item.endTime) {
            if (video.hasAttribute('loop') || video.loop) {
                video.currentTime = start;
            } else {
                video.pause();
                video.currentTime = start;
            }
        }
        if (video.currentTime < start - 0.5) {
            video.currentTime = start;
        }
    });
}

function createCustomVideoPlayer(video: HTMLVideoElement, item: MediaItem): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-video-player';
    
    video.controls = false;
    
    const controls = document.createElement('div');
    controls.className = 'custom-video-controls';
    
    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'control-btn play-pause-btn';
    playPauseBtn.setAttribute('aria-label', 'Play or Pause');
    
    const playIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
    `;
    const pauseIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
    `;
    
    playPauseBtn.innerHTML = pauseIcon;
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('input');
    progressBar.type = 'range';
    progressBar.className = 'progress-bar';
    progressBar.min = '0';
    progressBar.step = 'any';
    progressBar.value = '0';
    
    progressContainer.appendChild(progressBar);
    
    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'time-display';
    timeDisplay.textContent = '0:00 / 0:00';
    
    const muteBtn = document.createElement('button');
    muteBtn.className = 'control-btn mute-btn';
    muteBtn.setAttribute('aria-label', 'Mute or Unmute');
    
    const volumeHighIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
    `;
    const volumeMuteIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
    `;
    
    muteBtn.innerHTML = video.muted ? volumeMuteIcon : volumeHighIcon;
    
    controls.appendChild(playPauseBtn);
    controls.appendChild(progressContainer);
    controls.appendChild(timeDisplay);
    controls.appendChild(muteBtn);
    
    wrapper.appendChild(video);
    wrapper.appendChild(controls);
    
    function formatTime(secs: number): string {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
    
    let logicalStart = item.startTime !== undefined ? item.startTime : 0;
    let logicalEnd = 0;
    let logicalDuration = 0;
    
    const updateDuration = () => {
        logicalEnd = item.endTime !== undefined ? item.endTime : video.duration;
        logicalDuration = Math.max(0, logicalEnd - logicalStart);
        progressBar.max = logicalDuration.toString();
    };
    
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('durationchange', updateDuration);
    
    if (video.duration) {
        updateDuration();
    }
    
    const setPlayState = (playing: boolean) => {
        playPauseBtn.innerHTML = playing ? pauseIcon : playIcon;
    };
    
    video.addEventListener('play', () => {
        setPlayState(true);
        wrapper.classList.remove('is-paused');
    });
    video.addEventListener('pause', () => {
        setPlayState(false);
        wrapper.classList.add('is-paused');
    });
    
    wrapper.classList.add('is-paused');
    
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
            video.play().catch(err => console.log("Play failed:", err));
        } else {
            video.pause();
        }
    });
    
    progressBar.addEventListener('input', () => {
        const val = parseFloat(progressBar.value);
        video.currentTime = logicalStart + val;
    });
    
    progressBar.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? volumeMuteIcon : volumeHighIcon;
    });
    
    controls.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    video.addEventListener('timeupdate', () => {
        const currentRelative = Math.max(0, video.currentTime - logicalStart);
        progressBar.value = currentRelative.toString();
        
        const percent = logicalDuration > 0 ? (currentRelative / logicalDuration) * 100 : 0;
        progressBar.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percent}%, rgba(255, 255, 255, 0.15) ${percent}%, rgba(255, 255, 255, 0.15) 100%)`;
        
        timeDisplay.textContent = `${formatTime(currentRelative)} / ${formatTime(logicalDuration)}`;
    });
    
    video.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
            video.play().catch(err => console.log("Play failed:", err));
        } else {
            video.pause();
        }
    });
    
    return wrapper;
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
        const baseSrcPath = item.src.startsWith('http://') || item.src.startsWith('https://') || item.src.startsWith('/')
            ? item.src
            : `${import.meta.env.BASE_URL}${item.src}`;

        let fragment = '';
        if (item.startTime !== undefined || item.endTime !== undefined) {
            const startVal = item.startTime !== undefined ? item.startTime : '';
            const endVal = item.endTime !== undefined ? item.endTime : '';
            fragment = `#t=${startVal},${endVal}`;
        }
        const srcPath = baseSrcPath + fragment;

        if (isVideo(item.src)) {
            const video = document.createElement('video');
            video.className = 'media-card-image';
            video.src = srcPath;
            video.muted = true;
            video.playsInline = true;
            video.loop = true;
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('loop', '');
            video.preload = 'metadata';

            applyVideoCrop(video, item);

            imgContainer.appendChild(video);

            // Play video on hover for rich, premium feedback
            card.addEventListener('mouseenter', () => {
                video.play().catch(err => console.log("Video autoplay blocked on hover:", err));
            });
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = item.startTime !== undefined ? item.startTime : 0;
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
        contentWrapper.appendChild(infoOverlay);

        lightbox.appendChild(closeBtn);
        if (prevBtn) lightbox.appendChild(prevBtn);
        if (nextBtn) lightbox.appendChild(nextBtn);
        lightbox.appendChild(contentWrapper);
        document.body.appendChild(lightbox);

        // Prevent body page scrolls while lightbox is active
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        updateLightbox();

        function updateLightbox() {
            lightbox.classList.remove('is-portrait');
            const currentItem = mediaItems[currentIndex];
            if (!currentItem) return;

            const baseSrcPath = currentItem.src.startsWith('http://') || currentItem.src.startsWith('https://') || currentItem.src.startsWith('/')
                ? currentItem.src
                : `${import.meta.env.BASE_URL}${currentItem.src}`;

            let fragment = '';
            if (currentItem.startTime !== undefined || currentItem.endTime !== undefined) {
                const startVal = currentItem.startTime !== undefined ? currentItem.startTime : '';
                const endVal = currentItem.endTime !== undefined ? currentItem.endTime : '';
                fragment = `#t=${startVal},${endVal}`;
            }
            const srcPath = baseSrcPath + fragment;

            // Clear previous media to avoid background audio or overlapping elements
            mediaContainer.innerHTML = '';

            setTimeout(() => {
                if (isVideo(currentItem.src)) {
                    const activeVideo = document.createElement('video');
                    activeVideo.className = 'lightbox-image';
                    activeVideo.autoplay = true;
                    activeVideo.playsInline = true;
                    activeVideo.muted = true;
                    activeVideo.setAttribute('muted', '');
                    activeVideo.setAttribute('playsinline', '');
                    activeVideo.setAttribute('autoplay', '');
                    activeVideo.src = srcPath;
                    
                    applyVideoCrop(activeVideo, currentItem);
                    
                    const player = createCustomVideoPlayer(activeVideo, currentItem);
                    player.style.opacity = '0';
                    player.style.transform = 'scale(0.97)';
                    player.style.transition = 'opacity 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)';
                    
                    const loader = document.createElement('div');
                    loader.className = 'loading-container lightbox-loader';
                    loader.innerHTML = `
                        <div class="loading-spinner-wrapper">
                            <div class="loading-spinner"></div>
                            <div class="loading-spinner-inner"></div>
                        </div>
                        <div class="loading-text">Loading Video</div>
                    `;
                    mediaContainer.appendChild(loader);
                    mediaContainer.appendChild(player);

                    activeVideo.addEventListener('loadedmetadata', () => {
                        const aspect = activeVideo.videoWidth / activeVideo.videoHeight;
                        if (aspect < 1) {
                            lightbox.classList.add('is-portrait');
                        } else {
                            lightbox.classList.remove('is-portrait');
                        }
                    });

                    activeVideo.addEventListener('loadeddata', () => {
                        loader.style.transition = 'opacity 0.2s ease';
                        loader.style.opacity = '0';
                        setTimeout(() => loader.remove(), 200);

                        player.style.opacity = '1';
                        player.style.transform = 'scale(1)';
                    });
                } else {
                    const activeImg = document.createElement('img');
                    activeImg.className = 'lightbox-image';
                    activeImg.alt = currentItem.alt || currentItem.title || 'Expanded view';
                    activeImg.src = srcPath;
                    
                    activeImg.style.opacity = '0';
                    activeImg.style.transform = 'scale(0.97)';
                    
                    const loader = document.createElement('div');
                    loader.className = 'loading-container lightbox-loader';
                    loader.innerHTML = `
                        <div class="loading-spinner-wrapper">
                            <div class="loading-spinner"></div>
                            <div class="loading-spinner-inner"></div>
                        </div>
                        <div class="loading-text">Loading Image</div>
                    `;
                    mediaContainer.appendChild(loader);
                    mediaContainer.appendChild(activeImg);
                    
                    activeImg.onload = () => {
                        loader.style.transition = 'opacity 0.2s ease';
                        loader.style.opacity = '0';
                        setTimeout(() => loader.remove(), 200);

                        activeImg.style.opacity = '1';
                        activeImg.style.transform = 'scale(1)';
                        const aspect = activeImg.naturalWidth / activeImg.naturalHeight;
                        if (aspect < 1) {
                            lightbox.classList.add('is-portrait');
                        } else {
                            lightbox.classList.remove('is-portrait');
                        }
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
