# Jellyseerr Request Button

A browser extension that seamlessly integrates with popular movie and TV sites, allowing you to request content directly to your Jellyseerr server.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome](https://img.shields.io/badge/Chrome-Compatible-brightgreen)
![Firefox](https://img.shields.io/badge/Firefox-Compatible-brightgreen)

## Supported Sites

- **IMDb** - Movie and TV show pages
- **Rotten Tomatoes** - Movie and TV show reviews  
- **TheMovieDB** - Comprehensive movie database (most accurate matching)
- **Letterboxd** - Film community platform
- **Metacritic** - Professional reviews and scores
- **Trakt** - Movie and TV tracking platform

## Features

- ✨ **Unified Flyout Interface** - Consistent design across all supported sites
- 🎯 **Smart Media Detection** - Automatically extracts title, year, and media type
- 📊 **Real-time Status** - Shows current request status with color indicators
- 🔄 **Intelligent Retry** - Handles network issues gracefully
- 🎨 **Brand Theming** - Each site maintains its unique visual identity
- ⚡ **Fast Performance** - Lightweight and optimized

## Installation

### Chrome/Edge
1. **Download** the latest release: [Download ZIP](https://github.com/murphy52/jellyseerr-browser-extension/archive/refs/heads/main.zip)
2. **Extract** the downloaded ZIP file to a folder on your computer
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right corner
5. Click "Load unpacked" and select the extracted `jellyseerr-browser-extension-main` folder
6. The extension will be installed and ready to configure

### Firefox
1. **Download** the latest release: [Download ZIP](https://github.com/murphy52/jellyseerr-browser-extension/archive/refs/heads/main.zip)
2. **Extract** the downloaded ZIP file to a folder on your computer
3. Open Firefox and navigate to `about:debugging`
4. Click "This Firefox" in the left sidebar
5. Click "Load Temporary Add-on"
6. Navigate to the extracted folder and select the `manifest.json` file

## Setup

1. Click the extension icon in your browser toolbar
2. Click "Settings" to open the options page
3. Enter your Jellyseerr server URL (e.g., `https://jellyseerr.yourdomain.com`)
4. Enter your Jellyseerr API key (found in Settings → General → API Key)
5. Click "Test Connection" to verify your settings
6. Click "Save Settings"

## Usage

1. **Navigate** to any movie or TV show page on supported sites
2. **Look for** the Jellyseerr flyout tab on the right side of your screen
3. **Click the tab** to expand the flyout panel
4. **View status** and click the action button to request content

### Status Indicators
- 🟢 **Green**: Available to request or ready to watch
- 🟡 **Orange**: Request pending approval
- 🔵 **Blue**: Currently downloading/processing
- 🔴 **Red**: Error or connection issue

## Screenshots

See the extension in action across different movie and TV sites:

### IMDb Integration
![IMDb Integration](screenshots/imdb%20Large.jpeg)
*Clean flyout interface on IMDb movie pages with yellow theme matching IMDb's branding*

### Rotten Tomatoes Integration
![Rotten Tomatoes Integration](screenshots/RottenTomatoes%20Large.jpeg)
*Elegant red-themed flyout matching Rotten Tomatoes' signature colors*

### Letterboxd Integration
![Letterboxd Integration](screenshots/letterboxd%20Large.jpeg)
*Minimalist green-themed design perfectly suited for the film community platform*

### Trakt Integration
![Trakt Integration](screenshots/trakt%20Large.jpeg)
*Purple gradient theme matching Trakt's modern branding with comprehensive status display*

## Architecture

The extension uses a modern shared library architecture:

```
src/
├── shared/                    # Shared Libraries
│   ├── BaseIntegration.js    # Base class for all sites
│   ├── JellyseerrClient.js   # API communication
│   ├── MediaExtractor.js     # Title/year extraction
│   └── UIComponents.js       # Flyout interface
├── content/                   # Site Integrations
│   ├── imdb-integration.js   # IMDb (Yellow theme)
│   ├── rt-integration.js     # Rotten Tomatoes (Red theme)
│   ├── tmdb-integration.js   # TheMovieDB (Blue theme)
│   ├── letterboxd-integration.js # Letterboxd (Green theme)
│   ├── metacritic-integration.js # Metacritic (Yellow theme)
│   └── trakt-integration.js  # Trakt (Purple theme)
├── background/
│   └── background.js         # Service worker
├── options/
│   └── options.*             # Settings page
└── popup/
    └── popup.*               # Extension popup
```

## Development

All site integrations share common functionality through the `BaseIntegration` class, making it easy to add new sites with minimal code.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.