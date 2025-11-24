// Migration Script - Extract content from HTML and save to Firebase
(function() {
    'use strict';
    
    // Check authentication first
    checkAdminAuth().then((user) => {
        console.log('Authenticated as:', user.email);
        setupMigration();
    }).catch(() => {
        window.location.href = 'login.html';
    });
    
    function setupMigration() {
        const startBtn = document.getElementById('startMigration');
        startBtn.addEventListener('click', startMigration);
    }
    
    async function startMigration() {
        const startBtn = document.getElementById('startMigration');
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Migrating...';
        
        const statusDiv = document.getElementById('migration-status');
        const resultsDiv = document.getElementById('migration-results');
        resultsDiv.innerHTML = '';
        
        try {
            // Migrate Index Page
            await migratePage('index', 'index.html', statusDiv, resultsDiv);
            
            // Migrate About Page
            await migratePage('about', 'about.html', statusDiv, resultsDiv);
            
            // Migrate Projects Page
            await migratePage('projects', 'projects.html', statusDiv, resultsDiv);
            
            // Migrate Contact Page
            await migratePage('contact', 'contact.html', statusDiv, resultsDiv);
            
            startBtn.innerHTML = '<i class="bi bi-check-circle"></i> Migration Complete!';
            startBtn.classList.remove('admin-btn-primary');
            startBtn.classList.add('admin-btn-success');
            
            showAlert('Migration completed successfully! All content has been saved to Firebase.', 'success', resultsDiv);
            
        } catch (error) {
            console.error('Migration error:', error);
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="bi bi-play-circle"></i> Start Migration';
            showAlert('Migration failed: ' + error.message, 'error', resultsDiv);
        }
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
    
    async function migratePage(pageId, htmlFile, statusDiv, resultsDiv) {
        updateStatus(statusDiv, `Migrating ${pageId} page...`, 'loading');
        
        try {
            const response = await fetch(`../${htmlFile}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            let pageData = {};
            
            if (pageId === 'index') {
                pageData = extractIndexPageData(doc);
            } else if (pageId === 'about') {
                pageData = extractAboutPageData(doc);
            } else if (pageId === 'projects') {
                pageData = extractProjectsPageData(doc);
            } else if (pageId === 'contact') {
                pageData = extractContactPageData(doc);
            }
            
            // Remove undefined values (Firestore doesn't allow them)
            const cleanedData = removeUndefinedValues(pageData);
            
            // Debug logging for about page
            if (pageId === 'about') {
                console.log('About page data before cleaning:', {
                    mission: pageData.mission,
                    csr: pageData.csr,
                    recognition: pageData.recognition
                });
            }
            
            // Save to Firestore
            await db.collection('pages').doc(pageId).set(cleanedData, { merge: true });
            
            updateStatus(statusDiv, `${pageId} page migrated successfully`, 'success');
            addResult(resultsDiv, `${pageId}`, 'success', 'Content extracted and saved to Firebase');
            
        } catch (error) {
            updateStatus(statusDiv, `Error migrating ${pageId}: ${error.message}`, 'error');
            addResult(resultsDiv, `${pageId}`, 'error', error.message);
            throw error;
        }
    }
    
    function extractIndexPageData(doc) {
        const data = {};
        
        // Hero Section
        const heroTitle = doc.querySelector('.hero-title')?.textContent?.trim() || '';
        const heroSubtitle = doc.querySelector('.hero-subtitle')?.textContent?.trim() || '';
        const btn1 = doc.querySelector('.hero-buttons .btn-primary span')?.textContent?.trim() || '';
        const btn1Link = doc.querySelector('.hero-buttons .btn-primary')?.getAttribute('href') || '';
        const btn2 = doc.querySelector('.hero-buttons .btn-secondary span')?.textContent?.trim() || '';
        const btn2Link = doc.querySelector('.hero-buttons .btn-secondary')?.getAttribute('href') || '';
        
        // Get hero background images from style attribute
        const heroSection = doc.querySelector('.hero');
        const heroImages = [];
        if (heroSection) {
            const bgImage = heroSection.getAttribute('style') || '';
            const matches = bgImage.match(/url\(['"]?([^'")]+)['"]?\)/g);
            if (matches) {
                matches.forEach(match => {
                    const url = match.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');
                    if (url && !heroImages.includes(url)) {
                        heroImages.push(url);
                    }
                });
            }
        }
        
        data.hero = {
            title: heroTitle,
            subtitle: heroSubtitle,
            button1: { text: btn1, link: btn1Link },
            button2: { text: btn2, link: btn2Link },
            images: heroImages
        };
        
        // Video Section - find the section with video element
        const videoSection = Array.from(doc.querySelectorAll('section')).find(section => 
            section.querySelector('video')
        );
        let videoTitle = '';
        let videoSubtitle = '';
        if (videoSection) {
            const sectionHeader = videoSection.querySelector('.section-header');
            if (sectionHeader) {
                videoTitle = sectionHeader.querySelector('.section-title')?.textContent?.trim() || '';
                videoSubtitle = sectionHeader.querySelector('.section-subtitle')?.textContent?.trim() || '';
            }
        }
        const videoElement = doc.querySelector('video source');
        const videoUrl = videoElement?.getAttribute('src') || '';
        const videoPoster = doc.querySelector('video')?.getAttribute('poster') || '';
        
        data.video = {
            title: videoTitle,
            subtitle: videoSubtitle,
            url: videoUrl,
            poster: videoPoster
        };
        
        // Features Section
        const featuresTitle = doc.querySelector('.features .section-title')?.textContent?.trim() || '';
        const featuresSubtitle = doc.querySelector('.features .section-subtitle')?.textContent?.trim() || '';
        const featureCards = doc.querySelectorAll('.features-grid .feature-card');
        const features = [];
        
        featureCards.forEach(card => {
            const icon = card.querySelector('.feature-icon i')?.className || '';
            const iconClass = icon.replace('bi ', '').trim();
            const title = card.querySelector('h3')?.textContent?.trim() || '';
            const description = card.querySelector('p')?.textContent?.trim() || '';
            features.push({
                icon: iconClass,
                title: title,
                description: description
            });
        });
        
        data.features = {
            title: featuresTitle,
            subtitle: featuresSubtitle,
            items: features
        };
        
        // Showcase Section
        const showcaseTitle = doc.querySelector('.showcase .section-title')?.textContent?.trim() || '';
        const showcaseSubtitle = doc.querySelector('.showcase .section-subtitle')?.textContent?.trim() || '';
        const showcaseItems = doc.querySelectorAll('.showcase-item');
        const showcase = [];
        
        showcaseItems.forEach(item => {
            const title = item.querySelector('.showcase-overlay h3')?.textContent?.trim() || '';
            const description = item.querySelector('.showcase-overlay p')?.textContent?.trim() || '';
            const link = item.querySelector('.showcase-overlay a')?.getAttribute('href') || '';
            const imageStyle = item.querySelector('.showcase-image')?.getAttribute('style') || '';
            // Extract all images (some showcase items have multiple)
            const imageMatches = imageStyle.match(/url\(['"]?([^'")]+)['"]?\)/g) || [];
            const images = imageMatches.map(match => match.replace(/url\(['"]?/, '').replace(/['"]?\)/, ''));
            
            showcase.push({
                title: title,
                description: description,
                link: link,
                images: images.length > 0 ? images : []
            });
        });
        
        data.showcase = {
            title: showcaseTitle,
            subtitle: showcaseSubtitle,
            items: showcase
        };
        
        // Testimonials
        const testimonialsTitle = doc.querySelector('.testimonials .section-title')?.textContent?.trim() || '';
        const testimonialsSubtitle = doc.querySelector('.testimonials .section-subtitle')?.textContent?.trim() || '';
        const testimonialCards = doc.querySelectorAll('.testimonials-grid .testimonial-card');
        const testimonials = [];
        
        testimonialCards.forEach(card => {
            const rating = (card.querySelector('.testimonial-rating')?.textContent?.match(/★/g) || []).length;
            const quote = card.querySelector('.testimonial-quote')?.textContent?.trim() || '';
            const authorName = card.querySelector('.testimonial-info h4')?.textContent?.trim() || '';
            const authorTitle = card.querySelector('.testimonial-info p')?.textContent?.trim() || '';
            const avatar = card.querySelector('.testimonial-avatar')?.textContent?.trim() || '';
            
            testimonials.push({
                rating: rating || 5,
                quote: quote,
                authorName: authorName,
                authorTitle: authorTitle,
                avatar: avatar
            });
        });
        
        data.testimonials = {
            title: testimonialsTitle,
            subtitle: testimonialsSubtitle,
            items: testimonials
        };
        
        // News Section
        const newsTitle = doc.querySelector('.news-section .section-title')?.textContent?.trim() || '';
        const newsSubtitle = doc.querySelector('.news-section .section-subtitle')?.textContent?.trim() || '';
        const newsCards = doc.querySelectorAll('.news-grid .news-card');
        const news = [];
        
        newsCards.forEach(card => {
            const category = card.querySelector('.news-category')?.textContent?.trim() || '';
            const title = card.querySelector('.news-content h3')?.textContent?.trim() || '';
            const description = card.querySelector('.news-content p')?.textContent?.trim() || '';
            const date = card.querySelector('.news-date')?.textContent?.trim() || '';
            const link = card.querySelector('.news-link')?.getAttribute('href') || '';
            const imageStyle = card.querySelector('.news-image')?.getAttribute('style') || '';
            // Extract all images (some news items have multiple)
            const imageMatches = imageStyle.match(/url\(['"]?([^'")]+)['"]?\)/g) || [];
            const images = imageMatches.map(match => match.replace(/url\(['"]?/, '').replace(/['"]?\)/, ''));
            
            news.push({
                category: category,
                title: title,
                description: description,
                date: date,
                link: link,
                images: images.length > 0 ? images : (imageStyle ? [imageStyle] : [])
            });
        });
        
        data.news = {
            title: newsTitle,
            subtitle: newsSubtitle,
            items: news
        };
        
        // Stats
        const statItems = doc.querySelectorAll('.stats-grid .stat-item');
        const stats = [];
        
        statItems.forEach(item => {
            const number = item.querySelector('.stat-number')?.getAttribute('data-target') || 
                          item.querySelector('.stat-number')?.textContent?.trim() || '';
            const label = item.querySelector('.stat-label')?.textContent?.trim() || '';
            stats.push({
                number: number,
                label: label
            });
        });
        
        data.stats = {
            items: stats
        };
        
        // Footer
        const footer = doc.querySelector('.footer');
        if (footer) {
            const companyName = footer.querySelector('h3')?.textContent?.trim() || '';
            const description = footer.querySelector('.footer-section p')?.textContent?.trim() || '';
            const locationP = footer.querySelectorAll('.footer-section p');
            let location = '';
            let country = '';
            if (locationP.length > 1) {
                location = locationP[1]?.textContent?.trim() || '';
                country = locationP[2]?.textContent?.trim() || '';
            }
            const email = footer.querySelector('a[href^="mailto:"]')?.textContent?.trim() || '';
            const phone = footer.querySelector('a[href^="tel:"]')?.textContent?.trim() || '';
            const copyright = footer.querySelector('.footer-bottom p')?.textContent?.trim() || '';
            
            data.footer = {
                companyName: companyName,
                description: description,
                location: location,
                country: country,
                email: email,
                phone: phone,
                copyright: copyright
            };
        }
        
        return data;
    }
    
    function extractAboutPageData(doc) {
        const data = {};
        
        // Page Hero
        const pageHero = doc.querySelector('.page-hero');
        const heroTitle = pageHero?.querySelector('h1')?.textContent?.trim() || '';
        const heroSubtitle = pageHero?.querySelector('p')?.textContent?.trim() || '';
        const heroImageStyle = pageHero?.getAttribute('style') || '';
        const heroImageMatch = heroImageStyle.match(/url\(['"]?([^'")]+)['"]?\)/);
        const heroImage = heroImageMatch ? heroImageMatch[1] : '';
        
        data.pageHero = {
            title: heroTitle || '',
            subtitle: heroSubtitle || '',
            image: heroImage || ''
        };
        
        // Stats Banner
        const statsBanner = doc.querySelector('.stats-banner');
        const statsBannerItems = [];
        if (statsBanner) {
            const statItems = statsBanner.querySelectorAll('.stat-item');
            statItems.forEach(item => {
                const value = item.querySelector('.stat-number')?.textContent?.trim() || '';
                const label = item.querySelector('.stat-label')?.textContent?.trim() || '';
                if (value || label) {
                    statsBannerItems.push({ 
                        value: value || '', 
                        label: label || '' 
                    });
                }
            });
        }
        data.statsBanner = { items: statsBannerItems || [] };
        
        // Mission - find by h3 text content
        const missionH3 = Array.from(doc.querySelectorAll('h3')).find(h3 => 
            h3.textContent?.trim().includes('Our Mission') ||
            h3.textContent?.trim() === 'Our Mission'
        );
        const missionBox = missionH3?.closest('div[style*="margin-top: 2rem"]');
        const missionText = missionBox?.querySelector('p[style*="font-style: italic"]')?.textContent?.trim() || 
                           missionBox?.querySelector('p')?.textContent?.trim() || '';
        
        console.log('Mission extraction:', {
            foundH3: !!missionH3,
            foundBox: !!missionBox,
            text: missionText
        });
        
        data.mission = {
            text: missionText || ''
        };
        
        // About Story
        const aboutText = doc.querySelector('.about-text');
        const storyTitle = aboutText?.querySelector('h2')?.textContent?.trim() || '';
        const storyParagraphs = Array.from(aboutText?.querySelectorAll('p') || [])
            .map(p => {
                const text = p.textContent?.trim() || '';
                const strong = p.querySelector('strong')?.textContent?.trim() || '';
                return { text, strong: strong || null };
            })
            .filter(p => p.text);
        const storyImage = doc.querySelector('.about-image img')?.getAttribute('src') || '';
        
        data.aboutStory = {
            title: storyTitle || '',
            paragraphs: storyParagraphs || [],
            image: storyImage || ''
        };
        
        // Timeline - find the timeline section specifically
        const timelineSection = Array.from(doc.querySelectorAll('.section-header')).find(header => {
            const title = header.querySelector('.section-title')?.textContent?.trim() || '';
            return title.includes('Journey') || title.includes('Timeline');
        })?.closest('div') || doc;
        
        const timelineTitle = timelineSection.querySelector('.section-title')?.textContent?.trim() || '';
        const timelineSubtitle = timelineSection.querySelector('.section-subtitle')?.textContent?.trim() || '';
        const timelineItems = [];
        const timelineItemElements = doc.querySelectorAll('.timeline-item');
        timelineItemElements.forEach((item, index) => {
            const title = item.querySelector('.timeline-card h3')?.textContent?.trim() || '';
            const description = item.querySelector('.timeline-card p')?.textContent?.trim() || '';
            if (title || description) {
                timelineItems.push({
                    number: index + 1,
                    title: title || '',
                    description: description || ''
                });
            }
        });
        data.timeline = {
            title: timelineTitle || '',
            subtitle: timelineSubtitle || '',
            items: timelineItems || []
        };
        
        // Values
        const valuesSection = doc.querySelector('.values-section');
        const valuesTitle = valuesSection?.querySelector('.section-title')?.textContent?.trim() || '';
        const valueCards = doc.querySelectorAll('.values-grid .value-card');
        const values = [];
        valueCards.forEach(card => {
            const icon = card.querySelector('.value-icon i')?.className?.replace('bi ', '') || '';
            const title = card.querySelector('h3')?.textContent?.trim() || '';
            const description = card.querySelector('p')?.textContent?.trim() || '';
            if (title || description) {
                values.push({ 
                    icon: icon || '', 
                    title: title || '', 
                    description: description || '' 
                });
            }
        });
        data.values = {
            title: valuesTitle || '',
            items: values || []
        };
        
        // Leadership
        const leadershipSection = doc.querySelector('.values-section[style*="margin-top: 100px"]');
        const leadershipTitle = leadershipSection?.querySelector('.section-title')?.textContent?.trim() || '';
        const leadershipSubtitle = leadershipSection?.querySelector('.section-subtitle')?.textContent?.trim() || '';
        const leadershipCard = doc.querySelector('.leadership-card');
        const leadershipName = leadershipCard?.querySelector('h3')?.textContent?.trim() || '';
        const leadershipTitleRole = leadershipCard?.querySelector('p[style*="color: var(--secondary-color)"]')?.textContent?.trim() || '';
        const leadershipBio = leadershipCard?.querySelector('p[style*="line-height: 1.9"]')?.textContent?.trim() || '';
        const leadershipInitials = leadershipCard?.querySelector('div[style*="width: 150px"]')?.textContent?.trim() || '';
        const leadershipTags = Array.from(leadershipCard?.querySelectorAll('span[style*="padding: 0.5rem"]') || [])
            .map(span => span.textContent?.trim())
            .filter(tag => tag);
        
        data.leadership = {
            title: leadershipTitle || '',
            subtitle: leadershipSubtitle || '',
            name: leadershipName || '',
            titleRole: leadershipTitleRole || '',
            bio: leadershipBio || '',
            initials: leadershipInitials || '',
            tags: leadershipTags || []
        };
        
        // CSR Section - find by section title text content
        const csrTitleEl = Array.from(doc.querySelectorAll('.section-title')).find(title => 
            title.textContent?.trim() === 'Corporate Social Responsibility' ||
            title.textContent?.trim().includes('Corporate Social Responsibility')
        );
        let csrSection = null;
        if (csrTitleEl) {
            // Walk up the DOM tree to find the container div
            let parent = csrTitleEl.parentElement;
            while (parent && parent !== doc.body) {
                const style = parent.getAttribute('style') || '';
                if (style.includes('margin-top: 100px') && style.includes('padding: 80px')) {
                    csrSection = parent;
                    break;
                }
                parent = parent.parentElement;
            }
        }
        const csrTitle = csrTitleEl?.textContent?.trim() || '';
        const csrSubtitle = csrSection?.querySelector('.section-subtitle')?.textContent?.trim() || '';
        const csrCards = csrSection ? csrSection.querySelectorAll('.csr-card') : [];
        const csrItems = [];
        csrCards.forEach(card => {
            const iconEl = card.querySelector('i');
            const icon = iconEl ? iconEl.className.replace('bi ', '').trim() : '';
            const title = card.querySelector('h4')?.textContent?.trim() || '';
            const description = card.querySelector('p')?.textContent?.trim() || '';
            if (title || description) {
                csrItems.push({ 
                    icon: icon || '', 
                    title: title || '', 
                    description: description || '' 
                });
            }
        });
        
        console.log('CSR extraction:', {
            foundTitle: !!csrTitleEl,
            foundSection: !!csrSection,
            title: csrTitle,
            subtitle: csrSubtitle,
            itemsCount: csrItems.length
        });
        
        data.csr = {
            title: csrTitle || '',
            subtitle: csrSubtitle || '',
            items: csrItems || []
        };
        
        // Recognition Section - find by section title text content
        const recognitionTitleEl = Array.from(doc.querySelectorAll('.section-title')).find(title => 
            title.textContent?.trim() === 'Recognition & Partnerships' ||
            title.textContent?.trim().includes('Recognition & Partnerships') ||
            (title.textContent?.trim().includes('Recognition') && !title.textContent?.trim().includes('Corporate'))
        );
        let recognitionSection = null;
        if (recognitionTitleEl) {
            // Walk up the DOM tree to find the container div
            let parent = recognitionTitleEl.parentElement;
            while (parent && parent !== doc.body) {
                const style = parent.getAttribute('style') || '';
                if (style.includes('margin-top: 100px') && style.includes('padding: 80px')) {
                    recognitionSection = parent;
                    break;
                }
                parent = parent.parentElement;
            }
        }
        const recognitionTitle = recognitionTitleEl?.textContent?.trim() || '';
        const recognitionSubtitle = recognitionSection?.querySelector('.section-subtitle')?.textContent?.trim() || '';
        const recognitionCards = recognitionSection ? recognitionSection.querySelectorAll('.recognition-card') : [];
        const recognitionItems = [];
        recognitionCards.forEach(card => {
            const iconEl = card.querySelector('i');
            const icon = iconEl ? iconEl.className.replace('bi ', '').trim() : '';
            const title = card.querySelector('h4')?.textContent?.trim() || '';
            const description = card.querySelector('p')?.textContent?.trim() || '';
            if (title || description) {
                recognitionItems.push({ 
                    icon: icon || '', 
                    title: title || '', 
                    description: description || '' 
                });
            }
        });
        
        console.log('Recognition extraction:', {
            foundTitle: !!recognitionTitleEl,
            foundSection: !!recognitionSection,
            title: recognitionTitle,
            subtitle: recognitionSubtitle,
            itemsCount: recognitionItems.length
        });
        
        data.recognition = {
            title: recognitionTitle || '',
            subtitle: recognitionSubtitle || '',
            items: recognitionItems || []
        };
        
        // Footer
        extractFooterData(doc, data);
        
        return data;
    }
    
    function extractProjectsPageData(doc) {
        const data = {};
        
        // Page Hero
        const pageHero = doc.querySelector('.page-hero');
        const heroTitle = pageHero?.querySelector('h1')?.textContent?.trim() || '';
        const heroSubtitle = pageHero?.querySelector('p')?.textContent?.trim() || '';
        const heroImageStyle = pageHero?.getAttribute('style') || '';
        const heroImageMatch = heroImageStyle.match(/url\(['"]?([^'")]+)['"]?\)/);
        const heroImage = heroImageMatch ? heroImageMatch[1] : '';
        
        data.pageHero = {
            title: heroTitle,
            subtitle: heroSubtitle,
            image: heroImage
        };
        
        // CTA Section
        const ctaSection = doc.querySelector('.cta-section');
        const ctaTitle = ctaSection?.querySelector('h2')?.textContent?.trim() || '';
        const ctaDescription = ctaSection?.querySelector('p')?.textContent?.trim() || '';
        const ctaButtonText = ctaSection?.querySelector('.btn span')?.textContent?.trim() || '';
        const ctaButtonLink = ctaSection?.querySelector('.btn')?.getAttribute('href') || '';
        
        data.cta = {
            title: ctaTitle,
            description: ctaDescription,
            buttonText: ctaButtonText,
            buttonLink: ctaButtonLink
        };
        
        // Projects - Extract all project cards
        const projectCards = doc.querySelectorAll('.project-card');
        const projects = [];
        
        projectCards.forEach(card => {
            const project = {};
            
            // Title
            project.name = card.querySelector('.project-details h2')?.textContent?.trim() || '';
            
            // Featured badge
            project.featured = card.classList.contains('featured');
            
            // Images - check for slideshow or single image
            const slideshow = card.querySelector('.project-slideshow');
            if (slideshow) {
                const slides = slideshow.querySelectorAll('.project-slide');
                project.images = Array.from(slides).map(slide => {
                    const style = slide.getAttribute('style') || '';
                    const match = style.match(/url\(['"]?([^'")]+)['"]?\)/);
                    return match ? match[1] : '';
                }).filter(img => img);
            } else {
                const imageDiv = card.querySelector('.project-image');
                const imageStyle = imageDiv?.getAttribute('style') || '';
                const imageMatch = imageStyle.match(/url\(['"]?([^'")]+)['"]?\)/);
                project.images = imageMatch ? [imageMatch[1]] : [];
            }
            
            // Meta items
            const metaItems = card.querySelectorAll('.meta-item');
            project.meta = Array.from(metaItems).map(item => item.textContent?.trim()).filter(m => m);
            
            // Description paragraphs
            const paragraphs = card.querySelectorAll('.project-details > p');
            project.description = Array.from(paragraphs).map(p => p.textContent?.trim()).filter(p => p);
            
            // Section headings and content
            const sectionHeadings = card.querySelectorAll('.project-section-heading');
            project.sections = [];
            sectionHeadings.forEach(heading => {
                const title = heading.textContent?.trim() || '';
                const nextElement = heading.nextElementSibling;
                let content = '';
                if (nextElement) {
                    if (nextElement.tagName === 'UL') {
                        // Tenant list
                        const listItems = Array.from(nextElement.querySelectorAll('li'))
                            .map(li => li.textContent?.trim())
                            .filter(li => li);
                        content = listItems;
                    } else if (nextElement.tagName === 'P') {
                        content = nextElement.textContent?.trim();
                    }
                }
                project.sections.push({ title, content });
            });
            
            // Feature tags
            const featureTags = card.querySelectorAll('.feature-tag');
            project.features = Array.from(featureTags).map(tag => tag.textContent?.trim()).filter(t => t);
            
            // Info box
            const infoBox = card.querySelector('.project-info-box');
            if (infoBox) {
                project.infoBox = {
                    text: infoBox.querySelector('p')?.textContent?.trim() || '',
                    buttonText: infoBox.querySelector('.btn')?.textContent?.trim() || '',
                    buttonLink: infoBox.querySelector('.btn')?.getAttribute('href') || ''
                };
            }
            
            // Progress text
            const progressText = card.querySelector('.project-progress');
            if (progressText) {
                project.progress = progressText.textContent?.trim();
            }
            
            projects.push(project);
        });
        
        data.projects = projects;
        
        // Footer
        extractFooterData(doc, data);
        
        return data;
    }
    
    function extractContactPageData(doc) {
        const data = {};
        
        // Page Hero
        const pageHero = doc.querySelector('.page-hero');
        const heroTitle = pageHero?.querySelector('h1')?.textContent?.trim() || '';
        const heroSubtitle = pageHero?.querySelector('p')?.textContent?.trim() || '';
        const heroImageStyle = pageHero?.getAttribute('style') || '';
        const heroImageMatch = heroImageStyle.match(/url\(['"]?([^'")]+)['"]?\)/);
        const heroImage = heroImageMatch ? heroImageMatch[1] : '';
        
        data.pageHero = {
            title: heroTitle,
            subtitle: heroSubtitle,
            image: heroImage
        };
        
        // Contact Form Section
        const formTitle = doc.querySelector('.contact-form-container h2')?.textContent?.trim() || '';
        data.contactForm = {
            title: formTitle
        };
        
        // Contact Info
        const contactInfo = doc.querySelector('.contact-info');
        const infoTitle = contactInfo?.querySelector('h2')?.textContent?.trim() || '';
        const infoItems = contactInfo?.querySelectorAll('.info-item');
        const contactInfoData = {
            title: infoTitle,
            items: []
        };
        
        infoItems.forEach(item => {
            const icon = item.querySelector('.info-icon i')?.className?.replace('bi ', '') || '';
            const itemTitle = item.querySelector('.info-content h3')?.textContent?.trim() || '';
            const itemContent = item.querySelector('.info-content p')?.innerHTML?.trim() || '';
            contactInfoData.items.push({
                icon: icon,
                title: itemTitle,
                content: itemContent
            });
        });
        
        data.contactInfo = contactInfoData;
        
        // Footer
        extractFooterData(doc, data);
        
        return data;
    }
    
    function extractFooterData(doc, data) {
        const footer = doc.querySelector('.footer');
        if (footer) {
            const companyName = footer.querySelector('h3')?.textContent?.trim() || '';
            const description = footer.querySelector('.footer-section p')?.textContent?.trim() || '';
            const locationP = footer.querySelectorAll('.footer-section p');
            let location = '';
            let country = '';
            if (locationP.length > 1) {
                location = locationP[1]?.textContent?.trim() || '';
                country = locationP[2]?.textContent?.trim() || '';
            }
            const email = footer.querySelector('a[href^="mailto:"]')?.textContent?.trim() || '';
            const phone = footer.querySelector('a[href^="tel:"]')?.textContent?.trim() || '';
            const copyright = footer.querySelector('.footer-bottom p')?.textContent?.trim() || '';
            
            data.footer = {
                companyName: companyName,
                description: description,
                location: location,
                country: country,
                email: email,
                phone: phone,
                copyright: copyright
            };
        }
    }
    
    function updateStatus(container, message, status) {
        const statusClass = `status-${status}`;
        container.innerHTML = `
            <div class="migration-step">
                <span class="status-indicator ${statusClass}"></span>
                <span>${message}</span>
            </div>
        `;
    }
    
    function addResult(container, page, status, message) {
        const result = document.createElement('div');
        result.className = 'migration-step';
        result.innerHTML = `
            <h3>${page.charAt(0).toUpperCase() + page.slice(1)} Page</h3>
            <p><span class="status-indicator status-${status}"></span>${message}</p>
        `;
        container.appendChild(result);
    }
    
    function showAlert(message, type, container) {
        const alert = document.createElement('div');
        alert.className = `admin-alert admin-alert-${type}`;
        alert.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        container.insertBefore(alert, container.firstChild);
    }
})();

