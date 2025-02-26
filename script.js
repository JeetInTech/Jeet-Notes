// Load data from localStorage
let sections = loadData();
displayNavbar();
displaySections();

// Add section button event
document.getElementById('add-section-btn').addEventListener('click', () => {
    let sectionName = document.getElementById('new-section').value.trim();
    if (sectionName && !sections[sectionName]) {
        addSection(sectionName);
        document.getElementById('new-section').value = '';
    }
});

// Event delegation for adding notes, deleting notes, and deleting sections
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-note-btn')) {
        let sectionDiv = e.target.closest('.section');
        let sectionName = sectionDiv.querySelector('h2').textContent;
        let titleInput = sectionDiv.querySelector('.note-title');
        let contentInput = sectionDiv.querySelector('.note-content');
        let title = titleInput.value.trim();
        let content = contentInput.value.trim();
        if (title && content) {
            addNote(sectionName, title, content);
            titleInput.value = '';
            contentInput.value = '';
        }
    } else if (e.target.classList.contains('delete-btn')) {
        let sectionDiv = e.target.closest('.section');
        let sectionName = sectionDiv.querySelector('h2').textContent;
        let noteDiv = e.target.closest('.note');
        let noteIndex = Array.from(sectionDiv.querySelectorAll('.note')).indexOf(noteDiv);
        deleteNote(sectionName, noteIndex);
    } else if (e.target.classList.contains('delete-section-btn')) {
        let sectionName = e.target.closest('.nav-section').dataset.section;
        deleteSection(sectionName);
    } else if (e.target.classList.contains('nav-section')) {
        let sectionName = e.target.dataset.section;
        scrollToSection(sectionName);
    }
});

// Search functionality
document.getElementById('search').addEventListener('input', (e) => {
    filterNotes(e.target.value.trim());
});

// Load data from localStorage
function loadData() {
    let data = localStorage.getItem('notesData');
    return data ? JSON.parse(data) : {};
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('notesData', JSON.stringify(sections));
}

// Display navbar sections
function displayNavbar() {
    let navSections = document.getElementById('nav-sections');
    navSections.innerHTML = '';
    for (let sectionName in sections) {
        let navItem = document.createElement('div');
        navItem.className = 'nav-section';
        navItem.dataset.section = sectionName;
        navItem.innerHTML = `
            <span>${sectionName}</span>
            <button class="delete-section-btn">X</button>
        `;
        navSections.appendChild(navItem);
    }
}

// Display all sections and notes
function displaySections() {
    let container = document.getElementById('sections');
    container.innerHTML = '';
    for (let sectionName in sections) {
        let sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        sectionDiv.id = `section-${sectionName.toLowerCase().replace(/\s+/g, '-')}`;
        let notesHtml = sections[sectionName].map((note, index) => `
            <div class="note">
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <button class="delete-btn" data-index="${index}">X</button>
            </div>
        `).join('');
        sectionDiv.innerHTML = `
            <h2>${sectionName}</h2>
            <div class="notes">${notesHtml}</div>
            <div class="add-note">
                <input type="text" class="note-title" placeholder="Note title">
                <textarea class="note-content" placeholder="Note content"></textarea>
                <button class="add-note-btn">Add Note</button>
            </div>
        `;
        container.appendChild(sectionDiv);
    }
}

// Add a new section
function addSection(sectionName) {
    sections[sectionName] = [];
    saveData();
    displayNavbar();
    displaySections();
}

// Add a new note
function addNote(sectionName, title, content) {
    sections[sectionName].push({ title, content });
    saveData();
    displaySections();
}

// Delete a note
function deleteNote(sectionName, index) {
    sections[sectionName].splice(index, 1);
    saveData();
    displaySections();
}

// Delete a section
function deleteSection(sectionName) {
    delete sections[sectionName];
    saveData();
    displayNavbar();
    displaySections();
}

// Scroll to a section
function scrollToSection(sectionName) {
    let section = document.querySelector(`#section-${sectionName.toLowerCase().replace(/\s+/g, '-')}`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Filter notes based on search term
function filterNotes(searchTerm) {
    let allNotes = document.querySelectorAll('.note');
    allNotes.forEach(note => {
        let title = note.querySelector('h3').textContent.toLowerCase();
        let content = note.querySelector('p').textContent.toLowerCase();
        let searchLower = searchTerm.toLowerCase();
        if (title.includes(searchLower) || content.includes(searchLower)) {
            note.classList.remove('hidden');
        } else {
            note.classList.add('hidden');
        }
    });
}