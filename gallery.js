// ************************************
// Media Gallery System (FIXED - v5)
// ************************************

const GALLERY_CONFIG = {
    basePath: './library/photos/',
    workPath: 'work/',
    projectPath: 'project/',
    allowedExtensions: ['webp', 'jpg', 'jpeg','gif', 'mov', 'mp4'],
    mediaTypes: {
        image: ['webp', 'jpg', 'jpeg', 'gif'],
        video: ['mov', 'mp4']
    },
    manifestFile: './library/photos/manifest.json'
};

// Store gallery data globally to survive DOM mutations
const galleryStore = new Map();
let mediaManifest = null;
let manifestLoaded = false;
let currentlyPlayingVideo = null;
let galleryControlsSetup = false; // PREVENT DUPLICATE LISTENERS

$(document).ready(function() {
    // console.log('Gallery.js loaded');
    
    loadManifest().then(() => {
        initializeGalleries();
        if (!galleryControlsSetup) {
            setupGalleryControls();
            galleryControlsSetup = true;
        }
    });
});

function loadManifest() {
    return $.ajax({
        url: GALLERY_CONFIG.manifestFile,
        method: 'GET',
        dataType: 'json',
        timeout: 3000,
        cache: true
    }).done(function(data) {
        // console.log('✓ Manifest loaded');
        mediaManifest = data;
        manifestLoaded = true;
    }).fail(function(error) {
        console.warn('✗ Manifest not found, using legacy discovery');
        manifestLoaded = false;
        mediaManifest = null;
    });
}

function initializeGalleries() {
    // console.log('Initializing galleries. Found:', $('.media-gallery').length);
    
    $('.media-gallery').each(function(index) {
        const $gallery = $(this);
        
        // Get data attributes - with null checking
        let entryType = $gallery.data('entry-type');
        let entryName = $gallery.data('entry-name');
        
        // Skip if missing required data
        if (!entryType || !entryName) {
            console.warn(`Gallery ${index} skipped - missing entry-type or entry-name`);
            return;
        }
        
        // Ensure entryName is a string
        if (typeof entryName !== 'string') {
            entryName = String(entryName);
        }
        
        const folderName = entryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
        
        // Generate unique ID
        let galleryId = $gallery.attr('id');
        if (!galleryId) {
            galleryId = 'gallery-' + index + '-' + Date.now();
            $gallery.attr('id', galleryId);
        }

        // Ensure preview containers exist
        ensureGalleryPreviews($gallery);

        // IMPORTANT: Only initialize if not already in store (preserve existing state)
        if (!galleryStore.has(galleryId)) {
            galleryStore.set(galleryId, {
                entryType: entryType,
                entryName: entryName,
                folderName: folderName,
                mediaItems: [],
                currentIndex: 0,
                loaded: false
            });

            // Set collapsed state (only for new galleries)
            $gallery.addClass('gallery-collapsed');
            $gallery.find('.gallery-container').css('display', 'none');

            // Add expand button if not exists
            if ($gallery.find('.gallery-expand-btn').length === 0) {
                addExpandButton($gallery, galleryId);
            }

            // console.log(`  → Gallery "${folderName}" initialized`);
        }
    });
}

function ensureGalleryPreviews($gallery) {
    if ($gallery.find('.gallery-previews').length > 0) {
        return;
    }

    const $controls = $gallery.find('.gallery-controls');
    if ($controls.length === 0) {
        return;
    }

    const $previews = $('<div class="gallery-previews"></div>');
    const $prevPreview = $('<div class="gallery-preview gallery-preview-prev" aria-hidden="true"></div>');
    const $nextPreview = $('<div class="gallery-preview gallery-preview-next" aria-hidden="true"></div>');

    $previews.append($prevPreview, $nextPreview);
    $controls.after($previews);
}

function addExpandButton($gallery, galleryId) {
    const $expandBtn = $('<button class="gallery-expand-btn" type="button">📷 Show Gallery</button>');
    $expandBtn.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleGallery($gallery, galleryId);
    });
    $expandBtn.insertBefore($gallery.find('.gallery-container'));
}

