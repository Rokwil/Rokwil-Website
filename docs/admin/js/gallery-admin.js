// Gallery Admin Page Script - SUPER SIMPLE!
(function() {
    'use strict';
    
    let currentProject = 'keystone';
    let projectOrder = ['keystone', 'judges-court', 'aquelle', 'other', 'videos']; // Track project order
    let galleryData = {
        keystone: { title: 'Keystone Park', subtitle: '±152 Hectares • N3 Corridor • Mega DC Logistics Precinct', icon: 'bi-building', items: [] },
        'judges-court': { title: 'Judges Court', subtitle: 'Premium corporate office space in Upper Highway', icon: 'bi-building', items: [] },
        aquelle: { title: 'aQuellé National Distribution Centre', subtitle: 'State-of-the-art distribution facility with solar installation', icon: 'bi-building', items: [] },
        other: { title: 'Other Projects', subtitle: 'Additional developments across KwaZulu-Natal', icon: 'bi-building', items: [] },
        videos: { title: 'Videos', subtitle: 'See our developments in action', icon: 'bi-play-circle', items: [] }
    };
    
    // Global function for project selection
    window.galleryAdminSelectProject = function(projectKey, buttonElement) {
        console.log('galleryAdminSelectProject called:', projectKey, 'Current:', currentProject);
        
        // Remove active from all
        document.querySelectorAll('.project-select-btn').forEach(b => b.classList.remove('active'));
        // Add active to clicked
        if (buttonElement) buttonElement.classList.add('active');
        
        // Update current project
        currentProject = projectKey;
        console.log('Current project changed to:', currentProject);
        
        // Re-render buttons to update active state
        renderProjectButtons();
        
        // Render items
        renderCurrentProject();
    };
    
    // Also assign to window.selectProject for onclick handlers
    window.selectProject = window.galleryAdminSelectProject;
    
    let pageHeroData = {};
    
    // Check authentication first
    checkAdminAuth().then(async (user) => {
        document.getElementById('adminUserEmail').textContent = user.email;
        // Load available videos dynamically first
        if (window.loadAvailableVideos) {
            await window.loadAvailableVideos();
        }
        // Setup everything first
        setupProjectSelector();
        setupImagePicker();
        await setupVideoPicker();
        setupAddButtons();
        // Load hero data
        loadHeroData();
        // Then load gallery data
        loadGalleryData();
    });
    
    // Load hero data from Firebase
    async function loadHeroData() {
        try {
            const data = await loadFromFirestore('pages', 'gallery');
            if (data && data.pageHero) {
                pageHeroData = data.pageHero;
                populateHeroForm();
            } else {
                // Initialize with defaults
                pageHeroData = {
                    title: 'Project Gallery',
                    subtitle: 'Explore our portfolio of images and videos organized by project',
                    image: ''
                };
                populateHeroForm();
            }
        } catch (error) {
            console.error('Error loading hero data:', error);
            // Initialize with defaults
            pageHeroData = {
                title: 'Project Gallery',
                subtitle: 'Explore our portfolio of images and videos organized by project',
                image: ''
            };
            populateHeroForm();
        }
    }
    
    // Populate hero form with data
    function populateHeroForm() {
        if (pageHeroData.title) {
            document.getElementById('gallery_hero_title').value = pageHeroData.title;
        }
        if (pageHeroData.subtitle) {
            document.getElementById('gallery_hero_subtitle').value = pageHeroData.subtitle;
        }
        if (pageHeroData.image) {
            const normalizedPath = normalizeImagePath(pageHeroData.image);
            document.getElementById('gallery_hero_image_url').value = pageHeroData.image;
            document.getElementById('gallery_hero_image_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
        }
        
        // Initialize image picker
        const imageUrlInput = document.getElementById('gallery_hero_image_url');
        if (imageUrlInput) {
            initImagePicker(imageUrlInput);
        }
        
        // Initialize image upload
        const uploadBtn = document.getElementById('gallery_hero_image_upload_btn');
        const fileInput = document.getElementById('gallery_hero_image');
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', async (e) => {
                if (e.target.files[0]) {
                    const imageUrl = await handleImageUpload('gallery_hero_image', 'gallery_hero_image_preview', 'images', null);
                    if (imageUrl && document.getElementById('gallery_hero_image_url')) {
                        document.getElementById('gallery_hero_image_url').value = imageUrl;
                    }
                }
            });
        }
    }
    
    // Handle hero form submission
    document.getElementById('galleryPageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            showLoading();
            
            // Collect page hero
            const heroImageUrl = document.getElementById('gallery_hero_image_url')?.value.trim();
            const heroImage = document.getElementById('gallery_hero_image').files[0];
            let finalHeroImageUrl = pageHeroData.image || '';
            if (heroImageUrl) {
                finalHeroImageUrl = heroImageUrl;
            } else if (heroImage) {
                finalHeroImageUrl = await handleImageUpload('gallery_hero_image', 'gallery_hero_image_preview', 'images', null);
            }
            
            pageHeroData = {
                title: document.getElementById('gallery_hero_title').value,
                subtitle: document.getElementById('gallery_hero_subtitle').value,
                image: finalHeroImageUrl
            };
            
            // Load existing gallery data to merge
            const existingData = await loadFromFirestore('pages', 'gallery') || {};
            
            // Merge hero data with existing gallery data
            const updatedData = {
                ...existingData,
                pageHero: pageHeroData
            };
            
            // Remove undefined values
            const cleanedData = removeUndefinedValues(updatedData);
            
            // Save to Firebase
            await saveToFirestore('pages', 'gallery', cleanedData);
            
            hideLoading();
            showToast('Gallery hero settings saved successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving gallery hero:', error);
            hideLoading();
            showToast('Error saving hero settings. Please try again.', 'error');
        }
    });
    
    // Helper function to remove undefined values
    function removeUndefinedValues(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(item => removeUndefinedValues(item)).filter(item => item !== undefined);
        }
        if (typeof obj === 'object') {
            const cleaned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = removeUndefinedValues(obj[key]);
                    if (value !== undefined) {
                        cleaned[key] = value;
                    }
                }
            }
            return cleaned;
        }
        return obj;
    }
    
    // Load gallery data from Firebase
    async function loadGalleryData() {
        try {
            console.log('Loading gallery data from Firebase...');
            // Get db - try window.db first, then firebase.firestore()
            const db = window.db || (typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore() : null);
            if (!db) {
                console.error('Firebase db not available');
                await loadFromHTML();
                loadFromAvailableImages();
                renderCurrentProject();
                return;
            }
            
            const doc = await db.collection('pages').doc('gallery').get();
            
            // Load project order FIRST, before processing projects
            if (doc.exists) {
                const data = doc.data();
                if (data.projectOrder && Array.isArray(data.projectOrder) && data.projectOrder.length > 0) {
                    projectOrder = data.projectOrder;
                    console.log('✅ Loaded projectOrder from Firebase:', projectOrder);
                } else {
                    console.warn('⚠️ No valid projectOrder in Firebase, using default:', projectOrder);
                    console.warn('Firebase data keys:', Object.keys(data));
                }
            } else {
                console.warn('⚠️ No document found in Firebase, using default projectOrder:', projectOrder);
            }
            
            if (doc.exists) {
                const data = doc.data();
                console.log('Gallery data from Firebase:', data);
                if (data.projects) {
                    // Merge with defaults, preserving titles and subtitles
                    Object.keys(data.projects).forEach(key => {
                        if (galleryData[key]) {
                            // Filter out old paths that don't use Gallery folders
                            let items = (data.projects[key].items || []).filter(item => {
                                const url = item.url || '';
                                // Only keep items from Gallery folders
                                return url.includes('Gallery/') || url.includes('gallery/');
                            });
                            
                            galleryData[key] = {
                                ...galleryData[key],
                                ...data.projects[key],
                                // Replace items with filtered ones (only Gallery paths)
                                items: items,
                                // Preserve title and subtitle from defaults if not in Firebase
                                title: data.projects[key].title || galleryData[key].title,
                                subtitle: data.projects[key].subtitle || galleryData[key].subtitle,
                                // Preserve icon if not in Firebase
                                icon: data.projects[key].icon || galleryData[key].icon
                            };
                        } else {
                            // Filter items for new projects too
                            let items = (data.projects[key].items || []).filter(item => {
                                const url = item.url || '';
                                return url.includes('Gallery/') || url.includes('gallery/');
                            });
                            galleryData[key] = {
                                ...data.projects[key],
                                items: items
                            };
                        }
                    });
                    console.log('Merged gallery data (filtered old paths):', galleryData);
                    // ALWAYS load from AVAILABLE_IMAGES to add any new files from Gallery folders
                    console.log('Loading additional files from Gallery folders...');
                    loadFromAvailableImages();
                    renderCurrentProject();
                } else {
                    // No Firebase data, try loading from HTML
                    await loadFromHTML();
                    // Load from AVAILABLE_IMAGES to populate with Gallery files
                    loadFromAvailableImages();
                    renderCurrentProject();
                }
            } else {
                console.log('No gallery data found in Firebase, loading from HTML...');
                // No Firebase data, try loading from HTML first, then load from AVAILABLE_IMAGES
                await loadFromHTML();
                // Always load from AVAILABLE_IMAGES to populate with Gallery files
                console.log('Loading files from Gallery folders...');
                loadFromAvailableImages();
                renderCurrentProject();
            }
            
            // Re-render project buttons after loading (using the loaded projectOrder)
            console.log('Rendering project buttons with order:', projectOrder);
            renderProjectButtons();
        } catch (error) {
            console.error('Error loading gallery data:', error);
            // Try loading from HTML as fallback
            await loadFromHTML();
            // Always load from AVAILABLE_IMAGES to populate with Gallery files
            console.log('Loading files from Gallery folders...');
            loadFromAvailableImages();
            showAlert('Could not load from Firebase. Loaded from gallery page/images folder instead!', 'info');
            renderCurrentProject();
        }
    }
    
    // Load gallery data from HTML page (fallback)
    async function loadFromHTML() {
        try {
            console.log('Loading gallery data from HTML page...');
            const response = await fetch('../gallery.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Find all gallery projects
            const projectSections = doc.querySelectorAll('.gallery-project');
            
            projectSections.forEach(section => {
                const projectKey = section.getAttribute('data-project');
                if (!projectKey) return;
                
                // Get title and subtitle
                const titleEl = section.querySelector('.gallery-project-title');
                const subtitleEl = section.querySelector('.gallery-project-subtitle');
                const title = titleEl ? titleEl.textContent.trim() : '';
                const subtitle = subtitleEl ? subtitleEl.textContent.trim() : '';
                
                // Get all items
                const items = [];
                const galleryItems = section.querySelectorAll('.gallery-item');
                
                galleryItems.forEach(item => {
                    const itemType = item.getAttribute('data-type');
                    
                    if (itemType === 'video') {
                        const video = item.querySelector('video source');
                        if (video && video.src) {
                            let url = video.src;
                            url = url.replace(/^https?:\/\/[^\/]+/, '');
                            if (url.startsWith('/') && !url.startsWith('/videos/')) {
                                url = url.substring(1);
                            }
                            items.push({
                                type: 'video',
                                url: url
                            });
                        }
                    } else {
                        const img = item.querySelector('img');
                        if (img && img.src) {
                            let url = img.src;
                            url = url.replace(/^https?:\/\/[^\/]+/, '');
                            if (url.startsWith('/') && !url.startsWith('/images/')) {
                                url = url.substring(1);
                            }
                            items.push({
                                type: 'image',
                                url: url
                            });
                        }
                    }
                });
                
                if (items.length > 0 || title) {
                    // Update or initialize project data
                    if (!galleryData[projectKey]) {
                        galleryData[projectKey] = { title: '', subtitle: '', items: [] };
                    }
                    
                    // Only update if we have items or if title/subtitle exist
                    if (items.length > 0) {
                        galleryData[projectKey].items = items;
                    }
                    if (title) galleryData[projectKey].title = title;
                    if (subtitle) galleryData[projectKey].subtitle = subtitle;
                    
                    console.log(`Loaded ${items.length} items for project: ${projectKey}`, items);
                }
            });
            
            console.log('Gallery data loaded from HTML:', galleryData);
        } catch (error) {
            console.error('Error loading from HTML:', error);
            // If HTML loading fails, try loading from AVAILABLE_IMAGES
            loadFromAvailableImages();
        }
    }
    
    // Load gallery data from AVAILABLE_IMAGES list (organize by folder)
    function loadFromAvailableImages() {
        console.log('Loading gallery data from AVAILABLE_IMAGES...');
        const availableImages = window.AVAILABLE_IMAGES || [];
        const availableVideos = window.AVAILABLE_VIDEOS || [];
        
        // Organize images by project folder
        availableImages.forEach(imagePath => {
            let url = imagePath;
            // Remove leading slash if present
            if (url.startsWith('/')) {
                url = url.substring(1);
            }
            
            // Determine which project this belongs to based on path
            // ONLY check Gallery/Projects/ folder
            let projectKey = 'other';
            
            // Check for Keystone in Gallery/Projects/Keystone
            if (url.includes('Gallery/Projects/Keystone')) {
                projectKey = 'keystone';
            } else if (url.includes('Gallery/Projects/Judges Court')) {
                projectKey = 'judges-court';
            } else if (url.includes('Gallery/Projects/aQuelle') || url.includes('Gallery/Projects/aQuellé')) {
                projectKey = 'aquelle';
            } else if (url.includes('Gallery/Projects/')) {
                // All other projects from Gallery folder go to 'other'
                projectKey = 'other';
            }
            
            // Initialize project if needed
            if (!galleryData[projectKey]) {
                galleryData[projectKey] = { title: '', subtitle: '', items: [] };
            }
            
            // Add image if not already present
            const exists = galleryData[projectKey].items.some(item => item.url === url);
            if (!exists) {
                galleryData[projectKey].items.push({
                    type: 'image',
                    url: url
                });
            }
        });
        
        // Add videos - organize by folder structure
        availableVideos.forEach(videoPath => {
            let url = videoPath;
            if (url.startsWith('/')) {
                url = url.substring(1);
            }
            
            // Skip if not from Gallery folder
            if (!url.includes('Gallery/') && !url.includes('gallery/')) {
                return;
            }
            
            // Ensure videos project exists
            if (!galleryData.videos) {
                galleryData.videos = { title: 'Videos', subtitle: 'See our developments in action', items: [] };
            }
            
            // Add video if not already present
            const exists = galleryData.videos.items.some(item => item.url === url);
            if (!exists) {
                galleryData.videos.items.push({
                    type: 'video',
                    url: url
                });
            }
        });
        
        console.log('Gallery data loaded from AVAILABLE_IMAGES:', galleryData);
    }
    
    // Render project selector buttons
    function renderProjectButtons() {
        const grid = document.getElementById('projectButtonsGrid');
        if (!grid) return;
        
        console.log('🔄 renderProjectButtons() called with projectOrder:', projectOrder);
        console.log('   Available projects:', Object.keys(galleryData));
        
        // Filter out any project keys that don't exist in galleryData
        const validProjectOrder = projectOrder.filter(key => galleryData[key]);
        const missingProjects = projectOrder.filter(key => !galleryData[key]);
        if (missingProjects.length > 0) {
            console.warn('⚠️ Some projects in projectOrder not found in galleryData:', missingProjects);
        }
        
        // Add any projects that exist but aren't in projectOrder
        const allProjectKeys = Object.keys(galleryData);
        const finalOrder = validProjectOrder.concat(allProjectKeys.filter(key => !validProjectOrder.includes(key)));
        
        console.log('   Final order to render:', finalOrder);
        
        grid.innerHTML = finalOrder.map(projectKey => {
            const project = galleryData[projectKey];
            if (!project) return '';
            
            const icon = project.icon || 'bi-folder';
            const isActive = currentProject === projectKey;
            
            // Use full title - CSS will handle truncation
            const displayTitle = project.title || projectKey;
            
            return `
                <div class="project-button-wrapper" data-project="${projectKey}" draggable="true">
                    <button type="button" class="project-select-btn ${isActive ? 'active' : ''}" data-project="${projectKey}" onclick="selectProject('${projectKey}', this); return false;">
                        <i class="bi ${icon}"></i>
                        <span class="project-button-title" title="${project.title || projectKey}">${displayTitle}</span>
                    </button>
                    <div class="project-button-actions">
                        <button type="button" class="project-action-btn project-edit-btn" onclick="event.stopPropagation(); editProject('${projectKey}')" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="project-action-btn project-delete-btn" onclick="event.stopPropagation(); deleteProject('${projectKey}')" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add hover effects to show action buttons
        grid.querySelectorAll('.project-button-wrapper').forEach(wrapper => {
            wrapper.addEventListener('mouseenter', function() {
                const actions = this.querySelector('.project-button-actions');
                if (actions) actions.style.opacity = '1';
            });
            wrapper.addEventListener('mouseleave', function() {
                const actions = this.querySelector('.project-button-actions');
                if (actions) actions.style.opacity = '0';
            });
        });
        
        // Setup drag and drop for project reordering
        setupProjectDragAndDrop();
    }
    
    // Setup project selector buttons (backup method)
    function setupProjectSelector() {
        renderProjectButtons();
    }
    
    // Setup drag and drop for projects
    function setupProjectDragAndDrop() {
        const grid = document.getElementById('projectButtonsGrid');
        if (!grid) return;
        
        const wrappers = grid.querySelectorAll('.project-button-wrapper');
        let draggedElement = null;
        
        wrappers.forEach(wrapper => {
            // Make the button itself draggable (but not the menu)
            const button = wrapper.querySelector('.project-select-btn');
            if (button) {
                button.draggable = true;
                
                button.addEventListener('dragstart', function(e) {
                    // Don't drag if clicking on menu
                    if (e.target.closest('.project-button-menu')) {
                        e.preventDefault();
                        return;
                    }
                    draggedElement = wrapper;
                    wrapper.style.opacity = '0.5';
                    wrapper.style.transform = 'scale(0.95)';
                });
                
                button.addEventListener('dragend', function(e) {
                    wrapper.style.opacity = '1';
                    wrapper.style.transform = 'scale(1)';
                    draggedElement = null;
                });
            }
            
            wrapper.addEventListener('dragover', function(e) {
                e.preventDefault();
                if (draggedElement && draggedElement !== this) {
                    const rect = this.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    if (e.clientY < midY) {
                        grid.insertBefore(draggedElement, this);
                    } else {
                        grid.insertBefore(draggedElement, this.nextSibling);
                    }
                }
            });
            
            wrapper.addEventListener('drop', function(e) {
                e.preventDefault();
                if (draggedElement && draggedElement !== this) {
                    // Update projectOrder based on new DOM order
                    const newOrder = Array.from(grid.querySelectorAll('.project-button-wrapper')).map(w => w.getAttribute('data-project')).filter(key => key);
                    projectOrder = newOrder;
                    console.log('✅ Project order updated via drag:', projectOrder);
                    console.log('   Remember to click "Save Gallery" to persist this change!');
                }
            });
        });
    }
    
    // Add new project
    window.addNewProject = function() {
        const projectKey = prompt('Enter a unique project key (e.g., "new-project"):');
        if (!projectKey || galleryData[projectKey]) {
            if (galleryData[projectKey]) {
                alert('A project with this key already exists!');
            }
            return;
        }
        
        const title = prompt('Enter project title:') || 'New Project';
        const subtitle = prompt('Enter project subtitle (optional):') || '';
        
        // Add to galleryData
        galleryData[projectKey] = {
            title: title,
            subtitle: subtitle,
            icon: 'bi-folder',
            items: []
        };
        
        // Add to projectOrder
        projectOrder.push(projectKey);
        
        // Re-render buttons
        renderProjectButtons();
        
        // Select the new project
        selectProject(projectKey, null);
        
        showAlert('New project created!', 'success');
    };
    
    // Edit project
    window.editProject = function(projectKey) {
        const project = galleryData[projectKey];
        if (!project) return;
        
        // Create edit modal
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;';
        modal.innerHTML = `
            <div style="background: var(--admin-bg-secondary); border: 2px solid var(--admin-border); border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%;">
                <h3 style="margin-top: 0; color: var(--admin-text-primary); margin-bottom: 1.5rem;">
                    <i class="bi bi-pencil"></i> Edit Project
                </h3>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--admin-text-secondary);">Project Title</label>
                    <input type="text" id="editProjectTitle" value="${project.title}" style="width: 100%; padding: 0.75rem; background: var(--admin-bg-tertiary); border: 2px solid var(--admin-border); border-radius: 8px; color: var(--admin-text-primary);">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--admin-text-secondary);">Project Subtitle</label>
                    <input type="text" id="editProjectSubtitle" value="${project.subtitle}" style="width: 100%; padding: 0.75rem; background: var(--admin-bg-tertiary); border: 2px solid var(--admin-border); border-radius: 8px; color: var(--admin-text-primary);">
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--admin-text-secondary);">Icon</label>
                    <div class="icon-picker-wrapper">
                        <div class="icon-picker-preview">
                            <i class="bi ${project.icon || 'bi-folder'}"></i>
                        </div>
                        <input type="text" id="editProjectIcon" value="${project.icon || 'bi-folder'}" style="display: none;">
                        <button type="button" class="icon-picker-btn" onclick="openIconPicker(document.getElementById('editProjectIcon'))">
                            <i class="bi bi-grid-3x3"></i> Choose Icon
                        </button>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('div[style*=\"position: fixed\"]').remove()">Cancel</button>
                    <button type="button" class="admin-btn admin-btn-primary" onclick="saveProjectEdit('${projectKey}')">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Initialize icon picker
        if (window.initIconPicker) {
            window.initIconPicker(document.getElementById('editProjectIcon'));
        }
        
        // Close on overlay click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    };
    
    // Save project edit
    window.saveProjectEdit = function(projectKey) {
        const title = document.getElementById('editProjectTitle').value;
        const subtitle = document.getElementById('editProjectSubtitle').value;
        const icon = document.getElementById('editProjectIcon').value;
        
        if (!title.trim()) {
            alert('Project title is required!');
            return;
        }
        
        galleryData[projectKey].title = title;
        galleryData[projectKey].subtitle = subtitle;
        galleryData[projectKey].icon = icon || 'bi-folder';
        
        // Close modal
        document.querySelector('div[style*="position: fixed"]').remove();
        
        // Re-render buttons
        renderProjectButtons();
        
        showAlert('Project updated!', 'success');
    };
    
    // Delete project
    window.deleteProject = function(projectKey) {
        if (!confirm(`Are you sure you want to delete "${galleryData[projectKey].title}"? This will also delete all images/videos in this project.`)) {
            return;
        }
        
        // Don't allow deleting if it's the only project
        if (projectOrder.length <= 1) {
            showToast('You must have at least one project!', 'warning');
            return;
        }
        
        const projectTitle = galleryData[projectKey].title;
        
        // Remove from galleryData
        delete galleryData[projectKey];
        
        // Remove from projectOrder
        projectOrder = projectOrder.filter(key => key !== projectKey);
        
        // If it was the current project, switch to first available
        if (currentProject === projectKey) {
            currentProject = projectOrder[0];
        }
        
        // Re-render buttons
        renderProjectButtons();
        
        // Select the first project
        if (projectOrder.length > 0) {
            selectProject(projectOrder[0], null);
        }
        
        showToast(`Project "${projectTitle}" deleted successfully`, 'success');
        
        showAlert('Project deleted!', 'success');
    };
    
    
    // Setup image picker
    function setupImagePicker() {
        const imageInput = document.getElementById('gallery_image_picker');
        if (imageInput && window.initImagePicker) {
            window.initImagePicker(imageInput);
        }
    }
    
    // Setup video picker
    async function setupVideoPicker() {
        const videoInput = document.getElementById('gallery_video_picker');
        if (videoInput && window.initVideoPicker) {
            await window.initVideoPicker(videoInput);
        }
    }
    
    // Setup add buttons
    function setupAddButtons() {
        const addImageBtn = document.getElementById('addImageBtn');
        const addVideoBtn = document.getElementById('addVideoBtn');
        
        if (addImageBtn) {
            addImageBtn.addEventListener('click', function() {
                const imageUrl = document.getElementById('gallery_image_picker').value.trim();
                if (imageUrl) {
                    addItem('image', imageUrl);
                    document.getElementById('gallery_image_picker').value = '';
                    showAlert('Picture added! 🎉', 'success');
                } else {
                    showAlert('Please choose a picture first!', 'warning');
                }
            });
        }
        
        if (addVideoBtn) {
            addVideoBtn.addEventListener('click', function() {
                const videoUrl = document.getElementById('gallery_video_picker').value.trim();
                if (videoUrl) {
                    addItem('video', videoUrl);
                    document.getElementById('gallery_video_picker').value = '';
                    showAlert('Video added! 🎉', 'success');
                } else {
                    showAlert('Please choose a video first!', 'warning');
                }
            });
        }
    }
    
    // Add item to current project
    function addItem(type, url) {
        if (!galleryData[currentProject]) {
            galleryData[currentProject] = { title: '', subtitle: '', items: [] };
        }
        
        galleryData[currentProject].items.push({
            type: type,
            url: url
        });
        
        renderCurrentProject();
    }
    
    // Remove item
    window.removeGalleryItem = function(index) {
        if (confirm('Remove this item?')) {
            galleryData[currentProject].items.splice(index, 1);
            renderCurrentProject();
            showToast('Item removed successfully', 'success');
        }
    };
    
    // Render current project items
    function renderCurrentProject() {
        const grid = document.getElementById('galleryItemsGrid');
        if (!grid) {
            console.error('Gallery items grid not found!');
            return;
        }
        
        const project = galleryData[currentProject];
        if (!project) {
            console.error('Current project not found:', currentProject);
            return;
        }
        
        const items = project.items || [];
        console.log(`Rendering ${items.length} items for project: ${currentProject}`, items);
        
        if (items.length === 0) {
            grid.innerHTML = `
                <div class="gallery-item-admin empty">
                    <div style="text-align: center; color: var(--admin-text-secondary);">
                        <i class="bi bi-inbox" style="font-size: 3rem; display: block; margin-bottom: 1rem;"></i>
                        <p>No items yet. Add some pictures or videos!</p>
                    </div>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = items.map((item, index) => {
            if (item.type === 'video') {
                // Normalize video URL
                let videoUrl = item.url;
                
                // Ensure path starts with / for normalization
                if (!videoUrl.startsWith('/') && !videoUrl.startsWith('http')) {
                    videoUrl = '/' + videoUrl;
                }
                
                // Use normalizeImagePath if available (works for videos too)
                if (window.normalizeImagePath) {
                    videoUrl = window.normalizeImagePath(videoUrl);
                } else {
                    // Fallback: ensure path starts with / for absolute paths
                    if (!videoUrl.startsWith('http') && !videoUrl.startsWith('../')) {
                        if (!videoUrl.startsWith('/')) {
                            videoUrl = '/' + videoUrl;
                        }
                    }
                }
                
                return `
                    <div class="gallery-item-admin" draggable="true" data-index="${index}">
                        <video preload="metadata" style="width: 100%; height: 100%; object-fit: cover;">
                            <source src="${videoUrl}" type="video/mp4">
                        </video>
                        <button type="button" class="item-remove-btn" onclick="removeGalleryItem(${index})" title="Remove">
                            <i class="bi bi-trash"></i>
                        </button>
                        <div class="item-drag-handle" title="Drag to reorder">
                            <i class="bi bi-grip-vertical"></i>
                        </div>
                        <div class="item-type-badge">Video</div>
                    </div>
                `;
            } else {
                // Normalize image URL
                let imageUrl = item.url;
                
                // Ensure path starts with / for normalization
                if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
                    imageUrl = '/' + imageUrl;
                }
                
                // Use normalizeImagePath if available
                if (window.normalizeImagePath) {
                    imageUrl = window.normalizeImagePath(imageUrl);
                } else {
                    // Fallback: ensure path starts with / for absolute paths
                    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('../')) {
                        if (!imageUrl.startsWith('/')) {
                            imageUrl = '/' + imageUrl;
                        }
                    }
                }
                
                return `
                    <div class="gallery-item-admin" draggable="true" data-index="${index}">
                        <img src="${imageUrl}" alt="Gallery item" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\\'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #2a2a2a; color: #999; font-size: 0.875rem;\\'>Image</div>'; console.error('Failed to load image:', '${imageUrl}');">
                        <button type="button" class="item-remove-btn" onclick="removeGalleryItem(${index})" title="Remove">
                            <i class="bi bi-trash"></i>
                        </button>
                        <div class="item-drag-handle" title="Drag to reorder">
                            <i class="bi bi-grip-vertical"></i>
                        </div>
                        <div class="item-type-badge">Image</div>
                    </div>
                `;
            }
        }).join('');
        
        console.log('Rendered gallery items HTML');
        
        // Re-setup drag and drop after rendering
        setTimeout(() => {
            setupDragAndDrop();
        }, 100);
    }
    
    // Setup drag and drop
    function setupDragAndDrop() {
        const grid = document.getElementById('galleryItemsGrid');
        if (!grid) return;
        
        const items = grid.querySelectorAll('.gallery-item-admin[draggable="true"]');
        let draggedIndex = null;
        
        items.forEach((item, index) => {
            item.addEventListener('dragstart', function(e) {
                this.classList.add('dragging');
                draggedIndex = parseInt(this.getAttribute('data-index'));
                e.dataTransfer.effectAllowed = 'move';
            });
            
            item.addEventListener('dragend', function() {
                this.classList.remove('dragging');
                // Update order after drag
                updateItemOrder();
            });
            
            item.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                
                const dragging = grid.querySelector('.dragging');
                if (!dragging) return;
                
                const afterElement = getDragAfterElement(grid, e.clientY);
                
                if (afterElement == null) {
                    grid.appendChild(dragging);
                } else {
                    grid.insertBefore(dragging, afterElement);
                }
            });
        });
    }
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.gallery-item-admin:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // Update item order after drag
    function updateItemOrder() {
        const grid = document.getElementById('galleryItemsGrid');
        const items = grid.querySelectorAll('.gallery-item-admin[draggable="true"]');
        
        if (items.length === 0) return;
        
        // Get items in their NEW DOM order
        // Read the actual item data from each DOM element (url, type) to reconstruct the array
        const newOrder = Array.from(items).map(item => {
            // Get the item data from data attributes or from the original array using data-index
            const oldIndex = parseInt(item.getAttribute('data-index'));
            if (!isNaN(oldIndex) && oldIndex >= 0 && oldIndex < galleryData[currentProject].items.length) {
                // Get the item data from the original array position
                return galleryData[currentProject].items[oldIndex];
            } else {
                // Fallback: try to extract from DOM
                const url = item.querySelector('img')?.src || item.querySelector('video')?.src || '';
                const type = item.getAttribute('data-type') || 'image';
                return { type, url };
            }
        }).filter(item => item && item.url); // Remove any invalid items
        
        // Update the items array with the new order
        galleryData[currentProject].items = newOrder;
        
        console.log('✅ Item order updated for project:', currentProject);
        console.log('   New order:', newOrder.map((i, idx) => `${idx + 1}. ${i.url || i.type}`));
        
        // Re-render to update indices to match new order
        renderCurrentProject();
    }
    
    // Handle form submission
    const form = document.getElementById('galleryForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Update all projects - preserve the exact structure including items order
            const allProjects = {};
            Object.keys(galleryData).forEach(key => {
                // Create a deep copy to ensure items array order is preserved
                allProjects[key] = {
                    title: galleryData[key].title || '',
                    subtitle: galleryData[key].subtitle || '',
                    icon: galleryData[key].icon || 'bi-folder',
                    items: galleryData[key].items ? [...galleryData[key].items] : [] // Preserve array order
                };
            });
            
            console.log('📦 Preparing to save projects:', Object.keys(allProjects).map(k => ({
                key: k,
                title: allProjects[k].title,
                itemCount: allProjects[k].items.length,
                itemOrder: allProjects[k].items.map(i => i.url)
            })));
            
            try {
                showLoading();
                const db = window.db || (typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore() : null);
                if (!db) {
                    hideLoading();
                    showAlert('Firebase not available. Cannot save.', 'error');
                    return;
                }
                
                // Ensure projectOrder includes all projects
                const allProjectKeys = Object.keys(allProjects);
                const finalProjectOrder = projectOrder.filter(key => allProjectKeys.includes(key))
                    .concat(allProjectKeys.filter(key => !projectOrder.includes(key)));
                
                const saveData = {
                    projects: allProjects,
                    projectOrder: finalProjectOrder,
                    updatedAt: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
                };
                
                console.log('💾 Saving to Firebase:', {
                    projectOrder: saveData.projectOrder,
                    projectKeys: Object.keys(saveData.projects),
                    projectsHaveItems: Object.keys(saveData.projects).map(k => ({
                        key: k,
                        title: saveData.projects[k].title,
                        itemCount: saveData.projects[k].items ? saveData.projects[k].items.length : 0,
                        itemOrder: saveData.projects[k].items ? saveData.projects[k].items.map((i, idx) => `${idx + 1}. ${i.url || i.type}`) : []
                    }))
                });
                
                // Use set() without merge to ensure projectOrder is always saved
                // merge: true can sometimes skip updating top-level fields like projectOrder
                await db.collection('pages').doc('gallery').set(saveData);
                
                // Update local projectOrder to match what was saved
                projectOrder = finalProjectOrder;
                console.log('✅ Saved! Local projectOrder updated to:', projectOrder);
                
                hideLoading();
                showAlert('Gallery saved successfully! 🎉', 'success');
            } catch (error) {
                hideLoading();
                console.error('Error saving gallery:', error);
                showAlert('Error saving gallery. Please try again.', 'error');
            }
        });
    }
    
})();

