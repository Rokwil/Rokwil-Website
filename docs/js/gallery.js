// Gallery Page Script
(function() {
    'use strict';
    
    // Make galleryInit available globally
    function initGallery() {
        // Filter functionality
        const filterButtons = document.querySelectorAll('.gallery-filter-btn');
        const galleryProjects = document.querySelectorAll('.gallery-project');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            galleryProjects.forEach(project => {
                const projectType = project.getAttribute('data-project');
                
                if (filter === 'all') {
                    project.classList.remove('hidden');
                } else if (filter === 'other' && !['keystone', 'judges-court', 'aquelle', 'videos'].includes(projectType)) {
                    project.classList.remove('hidden');
                } else if (projectType === filter) {
                    project.classList.remove('hidden');
                } else {
                    project.classList.add('hidden');
                }
            });
        });
    });
    
    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let currentIndex = 0;
    let currentItems = [];
    
    function openLightbox(index, items) {
        currentIndex = index;
        currentItems = items;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        showItem(index);
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    }
    
    function showItem(index) {
        if (index < 0 || index >= currentItems.length) return;
        
        const item = currentItems[index];
        const type = item.getAttribute('data-type');
        
        if (type === 'video') {
            const video = item.querySelector('video');
            const source = video ? video.querySelector('source') : null;
            if (source) {
                lightboxVideo.src = source.src;
                lightboxVideo.style.display = 'block';
                lightboxImage.style.display = 'none';
                lightboxVideo.load();
                // Don't auto-play - let user click play button
                lightboxVideo.pause();
            } else {
                // Fallback: try to get src from video element directly
                const videoSrc = item.querySelector('video')?.src;
                if (videoSrc) {
                    lightboxVideo.src = videoSrc;
                    lightboxVideo.style.display = 'block';
                    lightboxImage.style.display = 'none';
                    lightboxVideo.load();
                    lightboxVideo.pause();
                }
            }
        } else {
            const img = item.querySelector('img');
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxImage.style.display = 'block';
            lightboxVideo.style.display = 'none';
            lightboxVideo.pause();
        }
        
        currentIndex = index;
    }
    
    function showNext() {
        const nextIndex = (currentIndex + 1) % currentItems.length;
        showItem(nextIndex);
    }
    
    function showPrev() {
        const prevIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
        showItem(prevIndex);
    }
    
    // Add click handlers to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Get all visible items in the current project
            const project = this.closest('.gallery-project');
            const projectItems = Array.from(project.querySelectorAll('.gallery-item'));
            const projectIndex = projectItems.indexOf(this);
            
            openLightbox(projectIndex, projectItems);
        });
    });
    
    // Lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNext);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrev);
    }
    
    // Close on overlay click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
    
        // Video items - open in lightbox instead of playing inline
        const videoItems = document.querySelectorAll('.gallery-item[data-type="video"]');
        videoItems.forEach(item => {
            const video = item.querySelector('video');
            const overlay = item.querySelector('.gallery-item-overlay');
            
            if (!video || !overlay) return;
            
            // Prevent inline play - always open in lightbox
            overlay.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Get all visible items in the current project
                const project = item.closest('.gallery-project');
                const projectItems = Array.from(project.querySelectorAll('.gallery-item'));
                const projectIndex = projectItems.indexOf(item);
                openLightbox(projectIndex, projectItems);
            });
            
            // Also prevent video from playing when clicked directly
            video.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Get all visible items in the current project
                const project = item.closest('.gallery-project');
                const projectItems = Array.from(project.querySelectorAll('.gallery-item'));
                const projectIndex = projectItems.indexOf(item);
                openLightbox(projectIndex, projectItems);
            });
        });
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }
    
    // Make available globally
    window.galleryInit = initGallery;
})();

