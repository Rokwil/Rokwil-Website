// Firebase Content Loader for User-Facing Pages
// This script loads content from Firebase and populates the page

(function() {
    'use strict';
    
    // Wait for Firebase to initialize
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase not initialized. Make sure firebase-config.js is loaded first.');
        return;
    }
    
    const db = firebase.firestore();
    
    // Helper function to get the base path for GitHub Pages
    function getBasePath() {
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
    }
    
    // Helper function to fix truncated image paths (e.g., "image (2" -> "image (2).jpg")
    function fixTruncatedImagePath(path) {
        if (!path) return path;
        
        // Check if path already has an extension
        const hasExtension = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(path);
        if (hasExtension) return path;
        
        // Fix paths that end with " (number" or "  (number" (missing closing parenthesis and extension)
        // e.g., "image (2" or "image  (2" -> "image (2).jpg"
        // Use non-greedy match and trim to avoid capturing extra spaces
        const matchOpenParen = path.match(/^(.+?)\s*\((\d+)$/);
        if (matchOpenParen) {
            const basePath = matchOpenParen[1].trim();
            const number = matchOpenParen[2];
            return `${basePath} (${number}).jpg`;
        }
        
        // Fix paths that end with " (number " (has space after number, missing closing parenthesis)
        // e.g., "image (2 " -> "image (2).jpg"
        const matchSpaceAfterNumber = path.match(/^(.+?)\s*\((\d+)\s+$/);
        if (matchSpaceAfterNumber) {
            const basePath = matchSpaceAfterNumber[1].trim();
            const number = matchSpaceAfterNumber[2];
            return `${basePath} (${number}).jpg`;
        }
        
        // Fix paths that end with " (number." (has closing paren but no extension)
        // e.g., "image (2." -> "image (2).jpg"
        const matchParenDot = path.match(/^(.+?)\s*\((\d+)\.$/);
        if (matchParenDot) {
            const basePath = matchParenDot[1].trim();
            const number = matchParenDot[2];
            return `${basePath} (${number}).jpg`;
        }
        
        // Fix paths that end with " (number.jpg" (missing closing parenthesis)
        // e.g., "image (2.jpg" -> "image (2).jpg"
        const matchParenExt = path.match(/^(.+?)\s*\((\d+)\.(jpg|jpeg|png|gif|webp)$/i);
        if (matchParenExt) {
            const basePath = matchParenExt[1].trim();
            const number = matchParenExt[2];
            const ext = matchParenExt[3];
            return `${basePath} (${number}).${ext}`;
        }
        
        // Fix paths that end with " (number .jpg" (has space before extension, missing closing parenthesis)
        // e.g., "image (2 .jpg" -> "image (2).jpg"
        const matchParenSpaceExt = path.match(/^(.+?)\s*\((\d+)\s+\.(jpg|jpeg|png|gif|webp)$/i);
        if (matchParenSpaceExt) {
            const basePath = matchParenSpaceExt[1].trim();
            const number = matchParenSpaceExt[2];
            const ext = matchParenSpaceExt[3];
            return `${basePath} (${number}).${ext}`;
        }
        
        // If path ends with a number or special char, likely truncated - add .jpg
        if (/[0-9\)]$/.test(path)) {
            return path + '.jpg';
        }
        
        // Default: add .jpg extension if no extension present
        return path + '.jpg';
    }
    
    // Helper function to normalize image paths (convert relative to absolute if needed)
    function normalizeImagePath(path) {
        if (!path) return path;
        
        // Remove any leading/trailing whitespace
        path = path.trim();
        
        // First, try to fix truncated paths
        path = fixTruncatedImagePath(path);
        
        // If path is already a full URL, return as-is
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        
        // Get base path for GitHub Pages
        const basePath = getBasePath();
        
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
    }
    
    // Helper function to normalize video paths (similar to image paths)
    function normalizeVideoPath(path) {
        if (!path) return path;
        
        // Remove any leading/trailing whitespace
        path = path.trim();
        
        // If path is already a full URL, return as-is
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        
        // Get base path for GitHub Pages
        const basePath = getBasePath();
        
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
    }
    
    // Load page content from Firebase
    async function loadPageContent(pageId) {
        try {
            const doc = await db.collection('pages').doc(pageId).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error('Error loading page content:', error);
            return null;
        }
    }
    
    // Load and render index page content
    async function loadIndexPage() {
        console.log('Loading index page content from Firebase...');
        const data = await loadPageContent('index');
        if (!data) {
            console.log('No data found in Firebase for index page - using default HTML content');
            return; // Use default content if no Firebase data
        }
        console.log('Index page data loaded:', data);
        
        // Hero section
        if (data.hero) {
            const heroTitle = document.querySelector('.hero-title');
            const heroSubtitle = document.querySelector('.hero-subtitle');
            const heroButtons = document.querySelector('.hero-buttons');
            
            if (heroTitle && data.hero.title) heroTitle.textContent = data.hero.title;
            if (heroSubtitle && data.hero.subtitle) heroSubtitle.textContent = data.hero.subtitle;
            
            if (heroButtons && data.hero.button1) {
                const btn1 = heroButtons.querySelector('.btn-primary');
                if (btn1) {
                    btn1.querySelector('span').textContent = data.hero.button1.text;
                    btn1.href = data.hero.button1.link;
                }
            }
            
            if (heroButtons && data.hero.button2) {
                const btn2 = heroButtons.querySelector('.btn-secondary');
                if (btn2) {
                    btn2.querySelector('span').textContent = data.hero.button2.text;
                    btn2.href = data.hero.button2.link;
                }
            }
            
            // Update hero background images
            if (data.hero.images && data.hero.images.length > 0) {
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    const img1 = normalizeImagePath(data.hero.images[0]);
                    const img2 = data.hero.images[1] ? normalizeImagePath(data.hero.images[1]) : null;
                    heroSection.style.backgroundImage = `url('${img1}')${img2 ? `, url('${img2}')` : ''}`;
                }
            }
        }
        
        // Video section
        if (data.video) {
            const videoTitle = document.querySelector('.section-title');
            const videoSubtitle = document.querySelector('.section-subtitle');
            const videoElement = document.querySelector('video');
            
            if (data.video.title && videoTitle) {
                const sectionHeader = videoTitle.closest('.section-header');
                if (sectionHeader) {
                    sectionHeader.querySelector('.section-title').textContent = data.video.title;
                    if (data.video.subtitle) {
                        sectionHeader.querySelector('.section-subtitle').textContent = data.video.subtitle;
                    }
                }
            }
            
            if (videoElement && data.video.url) {
                videoElement.innerHTML = `<source src="${data.video.url}" type="video/mp4">`;
                if (data.video.poster) {
                    videoElement.poster = data.video.poster;
                }
            }
        }
        
        // Features section
        console.log('Loading features section:', data.features);
        const featuresSection = document.querySelector('.features');
        if (data.features) {
            // Check section visibility first (handle backward compatibility with visible property)
            const isHidden = data.features.hidden !== undefined 
                ? data.features.hidden 
                : (data.features.visible === false);
            if (isHidden) {
                if (featuresSection) {
                    featuresSection.style.display = 'none';
                    console.log('Features section hidden');
                }
            } else {
                // Section is visible, show it and load items
                if (featuresSection) featuresSection.style.display = '';
                
                if (data.features.items && data.features.items.length > 0) {
                    const featuresGrid = document.querySelector('.features-grid');
                    console.log('Features grid found:', featuresGrid);
                    if (featuresGrid) {
                        featuresGrid.innerHTML = '';
                        const visibleItems = data.features.items.filter(item => {
                            // Handle backward compatibility with visible property
                            if (item.hidden !== undefined) return !item.hidden;
                            return item.visible !== false;
                        });
                        console.log(`Filtered ${visibleItems.length} visible items from ${data.features.items.length} total`);
                        visibleItems.forEach(item => {
                            const featureCard = document.createElement('div');
                            featureCard.className = 'feature-card reveal active';
                            featureCard.innerHTML = `
                                <div class="feature-icon"><i class="bi ${item.icon || 'bi-building'}"></i></div>
                                <h3>${item.title || ''}</h3>
                                <p>${item.description || ''}</p>
                            `;
                            featuresGrid.appendChild(featureCard);
                        });
                        console.log(`Added ${visibleItems.length} feature items`);
                        
                        // Re-observe newly created elements for animations
                        if (window.revealObserver) {
                            featuresGrid.querySelectorAll('.reveal').forEach(el => {
                                window.revealObserver.observe(el);
                            });
                        }
                    } else {
                        console.warn('Features grid not found in DOM');
                    }
                    
                    // Update section header
                    const sectionHeader = document.querySelector('.features .section-header');
                    if (sectionHeader && data.features.title) {
                        const titleEl = sectionHeader.querySelector('.section-title');
                        const subtitleEl = sectionHeader.querySelector('.section-subtitle');
                        if (titleEl) titleEl.textContent = data.features.title;
                        if (subtitleEl && data.features.subtitle) subtitleEl.textContent = data.features.subtitle;
                    }
                } else {
                    console.warn('No feature items found');
                }
            }
        } else {
            console.warn('No features data found');
        }
        
        // Showcase section
        const showcaseSectionEl = document.querySelector('.showcase');
        if (data.showcase) {
            // Check section visibility first (handle backward compatibility with visible property)
            const isHidden = data.showcase.hidden !== undefined 
                ? data.showcase.hidden 
                : (data.showcase.visible === false);
            if (isHidden) {
                if (showcaseSectionEl) {
                    showcaseSectionEl.style.display = 'none';
                    console.log('Showcase section hidden');
                }
            } else {
                // Section is visible, show it and load items
                if (showcaseSectionEl) showcaseSectionEl.style.display = '';
                
                if (data.showcase.items && data.showcase.items.length > 0) {
                    const showcaseGrid = document.querySelector('.showcase-grid');
                    if (showcaseGrid) {
                        showcaseGrid.innerHTML = '';
                        const visibleItems = data.showcase.items.filter(item => {
                            // Handle backward compatibility with visible property
                            if (item.hidden !== undefined) return !item.hidden;
                            return item.visible !== false;
                        });
                        visibleItems.forEach(item => {
                            const showcaseItem = document.createElement('div');
                            showcaseItem.className = 'showcase-item';
                            // Handle both old format (single image) and new format (images array)
                            const images = item.images || (item.image ? [item.image] : []);
                            const imageStyle = images.length > 0 
                                ? images.map(img => `url('${normalizeImagePath(img)}')`).join(', ')
                                : '';
                            showcaseItem.innerHTML = `
                                <div class="showcase-image" style="background-image: ${imageStyle}; background-size: cover; background-position: center;">
                                    <div class="showcase-overlay">
                                        <h3>${item.title || ''}</h3>
                                        <p>${item.description || ''}</p>
                                        <a href="${item.link || 'projects.html'}" class="btn btn-outline">Learn More</a>
                                    </div>
                                </div>
                            `;
                            showcaseGrid.appendChild(showcaseItem);
                        });
                    }
                    
                    // Update section header
                    const sectionHeader = document.querySelector('.showcase .section-header');
                    if (sectionHeader && data.showcase.title) {
                        sectionHeader.querySelector('.section-title').textContent = data.showcase.title;
                        if (data.showcase.subtitle) {
                            sectionHeader.querySelector('.section-subtitle').textContent = data.showcase.subtitle;
                        }
                    }
                } else {
                    console.warn('No showcase items found');
                }
            }
        }
        
        // Testimonials section
        console.log('Loading testimonials section:', data.testimonials);
        const testimonialsSection = document.querySelector('.testimonials');
        if (data.testimonials) {
            // Check section visibility first (handle backward compatibility with visible property)
            const isHidden = data.testimonials.hidden !== undefined 
                ? data.testimonials.hidden 
                : (data.testimonials.visible === false);
            if (isHidden) {
                if (testimonialsSection) {
                    testimonialsSection.style.display = 'none';
                    console.log('Testimonials section hidden');
                }
            } else {
                // Section is visible, show it and load items
                if (testimonialsSection) testimonialsSection.style.display = '';
                
                if (data.testimonials.items && data.testimonials.items.length > 0) {
                    const testimonialsGrid = document.querySelector('.testimonials-grid');
                    console.log('Testimonials grid found:', testimonialsGrid);
                    if (testimonialsGrid) {
                        testimonialsGrid.innerHTML = '';
                        const visibleItems = data.testimonials.items.filter(item => {
                            // Handle backward compatibility with visible property
                            if (item.hidden !== undefined) return !item.hidden;
                            return item.visible !== false;
                        });
                        console.log(`Filtered ${visibleItems.length} visible items from ${data.testimonials.items.length} total`);
                        visibleItems.forEach(item => {
                            const testimonialCard = document.createElement('div');
                            testimonialCard.className = 'testimonial-card reveal active';
                            const stars = '★'.repeat(item.rating || 5);
                            testimonialCard.innerHTML = `
                                <div class="testimonial-rating">${stars}</div>
                                <p class="testimonial-quote">"${item.quote || ''}"</p>
                                <div class="testimonial-author">
                                    <div class="testimonial-avatar">${item.avatar || ''}</div>
                                    <div class="testimonial-info">
                                        <h4>${item.authorName || ''}</h4>
                                        <p>${item.authorTitle || ''}</p>
                                    </div>
                                </div>
                            `;
                            testimonialsGrid.appendChild(testimonialCard);
                        });
                        console.log(`Added ${visibleItems.length} testimonial items`);
                        
                        // Re-observe newly created elements for animations
                        if (window.revealObserver) {
                            testimonialsGrid.querySelectorAll('.reveal').forEach(el => {
                                window.revealObserver.observe(el);
                            });
                        }
                    } else {
                        console.warn('Testimonials grid not found in DOM');
                    }
                    
                    // Update section header
                    const sectionHeader = document.querySelector('.testimonials .section-header');
                    if (sectionHeader && data.testimonials.title) {
                        const titleEl = sectionHeader.querySelector('.section-title');
                        const subtitleEl = sectionHeader.querySelector('.section-subtitle');
                        if (titleEl) titleEl.textContent = data.testimonials.title;
                        if (subtitleEl && data.testimonials.subtitle) subtitleEl.textContent = data.testimonials.subtitle;
                    }
                } else {
                    console.warn('No testimonial items found');
                }
            }
        } else {
            console.warn('No testimonials data found');
        }
        
        // News section
        console.log('Loading news section:', data.news);
        const newsSection = document.querySelector('.news-section');
        if (data.news) {
            // Check section visibility first (handle backward compatibility with visible property)
            const isHidden = data.news.hidden !== undefined 
                ? data.news.hidden 
                : (data.news.visible === false);
            if (isHidden) {
                if (newsSection) {
                    newsSection.style.display = 'none';
                    console.log('News section hidden');
                }
            } else {
                // Section is visible, show it and load items
                if (newsSection) newsSection.style.display = '';
                
                if (data.news.items && data.news.items.length > 0) {
                    const newsGrid = document.querySelector('.news-grid');
                    console.log('News grid found:', newsGrid);
                    if (newsGrid) {
                        newsGrid.innerHTML = '';
                        const visibleItems = data.news.items.filter(item => {
                            // Handle backward compatibility with visible property
                            if (item.hidden !== undefined) return !item.hidden;
                            return item.visible !== false;
                        });
                        console.log(`Filtered ${visibleItems.length} visible items from ${data.news.items.length} total`);
                        visibleItems.forEach(item => {
                            const newsCard = document.createElement('div');
                            newsCard.className = 'news-card reveal active';
                            // Handle both old format (single image) and new format (images array)
                            const images = item.images || (item.image ? [item.image] : []);
                            const imageStyle = images.length > 0 
                                ? images.map(img => `url('${normalizeImagePath(img)}')`).join(', ')
                                : '';
                            newsCard.innerHTML = `
                                <div class="news-image" style="background-image: ${imageStyle};">
                                    <div class="news-date">${item.date || ''}</div>
                                </div>
                                <div class="news-content">
                                    <span class="news-category">${item.category || ''}</span>
                                    <h3>${item.title || ''}</h3>
                                    <p>${item.description || ''}</p>
                                    <a href="${item.link || '#'}" class="news-link">Read More <i class="bi bi-arrow-right"></i></a>
                                </div>
                            `;
                            newsGrid.appendChild(newsCard);
                        });
                        console.log(`Added ${visibleItems.length} news items`);
                        
                        // Re-observe newly created elements for animations
                        if (window.revealObserver) {
                            newsGrid.querySelectorAll('.reveal').forEach(el => {
                                window.revealObserver.observe(el);
                            });
                        }
                    } else {
                        console.warn('News grid not found in DOM');
                    }
                    
                    // Update section header
                    const sectionHeader = document.querySelector('.news-section .section-header');
                    if (sectionHeader && data.news.title) {
                        const titleEl = sectionHeader.querySelector('.section-title');
                        const subtitleEl = sectionHeader.querySelector('.section-subtitle');
                        if (titleEl) titleEl.textContent = data.news.title;
                        if (subtitleEl && data.news.subtitle) subtitleEl.textContent = data.news.subtitle;
                    }
                } else {
                    console.warn('No news items found');
                }
            }
        } else {
            console.warn('No news data found');
        }
        
        // Stats section
        if (data.stats && data.stats.items) {
            const statsGrid = document.querySelector('.stats-grid');
            if (statsGrid) {
                statsGrid.innerHTML = '';
                data.stats.items.forEach(item => {
                    const statItem = document.createElement('div');
                    statItem.className = 'stat-item';
                    statItem.innerHTML = `
                        <div class="stat-number" data-target="${item.number || ''}">${item.number || ''}</div>
                        <div class="stat-label">${item.label || ''}</div>
                    `;
                    statsGrid.appendChild(statItem);
                });
            }
        }
    }
    
    // Load and render about page content
    async function loadAboutPage() {
        console.log('Loading about page content from Firebase...');
        const data = await loadPageContent('about');
        if (!data) {
            console.log('No data found in Firebase for about page');
            return;
        }
        console.log('About page data loaded:', data);
        
        // Page Hero
        if (data.pageHero) {
            const pageHero = document.querySelector('.page-hero');
            if (pageHero) {
                const h1 = pageHero.querySelector('h1');
                const p = pageHero.querySelector('p');
                if (h1 && data.pageHero.title) h1.textContent = data.pageHero.title;
                if (p && data.pageHero.subtitle) p.textContent = data.pageHero.subtitle;
                if (data.pageHero.image) {
                    const normalizedImg = normalizeImagePath(data.pageHero.image);
                    pageHero.style.backgroundImage = `url('${normalizedImg}')`;
                }
            }
        }
        
        // Stats Banner
        if (data.statsBanner && data.statsBanner.items) {
            const statsBanner = document.querySelector('.stats-banner');
            if (statsBanner) {
                statsBanner.innerHTML = '';
                data.statsBanner.items.forEach(item => {
                    const statItem = document.createElement('div');
                    statItem.className = 'stat-item';
                    statItem.style.textAlign = 'center';
                    statItem.innerHTML = `
                        <div class="stat-number" style="color: var(--secondary-color);">${item.value || ''}</div>
                        <div class="stat-label" style="color: var(--text-secondary);">${item.label || ''}</div>
                    `;
                    statsBanner.appendChild(statItem);
                });
            }
        }
        
        // About Story
        if (data.aboutStory) {
            console.log('Processing About Story:', data.aboutStory);
            const aboutText = document.querySelector('.about-text');
            if (!aboutText) {
                console.error('About text element not found!');
                return;
            }
            console.log('About text element found');
            const h2 = aboutText.querySelector('h2');
            if (h2 && data.aboutStory.title) {
                console.log('Updating story title:', data.aboutStory.title);
                h2.textContent = data.aboutStory.title;
            }
                
                // Handle content - prioritize content field (what admin saves), fallback to paragraphs array
                let paragraphs = [];
                if (data.aboutStory.content && data.aboutStory.content.trim()) {
                    // Use content field directly (this is what gets saved from the admin form)
                    const content = data.aboutStory.content.trim();
                    // Split content by double newlines or single newlines to create paragraphs
                    if (content.includes('\n\n')) {
                        paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
                    } else if (content.includes('\n')) {
                        paragraphs = content.split('\n').filter(p => p.trim());
                    } else {
                        paragraphs = [content];
                    }
                    console.log('Using content field from Firebase, split into', paragraphs.length, 'paragraphs');
                } else if (data.aboutStory.paragraphs && Array.isArray(data.aboutStory.paragraphs)) {
                    // Fallback: use paragraphs array
                    paragraphs = data.aboutStory.paragraphs.map(p => {
                        if (typeof p === 'string') return p;
                        // Handle objects with text and strong properties
                        let paraText = p.text || '';
                        if (p.strong && paraText.includes(p.strong)) {
                            // Strong text is already in the text, just return it
                            return paraText;
                        }
                        return paraText;
                    });
                    console.log('Using paragraphs array (fallback),', paragraphs.length, 'paragraphs');
                }
                
                // Get only the paragraph elements that are direct children of about-text (not inside mission box)
                // Find the mission box first to exclude its paragraphs
                const missionBox = aboutText.querySelector('div[style*="margin-top: 2rem"][style*="padding: 2rem"]');
                const allPs = aboutText.querySelectorAll('p');
                const existingPs = Array.from(allPs).filter(p => {
                    // Exclude paragraphs inside the mission box
                    if (missionBox && missionBox.contains(p)) {
                        return false;
                    }
                    return true;
                });
                
                console.log('About Story update:', {
                    paragraphsCount: paragraphs.length,
                    existingPsCount: existingPs.length,
                    hasContent: !!data.aboutStory.content,
                    hasParagraphs: !!data.aboutStory.paragraphs,
                    contentPreview: data.aboutStory.content ? data.aboutStory.content.substring(0, 100) : 'none',
                    paragraphs: paragraphs.map(p => p.substring(0, 50))
                });
                
                if (paragraphs.length > 0) {
                    console.log('Updating paragraphs...', paragraphs);
                    
                    // Clear all existing story paragraphs first (except mission box)
                    existingPs.forEach((p, idx) => {
                        console.log(`Clearing paragraph ${idx}`);
                        p.innerHTML = '';
                    });
                    
                    // Update existing paragraphs or create new ones
                    paragraphs.forEach((paraText, idx) => {
                        console.log(`Processing paragraph ${idx + 1}/${paragraphs.length}:`, paraText.substring(0, 50) + '...');
                        if (idx < existingPs.length) {
                            // Update existing paragraph
                            console.log(`Updating existing paragraph ${idx}`);
                            const beforeText = existingPs[idx].textContent;
                            existingPs[idx].innerHTML = paraText;
                            const afterText = existingPs[idx].textContent;
                            console.log(`Paragraph ${idx} updated. Before: "${beforeText.substring(0, 30)}...", After: "${afterText.substring(0, 30)}..."`);
                            // Preserve existing style
                            if (!existingPs[idx].getAttribute('style')) {
                                existingPs[idx].setAttribute('style', 'font-size: 1.15rem; line-height: 1.9; margin-bottom: 1.5rem;');
                            }
                        } else {
                            // Create new paragraph
                            console.log(`Creating new paragraph ${idx}`);
                            const newP = document.createElement('p');
                            newP.setAttribute('style', 'font-size: 1.15rem; line-height: 1.9; margin-bottom: 1.5rem;');
                            newP.innerHTML = paraText;
                            // Insert before the mission box or at the end of about-text
                            if (missionBox) {
                                aboutText.insertBefore(newP, missionBox);
                            } else {
                                aboutText.appendChild(newP);
                            }
                            console.log(`New paragraph ${idx} created and inserted`);
                        }
                    });
                    
                    // Remove extra paragraphs if we have fewer in Firebase (but keep at least one)
                    if (existingPs.length > paragraphs.length) {
                        console.log(`Removing ${existingPs.length - paragraphs.length} extra paragraphs`);
                        for (let i = paragraphs.length; i < existingPs.length; i++) {
                            // Only remove if not inside mission box
                            if (!missionBox || !missionBox.contains(existingPs[i])) {
                                console.log(`Removing paragraph ${i}`);
                                existingPs[i].remove();
                            }
                        }
                    }
                    
                    // Verify the update worked
                    const updatedPs = Array.from(aboutText.querySelectorAll('p')).filter(p => {
                        if (missionBox && missionBox.contains(p)) return false;
                        return true;
                    });
                    console.log('About Story update complete. Final paragraphs:', updatedPs.length);
                    updatedPs.forEach((p, idx) => {
                        console.log(`Final paragraph ${idx}:`, p.textContent.substring(0, 50) + '...');
                    });
                } else {
                    console.warn('No paragraphs to update for About Story. Content:', data.aboutStory.content);
                    console.warn('About Story data:', data.aboutStory);
                }
                
                // Update image
                if (data.aboutStory.image) {
                    const aboutImage = document.querySelector('.about-image img');
                    if (aboutImage) {
                        aboutImage.src = normalizeImagePath(data.aboutStory.image);
                    }
                }
        }
        
        // Mission - find by h3 text content
        if (data.mission && data.mission.text) {
            const missionH3 = Array.from(document.querySelectorAll('h3')).find(h3 => 
                h3.textContent?.trim().includes('Our Mission') ||
                h3.textContent?.trim() === 'Our Mission'
            );
            const missionBox = missionH3?.closest('div[style*="margin-top: 2rem"]');
            if (missionBox) {
                const p = missionBox.querySelector('p[style*="font-style: italic"]') || 
                         missionBox.querySelector('p');
                if (p) p.textContent = data.mission.text;
            }
        }
        
        // Timeline - find by section title
        if (data.timeline) {
            // Check if entire section is hidden
            if (data.timeline.hidden) {
                const timelineTitleEl = Array.from(document.querySelectorAll('.section-title')).find(title => 
                    title.textContent?.trim().includes('Journey') || 
                    title.textContent?.trim().includes('Timeline') ||
                    title.textContent?.trim().includes('History')
                );
                const timelineSection = timelineTitleEl?.closest('div[style*="margin-top: 100px"]') ||
                                       timelineTitleEl?.closest('div[style*="margin-bottom: 80px"]');
                if (timelineSection) {
                    timelineSection.style.display = 'none';
                }
            } else {
                const timelineTitleEl = Array.from(document.querySelectorAll('.section-title')).find(title => 
                    title.textContent?.trim().includes('Journey') || 
                    title.textContent?.trim().includes('Timeline') ||
                    title.textContent?.trim().includes('History')
                );
                const timelineSection = timelineTitleEl?.closest('div[style*="margin-top: 100px"]') ||
                                       timelineTitleEl?.closest('div[style*="margin-bottom: 80px"]');
                
                if (timelineSection) {
                    // Ensure section is visible
                    timelineSection.style.display = '';
                    
                    // Update section header
                    const sectionHeader = timelineSection.querySelector('.section-header');
                    if (sectionHeader) {
                        const title = sectionHeader.querySelector('.section-title');
                        const subtitle = sectionHeader.querySelector('.section-subtitle');
                        if (title && data.timeline.title) title.textContent = data.timeline.title;
                        if (subtitle && data.timeline.subtitle) subtitle.textContent = data.timeline.subtitle;
                    }
                    
                    // Update timeline items - create new ones if needed
                    if (data.timeline.items && data.timeline.items.length > 0) {
                        // Find the timeline container (the parent of timeline items)
                        const existingTimelineItems = timelineSection.querySelectorAll('.timeline-item');
                        const timelineContainer = existingTimelineItems.length > 0 
                            ? existingTimelineItems[0].parentElement 
                            : timelineSection.querySelector('.container') || timelineSection;
                        
                        // Filter out empty items and hidden items
                        const validItems = data.timeline.items.filter(item => 
                            (item.title || item.description) && !item.hidden
                        );
                        
                        // Clear and recreate all timeline items
                        existingTimelineItems.forEach(item => item.remove());
                        
                        validItems.forEach((timelineData, idx) => {
                            const timelineItem = document.createElement('div');
                            timelineItem.className = 'timeline-item reveal active';
                            timelineItem.setAttribute('style', 'display: flex; gap: 2rem; margin-bottom: 3rem; position: relative;');
                            
                            // Create the numbered circle
                            const circle = document.createElement('div');
                            circle.setAttribute('style', 'width: 60px; height: 60px; background: var(--gradient-2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-light); font-size: 1.5rem; font-weight: 700; flex-shrink: 0; box-shadow: var(--shadow-md); z-index: 2; transition: all 0.3s ease;');
                            circle.textContent = (idx + 1).toString();
                            
                            // Create the timeline card
                            const timelineCard = document.createElement('div');
                            timelineCard.className = 'timeline-card';
                            timelineCard.setAttribute('style', 'flex: 1; padding: 2rem; border-radius: 8px; border-left: 3px solid var(--secondary-color);');
                            timelineCard.innerHTML = `
                                <h3 style="margin-bottom: 0.5rem; font-size: 1.4rem;">${timelineData.title || ''}</h3>
                                <p style="margin: 0; line-height: 1.8;">${timelineData.description || ''}</p>
                            `;
                            
                            timelineItem.appendChild(circle);
                            timelineItem.appendChild(timelineCard);
                            timelineContainer.appendChild(timelineItem);
                        });
                        console.log(`Created ${validItems.length} timeline items`);
                        
                        // Re-observe newly created elements for animations
                        if (window.revealObserver) {
                            timelineContainer.querySelectorAll('.reveal').forEach(el => {
                                window.revealObserver.observe(el);
                            });
                        }
                    }
                }
            }
        }
        
        // Values
        console.log('Loading values section:', data.values);
        if (data.values) {
            // Check if entire section is hidden
            if (data.values.hidden) {
                const valuesSection = document.querySelector('.values-section');
                if (valuesSection) {
                    valuesSection.style.display = 'none';
                }
            } else {
                const valuesSection = document.querySelector('.values-section');
                if (valuesSection) {
                    // Ensure section is visible
                    valuesSection.style.display = '';
                    
                    // Update section title
                    if (data.values.title) {
                        const title = valuesSection.querySelector('.section-title');
                        if (title) title.textContent = data.values.title;
                    }
                }
                
                if (data.values.items && data.values.items.length > 0) {
                    const valuesGrid = document.querySelector('.values-grid');
                    console.log('Values grid found:', valuesGrid);
                    if (valuesGrid) {
                        valuesGrid.innerHTML = '';
                        // Filter out hidden items
                        const visibleItems = data.values.items.filter(item => !item.hidden);
                        visibleItems.forEach(item => {
                            const valueCard = document.createElement('div');
                            valueCard.className = 'value-card reveal active';
                            valueCard.innerHTML = `
                                <div class="value-icon"><i class="bi ${item.icon || 'bi-star'}"></i></div>
                                <h3>${item.title || ''}</h3>
                                <p>${item.description || ''}</p>
                            `;
                            valuesGrid.appendChild(valueCard);
                        });
                        console.log(`Added ${visibleItems.length} value items`);
                        
                        // Re-observe newly created elements for animations
                        if (window.revealObserver) {
                            valuesGrid.querySelectorAll('.reveal').forEach(el => {
                                window.revealObserver.observe(el);
                            });
                        }
                    } else {
                        console.warn('Values grid not found in DOM');
                    }
                } else {
                    console.warn('No values data found or empty items array');
                }
            }
        }
        
        // Leadership
        if (data.leadership) {
            const leadershipCard = document.querySelector('.leadership-card');
            if (leadershipCard) {
                const h3 = leadershipCard.querySelector('h3');
                const titleRole = leadershipCard.querySelector('p[style*="color: var(--secondary-color)"]');
                const bio = leadershipCard.querySelector('p[style*="line-height: 1.9"]');
                const initials = leadershipCard.querySelector('div[style*="width: 150px"]');
                
                if (h3 && data.leadership.name) h3.textContent = data.leadership.name;
                if (titleRole && data.leadership.titleRole) titleRole.textContent = data.leadership.titleRole;
                if (bio && data.leadership.bio) bio.textContent = data.leadership.bio;
                if (initials && data.leadership.initials) initials.textContent = data.leadership.initials;
            }
            
            // Update section header
            const leadershipSection = document.querySelector('.values-section[style*="margin-top: 100px"]');
            if (leadershipSection) {
                const title = leadershipSection.querySelector('.section-title');
                const subtitle = leadershipSection.querySelector('.section-subtitle');
                if (title && data.leadership.title) title.textContent = data.leadership.title;
                if (subtitle && data.leadership.subtitle) subtitle.textContent = data.leadership.subtitle;
            }
        }
        
        // CSR - find by section title text content
        if (data.csr) {
            const csrTitleEl = Array.from(document.querySelectorAll('.section-title')).find(title => 
                title.textContent?.trim() === 'Corporate Social Responsibility' ||
                title.textContent?.trim().includes('Corporate Social Responsibility')
            );
            let csrSection = null;
            if (csrTitleEl) {
                // Walk up the DOM tree to find the container div
                let parent = csrTitleEl.parentElement;
                while (parent && parent !== document.body) {
                    const style = parent.getAttribute('style') || '';
                    if (style.includes('margin-top: 100px') && style.includes('padding: 80px')) {
                        csrSection = parent;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
            
            if (csrSection) {
                // Check if entire section is hidden
                if (data.csr.hidden) {
                    csrSection.style.display = 'none';
                } else {
                    // Ensure section is visible
                    csrSection.style.display = '';
                    
                    // Update section header
                    const title = csrTitleEl;
                    const subtitle = csrSection.querySelector('.section-subtitle');
                    if (title && data.csr.title) title.textContent = data.csr.title;
                    if (subtitle && data.csr.subtitle) subtitle.textContent = data.csr.subtitle;
                    
                    // Update or create CSR cards
                    if (data.csr.items && data.csr.items.length > 0) {
                        const csrContainer = csrSection.querySelector('div[style*="display: grid"]') ||
                                            csrSection.querySelector('.container > div:last-child');
                        if (csrContainer) {
                            // Filter out empty items and hidden items
                            const validItems = data.csr.items.filter(item => 
                                (item.title || item.description || item.icon) && !item.hidden
                            );
                            
                            // Always clear and recreate to handle additions/removals properly
                            csrContainer.innerHTML = '';
                            validItems.forEach(item => {
                                const card = document.createElement('div');
                                card.className = 'csr-card reveal active';
                                card.setAttribute('style', 'background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 2.5rem; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.2);');
                                card.innerHTML = `
                                    <div style="font-size: 3rem; margin-bottom: 1rem;"><i class="bi ${item.icon || 'bi-heart'}"></i></div>
                                    <h4 style="color: var(--text-light); margin-bottom: 1rem; font-size: 1.3rem;">${item.title || ''}</h4>
                                    <p style="color: rgba(255, 255, 255, 0.9); margin: 0; line-height: 1.7;">${item.description || ''}</p>
                                `;
                                csrContainer.appendChild(card);
                            });
                            console.log(`Created ${validItems.length} CSR items`);
                            
                            // Re-observe newly created elements for animations
                            if (window.revealObserver) {
                                csrContainer.querySelectorAll('.reveal').forEach(el => {
                                    window.revealObserver.observe(el);
                                });
                            }
                        }
                    }
                }
            }
        }
        
        // Recognition - find by section title text content
        if (data.recognition) {
            const recognitionTitleEl = Array.from(document.querySelectorAll('.section-title')).find(title => 
                title.textContent?.trim() === 'Recognition & Partnerships' ||
                title.textContent?.trim().includes('Recognition & Partnerships') ||
                (title.textContent?.trim().includes('Recognition') && !title.textContent?.trim().includes('Corporate'))
            );
            let recognitionSection = null;
            if (recognitionTitleEl) {
                // Walk up the DOM tree to find the container div
                let parent = recognitionTitleEl.parentElement;
                while (parent && parent !== document.body) {
                    const style = parent.getAttribute('style') || '';
                    if (style.includes('margin-top: 100px') && style.includes('padding: 80px')) {
                        recognitionSection = parent;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
            
            if (recognitionSection) {
                // Check if entire section is hidden
                if (data.recognition.hidden) {
                    recognitionSection.style.display = 'none';
                } else {
                    // Ensure section is visible
                    recognitionSection.style.display = '';
                    
                    // Update section header
                    const title = recognitionTitleEl;
                    const subtitle = recognitionSection.querySelector('.section-subtitle');
                    if (title && data.recognition.title) title.textContent = data.recognition.title;
                    if (subtitle && data.recognition.subtitle) subtitle.textContent = data.recognition.subtitle;
                    
                    // Update or create recognition cards
                    if (data.recognition.items && data.recognition.items.length > 0) {
                        const recognitionContainer = recognitionSection.querySelector('div[style*="display: grid"]') ||
                                                     recognitionSection.querySelector('.container > div:last-child');
                        if (recognitionContainer) {
                            // Filter out hidden items
                            const visibleItems = data.recognition.items.filter(item => !item.hidden);
                            
                            // Always clear and recreate to handle additions/removals/hiding properly
                            recognitionContainer.innerHTML = '';
                            visibleItems.forEach(item => {
                                const card = document.createElement('div');
                                card.className = 'recognition-card reveal';
                                card.setAttribute('style', 'padding: var(--spacing-lg); border-radius: 8px; text-align: center; border-top: 3px solid var(--secondary-color);');
                                card.innerHTML = `
                                    <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: var(--gradient-2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-light); font-size: 2rem; box-shadow: var(--shadow-md);"><i class="bi ${item.icon || 'bi-trophy'}"></i></div>
                                    <h4 style="margin-bottom: 1rem; font-size: 1.3rem;">${item.title || ''}</h4>
                                    <p style="margin: 0; line-height: 1.7;">${item.description || ''}</p>
                                `;
                                recognitionContainer.appendChild(card);
                            });
                            console.log(`Created ${visibleItems.length} recognition items`);
                            
                            // Re-observe newly created elements for animations
                            if (window.revealObserver) {
                                recognitionContainer.querySelectorAll('.reveal').forEach(el => {
                                    window.revealObserver.observe(el);
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Load and render projects page content
    async function loadProjectsPage() {
        const data = await loadPageContent('projects');
        if (!data) return;
        
        // Page Hero
        if (data.pageHero) {
            const pageHero = document.querySelector('.page-hero');
            if (pageHero) {
                const h1 = pageHero.querySelector('h1');
                const p = pageHero.querySelector('p');
                if (h1 && data.pageHero.title) h1.textContent = data.pageHero.title;
                if (p && data.pageHero.subtitle) p.textContent = data.pageHero.subtitle;
                if (data.pageHero.image) {
                    const normalizedImg = normalizeImagePath(data.pageHero.image);
                    pageHero.style.backgroundImage = `url('${normalizedImg}')`;
                }
            }
        }
        
        // CTA Section
        if (data.cta) {
            const ctaSection = document.querySelector('.cta-section');
            if (ctaSection) {
                const h2 = ctaSection.querySelector('h2');
                const p = ctaSection.querySelector('p');
                const btn = ctaSection.querySelector('.btn');
                if (h2 && data.cta.title) h2.innerHTML = data.cta.title;
                if (p && data.cta.description) p.textContent = data.cta.description;
                if (btn && data.cta.buttonText) {
                    const span = btn.querySelector('span');
                    if (span) span.textContent = data.cta.buttonText;
                    if (data.cta.buttonLink) btn.href = data.cta.buttonLink;
                }
            }
        }
        
        // Projects - This is complex, so we'll update existing projects rather than recreating
        if (data.projects && data.projects.length > 0) {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, idx) => {
                if (idx < data.projects.length) {
                    const project = data.projects[idx];
                    
                    // Update title
                    const h2 = card.querySelector('.project-details h2');
                    if (h2 && project.name) h2.textContent = project.name;
                    
                    // Update description paragraphs
                    if (project.description && Array.isArray(project.description)) {
                        const paragraphs = card.querySelectorAll('.project-details > p');
                        paragraphs.forEach((p, pIdx) => {
                            if (pIdx < project.description.length) {
                                p.textContent = project.description[pIdx];
                            }
                        });
                    }
                    
                    // Update images
                    if (project.images && project.images.length > 0) {
                        const slideshow = card.querySelector('.project-slideshow');
                        if (slideshow) {
                            slideshow.innerHTML = '';
                            project.images.forEach((img, imgIdx) => {
                                const normalizedImg = normalizeImagePath(img);
                                const slide = document.createElement('div');
                                slide.className = `project-slide ${imgIdx === 0 ? 'active' : ''}`;
                                slide.style.backgroundImage = `url('${normalizedImg}')`;
                                slide.setAttribute('aria-hidden', imgIdx === 0 ? 'false' : 'true');
                                slideshow.appendChild(slide);
                            });
                            // Re-initialize slideshow after updating slides
                            if (window.initProjectSlideshows && project.images.length > 1) {
                                setTimeout(() => {
                                    window.initProjectSlideshows();
                                }, 100);
                            }
                        } else {
                            const imageDiv = card.querySelector('.project-image');
                            if (imageDiv && project.images[0]) {
                                const normalizedImg = normalizeImagePath(project.images[0]);
                                imageDiv.style.backgroundImage = `url('${normalizedImg}')`;
                            }
                        }
                    }
                    
                    // Update meta items - support both old format (string) and new format (object with icon and text)
                    if (project.meta && project.meta.length > 0) {
                        const metaContainer = card.querySelector('.project-meta');
                        if (metaContainer) {
                            metaContainer.innerHTML = '';
                            project.meta.forEach(meta => {
                                const metaItem = document.createElement('span');
                                metaItem.className = 'meta-item';
                                // Handle both old format (string) and new format (object)
                                const metaText = typeof meta === 'string' ? meta : (meta.text || '');
                                const metaIcon = typeof meta === 'string' ? 'bi-geo-alt-fill' : (meta.icon || 'bi-geo-alt-fill');
                                metaItem.innerHTML = `<i class="bi ${metaIcon} me-1 text-primary"></i>${metaText}`;
                                metaContainer.appendChild(metaItem);
                            });
                        }
                    }
                    
                    // Update sections - create new ones if needed
                    if (project.sections && project.sections.length > 0) {
                        const projectDetails = card.querySelector('.project-details');
                        if (projectDetails) {
                            // Find existing section headings
                            const sectionHeadings = projectDetails.querySelectorAll('.project-section-heading');
                            const existingSections = Array.from(sectionHeadings);
                            
                            // Update existing sections
                            existingSections.forEach((heading, sIdx) => {
                                if (sIdx < project.sections.length) {
                                    const section = project.sections[sIdx];
                                    const sectionIcon = section.icon || 'bi-diagram-3-fill';
                                    heading.innerHTML = `<i class="bi ${sectionIcon}"></i>${section.title || ''}`;
                                    
                                    // Update next element (could be ul or p)
                                    const nextEl = heading.nextElementSibling;
                                    if (nextEl) {
                                        if (nextEl.tagName === 'UL' && Array.isArray(section.content)) {
                                            nextEl.innerHTML = '';
                                            section.content.forEach(content => {
                                                const li = document.createElement('li');
                                                li.innerHTML = content;
                                                nextEl.appendChild(li);
                                            });
                                        } else if (nextEl.tagName === 'P') {
                                            nextEl.textContent = Array.isArray(section.content) 
                                                ? section.content.join('\n') 
                                                : section.content;
                                        }
                                    }
                                }
                            });
                            
                            // Create new sections if there are more in Firebase than in HTML
                            if (project.sections.length > existingSections.length) {
                                // Find where to insert new sections (after last existing section or before features)
                                let insertPoint = null;
                                if (existingSections.length > 0) {
                                    const lastSection = existingSections[existingSections.length - 1];
                                    insertPoint = lastSection.nextElementSibling;
                                    // Skip the content element (ul or p) after the heading
                                    if (insertPoint && (insertPoint.tagName === 'UL' || insertPoint.tagName === 'P')) {
                                        insertPoint = insertPoint.nextElementSibling;
                                    }
                                } else {
                                    // No existing sections, find where to insert (before features or at end)
                                    const featuresContainer = projectDetails.querySelector('.project-features');
                                    insertPoint = featuresContainer || null;
                                }
                                
                                // Create new sections
                                for (let sIdx = existingSections.length; sIdx < project.sections.length; sIdx++) {
                                    const section = project.sections[sIdx];
                                    if (!section.title && !section.content) continue;
                                    
                                    // Create section heading
                                    const heading = document.createElement('h3');
                                    heading.className = 'project-section-heading';
                                    const sectionIcon = section.icon || 'bi-diagram-3-fill';
                                    heading.innerHTML = `<i class="bi ${sectionIcon}"></i>${section.title || ''}`;
                                    
                                    // Create content element
                                    const content = Array.isArray(section.content) ? section.content : [section.content];
                                    let contentEl;
                                    
                                    // Determine if content should be a list (if it has multiple items) or paragraph
                                    if (content.length > 1 || (content.length === 1 && content[0].includes('<li>') || content[0].includes('•'))) {
                                        contentEl = document.createElement('ul');
                                        contentEl.className = 'tenant-list';
                                        content.forEach(contentItem => {
                                            const li = document.createElement('li');
                                            li.innerHTML = contentItem;
                                            contentEl.appendChild(li);
                                        });
                                    } else {
                                        contentEl = document.createElement('p');
                                        contentEl.textContent = content[0] || '';
                                    }
                                    
                                    // Insert into DOM
                                    if (insertPoint) {
                                        projectDetails.insertBefore(heading, insertPoint);
                                        projectDetails.insertBefore(contentEl, insertPoint);
                                    } else {
                                        projectDetails.appendChild(heading);
                                        projectDetails.appendChild(contentEl);
                                    }
                                }
                            }
                        }
                    }
                    
                    // Update features - support both old format (string) and new format (object with icon and text)
                    if (project.features && project.features.length > 0) {
                        const featuresContainer = card.querySelector('.project-features');
                        if (featuresContainer) {
                            featuresContainer.innerHTML = '';
                            project.features.forEach(feature => {
                                const tag = document.createElement('div');
                                tag.className = 'feature-tag';
                                // Handle both old format (string) and new format (object)
                                const featureText = typeof feature === 'string' ? feature : (feature.text || '');
                                const featureIcon = typeof feature === 'string' ? 'bi-building' : (feature.icon || 'bi-building');
                                tag.innerHTML = `<i class="bi ${featureIcon} me-1"></i>${featureText}`;
                                featuresContainer.appendChild(tag);
                            });
                        }
                    }
                    
                    // Update progress
                    if (project.progress) {
                        let progressEl = card.querySelector('.project-progress');
                        if (!progressEl) {
                            progressEl = document.createElement('p');
                            progressEl.className = 'project-progress';
                            const details = card.querySelector('.project-details');
                            if (details) details.appendChild(progressEl);
                        }
                        progressEl.innerHTML = `<strong>Progress:</strong> ${project.progress}`;
                    }
                    
                    // Update featured status
                    if (project.featured) {
                        // Add "featured" class to the card
                        card.classList.add('featured');
                        
                        // Add or update the featured badge
                        const projectImage = card.querySelector('.project-image');
                        if (projectImage) {
                            let badge = projectImage.querySelector('.project-badge');
                            if (!badge) {
                                badge = document.createElement('div');
                                badge.className = 'project-badge';
                                projectImage.appendChild(badge);
                            }
                            badge.innerHTML = '<i class="bi bi-star-fill me-1"></i>Featured';
                        }
                    } else {
                        // Remove "featured" class if not featured
                        card.classList.remove('featured');
                        
                        // Remove featured badge (but keep other badges like "Future Project")
                        const badge = card.querySelector('.project-badge');
                        if (badge && badge.textContent.includes('Featured')) {
                            badge.remove();
                        }
                    }
                }
            });
        }
    }
    
    // Load and render contact page content
    async function loadContactPage() {
        const data = await loadPageContent('contact');
        if (!data) return;
        
        // Page Hero
        if (data.pageHero) {
            const pageHero = document.querySelector('.page-hero');
            if (pageHero) {
                const h1 = pageHero.querySelector('h1');
                const p = pageHero.querySelector('p');
                if (h1 && data.pageHero.title) h1.textContent = data.pageHero.title;
                if (p && data.pageHero.subtitle) p.textContent = data.pageHero.subtitle;
                if (data.pageHero.image) {
                    const normalizedImg = normalizeImagePath(data.pageHero.image);
                    pageHero.style.backgroundImage = `url('${normalizedImg}')`;
                }
            }
        }
        
        // Contact Form Title
        if (data.contactForm && data.contactForm.title) {
            const formTitle = document.querySelector('.contact-form-container h2');
            if (formTitle) formTitle.textContent = data.contactForm.title;
        }
        
        // Contact Info
        if (data.contactInfo && data.contactInfo.items) {
            const contactInfo = document.querySelector('.contact-info');
            if (contactInfo) {
                // Update title
                const h2 = contactInfo.querySelector('h2');
                if (h2 && data.contactInfo.title) h2.textContent = data.contactInfo.title;
                
                // Update info items
                const infoItems = contactInfo.querySelectorAll('.info-item');
                infoItems.forEach((item, idx) => {
                    if (idx < data.contactInfo.items.length) {
                        const infoData = data.contactInfo.items[idx];
                        const icon = item.querySelector('.info-icon i');
                        const h3 = item.querySelector('.info-content h3');
                        const p = item.querySelector('.info-content p');
                        
                        if (icon && infoData.icon) icon.className = `bi ${infoData.icon}`;
                        if (h3 && infoData.title) h3.textContent = infoData.title;
                        if (p && infoData.content) p.innerHTML = infoData.content;
                    }
                });
            }
        }
    }
    
    // Load footer from global collection or index page
    async function loadFooter() {
        // Try global footer first
        try {
            const globalFooter = await db.collection('global').doc('footer').get();
            if (globalFooter.exists) {
                renderFooter(globalFooter.data());
                return;
            }
        } catch (e) {
            console.log('Global footer not found, trying index page footer');
        }
        
        // Fallback to index page footer
        const indexData = await loadPageContent('index');
        if (indexData && indexData.footer) {
            renderFooter(indexData.footer);
        }
    }
    
    // Render footer content
    function renderFooter(footerData) {
        const footer = document.querySelector('.footer');
        if (!footer || !footerData) return;
        
        const companyName = footer.querySelector('h3');
        const description = footer.querySelector('.footer-section p');
        const email = footer.querySelector('a[href^="mailto:"]');
        const phone = footer.querySelector('a[href^="tel:"]');
        const copyright = footer.querySelector('.footer-bottom p');
        
        if (companyName && footerData.companyName) companyName.textContent = footerData.companyName;
        if (description && footerData.description) description.textContent = footerData.description;
        if (email && footerData.email) {
            email.textContent = footerData.email;
            email.href = `mailto:${footerData.email}`;
        }
        if (phone && footerData.phone) {
            phone.textContent = footerData.phone;
            phone.href = `tel:${footerData.phone.replace(/\s/g, '')}`;
        }
        if (copyright && footerData.copyright) copyright.textContent = footerData.copyright;
    }
    
    // Determine current page and load appropriate content
    document.addEventListener('DOMContentLoaded', function() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('Current page detected:', currentPage);
        
        if (currentPage === 'index.html' || currentPage === '' || currentPage === 'index') {
            console.log('Loading index page...');
            loadIndexPage();
        } else if (currentPage === 'about.html' || currentPage === 'about') {
            console.log('Loading about page...');
            loadAboutPage();
        } else if (currentPage === 'projects.html' || currentPage === 'projects') {
            console.log('Loading projects page...');
            loadProjectsPage();
        } else if (currentPage === 'contact.html' || currentPage === 'contact') {
            console.log('Loading contact page...');
            loadContactPage();
        }
        
        // Load footer on all pages
        loadFooter();
    });
    
    // Also try to load if DOM is already loaded (in case script loads after DOMContentLoaded)
    if (document.readyState === 'loading') {
        // Will be handled by DOMContentLoaded listener above
    } else {
        // DOM already loaded, run immediately
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('DOM already loaded, current page:', currentPage);
        if (currentPage === 'about.html' || currentPage === 'about') {
            console.log('Loading about page (DOM already loaded)...');
            loadAboutPage();
        }
    }
})();

