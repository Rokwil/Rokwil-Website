/**
 * Admin Panel JavaScript
 * Handles all admin panel functionality including tabs, forms, and content management
 */

console.log('Admin panel script loading...');

// Make openFileSelector available immediately (before DOM ready)
window.openFileSelector = window.openFileSelector || function(inputId, previewId, fileType = 'image', customSelector = null) {
    console.log('openFileSelector called (early version)');
    // This will be replaced by the full version below
    setTimeout(() => {
        if (typeof window.openFileSelector === 'function') {
            window.openFileSelector(inputId, previewId, fileType, customSelector);
        }
    }, 50);
};

// Make toggleCollapsible available immediately (before DOM ready)
window.toggleCollapsible = window.toggleCollapsible || function(header) {
    // Handle both editable-item collapsibles and section collapsibles
    const item = header.closest('.editable-item') || header.closest('.collapsible-section');
    const content = item ? item.querySelector('.collapsible-content') : null;
    const icon = header.querySelector('i');
    
    if (!content) {
        console.error('toggleCollapsible: content not found', header);
        return;
    }
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    } else {
        content.classList.add('expanded');
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
        }
    }
};

// Make functions available immediately (before DOM ready)
window.loadCurrentContentFromPage = function(page) {
    console.log('=== LOAD CURRENT CONTENT (early) ===');
    console.log('Page requested:', page);
    
    // Direct extraction for all pages
    if (page === 'projects') {
        console.log('Projects page - will extract directly');
        if (typeof window.extractProjectsDirectly === 'function') {
            window.extractProjectsDirectly();
        } else {
            console.error('extractProjectsDirectly not available yet, waiting...');
            setTimeout(() => {
                if (typeof window.extractProjectsDirectly === 'function') {
                    window.extractProjectsDirectly();
                } else {
                    showMessage('Error: Extraction function not loaded. Please refresh.', 'error');
                }
            }, 500);
        }
        return;
    } else if (page === 'index' || page === 'home') {
        console.log('Home page - will extract directly');
        if (typeof window.extractHomePageDirectly === 'function') {
            window.extractHomePageDirectly();
        } else {
            setTimeout(() => {
                if (typeof window.extractHomePageDirectly === 'function') {
                    window.extractHomePageDirectly();
                } else {
                    showMessage('Error: Extraction function not loaded. Please refresh.', 'error');
                }
            }, 500);
        }
        return;
    } else if (page === 'about') {
        console.log('About page - will extract directly');
        if (typeof window.extractAboutPageDirectly === 'function') {
            window.extractAboutPageDirectly();
        } else {
            setTimeout(() => {
                if (typeof window.extractAboutPageDirectly === 'function') {
                    window.extractAboutPageDirectly();
                } else {
                    showMessage('Error: Extraction function not loaded. Please refresh.', 'error');
                }
            }, 500);
        }
        return;
    } else if (page === 'contact') {
        console.log('Contact page - will extract directly');
        if (typeof window.extractContactPageDirectly === 'function') {
            window.extractContactPageDirectly();
        } else {
            setTimeout(() => {
                if (typeof window.extractContactPageDirectly === 'function') {
                    window.extractContactPageDirectly();
                } else {
                    showMessage('Error: Extraction function not loaded. Please refresh.', 'error');
                }
            }, 500);
        }
        return;
    }
    
    // For other pages, use the full function when available
    if (typeof window._loadCurrentContentFromPageFull === 'function') {
        window._loadCurrentContentFromPageFull(page);
    }
};

// Check authentication on page load
if (typeof checkAuth === 'function' && !checkAuth()) {
    // Redirect will happen in checkAuth
}

// Initialize dark mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Tab functionality
const tabs = document.querySelectorAll('.admin-tab');
const tabContents = document.querySelectorAll('.admin-tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(`tab-${targetTab}`).classList.add('active');
        
        // Load content for the active tab
        loadTabContent(targetTab);
    });
});

// Load content for specific tab
function loadTabContent(tabName) {
    const content = getContent();
    
    switch(tabName) {
        case 'home':
            loadHomeContent(content);
            break;
        case 'about':
            loadAboutContent(content);
            break;
        case 'projects':
            loadProjectsContent(content);
            // Also try to auto-load from current content if no projects shown
            setTimeout(() => {
                const projectsList = document.getElementById('projectsList');
                if (projectsList && projectsList.children.length === 0) {
                    // No projects rendered, try to load from current content
                    const CURRENT_CONTENT_KEY = 'rokwil_current_content';
                    const stored = localStorage.getItem(CURRENT_CONTENT_KEY);
                    if (stored) {
                        try {
                            const currentContent = JSON.parse(stored);
                            if (currentContent.projectsPage && currentContent.projectsPage.projects) {
                                renderProjects(currentContent.projectsPage.projects.items || []);
                            } else if (currentContent.projects) {
                                renderProjects(currentContent.projects.items || []);
                            }
                        } catch (e) {
                            console.error('Error auto-loading projects:', e);
                        }
                    }
                    // If still no projects, try direct extraction
                    if (projectsList.children.length === 0) {
                        extractProjectsDirectly();
                    }
                }
            }, 100);
            break;
        case 'contact':
            loadContactContent(content);
            break;
        case 'global':
            loadGlobalContent(content);
            break;
    }
}

// Direct extraction functions for all pages
window.extractHomePageDirectly = async function() {
    console.log('=== EXTRACTING HOME PAGE ===');
    try {
        showMessage('Loading home page content...', 'success');
        const response = await fetch('index.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Temporarily add to document to extract
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        tempDiv.innerHTML = doc.body.innerHTML;
        document.body.appendChild(tempDiv);
        
        // Save original querySelector methods
        const originalQuerySelector = document.querySelector;
        const originalQuerySelectorAll = document.querySelectorAll;
        
        // Temporarily override to use tempDiv
        document.querySelector = function(sel) {
            return tempDiv.querySelector(sel) || originalQuerySelector.call(document, sel);
        };
        document.querySelectorAll = function(sel) {
            const tempResults = tempDiv.querySelectorAll(sel);
            return tempResults.length > 0 ? tempResults : originalQuerySelectorAll.call(document, sel);
        };
        
        if (window.contentExtractor && window.contentExtractor.extractHomePageContent) {
            const extracted = window.contentExtractor.extractHomePageContent();
            
            // Restore original methods
            document.querySelector = originalQuerySelector;
            document.querySelectorAll = originalQuerySelectorAll;
            document.body.removeChild(tempDiv);
            
            const existingContent = getContent();
            if (!existingContent.homePage) existingContent.homePage = {};
            existingContent.homePage = { ...existingContent.homePage, ...extracted };
            saveContent(existingContent);
            loadHomeContent(existingContent);
            showMessage(`Home page content loaded!`, 'success');
        } else {
            // Restore if extractor not available
            document.querySelector = originalQuerySelector;
            document.querySelectorAll = originalQuerySelectorAll;
            document.body.removeChild(tempDiv);
        }
    } catch (error) {
        console.error('Error extracting home page:', error);
        showMessage('Error loading home page content.', 'error');
    }
};

window.extractAboutPageDirectly = async function() {
    console.log('=== EXTRACTING ABOUT PAGE ===');
    try {
        showMessage('Loading about page content...', 'success');
        const response = await fetch('about.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        tempDiv.innerHTML = doc.body.innerHTML;
        document.body.appendChild(tempDiv);
        
        const originalQuerySelector = document.querySelector;
        const originalQuerySelectorAll = document.querySelectorAll;
        
        document.querySelector = function(sel) {
            return tempDiv.querySelector(sel) || originalQuerySelector.call(document, sel);
        };
        document.querySelectorAll = function(sel) {
            const tempResults = tempDiv.querySelectorAll(sel);
            return tempResults.length > 0 ? tempResults : originalQuerySelectorAll.call(document, sel);
        };
        
        if (window.contentExtractor && window.contentExtractor.extractAboutPageContent) {
            const extracted = window.contentExtractor.extractAboutPageContent();
            
            document.querySelector = originalQuerySelector;
            document.querySelectorAll = originalQuerySelectorAll;
            document.body.removeChild(tempDiv);
            
            const existingContent = getContent();
            if (!existingContent.aboutPage) existingContent.aboutPage = {};
            existingContent.aboutPage = { ...existingContent.aboutPage, ...extracted };
            saveContent(existingContent);
            loadAboutContent(existingContent);
            showMessage(`About page content loaded!`, 'success');
        } else {
            document.querySelector = originalQuerySelector;
            document.querySelectorAll = originalQuerySelectorAll;
            document.body.removeChild(tempDiv);
        }
    } catch (error) {
        console.error('Error extracting about page:', error);
        showMessage('Error loading about page content.', 'error');
    }
};

window.extractContactPageDirectly = async function() {
    console.log('=== EXTRACTING CONTACT PAGE ===');
    try {
        showMessage('Loading contact page content...', 'success');
        const response = await fetch('contact.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        tempDiv.innerHTML = doc.body.innerHTML;
        document.body.appendChild(tempDiv);
        
        const originalQuerySelector = document.querySelector;
        const originalQuerySelectorAll = document.querySelectorAll;
        
        document.querySelector = function(sel) {
            return tempDiv.querySelector(sel) || originalQuerySelector.call(document, sel);
        };
        document.querySelectorAll = function(sel) {
            const tempResults = tempDiv.querySelectorAll(sel);
            return tempResults.length > 0 ? tempResults : originalQuerySelectorAll.call(document, sel);
        };
        
        if (window.contentExtractor && window.contentExtractor.extractContactPageContent) {
            const extracted = window.contentExtractor.extractContactPageContent();
            
            document.querySelector = originalQuerySelector;
            document.querySelectorAll = originalQuerySelectorAll;
            document.body.removeChild(tempDiv);
            
            const existingContent = getContent();
            if (!existingContent.contactPage) existingContent.contactPage = {};
            existingContent.contactPage = { ...existingContent.contactPage, ...extracted };
            saveContent(existingContent);
            loadContactContent(existingContent);
            showMessage(`Contact page content loaded!`, 'success');
        } else {
            document.querySelector = originalQuerySelector;
            document.querySelectorAll = originalQuerySelectorAll;
            document.body.removeChild(tempDiv);
        }
    } catch (error) {
        console.error('Error extracting contact page:', error);
        showMessage('Error loading contact page content.', 'error');
    }
};

// Load current content from stored page content - Full implementation
window._loadCurrentContentFromPageFull = function(page) {
    console.log('=== LOAD CURRENT CONTENT (full) ===');
    console.log('Page requested:', page);
    
    const CURRENT_CONTENT_KEY = 'rokwil_current_content';
    const stored = localStorage.getItem(CURRENT_CONTENT_KEY);
    
    if (!stored) {
        showMessage('No current content found. Please visit the page first, then come back to admin.', 'error');
        // Open the page in a new tab
        window.open(`${page}.html`, '_blank');
        return;
    }
    
    try {
        const currentContent = JSON.parse(stored);
        const existingContent = getContent();
        
        if (page === 'index' && currentContent.homePage) {
            existingContent.homePage = { ...existingContent.homePage, ...currentContent.homePage };
            saveContent(existingContent);
            loadHomeContent(existingContent);
            showMessage('Current content loaded from page!', 'success');
        } else if (page === 'about' && currentContent.aboutPage) {
            existingContent.aboutPage = { ...existingContent.aboutPage, ...currentContent.aboutPage };
            saveContent(existingContent);
            loadAboutContent(existingContent);
            showMessage('Current content loaded from page!', 'success');
        } else if (page === 'projects') {
            // The extractor stores as { hero: {...}, projects: {...} }
            // We need to convert it to projectsPage format
            if (currentContent.projectsPage) {
                existingContent.projectsPage = { ...existingContent.projectsPage, ...currentContent.projectsPage };
            } else if (currentContent.hero || currentContent.projects) {
                // Convert from extractor format to admin format
                if (!existingContent.projectsPage) existingContent.projectsPage = {};
                if (currentContent.hero) {
                    existingContent.projectsPage.hero = currentContent.hero;
                }
                if (currentContent.projects) {
                    existingContent.projectsPage.projects = currentContent.projects;
                }
            }
            saveContent(existingContent);
            loadProjectsContent(existingContent);
            showMessage('Current content loaded from page!', 'success');
        } else if (page === 'contact' && currentContent.contactPage) {
            existingContent.contactPage = { ...existingContent.contactPage, ...currentContent.contactPage };
            saveContent(existingContent);
            loadContactContent(existingContent);
            showMessage('Current content loaded from page!', 'success');
        } else {
            showMessage('No content found for this page. Please visit the page first.', 'error');
            window.open(`${page}.html`, '_blank');
        }
    } catch (error) {
        console.error('Error loading current content:', error);
        showMessage('Error loading current content. Please visit the page first.', 'error');
    }
}

// Handle file upload
function handleFileUpload(input, targetInputId, previewId = null) {
    const file = input.files[0];
    if (!file) return;
    
    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
        showMessage('Please upload an image or video file', 'error');
        return;
    }
    
    // For static sites, we'll convert to base64 or provide instructions
    // For now, we'll show a message and store the file name
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Store as base64 data URL (for small files) or file path
        const dataUrl = e.target.result;
        
        // Update the target input
        const targetInput = document.getElementById(targetInputId);
        if (targetInput) {
            // For now, we'll use the file name as the path
            // In production, you'd upload to a server and get the URL
            const fileName = file.name;
            targetInput.value = `images/${fileName}`;
            
            // Show preview if preview element exists
            if (previewId) {
                const preview = document.getElementById(previewId);
                if (preview) {
                    if (isImage) {
                        preview.src = dataUrl;
                        preview.style.display = 'block';
                    } else if (isVideo) {
                        preview.src = dataUrl;
                        preview.style.display = 'block';
                    }
                }
            }
            
            showMessage(`File "${fileName}" selected. Note: For production, upload files to your server and use the full URL.`, 'success');
        }
    };
    
    if (isImage || isVideo) {
        reader.readAsDataURL(file);
    }
}

// Setup image/video preview when input value changes
function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) {
        console.log(`Preview setup skipped: input=${inputId}, preview=${previewId}, input exists=${!!input}, preview exists=${!!preview}`);
        return;
    }
    
    // Function to update preview
    const updatePreview = function(value) {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            preview.style.display = 'none';
            return;
        }
        
        // Check if it's a URL or path (images/, videos/, http, /)
        const isValidPath = trimmedValue.startsWith('http') || 
                           trimmedValue.startsWith('/') || 
                           trimmedValue.startsWith('images/') ||
                           trimmedValue.startsWith('videos/');
        
        if (isValidPath) {
            if (preview.tagName === 'IMG') {
                preview.src = trimmedValue;
                preview.style.display = 'block';
                preview.onerror = function() {
                    console.warn(`Failed to load image: ${trimmedValue}`);
                    this.style.display = 'none';
                };
                preview.onload = function() {
                    this.style.display = 'block';
                };
            } else if (preview.tagName === 'VIDEO') {
                preview.src = trimmedValue;
                preview.style.display = 'block';
                preview.onerror = function() {
                    console.warn(`Failed to load video: ${trimmedValue}`);
                    this.style.display = 'none';
                };
                preview.onloadeddata = function() {
                    this.style.display = 'block';
                };
            }
        } else {
            preview.style.display = 'none';
        }
    };
    
    // Update preview when input value changes
    input.addEventListener('input', function() {
        updatePreview(this.value);
    });
    
    // Also check on load
    if (input.value) {
        updatePreview(input.value);
    }
    
    // Also check when content is loaded into the form
    setTimeout(() => {
        if (input.value) {
            updatePreview(input.value);
        }
    }, 100);
}

