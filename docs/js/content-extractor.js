/**
 * Content Extractor
 * Extracts current content from pages to populate admin forms
 */

function extractHomePageContent() {
    const content = {
        hero: {
            title: '',
            subtitle: '',
            image1: '',
            image2: ''
        },
        video: {
            title: '',
            subtitle: '',
            src: '',
            poster: ''
        },
        features: {
            title: '',
            subtitle: '',
            items: []
        },
        showcase: {
            title: '',
            subtitle: '',
            items: []
        },
        testimonials: {
            title: '',
            subtitle: '',
            items: []
        },
        news: {
            title: '',
            subtitle: '',
            items: []
        },
        stats: {
            items: []
        }
    };

    // Extract hero
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroSection = document.querySelector('.hero');
    
    if (heroTitle) content.hero.title = heroTitle.textContent.trim();
    if (heroSubtitle) content.hero.subtitle = heroSubtitle.textContent.trim();
    if (heroSection) {
        const bgImage = heroSection.style.backgroundImage;
        if (bgImage) {
            const matches = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/g);
            if (matches && matches.length > 0) {
                content.hero.image1 = matches[0].replace(/url\(['"]?|['"]?\)/g, '');
                if (matches.length > 1) {
                    content.hero.image2 = matches[1].replace(/url\(['"]?|['"]?\)/g, '');
                }
            }
        }
    }

    // Extract video section
    const videoSection = document.querySelector('section:has(video)');
    if (videoSection) {
        const title = videoSection.querySelector('.section-title');
        const subtitle = videoSection.querySelector('.section-subtitle');
        const video = videoSection.querySelector('video');
        
        if (title) content.video.title = title.textContent.trim();
        if (subtitle) content.video.subtitle = subtitle.textContent.trim();
        if (video) {
            const source = video.querySelector('source');
            if (source) content.video.src = source.src;
            if (video.poster) content.video.poster = video.poster;
        }
    }

    // Extract features
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
        const title = featuresSection.querySelector('.section-title');
        const subtitle = featuresSection.querySelector('.section-subtitle');
        if (title) content.features.title = title.textContent.trim();
        if (subtitle) content.features.subtitle = subtitle.textContent.trim();
        
        const featureCards = featuresSection.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            const icon = card.querySelector('.feature-icon i');
            const titleEl = card.querySelector('h3');
            const description = card.querySelector('p');
            
            content.features.items.push({
                icon: icon ? icon.className.replace('bi ', '') : '',
                title: titleEl ? titleEl.textContent.trim() : '',
                description: description ? description.textContent.trim() : ''
            });
        });
    }

    // Extract showcase
    const showcaseSection = document.querySelector('.showcase');
    if (showcaseSection) {
        const title = showcaseSection.querySelector('.section-title');
        const subtitle = showcaseSection.querySelector('.section-subtitle');
        if (title) content.showcase.title = title.textContent.trim();
        if (subtitle) content.showcase.subtitle = subtitle.textContent.trim();
        
        const showcaseItems = showcaseSection.querySelectorAll('.showcase-item');
        showcaseItems.forEach(item => {
            const image = item.querySelector('.showcase-image');
            const titleEl = item.querySelector('.showcase-overlay h3');
            const description = item.querySelector('.showcase-overlay p');
            
            let imageUrl = '';
            if (image) {
                const bgImage = image.style.backgroundImage;
                if (bgImage) {
                    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (match) imageUrl = match[1];
                }
            }
            
            content.showcase.items.push({
                image: imageUrl,
                title: titleEl ? titleEl.textContent.trim() : '',
                description: description ? description.textContent.trim() : ''
            });
        });
    }

    // Extract testimonials
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        const title = testimonialsSection.querySelector('.section-title');
        const subtitle = testimonialsSection.querySelector('.section-subtitle');
        if (title) content.testimonials.title = title.textContent.trim();
        if (subtitle) content.testimonials.subtitle = subtitle.textContent.trim();
        
        const testimonialCards = testimonialsSection.querySelectorAll('.testimonial-card');
        testimonialCards.forEach(card => {
            const quote = card.querySelector('.testimonial-quote');
            const author = card.querySelector('.testimonial-info h4');
            const titleEl = card.querySelector('.testimonial-info p');
            const avatar = card.querySelector('.testimonial-avatar');
            
            content.testimonials.items.push({
                quote: quote ? quote.textContent.trim() : '',
                author: author ? author.textContent.trim() : '',
                title: titleEl ? titleEl.textContent.trim() : '',
                avatar: avatar ? avatar.textContent.trim() : ''
            });
        });
    }

    // Extract news
    const newsSection = document.querySelector('.news-section');
    if (newsSection) {
        const title = newsSection.querySelector('.section-title');
        const subtitle = newsSection.querySelector('.section-subtitle');
        if (title) content.news.title = title.textContent.trim();
        if (subtitle) content.news.subtitle = subtitle.textContent.trim();
        
        const newsCards = newsSection.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            const image = card.querySelector('.news-image');
            const date = card.querySelector('.news-date');
            const category = card.querySelector('.news-category');
            const titleEl = card.querySelector('.news-content h3');
            const description = card.querySelector('.news-content p');
            const link = card.querySelector('.news-link');
            
            let imageUrl = '';
            if (image) {
                const bgImage = image.style.backgroundImage;
                if (bgImage) {
                    const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (match) imageUrl = match[1];
                }
            }
            
            content.news.items.push({
                image: imageUrl,
                date: date ? date.textContent.trim() : '',
                category: category ? category.textContent.trim() : '',
                title: titleEl ? titleEl.textContent.trim() : '',
                description: description ? description.textContent.trim() : '',
                link: link ? link.href : ''
            });
        });
    }

    // Extract stats
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statItems = statsSection.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            const number = item.querySelector('.stat-number');
            const label = item.querySelector('.stat-label');
            
            content.stats.items.push({
                number: number ? number.textContent.trim() : '',
                label: label ? label.textContent.trim() : ''
            });
        });
    }

    return content;
}

