// Base Integration Class
// Common functionality for all site integrations using shared libraries

class BaseIntegration {
  constructor(siteName, options = {}) {
    this.siteName = siteName;
    this.debug = options.debug || false;
    this.uiTheme = options.uiTheme || 'button'; // 'button' or 'flyout'
    this.retryDelay = options.retryDelay || 2000;

    // Initialize shared components
    this.client = new JellyseerrClient({
      debug: this.debug,
      siteName: this.siteName,
      retryAttempts: options.retryAttempts || 3
    });

    this.extractor = new MediaExtractor({
      debug: this.debug,
      siteName: this.siteName
    });

    this.ui = new UIComponents({
      debug: this.debug,
      siteName: this.siteName,
      theme: this.uiTheme
    });

    // State
    this.mediaData = null;
    this.uiElements = {};
    this.currentUrl = window.location.href;
    this.navigationListener = null;
    this.currentStatusData = null; // Cache current status data for performance

    this.log('BaseIntegration initialized for', this.siteName);
  }

  log(...args) {
    if (this.debug) console.log(`🔗 [${this.siteName}]`, ...args);
  }

  error(...args) {
    console.error(`🚨 [${this.siteName}]`, ...args);
  }

  /**
   * Check if flyout is currently expanded
   */
  isFlyoutExpanded() {
    return this.uiElements.flyout?.classList.contains('expanded');
  }

  /**
   * Check if flyout exists in the DOM
   */
  hasFlyout() {
    return this.uiElements.flyout && this.uiElements.flyout.parentNode;
  }

  /**
   * Initialize the integration
   * Should be called by child classes
   */
  async init() {
    this.log('Initializing integration...');

    // Inject shared styles
    this.ui.injectStyles(this.getSiteSpecificCSS());

    // Wait for page to be ready
    if (document.readyState === 'loading') {
      this.log('Document loading, waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', () => this.extractAndSetup());
    } else {
      this.log('Document ready, starting extraction');
      this.extractAndSetup();
    }

    // Retry after delay for dynamic content
    setTimeout(() => {
      this.log(`Retry extraction after ${this.retryDelay}ms`);
      this.extractAndSetup();
    }, this.retryDelay);

    // Setup SPA navigation detection
    this.setupNavigationDetection();
  }

  /**
   * Extract media data and setup UI
   * Override extractMediaData() in child classes
   */
  async extractAndSetup() {
    try {
      this.log('Starting media data extraction...');
      const mediaData = await this.extractMediaData();
      this.log('Extracted media data:', mediaData);

      if (mediaData && mediaData.title) {
        this.mediaData = mediaData;
        this.log('Valid media data found, setting up UI...');
        await this.setupUI();
      } else {
        this.log('No valid media data found');
      }
    } catch (err) {
      this.error('Error in extractAndSetup:', err);
    }
  }

  /**
   * Extract media data from the page
   * MUST be implemented by child classes
   */
  async extractMediaData() {
    throw new Error('extractMediaData() must be implemented by child class');
  }

  /**
   * Get site-specific CSS
   * Can be overridden by child classes
   */
  getSiteSpecificCSS() {
    return ''; // Override in child classes for site-specific styling
  }

  /**
   * Setup UI based on theme (button or flyout)
   */
  async setupUI() {
    if (this.uiTheme === 'flyout') {
      await this.setupFlyoutUI();
    } else {
      await this.setupButtonUI();
    }
  }

  /**
   * Setup simple button UI (IMDB/TMDb style)
   */
  async setupButtonUI() {
    this.log('Setting up button UI...');

    // Check if button already exists
    if (this.uiElements.button && this.uiElements.button.parentNode) {
      this.log('Button already exists, skipping setup');
      return;
    }

    // Find insertion point (must be implemented by child class)
    const insertionPoint = this.getButtonInsertionPoint();
    if (!insertionPoint) {
      this.log('No insertion point found for button');
      return;
    }

    // Create button
    const button = this.ui.createRequestButton({
      text: 'Request on Jellyseerr'
    });

    // Add click handler
    button.addEventListener('click', () => this.handleRequest());

    // Insert button
    insertionPoint.appendChild(button);
    this.uiElements.button = button;

    // Update with status
    await this.updateStatus();

    this.log('Button UI setup complete');
  }

