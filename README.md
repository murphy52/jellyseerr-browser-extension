# Jellyseerr Request Button Browser Extension

A browser extension that adds request buttons to IMDB and Rotten Tomatoes pages, allowing you to easily add movies and TV shows to your Jellyseerr requests directly from these popular movie databases.

## Features

- ✅ **IMDB Integration**: Adds request buttons to movie and TV show pages on IMDB
- ✅ **Rotten Tomatoes Integration**: Adds request buttons to movie and TV show pages on Rotten Tomatoes  
- ✅ **Automatic Media Matching**: Uses title, year, and other metadata for accurate matching
- ✅ **Visual Feedback**: Loading states, success/error notifications, and button state changes
- ✅ **Clean UI**: Styled buttons that integrate well with both sites
- ✅ **Configuration**: Easy setup through extension options page

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

## Usage

1. Navigate to any movie or TV show page on IMDB or Rotten Tomatoes
2. Look for the purple "Request on Jellyseerr" button (usually appears near ratings/metadata)
3. Click the button to add the media to your Jellyseerr requests
4. The button will show loading state, then success or error feedback
5. You'll receive a notification confirming the request was submitted

## Supported Sites

- **IMDB**: `imdb.com/title/*` pages
- **Rotten Tomatoes**: `rottentomatoes.com/m/*` and `rottentomatoes.com/tv/*` pages

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

## Troubleshooting

### Button Not Appearing
- Make sure you're on a specific movie/TV show page (not search results or lists)
- Check that the extension is properly configured in settings
- Try refreshing the page

### Connection Issues
- Verify your Jellyseerr server URL is correct and accessible
- Check that your API key is valid (test in extension settings)
- Ensure your Jellyseerr server allows requests from your browser (CORS)

### Request Failures
- The movie/TV show might not be in the Jellyseerr database
- Check Jellyseerr logs for more detailed error information
- Try requesting the media directly in Jellyseerr to confirm it's available

## Development

To modify or contribute to this extension:

1. Clone the repository
2. Make your changes
3. Load the extension in developer mode to test
4. Ensure all content scripts, background scripts, and UI components work correctly

## Privacy

This extension:
- Only accesses IMDB and Rotten Tomatoes pages you visit
- Communicates only with your configured Jellyseerr server
- Does not track or store personal data beyond your server configuration
- Stores settings locally using Chrome's sync storage API

## Support

For issues, suggestions, or contributions, please visit the project repository or create an issue.

## License

This project is open source. See the LICENSE file for details.
