# Changelog

All notable changes to the Jellyseerr Request Button extension will be documented in this file.

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