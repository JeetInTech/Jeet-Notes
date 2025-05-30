// Enhanced Notes App with Sync and Mobile Features
class NotesApp {
  constructor() {
    // Data storage
    this.notesSections = {};
    this.diarySections = {};
    this.currentTab = "notes";
    this.editingIndex = null;
    this.popupActive = null;
    this.isMobile = window.innerWidth <= 768;
    this.syncStatus = "offline";
    this.lastSyncTime = null;
    this.syncInterval = null;
    this.cloudStorageKey = "notes-app-cloud-sync";

    // Initialize app
    this.init();
  }

  async init() {
    this.showLoadingSpinner();

    // Load data from multiple sources
    await this.loadAllData();

    // Setup event listeners
    this.setupEventListeners();

    // Initial render
    this.displayNavbar();
    this.displaySections();

    // Setup sync functionality
    this.setupSync();

    // Setup mobile features
    this.setupMobileFeatures();

    // Setup animations
    this.setupAnimations();

    this.hideLoadingSpinner();

    // Show welcome message for first-time users
    this.showWelcomeMessage();
  }

  showLoadingSpinner() {
    const spinner = document.querySelector(".loading-overlay");
    if (spinner) spinner.classList.add("active");
  }

  hideLoadingSpinner() {
    const spinner = document.querySelector(".loading-overlay");
    if (spinner) {
      setTimeout(() => spinner.classList.remove("active"), 500);
    }
  }

  async loadAllData() {
    try {
      // Load from localStorage first
      this.notesSections = this.loadData("notesData") || {};
      this.diarySections = this.loadData("diaryData") || {};

      // Try to sync with cloud storage
      await this.syncFromCloud();
    } catch (error) {
      console.warn("Data loading error:", error);
      this.showSyncStatus("Error loading data", "error");
    }
  }

