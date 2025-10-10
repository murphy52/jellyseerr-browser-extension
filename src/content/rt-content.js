// Rotten Tomatoes Content Script for Jellyseerr Integration

// Debug flag - set to true to enable console logging
const DEBUG = true;
const log = (...args) => DEBUG && console.log('🍅 [RT]', ...args);
const warn = (...args) => DEBUG && console.warn('🚨 [RT]', ...args);
const error = (...args) => console.error('🚨 [RT]', ...args);

class RTJellyseerrIntegration {
  constructor() {
    this.mediaData = null;
    this.button = null;
    this.init();
  }

  async init() {
    log('Script loaded on', window.location.href);
    
    // Wait for page to load and try to extract media data
    if (document.readyState === 'loading') {
      log('Document loading, waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', () => this.extractMediaData());
    } else {
      log('Document ready, extracting media data');
      this.extractMediaData();
    }

    // Also try again after a short delay in case content is loaded dynamically
    setTimeout(() => {
      log('Retry extraction after 2 seconds');
      this.extractMediaData();
    }, 2000);
  }

  extractMediaData() {
    log('Starting media data extraction...');
    try {
      const mediaData = this.parseRTPage();
      log('Parsed media data:', mediaData);
      if (mediaData) {
        this.mediaData = mediaData;
        log('Media data found, adding button...');
        this.addJellyseerrButton();
      } else {
        log('No media data found');
      }
    } catch (error) {
      error('Error extracting Rotten Tomatoes media data:', error);
    }
  }

  parseRTPage() {
    log('Parsing RT page...');
    
    // Determine media type from URL
    const isTV = window.location.pathname.startsWith('/tv/');
    const mediaType = isTV ? 'tv' : 'movie';
    log('Detected media type:', mediaType, 'from URL:', window.location.pathname);

    // Extract title - updated selectors for modern RT structure
    const titleSelectors = [
      'rt-text[slot="title"]', // Modern RT structure
      'media-hero rt-text[slot="title"]',
      'h1[slot="title"]',
      '[data-qa="score-panel-title"] h1',
      'h1',
      '.movieTitle',
      '.series-title h1'
    ];
    log('Trying title selectors:', titleSelectors);

    let title = null;
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      log(`Selector "${selector}":`, element ? element.textContent.trim() : 'not found');
      if (element) {
        title = element.textContent.trim();
        // Remove common suffixes and clean up
        title = title.replace(/\s*–\s*Season\s+\d+/i, ''); // Remove season info
        title = title.replace(/\s*\(\d{4}\)\s*$/, ''); // Remove year
        title = title.replace(/\s*–\s*Chad Powers$/i, ''); // Remove redundant series name
        log('Found title using selector:', selector, '-> title:', title);
        break;
      }
    }

    if (!title) {
      log('No title found with selectors, trying page title fallback');
      // Fallback to page title
      const pageTitle = document.title;
      log('Page title:', pageTitle);
      
      // Clean up page title more thoroughly
      title = pageTitle.replace(' | Rotten Tomatoes', '');
      title = title.replace(/\s*:\s*Season\s+\d+/i, ''); // Remove season info
      title = title.replace(/\s*\(\d{4}\)\s*$/, ''); // Remove year
      
      log('Extracted title from page title:', title);
    }

    // Extract year - updated selectors for modern RT
    let year = null;
    const yearSelectors = [
      'rt-text[slot="metadataProp"]', // Modern RT structure for date/year
      'media-hero rt-text[slot="metadataProp"]',
      '[data-qa="score-panel-series-info"] time',
      '[data-qa="score-panel-movie-info"] time', 
      'time',
      '.movieYear'
    ];
    log('Trying year selectors:', yearSelectors);

    for (const selector of yearSelectors) {
      const element = document.querySelector(selector);
      log(`Year selector "${selector}":`, element ? element.textContent.trim() : 'not found');
      if (element) {
        const yearMatch = element.textContent.match(/(\d{4})/);
        if (yearMatch) {
          year = parseInt(yearMatch[1]);
          log('Found year using selector:', selector, '-> year:', year);
          break;
        }
      }
    }

    // Fallback year extraction from page title or URL
    if (!year) {
      const pageTitle = document.title;
      const yearMatch = pageTitle.match(/\((\d{4})\)/);
      if (yearMatch) {
        year = parseInt(yearMatch[1]);
      } else {
        // Try extracting from URL slug
        const urlMatch = window.location.pathname.match(/_(\d{4})$/);
        if (urlMatch) {
          year = parseInt(urlMatch[1]);
        }
      }
    }

