// Projects Admin Page Script
(function() {
    'use strict';
    
    let pageData = {};
    let projectCounter = 0;
    
    // Use global AVAILABLE_IMAGES from admin-firebase.js, or fallback to local if not available
    const AVAILABLE_IMAGES = window.AVAILABLE_IMAGES || [
        // Projects/Keystone
        '/images/Projects/Keystone/Keystone 2.webp',
        '/images/Projects/Keystone/malda-pack_22-small-400x267.jpg',
        '/images/Projects/Keystone/ND.webp',
        '/images/Projects/Keystone/Pep 2.jpg',
        '/images/Projects/Keystone/Pep 3.jpg',
        '/images/Projects/Keystone/Pep MAIN.jpg',
        '/images/Projects/Keystone/Pep.jpg',
        '/images/Projects/Keystone/The Boys.jpg',
        // Projects/aQuelle
        '/images/Projects/aQuelle - National Distribution Centre/Aquelle.webp',
        // Projects/Judges Court
        '/images/Projects/Judges Court/Judges-Court-high (2).jpg',
        // Projects/Lakeview Mini Factories
        '/images/Projects/Lakeview Mini Factories/dji_0041-crop-u6092 (1).jpg',
        // Projects/Pioneer Campus
        '/images/Projects/Pioneer Campus/pioneer-campus-2 (1).jpg',
        // Projects/Rockwood Mini Factories
        '/images/Projects/Rockwood Mini Factories/Rockwood-1-1.jpg',
        // Projects/Umlazi Mega City
        '/images/Projects/Umlazi Mega City/umlazi-mega-city-1 (1).jpg',
        // Projects/Unkown
        '/images/Projects/Unkown/Unkown.jpg',
        // Projects/Victory View Offices
        '/images/Projects/Victory View Offices/Victory-Road (1).jpg',
        // Archived
        '/images/Archived/Aquelle.webp',
        '/images/Archived/Judges Court.jpg',
        '/images/Archived/Keystone - logo.webp',
        '/images/Archived/keystone - meeting.webp',
        '/images/Archived/Keystone 1.webp',
        '/images/Archived/Keystone 10.webp',
        '/images/Archived/Keystone 3.webp',
        '/images/Archived/Keystone 5.webp',
        '/images/Archived/Keystone 6.webp',
        '/images/Archived/Keystone 8.webp',
        '/images/Archived/Keystone 9.webp',
        '/images/Archived/Rockwood.jpg',
        // Home
        '/images/Home/Home Screen.jpg',
        '/images/Home/Video photo.webp',
        // Other
        '/images/Other/Keystone - logo.webp'
    ];
    
    // Helper function to fix truncated image paths (complete paths that are missing extensions or closing parentheses)
    function fixTruncatedImagePath(path) {
        if (!path) return path;
        
        // Normalize the path for comparison (remove leading slash)
        const pathForComparison = path.startsWith('/') ? path.substring(1) : path;
        
        // Check if path looks truncated (ends with opening parenthesis and number without closing)
        const truncatedPattern = /\((\d+)$/;
        const match = pathForComparison.match(truncatedPattern);
        
        if (match) {
            // Try to find a matching path in AVAILABLE_IMAGES
            const possibleMatches = AVAILABLE_IMAGES.filter(img => {
                // Remove leading slash for comparison
                const imgPath = img.startsWith('/') ? img.substring(1) : img;
                
                // Check if the image path starts with our truncated path
                return imgPath.startsWith(pathForComparison) && imgPath.length > pathForComparison.length;
            });
            
            if (possibleMatches.length > 0) {
                // Use the first match (most likely to be correct)
                return possibleMatches[0];
            }
            
            // If no match found, try to complete it with common extensions
            const commonExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
            for (const ext of commonExtensions) {
                const testPath = '/' + pathForComparison + ')' + ext;
                if (AVAILABLE_IMAGES.includes(testPath)) {
                    return testPath;
                }
            }
        }
        
        // Check if path is missing extension but otherwise complete
        if (!pathForComparison.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
            // Try to find exact match in AVAILABLE_IMAGES
            const normalizedPath = '/' + pathForComparison;
            if (AVAILABLE_IMAGES.includes(normalizedPath)) {
                return normalizedPath;
            }
            
            // Try with common extensions
            const commonExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
            for (const ext of commonExtensions) {
                const testPath = normalizedPath + ext;
                if (AVAILABLE_IMAGES.includes(testPath)) {
                    return testPath;
                }
            }
        }
        
        return path;
    }
    
    // Helper function to normalize image paths (convert relative to absolute if needed)
    function normalizeImagePath(path) {
        if (!path) return path;
        
        // Remove any leading/trailing whitespace
        path = path.trim();
        
        // First, try to fix truncated paths
        path = fixTruncatedImagePath(path);
        
        // If path doesn't start with /, http://, or https://, make it absolute
        if (!path.startsWith('/') && !path.startsWith('http://') && !path.startsWith('https://')) {
            // If it starts with 'images/' or 'admin/images/', convert to '/images/'
            if (path.startsWith('images/')) {
                return '/' + path;
            }
            if (path.startsWith('admin/images/')) {
                return '/' + path.replace('admin/', '');
            }
            // Otherwise, assume it's relative to root
            return '/' + path;
        }
        
        // If path starts with '/admin/images/', fix it to '/images/'
        if (path.startsWith('/admin/images/')) {
            return path.replace('/admin/images/', '/images/');
        }
        
        return path;
    }
    
    // Initialize image picker dropdown
    function initImagePicker(imageUrlInput) {
        const dropdown = imageUrlInput.closest('.image-picker-dropdown');
        if (!dropdown) return;
        
        const toggleBtn = dropdown.querySelector('.image-picker-toggle');
        const dropdownMenu = dropdown.querySelector('.image-picker-dropdown-menu');
        const imageList = dropdown.querySelector('.image-picker-list');
        const searchInput = dropdown.querySelector('.image-picker-search-input');
        const manualInput = dropdown.querySelector('.image-picker-manual-input');
        const manualBtn = dropdown.querySelector('.admin-btn-primary');
        const imagePreview = imageUrlInput.closest('.project-image-item').querySelector('.project-image-preview');
        
        // Populate image list
        function populateImageList(filter = '') {
            const imagesToUse = window.AVAILABLE_IMAGES || AVAILABLE_IMAGES;
            const filtered = imagesToUse.filter(img => 
                img.toLowerCase().includes(filter.toLowerCase())
            );
            
            imageList.innerHTML = filtered.map(img => `
                <div class="image-picker-item" data-image="${img}" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; cursor: pointer; border-radius: 4px; margin-bottom: 0.25rem; transition: background 0.2s;" onmouseover="this.style.background='var(--admin-bg-tertiary)'" onmouseout="this.style.background='transparent'">
                    <img src="${img}" alt="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid var(--admin-border);" onerror="this.style.display='none'">
                    <span style="flex: 1; color: var(--admin-text-primary); font-size: 0.875rem;">${img}</span>
                </div>
            `).join('');
            
            // Add click handlers
            imageList.querySelectorAll('.image-picker-item').forEach(item => {
                item.addEventListener('click', function() {
                    const selectedImage = this.getAttribute('data-image');
                    imageUrlInput.value = selectedImage;
                    const normalizedPath = normalizeImagePath(selectedImage);
                    imagePreview.innerHTML = `<img src="${normalizedPath}" alt="Preview" style="max-width: 100%;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                    dropdownMenu.style.display = 'none';
                    toggleBtn.querySelector('i').className = 'bi bi-chevron-down';
                });
            });
            
            if (filtered.length === 0) {
                imageList.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--admin-text-secondary);">No images found</div>';
            }
        }
        
        // Toggle dropdown
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropdownMenu.style.display === 'block';
            dropdownMenu.style.display = isOpen ? 'none' : 'block';
            toggleBtn.querySelector('i').className = isOpen ? 'bi bi-chevron-down' : 'bi bi-chevron-up';
            if (!isOpen) {
                populateImageList();
                searchInput.value = '';
            }
        });
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            populateImageList(this.value);
        });
        
        // Manual URL entry
        manualBtn.addEventListener('click', function() {
            const manualUrl = manualInput.value.trim();
            if (manualUrl) {
                imageUrlInput.value = manualUrl;
                const normalizedPath = normalizeImagePath(manualUrl);
                imagePreview.innerHTML = `<img src="${normalizedPath}" alt="Preview" style="max-width: 100%;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                dropdownMenu.style.display = 'none';
                toggleBtn.querySelector('i').className = 'bi bi-chevron-down';
                manualInput.value = '';
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdownMenu.style.display = 'none';
                toggleBtn.querySelector('i').className = 'bi bi-chevron-down';
            }
        });
        
        // Make input clickable to open dropdown
        imageUrlInput.addEventListener('click', function() {
            if (dropdownMenu.style.display !== 'block') {
                dropdownMenu.style.display = 'block';
                toggleBtn.querySelector('i').className = 'bi bi-chevron-up';
                populateImageList();
            }
        });
    }
    
    // Check authentication
    checkAdminAuth().then((user) => {
        document.getElementById('adminUserEmail').textContent = user.email;
        loadPageData();
    });
    
    // Load page data from Firebase
    async function loadPageData() {
        const data = await loadFromFirestore('pages', 'projects');
        if (data) {
            pageData = data;
            populateForm();
        }
    }
    
    // Populate form with data
    function populateForm() {
        if (pageData.pageHero) {
            document.getElementById('projects_hero_title').value = pageData.pageHero.title || '';
            document.getElementById('projects_hero_subtitle').value = pageData.pageHero.subtitle || '';
            if (pageData.pageHero.image) {
                const normalizedPath = normalizeImagePath(pageData.pageHero.image);
                if (document.getElementById('projects_hero_image_url')) {
                    document.getElementById('projects_hero_image_url').value = pageData.pageHero.image;
                }
                document.getElementById('projects_hero_image_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
        }
        
        if (pageData.projects && pageData.projects.length > 0) {
            pageData.projects.forEach((project, index) => {
                addProject(project, index);
            });
        }
    }
    
    // Add project
    window.addProject = function(data = null, index = null) {
        const container = document.getElementById('projects_container');
        const id = index !== null ? index : projectCounter++;
        
        // Handle description - can be HTML, array of paragraphs, or string
        let descriptionHTML = '';
        if (data?.description) {
            if (Array.isArray(data.description)) {
                descriptionHTML = data.description.map(p => `<p>${p}</p>`).join('');
            } else if (data.description.includes('<') || data.description.includes('&lt;')) {
                // Already HTML
                descriptionHTML = data.description;
            } else {
                // Plain text - convert to HTML
                descriptionHTML = data.description.split(/\n\s*\n/).map(p => `<p>${p.trim()}</p>`).join('');
            }
        }
        
        // Handle images - support URL inputs with image picker dropdown
        const imagesHtml = (data?.images || []).map((img, idx) => `
            <div class="project-image-item" data-index="${idx}">
                <div class="admin-form-group">
                    <label>Image ${idx + 1} URL</label>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="image-picker-dropdown" style="flex: 1; position: relative;">
                            <input type="text" class="project-image-url" value="${img || ''}" placeholder="images/Projects/..." style="width: 100%;" readonly>
                            <button type="button" class="image-picker-toggle" style="position: absolute; right: 0; top: 0; height: 100%; padding: 0 0.75rem; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-left: none; border-radius: 0 8px 8px 0; cursor: pointer; display: flex; align-items: center;">
                                <i class="bi bi-chevron-down"></i>
                            </button>
                            <div class="image-picker-dropdown-menu" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--admin-bg-secondary); border: 1px solid var(--admin-border); border-radius: 8px; margin-top: 0.25rem; max-height: 400px; overflow-y: auto; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                                <div class="image-picker-search" style="padding: 0.75rem; border-bottom: 1px solid var(--admin-border);">
                                    <input type="text" class="image-picker-search-input" placeholder="Search images..." style="width: 100%; padding: 0.5rem; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 4px; color: var(--admin-text-primary);">
                                </div>
                                <div class="image-picker-list" style="padding: 0.5rem;">
                                    <!-- Images will be populated here -->
                                </div>
                                <div style="padding: 0.75rem; border-top: 1px solid var(--admin-border);">
                                    <input type="text" class="image-picker-manual-input" placeholder="Or enter URL manually..." style="width: 100%; padding: 0.5rem; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 4px; color: var(--admin-text-primary);">
                                    <button type="button" class="admin-btn admin-btn-primary" style="width: 100%; margin-top: 0.5rem; padding: 0.5rem;">Use Manual URL</button>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-image-item').remove()" style="flex-shrink: 0;">
                            <i class="bi bi-trash"></i> Remove
                        </button>
                    </div>
                </div>
                <div class="image-preview project-image-preview" style="max-width: 200px; margin-bottom: 1rem;">
                    ${img ? `<img src="${normalizeImagePath(img)}" alt="Preview" style="max-width: 100%;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">` : '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>'}
                </div>
                <input type="file" class="project-image-input" accept="image/*" style="display: none;">
                <button type="button" class="admin-btn admin-btn-secondary project-image-upload-btn" style="margin-bottom: 1rem;">
                    <i class="bi bi-upload"></i> Upload Image
                </button>
            </div>
        `).join('');
        
        // Function to guess icon based on text content
        function guessIconFromText(text) {
            const lowerText = text.toLowerCase();
            if (lowerText.includes('hectare') || lowerText.includes('m²') || lowerText.includes('size') || lowerText.includes('area') || lowerText.match(/\d+\s*(m|km|ha)/)) {
                return 'bi-rulers';
            }
            if (lowerText.includes('access') || lowerText.includes('n3') || lowerText.includes('road') || lowerText.includes('corridor')) {
                return 'bi-truck';
            }
            if (lowerText.includes('logistics') || lowerText.includes('dc') || lowerText.includes('warehouse') || lowerText.includes('precinct') || lowerText.includes('facility')) {
                return 'bi-building-gear';
            }
            if (lowerText.includes('location') || lowerText.includes('ridge') || lowerText.includes('kloof') || lowerText.includes('durban') || lowerText.includes('corridor')) {
                return 'bi-geo-alt-fill';
            }
            if (lowerText.includes('completed') || lowerText.includes('date') || lowerText.match(/\d{4}/)) {
                return 'bi-calendar';
            }
            if (lowerText.includes('office') || lowerText.includes('building')) {
                return 'bi-building';
            }
            // Default
            return 'bi-geo-alt-fill';
        }
        
        // Handle meta items - support both old format (string) and new format (object with icon and text)
        const metaHtml = (data?.meta || []).map((meta, idx) => {
            let metaObj;
            if (typeof meta === 'string') {
                // Old format - try to guess icon from text
                const guessedIcon = guessIconFromText(meta);
                metaObj = { text: meta, icon: guessedIcon };
            } else {
                metaObj = meta || { text: '', icon: '' };
                // If icon is empty but text exists, try to guess
                if (!metaObj.icon && metaObj.text) {
                    metaObj.icon = guessIconFromText(metaObj.text);
                }
            }
            return `
            <div class="project-meta-item" data-index="${idx}" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="text" class="project-meta-icon" value="${metaObj.icon || ''}" placeholder="bi-geo-alt" style="display: none;">
                <button type="button" class="icon-display-btn" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 8px; cursor: pointer; padding: 0; flex-shrink: 0;">
                    <i class="bi ${metaObj.icon || 'bi-geo-alt-fill'}" style="font-size: 1.5rem; color: var(--admin-text-primary);"></i>
                </button>
                <input type="text" class="project-meta-text" value="${metaObj.text || ''}" placeholder="Location, Size, etc." style="flex: 1;">
                <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-meta-item').remove()" style="flex-shrink: 0;">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        }).join('');
        
        // Handle sections
        const sectionsHtml = (data?.sections || []).map((section, idx) => {
            const sectionIcon = section.icon || 'bi-diagram-3-fill';
            return `
            <div class="project-section-item" data-index="${idx}">
                <div class="admin-form-group">
                    <label>Section Title</label>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="text" class="section-icon" value="${sectionIcon}" placeholder="bi-diagram-3-fill" style="display: none;">
                        <button type="button" class="icon-display-btn" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 8px; cursor: pointer; padding: 0; flex-shrink: 0;">
                            <i class="bi ${sectionIcon}" style="font-size: 1.5rem; color: var(--admin-text-primary);"></i>
                        </button>
                        <input type="text" class="section-title" value="${section.title || ''}" placeholder="Section Title" style="flex: 1;">
                    </div>
                </div>
                <div class="admin-form-group">
                    <label>Section Content</label>
                    <div class="section-content-editor" id="section-content-editor-${id}-${idx}"></div>
                    <input type="hidden" class="section-content" value="${(Array.isArray(section.content) ? section.content.join('<br>') : (section.content || '')).replace(/"/g, '&quot;')}">
                    <small>Use the toolbar to format text, make it bold, and insert links</small>
                </div>
                <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-section-item').remove()">
                    <i class="bi bi-trash"></i> Remove Section
                </button>
            </div>
        `;
        }).join('');
        
        // Handle features - support both old format (string) and new format (object with icon and text)
        const featuresHtml = (data?.features || []).map((feature, idx) => {
            let featureObj;
            if (typeof feature === 'string') {
                // Old format - try to guess icon from text
                const guessedIcon = guessIconFromText(feature);
                featureObj = { text: feature, icon: guessedIcon };
            } else {
                featureObj = feature || { text: '', icon: '' };
                // If icon is empty but text exists, try to guess
                if (!featureObj.icon && featureObj.text) {
                    featureObj.icon = guessIconFromText(featureObj.text);
                }
            }
            return `
            <div class="project-feature-item" data-index="${idx}" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="text" class="project-feature-icon" value="${featureObj.icon || ''}" placeholder="bi-geo-alt" style="display: none;">
                <button type="button" class="icon-display-btn" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 8px; cursor: pointer; padding: 0; flex-shrink: 0;">
                    <i class="bi ${featureObj.icon || 'bi-tag'}" style="font-size: 1.5rem; color: var(--admin-text-primary);"></i>
                </button>
                <input type="text" class="project-feature-text" value="${featureObj.text || ''}" placeholder="Feature tag" style="flex: 1;">
                <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-feature-item').remove()" style="flex-shrink: 0;">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        }).join('');
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.dataset.index = id;
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Project ${id + 1}</span>
                <button type="button" class="btn-remove-item" onclick="this.closest('.repeatable-item').remove()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="admin-form-group">
                <label>Project Name</label>
                <input type="text" class="project-name" value="${data?.name || ''}" placeholder="Keystone Park">
            </div>
            <div class="admin-form-group">
                <label>Featured</label>
                <input type="checkbox" class="project-featured" ${data?.featured ? 'checked' : ''}>
            </div>
                <div class="admin-form-group">
                <label>Meta Items (Location, Size, etc.)</label>
                <div class="project-meta-container">
                    ${metaHtml || '<div class="project-meta-item" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><input type="text" class="project-meta-icon" placeholder="bi-geo-alt" style="display: none;"><button type="button" class="icon-display-btn" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 8px; cursor: pointer; padding: 0; flex-shrink: 0;"><i class="bi bi-geo-alt-fill" style="font-size: 1.5rem; color: var(--admin-text-primary);"></i></button><input type="text" class="project-meta-text" placeholder="Meta item" style="flex: 1;"><button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest(\'.project-meta-item\').remove()" style="flex-shrink: 0;"><i class="bi bi-trash"></i></button></div>'}
                </div>
                <button type="button" class="admin-btn admin-btn-secondary btn-add-item" onclick="addProjectMeta(this)">
                    <i class="bi bi-plus-circle"></i> Add Meta Item
                </button>
            </div>
            <div class="admin-form-group">
                <label>Description (Multiple paragraphs supported)</label>
                <div class="project-description-editor" id="project-description-editor-${id}"></div>
                <input type="hidden" class="project-description" value="${descriptionHTML.replace(/"/g, '&quot;')}">
                <small>Use the toolbar to format text, make it bold, and insert links</small>
            </div>
            <div class="admin-form-group">
                <label>Project Sections (Headings with content)</label>
                <div class="project-sections-container">
                    ${sectionsHtml || ''}
                </div>
                <button type="button" class="admin-btn admin-btn-secondary btn-add-item" onclick="addProjectSection(this)">
                    <i class="bi bi-plus-circle"></i> Add Section
                </button>
            </div>
            <div class="admin-form-group">
                <label>Feature Tags</label>
                <div class="project-features-container">
                    ${featuresHtml || '<div class="project-feature-item" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><input type="text" class="project-feature-icon" placeholder="bi-geo-alt" style="display: none;"><button type="button" class="icon-display-btn" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 8px; cursor: pointer; padding: 0; flex-shrink: 0;"><i class="bi bi-tag" style="font-size: 1.5rem; color: var(--admin-text-primary);"></i></button><input type="text" class="project-feature-text" placeholder="Feature tag" style="flex: 1;"><button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest(\'.project-feature-item\').remove()" style="flex-shrink: 0;"><i class="bi bi-trash"></i></button></div>'}
                </div>
                <button type="button" class="admin-btn admin-btn-secondary btn-add-item" onclick="addProjectFeature(this)">
                    <i class="bi bi-plus-circle"></i> Add Feature Tag
                </button>
            </div>
            <div class="image-upload-container">
                <label>Project Images (URLs or upload files)</label>
                <div class="project-images-container">
                    ${imagesHtml || '<div class="project-image-item"><div class="admin-form-group"><label>Image 1 URL</label><div style="display: flex; align-items: center; gap: 0.5rem;"><div class="image-picker-dropdown" style="flex: 1; position: relative;"><input type="text" class="project-image-url" placeholder="images/Projects/..." style="width: 100%;" readonly><button type="button" class="image-picker-toggle" style="position: absolute; right: 0; top: 0; height: 100%; padding: 0 0.75rem; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-left: none; border-radius: 0 8px 8px 0; cursor: pointer; display: flex; align-items: center;"><i class="bi bi-chevron-down"></i></button><div class="image-picker-dropdown-menu" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--admin-bg-secondary); border: 1px solid var(--admin-border); border-radius: 8px; margin-top: 0.25rem; max-height: 400px; overflow-y: auto; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"><div class="image-picker-search" style="padding: 0.75rem; border-bottom: 1px solid var(--admin-border);"><input type="text" class="image-picker-search-input" placeholder="Search images..." style="width: 100%; padding: 0.5rem; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 4px; color: var(--admin-text-primary);"></div><div class="image-picker-list" style="padding: 0.5rem;"></div><div style="padding: 0.75rem; border-top: 1px solid var(--admin-border);"><input type="text" class="image-picker-manual-input" placeholder="Or enter URL manually..." style="width: 100%; padding: 0.5rem; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 4px; color: var(--admin-text-primary);"><button type="button" class="admin-btn admin-btn-primary" style="width: 100%; margin-top: 0.5rem; padding: 0.5rem;">Use Manual URL</button></div></div></div><button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest(\'.project-image-item\').remove()" style="flex-shrink: 0;"><i class="bi bi-trash"></i> Remove</button></div></div><div class="image-preview project-image-preview" style="max-width: 200px; margin-bottom: 1rem;"><div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div></div><input type="file" class="project-image-input" accept="image/*" style="display: none;"><button type="button" class="admin-btn admin-btn-secondary project-image-upload-btn" style="margin-bottom: 1rem;"><i class="bi bi-upload"></i> Upload Image</button></div>'}
                </div>
                <button type="button" class="admin-btn admin-btn-secondary btn-add-item" onclick="addProjectImage(this)" style="margin-top: 1rem;">
                    <i class="bi bi-plus-circle"></i> Add Another Image
                </button>
            </div>
            ${data?.progress ? `
            <div class="admin-form-group">
                <label>Progress Text</label>
                <input type="text" class="project-progress" value="${data.progress}">
            </div>
            ` : ''}
        `;
        
        // Handle image upload buttons
        item.querySelectorAll('.project-image-upload-btn').forEach((uploadBtn) => {
            const imageInput = uploadBtn.previousElementSibling;
            const imagePreview = imageInput.previousElementSibling;
            
            uploadBtn.addEventListener('click', function() {
                imageInput.click();
            });
            
            imageInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%;">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
        
        item.querySelectorAll('.project-image-url').forEach((urlInput) => {
            initImagePicker(urlInput);
            
            urlInput.addEventListener('input', function() {
                const preview = this.closest('.project-image-item').querySelector('.project-image-preview');
                if (this.value.trim()) {
                    const normalizedPath = normalizeImagePath(this.value.trim());
                    preview.innerHTML = `<img src="${normalizedPath}" alt="Preview" style="max-width: 100%;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                } else {
                    preview.innerHTML = '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>';
                }
            });
        });
        
        // Initialize Quill editor for description
        const editorDiv = item.querySelector(`#project-description-editor-${id}`);
        const hiddenInput = item.querySelector('.project-description');
        if (editorDiv && typeof Quill !== 'undefined') {
            const quill = new Quill(editorDiv, {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline'],
                            [{ 'color': [] }],
                            ['link'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['clean']
                        ],
                        handlers: {
                            'link': function(value) {
                                if (value) {
                                    // Check if there's selected text
                                    const selection = this.quill.getSelection(true);
                                    const text = this.quill.getText(selection.index, selection.length);
                                    
                                    let href = prompt('Enter the URL:', '');
                                    if (href) {
                                        // Ensure URL is absolute (has protocol)
                                        if (!href.match(/^https?:\/\//i)) {
                                            href = 'https://' + href;
                                        }
                                        
                                        // If no text is selected, insert the URL as the link text
                                        if (!text || text.trim() === '') {
                                            this.quill.insertText(selection.index, href, 'link', href, 'user');
                                        } else {
                                            // Format the selected text as a link
                                            this.quill.format('link', href);
                                        }
                                    }
                                } else {
                                    this.quill.format('link', false);
                                }
                            },
                            'color': function(value) {
                                // Handle reset (empty value removes color)
                                if (value === '') {
                                    this.quill.format('color', false);
                                } else {
                                    this.quill.format('color', value);
                                }
                            }
                        }
                    }
                },
                placeholder: 'Project description...'
            });
            
            // Force toolbar icons to be white (after Quill initializes)
            setTimeout(() => {
                const toolbar = editorDiv.parentElement.querySelector('.ql-toolbar');
                if (toolbar) {
                    // Force all SVG strokes and fills to be white
                    const allSvgs = toolbar.querySelectorAll('svg');
                    allSvgs.forEach(svg => {
                        svg.style.color = '#ffffff';
                        const strokes = svg.querySelectorAll('.ql-stroke, .ql-stroke-miter, .ql-stroke.ql-thin');
                        strokes.forEach(stroke => {
                            stroke.style.stroke = '#ffffff';
                            stroke.setAttribute('stroke', '#ffffff');
                        });
                        const fills = svg.querySelectorAll('.ql-fill');
                        fills.forEach(fill => {
                            fill.style.fill = '#ffffff';
                            fill.setAttribute('fill', '#ffffff');
                        });
                    });
                    
                    // Force all buttons to have white text/icons
                    const buttons = toolbar.querySelectorAll('button');
                    buttons.forEach(button => {
                        button.style.color = '#ffffff';
                    });
                }
                
                const colorPicker = toolbar ? toolbar.querySelector('.ql-color') : null;
                if (colorPicker) {
                    // Brand colors: primary (#2d2d2d), secondary (#1e3a5f), accent (#2c4a6b)
                    const brandColors = [
                        { label: 'Reset', value: '' },
                        { label: 'Charcoal', value: '#2d2d2d' },
                        { label: 'Dark Blue', value: '#1e3a5f' },
                        { label: 'Accent Blue', value: '#2c4a6b' },
                        { label: 'White', value: '#ffffff' }
                    ];
                    
                    // Function to apply dark theme styles to color picker
                    const applyDarkTheme = () => {
                        const colorPickerOptions = colorPicker.querySelector('.ql-picker-options');
                        if (colorPickerOptions) {
                            // Hide when not expanded
                            if (!colorPicker.classList.contains('ql-expanded')) {
                                colorPickerOptions.style.display = 'none';
                                colorPickerOptions.style.visibility = 'hidden';
                                colorPickerOptions.style.opacity = '0';
                                return;
                            }
                            
                            // Show and style when expanded
                            colorPickerOptions.style.display = 'flex';
                            colorPickerOptions.style.visibility = 'visible';
                            colorPickerOptions.style.opacity = '1';
                            colorPickerOptions.style.backgroundColor = '#1a1f26';
                            colorPickerOptions.style.background = '#1a1f26';
                            colorPickerOptions.style.border = '1px solid #2d3748';
                            colorPickerOptions.style.borderRadius = '8px';
                            colorPickerOptions.style.padding = '0.75rem';
                            colorPickerOptions.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)';
                            
                            // Style all picker items
                            const items = colorPickerOptions.querySelectorAll('.ql-picker-item');
                            items.forEach(item => {
                                if (item.getAttribute('data-value') === '') {
                                    // Reset button styling
                                    item.style.backgroundColor = '#252b33';
                                    item.style.background = '#252b33';
                                    item.style.color = '#f5f5f5';
                                    item.style.border = '2px solid #2d3748';
                                    item.style.width = '100%';
                                    item.style.height = '32px';
                                    item.style.padding = '6px 12px';
                                    item.style.marginBottom = '0.25rem';
                                } else {
                                    // Color swatch styling
                                    item.style.width = '32px';
                                    item.style.height = '32px';
                                    item.style.borderRadius = '6px';
                                    item.style.border = '2px solid #2d3748';
                                    item.style.margin = '0';
                                }
                            });
                        }
                    };
                    
                    // Remove default color options and add brand colors
                    const colorPickerOptions = colorPicker.querySelector('.ql-picker-options');
                    if (colorPickerOptions) {
                        colorPickerOptions.innerHTML = '';
                        brandColors.forEach(color => {
                            const option = document.createElement('span');
                            option.classList.add('ql-picker-item');
                            option.setAttribute('data-value', color.value);
                            if (color.value) {
                                option.style.backgroundColor = color.value;
                            } else {
                                option.textContent = 'Reset';
                            }
                            option.setAttribute('title', color.label);
                            
                            // Add click handler to apply color
                            option.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                // Get current selection
                                let selection = quill.getSelection();
                                if (!selection) {
                                    // If no selection, try to get the last known selection
                                    selection = quill.getSelection(true);
                                }
                                
                                // Apply color
                                if (color.value === '') {
                                    // Reset color
                                    if (selection && selection.length > 0) {
                                        quill.formatText(selection.index, selection.length, 'color', false);
                                    } else {
                                        quill.format('color', false);
                                    }
                                } else {
                                    // Apply color
                                    if (selection && selection.length > 0) {
                                        // Use formatText to apply color to selection
                                        quill.formatText(selection.index, selection.length, 'color', color.value);
                                        // Verify it was applied
                                        setTimeout(() => {
                                            const appliedFormats = quill.getFormat(selection.index, selection.length);
                                            console.log('Applied formats:', appliedFormats);
                                        }, 50);
                                    } else {
                                        quill.format('color', color.value);
                                    }
                                }
                                
                                // Close picker
                                setTimeout(() => {
                                    if (colorPicker.classList.contains('ql-expanded')) {
                                        const pickerLabel = colorPicker.querySelector('.ql-picker-label');
                                        if (pickerLabel) {
                                            pickerLabel.click();
                                        }
                                    }
                                }, 100);
                                
                                return false;
                            });
                            
                            colorPickerOptions.appendChild(option);
                        });
                        
                        // Apply dark theme immediately
                        applyDarkTheme();
                        
                        // Watch for when picker opens and reapply styles
                        const pickerLabel = colorPicker.querySelector('.ql-picker-label');
                        if (pickerLabel) {
                            pickerLabel.addEventListener('click', () => {
                                setTimeout(applyDarkTheme, 50);
                            });
                        }
                        
                        // Use MutationObserver to watch for class changes (when picker opens/closes)
                        const observer = new MutationObserver(() => {
                            setTimeout(applyDarkTheme, 10);
                        });
                        observer.observe(colorPicker, { attributes: true, attributeFilter: ['class'] });
                        
                        // Also watch for clicks outside to close
                        document.addEventListener('click', (e) => {
                            if (!colorPicker.contains(e.target)) {
                                setTimeout(applyDarkTheme, 10);
                            }
                        });
                    }
                }
            }, 100);
            
            // Set initial content from hidden input after Quill is ready
            const initialContent = hiddenInput.value || '';
            console.log('Loading Quill content:', { 
                hasContent: !!initialContent.trim(), 
                contentLength: initialContent.length,
                preview: initialContent.substring(0, 200) 
            });
            
            if (initialContent.trim()) {
                // Fix relative URLs only - don't modify HTML structure
                let fixedContent = initialContent
                    // Fix empty links - if link has no text, use the URL as text
                    .replace(/<a\s+href=["']([^"']+)["']([^>]*)><\/a>/gi, function(match, url, attrs) {
                        return `<a href="${url}"${attrs}>${url}</a>`;
                    })
                    // Fix relative URLs (but preserve everything inside the link tag)
                    .replace(/<a\s+href=["']([^"']+)["']([^>]*)>/gi, function(match, url, attrs) {
                        if (url && !url.match(/^https?:\/\//i) && !url.startsWith('#') && !url.startsWith('/') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
                            return match.replace(url, 'https://' + url);
                        }
                        return match;
                    });
                
                // Wait for Quill to be fully ready, then set content
                // Use a longer delay to ensure Quill is completely initialized
                setTimeout(() => {
                    // Double-check Quill is ready
                    if (!quill || !quill.root) {
                        console.error('Quill not ready');
                        return;
                    }
                    // Clean the HTML before setting it - remove any stray characters
                    // Remove any standalone ">" or ">" that aren't part of HTML tags
                    // REMOVED: This regex was corrupting HTML
                    // REMOVED: This regex was corrupting HTML
                        // REMOVED: This regex was corrupting HTML by removing ">" from tags like <strong>
                    // REMOVED: This regex was corrupting HTML
                        // REMOVED: This regex was corrupting HTML
                    
                    // Set content directly - use innerHTML which is most reliable
                    console.log('Setting Quill content:', { 
                        fixedContentLength: fixedContent.length,
                        preview: fixedContent.substring(0, 200) 
                    });
                    quill.root.innerHTML = fixedContent;
                    
                    // Immediately check if it was set
                    const immediateCheck = quill.root.innerHTML;
                    console.log('Immediate check after setting:', { 
                        hasContent: !!immediateCheck.trim(),
                        contentLength: immediateCheck.length 
                    });
                    
                    // Verify and ensure content persists after Quill processes it
                    setTimeout(() => {
                        const currentHTML = quill.root.innerHTML;
                        const currentText = quill.root.textContent;
                        
                        console.log('Delayed check:', { 
                            hasHTML: !!currentHTML.trim(),
                            hasText: !!currentText.trim(),
                            htmlLength: currentHTML.length,
                            textLength: currentText.length
                        });
                        
                        // If content disappeared, set it again
                        if ((!currentText.trim() || !currentHTML.trim()) && fixedContent.trim()) {
                            console.warn('Content missing, restoring...');
                            quill.root.innerHTML = fixedContent;
                        }
                        
                        // Update hidden input with current content
                        hiddenInput.value = quill.root.innerHTML;
                    }, 200);
                    
                    // Clean up ONLY stray text nodes that are clearly artifacts (not part of content)
                    // Be very careful not to remove valid content
                    setTimeout(() => {
                        const walker = document.createTreeWalker(
                            quill.root,
                            NodeFilter.SHOW_TEXT,
                            null
                        );
                        const nodesToRemove = [];
                        let node;
                        while (node = walker.nextNode()) {
                            const text = node.textContent.trim();
                            // Only remove text nodes that are ONLY ">", "">", or " with no other content
                            // Don't remove if there's any other text
                            if (text === '">' || text === '>' || text === '"') {
                                nodesToRemove.push(node);
                            }
                        }
                        nodesToRemove.forEach(n => n.remove());
                    }, 50);
                    
                    // Check if links lost their text content and fix them
                    setTimeout(() => {
                        const links = quill.root.querySelectorAll('a[href]');
                        links.forEach(link => {
                            // If link has no text content, try to restore it from the original HTML
                            if (!link.textContent.trim() && !link.innerHTML.trim()) {
                                const href = link.getAttribute('href');
                                // Try to extract the full link HTML from original content (including nested tags)
                                const linkRegex = new RegExp(`<a[^>]*href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>(.*?)</a>`, 'is');
                                const originalLinkMatch = initialContent.match(linkRegex);
                                if (originalLinkMatch && originalLinkMatch[1]) {
                                    // Restore the inner HTML (including nested formatting like <strong>)
                                    link.innerHTML = originalLinkMatch[1];
                                } else {
                                    // Fallback: use the URL as text
                                    link.textContent = href;
                                }
                            }
                        });
                        
                        // Final cleanup pass - remove any remaining stray characters
                        const finalWalker = document.createTreeWalker(
                            quill.root,
                            NodeFilter.SHOW_TEXT,
                            null
                        );
                        const finalNodesToRemove = [];
                        let finalNode;
                        while (finalNode = finalWalker.nextNode()) {
                            const text = finalNode.textContent.trim();
                            if (text === '">' || text === '>' || /^[>"]+$/.test(text)) {
                                finalNodesToRemove.push(finalNode);
                            }
                        }
                        finalNodesToRemove.forEach(n => n.remove());
                        
                        // One more pass to ensure no ">" characters remain as separate text nodes
                        // Check both direct children and nested nodes
                        const allTextNodes = [];
                        const nodeWalker = document.createTreeWalker(
                            quill.root,
                            NodeFilter.SHOW_TEXT,
                            null
                        );
                        let textNode;
                        while (textNode = nodeWalker.nextNode()) {
                            if (textNode.textContent.trim() === '">' || textNode.textContent.trim() === '>' || textNode.textContent.trim() === '"') {
                                allTextNodes.push(textNode);
                            }
                        }
                        allTextNodes.forEach(n => n.remove());
                        
                        // Also check direct children
                        Array.from(quill.root.childNodes).forEach(child => {
                            if (child.nodeType === Node.TEXT_NODE && (child.textContent.trim() === '">' || child.textContent.trim() === '>')) {
                                child.remove();
                            }
                        });
                        
                        // Final check - ensure no content leaked outside the editor
                        // Remove any text nodes that are siblings of the editor (shouldn't happen, but just in case)
                        const editorParent = editorDiv.parentElement;
                        if (editorParent) {
                            Array.from(editorParent.childNodes).forEach(child => {
                                if (child !== editorDiv && child.nodeType === Node.TEXT_NODE) {
                                    const text = child.textContent.trim();
                                    if (text === 'Test' || text === '">' || text === '>') {
                                        child.remove();
                                    }
                                }
                            });
                        }
                        
                        // Final check - remove any content that leaked outside the editor div
                        const adminFormGroup = editorDiv.closest('.admin-form-group');
                        if (adminFormGroup) {
                            // Remove any text nodes or elements that are siblings of the editor
                            Array.from(adminFormGroup.childNodes).forEach(child => {
                                if (child !== editorDiv && child !== hiddenInput && child.nodeName !== 'LABEL' && child.nodeName !== 'SMALL') {
                                    if (child.nodeType === Node.TEXT_NODE) {
                                        const text = child.textContent.trim();
                                        if (text === 'Test' || text === '">' || text === '>') {
                                            child.remove();
                                        }
                                    } else if (child.nodeType === Node.ELEMENT_NODE && child.textContent.trim() === 'Test') {
                                        child.remove();
                                    }
                                }
                            });
                        }
                        
                        // Update hidden input with the fixed HTML
                        hiddenInput.value = quill.root.innerHTML;
                    }, 150);
                }, 200);
            }
            
            // Update hidden input when content changes
            quill.on('text-change', function() {
                let html = quill.root.innerHTML;
                // Fix empty links - ensure all links have text content
                html = html.replace(/<a\s+href=["']([^"']+)["']([^>]*)><\/a>/gi, function(match, url, attrs) {
                    return `<a href="${url}"${attrs}>${url}</a>`;
                });
                // Fix any relative URLs before saving
                html = html.replace(/<a\s+href=["']([^"']+)["']/gi, function(match, url) {
                    // If URL doesn't start with http:// or https://, add https://
                    if (url && !url.match(/^https?:\/\//i) && !url.startsWith('#') && !url.startsWith('/') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
                        return match.replace(url, 'https://' + url);
                    }
                    return match;
                });
                hiddenInput.value = html;
            });
            
            // Store Quill instance on the item for later access
            item._quillInstance = quill;
        }
        
        // Initialize Quill editors for section content
        item.querySelectorAll('.section-content-editor').forEach((editorDiv) => {
            const sectionItem = editorDiv.closest('.project-section-item');
            const hiddenInput = sectionItem.querySelector('.section-content');
            if (editorDiv && hiddenInput && typeof Quill !== 'undefined') {
                const quill = new Quill(editorDiv, {
                    theme: 'snow',
                    modules: {
                        toolbar: {
                            container: [
                                ['bold', 'italic', 'underline'],
                                [{ 'color': [] }],
                                ['link'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['clean']
                            ],
                            handlers: {
                                'link': function(value) {
                                    if (value) {
                                        const selection = this.quill.getSelection(true);
                                        const text = this.quill.getText(selection.index, selection.length);
                                        let href = prompt('Enter the URL:', '');
                                        if (href) {
                                            if (!href.match(/^https?:\/\//i)) {
                                                href = 'https://' + href;
                                            }
                                            if (!text || text.trim() === '') {
                                                this.quill.insertText(selection.index, href, 'link', href, 'user');
                                            } else {
                                                this.quill.format('link', href);
                                            }
                                        }
                                    } else {
                                        this.quill.format('link', false);
                                    }
                                },
                                'color': function(value) {
                                    const selection = this.quill.getSelection();
                                    if (selection && selection.length > 0) {
                                        this.quill.formatText(selection.index, selection.length, 'color', value === '' ? false : value);
                                    } else {
                                        this.quill.format('color', value === '' ? false : value);
                                    }
                                    setTimeout(() => {
                                        const colorPicker = this.quill.getModule('toolbar').container.querySelector('.ql-color');
                                        if (colorPicker && colorPicker.classList.contains('ql-expanded')) {
                                            const pickerLabel = colorPicker.querySelector('.ql-picker-label');
                                            if (pickerLabel) {
                                                pickerLabel.click();
                                            }
                                        }
                                    }, 100);
                                }
                            }
                        }
                    },
                    placeholder: 'Section content...'
                });
                
                // Force toolbar icons to be white
                setTimeout(() => {
                    const toolbar = editorDiv.parentElement.querySelector('.ql-toolbar');
                    if (toolbar) {
                        const allSvgs = toolbar.querySelectorAll('svg');
                        allSvgs.forEach(svg => {
                            svg.style.color = '#ffffff';
                            const strokes = svg.querySelectorAll('.ql-stroke, .ql-stroke-miter, .ql-stroke.ql-thin');
                            strokes.forEach(stroke => {
                                stroke.style.stroke = '#ffffff';
                                stroke.setAttribute('stroke', '#ffffff');
                            });
                            const fills = svg.querySelectorAll('.ql-fill');
                            fills.forEach(fill => {
                                fill.style.fill = '#ffffff';
                                fill.setAttribute('fill', '#ffffff');
                            });
                        });
                        const buttons = toolbar.querySelectorAll('button');
                        buttons.forEach(button => {
                            button.style.color = '#ffffff';
                        });
                    }
                    
                    // Customize color picker
                    const colorPicker = toolbar ? toolbar.querySelector('.ql-color') : null;
                    if (colorPicker) {
                        const brandColors = [
                            { label: 'Reset', value: '' },
                            { label: 'Charcoal', value: '#2d2d2d' },
                            { label: 'Dark Blue', value: '#1e3a5f' },
                            { label: 'Accent Blue', value: '#2c4a6b' },
                            { label: 'White', value: '#ffffff' }
                        ];
                        
                        const applyDarkTheme = () => {
                            const colorPickerOptions = colorPicker.querySelector('.ql-picker-options');
                            if (colorPickerOptions) {
                                if (!colorPicker.classList.contains('ql-expanded')) {
                                    colorPickerOptions.style.display = 'none';
                                    colorPickerOptions.style.visibility = 'hidden';
                                    colorPickerOptions.style.opacity = '0';
                                    return;
                                }
                                colorPickerOptions.style.display = 'flex';
                                colorPickerOptions.style.visibility = 'visible';
                                colorPickerOptions.style.opacity = '1';
                                colorPickerOptions.style.backgroundColor = '#1a1f26';
                                colorPickerOptions.style.background = '#1a1f26';
                                colorPickerOptions.style.border = '1px solid #2d3748';
                                colorPickerOptions.style.borderRadius = '8px';
                                colorPickerOptions.style.padding = '0.75rem';
                                colorPickerOptions.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)';
                                
                                const items = colorPickerOptions.querySelectorAll('.ql-picker-item');
                                items.forEach(item => {
                                    if (item.getAttribute('data-value') === '') {
                                        item.style.backgroundColor = '#252b33';
                                        item.style.background = '#252b33';
                                        item.style.color = '#f5f5f5';
                                        item.style.border = '2px solid #2d3748';
                                        item.style.width = '100%';
                                        item.style.height = '32px';
                                        item.style.padding = '6px 12px';
                                        item.style.marginBottom = '0.25rem';
                                    } else {
                                        item.style.width = '32px';
                                        item.style.height = '32px';
                                        item.style.borderRadius = '6px';
                                        item.style.border = '2px solid #2d3748';
                                        item.style.margin = '0';
                                    }
                                });
                            }
                        };
                        
                        const colorPickerOptions = colorPicker.querySelector('.ql-picker-options');
                        if (colorPickerOptions) {
                            colorPickerOptions.innerHTML = '';
                            brandColors.forEach(color => {
                                const option = document.createElement('span');
                                option.classList.add('ql-picker-item');
                                option.setAttribute('data-value', color.value);
                                if (color.value) {
                                    option.style.backgroundColor = color.value;
                                } else {
                                    option.textContent = 'Reset';
                                }
                                option.setAttribute('title', color.label);
                                
                                option.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    let selection = quill.getSelection();
                                    if (!selection) {
                                        selection = quill.getSelection(true);
                                    }
                                    if (color.value === '') {
                                        if (selection && selection.length > 0) {
                                            quill.formatText(selection.index, selection.length, 'color', false);
                                        } else {
                                            quill.format('color', false);
                                        }
                                    } else {
                                        if (selection && selection.length > 0) {
                                            quill.formatText(selection.index, selection.length, 'color', color.value);
                                        } else {
                                            quill.format('color', color.value);
                                        }
                                    }
                                    setTimeout(() => {
                                        if (colorPicker.classList.contains('ql-expanded')) {
                                            const pickerLabel = colorPicker.querySelector('.ql-picker-label');
                                            if (pickerLabel) {
                                                pickerLabel.click();
                                            }
                                        }
                                    }, 100);
                                    return false;
                                });
                                
                                colorPickerOptions.appendChild(option);
                            });
                            
                            applyDarkTheme();
                            const pickerLabel = colorPicker.querySelector('.ql-picker-label');
                            if (pickerLabel) {
                                pickerLabel.addEventListener('click', () => {
                                    setTimeout(applyDarkTheme, 50);
                                });
                            }
                            const observer = new MutationObserver(() => {
                                setTimeout(applyDarkTheme, 10);
                            });
                            observer.observe(colorPicker, { attributes: true, attributeFilter: ['class'] });
                            document.addEventListener('click', (e) => {
                                if (!colorPicker.contains(e.target)) {
                                    setTimeout(applyDarkTheme, 10);
                                }
                            });
                        }
                    }
                }, 100);
                
                // Load initial content
                const initialContent = hiddenInput.value || '';
                if (initialContent.trim()) {
                    let fixedContent = initialContent
                        .replace(/<a\s+href=["']([^"']+)["']([^>]*)><\/a>/gi, function(match, url, attrs) {
                            return `<a href="${url}"${attrs}>${url}</a>`;
                        })
                        .replace(/<a\s+href=["']([^"']+)["']([^>]*)>/gi, function(match, url, attrs) {
                            if (url && !url.match(/^https?:\/\//i) && !url.startsWith('#') && !url.startsWith('/') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
                                return match.replace(url, 'https://' + url);
                            }
                            return match;
                        });
                    
                    setTimeout(() => {
                        if (quill && quill.root) {
                            quill.root.innerHTML = fixedContent;
                            hiddenInput.value = quill.root.innerHTML;
                        }
                    }, 200);
                }
                
                // Update hidden input when content changes
                quill.on('text-change', function() {
                    let html = quill.root.innerHTML;
                    html = html.replace(/<a\s+href=["']([^"']+)["']([^>]*)><\/a>/gi, function(match, url, attrs) {
                        return `<a href="${url}"${attrs}>${url}</a>`;
                    });
                    html = html.replace(/<a\s+href=["']([^"']+)["']/gi, function(match, url) {
                        if (url && !url.match(/^https?:\/\//i) && !url.startsWith('#') && !url.startsWith('/') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
                            return match.replace(url, 'https://' + url);
                        }
                        return match;
                    });
                    hiddenInput.value = html;
                });
                
                // Store Quill instance on the section item
                sectionItem._quillInstance = quill;
            }
        });
        
        // Initialize icon pickers for section items
        item.querySelectorAll('.section-icon').forEach((iconInput) => {
            const sectionItem = iconInput.closest('.project-section-item');
            const iconDisplayBtn = sectionItem.querySelector('.icon-display-btn');
            
            // Update icon display button
            function updateIconDisplay() {
                if (iconDisplayBtn) {
                    const iconClass = iconInput.value.trim() || 'bi-diagram-3-fill';
                    const iconElement = iconDisplayBtn.querySelector('i');
                    if (iconElement) {
                        iconElement.className = `bi ${iconClass}`;
                    }
                }
            }
            
            // Set initial icon display
            updateIconDisplay();
            
            // Make icon display button clickable to open picker
            if (iconDisplayBtn) {
                iconDisplayBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.openIconPicker && iconInput) {
                        window.openIconPicker(iconInput);
                    }
                });
            }
            
            // Update icon display when icon changes
            iconInput.addEventListener('input', updateIconDisplay);
            iconInput.addEventListener('change', updateIconDisplay);
        });
        
        // Initialize icon pickers for feature items
        item.querySelectorAll('.project-feature-icon').forEach((iconInput) => {
            const featureItem = iconInput.closest('.project-feature-item');
            const iconDisplayBtn = featureItem.querySelector('.icon-display-btn');
            
            // Update icon display button
            function updateIconDisplay() {
                if (iconDisplayBtn) {
                    const iconClass = iconInput.value.trim() || 'bi-tag';
                    const iconElement = iconDisplayBtn.querySelector('i');
                    if (iconElement) {
                        iconElement.className = `bi ${iconClass}`;
                    }
                }
            }
            
            // Set initial icon display
            updateIconDisplay();
            
            // Make icon display button clickable to open picker
            if (iconDisplayBtn) {
                iconDisplayBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.openIconPicker && iconInput) {
                        window.openIconPicker(iconInput);
                    }
                });
            }
            
            // Update icon display when icon changes
            iconInput.addEventListener('input', updateIconDisplay);
            iconInput.addEventListener('change', updateIconDisplay);
        });
        
        // Initialize icon pickers for meta items
        item.querySelectorAll('.project-meta-icon').forEach((iconInput) => {
            const metaItem = iconInput.closest('.project-meta-item');
            const iconDisplayBtn = metaItem.querySelector('.icon-display-btn');
            
            // Update icon display button
            function updateIconDisplay() {
                if (iconDisplayBtn) {
                    const iconClass = iconInput.value.trim() || 'bi-geo-alt-fill';
                    const iconElement = iconDisplayBtn.querySelector('i');
                    if (iconElement) {
                        iconElement.className = `bi ${iconClass}`;
                    }
                }
            }
            
            // Set initial icon display
            updateIconDisplay();
            
            // Make icon display button clickable to open picker
            if (iconDisplayBtn) {
                iconDisplayBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.openIconPicker && iconInput) {
                        window.openIconPicker(iconInput);
                    }
                });
            }
            
            // Update icon display when icon changes
            iconInput.addEventListener('input', updateIconDisplay);
            iconInput.addEventListener('change', updateIconDisplay);
        });
        
        container.appendChild(item);
    };
    
    // Helper functions for adding items
    window.addProjectMeta = function(button) {
        const container = button.previousElementSibling;
        const newItem = document.createElement('div');
        newItem.className = 'project-meta-item';
        newItem.setAttribute('style', 'display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;');
        newItem.innerHTML = `
            <input type="text" class="project-meta-icon" placeholder="bi-geo-alt" style="display: none;">
            <button type="button" class="icon-display-btn" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 8px; cursor: pointer; padding: 0; flex-shrink: 0;">
                <i class="bi bi-geo-alt-fill" style="font-size: 1.5rem; color: var(--admin-text-primary);"></i>
            </button>
            <input type="text" class="project-meta-text" placeholder="Meta item" style="flex: 1;">
            <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-meta-item').remove()" style="flex-shrink: 0;">
                <i class="bi bi-trash"></i>
            </button>
        `;
        container.appendChild(newItem);
        
        // Initialize icon picker for the new item
        const iconInput = newItem.querySelector('.project-meta-icon');
        if (iconInput) {
            const iconDisplayBtn = newItem.querySelector('.icon-display-btn');
            
            // Update icon display button
            function updateIconDisplay() {
                if (iconDisplayBtn) {
                    const iconClass = iconInput.value.trim() || 'bi-geo-alt-fill';
                    const iconElement = iconDisplayBtn.querySelector('i');
                    if (iconElement) {
                        iconElement.className = `bi ${iconClass}`;
                    }
                }
            }
            
            // Set initial icon display
            updateIconDisplay();
            
            // Make icon display button clickable to open picker
            if (iconDisplayBtn) {
                iconDisplayBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.openIconPicker && iconInput) {
                        window.openIconPicker(iconInput);
                    }
                });
            }
            
            // Update icon display when icon changes
            iconInput.addEventListener('input', updateIconDisplay);
            iconInput.addEventListener('change', updateIconDisplay);
        }
    };
    
    window.addProjectSection = function(button) {
        const container = button.previousElementSibling;
        const newItem = document.createElement('div');
        newItem.className = 'project-section-item';
        newItem.innerHTML = `
            <div class="admin-form-group">
                <label>Section Title</label>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="text" class="section-icon" value="bi-diagram-3-fill" placeholder="bi-diagram-3-fill" style="display: none;">
                    <button type="button" class="icon-display-btn" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 8px; cursor: pointer; padding: 0; flex-shrink: 0;">
                        <i class="bi bi-diagram-3-fill" style="font-size: 1.5rem; color: var(--admin-text-primary);"></i>
                    </button>
                    <input type="text" class="section-title" placeholder="Section Title" style="flex: 1;">
                </div>
            </div>
            <div class="admin-form-group">
                <label>Section Content</label>
                <div class="section-content-editor" id="section-content-editor-new-${Date.now()}"></div>
                <input type="hidden" class="section-content" value="">
                <small>Use the toolbar to format text, make it bold, and insert links</small>
            </div>
            <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-section-item').remove()">
                <i class="bi bi-trash"></i> Remove Section
            </button>
        `;
        container.appendChild(newItem);
        
        // Initialize icon picker for the new section
        const iconInput = newItem.querySelector('.section-icon');
        if (iconInput) {
            const iconDisplayBtn = newItem.querySelector('.icon-display-btn');
            
            // Update icon display button
            function updateIconDisplay() {
                if (iconDisplayBtn) {
                    const iconClass = iconInput.value.trim() || 'bi-diagram-3-fill';
                    const iconElement = iconDisplayBtn.querySelector('i');
                    if (iconElement) {
                        iconElement.className = `bi ${iconClass}`;
                    }
                }
            }
            
            // Set initial icon display
            updateIconDisplay();
            
            // Make icon display button clickable to open picker
            if (iconDisplayBtn) {
                iconDisplayBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.openIconPicker && iconInput) {
                        window.openIconPicker(iconInput);
                    }
                });
            }
            
            // Update icon display when icon changes
            iconInput.addEventListener('input', updateIconDisplay);
            iconInput.addEventListener('change', updateIconDisplay);
        }
        
        // Initialize Quill editor for the new section content
        const editorDiv = newItem.querySelector('.section-content-editor');
        const hiddenInput = newItem.querySelector('.section-content');
        if (editorDiv && hiddenInput && typeof Quill !== 'undefined') {
            const quill = new Quill(editorDiv, {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline'],
                            [{ 'color': [] }],
                            ['link'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['clean']
                        ],
                        handlers: {
                            'link': function(value) {
                                if (value) {
                                    const selection = this.quill.getSelection(true);
                                    const text = this.quill.getText(selection.index, selection.length);
                                    let href = prompt('Enter the URL:', '');
                                    if (href) {
                                        if (!href.match(/^https?:\/\//i)) {
                                            href = 'https://' + href;
                                        }
                                        if (!text || text.trim() === '') {
                                            this.quill.insertText(selection.index, href, 'link', href, 'user');
                                        } else {
                                            this.quill.format('link', href);
                                        }
                                    }
                                } else {
                                    this.quill.format('link', false);
                                }
                            },
                            'color': function(value) {
                                const selection = this.quill.getSelection();
                                if (selection && selection.length > 0) {
                                    this.quill.formatText(selection.index, selection.length, 'color', value === '' ? false : value);
                                } else {
                                    this.quill.format('color', value === '' ? false : value);
                                }
                                setTimeout(() => {
                                    const colorPicker = this.quill.getModule('toolbar').container.querySelector('.ql-color');
                                    if (colorPicker && colorPicker.classList.contains('ql-expanded')) {
                                        const pickerLabel = colorPicker.querySelector('.ql-picker-label');
                                        if (pickerLabel) {
                                            pickerLabel.click();
                                        }
                                    }
                                }, 100);
                            }
                        }
                    }
                },
                placeholder: 'Section content...'
            });
            
            // Force toolbar icons to be white
            setTimeout(() => {
                const toolbar = editorDiv.parentElement.querySelector('.ql-toolbar');
                if (toolbar) {
                    const allSvgs = toolbar.querySelectorAll('svg');
                    allSvgs.forEach(svg => {
                        svg.style.color = '#ffffff';
                        const strokes = svg.querySelectorAll('.ql-stroke, .ql-stroke-miter, .ql-stroke.ql-thin');
                        strokes.forEach(stroke => {
                            stroke.style.stroke = '#ffffff';
                            stroke.setAttribute('stroke', '#ffffff');
                        });
                        const fills = svg.querySelectorAll('.ql-fill');
                        fills.forEach(fill => {
                            fill.style.fill = '#ffffff';
                            fill.setAttribute('fill', '#ffffff');
                        });
                    });
                    const buttons = toolbar.querySelectorAll('button');
                    buttons.forEach(button => {
                        button.style.color = '#ffffff';
                    });
                }
                
                // Customize color picker
                const colorPicker = toolbar ? toolbar.querySelector('.ql-color') : null;
                if (colorPicker) {
                    const brandColors = [
                        { label: 'Reset', value: '' },
                        { label: 'Charcoal', value: '#2d2d2d' },
                        { label: 'Dark Blue', value: '#1e3a5f' },
                        { label: 'Accent Blue', value: '#2c4a6b' },
                        { label: 'White', value: '#ffffff' }
                    ];
                    
                    const applyDarkTheme = () => {
                        const colorPickerOptions = colorPicker.querySelector('.ql-picker-options');
                        if (colorPickerOptions) {
                            if (!colorPicker.classList.contains('ql-expanded')) {
                                colorPickerOptions.style.display = 'none';
                                colorPickerOptions.style.visibility = 'hidden';
                                colorPickerOptions.style.opacity = '0';
                                return;
                            }
                            colorPickerOptions.style.display = 'flex';
                            colorPickerOptions.style.visibility = 'visible';
                            colorPickerOptions.style.opacity = '1';
                            colorPickerOptions.style.backgroundColor = '#1a1f26';
                            colorPickerOptions.style.background = '#1a1f26';
                            colorPickerOptions.style.border = '1px solid #2d3748';
                            colorPickerOptions.style.borderRadius = '8px';
                            colorPickerOptions.style.padding = '0.75rem';
                            colorPickerOptions.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)';
                            
                            const items = colorPickerOptions.querySelectorAll('.ql-picker-item');
                            items.forEach(item => {
                                if (item.getAttribute('data-value') === '') {
                                    item.style.backgroundColor = '#252b33';
                                    item.style.background = '#252b33';
                                    item.style.color = '#f5f5f5';
                                    item.style.border = '2px solid #2d3748';
                                    item.style.width = '100%';
                                    item.style.height = '32px';
                                    item.style.padding = '6px 12px';
                                    item.style.marginBottom = '0.25rem';
                                } else {
                                    item.style.width = '32px';
                                    item.style.height = '32px';
                                    item.style.borderRadius = '6px';
                                    item.style.border = '2px solid #2d3748';
                                    item.style.margin = '0';
                                }
                            });
                        }
                    };
                    
                    const colorPickerOptions = colorPicker.querySelector('.ql-picker-options');
                    if (colorPickerOptions) {
                        colorPickerOptions.innerHTML = '';
                        brandColors.forEach(color => {
                            const option = document.createElement('span');
                            option.classList.add('ql-picker-item');
                            option.setAttribute('data-value', color.value);
                            if (color.value) {
                                option.style.backgroundColor = color.value;
                            } else {
                                option.textContent = 'Reset';
                            }
                            option.setAttribute('title', color.label);
                            
                            option.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                let selection = quill.getSelection();
                                if (!selection) {
                                    selection = quill.getSelection(true);
                                }
                                if (color.value === '') {
                                    if (selection && selection.length > 0) {
                                        quill.formatText(selection.index, selection.length, 'color', false);
                                    } else {
                                        quill.format('color', false);
                                    }
                                } else {
                                    if (selection && selection.length > 0) {
                                        quill.formatText(selection.index, selection.length, 'color', color.value);
                                    } else {
                                        quill.format('color', color.value);
                                    }
                                }
                                setTimeout(() => {
                                    if (colorPicker.classList.contains('ql-expanded')) {
                                        const pickerLabel = colorPicker.querySelector('.ql-picker-label');
                                        if (pickerLabel) {
                                            pickerLabel.click();
                                        }
                                    }
                                }, 100);
                                return false;
                            });
                            
                            colorPickerOptions.appendChild(option);
                        });
                        
                        applyDarkTheme();
                        const pickerLabel = colorPicker.querySelector('.ql-picker-label');
                        if (pickerLabel) {
                            pickerLabel.addEventListener('click', () => {
                                setTimeout(applyDarkTheme, 50);
                            });
                        }
                        const observer = new MutationObserver(() => {
                            setTimeout(applyDarkTheme, 10);
                        });
                        observer.observe(colorPicker, { attributes: true, attributeFilter: ['class'] });
                        document.addEventListener('click', (e) => {
                            if (!colorPicker.contains(e.target)) {
                                setTimeout(applyDarkTheme, 10);
                            }
                        });
                    }
                }
            }, 100);
            
            // Update hidden input when content changes
            quill.on('text-change', function() {
                let html = quill.root.innerHTML;
                html = html.replace(/<a\s+href=["']([^"']+)["']([^>]*)><\/a>/gi, function(match, url, attrs) {
                    return `<a href="${url}"${attrs}>${url}</a>`;
                });
                html = html.replace(/<a\s+href=["']([^"']+)["']/gi, function(match, url) {
                    if (url && !url.match(/^https?:\/\//i) && !url.startsWith('#') && !url.startsWith('/') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
                        return match.replace(url, 'https://' + url);
                    }
                    return match;
                });
                hiddenInput.value = html;
            });
            
            // Store Quill instance on the section item
            newItem._quillInstance = quill;
        }
    };
    
    window.addProjectFeature = function(button) {
        const container = button.previousElementSibling;
        const newItem = document.createElement('div');
        newItem.className = 'project-feature-item';
        newItem.setAttribute('style', 'display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;');
        newItem.innerHTML = `
            <input type="text" class="project-feature-icon" placeholder="bi-geo-alt" style="display: none;">
            <button type="button" class="icon-display-btn" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: var(--admin-bg-tertiary); border: 1px solid var(--admin-border); border-radius: 8px; cursor: pointer; padding: 0; flex-shrink: 0;">
                <i class="bi bi-tag" style="font-size: 1.5rem; color: var(--admin-text-primary);"></i>
            </button>
            <input type="text" class="project-feature-text" placeholder="Feature tag" style="flex: 1;">
            <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-feature-item').remove()" style="flex-shrink: 0;">
                <i class="bi bi-trash"></i>
            </button>
        `;
        container.appendChild(newItem);
        
        // Initialize icon picker for the new item
        const iconInput = newItem.querySelector('.project-feature-icon');
        if (iconInput) {
            const iconDisplayBtn = newItem.querySelector('.icon-display-btn');
            
            // Update icon display button
            function updateIconDisplay() {
                if (iconDisplayBtn) {
                    const iconClass = iconInput.value.trim() || 'bi-tag';
                    const iconElement = iconDisplayBtn.querySelector('i');
                    if (iconElement) {
                        iconElement.className = `bi ${iconClass}`;
                    }
                }
            }
            
            // Set initial icon display
            updateIconDisplay();
            
            // Make icon display button clickable to open picker
            if (iconDisplayBtn) {
                iconDisplayBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.openIconPicker && iconInput) {
                        window.openIconPicker(iconInput);
                    }
                });
            }
            
            // Update icon display when icon changes
            iconInput.addEventListener('input', updateIconDisplay);
            iconInput.addEventListener('change', updateIconDisplay);
        }
    };
    
    window.addProjectImage = function(button) {
        const container = button.previousElementSibling;
        const newIndex = container.querySelectorAll('.project-image-item').length;
        const newItem = document.createElement('div');
        newItem.className = 'project-image-item';
        newItem.innerHTML = `
            <div class="admin-form-group">
                <label>Image ${newIndex + 1} URL</label>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="text" class="project-image-url" placeholder="images/Projects/..." style="flex: 1;">
                    <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-image-item').remove()" style="flex-shrink: 0;">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            </div>
            <div class="image-preview project-image-preview" style="max-width: 200px; margin-bottom: 1rem;">
                <div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>
            </div>
            <input type="file" class="project-image-input" accept="image/*" style="display: none;">
            <button type="button" class="admin-btn admin-btn-secondary project-image-upload-btn" style="margin-bottom: 1rem;">
                <i class="bi bi-upload"></i> Upload Image
            </button>
        `;
        
        const imageInput = newItem.querySelector('.project-image-input');
        const imagePreview = newItem.querySelector('.project-image-preview');
        const uploadBtn = newItem.querySelector('.project-image-upload-btn');
        
        uploadBtn.addEventListener('click', function() {
            imageInput.click();
        });
        
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%;">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        const urlInput = newItem.querySelector('.project-image-url');
        initImagePicker(urlInput);
        
        urlInput.addEventListener('input', function() {
            if (this.value.trim()) {
                const normalizedPath = normalizeImagePath(this.value.trim());
                imagePreview.innerHTML = `<img src="${normalizedPath}" alt="Preview" style="max-width: 100%;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            } else {
                imagePreview.innerHTML = '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>';
            }
        });
        
        container.appendChild(newItem);
        
        // Add folder selector after item is added
        const tempContainer = document.createElement('div');
        tempContainer.className = 'image-upload-container';
        tempContainer.id = `project-folder-${Date.now()}-${newIndex}`;
        if (window.createFolderSelector) {
            const folderSelector = window.createFolderSelector(tempContainer.id, 'images/projects', function(selectedFolder) {
                if (folderSelector) {
                    folderSelector.dataset.selectedFolder = selectedFolder;
                }
            });
            if (folderSelector) {
                newItem.appendChild(folderSelector);
            }
        }
    };
    
    // Form submission
    document.getElementById('projectsPageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            showLoading();
            
            // Collect page hero
            const heroImageUrl = document.getElementById('projects_hero_image_url')?.value.trim();
            const heroImage = document.getElementById('projects_hero_image').files[0];
            let finalHeroImageUrl = pageData.pageHero?.image || '';
            if (heroImageUrl) {
                finalHeroImageUrl = heroImageUrl;
            } else if (heroImage) {
                finalHeroImageUrl = await handleImageUpload('projects_hero_image', 'projects_hero_image_preview', 'images/projects', null);
            }
            
            pageData.pageHero = {
                title: document.getElementById('projects_hero_title').value,
                subtitle: document.getElementById('projects_hero_subtitle').value,
                image: finalHeroImageUrl
            };
            
            // Collect projects
            const projects = [];
            for (const item of document.querySelectorAll('#projects_container .repeatable-item')) {
                const project = {};
                
                // Basic info
                project.name = item.querySelector('.project-name').value || '';
                project.featured = item.querySelector('.project-featured')?.checked || false;
                
                // Description - get HTML from Quill editor or hidden input
                let descriptionHTML = '';
                if (item._quillInstance) {
                    descriptionHTML = item._quillInstance.root.innerHTML;
                } else {
                    descriptionHTML = item.querySelector('.project-description').value || '';
                }
                // Store as HTML string (can be converted to array if needed for backward compatibility)
                project.description = descriptionHTML;
                
                // Meta items - now supports icon and text
                const metaItemElements = item.querySelectorAll('.project-meta-item');
                project.meta = [];
                metaItemElements.forEach(metaItem => {
                    const icon = metaItem.querySelector('.project-meta-icon')?.value.trim() || '';
                    const text = metaItem.querySelector('.project-meta-text')?.value.trim() || '';
                    if (text) {
                        project.meta.push({ icon: icon, text: text });
                    }
                });
                
                // Sections - now supports icon and HTML content
                const sectionItems = item.querySelectorAll('.project-section-item');
                project.sections = [];
                sectionItems.forEach(sectionItem => {
                    const icon = sectionItem.querySelector('.section-icon')?.value.trim() || 'bi-diagram-3-fill';
                    const title = sectionItem.querySelector('.section-title')?.value || '';
                    // Get HTML from Quill editor if available, otherwise from hidden input
                    let content = '';
                    if (sectionItem._quillInstance) {
                        content = sectionItem._quillInstance.root.innerHTML;
                    } else {
                        content = sectionItem.querySelector('.section-content')?.value || '';
                    }
                    if (title || content) {
                        project.sections.push({
                            icon: icon,
                            title: title,
                            content: content // Store as HTML string instead of array
                        });
                    }
                });
                
                // Features - now supports icon and text
                const featureItemElements = item.querySelectorAll('.project-feature-item');
                project.features = [];
                featureItemElements.forEach(featureItem => {
                    const icon = featureItem.querySelector('.project-feature-icon')?.value.trim() || '';
                    const text = featureItem.querySelector('.project-feature-text')?.value.trim() || '';
                    if (text) {
                        project.features.push({ icon: icon, text: text });
                    }
                });
                
                // Images - collect from URL inputs and file uploads
                const imageItems = item.querySelectorAll('.project-image-item');
                project.images = [];
                for (const imageItem of imageItems) {
                    const urlInput = imageItem.querySelector('.project-image-url');
                    const imageInput = imageItem.querySelector('.project-image-input');
                    let imageUrl = '';
                    
                    // Prioritize URL input
                    if (urlInput && urlInput.value.trim()) {
                        imageUrl = urlInput.value.trim();
                    } else if (imageInput && imageInput.files[0]) {
                        // Upload file if provided
                        const file = imageInput.files[0];
                        const timestamp = Date.now();
                        const fileName = `${timestamp}_${file.name}`;
                        const selectedFolder = window.getSelectedFolder(imageInput, 'images/projects');
                        imageUrl = await uploadImage(file, `${selectedFolder}/${fileName}`);
                    } else {
                        // Try to get from preview
                        const previewImg = imageItem.querySelector('.project-image-preview img');
                        if (previewImg && previewImg.src && !previewImg.src.startsWith('data:')) {
                            imageUrl = previewImg.src;
                        }
                    }
                    
                    if (imageUrl) {
                        project.images.push(imageUrl);
                    }
                }
                
                // Progress text
                const progressInput = item.querySelector('.project-progress');
                if (progressInput && progressInput.value.trim()) {
                    project.progress = progressInput.value.trim();
                }
                
                projects.push(project);
            }
            
            pageData.projects = projects;
            
            // Save to Firebase
            await saveToFirestore('pages', 'projects', pageData);
            
            hideLoading();
            showAlert('All changes saved successfully!', 'success');
            
        } catch (error) {
            hideLoading();
            console.error('Save error:', error);
            showAlert('Error saving: ' + error.message, 'error');
        }
    });
    
    // Initialize image preview
    initImagePreview('projects_hero_image', 'projects_hero_image_preview');
    
    // Initialize folder selectors
    if (window.initFolderSelectors) {
        window.initFolderSelectors();
    }
    
    // Initialize image picker for hero image
    if (window.initImagePicker) {
        const projectsHeroImageUrl = document.getElementById('projects_hero_image_url');
        if (projectsHeroImageUrl) window.initImagePicker(projectsHeroImageUrl);
    }
    
    // Add input listener for hero image URL
    if (document.getElementById('projects_hero_image_url')) {
        document.getElementById('projects_hero_image_url').addEventListener('input', function() {
            const url = this.value.trim();
            if (url) {
                const normalizedPath = normalizeImagePath(url);
                document.getElementById('projects_hero_image_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            } else {
                document.getElementById('projects_hero_image_preview').innerHTML = '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image selected</p></div>';
            }
        });
    }
    
    // Setup upload button
    if (document.getElementById('projects_hero_image_upload_btn')) {
        document.getElementById('projects_hero_image_upload_btn').addEventListener('click', function() {
            document.getElementById('projects_hero_image').click();
        });
    }
})();