// Load home page content
function loadHomeContent(content) {
    if (content.homePage) {
        if (content.homePage.hero) {
            document.getElementById('heroTitle').value = content.homePage.hero.title || '';
            document.getElementById('heroSubtitle').value = content.homePage.hero.subtitle || '';
            document.getElementById('heroImage1').value = content.homePage.hero.image1 || '';
            document.getElementById('heroImage2').value = content.homePage.hero.image2 || '';
        }
        if (content.homePage.video) {
            document.getElementById('videoTitle').value = content.homePage.video.title || '';
            document.getElementById('videoSubtitle').value = content.homePage.video.subtitle || '';
            document.getElementById('videoSrc').value = content.homePage.video.src || '';
            document.getElementById('videoPoster').value = content.homePage.video.poster || '';
        }
        if (content.homePage.features) {
            document.getElementById('featuresTitle').value = content.homePage.features.title || '';
            document.getElementById('featuresSubtitle').value = content.homePage.features.subtitle || '';
            renderFeatures(content.homePage.features.items || []);
        }
        if (content.homePage.showcase) {
            document.getElementById('showcaseTitle').value = content.homePage.showcase.title || '';
            document.getElementById('showcaseSubtitle').value = content.homePage.showcase.subtitle || '';
            renderShowcase(content.homePage.showcase.items || []);
        }
        if (content.homePage.testimonials) {
            document.getElementById('testimonialsTitle').value = content.homePage.testimonials.title || '';
            document.getElementById('testimonialsSubtitle').value = content.homePage.testimonials.subtitle || '';
            renderTestimonials(content.homePage.testimonials.items || []);
        }
        if (content.homePage.news) {
            document.getElementById('newsTitle').value = content.homePage.news.title || '';
            document.getElementById('newsSubtitle').value = content.homePage.news.subtitle || '';
            renderNews(content.homePage.news.items || []);
        }
        if (content.homePage.stats) {
            renderStats(content.homePage.stats.items || []);
        }
    }
}

// Load about page content
function loadAboutContent(content) {
    if (content.aboutPage) {
        if (content.aboutPage.hero) {
            const heroTitleEl = document.getElementById('aboutHeroTitle');
            const heroSubtitleEl = document.getElementById('aboutHeroSubtitle');
            const heroImageEl = document.getElementById('aboutHeroImage');
            if (heroTitleEl) heroTitleEl.value = content.aboutPage.hero.title || '';
            if (heroSubtitleEl) heroSubtitleEl.value = content.aboutPage.hero.subtitle || '';
            if (heroImageEl) heroImageEl.value = content.aboutPage.hero.image || '';
        }
        if (content.aboutPage.stats) {
            renderAboutStats(content.aboutPage.stats.items || []);
        } else {
            // If no stats saved, render empty list so user can add stats
            renderAboutStats([]);
        }
        if (content.aboutPage.content) {
            const storyBadgeEl = document.getElementById('aboutStoryBadge');
            const storyHeadingEl = document.getElementById('aboutStoryHeading');
            const storyEl = document.getElementById('aboutStory');
            const imageEl = document.getElementById('aboutImage');
            if (storyBadgeEl) storyBadgeEl.value = content.aboutPage.content.storyBadge || '';
            if (storyHeadingEl) storyHeadingEl.value = content.aboutPage.content.storyHeading || '';
            if (storyEl) {
                if (Array.isArray(content.aboutPage.content.story)) {
                    storyEl.value = content.aboutPage.content.story.join('\n\n');
                } else {
                    storyEl.value = content.aboutPage.content.story || '';
                }
            }
            if (imageEl) imageEl.value = content.aboutPage.content.image || '';
        }
        if (content.aboutPage.mission) {
            const missionIconEl = document.getElementById('missionIcon');
            const missionTitleEl = document.getElementById('missionTitle');
            const missionTextEl = document.getElementById('missionText');
            if (missionIconEl) missionIconEl.value = content.aboutPage.mission.icon || '';
            if (missionTitleEl) missionTitleEl.value = content.aboutPage.mission.title || '';
            if (missionTextEl) missionTextEl.value = content.aboutPage.mission.text || '';
        }
        if (content.aboutPage.timeline) {
            const timelineTitleEl = document.getElementById('timelineTitle');
            const timelineSubtitleEl = document.getElementById('timelineSubtitle');
            if (timelineTitleEl) timelineTitleEl.value = content.aboutPage.timeline.title || '';
            if (timelineSubtitleEl) timelineSubtitleEl.value = content.aboutPage.timeline.subtitle || '';
            renderTimeline(content.aboutPage.timeline.items || []);
        }
        if (content.aboutPage.values) {
            const valuesTitleEl = document.getElementById('valuesTitle');
            if (valuesTitleEl) valuesTitleEl.value = content.aboutPage.values.title || '';
            renderValues(content.aboutPage.values.items || []);
        }
        if (content.aboutPage.leadership) {
            const leadershipTitleEl = document.getElementById('leadershipTitle');
            const leadershipSubtitleEl = document.getElementById('leadershipSubtitle');
            const leaderInitialsEl = document.getElementById('leaderInitials');
            const leaderNameEl = document.getElementById('leaderName');
            const leaderTitleEl = document.getElementById('leaderTitle');
            const leaderTagsEl = document.getElementById('leaderTags');
            const leaderDescriptionEl = document.getElementById('leaderDescription');
            if (leadershipTitleEl) leadershipTitleEl.value = content.aboutPage.leadership.title || '';
            if (leadershipSubtitleEl) leadershipSubtitleEl.value = content.aboutPage.leadership.subtitle || '';
            if (leaderInitialsEl) leaderInitialsEl.value = content.aboutPage.leadership.initials || '';
            if (leaderNameEl) leaderNameEl.value = content.aboutPage.leadership.name || '';
            if (leaderTitleEl) leaderTitleEl.value = content.aboutPage.leadership.leaderTitle || '';
            if (leaderTagsEl) leaderTagsEl.value = (content.aboutPage.leadership.tags || []).join(', ');
            if (leaderDescriptionEl) leaderDescriptionEl.value = content.aboutPage.leadership.description || '';
        }
        if (content.aboutPage.csr) {
            const csrTitleEl = document.getElementById('csrTitle');
            const csrSubtitleEl = document.getElementById('csrSubtitle');
            if (csrTitleEl) csrTitleEl.value = content.aboutPage.csr.title || '';
            if (csrSubtitleEl) csrSubtitleEl.value = content.aboutPage.csr.subtitle || '';
            renderCSR(content.aboutPage.csr.items || []);
        }
        if (content.aboutPage.recognition) {
            const recognitionTitleEl = document.getElementById('recognitionTitle');
            const recognitionSubtitleEl = document.getElementById('recognitionSubtitle');
            if (recognitionTitleEl) recognitionTitleEl.value = content.aboutPage.recognition.title || '';
            if (recognitionSubtitleEl) recognitionSubtitleEl.value = content.aboutPage.recognition.subtitle || '';
            renderRecognition(content.aboutPage.recognition.items || []);
        }
    }
}

// Load projects page content
function loadProjectsContent(content) {
    if (content.projectsPage) {
        if (content.projectsPage.hero) {
            const heroTitleEl = document.getElementById('projectsHeroTitle');
            const heroSubtitleEl = document.getElementById('projectsHeroSubtitle');
            const heroImageEl = document.getElementById('projectsHeroImage');
            if (heroTitleEl) heroTitleEl.value = content.projectsPage.hero.title || '';
            if (heroSubtitleEl) heroSubtitleEl.value = content.projectsPage.hero.subtitle || '';
            if (heroImageEl) heroImageEl.value = content.projectsPage.hero.image || '';
        }
        if (content.projectsPage.projects && content.projectsPage.projects.items) {
            console.log('Rendering projects:', content.projectsPage.projects.items);
            renderProjects(content.projectsPage.projects.items);
        } else {
            // Try to load from current content if no saved projects
            const CURRENT_CONTENT_KEY = 'rokwil_current_content';
            const stored = localStorage.getItem(CURRENT_CONTENT_KEY);
            if (stored) {
                try {
                    const currentContent = JSON.parse(stored);
                    if (currentContent.projectsPage && currentContent.projectsPage.projects) {
                        renderProjects(currentContent.projectsPage.projects.items || []);
                    } else if (currentContent.projects) {
                        renderProjects(currentContent.projects.items || []);
                    }
                } catch (e) {
                    console.error('Error loading current projects:', e);
                }
            }
        }
    } else {
        // No saved content, try to load from current content
        const CURRENT_CONTENT_KEY = 'rokwil_current_content';
        const stored = localStorage.getItem(CURRENT_CONTENT_KEY);
        if (stored) {
            try {
                const currentContent = JSON.parse(stored);
                if (currentContent.projectsPage && currentContent.projectsPage.projects) {
                    renderProjects(currentContent.projectsPage.projects.items || []);
                } else if (currentContent.projects) {
                    renderProjects(currentContent.projects.items || []);
                }
            } catch (e) {
                console.error('Error loading current projects:', e);
            }
        }
    }
}

// Load contact page content
function loadContactContent(content) {
    if (content.contactPage) {
        if (content.contactPage.hero) {
            document.getElementById('contactHeroTitle').value = content.contactPage.hero.title || '';
            document.getElementById('contactHeroSubtitle').value = content.contactPage.hero.subtitle || '';
            document.getElementById('contactHeroImage').value = content.contactPage.hero.image || '';
        }
        if (content.contactPage.info) {
            document.getElementById('contactEmail').value = content.contactPage.info.email || '';
            document.getElementById('contactPhone').value = content.contactPage.info.phone || '';
            document.getElementById('contactAddress').value = content.contactPage.info.address || '';
            document.getElementById('contactOfficeHours').value = content.contactPage.info.officeHours || '';
        }
    }
}

// Load global content
function loadGlobalContent(content) {
    if (content.global) {
        document.getElementById('globalEmail').value = content.global.email || '';
        document.getElementById('globalPhone').value = content.global.phone || '';
    }
    if (content.icons) {
        document.getElementById('emailIcon').value = content.icons.emailIcon || 'bi-envelope-fill';
        document.getElementById('phoneIcon').value = content.icons.phoneIcon || 'bi-telephone-fill';
        document.getElementById('locationIcon').value = content.icons.locationIcon || 'bi-geo-alt-fill';
        updateIconPreviews();
    }
}

// Render functions for dynamic lists
function renderFeatures(items) {
    const container = document.getElementById('featuresList');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        const iconId = `feature-icon-${index}`;
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">Feature ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeFeature(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="form-group">
                <label>Icon Class 
                    <button type="button" class="icon-picker-btn" onclick="createIconPicker('${iconId}', '${item.icon || 'bi-building'}')">
                        <i class="bi bi-palette"></i> Pick Icon
                    </button>
                </label>
                <input type="text" id="${iconId}" class="feature-icon" value="${item.icon || ''}" placeholder="bi-building">
                <div class="icon-preview">
                    Preview: <i class="bi ${item.icon || 'bi-building'}"></i>
                </div>
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="feature-title" value="${item.title || ''}" placeholder="Feature Title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="feature-description" rows="3" placeholder="Feature description">${item.description || ''}</textarea>
            </div>
        `;
        container.appendChild(div);
        
        // Update preview when icon changes
        const iconInput = div.querySelector(`#${iconId}`);
        if (iconInput) {
            iconInput.addEventListener('input', function() {
                const preview = div.querySelector('.icon-preview i');
                if (preview) {
                    preview.className = `bi ${this.value}`;
                }
            });
        }
    });
}

