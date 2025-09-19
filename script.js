class ProjectLinksManager {
    constructor() {
        this.version = '0.0.5';
        this.creator = 'Gerasimos Makis Mouzakitis';
        this.createdDate = '2025-09-19T08:52:40.000Z';
        this.updatedDate = '2025-09-19T10:11:19.000Z';
        
        this.projects = this.loadProjects();
        this.selectedProjectId = null;
        this.initializeEventListeners();
        this.renderProjects();
        this.initializeDemoData();
        this.updateTimestamps();
    }

    initializeEventListeners() {
        // Project creation
        document.getElementById('createProjectBtn').addEventListener('click', () => this.createProject());
        document.getElementById('projectNameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createProject();
        });

        // Export functionality
        document.getElementById('exportAllBtn').addEventListener('click', () => this.exportAllProjects());

        // Drag and drop
        this.initializeDragAndDrop();

        // Modal functionality
        this.initializeModal();
    }

    initializeDragAndDrop() {
        const dropZone = document.getElementById('dropZone');

        // Prevent default drag behaviors on the entire document
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        // Handle drag enter for the drop zone
        dropZone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Drag enter detected');
            if (this.selectedProjectId) {
                dropZone.classList.add('drag-over');
                console.log('Added drag-over class');
            } else {
                this.showTempMessage('Please select a project first!');
            }
        });

        // Handle drag over for the drop zone
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.selectedProjectId) {
                dropZone.classList.add('drag-over');
                // Change cursor to indicate drop is allowed
                e.dataTransfer.dropEffect = 'copy';
            } else {
                e.dataTransfer.dropEffect = 'none';
            }
        });

        // Handle drag leave for the drop zone
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Drag leave detected');
            // Only remove drag-over if we're actually leaving the drop zone
            const rect = dropZone.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            
            if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
                dropZone.classList.remove('drag-over');
                console.log('Removed drag-over class');
            }
        });

        // Handle drop for the drop zone
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Drop detected');
            dropZone.classList.remove('drag-over');
            
            if (!this.selectedProjectId) {
                alert('Please select a project first!');
                return;
            }

            // Try multiple ways to get the URL from the drop event
            let url = '';
            
            // First try to get URL from dataTransfer
            const urlFromDataTransfer = e.dataTransfer.getData('text/uri-list') || 
                                       e.dataTransfer.getData('text/plain') ||
                                       e.dataTransfer.getData('URL') ||
                                       e.dataTransfer.getData('text/x-moz-url');
            
            if (urlFromDataTransfer) {
                // Handle multiple URLs (take the first one)
                url = urlFromDataTransfer.split('\n')[0].split('\t')[0].trim();
            }
            
            console.log('Dropped URL:', url);

            if (url && this.isValidUrl(url)) {
                this.addLinkToProject(this.selectedProjectId, url);
                this.showSuccessMessage(`Link added successfully!`);
            } else {
                alert('Invalid URL dropped. Please drag a valid URL from your browser address bar or a bookmark.');
                console.log('Invalid URL or no URL found in drop data');
            }
        });

        // Click to add link manually
        dropZone.addEventListener('click', () => {
            if (!this.selectedProjectId) {
                alert('Please select a project first!');
                return;
            }
            this.showLinkInputModal();
        });
    }

    initializeModal() {
        // Add link modal
        const modal = document.getElementById('linkInputModal');
        const closeBtn = modal.querySelector('.close');
        const addBtn = document.getElementById('addLinkBtn');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        addBtn.addEventListener('click', () => this.addLinkFromModal());
        
        document.getElementById('linkUrlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addLinkFromModal();
        });

        // Edit link modal
        const editModal = document.getElementById('editLinkModal');
        const editCloseBtn = editModal.querySelector('.close');
        const saveBtn = document.getElementById('saveEditBtn');

        editCloseBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.style.display = 'none';
            }
        });

        saveBtn.addEventListener('click', () => this.saveEditedLink());
        
        document.getElementById('editLinkUrlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveEditedLink();
        });
    }

    createProject() {
        const nameInput = document.getElementById('projectNameInput');
        const projectName = nameInput.value.trim();

        if (!projectName) {
            alert('Please enter a project name');
            return;
        }

        if (this.projects.find(p => p.name === projectName)) {
            alert('A project with this name already exists');
            return;
        }

        const newProject = {
            id: Date.now().toString(),
            name: projectName,
            links: [],
            createdAt: new Date().toISOString()
        };

        this.projects.push(newProject);
        this.saveProjects();
        this.renderProjects();
        nameInput.value = '';
        
        // Auto-select the new project
        this.selectProject(newProject.id);
        
        // Show success message
        this.showSuccessMessage(`Project "${projectName}" created successfully!`);
    }

    selectProject(projectId) {
        this.selectedProjectId = projectId;
        this.updateProjectSelection();
        this.updateDropZone();
    }

    updateProjectSelection() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-project-id="${this.selectedProjectId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }

    updateDropZone() {
        const dropZone = document.getElementById('dropZone');
        const dropZoneContent = dropZone.querySelector('.drop-zone-content');
        
        if (this.selectedProjectId) {
            const project = this.projects.find(p => p.id === this.selectedProjectId);
            dropZone.classList.remove('disabled');
            dropZoneContent.innerHTML = `
                <h3>Drop Links for "${project.name}"</h3>
                <p>Drag links here or click to add manually</p>
                <div class="drop-icon">📎</div>
            `;
        } else {
            dropZone.classList.add('disabled');
            dropZoneContent.innerHTML = `
                <h3>Drag and Drop Links Here</h3>
                <p>Select a project first, then drag links or URLs here to add them</p>
                <div class="drop-icon">📎</div>
            `;
        }
    }

    addLinkToProject(projectId, url, title = '') {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        // Check for duplicate links
        if (project.links.find(link => link.url === url)) {
            alert('This link already exists in the project');
            return;
        }

        const newLink = {
            id: Date.now().toString(),
            url: url,
            title: title || this.extractTitleFromUrl(url),
            addedAt: new Date().toISOString()
        };

        project.links.push(newLink);
        this.saveProjects();
        this.renderProjects();
    }

    showLinkInputModal() {
        const modal = document.getElementById('linkInputModal');
        modal.style.display = 'block';
        document.getElementById('linkUrlInput').focus();
    }

    addLinkFromModal() {
        const urlInput = document.getElementById('linkUrlInput');
        const titleInput = document.getElementById('linkTitleInput');
        
        const url = urlInput.value.trim();
        const title = titleInput.value.trim();

        if (!url) {
            alert('Please enter a URL');
            return;
        }

        if (!this.isValidUrl(url)) {
            alert('Please enter a valid URL (including http:// or https://)');
            return;
        }

        this.addLinkToProject(this.selectedProjectId, url, title);
        
        // Clear inputs and close modal
        urlInput.value = '';
        titleInput.value = '';
        document.getElementById('linkInputModal').style.display = 'none';
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project and all its links?')) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            if (this.selectedProjectId === projectId) {
                this.selectedProjectId = null;
                this.updateDropZone();
            }
            this.saveProjects();
            this.renderProjects();
        }
    }

    deleteLink(projectId, linkId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.links = project.links.filter(l => l.id !== linkId);
            this.saveProjects();
            this.renderProjects();
        }
    }

    editLink(projectId, linkId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const link = project.links.find(l => l.id === linkId);
        if (!link) return;

        // Show edit modal with current values
        this.showEditLinkModal(projectId, linkId, link.url, link.title);
    }

    showEditLinkModal(projectId, linkId, currentUrl, currentTitle) {
        const modal = document.getElementById('editLinkModal');
        const urlInput = document.getElementById('editLinkUrlInput');
        const titleInput = document.getElementById('editLinkTitleInput');
        
        // Set current values
        urlInput.value = currentUrl;
        titleInput.value = currentTitle;
        
        // Store the IDs for the save operation
        modal.dataset.projectId = projectId;
        modal.dataset.linkId = linkId;
        
        modal.style.display = 'block';
        urlInput.focus();
        urlInput.select();
    }

    saveEditedLink() {
        const modal = document.getElementById('editLinkModal');
        const urlInput = document.getElementById('editLinkUrlInput');
        const titleInput = document.getElementById('editLinkTitleInput');
        
        const projectId = modal.dataset.projectId;
        const linkId = modal.dataset.linkId;
        const newUrl = urlInput.value.trim();
        const newTitle = titleInput.value.trim();

        if (!newUrl) {
            alert('Please enter a URL');
            return;
        }

        if (!this.isValidUrl(newUrl)) {
            alert('Please enter a valid URL (including http:// or https://)');
            return;
        }

        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const link = project.links.find(l => l.id === linkId);
        if (!link) return;

        // Check for duplicate URLs (excluding the current link)
        const duplicateLink = project.links.find(l => l.id !== linkId && l.url === newUrl);
        if (duplicateLink) {
            alert('This URL already exists in the project');
            return;
        }

        // Update the link
        link.url = newUrl;
        link.title = newTitle || this.extractTitleFromUrl(newUrl);
        link.updatedAt = new Date().toISOString();

        this.saveProjects();
        this.renderProjects();
        
        // Close modal and show success
        modal.style.display = 'none';
        this.showSuccessMessage('Link updated successfully!');
    }

    exportProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const exportData = {
            appMetadata: this.getAppMetadata(),
            projectName: project.name,
            createdAt: project.createdAt,
            exportedAt: new Date().toISOString(),
            linksCount: project.links.length,
            links: project.links
        };

        this.downloadJson(exportData, `${project.name}_links.json`);
    }

    exportAllProjects() {
        if (this.projects.length === 0) {
            alert('No projects to export');
            return;
        }

        const exportData = {
            appMetadata: this.getAppMetadata(),
            exportedAt: new Date().toISOString(),
            projectsCount: this.projects.length,
            totalLinks: this.projects.reduce((sum, p) => sum + p.links.length, 0),
            projects: this.projects
        };

        this.downloadJson(exportData, 'all_projects_links.json');
    }

    downloadJson(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    renderProjects() {
        const projectsList = document.getElementById('projectsList');
        
        if (this.projects.length === 0) {
            projectsList.innerHTML = '<div class="no-projects">No projects yet. Create your first project above!</div>';
            return;
        }

        projectsList.innerHTML = this.projects.map(project => `
            <div class="project-card ${this.selectedProjectId === project.id ? 'selected' : ''}" 
                 data-project-id="${project.id}">
                <div class="project-header">
                    <h3 class="project-name">${this.escapeHtml(project.name)}</h3>
                    <div class="project-actions">
                        <button class="export-project-btn" onclick="app.exportProject('${project.id}')">
                            Export
                        </button>
                        <button class="delete-project-btn" onclick="app.deleteProject('${project.id}')">
                            Delete
                        </button>
                    </div>
                </div>
                <div class="project-info">
                    <p><strong>${project.links.length}</strong> links</p>
                    <p>Created: ${new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                ${project.links.length > 0 ? `
                    <ul class="links-list">
                        ${project.links.map(link => `
                            <li class="link-item">
                                <div class="link-info">
                                    <a href="${link.url}" target="_blank" rel="noopener noreferrer">
                                        ${this.escapeHtml(link.title)}
                                    </a>
                                    <div class="link-title">${this.escapeHtml(link.url)}</div>
                                </div>
                                <div class="link-actions">
                                    <button class="edit-link-btn" onclick="app.editLink('${project.id}', '${link.id}')" title="Edit link">
                                        ✏️
                                    </button>
                                    <button class="delete-link-btn" onclick="app.deleteLink('${project.id}', '${link.id}')" title="Delete link">
                                        ×
                                    </button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                ` : '<p style="color: #718096; font-style: italic;">No links yet</p>'}
            </div>
        `).join('');

        // Add click listeners to project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't select if clicking on action buttons
                if (e.target.closest('.project-actions')) return;
                this.selectProject(card.dataset.projectId);
            });
        });
    }

    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    extractTitleFromUrl(url) {
        try {
            const urlObj = new URL(url);
            let hostname = urlObj.hostname.replace('www.', '');
            return hostname.charAt(0).toUpperCase() + hostname.slice(1);
        } catch (_) {
            return url;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveProjects() {
        localStorage.setItem('projectLinks', JSON.stringify(this.projects));
    }

    loadProjects() {
        const saved = localStorage.getItem('projectLinks');
        return saved ? JSON.parse(saved) : [];
    }

    initializeDemoData() {
        // Only create demo data if no projects exist
        if (this.projects.length > 0) return;

        const demoProjects = [
            {
                id: 'demo1',
                name: 'Web Development Resources',
                createdAt: new Date().toISOString(),
                links: [
                    {
                        id: 'link1',
                        url: 'https://developer.mozilla.org/en-US/docs/Web',
                        title: 'MDN Web Docs',
                        addedAt: new Date().toISOString()
                    },
                    {
                        id: 'link2',
                        url: 'https://stackoverflow.com',
                        title: 'Stack Overflow',
                        addedAt: new Date().toISOString()
                    },
                    {
                        id: 'link3',
                        url: 'https://github.com',
                        title: 'GitHub',
                        addedAt: new Date().toISOString()
                    }
                ]
            },
            {
                id: 'demo2',
                name: 'Design Inspiration',
                createdAt: new Date().toISOString(),
                links: [
                    {
                        id: 'link4',
                        url: 'https://dribbble.com',
                        title: 'Dribbble',
                        addedAt: new Date().toISOString()
                    },
                    {
                        id: 'link5',
                        url: 'https://behance.net',
                        title: 'Behance',
                        addedAt: new Date().toISOString()
                    },
                    {
                        id: 'link6',
                        url: 'https://awwwards.com',
                        title: 'Awwwards',
                        addedAt: new Date().toISOString()
                    }
                ]
            }
        ];

        this.projects = demoProjects;
        this.saveProjects();
        this.renderProjects();
    }

    updateTimestamps() {
        // Format and display the timestamps in a user-friendly way
        const createdDateElement = document.getElementById('createdDate');
        const updatedDateElement = document.getElementById('updatedDate');
        
        if (createdDateElement) {
            const createdDate = new Date(this.createdDate);
            createdDateElement.textContent = createdDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
        }
        
        if (updatedDateElement) {
            const updatedDate = new Date(this.updatedDate);
            updatedDateElement.textContent = updatedDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
        }
    }

    showSuccessMessage(message) {
        // Create or update success message element
        let successDiv = document.getElementById('successMessage');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.id = 'successMessage';
            successDiv.className = 'success-message';
            document.body.appendChild(successDiv);
        }
        
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }

    showTempMessage(message) {
        // Create or update temp message element
        let tempDiv = document.getElementById('tempMessage');
        if (!tempDiv) {
            tempDiv = document.createElement('div');
            tempDiv.id = 'tempMessage';
            tempDiv.className = 'temp-message';
            document.body.appendChild(tempDiv);
        }
        
        tempDiv.textContent = message;
        tempDiv.style.display = 'block';
        
        // Auto-hide after 2 seconds
        setTimeout(() => {
            tempDiv.style.display = 'none';
        }, 2000);
    }

    getAppMetadata() {
        return {
            version: this.version,
            creator: this.creator,
            createdDate: this.createdDate,
            updatedDate: this.updatedDate
        };
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProjectLinksManager();
});