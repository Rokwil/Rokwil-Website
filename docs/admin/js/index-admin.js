// Index Admin Page Script
(function() {
    'use strict';
    
    let pageData = {};
    let itemCounters = {
        features: 0,
        showcase: 0,
        testimonials: 0,
        news: 0,
        stats: 0
    };
    
    // Check authentication
    checkAdminAuth().then((user) => {
        document.getElementById('adminUserEmail').textContent = user.email;
        loadPageData();
    });
    
    // Load page data from Firebase
    async function loadPageData() {
        const data = await loadFromFirestore('pages', 'index');
        if (data) {
            pageData = data;
            populateForm();
        } else {
            // Initialize with default structure
            initializeDefaults();
            // Also try to load from the actual HTML page as fallback
            loadFromHTML();
            // Populate form with defaults
            populateForm();
        }
    }
    
    // Load current content from HTML page as fallback
    function loadFromHTML() {
        // Load defaults from current HTML
        loadHeroDefaults();
        showAlert('No saved data found in Firebase. Form populated with current page content. Save to store in Firebase.', 'info');
    }
    
    // Load hero defaults from current page
    function loadHeroDefaults() {
        fetch('../index.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                const heroTitle = doc.querySelector('.hero-title')?.textContent || '';
                const heroSubtitle = doc.querySelector('.hero-subtitle')?.textContent || '';
                const btn1 = doc.querySelector('.hero-buttons .btn-primary span')?.textContent || '';
                const btn1Link = doc.querySelector('.hero-buttons .btn-primary')?.getAttribute('href') || '';
                const btn2 = doc.querySelector('.hero-buttons .btn-secondary span')?.textContent || '';
                const btn2Link = doc.querySelector('.hero-buttons .btn-secondary')?.getAttribute('href') || '';
                
                if (heroTitle && document.getElementById('hero_title')) {
                    document.getElementById('hero_title').value = heroTitle;
                }
                if (heroSubtitle && document.getElementById('hero_subtitle')) {
                    document.getElementById('hero_subtitle').value = heroSubtitle;
                }
                if (btn1 && document.getElementById('hero_button1_text')) {
                    document.getElementById('hero_button1_text').value = btn1;
                }
                if (btn1Link && document.getElementById('hero_button1_link')) {
                    document.getElementById('hero_button1_link').value = btn1Link;
                }
                if (btn2 && document.getElementById('hero_button2_text')) {
                    document.getElementById('hero_button2_text').value = btn2;
                }
                if (btn2Link && document.getElementById('hero_button2_link')) {
                    document.getElementById('hero_button2_link').value = btn2Link;
                }
            })
            .catch(err => {
                console.log('Could not load hero defaults from HTML');
            });
    }
    
    // Initialize default structure
    function initializeDefaults() {
        pageData = {
            hero: {
                title: 'Industrial Platforms & Mega DCs on the N3 in KZN',
                subtitle: 'Transforming the Durban–Pietermaritzburg corridor through world-class logistics precincts. Keystone Park: ±152 hectares of serviced platforms hosting blue-chip occupiers.',
                button1: { text: 'Our Projects', link: 'projects.html' },
                button2: { text: 'Get In Touch', link: 'contact.html' },
                images: []
            },
            video: {
                title: 'Experience Rokwil',
                subtitle: 'See our developments in action',
                url: '',
                poster: ''
            },
            features: {
                title: 'What We Do',
                subtitle: 'Transforming landscapes through strategic property development',
                items: []
            },
            showcase: {
                title: 'Featured Projects',
                subtitle: 'Discover our landmark developments',
                items: []
            },
            testimonials: {
                title: 'What Our Partners Say',
                subtitle: 'Trusted by leading businesses across South Africa',
                items: []
            },
            news: {
                title: 'Latest News & Updates',
                subtitle: 'Stay informed about our developments and milestones',
                items: []
            },
            stats: {
                items: []
            }
        };
    }
    
    // Populate form with data
    function populateForm() {
        // Hero section
        if (pageData.hero) {
            document.getElementById('hero_title').value = pageData.hero.title || '';
            document.getElementById('hero_subtitle').value = pageData.hero.subtitle || '';
            document.getElementById('hero_button1_text').value = pageData.hero.button1?.text || '';
            document.getElementById('hero_button1_link').value = pageData.hero.button1?.link || '';
            document.getElementById('hero_button2_text').value = pageData.hero.button2?.text || '';
            document.getElementById('hero_button2_link').value = pageData.hero.button2?.link || '';
            
            if (pageData.hero.images && pageData.hero.images[0]) {
                const normalizedPath = normalizeImagePath(pageData.hero.images[0]);
                document.getElementById('hero_image1_preview').innerHTML = `<img src="${normalizedPath}" alt="Hero Image 1" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                if (document.getElementById('hero_image1_url')) {
                    document.getElementById('hero_image1_url').value = pageData.hero.images[0];
                }
            }
            if (pageData.hero.images && pageData.hero.images[1]) {
                const normalizedPath = normalizeImagePath(pageData.hero.images[1]);
                document.getElementById('hero_image2_preview').innerHTML = `<img src="${normalizedPath}" alt="Hero Image 2" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                if (document.getElementById('hero_image2_url')) {
                    document.getElementById('hero_image2_url').value = pageData.hero.images[1];
                }
            }
        }
        
        // Video section
        if (pageData.video) {
            document.getElementById('video_title').value = pageData.video.title || '';
            document.getElementById('video_subtitle').value = pageData.video.subtitle || '';
            if (pageData.video.url) {
                const normalizedPath = normalizeVideoPath(pageData.video.url);
                document.getElementById('video_preview').innerHTML = `<video controls><source src="${normalizedPath}"></video>`;
                if (document.getElementById('video_file_url')) {
                    document.getElementById('video_file_url').value = pageData.video.url;
                }
            }
            if (pageData.video.poster) {
                const normalizedPath = normalizeImagePath(pageData.video.poster);
                document.getElementById('video_poster_preview').innerHTML = `<img src="${normalizedPath}" alt="Video Poster" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                if (document.getElementById('video_poster_url')) {
                    document.getElementById('video_poster_url').value = pageData.video.poster;
                }
            }
        }
        
        // Features
        if (pageData.features) {
            document.getElementById('features_title').value = pageData.features.title || '';
            document.getElementById('features_subtitle').value = pageData.features.subtitle || '';
            const featuresHidden = document.getElementById('features_hidden');
            // Handle backward compatibility: convert visible to hidden
            const isHidden = pageData.features.hidden !== undefined 
                ? pageData.features.hidden 
                : (pageData.features.visible === false);
            if (featuresHidden) featuresHidden.checked = isHidden;
            if (pageData.features.items) {
                pageData.features.items.forEach((item, index) => {
                    addFeature(item, index);
                });
            }
        }
        
        // Showcase
        if (pageData.showcase) {
            document.getElementById('showcase_title').value = pageData.showcase.title || '';
            document.getElementById('showcase_subtitle').value = pageData.showcase.subtitle || '';
            const showcaseHidden = document.getElementById('showcase_hidden');
            // Handle backward compatibility: convert visible to hidden
            const isHidden = pageData.showcase.hidden !== undefined 
                ? pageData.showcase.hidden 
                : (pageData.showcase.visible === false);
            if (showcaseHidden) showcaseHidden.checked = isHidden;
            if (pageData.showcase.items) {
                pageData.showcase.items.forEach((item, index) => {
                    addShowcaseItem(item, index);
                });
            }
        }
        
        // Testimonials
        if (pageData.testimonials) {
            document.getElementById('testimonials_title').value = pageData.testimonials.title || '';
            document.getElementById('testimonials_subtitle').value = pageData.testimonials.subtitle || '';
            const testimonialsHidden = document.getElementById('testimonials_hidden');
            // Handle backward compatibility: convert visible to hidden
            const isHidden = pageData.testimonials.hidden !== undefined 
                ? pageData.testimonials.hidden 
                : (pageData.testimonials.visible === false);
            if (testimonialsHidden) testimonialsHidden.checked = isHidden;
            if (pageData.testimonials.items) {
                pageData.testimonials.items.forEach((item, index) => {
                    addTestimonial(item, index);
                });
            }
        }
        
        // News
        if (pageData.news) {
            document.getElementById('news_title').value = pageData.news.title || '';
            document.getElementById('news_subtitle').value = pageData.news.subtitle || '';
            const newsHidden = document.getElementById('news_hidden');
            // Handle backward compatibility: convert visible to hidden
            const isHidden = pageData.news.hidden !== undefined 
                ? pageData.news.hidden 
                : (pageData.news.visible === false);
            if (newsHidden) newsHidden.checked = isHidden;
            if (pageData.news.items) {
                pageData.news.items.forEach((item, index) => {
                    addNewsItem(item, index);
                });
            }
        }
        
        // Stats
        if (pageData.stats && pageData.stats.items) {
            pageData.stats.items.forEach((item, index) => {
                addStat(item, index);
            });
        }
        
        // Footer removed - now handled in footer-admin.html
    }
    
    // Add feature item
    window.addFeature = function(data = null, index = null) {
        const container = document.getElementById('features_container');
        const id = index !== null ? index : itemCounters.features++;
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.dataset.index = id;
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Feature ${id + 1}</span>
                <button type="button" class="btn-remove-item" onclick="this.closest('.repeatable-item').remove()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="item-visibility-toggle">
                <input type="checkbox" class="feature-hidden" ${(data?.hidden !== undefined ? data.hidden : (data?.visible === false)) ? 'checked' : ''}>
                <label>Hide</label>
            </div>
            <div class="admin-form-group">
                <label>Icon</label>
                <input type="text" class="feature-icon" value="${data?.icon || 'bi-building'}" placeholder="bi-building">
            </div>
            <div class="admin-form-group">
                <label>Title</label>
                <input type="text" class="feature-title" value="${data?.title || ''}" placeholder="Feature Title">
            </div>
            <div class="admin-form-group">
                <label>Description</label>
                <textarea class="feature-description" rows="4" placeholder="Feature description...">${data?.description || ''}</textarea>
            </div>
        `;
        
        container.appendChild(item);
        
        // Initialize icon picker for this item
        const iconInput = item.querySelector('.feature-icon');
        if (iconInput) {
            initIconPicker(iconInput);
        }
    };
    
    // Add showcase item
    window.addShowcaseItem = function(data = null, index = null) {
        const container = document.getElementById('showcase_container');
        const id = index !== null ? index : itemCounters.showcase++;
        
        // Handle both old format (single image) and new format (images array)
        const images = data?.images || (data?.image ? [data.image] : []);
        const imagesHtml = images.map((img, idx) => `
            <div class="showcase-image-item" data-index="${idx}">
                <div class="admin-form-group">
                    <label>Image ${idx + 1} URL</label>
                    <input type="text" class="showcase-image-url" value="${img || ''}" placeholder="images/Projects/...">
                </div>
                <div class="image-preview showcase-image-preview" style="max-width: 300px; margin-bottom: 1rem;">
                    ${img ? `<img src="${normalizeImagePath(img)}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">` : '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>'}
                </div>
                <input type="file" class="showcase-image-input" accept="image/*" style="display: none;">
                <button type="button" class="admin-btn admin-btn-secondary showcase-image-upload-btn" style="margin-bottom: 1rem;">
                    <i class="bi bi-upload"></i> Upload Image
                </button>
                <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.showcase-image-item').remove()" style="margin-bottom: 1rem;">
                    <i class="bi bi-trash"></i> Remove Image
                </button>
            </div>
        `).join('');
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.dataset.index = id;
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Showcase Item ${id + 1}</span>
                <button type="button" class="btn-remove-item" onclick="this.closest('.repeatable-item').remove()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="item-visibility-toggle">
                <input type="checkbox" class="showcase-hidden" ${(data?.hidden !== undefined ? data.hidden : (data?.visible === false)) ? 'checked' : ''}>
                <label>Hide</label>
            </div>
            <div class="admin-form-group">
                <label>Title</label>
                <input type="text" class="showcase-title" value="${data?.title || ''}" placeholder="Project Title">
            </div>
            <div class="admin-form-group">
                <label>Description</label>
                <input type="text" class="showcase-description" value="${data?.description || ''}" placeholder="Project description">
            </div>
            <div class="admin-form-group">
                <label>Link</label>
                <input type="text" class="showcase-link" value="${data?.link || ''}" placeholder="projects.html">
            </div>
            <div class="image-upload-container">
                <label>Images (Multiple images supported)</label>
                <div class="showcase-images-container">
                    ${imagesHtml || '<div class="showcase-image-item" data-index="0"><div class="admin-form-group"><label>Image 1 URL</label><input type="text" class="showcase-image-url" placeholder="images/Projects/..."></div><div class="image-preview showcase-image-preview" style="max-width: 300px; margin-bottom: 1rem;"><div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div></div><input type="file" class="showcase-image-input" accept="image/*" style="display: none;"><button type="button" class="admin-btn admin-btn-secondary showcase-image-upload-btn" style="margin-bottom: 1rem;"><i class="bi bi-upload"></i> Upload Image</button><button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest(\'.showcase-image-item\').remove()" style="margin-bottom: 1rem;"><i class="bi bi-trash"></i> Remove Image</button></div>'}
                </div>
                <button type="button" class="admin-btn admin-btn-secondary btn-add-item" onclick="addShowcaseImage(this)" style="margin-top: 1rem;">
                    <i class="bi bi-plus-circle"></i> Add Another Image
                </button>
            </div>
        `;
        
        // Handle image upload buttons and previews
        item.querySelectorAll('.showcase-image-input').forEach((imageInput, idx) => {
            const imagePreview = imageInput.previousElementSibling;
            const uploadBtn = imageInput.nextElementSibling;
            
            if (uploadBtn && uploadBtn.classList.contains('showcase-image-upload-btn')) {
                uploadBtn.addEventListener('click', function() {
                    imageInput.click();
                });
            }
            
            imageInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
        
        item.querySelectorAll('.showcase-image-url').forEach((urlInput) => {
            urlInput.addEventListener('input', function() {
                const preview = this.closest('.showcase-image-item').querySelector('.showcase-image-preview');
                if (this.value.trim()) {
                    const normalizedPath = normalizeImagePath(this.value.trim());
                    preview.innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                }
            });
        });
        
        container.appendChild(item);
    };
    
    // Add image to showcase item
    window.addShowcaseImage = function(button) {
        const container = button.previousElementSibling;
        const newIndex = container.querySelectorAll('.showcase-image-item').length;
        const newItem = document.createElement('div');
        newItem.className = 'showcase-image-item';
        newItem.dataset.index = newIndex;
        newItem.innerHTML = `
            <div class="admin-form-group">
                <label>Image ${newIndex + 1} URL</label>
                <input type="text" class="showcase-image-url" placeholder="images/Projects/...">
            </div>
            <div class="image-preview showcase-image-preview" style="max-width: 300px; margin-bottom: 1rem;">
                <div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>
            </div>
            <input type="file" class="showcase-image-input" accept="image/*" style="display: none;">
            <button type="button" class="admin-btn admin-btn-secondary showcase-image-upload-btn" style="margin-bottom: 1rem;">
                <i class="bi bi-upload"></i> Upload Image
            </button>
            <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.showcase-image-item').remove()" style="margin-bottom: 1rem;">
                <i class="bi bi-trash"></i> Remove Image
            </button>
        `;
        
        // Create a temporary container for folder selector
        const tempContainer = document.createElement('div');
        tempContainer.className = 'image-upload-container';
        tempContainer.id = `showcase-folder-${Date.now()}-${newIndex}`;
        tempContainer.appendChild(newItem);
        
        // Add folder selector
        if (window.createFolderSelector) {
            const folderSelector = window.createFolderSelector(tempContainer.id, 'images/showcase', function(selectedFolder) {
                if (folderSelector) {
                    folderSelector.dataset.selectedFolder = selectedFolder;
                }
            });
            if (folderSelector) {
                tempContainer.appendChild(folderSelector);
            }
        }
        
        const imageInput = newItem.querySelector('.showcase-image-input');
        const imagePreview = newItem.querySelector('.showcase-image-preview');
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        const urlInput = newItem.querySelector('.showcase-image-url');
        urlInput.addEventListener('input', function() {
            if (this.value.trim()) {
                imagePreview.innerHTML = `<img src="${this.value}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
        });
        
        // Extract newItem from tempContainer and add to actual container
        container.appendChild(newItem);
        if (tempContainer.querySelector('.folder-selector-container')) {
            const folderSelector = tempContainer.querySelector('.folder-selector-container');
            newItem.appendChild(folderSelector);
        }
    };
    
    // Add testimonial
    window.addTestimonial = function(data = null, index = null) {
        const container = document.getElementById('testimonials_container');
        const id = index !== null ? index : itemCounters.testimonials++;
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.dataset.index = id;
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Testimonial ${id + 1}</span>
                <button type="button" class="btn-remove-item" onclick="this.closest('.repeatable-item').remove()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="item-visibility-toggle">
                <input type="checkbox" class="testimonial-hidden" ${(data?.hidden !== undefined ? data.hidden : (data?.visible === false)) ? 'checked' : ''}>
                <label>Hide</label>
            </div>
            <div class="admin-form-group">
                <label>Rating (1-5 stars)</label>
                <input type="number" class="testimonial-rating" min="1" max="5" value="${data?.rating || 5}">
            </div>
            <div class="admin-form-group">
                <label>Quote</label>
                <textarea class="testimonial-quote" rows="3" placeholder="Testimonial quote...">${data?.quote || ''}</textarea>
            </div>
            <div class="admin-form-group">
                <label>Author Name</label>
                <input type="text" class="testimonial-author-name" value="${data?.authorName || ''}" placeholder="Author Name">
            </div>
            <div class="admin-form-group">
                <label>Author Title</label>
                <input type="text" class="testimonial-author-title" value="${data?.authorTitle || ''}" placeholder="Author Title">
            </div>
            <div class="admin-form-group">
                <label>Avatar Initials</label>
                <input type="text" class="testimonial-avatar" value="${data?.avatar || ''}" placeholder="MP" maxlength="2">
            </div>
        `;
        
        container.appendChild(item);
    };
    
    // Add news item
    window.addNewsItem = function(data = null, index = null) {
        const container = document.getElementById('news_container');
        const id = index !== null ? index : itemCounters.news++;
        
        // Handle both old format (single image) and new format (images array)
        const images = data?.images || (data?.image ? [data.image] : []);
        const imagesHtml = images.map((img, idx) => `
            <div class="news-image-item" data-index="${idx}">
                <div class="admin-form-group">
                    <label>Image ${idx + 1} URL</label>
                    <input type="text" class="news-image-url" value="${img || ''}" placeholder="images/Projects/...">
                </div>
                <div class="image-preview news-image-preview" style="max-width: 300px; margin-bottom: 1rem;">
                    ${img ? `<img src="${normalizeImagePath(img)}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">` : '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>'}
                </div>
                <input type="file" class="news-image-input" accept="image/*" style="display: none;">
                <button type="button" class="admin-btn admin-btn-secondary news-image-upload-btn" style="margin-bottom: 1rem;">
                    <i class="bi bi-upload"></i> Upload Image
                </button>
                <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.news-image-item').remove()" style="margin-bottom: 1rem;">
                    <i class="bi bi-trash"></i> Remove Image
                </button>
            </div>
        `).join('');
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.dataset.index = id;
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">News Item ${id + 1}</span>
                <button type="button" class="btn-remove-item" onclick="this.closest('.repeatable-item').remove()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="item-visibility-toggle">
                <input type="checkbox" class="news-hidden" ${(data?.hidden !== undefined ? data.hidden : (data?.visible === false)) ? 'checked' : ''}>
                <label>Hide</label>
            </div>
            <div class="admin-form-group">
                <label>Category</label>
                <input type="text" class="news-category" value="${data?.category || ''}" placeholder="Award">
            </div>
            <div class="admin-form-group">
                <label>Title</label>
                <input type="text" class="news-title" value="${data?.title || ''}" placeholder="News Title">
            </div>
            <div class="admin-form-group">
                <label>Description</label>
                <textarea class="news-description" rows="3" placeholder="News description...">${data?.description || ''}</textarea>
            </div>
            <div class="admin-form-group">
                <label>Date</label>
                <input type="text" class="news-date" value="${data?.date || ''}" placeholder="2025">
            </div>
            <div class="admin-form-group">
                <label>Link</label>
                <input type="text" class="news-link" value="${data?.link || ''}" placeholder="https://...">
            </div>
            <div class="image-upload-container">
                <label>Images (Multiple images supported)</label>
                <div class="news-images-container">
                    ${imagesHtml || '<div class="news-image-item" data-index="0"><div class="admin-form-group"><label>Image 1 URL</label><input type="text" class="news-image-url" placeholder="images/Projects/..."></div><div class="image-preview news-image-preview" style="max-width: 300px; margin-bottom: 1rem;"><div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div></div><input type="file" class="news-image-input" accept="image/*" style="display: none;"><button type="button" class="admin-btn admin-btn-secondary news-image-upload-btn" style="margin-bottom: 1rem;"><i class="bi bi-upload"></i> Upload Image</button><button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest(\'.news-image-item\').remove()" style="margin-bottom: 1rem;"><i class="bi bi-trash"></i> Remove Image</button></div>'}
                </div>
                <button type="button" class="admin-btn admin-btn-secondary btn-add-item" onclick="addNewsImage(this)" style="margin-top: 1rem;">
                    <i class="bi bi-plus-circle"></i> Add Another Image
                </button>
            </div>
        `;
        
        // Handle image upload buttons and previews
        item.querySelectorAll('.news-image-input').forEach((imageInput) => {
            const imagePreview = imageInput.previousElementSibling;
            const uploadBtn = imageInput.nextElementSibling;
            
            if (uploadBtn && uploadBtn.classList.contains('news-image-upload-btn')) {
                uploadBtn.addEventListener('click', function() {
                    imageInput.click();
                });
            }
            
            imageInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
        
        item.querySelectorAll('.news-image-url').forEach((urlInput) => {
            urlInput.addEventListener('input', function() {
                const preview = this.closest('.news-image-item').querySelector('.news-image-preview');
                if (this.value.trim()) {
                    const normalizedPath = normalizeImagePath(this.value.trim());
                    preview.innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                }
            });
        });
        
        container.appendChild(item);
    };
    
    // Add image to news item
    window.addNewsImage = function(button) {
        const container = button.previousElementSibling;
        const newIndex = container.querySelectorAll('.news-image-item').length;
        const newItem = document.createElement('div');
        newItem.className = 'news-image-item';
        newItem.dataset.index = newIndex;
        newItem.innerHTML = `
            <div class="admin-form-group">
                <label>Image ${newIndex + 1} URL</label>
                <input type="text" class="news-image-url" placeholder="images/Projects/...">
            </div>
            <div class="image-preview news-image-preview" style="max-width: 300px; margin-bottom: 1rem;">
                <div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image</p></div>
            </div>
            <input type="file" class="news-image-input" accept="image/*" style="display: none;">
            <button type="button" class="admin-btn admin-btn-secondary news-image-upload-btn" style="margin-bottom: 1rem;">
                <i class="bi bi-upload"></i> Upload Image
            </button>
            <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.news-image-item').remove()" style="margin-bottom: 1rem;">
                <i class="bi bi-trash"></i> Remove Image
            </button>
        `;
        
        const imageInput = newItem.querySelector('.news-image-input');
        const imagePreview = newItem.querySelector('.news-image-preview');
        const uploadBtn = newItem.querySelector('.news-image-upload-btn');
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', function() {
                imageInput.click();
            });
        }
        
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        const urlInput = newItem.querySelector('.news-image-url');
        urlInput.addEventListener('input', function() {
            if (this.value.trim()) {
                imagePreview.innerHTML = `<img src="${this.value}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
        });
        
        container.appendChild(newItem);
        
        // Add folder selector after item is added
        const tempContainer = document.createElement('div');
        tempContainer.className = 'image-upload-container';
        tempContainer.id = `news-folder-${Date.now()}-${newIndex}`;
        if (window.createFolderSelector) {
            const folderSelector = window.createFolderSelector(tempContainer.id, 'images/news', function(selectedFolder) {
                if (folderSelector) {
                    folderSelector.dataset.selectedFolder = selectedFolder;
                }
            });
            if (folderSelector) {
                newItem.appendChild(folderSelector);
            }
        }
    };
    
    // Add stat
    window.addStat = function(data = null, index = null) {
        const container = document.getElementById('stats_container');
        const id = index !== null ? index : itemCounters.stats++;
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.dataset.index = id;
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Statistic ${id + 1}</span>
                <button type="button" class="btn-remove-item" onclick="this.closest('.repeatable-item').remove()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="admin-form-group">
                <label>Number/Value</label>
                <input type="text" class="stat-number" value="${data?.number || ''}" placeholder="152">
            </div>
            <div class="admin-form-group">
                <label>Label</label>
                <input type="text" class="stat-label" value="${data?.label || ''}" placeholder="Hectares Developed">
            </div>
        `;
        
        container.appendChild(item);
    };
    
    // Form submission
    document.getElementById('homePageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            showLoading();
            
            // Collect hero data - use URL if provided, otherwise try upload
            const heroImages = [];
            
            // Image 1
            const heroImage1Url = document.getElementById('hero_image1_url')?.value.trim();
            const heroImage1 = document.getElementById('hero_image1').files[0];
            if (heroImage1Url) {
                heroImages.push(heroImage1Url);
            } else if (heroImage1) {
                const url1 = await handleImageUpload('hero_image1', 'hero_image1_preview', 'images/hero', null);
                if (url1) heroImages.push(url1);
            } else if (pageData.hero?.images?.[0]) {
                heroImages.push(pageData.hero.images[0]);
            }
            
            // Image 2
            const heroImage2Url = document.getElementById('hero_image2_url')?.value.trim();
            const heroImage2 = document.getElementById('hero_image2').files[0];
            if (heroImage2Url) {
                heroImages.push(heroImage2Url);
            } else if (heroImage2) {
                const url2 = await handleImageUpload('hero_image2', 'hero_image2_preview', 'images/hero', null);
                if (url2) heroImages.push(url2);
            } else if (pageData.hero?.images?.[1]) {
                heroImages.push(pageData.hero.images[1]);
            }
            
            pageData.hero = {
                title: document.getElementById('hero_title').value,
                subtitle: document.getElementById('hero_subtitle').value,
                button1: {
                    text: document.getElementById('hero_button1_text').value,
                    link: document.getElementById('hero_button1_link').value
                },
                button2: {
                    text: document.getElementById('hero_button2_text').value,
                    link: document.getElementById('hero_button2_link').value
                },
                images: heroImages
            };
            
            // Collect video data - use URL if provided, otherwise try upload
            const videoFileUrl = document.getElementById('video_file_url')?.value.trim();
            const videoFile = document.getElementById('video_file').files[0];
            let videoUrl = pageData.video?.url || '';
            if (videoFileUrl) {
                videoUrl = videoFileUrl;
            } else if (videoFile) {
                const uploadedUrl = await handleVideoUpload('video_file', 'video_preview', 'videos', null);
                if (uploadedUrl) videoUrl = uploadedUrl;
            }
            
            const videoPosterUrl = document.getElementById('video_poster_url')?.value.trim();
            const videoPoster = document.getElementById('video_poster').files[0];
            let posterUrl = pageData.video?.poster || '';
            if (videoPosterUrl) {
                posterUrl = videoPosterUrl;
            } else if (videoPoster) {
                const uploadedPoster = await handleImageUpload('video_poster', 'video_poster_preview', 'images/video', null);
                if (uploadedPoster) posterUrl = uploadedPoster;
            }
            
            pageData.video = {
                title: document.getElementById('video_title').value,
                subtitle: document.getElementById('video_subtitle').value,
                url: videoUrl,
                poster: posterUrl
            };
            
            // Collect features
            const features = [];
            document.querySelectorAll('#features_container .repeatable-item').forEach(item => {
                features.push({
                    icon: item.querySelector('.feature-icon').value,
                    title: item.querySelector('.feature-title').value,
                    description: item.querySelector('.feature-description').value,
                    hidden: item.querySelector('.feature-hidden')?.checked || false
                });
            });
            
            pageData.features = {
                title: document.getElementById('features_title').value,
                subtitle: document.getElementById('features_subtitle').value,
                hidden: document.getElementById('features_hidden')?.checked || false,
                items: features
            };
            
            // Collect showcase items
            const showcaseItems = [];
            for (const item of document.querySelectorAll('#showcase_container .repeatable-item')) {
                const images = [];
                const imageItems = item.querySelectorAll('.showcase-image-item');
                
                for (const imageItem of imageItems) {
                    const urlInput = imageItem.querySelector('.showcase-image-url');
                    const imageInput = imageItem.querySelector('.showcase-image-input');
                    let imageUrl = '';
                    
                    // Prioritize URL input
                    if (urlInput && urlInput.value.trim()) {
                        imageUrl = urlInput.value.trim();
                    } else if (imageInput && imageInput.files[0]) {
                        // Upload file if provided
                        const file = imageInput.files[0];
                        const timestamp = Date.now();
                        const fileName = `${timestamp}_${file.name}`;
                        const selectedFolder = window.getSelectedFolder(imageInput, 'images/showcase');
                        imageUrl = await uploadImage(file, `${selectedFolder}/${fileName}`);
                    } else {
                        // Try to get from preview
                        const previewImg = imageItem.querySelector('.showcase-image-preview img');
                        if (previewImg && previewImg.src && !previewImg.src.startsWith('data:')) {
                            imageUrl = previewImg.src;
                        }
                    }
                    
                    if (imageUrl) {
                        images.push(imageUrl);
                    }
                }
                
                showcaseItems.push({
                    title: item.querySelector('.showcase-title').value,
                    description: item.querySelector('.showcase-description').value,
                    link: item.querySelector('.showcase-link').value,
                    images: images,
                    hidden: item.querySelector('.showcase-hidden')?.checked || false
                });
            }
            
            pageData.showcase = {
                title: document.getElementById('showcase_title').value,
                subtitle: document.getElementById('showcase_subtitle').value,
                hidden: document.getElementById('showcase_hidden')?.checked || false,
                items: showcaseItems
            };
            
            // Collect testimonials
            const testimonials = [];
            document.querySelectorAll('#testimonials_container .repeatable-item').forEach(item => {
                testimonials.push({
                    rating: parseInt(item.querySelector('.testimonial-rating').value),
                    quote: item.querySelector('.testimonial-quote').value,
                    authorName: item.querySelector('.testimonial-author-name').value,
                    authorTitle: item.querySelector('.testimonial-author-title').value,
                    avatar: item.querySelector('.testimonial-avatar').value,
                    hidden: item.querySelector('.testimonial-hidden')?.checked || false
                });
            });
            
            pageData.testimonials = {
                title: document.getElementById('testimonials_title').value,
                subtitle: document.getElementById('testimonials_subtitle').value,
                hidden: document.getElementById('testimonials_hidden')?.checked || false,
                items: testimonials
            };
            
            // Collect news items
            const newsItems = [];
            for (const item of document.querySelectorAll('#news_container .repeatable-item')) {
                const images = [];
                const imageItems = item.querySelectorAll('.news-image-item');
                
                for (const imageItem of imageItems) {
                    const urlInput = imageItem.querySelector('.news-image-url');
                    const imageInput = imageItem.querySelector('.news-image-input');
                    let imageUrl = '';
                    
                    // Prioritize URL input
                    if (urlInput && urlInput.value.trim()) {
                        imageUrl = urlInput.value.trim();
                    } else if (imageInput && imageInput.files[0]) {
                        // Upload file if provided
                        const file = imageInput.files[0];
                        const timestamp = Date.now();
                        const fileName = `${timestamp}_${file.name}`;
                        const selectedFolder = window.getSelectedFolder(imageInput, 'images/news');
                        imageUrl = await uploadImage(file, `${selectedFolder}/${fileName}`);
                    } else {
                        // Try to get from preview
                        const previewImg = imageItem.querySelector('.news-image-preview img');
                        if (previewImg && previewImg.src && !previewImg.src.startsWith('data:')) {
                            imageUrl = previewImg.src;
                        }
                    }
                    
                    if (imageUrl) {
                        images.push(imageUrl);
                    }
                }
                
                newsItems.push({
                    category: item.querySelector('.news-category').value,
                    title: item.querySelector('.news-title').value,
                    description: item.querySelector('.news-description').value,
                    date: item.querySelector('.news-date').value,
                    link: item.querySelector('.news-link').value,
                    images: images,
                    hidden: item.querySelector('.news-hidden')?.checked || false
                });
            }
            
            pageData.news = {
                title: document.getElementById('news_title').value,
                subtitle: document.getElementById('news_subtitle').value,
                hidden: document.getElementById('news_hidden')?.checked || false,
                items: newsItems
            };
            
            // Collect stats
            const stats = [];
            document.querySelectorAll('#stats_container .repeatable-item').forEach(item => {
                stats.push({
                    number: item.querySelector('.stat-number').value,
                    label: item.querySelector('.stat-label').value
                });
            });
            
            pageData.stats = {
                items: stats
            };
            
            // Footer removed - now handled in footer-admin.html
            
            // Save to Firebase
            await saveToFirestore('pages', 'index', pageData);
            
            hideLoading();
            showAlert('All changes saved successfully!', 'success');
            
        } catch (error) {
            hideLoading();
            console.error('Save error:', error);
            showAlert('Error saving: ' + error.message, 'error');
        }
    });
    
    // Initialize image previews
    initImagePreview('hero_image1', 'hero_image1_preview');
    initImagePreview('hero_image2', 'hero_image2_preview');
    initImagePreview('video_poster', 'video_poster_preview');
    initVideoPreview('video_file', 'video_preview');
    
    // Initialize folder selectors
    if (window.initFolderSelectors) {
        window.initFolderSelectors();
    }
    
    // Add folder selectors for hero images (they're in separate containers)
    if (window.createFolderSelector) {
        const heroImage1Selector = window.createFolderSelector('hero_image1_folder_selector', 'images/hero', function(selectedFolder) {
            if (heroImage1Selector) {
                heroImage1Selector.dataset.selectedFolder = selectedFolder;
            }
        });
        
        const heroImage2Selector = window.createFolderSelector('hero_image2_folder_selector', 'images/hero', function(selectedFolder) {
            if (heroImage2Selector) {
                heroImage2Selector.dataset.selectedFolder = selectedFolder;
            }
        });
    }
    
    // Initialize image pickers for hero images
    if (window.initImagePicker) {
        const heroImage1Url = document.getElementById('hero_image1_url');
        const heroImage2Url = document.getElementById('hero_image2_url');
        if (heroImage1Url) window.initImagePicker(heroImage1Url);
        if (heroImage2Url) window.initImagePicker(heroImage2Url);
    }
    
    // Setup upload buttons
    if (document.getElementById('hero_image1_upload_btn')) {
        document.getElementById('hero_image1_upload_btn').addEventListener('click', function() {
            document.getElementById('hero_image1').click();
        });
    }
    if (document.getElementById('hero_image2_upload_btn')) {
        document.getElementById('hero_image2_upload_btn').addEventListener('click', function() {
            document.getElementById('hero_image2').click();
        });
    }
    if (document.getElementById('video_file_upload_btn')) {
        document.getElementById('video_file_upload_btn').addEventListener('click', function() {
            document.getElementById('video_file').click();
        });
    }
    if (document.getElementById('video_poster_upload_btn')) {
        document.getElementById('video_poster_upload_btn').addEventListener('click', function() {
            document.getElementById('video_poster').click();
        });
    }
    
    // Handle URL inputs for preview
    if (document.getElementById('hero_image1_url')) {
        document.getElementById('hero_image1_url').addEventListener('input', function(e) {
            const url = e.target.value.trim();
            if (url) {
                const normalizedPath = normalizeImagePath(url);
                document.getElementById('hero_image1_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
        });
    }
    if (document.getElementById('hero_image2_url')) {
        document.getElementById('hero_image2_url').addEventListener('input', function(e) {
            const url = e.target.value.trim();
            if (url) {
                const normalizedPath = normalizeImagePath(url);
                document.getElementById('hero_image2_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
        });
    }
    if (document.getElementById('video_file_url')) {
        document.getElementById('video_file_url').addEventListener('input', function(e) {
            const url = e.target.value.trim();
            if (url) {
                const normalizedPath = normalizeVideoPath(url);
                document.getElementById('video_preview').innerHTML = `<video controls><source src="${normalizedPath}"></video>`;
            }
        });
    }
    if (document.getElementById('video_poster_url')) {
        document.getElementById('video_poster_url').addEventListener('input', function(e) {
            const url = e.target.value.trim();
            if (url) {
                const normalizedPath = normalizeImagePath(url);
                document.getElementById('video_poster_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
        });
    }
})();