function renderShowcase(items) {
    const container = document.getElementById('showcaseList');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">Showcase Item ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeShowcase(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label>Image URL</label>
                    <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                        <input type="text" class="showcase-image" value="${item.image || ''}" placeholder="images/Projects/..." style="flex: 1; padding: 0.4rem 0.5rem !important; line-height: 1.3; height: auto; min-height: auto;">
                        <button type="button" class="btn-select-file showcase-file-btn" data-index="${index}" title="Select from existing files">
                            <i class="bi bi-folder"></i>
                        </button>
                    </div>
                    <div class="file-upload-wrapper" style="margin-top: 0.5rem;">
                        <input type="file" class="showcase-image-upload file-upload-input" accept="image/*" data-index="${index}">
                        <label class="file-upload-label">
                            <i class="bi bi-upload"></i>
                            <span>Upload Image</span>
                        </label>
                    </div>
                    <img class="image-preview showcase-image-preview" style="display: none; max-width: 100%; max-height: 150px; margin-top: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color);">
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" class="showcase-title" value="${item.title || ''}" placeholder="Project Name">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" class="showcase-description" value="${item.description || ''}" placeholder="Project description">
            </div>
        `;
        container.appendChild(div);
        
        // Setup preview for showcase images
        const showcaseImageInput = div.querySelector('.showcase-image');
        const showcaseImagePreview = div.querySelector('.showcase-image-preview');
        const showcaseImageUpload = div.querySelector('.showcase-image-upload');
        
        if (showcaseImageInput && showcaseImagePreview) {
            const updatePreview = function() {
                const value = showcaseImageInput.value.trim();
                if (value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('images/'))) {
                    showcaseImagePreview.src = value;
                    showcaseImagePreview.style.display = 'block';
                    showcaseImagePreview.onerror = function() {
                        this.style.display = 'none';
                    };
                } else {
                    showcaseImagePreview.style.display = 'none';
                }
            };
            showcaseImageInput.addEventListener('input', updatePreview);
            if (showcaseImageInput.value) updatePreview();
        }
        
        // Setup upload for showcase images
        if (showcaseImageUpload) {
            showcaseImageUpload.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (showcaseImageInput) {
                            showcaseImageInput.value = `images/${showcaseImageUpload.files[0].name}`;
                        }
                        if (showcaseImagePreview) {
                            showcaseImagePreview.src = e.target.result;
                            showcaseImagePreview.style.display = 'block';
                        }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
        
        // Setup file selector for showcase
        const showcaseFileBtn = div.querySelector('.showcase-file-btn');
        if (showcaseFileBtn) {
            showcaseFileBtn.onclick = function() {
                openFileSelector(null, null, 'image', 'showcase-' + index);
            };
        }
    });
}

function renderTestimonials(items) {
    const container = document.getElementById('testimonialsList');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">Testimonial ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeTestimonial(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="form-group">
                <label>Quote</label>
                <textarea class="testimonial-quote" rows="3" placeholder="Testimonial quote">${item.quote || ''}</textarea>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label>Author Name</label>
                    <input type="text" class="testimonial-author" value="${item.author || ''}" placeholder="Author Name">
                </div>
                <div class="form-group">
                    <label>Author Title</label>
                    <input type="text" class="testimonial-title" value="${item.title || ''}" placeholder="Author Title">
                </div>
            </div>
            <div class="form-group">
                <label>Avatar Initials</label>
                <input type="text" class="testimonial-avatar" value="${item.avatar || ''}" placeholder="MP" maxlength="2">
            </div>
        `;
        container.appendChild(div);
    });
}

function renderNews(items) {
    const container = document.getElementById('newsList');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">News Item ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeNews(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label>Image URL</label>
                    <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                        <input type="text" class="news-image" value="${item.image || ''}" placeholder="images/..." style="flex: 1; padding: 0.4rem 0.5rem !important; line-height: 1.3; height: auto; min-height: auto;">
                        <button type="button" class="btn-select-file news-file-btn" data-index="${index}" title="Select from existing files">
                            <i class="bi bi-folder"></i>
                        </button>
                    </div>
                    <div class="file-upload-wrapper" style="margin-top: 0.5rem;">
                        <input type="file" class="news-image-upload file-upload-input" accept="image/*" data-index="${index}">
                        <label class="file-upload-label">
                            <i class="bi bi-upload"></i>
                            <span>Upload Image</span>
                        </label>
                    </div>
                    <img class="image-preview news-image-preview" style="display: none; max-width: 100%; max-height: 150px; margin-top: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color);">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="text" class="news-date" value="${item.date || ''}" placeholder="2025">
                </div>
            </div>
            <div class="form-group">
                <label>Category</label>
                <input type="text" class="news-category" value="${item.category || ''}" placeholder="Award">
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="news-title" value="${item.title || ''}" placeholder="News Title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="news-description" rows="3" placeholder="News description">${item.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Link URL (optional)</label>
                <input type="text" class="news-link" value="${item.link || ''}" placeholder="https://...">
            </div>
        `;
        container.appendChild(div);
        
        // Setup preview and upload for news images
        const newsImageInput = div.querySelector('.news-image');
        const newsImagePreview = div.querySelector('.news-image-preview');
        const newsImageUpload = div.querySelector('.news-image-upload');
        
        if (newsImageInput && newsImagePreview) {
            const updatePreview = function() {
                const value = newsImageInput.value.trim();
                if (value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('images/'))) {
                    newsImagePreview.src = value;
                    newsImagePreview.style.display = 'block';
                    newsImagePreview.onerror = function() {
                        this.style.display = 'none';
                    };
                } else {
                    newsImagePreview.style.display = 'none';
                }
            };
            newsImageInput.addEventListener('input', updatePreview);
            if (newsImageInput.value) updatePreview();
        }
        
        // Setup upload for news images
        if (newsImageUpload) {
            newsImageUpload.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (newsImageInput) {
                            newsImageInput.value = `images/${newsImageUpload.files[0].name}`;
                        }
                        if (newsImagePreview) {
                            newsImagePreview.src = e.target.result;
                            newsImagePreview.style.display = 'block';
                        }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
        
        // Setup file selector for news
        const newsFileBtn = div.querySelector('.news-file-btn');
        if (newsFileBtn) {
            newsFileBtn.onclick = function() {
                openFileSelector(null, null, 'image', 'news-' + index);
            };
        }
    });
}

function renderStats(items) {
    const container = document.getElementById('statsList');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">Stat ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeStat(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label>Number</label>
                    <input type="text" class="stat-number" value="${item.number || ''}" placeholder="152">
                </div>
                <div class="form-group">
                    <label>Label</label>
                    <input type="text" class="stat-label" value="${item.label || ''}" placeholder="Hectares Developed">
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderAboutStats(items) {
    const container = document.getElementById('aboutStatsList');
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">Stat ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeAboutStat(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="grid-2">
                <div class="form-group">
                    <label>Number</label>
                    <input type="text" class="about-stat-number" value="${item.number || ''}" placeholder="2007">
                </div>
                <div class="form-group">
                    <label>Label</label>
                    <input type="text" class="about-stat-label" value="${item.label || ''}" placeholder="Established">
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderValues(items) {
    const container = document.getElementById('valuesList');
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        const iconId = `value-icon-${index}`;
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">Value ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeValue(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="form-group">
                <label>Icon Class 
                    <button type="button" class="icon-picker-btn" onclick="createIconPicker('${iconId}', '${item.icon || 'bi-star'}')">
                        <i class="bi bi-palette"></i> Pick Icon
                    </button>
                </label>
                <input type="text" id="${iconId}" class="value-icon" value="${item.icon || ''}" placeholder="bi-star">
                <div class="icon-preview">
                    Preview: <i class="bi ${item.icon || 'bi-star'}"></i>
                </div>
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="value-title" value="${item.title || ''}" placeholder="Excellence">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="value-description" rows="3" placeholder="Value description">${item.description || ''}</textarea>
            </div>
        `;
        container.appendChild(div);
        
        // Update preview when icon changes
        const iconInput = div.querySelector(`#${iconId}`);
        if (iconInput) {
            iconInput.addEventListener('input', function() {
                const preview = div.querySelector('.icon-preview i');
                if (preview) {
                    preview.className = `bi ${this.value}`;
                }
            });
        }
    });
}

function renderCSR(items) {
    const container = document.getElementById('csrList');
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        const iconId = `csr-icon-${index}`;
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">CSR Item ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeCSRItem(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="form-group">
                <label>Icon Class 
                    <button type="button" class="icon-picker-btn" onclick="createIconPicker('${iconId}', '${item.icon || 'bi-people'}')">
                        <i class="bi bi-palette"></i> Pick Icon
                    </button>
                </label>
                <input type="text" id="${iconId}" class="csr-icon" value="${item.icon || ''}" placeholder="bi-people">
                <div class="icon-preview">
                    Preview: <i class="bi ${item.icon || 'bi-people'}"></i>
                </div>
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="csr-title" value="${item.title || ''}" placeholder="CSR Title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="csr-description" rows="3" placeholder="CSR description">${item.description || ''}</textarea>
            </div>
        `;
        container.appendChild(div);
        
        const iconInput = div.querySelector(`#${iconId}`);
        if (iconInput) {
            iconInput.addEventListener('input', function() {
                const preview = div.querySelector('.icon-preview i');
                if (preview) {
                    preview.className = `bi ${this.value}`;
                }
            });
        }
    });
}

function renderRecognition(items) {
    const container = document.getElementById('recognitionList');
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        const iconId = `recognition-icon-${index}`;
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">Recognition Item ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeRecognitionItem(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="form-group">
                <label>Icon Class 
                    <button type="button" class="icon-picker-btn" onclick="createIconPicker('${iconId}', '${item.icon || 'bi-trophy'}')">
                        <i class="bi bi-palette"></i> Pick Icon
                    </button>
                </label>
                <input type="text" id="${iconId}" class="recognition-icon" value="${item.icon || ''}" placeholder="bi-trophy">
                <div class="icon-preview">
                    Preview: <i class="bi ${item.icon || 'bi-trophy'}"></i>
                </div>
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="recognition-title" value="${item.title || ''}" placeholder="Recognition Title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="recognition-description" rows="3" placeholder="Recognition description">${item.description || ''}</textarea>
            </div>
        `;
        container.appendChild(div);
        
        const iconInput = div.querySelector(`#${iconId}`);
        if (iconInput) {
            iconInput.addEventListener('input', function() {
                const preview = div.querySelector('.icon-preview i');
                if (preview) {
                    preview.className = `bi ${this.value}`;
                }
            });
        }
    });
}

function renderTimeline(items) {
    const container = document.getElementById('timelineList');
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'editable-item';
        div.innerHTML = `
            <div class="editable-item-header">
                <span class="editable-item-title">Timeline Item ${index + 1}</span>
                <button type="button" class="btn-remove" onclick="removeTimelineItem(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="timeline-year" value="${item.year || ''}" placeholder="2007">
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="timeline-title" value="${item.title || ''}" placeholder="Timeline Title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="timeline-description" rows="3" placeholder="Timeline description">${item.description || ''}</textarea>
            </div>
        `;
        container.appendChild(div);
    });
}

// Setup additional images for a project
function setupAdditionalImages(div, projectIndex) {
    const additionalImageItems = div.querySelectorAll('.additional-image-item');
    additionalImageItems.forEach((item, imgIndex) => {
        const input = item.querySelector('.additional-image-input');
        const preview = item.querySelector('.additional-image-preview');
        const upload = item.querySelector('.additional-image-upload');
        const fileBtn = item.querySelector('.additional-image-file-btn');
        
        // Setup preview
        if (input && preview) {
            const updatePreview = function() {
                const value = input.value.trim();
                if (value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('images/'))) {
                    preview.src = value;
                    preview.style.display = 'block';
                    preview.onerror = function() {
                        this.style.display = 'none';
                    };
                } else {
                    preview.style.display = 'none';
                }
            };
            input.addEventListener('input', updatePreview);
            if (input.value) updatePreview();
        }
        
        // Setup upload
        if (upload) {
            upload.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (input) {
                            input.value = `images/${upload.files[0].name}`;
                        }
                        if (preview) {
                            preview.src = e.target.result;
                            preview.style.display = 'block';
                        }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
        
        // Setup file selector
        if (fileBtn) {
            fileBtn.onclick = function() {
                openFileSelector(null, null, 'image', `project-additional-${projectIndex}-${imgIndex}`);
            };
        }
    });
}

