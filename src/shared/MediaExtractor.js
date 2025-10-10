// Shared Media Data Extraction Utilities
// Common patterns for extracting media data from different websites

class MediaExtractor {
  constructor(options = {}) {
    this.debug = options.debug || false;
    this.siteName = options.siteName || 'UNKNOWN';
  }

  log(...args) {
    if (this.debug) console.log(`🔍 [${this.siteName}]`, ...args);
  }

  warn(...args) {
    if (this.debug) console.warn(`🚨 [${this.siteName}]`, ...args);
  }

  /**
   * Try multiple selectors to find an element with text content
   * @param {string[]} selectors - Array of CSS selectors to try
   * @param {string} context - Description for logging (e.g., 'title', 'year')
   * @returns {string|null} Found text content or null
   */
  extractTextFromSelectors(selectors, context = 'text') {
    this.log(`Trying ${context} selectors:`, selectors);
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      this.log(`Selector "${selector}":`, element ? element.textContent.trim() : 'not found');
      if (element && element.textContent.trim()) {
        const text = element.textContent.trim();
        this.log(`Found ${context} using selector:`, selector, '-> text:', text);
        return text;
      }
    }
    
    this.log(`No ${context} found with selectors`);
    return null;
  }

  /**
   * Extract title with common cleanup patterns
   * @param {string[]} titleSelectors - Selectors to try for title
   * @param {Object} options - Cleanup options
   * @returns {string|null} Cleaned title or null
   */
  extractTitle(titleSelectors, options = {}) {
    let title = this.extractTextFromSelectors(titleSelectors, 'title');
    
    if (!title && options.fallbackToPageTitle !== false) {
      this.log('No title found with selectors, trying page title fallback');
      const pageTitle = document.title;
      this.log('Page title:', pageTitle);
      
      // Common page title patterns
      title = pageTitle
        .replace(/ \| [^|]+$/, '') // Remove " | Site Name"
        .replace(/ - [^-]+$/, '')  // Remove " - Site Name"
        .replace(/\s*\(\d{4}\)\s*$/, ''); // Remove year in parentheses
      
      this.log('Extracted title from page title:', title);
    }
    
    if (title && options.cleanup !== false) {
      title = this.cleanupTitle(title, options.cleanupPatterns || []);
    }
    
    return title;
  }

  /**
   * Clean up title text with common patterns
   * @param {string} title - Raw title text
   * @param {RegExp[]} additionalPatterns - Additional cleanup patterns
   * @returns {string} Cleaned title
   */
  cleanupTitle(title, additionalPatterns = []) {
    // Standard cleanup patterns
    const patterns = [
      /^Season\s+\d+\s*–\s*/i,           // Remove season prefix
      /\s*–\s*Season\s+\d+/i,           // Remove season suffix
      /\s*\(\d{4}\)\s*$/,               // Remove year in parentheses
      /\s*:\s*Season\s+\d+/i,           // Remove season info after colon
      ...additionalPatterns              // Site-specific patterns
    ];
    
    patterns.forEach(pattern => {
      title = title.replace(pattern, '');
    });
    
    return title.trim();
  }

  /**
   * Extract year from various sources
   * @param {string[]} yearSelectors - Selectors to try for year
   * @param {Object} options - Extraction options
   * @returns {number|null} Year as number or null
   */
  extractYear(yearSelectors, options = {}) {
    // Try direct selectors first
    for (const selector of yearSelectors) {
      const element = document.querySelector(selector);
      this.log(`Year selector "${selector}":`, element ? element.textContent.trim() : 'not found');
      if (element) {
        const yearMatch = element.textContent.match(/(\d{4})/);
        if (yearMatch) {
          const year = parseInt(yearMatch[1]);
          this.log('Found year using selector:', selector, '-> year:', year);
          return year;
        }
      }
    }
    
    // Try multiple elements (like metadata tags)
    if (options.multiElementSelector) {
      const elements = document.querySelectorAll(options.multiElementSelector);
      for (const element of elements) {
        const text = element.textContent.trim();
        this.log('Checking metadata element:', text);
        const yearMatch = text.match(/(\d{4})/);
        if (yearMatch) {
          const year = parseInt(yearMatch[1]);
          this.log('Found year in metadata:', text, '-> year:', year);
          return year;
        }
      }
    }
    
    // Fallback to page title or URL
    if (options.fallback !== false) {
      return this.extractYearFromFallbacks();
    }
    
    return null;
  }

  /**
   * Extract year from page title or URL as fallback
   * @returns {number|null} Year or null
   */
  extractYearFromFallbacks() {
    // Try page title
    const pageTitle = document.title;
    const titleYearMatch = pageTitle.match(/\((\d{4})\)/);
    if (titleYearMatch) {
      return parseInt(titleYearMatch[1]);
    }
    
    // Try URL slug
    const urlYearMatch = window.location.pathname.match(/_(\d{4})$/);
    if (urlYearMatch) {
      return parseInt(urlYearMatch[1]);
    }
    
    return null;
  }

  /**
   * Extract IMDB ID from links on the page
   * @param {string[]} imdbSelectors - Selectors to find IMDB links
   * @returns {string|null} IMDB ID (e.g., 'tt1234567') or null
   */
  extractImdbId(imdbSelectors = ['a[href*="imdb.com/title/"]', 'a[href*="imdb.com"]', '[href*="imdb"]']) {
    for (const selector of imdbSelectors) {
      const imdbLinks = document.querySelectorAll(selector);
      this.log(`Trying IMDB selector "${selector}":`, imdbLinks.length, 'links found');
      
      for (const link of imdbLinks) {
        this.log('Checking IMDB link:', link.href);
        const match = link.href.match(/imdb\.com\/title\/(tt\d+)/);
        if (match) {
          const imdbId = match[1];
          this.log('Found IMDB ID:', imdbId, 'from link:', link.href);
          return imdbId;
        }
      }
    }
    
    this.log('No IMDB ID found');
    return null;
  }

  /**
   * Extract poster/image URL
   * @param {string[]} posterSelectors - Selectors to try for poster image
   * @returns {string|null} Image URL or null
   */
  extractPosterUrl(posterSelectors) {
    for (const selector of posterSelectors) {
      const img = document.querySelector(selector);
      if (img && img.src && !img.src.includes('data:')) {
        this.log('Found poster using selector:', selector, '-> URL:', img.src);
        return img.src;
      }
    }
    
    this.log('No poster found');
    return null;
  }

  /**
   * Extract overview/description text
   * @param {string[]} overviewSelectors - Selectors to try for overview
   * @returns {string|null} Overview text or null
   */
  extractOverview(overviewSelectors) {
    for (const selector of overviewSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        const overview = element.textContent.trim();
        this.log('Found overview using selector:', selector);
        return overview;
      }
    }
    
    this.log('No overview found');
    return null;
  }

  /**
   * Determine media type based on URL patterns and page content
   * @param {Object} patterns - URL patterns and content indicators
   * @returns {string} 'movie' or 'tv'
   */
  determineMediaType(patterns = {}) {
    const url = window.location.pathname;
    
    // Check URL patterns first
    if (patterns.tvUrlPatterns) {
      for (const pattern of patterns.tvUrlPatterns) {
        if (url.match(pattern)) {
          this.log('Detected TV from URL pattern:', pattern);
          return 'tv';
        }
      }
    }
    
    if (patterns.movieUrlPatterns) {
      for (const pattern of patterns.movieUrlPatterns) {
        if (url.match(pattern)) {
          this.log('Detected movie from URL pattern:', pattern);
          return 'movie';
        }
      }
    }
    
    // Check page content indicators
    if (patterns.tvIndicators) {
      for (const indicator of patterns.tvIndicators) {
        if (document.body.textContent.includes(indicator)) {
          this.log('Detected TV from content indicator:', indicator);
          return 'tv';
        }
      }
    }
    
    // Check specific selectors for TV content
    if (patterns.tvSelectors) {
      for (const selector of patterns.tvSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const text = element.textContent;
          if (patterns.tvTextPatterns?.some(pattern => text.match(pattern))) {
            this.log('Detected TV from selector content:', selector, text);
            return 'tv';
          }
        }
      }
    }
    
    // Default to movie
    this.log('Defaulting to movie media type');
    return 'movie';
  }

  /**
   * Create standardized media data object
   * @param {Object} rawData - Raw extracted data
   * @param {string} source - Source site name
   * @returns {Object} Standardized media data object
   */
  createMediaData(rawData, source) {
    const mediaData = {
      imdbId: rawData.imdbId || null,
      title: rawData.title || null,
      year: rawData.year || null,
      mediaType: rawData.mediaType || 'movie',
      posterUrl: rawData.posterUrl || null,
      overview: rawData.overview || null,
      source: source
    };
    
    this.log('Created standardized media data:', mediaData);
    return mediaData;
  }
}

// Export for use in content scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MediaExtractor;
} else if (typeof window !== 'undefined') {
  window.MediaExtractor = MediaExtractor;
}