function toggleGallery($gallery, galleryId) {
    const isCollapsed = $gallery.hasClass('gallery-collapsed');

    if (isCollapsed) {
        expandGallery($gallery, galleryId);
    } else {
        collapseGallery($gallery, galleryId);
    }
}

function expandGallery($gallery, galleryId) {
    const $container = $gallery.find('.gallery-container');
    const $expandBtn = $gallery.find('.gallery-expand-btn');

    $gallery.removeClass('gallery-collapsed');
    $container.slideDown(300);
    $expandBtn.text('📷 Hide Gallery');

    const store = galleryStore.get(galleryId);
    if (store && !store.loaded) {
        loadGalleryMedia($gallery, galleryId);
    } else if (store && store.loaded) {
        // Restore the counter display
        displayMediaItem($gallery, galleryId, store.currentIndex);
    }
}

function collapseGallery($gallery, galleryId) {
    const $container = $gallery.find('.gallery-container');
    const $expandBtn = $gallery.find('.gallery-expand-btn');

    stopVideoInGallery($gallery);

    $gallery.addClass('gallery-collapsed');
    $container.slideUp(300);
    $expandBtn.text('📷 Show Gallery');
}

function stopVideoInGallery($gallery) {
    const $video = $gallery.find('video');
    if ($video.length > 0) {
        $video.each(function() {
            this.pause();
            this.currentTime = 0;
        });
    }
    currentlyPlayingVideo = null;
}

function loadGalleryMedia($gallery, galleryId) {
    const store = galleryStore.get(galleryId);
    
    if (!store) {
        console.warn('Gallery store not found for ID:', galleryId);
        return;
    }
    
    if (store.loaded) {
        displayMediaItem($gallery, galleryId, store.currentIndex);
        return;
    }

    $gallery.find('.gallery-main').html('<div class="gallery-loading">Loading media...</div>');

    let mediaItems = [];

    if (manifestLoaded && mediaManifest) {
        mediaItems = getMediaFromManifest(store.entryType, store.folderName);
    } else {
        mediaItems = discoverMediaLegacy(store.entryType, store.folderName);
    }

    console.log(`  → Found ${mediaItems.length} media items for ${store.folderName}`);

    if (mediaItems.length > 0) {
        store.mediaItems = mediaItems;
        store.loaded = true;
        store.currentIndex = 0;
        
        // Update total count in UI
        $gallery.find('.total-count').text(mediaItems.length);
        
        displayMediaItem($gallery, galleryId, 0);
    } else {
        $gallery.addClass('no-media');
        $gallery.find('.gallery-main').html('<div class="gallery-no-media">No media found</div>');
    }
}

function getMediaFromManifest(entryType, folderName) {
    const mediaItems = [];
    const key = `${entryType}/${folderName}`;

    if (mediaManifest && mediaManifest[key]) {
        mediaManifest[key].forEach(filename => {
            const ext = filename.split('.').pop().toLowerCase();
            const mediaType = getMediaType(ext);
            const path = GALLERY_CONFIG.basePath + GALLERY_CONFIG[entryType + 'Path'] + folderName + '/' + filename;

            mediaItems.push({
                src: path,
                type: mediaType,
                name: filename
            });
        });
    }

    return mediaItems;
}

function discoverMediaLegacy(entryType, folderName) {
    const mediaItems = [];
    const mediaPath = GALLERY_CONFIG.basePath + GALLERY_CONFIG[entryType + 'Path'] + folderName + '/';
    let consecutiveGaps = 0;
    const maxConsecutiveGaps = 3;

    for (let i = 1; consecutiveGaps < maxConsecutiveGaps; i++) {
        let foundFile = false;

        for (const ext of GALLERY_CONFIG.allowedExtensions) {
            const filename = folderName + i + '.' + ext;
            const fullPath = mediaPath + filename;

            if (fileExistsSync(fullPath)) {
                const mediaType = getMediaType(ext);
                mediaItems.push({
                    src: fullPath,
                    type: mediaType,
                    name: filename
                });
                foundFile = true;
                consecutiveGaps = 0;
                break;
            }
        }

        if (!foundFile) {
            consecutiveGaps++;
        }
    }

    return mediaItems;
}