// Add additional image to a project
window.addAdditionalImage = function(projectIndex) {
    console.log('addAdditionalImage called for project:', projectIndex);
    const projectItem = document.querySelectorAll('#projectsList .editable-item')[projectIndex];
    if (!projectItem) {
        console.error('Project item not found at index:', projectIndex);
        return;
    }
    
    const container = projectItem.querySelector('.project-additional-images');
    if (!container) {
        console.error('Additional images container not found');
        return;
    }
    
    const imgIndex = container.querySelectorAll('.additional-image-item').length;
    console.log('Adding image at index:', imgIndex);
    const newItem = document.createElement('div');
    newItem.className = 'additional-image-item';
    newItem.style.marginBottom = '0.75rem';
    newItem.innerHTML = `
        <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
            <input type="text" class="additional-image-input" value="" placeholder="images/Projects/..." style="flex: 1; padding: 0.4rem 0.5rem !important; line-height: 1.3; height: auto; min-height: auto;">
            <button type="button" class="btn-select-file additional-image-file-btn" data-project="${projectIndex}" data-image="${imgIndex}" title="Select from existing files">
                <i class="bi bi-folder"></i>
            </button>
            <button type="button" class="btn-remove-small" onclick="removeAdditionalImage(${projectIndex}, ${imgIndex})" title="Remove image">
                <i class="bi bi-x"></i>
            </button>
        </div>
        <div class="file-upload-wrapper" style="margin-top: 0.5rem;">
            <input type="file" class="additional-image-upload file-upload-input" accept="image/*" data-project="${projectIndex}" data-image="${imgIndex}">
            <label class="file-upload-label">
                <i class="bi bi-upload"></i>
                <span>Upload Image</span>
            </label>
        </div>
        <img class="image-preview additional-image-preview" style="display: none; max-width: 100%; max-height: 150px; margin-top: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color);">
    `;
    
    container.appendChild(newItem);
    setupAdditionalImages(projectItem, projectIndex);
};

// Remove additional image from a project
window.removeAdditionalImage = function(projectIndex, imgIndex) {
    const projectItem = document.querySelectorAll('#projectsList .editable-item')[projectIndex];
    if (!projectItem) return;
    
    const container = projectItem.querySelector('.project-additional-images');
    if (!container) return;
    
    const items = container.querySelectorAll('.additional-image-item');
    if (items[imgIndex]) {
        items[imgIndex].remove();
    }
};

