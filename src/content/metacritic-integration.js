// Metacritic.com Integration for Jellyseerr
// Uses shared library architecture with flyout UI and Metacritic's signature yellow theme

console.log('🟡 [Metacritic] Integration script loaded!', window.location.href);

class MetacriticIntegration extends BaseIntegration {
  constructor() {
    super('Metacritic', {
      debug: false, // Set to true for debugging
      uiTheme: 'flyout', // Use flyout interface like other sites
      retryDelay: 2000,
      retryAttempts: 3
    });

    this.init();
  }

  /**
   * Extract media data from Metacritic page
   * @returns {Object|null} Media data object or null
   */
  async extractMediaData() {
    this.log('Extracting media data from Metacritic page...');

    // Determine if this is a movie or TV show based on URL
    const url = window.location.pathname;
    let mediaType = 'movie';
    let urlMatch = null;

    // Check for movie pages
    if (url.includes('/movie/')) {
      mediaType = 'movie';
      urlMatch = url.match(/\/movie\/([^\/]+)/);
    }
    // Check for TV show pages
    else if (url.includes('/tv/')) {
      mediaType = 'tv';
      urlMatch = url.match(/\/tv\/([^\/]+)/);
    }
    else {
      this.log('URL does not match movie or TV pattern:', url);
      return null;
    }

    if (!urlMatch) {
      this.log('Could not extract media slug from URL:', url);
      return null;
    }

    this.log(`Detected ${mediaType} page from URL:`, urlMatch[1]);

    // Extract title - Metacritic has different structures for movies vs TV
    const titleSelectors = [
      'h1[data-testid="product-title"]', // Modern Metacritic title
      '.product_page_title h1', // Classic title structure
      '.product_title h1', // Alternative title
      'h1.product_title', // Direct title class
      '.c-productHero_title h1', // Hero section title
      '.product-title h1', // Product title
      'h1', // Generic fallback
      '.page_title', // Page title fallback
      '[data-testid="title"] h1' // Test ID based selector
    ];

    const title = this.extractor.extractTitle(titleSelectors, {
      cleanupPatterns: [
        /\s*\(\d{4}\)\s*$/, // Remove year in parentheses
        /\s*\d{4}\s*$/, // Remove trailing year
        /\s*-\s*Metacritic\s*$/, // Remove Metacritic suffix
        /\s*Reviews\s*$/, // Remove Reviews suffix
      ]
    });

    if (!title) {
      this.log('No title found');
      return null;
    }

    // Extract year - Metacritic shows release dates prominently
    const yearSelectors = [
      '.product_data .release_date span', // Release date in product data
      '.c-productDetails_section .release-date', // Modern release date
      '.summary_detail .release_date span', // Summary release date
      '.product_details .release_date', // Product details
      '[data-testid="release-date"]', // Test ID for release date
      '.release_date', // Generic release date
      '.product_year', // Product year
      '.c-productHero_meta .year', // Hero meta year
      'time[datetime]', // Time element with datetime
      '.product_data .data' // Generic product data
    ];

    const year = this.extractor.extractYear(yearSelectors, {
      fallback: true,
      multiElementSelector: '.product_data .data' // Check multiple data elements
    });

    // Try to find IMDb links - Metacritic often links to IMDb
    const imdbSelectors = [
      'a[href*="imdb.com/title/"]',
      '.product_links a[href*="imdb"]',
      '.c-productLinks a[href*="imdb"]',
      '.external_links a[href*="imdb"]',
      'a[data-testid="imdb-link"]'
    ];

    const imdbId = this.extractor.extractImdbId(imdbSelectors);

    // Extract poster - Metacritic has prominent poster images
    const posterSelectors = [
      '.product_image .product_image_primary img', // Primary product image
      '.c-productHero_image img', // Hero image
      '.product_poster img', // Product poster
      '.poster img', // Generic poster
      '[data-testid="poster"] img', // Test ID poster
      '.product_image img', // Product image
      '.movie_poster img' // Movie poster
    ];

    const posterUrl = this.extractor.extractPosterUrl(posterSelectors);

    // Extract overview/summary - Metacritic has detailed summaries
    const overviewSelectors = [
      '.product_summary .summary_text', // Product summary
      '.c-productSummary_text', // Modern summary text
      '.summary .blurb', // Summary blurb
      '.product_details .summary', // Product details summary
      '[data-testid="summary"]', // Test ID summary
      '.plot_summary', // Plot summary
      '.editorial_summary', // Editorial summary
      '.product_summary' // Generic product summary
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
   * Get site-specific CSS for Metacritic with signature yellow theme
   */
  getSiteSpecificCSS() {
    return `
      /* Metacritic Yellow Theme Override */
      
      .jellyseerr-tab {
        background: linear-gradient(135deg, #ffcc33 0%, #ff9900 100%) !important;
        border-color: #ffcc33 !important;
        box-shadow: -2px 0 12px rgba(255, 204, 51, 0.3) !important;
        color: #000 !important; /* Dark text on yellow */
      }
      
      .jellyseerr-tab:hover {
        background: linear-gradient(135deg, #ff9900 0%, #cc7700 100%) !important;
        border-color: #ff9900 !important;
        box-shadow: -6px 0 16px rgba(255, 204, 51, 0.4) !important;
      }
      
      .jellyseerr-tab-text {
        color: #000 !important;
      }
      
      /* Metacritic yellow theme for all button states (consistent branding) */
      .jellyseerr-action-button {
        background: linear-gradient(135deg, #ffcc33 0%, #ff9900 100%) !important;
        border-color: #ffcc33 !important;
        color: #000 !important;
      }
      
      .jellyseerr-action-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #ff9900 0%, #cc7700 100%) !important;
        border-color: #ff9900 !important;
        box-shadow: 0 4px 12px rgba(255, 204, 51, 0.3) !important;
      }
      
      .jellyseerr-request-button {
        background: linear-gradient(135deg, #ffcc33 0%, #ff9900 100%) !important;
        border-color: #ffcc33 !important;
        color: #000 !important;
      }
      
      .jellyseerr-request-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #ff9900 0%, #cc7700 100%) !important;
        border-color: #ff9900 !important;
        box-shadow: 0 4px 12px rgba(255, 204, 51, 0.3) !important;
      }
      
      /* Metacritic-specific status colors - optimized for yellow theme */
      .jellyseerr-status-icon.available {
        background: #389e0d !important; /* Dark green for contrast on yellow */
      }
      
      .jellyseerr-status-icon.pending {
        background: #d46b08 !important; /* Dark orange */
      }
      
      .jellyseerr-status-icon.downloading {
        background: #1d39c4 !important; /* Dark blue for contrast */
      }
      
      .jellyseerr-status-icon.ready {
        background: #389e0d !important; /* Dark green */
      }
      
      .jellyseerr-status-icon.partial {
        background: #389e0d !important; /* Dark green */
      }
      
      .jellyseerr-status-icon.error {
        background: #cf1322 !important; /* Dark red for contrast */
      }
      
      /* Metacritic tab status colors - dark colors for visibility on yellow */
      .jellyseerr-connection-status.available {
        color: #389e0d !important; /* Dark green */
      }
      
      .jellyseerr-connection-status.pending {
        color: #d46b08 !important; /* Dark orange */
      }
      
      .jellyseerr-connection-status.downloading {
        color: #1d39c4 !important; /* Dark blue */
      }
      
      .jellyseerr-connection-status.ready {
        color: #389e0d !important; /* Dark green */
      }
      
      .jellyseerr-connection-status.partial {
        color: #389e0d !important; /* Dark green */
      }
      
      .jellyseerr-connection-status.error {
        color: #cf1322 !important; /* Dark red */
      }
      
      .jellyseerr-connection-status.checking {
        color: #595959 !important; /* Dark gray for loading on yellow */
      }
    `;
  }
}

// Wait for shared libraries to load, then initialize
function initializeMetacriticIntegration() {
  if (typeof BaseIntegration !== 'undefined' && 
      typeof JellyseerrClient !== 'undefined' && 
      typeof MediaExtractor !== 'undefined' && 
      typeof UIComponents !== 'undefined') {
    
    console.log('🚀 [Metacritic] All shared libraries loaded, initializing integration...');
    new MetacriticIntegration();
  } else {
    console.log('⏳ [Metacritic] Waiting for shared libraries to load...');
    setTimeout(initializeMetacriticIntegration, 100);
  }
}

// Start initialization
initializeMetacriticIntegration();