  setupEventListeners() {
    // Toggle sidebar
    document.getElementById("toggle-btn")?.addEventListener("click", () => {
      this.toggleSidebar();
    });

    // Section search
    document
      .getElementById("section-search")
      ?.addEventListener("input", (e) => {
        this.debounce(() => {
          const searchTerm = e.target.value.trim().toLowerCase();
          this.filterSections(searchTerm, this.currentTab);
        }, 300)();
      });

    // Add section
    document
      .getElementById("add-section-btn")
      ?.addEventListener("click", () => {
        this.addSection();
      });

    // Tab switching
    document.querySelectorAll(".nav-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        this.switchTab(option);
      });
    });

    // Main content search
    document.getElementById("search")?.addEventListener("input", (e) => {
      this.debounce(() => {
        const searchTerm = e.target.value.trim().toLowerCase();
        this.filterContent(searchTerm, this.currentTab);
      }, 300)();
    });

    // Global event delegation
    document.addEventListener("click", (e) => {
      this.handleGlobalClick(e);
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Window resize handler
    window.addEventListener("resize", () => {
      this.debounce(() => {
        this.handleResize();
      }, 250)();
    });

    // Visibility change for sync
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.syncFromCloud();
      }
    });

    // Before unload - save data
    window.addEventListener("beforeunload", () => {
      this.saveAllData();
    });

    // Handle mobile touch events
    this.setupTouchEvents();
  }

  setupTouchEvents() {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Swipe right to open sidebar
      if (deltaX > 100 && Math.abs(deltaY) < 50 && touchStartX < 50) {
        this.openSidebar();
      }
      // Swipe left to close sidebar
      else if (deltaX < -100 && Math.abs(deltaY) < 50) {
        this.closeSidebar();
      }
    });
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    if (wasMobile !== this.isMobile) {
      this.displaySections(); // Re-render for different layouts

      if (!this.isMobile) {
        // Desktop view - ensure sidebar behavior is correct
        document.body.classList.remove("sidebar-open");
      }
    }
  }

  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggle-btn");
    const body = document.body;

    if (sidebar.classList.contains("open")) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggle-btn");
    const body = document.body;

    sidebar.classList.add("open");
    toggleBtn.classList.add("open");
    body.classList.add("sidebar-open");

    // Add backdrop for mobile
    if (this.isMobile) {
      this.addBackdrop();
    }
  }

  closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggle-btn");
    const body = document.body;

    sidebar.classList.remove("open");
    toggleBtn.classList.remove("open");
    body.classList.remove("sidebar-open");

    this.removeBackdrop();
  }

  addBackdrop() {
    if (!document.querySelector(".sidebar-backdrop")) {
      const backdrop = document.createElement("div");
      backdrop.className = "sidebar-backdrop";
      backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 800;
                backdrop-filter: blur(5px);
            `;
      backdrop.addEventListener("click", () => this.closeSidebar());
      document.body.appendChild(backdrop);
    }
  }

  removeBackdrop() {
    const backdrop = document.querySelector(".sidebar-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
  }

  switchTab(option) {
    document.querySelector(".nav-option.active")?.classList.remove("active");
    option.classList.add("active");
    this.currentTab = option.getAttribute("data-tab");

    // Animate tab switch
    const container = document.getElementById("sections");
    container.style.opacity = "0";
    container.style.transform = "translateY(20px)";

    setTimeout(() => {
      this.displayNavbar();
      this.displaySections();
      this.filterSections(
        document.getElementById("section-search")?.value.trim() || "",
        this.currentTab
      );

      container.style.opacity = "1";
      container.style.transform = "translateY(0)";
    }, 200);
  }

  addSection() {
    const sectionInput = document.getElementById("new-section");
    const sectionName = sectionInput.value.trim();

    if (sectionName) {
      const sections =
        this.currentTab === "notes" ? this.notesSections : this.diarySections;

      if (!sections[sectionName]) {
        sections[sectionName] = [];
        this.saveAllData();
        sectionInput.value = "";

        // Animate new section addition
        this.displayNavbar();
        this.displaySections();

        // Scroll to new section
        setTimeout(() => {
          this.scrollToSection(sectionName);
        }, 300);

        this.showSyncStatus("Section added successfully!", "success");
      } else {
        this.showSyncStatus("Section already exists!", "error");
      }
    }
  }

  handleGlobalClick(e) {
    const sectionDiv = e.target.closest(".section");
    const navSection = e.target.closest(".nav-section");
    const entryDiv = e.target.closest(".note, .diary-entry");

    if (e.target.classList.contains("add-note-btn")) {
      this.handleAddNote(sectionDiv);
    } else if (e.target.classList.contains("edit-btn")) {
      this.handleEditNote(sectionDiv, e.target.dataset.index);
    } else if (e.target.classList.contains("delete-btn")) {
      this.handleDeleteNote(sectionDiv, e.target.dataset.index);
    } else if (e.target.classList.contains("delete-section-btn")) {
      this.handleDeleteSection(navSection);
    } else if (
      navSection &&
      !e.target.classList.contains("delete-section-btn")
    ) {
      this.scrollToSection(navSection.dataset.section);
    } else if (
      entryDiv &&
      !e.target.classList.contains("edit-btn") &&
      !e.target.classList.contains("delete-btn")
    ) {
      this.openEditablePopup(entryDiv);
    } else if (
      e.target.classList.contains("cancel-btn") ||
      e.target.classList.contains("popup-overlay")
    ) {
      this.closePopup();
    } else if (e.target.classList.contains("update-btn")) {
      this.handlePopupUpdate(e.target);
    }
  }

  handleAddNote(sectionDiv) {
    const sectionName = sectionDiv.querySelector("h2").textContent;
    const titleInput = sectionDiv.querySelector(".note-title");
    const contentInput = sectionDiv.querySelector(".note-content");
    const dateInput = sectionDiv.querySelector(".note-date");

    const title =
      titleInput.value.trim() ||
      (this.currentTab === "notes" ? "Note title" : "Dear Diary...");
    const content = contentInput.value.trim();
    const date = dateInput
      ? dateInput.value
      : new Date().toISOString().split("T")[0];

    if (content) {
      const sections =
        this.currentTab === "notes" ? this.notesSections : this.diarySections;

      if (this.editingIndex !== null) {
        sections[sectionName][this.editingIndex] = {
          title,
          content,
          date,
          lastModified: Date.now(),
        };
        this.editingIndex = null;
        this.showSyncStatus("Entry updated successfully!", "success");
      } else {
        sections[sectionName].push({
          title,
          content,
          date,
          created: Date.now(),
          lastModified: Date.now(),
        });
        this.showSyncStatus("Entry added successfully!", "success");
      }

      this.saveAllData();
      this.clearInputs(titleInput, contentInput, dateInput);
      sectionDiv.classList.remove("editing");
      this.displaySections();

      // Animate the new note
      setTimeout(() => {
        const newNote = sectionDiv.querySelector(
          ".note:last-child, .diary-entry:last-child"
        );
        if (newNote) {
          newNote.style.animation = "slideInUp 0.5s ease-out";
        }
      }, 100);
    }
  }

  handleEditNote(sectionDiv, index) {
    const sectionName = sectionDiv.querySelector("h2").textContent;
    const item = (
      this.currentTab === "notes" ? this.notesSections : this.diarySections
    )[sectionName][index];

    const titleInput = sectionDiv.querySelector(".note-title");
    const contentInput = sectionDiv.querySelector(".note-content");
    const dateInput = sectionDiv.querySelector(".note-date");

    titleInput.value =
      item.title ||
      (this.currentTab === "notes" ? "Note title" : "Dear Diary...");
    contentInput.value = item.content;
    if (dateInput) dateInput.value = item.date || "";

    this.editingIndex = index;
    sectionDiv.classList.add("editing");

    // Smooth scroll to editing form
    sectionDiv.querySelector(".add-note").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  handleDeleteNote(sectionDiv, index) {
    if (confirm("Are you sure you want to delete this entry?")) {
      const sectionName = sectionDiv.querySelector("h2").textContent;
      const sections =
        this.currentTab === "notes" ? this.notesSections : this.diarySections;

      // Animate removal
      const noteElement = sectionDiv
        .querySelector(`[data-index="${index}"]`)
        .closest(".note, .diary-entry");
      noteElement.style.animation = "fadeOut 0.3s ease-out forwards";

      setTimeout(() => {
        sections[sectionName].splice(index, 1);
        this.saveAllData();
        this.displaySections();
        this.showSyncStatus("Entry deleted successfully!", "success");
      }, 300);
    }
  }

  handleDeleteSection(navSection) {
    const sectionName = navSection.dataset.section;

    if (
      confirm(
        `Are you sure you want to delete the "${sectionName}" section and all its entries?`
      )
    ) {
      const sections =
        this.currentTab === "notes" ? this.notesSections : this.diarySections;
      delete sections[sectionName];

      this.saveAllData();
      this.displayNavbar();
      this.displaySections();
      this.showSyncStatus("Section deleted successfully!", "success");
    }
  }

  openEditablePopup(entryDiv) {
    const sectionName = entryDiv
      .closest(".section")
      .querySelector("h2").textContent;
    const index = entryDiv.querySelector("button").dataset.index;
    const item = (
      this.currentTab === "notes" ? this.notesSections : this.diarySections
    )[sectionName][index];

    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.innerHTML = `
            <div class="popup-content ${
              this.currentTab === "diary" ? "diary-popup" : ""
            }" data-section="${sectionName}" data-index="${index}">
                <div class="header">
                    <span>${
                      item.title ||
                      (this.currentTab === "notes" ? "Note" : "Dear diary...")
                    }</span>
                    <div>
                        <button class="cancel-btn" title="Close">❌</button>
                    </div>
                </div>
                <div class="content">
                    <input type="text" value="${
                      item.title ||
                      (this.currentTab === "notes"
                        ? "Note title"
                        : "Dear Diary...")
                    }" placeholder="Title">
                    ${
                      this.currentTab === "diary"
                        ? `<input type="date" value="${
                            item.date || ""
                          }" placeholder="Date">`
                        : ""
                    }
                    <textarea placeholder="Content">${item.content}</textarea>
                    <div class="popup-actions">
                        <button class="update-btn" data-section="${sectionName}" data-index="${index}">💾 Update</button>
                        <button class="cancel-btn">❌ Cancel</button>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(overlay);
    document.body.classList.add("popup-active");

    setTimeout(() => overlay.classList.add("active"), 10);
    this.popupActive = overlay;

    // Focus on textarea
    setTimeout(() => {
      const textarea = overlay.querySelector("textarea");
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      }
    }, 100);
  }

  handlePopupUpdate(updateBtn) {
    const popupContent = updateBtn.closest(".popup-content");
    const sectionName = updateBtn.dataset.section;
    const index = updateBtn.dataset.index;

    const title =
      popupContent.querySelector('input[type="text"]').value.trim() ||
      (this.currentTab === "notes" ? "Note title" : "Dear Diary...");
    const content = popupContent.querySelector("textarea").value.trim();
    const dateInput = popupContent.querySelector('input[type="date"]');
    const date = dateInput ? dateInput.value : "";

    if (content) {
      const sections =
        this.currentTab === "notes" ? this.notesSections : this.diarySections;
      sections[sectionName][index] = {
        ...sections[sectionName][index],
        title,
        content,
        date,
        lastModified: Date.now(),
      };

      this.saveAllData();
      this.closePopup();
      this.displaySections();
      this.showSyncStatus("Entry updated successfully!", "success");
    }
  }

  closePopup() {
    if (this.popupActive) {
      this.popupActive.classList.remove("active");
      document.body.classList.remove("popup-active");

      setTimeout(() => {
        this.popupActive.remove();
        this.popupActive = null;
      }, 300);
    }
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + N: New note in current section
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      const firstSection = document.querySelector(".section .note-content");
      if (firstSection) firstSection.focus();
    }

    // Escape: Close popup or cancel editing
    if (e.key === "Escape") {
      if (this.popupActive) {
        this.closePopup();
      } else {
        const editingSection = document.querySelector(".section.editing");
        if (editingSection) {
          editingSection.classList.remove("editing");
          this.editingIndex = null;
        }
      }
    }

    // Ctrl/Cmd + S: Sync data
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      this.syncToCloud();
    }
  }

  // Sync functionality
  setupSync() {
    // Auto-sync every 5 minutes
    this.syncInterval = setInterval(() => {
      this.syncToCloud();
    }, 5 * 60 * 1000);

    // Initial sync
    setTimeout(() => {
      this.syncToCloud();
    }, 2000);
  }

  async syncToCloud() {
    try {
      this.showSyncStatus("Syncing...", "syncing");

      const data = {
        notesData: this.notesSections,
        diaryData: this.diarySections,
        lastSync: Date.now(),
        version: "1.0",
      };

      // Simulate cloud storage (replace with actual cloud service)
      const response = await this.simulateCloudSync(data);

      if (response.success) {
        this.lastSyncTime = Date.now();
        this.syncStatus = "online";
        this.showSyncStatus("Synced successfully!", "success");
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      console.warn("Sync error:", error);
      this.syncStatus = "offline";
      this.showSyncStatus("Sync failed - working offline", "error");
    }
  }

  async syncFromCloud() {
    try {
      const cloudData = await this.getCloudData();

      if (cloudData && cloudData.lastSync > (this.lastSyncTime || 0)) {
        this.notesSections = cloudData.notesData || {};
        this.diarySections = cloudData.diaryData || {};
        this.lastSyncTime = cloudData.lastSync;

        this.saveData("notesData", this.notesSections);
        this.saveData("diaryData", this.diarySections);

        this.displayNavbar();
        this.displaySections();

        this.showSyncStatus("Data synced from cloud!", "success");
      }
    } catch (error) {
      console.warn("Cloud sync error:", error);
    }
  }

  // Simulate cloud storage (replace with actual implementation)
  async simulateCloudSync(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store in a more persistent way (could be replaced with actual cloud API)
        localStorage.setItem(this.cloudStorageKey, JSON.stringify(data));
        resolve({ success: true });
      }, 1000 + Math.random() * 2000); // Simulate network delay
    });
  }

  async getCloudData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(this.cloudStorageKey);
        resolve(data ? JSON.parse(data) : null);
      }, 500);
    });
  }

  showSyncStatus(message, type) {
    const statusElement =
      document.querySelector(".sync-status") || this.createSyncStatusElement();

    statusElement.textContent = message;
    statusElement.className = `sync-status show ${type}`;

    setTimeout(() => {
      statusElement.classList.remove("show");
    }, 3000);
  }

  createSyncStatusElement() {
    const status = document.createElement("div");
    status.className = "sync-status";
    document.body.appendChild(status);
    return status;
  }

  // Animation setup
  setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "slideInUp 0.6s ease-out";
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe sections as they're added
    this.observeSections = (sections) => {
      sections.forEach((section) => observer.observe(section));
    };
  }

  setupMobileFeatures() {
    // Add mobile-specific classes
    if (this.isMobile) {
      document.body.classList.add("mobile-view");
    }

    // Mobile menu improvements
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        this.toggleSidebar();
      });
    }
  }

  showWelcomeMessage() {
    const hasData =
      Object.keys(this.notesSections).length > 0 ||
      Object.keys(this.diarySections).length > 0;

    if (!hasData && !localStorage.getItem("welcomeShown")) {
      setTimeout(() => {
        this.showSyncStatus(
          "Welcome! Start by creating your first section.",
          "success"
        );
        localStorage.setItem("welcomeShown", "true");
      }, 1000);
    }
  }

  // Utility functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  clearInputs(...inputs) {
    inputs.forEach((input) => {
      if (input) input.value = "";
    });
  }

  saveAllData() {
    this.saveData("notesData", this.notesSections);
    this.saveData("diaryData", this.diarySections);

    // Trigger cloud sync if online
    if (this.syncStatus === "online") {
      this.debounce(() => this.syncToCloud(), 1000)();
    }
  }

  loadData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn("Error loading data:", error);
      return {};
    }
  }

  saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn("Error saving data:", error);
      this.showSyncStatus("Storage error - data may not be saved", "error");
    }
  }

  // Display functions (enhanced versions)
  displayNavbar() {
    const navSections = document.getElementById("nav-sections");
    if (!navSections) return;

    navSections.innerHTML = "";
    const sections =
      this.currentTab === "notes" ? this.notesSections : this.diarySections;

    for (const sectionName in sections) {
      const navItem = document.createElement("div");
      navItem.className = "nav-section";
      navItem.dataset.section = sectionName;
      navItem.innerHTML = `
                <span>${sectionName} (${sections[sectionName].length})</span>
                <button class="delete-section-btn" title="Delete section">✕</button>
            `;
      navSections.appendChild(navItem);
    }

    this.filterSections(
      document.getElementById("section-search")?.value.trim() || "",
      this.currentTab
    );
  }

  filterSections(searchTerm, tab) {
    const sections = document.querySelectorAll(".nav-section");
    sections.forEach((section) => {
      const sectionName = section
        .querySelector("span")
        .textContent.toLowerCase();
      const isVisible = sectionName.includes(searchTerm);
      section.style.display = isVisible ? "flex" : "none";

      if (isVisible) {
        section.style.animation = "slideInRight 0.3s ease-out";
      }
    });
  }

  displaySections() {
    const container = document.getElementById("sections");
    if (!container) return;

    container.innerHTML = "";
    const sectionsData =
      this.currentTab === "notes" ? this.notesSections : this.diarySections;
    container.className = `container ${this.currentTab}-section`;

    const sectionElements = [];

    for (const sectionName in sectionsData) {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "section";
      sectionDiv.id = `section-${sectionName
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

      const itemsHtml = sectionsData[sectionName]
        .sort((a, b) => (b.created || 0) - (a.created || 0)) // Sort by creation date
        .map(
          (item, index) => `
                    <div class="${
                      this.currentTab === "notes" ? "note" : "diary-entry"
                    }" data-index="${index}">
                        ${
                          this.currentTab === "diary"
                            ? `
                            <div class="header">
                                <span>Dear diary...</span>
                                <input type="date" value="${
                                  item.date || ""
                                }" disabled>
                            </div>
                        `
                            : `<h3>${item.title || "Untitled Note"}</h3>`
                        }
                        <p>${this.truncateText(item.content, 150)}</p>
                        ${
                          item.lastModified
                            ? `<small>Last modified: ${new Date(
                                item.lastModified
                              ).toLocaleDateString()}</small>`
                            : ""
                        }
                        <button class="edit-btn" data-index="${index}" title="Edit">✏️</button>
                        <button class="delete-btn" data-index="${index}" title="Delete">🗑️</button>
                    </div>
                `
        )
        .join("");

      sectionDiv.innerHTML = `
                <h2>${sectionName}</h2>
                <div class="notes">${itemsHtml}</div>
                <div class="add-note">
                    <input type="text" class="note-title" placeholder="${
                      this.currentTab === "notes"
                        ? "Note title"
                        : "Dear Diary..."
                    }" ${this.currentTab === "diary" ? "readonly" : ""}>
                    ${
                      this.currentTab === "diary"
                        ? '<input type="date" class="note-date">'
                        : ""
                    }
                    <textarea class="note-content" placeholder="${
                      this.currentTab === "notes"
                        ? "Write your note here..."
                        : "Write your entry here..."
                    }" rows="4"></textarea>
                    <button class="add-note-btn">✨ Add ${
                      this.currentTab === "notes" ? "Note" : "Entry"
                    }</button>
                </div>
            `;

      container.appendChild(sectionDiv);
      sectionElements.push(sectionDiv);
    }

    // Apply animations
    if (this.observeSections) {
      this.observeSections(sectionElements);
    }
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  }

  scrollToSection(sectionName) {
    const section = document.querySelector(
      `#section-${sectionName.toLowerCase().replace(/\s+/g, "-")}`
    );
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Highlight the section briefly
      section.style.boxShadow = "0 0 20px rgba(230, 0, 35, 0.5)";
      setTimeout(() => {
        section.style.boxShadow = "";
      }, 2000);
    }
  }

  filterContent(searchTerm, tab) {
    const items = document.querySelectorAll(
      `.${tab === "notes" ? "note" : "diary-entry"}`
    );
    let visibleCount = 0;

    items.forEach((item) => {
      const title =
        item
          .querySelector(this.currentTab === "notes" ? "h3" : ".header span")
          ?.textContent.toLowerCase() || "";
      const content = item.querySelector("p").textContent.toLowerCase() || "";
      const isVisible =
        !searchTerm ||
        title.includes(searchTerm) ||
        content.includes(searchTerm);

      if (isVisible) {
        item.style.display = "block";
        item.style.animation = "fadeIn 0.3s ease-out";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    // Show/hide sections based on visible items
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
      const visibleItems = section.querySelectorAll(
        `.${
          tab === "notes" ? "note" : "diary-entry"
        }[style*="display: block"], .${
          tab === "notes" ? "note" : "diary-entry"
        }:not([style*="display: none"])`
      );
      const hasVisibleItems = visibleItems.length > 0 || !searchTerm;
      section.style.display = hasVisibleItems ? "block" : "none";
    });

    // Update search results indicator
    this.updateSearchResults(visibleCount, searchTerm);
  }

  updateSearchResults(count, searchTerm) {
    let indicator = document.querySelector(".search-results-indicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.className = "search-results-indicator";
      const searchContainer = document.querySelector("#search")?.parentElement;
      if (searchContainer) {
        searchContainer.appendChild(indicator);
      } else {
        document.querySelector(".header")?.appendChild(indicator);
      }
    }

    if (searchTerm) {
      indicator.textContent = `Found ${count} ${
        this.currentTab === "notes" ? "notes" : "entries"
      } matching "${searchTerm}"`;
      indicator.style.display = "block";
    } else {
      indicator.style.display = "none";
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.notesApp = new NotesApp();
});
