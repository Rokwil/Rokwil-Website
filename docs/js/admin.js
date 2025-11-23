/**
 * Admin Panel JavaScript
 * Handles content management and editing for the Rokwil website
 */

// Check authentication
function checkAuth() {
    // Don't redirect if we're already on the login page
    const currentPage = window.location.pathname.split('/').pop() || '';
    if (currentPage === 'login.html' || currentPage.endsWith('login.html')) {
        return false;
    }
    
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Check session expiry (24 hours)
    const loginTime = parseInt(sessionStorage.getItem('admin_login_time') || '0');
    const now = Date.now();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursSinceLogin >= 24) {
        sessionStorage.removeItem('admin_authenticated');
        sessionStorage.removeItem('admin_login_time');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Logout function
function logout() {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_login_time');
    window.location.href = 'login.html';
}

// Storage key for admin content
const ADMIN_CONTENT_KEY = 'rokwil_admin_content';

// Default content structure
const defaultContent = {
    homePage: {
        heroTitle: "Industrial Platforms & Mega DCs on the N3 in KZN",
        heroSubtitle: "Transforming the Durban–Pietermaritzburg corridor through world-class logistics precincts. Keystone Park: ±152 hectares of serviced platforms hosting blue-chip occupiers.",
        email: "rod@rokwil.com",
        phone: "083 693 226"
    },
    footer: {
        email: "rod@rokwil.com",
        phone: "083 693 226",
        address: "Durban, KwaZulu-Natal, South Africa"
    },
    contact: {
        email: "rod@rokwil.com",
        phone: "083 693 226"
    },
    icons: {
        emailIcon: "bi-envelope-fill",
        phoneIcon: "bi-telephone-fill",
        locationIcon: "bi-geo-alt-fill"
    },
    customContent: []
};

// Get stored content or return defaults
function getContent() {
    const stored = localStorage.getItem(ADMIN_CONTENT_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored content:', e);
            return defaultContent;
        }
    }
    return defaultContent;
}

// Make getContent globally accessible
window.getContent = getContent;

// Save content to localStorage
function saveContent(content) {
    localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(content));
    return true;
}

// Make saveContent globally accessible
window.saveContent = saveContent;

// Apply content changes to the website
function applyContentChanges() {
    const content = getContent();
    
    // Apply to home page
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        applyHomePageContent(content);
    }
    
    // Apply to about page
    if (window.location.pathname.includes('about.html')) {
        applyAboutPageContent(content);
    }
    
    // Apply to projects page
    if (window.location.pathname.includes('projects.html')) {
        applyProjectsPageContent(content);
    }
    
    // Apply to contact page
    if (window.location.pathname.includes('contact.html')) {
        applyContactPageContent(content);
    }
    
    // Apply global settings (email, phone, icons)
    applyGlobalContent(content);
}

