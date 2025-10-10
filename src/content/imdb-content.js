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
    log('Creating Jellyseerr fly-out tab for IMDB page...');
    
    // Remove existing fly-out if it exists
    const existingFlyout = document.getElementById('jellyseerr-flyout');
    if (existingFlyout) {
      existingFlyout.remove();
    }
    
    // Inject flyout CSS if not already present
    if (!document.getElementById('jellyseerr-flyout-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'jellyseerr-flyout-styles';
      styleElement.textContent = this.getFlyoutCSS();
      document.head.appendChild(styleElement);
      log('✅ Flyout CSS injected');
    }

    // Create the main fly-out container
    const flyout = document.createElement('div');
    flyout.id = 'jellyseerr-flyout';
    flyout.className = 'jellyseerr-flyout collapsed';
    
    // Create the tab (always visible)
    const tab = document.createElement('div');
    tab.className = 'jellyseerr-tab';
    tab.innerHTML = `
      <svg class="jellyseerr-tab-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span class="jellyseerr-tab-text">Jellyseerr</span>
    `;
    
    // Create the content panel (expandable)
    const panel = document.createElement('div');
    panel.className = 'jellyseerr-panel';
    
    // Create status section
    const statusSection = document.createElement('div');
    statusSection.className = 'jellyseerr-status-section';
    statusSection.innerHTML = `
      <div class="jellyseerr-media-info">
        <h3 class="jellyseerr-title">${this.mediaData.title}</h3>
        <p class="jellyseerr-year">${this.mediaData.year} • ${this.mediaData.mediaType === 'tv' ? 'TV Series' : 'Movie'}</p>
      </div>
      <div class="jellyseerr-status-indicator">
        <div class="jellyseerr-status-icon loading"></div>
        <span class="jellyseerr-status-text">Checking status...</span>
      </div>
    `;
    
    // Create action button
    this.button = document.createElement('button');
    this.button.className = 'jellyseerr-action-button loading';
    this.button.disabled = true;
    this.button.innerHTML = `
      <svg class="jellyseerr-button-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>Checking status...</span>
    `;
    
    // Assemble the panel
    panel.appendChild(statusSection);
    panel.appendChild(this.button);
    
    // Assemble the flyout
    flyout.appendChild(tab);
    flyout.appendChild(panel);
    
    // Add click handler for tab
    tab.addEventListener('click', () => {
      flyout.classList.toggle('collapsed');
      flyout.classList.toggle('expanded');
      log('Flyout toggled:', flyout.classList.contains('expanded') ? 'expanded' : 'collapsed');
    });
    
    // Add the flyout to the page
    document.body.appendChild(flyout);
    log('✅ Jellyseerr flyout added to page');
    
    // Store references
    this.flyout = flyout;
    this.statusIcon = statusSection.querySelector('.jellyseerr-status-icon');
    this.statusText = statusSection.querySelector('.jellyseerr-status-text');
    
    // Add page class for styling
    document.body.classList.add('imdb-page');
    
    // Add debug functions to window for manual testing
    window.jellyseerr_debug = {
      testStatus: () => this.updateButtonWithStatus(),
      testAPI: () => this.debugAPI(),
      mediaData: this.mediaData,
      expandFlyout: () => {
        flyout.classList.remove('collapsed');
        flyout.classList.add('expanded');
      },
      collapseFlyout: () => {
        flyout.classList.remove('expanded');
        flyout.classList.add('collapsed');
      },
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
    this.button.className = `jellyseerr-action-button ${statusData.buttonClass || 'request'}`;
    
    let iconPath = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'; // Default plus icon
    let statusIconClass = 'available';
    let statusText = statusData.message || 'Available to request';
    
    // Choose appropriate icon and status indicator based on status
    switch (statusData.status) {
      case 'requested':
      case 'pending':
        iconPath = 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H11V7H13V13H17V15H13V21H11V15H7V13Z'; // Clock/pending icon
        statusIconClass = 'pending';
        statusText = 'Request pending';
        break;
      case 'downloading':
        iconPath = 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'; // Download icon
        statusIconClass = 'downloading';
        statusText = 'Downloading...';
        break;
      case 'available_watch':
      case 'partial':
        statusIconClass = 'available';
        if (statusData.watchUrl) {
          iconPath = 'M8 5v14l11-7z'; // Play icon
          statusText = 'Available to watch';
        } else {
          iconPath = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'; // Check icon
          statusText = 'Available';
        }
        break;
    }
    
    // Update status indicator in the flyout
    if (this.statusIcon && this.statusText) {
      this.statusIcon.className = `jellyseerr-status-icon ${statusIconClass}`;
      this.statusText.textContent = statusText;
    }
    
    // Update main action button
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
    
    log('Flyout updated with status:', statusData.status, statusData.buttonText);
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

      // Auto-close flyout after successful request
      setTimeout(() => {
        if (this.flyout && this.flyout.classList.contains('expanded')) {
          this.flyout.classList.remove('expanded');
          this.flyout.classList.add('collapsed');
          log('Auto-closing flyout after successful request');
        }
      }, 4000);

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
  
  getFlyoutCSS() {
    return `
/* Jellyseerr Flyout Styles - Honey-inspired design */

#jellyseerr-flyout {
  position: fixed;
  right: 0;
  top: 25%;
  transform: translateY(-50%);
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 350px;
  
  /* Start collapsed - hide everything except the tab */
  transform: translateY(-50%) translateX(100%);
}

#jellyseerr-flyout.expanded {
  transform: translateY(-50%) translateX(0);
}

/* Tab - Always visible part */
.jellyseerr-tab {
  position: absolute;
  left: -60px;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px 0 0 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  color: white;
  user-select: none;
}

.jellyseerr-tab:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-50%) translateX(-4px);
  box-shadow: -6px 0 16px rgba(0, 0, 0, 0.2);
}

.jellyseerr-tab-icon {
  margin-bottom: 4px;
  opacity: 0.9;
}

.jellyseerr-tab-text {
  font-size: 11px;
  font-weight: 600;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Panel - Expandable content */
.jellyseerr-panel {
  width: 320px;
  background: white;
  border-radius: 8px 0 0 8px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

/* Status Section */
.jellyseerr-status-section {
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.jellyseerr-media-info {
  margin-bottom: 16px;
}

.jellyseerr-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.jellyseerr-year {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* Status Indicator */
.jellyseerr-status-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.jellyseerr-status-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
}

.jellyseerr-status-icon.loading {
  background: #cbd5e0;
  animation: pulse 2s infinite;
}

.jellyseerr-status-icon.available {
  background: #10b981;
}

.jellyseerr-status-icon.pending {
  background: #f59e0b;
}

.jellyseerr-status-icon.downloading {
  background: #3b82f6;
  animation: pulse 1.5s infinite;
}

.jellyseerr-status-text {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

/* Action Button */
.jellyseerr-action-button {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  outline: none;
}

.jellyseerr-action-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.jellyseerr-action-button:active:not(:disabled) {
  transform: translateY(0);
}

.jellyseerr-action-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.jellyseerr-action-button.loading {
  background: #9ca3af;
  cursor: wait;
}

.jellyseerr-action-button.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.jellyseerr-action-button.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.jellyseerr-action-button.request {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.jellyseerr-action-button.watch {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.jellyseerr-button-icon {
  flex-shrink: 0;
}

/* Loading Animation */
.jellyseerr-action-button.loading .jellyseerr-button-icon {
  animation: spin 1s linear infinite;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode support for IMDB's dark theme */
@media (prefers-color-scheme: dark) {
  .jellyseerr-panel {
    background: #1f2937;
    border-color: #374151;
  }
  
  .jellyseerr-title {
    color: #f9fafb;
  }
  
  .jellyseerr-year {
    color: #9ca3af;
  }
  
  .jellyseerr-status-text {
    color: #d1d5db;
  }
  
  .jellyseerr-status-section {
    border-bottom-color: #374151;
  }
}

/* Responsive behavior */
@media (max-width: 768px) {
  #jellyseerr-flyout {
    transform: translateY(-50%) translateX(100%);
    max-width: 300px;
  }
  
  .jellyseerr-tab {
    left: -50px;
    width: 50px;
    height: 100px;
  }
  
  .jellyseerr-panel {
    width: 280px;
  }
  
  .jellyseerr-tab-text {
    font-size: 10px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .jellyseerr-tab {
    border: 2px solid #000;
  }
  
  .jellyseerr-panel {
    border: 2px solid #000;
  }
  
  .jellyseerr-action-button {
    border: 1px solid #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  #jellyseerr-flyout,
  .jellyseerr-tab,
  .jellyseerr-action-button {
    transition: none;
  }
  
  .jellyseerr-status-icon.loading,
  .jellyseerr-status-icon.downloading,
  .jellyseerr-action-button.loading .jellyseerr-button-icon {
    animation: none;
  }
}
    `;
  }
}

// Initialize the integration when the script loads
new IMDBJellyseerrIntegration();