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
        // Hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && content.homePage.heroTitle) {
            heroTitle.textContent = content.homePage.heroTitle;
        }
        
        // Hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && content.homePage.heroSubtitle) {
            heroSubtitle.textContent = content.homePage.heroSubtitle;
        }
    }
    
    // Apply email and phone throughout the site
    const emailElements = document.querySelectorAll('a[href^="mailto:"]');
    emailElements.forEach(el => {
        if (content.footer.email || content.contact.email) {
            const email = content.footer.email || content.contact.email;
            el.setAttribute('href', `mailto:${email}`);
            if (el.textContent.includes('@')) {
                el.textContent = email;
            }
        }
    });
    
    const phoneElements = document.querySelectorAll('a[href^="tel:"]');
    phoneElements.forEach(el => {
        if (content.footer.phone || content.contact.phone) {
            const phone = content.footer.phone || content.contact.phone;
            el.setAttribute('href', `tel:${phone.replace(/\s/g, '')}`);
            if (el.textContent.match(/\d/)) {
                el.textContent = phone;
            }
        }
    });
    
    // Apply icons
    if (content.icons) {
        const emailIcons = document.querySelectorAll('.bi-envelope-fill, .bi-envelope');
        emailIcons.forEach(icon => {
            if (content.icons.emailIcon) {
                icon.className = `bi ${content.icons.emailIcon}`;
            }
        });
        
        const phoneIcons = document.querySelectorAll('.bi-telephone-fill, .bi-telephone');
        phoneIcons.forEach(icon => {
            if (content.icons.phoneIcon) {
                icon.className = `bi ${content.icons.phoneIcon}`;
            }
        });
        
        const locationIcons = document.querySelectorAll('.bi-geo-alt-fill, .bi-geo-alt');
        locationIcons.forEach(icon => {
            if (content.icons.locationIcon) {
                icon.className = `bi ${content.icons.locationIcon}`;
            }
        });
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

