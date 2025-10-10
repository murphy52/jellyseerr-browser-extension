// IMDB.com Integration for Jellyseerr
// Uses shared library architecture with button UI and default Jellyseerr purple theme

console.log('🎬 [IMDB] Integration script loaded!', window.location.href);

class IMDBIntegration extends BaseIntegration {
  constructor() {
    super('IMDB', {
      debug: false, // Set to true for debugging
      uiTheme: 'flyout', // Use flyout interface like all other sites
      retryDelay: 2000,
      retryAttempts: 3
    });

    this.init();
  }

  /**
   * Extract media data from IMDB page
   * @returns {Object|null} Media data object or null
   */
  async extractMediaData() {
    this.log('Extracting media data from IMDB page...');

    // Extract IMDB ID from URL
    const urlMatch = window.location.pathname.match(/\/title\/(tt\d+)/);
    if (!urlMatch) {
      this.log('No IMDB ID found in URL:', window.location.pathname);
      return null;
    }

    const imdbId = urlMatch[1];
    this.log('Found IMDB ID:', imdbId);

    // Extract title using comprehensive selectors
    const titleSelectors = [
      '[data-testid="hero-title-block__title"]', // Modern IMDB title
      'h1[data-testid="hero__pageTitle"] span', // Hero page title
      'h1.titleBar-title', // Title bar
      'h1 .itemprop[itemprop="name"]', // Structured data
      '.title_wrapper h1', // Legacy wrapper
      '.originalTitle', // Original title
      'h1 span[class*="TitleHeader"]' // Title header variations
    ];

    const title = this.extractor.extractTitle(titleSelectors, {
      cleanupPatterns: [
        /\s*\(\d{4}\)\s*$/, // Remove year in parentheses
        /\s*\d{4}\s*$/, // Remove trailing year
        /\s*-\s*IMDb\s*$/, // Remove IMDB suffix
      ]
    });

    if (!title) {
      this.log('No title found');
      return null;
    }

    // Extract year from multiple sources
    const yearSelectors = [
      '[data-testid="hero-title-block__metadata"] a', // Modern metadata
      '.sc-69e49b85-0 a[href*="/year/"]', // Year link
      '.titleBar-desktopSpacing a[href*="/year/"]', // Desktop year
      'span.titleYear a', // Title year
      '.subtext a[href*="year"]', // Subtext year
      '[data-testid="title-pc-principal-credit"] a[href*="year"]' // Principal credit year
    ];

    const year = this.extractor.extractYear(yearSelectors, {
      fallback: true
    });

    // Determine media type (movie vs TV)
    const mediaType = this.determineMediaType();

    // Extract poster using IMDB's poster selectors
    const posterSelectors = [
      '[data-testid="hero-media__poster"] img', // Hero poster
      '.poster img', // Generic poster
      '.ipc-media--poster-27x40 img', // Standard poster size
      'img.titlereference-primary-image', // Title reference
      '.ipc-media img[class*="poster"]' // Any poster media
    ];

    const posterUrl = this.extractor.extractPosterUrl(posterSelectors);

    // Extract plot/overview
    const overviewSelectors = [
      '[data-testid="plot-summary-wrapper"] [data-testid="plot-xl"]', // Extended plot
      '[data-testid="plot"] span', // Plot span
      '.summary_text', // Summary text
      '.plot_summary .summary_text', // Plot summary
      '[data-testid="storyline-plot-summary"] span' // Storyline plot
    ];

    const overview = this.extractor.extractOverview(overviewSelectors);

    // Create standardized media data
    return this.createMediaData({
      imdbId,
      title,
      year,
      mediaType,
      posterUrl,
      overview
    });
  }

  /**
   * Determine if this is a movie or TV show based on page content
   */
  determineMediaType() {
    // Check for TV series indicators
    const tvIndicatorSelectors = [
      '[data-testid="hero-title-block__metadata"] .ipc-inline-list__item',
      '[data-testid="hero-title-block__metadata"] li',
      '.subtext',
      '.title-overview .subtext'
    ];

    for (const selector of tvIndicatorSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent.toLowerCase();
        if (text.includes('tv series') || 
            text.includes('tv mini series') || 
            text.includes('miniseries') ||
            text.includes('episodes')) {
          this.log('Detected TV series from text:', text);
          return 'tv';
        }
      }
    }

