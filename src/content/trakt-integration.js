// Trakt.tv Integration for Jellyseerr
// Uses shared library architecture with flyout UI and Trakt's signature purple/pink theme

console.log('📊 [Trakt] Integration script loaded!', window.location.href);

class TraktIntegration extends BaseIntegration {
  constructor() {
    super('Trakt', {
      debug: false, // Set to true for debugging
      uiTheme: 'flyout', // Use flyout interface
      retryDelay: 2000,
      retryAttempts: 3
    });

    this.init();
  }

  /**
   * Extract media data from Trakt page
   * @returns {Object|null} Media data object or null
   */
  async extractMediaData() {
    this.log('Extracting media data from Trakt page...');

    // Determine media type from URL - handle both trakt.tv and app.trakt.tv
    const url = window.location.pathname;
    const fullUrl = window.location.href;
    let mediaType = 'movie';
    let urlMatch = null;

    this.log('Analyzing URL:', fullUrl);
    this.log('Pathname:', url);

    // Check for movie pages (both /movies/ and /movie/ patterns)
    if (url.includes('/movies/') || url.includes('/movie/')) {
      mediaType = 'movie';
      urlMatch = url.match(/\/(movies?)\/([^\/\?]+)/);
    }
    // Check for TV show pages (both /shows/ and /show/ patterns)
    else if (url.includes('/shows/') || url.includes('/show/')) {
      mediaType = 'tv';
      urlMatch = url.match(/\/(shows?)\/([^\/\?]+)/);
    }
    else {
      this.log('URL does not match movie or show pattern:', url);
      return null;
    }

    this.log('URL match result:', urlMatch);

    if (!urlMatch) {
      this.log('Could not extract media slug from URL:', url);
      return null;
    }

    this.log(`Detected ${mediaType} page from URL:`, urlMatch[2]);

    // Extract title - Trakt has clean, semantic structure
    // Enhanced selectors for both trakt.tv and app.trakt.tv
    const titleSelectors = [
      '[data-test-id="movie-title"]', // Movie title
      '[data-test-id="show-title"]', // Show title  
      'h1[itemprop="name"]', // Structured data title
      '.summary h1', // Summary title
      '.movie-title h1', // Movie title wrapper
      '.show-title h1', // Show title wrapper
      'h1.title', // Generic title
      '.title h1', // Alternative title
      '.header h1', // Header title
      '.show-header h1', // Show header
      '.movie-header h1', // Movie header
      'h1', // Fallback
      '.page-title h1', // Page title
      'title' // HTML title as last resort
    ];

    this.log('Searching for title with selectors:', titleSelectors);

    let title = this.extractor.extractTitle(titleSelectors, {
      cleanupPatterns: [
        /\s*\(\d{4}\)\s*$/, // Remove year in parentheses
        /\s*\d{4}\s*$/, // Remove trailing year
        /\s*-\s*Trakt.*$/, // Remove Trakt suffix (flexible)
        /\s*\|\s*Trakt.*$/, // Remove | Trakt suffix
        /^Trakt Web:\s*/, // Remove "Trakt Web:" prefix
      ]
    });

    this.log('Extracted title before cleanup:', title);

    // For app.trakt.tv React SPA, if we only got generic title, extract from URL
    if (!title || title === 'Trakt Web' || title.trim() === '') {
      this.log('Title extraction failed, trying to extract from URL slug');
      if (urlMatch && urlMatch[2]) {
        // Convert URL slug to title (e.g., "peacemaker-2022" -> "Peacemaker")
        title = urlMatch[2]
          .replace(/-\d{4}$/, '') // Remove year suffix
          .replace(/-/g, ' ') // Replace dashes with spaces
          .replace(/\b\w/g, l => l.toUpperCase()); // Title case
        this.log('Extracted title from URL slug:', title);
      }
    }

    this.log('Final extracted title:', title);

    if (!title) {
      this.log('No title found');
      return null;
    }

    // Extract year from multiple sources
    const yearSelectors = [
      '.summary .year', // Summary year
      '[data-test-id="movie-year"]', // Movie year
      '[data-test-id="show-year"]', // Show year
      '.movie-stats .year', // Movie stats year
      '.show-stats .year', // Show stats year
      'time[datetime]', // Time element
      '.release-date', // Release date
      '.aired', // Air date for TV shows
      '.metadata .year' // Metadata year
    ];

    const year = this.extractor.extractYear(yearSelectors, {
      fallback: true
    });

    // Try to find TMDb ID - Trakt often has TMDb links/data
    let tmdbId = null;
    const tmdbSelectors = [
      'a[href*="themoviedb.org"]',
      '[data-tmdb-id]',
      '.external-links a[href*="tmdb"]'
    ];

    for (const selector of tmdbSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        if (element.href) {
          const match = element.href.match(/themoviedb\.org\/(movie|tv)\/(\d+)/);
          if (match) {
            tmdbId = parseInt(match[2]);
            this.log('Found TMDb ID:', tmdbId, 'from link:', element.href);
            break;
          }
        }
        if (element.dataset.tmdbId) {
          tmdbId = parseInt(element.dataset.tmdbId);
          this.log('Found TMDb ID from data attribute:', tmdbId);
          break;
        }
      }
      if (tmdbId) break;
    }

