# Jellyseerr Request Button Browser Extension

A browser extension that seamlessly integrates with IMDB, Rotten Tomatoes, TheMovieDB, Letterboxd, Metacritic, and Trakt, allowing you to request movies and TV shows directly from these popular sites to your Jellyseerr server.

![Version](https://img.shields.io/badge/version-1.4.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome](https://img.shields.io/badge/Chrome-Compatible-brightgreen)
![Firefox](https://img.shields.io/badge/Firefox-Compatible-brightgreen)

## ✨ Features

- 🎬 **IMDB Integration**: Adds intelligent request buttons to movie and TV show pages
- 🍅 **Rotten Tomatoes Integration**: Modern flyout interface with status indicators
- 🎭 **TheMovieDB Integration**: Flyout interface with TMDb's signature blue theme
- 🍿 **Letterboxd Integration**: Clean flyout interface for the film community platform
- 🟡 **Metacritic Integration**: Yellow-themed flyout matching Metacritic's distinctive style
- 📊 **Trakt Integration**: Purple/pink themed flyout for the movie tracking platform
- 🔍 **Smart Media Matching**: Advanced search with fallback terms for accurate matching
- 📊 **Real-time Status**: Shows current request status (Available, Pending, Downloading, etc.)
- 📺 **Monitoring Indicator**: Shows if TV shows are being monitored for future releases (NEW!)
- 🏗️ **Modern Architecture**: Built with shared libraries for easy expansion to new sites
- ⚡ **Fast Performance**: Lightweight and optimized for quick loading
- 🔧 **Easy Configuration**: Simple setup through extension options
- 🔄 **Auto-retry**: Intelligent retry logic for network issues
- 🎯 **Perfect Database Alignment**: TMDb integration provides the most accurate matching since Jellyseerr uses TMDb as its data source

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

### TheMovieDB
1. Navigate to any movie or TV show page on TheMovieDB (e.g., `themoviedb.org/movie/12345`)
2. Look for the **Jellyseerr flyout tab** with TMDb's signature blue theme on the right side
3. Click the tab to expand the flyout panel
4. Enjoy **perfect matching** since TMDb is Jellyseerr's primary data source
5. The flyout provides the same status indicators as Rotten Tomatoes
6. **Best accuracy**: TMDb integration offers the most reliable matching and requesting

### Letterboxd
1. Navigate to any film page on Letterboxd (e.g., `letterboxd.com/film/movie-title/`)
2. Look for the **Jellyseerr flyout tab** with clean, minimalist styling on the right side
3. Click the tab to expand the flyout panel
4. **Film community integration**: Perfect for discovering and requesting films from the community
5. The flyout provides the same status indicators as other integrations
6. **Clean design**: Matches Letterboxd's elegant, film-focused aesthetic

### Metacritic
1. Navigate to any movie or TV show page on Metacritic (e.g., `metacritic.com/movie/movie-title` or `metacritic.com/tv/show-title`)
2. Look for the **Jellyseerr flyout tab** with Metacritic's signature yellow theme on the right side
3. Click the tab to expand the flyout panel
4. **Professional reviews integration**: Request content you've researched on Metacritic
5. **Yellow branding**: Custom styling that matches Metacritic's distinctive color scheme
6. **Critical scores context**: Perfect for requesting highly-rated content

### Trakt (NEW!)
1. Navigate to any movie or TV show page on Trakt (e.g., `trakt.tv/shows/show-title` or `app.trakt.tv/shows/show-title`)
2. Look for the **Jellyseerr flyout tab** with Trakt's signature red-to-purple gradient theme on the right side
3. Click the tab to expand the flyout panel
4. **Enhanced matching**: Trakt often provides TMDb IDs for accurate media matching
5. Enjoy the beautiful purple/pink theme that matches Trakt's brand identity
6. **Movie tracking integration**: Perfect for users who track their viewing on Trakt
7. **Both domains supported**: Works on `trakt.tv`, `app.trakt.tv`, and `www.trakt.tv`

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
- **TheMovieDB**: Movie pages (`themoviedb.org/movie/*`) and TV pages (`themoviedb.org/tv/*`) ⭐ **Most Accurate**
- **Letterboxd**: Film pages (`letterboxd.com/film/*`) 🎬 **Film Community**
- **Metacritic**: Movie pages (`metacritic.com/movie/*`) and TV pages (`metacritic.com/tv/*`) 🟡 **Professional Reviews**
- **Trakt**: Movie pages (`trakt.tv/movies/*`, `app.trakt.tv/movies/*`) and TV show pages (`trakt.tv/shows/*`, `app.trakt.tv/shows/*`) 🆕 **Tracking Integration**

## 🏗️ Architecture

### **Shared Library System**
All 6 site integrations use a unified architecture for consistency and maintainability:

```
jellyseerr-browser-extension/
├── manifest.json              # Extension manifest (Manifest v3)
├── src/
│   ├── shared/                # 🔄 Shared Libraries
│   │   ├── BaseIntegration.js # Base class for all sites
│   │   ├── JellyseerrClient.js # API communication
│   │   ├── MediaExtractor.js   # Title/year extraction
│   │   └── UIComponents.js     # Flyout/button creation
│   ├── content/               # 🌐 Site Integrations  
│   │   ├── imdb-integration.js     # IMDB (Yellow theme)
│   │   ├── rt-integration.js       # Rotten Tomatoes (Red theme)
│   │   ├── tmdb-integration.js     # TheMovieDB (Blue theme)
│   │   ├── letterboxd-integration.js # Letterboxd (Green theme)
│   │   ├── metacritic-integration.js # Metacritic (Yellow theme)
│   │   └── trakt-integration.js    # Trakt (Purple/Pink theme)
│   ├── background/
│   │   └── background.js      # Service worker + API handling
│   ├── options/
│   │   ├── options.html       # Settings page
│   │   ├── options.css        # Settings styling
│   │   └── options.js         # Settings logic + manual reload
│   └── popup/
│       ├── popup.html         # Extension popup
│       ├── popup.css          # Popup styling
│       └── popup.js           # Status display
├── icons/                     # Extension icons (16, 32, 48, 128px)
├── README.md                  # Documentation
├── CHANGELOG.md               # Version history
└── TESTING-CHECKLIST.md       # QA testing guide
```

### **Benefits of Shared Architecture**
- ✅ **Consistent UX**: All sites have identical flyout interface
- ✅ **Easy Maintenance**: Bug fixes apply to all sites simultaneously  
- ✅ **Rapid Development**: New sites require only ~200 lines of code
- ✅ **Brand Flexibility**: Each site maintains its unique visual identity

## 🔍 How It Works

1. **Content Scripts**: Injected into all 6 supported sites to extract movie/TV metadata
2. **Media Detection**: BaseIntegration identifies title, year, media type, and IMDB/TMDb IDs from page content
3. **API Communication**: JellyseerrClient handles all background script communication with Jellyseerr API
4. **Search & Match**: Advanced search with multiple fallback terms finds the correct media entry
5. **Status Monitoring**: Real-time status checking with monitoring indicators for TV shows
6. **Request Submission**: Submits request to Jellyseerr with proper media ID and user preferences

## 📊 Status Information

### Available Status Types
The extension shows real-time status for your media requests:
- 🟢 **Available**: Ready to request
- 🟡 **Pending**: Request awaiting approval
- 🔵 **Processing**: Download in progress (see limitations below)
- 🟢 **Ready**: Available to watch on Jellyfin
- 🔴 **Error**: Connection or request failed

### Download Progress Limitations
**Important**: When content shows "Processing...", it means your request has been sent to Radarr/Sonarr and is being downloaded. However, due to API architecture limitations:

- ❌ **No progress percentage**: Jellyseerr doesn't receive detailed progress from Radarr/Sonarr
- ❌ **No download speed**: Speed information is not available through the API
- ❌ **No ETA**: Estimated completion time is not provided

This is a limitation of the Jellyseerr → Radarr/Sonarr integration chain, not the extension itself. For detailed download progress tracking, consider tools like [Monitarr](https://github.com/Boerngine/Monitarr).

## 🔧 Troubleshooting

### Extension Not Appearing
- **IMDB**: Make sure you're on a specific title page (`/title/tt*`), not search results
- **Rotten Tomatoes**: Look for the flyout tab on the right side; try refreshing if not visible
- **TheMovieDB**: Look for the blue-themed flyout tab on the right side of movie/TV pages
- **Letterboxd**: Look for the clean, minimalist flyout tab on film pages
- **Metacritic**: Look for the yellow-themed flyout tab on movie/TV show pages
- **Trakt**: Look for the purple/pink-themed flyout tab on movie/TV show pages
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

### v1.4.0 - Trakt Integration + SPA Navigation 🚀
- ✨ **NEW SITE**: Complete Trakt.tv integration (`trakt.tv`, `app.trakt.tv`) with flyout interface
- 🎨 **Purple/Pink Theme**: Signature red-to-purple gradient matching Trakt's brand identity
- 🔄 **SPA Navigation**: Automatic detection of single-page app navigation (React Router)
- 🔍 **Smart Matching**: TMDb + IMDB ID extraction with URL fallback for SPAs
- 📈 **Tracking Integration**: Perfect for movie/TV show tracking enthusiasts
- 🏗️ **Future-Ready**: SPA detection built into BaseIntegration for all future sites
- ⚡ **Auto-Updates**: Flyout updates automatically when navigating between shows/movies

### v1.3.0 - Previous Release

### v1.1.0 - TheMovieDB Integration 🎆
- ✨ **NEW SITE**: Complete TheMovieDB.org integration with flyout interface
- 🏗️ **Shared Architecture**: Built new modular system with shared libraries
- 🔵 **TMDb Blue Theme**: Custom blue gradient design matching TMDb brand
- 🎯 **Perfect Matching**: Most accurate requests since TMDb is Jellyseerr's data source
- 🔧 **Modular Design**: Easier to add new sites in the future
- 📄 **Future-Ready**: BaseIntegration class enables rapid expansion

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
