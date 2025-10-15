# Changelog

All notable changes to the Jellyseerr Request Button extension will be documented in this file.

## [2.0.0] - 2025-10-15

### ✨ Features
- **6-Site Integration**: Complete support for IMDb, Rotten Tomatoes, TheMovieDB, Letterboxd, Metacritic, and Trakt
- **Unified Flyout Interface**: Consistent design across all supported sites
- **Brand Theming**: Each site maintains its unique visual identity and colors
- **Smart Media Detection**: Automatic extraction of title, year, and media type from page content
- **Real-time Status**: Shows current request status with color-coded indicators
- **Intelligent Retry Logic**: Handles network issues and connection failures gracefully

### 🏗️ Architecture
- **Shared Library System**: Modern modular architecture using BaseIntegration, JellyseerrClient, MediaExtractor, and UIComponents
- **Manifest V3**: Full compliance with latest browser extension standards
- **Service Worker**: Background script handling for improved performance
- **Cross-Site Consistency**: Unified behavior and styling patterns

### 🎨 User Experience
- **Status Indicators**: Green (available), Orange (pending), Blue (downloading), Red (error)
- **Responsive Design**: Flyout adapts to different screen sizes
- **Clean Interface**: Minimal, non-intrusive design that doesn't interfere with website experience
- **Fast Performance**: Optimized for quick loading and low resource usage

### 🔧 Technical
- **Enhanced Error Handling**: Comprehensive error recovery and user feedback
- **API Integration**: Full integration with Jellyseerr REST API
- **Multi-domain Support**: Works across all major movie/TV platforms
- **Development Framework**: Easy expansion system for adding new sites