  /**
   * Setup flyout UI (RT style)
   */
  async setupFlyoutUI() {
    this.log('Setting up flyout UI...');

    // Preserve expanded flyout - don't recreate
    if (this.isFlyoutExpanded()) {
      this.log('Flyout is already expanded, skipping setup');
      return;
    }

    // Remove existing collapsed flyout
    if (this.hasFlyout()) {
      this.log('Removing existing collapsed flyout');
      this.uiElements.flyout.parentNode.removeChild(this.uiElements.flyout);
    }

    // Create new flyout
    const { flyout, tab, panel } = this.ui.createFlyout();
    const elements = this.ui.createFlyoutContent(this.mediaData, panel);

    // Add click handler to button
    elements.button.addEventListener('click', () => this.handleRequest());

    // Add flyout to page
    document.body.appendChild(flyout);

    // Store references
    this.uiElements = { flyout, tab, panel, ...elements };

    // Setup debug functions
    this.setupDebugFunctions();

    // Update with status
    await this.updateStatus();

    this.log('Flyout UI setup complete');
  }

  /**
   * Get insertion point for button UI
   * MUST be implemented by child classes using button UI
   */
  getButtonInsertionPoint() {
    throw new Error('getButtonInsertionPoint() must be implemented by child class when using button UI');
  }

  /**
   * Update UI with current media status
   */
  async updateStatus() {
    try {
      this.log('Updating status...');

      // Update tab icon to loading state
      if (this.uiElements.tab) {
        this.ui.updateTabIcon(this.uiElements.tab, 'checking');
      }

      // Get status from Jellyseerr
      const statusData = await this.client.getMediaStatus(this.mediaData);
      this.log('Status received:', statusData);

      // Cache status data for instant access during button clicks
      this.currentStatusData = statusData;

      // Update UI based on theme
      if (this.uiTheme === 'flyout') {
        this.ui.updateFlyoutStatus(this.uiElements, statusData);
        this.ui.updateTabIcon(this.uiElements.tab, statusData.status, statusData);
      } else {
        this.ui.updateButtonStatus(this.uiElements.button, statusData);
      }

    } catch (err) {
      this.error('Error updating status:', err);
      this.log('Error details:', err.message);

      // Handle errors appropriately - be more specific about error types
      const errorStatus = this.getErrorStatus(err);
      this.log('Determined error status:', errorStatus);

      if (this.uiTheme === 'flyout') {
        this.ui.updateFlyoutStatus(this.uiElements, errorStatus);
        
        // Only update tab icon to error if it's actually a server connection error
        // Otherwise, default to 'available' status
        const tabStatus = errorStatus.status === 'error' ? 'error' : 'available';
        this.ui.updateTabIcon(this.uiElements.tab, tabStatus, errorStatus);
      } else {
        this.ui.updateButtonStatus(this.uiElements.button, errorStatus);
      }
    }
  }

  /**
   * Handle request button click
   */
  async handleRequest() {
    if (!this.mediaData) {
      this.ui.createNotification('Error', 'Could not extract media information', 'error');
      return;
    }

    this.log('Handling request for:', this.mediaData.title);

    const currentButton = this.uiTheme === 'flyout' ? this.uiElements.button : this.uiElements.button;
    const buttonText = currentButton?.querySelector('span')?.textContent ?? '';
    const isWatchButton = buttonText === 'Watch on Jellyfin' || currentButton?.classList.contains('watch');

    this.log('Button analysis:', { buttonText, isWatchButton });

    if (isWatchButton) {
      await this.handleWatchButtonClick();
    } else {
      await this.handleRequestButtonClick();
    }
  }

  /**
   * Handle "Watch on Jellyfin" button click
   */
  async handleWatchButtonClick() {
    this.log('Detected Watch on Jellyfin button click');

    this.setUILoading(`Opening "${this.mediaData.title}" on Jellyfin...`, 'Opening...');

    // Try to use cached watch URL first
    if (this.currentStatusData?.watchUrl) {
      this.log('Using cached watch URL');
      await this.openJellyfin(this.currentStatusData.watchUrl);
      return;
    }

    // Fall back to API call
    this.log('No cached watch URL, fetching from API');
    try {
      const statusData = await this.client.getMediaStatus(this.mediaData);

      if (statusData.watchUrl) {
        await this.openJellyfin(statusData.watchUrl);
        return;
      }
    } catch (err) {
      this.error('Failed to get watch URL from API:', err);
    }

    // If we get here, something went wrong
    this.ui.createNotification(
        'Watch URL Not Available',
        'Could not find Jellyfin watch URL. Trying to request instead...',
        'warning',
        4000
    );

    // Fall through to regular request handling
    await this.handleRequestButtonClick();
  }

