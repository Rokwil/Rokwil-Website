// About Admin Page Script
(function() {
    'use strict';
    
    let pageData = {};
    let itemCounters = {
        statsBanner: 0,
        timeline: 0,
        values: 0,
        csr: 0,
        recognition: 0
    };
    let storyQuill = null;
    
    // Prevent auto-scroll on page load
    let scrollPosition = window.scrollY || window.pageYOffset;
    window.scrollTo(0, 0);
    
    // Check authentication
    checkAdminAuth().then((user) => {
        document.getElementById('adminUserEmail').textContent = user.email;
        loadPageData();
    });
    
    // Prevent any auto-scrolling during initialization
    let preventAutoScroll = true;
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(...args) {
        if (preventAutoScroll) {
            return; // Prevent scrolling during initialization
        }
        return originalScrollIntoView.apply(this, args);
    };
    
    // Re-enable scrolling after a short delay
    setTimeout(() => {
        preventAutoScroll = false;
        Element.prototype.scrollIntoView = originalScrollIntoView;
    }, 1000);
    
    // Load page data from Firebase
    async function loadPageData() {
        const data = await loadFromFirestore('pages', 'about');
        console.log('Loaded data from Firebase:', data);
        if (data && Object.keys(data).length > 0) {
            // Merge with defaults to ensure all fields exist
            pageData = { ...initializeDefaults(), ...data };
            console.log('Using Firebase data:', pageData);
        } else {
            // Initialize with default structure
            pageData = initializeDefaults();
            // Try to load from HTML as fallback
            await loadFromHTML();
            console.log('Using HTML fallback data:', pageData);
        }
        // Always populate form, even if data is empty
        populateForm();
        
        // Ensure page stays at top after form population
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    }
    
    // Initialize default structure
    function initializeDefaults() {
        return {
            pageHero: { title: '', subtitle: '', image: '' },
            statsBanner: { items: [] },
            aboutStory: { title: '', content: '', paragraphs: [], image: '' },
            mission: { text: '' },
            timeline: { title: '', subtitle: '', hidden: false, items: [] },
            values: { title: '', hidden: false, items: [] },
            leadership: { title: '', subtitle: '', name: '', titleRole: '', bio: '', initials: '', tags: [] },
            csr: { title: '', subtitle: '', hidden: false, items: [] },
            recognition: { title: '', subtitle: '', hidden: false, items: [] }
        };
    }
    
    // Load from HTML as fallback
    async function loadFromHTML() {
        try {
            const response = await fetch('../about.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Load About Story
            const aboutText = doc.querySelector('.about-text');
            if (aboutText) {
                const storyTitle = aboutText.querySelector('h2')?.textContent?.trim() || '';
                const storyParagraphs = Array.from(aboutText.querySelectorAll('p')).map(p => p.textContent?.trim() || '').filter(p => p);
                const storyImage = doc.querySelector('.about-image img')?.src || '';
                
                if (storyTitle || storyParagraphs.length > 0) {
                    pageData.aboutStory = {
                        title: storyTitle,
                        content: storyParagraphs.join('\n\n'),
                        paragraphs: storyParagraphs,
                        image: storyImage
                    };
                }
            }
            
            // Load mission
            const missionBox = doc.querySelector('[style*="Our Mission"]');
            if (missionBox) {
                const missionText = missionBox.querySelector('p')?.textContent?.trim() || '';
                if (missionText) {
                    pageData.mission = { text: missionText };
                }
            }
            
            // Load CSR title and subtitle
            const csrSection = doc.querySelector('[style*="Corporate Social Responsibility"]')?.closest('div');
            if (csrSection) {
                const csrTitle = csrSection.querySelector('.section-title')?.textContent?.trim() || '';
                const csrSubtitle = csrSection.querySelector('.section-subtitle')?.textContent?.trim() || '';
                if (csrTitle || csrSubtitle) {
                    pageData.csr = {
                        title: csrTitle,
                        subtitle: csrSubtitle,
                        items: pageData.csr?.items || []
                    };
                }
            }
            
            // Load Recognition title and subtitle
            const recognitionSection = doc.querySelector('[style*="Recognition & Partnerships"]')?.closest('div');
            if (recognitionSection) {
                const recognitionTitle = recognitionSection.querySelector('.section-title')?.textContent?.trim() || '';
                const recognitionSubtitle = recognitionSection.querySelector('.section-subtitle')?.textContent?.trim() || '';
                if (recognitionTitle || recognitionSubtitle) {
                    pageData.recognition = {
                        title: recognitionTitle,
                        subtitle: recognitionSubtitle,
                        items: pageData.recognition?.items || []
                    };
                }
            }
        } catch (err) {
            console.log('Could not load from HTML:', err);
        }
    }
    
    // Populate form with data
    function populateForm() {
        console.log('Populating form with data:', pageData);
        
        if (pageData.pageHero) {
            document.getElementById('page_hero_title').value = pageData.pageHero.title || '';
            document.getElementById('page_hero_subtitle').value = pageData.pageHero.subtitle || '';
            if (pageData.pageHero.image) {
                const normalizedPath = normalizeImagePath(pageData.pageHero.image);
                if (document.getElementById('page_hero_image_url')) {
                    document.getElementById('page_hero_image_url').value = pageData.pageHero.image;
                }
                document.getElementById('page_hero_image_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            }
        }
        
        if (pageData.aboutStory) {
            console.log('Populating About Story:', pageData.aboutStory);
            const titleEl = document.getElementById('about_story_title');
            const contentEl = document.getElementById('about_story_content');
            
            if (titleEl) {
                titleEl.value = pageData.aboutStory.title || '';
                console.log('Set story title to:', titleEl.value);
            }
            
            if (contentEl) {
                // Prioritize content field (what admin form uses), fallback to paragraphs array
                let contentValue = '';
                if (pageData.aboutStory.content && pageData.aboutStory.content.trim()) {
                    // Use content field directly (this is what gets saved from the form)
                    contentValue = pageData.aboutStory.content;
                    console.log('Using content field from Firebase, length:', contentValue.length);
                } else if (pageData.aboutStory.paragraphs && Array.isArray(pageData.aboutStory.paragraphs) && pageData.aboutStory.paragraphs.length > 0) {
                    // Fallback: reconstruct from paragraphs array
                    contentValue = pageData.aboutStory.paragraphs.map(p => {
                        if (typeof p === 'string') return p;
                        // Handle objects with text and strong properties
                        let paraText = p.text || '';
                        if (p.strong && paraText.includes(p.strong)) {
                            // Strong text is already in the text, just return it
                            return paraText;
                        }
                        return paraText;
                    }).join('\n\n');
                    console.log('Using paragraphs array (fallback), joined content length:', contentValue.length);
                }
                
                // Set in hidden input
                contentEl.value = contentValue;
                
                // If Quill is initialized, set content in Quill
                if (storyQuill && storyQuill.root) {
                    // Check if content is HTML (contains tags) or plain text
                    const isHTML = typeof contentValue === 'string' && (contentValue.includes('<') || contentValue.includes('&lt;'));
                    if (isHTML) {
                        // Fix relative URLs
                        let fixedContent = contentValue
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
                            if (storyQuill && storyQuill.root) {
                                storyQuill.clipboard.dangerouslyPasteHTML(0, fixedContent);
                                const hiddenInput = document.getElementById('about_story_content');
                                if (hiddenInput) {
                                    hiddenInput.value = storyQuill.root.innerHTML;
                                }
                                // Keep page at top after setting content
                                window.scrollTo(0, 0);
                            }
                        }, 200);
                    } else {
                        // Plain text - convert newlines to HTML
                        const htmlContent = contentValue.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
                        setTimeout(() => {
                            if (storyQuill && storyQuill.root) {
                                storyQuill.clipboard.dangerouslyPasteHTML(0, htmlContent);
                                const hiddenInput = document.getElementById('about_story_content');
                                if (hiddenInput) {
                                    hiddenInput.value = storyQuill.root.innerHTML;
                                }
                                // Keep page at top after setting content
                                window.scrollTo(0, 0);
                            }
                        }, 200);
                    }
                }
                
                console.log('Set story content to:', contentValue.substring(0, 100) + '...');
            }
            
            if (pageData.aboutStory.image) {
                const previewEl = document.getElementById('about_story_image_preview');
                const urlInput = document.getElementById('about_story_image_url');
                if (previewEl) {
                    const normalizedPath = normalizeImagePath(pageData.aboutStory.image);
                    previewEl.innerHTML = `<img src="${normalizedPath}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
                }
                if (urlInput) {
                    urlInput.value = pageData.aboutStory.image;
                }
            }
        } else {
            console.warn('No aboutStory data found in pageData');
        }
        
        // Mission - always initialize field
        const missionTextEl = document.getElementById('mission_text');
        if (missionTextEl) {
            missionTextEl.value = pageData.mission?.text || '';
            console.log('Mission text set to:', missionTextEl.value);
        } else {
            console.error('Mission text element not found!');
        }
        
        if (pageData.statsBanner && pageData.statsBanner.items) {
            pageData.statsBanner.items.forEach((item, index) => {
                addStatBannerItem(item, index);
            });
        }
        
        if (pageData.timeline) {
            document.getElementById('timeline_title').value = pageData.timeline.title || '';
            document.getElementById('timeline_subtitle').value = pageData.timeline.subtitle || '';
            const timelineHiddenCheckbox = document.getElementById('timeline_hidden');
            if (timelineHiddenCheckbox) {
                timelineHiddenCheckbox.checked = pageData.timeline.hidden || false;
            }
            if (pageData.timeline.items) {
                pageData.timeline.items.forEach((item, index) => {
                    addTimelineItem(item, index);
                });
            }
        }
        
        if (pageData.values) {
            document.getElementById('values_title').value = pageData.values.title || '';
            const valuesHiddenCheckbox = document.getElementById('values_hidden');
            if (valuesHiddenCheckbox) {
                valuesHiddenCheckbox.checked = pageData.values.hidden || false;
            }
            if (pageData.values.items) {
                pageData.values.items.forEach((item, index) => {
                    addValue(item, index);
                });
            }
        }
        
        if (pageData.leadership) {
            document.getElementById('leadership_title').value = pageData.leadership.title || '';
            document.getElementById('leadership_subtitle').value = pageData.leadership.subtitle || '';
            document.getElementById('leadership_name').value = pageData.leadership.name || '';
            document.getElementById('leadership_title_role').value = pageData.leadership.titleRole || '';
            document.getElementById('leadership_bio').value = pageData.leadership.bio || '';
            document.getElementById('leadership_initials').value = pageData.leadership.initials || '';
        }
        
        // CSR - always show fields, even if empty
        const csrTitleEl = document.getElementById('csr_title');
        const csrSubtitleEl = document.getElementById('csr_subtitle');
        if (csrTitleEl) {
            csrTitleEl.value = pageData.csr?.title || '';
            console.log('CSR title set to:', csrTitleEl.value);
        } else {
            console.error('CSR title element not found!');
        }
        if (csrSubtitleEl) {
            csrSubtitleEl.value = pageData.csr?.subtitle || '';
            console.log('CSR subtitle set to:', csrSubtitleEl.value);
        } else {
            console.error('CSR subtitle element not found!');
        }
        const csrHiddenCheckbox = document.getElementById('csr_hidden');
        if (csrHiddenCheckbox) {
            csrHiddenCheckbox.checked = pageData.csr?.hidden || false;
        }
        if (pageData.csr?.items && pageData.csr.items.length > 0) {
            pageData.csr.items.forEach((item, index) => {
                addCSRItem(item, index);
            });
        }
        
        // Recognition - always show fields, even if empty
        const recognitionTitleEl = document.getElementById('recognition_title');
        const recognitionSubtitleEl = document.getElementById('recognition_subtitle');
        if (recognitionTitleEl) {
            recognitionTitleEl.value = pageData.recognition?.title || '';
            console.log('Recognition title set to:', recognitionTitleEl.value);
        } else {
            console.error('Recognition title element not found!');
        }
        if (recognitionSubtitleEl) {
            recognitionSubtitleEl.value = pageData.recognition?.subtitle || '';
            console.log('Recognition subtitle set to:', recognitionSubtitleEl.value);
        } else {
            console.error('Recognition subtitle element not found!');
        }
        const recognitionHiddenCheckbox = document.getElementById('recognition_hidden');
        if (recognitionHiddenCheckbox) {
            recognitionHiddenCheckbox.checked = pageData.recognition?.hidden || false;
        }
        if (pageData.recognition?.items && pageData.recognition.items.length > 0) {
            pageData.recognition.items.forEach((item, index) => {
                addRecognitionItem(item, index);
            });
        }
        
        console.log('Form population complete');
    }
    
    // Remove stats banner item with toast
    window.removeStatsBannerItem = function(btn) {
        btn.closest('.repeatable-item').remove();
        showToast('Stat item deleted successfully', 'success');
    };
    
    // Add stat banner item
    window.addStatBannerItem = function(data = null, index = null) {
        const container = document.getElementById('stats_banner_container');
        const id = index !== null ? index : itemCounters.statsBanner++;
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Stat ${id + 1}</span>
                <button type="button" class="btn-remove-item" onclick="removeStatsBannerItem(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="admin-form-group">
                <label>Value</label>
                <input type="text" class="stat-banner-value" value="${data?.value || ''}">
            </div>
            <div class="admin-form-group">
                <label>Label</label>
                <input type="text" class="stat-banner-label" value="${data?.label || ''}">
            </div>
        `;
        container.appendChild(item);
    };
    
    // Remove item with toast notification (generic helper)
    window.removeItemWithToast = function(btn, itemType = 'Item') {
        const item = btn.closest('.repeatable-item');
        if (item) {
            item.remove();
            showToast(`${itemType} deleted successfully`, 'success');
        }
    };
    
    // Add timeline item
    window.addTimelineItem = function(data = null, index = null) {
        const container = document.getElementById('timeline_container');
        const id = index !== null ? index : itemCounters.timeline++;
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Timeline Item ${id + 1}</span>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <label class="admin-toggle">
                        <input type="checkbox" class="timeline-item-hidden" ${data?.hidden ? 'checked' : ''}>
                        <span>Hide</span>
                    </label>
                    <button type="button" class="btn-remove-item" onclick="removeItemWithToast(this, 'Timeline item')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="admin-form-group">
                <label>Year/Title</label>
                <input type="text" class="timeline-title" value="${data?.title || ''}">
            </div>
            <div class="admin-form-group">
                <label>Description</label>
                <textarea class="timeline-description" rows="3">${data?.description || ''}</textarea>
            </div>
        `;
        container.appendChild(item);
    };
    
    // Add value
    window.addValue = function(data = null, index = null) {
        const container = document.getElementById('values_container');
        const id = index !== null ? index : itemCounters.values++;
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Value ${id + 1}</span>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <label class="admin-toggle">
                        <input type="checkbox" class="value-item-hidden" ${data?.hidden ? 'checked' : ''}>
                        <span>Hide</span>
                    </label>
                    <button type="button" class="btn-remove-item" onclick="removeItemWithToast(this, 'Value item')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="admin-form-group">
                <label>Icon</label>
                <input type="text" class="value-icon" value="${data?.icon || 'bi-star'}">
            </div>
            <div class="admin-form-group">
                <label>Title</label>
                <input type="text" class="value-title" value="${data?.title || ''}">
            </div>
            <div class="admin-form-group">
                <label>Description</label>
                <textarea class="value-description" rows="3">${data?.description || ''}</textarea>
            </div>
        `;
        container.appendChild(item);
        
        // Initialize icon picker for this item
        const iconInput = item.querySelector('.value-icon');
        if (iconInput) {
            initIconPicker(iconInput);
        }
    };
    
    // Add CSR item
    window.addCSRItem = function(data = null, index = null) {
        const container = document.getElementById('csr_container');
        const id = index !== null ? index : itemCounters.csr++;
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">CSR Item ${id + 1}</span>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <label class="admin-toggle">
                        <input type="checkbox" class="csr-item-hidden" ${data?.hidden ? 'checked' : ''}>
                        <span>Hide</span>
                    </label>
                    <button type="button" class="btn-remove-item" onclick="removeItemWithToast(this, 'CSR item')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="admin-form-group">
                <label>Icon</label>
                <input type="text" class="csr-icon" value="${data?.icon || 'bi-heart'}">
            </div>
            <div class="admin-form-group">
                <label>Title</label>
                <input type="text" class="csr-title" value="${data?.title || ''}">
            </div>
            <div class="admin-form-group">
                <label>Description</label>
                <textarea class="csr-description" rows="3">${data?.description || ''}</textarea>
            </div>
        `;
        container.appendChild(item);
        
        // Initialize icon picker for this item
        const iconInput = item.querySelector('.csr-icon');
        if (iconInput) {
            initIconPicker(iconInput);
        }
    };
    
    // Add recognition item
    window.addRecognitionItem = function(data = null, index = null) {
        const container = document.getElementById('recognition_container');
        const id = index !== null ? index : (itemCounters.recognition || 0);
        if (index === null) itemCounters.recognition = (itemCounters.recognition || 0) + 1;
        
        const item = document.createElement('div');
        item.className = 'repeatable-item';
        item.innerHTML = `
            <div class="repeatable-item-header">
                <span class="repeatable-item-title">Recognition Item ${id + 1}</span>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <label class="admin-toggle">
                        <input type="checkbox" class="recognition-item-hidden" ${data?.hidden ? 'checked' : ''}>
                        <span>Hide</span>
                    </label>
                    <button type="button" class="btn-remove-item" onclick="removeItemWithToast(this, 'Recognition item')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="admin-form-group">
                <label>Icon</label>
                <input type="text" class="recognition-icon" value="${data?.icon || 'bi-trophy'}">
            </div>
            <div class="admin-form-group">
                <label>Title</label>
                <input type="text" class="recognition-title" value="${data?.title || ''}">
            </div>
            <div class="admin-form-group">
                <label>Description</label>
                <textarea class="recognition-description" rows="3">${data?.description || ''}</textarea>
            </div>
        `;
        container.appendChild(item);
        
        // Initialize icon picker for this item
        const iconInput = item.querySelector('.recognition-icon');
        if (iconInput) {
            initIconPicker(iconInput);
        }
    };
    
    // Form submission
    document.getElementById('aboutPageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            showLoading();
            
            // Collect page hero
            const pageHeroImageUrl = document.getElementById('page_hero_image_url')?.value.trim();
            const pageHeroImage = document.getElementById('page_hero_image').files[0];
            let heroImageUrl = pageData.pageHero?.image || '';
            if (pageHeroImageUrl) {
                heroImageUrl = pageHeroImageUrl;
            } else if (pageHeroImage) {
                heroImageUrl = await handleImageUpload('page_hero_image', 'page_hero_image_preview', 'images/about', null);
            }
            
            pageData.pageHero = {
                title: document.getElementById('page_hero_title').value,
                subtitle: document.getElementById('page_hero_subtitle').value,
                image: heroImageUrl
            };
            
            // Collect about story
            const storyImageUrlInput = document.getElementById('about_story_image_url');
            const storyImage = document.getElementById('about_story_image').files[0];
            let storyImageUrl = '';
            
            // Prioritize URL input
            if (storyImageUrlInput && storyImageUrlInput.value.trim()) {
                storyImageUrl = storyImageUrlInput.value.trim();
            } else if (storyImage) {
                storyImageUrl = await handleImageUpload('about_story_image', 'about_story_image_preview', 'images/about', null);
            } else {
                storyImageUrl = pageData.aboutStory?.image || '';
            }
            
            // Get story content from Quill editor if available, otherwise from hidden input
            let storyContent = '';
            if (storyQuill && storyQuill.root) {
                storyContent = storyQuill.root.innerHTML;
                // Clean up empty paragraphs
                storyContent = storyContent.replace(/<p><br><\/p>/g, '').replace(/<p><\/p>/g, '');
                // Fix links
                storyContent = storyContent.replace(/<a\s+href=["']([^"']+)["']([^>]*)><\/a>/gi, function(match, url, attrs) {
                    return `<a href="${url}"${attrs}>${url}</a>`;
                });
                storyContent = storyContent.replace(/<a\s+href=["']([^"']+)["']/gi, function(match, url) {
                    if (url && !url.match(/^https?:\/\//i) && !url.startsWith('#') && !url.startsWith('/') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
                        return match.replace(url, 'https://' + url);
                    }
                    return match;
                });
            } else {
                storyContent = document.getElementById('about_story_content').value || '';
            }
            
            pageData.aboutStory = {
                title: document.getElementById('about_story_title').value,
                content: storyContent,
                image: storyImageUrl
            };
            
            // Mission - always save, even if empty
            const missionTextEl = document.getElementById('mission_text');
            pageData.mission = {
                text: missionTextEl ? missionTextEl.value : ''
            };
            
            // Stats banner
            const statsBannerItems = [];
            document.querySelectorAll('#stats_banner_container .repeatable-item').forEach(item => {
                statsBannerItems.push({
                    value: item.querySelector('.stat-banner-value').value,
                    label: item.querySelector('.stat-banner-label').value
                });
            });
            pageData.statsBanner = { items: statsBannerItems };
            
            // Timeline
            const timelineItems = [];
            document.querySelectorAll('#timeline_container .repeatable-item').forEach(item => {
                const title = item.querySelector('.timeline-title')?.value || '';
                const description = item.querySelector('.timeline-description')?.value || '';
                const hidden = item.querySelector('.timeline-item-hidden')?.checked || false;
                // Only add if at least one field has content
                if (title || description) {
                    timelineItems.push({
                        title: title,
                        description: description,
                        hidden: hidden
                    });
                }
            });
            pageData.timeline = {
                title: document.getElementById('timeline_title').value,
                subtitle: document.getElementById('timeline_subtitle').value,
                hidden: document.getElementById('timeline_hidden')?.checked || false,
                items: timelineItems
            };
            
            // Values
            const valuesItems = [];
            document.querySelectorAll('#values_container .repeatable-item').forEach(item => {
                const hidden = item.querySelector('.value-item-hidden')?.checked || false;
                valuesItems.push({
                    icon: item.querySelector('.value-icon').value,
                    title: item.querySelector('.value-title').value,
                    description: item.querySelector('.value-description').value,
                    hidden: hidden
                });
            });
            pageData.values = {
                title: document.getElementById('values_title').value,
                hidden: document.getElementById('values_hidden')?.checked || false,
                items: valuesItems
            };
            
            // Leadership
            pageData.leadership = {
                title: document.getElementById('leadership_title').value,
                subtitle: document.getElementById('leadership_subtitle').value,
                name: document.getElementById('leadership_name').value,
                titleRole: document.getElementById('leadership_title_role').value,
                bio: document.getElementById('leadership_bio').value,
                initials: document.getElementById('leadership_initials').value
            };
            
            // CSR - always save, even if empty
            const csrTitleEl = document.getElementById('csr_title');
            const csrSubtitleEl = document.getElementById('csr_subtitle');
            const csrItems = [];
            document.querySelectorAll('#csr_container .repeatable-item').forEach(item => {
                const icon = item.querySelector('.csr-icon')?.value || '';
                const title = item.querySelector('.csr-title')?.value || '';
                const description = item.querySelector('.csr-description')?.value || '';
                const hidden = item.querySelector('.csr-item-hidden')?.checked || false;
                // Only add if at least one field has content
                if (icon || title || description) {
                    csrItems.push({
                        icon: icon,
                        title: title,
                        description: description,
                        hidden: hidden
                    });
                }
            });
            pageData.csr = {
                title: csrTitleEl ? csrTitleEl.value : '',
                subtitle: csrSubtitleEl ? csrSubtitleEl.value : '',
                hidden: document.getElementById('csr_hidden')?.checked || false,
                items: csrItems
            };
            
            // Recognition - always save, even if empty
            const recognitionTitleEl = document.getElementById('recognition_title');
            const recognitionSubtitleEl = document.getElementById('recognition_subtitle');
            const recognitionItems = [];
            document.querySelectorAll('#recognition_container .repeatable-item').forEach(item => {
                const icon = item.querySelector('.recognition-icon')?.value || '';
                const title = item.querySelector('.recognition-title')?.value || '';
                const description = item.querySelector('.recognition-description')?.value || '';
                const hidden = item.querySelector('.recognition-item-hidden')?.checked || false;
                // Only add if at least one field has content
                if (icon || title || description) {
                    recognitionItems.push({
                        icon: icon,
                        title: title,
                        description: description,
                        hidden: hidden
                    });
                }
            });
            pageData.recognition = {
                title: recognitionTitleEl ? recognitionTitleEl.value : '',
                subtitle: recognitionSubtitleEl ? recognitionSubtitleEl.value : '',
                hidden: document.getElementById('recognition_hidden')?.checked || false,
                items: recognitionItems
            };
            
            // Remove undefined values before saving (Firestore doesn't allow them)
            const cleanedData = removeUndefinedValues(pageData);
            
            console.log('Saving to Firebase:', {
                mission: cleanedData.mission,
                csr: cleanedData.csr,
                recognition: cleanedData.recognition
            });
            
            // Save to Firebase
            await saveToFirestore('pages', 'about', cleanedData);
            
            // Update local pageData with cleaned data
            pageData = cleanedData;
            
            hideLoading();
            showAlert('All changes saved successfully!', 'success');
            
        } catch (error) {
            hideLoading();
            console.error('Save error:', error);
            showAlert('Error saving: ' + error.message, 'error');
        }
    });
    
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
    
    // Initialize image previews
    initImagePreview('page_hero_image', 'page_hero_image_preview');
    initImagePreview('about_story_image', 'about_story_image_preview');
    
    // Initialize folder selectors
    if (window.initFolderSelectors) {
        window.initFolderSelectors();
    }
    
    // Initialize image picker for hero image and story image
    if (window.initImagePicker) {
        const pageHeroImageUrl = document.getElementById('page_hero_image_url');
        const aboutStoryImageUrl = document.getElementById('about_story_image_url');
        if (pageHeroImageUrl) window.initImagePicker(pageHeroImageUrl);
        if (aboutStoryImageUrl) window.initImagePicker(aboutStoryImageUrl);
    }
    
    // Add input listener for hero image URL
    if (document.getElementById('page_hero_image_url')) {
        document.getElementById('page_hero_image_url').addEventListener('input', function() {
            const url = this.value.trim();
            if (url) {
                const normalizedPath = normalizeImagePath(url);
                document.getElementById('page_hero_image_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            } else {
                document.getElementById('page_hero_image_preview').innerHTML = '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image selected</p></div>';
            }
        });
    }
    
    // Add input listener for story image URL
    if (document.getElementById('about_story_image_url')) {
        document.getElementById('about_story_image_url').addEventListener('input', function() {
            const url = this.value.trim();
            if (url) {
                const normalizedPath = normalizeImagePath(url);
                document.getElementById('about_story_image_preview').innerHTML = `<img src="${normalizedPath}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'><i class=\\'bi bi-image\\'></i><p>Image not found</p></div>'">`;
            } else {
                document.getElementById('about_story_image_preview').innerHTML = '<div class="image-preview-placeholder"><i class="bi bi-image"></i><p>No image selected</p></div>';
            }
        });
    }
    
    // Setup upload buttons
    if (document.getElementById('page_hero_image_upload_btn')) {
        document.getElementById('page_hero_image_upload_btn').addEventListener('click', function() {
            document.getElementById('page_hero_image').click();
        });
    }
    if (document.getElementById('about_story_image_upload_btn')) {
        document.getElementById('about_story_image_upload_btn').addEventListener('click', function() {
            document.getElementById('about_story_image').click();
        });
    }
    
    // Initialize Quill editor for story content
    const storyEditorDiv = document.getElementById('about_story_content_editor');
    const storyHiddenInput = document.getElementById('about_story_content');
    
    if (storyEditorDiv && storyHiddenInput && typeof Quill !== 'undefined') {
        // Save scroll position before initializing Quill
        const savedScrollY = window.scrollY || window.pageYOffset;
        
        // Ensure editor div has initial content
        if (!storyEditorDiv.innerHTML.trim()) {
            storyEditorDiv.innerHTML = '<p><br></p>';
        }
        
        storyQuill = new Quill(storyEditorDiv, {
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
            placeholder: 'Story content...'
        });
        
        // Force toolbar icons to be white
        setTimeout(() => {
            const toolbar = storyEditorDiv.parentElement.querySelector('.ql-toolbar');
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
                            let selection = storyQuill.getSelection();
                            if (!selection) {
                                selection = storyQuill.getSelection(true);
                            }
                            if (color.value === '') {
                                if (selection && selection.length > 0) {
                                    storyQuill.formatText(selection.index, selection.length, 'color', false);
                                } else {
                                    storyQuill.format('color', false);
                                }
                            } else {
                                if (selection && selection.length > 0) {
                                    storyQuill.formatText(selection.index, selection.length, 'color', color.value);
                                } else {
                                    storyQuill.format('color', color.value);
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
        
        // Restore scroll position after Quill initialization
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
        
        // Update hidden input when content changes
        storyQuill.on('text-change', function() {
            let html = storyQuill.root.innerHTML;
            // Clean up empty paragraphs
            html = html.replace(/<p><br><\/p>/g, '').replace(/<p><\/p>/g, '');
            // Fix links
            html = html.replace(/<a\s+href=["']([^"']+)["']([^>]*)><\/a>/gi, function(match, url, attrs) {
                return `<a href="${url}"${attrs}>${url}</a>`;
            });
            html = html.replace(/<a\s+href=["']([^"']+)["']/gi, function(match, url) {
                if (url && !url.match(/^https?:\/\//i) && !url.startsWith('#') && !url.startsWith('/') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
                    return match.replace(url, 'https://' + url);
                }
                return match;
            });
            storyHiddenInput.value = html;
        });
    }
})();

