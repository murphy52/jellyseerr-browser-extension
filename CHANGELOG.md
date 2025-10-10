# Changelog

All notable changes to the Jellyseerr Request Button extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-10-10 🚀 MAJOR RELEASE - Trakt Integration + SPA Navigation

### ✨ Added
- **Trakt.tv Integration**: Complete integration with purple/pink gradient theme matching Trakt's brand
- **SPA Navigation Detection**: Automatic detection and handling of single-page app navigation (React Router)
- **app.trakt.tv Support**: Full support for Trakt's React-based app domain
- **Smart URL Fallback**: Title extraction from URL slugs when DOM extraction fails in SPAs
- **6-Site Support**: Complete coverage of major movie/TV platforms
- **Comprehensive Testing Framework**: Detailed testing checklist for all integrations
- **Site Template Documentation**: Templates and guides for adding new integrations
- **Monitoring Indicator**: Shows if TV shows are being monitored for future releases (Issue #4)

### 🏗️ Architecture Revolution
- **BaseIntegration Migration**: All 6 integrations now use unified shared architecture
- **Consistent Flyout UI**: Unified interface design across all supported sites
- **SPA Framework**: Built-in SPA navigation detection using history API override + polling
- **Enhanced Error Handling**: Improved retry logic and error recovery mechanisms
- **Brand-Specific Themes**: Custom styling for each platform maintaining brand consistency

### 🎨 Integrations Enhanced
- **IMDB**: Migrated from button UI to flyout UI with shared architecture
- **Rotten Tomatoes**: Enhanced with new architecture and improved reliability
- **TheMovieDB**: Improved consistency and error handling
- **Letterboxd**: Complete integration with clean, minimalist theme
- **Metacritic**: Yellow-themed integration matching brand colors
- **Trakt**: NEW - Purple/pink gradient with full SPA navigation support

### 📚 Documentation & Quality
- **Complete README Overhaul**: Updated with all 6 integrations and usage instructions
- **Testing Checklist**: Comprehensive testing framework covering all scenarios
- **Code Quality**: Production-ready cleanup with consistent patterns
- **Version Consistency**: All version numbers synchronized across files

### 🔧 Technical Improvements
- **SPA Navigation**: History API detection with automatic content updates
- **Enhanced Media Extraction**: Multiple fallback strategies for reliable data extraction
- **Cross-Site Consistency**: Unified behavior and styling across all platforms
- **Performance Optimization**: Improved loading times and resource management

### 🎯 Supported Sites (6 Total)
- 🎬 **IMDB** - Classic movie database with comprehensive metadata
- 🍅 **Rotten Tomatoes** - Critics and audience scores with red gradient theme
- 🎭 **TheMovieDB** - Most accurate matching (primary Jellyseerr data source) ⭐
- 🍿 **Letterboxd** - Film community platform with clean, elegant design
- 🟡 **Metacritic** - Professional reviews with signature yellow theme
- 📊 **Trakt** - Movie/TV tracking with purple/pink gradient and SPA support

## [1.3.0] - 2025-10-10 (Internal Release)

### ✨ Added
- Foundation work for Trakt integration
- Enhanced BaseIntegration architecture
- Improved shared library system

## [1.1.0] - 2024-10-10 🎆 TheMovieDB Integration

### ✨ Added
- **TheMovieDB Integration**: Complete integration with TMDb's signature blue theme
- **Shared Architecture**: Built new modular system with shared libraries (BaseIntegration, JellyseerrClient, MediaExtractor, UIComponents)
- **Perfect Matching**: Most accurate requests since TMDb is Jellyseerr's primary data source
- **Blue Gradient Theme**: Custom styling matching TMDb's brand identity
- **Modular Design**: Foundation for easy addition of future sites

### 🏗️ Technical Foundation
- **BaseIntegration Class**: Shared functionality for all site integrations
- **Shared Libraries**: Reusable components for consistent behavior
- **Future-Ready Architecture**: Easy expansion framework for new sites

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

### 🚀 Version 1.4.0 Highlights
This major release represents a complete transformation of the extension with 6-site support, SPA navigation capabilities, and unified architecture. Key achievements include Trakt.tv integration, comprehensive shared library system, and production-ready code quality. The extension now supports all major movie/TV platforms with consistent, brand-appropriate theming.

### 🎯 Previous Stable: Version 1.0.4 Highlights
This stable release represented a major milestone with a complete UI overhaul for Rotten Tomatoes, production-ready optimizations, and comprehensive documentation.

### 🔗 Links
- **Repository**: [GitHub](https://github.com/murphy52/jellyseerr-browser-extension)
- **Issues**: [Report a Bug](https://github.com/murphy52/jellyseerr-browser-extension/issues)
- **Releases**: [All Releases](https://github.com/murphy52/jellyseerr-browser-extension/releases)

### 📝 Notes
- All versions follow [Semantic Versioning](https://semver.org/)
- For installation instructions, see [README.md](./README.md)
- For technical details, see individual commit messages in git history

**Made with ❤️ for the Jellyseerr community**
