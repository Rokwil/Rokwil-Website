// Admin Firebase Operations
(function() {
    'use strict';
    
    // Show loading overlay
    window.showLoading = function() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(overlay);
    };
    
    // Hide loading overlay
    window.hideLoading = function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.remove();
        }
    };
    
    // Show alert message
    window.showAlert = function(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `admin-alert admin-alert-${type}`;
        alert.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Insert at top of container
        const container = document.querySelector('.admin-container');
        if (container) {
            container.insertBefore(alert, container.firstChild);
            
            // Scroll to top to show alert
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    };
    
    // Track unsaved changes
    let hasUnsavedChanges = false;
    let formChangeListeners = [];
    
    // Initialize unsaved changes tracking
    window.initUnsavedChangesTracking = function(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        // Track all form changes
        const trackChange = () => {
            hasUnsavedChanges = true;
            updateSaveButtonState();
        };
        
        // Add listeners to all form inputs
        form.addEventListener('input', trackChange);
        form.addEventListener('change', trackChange);
        
        // Track form submission
        form.addEventListener('submit', () => {
            hasUnsavedChanges = false;
            updateSaveButtonState();
        });
        
        // Warn before leaving page
        window.addEventListener('beforeunload', (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    };
    
    // Update save button state
    window.updateSaveButtonState = function(state = 'idle') {
        const saveButtons = document.querySelectorAll('button[type="submit"].admin-btn-primary');
        saveButtons.forEach(btn => {
            const icon = btn.querySelector('i');
            const text = btn.querySelector('span') || btn.childNodes[btn.childNodes.length - 1];
            
            if (state === 'saving') {
                btn.disabled = true;
                if (icon) icon.className = 'bi bi-hourglass-split';
                if (text && text.nodeType === 3) {
                    const span = document.createElement('span');
                    span.textContent = ' Saving...';
                    btn.appendChild(span);
                } else if (text) {
                    text.textContent = ' Saving...';
                }
            } else if (state === 'success') {
                btn.disabled = false;
                if (icon) icon.className = 'bi bi-check-circle';
                if (text && text.nodeType === 3) {
                    const span = document.createElement('span');
                    span.textContent = ' Saved!';
                    btn.appendChild(span);
                } else if (text) {
                    text.textContent = ' Saved!';
                }
                setTimeout(() => {
                    if (icon) icon.className = 'bi bi-save';
                    if (text && text.nodeType === 3) {
                        const span = btn.querySelector('span');
                        if (span) span.textContent = ' Save All Changes';
                    } else if (text) {
                        text.textContent = ' Save All Changes';
                    }
                }, 2000);
            } else {
                btn.disabled = false;
                if (icon) icon.className = 'bi bi-save';
                if (text && text.nodeType === 3) {
                    const span = btn.querySelector('span');
                    if (span) span.textContent = ' Save All Changes';
                } else if (text) {
                    text.textContent = ' Save All Changes';
                }
            }
        });
    };
    
    // Confirm dialog helper
    window.showConfirmDialog = function(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'confirm-dialog-overlay';
            overlay.innerHTML = `
                <div class="confirm-dialog">
                    <div class="confirm-dialog-header">
                        <h3>${title}</h3>
                        <button type="button" class="confirm-dialog-close" onclick="this.closest('.confirm-dialog-overlay').remove(); resolve(false);">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                    <div class="confirm-dialog-body">
                        <p>${message}</p>
                    </div>
                    <div class="confirm-dialog-footer">
                        <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.confirm-dialog-overlay').remove(); resolve(false);">
                            Cancel
                        </button>
                        <button type="button" class="admin-btn admin-btn-primary" onclick="this.closest('.confirm-dialog-overlay').remove(); resolve(true);">
                            Confirm
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    resolve(false);
                }
            });
            
            // Focus confirm button
            overlay.querySelector('.admin-btn-primary').focus();
        });
    };
    
    // Initialize keyboard shortcuts
    window.initKeyboardShortcuts = function(formId) {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S or Cmd+S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const form = document.getElementById(formId);
                if (form) {
                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
            }
            
            // Escape to cancel/closes modals
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.icon-picker-overlay, .confirm-dialog-overlay, .image-picker-dropdown-menu');
                modals.forEach(modal => {
                    if (modal.style.display !== 'none') {
                        modal.style.display = 'none';
                        modal.closest('.image-picker-dropdown')?.classList.remove('active');
                    }
                });
            }
        });
    };
    
    // For GitHub Pages: Images must be manually added to the repo
    // This function is kept for compatibility but path generation is handled in handleImageUpload
    window.uploadImage = async function(file, path) {
        // Path generation is now handled in handleImageUpload
        // This function is kept for backward compatibility
        return null;
    };
    
    // For GitHub Pages: Videos must be manually added to the repo
    // This function is kept for compatibility but path generation is handled in handleVideoUpload
    window.uploadVideo = async function(file, path) {
        // Path generation is now handled in handleVideoUpload
        // This function is kept for backward compatibility
        return null;
    };
    
    // Save data to Firestore
    window.saveToFirestore = async function(collection, docId, data) {
        try {
            updateSaveButtonState('saving');
            showLoading();
            await db.collection(collection).doc(docId).set(data, { merge: true });
            hideLoading();
            updateSaveButtonState('success');
            hasUnsavedChanges = false;
            showAlert('Changes saved successfully!', 'success');
            return true;
        } catch (error) {
            hideLoading();
            updateSaveButtonState('idle');
            console.error('Save error:', error);
            showAlert('Error saving changes: ' + error.message, 'error');
            return false;
        }
    };
    
    // Load data from Firestore
    window.loadFromFirestore = async function(collection, docId) {
        try {
            showLoading();
            const doc = await db.collection(collection).doc(docId).get();
            hideLoading();
            if (doc.exists) {
                return doc.data();
            } else {
                return null;
            }
        } catch (error) {
            hideLoading();
            console.error('Load error:', error);
            showAlert('Error loading data: ' + error.message, 'error');
            return null;
        }
    };
    
    // List of available images from the images directory (using absolute paths)
    const AVAILABLE_IMAGES = [
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
    window.fixTruncatedImagePath = function(path) {
        if (!path) return path;
        
        // Normalize the path for comparison (remove leading slash)
        const pathForComparison = path.startsWith('/') ? path.substring(1) : path;
        
        // Check if path looks truncated (ends with opening parenthesis and number without closing)
        // Handle cases like "image (1" or "image  (1" (with one or more spaces)
        const truncatedPattern = /\s*\((\d+)$/;
        const match = pathForComparison.match(truncatedPattern);
        
        if (match) {
            // Extract the base path (everything before the space and opening parenthesis)
            const basePath = pathForComparison.substring(0, pathForComparison.lastIndexOf('(')).trim();
            const number = match[1];
            
            // Try to find a matching path in AVAILABLE_IMAGES
            const possibleMatches = window.AVAILABLE_IMAGES.filter(img => {
                // Remove leading slash for comparison
                const imgPath = img.startsWith('/') ? img.substring(1) : img;
                
                // Check if the image path matches the pattern: basePath (number).ext
                const matchPattern = new RegExp('^' + basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(\\s*' + number + '\\s*\\)\\.(jpg|jpeg|png|webp|gif)$', 'i');
                return matchPattern.test(imgPath);
            });
            
            if (possibleMatches.length > 0) {
                // Use the first match (most likely to be correct)
                return possibleMatches[0];
            }
            
            // If no match found, try to complete it with closing parenthesis and extension
            // Use single space: "basePath (number).ext"
            const commonExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
            for (const ext of commonExtensions) {
                const testPath = '/' + basePath + ' (' + number + ')' + ext;
                if (window.AVAILABLE_IMAGES.includes(testPath)) {
                    return testPath;
                }
            }
            
            // If still no match, just add closing parenthesis and .jpg (most common)
            // Use single space: "basePath (number).jpg"
            return '/' + basePath + ' (' + number + ').jpg';
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
    };
    
    // Helper function to get the base path for GitHub Pages
    window.getBasePath = function() {
        // If we're on GitHub Pages, detect the repository name from the path
        if (window.location.hostname === 'rokwil.github.io' || window.location.hostname.includes('github.io')) {
            const pathParts = window.location.pathname.split('/').filter(p => p);
            if (pathParts.length > 0 && pathParts[0] !== 'Rokwil-Website') {
                // Repository name is the first part of the path
                return '/' + pathParts[0] + '/';
            }
            // Default repository name
            return '/Rokwil-Website/';
        }
        // Local development - no base path needed
        return '/';
    };
    
    // Helper function to normalize image paths (convert relative to absolute if needed)
    window.normalizeImagePath = function(path) {
        if (!path) return path;
        
        // Remove any leading/trailing whitespace
        path = path.trim();
        
        // First, try to fix truncated paths
        path = window.fixTruncatedImagePath(path);
        
        // If path is already a full URL, return as-is
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        
        // Get base path for GitHub Pages
        const basePath = window.getBasePath();
        
        // If path doesn't start with /, make it relative
        if (!path.startsWith('/')) {
            // If it starts with 'images/' or 'admin/images/', convert appropriately
            if (path.startsWith('images/')) {
                return basePath + path;
            }
            if (path.startsWith('admin/images/')) {
                return basePath + path.replace('admin/', '');
            }
            // Otherwise, assume it's relative to base
            return basePath + path;
        }
        
        // If path starts with '/admin/images/', fix it
        if (path.startsWith('/admin/images/')) {
            return basePath + path.replace('/admin/images/', 'images/');
        }
        
        // If path starts with '/images/', prepend base path
        if (path.startsWith('/images/')) {
            return basePath + path.substring(1); // Remove leading / and prepend base
        }
        
        // For other absolute paths, prepend base path
        return basePath + path.substring(1);
    };
    
    // Helper function to normalize video paths (similar to image paths)
    window.normalizeVideoPath = function(path) {
        if (!path) return path;
        
        // Remove any leading/trailing whitespace
        path = path.trim();
        
        // If path is already a full URL, return as-is
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        
        // Get base path for GitHub Pages
        const basePath = window.getBasePath();
        
        // If path doesn't start with /, make it relative
        if (!path.startsWith('/')) {
            // If it starts with 'videos/' or 'admin/videos/', convert appropriately
            if (path.startsWith('videos/')) {
                return basePath + path;
            }
            if (path.startsWith('admin/videos/')) {
                return basePath + path.replace('admin/', '');
            }
            // Otherwise, assume it's relative to base
            return basePath + path;
        }
        
        // If path starts with '/admin/videos/', fix it
        if (path.startsWith('/admin/videos/')) {
            return basePath + path.replace('/admin/videos/', 'videos/');
        }
        
        // If path starts with '/videos/', prepend base path
        if (path.startsWith('/videos/')) {
            return basePath + path.substring(1); // Remove leading / and prepend base
        }
        
        // For other absolute paths, prepend base path
        return basePath + path.substring(1);
    };
    
    // Initialize image preview
    window.initImagePreview = function(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        if (input && preview) {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };
    
    // Initialize video preview
    window.initVideoPreview = function(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        if (input && preview) {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.innerHTML = `<video controls><source src="${e.target.result}" type="${file.type}"></video>`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };
    
    // Get available folders from images directory structure
    window.getAvailableFolders = function() {
        // Common folders based on the images directory structure
        const commonFolders = [
            'images/hero',
            'images/about',
            'images/contact',
            'images/projects',
            'images/showcase',
            'images/news',
            'images/video',
            'images/Archived',
            'images/Home',
            'images/Other',
            'images/Projects/Keystone',
            'images/Projects/Judges Court',
            'images/Projects/Lakeview Mini Factories',
            'images/Projects/Pioneer Campus',
            'images/Projects/Rockwood Mini Factories',
            'images/Projects/Umlazi Mega City',
            'images/Projects/Victory View Offices',
            'images/Projects/aQuelle - National Distribution Centre',
            'images/Projects/Kloof Lifestyle Centre',
            'images/Projects/Western Corridor Integrated Freight Hub'
        ];
        return commonFolders;
    };
    
    // Create folder selector UI
    window.createFolderSelector = function(containerId, defaultFolder, onFolderChange) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        // Check if folder selector already exists
        let folderSelector = container.querySelector('.folder-selector-container');
        if (folderSelector) {
            return folderSelector;
        }
        
        // Create folder selector container
        folderSelector = document.createElement('div');
        folderSelector.className = 'folder-selector-container';
        
        // Create dropdown
        const select = document.createElement('select');
        select.className = 'folder-selector';
        
        // Add existing folders
        const folders = window.getAvailableFolders();
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = folder;
            if (folder === defaultFolder) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        // Add "Create New Folder" option
        const newFolderOption = document.createElement('option');
        newFolderOption.value = '__new__';
        newFolderOption.textContent = '+ Create New Folder';
        select.appendChild(newFolderOption);
        
        // Create new folder input (hidden initially)
        const newFolderInput = document.createElement('input');
        newFolderInput.type = 'text';
        newFolderInput.className = 'new-folder-input';
        newFolderInput.placeholder = 'Enter folder path (e.g., images/NewFolder)';
        newFolderInput.style.display = 'none';
        
        // Create confirm button (hidden initially)
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'admin-btn admin-btn-secondary confirm-folder-btn';
        confirmBtn.innerHTML = '<i class="bi bi-check"></i> Confirm';
        confirmBtn.style.display = 'none';
        
        // Create cancel button (hidden initially)
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'admin-btn admin-btn-secondary cancel-folder-btn';
        cancelBtn.innerHTML = '<i class="bi bi-x"></i> Cancel';
        cancelBtn.style.display = 'none';
        
        // Handle folder selection
        select.addEventListener('change', function() {
            if (select.value === '__new__') {
                // Show new folder input
                newFolderInput.style.display = 'block';
                confirmBtn.style.display = 'inline-block';
                cancelBtn.style.display = 'inline-block';
                select.style.display = 'none';
                newFolderInput.focus();
            } else {
                // Use selected folder
                if (onFolderChange) {
                    onFolderChange(select.value);
                }
            }
        });
        
        // Handle confirm new folder
        confirmBtn.addEventListener('click', function() {
            const newFolder = newFolderInput.value.trim();
            if (newFolder) {
                // Ensure it starts with 'images/'
                const folderPath = newFolder.startsWith('images/') ? newFolder : `images/${newFolder}`;
                
                // Add to dropdown if not already there
                const exists = Array.from(select.options).some(opt => opt.value === folderPath);
                if (!exists) {
                    const option = document.createElement('option');
                    option.value = folderPath;
                    option.textContent = folderPath;
                    select.insertBefore(option, newFolderOption);
                    option.selected = true;
                } else {
                    select.value = folderPath;
                }
                
                // Hide new folder UI
                newFolderInput.style.display = 'none';
                confirmBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                select.style.display = 'block';
                newFolderInput.value = '';
                
                if (onFolderChange) {
                    onFolderChange(folderPath);
                }
            }
        });
        
        // Handle cancel
        cancelBtn.addEventListener('click', function() {
            newFolderInput.style.display = 'none';
            confirmBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            select.style.display = 'block';
            newFolderInput.value = '';
            select.value = defaultFolder || folders[0];
        });
        
        // Handle Enter key in new folder input
        newFolderInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });
        
        // Assemble UI
        const label = document.createElement('label');
        label.textContent = 'Upload Folder:';
        
        folderSelector.appendChild(label);
        folderSelector.appendChild(select);
        folderSelector.appendChild(newFolderInput);
        folderSelector.appendChild(confirmBtn);
        folderSelector.appendChild(cancelBtn);
        
        // Store selected folder in data attribute
        folderSelector.dataset.selectedFolder = defaultFolder || folders[0];
        
        return folderSelector;
    };
    
    // List of available images from the images directory (using absolute paths)
    // This is shared across all admin pages
    window.AVAILABLE_IMAGES = [
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
    
    // Initialize image picker dropdown (shared function for all admin pages)
    window.initImagePicker = function(imageUrlInput) {
        const dropdown = imageUrlInput.closest('.image-picker-dropdown');
        if (!dropdown) return;
        
        const toggleBtn = dropdown.querySelector('.image-picker-toggle');
        const dropdownMenu = dropdown.querySelector('.image-picker-dropdown-menu');
        const imageList = dropdown.querySelector('.image-picker-list');
        const searchInput = dropdown.querySelector('.image-picker-search-input');
        const manualInput = dropdown.querySelector('.image-picker-manual-input');
        const manualBtn = dropdown.querySelector('.admin-btn-primary');
        
        // Find preview element - could be in various containers
        let imagePreview = null;
        const heroItem = imageUrlInput.closest('.hero-image-item');
        const projectItem = imageUrlInput.closest('.project-image-item');
        if (heroItem) {
            imagePreview = heroItem.querySelector('.image-preview');
        } else if (projectItem) {
            imagePreview = projectItem.querySelector('.project-image-preview');
        } else {
            // Try to find by ID pattern
            const inputId = imageUrlInput.id || '';
            if (inputId.includes('hero_image1')) {
                imagePreview = document.getElementById('hero_image1_preview');
            } else if (inputId.includes('hero_image2')) {
                imagePreview = document.getElementById('hero_image2_preview');
            } else if (inputId.includes('page_hero_image')) {
                imagePreview = document.getElementById('page_hero_image_preview');
            } else if (inputId.includes('projects_hero_image')) {
                imagePreview = document.getElementById('projects_hero_image_preview');
            } else if (inputId.includes('contact_hero_image')) {
                imagePreview = document.getElementById('contact_hero_image_preview');
            } else if (inputId.includes('about_story_image')) {
                imagePreview = document.getElementById('about_story_image_preview');
            }
        }
        
        // Populate image list
        function populateImageList(filter = '') {
            const filtered = window.AVAILABLE_IMAGES.filter(img => 
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
                    if (imagePreview) {
                        const normalizedPath = normalizeImagePath(selectedImage);
                        imagePreview.innerHTML = `<img src="${normalizedPath}" alt="Preview" style="max-width: 100%;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                    }
                    dropdownMenu.style.display = 'none';
                    toggleBtn.querySelector('i').className = 'bi bi-chevron-down';
                    
                    // Trigger input event
                    imageUrlInput.dispatchEvent(new Event('input', { bubbles: true }));
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
                if (imagePreview) {
                    const normalizedPath = normalizeImagePath(manualUrl);
                    imagePreview.innerHTML = `<img src="${normalizedPath}" alt="Preview" style="max-width: 100%;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                }
                dropdownMenu.style.display = 'none';
                toggleBtn.querySelector('i').className = 'bi bi-chevron-down';
                manualInput.value = '';
                
                // Trigger input event
                imageUrlInput.dispatchEvent(new Event('input', { bubbles: true }));
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
    };
    
    // Handle image upload with preview (or URL input)
    window.handleImageUpload = async function(inputId, previewId, storagePath, callback) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        // Check if there's a folder selector
        const uploadContainer = input.closest('.image-upload-container') || input.closest('.video-upload-container') || input.closest('.hero-image-item');
        let selectedFolder = storagePath; // Default to provided path
        if (uploadContainer) {
            // First check for folder selector in the same container/item
            const folderSelector = uploadContainer.querySelector('.folder-selector');
            if (folderSelector && folderSelector.value && folderSelector.value !== '__new__') {
                selectedFolder = folderSelector.value;
            } else if (uploadContainer.querySelector('.folder-selector-container')) {
                selectedFolder = uploadContainer.querySelector('.folder-selector-container').dataset.selectedFolder || storagePath;
            }
            
            // For hero images, also check the parent container if no selector found
            if (selectedFolder === storagePath && input.id && input.id.includes('hero_image')) {
                const parentContainer = uploadContainer.closest('.image-upload-container');
                if (parentContainer) {
                    const parentFolderSelector = parentContainer.querySelector('.folder-selector');
                    if (parentFolderSelector && parentFolderSelector.value && parentFolderSelector.value !== '__new__') {
                        selectedFolder = parentFolderSelector.value;
                    }
                }
            }
        }
        
        // Check if there's a URL input field (alternative to file upload)
        const urlInputId = inputId.replace('_image', '_url').replace('_file', '_url');
        const urlInput = document.getElementById(urlInputId);
        
        // If URL input exists and has value, use that instead
        if (urlInput && urlInput.value) {
            const url = urlInput.value.trim();
            const normalizedUrl = normalizeImagePath(url);
            if (preview) {
                preview.innerHTML = `<img src="${normalizedUrl}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
            if (callback) callback(normalizedUrl);
            return normalizedUrl;
        }
        
        // For GitHub Pages: File selection helps generate the path
        if (input && input.files && input.files[0]) {
            const file = input.files[0];
            const timestamp = Date.now();
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${timestamp}_${sanitizedFileName}`;
            const fullPath = `/${selectedFolder}/${fileName}`;
            
            // Generate preview from file
            const reader = new FileReader();
            reader.onload = function(e) {
                if (preview) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                }
            };
            reader.readAsDataURL(file);
            
            // Auto-fill the URL field with the generated path
            if (urlInput) {
                urlInput.value = fullPath;
                // Trigger input event to update preview with the path
                setTimeout(() => {
                    urlInput.dispatchEvent(new Event('input'));
                }, 100);
                
                showAlert(`Path generated: ${fullPath}\n\n📁 Save the file to: docs${fullPath}\nThen commit and push to GitHub.`, 'info');
            } else {
                showAlert(`📁 To use this image:\n1. Save to: docs${fullPath}\n2. Commit to GitHub\n3. Use path: ${fullPath}`, 'info');
            }
            
            // Return the path
            return fullPath;
        }
        
        return null;
    };
    
    // Handle video upload with preview
    window.handleVideoUpload = async function(inputId, previewId, storagePath, callback) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        // Check if there's a URL input field (alternative to file upload)
        const urlInputId = inputId.replace('_file', '_url').replace('_video', '_url');
        const urlInput = document.getElementById(urlInputId);
        
        // If URL input exists and has value, use that instead
        if (urlInput && urlInput.value) {
            const url = urlInput.value.trim();
            const normalizedUrl = normalizeVideoPath(url);
            if (preview) {
                preview.innerHTML = `<video controls><source src="${normalizedUrl}"></video>`;
            }
            if (callback) callback(normalizedUrl);
            return normalizedUrl;
        }
        
        // Check if there's a folder selector
        const uploadContainer = input.closest('.image-upload-container') || input.closest('.video-upload-container');
        let selectedFolder = storagePath; // Default to provided path
        if (uploadContainer) {
            const folderSelector = uploadContainer.querySelector('.folder-selector');
            if (folderSelector && folderSelector.value && folderSelector.value !== '__new__') {
                selectedFolder = folderSelector.value;
            } else if (uploadContainer.querySelector('.folder-selector-container')) {
                selectedFolder = uploadContainer.querySelector('.folder-selector-container').dataset.selectedFolder || storagePath;
            }
        }
        
        // For GitHub Pages: File selection helps generate the path
        if (input && input.files && input.files[0]) {
            const file = input.files[0];
            const timestamp = Date.now();
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${timestamp}_${sanitizedFileName}`;
            const fullPath = `/${selectedFolder}/${fileName}`;
            
            // Generate preview from file
            const reader = new FileReader();
            reader.onload = function(e) {
                if (preview) {
                    preview.innerHTML = `<video controls><source src="${e.target.result}" type="${file.type}"></video>`;
                }
            };
            reader.readAsDataURL(file);
            
            // Auto-fill the URL field with the generated path
            if (urlInput) {
                urlInput.value = fullPath;
                // Trigger input event to update preview
                setTimeout(() => {
                    urlInput.dispatchEvent(new Event('input'));
                }, 100);
                
                showAlert(`Path generated: ${fullPath}\n\n📁 Save the file to: docs${fullPath}\nThen commit and push to GitHub.`, 'info');
            } else {
                showAlert(`📁 To use this video:\n1. Save to: docs${fullPath}\n2. Commit to GitHub\n3. Use path: ${fullPath}`, 'info');
            }
            
            // Return the path
            return fullPath;
        }
        
        return null;
    };
    
    // Add repeatable item
    window.addRepeatableItem = function(containerId, templateId) {
        const container = document.getElementById(containerId);
        const template = document.getElementById(templateId);
        
        if (container && template) {
            const newItem = template.cloneNode(true);
            newItem.style.display = 'block';
            newItem.id = '';
            newItem.classList.add('repeatable-item');
            
            // Add remove button if not present
            if (!newItem.querySelector('.btn-remove-item')) {
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'btn-remove-item admin-btn admin-btn-danger';
                removeBtn.innerHTML = '<i class="bi bi-trash"></i>';
                removeBtn.onclick = function() {
                    newItem.remove();
                };
                newItem.insertBefore(removeBtn, newItem.firstChild);
            }
            
            container.appendChild(newItem);
        }
    };
    
    // Populate form from data
    window.populateForm = function(data, prefix = '') {
        for (const key in data) {
            const fieldId = prefix ? `${prefix}_${key}` : key;
            const field = document.getElementById(fieldId);
            
            if (field) {
                if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                    field.value = data[key];
                } else if (field.tagName === 'SELECT') {
                    field.value = data[key];
                }
            }
            
            // Handle nested objects
            if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
                populateForm(data[key], fieldId);
            }
        }
    };
    
    // Initialize folder selectors for all upload containers
    window.initFolderSelectors = function() {
        // Find all image upload containers
        const uploadContainers = document.querySelectorAll('.image-upload-container, .video-upload-container');
        
        uploadContainers.forEach(container => {
            // Skip if folder selector already exists
            if (container.querySelector('.folder-selector-container')) {
                return;
            }
            
            // Determine default folder based on container context
            let defaultFolder = 'images';
            const containerId = container.id || `folder-selector-${Date.now()}`;
            container.id = containerId;
            
            // Try to infer folder from nearby elements
            const label = container.querySelector('label');
            if (label) {
                const labelText = label.textContent.toLowerCase();
                if (labelText.includes('hero')) {
                    defaultFolder = 'images/hero';
                } else if (labelText.includes('about')) {
                    defaultFolder = 'images/about';
                } else if (labelText.includes('contact')) {
                    defaultFolder = 'images/contact';
                } else if (labelText.includes('project')) {
                    defaultFolder = 'images/projects';
                } else if (labelText.includes('showcase')) {
                    defaultFolder = 'images/showcase';
                } else if (labelText.includes('news')) {
                    defaultFolder = 'images/news';
                } else if (labelText.includes('video') || labelText.includes('poster')) {
                    defaultFolder = 'images/video';
                }
            }
            
            // Create folder selector
            const folderSelector = window.createFolderSelector(containerId, defaultFolder, function(selectedFolder) {
                // Update stored folder when changed
                if (folderSelector) {
                    folderSelector.dataset.selectedFolder = selectedFolder;
                }
            });
            
            if (folderSelector) {
                container.appendChild(folderSelector);
            }
        });
    };
    
    // Get selected folder from upload container
    window.getSelectedFolder = function(inputElement, defaultFolder) {
        const container = inputElement.closest('.image-upload-container') || inputElement.closest('.video-upload-container');
        if (container) {
            const folderSelector = container.querySelector('.folder-selector');
            if (folderSelector && folderSelector.value && folderSelector.value !== '__new__') {
                return folderSelector.value;
            }
            const folderContainer = container.querySelector('.folder-selector-container');
            if (folderContainer && folderContainer.dataset.selectedFolder) {
                return folderContainer.dataset.selectedFolder;
            }
        }
        return defaultFolder || 'images';
    };
    
    // Get form data
    window.getFormData = function(prefix = '') {
        const data = {};
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.id && input.id.startsWith(prefix)) {
                const key = input.id.replace(prefix + '_', '');
                if (input.type === 'file') {
                    // Skip file inputs
                } else if (input.type === 'checkbox') {
                    data[key] = input.checked;
                } else {
                    data[key] = input.value;
                }
            }
        });
        
        return data;
    };
})();