// Apply home page content
function applyHomePageContent(content) {
    if (!content.homePage) return;
    
    // Hero section
    if (content.homePage.hero) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && content.homePage.hero.title) {
            heroTitle.textContent = content.homePage.hero.title;
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && content.homePage.hero.subtitle) {
            heroSubtitle.textContent = content.homePage.hero.subtitle;
        }
        
        // Update hero background images
        const heroSection = document.querySelector('.hero');
        if (heroSection && content.homePage.hero.image1) {
            let bgImage = `url('${content.homePage.hero.image1}')`;
            if (content.homePage.hero.image2) {
                bgImage += `, url('${content.homePage.hero.image2}')`;
            }
            heroSection.style.backgroundImage = bgImage;
        }
    }
    
    // Video section
    if (content.homePage.video) {
        const videoTitle = document.querySelector('.section-title');
        const videoSubtitle = document.querySelector('.section-subtitle');
        if (videoTitle && content.homePage.video.title) {
            // Find the video section title
            const videoSection = document.querySelector('section:has(video)');
            if (videoSection) {
                const title = videoSection.querySelector('.section-title');
                const subtitle = videoSection.querySelector('.section-subtitle');
                if (title) title.textContent = content.homePage.video.title;
                if (subtitle) subtitle.textContent = content.homePage.video.subtitle;
            }
        }
        
        const video = document.querySelector('video');
        if (video) {
            if (content.homePage.video.src) {
                const source = video.querySelector('source');
                if (source) source.src = content.homePage.video.src;
            }
            if (content.homePage.video.poster) {
                video.poster = content.homePage.video.poster;
            }
        }
    }
    
    // Features section
    if (content.homePage.features) {
        const featuresSection = document.querySelector('.features');
        if (featuresSection) {
            // Hide entire section if marked as hidden
            if (content.homePage.features.hidden) {
                featuresSection.style.display = 'none';
            } else {
                featuresSection.style.display = '';
                
                const featuresTitle = document.querySelector('.features .section-title');
                const featuresSubtitle = document.querySelector('.features .section-subtitle');
                if (featuresTitle && content.homePage.features.title) {
                    featuresTitle.textContent = content.homePage.features.title;
                }
                if (featuresSubtitle && content.homePage.features.subtitle) {
                    featuresSubtitle.textContent = content.homePage.features.subtitle;
                }
                
                if (content.homePage.features.items && content.homePage.features.items.length > 0) {
                    const featureCards = document.querySelectorAll('.feature-card');
                    content.homePage.features.items.forEach((item, index) => {
                        if (featureCards[index]) {
                            const icon = featureCards[index].querySelector('.feature-icon i');
                            const title = featureCards[index].querySelector('h3');
                            const description = featureCards[index].querySelector('p');
                            
                            if (icon && item.icon) icon.className = `bi ${item.icon}`;
                            if (title && item.title) title.textContent = item.title;
                            if (description && item.description) description.textContent = item.description;
                        }
                    });
                }
            }
        }
    }
    
    // Showcase section
    if (content.homePage.showcase) {
        const showcaseSection = document.querySelector('.showcase');
        if (showcaseSection) {
            // Hide entire section if marked as hidden
            if (content.homePage.showcase.hidden) {
                showcaseSection.style.display = 'none';
            } else {
                showcaseSection.style.display = '';
                
                const showcaseTitle = document.querySelector('.showcase .section-title');
                const showcaseSubtitle = document.querySelector('.showcase .section-subtitle');
                if (showcaseTitle && content.homePage.showcase.title) {
                    showcaseTitle.textContent = content.homePage.showcase.title;
                }
                if (showcaseSubtitle && content.homePage.showcase.subtitle) {
                    showcaseSubtitle.textContent = content.homePage.showcase.subtitle;
                }
                
                if (content.homePage.showcase.items && content.homePage.showcase.items.length > 0) {
                    const showcaseItems = document.querySelectorAll('.showcase-item');
                    content.homePage.showcase.items.forEach((item, index) => {
                        if (showcaseItems[index]) {
                            if (item.hidden) {
                                // Hide this showcase item
                                showcaseItems[index].style.display = 'none';
                            } else {
                                // Show and apply content to this showcase item
                                showcaseItems[index].style.display = '';
                                const image = showcaseItems[index].querySelector('.showcase-image');
                                const title = showcaseItems[index].querySelector('.showcase-overlay h3');
                                const description = showcaseItems[index].querySelector('.showcase-overlay p');
                                
                                if (image && item.image) {
                                    image.style.backgroundImage = `url('${item.image}')`;
                                }
                                if (title && item.title) title.textContent = item.title;
                                if (description && item.description) description.textContent = item.description;
                            }
                        }
                    });
                    // Hide any remaining showcase items that don't have content
                    for (let i = content.homePage.showcase.items.length; i < showcaseItems.length; i++) {
                        showcaseItems[i].style.display = 'none';
                    }
                }
            }
        }
    }
    
    // Testimonials section
    if (content.homePage.testimonials) {
        const testimonialsSection = document.querySelector('.testimonials');
        if (testimonialsSection) {
            // Hide entire section if marked as hidden
            if (content.homePage.testimonials.hidden) {
                testimonialsSection.style.display = 'none';
            } else {
                testimonialsSection.style.display = '';
                
                const testimonialsTitle = document.querySelector('.testimonials .section-title');
                const testimonialsSubtitle = document.querySelector('.testimonials .section-subtitle');
                if (testimonialsTitle && content.homePage.testimonials.title) {
                    testimonialsTitle.textContent = content.homePage.testimonials.title;
                }
                if (testimonialsSubtitle && content.homePage.testimonials.subtitle) {
                    testimonialsSubtitle.textContent = content.homePage.testimonials.subtitle;
                }
                
                if (content.homePage.testimonials.items && content.homePage.testimonials.items.length > 0) {
                    const testimonialCards = document.querySelectorAll('.testimonial-card');
                    let visibleIndex = 0;
                    content.homePage.testimonials.items.forEach((item, index) => {
                        if (item.hidden) {
                            // Hide this testimonial card if it exists
                            if (testimonialCards[index]) {
                                testimonialCards[index].style.display = 'none';
                            }
                        } else {
                            // Show and apply content to visible testimonial card
                            if (testimonialCards[visibleIndex]) {
                                testimonialCards[visibleIndex].style.display = '';
                                const quote = testimonialCards[visibleIndex].querySelector('.testimonial-quote');
                                const author = testimonialCards[visibleIndex].querySelector('.testimonial-info h4');
                                const title = testimonialCards[visibleIndex].querySelector('.testimonial-info p');
                                const avatar = testimonialCards[visibleIndex].querySelector('.testimonial-avatar');
                                
                                if (quote && item.quote) quote.textContent = item.quote;
                                if (author && item.author) author.textContent = item.author;
                                if (title && item.title) title.textContent = item.title;
                                if (avatar && item.avatar) avatar.textContent = item.avatar;
                                visibleIndex++;
                            }
                        }
                    });
                    // Hide any remaining testimonial cards that don't have content
                    for (let i = visibleIndex; i < testimonialCards.length; i++) {
                        testimonialCards[i].style.display = 'none';
                    }
                }
            }
        }
    }
    
    // News section
    if (content.homePage.news) {
        const newsSection = document.querySelector('.news-section');
        if (newsSection) {
            // Hide entire section if marked as hidden
            if (content.homePage.news.hidden) {
                newsSection.style.display = 'none';
            } else {
                newsSection.style.display = '';
                
                const newsTitle = document.querySelector('.news-section .section-title');
                const newsSubtitle = document.querySelector('.news-section .section-subtitle');
                if (newsTitle && content.homePage.news.title) {
                    newsTitle.textContent = content.homePage.news.title;
                }
                if (newsSubtitle && content.homePage.news.subtitle) {
                    newsSubtitle.textContent = content.homePage.news.subtitle;
                }
                
                if (content.homePage.news.items && content.homePage.news.items.length > 0) {
                    const newsCards = document.querySelectorAll('.news-card');
                    let visibleIndex = 0;
                    content.homePage.news.items.forEach((item, index) => {
                        if (item.hidden) {
                            // Hide this news card if it exists
                            if (newsCards[index]) {
                                newsCards[index].style.display = 'none';
                            }
                        } else {
                            // Show and apply content to visible news card
                            if (newsCards[visibleIndex]) {
                                newsCards[visibleIndex].style.display = '';
                                const image = newsCards[visibleIndex].querySelector('.news-image');
                                const date = newsCards[visibleIndex].querySelector('.news-date');
                                const category = newsCards[visibleIndex].querySelector('.news-category');
                                const title = newsCards[visibleIndex].querySelector('.news-content h3');
                                const description = newsCards[visibleIndex].querySelector('.news-content p');
                                const link = newsCards[visibleIndex].querySelector('.news-link');
                                
                                if (image && item.image) image.style.backgroundImage = `url('${item.image}')`;
                                if (date && item.date) date.textContent = item.date;
                                if (category && item.category) category.textContent = item.category;
                                if (title && item.title) title.textContent = item.title;
                                if (description && item.description) description.textContent = item.description;
                                if (link && item.link) link.href = item.link;
                                visibleIndex++;
                            }
                        }
                    });
                    // Hide any remaining news cards that don't have content
                    for (let i = visibleIndex; i < newsCards.length; i++) {
                        newsCards[i].style.display = 'none';
                    }
                }
            }
        }
    }
    
    // Stats section
    if (content.homePage.stats) {
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            // Hide entire section if marked as hidden
            if (content.homePage.stats.hidden) {
                statsSection.style.display = 'none';
            } else {
                statsSection.style.display = '';
                
                if (content.homePage.stats.items && content.homePage.stats.items.length > 0) {
                    const statItems = document.querySelectorAll('.stat-item');
                    let visibleIndex = 0;
                    content.homePage.stats.items.forEach((item, index) => {
                        if (item.hidden) {
                            // Hide this stat item if it exists
                            if (statItems[index]) {
                                statItems[index].style.display = 'none';
                            }
                        } else {
                            // Show and apply content to visible stat item
                            if (statItems[visibleIndex]) {
                                statItems[visibleIndex].style.display = '';
                                const number = statItems[visibleIndex].querySelector('.stat-number');
                                const label = statItems[visibleIndex].querySelector('.stat-label');
                                
                                if (number && item.number) {
                                    number.textContent = item.number;
                                    number.setAttribute('data-target', item.number.replace(/[^\d.]/g, ''));
                                }
                                if (label && item.label) label.textContent = item.label;
                                visibleIndex++;
                            }
                        }
                    });
                    // Hide any remaining stat items that don't have content
                    for (let i = visibleIndex; i < statItems.length; i++) {
                        statItems[i].style.display = 'none';
                    }
                }
            }
        }
    }
}

