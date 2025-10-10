// IMDB Content Script for Jellyseerr Integration

// Immediate load verification
console.log('🎬 [IMDB] Script file loaded!', window.location.href);

// Debug flag - set to true to enable console logging
const DEBUG = true;
const log = (...args) => DEBUG && console.log('🎬 [IMDB]', ...args);
const warn = (...args) => DEBUG && console.warn('🚨 [IMDB]', ...args);
const error = (...args) => console.error('🚨 [IMDB]', ...args);

class IMDBJellyseerrIntegration {
  constructor() {
    this.mediaData = null;
    this.button = null;
    this.init();
  }

  async init() {
    log('Script initializing on', window.location.href);
    
    // Wait for page to be ready and then try extraction
    setTimeout(() => {
      this.extractMediaData();
    }, 1000);
    
    // Additional attempt after more time
    setTimeout(() => {
      if (!this.button) {
        this.extractMediaData();
      }
    }, 3000);
  }

  extractMediaData() {
    log('Starting media data extraction...');
    try {
      const mediaData = this.parseIMDBPage();
      log('Parsed media data:', mediaData);
      if (mediaData) {
        this.mediaData = mediaData;
        log('Media data found, adding button...');
        this.addJellyseerrButton();
      } else {
        log('No media data found');
      }
    } catch (error) {
      error('Error extracting IMDB media data:', error);
    }
  }