const fileExistsCache = new Map();

function fileExistsSync(path) {
    if (fileExistsCache.has(path)) {
        return fileExistsCache.get(path);
    }

    const http = new XMLHttpRequest();
    http.open('HEAD', path, false);
    http.send();
    const exists = http.status !== 404;

    fileExistsCache.set(path, exists);
    return exists;
}

function getMediaType(ext) {
    const lowerExt = ext.toLowerCase();
    if (GALLERY_CONFIG.mediaTypes.image.includes(lowerExt)) {
        return 'image';
    } else if (GALLERY_CONFIG.mediaTypes.video.includes(lowerExt)) {
        return 'video';
    }
    return 'image';
}

function displayMediaItem($gallery, galleryId, index) {
    const store = galleryStore.get(galleryId);
    
    if (!store) {
        console.warn('Gallery store not found for ID:', galleryId);
        return;
    }
    
    const mediaItems = store.mediaItems;

    if (!mediaItems || index < 0 || index >= mediaItems.length) {
        console.warn('Invalid index or no media items');
        return;
    }

    const $mainContainer = $gallery.find('.gallery-main');
    const $currentIndexSpan = $gallery.find('.current-index');
    const $totalCountSpan = $gallery.find('.total-count');
    const mediaItem = mediaItems[index];

    stopOtherVideos($gallery);

    $mainContainer.html('');

    let $media;
    if (mediaItem.type === 'video') {
        $media = $('<video>')
            .attr('src', mediaItem.src)
            .attr('controls', 'controls')
            .addClass('gallery-main-media active')
            .css({
                'max-width': '100%',
                'max-height': '100%',
                'width': 'auto',
                'height': 'auto'
            });

        const videoElement = $media[0];
        
        videoElement.addEventListener('play', function() {
            if (currentlyPlayingVideo && currentlyPlayingVideo !== videoElement) {
                currentlyPlayingVideo.pause();
                currentlyPlayingVideo.currentTime = 0;
            }
            currentlyPlayingVideo = videoElement;
        });

        videoElement.addEventListener('pause', function() {
            if (currentlyPlayingVideo === videoElement) {
                currentlyPlayingVideo = null;
            }
        });

    } else {
        $media = $('<img>')
            .attr('src', mediaItem.src)
            .attr('alt', mediaItem.name)
            .addClass('gallery-main-media active');
    }

    $mainContainer.append($media);
    
    // Update counter display
    const displayIndex = index + 1;
    const displayTotal = mediaItems.length;
    
    if ($currentIndexSpan.length) {
        $currentIndexSpan.text(displayIndex);
    }
    if ($totalCountSpan.length) {
        $totalCountSpan.text(displayTotal);
    }
    
    // Update store
    store.currentIndex = index;

    updateGalleryButtons($gallery, galleryId);
    updateGalleryPreviews($gallery, galleryId);
}

function stopOtherVideos($gallery) {
    if (currentlyPlayingVideo) {
        const $videoGallery = $(currentlyPlayingVideo).closest('.media-gallery');
        if (!$videoGallery.is($gallery)) {
            currentlyPlayingVideo.pause();
            currentlyPlayingVideo.currentTime = 0;
            currentlyPlayingVideo = null;
        }
    }
}

function updateGalleryButtons($gallery, galleryId) {
    const store = galleryStore.get(galleryId);
    
    if (!store) {
        return;
    }
    
    const mediaItems = store.mediaItems;
    const currentIndex = store.currentIndex;

    const $prevBtn = $gallery.find('.gallery-prev');
    const $nextBtn = $gallery.find('.gallery-next');

    if ($prevBtn.length && $nextBtn.length) {
        $prevBtn.prop('disabled', currentIndex === 0);
        $nextBtn.prop('disabled', currentIndex === mediaItems.length - 1);
    }
}