// Apply about page content
function applyAboutPageContent(content) {
    if (!content.aboutPage) return;
    
    // Hero section
    if (content.aboutPage.hero) {
        const heroTitle = document.querySelector('.page-hero-content h1');
        const heroSubtitle = document.querySelector('.page-hero-content p');
        const heroSection = document.querySelector('.page-hero');
        
        if (heroTitle && content.aboutPage.hero.title) {
            heroTitle.textContent = content.aboutPage.hero.title;
        }
        if (heroSubtitle && content.aboutPage.hero.subtitle) {
            heroSubtitle.textContent = content.aboutPage.hero.subtitle;
        }
        if (heroSection && content.aboutPage.hero.image) {
            heroSection.style.backgroundImage = `url('${content.aboutPage.hero.image}')`;
        }
    }
    
    // Stats banner
    if (content.aboutPage.stats && content.aboutPage.stats.items && content.aboutPage.stats.items.length > 0) {
        const statsBanner = document.querySelector('.stats-banner');
        if (statsBanner) {
            const statItems = statsBanner.querySelectorAll('.stat-item');
            content.aboutPage.stats.items.forEach((item, index) => {
                if (statItems[index]) {
                    const number = statItems[index].querySelector('.stat-number');
                    const label = statItems[index].querySelector('.stat-label');
                    if (number && item.number) number.textContent = item.number;
                    if (label && item.label) label.textContent = item.label;
                }
            });
        }
    }
    
    // About content
    if (content.aboutPage.content) {
        const aboutTextSection = document.querySelector('.about-text');
        if (aboutTextSection) {
            // Story badge
            const badge = aboutTextSection.querySelector('div[style*="background: var(--secondary-color)"]');
            if (badge && content.aboutPage.content.storyBadge) {
                badge.textContent = content.aboutPage.content.storyBadge;
            }
            
            // Story heading
            const heading = aboutTextSection.querySelector('h2');
            if (heading && content.aboutPage.content.storyHeading) {
                heading.textContent = content.aboutPage.content.storyHeading;
            }
            
            // Story paragraphs
            if (content.aboutPage.content.story) {
                const paragraphs = Array.isArray(content.aboutPage.content.story) 
                    ? content.aboutPage.content.story 
                    : content.aboutPage.content.story.split('\n').filter(p => p.trim());
                
                // Get all paragraphs, excluding those inside the mission section (div with gradient)
                const allParagraphs = aboutTextSection.querySelectorAll('p');
                const storyParagraphs = Array.from(allParagraphs).filter(p => !p.closest('div[style*="gradient"]'));
                
                // Update existing paragraphs and create new ones if needed
                paragraphs.forEach((para, index) => {
                    if (storyParagraphs[index]) {
                        // Update existing paragraph
                        storyParagraphs[index].textContent = para;
                    } else {
                        // Create new paragraph element
                        const newPara = document.createElement('p');
                        newPara.style.cssText = 'font-size: 1.15rem; line-height: 1.9; margin-bottom: 1.5rem;';
                        newPara.textContent = para;
                        // Insert before the mission section (the div with gradient)
                        const missionSection = aboutTextSection.querySelector('div[style*="gradient"]');
                        if (missionSection) {
                            missionSection.parentNode.insertBefore(newPara, missionSection);
                        } else {
                            aboutTextSection.appendChild(newPara);
                        }
                    }
                });
                
                // Remove extra paragraphs if content has fewer paragraphs than HTML
                if (storyParagraphs.length > paragraphs.length) {
                    for (let i = paragraphs.length; i < storyParagraphs.length; i++) {
                        storyParagraphs[i].remove();
                    }
                }
            }
        }
        
        const aboutImage = document.querySelector('.about-image img');
        if (aboutImage && content.aboutPage.content.image) {
            aboutImage.src = content.aboutPage.content.image;
        }
    }
    
    // Mission
    if (content.aboutPage.mission) {
        const aboutTextSection = document.querySelector('.about-text');
        if (aboutTextSection) {
            // Find div with gradient in style that also has border (mission section has both)
            const allDivs = aboutTextSection.querySelectorAll('div[style*="gradient"]');
            let missionSection = null;
            for (const div of allDivs) {
                const style = div.getAttribute('style') || '';
                if (style.includes('gradient') && style.includes('border:') && style.includes('border-radius')) {
                    missionSection = div;
                    break;
                }
            }
            
            if (missionSection) {
                const missionIcon = missionSection.querySelector('i');
                const missionTitle = missionSection.querySelector('h3');
                const missionText = missionSection.querySelector('p');
                
                if (missionIcon && content.aboutPage.mission.icon) {
                    const iconClass = content.aboutPage.mission.icon.startsWith('bi ') 
                        ? content.aboutPage.mission.icon 
                        : content.aboutPage.mission.icon.startsWith('bi-') 
                            ? `bi ${content.aboutPage.mission.icon}` 
                            : `bi bi-${content.aboutPage.mission.icon}`;
                    missionIcon.className = iconClass;
                }
                if (missionTitle && content.aboutPage.mission.title) {
                    missionTitle.textContent = content.aboutPage.mission.title;
                }
                if (missionText && content.aboutPage.mission.text) {
                    missionText.textContent = content.aboutPage.mission.text;
                }
            }
        }
    }
    
    // Timeline header
    if (content.aboutPage.timeline) {
        // Find the timeline section header (it's before the timeline items)
        const timelineContainer = document.querySelector('div[style*="margin-top: 100px"]:has(.timeline-item)');
        if (timelineContainer) {
            const timelineSection = timelineContainer.querySelector('.section-header');
            if (timelineSection) {
                const timelineTitle = timelineSection.querySelector('.section-title');
                const timelineSubtitle = timelineSection.querySelector('.section-subtitle');
                if (timelineTitle && content.aboutPage.timeline.title) {
                    timelineTitle.textContent = content.aboutPage.timeline.title;
                }
                if (timelineSubtitle && content.aboutPage.timeline.subtitle) {
                    timelineSubtitle.textContent = content.aboutPage.timeline.subtitle;
                }
            }
        }
        
        // Timeline items - dynamic creation/update/removal
        if (content.aboutPage.timeline.items && content.aboutPage.timeline.items.length > 0) {
            // Find the timeline container
            const timelineContainer = document.querySelector('div[style*="margin-top: 100px"]:has(.timeline-item)');
            if (timelineContainer) {
                const timelineItemsContainer = timelineContainer.querySelector('div[style*="position: relative"]');
                if (timelineItemsContainer) {
                    let timelineItems = timelineItemsContainer.querySelectorAll('.timeline-item');
                    
                    // Remove extra items if content has fewer items than HTML
                    if (timelineItems.length > content.aboutPage.timeline.items.length) {
                        for (let i = content.aboutPage.timeline.items.length; i < timelineItems.length; i++) {
                            timelineItems[i].remove();
                        }
                        // Re-query after removal
                        timelineItems = timelineItemsContainer.querySelectorAll('.timeline-item');
                    }
                    
                    // Update existing items and create new ones
                    content.aboutPage.timeline.items.forEach((item, index) => {
                        // Re-query timelineItems inside the loop to ensure it's always current
                        timelineItems = timelineItemsContainer.querySelectorAll('.timeline-item');
                        
                        if (timelineItems[index]) {
                            // Update existing item
                            const title = timelineItems[index].querySelector('.timeline-card h3');
                            const description = timelineItems[index].querySelector('.timeline-card p');
                            
                            if (title && item.title) {
                                // Format title: "year – title" or just "title"
                                const formattedTitle = item.year 
                                    ? `${item.year} – ${item.title}` 
                                    : item.title;
                                title.textContent = formattedTitle;
                            }
                            if (description && item.description) {
                                description.textContent = item.description;
                            }
                        } else {
                            // Create new timeline item
                            const newTimelineItem = document.createElement('div');
                            newTimelineItem.className = 'timeline-item reveal';
                            newTimelineItem.style.cssText = 'display: flex; gap: 2rem; margin-bottom: 3rem; position: relative;';
                            
                            const number = index + 1;
                            const formattedTitle = item.year 
                                ? `${item.year} – ${item.title || ''}` 
                                : (item.title || '');
                            
                            newTimelineItem.innerHTML = `
                                <div style="width: 60px; height: 60px; background: var(--gradient-2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-light); font-size: 1.5rem; font-weight: 700; flex-shrink: 0; box-shadow: var(--shadow-md); z-index: 2; transition: all 0.3s ease;">${number}</div>
                                <div class="timeline-card" style="flex: 1; padding: 2rem; border-radius: 8px; border-left: 3px solid var(--secondary-color);">
                                    <h3 style="margin-bottom: 0.5rem; font-size: 1.4rem;">${formattedTitle}</h3>
                                    <p style="margin: 0; line-height: 1.8;">${item.description || ''}</p>
                                </div>
                            `;
                            
                            timelineItemsContainer.appendChild(newTimelineItem);
                            
                            // Let the revealObserver handle the animation naturally
                            // The observer now uses timeline position instead of entries index
                            if (window.revealObserver) {
                                // Use requestAnimationFrame to ensure DOM is fully rendered
                                requestAnimationFrame(() => {
                                    // Always observe the new item - the updated revealObserver will handle timing correctly
                                    window.revealObserver.observe(newTimelineItem);
                                    
                                    // If already in viewport, trigger immediately (observer will calculate correct delay)
                                    setTimeout(() => {
                                        const rect = newTimelineItem.getBoundingClientRect();
                                        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                                        
                                        if (isInViewport && !newTimelineItem.classList.contains('active')) {
                                            // Manually trigger intersection to ensure observer fires
                                            // The observer will calculate the correct delay based on timeline position
                                            const allTimelineItems = timelineItemsContainer.querySelectorAll('.timeline-item');
                                            const itemPosition = Array.from(allTimelineItems).indexOf(newTimelineItem);
                                            const delay = itemPosition * 100;
                                            
                                            setTimeout(() => {
                                                newTimelineItem.classList.add('active');
                                            }, delay);
                                        }
                                    }, 100);
                                });
                            } else {
                                // If revealObserver is not available, just make it visible immediately
                                newTimelineItem.classList.add('active');
                            }
                        }
                    });
                }
            }
        }
    }
    
    // Values
    if (content.aboutPage.values) {
        const valuesSection = document.querySelector('.values-section');
        if (valuesSection) {
            const valuesTitle = valuesSection.querySelector('.section-title');
            if (valuesTitle && content.aboutPage.values.title) {
                valuesTitle.textContent = content.aboutPage.values.title;
            }
            
            if (content.aboutPage.values.items && content.aboutPage.values.items.length > 0) {
                const valuesGrid = valuesSection.querySelector('.values-grid');
                if (valuesGrid) {
                    let valueCards = valuesGrid.querySelectorAll('.value-card');
                    
                    // Remove extra items if content has fewer items than HTML
                    if (valueCards.length > content.aboutPage.values.items.length) {
                        for (let i = content.aboutPage.values.items.length; i < valueCards.length; i++) {
                            valueCards[i].remove();
                        }
                        // Re-query after removal
                        valueCards = valuesGrid.querySelectorAll('.value-card');
                    }
                    
                    // Update existing items and create new ones
                    content.aboutPage.values.items.forEach((item, index) => {
                        // Re-query valueCards inside the loop to ensure it's always current
                        valueCards = valuesGrid.querySelectorAll('.value-card');
                        
                        if (valueCards[index]) {
                            // Update existing item
                            const icon = valueCards[index].querySelector('.value-icon i');
                            const title = valueCards[index].querySelector('h3');
                            const description = valueCards[index].querySelector('p');
                            
                            if (icon && item.icon) {
                                const iconClass = item.icon.startsWith('bi ') 
                                    ? item.icon 
                                    : item.icon.startsWith('bi-') 
                                        ? `bi ${item.icon}` 
                                        : `bi bi-${item.icon}`;
                                icon.className = iconClass;
                            }
                            if (title && item.title) {
                                title.textContent = item.title;
                            }
                            if (description && item.description) {
                                description.textContent = item.description;
                            }
                        } else {
                            // Create new value card
                            const newValueCard = document.createElement('div');
                            newValueCard.className = 'value-card reveal';
                            newValueCard.innerHTML = `
                                <div class="value-icon"><i class="bi ${item.icon || 'bi-star'}"></i></div>
                                <h3>${item.title || ''}</h3>
                                <p>${item.description || ''}</p>
                            `;
                            valuesGrid.appendChild(newValueCard);
                            
                            // Observe the new element with revealObserver if available
                            if (window.revealObserver) {
                                // Use requestAnimationFrame to ensure DOM is fully rendered
                                requestAnimationFrame(() => {
                                    // Check if other value cards are already animated (section is visible)
                                    const allValueCards = valuesGrid.querySelectorAll('.value-card');
                                    const hasAnimatedCards = Array.from(allValueCards).some(card => 
                                        card !== newValueCard && card.classList.contains('active')
                                    );
                                    
                                    const rect = newValueCard.getBoundingClientRect();
                                    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                                    
                                    if (isInViewport && !newValueCard.classList.contains('active')) {
                                        if (hasAnimatedCards) {
                                            // If other cards are already animated, animate immediately to match
                                            newValueCard.classList.add('active');
                                        } else {
                                            // If no cards are animated yet, use the observer with proper delay
                                            window.revealObserver.observe(newValueCard);
                                        }
                                    } else {
                                        // Not in viewport yet, let observer handle it when scrolled into view
                                        window.revealObserver.observe(newValueCard);
                                    }
                                });
                            } else {
                                // If revealObserver is not available, just make it visible immediately
                                newValueCard.classList.add('active');
                            }
                        }
                    });
                } else {
                    // Fallback: use the same approach as before
                    const valueCards = valuesSection.querySelectorAll('.value-card');
                    content.aboutPage.values.items.forEach((item, index) => {
                        if (valueCards[index]) {
                            const icon = valueCards[index].querySelector('.value-icon i');
                            const title = valueCards[index].querySelector('h3');
                            const description = valueCards[index].querySelector('p');
                            
                            if (icon && item.icon) {
                                const iconClass = item.icon.startsWith('bi ') 
                                    ? item.icon 
                                    : item.icon.startsWith('bi-') 
                                        ? `bi ${item.icon}` 
                                        : `bi bi-${item.icon}`;
                                icon.className = iconClass;
                            }
                            if (title && item.title) {
                                title.textContent = item.title;
                            }
                            if (description && item.description) {
                                description.textContent = item.description;
                            }
                        }
                    });
                }
            } else {
                // If no items in content, clear all value cards from DOM
                const valuesGrid = valuesSection.querySelector('.values-grid');
                if (valuesGrid) {
                    valuesGrid.innerHTML = '';
                }
            }
        }
    }
    
    // Leadership
    if (content.aboutPage.leadership) {
        const leadershipCard = document.querySelector('.leadership-card');
        if (leadershipCard) {
            // Find the section header that contains the leadership card
            const leadershipSection = leadershipCard.closest('.values-section');
            if (leadershipSection) {
                const leadershipTitle = leadershipSection.querySelector('.section-title');
                const leadershipSubtitle = leadershipSection.querySelector('.section-subtitle');
                if (leadershipTitle && content.aboutPage.leadership.title) {
                    leadershipTitle.textContent = content.aboutPage.leadership.title;
                }
                if (leadershipSubtitle && content.aboutPage.leadership.subtitle) {
                    leadershipSubtitle.textContent = content.aboutPage.leadership.subtitle;
                }
            }
            
            const initialsDiv = leadershipCard.querySelector('div[style*="width: 150px"]');
            if (initialsDiv && content.aboutPage.leadership.initials) {
                initialsDiv.textContent = content.aboutPage.leadership.initials;
            }
            
            const name = leadershipCard.querySelector('h3');
            if (name && content.aboutPage.leadership.name) {
                name.textContent = content.aboutPage.leadership.name;
            }
            
            const titleEl = leadershipCard.querySelector('p[style*="color: var(--secondary-color)"]');
            if (titleEl && content.aboutPage.leadership.leaderTitle) {
                titleEl.textContent = content.aboutPage.leadership.leaderTitle;
            }
            
            if (content.aboutPage.leadership.tags && content.aboutPage.leadership.tags.length > 0) {
                const tagsContainer = leadershipCard.querySelector('div[style*="display: inline-flex"]');
                if (tagsContainer) {
                    tagsContainer.innerHTML = '';
                    content.aboutPage.leadership.tags.forEach(tag => {
                        const span = document.createElement('span');
                        span.style.cssText = 'padding: 0.5rem 1.5rem; background: var(--bg-secondary); border-radius: 4px; font-size: 0.9rem; color: var(--text-secondary); border: 1px solid var(--border-color);';
                        span.textContent = tag;
                        tagsContainer.appendChild(span);
                    });
                }
            }
            
            const description = leadershipCard.querySelector('div[style*="background: var(--bg-secondary)"] p');
            if (description && content.aboutPage.leadership.description) {
                description.textContent = content.aboutPage.leadership.description;
            }
        }
    }
    
    // CSR
    if (content.aboutPage.csr) {
        // Find CSR section - it has gradient-2 background, padding 80px, and contains csr-card
        const allGradientDivs = document.querySelectorAll('div[style*="background: var(--gradient-2)"]');
        let csrSection = null;
        for (const div of allGradientDivs) {
            const style = div.getAttribute('style') || '';
            if (style.includes('padding: 80px') && div.querySelector('.csr-card')) {
                csrSection = div;
                break;
            }
        }
        
        if (csrSection) {
            // Always update title and subtitle, even if items array is empty
            const csrTitle = csrSection.querySelector('.section-title');
            const csrSubtitle = csrSection.querySelector('.section-subtitle');
            if (csrTitle && content.aboutPage.csr.title) {
                csrTitle.textContent = content.aboutPage.csr.title;
            }
            if (csrSubtitle && content.aboutPage.csr.subtitle) {
                csrSubtitle.textContent = content.aboutPage.csr.subtitle;
            }
            
            // Update CSR items if they exist
            if (content.aboutPage.csr.items && content.aboutPage.csr.items.length > 0) {
                const csrCards = csrSection.querySelectorAll('.csr-card');
                content.aboutPage.csr.items.forEach((item, index) => {
                    if (csrCards[index]) {
                        // Update content
                        const icon = csrCards[index].querySelector('i');
                        const title = csrCards[index].querySelector('h4');
                        const description = csrCards[index].querySelector('p');
                        
                        if (icon && item.icon) icon.className = `bi ${item.icon}`;
                        if (title && item.title) title.textContent = item.title;
                        if (description && item.description) description.textContent = item.description;
                        
                        // Show or hide based on hidden property
                        csrCards[index].style.display = item.hidden ? 'none' : '';
                    }
                });
            }
        }
    }
    
    // Recognition
    if (content.aboutPage.recognition) {
        // Find Recognition section - it has bg-secondary background, padding 80px, and contains recognition-card
        const allBgSecondaryDivs = document.querySelectorAll('div[style*="background: var(--bg-secondary)"]');
        let recognitionSection = null;
        for (const div of allBgSecondaryDivs) {
            const style = div.getAttribute('style') || '';
            if (style.includes('padding: 80px') && div.querySelector('.recognition-card')) {
                recognitionSection = div;
                break;
            }
        }
        
        if (recognitionSection) {
            // Always update title and subtitle, even if items array is empty
            const recognitionTitle = recognitionSection.querySelector('.section-title');
            const recognitionSubtitle = recognitionSection.querySelector('.section-subtitle');
            if (recognitionTitle && content.aboutPage.recognition.title) {
                recognitionTitle.textContent = content.aboutPage.recognition.title;
            }
            if (recognitionSubtitle && content.aboutPage.recognition.subtitle) {
                recognitionSubtitle.textContent = content.aboutPage.recognition.subtitle;
            }
            
            // Update Recognition items if they exist
            if (content.aboutPage.recognition.items && content.aboutPage.recognition.items.length > 0) {
                const recognitionCards = recognitionSection.querySelectorAll('.recognition-card');
                content.aboutPage.recognition.items.forEach((item, index) => {
                    if (recognitionCards[index]) {
                        // Update content
                        const icon = recognitionCards[index].querySelector('i');
                        const title = recognitionCards[index].querySelector('h4');
                        const description = recognitionCards[index].querySelector('p');
                        
                        if (icon && item.icon) icon.className = `bi ${item.icon}`;
                        if (title && item.title) title.textContent = item.title;
                        if (description && item.description) description.textContent = item.description;
                        
                        // Show or hide based on hidden property
                        recognitionCards[index].style.display = item.hidden ? 'none' : '';
                    }
                });
            }
        }
    }
}