  parseIMDBPage() {
    log('Parsing IMDB page...');
    
    // Extract IMDB ID from URL
    const urlMatch = window.location.pathname.match(/\/title\/(tt\d+)/);
    log('URL match for IMDB ID:', urlMatch);
    if (!urlMatch) {
      warn('No IMDB ID found in URL:', window.location.pathname);
      return null;
    }

    const imdbId = urlMatch[1];
    log('Found IMDB ID:', imdbId);

    // Extract title - try multiple selectors
    const titleSelectors = [
      '[data-testid="hero-title-block__title"]',
      'h1[data-testid="hero__pageTitle"] span',
      'h1.titleBar-title',
      'h1 .itemprop[itemprop="name"]',
      '.title_wrapper h1',
      '.originalTitle'
    ];

    let title = null;
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        title = element.textContent.trim();
        break;
      }
    }

    if (!title) {
      // Fallback to page title
      const pageTitle = document.title;
      const match = pageTitle.match(/^(.+?)\s*\(\d{4}\)/);
      title = match ? match[1] : pageTitle.split(' - ')[0];
    }

    // Extract year - try multiple approaches
    let year = null;
    const yearSelectors = [
      '[data-testid="hero-title-block__metadata"] a',
      '.sc-69e49b85-0 a[href*="/year/"]',
      '.titleBar-desktopSpacing a[href*="/year/"]',
      'span.titleYear a',
      '.subtext a[href*="year"]'
    ];

    for (const selector of yearSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const yearMatch = element.textContent.match(/(\d{4})/);
        if (yearMatch) {
          year = parseInt(yearMatch[1]);
          break;
        }
      }
    }

    // If no year found, try extracting from URL or page title
    if (!year) {
      const pageTitle = document.title;
      const yearMatch = pageTitle.match(/\((\d{4})\)/);
      if (yearMatch) {
        year = parseInt(yearMatch[1]);
      }
    }

    // Determine if it's a TV show or movie
    const mediaType = this.determineMediaType();

    // Extract additional metadata
    const posterUrl = this.extractPosterUrl();
    const overview = this.extractOverview();

    return {
      imdbId,
      title,
      year,
      mediaType,
      posterUrl,
      overview,
      source: 'imdb'
    };
  }

  determineMediaType() {
    // Check for TV series indicators - need to check text content manually since :contains() doesn't work in querySelector
    const tvCheckSelectors = [
      '[data-testid="hero-title-block__metadata"] .ipc-inline-list__item',
      '[data-testid="hero-title-block__metadata"] li',
      'span',
      '.subtext'
    ];

    for (const selector of tvCheckSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent;
        if (text.includes('TV Series') || text.includes('TV Mini Series')) {
          return 'tv';
        }
      }
    }

    // Check page content for TV indicators
    const pageText = document.body.textContent;
    if (pageText.includes('TV Series') || pageText.includes('TV Mini Series') || 
        pageText.includes('Episodes') || window.location.href.includes('/episodes/')) {
      return 'tv';
    }

    // Default to movie
    return 'movie';
  }

  extractPosterUrl() {
    const posterSelectors = [
      '[data-testid="hero-media__poster"] img',
      '.poster img',
      '.ipc-media--poster-27x40 img',
      'img.titlereference-primary-image'
    ];

    for (const selector of posterSelectors) {
      const img = document.querySelector(selector);
      if (img && img.src) {
        return img.src;
      }
    }

    return null;
  }

  extractOverview() {
    const overviewSelectors = [
      '[data-testid="plot-summary-wrapper"] [data-testid="plot-xl"]',
      '[data-testid="plot"] span',
      '.summary_text',
      '.plot_summary .summary_text'
    ];

    for (const selector of overviewSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.textContent.trim();
      }
    }

    return null;
  }

  async addJellyseerrButton() {
    log('Adding Jellyseerr button to IMDB page...');
    if (this.button) {
      log('Button reference exists, removing old button and recreating...');
      // Remove old button and container
      if (this.button.parentNode) {
        this.button.parentNode.remove();
      }
      this.button = null;
    }

    // Comprehensive IMDB insertion points for different layouts (TV series vs movies)
    const insertionPoints = [
      // PRIMARY: Watchlist area - highest priority for sidebar placement
      '.ipc-btn--add-to-watchlist', // Add to Watchlist button
      '[data-testid="tm-box-wl-button"]', // Watchlist button container
      '.ipc-watchlist-ribbon', // Watchlist ribbon
      '[class*="watchlist"]', // Any element with watchlist in class name
      '[class*="wl-button"]', // Watchlist button variations
      
      // SECONDARY: Rating areas in sidebar
      '[data-testid="hero-rating-bar__user-rating"]', // User rating section
      '[data-testid="hero-rating-bar__watchlist"]', // Watchlist button area
      '[data-testid="title-ratingWidget"]', // Rating widget
      '[data-testid="hero-rating-bar"]', // Overall rating bar
      
      // TV Series specific - hero area selectors (higher priority)
      '[data-testid="hero-title-block__user-rating"]', // User rating in hero
      '[data-testid="hero-title-block__metadata"]', // Metadata area
      '[data-testid="hero-title-block"]', // Main title block
      '[data-testid="hero-media"]', // Hero media section
      
      // Movie specific selectors
      '.titlereference-watch-ribbon', // Watch ribbon
      
      // Content areas (broader selectors) - LOWER PRIORITY
      '[data-testid="title-overview-widget"]', // Overview widget
      '[data-testid="storyline-plot-summary"]', // Plot summary
      '[data-testid="title-details-section"]', // Details section
      
      // Principal credits - MOVED TO LOW PRIORITY
      '[data-testid="title-pc-principal-credit"]', // Principal credits (creators section)
      
      // Page structure fallbacks
      '.ipc-page-grid', // Page grid
      '.ipc-page-content-container', // Content container
      '.titlereference-section-overview', // Legacy overview
      '.title_wrapper', // Legacy title wrapper
      'main' // HTML5 main element
    ];
    
    log('Trying insertion points:', insertionPoints);

    let container = null;
    for (const selector of insertionPoints) {
      const element = document.querySelector(selector);
      log(`Insertion point "${selector}":`, element ? 'found' : 'not found');
      if (element) {
        container = element;
        log('Using insertion point:', selector);
        break;
      }
    }

    if (!container) {
      warn('Could not find suitable container for Jellyseerr button');
      log('Debugging page layout - URL:', window.location.href);
      log('Page title:', document.title);
      
      // Enhanced debugging - log specific IMDB elements we're looking for
      const debugSelectors = [
        // Test our specific selectors
        '[data-testid*="hero"]', 
        '[data-testid*="rating"]',
        '[data-testid*="watchlist"]',
        '[data-testid*="title"]',
        '[data-testid*="metadata"]',
        '.ipc-page-grid',
        '.ipc-page-content-container',
        'main'
      ];
      
      log('Testing our insertion point selectors:');
      debugSelectors.forEach(sel => {
        const elements = document.querySelectorAll(sel);
        if (elements.length > 0) {
          log(`✓ Found ${elements.length} elements matching "${sel}"`);
          elements.forEach((el, i) => {
            if (i < 3) { // Only log first 3
              const testId = el.getAttribute('data-testid');
              const classes = el.className.split(' ').slice(0, 3).join(' ');
              log(`  - ${el.tagName.toLowerCase()} ${testId ? `data-testid="${testId}"` : ''} ${classes ? `class="${classes}..."` : ''}`);
            }
          });
        } else {
          log(`✗ No elements found for "${sel}"`);
        }
      });
      
      // Try to find ANY reasonable container as emergency fallback
      const emergencyContainers = ['main', 'body', '.ipc-page-content-container', '#__next'];
      for (const sel of emergencyContainers) {
        const emergency = document.querySelector(sel);
        if (emergency) {
          warn(`Using emergency container: ${sel}`);
          container = emergency;
          break;
        }
      }
      
      if (!container) {
        error('No container found at all - cannot insert button');
        this.button = null;
        return;
      }
    }

    // Create button container with sidebar-appropriate styling
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'jellyseerr-button-container';
    // Style to match IMDB sidebar elements
    buttonContainer.style.cssText = `
      margin: 8px 0 !important;
      padding: 0 !important;
      background: none !important;
      border: none !important;
    `;

    // Create the button - let CSS handle all styling
    this.button = document.createElement('button');
    this.button.className = 'jellyseerr-request-button loading';
    this.button.disabled = true;
    
    this.button.innerHTML = `
      <svg class="jellyseerr-button-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>Checking status...</span>
    `;

    // Add button to container first
    buttonContainer.appendChild(this.button);
    log('Button element created successfully');
    
    // Smart insertion logic based on container type
    const containerTestId = container.getAttribute('data-testid');
    const containerClass = container.className || '';
    
    // Check if this is a watchlist button or similar interactive element
    const isWatchlistButton = (
      containerClass.includes('watchlist') ||
      containerClass.includes('wl-button') ||
      containerTestId && (
        containerTestId.includes('watchlist') ||
        containerTestId.includes('wl-button') ||
        containerTestId.includes('tm-box')
      ) ||
      container.tagName === 'BUTTON' ||
      container.classList.contains('ipc-btn')
    );
    
    const isRatingElement = (
      containerTestId && (
        containerTestId.includes('rating') ||
        containerTestId.includes('user-rating')
      )
    );
    
    if (isWatchlistButton || isRatingElement) {
      // For interactive elements (buttons, ratings), insert AFTER the element to stay in same area
      if (container.parentNode) {
        container.parentNode.insertBefore(buttonContainer, container.nextSibling);
        log('Inserted button after interactive element (watchlist/rating)');
      } else {
        // Fallback: try to find the parent container
        const parentContainer = container.closest('[data-testid], .ipc-page-section, section, div');
        if (parentContainer && parentContainer !== container) {
          parentContainer.appendChild(buttonContainer);
          log('Inserted button in parent container as fallback');
        } else {
          container.appendChild(buttonContainer);
          log('Inserted button inside element as last resort');
        }
      }
    } else {
      // For other containers (metadata, content areas), append inside
      container.appendChild(buttonContainer);
      log('Inserted button inside container');
    }
    
    log('Button container placement:', {
      container: containerTestId || containerClass || container.tagName,
      isWatchlistButton,
      isRatingElement,
      method: isWatchlistButton || isRatingElement ? 'after' : 'inside'
    });
    
    // Verify button was inserted
    if (document.contains(this.button)) {
      log('✅ Button successfully added to DOM!');
      
      // Simple visibility check
      setTimeout(() => {
        const buttonRect = this.button.getBoundingClientRect();
        const isVisible = buttonRect.width > 0 && buttonRect.height > 0;
        
        if (isVisible) {
          log('✅ Button is visible!');
        } else {
          warn('⚠️ Button not visible, applying emergency styles...');
          this.button.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background: #5B21B6 !important;
            color: white !important;
            padding: 10px 20px !important;
            margin: 10px 0 !important;
            border: none !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
          `;
        }
      }, 500);
      
    } else {
      error('❌ Button was not added to DOM despite no errors');
      this.button = null;
      return;
    }

    
    // Add page class for styling
    document.body.classList.add('imdb-page');
    
    // Add debug functions to window for manual testing
    window.jellyseerr_debug = {
      testStatus: () => this.updateButtonWithStatus(),
      testAPI: () => this.debugAPI(),
      mediaData: this.mediaData,
      getStatus: async () => {
        try {
          const status = await this.getMediaStatus(this.mediaData);
          console.log('🔧 [Debug] Raw status from API:', status);
          return status;
        } catch (error) {
          console.error('🔧 [Debug] Failed to get status:', error);
          return error;
        }
      }
    };
    
    log('Debug functions added to window.jellyseerr_debug');
    
    // Check media status and update button
    await this.updateButtonWithStatus();
  }
  
  async updateButtonWithStatus() {
    try {
      log('Checking media status...');
      const statusData = await this.getMediaStatus(this.mediaData);
      log('Media status received:', statusData);
      
      this.updateButtonAppearance(statusData);
      
    } catch (error) {
      error('Error checking media status:', error);
      // Fall back to default request button
      this.updateButtonAppearance({
        status: 'available',
        buttonText: 'Request on Jellyseerr',
        buttonClass: 'request',
        message: 'Ready to request'
      });
    }
  }
  
  updateButtonAppearance(statusData) {
    if (!this.button) return;
    
    // Remove loading state
    this.button.classList.remove('loading');
    this.button.disabled = false;
    
    // Update button class and content based on status
    this.button.className = `jellyseerr-request-button ${statusData.buttonClass || 'request'}`;
    
    let iconPath = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'; // Default plus icon
    
    // Choose appropriate icon based on status
    switch (statusData.status) {
      case 'requested':
      case 'pending':
        iconPath = 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H11V7H13V13H17V15H13V21H11V15H7V13Z'; // Clock/pending icon
        break;
      case 'downloading':
        iconPath = 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'; // Download icon
        break;
      case 'available_watch':
      case 'partial':
        if (statusData.watchUrl) {
          iconPath = 'M8 5v14l11-7z'; // Play icon
        } else {
          iconPath = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'; // Check icon
        }
        break;
    }
    
    // Colors are now handled by CSS classes - no inline styling needed
    
    this.button.innerHTML = `
      <svg class="jellyseerr-button-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="${iconPath}"/>
      </svg>
      <span>${statusData.buttonText || 'Request on Jellyseerr'}</span>
    `;
    
    // Update click handler based on status
    this.button.removeEventListener('click', this.handleButtonClick);
    
    if (statusData.watchUrl) {
      // If there's a watch URL, open it instead of making a request
      this.button.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(statusData.watchUrl, '_blank');
      });
    } else if (statusData.status === 'available') {
      // Only enable requesting if the media is available for request
      this.button.addEventListener('click', () => this.handleButtonClick());
    } else {
      // For other statuses, disable the button or make it informational
      if (statusData.status === 'requested' || statusData.status === 'pending' || statusData.status === 'downloading') {
        this.button.disabled = true;
      }
    }
    
    // Store status data for later use
    this.statusData = statusData;
    
    log('Button updated with status:', statusData.status, statusData.buttonText);
  }
  
  async getMediaStatus(mediaData) {
    return new Promise(async (resolve, reject) => {
      const maxRetries = 2;
      const retryDelay = 1000;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Test connection first
          const connectionTest = await this.testConnection();
          if (!connectionTest && attempt < maxRetries) {
            await new Promise(r => setTimeout(r, retryDelay));
            continue;
          }
          
          chrome.runtime.sendMessage({
            action: 'getMediaStatus',
            data: mediaData
          }, (response) => {
            if (chrome.runtime.lastError) {
              if (attempt < maxRetries) {
                setTimeout(() => this.getMediaStatus(mediaData).then(resolve).catch(reject), retryDelay);
                return;
              }
              reject(new Error(chrome.runtime.lastError.message));
            } else if (response && response.success) {
              resolve(response.data);
            } else {
              reject(new Error(response ? response.error : 'No response received'));
            }
          });
          
          break;
          
        } catch (err) {
          if (attempt === maxRetries) {
            reject(err);
          } else {
            await new Promise(r => setTimeout(r, retryDelay));
          }
        }
      }
    });
  }

  async handleButtonClick() {
    if (!this.mediaData) {
      this.showNotification('Error', 'Could not extract media information', 'error');
      return;
    }

    this.button.classList.add('loading');
    this.button.disabled = true;
    this.button.innerHTML = `
      <svg class="jellyseerr-button-icon" viewBox="0 0 24 24">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      Requesting...
    `;

    try {
      const result = await this.sendToJellyseerr(this.mediaData);
      
      this.button.classList.remove('loading');
      this.button.classList.add('success');
      this.button.innerHTML = `
        <svg class="jellyseerr-button-icon" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        Requested!
      `;

      this.showNotification(
        'Request Sent!', 
        `${this.mediaData.title} has been added to your Jellyseerr requests`,
        'success'
      );

      // Update status after successful request
      setTimeout(async () => {
        await this.updateButtonWithStatus();
      }, 2000);

    } catch (error) {
      console.error('Error sending request to Jellyseerr:', error);
      
      this.button.classList.remove('loading');
      this.button.classList.add('error');
      this.button.disabled = false;
      this.button.innerHTML = `
        <svg class="jellyseerr-button-icon" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
        Request Failed
      `;

      this.showNotification(
        'Request Failed', 
        error.message || 'Failed to send request to Jellyseerr',
        'error'
      );

      // Reset button after delay by checking status again
      setTimeout(async () => {
        await this.updateButtonWithStatus();
      }, 3000);
    }
  }
  
  async debugAPI() {
    try {
      log('🛠️ Running API debug...');
      const tmdbId = 1438; // Default to The Wire for testing
      const result = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'debugAPI',
          tmdbId,
          mediaType: 'tv'
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
      
      console.log('🛠️ API Debug Results:', result);
      
      // Show which endpoints work
      if (result.data) {
        Object.entries(result.data).forEach(([endpoint, result]) => {
          if (result.success) {
            console.log('✅', endpoint, '- Works!');
            if (endpoint.includes('request') && result.sample) {
              console.log('📋 Sample requests:', result.sample);
            }
          } else {
            console.log('❌', endpoint, '- Failed:', result.error);
          }
        });
      }
      
      return result;
    } catch (error) {
      error('🛠️ API debug failed:', error);
      return null;
    }
  }

  async sendToJellyseerr(mediaData) {
    return new Promise(async (resolve, reject) => {
      const maxRetries = 3;
      const retryDelay = 1000; // 1 second
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          log(`Attempting to send message (attempt ${attempt}/${maxRetries})`);
          
          // First check if we can connect to the background script
          const connectionTest = await this.testConnection();
          if (!connectionTest) {
            if (attempt < maxRetries) {
              warn(`Connection test failed on attempt ${attempt}, retrying in ${retryDelay}ms...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              continue;
            } else {
              reject(new Error('Could not connect to extension background script. Please reload the extension and try again.'));
              return;
            }
          }
          
          // Send the actual message
          chrome.runtime.sendMessage({
            action: 'requestMedia',
            data: mediaData
          }, (response) => {
            if (chrome.runtime.lastError) {
              const errorMsg = chrome.runtime.lastError.message;
              error(`Runtime error on attempt ${attempt}:`, errorMsg);
              
              if (errorMsg.includes('Receiving end does not exist') && attempt < maxRetries) {
                // Don't reject immediately, let the retry loop handle it
                warn(`Connection lost, will retry...`);
                return;
              }
              
              reject(new Error(errorMsg));
            } else if (response && response.success) {
              log('Request successful:', response.data);
              resolve(response.data);
            } else {
              const errorMsg = response ? response.error : 'No response received';
              error(`Request failed:`, errorMsg);
              reject(new Error(errorMsg || 'Unknown error'));
            }
          });
          
          // Break out of retry loop if message was sent successfully
          break;
          
        } catch (err) {
          error(`Error on attempt ${attempt}:`, err);
          if (attempt === maxRetries) {
            reject(err);
          } else {
            warn(`Retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }
    });
  }
  
  async testConnection() {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
          if (chrome.runtime.lastError) {
            log('Connection test failed:', chrome.runtime.lastError.message);
            resolve(false);
          } else {
            log('Connection test successful');
            resolve(true);
          }
        });
      } catch (error) {
        log('Connection test error:', error);
        resolve(false);
      }
    });
  }

  showNotification(title, message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.jellyseerr-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `jellyseerr-notification ${type}`;
    notification.innerHTML = `
      <div class="jellyseerr-notification-title">${title}</div>
      <div class="jellyseerr-notification-message">${message}</div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
}

// Initialize the integration when the script loads
new IMDBJellyseerrIntegration();