function extractAboutPageContent() {
    const content = {
        hero: {
            title: '',
            subtitle: '',
            image: ''
        },
        stats: {
            items: []
        },
        content: {
            storyBadge: '',
            storyHeading: '',
            story: '',
            image: ''
        },
        mission: {
            icon: '',
            title: '',
            text: ''
        },
        timeline: {
            title: '',
            subtitle: '',
            items: []
        },
        values: {
            title: '',
            items: []
        },
        leadership: {
            title: '',
            subtitle: '',
            initials: '',
            name: '',
            leaderTitle: '',
            tags: [],
            description: ''
        },
        csr: {
            title: '',
            subtitle: '',
            items: []
        },
        recognition: {
            title: '',
            subtitle: '',
            items: []
        }
    };

    // Extract hero
    const heroTitle = document.querySelector('.page-hero-content h1');
    const heroSubtitle = document.querySelector('.page-hero-content p');
    const heroSection = document.querySelector('.page-hero');
    
    if (heroTitle) content.hero.title = heroTitle.textContent.trim();
    if (heroSubtitle) content.hero.subtitle = heroSubtitle.textContent.trim();
    if (heroSection) {
        const bgImage = heroSection.style.backgroundImage;
        if (bgImage) {
            const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match) content.hero.image = match[1];
        }
    }

    // Extract stats banner
    const statsBanner = document.querySelector('.stats-banner');
    if (statsBanner) {
        const statItems = statsBanner.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            const number = item.querySelector('.stat-number');
            const label = item.querySelector('.stat-label');
            content.stats.items.push({
                number: number ? number.textContent.trim() : '',
                label: label ? label.textContent.trim() : ''
            });
        });
    }

    // Extract about content
    const aboutTextSection = document.querySelector('.about-text');
    if (aboutTextSection) {
        // Story badge
        const badge = aboutTextSection.querySelector('div[style*="background: var(--secondary-color)"]');
        if (badge) content.content.storyBadge = badge.textContent.trim();
        
        // Story heading
        const heading = aboutTextSection.querySelector('h2');
        if (heading) content.content.storyHeading = heading.textContent.trim();
        
        // Story paragraphs
        const paragraphs = Array.from(aboutTextSection.querySelectorAll('p'))
            .map(p => p.textContent.trim())
            .filter(p => p && !p.includes('Our Story') && !p.includes('Building the Future') && !p.includes('world-class'));
        content.content.story = paragraphs.join('\n\n');
    }
    
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) content.content.image = aboutImage.src;

    // Extract mission
    const missionSection = aboutTextSection?.querySelector('div[style*="gradient"]');
    if (missionSection) {
        const missionIcon = missionSection.querySelector('i');
        const missionTitle = missionSection.querySelector('h3');
        const missionText = missionSection.querySelector('p');
        
        if (missionIcon) content.mission.icon = missionIcon.className.replace('bi ', '');
        if (missionTitle) content.mission.title = missionTitle.textContent.trim();
        if (missionText) content.mission.text = missionText.textContent.trim();
    }

    // Extract timeline
    const timelineSection = document.querySelector('.section-header');
    if (timelineSection) {
        const timelineTitle = timelineSection.querySelector('.section-title');
        const timelineSubtitle = timelineSection.querySelector('.section-subtitle');
        if (timelineTitle) content.timeline.title = timelineTitle.textContent.trim();
        if (timelineSubtitle) content.timeline.subtitle = timelineSubtitle.textContent.trim();
    }
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const title = item.querySelector('.timeline-card h3');
        const description = item.querySelector('.timeline-card p');
        
        let year = '';
        if (title) {
            const yearMatch = title.textContent.match(/(\d{4})/);
            if (yearMatch) year = yearMatch[1];
        }
        
        content.timeline.items.push({
            year: year,
            title: title ? title.textContent.trim() : '',
            description: description ? description.textContent.trim() : ''
        });
    });

    // Extract values
    const valuesSection = document.querySelector('.values-section');
    if (valuesSection) {
        const valuesTitle = valuesSection.querySelector('.section-title');
        if (valuesTitle) content.values.title = valuesTitle.textContent.trim();
        
        const valueCards = valuesSection.querySelectorAll('.value-card');
        valueCards.forEach(card => {
            const icon = card.querySelector('.value-icon i');
            const title = card.querySelector('h3');
            const description = card.querySelector('p');
            
            content.values.items.push({
                icon: icon ? icon.className.replace('bi ', '') : '',
                title: title ? title.textContent.trim() : '',
                description: description ? description.textContent.trim() : ''
            });
        });
    }

    // Extract leadership
    const leadershipCard = document.querySelector('.leadership-card');
    if (leadershipCard) {
        const leadershipTitle = document.querySelector('.values-section:has(.leadership-card) .section-title');
        const leadershipSubtitle = document.querySelector('.values-section:has(.leadership-card) .section-subtitle');
        if (leadershipTitle) content.leadership.title = leadershipTitle.textContent.trim();
        if (leadershipSubtitle) content.leadership.subtitle = leadershipSubtitle.textContent.trim();
        
        const initialsDiv = leadershipCard.querySelector('div[style*="width: 150px"]');
        if (initialsDiv) content.leadership.initials = initialsDiv.textContent.trim();
        
        const name = leadershipCard.querySelector('h3');
        if (name) content.leadership.name = name.textContent.trim();
        
        const titleEl = leadershipCard.querySelector('p[style*="color: var(--secondary-color)"]');
        if (titleEl) content.leadership.leaderTitle = titleEl.textContent.trim();
        
        const tags = leadershipCard.querySelectorAll('span[style*="padding: 0.5rem"]');
        content.leadership.tags = Array.from(tags).map(tag => {
            const text = tag.textContent.trim();
            return text.replace(/^[^\s]+\s/, ''); // Remove icon text
        });
        
        const description = leadershipCard.querySelector('div[style*="background: var(--bg-secondary)"] p');
        if (description) content.leadership.description = description.textContent.trim();
    }

    // Extract CSR
    const csrSection = document.querySelector('div[style*="background: var(--gradient-2)"]:has(.csr-card)');
    if (csrSection) {
        const csrTitle = csrSection.querySelector('.section-title');
        const csrSubtitle = csrSection.querySelector('.section-subtitle');
        if (csrTitle) content.csr.title = csrTitle.textContent.trim();
        if (csrSubtitle) content.csr.subtitle = csrSubtitle.textContent.trim();
        
        const csrCards = csrSection.querySelectorAll('.csr-card');
        csrCards.forEach(card => {
            const icon = card.querySelector('i');
            const title = card.querySelector('h4');
            const description = card.querySelector('p');
            
            content.csr.items.push({
                icon: icon ? icon.className.replace('bi ', '') : '',
                title: title ? title.textContent.trim() : '',
                description: description ? description.textContent.trim() : ''
            });
        });
    }

    // Extract recognition
    const recognitionSection = document.querySelector('div:has(.recognition-card)');
    if (recognitionSection) {
        const recognitionTitle = recognitionSection.querySelector('.section-title');
        const recognitionSubtitle = recognitionSection.querySelector('.section-subtitle');
        if (recognitionTitle) content.recognition.title = recognitionTitle.textContent.trim();
        if (recognitionSubtitle) content.recognition.subtitle = recognitionSubtitle.textContent.trim();
        
        const recognitionCards = recognitionSection.querySelectorAll('.recognition-card');
        recognitionCards.forEach(card => {
            const icon = card.querySelector('i');
            const title = card.querySelector('h4');
            const description = card.querySelector('p');
            
            content.recognition.items.push({
                icon: icon ? icon.className.replace('bi ', '') : '',
                title: title ? title.textContent.trim() : '',
                description: description ? description.textContent.trim() : ''
            });
        });
    }

    return content;
}

