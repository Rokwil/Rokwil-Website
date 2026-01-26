// Contact Admin Page Script
(function() {
    'use strict';
    
    let pageData = {};
    
    // Check authentication
    checkAdminAuth().then((user) => {
        document.getElementById('adminUserEmail').textContent = user.email;
        loadPageData();
    });
    
    let itemCounter = 0;
    
    // Load page data from Firebase
    async function loadPageData() {
        const data = await loadFromFirestore('pages', 'contact');
        if (data) {
            pageData = data;
        } else {
            initializeDefaults();
        }
        populateForm();
    }
    
    // Initialize default structure
    function initializeDefaults() {
        pageData = {
            pageHero: { title: '', subtitle: '', image: '' },
            contactForm: { title: '' },
            contactInfo: { title: '', items: [] }
        };
    }
    
    // Populate form with data
    function populateForm() {
        if (pageData.pageHero) {
            document.getElementById('contact_hero_title').value = pageData.pageHero.title || '';
            document.getElementById('contact_hero_subtitle').value = pageData.pageHero.subtitle || '';
            if (pageData.pageHero.image) {
                const normalizedPath = normalizeImagePath(pageData.pageHero.image);
                if (document.getElementById('contact_hero_image_url')) {
                    document.getElementById('contact_hero_image_url').value = pageData.pageHero.image;
                }
                document.getElementById('contact_hero_image_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
        }
        
        if (pageData.contactForm) {
            document.getElementById('contact_form_title').value = pageData.contactForm.title || '';
        }
        
        if (pageData.contactInfo) {
            document.getElementById('contact_info_title').value = pageData.contactInfo.title || '';
            if (pageData.contactInfo.items && pageData.contactInfo.items.length > 0) {
                pageData.contactInfo.items.forEach((item, index) => {
                    addContactInfoItem(item, index);
                });
            }
        }
    }
    
    // Add contact info item
    window.addContactInfoItem = function(data = null, index = null) {
        const container = document.getElementById('contact_info_container');
        const id = index !== null ? index : itemCounter++;
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.dataset.index = id;
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Contact Info Item ${id + 1}</span>
                <button type="button" class="btn-remove-item" onclick="removeContactInfoItem(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="admin-form-group">
                <label>Icon</label>
                <input type="text" class="contact-info-icon" value="${data?.icon || 'bi-geo-alt-fill'}" placeholder="bi-geo-alt-fill">
            </div>
            <div class="admin-form-group">
                <label>Item Title</label>
                <input type="text" class="contact-info-title" value="${data?.title || ''}" placeholder="Location">
            </div>
            <div class="admin-form-group">
                <label>Item Content (HTML supported)</label>
                <textarea class="contact-info-content" rows="3" placeholder="Durban, KwaZulu-Natal<br>South Africa">${data?.content || ''}</textarea>
                <small>You can use HTML like &lt;br&gt; for line breaks</small>
            </div>
        `;
        
        container.appendChild(item);
        
        // Initialize icon picker for this item
        const iconInput = item.querySelector('.contact-info-icon');
        if (iconInput) {
            initIconPicker(iconInput);
        }
    };
    
    // Form submission
    document.getElementById('contactPageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            showLoading();
            
            // Collect page hero
            const heroImageUrl = document.getElementById('contact_hero_image_url')?.value.trim();
            const heroImage = document.getElementById('contact_hero_image').files[0];
            let finalHeroImageUrl = pageData.pageHero?.image || '';
            if (heroImageUrl) {
                finalHeroImageUrl = heroImageUrl;
            } else if (heroImage) {
                finalHeroImageUrl = await handleImageUpload('contact_hero_image', 'contact_hero_image_preview', 'images/contact', null);
            }
            
            pageData.pageHero = {
                title: document.getElementById('contact_hero_title').value,
                subtitle: document.getElementById('contact_hero_subtitle').value,
                image: finalHeroImageUrl
            };
            
            // Collect contact form
            pageData.contactForm = {
                title: document.getElementById('contact_form_title').value || ''
            };
            
            // Collect contact info items
            const contactInfoItems = [];
            document.querySelectorAll('#contact_info_container .repeatable-item').forEach(item => {
                contactInfoItems.push({
                    icon: item.querySelector('.contact-info-icon')?.value || '',
                    title: item.querySelector('.contact-info-title')?.value || '',
                    content: item.querySelector('.contact-info-content')?.value || ''
                });
            });
            
            pageData.contactInfo = {
                title: document.getElementById('contact_info_title').value || '',
                items: contactInfoItems
            };
            
            // Remove undefined values before saving
            const cleanedData = removeUndefinedValues(pageData);
            
            // Save to Firebase
            await saveToFirestore('pages', 'contact', cleanedData);
            
            // Update local pageData
            pageData = cleanedData;
            
            hideLoading();
            showAlert('All changes saved successfully!', 'success');
            
        } catch (error) {
            hideLoading();
            console.error('Save error:', error);
            showAlert('Error saving: ' + error.message, 'error');
        }
    });
    
    // Initialize image preview
    initImagePreview('contact_hero_image', 'contact_hero_image_preview');
    
    // Initialize folder selectors
    if (window.initFolderSelectors) {
        window.initFolderSelectors();
    }
    
    // Initialize image picker for hero image
    if (window.initImagePicker) {
        const contactHeroImageUrl = document.getElementById('contact_hero_image_url');
        if (contactHeroImageUrl) window.initImagePicker(contactHeroImageUrl);
    }
    
    // Add input listener for hero image URL
    if (document.getElementById('contact_hero_image_url')) {
        document.getElementById('contact_hero_image_url').addEventListener('input', function() {
            const url = this.value.trim();
            if (url) {
                const normalizedPath = normalizeImagePath(url);
                document.getElementById('contact_hero_image_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            } else {
                document.getElementById('contact_hero_image_preview').innerHTML = '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image selected</p></div>';
            }
        });
    }
    
    // Setup upload button
    if (document.getElementById('contact_hero_image_upload_btn')) {
        document.getElementById('contact_hero_image_upload_btn').addEventListener('click', function() {
            document.getElementById('contact_hero_image').click();
        });
    }
    
    // Utility function to remove undefined values from objects (Firestore doesn't allow them)
    function removeUndefinedValues(obj) {
        if (obj === null || obj === undefined) {
            return null;
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
})();

