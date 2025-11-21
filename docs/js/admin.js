/**
 * Admin Panel JavaScript
 * Handles content management and editing for the Rokwil website
 */

// Check authentication
function checkAuth() {
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

// Save content to localStorage
function saveContent(content) {
    localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(content));
    return true;
}

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
    
    // Showcase section
    if (content.homePage.showcase) {
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
                    const image = showcaseItems[index].querySelector('.showcase-image');
                    const title = showcaseItems[index].querySelector('.showcase-overlay h3');
                    const description = showcaseItems[index].querySelector('.showcase-overlay p');
                    
                    if (image && item.image) {
                        image.style.backgroundImage = `url('${item.image}')`;
                    }
                    if (title && item.title) title.textContent = item.title;
                    if (description && item.description) description.textContent = item.description;
                }
            });
        }
    }
    
    // Testimonials section
    if (content.homePage.testimonials) {
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
            content.homePage.testimonials.items.forEach((item, index) => {
                if (testimonialCards[index]) {
                    const quote = testimonialCards[index].querySelector('.testimonial-quote');
                    const author = testimonialCards[index].querySelector('.testimonial-info h4');
                    const title = testimonialCards[index].querySelector('.testimonial-info p');
                    const avatar = testimonialCards[index].querySelector('.testimonial-avatar');
                    
                    if (quote && item.quote) quote.textContent = item.quote;
                    if (author && item.author) author.textContent = item.author;
                    if (title && item.title) title.textContent = item.title;
                    if (avatar && item.avatar) avatar.textContent = item.avatar;
                }
            });
        }
    }
    
    // News section
    if (content.homePage.news) {
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
            content.homePage.news.items.forEach((item, index) => {
                if (newsCards[index]) {
                    const image = newsCards[index].querySelector('.news-image');
                    const date = newsCards[index].querySelector('.news-date');
                    const category = newsCards[index].querySelector('.news-category');
                    const title = newsCards[index].querySelector('.news-content h3');
                    const description = newsCards[index].querySelector('.news-content p');
                    const link = newsCards[index].querySelector('.news-link');
                    
                    if (image && item.image) image.style.backgroundImage = `url('${item.image}')`;
                    if (date && item.date) date.textContent = item.date;
                    if (category && item.category) category.textContent = item.category;
                    if (title && item.title) title.textContent = item.title;
                    if (description && item.description) description.textContent = item.description;
                    if (link && item.link) link.href = item.link;
                }
            });
        }
    }
    
    // Stats section
    if (content.homePage.stats && content.homePage.stats.items && content.homePage.stats.items.length > 0) {
        const statItems = document.querySelectorAll('.stat-item');
        content.homePage.stats.items.forEach((item, index) => {
            if (statItems[index]) {
                const number = statItems[index].querySelector('.stat-number');
                const label = statItems[index].querySelector('.stat-label');
                
                if (number && item.number) {
                    number.textContent = item.number;
                    number.setAttribute('data-target', item.number.replace(/[^\d.]/g, ''));
                }
                if (label && item.label) label.textContent = item.label;
            }
        });
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
                    : content.aboutPage.content.story.split('\n\n').filter(p => p.trim());
                const existingParagraphs = aboutTextSection.querySelectorAll('p');
                paragraphs.forEach((para, index) => {
                    // Skip first paragraph if it's the mission text
                    if (index < existingParagraphs.length && !existingParagraphs[index].closest('div[style*="gradient"]')) {
                        existingParagraphs[index].textContent = para;
                    }
                });
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
            const missionSection = aboutTextSection.querySelector('div[style*="gradient"]');
            if (missionSection) {
                const missionIcon = missionSection.querySelector('i');
                const missionTitle = missionSection.querySelector('h3');
                const missionText = missionSection.querySelector('p');
                
                if (missionIcon && content.aboutPage.mission.icon) {
                    missionIcon.className = `bi ${content.aboutPage.mission.icon}`;
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
        
        // Timeline items
        if (content.aboutPage.timeline.items && content.aboutPage.timeline.items.length > 0) {
            const timelineItems = document.querySelectorAll('.timeline-item');
            content.aboutPage.timeline.items.forEach((item, index) => {
                if (timelineItems[index]) {
                    const title = timelineItems[index].querySelector('.timeline-card h3');
                    const description = timelineItems[index].querySelector('.timeline-card p');
                    
                    if (title && item.title) title.textContent = item.title;
                    if (description && item.description) description.textContent = item.description;
                }
            });
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
            
            if (content.aboutPage.values.items) {
                const valueCards = valuesSection.querySelectorAll('.value-card');
                content.aboutPage.values.items.forEach((item, index) => {
                    if (valueCards[index]) {
                        const icon = valueCards[index].querySelector('.value-icon i');
                        const title = valueCards[index].querySelector('h3');
                        const description = valueCards[index].querySelector('p');
                        
                        if (icon && item.icon) icon.className = `bi ${item.icon}`;
                        if (title && item.title) title.textContent = item.title;
                        if (description && item.description) description.textContent = item.description;
                    }
                });
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
    if (content.aboutPage.csr && content.aboutPage.csr.items && content.aboutPage.csr.items.length > 0) {
        const csrSection = document.querySelector('div[style*="background: var(--gradient-2)"]');
        if (csrSection && csrSection.querySelector('.csr-card')) {
            const csrTitle = csrSection.querySelector('.section-title');
            const csrSubtitle = csrSection.querySelector('.section-subtitle');
            if (csrTitle && content.aboutPage.csr.title) csrTitle.textContent = content.aboutPage.csr.title;
            if (csrSubtitle && content.aboutPage.csr.subtitle) csrSubtitle.textContent = content.aboutPage.csr.subtitle;
            
            const csrCards = csrSection.querySelectorAll('.csr-card');
            content.aboutPage.csr.items.forEach((item, index) => {
                if (csrCards[index]) {
                    const icon = csrCards[index].querySelector('i');
                    const title = csrCards[index].querySelector('h4');
                    const description = csrCards[index].querySelector('p');
                    
                    if (icon && item.icon) icon.className = `bi ${item.icon}`;
                    if (title && item.title) title.textContent = item.title;
                    if (description && item.description) description.textContent = item.description;
                }
            });
        }
    }
    
    // Recognition
    if (content.aboutPage.recognition && content.aboutPage.recognition.items && content.aboutPage.recognition.items.length > 0) {
        const recognitionCards = document.querySelectorAll('.recognition-card');
        if (recognitionCards.length > 0) {
            const recognitionSection = recognitionCards[0].closest('div[style*="margin-top: 100px"]');
            if (recognitionSection) {
                const recognitionTitle = recognitionSection.querySelector('.section-title');
                const recognitionSubtitle = recognitionSection.querySelector('.section-subtitle');
                if (recognitionTitle && content.aboutPage.recognition.title) recognitionTitle.textContent = content.aboutPage.recognition.title;
                if (recognitionSubtitle && content.aboutPage.recognition.subtitle) recognitionSubtitle.textContent = content.aboutPage.recognition.subtitle;
                
                content.aboutPage.recognition.items.forEach((item, index) => {
                    if (recognitionCards[index]) {
                        const icon = recognitionCards[index].querySelector('i');
                        const title = recognitionCards[index].querySelector('h4');
                        const description = recognitionCards[index].querySelector('p');
                        
                        if (icon && item.icon) icon.className = `bi ${item.icon}`;
                        if (title && item.title) title.textContent = item.title;
                        if (description && item.description) description.textContent = item.description;
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
    
    // Projects list - This would require more complex DOM manipulation
    // For now, we'll apply basic changes
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