  /**
   * Open Jellyfin in a new window
   */
  async openJellyfin(watchUrl) {
    this.log('Opening Jellyfin URL:', watchUrl);

    setTimeout(() => {
      window.open(watchUrl, '_blank');

      this.ui.createNotification(
          'Opening Jellyfin',
          `Opening "${this.mediaData.title}" on Jellyfin`,
          'success',
          3000
      );

      // Reset button state after a short delay
      setTimeout(() => {
        if (this.currentStatusData) {
          this.updateUIFromStatus(this.currentStatusData);
        }
      }, 500);
    }, 100); // Very short delay for visual feedback
  }

  /**
   * Handle regular request button click
   */
  async handleRequestButtonClick() {
    try {
      this.setUILoading(`Requesting "${this.mediaData.title}"...`, 'Requesting...');

      // Send request
      const result = await this.client.requestMedia(this.mediaData);
      this.log('Request successful:', result);

      // Show success notification
      this.ui.createNotification(
          'Request Sent!',
          `${this.mediaData.title} has been added to your Jellyseerr requests`,
          'success'
      );

      // Auto-close flyout after success
      if (this.uiTheme === 'flyout' && this.isFlyoutExpanded()) {
        setTimeout(() => {
          this.uiElements.flyout.classList.remove('expanded');
          this.uiElements.flyout.classList.add('collapsed');
          this.log('Auto-closing flyout after successful request');
        }, 4000);
      }

      // Update status after delay
      setTimeout(() => this.updateStatus(), 2000);

    } catch (err) {
      this.error('Request failed:', err);

      this.ui.createNotification(
          'Request Failed',
          err.message || 'Failed to send request to Jellyseerr',
          'error'
      );

      // Reset UI after delay
      setTimeout(() => this.updateStatus(), 3000);
    }
  }

  /**
   * Set UI to loading state
   */
  setUILoading(message, buttonText) {
    const loadingState = {
      status: 'loading',
      message,
      buttonText,
      disabled: true
    };

    if (this.uiTheme === 'flyout') {
      this.ui.updateFlyoutStatus(this.uiElements, loadingState);
    } else {
      this.ui.updateButtonStatus(this.uiElements.button, loadingState);
    }
  }

  /**
   * Update UI from cached status data
   */
  updateUIFromStatus(statusData) {
    if (this.uiTheme === 'flyout') {
      this.ui.updateFlyoutStatus(this.uiElements, statusData);
    } else {
      this.ui.updateButtonStatus(this.uiElements.button, statusData);
    }
  }

  /**
   * Get error status for UI updates
   */
  getErrorStatus(error) {
    const isServerError = error.message && (
        error.message.includes('connect') ||
        error.message.includes('Server URL and API key') ||
        error.message.includes('Connection failed') ||
        error.message.toLowerCase().includes('cors')
    );

    if (isServerError) {
      return {
        status: 'error',
        buttonText: 'Server Error',
        buttonClass: 'error',
        message: 'Cannot connect to Jellyseerr server'
      };
    } else {
      return {
        status: 'available',
        buttonText: 'Request on Jellyseerr',
        buttonClass: 'request',
        message: 'Ready to request'
      };
    }
  }

  /**
   * Setup debug functions on window object
   */
  setupDebugFunctions() {
    if (!window.jellyseerr_debug) {
      window.jellyseerr_debug = {};
    }

    window.jellyseerr_debug[this.siteName.toLowerCase()] = {
      updateStatus: () => this.updateStatus(),
      testAPI: () => this.client.debugAPI(),
      mediaData: this.mediaData,
      testExtensionConnection: () => this.client.testExtensionConnection(),
      testServerConnection: () => this.client.testServerConnection(),
      debugSearch: (title, mediaType) => this.client.debugSearch(title || this.mediaData?.title, mediaType || this.mediaData?.mediaType),
      getStatus: () => this.client.getMediaStatus(this.mediaData),
      expandFlyout: () => {
        if (this.uiElements.flyout) {
          this.uiElements.flyout.classList.remove('collapsed');
          this.uiElements.flyout.classList.add('expanded');
        }
      },
      collapseFlyout: () => {
        if (this.uiElements.flyout) {
          this.uiElements.flyout.classList.remove('expanded');
          this.uiElements.flyout.classList.add('collapsed');
        }
      },
      testTabIcons: () => {
        if (!this.uiElements.tab) {
          console.log('No tab found for icon testing');
          return;
        }
        console.log('Testing all tab icon states...');
        const states = ['checking', 'available', 'pending', 'downloading', 'ready', 'error'];
        let i = 0;
        const cycle = () => {
          this.ui.updateTabIcon(this.uiElements.tab, states[i]);
          console.log('Tab icon:', states[i]);
          i = (i + 1) % states.length;
          if (i !== 0) setTimeout(cycle, 2000);
        };
        cycle();
      },
      forceTabStatus: (status) => {
        if (this.uiElements.tab) {
          this.ui.updateTabIcon(this.uiElements.tab, status || 'available');
          console.log('Forced tab icon to:', status || 'available');
        }
      }
    };

    this.log('Debug functions added to window.jellyseerr_debug.' + this.siteName.toLowerCase());
  }