// Apply projects page content
function applyProjectsPageContent(content) {
    if (!content.projectsPage) return;
    
    // Hero section
    if (content.projectsPage.hero) {
        const heroTitle = document.querySelector('.page-hero-content h1');
        const heroSubtitle = document.querySelector('.page-hero-content p');
        const heroSection = document.querySelector('.page-hero');
        
        if (heroTitle && content.projectsPage.hero.title) {
            heroTitle.textContent = content.projectsPage.hero.title;
        }
        if (heroSubtitle && content.projectsPage.hero.subtitle) {
            heroSubtitle.textContent = content.projectsPage.hero.subtitle;
        }
        if (heroSection && content.projectsPage.hero.image) {
            heroSection.style.backgroundImage = `url('${content.projectsPage.hero.image}')`;
        }
    }
    
    // Projects list
    if (content.projectsPage.projects && content.projectsPage.projects.items) {
        const projectCards = document.querySelectorAll('.project-card, .project-item, article.project');
        
        content.projectsPage.projects.items.forEach((project, index) => {
            // Try to find the project card by name/title
            let projectCard = null;
            
            // Method 1: Find by data attribute if it exists
            if (project.name) {
                projectCard = document.querySelector(`[data-project-name="${project.name}"]`);
            }
            
            // Method 2: Find by h2 title text
            if (!projectCard && project.name) {
                const allH2s = document.querySelectorAll('.project-details h2, .project-card h2, article.project h2');
                allH2s.forEach(h2 => {
                    if (h2.textContent.trim() === project.name.trim()) {
                        projectCard = h2.closest('.project-card, .project-item, article.project');
                    }
                });
            }
            
            // Method 3: Use index as fallback
            if (!projectCard && projectCards[index]) {
                projectCard = projectCards[index];
            }
            
            if (projectCard) {
                // Update meta items
                if (project.meta && project.meta.length > 0) {
                    let projectMeta = projectCard.querySelector('.project-meta');
                    
                    // Create project-meta container if it doesn't exist
                    if (!projectMeta) {
                        projectMeta = document.createElement('div');
                        projectMeta.className = 'project-meta';
                        // Insert after the h2 title
                        const h2 = projectCard.querySelector('.project-details h2, h2');
                        if (h2) {
                            h2.parentNode.insertBefore(projectMeta, h2.nextSibling);
                        } else {
                            const projectDetails = projectCard.querySelector('.project-details');
                            if (projectDetails) {
                                projectDetails.insertBefore(projectMeta, projectDetails.firstChild);
                            }
                        }
                    }
                    
                    // Get existing meta items
                    let metaItems = projectMeta.querySelectorAll('.meta-item');
                    
                    // Remove extra items if content has fewer items than HTML
                    if (metaItems.length > project.meta.length) {
                        for (let i = project.meta.length; i < metaItems.length; i++) {
                            metaItems[i].remove();
                        }
                        // Re-query after removal
                        metaItems = projectMeta.querySelectorAll('.meta-item');
                    }
                    
                    // Update existing items and create new ones
                    project.meta.forEach((metaItem, metaIndex) => {
                        // Re-query metaItems inside the loop to ensure it's always current
                        metaItems = projectMeta.querySelectorAll('.meta-item');
                        
                        const icon = metaItem.icon || metaItem.split('|')[0] || 'bi-info';
                        const value = metaItem.value || metaItem.split('|')[2] || metaItem.split('|')[1] || '';
                        
                        if (metaItems[metaIndex]) {
                            // Update existing meta item
                            const iconClass = icon.startsWith('bi ') 
                                ? icon 
                                : icon.startsWith('bi-') 
                                    ? `bi ${icon}` 
                                    : `bi bi-${icon}`;
                            metaItems[metaIndex].innerHTML = `<i class="${iconClass} me-1 text-primary"></i>${value}`;
                        } else {
                            // Create new meta item
                            const newMetaItem = document.createElement('span');
                            newMetaItem.className = 'meta-item';
                            const iconClass = icon.startsWith('bi ') 
                                ? icon 
                                : icon.startsWith('bi-') 
                                    ? `bi ${icon}` 
                                    : `bi bi-${icon}`;
                            newMetaItem.innerHTML = `<i class="${iconClass} me-1 text-primary"></i>${value}`;
                            projectMeta.appendChild(newMetaItem);
                        }
                    });
                }
                
                // Update feature tags
                if (project.features && project.features.length > 0) {
                    let projectFeatures = projectCard.querySelector('.project-features');
                    
                    // Create project-features container if it doesn't exist
                    if (!projectFeatures) {
                        projectFeatures = document.createElement('div');
                        projectFeatures.className = 'project-features';
                        // Insert after project-meta or before description
                        const projectMeta = projectCard.querySelector('.project-meta');
                        const projectDetails = projectCard.querySelector('.project-details');
                        if (projectMeta && projectMeta.nextSibling) {
                            projectMeta.parentNode.insertBefore(projectFeatures, projectMeta.nextSibling);
                        } else if (projectDetails) {
                            const firstP = projectDetails.querySelector('p');
                            if (firstP) {
                                projectDetails.insertBefore(projectFeatures, firstP);
                            } else {
                                projectDetails.appendChild(projectFeatures);
                            }
                        }
                    }
                    
                    // Get existing feature tags
                    let featureTags = projectFeatures.querySelectorAll('.feature-tag');
                    
                    // Remove extra items if content has fewer items than HTML
                    if (featureTags.length > project.features.length) {
                        for (let i = project.features.length; i < featureTags.length; i++) {
                            featureTags[i].remove();
                        }
                        // Re-query after removal
                        featureTags = projectFeatures.querySelectorAll('.feature-tag');
                    }
                    
                    // Update existing items and create new ones
                    project.features.forEach((feature, featureIndex) => {
                        // Re-query featureTags inside the loop to ensure it's always current
                        featureTags = projectFeatures.querySelectorAll('.feature-tag');
                        
                        // Handle both old format (string) and new format (object with icon and text)
                        const featureObj = typeof feature === 'string' ? { text: feature, icon: 'bi-tag' } : feature;
                        let icon = featureObj.icon || 'bi-tag';
                        const text = featureObj.text || featureObj || '';
                        
                        // Ensure icon has proper format (bi-truck -> bi bi-truck)
                        if (icon.startsWith('bi-')) {
                            icon = `bi ${icon}`;
                        } else if (!icon.startsWith('bi ')) {
                            icon = `bi bi-${icon}`;
                        }
                        
                        if (featureTags[featureIndex]) {
                            // Update existing feature tag
                            featureTags[featureIndex].innerHTML = `<i class="${icon} me-1"></i> ${text}`;
                        } else {
                            // Create new feature tag
                            const newFeatureTag = document.createElement('div');
                            newFeatureTag.className = 'feature-tag';
                            newFeatureTag.innerHTML = `<i class="${icon} me-1"></i> ${text}`;
                            projectFeatures.appendChild(newFeatureTag);
                        }
                    });
                }
                
                // Update sections (including "Anchor Occupiers & Facilities" from tenants)
                if (project.sections && project.sections.length > 0) {
                    const projectDetails = projectCard.querySelector('.project-details');
                    if (projectDetails) {
                        // Get all existing section headings
                        const existingSections = projectDetails.querySelectorAll('.project-section-heading');
                        const sectionMap = new Map();
                        
                        // Map existing sections by heading text
                        existingSections.forEach(sectionHeading => {
                            const headingText = sectionHeading.textContent.trim();
                            sectionMap.set(headingText.toLowerCase(), sectionHeading);
                        });
                        
                        // Apply each section
                        project.sections.forEach((section, sectionIndex) => {
                            const heading = section.heading || '';
                            const content = section.content || '';
                            
                            if (!heading && !content) return;
                            
                            // Check if this is "Anchor Occupiers & Facilities" - convert to tenant list
                            if (heading.toLowerCase().includes('anchor occupiers')) {
                                // Find or create the section heading
                                let sectionHeading = sectionMap.get(heading.toLowerCase());
                                if (!sectionHeading) {
                                    sectionHeading = document.createElement('h3');
                                    sectionHeading.className = 'project-section-heading';
                                    sectionHeading.innerHTML = `<i class="bi bi-diagram-3-fill"></i>${heading}`;
                                    
                                    // Insert after description paragraphs, before other sections
                                    const lastP = projectDetails.querySelector('.project-details p:last-of-type');
                                    if (lastP) {
                                        lastP.parentNode.insertBefore(sectionHeading, lastP.nextSibling);
                                    } else {
                                        projectDetails.appendChild(sectionHeading);
                                    }
                                    sectionMap.set(heading.toLowerCase(), sectionHeading);
                                }
                                
                                // Find or create tenant list
                                let tenantList = sectionHeading.nextElementSibling;
                                if (!tenantList || !tenantList.classList.contains('tenant-list')) {
                                    // Create new tenant list
                                    tenantList = document.createElement('ul');
                                    tenantList.className = 'tenant-list';
                                    sectionHeading.parentNode.insertBefore(tenantList, sectionHeading.nextSibling);
                                }
                                
                                // Update tenant list items
                                const tenantLines = content.split('\n').filter(line => line.trim());
                                let listItems = tenantList.querySelectorAll('li');
                                
                                // Remove extra items
                                if (listItems.length > tenantLines.length) {
                                    for (let i = tenantLines.length; i < listItems.length; i++) {
                                        listItems[i].remove();
                                    }
                                    listItems = tenantList.querySelectorAll('li');
                                }
                                
                                // Update existing and create new items
                                tenantLines.forEach((tenantLine, tenantIndex) => {
                                    if (listItems[tenantIndex]) {
                                        // Update existing - preserve <strong> tags if present
                                        const existingText = listItems[tenantIndex].textContent.trim();
                                        // Check if tenant name should be bold (before dash or colon)
                                        const boldMatch = tenantLine.match(/^([^–:\-]+)/);
                                        if (boldMatch) {
                                            const tenantName = boldMatch[1].trim();
                                            const rest = tenantLine.substring(boldMatch[0].length).trim();
                                            listItems[tenantIndex].innerHTML = `<strong>${tenantName}</strong>${rest ? ' - ' + rest : ''}`;
                                        } else {
                                            listItems[tenantIndex].textContent = tenantLine;
                                        }
                                    } else {
                                        // Create new list item
                                        const newLi = document.createElement('li');
                                        const boldMatch = tenantLine.match(/^([^–:\-]+)/);
                                        if (boldMatch) {
                                            const tenantName = boldMatch[1].trim();
                                            const rest = tenantLine.substring(boldMatch[0].length).trim();
                                            newLi.innerHTML = `<strong>${tenantName}</strong>${rest ? ' - ' + rest : ''}`;
                                        } else {
                                            newLi.textContent = tenantLine;
                                        }
                                        tenantList.appendChild(newLi);
                                    }
                                });
                            } else {
                                // Regular section (not tenants)
                                let sectionHeading = sectionMap.get(heading.toLowerCase());
                                if (!sectionHeading) {
                                    sectionHeading = document.createElement('h3');
                                    sectionHeading.className = 'project-section-heading';
                                    sectionHeading.innerHTML = `<i class="bi bi-file-text"></i>${heading}`;
                                    
                                    // Insert after description or other sections
                                    const lastSection = projectDetails.querySelector('.project-section-heading:last-of-type');
                                    if (lastSection) {
                                        lastSection.parentNode.insertBefore(sectionHeading, lastSection.nextSibling);
                                    } else {
                                        const lastP = projectDetails.querySelector('.project-details p:last-of-type');
                                        if (lastP) {
                                            lastP.parentNode.insertBefore(sectionHeading, lastP.nextSibling);
                                        } else {
                                            projectDetails.appendChild(sectionHeading);
                                        }
                                    }
                                    sectionMap.set(heading.toLowerCase(), sectionHeading);
                                }
                                
                                // Update section content (as paragraph)
                                let sectionContent = sectionHeading.nextElementSibling;
                                if (!sectionContent || sectionContent.classList.contains('project-section-heading')) {
                                    sectionContent = document.createElement('p');
                                    sectionHeading.parentNode.insertBefore(sectionContent, sectionHeading.nextSibling);
                                }
                                
                                if (sectionContent.tagName === 'P') {
                                    sectionContent.textContent = content;
                                }
                            }
                        });
                    }
                }
            }
        });
    }
}

