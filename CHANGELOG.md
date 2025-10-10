# Changelog

All notable changes to the Jellyseerr Request Button extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2024-10-10 🎉 STABLE RELEASE

### 🎨 Added
- **Modern Flyout Interface**: Complete redesign of Rotten Tomatoes integration with elegant side panel
- **Real-time Status Indicators**: Color-coded status display (Available, Pending, Downloading, Error)
- **Smart Search Algorithm**: Advanced search with multiple fallback terms for better media matching
- **Auto-retry Logic**: Intelligent retry mechanism for network issues and connection failures
- **Professional Documentation**: Comprehensive README with screenshots, troubleshooting, and development guides
- **Debug Functions**: Built-in debugging tools accessible via `window.jellyseerr_debug`

### 🐛 Fixed
- **Manifest Issues**: Resolved `web_accessible_resources` reference to non-existent `jellyseerr-button.js`
- **Parse Errors**: Fixed JavaScript parse errors from missing resource files
- **Connection Stability**: Improved extension background script connection reliability
- **Error Handling**: Enhanced error messages and user feedback for various failure scenarios
- **Performance**: Optimized loading times and reduced resource usage

### 🔧 Changed
- **Production Ready**: Disabled debug logging for optimal performance in production
- **UI/UX Overhaul**: Rotten Tomatoes now uses flyout design instead of inline buttons
- **Status Communication**: Enhanced status reporting between content scripts and background worker
- **Code Organization**: Improved code structure and documentation throughout
- **Version Tagging**: Proper semantic versioning and git tag management

### 🚀 Technical Improvements
- **Manifest V3**: Full compliance with latest browser extension standards
- **Error Recovery**: Better handling of temporary network issues and API failures
- **Responsive Design**: Flyout interface adapts to different screen sizes
- **Accessibility**: Improved keyboard navigation and screen reader support

### 📚 Documentation
- **Complete README Overhaul**: Professional documentation with badges, emojis, and clear sections
- **Installation Guide**: Step-by-step instructions for Chrome and Firefox
- **Troubleshooting**: Comprehensive problem-solving guide
- **Development Guide**: Instructions for contributors and local development
- **Privacy Policy**: Clear explanation of data handling and privacy practices
- **Changelog**: This detailed changelog following industry standards

## [1.0.3] - 2024-10-10

### 🔄 Changed
- Enhanced IMDB integration with better media detection
- Improved error handling and user feedback
- Added comprehensive configuration options
- Cache busting for better extension reload handling

### 🐛 Fixed
- Connection test reliability improvements
- Background script communication issues

## [1.0.2] - 2024-10-10

### ✨ Added
- Initial Rotten Tomatoes support with basic button interface
- Basic request functionality for both IMDB and Rotten Tomatoes sites
- Enhanced media type detection

### 🔧 Changed
- Improved API communication between content scripts and background

## [1.0.1] - 2024-10-09

### Fixed
- Fixed CSS selector issues with `:contains()` pseudo-selector
- Improved media type detection for TV shows vs movies
- Removed debug logging for cleaner console output

### Changed
- Optimized content script performance
- Improved error handling for edge cases

## [1.0.0] - 2024-10-09

### Added
- Initial release of Jellyseerr Request Button extension
- IMDB integration with automatic movie/TV show detection
- Rotten Tomatoes integration with automatic movie/TV show detection
- Jellyseerr API integration for media requests
- Configuration interface for server URL and API key
- Visual feedback with loading states and notifications
- Support for both movies and TV series
- Automatic media matching using title, year, and type
- Extension popup with connection status
- Options page for easy configuration

### Features
- **Multi-site Support**: Works on both IMDB and Rotten Tomatoes
- **Smart Detection**: Automatically detects media information from page content
- **API Integration**: Full integration with Jellyseerr's REST API
- **User Experience**: Clean UI with loading states and error handling
- **Configuration**: Easy setup through browser extension interface

---

## Release Notes

### 🎯 Version 1.0.4 Highlights
This stable release represents a major milestone with a complete UI overhaul for Rotten Tomatoes, production-ready optimizations, and comprehensive documentation. The extension is now ready for public distribution.

### 🔗 Links
- **Repository**: [GitHub](https://github.com/murphy52/jellyseerr-browser-extension)
- **Issues**: [Report a Bug](https://github.com/murphy52/jellyseerr-browser-extension/issues)
- **Releases**: [All Releases](https://github.com/murphy52/jellyseerr-browser-extension/releases)

### 📝 Notes
- All versions follow [Semantic Versioning](https://semver.org/)
- For installation instructions, see [README.md](./README.md)
- For technical details, see individual commit messages in git history

**Made with ❤️ for the Jellyseerr community**
