// Data storage
let notesSections = loadData('notesData') || {};
let diarySections = loadData('diaryData') || {};
let currentTab = 'notes';
let editingIndex = null;

// Initial render
displayNavbar();
displaySections();

// Toggle sidebar
document.getElementById('toggle-btn').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-btn');
    const body = document.body;
    sidebar.classList.toggle('open');
    toggleBtn.classList.toggle('open');
    body.classList.toggle('sidebar-open'); // Toggle class to shift content
});

// Section search
document.getElementById('section-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    filterSections(searchTerm, currentTab);
});

// Add section
document.getElementById('add-section-btn').addEventListener('click', () => {
    const sectionName = document.getElementById('new-section').value.trim();
    if (sectionName) {
        const sections = currentTab === 'notes' ? notesSections : diarySections;
        if (!sections[sectionName]) {
            sections[sectionName] = [];
            saveData(currentTab === 'notes' ? 'notesData' : 'diaryData', sections);
            document.getElementById('new-section').value = '';
            displayNavbar();
            displaySections();
        }
    }
});

// Tab switching
document.querySelectorAll('.nav-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.nav-option.active').classList.remove('active');
        option.classList.add('active');
        currentTab = option.getAttribute('data-tab');
        displayNavbar();
        displaySections();
        filterSections(document.getElementById('section-search').value.trim(), currentTab);
    });
});

// Event delegation
document.addEventListener('click', (e) => {
    const sectionDiv = e.target.closest('.section');
    const navSection = e.target.closest('.nav-section');
    const titleInput = sectionDiv?.querySelector('.note-title');
    const contentInput = sectionDiv?.querySelector('.note-content');
    const dateInput = sectionDiv?.querySelector('.note-date');

    if (e.target.classList.contains('add-note-btn')) {
        const sectionName = sectionDiv.querySelector('h2').textContent;
        const title = titleInput.value.trim() || (currentTab === 'notes' ? 'Note title' : 'Dear Diary...');
        const content = contentInput.value.trim();
        const date = dateInput ? dateInput.value : '';
        if (content) {
            const sections = currentTab === 'notes' ? notesSections : diarySections;
            if (editingIndex !== null) {
                sections[sectionName][editingIndex] = { title, content, date };
                editingIndex = null;
            } else {
                sections[sectionName].push({ title, content, date });
            }
            saveData(currentTab === 'notes' ? 'notesData' : 'diaryData', sections);
            titleInput.value = '';
            contentInput.value = '';
            if (dateInput) dateInput.value = '';
            sectionDiv.classList.remove('editing');
            displaySections();
        }
    } else if (e.target.classList.contains('edit-btn')) {
        const sectionName = sectionDiv.querySelector('h2').textContent;
        const index = e.target.dataset.index;
        const item = (currentTab === 'notes' ? notesSections : diarySections)[sectionName][index];
        titleInput.value = item.title || (currentTab === 'notes' ? 'Note title' : 'Dear Diary...');
        contentInput.value = item.content;
        if (dateInput) dateInput.value = item.date || '';
        editingIndex = index;
        sectionDiv.classList.add('editing');
    } else if (e.target.classList.contains('delete-btn')) {
        const sectionName = sectionDiv.querySelector('h2').textContent;
        const index = e.target.dataset.index;
        const sections = currentTab === 'notes' ? notesSections : diarySections;
        sections[sectionName].splice(index, 1);
        saveData(currentTab === 'notes' ? 'notesData' : 'diaryData', sections);
        displaySections();
    } else if (e.target.classList.contains('delete-section-btn')) {
        const sectionName = navSection.dataset.section;
        const sections = currentTab === 'notes' ? notesSections : diarySections;
        if (sectionName in sections) {
            delete sections[sectionName];
            saveData(currentTab === 'notes' ? 'notesData' : 'diaryData', sections);
            displayNavbar();
            displaySections();
        }
    } else if (e.target.classList.contains('nav-section')) {
        const sectionName = e.target.dataset.section;
        scrollToSection(sectionName);
    }
});

// Main content search
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    filterContent(searchTerm, currentTab);
});

// Utility functions
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function displayNavbar() {
    const navSections = document.getElementById('nav-sections');
    navSections.innerHTML = '';
    const sections = currentTab === 'notes' ? notesSections : diarySections;
    for (const sectionName in sections) {
        const navItem = document.createElement('div');
        navItem.className = 'nav-section';
        navItem.dataset.section = sectionName;
        navItem.innerHTML = `
            <span>${sectionName}</span>
            <button class="delete-section-btn">X</button>
        `;
        navSections.appendChild(navItem);
    }
    filterSections(document.getElementById('section-search').value.trim(), currentTab);
}

function filterSections(searchTerm, tab) {
    const sections = document.querySelectorAll('.nav-section');
    sections.forEach(section => {
        const sectionName = section.querySelector('span').textContent.toLowerCase();
        section.style.display = sectionName.includes(searchTerm) ? 'flex' : 'none';
    });
}

function displaySections() {
    const container = document.getElementById('sections');
    container.innerHTML = '';
    const sectionsData = currentTab === 'notes' ? notesSections : diarySections;
    container.className = `container ${currentTab}-section`;
    for (const sectionName in sectionsData) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        sectionDiv.id = `section-${sectionName.toLowerCase().replace(/\s+/g, '-')}`;
        const itemsHtml = sectionsData[sectionName].map((item, index) => `
            <div class="${currentTab === 'notes' ? 'note' : 'diary-entry'}">
                ${currentTab === 'diary' ? `
                    <div class="header">
                        <span>Dear diary...</span>
                        <input type="date" value="${item.date || ''}" disabled>
                    </div>
                ` : `<h3>${item.title || 'Untitled Note'}</h3>`}
                <p>${item.content}</p>
                <button class="edit-btn" data-index="${index}">✏️</button>
                <button class="delete-btn" data-index="${index}">X</button>
            </div>
        `).join('');
        sectionDiv.innerHTML = `
            <h2>${sectionName}</h2>
            <div class="notes">${itemsHtml}</div>
            <div class="add-note">
                <input type="text" class="note-title" placeholder="${currentTab === 'notes' ? 'Note title' : 'Dear Diary...'}" ${currentTab === 'diary' ? 'readonly' : ''}>
                ${currentTab === 'diary' ? '<input type="date" class="note-date">' : ''}
                <textarea class="note-content" placeholder="${currentTab === 'notes' ? 'Write your note here...' : 'Write your entry here...'}"></textarea>
                <button class="add-note-btn">Add ${currentTab === 'notes' ? 'Note' : 'Entry'}</button>
            </div>
        `;
        container.appendChild(sectionDiv);
    }
}

function scrollToSection(sectionName) {
    const section = document.querySelector(`#section-${sectionName.toLowerCase().replace(/\s+/g, '-')}`);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function filterContent(searchTerm, tab) {
    const items = document.querySelectorAll(`.${tab === 'notes' ? 'note' : 'diary-entry'}`);
    items.forEach(item => {
        const title = item.querySelector(currentTab === 'notes' ? 'h3' : '.header span')?.textContent.toLowerCase() || '';
        const content = item.querySelector('p').textContent.toLowerCase();
        item.classList.toggle('hidden', !(title.includes(searchTerm) || content.includes(searchTerm)));
    });
}