// Apply contact page content
function applyContactPageContent(content) {
    if (!content.contactPage) return;
    
    // Hero section
    if (content.contactPage.hero) {
        const heroTitle = document.querySelector('.page-hero-content h1');
        const heroSubtitle = document.querySelector('.page-hero-content p');
        const heroSection = document.querySelector('.page-hero');
        
        if (heroTitle && content.contactPage.hero.title) {
            heroTitle.textContent = content.contactPage.hero.title;
        }
        if (heroSubtitle && content.contactPage.hero.subtitle) {
            heroSubtitle.textContent = content.contactPage.hero.subtitle;
        }
        if (heroSection && content.contactPage.hero.image) {
            heroSection.style.backgroundImage = `url('${content.contactPage.hero.image}')`;
        }
    }
    
    // Contact info
    if (content.contactPage.info) {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        if (content.contactPage.info.email) {
            emailLinks.forEach(link => {
                link.href = `mailto:${content.contactPage.info.email}`;
                if (link.textContent.includes('@')) {
                    link.textContent = content.contactPage.info.email;
                }
            });
        }
        
        if (content.contactPage.info.phone) {
            phoneLinks.forEach(link => {
                link.href = `tel:${content.contactPage.info.phone.replace(/\s/g, '')}`;
                if (link.textContent.match(/\d/)) {
                    link.textContent = content.contactPage.info.phone;
                }
            });
        }
    }
}

