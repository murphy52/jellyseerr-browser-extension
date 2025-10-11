# Download Progress Testing Checklist - Issue #6

## 🎯 Quick Test Steps

### Step 1: Setup Download State
- [ ] **Unpause movie in qBittorrent** (choose one that's < 100% complete)
- [ ] **Verify download is active** (check speed > 0 in qBittorrent)
- [ ] **Note the movie name** for finding it on other sites

### Step 2: Check Radarr
- [ ] **Open Radarr web interface**
- [ ] **Find the downloading movie** in Movies list
- [ ] **Check status** - should show downloading/processing
- [ ] **Note what info Radarr shows**: 
  - [ ] Status text
  - [ ] Progress percentage (if any)
  - [ ] Download speed (if any)
  - [ ] ETA (if any)

### Step 3: Check Jellyseerr  
- [ ] **Open Jellyseerr web interface**
- [ ] **Go to Requests page** or search for the movie
- [ ] **Check request status** - should show "Processing" or similar
- [ ] **Note what info Jellyseerr shows**:
  - [ ] Status text
  - [ ] Any progress indicators
  - [ ] Last updated time

### Step 4: Test Browser Extension
- [ ] **Navigate to movie page** (IMDb/TMDb/etc.)
  - Try: `https://www.imdb.com/find/?q=MOVIE_NAME`
  - Or: `https://www.themoviedb.org/search?query=MOVIE_NAME`
- [ ] **Wait for extension to load** (should see button/flyout appear)
- [ ] **Check extension status**:
  - [ ] Button shows "Downloading..." text
  - [ ] Button has pulsing animation
  - [ ] Flyout tab (if present) shows downloading icon

### Step 5: Run Investigation Script
- [ ] **Open browser developer tools** (F12 → Console tab)
- [ ] **Copy/paste issue_6_test.js** into console
- [ ] **Run:** `investigateDownloadProgress()`
- [ ] **Check for debug output**:
  - [ ] `🔍 [DEBUG] DOWNLOADING STATUS DETECTED`
  - [ ] `🔍 [DEBUG] Full mediaDetails object:`
  - [ ] Any progress fields found

### Step 6: Document Findings
- [ ] **Screenshot the debug output**
- [ ] **Note what data is available**:
  - [ ] Progress percentage: ____%
  - [ ] Download speed: ____
  - [ ] ETA: ____
  - [ ] Other fields: ____
- [ ] **Update Issue #6** with findings

## 🚨 Troubleshooting

### If no downloading status appears:
1. **Check extension is working**: Look for any Jellyseerr button/flyout
2. **Verify movie match**: Make sure it's the same movie in all systems
3. **Check Jellyseerr connection**: Extension options → Test Connection
4. **Wait for status sync**: Jellyseerr may take 1-5 minutes to update from Radarr

### If extension shows wrong status:
1. **Force refresh**: Right-click extension → "Reload Extension"
2. **Clear cache**: Run `window.jellyseerr_debug.SITE.updateStatus()` in console
3. **Check different site**: Try IMDb if on TMDb, or vice versa

### Common Status Mappings:
- **qBittorrent**: "Downloading (45%)"
- **Radarr**: "Downloading" or "Processing"  
- **Jellyseerr**: "Processing" or similar
- **Extension**: "Downloading..." (what we want to enhance)

## 🎯 Success Criteria

### Best Case Result:
```
🔍 [DEBUG] Found progress field 'progress': 45
🔍 [DEBUG] Found speed field 'downloadSpeed': "5.2 MB/s"  
🔍 [DEBUG] Found ETA field 'eta': "12 minutes"
```

### Likely Result:
```
🔍 [DEBUG] DOWNLOADING STATUS DETECTED
🔍 [DEBUG] Full mediaDetails object: {status: 3, ...}
🔍 [DEBUG] No progress data found - using basic downloading status
```

### Next Steps Based on Results:
- **Progress data found** → Implement progress bars and enhanced UI
- **Limited data found** → Enhance messaging with available info
- **No extra data** → Document limitations, consider Jellyseerr feature request

## 📋 Quick Commands

### Force Extension Status Update:
```javascript
window.jellyseerr_debug.imdb.updateStatus() // or .tmdb, .rt, etc.
```

### Manual API Test:
```javascript
// Replace 550 with the TMDB ID of your downloading movie
chrome.runtime.sendMessage({
  action: 'getMediaStatus', 
  data: {tmdbId: 550, mediaType: 'movie', title: 'Fight Club'}
}, console.log);
```

### Check Extension Settings:
```javascript  
chrome.storage.sync.get(['jellyseerrUrl', 'jellyseerrApiKey'], console.log);
```

---

**💡 Tip**: The debug output appears in the browser console (F12 → Console), not in the extension popup. Look for messages starting with `🔍 [DEBUG]`.