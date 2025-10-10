// Shared Jellyseerr API Client
// Handles all communication with background script and Jellyseerr API

class JellyseerrClient {
  constructor(options = {}) {
    this.debug = options.debug || false;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.siteName = options.siteName || 'UNKNOWN';
  }

  log(...args) {
    if (this.debug) console.log(`🔗 [${this.siteName}]`, ...args);
  }

  warn(...args) {
    if (this.debug) console.warn(`🚨 [${this.siteName}]`, ...args);
  }

  error(...args) {
    console.error(`🚨 [${this.siteName}]`, ...args);
  }

  /**
   * Test connection to extension background script
   * @returns {Promise<boolean>}
   */
  async testExtensionConnection() {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
          if (chrome.runtime.lastError) {
            this.log('Extension connection test failed:', chrome.runtime.lastError.message);
            resolve(false);
          } else {
            this.log('Extension connection test successful');
            resolve(true);
          }
        });
      } catch (err) {
        this.log('Extension connection test error:', err);
        resolve(false);
      }
    });
  }

  /**
   * Test connection to Jellyseerr server
   * @returns {Promise<boolean>}
   */
  async testServerConnection() {
    return new Promise((resolve) => {
      try {
        this.log('Starting server connection test...');
        chrome.runtime.sendMessage({ action: 'testConnection' }, (response) => {
          this.log('Server connection test response:', response);
          if (chrome.runtime.lastError) {
            this.log('Server connection test failed - runtime error:', chrome.runtime.lastError.message);
            resolve(false);
          } else if (response && response.success) {
            this.log('Server connection test SUCCESSFUL - response.success=true, returning true');
            resolve(true);
          } else {
            this.log('Server connection test FAILED - response.success=false, returning false');
            this.log('Error details:', response ? response.error : 'No response');
            resolve(false);
          }
        });
      } catch (err) {
        this.log('Server connection test exception:', err);
        resolve(false);
      }
    });
  }

  /**
   * Get media status from Jellyseerr
   * @param {Object} mediaData - Media information object
   * @returns {Promise<Object>} Status data with buttonText, status, etc.
   */
  async getMediaStatus(mediaData) {
    return new Promise(async (resolve, reject) => {
      for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
        try {
          // Test extension connection first
          const extensionConnectionTest = await this.testExtensionConnection();
          if (!extensionConnectionTest) {
            if (attempt < this.retryAttempts) {
              await new Promise(r => setTimeout(r, this.retryDelay));
              continue;
            } else {
              throw new Error('Extension background script not responding');
            }
          }
          
          // Test Jellyseerr server connection
          const serverConnectionTest = await this.testServerConnection();
          this.log('Server connection test result:', serverConnectionTest);
          if (!serverConnectionTest) {
            this.log('Server connection FAILED, attempt', attempt, 'of', this.retryAttempts);
            if (attempt < this.retryAttempts) {
              await new Promise(r => setTimeout(r, this.retryDelay));
              continue;
            } else {
              this.log('Final attempt failed, throwing error');
              throw new Error('Cannot connect to Jellyseerr server. Please check your server URL and API key in extension settings.');
            }
          } else {
            this.log('Server connection SUCCEEDED, proceeding with getMediaStatus');
          }
          
          chrome.runtime.sendMessage({
            action: 'getMediaStatus',
            data: mediaData
          }, (response) => {
            if (chrome.runtime.lastError) {
              if (attempt < this.retryAttempts) {
                setTimeout(() => this.getMediaStatus(mediaData).then(resolve).catch(reject), this.retryDelay);
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
          if (attempt === this.retryAttempts) {
            reject(err);
          } else {
            await new Promise(r => setTimeout(r, this.retryDelay));
          }
        }
      }
    });
  }

  /**
   * Request media on Jellyseerr
   * @param {Object} mediaData - Media information object
   * @returns {Promise<Object>} Request result
   */
  async requestMedia(mediaData) {
    return new Promise(async (resolve, reject) => {
      for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
        try {
          this.log(`Attempting to send message (attempt ${attempt}/${this.retryAttempts})`);
          
          // First check if we can connect to the background script
          const extensionConnectionTest = await this.testExtensionConnection();
          if (!extensionConnectionTest) {
            if (attempt < this.retryAttempts) {
              this.warn(`Extension connection test failed on attempt ${attempt}, retrying in ${this.retryDelay}ms...`);
              await new Promise(resolve => setTimeout(resolve, this.retryDelay));
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
              this.error(`Runtime error on attempt ${attempt}:`, errorMsg);
              
              if (errorMsg.includes('Receiving end does not exist') && attempt < this.retryAttempts) {
                // Don't reject immediately, let the retry loop handle it
                this.warn(`Connection lost, will retry...`);
                return;
              }
              
              reject(new Error(errorMsg));
            } else if (response && response.success) {
              this.log('Request successful:', response.data);
              resolve(response.data);
            } else {
              const errorMsg = response ? response.error : 'No response received';
              this.error(`Request failed:`, errorMsg);
              reject(new Error(errorMsg || 'Unknown error'));
            }
          });
          
          // Break out of retry loop if message was sent successfully
          break;
          
        } catch (err) {
          this.error(`Error on attempt ${attempt}:`, err);
          if (attempt === this.retryAttempts) {
            reject(err);
          } else {
            this.warn(`Retrying in ${this.retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          }
        }
      }
    });
  }

  /**
   * Debug search functionality
   * @param {string} title - Media title
   * @param {string} mediaType - 'movie' or 'tv'
   * @returns {Promise<Object>} Debug search results
   */
  async debugSearch(title, mediaType = 'movie') {
    try {
      const result = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'debugSearch',
          title: title,
          mediaType: mediaType
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
      this.log('Search debug result:', result);
      return result;
    } catch (err) {
      this.error('Failed to debug search:', err);
      return err;
    }
  }

  /**
   * Debug API functionality
   * @param {number} tmdbId - TMDB ID
   * @param {string} mediaType - 'movie' or 'tv'
   * @returns {Promise<Object>} API debug results
   */
  async debugAPI(tmdbId, mediaType = 'tv') {
    try {
      this.log('Running API debug...');
      const result = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'debugAPI',
          tmdbId: tmdbId || 1438,
          mediaType: mediaType
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
      
      console.log('API Debug Results:', result);
      
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
    } catch (err) {
      this.error('API debug failed:', err);
      return null;
    }
  }
}

// Export for use in content scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JellyseerrClient;
} else if (typeof window !== 'undefined') {
  window.JellyseerrClient = JellyseerrClient;
}