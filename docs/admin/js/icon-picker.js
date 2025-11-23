// Icon Picker Component
// Provides a visual icon picker for Bootstrap Icons

// Comprehensive list of Bootstrap Icons (deduplicated and sorted)
const BOOTSTRAP_ICONS = [
    // Common & UI
    'bi-123', 'bi-alarm', 'bi-alarm-fill', 'bi-app', 'bi-app-indicator', 'bi-archive', 'bi-archive-fill',
    'bi-arrow-down', 'bi-arrow-left', 'bi-arrow-right', 'bi-arrow-up', 'bi-arrows-angle-contract',
    'bi-arrows-angle-expand', 'bi-arrows-move', 'bi-award', 'bi-award-fill', 'bi-badge', 'bi-badge-fill',
    'bi-bell', 'bi-bell-fill', 'bi-bell-slash', 'bi-bookmark', 'bi-bookmark-fill', 'bi-box', 'bi-box-arrow-in-down',
    'bi-box-arrow-in-right', 'bi-box-arrow-up', 'bi-briefcase', 'bi-briefcase-fill', 'bi-brightness-high',
    'bi-brightness-low', 'bi-building', 'bi-building-fill', 'bi-calendar', 'bi-calendar-check', 'bi-calendar-fill',
    'bi-camera', 'bi-camera-fill', 'bi-cart', 'bi-cart-fill', 'bi-chat', 'bi-chat-fill', 'bi-check', 'bi-check-circle',
    'bi-check-circle-fill', 'bi-check-square', 'bi-chevron-down', 'bi-chevron-left', 'bi-chevron-right',
    'bi-chevron-up', 'bi-circle', 'bi-circle-fill', 'bi-clock', 'bi-clock-fill', 'bi-cloud', 'bi-cloud-fill',
    'bi-code', 'bi-code-slash', 'bi-collection', 'bi-collection-fill', 'bi-compass', 'bi-compass-fill',
    'bi-cpu', 'bi-cpu-fill', 'bi-credit-card', 'bi-credit-card-fill', 'bi-cup', 'bi-cup-fill', 'bi-dash',
    'bi-dash-circle', 'bi-dash-square', 'bi-database', 'bi-database-fill', 'bi-diagram-3', 'bi-diagram-3-fill',
    'bi-diamond', 'bi-diamond-fill', 'bi-display', 'bi-display-fill', 'bi-download', 'bi-droplet', 'bi-droplet-fill',
    'bi-egg', 'bi-egg-fill', 'bi-envelope', 'bi-envelope-fill', 'bi-exclamation', 'bi-exclamation-circle',
    'bi-exclamation-triangle', 'bi-eye', 'bi-eye-fill', 'bi-eye-slash', 'bi-file', 'bi-file-earmark',
    'bi-file-earmark-fill', 'bi-file-earmark-text', 'bi-file-fill', 'bi-file-text', 'bi-files', 'bi-files-alt',
    'bi-film', 'bi-film-fill', 'bi-filter', 'bi-fingerprint', 'bi-flag', 'bi-flag-fill', 'bi-folder', 'bi-folder-fill',
    'bi-folder-open', 'bi-folder-open-fill', 'bi-gear', 'bi-gear-fill', 'bi-geo', 'bi-geo-alt', 'bi-geo-alt-fill',
    'bi-geo-fill', 'bi-gift', 'bi-gift-fill', 'bi-graph-down', 'bi-graph-up', 'bi-grid', 'bi-grid-3x3',
    'bi-hand-thumbs-down', 'bi-hand-thumbs-up', 'bi-heart', 'bi-heart-fill', 'bi-heart-pulse', 'bi-house',
    'bi-house-fill', 'bi-image', 'bi-image-fill', 'bi-images', 'bi-info', 'bi-info-circle', 'bi-info-circle-fill',
    'bi-key', 'bi-key-fill', 'bi-laptop', 'bi-laptop-fill', 'bi-lightbulb', 'bi-lightbulb-fill', 'bi-link',
    'bi-link-45deg', 'bi-list', 'bi-list-check', 'bi-list-ul', 'bi-lock', 'bi-lock-fill', 'bi-mailbox',
    'bi-mailbox2', 'bi-map', 'bi-map-fill', 'bi-megaphone', 'bi-megaphone-fill', 'bi-menu-button',
    'bi-menu-button-fill', 'bi-moon', 'bi-moon-fill', 'bi-music-note', 'bi-music-note-beamed', 'bi-palette',
    'bi-palette-fill', 'bi-paperclip', 'bi-pause', 'bi-pause-circle', 'bi-pause-fill', 'bi-pencil', 'bi-pencil-fill',
    'bi-pencil-square', 'bi-people', 'bi-people-fill', 'bi-person', 'bi-person-fill', 'bi-phone', 'bi-phone-fill',
    'bi-pin', 'bi-pin-fill', 'bi-play', 'bi-play-circle', 'bi-play-fill', 'bi-plus', 'bi-plus-circle',
    'bi-plus-lg', 'bi-plus-square', 'bi-printer', 'bi-printer-fill', 'bi-question', 'bi-question-circle',
    'bi-question-circle-fill', 'bi-quote', 'bi-recycle', 'bi-reply', 'bi-reply-fill', 'bi-save', 'bi-save-fill',
    'bi-search', 'bi-share', 'bi-share-fill', 'bi-shield', 'bi-shield-check', 'bi-shield-fill', 'bi-shield-lock',
    'bi-shield-shaded', 'bi-shield-slash', 'bi-shield-x', 'bi-sliders', 'bi-sliders2', 'bi-sort-down',
    'bi-sort-up', 'bi-speedometer', 'bi-speedometer2', 'bi-star', 'bi-star-fill', 'bi-star-half', 'bi-stop',
    'bi-stop-circle', 'bi-stop-fill', 'bi-sun', 'bi-sun-fill', 'bi-tablet', 'bi-tablet-fill', 'bi-tag',
    'bi-tag-fill', 'bi-telephone', 'bi-telephone-fill', 'bi-three-dots', 'bi-three-dots-vertical', 'bi-tools',
    'bi-trash', 'bi-trash-fill', 'bi-trophy', 'bi-trophy-fill', 'bi-truck', 'bi-truck-flatbed', 'bi-upload',
    'bi-wallet', 'bi-wallet-fill', 'bi-wifi', 'bi-wifi-off', 'bi-x', 'bi-x-circle', 'bi-x-circle-fill',
    'bi-x-lg', 'bi-x-square', 'bi-x-square-fill'
];

