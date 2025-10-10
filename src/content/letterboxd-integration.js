// Letterboxd.com Integration for Jellyseerr
// Uses shared library architecture - built with <100 lines thanks to BaseIntegration!

console.log('🍿 [Letterboxd] Integration script loaded!', window.location.href);

class LetterboxdIntegration extends BaseIntegration {
  constructor() {
    super('Letterboxd', {
      debug: false, // Set to true for debugging
      uiTheme: 'flyout', // Use flyout interface like TMDb and Rotten Tomatoes
      retryDelay: 2000,
      retryAttempts: 3
    });

    this.init();
  }

  /**
   * Extract media data from Letterboxd page
   * @returns {Object|null} Media data object or null
   */
  async extractMediaData() {
    this.log('Extracting media data from Letterboxd page...');

    // Check if we're on a film page
    const url = window.location.pathname;
    const filmMatch = url.match(/^\/film\/([^\/]+)\/?$/);
    
    if (!filmMatch) {
      this.log('URL does not match film pattern:', url);
      return null;
    }

    this.log('Detected film page from URL:', filmMatch[1]);

    // Extract title - Letterboxd has clean, semantic markup
    const titleSelectors = [
      'h1.headline-1.prettify', // Main film title with prettify class
      '.film-header h1.headline-1', // Main film title
      '.film-header h1', // Alternative film header
      'h1.headline-1', // Generic headline
      '.film-title h1', // Older structure
      'h1', // Fallback
      '.film-title', // Last resort
      '[data-film-slug] h1' // Film slug container
    ];

    const title = this.extractor.extractTitle(titleSelectors, {
      cleanupPatterns: [
        /\s*\(\d{4}\)\s*$/, // Remove year in parentheses
        /\s*\d{4}\s*$/, // Remove trailing year
      ]
    });

    if (!title) {
      this.log('No title found');
      return null;
    }

    // Extract year - Letterboxd shows year prominently
    const yearSelectors = [
      'h2.headline-2 a', // Year link in header (most common)
      '.headline-2 a', // Year link
      '.film-header .headline-2 a', // Year link in header
      '.film-header .headline-2', // Year in header without link
      '.film-stats .number a', // Year in film stats
      'small.metadata a', // Year in metadata
      '.film-title .metadata', // Year in metadata
      'time', // Generic time element
      '.film-year' // Direct year class
    ];

    const year = this.extractor.extractYear(yearSelectors, {
      fallback: true
    });

    // Try to find TMDb link (Letterboxd sometimes links to TMDb)
    const tmdbSelectors = [
      'a[href*="themoviedb.org/movie/"]',
      'a[href*="tmdb"]',
      '.film-links a[href*="themoviedb"]'
    ];

    let tmdbId = null;
    for (const selector of tmdbSelectors) {
      const tmdbLinks = document.querySelectorAll(selector);
      for (const link of tmdbLinks) {
        const match = link.href.match(/themoviedb\.org\/movie\/(\d+)/);
        if (match) {
          tmdbId = parseInt(match[1]);
          this.log('Found TMDb ID:', tmdbId, 'from link:', link.href);
          break;
        }
      }
      if (tmdbId) break;
    }

    // Try to extract IMDB ID from links
    const imdbSelectors = [
      'a[href*="imdb.com/title/"]',
      '.film-links a[href*="imdb"]',
      'a[data-track-action="IMDb"]'
    ];

    const imdbId = this.extractor.extractImdbId(imdbSelectors);

    // Extract poster - Letterboxd has beautiful poster displays
    const posterSelectors = [
      '.film-poster img', // Main poster
      '.film-cover img', // Alternative poster
      '.poster img', // Generic poster
      '.film-header img' // Header image
    ];

    const posterUrl = this.extractor.extractPosterUrl(posterSelectors);

    // Extract overview/review - Letterboxd focuses on reviews
    const overviewSelectors = [
      '.film-summary .text-link', // Film summary
      '.film-description', // Film description
      '.review .body-text', // Featured review
      '.film-stats .text', // Film stats text
      '.film-synopsis' // Synopsis
    ];

    const overview = this.extractor.extractOverview(overviewSelectors);

    // Letterboxd is movies-only, so mediaType is always 'movie'
    return this.createMediaData({
      imdbId,
      title,
      year,
      mediaType: 'movie', // Letterboxd is movies only
      posterUrl,
      overview,
      tmdbId // Include TMDb ID if found
    });
  }


