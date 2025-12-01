# 📝 JEET Notes & Diary

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA](https://img.shields.io/badge/PWA-enabled-orange.svg)
![Offline](https://img.shields.io/badge/offline-ready-brightgreen.svg)

A beautiful, feature-rich notes and diary application that works completely offline. Built with vanilla JavaScript, featuring IndexedDB storage, mood tracking, and PWA capabilities.

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Technology](#-technology-stack) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 📚 Core Functionality
- **Dual Mode**: Switch seamlessly between Notes and Diary modes
- **Section Organization**: Create unlimited sections to organize your content
- **Rich Text Support**: Write detailed notes with full formatting preservation
- **Search & Filter**: Quickly find any note or diary entry with real-time search

### 📔 Diary-Specific Features
- **Mood Tracking**: Track your emotional state with 8 mood options
  - 😄 Amazing
  - 😊 Happy
  - 😐 Neutral
  - 😢 Sad
  - 😠 Angry
  - 😰 Anxious
  - 🤩 Excited
  - 🙏 Grateful
- **Tags System**: Organize entries with customizable tags (family, work, travel, etc.)
- **Date Stamping**: Automatic date tracking for every entry
- **Timeline View**: Sort and view entries chronologically

### 💾 Data Management
- **Triple Storage**: IndexedDB (primary) + localStorage (backup) + export files
- **Persistent Storage API**: Data protected from automatic browser cleanup
- **Export/Import**: Backup and restore your data as JSON files
- **Auto-Sync**: Automatic data synchronization (configurable)
- **Offline-First**: Full functionality without internet connection

### 🎨 User Interface
- **Modern Design**: Beautiful gradient UI with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Touch Gestures**: Swipe navigation on mobile devices
- **Keyboard Shortcuts**: Power user shortcuts for quick actions

### 🚀 Progressive Web App (PWA)
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Full functionality without internet
- **Service Worker**: Smart caching for instant loading
- **Push Notifications**: Optional notification support (future feature)

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support including Tab, Escape, Enter
- **Focus Management**: Proper focus trapping in modals
- **High Contrast Mode**: Support for high contrast preferences
- **Reduced Motion**: Respects user's motion preferences
- **Screen Reader Ready**: ARIA labels and semantic HTML

---

## 🎬 Demo

### Desktop View
```
┌─────────────────────────────────────────────────────┐
│  JEET  │ Notes  Diary │    🔍 Search...   │ ☁️ │
├─────────────────────────────────────────────────────┤
│ Sidebar    │                                        │
│            │  ┌──────────────┐  ┌──────────────┐  │
│ • Personal │  │  Work Notes  │  │  Ideas       │  │
│ • Work     │  │  Meeting...  │  │  New app...  │  │
│ • Ideas    │  └──────────────┘  └──────────────┘  │
│            │                                        │
│ Add Section│  ┌──────────────┐  ┌──────────────┐  │
│            │  │  Dear diary  │  │  Travel      │  │
│            │  │  😊 Happy    │  │  Planning... │  │
│            │  │  #family     │  └──────────────┘  │
└────────────┴──┴──────────────┴────────────────────┘
```

---

## 📦 Installation

### Option 1: Direct Use (Recommended)
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start using immediately - no build process needed!

```bash
git clone https://github.com/JeetInTech/Jeet-Notes.git
cd Jeet-Notes
# Open index.html in your browser
```

### Option 2: Install as PWA
1. Open the app in a supported browser (Chrome, Edge, Safari, Firefox)
2. Click the install button in the address bar or app menu
3. The app will be added to your home screen/applications
4. Launch like any native app!

### Option 3: Deploy to a Server
Deploy to any static hosting service:

**GitHub Pages:**
```bash
# Enable GitHub Pages in repository settings
# Your app will be live at: https://username.github.io/Jeet-Notes
```

**Netlify/Vercel:**
```bash
# Drag and drop the folder to Netlify/Vercel dashboard
# Or connect your GitHub repository for automatic deployment
```

---

## 🎯 Usage

### Getting Started

#### Creating Your First Section
1. Look for the sidebar on the left (click ☰ if hidden)
2. Type a section name in "Add a new section" input
3. Click "Add" or press Enter
4. Your section appears in the sidebar!

#### Adding a Note
1. Click on a section from the sidebar
2. Fill in the title and content fields
3. Click "✨ Add Note"
4. Your note appears instantly!

#### Adding a Diary Entry
1. Switch to "Diary" tab at the top
2. Select a section
3. Choose the date (optional - defaults to today)
4. Select your mood from the dropdown
5. Add tags (comma-separated): `family, weekend, fun`
6. Write your entry
7. Click "✨ Add Entry"

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Focus on new note input |
| `Ctrl/Cmd + S` | Trigger sync |
| `Ctrl/Cmd + E` | Export all data |
| `Ctrl/Cmd + Enter` | Save changes in popup |
| `Esc` | Close popup or cancel editing |
| `Tab` | Navigate between fields |

### Advanced Features

#### Searching
- Use the search bar at the top to filter notes/entries
- Search works across titles and content
- Results update in real-time as you type

#### Exporting Data
1. Click the download button (📥) in the top bar
2. Or press `Ctrl/Cmd + E`
3. A JSON file will be downloaded with all your data
4. Save this file as a backup!

#### Importing Data
1. Click the upload button (📤) in the top bar
2. Select your previously exported JSON file
3. Confirm the import
4. All data will be restored!

#### Editing Entries
**Method 1:** Click on any note/diary entry card
**Method 2:** Click the edit button (✏️) on hover

In the popup editor:
- Edit all fields
- See creation and modification timestamps
- Character count updates automatically
- Press `Ctrl/Cmd + Enter` to save quickly

---

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with ARIA support
- **CSS3**: Modern layouts with Grid, Flexbox, and animations
- **Vanilla JavaScript**: No frameworks - pure ES6+ code

### Storage
- **IndexedDB**: Primary persistent storage
- **localStorage**: Secondary backup storage
- **File System**: Export/Import via JSON files

### PWA Technologies
- **Service Worker**: Offline caching and background sync
- **Web App Manifest**: Installation and app metadata
- **Cache API**: Smart resource caching

### Browser APIs Used
- **Intersection Observer**: Scroll animations
- **Storage API**: Persistent storage request
- **File API**: Export/Import functionality
- **Touch Events**: Mobile gesture support
- **Visibility API**: Background sync triggers

---

## 📁 Project Structure

```
Jeet-Notes/
├── index.html                 # Main HTML file
├── script.js                  # Core application logic
├── styles.css                 # Base styles and responsive design
├── diary-enhancements.css     # Diary-specific styles
├── sw.js                      # Service Worker for PWA
├── manifest.json              # PWA manifest
├── README.md                  # This file
└── icons/                     # App icons (to be added)
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-192.png
    ├── icon-384.png
    └── icon-512.png
```

---

## 🎨 Customization

### Changing Colors
Edit the gradient colors in `styles.css` and `diary-enhancements.css`:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #yourColor1 0%, #yourColor2 100%);
```

### Adding More Moods
Edit `script.js` to add custom moods:

```javascript
const moodEmojis = {
  "amazing": "😄",
  "happy": "😊",
  "yourMood": "😎", // Add your mood here
};
```

### Modifying Storage
Adjust auto-sync interval in `script.js`:

```javascript
// Current: sync every 5 minutes
this.syncInterval = setInterval(() => {
  this.syncToCloud();
}, 5 * 60 * 1000);

// Change to 10 minutes
}, 10 * 60 * 1000);
```

---

## 🔒 Privacy & Security

- **100% Client-Side**: All data stored locally on your device
- **No Server**: No data transmission to external servers
- **No Analytics**: No tracking or analytics code
- **No Cookies**: No cookies or external scripts
- **Offline-First**: Works completely without internet
- **Export Anytime**: Full data portability via export feature

---

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 67+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| Firefox | 62+ | ✅ Full |
| Safari | 11.1+ | ✅ Full |
| Opera | 54+ | ✅ Full |
| Mobile Chrome | 80+ | ✅ Full |
| Mobile Safari | 11.3+ | ✅ Full |

**Required Features:**
- IndexedDB
- Service Workers
- ES6+ JavaScript
- CSS Grid & Flexbox

---

## 📱 Mobile Installation

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Select "Install app" or "Add to Home screen"
4. Follow the prompts

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Name the app and tap "Add"

---

## 🐛 Troubleshooting

### Data Not Saving
- **Check Storage**: Ensure browser allows storage
- **Clear Cache**: Try clearing browser cache (data will be preserved)
- **Export First**: Always export before troubleshooting
- **Check Console**: Open DevTools and check for errors

### Sync Issues
- **Check Connection**: Ensure internet connection (if using cloud sync)
- **Manual Sync**: Press `Ctrl/Cmd + S` to force sync
- **Check Status**: Look at sync indicator in top bar

### Performance Issues
- **Reduce Sections**: Combine similar sections
- **Export Old Data**: Archive old entries and start fresh
- **Clear Browser Data**: Clear everything except site data
- **Update Browser**: Ensure you're using latest browser version

### PWA Not Installing
- **HTTPS Required**: PWA requires HTTPS (or localhost)
- **Manifest Valid**: Check manifest.json is accessible
- **Icons Present**: Ensure app icons exist (optional but recommended)
- **Service Worker**: Check sw.js is registered successfully

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Cloud sync with Google Drive/Dropbox
- [ ] Rich text editor with formatting toolbar
- [ ] Image attachments for diary entries
- [ ] Audio recording for voice notes
- [ ] Calendar view for diary entries
- [ ] Statistics and insights (mood trends, writing streaks)
- [ ] Multiple themes and color schemes
- [ ] Collaboration features (shared sections)
- [ ] Password protection and encryption
- [ ] Markdown support
- [ ] PDF export
- [ ] Print-friendly layouts

### Community Requests
Have an idea? [Open an issue](https://github.com/JeetInTech/Jeet-Notes/issues) or submit a pull request!

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs
1. Check if the bug already exists in [Issues](https://github.com/JeetInTech/Jeet-Notes/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Suggesting Features
1. Open an issue with the "enhancement" label
2. Describe the feature and its benefits
3. Include mockups or examples if possible

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use ES6+ JavaScript
- Follow existing code formatting
- Comment complex logic
- Test on multiple browsers
- Ensure mobile responsiveness

---

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 JeetInTech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**JeetInTech**
- GitHub: [@JeetInTech](https://github.com/JeetInTech)
- Repository: [Jeet-Notes](https://github.com/JeetInTech/Jeet-Notes)

---

## 🙏 Acknowledgments

- Font Awesome for beautiful icons
- Google Fonts inspiration
- The open-source community
- All contributors and users

---

## 📞 Support

Need help? Here's how to get support:

1. **Documentation**: Read this README thoroughly
2. **Issues**: Search [existing issues](https://github.com/JeetInTech/Jeet-Notes/issues)
3. **New Issue**: Create a new issue with details
4. **Discussions**: Join community discussions

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/JeetInTech/Jeet-Notes?style=social)
![GitHub forks](https://img.shields.io/github/forks/JeetInTech/Jeet-Notes?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/JeetInTech/Jeet-Notes?style=social)

---

<div align="center">

Made with ❤️ by JeetInTech

⭐ Star this repo if you find it helpful!

[Back to Top](#-jeet-notes--diary)

</div>
