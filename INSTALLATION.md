# Installation Instructions

## Before You Begin

You'll need:
1. A running Jellyseerr server
2. Your Jellyseerr API key (found in Settings → General → API Key)

## Add Icons (Required)

Before installing, you need to add icon files to the `icons/` directory:

1. Create or download PNG icons in these sizes: 16x16, 32x32, 48x48, 128x128 pixels
2. Name them: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
3. Place them in the `icons/` folder

You can create simple purple circle icons or use any icon generator online.

## Chrome/Edge Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `jellyseerr-browser-extension` folder
5. The extension should now appear in your extensions list

## Firefox Installation

1. Open Firefox and go to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the extension folder and select `manifest.json`
5. The extension will be loaded temporarily (until browser restart)

## Configuration

1. Click the extension icon in your browser toolbar
2. Click "Settings" to open the options page
3. Enter your Jellyseerr server URL (e.g., `https://jellyseerr.yourdomain.com`)
4. Enter your API key
5. Click "Test Connection" to verify
6. Click "Save Settings"

## Testing

1. Go to any IMDB movie page (e.g., https://www.imdb.com/title/tt0111161/)
2. Look for the purple "Request on Jellyseerr" button
3. Try clicking it to test the integration
4. Check your Jellyseerr requests to confirm it worked

## Troubleshooting

- If the button doesn't appear, check the browser console for errors
- Make sure your Jellyseerr server is accessible from your browser
- Verify your API key is correct
- Try refreshing the page after configuration changes

## Note

This extension is designed to work with Jellyseerr's API. Make sure your server is up to date and the API is enabled.