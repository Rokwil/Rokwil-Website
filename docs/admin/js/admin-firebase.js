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
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    };
    
    // Upload image to Firebase Storage (optional - can use URL instead)
    window.uploadImage = async function(file, path) {
        // If Storage is not available, return null and use URL input instead
        if (!storage) {
            console.warn('Firebase Storage not available. Please use URL input instead.');
            return null;
        }
        try {
            showLoading();
            const storageRef = storage.ref();
            const fileRef = storageRef.child(path);
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            hideLoading();
            return downloadURL;
        } catch (error) {
            hideLoading();
            console.error('Image upload error:', error);
            // Return null instead of throwing - allows fallback to URL
            return null;
        }
    };
    
    // Upload video to Firebase Storage (optional - can use URL instead)
    window.uploadVideo = async function(file, path) {
        // If Storage is not available, return null and use URL input instead
        if (!storage) {
            console.warn('Firebase Storage not available. Please use URL input instead.');
            return null;
        }
        try {
            showLoading();
            const storageRef = storage.ref();
            const fileRef = storageRef.child(path);
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            hideLoading();
            return downloadURL;
        } catch (error) {
            hideLoading();
            console.error('Video upload error:', error);
            // Return null instead of throwing - allows fallback to URL
            return null;
        }
    };
    
    // Save data to Firestore
    window.saveToFirestore = async function(collection, docId, data) {
        try {
            showLoading();
            await db.collection(collection).doc(docId).set(data, { merge: true });
            hideLoading();
            showAlert('Changes saved successfully!', 'success');
            return true;
        } catch (error) {
            hideLoading();
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
    
    // Handle image upload with preview (or URL input)
    window.handleImageUpload = async function(inputId, previewId, storagePath, callback) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        // Check if there's a URL input field (alternative to file upload)
        const urlInputId = inputId.replace('_image', '_url').replace('_file', '_url');
        const urlInput = document.getElementById(urlInputId);
        
        // If URL input exists and has value, use that instead
        if (urlInput && urlInput.value) {
            const url = urlInput.value.trim();
            if (preview) {
                preview.innerHTML = `<img src="${url}" alt="Preview">`;
            }
            if (callback) callback(url);
            return url;
        }
        
        // Otherwise try file upload
        if (!input || !input.files || !input.files[0]) {
            return null;
        }
        
        const file = input.files[0];
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const fullPath = `${storagePath}/${fileName}`;
        
        try {
            const url = await uploadImage(file, fullPath);
            if (url) {
                if (preview) {
                    preview.innerHTML = `<img src="${url}" alt="Preview">`;
                }
                if (callback) callback(url);
                return url;
            } else {
                // Storage not available - show message to use URL instead
                showAlert('File upload not available. Please enter image URL in the URL field below.', 'warning');
                return null;
            }
        } catch (error) {
            showAlert('Error uploading image: ' + error.message, 'error');
            return null;
        }
    };
    
    // Handle video upload with preview
    window.handleVideoUpload = async function(inputId, previewId, storagePath, callback) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        if (!input || !input.files || !input.files[0]) {
            return null;
        }
        
        const file = input.files[0];
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const fullPath = `${storagePath}/${fileName}`;
        
        try {
            const url = await uploadVideo(file, fullPath);
            if (preview) {
                preview.innerHTML = `<video controls><source src="${url}" type="${file.type}"></video>`;
            }
            if (callback) callback(url);
            return url;
        } catch (error) {
            showAlert('Error uploading video: ' + error.message, 'error');
            return null;
        }
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

