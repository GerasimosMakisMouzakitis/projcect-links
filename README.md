# Project Links Manager v0.0.2

A modern web application for organizing and managing project links with drag & drop functionality.

![Project Links Manager](https://img.shields.io/badge/version-0.0.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **🎯 Simple Project Creation** - Create projects with just a name
- **🖱️ Drag & Drop Interface** - Drop URLs directly from browser address bar, bookmarks, or web pages
- **📤 Export Functionality** - Export individual projects or all projects as JSON files
- **💾 Persistent Storage** - Uses localStorage to save data between sessions
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🎨 Modern UI** - Clean, intuitive interface with smooth animations
- **🔄 Real-time Updates** - Instant visual feedback for all actions
- **📋 Demo Data** - Includes sample projects to get started

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GerasimosMakisMouzakitis/projcect-links.git
   cd projcect-links
   ```

2. **Serve the files using a local server:**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js (if you have it)
   npx serve .
   
   # Using PHP (if you have it)
   php -S localhost:8000
   ```

3. **Open in your browser:**
   ```
   http://localhost:8000
   ```

## 📖 How to Use

### Creating Projects
1. Enter a project name in the input field
2. Click "Create Project" or press Enter
3. The project will be created and automatically selected

### Adding Links
**Method 1: Drag & Drop (Recommended)**
- Select a project by clicking on it
- Drag URLs from:
  - Browser address bar
  - Bookmarks bar
  - Links from web pages
- Drop into the highlighted drop zone

**Method 2: Manual Entry**
- Select a project
- Click the drop zone
- Enter URL and optional title in the modal
- Click "Add Link"

### Managing Projects
- **Select Project**: Click on any project card to select it
- **Delete Links**: Use the × button next to any link
- **Delete Project**: Use the "Delete" button in the project header
- **Export Project**: Use the "Export" button to download as JSON

### Exporting Data
- **Single Project**: Use the "Export" button on any project
- **All Projects**: Use the "Export All Projects" button at the top

## 🏗️ Technical Details

### File Structure
```
projcect-links/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # This file
```

### Technologies Used
- **HTML5** - Semantic markup and drag & drop API
- **CSS3** - Modern styling with Flexbox/Grid and animations
- **Vanilla JavaScript** - ES6+ classes and localStorage
- **No external dependencies** - Runs entirely in the browser

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎯 Demo Projects

The app comes with two pre-loaded demo projects:

1. **Web Development Resources**
   - MDN Web Docs
   - Stack Overflow
   - GitHub

2. **Design Inspiration**
   - Dribbble
   - Behance
   - Awwwards

## 🔧 Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/GerasimosMakisMouzakitis/projcect-links.git

# Navigate to the directory
cd projcect-links

# Start a local server
python3 -m http.server 8000
```

### Making Changes
The app is built with vanilla web technologies, so you can edit the files directly:
- `index.html` - Structure and content
- `styles.css` - Styling and layout
- `script.js` - Functionality and interactions

## 📝 Changelog

### v0.0.2 (2025-09-19)
- Fixed drag & drop issues preventing browser navigation
- Added success notifications and improved user feedback
- Enhanced drag & drop with better URL extraction
- Added comprehensive usage instructions
- Improved error handling and validation

### v0.0.1 (2025-09-19)
- Initial release
- Basic project creation and management
- Drag & drop functionality
- Export features
- Responsive design
- Demo data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gerasimos Makis Mouzakitis**

- GitHub: [@GerasimosMakisMouzakitis](https://github.com/GerasimosMakisMouzakitis)

## 🌟 Show Your Support

Give a ⭐️ if this project helped you organize your links better!

---

*Created with ❤️ for better link organization and project management.*