function extractProjectsPageContent() {
    const content = {
        hero: {
            title: '',
            subtitle: '',
            image: ''
        },
        projects: {
            items: []
        }
    };

    // Extract hero
    const heroTitle = document.querySelector('.page-hero-content h1');
    const heroSubtitle = document.querySelector('.page-hero-content p');
    const heroSection = document.querySelector('.page-hero');
    
    if (heroTitle) content.hero.title = heroTitle.textContent.trim();
    if (heroSubtitle) content.hero.subtitle = heroSubtitle.textContent.trim();
    if (heroSection) {
        const bgImage = heroSection.style.backgroundImage;
        if (bgImage) {
            const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match) content.hero.image = match[1];
        }
    }

    // Extract projects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const name = card.querySelector('.project-details h2');
        const images = [];
        
        // Check if featured
        const featured = card.classList.contains('featured') || card.querySelector('.project-badge');
        
        // Get images from slideshow or single image
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
        
        // Extract meta items
        const metaItems = [];
        const metaElements = card.querySelectorAll('.project-meta .meta-item');
        metaElements.forEach(item => {
            const icon = item.querySelector('i');
            const text = item.textContent.trim();
            const iconClass = icon ? icon.className.replace('me-1 text-primary', '').trim() : '';
            metaItems.push({
                icon: iconClass,
                label: text.split(' ')[0] || '',
                value: text
            });
        });
        
        // Extract all description paragraphs (excluding sections and special boxes)
        const descriptions = [];
        const allParagraphs = card.querySelectorAll('.project-details p');
        allParagraphs.forEach(p => {
            // Skip paragraphs that are part of info boxes or progress
            if (p.closest('.project-info-box') || p.classList.contains('project-progress')) {
                return;
            }
            const text = p.textContent.trim();
            if (text && !text.startsWith('Learn More') && !text.includes('Visit aQuellé')) {
                descriptions.push(text);
            }
        });
        
        // Extract sections (headings with content)
        const sections = [];
        const sectionHeadings = card.querySelectorAll('.project-section-heading');
        sectionHeadings.forEach(heading => {
            const headingText = heading.textContent.trim();
            let content = '';
            let current = heading.nextElementSibling;
            
            // Collect content until next heading or end of project-details
            while (current && current.parentElement === heading.parentElement) {
                if (current.classList.contains('project-section-heading')) {
                    break; // Stop at next section
                }
                if (current.tagName === 'UL' && current.classList.contains('tenant-list')) {
                    const listItems = current.querySelectorAll('li');
                    content += Array.from(listItems).map(li => li.textContent.trim()).join('\n') + '\n';
                } else if (current.tagName === 'P') {
                    content += current.textContent.trim() + '\n';
                } else if (current.tagName === 'DIV' && current.classList.contains('project-features')) {
                    break; // Stop at features section
                }
                current = current.nextElementSibling;
            }
            
            if (content.trim()) {
                sections.push({
                    heading: headingText,
                    content: content.trim()
                });
            }
        });
        
        // Extract progress paragraph if it exists
        const progressParagraph = card.querySelector('.project-progress');
        if (progressParagraph) {
            sections.push({
                heading: 'Progress',
                content: progressParagraph.textContent.trim()
            });
        }
        
        // Extract tenants
        const tenants = [];
        const tenantList = card.querySelector('.tenant-list');
        if (tenantList) {
            const tenantItems = tenantList.querySelectorAll('li');
            tenantItems.forEach(li => {
                tenants.push(li.textContent.trim());
            });
        }
        
        // Extract features (strip icons from text)
        const features = [];
        const featureTags = card.querySelectorAll('.feature-tag');
        featureTags.forEach(tag => {
            // Get text content, which will exclude the icon
            const icon = tag.querySelector('i');
            let text = tag.textContent.trim();
            // Remove icon text if present
            if (icon) {
                text = text.replace(icon.textContent, '').trim();
            }
            if (text) {
                features.push(text);
            }
        });
        
        // Extract external link
        let link = '';
        const infoBox = card.querySelector('.project-info-box');
        if (infoBox) {
            const linkEl = infoBox.querySelector('a');
            if (linkEl) link = linkEl.href;
        }
        
        const projectData = {
            name: name ? name.textContent.trim() : '',
            title: name ? name.textContent.trim() : '',
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
        
        content.projects.items.push(projectData);
        console.log('Extracted project:', projectData.name, projectData);
    });

    console.log(`Extracted ${content.projects.items.length} projects total`);
    return content;
}

