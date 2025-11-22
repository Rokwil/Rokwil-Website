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
    window.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // For timeline items, calculate delay based on position in timeline, not index in entries
                if (element.classList.contains('timeline-item')) {
                    const timelineContainer = element.closest('div[style*="position: relative"]');
                    if (timelineContainer) {
                        const allTimelineItems = timelineContainer.querySelectorAll('.timeline-item');
                        const itemPosition = Array.from(allTimelineItems).indexOf(element);
                        const delay = itemPosition * 100;
                        
                        setTimeout(() => {
                            element.classList.add('active');
                        }, delay);
                    } else {
                        // Fallback: use immediate animation
                        element.classList.add('active');
                    }
                } else if (element.classList.contains('value-card')) {
                    // For value cards, calculate delay based on position in values grid
                    const valuesGrid = element.closest('.values-grid');
                    if (valuesGrid) {
                        const allValueCards = valuesGrid.querySelectorAll('.value-card');
                        const cardPosition = Array.from(allValueCards).indexOf(element);
                        // Fast animation delay (25ms per card for quick sequential reveal)
                        const delay = cardPosition * 25;
                        
                        setTimeout(() => {
                            element.classList.add('active');
                        }, delay);
                    } else {
                        // Fallback: use immediate animation
                        element.classList.add('active');
                    }
                } else {
                    // For other reveal elements, use the original index-based stagger
                    const allRevealElements = document.querySelectorAll('.reveal:not(.timeline-item):not(.value-card)');
                    const revealIndex = Array.from(allRevealElements).indexOf(element);
                    const delay = revealIndex * 100;
                    
                    setTimeout(() => {
                        element.classList.add('active');
                    }, delay);
                }
                
                window.revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => window.revealObserver.observe(el));

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
                const featuresSection = document.querySelector('.features');
                if (featuresSection) {
                    // Hide entire section if marked as hidden
                    if (content.homePage.features.hidden) {
                        featuresSection.style.display = 'none';
                    } else {
                        featuresSection.style.display = '';
                        
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
                        if (showcaseTitle && content.homePage.showcase.title) showcaseTitle.textContent = content.homePage.showcase.title;
                        if (showcaseSubtitle && content.homePage.showcase.subtitle) showcaseSubtitle.textContent = content.homePage.showcase.subtitle;
                        
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
                                        if (image && item.image) image.style.backgroundImage = `url('${item.image}')`;
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
                        if (testimonialsTitle && content.homePage.testimonials.title) testimonialsTitle.textContent = content.homePage.testimonials.title;
                        if (testimonialsSubtitle && content.homePage.testimonials.subtitle) testimonialsSubtitle.textContent = content.homePage.testimonials.subtitle;
                        
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
                        if (newsTitle && content.homePage.news.title) newsTitle.textContent = content.homePage.news.title;
                        if (newsSubtitle && content.homePage.news.subtitle) newsSubtitle.textContent = content.homePage.news.subtitle;
                        
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
                const aboutTextSection = document.querySelector('.about-text');
                const aboutImage = document.querySelector('.about-image img');
                
                // Story badge
                if (aboutTextSection && content.aboutPage.content.storyBadge) {
                    const badge = aboutTextSection.querySelector('div[style*="background: var(--secondary-color)"]');
                    if (badge) {
                        badge.textContent = content.aboutPage.content.storyBadge;
                    }
                }
                
                // Story heading
                if (aboutTextSection && content.aboutPage.content.storyHeading) {
                    const heading = aboutTextSection.querySelector('h2');
                    if (heading) {
                        heading.textContent = content.aboutPage.content.storyHeading;
                    }
                }
                
                // Story paragraphs
                if (aboutTextSection && content.aboutPage.content.story) {
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
            
            // Timeline header and items
            if (content.aboutPage.timeline) {
                // Find the timeline container
                const timelineContainer = document.querySelector('div[style*="margin-top: 100px"]:has(.timeline-item)');
                if (timelineContainer) {
                    // Timeline header
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
                    
                    // Timeline items - dynamic creation/update/removal
                    if (content.aboutPage.timeline.items && content.aboutPage.timeline.items.length > 0) {
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
                // Find the first .values-section (the "Our Values" section, not the Leadership one)
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
                                                const boldMatch = tenantLine.match(/^([^–-:]+)/);
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
                                                const boldMatch = tenantLine.match(/^([^–-:]+)/);
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


