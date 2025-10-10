# Jellyseerr Request Button Browser Extension

A browser extension that seamlessly integrates with IMDB and Rotten Tomatoes, allowing you to request movies and TV shows directly from these popular sites to your Jellyseerr server.

![Version](https://img.shields.io/badge/version-1.0.4-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome](https://img.shields.io/badge/Chrome-Compatible-brightgreen)
![Firefox](https://img.shields.io/badge/Firefox-Compatible-brightgreen)

## ✨ Features

- 🎬 **IMDB Integration**: Adds intelligent request flyout to movie and TV show pages
- 🍅 **Rotten Tomatoes Integration**: Modern flyout interface with status indicators
- 🔍 **Smart Media Matching**: Advanced search with fallback terms for accurate matching
- 📊 **Real-time Status**: Shows current request status (Available, Pending, Downloading, etc.)
- 🎨 **Modern UI**: Beautiful flyout design inspired by modern web apps
- ⚡ **Fast Performance**: Lightweight and optimized for quick loading
- 🔧 **Easy Configuration**: Simple setup through extension options
- 🔄 **Auto-retry**: Intelligent retry logic for network issues
- 🎯 **Precise Matching**: Uses title, year, and metadata for accurate identification

## Installation

### Chrome/Edge (Manual Installation)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `jellyseerr-browser-extension` folder
5. The extension will be installed and ready to configure

### Firefox (Manual Installation)

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the extension folder and select `manifest.json`

## Setup

1. After installation, click the extension icon in your browser toolbar
2. Click "Settings" to open the options page
3. Enter your Jellyseerr server URL (e.g., `https://jellyseerr.yourdomain.com`)
4. Enter your Jellyseerr API key (found in Jellyseerr Settings → General → API Key)
5. Click "Test Connection" to verify your settings
6. Click "Save Settings"

## 🚀 Usage

### IMDB
1. Navigate to any movie or TV show page on IMDB (e.g., `imdb.com/title/tt1234567`)
2. Look for the Jellyseerr request button that appears automatically
3. Click the button to request the media
4. Watch the button change to show request status

### Rotten Tomatoes  
1. Navigate to any movie or TV show page on Rotten Tomatoes
2. Look for the **Jellyseerr flyout tab** on the right side of your screen
3. Click the tab to expand the flyout panel
4. View current status and click the action button to request
5. The flyout shows real-time status with color-coded indicators:
   - 🟢 **Green**: Available to request or ready to watch
   - 🟡 **Orange**: Request pending approval
   - 🔵 **Blue**: Currently downloading
   - 🔴 **Red**: Error or connection issue

## 🖼️ Screenshots

### Rotten Tomatoes Integration
- **Flyout Tab**: Elegant side panel that doesn't interfere with the website
- **Status Indicators**: Color-coded status with clear visual feedback
- **Modern Design**: Matches modern web app aesthetics

### IMDB Integration  
- **Seamless Buttons**: Integrates naturally with IMDB's design
- **Instant Feedback**: Shows loading, success, and error states

## 🔗 Supported Sites

- **IMDB**: All movie and TV show pages (`imdb.com/title/*`)
- **Rotten Tomatoes**: Movie pages (`rottentomatoes.com/m/*`) and TV pages (`rottentomatoes.com/tv/*`)

## File Structure

```
jellyseerr-browser-extension/
├── manifest.json              # Extension manifest
├── src/
│   ├── background/
│   │   └── background.js      # Service worker for API calls
│   ├── content/
│   │   ├── content-styles.css # Button styles
│   │   ├── imdb-content.js    # IMDB page integration
│   │   └── rt-content.js      # Rotten Tomatoes integration
│   ├── options/
│   │   ├── options.html       # Settings page
│   │   ├── options.css        # Settings page styles
│   │   └── options.js         # Settings page logic
│   └── popup/
│       ├── popup.html         # Extension popup
│       ├── popup.css          # Popup styles
│       └── popup.js           # Popup logic
├── icons/                     # Extension icons
└── README.md                  # This file
```

## How It Works

1. **Content Scripts**: Injected into IMDB and Rotten Tomatoes pages to extract movie/TV metadata
2. **Media Detection**: Identifies title, year, media type (movie/TV), and other metadata from page content
3. **API Integration**: Background script handles communication with Jellyseerr API
4. **Search & Match**: Searches Jellyseerr database to find the correct media entry
5. **Request Submission**: Submits request to Jellyseerr with proper media ID and user preferences

## 🔧 Troubleshooting

### Extension Not Appearing
- **IMDB**: Make sure you're on a specific title page (`/title/tt*`), not search results
- **Rotten Tomatoes**: Look for the flyout tab on the right side; try refreshing if not visible
- Ensure the extension is enabled in your browser's extension manager
- Check that you're on supported page URLs

### Connection Issues
- **Red status indicator**: Server connection failed
- Verify your Jellyseerr server URL is correct and accessible from your browser
- Test your API key using the "Test Connection" button in extension settings
- Check your network connection and firewall settings
- Ensure Jellyseerr server allows CORS requests from your domain

### Request Failures
- **Search failures**: Media might not exist in TMDB/Jellyseerr database
- **Matching issues**: Try different search terms or check the exact title
- **Server errors**: Check Jellyseerr server logs for detailed error information
- **API limits**: Your Jellyseerr server might have rate limiting enabled

### Debug Mode
- Set `DEBUG = true` in content scripts for detailed console logging
- Use browser developer tools (F12) to inspect network requests
- Check the extension's background page for error messages

## 💻 Development

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly on both IMDB and Rotten Tomatoes
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Local Development
1. Clone the repository: `git clone <repo-url>`
2. Load the extension in developer mode:
   - **Chrome**: Go to `chrome://extensions/`, enable Developer mode, click "Load unpacked"
   - **Firefox**: Go to `about:debugging`, click "Load Temporary Add-on"
3. Make changes to the source code
4. Reload the extension to see changes
5. Test on both supported sites

### Architecture
- **Content Scripts**: Extract media data and inject UI elements
- **Background Service Worker**: Handles API communication with Jellyseerr
- **Popup/Options**: User interface for configuration and status
- **Manifest V3**: Uses latest extension API standards

## 📋 Changelog

### v1.0.4 (Stable Release)
- ✨ **Rotten Tomatoes**: Complete redesign with modern flyout interface
- 📊 **Status Tracking**: Real-time status indicators with color coding
- 🔄 **Auto-retry**: Intelligent retry logic for network issues
- 🔍 **Smart Search**: Advanced search with multiple fallback terms
- 🎨 **Modern UI**: Beautiful flyout design inspired by modern web apps
- ⚡ **Performance**: Optimized loading and reduced console logging
- 🐛 **Bug Fixes**: Resolved manifest issues and improved error handling

### v1.0.3
- Enhanced IMDB integration with better media detection
- Improved error handling and user feedback
- Added comprehensive configuration options

### v1.0.2  
- Initial Rotten Tomatoes support
- Basic request functionality for both sites

### v1.0.1
- IMDB integration and core functionality
- Background service worker implementation

## 🔒 Privacy

This extension is designed with privacy in mind:
- ✅ **Local Processing**: All media detection happens locally in your browser
- ✅ **Minimal Data**: Only communicates with your configured Jellyseerr server
- ✅ **No Tracking**: Does not collect, store, or transmit personal data
- ✅ **Secure Storage**: Settings stored locally using browser's secure storage API
- ✅ **Open Source**: Full source code available for transparency

## 🚑 Support

Need help or have suggestions?
- 🐛 **Issues**: Create an issue in the project repository
- 💬 **Discussions**: Join discussions for feature requests
- 📈 **Contributing**: See the Development section above
- ⭐ **Like it?**: Star the repository to show support!

## 📄 License

This project is open source and available under the MIT License. See the LICENSE file for details.

---

**Made with ❤️ for the Jellyseerr community**