  /**
   * Utility method for child classes to create standardized media data
   */
  createMediaData(extractedData) {
    return this.extractor.createMediaData(extractedData, this.siteName.toLowerCase());
  }

  /**
   * Utility method for finding insertion points with fallback options
   */
  findInsertionPoint(selectors, context = 'insertion point') {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      this.log(`Trying ${context} selector "${selector}":`, element ? 'found' : 'not found');
      if (element) {
        this.log(`Using ${context}:`, selector);
        return element;
      }
    }
    this.log(`No ${context} found with selectors:`, selectors);
    return null;
  }

  /**
   * Setup Single Page Application (SPA) navigation detection
   * Detects URL changes without page refreshes (like React Router)
   */
  setupNavigationDetection() {
    this.log('Setting up SPA navigation detection');

    // Method 1: Override pushState and replaceState (most reliable)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const handleNavigation = () => {
      const newUrl = window.location.href;
      if (newUrl !== this.currentUrl) {
        this.log('SPA navigation detected:', this.currentUrl, '->', newUrl);
        this.currentUrl = newUrl;
        this.handleNavigationChange();
      }
    };

    // Override history methods
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(handleNavigation, 100); // Small delay for React to update DOM
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(handleNavigation, 100);
    };

    // Method 2: Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', () => {
      setTimeout(handleNavigation, 100);
    });

    // Method 3: Polling as fallback (for edge cases)
    this.navigationListener = setInterval(() => {
      const newUrl = window.location.href;
      if (newUrl !== this.currentUrl) {
        this.log('Navigation detected via polling:', this.currentUrl, '->', newUrl);
        this.currentUrl = newUrl;
        this.handleNavigationChange();
      }
    }, 1000);
  }

  /**
   * Handle navigation change in SPAs
   */
  async handleNavigationChange() {
    this.log('Handling navigation change to:', this.currentUrl);

    // Protect expanded flyout from cleanup
    if (this.isFlyoutExpanded()) {
      this.log('Flyout is open, deferring navigation handling');
      return;
    }

    // Clean up existing UI
    this.cleanupUI();

    // Wait a bit for the new page content to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Re-extract and setup for the new page
    await this.extractAndSetup();

    // Retry after delay for dynamic content
    setTimeout(() => {
      this.log('Retry extraction after navigation');
      this.extractAndSetup();
    }, this.retryDelay);
  }

  /**
   * Clean up existing UI elements
   */
  cleanupUI() {
    this.log('Cleaning up existing UI');

    // Protect expanded flyout from removal
    if (this.isFlyoutExpanded()) {
      this.log('Flyout is expanded, skipping cleanup');
      return;
    }

    // Remove flyout if it exists and is not expanded
    if (this.hasFlyout()) {
      this.uiElements.flyout.parentNode.removeChild(this.uiElements.flyout);
    }

    // Remove button if it exists
    if (this.uiElements.button && this.uiElements.button.parentNode) {
      this.uiElements.button.parentNode.removeChild(this.uiElements.button);
    }

    // Clear references
    this.uiElements = {};
    this.mediaData = null;
    this.currentStatusData = null;
  }

  /**
   * Cleanup when extension is unloaded
   */
  destroy() {
    if (this.navigationListener) {
      clearInterval(this.navigationListener);
    }
    this.cleanupUI();
  }
}

// Export for use in content scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaseIntegration;
} else if (typeof window !== 'undefined') {
  window.BaseIntegration = BaseIntegration;
}