function updateGalleryPreviews($gallery, galleryId) {
    const store = galleryStore.get(galleryId);
    
    if (!store) {
        return;
    }
    
    const mediaItems = store.mediaItems;
    const currentIndex = store.currentIndex;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : null;
    const nextIndex = currentIndex < mediaItems.length - 1 ? currentIndex + 1 : null;

    const $prevPreview = $gallery.find('.gallery-preview-prev');
    const $nextPreview = $gallery.find('.gallery-preview-next');

    setGalleryPreview($prevPreview, prevIndex !== null ? mediaItems[prevIndex] : null);
    setGalleryPreview($nextPreview, nextIndex !== null ? mediaItems[nextIndex] : null);
}

function setGalleryPreview($container, mediaItem) {
    if ($container.length === 0) {
        return;
    }

    $container.empty();

    if (!mediaItem) {
        $container.addClass('disabled');
        return;
    }

    $container.removeClass('disabled');

    if (mediaItem.type === 'video') {
        const $video = $('<video muted playsinline preload="metadata"></video>')
            .attr('src', mediaItem.src)
            .addClass('gallery-preview-media');
        $container.append($video);
    } else {
        const $img = $('<img>')
            .attr('src', mediaItem.src)
            .attr('alt', 'Preview')
            .addClass('gallery-preview-media');
        $container.append($img);
    }
}

function galleryPrevious($gallery, galleryId) {
    const store = galleryStore.get(galleryId);
    
    if (!store) {
        return;
    }
    
    const currentIndex = store.currentIndex;
    
    if (currentIndex > 0) {
        displayMediaItem($gallery, galleryId, currentIndex - 1);
    }
}

function galleryNext($gallery, galleryId) {
    const store = galleryStore.get(galleryId);
    
    if (!store) {
        return;
    }
    
    const mediaItems = store.mediaItems;
    const currentIndex = store.currentIndex;
    
    if (currentIndex < mediaItems.length - 1) {
        displayMediaItem($gallery, galleryId, currentIndex + 1);
    }
}

function setupGalleryControls() {
    // console.log('Setting up gallery controls (ONE TIME ONLY)');

    // Use .off() to remove any existing handlers, then add fresh ones
    $(document).off('click', '.gallery-prev');
    $(document).off('click', '.gallery-next');
    $(document).off('keydown');

    $(document).on('click', '.gallery-prev', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $gallery = $(this).closest('.media-gallery');
        const galleryId = $gallery.attr('id');
        
        if (galleryStore.has(galleryId)) {
            galleryPrevious($gallery, galleryId);
        }
    });

    $(document).on('click', '.gallery-next', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $gallery = $(this).closest('.media-gallery');
        const galleryId = $gallery.attr('id');
        
        if (galleryStore.has(galleryId)) {
            galleryNext($gallery, galleryId);
        }
    });

    // Keyboard navigation
    let lastKeyTime = 0;
    const keyDebounceTime = 150;

    $(document).on('keydown', function(e) {
        const now = Date.now();
        if (now - lastKeyTime < keyDebounceTime) return;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const $focusedGallery = $('.media-gallery:hover').eq(0);
            
            if ($focusedGallery.length) {
                const galleryId = $focusedGallery.attr('id');
                if (galleryStore.has(galleryId)) {
                    lastKeyTime = now;
                    e.preventDefault();

                    if (e.key === 'ArrowLeft') {
                        galleryPrevious($focusedGallery, galleryId);
                    } else {
                        galleryNext($focusedGallery, galleryId);
                    }
                }
            }
        }
    });
}

// DO NOT call setupGalleryControls() here anymore!
function reinitializeGalleries() {
    // console.log('Reinitializing galleries after filter');
    initializeGalleries();
    // Only setup controls on FIRST load, not on reinitialize
}