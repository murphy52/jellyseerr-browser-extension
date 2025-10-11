# Troubleshooting Guide: "Extension background script not responding"

## Issue Description
The content script loads successfully but cannot communicate with the background service worker, resulting in the error:
```
Extension background script not responding
```

## Step-by-Step Diagnostic Process

### 1. Check Extension Loading Status

1. **Open Chrome Extensions Page**:
   - Navigate to `chrome://extensions/`
   - Ensure "Developer mode" is enabled (toggle in top-right)

2. **Verify Extension Status**:
   - ✅ Extension should be listed and **enabled**
   - ✅ No error messages should be visible
   - ✅ Extension should show "Manifest V3" 

3. **Check for Load Errors**:
   - Click "Details" on your extension
   - Look for any error messages in the "Errors" section
   - If errors exist, they need to be fixed before proceeding

### 2. Inspect Background Service Worker

1. **Access Background Script Console**:
   - In `chrome://extensions/`, find your extension
   - Click "Details"
   - Look for "Inspect views: background page" or "service worker"
   - If you see "service worker (inactive)", click it to activate

2. **Check Background Console**:
   - Look for any error messages in the console
   - You should see initialization messages when the worker starts

### 3. Test Extension Communication

1. **Open Browser Developer Tools** on IMDb page:
   - Right-click → "Inspect" → "Console" tab

2. **Run Communication Test**:
   ```javascript
   // Test basic connection
   chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
     if (chrome.runtime.lastError) {
       console.error('❌ Connection failed:', chrome.runtime.lastError.message);
     } else {
       console.log('✅ Background script responding:', response);
     }
   });
   ```

3. **Expected Results**:
   - ✅ Should log: `✅ Background script responding: {success: true, data: "pong"}`
   - ❌ If error: Background script is not running or crashed

### 4. Check Extension Settings

1. **Open Extension Options**:
   - Click extension icon in Chrome toolbar
   - Select "Options" or right-click extension → "Options"

2. **Verify Configuration**:
   - ✅ Jellyseerr Server URL is set (e.g., `http://localhost:5055`)
   - ✅ API Key is configured
   - ✅ Test connection button shows success

3. **Test Server Connection**:
   ```javascript
   // Run in browser console on any page
   chrome.runtime.sendMessage({ action: 'testConnection' }, (response) => {
     if (chrome.runtime.lastError) {
       console.error('❌ Connection test failed:', chrome.runtime.lastError.message);
     } else {
       console.log('✅ Server connection:', response);
     }
   });
   ```

## Common Fixes

### Fix 1: Reload the Extension
1. Go to `chrome://extensions/`
2. Find your extension
3. Click the **reload button** (🔄)
4. Refresh the IMDb page and test again

### Fix 2: Reinstall the Extension
1. Go to `chrome://extensions/`
2. Click **Remove** on your extension
3. Click **Load unpacked** and select the extension folder again
4. Configure settings again

### Fix 3: Check Service Worker Status
If the service worker shows as "inactive":
1. In `chrome://extensions/`, click "Details" on your extension
2. Click "service worker (inactive)" to reactivate it
3. Check the console for any startup errors

### Fix 4: Clear Extension Storage
```javascript
// Run in background service worker console
chrome.storage.sync.clear(() => {
  console.log('✅ Storage cleared');
});
```
Then reconfigure your settings.

### Fix 5: Check Chrome Version
- Manifest V3 requires Chrome 88+
- Update Chrome if you're on an older version

## Debug Commands

### Test Extension Communication
```javascript
// Basic ping test
chrome.runtime.sendMessage({ action: 'ping' }, console.log);

// Test settings loading
chrome.storage.sync.get(['jellyseerrUrl', 'jellyseerrApiKey'], (result) => {
  console.log('Settings:', {
    url: result.jellyseerrUrl || 'NOT SET',
    apiKey: result.jellyseerrApiKey ? 'SET' : 'NOT SET'
  });
});

// Force settings reload
chrome.runtime.sendMessage({ action: 'reloadSettings' }, console.log);
```

### Check Extension Status
```javascript
// Check if extension context is valid
if (chrome.runtime && chrome.runtime.id) {
  console.log('✅ Extension context is valid');
  console.log('Extension ID:', chrome.runtime.id);
} else {
  console.log('❌ Extension context is invalid');
}
```

## Specific Error Messages

### "Receiving end does not exist"
- Background service worker has crashed
- Solution: Reload the extension

### "Extension context invalidated"
- Extension was reloaded or updated
- Solution: Refresh the page

### "Could not establish connection"
- Background script is not running
- Solution: Check service worker status

## Success Indicators

When everything is working correctly, you should see:

1. **In IMDb Console**:
   ```
   🎬 [IMDB] Integration script loaded!
   🚀 [IMDB] All shared libraries loaded, initializing integration...
   🔗 [IMDB] BaseIntegration initialized for IMDB
   🔗 [IMDB] Initializing integration...
   🔗 [IMDB] Document ready, starting extraction
   ```

2. **Extension UI**: Button or flyout appears on the page

3. **No Error Messages**: No red error messages in console

## If All Else Fails

1. **Restart Chrome** completely
2. **Check system firewall** (if using localhost Jellyseerr)
3. **Try in Incognito Mode** to test without other extensions
4. **Check Chrome://serviceworker-internals/** for additional debugging info

## Getting Help

If you continue to experience issues:
1. Include your Chrome version: `chrome://version/`
2. Include any console error messages
3. Include your extension settings (without API key)
4. Include the exact steps to reproduce the issue