function extractContactPageContent() {
    const content = {
        hero: {
            title: '',
            subtitle: '',
            image: ''
        },
        info: {
            email: '',
            phone: '',
            address: '',
            officeHours: ''
        }
    };

    // Extract hero
    const heroTitle = document.querySelector('.page-hero-content h1');
    const heroSubtitle = document.querySelector('.page-hero-content p');
    const heroSection = document.querySelector('.page-hero');
    
    if (heroTitle) content.hero.title = heroTitle.textContent.trim();
    if (heroSubtitle) content.hero.subtitle = heroSubtitle.textContent.trim();
    if (heroSection) {
        const bgImage = heroSection.style.backgroundImage;
        if (bgImage) {
            const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match) content.hero.image = match[1];
        }
    }

    // Extract contact info
    const emailLink = document.querySelector('a[href^="mailto:"]');
    const phoneLink = document.querySelector('a[href^="tel:"]');
    
    if (emailLink) {
        content.info.email = emailLink.href.replace('mailto:', '');
    }
    if (phoneLink) {
        content.info.phone = phoneLink.textContent.trim();
    }

    // Extract address and office hours from contact info section
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        const icon = item.querySelector('.info-icon i');
        const contentEl = item.querySelector('.info-content');
        
        if (icon && contentEl) {
            const iconClass = icon.className;
            if (iconClass.includes('geo')) {
                content.info.address = contentEl.querySelector('p')?.textContent.trim() || '';
            } else if (iconClass.includes('building') || iconClass.includes('briefcase')) {
                const hours = contentEl.querySelector('p')?.textContent.trim() || '';
                if (hours.includes('Monday') || hours.includes('Hours')) {
                    content.info.officeHours = hours;
                }
            }
        }
    });

    return content;
}

// Export functions
if (typeof window !== 'undefined') {
    window.contentExtractor = {
        extractHomePageContent,
        extractAboutPageContent,
        extractProjectsPageContent,
        extractContactPageContent
    };
}