    // Try to find IMDB ID
    const imdbSelectors = [
      'a[href*="imdb.com/title/"]',
      '[data-imdb-id]',
      '.external-links a[href*="imdb"]'
    ];

    const imdbId = this.extractor.extractImdbId(imdbSelectors);

    // Extract poster - Trakt has prominent poster displays
    const posterSelectors = [
      '.poster img', // Main poster
      '.movie-poster img', // Movie poster
      '.show-poster img', // Show poster
      '[data-test-id="poster"] img', // Test ID poster
      '.summary-poster img', // Summary poster
      '.fanart img', // Fanart image
      '.poster-container img' // Poster container
    ];

    const posterUrl = this.extractor.extractPosterUrl(posterSelectors);

    // Extract overview/plot
    const overviewSelectors = [
      '[data-test-id="movie-overview"]', // Movie overview
      '[data-test-id="show-overview"]', // Show overview
      '.summary .overview', // Summary overview
      '.plot .overview', // Plot overview
      '[itemprop="description"]', // Structured data description
      '.description', // Generic description
      '.synopsis', // Synopsis
      '.plot' // Plot
    ];

    const overview = this.extractor.extractOverview(overviewSelectors);

    // Create standardized media data
    return this.createMediaData({
      imdbId,
      title,
      year,
      mediaType,
      posterUrl,
      overview,
      tmdbId // Include TMDb ID if found
    });
  }

  /**
   * Get site-specific CSS for Trakt with signature purple/pink theme
   */
  getSiteSpecificCSS() {
    return `
      /* Trakt Purple/Pink Theme Override */
      
      .jellyseerr-tab {
        background: linear-gradient(135deg, #ed1c24 0%, #932b86 100%) !important;
        border-color: #ed1c24 !important;
        box-shadow: -2px 0 12px rgba(237, 28, 36, 0.3) !important;
      }
      
      .jellyseerr-tab:hover {
        background: linear-gradient(135deg, #932b86 0%, #6d1f64 100%) !important;
        border-color: #932b86 !important;
        box-shadow: -6px 0 16px rgba(237, 28, 36, 0.4) !important;
      }
      
      .jellyseerr-action-button {
        background: linear-gradient(135deg, #ed1c24 0%, #932b86 100%) !important;
        border-color: #ed1c24 !important;
        color: white !important;
      }
      
      .jellyseerr-action-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #932b86 0%, #6d1f64 100%) !important;
        border-color: #932b86 !important;
        box-shadow: 0 4px 12px rgba(237, 28, 36, 0.3) !important;
      }
      
      .jellyseerr-request-button {
        background: linear-gradient(135deg, #ed1c24 0%, #932b86 100%) !important;
        border-color: #ed1c24 !important;
        color: white !important;
      }
      
      .jellyseerr-request-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #932b86 0%, #6d1f64 100%) !important;
        border-color: #932b86 !important;
        box-shadow: 0 4px 12px rgba(237, 28, 36, 0.3) !important;
      }
      
      /* Trakt-specific status colors */
      .jellyseerr-status-icon.available {
        background: #52c41a !important; /* Green for available */
      }
      
      .jellyseerr-status-icon.pending {
        background: #fa8c16 !important; /* Orange for pending */
      }
      
      .jellyseerr-status-icon.error {
        background: #ed1c24 !important; /* Trakt red for errors */
      }
      
      /* Special styling for Trakt's dark theme */
      @media (prefers-color-scheme: dark) {
        .jellyseerr-tab {
          box-shadow: -2px 0 12px rgba(237, 28, 36, 0.5) !important;
        }
        
        .jellyseerr-panel {
          background: #1a1a1a !important;
          border-color: #ed1c24 !important;
        }
      }
    `;
  }
}

// Wait for shared libraries to load, then initialize
function initializeTraktIntegration() {
  if (typeof BaseIntegration !== 'undefined' && 
      typeof JellyseerrClient !== 'undefined' && 
      typeof MediaExtractor !== 'undefined' && 
      typeof UIComponents !== 'undefined') {
    
    console.log('🚀 [Trakt] All shared libraries loaded, initializing integration...');
    new TraktIntegration();
  } else {
    console.log('⏳ [Trakt] Waiting for shared libraries to load...');
    setTimeout(initializeTraktIntegration, 100);
  }
}

// Start initialization
initializeTraktIntegration();