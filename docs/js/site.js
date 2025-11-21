// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.feature-card, .showcase-item, .value-card, .project-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Scroll reveal for all reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100); // Stagger animation
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Parallax effect removed to prevent overlap issues

    // Add floating particles to hero (optional enhancement)
    function createParticles() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        heroSection.appendChild(particlesContainer);

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // Enhanced button ripple effect
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading animation to contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<span class="loading"></span> Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                const formMessage = document.getElementById('formMessage');
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'form-message success';
                this.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 5000);
            }, 1500);
        });
    }

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const isDecimal = target % 1 !== 0;
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = isDecimal ? target.toFixed(1) : (target >= 1000 ? target.toLocaleString() : target);
                clearInterval(timer);
            } else {
                if (isDecimal) {
                    element.textContent = start.toFixed(1);
                } else {
                    element.textContent = start >= 1000 ? Math.floor(start).toLocaleString() : Math.floor(start);
                }
            }
        }, 16);
    }

    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseFloat(stat.getAttribute('data-target'));
                    if (target) {
                        animateCounter(stat, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Dark Mode Toggle - Fun & Interactive!
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme on page load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            // Always save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Add a fun bounce animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Optional: Add icon effect on toggle (for extra fun!)
            if (isDark) {
                createToggleEffect(this, 'bi-moon');
            } else {
                createToggleEffect(this, 'bi-sun');
            }
        });
    }
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
    
    // Fun toggle effect function
    function createToggleEffect(element, iconClass) {
        const effect = document.createElement('div');
        const icon = document.createElement('i');
        icon.className = 'bi ' + iconClass;
        effect.appendChild(icon);
        effect.style.position = 'fixed';
        effect.style.fontSize = '2rem';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '9999';
        effect.style.transition = 'all 0.6s ease-out';
        effect.style.color = 'var(--secondary-color)';
        
        const rect = element.getBoundingClientRect();
        effect.style.left = rect.left + rect.width / 2 + 'px';
        effect.style.top = rect.top + rect.height / 2 + 'px';
        effect.style.transform = 'translate(-50%, -50%) scale(0)';
        effect.style.opacity = '1';
        
        document.body.appendChild(effect);
        
        // Animate
        requestAnimationFrame(() => {
            effect.style.transform = 'translate(-50%, -50%) scale(1.5) translateY(-50px)';
            effect.style.opacity = '0';
        });
        
        // Remove after animation
        setTimeout(() => {
            effect.remove();
        }, 600);
    }

    // Load and apply admin content changes
    (function() {
        'use strict';
        
        const ADMIN_CONTENT_KEY = 'rokwil_admin_content';
        const CURRENT_CONTENT_KEY = 'rokwil_current_content';
        
        // Extract and store current page content (for "Load Current" feature only)
        // IMPORTANT: This NEVER overwrites admin content - it only stores to CURRENT_CONTENT_KEY
        function extractAndStoreCurrentContent() {
            // Check if admin content exists - if it does, extract from the CURRENT state (after admin changes applied)
            // This way "Load Current" will load the admin-modified version, not the original
            const adminContent = localStorage.getItem(ADMIN_CONTENT_KEY);
            if (!adminContent) {
                // No admin content, extract original page content
                if (typeof window.contentExtractor === 'undefined') return;
                
                let currentContent = {};
                const path = window.location.pathname;
                
                if (path.includes('index.html') || path.endsWith('/')) {
                    currentContent.homePage = window.contentExtractor.extractHomePageContent();
                } else if (path.includes('about.html')) {
                    currentContent.aboutPage = window.contentExtractor.extractAboutPageContent();
                } else if (path.includes('projects.html')) {
                    // Store projects content in the format the admin expects
                    const extracted = window.contentExtractor.extractProjectsPageContent();
                    currentContent.projectsPage = {
                        hero: extracted.hero || {},
                        projects: extracted.projects || { items: [] }
                    };
                } else if (path.includes('contact.html')) {
                    currentContent.contactPage = window.contentExtractor.extractContactPageContent();
                }
                
                // Store to CURRENT_CONTENT_KEY (different from ADMIN_CONTENT_KEY)
                if (Object.keys(currentContent).length > 0) {
                    localStorage.setItem(CURRENT_CONTENT_KEY, JSON.stringify(currentContent));
                }
            } else {
                // Admin content exists - extract the CURRENT displayed content (which includes admin changes)
                // This allows "Load Current" to capture admin-modified content
                setTimeout(() => {
                    if (typeof window.contentExtractor === 'undefined') return;
                    
                    let currentContent = {};
                    const path = window.location.pathname;
                    
                    if (path.includes('index.html') || path.endsWith('/')) {
                        currentContent.homePage = window.contentExtractor.extractHomePageContent();
                    } else if (path.includes('about.html')) {
                        currentContent.aboutPage = window.contentExtractor.extractAboutPageContent();
                    } else if (path.includes('projects.html')) {
                        currentContent.projectsPage = window.contentExtractor.extractProjectsPageContent();
                    } else if (path.includes('contact.html')) {
                        currentContent.contactPage = window.contentExtractor.extractContactPageContent();
                    }
                    
                    if (Object.keys(currentContent).length > 0) {
                        localStorage.setItem(CURRENT_CONTENT_KEY, JSON.stringify(currentContent));
                    }
                }, 3000); // Wait for admin content to be applied first
            }
        }
        
        // Extract content after page loads (for "Load Current" feature)
        // This runs after admin content is applied, and stores to a different key
        setTimeout(() => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', extractAndStoreCurrentContent);
            } else {
                extractAndStoreCurrentContent();
            }
        }, 2500); // Delay extraction so admin content applies first
        
        // Apply admin content changes using the admin.js functions
        function applyAdminContent() {
            // Wait for admin.js to load
            if (typeof window.adminJS === 'undefined' || !window.adminJS.applyContentChanges) {
                // Fallback: apply directly
                const ADMIN_CONTENT_KEY = 'rokwil_admin_content';
                const stored = localStorage.getItem(ADMIN_CONTENT_KEY);
                if (!stored) return;
                
                try {
                    const content = JSON.parse(stored);
                    if (!content) return;
                    
                    // Use the applyContentChanges from admin.js if available
                    if (window.adminJS && window.adminJS.applyContentChanges) {
                        window.adminJS.applyContentChanges();
                    } else {
                        // Fallback application
                        applyContentChangesFallback(content);
                    }
                } catch (e) {
                    console.error('Error applying admin content:', e);
                }
            } else {
                window.adminJS.applyContentChanges();
            }
        }
        
        // Complete content application (same as admin.js)
        function applyContentChangesFallback(content) {
            if (!content) return;
            
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
            
            // Apply global settings
            applyGlobalContent(content);
        }
        
        // Apply home page content
        function applyHomePageContent(content) {
            if (!content.homePage) {
                console.log('No homePage content found');
                return;
            }
            
            console.log('Applying home page content:', content.homePage);
            
            // Hero section
            if (content.homePage.hero) {
                const heroTitle = document.querySelector('.hero-title');
                if (heroTitle) {
                    if (content.homePage.hero.title) {
                        heroTitle.textContent = content.homePage.hero.title;
                        console.log('Applied hero title:', content.homePage.hero.title);
                    } else {
                        console.log('No hero title in content');
                    }
                } else {
                    console.log('Hero title element not found');
                }
                
                const heroSubtitle = document.querySelector('.hero-subtitle');
                if (heroSubtitle) {
                    if (content.homePage.hero.subtitle) {
                        heroSubtitle.textContent = content.homePage.hero.subtitle;
                        console.log('Applied hero subtitle:', content.homePage.hero.subtitle);
                    }
                }
                
                const heroSection = document.querySelector('.hero');
                if (heroSection && content.homePage.hero.image1) {
                    let bgImage = `url('${content.homePage.hero.image1}')`;
                    if (content.homePage.hero.image2) {
                        bgImage += `, url('${content.homePage.hero.image2}')`;
                    }
                    heroSection.style.backgroundImage = bgImage;
                    console.log('Applied hero background image');
                }
            } else {
                console.log('No hero content in homePage');
            }
            
            // Video section
            if (content.homePage.video) {
                const videoSection = document.querySelector('section:has(video)');
                if (videoSection) {
                    const title = videoSection.querySelector('.section-title');
                    const subtitle = videoSection.querySelector('.section-subtitle');
                    if (title && content.homePage.video.title) title.textContent = content.homePage.video.title;
                    if (subtitle && content.homePage.video.subtitle) subtitle.textContent = content.homePage.video.subtitle;
                }
                const video = document.querySelector('video');
                if (video) {
                    if (content.homePage.video.src) {
                        const source = video.querySelector('source');
                        if (source) source.src = content.homePage.video.src;
                    }
                    if (content.homePage.video.poster) video.poster = content.homePage.video.poster;
                }
            }
            
            // Features section
            if (content.homePage.features) {
                const featuresTitle = document.querySelector('.features .section-title');
                const featuresSubtitle = document.querySelector('.features .section-subtitle');
                if (featuresTitle && content.homePage.features.title) featuresTitle.textContent = content.homePage.features.title;
                if (featuresSubtitle && content.homePage.features.subtitle) featuresSubtitle.textContent = content.homePage.features.subtitle;
                
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
                if (showcaseTitle && content.homePage.showcase.title) showcaseTitle.textContent = content.homePage.showcase.title;
                if (showcaseSubtitle && content.homePage.showcase.subtitle) showcaseSubtitle.textContent = content.homePage.showcase.subtitle;
                
                if (content.homePage.showcase.items && content.homePage.showcase.items.length > 0) {
                    const showcaseItems = document.querySelectorAll('.showcase-item');
                    content.homePage.showcase.items.forEach((item, index) => {
                        if (showcaseItems[index]) {
                            const image = showcaseItems[index].querySelector('.showcase-image');
                            const title = showcaseItems[index].querySelector('.showcase-overlay h3');
                            const description = showcaseItems[index].querySelector('.showcase-overlay p');
                            if (image && item.image) image.style.backgroundImage = `url('${item.image}')`;
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
                if (testimonialsTitle && content.homePage.testimonials.title) testimonialsTitle.textContent = content.homePage.testimonials.title;
                if (testimonialsSubtitle && content.homePage.testimonials.subtitle) testimonialsSubtitle.textContent = content.homePage.testimonials.subtitle;
                
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
                if (newsTitle && content.homePage.news.title) newsTitle.textContent = content.homePage.news.title;
                if (newsSubtitle && content.homePage.news.subtitle) newsSubtitle.textContent = content.homePage.news.subtitle;
                
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
            
            if (content.aboutPage.hero) {
                const heroTitle = document.querySelector('.page-hero-content h1');
                const heroSubtitle = document.querySelector('.page-hero-content p');
                const heroSection = document.querySelector('.page-hero');
                if (heroTitle && content.aboutPage.hero.title) heroTitle.textContent = content.aboutPage.hero.title;
                if (heroSubtitle && content.aboutPage.hero.subtitle) heroSubtitle.textContent = content.aboutPage.hero.subtitle;
                if (heroSection && content.aboutPage.hero.image) {
                    heroSection.style.backgroundImage = `url('${content.aboutPage.hero.image}')`;
                }
            }
            
            if (content.aboutPage.content) {
                const aboutText = document.querySelector('.about-text p');
                const aboutImage = document.querySelector('.about-image img');
                if (aboutText && content.aboutPage.content.story) aboutText.textContent = content.aboutPage.content.story;
                if (aboutImage && content.aboutPage.content.image) aboutImage.src = content.aboutPage.content.image;
            }
            
            if (content.aboutPage.timeline && content.aboutPage.timeline.items && content.aboutPage.timeline.items.length > 0) {
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
        
        // Apply projects page content
        function applyProjectsPageContent(content) {
            if (!content.projectsPage) return;
            
            if (content.projectsPage.hero) {
                const heroTitle = document.querySelector('.page-hero-content h1');
                const heroSubtitle = document.querySelector('.page-hero-content p');
                const heroSection = document.querySelector('.page-hero');
                if (heroTitle && content.projectsPage.hero.title) heroTitle.textContent = content.projectsPage.hero.title;
                if (heroSubtitle && content.projectsPage.hero.subtitle) heroSubtitle.textContent = content.projectsPage.hero.subtitle;
                if (heroSection && content.projectsPage.hero.image) {
                    heroSection.style.backgroundImage = `url('${content.projectsPage.hero.image}')`;
                }
            }
        }
        
        // Apply contact page content
        function applyContactPageContent(content) {
            if (!content.contactPage) return;
            
            if (content.contactPage.hero) {
                const heroTitle = document.querySelector('.page-hero-content h1');
                const heroSubtitle = document.querySelector('.page-hero-content p');
                const heroSection = document.querySelector('.page-hero');
                if (heroTitle && content.contactPage.hero.title) heroTitle.textContent = content.contactPage.hero.title;
                if (heroSubtitle && content.contactPage.hero.subtitle) heroSubtitle.textContent = content.contactPage.hero.subtitle;
                if (heroSection && content.contactPage.hero.image) {
                    heroSection.style.backgroundImage = `url('${content.contactPage.hero.image}')`;
                }
            }
            
            if (content.contactPage.info) {
                const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
                const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
                if (content.contactPage.info.email) {
                    emailLinks.forEach(link => {
                        link.href = `mailto:${content.contactPage.info.email}`;
                        if (link.textContent.includes('@')) link.textContent = content.contactPage.info.email;
                    });
                }
                if (content.contactPage.info.phone) {
                    phoneLinks.forEach(link => {
                        link.href = `tel:${content.contactPage.info.phone.replace(/\s/g, '')}`;
                        if (link.textContent.match(/\d/)) link.textContent = content.contactPage.info.phone;
                    });
                }
            }
        }
        
        // Apply global content
        function applyGlobalContent(content) {
            const globalEmail = content.global?.email || content.footer?.email || content.contact?.email;
            const globalPhone = content.global?.phone || content.footer?.phone || content.contact?.phone;
            
            if (globalEmail) {
                document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
                    el.setAttribute('href', `mailto:${globalEmail}`);
                    if (el.textContent.includes('@')) el.textContent = globalEmail;
                });
            }
            
            if (globalPhone) {
                document.querySelectorAll('a[href^="tel:"]').forEach(el => {
                    el.setAttribute('href', `tel:${globalPhone.replace(/\s/g, '')}`);
                    if (el.textContent.match(/\d/)) el.textContent = globalPhone;
                });
            }
            
            if (content.icons) {
                if (content.icons.emailIcon) {
                    document.querySelectorAll('[class*="envelope"]').forEach(icon => {
                        if (icon.classList.contains('bi')) icon.className = `bi ${content.icons.emailIcon}`;
                    });
                }
                if (content.icons.phoneIcon) {
                    document.querySelectorAll('[class*="telephone"]').forEach(icon => {
                        if (icon.classList.contains('bi')) icon.className = `bi ${content.icons.phoneIcon}`;
                    });
                }
                if (content.icons.locationIcon) {
                    document.querySelectorAll('[class*="geo"]').forEach(icon => {
                        if (icon.classList.contains('bi')) icon.className = `bi ${content.icons.locationIcon}`;
                    });
                }
            }
        }
        
        // Apply admin content when DOM is ready
        function initAdminContent() {
            const ADMIN_CONTENT_KEY = 'rokwil_admin_content';
            const stored = localStorage.getItem(ADMIN_CONTENT_KEY);
            if (stored) {
                try {
                    const content = JSON.parse(stored);
                    console.log('Applying admin content:', content);
                    applyContentChangesFallback(content);
                    console.log('Admin content applied successfully');
                } catch (e) {
                    console.error('Error parsing admin content:', e);
                }
            } else {
                console.log('No admin content found in localStorage');
            }
        }
        
        // Apply changes when DOM is ready (after a delay to ensure DOM is fully loaded)
        // Use multiple attempts to ensure content is applied
        function applyWithRetry(attempts = 0) {
            if (attempts > 5) return; // Max 5 attempts
            
            const ADMIN_CONTENT_KEY = 'rokwil_admin_content';
            const stored = localStorage.getItem(ADMIN_CONTENT_KEY);
            if (stored) {
                try {
                    const content = JSON.parse(stored);
                    applyContentChangesFallback(content);
                } catch (e) {
                    console.error('Error applying admin content:', e);
                }
            }
            
            // Retry after a delay if elements might not be ready
            if (attempts < 2) {
                setTimeout(() => applyWithRetry(attempts + 1), 300);
            }
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => applyWithRetry(0), 100);
            });
        } else {
            setTimeout(() => applyWithRetry(0), 100);
        }
        
        // Also apply on window load (after all resources are loaded)
        window.addEventListener('load', () => {
            setTimeout(() => applyWithRetry(0), 100);
        });
    })();
});