  /**
   * Get site-specific CSS for Letterboxd
   */
  getSiteSpecificCSS() {
    return `
      /* Letterboxd Green Theme Override */
      
      .jellyseerr-tab {
        background: linear-gradient(135deg, #00d735 0%, #00b82e 100%) !important;
        border-color: #00d735 !important;
        box-shadow: -2px 0 12px rgba(0, 215, 53, 0.3) !important;
      }
      
      .jellyseerr-tab:hover {
        background: linear-gradient(135deg, #00b82e 0%, #009926 100%) !important;
        border-color: #00b82e !important;
        box-shadow: -6px 0 16px rgba(0, 215, 53, 0.4) !important;
      }
      
      /* Letterboxd green theme for all button states (consistent branding) */
      .jellyseerr-action-button {
        background: linear-gradient(135deg, #00d735 0%, #00b82e 100%) !important;
        border-color: #00d735 !important;
      }
      
      .jellyseerr-action-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #00b82e 0%, #009926 100%) !important;
        border-color: #00b82e !important;
        box-shadow: 0 4px 12px rgba(0, 215, 53, 0.3) !important;
      }
      
      .jellyseerr-request-button {
        background: linear-gradient(135deg, #00d735 0%, #00b82e 100%) !important;
        border-color: #00d735 !important;
      }
      
      .jellyseerr-request-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #00b82e 0%, #009926 100%) !important;
        border-color: #00b82e !important;
        box-shadow: 0 4px 12px rgba(0, 215, 53, 0.3) !important;
      }
      
      /* Letterboxd-specific status colors - optimized for green theme */
      .jellyseerr-status-icon.available {
        background: #52c41a !important; /* Bright green (similar but distinct) */
      }
      
      .jellyseerr-status-icon.pending {
        background: #fa8c16 !important; /* Orange for contrast */
      }
      
      .jellyseerr-status-icon.downloading {
        background: #1890ff !important; /* Blue for contrast */
      }
      
      .jellyseerr-status-icon.ready {
        background: #52c41a !important; /* Bright green */
      }
      
      .jellyseerr-status-icon.partial {
        background: #52c41a !important; /* Bright green */
      }
      
      .jellyseerr-status-icon.error {
        background: #ff4d4f !important; /* Red for contrast */
      }
      
      /* Letterboxd tab status colors - contrasting colors for green theme */
      .jellyseerr-connection-status.available {
        color: #ffffff !important; /* White for visibility on green */
      }
      
      .jellyseerr-connection-status.pending {
        color: #fa8c16 !important; /* Orange */
      }
      
      .jellyseerr-connection-status.downloading {
        color: #1890ff !important; /* Blue */
      }
      
      .jellyseerr-connection-status.ready {
        color: #ffffff !important; /* White */
      }
      
      .jellyseerr-connection-status.partial {
        color: #ffffff !important; /* White */
      }
      
      .jellyseerr-connection-status.error {
        color: #ff4d4f !important; /* Red */
      }
      
      .jellyseerr-connection-status.checking {
        color: #d9d9d9 !important; /* Light gray for loading */
      }
    `;
  }
}

// Wait for shared libraries to load, then initialize
function initializeLetterboxdIntegration() {
  if (typeof BaseIntegration !== 'undefined' && 
      typeof JellyseerrClient !== 'undefined' && 
      typeof MediaExtractor !== 'undefined' && 
      typeof UIComponents !== 'undefined') {
    
    console.log('🚀 [Letterboxd] All shared libraries loaded, initializing integration...');
    new LetterboxdIntegration();
  } else {
    console.log('⏳ [Letterboxd] Waiting for shared libraries to load...');
    setTimeout(initializeLetterboxdIntegration, 100);
  }
}

// Start initialization
initializeLetterboxdIntegration();