// Apply global content (email, phone, icons)
function applyGlobalContent(content) {
    // Apply global email and phone
    const globalEmail = content.global?.email || content.footer?.email || content.contact?.email;
    const globalPhone = content.global?.phone || content.footer?.phone || content.contact?.phone;
    
    if (globalEmail) {
        const emailElements = document.querySelectorAll('a[href^="mailto:"]');
        emailElements.forEach(el => {
            el.setAttribute('href', `mailto:${globalEmail}`);
            if (el.textContent.includes('@')) {
                el.textContent = globalEmail;
            }
        });
    }
    
    if (globalPhone) {
        const phoneElements = document.querySelectorAll('a[href^="tel:"]');
        phoneElements.forEach(el => {
            el.setAttribute('href', `tel:${globalPhone.replace(/\s/g, '')}`);
            if (el.textContent.match(/\d/)) {
                el.textContent = globalPhone;
            }
        });
    }
    
    // Apply icons
    if (content.icons) {
        if (content.icons.emailIcon) {
            const emailIcons = document.querySelectorAll('[class*="envelope"]');
            emailIcons.forEach(icon => {
                if (icon.classList.contains('bi')) {
                    icon.className = `bi ${content.icons.emailIcon}`;
                }
            });
        }
        
        if (content.icons.phoneIcon) {
            const phoneIcons = document.querySelectorAll('[class*="telephone"]');
            phoneIcons.forEach(icon => {
                if (icon.classList.contains('bi')) {
                    icon.className = `bi ${content.icons.phoneIcon}`;
                }
            });
        }
        
        if (content.icons.locationIcon) {
            const locationIcons = document.querySelectorAll('[class*="geo"]');
            locationIcons.forEach(icon => {
                if (icon.classList.contains('bi')) {
                    icon.className = `bi ${content.icons.locationIcon}`;
                }
            });
        }
    }
}

// Initialize content application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyContentChanges);
} else {
    applyContentChanges();
}

// Export functions for use in admin.html
if (typeof window !== 'undefined') {
    window.adminJS = {
        checkAuth,
        logout,
        getContent,
        saveContent,
        applyContentChanges,
        defaultContent
    };
}

