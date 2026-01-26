// Team Admin Page Script - SUPER EASY TO USE!
(function() {
    'use strict';
    
    let teamData = {
        hero: {
            title: 'Our Team',
            subtitle: 'Dedicated professionals building the future of KwaZulu-Natal',
            image: 'images/Projects/Keystone/The Boys.jpg'
        },
        teamMembers: [
            {
                name: 'Rod Stainton',
                position: 'Founder & Director',
                bio: 'Chartered accountant with over 20 years\' experience in property development, consulting, and management. Visionary leader driving Rokwil\'s transformation of KZN\'s property landscape.',
                image: '',
                initials: 'RS',
                email: 'rod@rokwil.com',
                phone: '+2783693226',
                linkedin: ''
            },
            {
                name: 'Sarah Mitchell',
                position: 'Project Manager',
                bio: 'Experienced project manager specializing in large-scale industrial developments. Sarah ensures all projects are delivered on time and within budget, coordinating teams and stakeholders effectively.',
                image: '',
                initials: 'SM',
                email: 'sarah@rokwil.com',
                phone: '+27821234567',
                linkedin: 'https://linkedin.com/in/sarah-mitchell'
            },
            {
                name: 'David Nkomo',
                position: 'Development Director',
                bio: 'Strategic development director with expertise in land acquisition, zoning, and municipal approvals. David has been instrumental in securing key development sites across KZN.',
                image: '',
                initials: 'DN',
                email: 'david@rokwil.com',
                phone: '+27829876543',
                linkedin: ''
            }
        ],
        contractors: [
            {
                name: 'Civil Engineering',
                description: 'Expert civil engineering partners specializing in bulk services, stormwater networks, and infrastructure design for large-scale developments.',
                icon: 'bi-building',
                tags: ['Infrastructure', 'Design', 'Engineering']
            },
            {
                name: 'Earthmoving & Civils',
                description: 'Specialized earthmoving contractors providing bulk earthworks, platform preparation, and site development services for industrial projects.',
                icon: 'bi-truck',
                tags: ['Earthworks', 'Site Prep', 'Excavation']
            },
            {
                name: 'Construction',
                description: 'Experienced construction teams delivering high-quality industrial buildings, warehouses, and distribution centers to exacting standards.',
                icon: 'bi-hammer',
                tags: ['Buildings', 'Warehouses', 'Construction']
            },
            {
                name: 'Project Management',
                description: 'Professional project management services ensuring timely delivery, quality control, and seamless coordination across all project phases.',
                icon: 'bi-clipboard-check',
                tags: ['Planning', 'Coordination', 'Management']
            },
            {
                name: 'Environmental & Compliance',
                description: 'Environmental consultants and compliance specialists ensuring all developments meet regulatory requirements and sustainability standards.',
                icon: 'bi-shield-check',
                tags: ['Compliance', 'Sustainability', 'Environmental']
            },
            {
                name: 'Engineering Services',
                description: 'Comprehensive engineering services including structural, electrical, and mechanical engineering for industrial and logistics facilities.',
                icon: 'bi-gear',
                tags: ['Structural', 'MEP', 'Engineering']
            }
        ],
        cta: {
            hidden: false,
            title: 'Join Our Team',
            text: 'We\'re always looking for talented professionals to join our team. If you\'re passionate about property development and making a difference, we\'d love to hear from you.',
            buttonText: 'Get In Touch'
        }
    };
    
    let teamMemberCounter = 0;
    let contractorCounter = 0;
    let currentImagePickerTarget = null;
    
    // Check authentication first
    checkAdminAuth().then((user) => {
        if (document.getElementById('adminUserEmail')) {
            document.getElementById('adminUserEmail').textContent = user.email;
        }
        loadTeamData();
        setupImagePicker();
        setupDragAndDrop();
    }).catch((error) => {
        console.error('Auth error:', error);
        // Still try to load data even if auth check fails
        loadTeamData();
        setupImagePicker();
        setupDragAndDrop();
    });
    
    // Load team data from Firebase
    async function loadTeamData() {
        try {
            // Try using loadFromFirestore function first (from admin-firebase.js)
            if (typeof loadFromFirestore === 'function') {
                console.log('Loading team data using loadFromFirestore...');
                const data = await loadFromFirestore('pages', 'team');
                if (data && Object.keys(data).length > 0) {
                    console.log('Loaded team data from Firebase:', data);
                    // Merge with defaults
                    teamData = {
                        hero: { ...teamData.hero, ...(data.hero || {}) },
                        teamMembers: data.teamMembers || [],
                        contractors: data.contractors || [],
                        cta: { ...teamData.cta, ...(data.cta || {}) }
                    };
                }
            } else {
                // Fallback to direct Firebase access
                const db = window.db || (typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore() : null);
                if (!db) {
                    console.warn('Firebase db not available, using defaults');
                    populateForm();
                    return;
                }
                
                const doc = await db.collection('pages').doc('team').get();
                
                if (doc.exists) {
                    const data = doc.data();
                    console.log('Loaded team data from Firebase:', data);
                    
                    // Merge with defaults - but preserve dummy data if Firebase arrays are empty
                    teamData = {
                        hero: { ...teamData.hero, ...(data.hero || {}) },
                        teamMembers: (data.teamMembers && data.teamMembers.length > 0) ? data.teamMembers : teamData.teamMembers,
                        contractors: (data.contractors && data.contractors.length > 0) ? data.contractors : teamData.contractors,
                        cta: { ...teamData.cta, ...(data.cta || {}) }
                    };
                } else {
                    console.log('No team data in Firebase, using default dummy data');
                }
            }
            
            populateForm();
        } catch (error) {
            console.error('Error loading team data:', error);
            if (typeof showAlert === 'function') {
                showAlert('Error loading team data: ' + error.message, 'error');
            }
            // Still populate with defaults
            populateForm();
        }
    }
    
    // Populate form with data
    function populateForm() {
        // Hero section
        document.getElementById('hero_title').value = teamData.hero.title || '';
        document.getElementById('hero_subtitle').value = teamData.hero.subtitle || '';
        document.getElementById('hero_image').value = teamData.hero.image || '';
        updateImagePreview('hero_image', 'hero_image_preview');
        
        // CTA section
        document.getElementById('cta_hidden').checked = teamData.cta.hidden || false;
        document.getElementById('cta_title').value = teamData.cta.title || '';
        document.getElementById('cta_text').value = teamData.cta.text || '';
        document.getElementById('cta_button_text').value = teamData.cta.buttonText || '';
        
        // Render team members
        renderTeamMembers();
        
        // Render contractors
        renderContractors();
    }
    
    // Render team members
    function renderTeamMembers() {
        const container = document.getElementById('teamMembersContainer');
        container.innerHTML = '';
        
        if (teamData.teamMembers.length === 0) {
            container.innerHTML = '<p style="color: var(--admin-text-secondary); padding: 2rem; text-align: center;">No team members yet. Click "Add Team Member" to get started!</p>';
            return;
        }
        
        teamData.teamMembers.forEach((member, index) => {
            const memberCard = createTeamMemberCard(member, index);
            container.appendChild(memberCard);
        });
    }
    
    // Create team member card
    function createTeamMemberCard(member, index) {
        const card = document.createElement('div');
        card.className = 'sortable-item';
        card.dataset.index = index;
        card.draggable = true;
        
        card.innerHTML = `
            <div class="sortable-item-header">
                <div class="sortable-item-handle">
                    <i class="bi bi-grip-vertical"></i>
                </div>
                <h3 style="flex: 1; margin: 0;">${member.name || 'Team Member'}</h3>
                <button type="button" class="admin-btn admin-btn-danger admin-btn-small" onclick="deleteTeamMember(${index})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </div>
            <div class="sortable-item-content">
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="admin-form-group" style="flex: 1;">
                        <label>Name</label>
                        <input type="text" class="team-member-name" value="${escapeHtml(member.name || '')}" onchange="updateTeamMember(${index}, 'name', this.value)" />
                    </div>
                    <div class="admin-form-group" style="flex: 1;">
                        <label>Position</label>
                        <input type="text" class="team-member-position" value="${escapeHtml(member.position || '')}" onchange="updateTeamMember(${index}, 'position', this.value)" />
                    </div>
                </div>
                <div class="admin-form-group">
                    <label>Bio</label>
                    <textarea class="team-member-bio" rows="3" onchange="updateTeamMember(${index}, 'bio', this.value)">${escapeHtml(member.bio || '')}</textarea>
                </div>
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="admin-form-group" style="flex: 1;">
                        <label>Photo (Image Path)</label>
                        <div class="image-picker-container">
                            <input type="text" class="team-member-image image-picker-input" value="${escapeHtml(member.image || '')}" onchange="updateTeamMember(${index}, 'image', this.value)" placeholder="Click to choose an image..." readonly style="width: 100%; padding: 0.875rem 3rem 0.875rem 1rem; background: var(--admin-bg-primary); border: 1px solid var(--admin-border); border-radius: 8px; color: var(--admin-text-primary);" />
                            <button type="button" class="image-picker-toggle" onclick="openImagePickerForTeamMember(${index})">
                                <i class="bi bi-chevron-down"></i>
                            </button>
                        </div>
                    </div>
                    <div class="admin-form-group" style="flex: 1;">
                        <label>Initials (for placeholder)</label>
                        <input type="text" class="team-member-initials" value="${escapeHtml(member.initials || '')}" onchange="updateTeamMember(${index}, 'initials', this.value)" placeholder="e.g., RS" maxlength="3" />
                    </div>
                </div>
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="admin-form-group" style="flex: 1;">
                        <label>Email</label>
                        <input type="email" class="team-member-email" value="${escapeHtml(member.email || '')}" onchange="updateTeamMember(${index}, 'email', this.value)" />
                    </div>
                    <div class="admin-form-group" style="flex: 1;">
                        <label>Phone</label>
                        <input type="tel" class="team-member-phone" value="${escapeHtml(member.phone || '')}" onchange="updateTeamMember(${index}, 'phone', this.value)" />
                    </div>
                </div>
                <div class="admin-form-group">
                    <label>LinkedIn (optional)</label>
                    <input type="url" class="team-member-linkedin" value="${escapeHtml(member.linkedin || '')}" onchange="updateTeamMember(${index}, 'linkedin', this.value)" placeholder="https://linkedin.com/in/..." />
                </div>
            </div>
        `;
        
        // Add drag event listeners
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);
        
        return card;
    }
    
    // Render contractors
    function renderContractors() {
        const container = document.getElementById('contractorsContainer');
        container.innerHTML = '';
        
        if (teamData.contractors.length === 0) {
            container.innerHTML = '<p style="color: var(--admin-text-secondary); padding: 2rem; text-align: center;">No contractors yet. Click "Add Contractor" to get started!</p>';
            return;
        }
        
        teamData.contractors.forEach((contractor, index) => {
            const contractorCard = createContractorCard(contractor, index);
            container.appendChild(contractorCard);
        });
    }
    
    // Create contractor card
    function createContractorCard(contractor, index) {
        const card = document.createElement('div');
        card.className = 'sortable-item';
        card.dataset.index = index;
        card.draggable = true;
        
        card.innerHTML = `
            <div class="sortable-item-header">
                <div class="sortable-item-handle">
                    <i class="bi bi-grip-vertical"></i>
                </div>
                <h3 style="flex: 1; margin: 0;">${contractor.name || 'Contractor'}</h3>
                <button type="button" class="admin-btn admin-btn-danger admin-btn-small" onclick="deleteContractor(${index})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </div>
            <div class="sortable-item-content">
                <div class="admin-form-group">
                    <label>Name</label>
                    <input type="text" class="contractor-name" value="${escapeHtml(contractor.name || '')}" onchange="updateContractor(${index}, 'name', this.value)" />
                </div>
                <div class="admin-form-group">
                    <label>Description</label>
                    <textarea class="contractor-description" rows="3" onchange="updateContractor(${index}, 'description', this.value)">${escapeHtml(contractor.description || '')}</textarea>
                </div>
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="admin-form-group" style="flex: 1;">
                        <label>Icon (Bootstrap Icon Class)</label>
                        <div class="icon-picker-container">
                            <input type="text" class="contractor-icon icon-picker-input" value="${escapeHtml(contractor.icon || 'bi-building')}" onchange="updateContractor(${index}, 'icon', this.value)" placeholder="bi-building" style="width: 100%; padding: 0.875rem 3rem 0.875rem 1rem; background: var(--admin-bg-primary); border: 1px solid var(--admin-border); border-radius: 8px; color: var(--admin-text-primary);" />
                            <button type="button" class="icon-picker-toggle" onclick="openIconPickerForContractor(${index})">
                                <i class="bi bi-palette"></i>
                            </button>
                        </div>
                    </div>
                    <div class="admin-form-group" style="flex: 1;">
                        <label>Tags (comma-separated)</label>
                        <input type="text" class="contractor-tags" value="${escapeHtml((contractor.tags || []).join(', '))}" onchange="updateContractor(${index}, 'tags', this.value)" placeholder="Infrastructure, Design" />
                    </div>
                </div>
            </div>
        `;
        
        // Add drag event listeners
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);
        
        return card;
    }
    
    // Add team member
    window.addTeamMember = function() {
        const newMember = {
            name: '',
            position: '',
            bio: '',
            image: '',
            initials: '',
            email: '',
            phone: '',
            linkedin: ''
        };
        
        teamData.teamMembers.push(newMember);
        renderTeamMembers();
        showAlert('Team member added! Fill in the details below.', 'success');
    };
    
    // Update team member
    window.updateTeamMember = function(index, field, value) {
        if (teamData.teamMembers[index]) {
            teamData.teamMembers[index][field] = value;
        }
    };
    
    // Delete team member
    window.deleteTeamMember = function(index) {
        if (confirm('Are you sure you want to delete this team member?')) {
            const memberName = teamData.teamMembers[index]?.name || 'Team member';
            teamData.teamMembers.splice(index, 1);
            renderTeamMembers();
            showToast(`${memberName} deleted successfully`, 'success');
        }
    };
    
    // Add contractor
    window.addContractor = function() {
        const newContractor = {
            name: '',
            description: '',
            icon: 'bi-building',
            tags: []
        };
        
        teamData.contractors.push(newContractor);
        renderContractors();
        showAlert('Contractor added! Fill in the details below.', 'success');
    };
    
    // Update contractor
    window.updateContractor = function(index, field, value) {
        if (teamData.contractors[index]) {
            if (field === 'tags') {
                // Convert comma-separated string to array
                teamData.contractors[index].tags = value.split(',').map(t => t.trim()).filter(t => t);
            } else {
                teamData.contractors[index][field] = value;
            }
        }
    };
    
    // Delete contractor
    window.deleteContractor = function(index) {
        if (confirm('Are you sure you want to delete this contractor?')) {
            const contractorName = teamData.contractors[index]?.name || 'Contractor';
            teamData.contractors.splice(index, 1);
            renderContractors();
            showToast(`${contractorName} deleted successfully`, 'success');
        }
    };
    
    // Image picker setup
    function setupImagePicker() {
        // Hero image picker
        document.getElementById('hero_image').addEventListener('click', function() {
            openImagePicker('hero_image');
        });
    }
    
    // Open image picker
    window.openImagePicker = function(targetId) {
        currentImagePickerTarget = targetId;
        const modal = document.getElementById('imagePickerModal');
        const list = document.getElementById('imagePickerList');
        
        // Populate with available images
        list.innerHTML = '';
        
        if (window.AVAILABLE_IMAGES && window.AVAILABLE_IMAGES.length > 0) {
            window.AVAILABLE_IMAGES.forEach(imagePath => {
                const imgItem = document.createElement('div');
                imgItem.className = 'image-picker-item';
                imgItem.innerHTML = `
                    <img src="${imagePath}" alt="" />
                    <div class="image-picker-item-overlay">
                        <button type="button" class="image-picker-select-btn" onclick="selectImage('${imagePath}')">
                            <i class="bi bi-check-circle"></i> Select
                        </button>
                    </div>
                `;
                list.appendChild(imgItem);
            });
        } else {
            list.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--admin-text-secondary);">No images available. Please add images to the images folder.</p>';
        }
        
        modal.style.display = 'block';
    };
    
    // Open image picker for team member
    window.openImagePickerForTeamMember = function(index) {
        window.currentImagePickerTeamMemberIndex = index;
        const modal = document.getElementById('imagePickerModal');
        const list = document.getElementById('imagePickerList');
        
        list.innerHTML = '';
        
        // window.AVAILABLE_IMAGES is already filtered based on page type
        if (window.AVAILABLE_IMAGES && window.AVAILABLE_IMAGES.length > 0) {
            window.AVAILABLE_IMAGES.forEach(imagePath => {
                const imgItem = document.createElement('div');
                imgItem.className = 'image-picker-item';
                imgItem.innerHTML = `
                    <img src="${imagePath}" alt="" />
                    <div class="image-picker-item-overlay">
                        <button type="button" class="image-picker-select-btn" onclick="selectImageForTeamMember('${imagePath}')">
                            <i class="bi bi-check-circle"></i> Select
                        </button>
                    </div>
                `;
                list.appendChild(imgItem);
            });
        } else {
            list.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--admin-text-secondary);">No images available.</p>';
        }
        
        modal.style.display = 'block';
    };
    
    // Select image
    window.selectImage = function(imagePath) {
        if (currentImagePickerTarget) {
            document.getElementById(currentImagePickerTarget).value = imagePath;
            updateImagePreview(currentImagePickerTarget, currentImagePickerTarget + '_preview');
        }
        closeImagePicker();
    };
    
    // Select image for team member
    window.selectImageForTeamMember = function(imagePath) {
        const index = window.currentImagePickerTeamMemberIndex;
        if (index !== undefined && teamData.teamMembers[index]) {
            teamData.teamMembers[index].image = imagePath;
            // Update the input field
            const card = document.querySelector(`.sortable-item[data-index="${index}"]`);
            if (card) {
                const input = card.querySelector('.team-member-image');
                if (input) input.value = imagePath;
            }
        }
        closeImagePicker();
    };
    
    // Close image picker
    window.closeImagePicker = function() {
        document.getElementById('imagePickerModal').style.display = 'none';
        currentImagePickerTarget = null;
        window.currentImagePickerTeamMemberIndex = undefined;
    };
    
    // Update image preview
    function updateImagePreview(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (input && preview) {
            if (input.value) {
                preview.src = input.value;
                preview.style.display = 'block';
            } else {
                preview.style.display = 'none';
            }
        }
    }
    
    // Icon picker for contractor
    window.openIconPickerForContractor = function(index) {
        window.currentIconPickerContractorIndex = index;
        if (window.openIconPicker) {
            window.openIconPicker(function(iconClass) {
                if (window.currentIconPickerContractorIndex !== undefined && teamData.contractors[window.currentIconPickerContractorIndex]) {
                    teamData.contractors[window.currentIconPickerContractorIndex].icon = iconClass;
                    // Update the input field
                    const card = document.querySelector(`.sortable-item[data-index="${window.currentIconPickerContractorIndex}"]`);
                    if (card) {
                        const input = card.querySelector('.contractor-icon');
                        if (input) input.value = iconClass;
                    }
                }
                window.currentIconPickerContractorIndex = undefined;
            });
        } else {
            alert('Icon picker not available. Please enter icon class manually (e.g., bi-building)');
        }
    };
    
    // Drag and drop setup
    function setupDragAndDrop() {
        // Event listeners are added in createTeamMemberCard and createContractorCard
    }
    
    let draggedElement = null;
    let draggedIndex = null;
    let draggedContainer = null;
    
    function handleDragStart(e) {
        draggedElement = this;
        draggedIndex = parseInt(this.dataset.index);
        draggedContainer = this.closest('.sortable-container');
        this.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        
        const container = this.closest('.sortable-container');
        if (container === draggedContainer) {
            const afterElement = getDragAfterElement(container, e.clientY);
            const dragging = draggedElement;
            if (afterElement == null) {
                container.appendChild(dragging);
            } else {
                container.insertBefore(dragging, afterElement);
            }
        }
        return false;
    }
    
    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        return false;
    }
    
    function handleDragEnd(e) {
        this.style.opacity = '1';
        
        // Update order in data array
        const container = this.closest('.sortable-container');
        const items = Array.from(container.querySelectorAll('.sortable-item'));
        const newOrder = items.map(item => parseInt(item.dataset.index));
        
        if (container.id === 'teamMembersContainer') {
            const reordered = newOrder.map(i => teamData.teamMembers[i]);
            teamData.teamMembers = reordered;
            renderTeamMembers();
        } else if (container.id === 'contractorsContainer') {
            const reordered = newOrder.map(i => teamData.contractors[i]);
            teamData.contractors = reordered;
            renderContractors();
        }
        
        draggedElement = null;
        draggedIndex = null;
        draggedContainer = null;
    }
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Form submission
    document.getElementById('teamForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            showLoading();
            
            // Collect hero data
            teamData.hero = {
                title: document.getElementById('hero_title').value,
                subtitle: document.getElementById('hero_subtitle').value,
                image: document.getElementById('hero_image').value
            };
            
            // Collect CTA data
            teamData.cta = {
                hidden: document.getElementById('cta_hidden').checked,
                title: document.getElementById('cta_title').value,
                text: document.getElementById('cta_text').value,
                buttonText: document.getElementById('cta_button_text').value
            };
            
            // Clean up data (remove empty team members/contractors)
            teamData.teamMembers = teamData.teamMembers.filter(m => m.name || m.position);
            teamData.contractors = teamData.contractors.filter(c => c.name);
            
            // Save to Firebase
            await saveToFirestore('pages', 'team', teamData);
            
            hideLoading();
            showAlert('All changes saved successfully!', 'success');
            
        } catch (error) {
            hideLoading();
            console.error('Save error:', error);
            showAlert('Error saving: ' + error.message, 'error');
        }
    });
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('imagePickerModal');
        if (event.target === modal) {
            closeImagePicker();
        }
    };
    
    // Function to populate with dummy data (for initial setup)
    window.populateDummyData = async function() {
        if (confirm('This will add all example team members and contractors. Continue?')) {
            try {
                if (typeof showLoading === 'function') showLoading();
                
                // Create fresh dummy data
                const dummyData = {
                    hero: {
                        title: 'Our Team',
                        subtitle: 'Dedicated professionals building the future of KwaZulu-Natal',
                        image: 'images/Projects/Keystone/The Boys.jpg'
                    },
                    teamMembers: [
                        {
                            name: 'Rod Stainton',
                            position: 'Founder & Director',
                            bio: 'Chartered accountant with over 20 years\' experience in property development, consulting, and management. Visionary leader driving Rokwil\'s transformation of KZN\'s property landscape.',
                            image: '',
                            initials: 'RS',
                            email: 'rod@rokwil.com',
                            phone: '+2783693226',
                            linkedin: ''
                        },
                        {
                            name: 'Sarah Mitchell',
                            position: 'Project Manager',
                            bio: 'Experienced project manager specializing in large-scale industrial developments. Sarah ensures all projects are delivered on time and within budget, coordinating teams and stakeholders effectively.',
                            image: '',
                            initials: 'SM',
                            email: 'sarah@rokwil.com',
                            phone: '+27821234567',
                            linkedin: 'https://linkedin.com/in/sarah-mitchell'
                        },
                        {
                            name: 'David Nkomo',
                            position: 'Development Director',
                            bio: 'Strategic development director with expertise in land acquisition, zoning, and municipal approvals. David has been instrumental in securing key development sites across KZN.',
                            image: '',
                            initials: 'DN',
                            email: 'david@rokwil.com',
                            phone: '+27829876543',
                            linkedin: ''
                        }
                    ],
                    contractors: [
                        {
                            name: 'Civil Engineering',
                            description: 'Expert civil engineering partners specializing in bulk services, stormwater networks, and infrastructure design for large-scale developments.',
                            icon: 'bi-building',
                            tags: ['Infrastructure', 'Design', 'Engineering']
                        },
                        {
                            name: 'Earthmoving & Civils',
                            description: 'Specialized earthmoving contractors providing bulk earthworks, platform preparation, and site development services for industrial projects.',
                            icon: 'bi-truck',
                            tags: ['Earthworks', 'Site Prep', 'Excavation']
                        },
                        {
                            name: 'Construction',
                            description: 'Experienced construction teams delivering high-quality industrial buildings, warehouses, and distribution centers to exacting standards.',
                            icon: 'bi-hammer',
                            tags: ['Buildings', 'Warehouses', 'Construction']
                        },
                        {
                            name: 'Project Management',
                            description: 'Professional project management services ensuring timely delivery, quality control, and seamless coordination across all project phases.',
                            icon: 'bi-clipboard-check',
                            tags: ['Planning', 'Coordination', 'Management']
                        },
                        {
                            name: 'Environmental & Compliance',
                            description: 'Environmental consultants and compliance specialists ensuring all developments meet regulatory requirements and sustainability standards.',
                            icon: 'bi-shield-check',
                            tags: ['Compliance', 'Sustainability', 'Environmental']
                        },
                        {
                            name: 'Engineering Services',
                            description: 'Comprehensive engineering services including structural, electrical, and mechanical engineering for industrial and logistics facilities.',
                            icon: 'bi-gear',
                            tags: ['Structural', 'MEP', 'Engineering']
                        }
                    ],
                    cta: {
                        hidden: false,
                        title: 'Join Our Team',
                        text: 'We\'re always looking for talented professionals to join our team. If you\'re passionate about property development and making a difference, we\'d love to hear from you.',
                        buttonText: 'Get In Touch'
                    }
                };
                
                // Save to Firebase
                await saveToFirestore('pages', 'team', dummyData);
                
                // Update local data
                teamData = dummyData;
                
                if (typeof hideLoading === 'function') hideLoading();
                if (typeof showAlert === 'function') {
                    showAlert('Example data loaded successfully! Refreshing...', 'success');
                }
                
                // Reload the data and re-render
                setTimeout(() => {
                    populateForm();
                }, 500);
            } catch (error) {
                if (typeof hideLoading === 'function') hideLoading();
                console.error('Error populating dummy data:', error);
                if (typeof showAlert === 'function') {
                    showAlert('Error: ' + error.message, 'error');
                }
            }
        }
    };
})();

