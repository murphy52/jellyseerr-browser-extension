# Adding New Sites - Developer Guide

Thanks to our refactored architecture, adding a new site is incredibly simple! Sites get Jellyseerr's purple theme by default, and you only need to override colors if you want custom branding.

## Step 1: Create Integration File

Create `src/content/newsite-integration.js`:

```javascript
// NewSite.com Integration for Jellyseerr
console.log('🌐 [NewSite] Integration script loaded!', window.location.href);

class NewSiteIntegration extends BaseIntegration {
  constructor() {
    super('NewSite', {
      debug: false,
      uiTheme: 'flyout', // or 'button'
      retryDelay: 2000,
      retryAttempts: 3
    });
    this.init();
  }

  async extractMediaData() {
    // Extract title, year, mediaType, etc.
    const titleSelectors = [
      'h1.title',
      '.movie-title',
      'h1'
    ];
    
    const title = this.extractor.extractTitle(titleSelectors);
    const year = this.extractor.extractYear(['.year', '.release-date']);
    const mediaType = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';
    
    return this.createMediaData({ title, year, mediaType });
  }

  // OPTIONAL: Only include if you want custom colors
  getSiteSpecificCSS() {
    return `
      /* Custom Brand Colors (optional) */
      .jellyseerr-tab {
        background: linear-gradient(135deg, #your-color 0%, #darker-color 100%) !important;
        border-color: #your-color !important;
      }
      
      .jellyseerr-action-button {
        background: linear-gradient(135deg, #your-color 0%, #darker-color 100%) !important;
        border-color: #your-color !important;
      }
    `;
  }
}

// Initialize
function initializeNewSiteIntegration() {
  if (typeof BaseIntegration !== 'undefined' && 
      typeof JellyseerrClient !== 'undefined' && 
      typeof MediaExtractor !== 'undefined' && 
      typeof UIComponents !== 'undefined') {
    new NewSiteIntegration();
  } else {
    setTimeout(initializeNewSiteIntegration, 100);
  }
}
initializeNewSiteIntegration();
```

## Step 2: Update Manifest

Add to `manifest.json`:

```json
{
  "matches": [
    "https://newsite.com/movie/*",
    "https://newsite.com/tv/*"
  ],
  "js": [
    "src/shared/JellyseerrClient.js",
    "src/shared/MediaExtractor.js", 
    "src/shared/UIComponents.js",
    "src/shared/BaseIntegration.js",
    "src/content/newsite-integration.js"
  ],
  "run_at": "document_end"
}
```

## That's It!

Your new site will automatically get:
- ✅ **Purple Jellyseerr theme** by default
- ✅ **Consistent flyout UI** (same layout as all sites)
- ✅ **Full functionality** (status checking, requesting, etc.)
- ✅ **Error handling** and retry logic
- ✅ **Mobile responsive** design
- ✅ **Dark mode support**

## Color Customization Examples

### Netflix Red
```css
.jellyseerr-tab {
  background: linear-gradient(135deg, #e50914 0%, #b7070f 100%) !important;
  border-color: #e50914 !important;
}
```

### Disney Plus Blue
```css
.jellyseerr-tab {
  background: linear-gradient(135deg, #113ccf 0%, #0e2f99 100%) !important;
  border-color: #113ccf !important;
}
```

### Amazon Prime Blue
```css
.jellyseerr-tab {
  background: linear-gradient(135deg, #00a8e1 0%, #0087b5 100%) !important;
  border-color: #00a8e1 !important;
}
```

The shared architecture handles everything else automatically!