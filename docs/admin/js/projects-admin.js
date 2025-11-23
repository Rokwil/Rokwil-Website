// Projects Admin Page Script
(function() {
    'use strict';
    
    let pageData = {};
    let projectCounter = 0;
    
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
                document.getElementById('projects_hero_image_preview').innerHTML = `<img src="${pageData.pageHero.image}" alt="Preview">`;
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
        
        // Handle description - can be array of paragraphs or string
        const descriptionText = Array.isArray(data?.description) 
            ? data.description.join('\n\n') 
            : (data?.description || '');
        
        // Handle images - support URL inputs
        const imagesHtml = (data?.images || []).map((img, idx) => `
            <div class="project-image-item" data-index="${idx}">
                <div class="admin-form-group">
                    <label>Image ${idx + 1} URL</label>
                    <input type="text" class="project-image-url" value="${img || ''}" placeholder="images/Projects/...">
                </div>
                <div class="image-preview project-image-preview" style="max-width: 200px; margin-bottom: 1rem;">
                    ${img ? `<img src="${img}" alt="Preview" style="max-width: 100%;">` : '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>'}
                </div>
                <input type="file" class="project-image-input" accept="image/*" style="margin-bottom: 1rem;">
                <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-image-item').remove()" style="margin-bottom: 1rem;">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
        `).join('');
        
        // Handle meta items
        const metaHtml = (data?.meta || []).map((meta, idx) => `
            <div class="project-meta-item" data-index="${idx}">
                <input type="text" class="project-meta-text" value="${meta || ''}" placeholder="Location, Size, etc.">
                <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-meta-item').remove()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Handle sections
        const sectionsHtml = (data?.sections || []).map((section, idx) => `
            <div class="project-section-item" data-index="${idx}">
                <div class="admin-form-group">
                    <label>Section Title</label>
                    <input type="text" class="section-title" value="${section.title || ''}">
                </div>
                <div class="admin-form-group">
                    <label>Section Content</label>
                    <textarea class="section-content" rows="3">${Array.isArray(section.content) ? section.content.join('\n') : (section.content || '')}</textarea>
                </div>
                <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-section-item').remove()">
                    <i class="bi bi-trash"></i> Remove Section
                </button>
            </div>
        `).join('');
        
        // Handle features
        const featuresHtml = (data?.features || []).map((feature, idx) => `
            <div class="project-feature-item" data-index="${idx}">
                <input type="text" class="project-feature-text" value="${feature || ''}" placeholder="Feature tag">
                <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-feature-item').remove()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');
        
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
                    ${metaHtml || '<div class="project-meta-item"><input type="text" class="project-meta-text" placeholder="Meta item"><button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest(\'.project-meta-item\').remove()"><i class="bi bi-trash"></i></button></div>'}
                </div>
                <button type="button" class="admin-btn admin-btn-secondary btn-add-item" onclick="addProjectMeta(this)">
                    <i class="bi bi-plus-circle"></i> Add Meta Item
                </button>
            </div>
            <div class="admin-form-group">
                <label>Description (Multiple paragraphs supported)</label>
                <textarea class="project-description" rows="8" placeholder="Project description...">${descriptionText}</textarea>
                <small>Separate paragraphs with blank lines</small>
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
                    ${featuresHtml || ''}
                </div>
                <button type="button" class="admin-btn admin-btn-secondary btn-add-item" onclick="addProjectFeature(this)">
                    <i class="bi bi-plus-circle"></i> Add Feature Tag
                </button>
            </div>
            <div class="image-upload-container">
                <label>Project Images (URLs or upload files)</label>
                <div class="project-images-container">
                    ${imagesHtml || '<div class="project-image-item"><div class="admin-form-group"><label>Image 1 URL</label><input type="text" class="project-image-url" placeholder="images/Projects/..."></div><div class="image-preview project-image-preview" style="max-width: 200px; margin-bottom: 1rem;"><div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div></div><input type="file" class="project-image-input" accept="image/*" style="margin-bottom: 1rem;"><button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest(\'.project-image-item\').remove()" style="margin-bottom: 1rem;"><i class="bi bi-trash"></i> Remove</button></div>'}
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
        
        // Handle image previews and URL updates
        item.querySelectorAll('.project-image-input').forEach((imageInput) => {
            const imagePreview = imageInput.previousElementSibling;
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
            urlInput.addEventListener('input', function() {
                const preview = this.closest('.project-image-item').querySelector('.project-image-preview');
                if (this.value.trim()) {
                    preview.innerHTML = `<img src="${this.value}" alt="Preview" style="max-width: 100%;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                }
            });
        });
        
        container.appendChild(item);
    };
    
    // Helper functions for adding items
    window.addProjectMeta = function(button) {
        const container = button.previousElementSibling;
        const newItem = document.createElement('div');
        newItem.className = 'project-meta-item';
        newItem.innerHTML = `
            <input type="text" class="project-meta-text" placeholder="Meta item">
            <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-meta-item').remove()">
                <i class="bi bi-trash"></i>
            </button>
        `;
        container.appendChild(newItem);
    };
    
    window.addProjectSection = function(button) {
        const container = button.previousElementSibling;
        const newItem = document.createElement('div');
        newItem.className = 'project-section-item';
        newItem.innerHTML = `
            <div class="admin-form-group">
                <label>Section Title</label>
                <input type="text" class="section-title" placeholder="Section Title">
            </div>
            <div class="admin-form-group">
                <label>Section Content</label>
                <textarea class="section-content" rows="3" placeholder="Section content..."></textarea>
            </div>
            <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-section-item').remove()">
                <i class="bi bi-trash"></i> Remove Section
            </button>
        `;
        container.appendChild(newItem);
    };
    
    window.addProjectFeature = function(button) {
        const container = button.previousElementSibling;
        const newItem = document.createElement('div');
        newItem.className = 'project-feature-item';
        newItem.innerHTML = `
            <input type="text" class="project-feature-text" placeholder="Feature tag">
            <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-feature-item').remove()">
                <i class="bi bi-trash"></i>
            </button>
        `;
        container.appendChild(newItem);
    };
    
    window.addProjectImage = function(button) {
        const container = button.previousElementSibling;
        const newIndex = container.querySelectorAll('.project-image-item').length;
        const newItem = document.createElement('div');
        newItem.className = 'project-image-item';
        newItem.innerHTML = `
            <div class="admin-form-group">
                <label>Image ${newIndex + 1} URL</label>
                <input type="text" class="project-image-url" placeholder="images/Projects/...">
            </div>
            <div class="image-preview project-image-preview" style="max-width: 200px; margin-bottom: 1rem;">
                <div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>
            </div>
            <input type="file" class="project-image-input" accept="image/*" style="margin-bottom: 1rem;">
            <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.project-image-item').remove()" style="margin-bottom: 1rem;">
                <i class="bi bi-trash"></i> Remove
            </button>
        `;
        
        const imageInput = newItem.querySelector('.project-image-input');
        const imagePreview = newItem.querySelector('.project-image-preview');
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
        urlInput.addEventListener('input', function() {
            if (this.value.trim()) {
                imagePreview.innerHTML = `<img src="${this.value}" alt="Preview" style="max-width: 100%;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
        });
        
        container.appendChild(newItem);
    };
    
    // Form submission
    document.getElementById('projectsPageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            showLoading();
            
            // Collect page hero
            const heroImage = document.getElementById('projects_hero_image').files[0];
            let heroImageUrl = pageData.pageHero?.image || '';
            if (heroImage) {
                heroImageUrl = await handleImageUpload('projects_hero_image', 'projects_hero_image_preview', 'images/projects', null);
            }
            
            pageData.pageHero = {
                title: document.getElementById('projects_hero_title').value,
                subtitle: document.getElementById('projects_hero_subtitle').value,
                image: heroImageUrl
            };
            
            // Collect projects
            const projects = [];
            for (const item of document.querySelectorAll('#projects_container .repeatable-item')) {
                const project = {};
                
                // Basic info
                project.name = item.querySelector('.project-name').value || '';
                project.featured = item.querySelector('.project-featured')?.checked || false;
                
                // Description - split by blank lines into array
                const descriptionText = item.querySelector('.project-description').value || '';
                project.description = descriptionText.split(/\n\s*\n/).filter(p => p.trim());
                
                // Meta items
                const metaItems = item.querySelectorAll('.project-meta-text');
                project.meta = Array.from(metaItems).map(input => input.value.trim()).filter(m => m);
                
                // Sections
                const sectionItems = item.querySelectorAll('.project-section-item');
                project.sections = [];
                sectionItems.forEach(sectionItem => {
                    const title = sectionItem.querySelector('.section-title')?.value || '';
                    const content = sectionItem.querySelector('.section-content')?.value || '';
                    if (title || content) {
                        project.sections.push({
                            title: title,
                            content: content.split('\n').filter(c => c.trim())
                        });
                    }
                });
                
                // Features
                const featureItems = item.querySelectorAll('.project-feature-text');
                project.features = Array.from(featureItems).map(input => input.value.trim()).filter(f => f);
                
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
                        imageUrl = await uploadImage(file, `images/projects/${fileName}`);
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
})();

