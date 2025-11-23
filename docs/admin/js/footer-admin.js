// Footer Admin Page Script
(function() {
    'use strict';
    
    let footerData = {};
    
    // Check authentication
    checkAdminAuth().then((user) => {
        document.getElementById('adminUserEmail').textContent = user.email;
        loadFooterData();
    });
    
    // Load footer data from Firebase (stored in pages/index as it's shared)
    async function loadFooterData() {
        // Try to load from index page first (where it's typically stored)
        const indexData = await loadFromFirestore('pages', 'index');
        if (indexData && indexData.footer) {
            footerData = indexData.footer;
            populateForm();
        } else {
            // Try to load from a dedicated footer document
            const data = await loadFromFirestore('global', 'footer');
            if (data) {
                footerData = data;
                populateForm();
            } else {
                // Load defaults from HTML
                loadFromHTML();
            }
        }
    }
    
    // Load defaults from HTML
    function loadFromHTML() {
        fetch('../index.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const footer = doc.querySelector('.footer');
                
                if (footer) {
                    const companyName = footer.querySelector('h3')?.textContent || '';
                    const description = footer.querySelector('.footer-section p')?.textContent || '';
                    const locationP = footer.querySelectorAll('.footer-section p');
                    let location = '';
                    let country = '';
                    if (locationP.length > 1) {
                        location = locationP[1]?.textContent?.trim() || '';
                        country = locationP[2]?.textContent?.trim() || '';
                    }
                    const email = footer.querySelector('a[href^="mailto:"]')?.textContent || '';
                    const phone = footer.querySelector('a[href^="tel:"]')?.textContent || '';
                    const copyright = footer.querySelector('.footer-bottom p')?.textContent || '';
                    
                    footerData = {
                        companyName: companyName || '',
                        description: description || '',
                        location: location.replace('South Africa', '').trim() || '',
                        country: country || (location.includes('South Africa') ? 'South Africa' : ''),
                        email: email || '',
                        phone: phone || '',
                        copyright: copyright || ''
                    };
                    
                    populateForm();
                }
            })
            .catch(err => {
                console.log('Could not load footer defaults from HTML');
            });
    }
    
    // Populate form with data
    function populateForm() {
        document.getElementById('footer_company_name').value = footerData.companyName || '';
        document.getElementById('footer_description').value = footerData.description || '';
        document.getElementById('footer_location').value = footerData.location || '';
        document.getElementById('footer_country').value = footerData.country || '';
        document.getElementById('footer_email').value = footerData.email || '';
        document.getElementById('footer_phone').value = footerData.phone || '';
        document.getElementById('footer_copyright').value = footerData.copyright || '';
    }
    
    // Form submission
    document.getElementById('footerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            showLoading();
            
            // Collect footer data
            footerData = {
                companyName: document.getElementById('footer_company_name').value,
                description: document.getElementById('footer_description').value,
                location: document.getElementById('footer_location').value,
                country: document.getElementById('footer_country').value,
                email: document.getElementById('footer_email').value,
                phone: document.getElementById('footer_phone').value,
                copyright: document.getElementById('footer_copyright').value
            };
            
            // Save to both a dedicated footer document AND update all pages
            await saveToFirestore('global', 'footer', footerData);
            
            // Also update the index page footer (for backward compatibility)
            const indexData = await loadFromFirestore('pages', 'index');
            if (indexData) {
                indexData.footer = footerData;
                await saveToFirestore('pages', 'index', indexData);
            }
            
            hideLoading();
            showAlert('Footer saved successfully! This will update on all pages.', 'success');
            
        } catch (error) {
            hideLoading();
            console.error('Save error:', error);
            showAlert('Error saving: ' + error.message, 'error');
        }
    });
})();