    // Check URL for TV indicators
    if (window.location.href.includes('/episodes/')) {
      this.log('Detected TV series from URL (episodes)');
      return 'tv';
    }

    // Default to movie
    this.log('Defaulting to movie type');
    return 'movie';
  }


  /**
   * Get site-specific CSS for IMDB with signature yellow/gold theme
   */
  getSiteSpecificCSS() {
    return `
      /* IMDB Yellow/Gold Theme Override */
      
      .jellyseerr-tab {
        background: linear-gradient(135deg, #f5c518 0%, #e6a200 100%) !important;
        border-color: #f5c518 !important;
        box-shadow: -2px 0 12px rgba(245, 197, 24, 0.3) !important;
        color: #000 !important; /* Dark text on yellow background */
      }
      
      .jellyseerr-tab:hover {
        background: linear-gradient(135deg, #e6a200 0%, #cc8c00 100%) !important;
        border-color: #e6a200 !important;
        box-shadow: -6px 0 16px rgba(245, 197, 24, 0.4) !important;
      }
      
      .jellyseerr-tab-text {
        color: #000 !important; /* Dark text for readability on yellow */
      }
      
      .jellyseerr-action-button {
        background: linear-gradient(135deg, #f5c518 0%, #e6a200 100%) !important;
        border-color: #f5c518 !important;
        color: #000 !important; /* Dark text on yellow */
      }
      
      .jellyseerr-action-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #e6a200 0%, #cc8c00 100%) !important;
        border-color: #e6a200 !important;
        box-shadow: 0 4px 12px rgba(245, 197, 24, 0.3) !important;
      }
      
      .jellyseerr-request-button {
        background: linear-gradient(135deg, #f5c518 0%, #e6a200 100%) !important;
        border-color: #f5c518 !important;
        color: #000 !important; /* Dark text on yellow */
      }
      
      .jellyseerr-request-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #e6a200 0%, #cc8c00 100%) !important;
        border-color: #e6a200 !important;
        box-shadow: 0 4px 12px rgba(245, 197, 24, 0.3) !important;
      }
      
      /* IMDB-specific status colors - optimized for yellow theme */
      .jellyseerr-status-icon.available {
        background: #00d72f !important; /* IMDB green for available content */
      }
      
      .jellyseerr-status-icon.pending {
        background: #ff8800 !important; /* Orange for pending */
      }
      
      .jellyseerr-status-icon.downloading {
        background: #0078d4 !important; /* Blue for downloading */
      }
      
      .jellyseerr-status-icon.ready {
        background: #00d72f !important; /* IMDB green for ready */
      }
      
      .jellyseerr-status-icon.partial {
        background: #00d72f !important; /* IMDB green for partial */
      }
      
      .jellyseerr-status-icon.error {
        background: #d32f2f !important; /* Red for errors (better contrast than yellow) */
      }
      
      /* IMDB tab status colors - black to match tab text on yellow background */
      .jellyseerr-connection-status.available {
        color: #000000 !important; /* Black like tab text - no color clash */
      }
      
      .jellyseerr-connection-status.pending {
        color: #000000 !important; /* Black like tab text - much better visibility */
      }
      
      .jellyseerr-connection-status.downloading {
        color: #0078d4 !important; /* Keep blue - works well on yellow */
      }
      
      .jellyseerr-connection-status.ready {
        color: #000000 !important; /* Black like tab text */
      }
      
      .jellyseerr-connection-status.partial {
        color: #000000 !important; /* Black like tab text */
      }
      
      .jellyseerr-connection-status.error {
        color: #d32f2f !important; /* Red for visibility */
      }
      
      .jellyseerr-connection-status.checking {
        color: #666666 !important; /* Dark gray for loading on yellow */
      }
    `;
  }
}

// Wait for shared libraries to load, then initialize
function initializeIMDBIntegration() {
  if (typeof BaseIntegration !== 'undefined' && 
      typeof JellyseerrClient !== 'undefined' && 
      typeof MediaExtractor !== 'undefined' && 
      typeof UIComponents !== 'undefined') {
    
    console.log('🚀 [IMDB] All shared libraries loaded, initializing integration...');
    new IMDBIntegration();
  } else {
    console.log('⏳ [IMDB] Waiting for shared libraries to load...');
    setTimeout(initializeIMDBIntegration, 100);
  }
}

// Start initialization
initializeIMDBIntegration();