# Issue #6 Analysis: Download Progress Tracking

## Current State

### What We Have Now:
- **Basic download status detection**: Case 3 (status = 3) maps to "downloading"
- **Simple UI indicators**: Shows "Downloading..." with pulsing animation
- **Static status**: No progress percentage or real-time updates

### Current Implementation:
```javascript
case 3: // Processing/Downloading  
  result.status = 'downloading';
  result.message = 'Download in progress';
  result.buttonText = 'Downloading...';
  result.buttonClass = 'downloading';
  break;
```

## Research: Jellyseerr API Capabilities

### Questions to Investigate:
1. **Does Jellyseerr provide download progress percentages?**
2. **What information comes from Radarr/Sonarr integration?**
3. **How often does Jellyseerr update download status?**
4. **What additional fields are available in the API response?**

### Jellyseerr API Endpoints to Examine:
- `/api/v1/request` - Request status information
- `/api/v1/request/{requestId}` - Detailed request information
- `/api/v1/movie/{tmdbId}` or `/api/v1/tv/{tmdbId}` - Media-specific details

### Expected Data Structure:
Need to investigate if Jellyseerr provides:
```javascript
{
  status: 3, // downloading
  progress: 65, // percentage
  downloadSpeed: "5.2 MB/s",
  eta: "12 minutes",
  downloadClient: "qBittorrent",
  // ... other fields
}
```

## Implementation Plan

### Phase 1: Investigation (Current Priority)
1. **API Response Analysis**
   - Add debug logging to capture full API responses
   - Check for additional fields when status = 3
   - Test with actual downloading content

2. **Jellyseerr Source Review**
   - Review Jellyseerr's GitHub for Radarr/Sonarr integration
   - Understand how it polls and caches download status
   - Check if it exposes progress data

### Phase 2: Enhanced Status Display (If Progress Available)
1. **Backend Changes**
   - Extract progress percentage from API response
   - Parse additional download metadata (speed, ETA, etc.)
   - Handle cases where progress info is unavailable

2. **Frontend Enhancement**
   - Progress bar component for flyout UI
   - Enhanced button states with percentage
   - Real-time progress updates (polling)

3. **UI Components**
   ```javascript
   // Enhanced downloading status
   {
     status: 'downloading',
     message: 'Downloading (65%)',
     progress: 65,
     downloadSpeed: '5.2 MB/s',
     eta: '12 minutes',
     buttonText: 'Downloading 65%',
     buttonClass: 'downloading'
   }
   ```

### Phase 3: Real-time Updates (Advanced)
1. **Polling Strategy**
   - Implement smart polling for downloading content
   - Reduce API calls when not downloading
   - Auto-refresh progress every 10-30 seconds

2. **WebSocket Alternative**
   - Investigate if Jellyseerr supports WebSocket updates
   - Implement real-time progress streaming if available

## Technical Challenges

### 1. API Limitations
- **If Jellyseerr doesn't expose progress**: Limited to basic "downloading" status
- **If progress is available**: Need to handle polling without overwhelming API
- **Rate limiting**: Need to respect Jellyseerr's API limits

### 2. Data Freshness
- **Jellyseerr polling Radarr/Sonarr**: May have 1-5 minute delays
- **Extension polling Jellyseerr**: Additional delay layer
- **User expectations**: Users expect real-time updates

### 3. UI/UX Considerations
- **Progress bar space**: Limited space in button/flyout UI
- **Performance impact**: Frequent updates shouldn't slow extension
- **Battery impact**: On mobile devices, frequent polling drains battery

## Implementation Steps

### Step 1: Debug API Response (Immediate)
```javascript
// Add to background.js formatMediaStatus()
if (numericStatus === 3) {
  console.log('🔍 [DEBUG] Full downloading status object:', JSON.stringify(mediaDetails, null, 2));
  // Check for progress fields:
  // - progress, percentage, downloadProgress
  // - speed, downloadSpeed, rate
  // - eta, timeRemaining, estimatedCompletion
  // - downloadClient, downloader
}
```

### Step 2: Test with Real Downloads
1. Start a download in Radarr/Sonarr
2. Check Jellyseerr UI for progress display
3. Examine browser extension response
4. Document available fields

### Step 3: Enhance Based on Findings
- **If progress available**: Implement progress bar and polling
- **If limited data**: Improve existing "downloading" display
- **If no additional info**: Document limitations and close issue

## Expected Outcomes

### Best Case Scenario:
- ✅ Progress percentage available from Jellyseerr API
- ✅ Real-time updates with smart polling
- ✅ Enhanced UI with progress bars and ETA
- ✅ Seamless user experience

### Likely Scenario:
- ✅ Basic download detection (current state)
- ✅ Enhanced UI messaging
- ⚠️ Limited progress info from API
- ✅ Improved documentation

### Worst Case Scenario:
- ❌ No additional download info available
- ✅ Current "downloading" status maintained
- ✅ Clear documentation of limitations
- ✅ Feature request to Jellyseerr project

## Next Actions

1. **Immediate**: Add debug logging for downloading status
2. **Test**: Find content in "downloading" state
3. **Analyze**: Review API response for additional fields
4. **Plan**: Implement enhancements based on available data
5. **Document**: Update user expectations based on findings

## Resources

- [Jellyseerr GitHub](https://github.com/Fallenbagel/jellyseerr)
- [Radarr API Documentation](https://radarr.video/docs/api/)
- [Sonarr API Documentation](https://sonarr.tv/docs/api/)
- Extension debug tools: `quick_diagnostic.js` and `performance_test.js`