function renderProjects(items) {
    console.log('=== RENDER PROJECTS START ===');
    console.log(`Render Step 1: Looking for projectsList container`);
    const container = document.getElementById('projectsList');
    if (!container) {
        console.error('ERROR: Projects list container not found!');
        showMessage('ERROR: Projects list container not found!', 'error');
        return;
    }
    console.log(`Render Step 2: Container found, clearing it`);
    container.innerHTML = '';
    console.log(`Render Step 3: Rendering ${items.length} projects`);
    
    if (items.length === 0) {
        console.warn('WARNING: No items to render!');
        showMessage('WARNING: No projects to render!', 'error');
        return;
    }
    
    items.forEach((item, index) => {
        console.log(`Render Step 4.${index + 1}: Rendering project ${index + 1}: ${item.name || item.title || 'Unnamed'}`);
        const div = document.createElement('div');
        div.className = 'editable-item collapsible';
        const isExpanded = index === 0; // First item expanded by default
        div.innerHTML = `
            <div class="editable-item-header" onclick="toggleCollapsible(this)">
                <span class="editable-item-title">Project ${index + 1}: ${item.name || item.title || 'New Project'}</span>
                <button type="button" class="btn-remove" onclick="event.stopPropagation(); removeProject(${index})">
                    <i class="bi bi-trash"></i> Remove
                </button>
            </div>
            <div class="collapsible-content ${isExpanded ? 'expanded' : ''}">
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" class="project-name" value="${item.name || item.title || ''}" placeholder="Project Name">
                </div>
                <div class="form-group">
                    <label>Featured Project?</label>
                    <input type="checkbox" class="project-featured" ${item.featured ? 'checked' : ''}>
                    <small>Check if this is a featured project</small>
                </div>
                <div class="form-group">
                    <label>Main Image URL</label>
                    <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                        <input type="text" class="project-main-image" value="${item.mainImage || item.images?.[0] || ''}" placeholder="images/Projects/..." style="flex: 1; padding: 0.4rem 0.5rem !important; line-height: 1.3; height: auto; min-height: auto;">
                        <button type="button" class="btn-select-file project-main-file-btn" data-index="${index}" title="Select from existing files">
                            <i class="bi bi-folder"></i>
                        </button>
                    </div>
                    <div class="file-upload-wrapper" style="margin-top: 0.5rem;">
                        <input type="file" class="project-image-upload file-upload-input" accept="image/*" data-index="${index}">
                        <label for="project-image-upload-${index}" class="file-upload-label">
                            <i class="bi bi-upload"></i>
                            <span>Upload Image</span>
                        </label>
                    </div>
                    <img class="image-preview project-main-image-preview" style="display: none; max-width: 100%; max-height: 150px; margin-top: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color);">
                </div>
                <div class="form-group">
                    <label>Additional Images</label>
                    <div class="project-additional-images" data-index="${index}">
                        ${(item.images || []).slice(1).map((img, imgIndex) => `
                            <div class="additional-image-item" style="margin-bottom: 0.75rem;">
                                <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                                    <input type="text" class="additional-image-input" value="${img}" placeholder="images/Projects/..." style="flex: 1; padding: 0.4rem 0.5rem !important; line-height: 1.3; height: auto; min-height: auto;">
                                    <button type="button" class="btn-select-file additional-image-file-btn" data-project="${index}" data-image="${imgIndex}" title="Select from existing files">
                                        <i class="bi bi-folder"></i>
                                    </button>
                                    <button type="button" class="btn-remove-small" onclick="removeAdditionalImage(${index}, ${imgIndex})" title="Remove image">
                                        <i class="bi bi-x"></i>
                                    </button>
                                </div>
                                <div class="file-upload-wrapper" style="margin-top: 0.5rem;">
                                    <input type="file" class="additional-image-upload file-upload-input" accept="image/*" data-project="${index}" data-image="${imgIndex}">
                                    <label class="file-upload-label">
                                        <i class="bi bi-upload"></i>
                                        <span>Upload Image</span>
                                    </label>
                                </div>
                                <img class="image-preview additional-image-preview" style="display: none; max-width: 100%; max-height: 150px; margin-top: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color);">
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="btn-add-small" onclick="addAdditionalImage(${index})" style="margin-top: 0.75rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i class="bi bi-plus-circle"></i> Add Image
                    </button>
                </div>
                <div class="form-group">
                    <label>Meta Items</label>
                    <div class="meta-items-list" data-project-index="${index}">
                        ${(item.meta || []).map((m, metaIndex) => {
                            const icon = typeof m === 'string' ? (m.split('|')[0] || 'bi-info') : (m.icon || 'bi-info');
                            // Handle both old format (with label) and new format (value only)
                            const value = typeof m === 'string' ? (m.split('|')[2] || m.split('|')[1] || '') : (m.value || m.label || '');
                            return `
                                <div class="meta-item-row" data-meta-index="${metaIndex}">
                                    <button type="button" class="icon-picker-btn" onclick="createIconPicker('meta-icon-${index}-${metaIndex}', '${icon}')">
                                        <i class="bi ${icon}" id="meta-icon-preview-${index}-${metaIndex}"></i>
                                        <span>Pick Icon</span>
                                    </button>
                                    <input type="text" class="meta-icon-input" id="meta-icon-${index}-${metaIndex}" value="${icon}" style="display: none;">
                                    <input type="text" class="meta-value-input" placeholder="Text (e.g., Hammarsdale–Cato Ridge, N3 Corridor)" value="${value || label}" style="flex: 1;">
                                    <button type="button" class="btn-remove-small" onclick="removeMetaItem(${index}, ${metaIndex})">
                                        <i class="bi bi-x"></i>
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <button type="button" class="btn-add-small" onclick="addMetaItem(${index})">
                        <i class="bi bi-plus-circle"></i> Add Meta Item
                    </button>
                </div>
                <div class="form-group">
                    <label>Description Paragraphs (one per line)</label>
                    <textarea class="project-description" rows="6" placeholder="First paragraph...&#10;&#10;Second paragraph...">${(item.description || (item.descriptions || [])).join ? (item.description || (item.descriptions || [])).join('\n\n') : (item.description || '')}</textarea>
                    <small>Each paragraph separated by a blank line</small>
                </div>
                <div class="form-group">
                    <label>Section Headings & Content (one per line: Heading|Content)</label>
                    <textarea class="project-sections" rows="4" placeholder="Anchor Occupiers & Facilities|List of tenants...&#10;Sustainability|Sustainability info...">${(item.sections || []).map(s => {
                        if (typeof s === 'string') return s;
                        return `${s.heading || ''}|${s.content || ''}`;
                    }).join('\n')}</textarea>
                    <small>Format: Heading|Content (one per line)</small>
                </div>
                <div class="form-group">
                    <label>Tenants/Occupiers (one per line)</label>
                    <textarea class="project-tenants" rows="4" placeholder="Mr Price Group - National Distribution Centre&#10;Ackermans - Mega Distribution Centre">${(item.tenants || []).join('\n')}</textarea>
                    <small>One tenant per line</small>
                </div>
                <div class="form-group">
                    <label>Feature Tags (comma-separated)</label>
                    <input type="text" class="project-features" value="${(item.features || []).join(', ')}" placeholder="Logistics Hub, Mega DCs, N3 Corridor">
                    <small>Comma-separated feature tags</small>
                </div>
                <div class="form-group">
                    <label>External Link (optional)</label>
                    <input type="text" class="project-link" value="${item.link || ''}" placeholder="https://...">
                    <small>Optional external link for more information</small>
                </div>
            </div>
        `;
        container.appendChild(div);
        
        // Setup image upload
        const uploadInput = div.querySelector('.project-image-upload');
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => {
                const mainImageInput = div.querySelector('.project-main-image');
                const preview = div.querySelector('.project-main-image-preview');
                if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (mainImageInput) {
                            mainImageInput.value = `images/${uploadInput.files[0].name}`;
                        }
                        if (preview) {
                            preview.src = e.target.result;
                            preview.style.display = 'block';
                        }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
        
        // Setup preview and file selector for main image input
        const mainImageInput = div.querySelector('.project-main-image');
        const mainImagePreview = div.querySelector('.project-main-image-preview');
        const mainFileBtn = div.querySelector('.project-main-file-btn');
        
        if (mainImageInput && mainImagePreview) {
            const updatePreview = function() {
                const value = mainImageInput.value.trim();
                if (value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('images/'))) {
                    mainImagePreview.src = value;
                    mainImagePreview.style.display = 'block';
                    mainImagePreview.onerror = function() {
                        this.style.display = 'none';
                    };
                } else {
                    mainImagePreview.style.display = 'none';
                }
            };
            mainImageInput.addEventListener('input', updatePreview);
            if (mainImageInput.value) updatePreview();
        }
        
        // Setup file selector for main image
        if (mainFileBtn) {
            mainFileBtn.onclick = function() {
                openFileSelector(null, null, 'image', 'project-main-' + index);
            };
        }
        
        // Setup additional images
        setupAdditionalImages(div, index);
        
        // Setup icon preview updates for meta items
        const metaIconInputs = div.querySelectorAll('.meta-icon-input');
        metaIconInputs.forEach(iconInput => {
            const previewId = iconInput.id.replace('meta-icon-', 'meta-icon-preview-');
            const preview = document.getElementById(previewId);
            if (preview) {
                iconInput.addEventListener('input', function() {
                    const iconClass = this.value.trim() || 'bi-info';
                    preview.className = `bi ${iconClass}`;
                });
                // Update on load
                const iconClass = iconInput.value.trim() || 'bi-info';
                preview.className = `bi ${iconClass}`;
            }
        });
        
        // Setup preview for showcase images
        const showcaseImageInput = div.querySelector('.showcase-image');
        const showcaseImagePreview = div.querySelector('.showcase-image-preview');
        if (showcaseImageInput && showcaseImagePreview) {
            const updatePreview = function() {
                const value = showcaseImageInput.value.trim();
                if (value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('images/'))) {
                    showcaseImagePreview.src = value;
                    showcaseImagePreview.style.display = 'block';
                    showcaseImagePreview.onerror = function() {
                        this.style.display = 'none';
                    };
                } else {
                    showcaseImagePreview.style.display = 'none';
                }
            };
            showcaseImageInput.addEventListener('input', updatePreview);
            if (showcaseImageInput.value) updatePreview();
        }
    });
    
    console.log(`Render Step 5: All ${items.length} projects rendered`);
    const finalCount = container.children.length;
    console.log(`Render Step 6: Container now has ${finalCount} children`);
    console.log('=== RENDER PROJECTS COMPLETE ===');
}

// Add functions
function addFeature() {
    const content = getContent();
    if (!content.homePage) content.homePage = {};
    if (!content.homePage.features) content.homePage.features = { items: [] };
    if (!content.homePage.features.items) content.homePage.features.items = [];
    content.homePage.features.items.push({ icon: 'bi-building', title: '', description: '' });
    saveContent(content);
    renderFeatures(content.homePage.features.items);
}

function addShowcase() {
    const content = getContent();
    if (!content.homePage) content.homePage = {};
    if (!content.homePage.showcase) content.homePage.showcase = { items: [] };
    if (!content.homePage.showcase.items) content.homePage.showcase.items = [];
    content.homePage.showcase.items.push({ image: '', title: '', description: '' });
    saveContent(content);
    renderShowcase(content.homePage.showcase.items);
}

function addTestimonial() {
    const content = getContent();
    if (!content.homePage) content.homePage = {};
    if (!content.homePage.testimonials) content.homePage.testimonials = { items: [] };
    if (!content.homePage.testimonials.items) content.homePage.testimonials.items = [];
    content.homePage.testimonials.items.push({ quote: '', author: '', title: '', avatar: '' });
    saveContent(content);
    renderTestimonials(content.homePage.testimonials.items);
}

function addNews() {
    const content = getContent();
    if (!content.homePage) content.homePage = {};
    if (!content.homePage.news) content.homePage.news = { items: [] };
    if (!content.homePage.news.items) content.homePage.news.items = [];
    content.homePage.news.items.push({ image: '', date: '', category: '', title: '', description: '', link: '' });
    saveContent(content);
    renderNews(content.homePage.news.items);
}

function addStat() {
    const content = getContent();
    if (!content.homePage) content.homePage = {};
    if (!content.homePage.stats) content.homePage.stats = { items: [] };
    if (!content.homePage.stats.items) content.homePage.stats.items = [];
    content.homePage.stats.items.push({ number: '', label: '' });
    saveContent(content);
    renderStats(content.homePage.stats.items);
}

function addAboutStat() {
    const content = getContent();
    if (!content.aboutPage) content.aboutPage = {};
    if (!content.aboutPage.stats) content.aboutPage.stats = { items: [] };
    if (!content.aboutPage.stats.items) content.aboutPage.stats.items = [];
    content.aboutPage.stats.items.push({ number: '', label: '' });
    saveContent(content);
    renderAboutStats(content.aboutPage.stats.items);
}

function addValue() {
    const content = getContent();
    if (!content.aboutPage) content.aboutPage = {};
    if (!content.aboutPage.values) content.aboutPage.values = { items: [] };
    if (!content.aboutPage.values.items) content.aboutPage.values.items = [];
    content.aboutPage.values.items.push({ icon: 'bi-star', title: '', description: '' });
    saveContent(content);
    renderValues(content.aboutPage.values.items);
}

function addCSRItem() {
    const content = getContent();
    if (!content.aboutPage) content.aboutPage = {};
    if (!content.aboutPage.csr) content.aboutPage.csr = { items: [] };
    if (!content.aboutPage.csr.items) content.aboutPage.csr.items = [];
    content.aboutPage.csr.items.push({ icon: 'bi-people', title: '', description: '' });
    saveContent(content);
    renderCSR(content.aboutPage.csr.items);
}

function addRecognitionItem() {
    const content = getContent();
    if (!content.aboutPage) content.aboutPage = {};
    if (!content.aboutPage.recognition) content.aboutPage.recognition = { items: [] };
    if (!content.aboutPage.recognition.items) content.aboutPage.recognition.items = [];
    content.aboutPage.recognition.items.push({ icon: 'bi-trophy', title: '', description: '' });
    saveContent(content);
    renderRecognition(content.aboutPage.recognition.items);
}

function addTimelineItem() {
    const content = getContent();
    if (!content.aboutPage) content.aboutPage = {};
    if (!content.aboutPage.timeline) content.aboutPage.timeline = { items: [] };
    if (!content.aboutPage.timeline.items) content.aboutPage.timeline.items = [];
    content.aboutPage.timeline.items.push({ year: '', title: '', description: '' });
    saveContent(content);
    renderTimeline(content.aboutPage.timeline.items);
}

function addProject() {
    const content = getContent();
    if (!content.projectsPage) content.projectsPage = {};
    if (!content.projectsPage.projects) content.projectsPage.projects = { items: [] };
    if (!content.projectsPage.projects.items) content.projectsPage.projects.items = [];
    content.projectsPage.projects.items.push({ 
        name: '', 
        title: '',
        featured: false,
        mainImage: '',
        images: [], 
        description: '', 
        descriptions: [],
        meta: [],
        sections: [],
        tenants: [],
        features: [],
        link: ''
    });
    saveContent(content);
    renderProjects(content.projectsPage.projects.items);
}

// Toggle collapsible items
// toggleCollapsible is already defined at the top of the file for immediate availability

// Direct extraction from projects page using fetch
window.extractProjectsDirectly = async function() {
    console.log('=== STARTING PROJECT EXTRACTION ===');
    showMessage('Step 1: Fetching projects.html...', 'success');
    
    try {
        console.log('Step 1: Fetching projects.html');
        const response = await fetch('projects.html');
        console.log('Step 2: Response received, status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        showMessage('Step 2: Parsing HTML...', 'success');
        console.log('Step 3: Getting response text');
        const html = await response.text();
        console.log('Step 4: HTML received, length:', html.length);
        
        showMessage('Step 3: Parsing document...', 'success');
        console.log('Step 5: Creating parser');
        const parser = new DOMParser();
        console.log('Step 6: Parsing HTML');
        const doc = parser.parseFromString(html, 'text/html');
        console.log('Step 7: Document parsed');
        
        showMessage('Step 4: Extracting projects...', 'success');
        console.log('Step 8: Starting manual extraction');
        extractProjectsManually(doc);
        
    } catch (error) {
        console.error('=== EXTRACTION ERROR ===', error);
        console.error('Error details:', error.message, error.stack);
        showMessage(`Error: ${error.message}. Make sure you are running from a web server.`, 'error');
    }
}

// Manual extraction - directly from HTML
window.extractProjectsManually = function(doc) {
    console.log('=== MANUAL EXTRACTION START ===');
    console.log('Step 9: Looking for project cards');
    const projects = [];
    const projectCards = doc.querySelectorAll('.project-card');
    console.log(`Step 10: Found ${projectCards.length} project cards`);
    
    if (projectCards.length === 0) {
        console.error('ERROR: No project cards found!');
        showMessage('ERROR: No project cards found in HTML!', 'error');
        return;
    }
    
    let processedCount = 0;
    projectCards.forEach((card, cardIndex) => {
        console.log(`Step 11.${cardIndex + 1}: Processing project card ${cardIndex + 1}`);
        const nameEl = card.querySelector('.project-details h2');
        const name = nameEl ? nameEl.textContent.trim() : '';
        
        const featured = card.classList.contains('featured') || card.querySelector('.project-badge');
        
        // Get images
        const images = [];
        const slideshow = card.querySelector('.project-slideshow');
        if (slideshow) {
            const slides = slideshow.querySelectorAll('.project-slide');
            slides.forEach(slide => {
                const bgImage = slide.style.backgroundImage;
                if (bgImage) {
                    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (match) images.push(match[1]);
                }
            });
        } else {
            const image = card.querySelector('.project-image');
            if (image) {
                const bgImage = image.style.backgroundImage;
                if (bgImage) {
                    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (match) images.push(match[1]);
                }
            }
        }
        
        // Get meta
        const metaItems = [];
        const metaElements = card.querySelectorAll('.project-meta .meta-item');
        metaElements.forEach(item => {
            const icon = item.querySelector('i');
            const text = item.textContent.trim();
            const iconClass = icon ? icon.className.replace('me-1 text-primary', '').trim() : '';
            metaItems.push({
                icon: iconClass,
                label: '',
                value: text
            });
        });
        
        // Get descriptions
        const descriptions = [];
        const paragraphs = card.querySelectorAll('.project-details p');
        paragraphs.forEach(p => {
            if (!p.closest('.project-info-box') && !p.classList.contains('project-progress')) {
                const text = p.textContent.trim();
                if (text && !text.startsWith('Learn More')) {
                    descriptions.push(text);
                }
            }
        });
        
        // Get sections
        const sections = [];
        const sectionHeadings = card.querySelectorAll('.project-section-heading');
        sectionHeadings.forEach(heading => {
            const headingText = heading.textContent.trim();
            let content = '';
            let current = heading.nextElementSibling;
            while (current && current.parentElement === heading.parentElement) {
                if (current.classList.contains('project-section-heading')) break;
                if (current.tagName === 'UL') {
                    const items = current.querySelectorAll('li');
                    content += Array.from(items).map(li => li.textContent.trim()).join('\n') + '\n';
                } else if (current.tagName === 'P') {
                    content += current.textContent.trim() + '\n';
                }
                current = current.nextElementSibling;
            }
            if (content.trim()) {
                sections.push({ heading: headingText, content: content.trim() });
            }
        });
        
        // Get tenants
        const tenants = [];
        const tenantList = card.querySelector('.tenant-list');
        if (tenantList) {
            tenantList.querySelectorAll('li').forEach(li => {
                tenants.push(li.textContent.trim());
            });
        }
        
        // Get features
        const features = [];
        card.querySelectorAll('.feature-tag').forEach(tag => {
            const icon = tag.querySelector('i');
            let text = tag.textContent.trim();
            if (icon) {
                text = text.replace(icon.textContent, '').trim();
            }
            if (text) features.push(text);
        });
        
        // Get link
        let link = '';
        const infoBox = card.querySelector('.project-info-box');
        if (infoBox) {
            const linkEl = infoBox.querySelector('a');
            if (linkEl) link = linkEl.href;
        }
        
        const projectData = {
            name: name,
            title: name,
            featured: !!featured,
            mainImage: images[0] || '',
            images: images,
            meta: metaItems,
            description: descriptions.join('\n\n'),
            descriptions: descriptions,
            sections: sections,
            tenants: tenants,
            features: features,
            link: link
        };
        
        console.log(`Step 11.${cardIndex + 1}.10: Project "${name}" extracted:`, {
            images: images.length,
            meta: metaItems.length,
            descriptions: descriptions.length,
            sections: sections.length,
            tenants: tenants.length,
            features: features.length
        });
        
        projects.push(projectData);
        processedCount++;
    });
    
    console.log(`Step 12: Extracted ${processedCount} projects total`);
    console.log('Step 13: Getting existing content');
    const existingContent = getContent();
    console.log('Step 14: Setting projects page data');
    if (!existingContent.projectsPage) existingContent.projectsPage = {};
    existingContent.projectsPage.projects = { items: projects };
    
    console.log('Step 15: Saving content to localStorage');
    saveContent(existingContent);
    console.log('Step 16: Verifying save');
    const verify = localStorage.getItem('rokwil_admin_content');
    console.log('Step 17: Save verified, content length:', verify ? verify.length : 0);
    
    console.log('Step 18: Rendering projects');
    showMessage(`Step 5: Rendering ${projects.length} projects...`, 'success');
    renderProjects(projects);
    
    console.log('Step 19: Checking if projects rendered');
    setTimeout(() => {
        const projectsList = document.getElementById('projectsList');
        const renderedCount = projectsList ? projectsList.children.length : 0;
        console.log(`Step 20: Rendered ${renderedCount} projects in DOM`);
        if (renderedCount > 0) {
            showMessage(`SUCCESS: Loaded and rendered ${renderedCount} projects!`, 'success');
        } else {
            showMessage(`WARNING: Extracted ${projects.length} but rendered ${renderedCount}`, 'error');
        }
    }, 100);
    
    console.log('=== EXTRACTION COMPLETE ===');
}

// Remove functions - Make them global
window.removeFeature = function(index) {
    if (!confirm('Remove this feature?')) return;
    const content = getContent();
    if (content.homePage && content.homePage.features && content.homePage.features.items) {
        content.homePage.features.items.splice(index, 1);
        saveContent(content);
        renderFeatures(content.homePage.features.items);
        showMessage('Feature removed successfully!');
    }
};

window.removeShowcase = function(index) {
    if (!confirm('Remove this showcase item?')) return;
    const content = getContent();
    if (content.homePage && content.homePage.showcase && content.homePage.showcase.items) {
        content.homePage.showcase.items.splice(index, 1);
        saveContent(content);
        renderShowcase(content.homePage.showcase.items);
        showMessage('Showcase item removed successfully!');
    }
};

window.removeTestimonial = function(index) {
    if (!confirm('Remove this testimonial?')) return;
    const content = getContent();
    if (content.homePage && content.homePage.testimonials && content.homePage.testimonials.items) {
        content.homePage.testimonials.items.splice(index, 1);
        saveContent(content);
        renderTestimonials(content.homePage.testimonials.items);
        showMessage('Testimonial removed successfully!');
    }
};

window.removeNews = function(index) {
    if (!confirm('Remove this news item?')) return;
    const content = getContent();
    if (content.homePage && content.homePage.news && content.homePage.news.items) {
        content.homePage.news.items.splice(index, 1);
        saveContent(content);
        renderNews(content.homePage.news.items);
        showMessage('News item removed successfully!');
    }
};

window.removeStat = function(index) {
    if (!confirm('Remove this stat?')) return;
    const content = getContent();
    if (content.homePage && content.homePage.stats && content.homePage.stats.items) {
        content.homePage.stats.items.splice(index, 1);
        saveContent(content);
        renderStats(content.homePage.stats.items);
        showMessage('Stat removed successfully!');
    }
};

window.removeAboutStat = function(index) {
    if (!confirm('Remove this stat?')) return;
    const content = getContent();
    if (content.aboutPage && content.aboutPage.stats && content.aboutPage.stats.items) {
        content.aboutPage.stats.items.splice(index, 1);
        saveContent(content);
        renderAboutStats(content.aboutPage.stats.items);
        showMessage('Stat removed successfully!');
    }
};

window.removeValue = function(index) {
    if (!confirm('Remove this value?')) return;
    const content = getContent();
    if (content.aboutPage && content.aboutPage.values && content.aboutPage.values.items) {
        content.aboutPage.values.items.splice(index, 1);
        saveContent(content);
        renderValues(content.aboutPage.values.items);
        showMessage('Value removed successfully!');
    }
};

window.removeCSRItem = function(index) {
    if (!confirm('Remove this CSR item?')) return;
    const content = getContent();
    if (content.aboutPage && content.aboutPage.csr && content.aboutPage.csr.items) {
        content.aboutPage.csr.items.splice(index, 1);
        saveContent(content);
        renderCSR(content.aboutPage.csr.items);
        showMessage('CSR item removed successfully!');
    }
};

window.removeRecognitionItem = function(index) {
    if (!confirm('Remove this recognition item?')) return;
    const content = getContent();
    if (content.aboutPage && content.aboutPage.recognition && content.aboutPage.recognition.items) {
        content.aboutPage.recognition.items.splice(index, 1);
        saveContent(content);
        renderRecognition(content.aboutPage.recognition.items);
        showMessage('Recognition item removed successfully!');
    }
};

window.removeTimelineItem = function(index) {
    if (!confirm('Remove this timeline item?')) return;
    const content = getContent();
    if (content.aboutPage && content.aboutPage.timeline && content.aboutPage.timeline.items) {
        content.aboutPage.timeline.items.splice(index, 1);
        saveContent(content);
        renderTimeline(content.aboutPage.timeline.items);
        showMessage('Timeline item removed successfully!');
    }
};

window.removeProject = function(index) {
    if (!confirm('Remove this project?')) return;
    const content = getContent();
    if (content.projectsPage && content.projectsPage.projects && content.projectsPage.projects.items) {
        content.projectsPage.projects.items.splice(index, 1);
        saveContent(content);
        renderProjects(content.projectsPage.projects.items);
        showMessage('Project removed successfully!');
    }
};

// Meta item management functions
window.addMetaItem = function(projectIndex) {
    const projectItem = document.querySelectorAll('#projectsList .editable-item')[projectIndex];
    if (!projectItem) return;
    
    const metaList = projectItem.querySelector('.meta-items-list');
    if (!metaList) return;
    
    const metaIndex = metaList.children.length;
    const newRow = document.createElement('div');
    newRow.className = 'meta-item-row';
    newRow.setAttribute('data-meta-index', metaIndex);
    newRow.innerHTML = `
        <button type="button" class="icon-picker-btn" onclick="createIconPicker('meta-icon-${projectIndex}-${metaIndex}', 'bi-info')">
            <i class="bi bi-info" id="meta-icon-preview-${projectIndex}-${metaIndex}"></i>
            <span>Pick Icon</span>
        </button>
        <input type="text" class="meta-icon-input" id="meta-icon-${projectIndex}-${metaIndex}" value="bi-info" style="display: none;">
        <input type="text" class="meta-value-input" placeholder="Text (e.g., Hammarsdale–Cato Ridge, N3 Corridor)" value="" style="flex: 1;">
        <button type="button" class="btn-remove-small" onclick="removeMetaItem(${projectIndex}, ${metaIndex})">
            <i class="bi bi-x"></i>
        </button>
    `;
    metaList.appendChild(newRow);
    
    // Setup icon preview update
    const iconInput = newRow.querySelector('.meta-icon-input');
    const preview = newRow.querySelector('i[id^="meta-icon-preview"]');
    if (iconInput && preview) {
        iconInput.addEventListener('input', function() {
            const iconClass = this.value.trim() || 'bi-info';
            preview.className = `bi ${iconClass}`;
        });
    }
};

window.removeMetaItem = function(projectIndex, metaIndex) {
    const projectItem = document.querySelectorAll('#projectsList .editable-item')[projectIndex];
    if (!projectItem) return;
    
    const metaList = projectItem.querySelector('.meta-items-list');
    if (!metaList) return;
    
    const row = metaList.querySelector(`[data-meta-index="${metaIndex}"]`);
    if (row) {
        row.remove();
        // Re-index remaining items
        Array.from(metaList.children).forEach((item, index) => {
            item.setAttribute('data-meta-index', index);
            const iconBtn = item.querySelector('.icon-picker-btn');
            const iconInput = item.querySelector('.meta-icon-input');
            const iconPreview = item.querySelector('i[id^="meta-icon-preview"]');
            if (iconBtn && iconInput && iconPreview) {
                const newId = `meta-icon-${projectIndex}-${index}`;
                const currentIcon = iconInput.value || 'bi-info';
                iconInput.id = newId;
                iconPreview.id = `meta-icon-preview-${projectIndex}-${index}`;
                iconBtn.setAttribute('onclick', `createIconPicker('${newId}', '${currentIcon}')`);
            }
            const removeBtn = item.querySelector('.btn-remove-small');
            if (removeBtn) {
                removeBtn.setAttribute('onclick', `removeMetaItem(${projectIndex}, ${index})`);
            }
        });
    }
};

// Remove functions are now defined as window functions above

// Save functions
function saveTimeline() {
    const content = getContent();
    if (!content.aboutPage) content.aboutPage = {};
    if (!content.aboutPage.timeline) content.aboutPage.timeline = { items: [] };
    
    const items = Array.from(document.querySelectorAll('#timelineList .editable-item')).map(item => ({
        year: item.querySelector('.timeline-year').value,
        title: item.querySelector('.timeline-title').value,
        description: item.querySelector('.timeline-description').value
    }));
    
    content.aboutPage.timeline.items = items;
    if (saveContent(content)) {
        showMessage('Timeline saved successfully!');
    }
}

function saveProjects() {
    const content = getContent();
    if (!content.projectsPage) content.projectsPage = {};
    if (!content.projectsPage.projects) content.projectsPage.projects = { items: [] };
    
    const items = Array.from(document.querySelectorAll('#projectsList .editable-item')).map(item => {
        const name = item.querySelector('.project-name')?.value || '';
        const featured = item.querySelector('.project-featured')?.checked || false;
        const mainImage = item.querySelector('.project-main-image')?.value || '';
        const additionalImageInputs = item.querySelectorAll('.additional-image-input');
        const additionalImages = Array.from(additionalImageInputs).map(input => input.value.trim()).filter(s => s);
        const allImages = mainImage ? [mainImage, ...additionalImages] : additionalImages;
        
        // Get meta items from new structure
        const metaItems = [];
        const metaRows = item.querySelectorAll('.meta-item-row');
        metaRows.forEach(row => {
            const iconInput = row.querySelector('.meta-icon-input');
            const valueInput = row.querySelector('.meta-value-input');
            const icon = iconInput?.value.trim() || 'bi-info';
            const value = valueInput?.value.trim() || '';
            if (value) { // Only add if there's a value
                metaItems.push({ icon, value });
            }
        });
        const meta = metaItems;
        
        const descriptionText = item.querySelector('.project-description')?.value || '';
        const descriptions = descriptionText.split('\n\n').filter(s => s.trim());
        
        const sectionsText = item.querySelector('.project-sections')?.value || '';
        const sections = sectionsText.split('\n').map(line => {
            const parts = line.split('|').map(s => s.trim());
            if (parts.length >= 2) {
                return { heading: parts[0], content: parts[1] };
            }
            return null;
        }).filter(s => s);
        
        const tenantsText = item.querySelector('.project-tenants')?.value || '';
        const tenants = tenantsText.split('\n').map(s => s.trim()).filter(s => s);
        
        const featuresText = item.querySelector('.project-features')?.value || '';
        const features = featuresText.split(',').map(s => s.trim()).filter(s => s);
        
        const link = item.querySelector('.project-link')?.value || '';
        
        return {
            name: name,
            title: name,
            featured: featured,
            mainImage: mainImage,
            images: allImages,
            meta: meta,
            description: descriptions.join('\n\n'),
            descriptions: descriptions,
            sections: sections,
            tenants: tenants,
            features: features,
            link: link
        };
    });
    
    content.projectsPage.projects.items = items;
    if (saveContent(content)) {
        showMessage('Projects saved successfully!');
    }
}

// Update icon previews
function updateIconPreviews() {
    const emailIcon = document.getElementById('emailIcon').value || 'bi-envelope-fill';
    const phoneIcon = document.getElementById('phoneIcon').value || 'bi-telephone-fill';
    const locationIcon = document.getElementById('locationIcon').value || 'bi-geo-alt-fill';
    
    document.getElementById('emailIconPreview').className = `bi ${emailIcon}`;
    document.getElementById('phoneIconPreview').className = `bi ${phoneIcon}`;
    document.getElementById('locationIconPreview').className = `bi ${locationIcon}`;
}

// Icon input listeners and icon picker setup
document.addEventListener('DOMContentLoaded', () => {
    const emailIconInput = document.getElementById('emailIcon');
    const phoneIconInput = document.getElementById('phoneIcon');
    const locationIconInput = document.getElementById('locationIcon');
    
    if (emailIconInput) {
        emailIconInput.addEventListener('input', updateIconPreviews);
        // Add icon picker button
        const emailIconGroup = emailIconInput.closest('.form-group');
        if (emailIconGroup && !emailIconGroup.querySelector('.icon-picker-btn')) {
            const pickerBtn = document.createElement('button');
            pickerBtn.type = 'button';
            pickerBtn.className = 'icon-picker-btn';
            pickerBtn.innerHTML = '<i class="bi bi-palette"></i> Pick Icon';
            pickerBtn.onclick = () => createIconPicker('emailIcon', emailIconInput.value);
            emailIconGroup.querySelector('label').appendChild(pickerBtn);
        }
    }
    
    if (phoneIconInput) {
        phoneIconInput.addEventListener('input', updateIconPreviews);
        const phoneIconGroup = phoneIconInput.closest('.form-group');
        if (phoneIconGroup && !phoneIconGroup.querySelector('.icon-picker-btn')) {
            const pickerBtn = document.createElement('button');
            pickerBtn.type = 'button';
            pickerBtn.className = 'icon-picker-btn';
            pickerBtn.innerHTML = '<i class="bi bi-palette"></i> Pick Icon';
            pickerBtn.onclick = () => createIconPicker('phoneIcon', phoneIconInput.value);
            phoneIconGroup.querySelector('label').appendChild(pickerBtn);
        }
    }
    
    if (locationIconInput) {
        locationIconInput.addEventListener('input', updateIconPreviews);
        const locationIconGroup = locationIconInput.closest('.form-group');
        if (locationIconGroup && !locationIconGroup.querySelector('.icon-picker-btn')) {
            const pickerBtn = document.createElement('button');
            pickerBtn.type = 'button';
            pickerBtn.className = 'icon-picker-btn';
            pickerBtn.innerHTML = '<i class="bi bi-palette"></i> Pick Icon';
            pickerBtn.onclick = () => createIconPicker('locationIcon', locationIconInput.value);
            locationIconGroup.querySelector('label').appendChild(pickerBtn);
        }
    }
    
    // Add "Load Current" buttons to forms
    addLoadCurrentButtons();
    
    // Setup file upload handlers
    setupFileUploads();
    
    // Load initial content
    loadTabContent('home');
});

// Add "Load Current" buttons
function addLoadCurrentButtons() {
    // Home page
    const homeHeroForm = document.getElementById('homeHeroForm');
    if (homeHeroForm) {
        const title = homeHeroForm.querySelector('h3');
        if (title && !title.querySelector('.btn-load-current')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-load-current';
            btn.innerHTML = '<i class="bi bi-download"></i> Load Current';
            btn.onclick = () => loadCurrentContentFromPage('index');
            title.appendChild(btn);
        }
    }
    
    // About page
    const aboutHeroForm = document.getElementById('aboutHeroForm');
    if (aboutHeroForm) {
        const title = aboutHeroForm.querySelector('h3');
        if (title && !title.querySelector('.btn-load-current')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-load-current';
            btn.innerHTML = '<i class="bi bi-download"></i> Load Current';
            btn.onclick = () => loadCurrentContentFromPage('about');
            title.appendChild(btn);
        }
    }
    
    // Projects page
    const projectsHeroForm = document.getElementById('projectsHeroForm');
    if (projectsHeroForm) {
        const title = projectsHeroForm.querySelector('h3');
        if (title && !title.querySelector('.btn-load-current')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-load-current';
            btn.innerHTML = '<i class="bi bi-download"></i> Load Current';
            btn.onclick = () => loadCurrentContentFromPage('projects');
            title.appendChild(btn);
        }
    }
    
    // Contact page
    const contactHeroForm = document.getElementById('contactHeroForm');
    if (contactHeroForm) {
        const title = contactHeroForm.querySelector('h3');
        if (title && !title.querySelector('.btn-load-current')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-load-current';
            btn.innerHTML = '<i class="bi bi-download"></i> Load Current';
            btn.onclick = () => loadCurrentContentFromPage('contact');
            title.appendChild(btn);
        }
    }
}

// Setup file upload handlers
function setupFileUploads() {
    // Hero images
    const heroImage1Upload = document.getElementById('heroImage1Upload');
    if (heroImage1Upload) {
        heroImage1Upload.addEventListener('change', (e) => {
            handleFileUpload(e.target, 'heroImage1', 'heroImage1Preview');
        });
    }
    setupImagePreview('heroImage1', 'heroImage1Preview');
    
    const heroImage2Upload = document.getElementById('heroImage2Upload');
    if (heroImage2Upload) {
        heroImage2Upload.addEventListener('change', (e) => {
            handleFileUpload(e.target, 'heroImage2', 'heroImage2Preview');
        });
    }
    setupImagePreview('heroImage2', 'heroImage2Preview');
    
    // Video
    const videoSrcUpload = document.getElementById('videoSrcUpload');
    if (videoSrcUpload) {
        videoSrcUpload.addEventListener('change', (e) => {
            handleFileUpload(e.target, 'videoSrc', 'videoSrcPreview');
        });
    }
    setupImagePreview('videoSrc', 'videoSrcPreview');
    
    const videoPosterUpload = document.getElementById('videoPosterUpload');
    if (videoPosterUpload) {
        videoPosterUpload.addEventListener('change', (e) => {
            handleFileUpload(e.target, 'videoPoster', 'videoPosterPreview');
        });
    }
    setupImagePreview('videoPoster', 'videoPosterPreview');
    
    // About image
    const aboutImageUpload = document.getElementById('aboutImageUpload');
    if (aboutImageUpload) {
        aboutImageUpload.addEventListener('change', (e) => {
            handleFileUpload(e.target, 'aboutImage', 'aboutImagePreview');
        });
    }
    setupImagePreview('aboutImage', 'aboutImagePreview');
    
    // About hero image
    setupImagePreview('aboutHeroImage', 'aboutHeroImagePreview');
    const aboutHeroImageUpload = document.getElementById('aboutHeroImageUpload');
    if (aboutHeroImageUpload) {
        aboutHeroImageUpload.addEventListener('change', (e) => {
            handleFileUpload(e.target, 'aboutHeroImage', 'aboutHeroImagePreview');
        });
    }
    
    // Projects hero image
    setupImagePreview('projectsHeroImage', 'projectsHeroImagePreview');
    const projectsHeroImageUpload = document.getElementById('projectsHeroImageUpload');
    if (projectsHeroImageUpload) {
        projectsHeroImageUpload.addEventListener('change', (e) => {
            handleFileUpload(e.target, 'projectsHeroImage', 'projectsHeroImagePreview');
        });
    }
    
    // Contact hero image
    setupImagePreview('contactHeroImage', 'contactHeroImagePreview');
    const contactHeroImageUpload = document.getElementById('contactHeroImageUpload');
    if (contactHeroImageUpload) {
        contactHeroImageUpload.addEventListener('change', (e) => {
            handleFileUpload(e.target, 'contactHeroImage', 'contactHeroImagePreview');
        });
    }
    
    // Setup file selector search
    const fileSelectorSearch = document.getElementById('fileSelectorSearch');
    if (fileSelectorSearch) {
        fileSelectorSearch.addEventListener('input', function() {
            filterFileSelector(this.value);
        });
    }
    
    // Setup previews for dynamically rendered items (showcase, projects, etc.)
    // These will be set up when items are rendered
}

// Available files list (can be expanded)
const AVAILABLE_FILES = {
    images: [
        'images/Projects/Keystone/Keystone 2.webp',
        'images/Projects/Keystone/The Boys.jpg',
        'images/Projects/Keystone/Pep MAIN.jpg',
        'images/Projects/Keystone/Pep 2.jpg',
        'images/Projects/Keystone/Pep 3.jpg',
        'images/Projects/Keystone/Pep.jpg',
        'images/Projects/Keystone/ND.webp',
        'images/Projects/Keystone/malda-pack_22-small-400x267.jpg',
        'images/Projects/Judges Court/Judges-Court-high (2).jpg',
        'images/Projects/aQuelle - National Distribution Centre/Aquelle.webp',
        'images/Projects/Lakeview Mini Factories/dji_0041-crop-u6092 (1).jpg',
        'images/Projects/Pioneer Campus/pioneer-campus-2 (1).jpg',
        'images/Projects/Rockwood Mini Factories/Rockwood-1-1.jpg',
        'images/Projects/Umlazi Mega City/umlazi-mega-city-1 (1).jpg',
        'images/Projects/Victory View Offices/Victory-Road (1).jpg',
        'images/Projects/Unkown/Unkown.jpg',
        'images/Archived/Aquelle.webp',
        'images/Archived/Judges Court.jpg',
        'images/Archived/Keystone - logo.webp',
        'images/Archived/keystone - meeting.webp',
        'images/Archived/Keystone 1.webp',
        'images/Archived/Keystone 3.webp',
        'images/Archived/Keystone 5.webp',
        'images/Archived/Keystone 6.webp',
        'images/Archived/Keystone 8.webp',
        'images/Archived/Keystone 9.webp',
        'images/Archived/Keystone 10.webp',
        'images/Archived/Rockwood.jpg',
        'images/Home/Home Screen.jpg',
        'images/Home/Video photo.webp',
    ],
    videos: [
        'videos/Rokwil.mp4',
    ]
};

let currentFileSelector = {
    inputId: null,
    previewId: null,
    fileType: 'image',
    customSelector: null
};

// Open file selector - Make sure it's globally available
window.openFileSelector = function(inputId, previewId, fileType = 'image', customSelector = null) {
    console.log('=== OPEN FILE SELECTOR ===');
    console.log('Parameters:', { inputId, previewId, fileType, customSelector });
    
    currentFileSelector.inputId = inputId;
    currentFileSelector.previewId = previewId;
    currentFileSelector.fileType = fileType;
    currentFileSelector.customSelector = customSelector;
    
    const modal = document.getElementById('fileSelectorModal');
    const title = document.getElementById('fileSelectorTitle');
    const list = document.getElementById('fileSelectorList');
    const search = document.getElementById('fileSelectorSearch');
    
    console.log('Modal elements:', { modal: !!modal, title: !!title, list: !!list, search: !!search });
    
    if (!modal || !list) {
        console.error('File selector modal or list not found!');
        alert('File selector modal not found. Please refresh the page.');
        return;
    }
    
    title.textContent = `Select ${fileType === 'image' ? 'Image' : 'Video'}`;
    search.value = '';
    
    // Get files based on type
    const files = fileType === 'image' ? AVAILABLE_FILES.images : AVAILABLE_FILES.videos;
    
    // Render file list
    list.innerHTML = '';
    files.forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-selector-item';
        item.onclick = () => selectFile(file);
        
        const thumbnail = document.createElement(fileType === 'image' ? 'img' : 'video');
        thumbnail.className = 'file-selector-thumbnail';
        thumbnail.src = file;
        if (fileType === 'video') {
            thumbnail.controls = false;
            thumbnail.muted = true;
        }
        thumbnail.onerror = function() {
            // Show placeholder instead of hiding
            if (fileType === 'image') {
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect width="60" height="60" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                this.style.display = 'block';
            } else {
                this.style.display = 'none';
            }
        };
        thumbnail.onload = function() {
            // Image loaded successfully
            this.style.display = 'block';
        };
        // Set initial display
        thumbnail.style.display = 'block';
        
        const info = document.createElement('div');
        info.className = 'file-selector-info';
        
        const name = document.createElement('div');
        name.className = 'file-selector-name';
        name.textContent = file.split('/').pop();
        
        const path = document.createElement('div');
        path.className = 'file-selector-path';
        path.textContent = file;
        
        info.appendChild(name);
        info.appendChild(path);
        item.appendChild(thumbnail);
        item.appendChild(info);
        list.appendChild(item);
    });
    
    console.log('Adding show class to modal');
    modal.classList.add('show');
    console.log('Modal should now be visible');
    console.log('Modal classes:', modal.className);
};

// Close file selector
window.closeFileSelector = function() {
    const modal = document.getElementById('fileSelectorModal');
    if (modal) {
        modal.classList.remove('show');
    }
};

// Select file
function selectFile(file) {
    // Handle custom selectors (like showcase items)
    if (currentFileSelector.customSelector && currentFileSelector.customSelector.startsWith('showcase-')) {
        const index = currentFileSelector.customSelector.replace('showcase-', '');
        const showcaseItems = document.querySelectorAll('#showcaseList .editable-item');
        if (showcaseItems[index]) {
            const showcaseImageInput = showcaseItems[index].querySelector('.showcase-image');
            const showcaseImagePreview = showcaseItems[index].querySelector('.showcase-image-preview');
            if (showcaseImageInput) {
                showcaseImageInput.value = file;
                showcaseImageInput.dispatchEvent(new Event('input'));
            }
            if (showcaseImagePreview) {
                showcaseImagePreview.src = file;
                showcaseImagePreview.style.display = 'block';
            }
        }
    } else if (currentFileSelector.customSelector && currentFileSelector.customSelector.startsWith('news-')) {
        const index = currentFileSelector.customSelector.replace('news-', '');
        const newsItems = document.querySelectorAll('#newsList .editable-item');
        if (newsItems[index]) {
            const newsImageInput = newsItems[index].querySelector('.news-image');
            const newsImagePreview = newsItems[index].querySelector('.news-image-preview');
            if (newsImageInput) {
                newsImageInput.value = file;
                newsImageInput.dispatchEvent(new Event('input'));
            }
            if (newsImagePreview) {
                newsImagePreview.src = file;
                newsImagePreview.style.display = 'block';
            }
        }
    } else if (currentFileSelector.customSelector && currentFileSelector.customSelector.startsWith('project-main-')) {
        const index = currentFileSelector.customSelector.replace('project-main-', '');
        const projectItems = document.querySelectorAll('#projectsList .editable-item');
        if (projectItems[index]) {
            const mainImageInput = projectItems[index].querySelector('.project-main-image');
            const mainImagePreview = projectItems[index].querySelector('.project-main-image-preview');
            if (mainImageInput) {
                mainImageInput.value = file;
                mainImageInput.dispatchEvent(new Event('input'));
            }
            if (mainImagePreview) {
                mainImagePreview.src = file;
                mainImagePreview.style.display = 'block';
            }
        }
    } else if (currentFileSelector.customSelector && currentFileSelector.customSelector.startsWith('project-additional-')) {
        const parts = currentFileSelector.customSelector.replace('project-additional-', '').split('-');
        const projectIndex = parseInt(parts[0]);
        const imgIndex = parseInt(parts[1]);
        const projectItems = document.querySelectorAll('#projectsList .editable-item');
        if (projectItems[projectIndex]) {
            const container = projectItems[projectIndex].querySelector('.project-additional-images');
            if (container) {
                const items = container.querySelectorAll('.additional-image-item');
                if (items[imgIndex]) {
                    const input = items[imgIndex].querySelector('.additional-image-input');
                    const preview = items[imgIndex].querySelector('.additional-image-preview');
                    if (input) {
                        input.value = file;
                        input.dispatchEvent(new Event('input'));
                    }
                    if (preview) {
                        preview.src = file;
                        preview.style.display = 'block';
                    }
                }
            }
        }
    } else {
        // Normal input/preview handling
        const input = document.getElementById(currentFileSelector.inputId);
        const preview = document.getElementById(currentFileSelector.previewId);
        
        if (input) {
            input.value = file;
            // Trigger input event to update preview
            input.dispatchEvent(new Event('input'));
        }
        
        if (preview) {
            if (preview.tagName === 'IMG') {
                preview.src = file;
                preview.style.display = 'block';
            } else if (preview.tagName === 'VIDEO') {
                preview.src = file;
                preview.style.display = 'block';
            }
        }
    }
    
    closeFileSelector();
    showMessage(`Selected: ${file}`, 'success');
}

// Filter file selector
function filterFileSelector(searchTerm) {
    const items = document.querySelectorAll('.file-selector-item');
    const term = searchTerm.toLowerCase();
    
    items.forEach(item => {
        const name = item.querySelector('.file-selector-name')?.textContent.toLowerCase() || '';
        const path = item.querySelector('.file-selector-path')?.textContent.toLowerCase() || '';
        
        if (name.includes(term) || path.includes(term)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Show message
function showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type} show`;
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 5000);
}

// Form submissions
document.addEventListener('DOMContentLoaded', () => {
    // Home Hero Form
    const homeHeroForm = document.getElementById('homeHeroForm');
    if (homeHeroForm) {
        homeHeroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.homePage) content.homePage = {};
            content.homePage.hero = {
                title: document.getElementById('heroTitle').value,
                subtitle: document.getElementById('heroSubtitle').value,
                image1: document.getElementById('heroImage1').value,
                image2: document.getElementById('heroImage2').value
            };
            if (saveContent(content)) {
                showMessage('Hero section saved successfully!');
                console.log('Saved content:', content);
                // Test: verify it was saved
                const test = localStorage.getItem('rokwil_admin_content');
                console.log('Verification - content in localStorage:', test ? 'YES' : 'NO');
            } else {
                showMessage('Error saving content', 'error');
            }
        });
    }

    // Home Video Form
    const homeVideoForm = document.getElementById('homeVideoForm');
    if (homeVideoForm) {
        homeVideoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.homePage) content.homePage = {};
            content.homePage.video = {
                title: document.getElementById('videoTitle').value,
                subtitle: document.getElementById('videoSubtitle').value,
                src: document.getElementById('videoSrc').value,
                poster: document.getElementById('videoPoster').value
            };
            if (saveContent(content)) {
                showMessage('Video section saved successfully!');
            }
        });
    }

    // Home Features Form
    const homeFeaturesForm = document.getElementById('homeFeaturesForm');
    if (homeFeaturesForm) {
        homeFeaturesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.homePage) content.homePage = {};
            if (!content.homePage.features) content.homePage.features = {};
            
            content.homePage.features.title = document.getElementById('featuresTitle').value;
            content.homePage.features.subtitle = document.getElementById('featuresSubtitle').value;
            
            const items = Array.from(document.querySelectorAll('#featuresList .editable-item')).map(item => {
                const iconInput = item.querySelector('.feature-icon');
                return {
                    icon: iconInput ? iconInput.value : '',
                    title: item.querySelector('.feature-title')?.value || '',
                    description: item.querySelector('.feature-description')?.value || ''
                };
            });
            
            content.homePage.features.items = items;
            if (saveContent(content)) {
                showMessage('Features saved successfully!');
            }
        });
    }

    // Home Showcase Form
    const homeShowcaseForm = document.getElementById('homeShowcaseForm');
    if (homeShowcaseForm) {
        homeShowcaseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.homePage) content.homePage = {};
            if (!content.homePage.showcase) content.homePage.showcase = {};
            
            content.homePage.showcase.title = document.getElementById('showcaseTitle').value;
            content.homePage.showcase.subtitle = document.getElementById('showcaseSubtitle').value;
            
            const items = Array.from(document.querySelectorAll('#showcaseList .editable-item')).map(item => ({
                image: item.querySelector('.showcase-image').value,
                title: item.querySelector('.showcase-title').value,
                description: item.querySelector('.showcase-description').value
            }));
            
            content.homePage.showcase.items = items;
            if (saveContent(content)) {
                showMessage('Showcase saved successfully!');
            }
        });
    }

    // Home Testimonials Form
    const homeTestimonialsForm = document.getElementById('homeTestimonialsForm');
    if (homeTestimonialsForm) {
        homeTestimonialsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.homePage) content.homePage = {};
            if (!content.homePage.testimonials) content.homePage.testimonials = {};
            
            content.homePage.testimonials.title = document.getElementById('testimonialsTitle').value;
            content.homePage.testimonials.subtitle = document.getElementById('testimonialsSubtitle').value;
            
            const items = Array.from(document.querySelectorAll('#testimonialsList .editable-item')).map(item => ({
                quote: item.querySelector('.testimonial-quote').value,
                author: item.querySelector('.testimonial-author').value,
                title: item.querySelector('.testimonial-title').value,
                avatar: item.querySelector('.testimonial-avatar').value
            }));
            
            content.homePage.testimonials.items = items;
            if (saveContent(content)) {
                showMessage('Testimonials saved successfully!');
            }
        });
    }

    // Home News Form
    const homeNewsForm = document.getElementById('homeNewsForm');
    if (homeNewsForm) {
        homeNewsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.homePage) content.homePage = {};
            if (!content.homePage.news) content.homePage.news = {};
            
            content.homePage.news.title = document.getElementById('newsTitle').value;
            content.homePage.news.subtitle = document.getElementById('newsSubtitle').value;
            
            const items = Array.from(document.querySelectorAll('#newsList .editable-item')).map(item => ({
                image: item.querySelector('.news-image').value,
                date: item.querySelector('.news-date').value,
                category: item.querySelector('.news-category').value,
                title: item.querySelector('.news-title').value,
                description: item.querySelector('.news-description').value,
                link: item.querySelector('.news-link').value
            }));
            
            content.homePage.news.items = items;
            if (saveContent(content)) {
                showMessage('News saved successfully!');
            }
        });
    }

    // Home Stats Form
    const homeStatsForm = document.getElementById('homeStatsForm');
    if (homeStatsForm) {
        homeStatsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.homePage) content.homePage = {};
            if (!content.homePage.stats) content.homePage.stats = {};
            
            const items = Array.from(document.querySelectorAll('#statsList .editable-item')).map(item => ({
                number: item.querySelector('.stat-number').value,
                label: item.querySelector('.stat-label').value
            }));
            
            content.homePage.stats.items = items;
            if (saveContent(content)) {
                showMessage('Stats saved successfully!');
            }
        });
    }

    // About Hero Form
    const aboutHeroForm = document.getElementById('aboutHeroForm');
    if (aboutHeroForm) {
        aboutHeroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.aboutPage) content.aboutPage = {};
            content.aboutPage.hero = {
                title: document.getElementById('aboutHeroTitle').value,
                subtitle: document.getElementById('aboutHeroSubtitle').value,
                image: document.getElementById('aboutHeroImage').value
            };
            if (saveContent(content)) {
                showMessage('About hero saved successfully!');
            }
        });
    }

    // About Stats Form
    const aboutStatsForm = document.getElementById('aboutStatsForm');
    if (aboutStatsForm) {
        aboutStatsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.aboutPage) content.aboutPage = {};
            if (!content.aboutPage.stats) content.aboutPage.stats = { items: [] };
            
            const items = [];
            document.querySelectorAll('#aboutStatsList .editable-item').forEach(item => {
                items.push({
                    number: item.querySelector('.about-stat-number')?.value || '',
                    label: item.querySelector('.about-stat-label')?.value || ''
                });
            });
            content.aboutPage.stats.items = items;
            if (saveContent(content)) {
                showMessage('About stats saved successfully!');
            }
        });
    }

    // About Content Form
    const aboutContentForm = document.getElementById('aboutContentForm');
    if (aboutContentForm) {
        aboutContentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.aboutPage) content.aboutPage = {};
            if (!content.aboutPage.content) content.aboutPage.content = {};
            const storyEl = document.getElementById('aboutStory');
            const storyValue = storyEl ? storyEl.value : '';
            content.aboutPage.content.storyBadge = document.getElementById('aboutStoryBadge')?.value || '';
            content.aboutPage.content.storyHeading = document.getElementById('aboutStoryHeading')?.value || '';
            content.aboutPage.content.story = storyValue.split('\n\n').filter(p => p.trim());
            content.aboutPage.content.image = document.getElementById('aboutImage')?.value || '';
            if (saveContent(content)) {
                showMessage('About content saved successfully!');
            }
        });
    }

    // About Mission Form
    const aboutMissionForm = document.getElementById('aboutMissionForm');
    if (aboutMissionForm) {
        aboutMissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.aboutPage) content.aboutPage = {};
            if (!content.aboutPage.mission) content.aboutPage.mission = {};
            content.aboutPage.mission.icon = document.getElementById('missionIcon')?.value || '';
            content.aboutPage.mission.title = document.getElementById('missionTitle')?.value || '';
            content.aboutPage.mission.text = document.getElementById('missionText')?.value || '';
            if (saveContent(content)) {
                showMessage('Mission saved successfully!');
            }
        });
    }

    // About Timeline Header Form
    const aboutTimelineHeaderForm = document.getElementById('aboutTimelineHeaderForm');
    if (aboutTimelineHeaderForm) {
        aboutTimelineHeaderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.aboutPage) content.aboutPage = {};
            if (!content.aboutPage.timeline) content.aboutPage.timeline = {};
            content.aboutPage.timeline.title = document.getElementById('timelineTitle')?.value || '';
            content.aboutPage.timeline.subtitle = document.getElementById('timelineSubtitle')?.value || '';
            if (saveContent(content)) {
                showMessage('Timeline header saved successfully!');
            }
        });
    }

    // About Values Form
    const aboutValuesForm = document.getElementById('aboutValuesForm');
    if (aboutValuesForm) {
        aboutValuesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.aboutPage) content.aboutPage = {};
            if (!content.aboutPage.values) content.aboutPage.values = { items: [] };
            
            content.aboutPage.values.title = document.getElementById('valuesTitle')?.value || '';
            const items = [];
            document.querySelectorAll('#valuesList .editable-item').forEach(item => {
                const iconInput = item.querySelector('.value-icon');
                items.push({
                    icon: iconInput ? iconInput.value : '',
                    title: item.querySelector('.value-title')?.value || '',
                    description: item.querySelector('.value-description')?.value || ''
                });
            });
            content.aboutPage.values.items = items;
            if (saveContent(content)) {
                showMessage('Values saved successfully!');
            }
        });
    }

    // About Leadership Form
    const aboutLeadershipForm = document.getElementById('aboutLeadershipForm');
    if (aboutLeadershipForm) {
        aboutLeadershipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.aboutPage) content.aboutPage = {};
            if (!content.aboutPage.leadership) content.aboutPage.leadership = {};
            content.aboutPage.leadership.title = document.getElementById('leadershipTitle')?.value || '';
            content.aboutPage.leadership.subtitle = document.getElementById('leadershipSubtitle')?.value || '';
            content.aboutPage.leadership.initials = document.getElementById('leaderInitials')?.value || '';
            content.aboutPage.leadership.name = document.getElementById('leaderName')?.value || '';
            content.aboutPage.leadership.leaderTitle = document.getElementById('leaderTitle')?.value || '';
            const tagsValue = document.getElementById('leaderTags')?.value || '';
            content.aboutPage.leadership.tags = tagsValue.split(',').map(t => t.trim()).filter(t => t);
            content.aboutPage.leadership.description = document.getElementById('leaderDescription')?.value || '';
            if (saveContent(content)) {
                showMessage('Leadership saved successfully!');
            }
        });
    }

    // About CSR Form
    const aboutCSRForm = document.getElementById('aboutCSRForm');
    if (aboutCSRForm) {
        aboutCSRForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.aboutPage) content.aboutPage = {};
            if (!content.aboutPage.csr) content.aboutPage.csr = { items: [] };
            
            content.aboutPage.csr.title = document.getElementById('csrTitle')?.value || '';
            content.aboutPage.csr.subtitle = document.getElementById('csrSubtitle')?.value || '';
            const items = [];
            document.querySelectorAll('#csrList .editable-item').forEach(item => {
                const iconInput = item.querySelector('.csr-icon');
                items.push({
                    icon: iconInput ? iconInput.value : '',
                    title: item.querySelector('.csr-title')?.value || '',
                    description: item.querySelector('.csr-description')?.value || ''
                });
            });
            content.aboutPage.csr.items = items;
            if (saveContent(content)) {
                showMessage('CSR saved successfully!');
            }
        });
    }

    // About Recognition Form
    const aboutRecognitionForm = document.getElementById('aboutRecognitionForm');
    if (aboutRecognitionForm) {
        aboutRecognitionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.aboutPage) content.aboutPage = {};
            if (!content.aboutPage.recognition) content.aboutPage.recognition = { items: [] };
            
            content.aboutPage.recognition.title = document.getElementById('recognitionTitle')?.value || '';
            content.aboutPage.recognition.subtitle = document.getElementById('recognitionSubtitle')?.value || '';
            const items = [];
            document.querySelectorAll('#recognitionList .editable-item').forEach(item => {
                const iconInput = item.querySelector('.recognition-icon');
                items.push({
                    icon: iconInput ? iconInput.value : '',
                    title: item.querySelector('.recognition-title')?.value || '',
                    description: item.querySelector('.recognition-description')?.value || ''
                });
            });
            content.aboutPage.recognition.items = items;
            if (saveContent(content)) {
                showMessage('Recognition saved successfully!');
            }
        });
    }

    // Projects Hero Form
    const projectsHeroForm = document.getElementById('projectsHeroForm');
    if (projectsHeroForm) {
        projectsHeroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.projectsPage) content.projectsPage = {};
            content.projectsPage.hero = {
                title: document.getElementById('projectsHeroTitle').value,
                subtitle: document.getElementById('projectsHeroSubtitle').value,
                image: document.getElementById('projectsHeroImage').value
            };
            if (saveContent(content)) {
                showMessage('Projects hero saved successfully!');
            }
        });
    }

    // Contact Hero Form
    const contactHeroForm = document.getElementById('contactHeroForm');
    if (contactHeroForm) {
        contactHeroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.contactPage) content.contactPage = {};
            content.contactPage.hero = {
                title: document.getElementById('contactHeroTitle').value,
                subtitle: document.getElementById('contactHeroSubtitle').value,
                image: document.getElementById('contactHeroImage').value
            };
            if (saveContent(content)) {
                showMessage('Contact hero saved successfully!');
            }
        });
    }

    // Contact Info Form
    const contactInfoForm = document.getElementById('contactInfoForm');
    if (contactInfoForm) {
        contactInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.contactPage) content.contactPage = {};
            if (!content.contactPage.info) content.contactPage.info = {};
            content.contactPage.info.email = document.getElementById('contactEmail').value;
            content.contactPage.info.phone = document.getElementById('contactPhone').value;
            content.contactPage.info.address = document.getElementById('contactAddress').value;
            content.contactPage.info.officeHours = document.getElementById('contactOfficeHours').value;
            if (saveContent(content)) {
                showMessage('Contact info saved successfully!');
            }
        });
    }

    // Global Contact Form
    const globalContactForm = document.getElementById('globalContactForm');
    if (globalContactForm) {
        globalContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.global) content.global = {};
            content.global.email = document.getElementById('globalEmail').value;
            content.global.phone = document.getElementById('globalPhone').value;
            if (saveContent(content)) {
                showMessage('Global contact info saved successfully!');
            }
        });
    }

    // Icons Form
    const iconsForm = document.getElementById('iconsForm');
    if (iconsForm) {
        iconsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = getContent();
            if (!content.icons) content.icons = {};
            content.icons.emailIcon = document.getElementById('emailIcon').value || 'bi-envelope-fill';
            content.icons.phoneIcon = document.getElementById('phoneIcon').value || 'bi-telephone-fill';
            content.icons.locationIcon = document.getElementById('locationIcon').value || 'bi-geo-alt-fill';
            if (saveContent(content)) {
                showMessage('Icons saved successfully!');
                updateIconPreviews();
            }
        });
    }
});