    // Try to find IMDB ID from links
    let imdbId = null;
    const imdbLinks = document.querySelectorAll('a[href*="imdb.com/title/"]');
    for (const link of imdbLinks) {
      const match = link.href.match(/imdb\.com\/title\/(tt\d+)/);
      if (match) {
        imdbId = match[1];
        break;
      }
    }

    // Extract additional metadata
    const posterUrl = this.extractPosterUrl();
    const overview = this.extractOverview();

    // If no essential data found, return null
    if (!title) {
      return null;
    }

    return {
      imdbId,
      title,
      year,
      mediaType,
      posterUrl,
      overview,
      source: 'rottentomatoes'
    };
  }

  extractPosterUrl() {
    const posterSelectors = [
      '[data-qa="score-panel-poster"] img',
      '.posterImage img',
      '.movie_poster img',
      '.media-hero__poster img'
    ];

    for (const selector of posterSelectors) {
      const img = document.querySelector(selector);
      if (img && img.src && !img.src.includes('data:')) {
        return img.src;
      }
    }

    return null;
  }

  extractOverview() {
    const overviewSelectors = [
      '[data-qa="movie-info-synopsis"]',
      '[data-qa="series-info-description"]',
      '.movie_synopsis',
      '.synopsis-wrap .synopsis',
      '#movieSynopsis',
      '.series-description'
    ];

    for (const selector of overviewSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.textContent.trim();
      }
    }

    return null;
  }

  addJellyseerrButton() {
    log('Adding Jellyseerr button...');
    if (this.button) {
      log('Button already exists, skipping');
      return; // Button already added
    }

    // Find a good place to insert the button - updated for modern RT structure
    const insertionPoints = [
      'media-scorecard', // Modern RT media scorecard component
      '.media-scorecard',
      'media-hero', // Main hero section
      '[data-qa="score-panel"]',
      '.modules-wrap',
      'main',
      'div[id*="hero"]',
      'div[id*="main"]'
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
      log('Available elements on page:');
      // Log some common RT elements to help debug
      const debugSelectors = [
        'media-scorecard', 'media-hero', '[data-qa]', 
        '[class*="score"]', '[class*="rating"]', '[class*="media"]',
        'h1', 'h2', 'main', 'section'
      ];
      debugSelectors.forEach(sel => {
        const elements = document.querySelectorAll(sel);
        if (elements.length > 0) {
          log(`Found ${elements.length} elements matching "${sel}":`);
          elements.forEach((el, i) => {
            if (i < 3) { // Only log first 3 to avoid spam
              const attrs = [];
              if (el.className) attrs.push('class="' + el.className + '"');
              if (el.id) attrs.push('id="' + el.id + '"');
              if (el.getAttribute('data-qa')) attrs.push('data-qa="' + el.getAttribute('data-qa') + '"');
              log(`  - ${el.tagName.toLowerCase()}${attrs.length ? ' ' + attrs.join(' ') : ''}`);
            }
          });
        }
      });
      return;
    }

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'jellyseerr-button-container';

    // Create the button with loading state
    this.button = document.createElement('button');
    this.button.className = 'jellyseerr-request-button loading';
    this.button.disabled = true;
    this.button.innerHTML = `
      <svg class="jellyseerr-button-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      Checking status...
    `;

    buttonContainer.appendChild(this.button);
    
    // Insert after the container
    container.parentNode.insertBefore(buttonContainer, container.nextSibling);

    // Add page class for styling
    document.body.classList.add('rt-page');
    
    log('Jellyseerr button successfully added to RT page!');
    log('Media data for this page:', this.mediaData);
    
    // Add debug functions to window for manual testing
    window.jellyseerr_debug = {
      testStatus: () => this.updateButtonWithStatus(),
      testAPI: () => this.debugAPI(),
      mediaData: this.mediaData
    };
    
    log('Debug functions added to window.jellyseerr_debug');
    
    // Check media status and update button
    this.updateButtonWithStatus();
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
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'; // Clock/pending icon
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
    
    this.button.innerHTML = `
      <svg class="jellyseerr-button-icon" viewBox="0 0 24 24">
        <path d="${iconPath}"/>
      </svg>
      ${statusData.buttonText || 'Request on Jellyseerr'}
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
      if (statusData.status === 'requested' || statusData.status === 'downloading') {
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
  
  async debugAPI() {
    try {
      log('🛠️ Running API debug...');
      const result = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'debugAPI',
          tmdbId: this.mediaData ? parseInt(this.mediaData.imdbId?.replace('tt', '') || '1438') : 1438,
          mediaType: this.mediaData ? this.mediaData.mediaType : 'tv'
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
new RTJellyseerrIntegration();