// Remove duplicates and sort
const UNIQUE_ICONS = [...new Set(BOOTSTRAP_ICONS)].sort();

// Create icon picker modal
function createIconPickerModal() {
    if (document.getElementById('iconPickerModal')) {
        return; // Already exists
    }
    
    const modal = document.createElement('div');
    modal.id = 'iconPickerModal';
    modal.className = 'icon-picker-modal';
    modal.innerHTML = `
        <div class="icon-picker-overlay"></div>
        <div class="icon-picker-container">
            <div class="icon-picker-header">
                <h3>Choose an Icon</h3>
                <button class="icon-picker-close" onclick="closeIconPicker()">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="icon-picker-search">
                <input type="text" id="iconPickerSearch" placeholder="Search icons..." autocomplete="off">
            </div>
            <div class="icon-picker-grid" id="iconPickerGrid">
                ${UNIQUE_ICONS.map(icon => `
                    <div class="icon-picker-item" data-icon="${icon}" title="${icon}">
                        <i class="bi ${icon}"></i>
                        <span class="icon-name">${icon.replace('bi-', '')}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Search functionality
    const searchInput = document.getElementById('iconPickerSearch');
    const iconGrid = document.getElementById('iconPickerGrid');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = iconGrid.querySelectorAll('.icon-picker-item');
        
        items.forEach(item => {
            const iconName = item.getAttribute('data-icon').toLowerCase();
            if (iconName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Click outside to close
    modal.querySelector('.icon-picker-overlay').addEventListener('click', closeIconPicker);
}

// Open icon picker
window.openIconPicker = function(inputElement) {
    createIconPickerModal();
    const modal = document.getElementById('iconPickerModal');
    const iconGrid = document.getElementById('iconPickerGrid');
    
    // Store reference to input element
    modal.dataset.targetInput = inputElement.id || inputElement.className;
    modal.dataset.targetElement = inputElement;
    
    // Highlight currently selected icon
    const currentIcon = inputElement.value || inputElement.getAttribute('data-current-icon') || '';
    const items = iconGrid.querySelectorAll('.icon-picker-item');
    items.forEach(item => {
        if (item.getAttribute('data-icon') === currentIcon) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Add click handlers to icon items
    items.forEach(item => {
        item.addEventListener('click', function() {
            const selectedIcon = this.getAttribute('data-icon');
            inputElement.value = selectedIcon;
            
            // Update preview if exists
            const preview = inputElement.parentElement.querySelector('.icon-picker-preview');
            if (preview) {
                preview.innerHTML = `<i class="bi ${selectedIcon}"></i>`;
            }
            
            closeIconPicker();
        });
    });
    
    modal.style.display = 'flex';
    document.getElementById('iconPickerSearch').focus();
};

// Close icon picker
window.closeIconPicker = function() {
    const modal = document.getElementById('iconPickerModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('iconPickerSearch').value = '';
        // Reset search
        const items = modal.querySelectorAll('.icon-picker-item');
        items.forEach(item => {
            item.style.display = 'flex';
        });
    }
};

// Initialize icon picker for an input field
window.initIconPicker = function(inputSelector, previewSelector = null) {
    const inputs = typeof inputSelector === 'string' 
        ? document.querySelectorAll(inputSelector) 
        : [inputSelector];
    
    inputs.forEach(input => {
        if (input.dataset.iconPickerInitialized) return;
        input.dataset.iconPickerInitialized = 'true';
        
        // Create wrapper if needed
        let wrapper = input.parentElement;
        if (!wrapper.classList.contains('icon-picker-wrapper')) {
            wrapper = document.createElement('div');
            wrapper.className = 'icon-picker-wrapper';
            input.parentElement.insertBefore(wrapper, input);
            wrapper.appendChild(input);
        }
        
        // Create preview
        const preview = document.createElement('div');
        preview.className = 'icon-picker-preview';
        const currentIcon = input.value || input.getAttribute('value') || 'bi-star';
        preview.innerHTML = `<i class="bi ${currentIcon}"></i>`;
        wrapper.insertBefore(preview, input);
        
        // Create picker button
        const pickerBtn = document.createElement('button');
        pickerBtn.type = 'button';
        pickerBtn.className = 'icon-picker-btn';
        pickerBtn.innerHTML = '<i class="bi bi-grid-3x3"></i> Choose Icon';
        pickerBtn.onclick = () => openIconPicker(input);
        wrapper.appendChild(pickerBtn);
        
        // Update preview when input changes
        input.addEventListener('input', () => {
            const icon = input.value || 'bi-star';
            preview.innerHTML = `<i class="bi ${icon}"></i>`;
        });
        
        // Hide text input (optional - can keep it visible for manual entry)
        input.style.display = 'none';
    });
};
