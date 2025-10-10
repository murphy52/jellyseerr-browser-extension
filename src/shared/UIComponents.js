// Shared UI Components Library
// Reusable UI elements for all site integrations

class UIComponents {
  constructor(options = {}) {
    this.debug = options.debug || false;
    this.siteName = options.siteName || 'UNKNOWN';
    this.theme = options.theme || 'default'; // 'default', 'flyout', 'minimal'
  }

  log(...args) {
    if (this.debug) console.log(`🎨 [${this.siteName}]`, ...args);
  }

  /**
   * Create a notification element
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} type - 'success', 'error', 'info', 'warning'
   * @param {number} duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
   * @returns {HTMLElement} Notification element
   */
  createNotification(title, message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `jellyseerr-notification ${type}`;
    notification.innerHTML = `
      <div class="jellyseerr-notification-title">${title}</div>
      <div class="jellyseerr-notification-message">${message}</div>
      <button class="jellyseerr-notification-close">&times;</button>
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.jellyseerr-notification-close');
    closeBtn.addEventListener('click', () => {
      this.removeNotification(notification);
    });

    // Auto-remove if duration specified
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, duration);
    }

    // Add to page
    document.body.appendChild(notification);
    this.log('Notification created:', type, title);

    return notification;
  }

  /**
   * Remove notification with animation
   * @param {HTMLElement} notification - Notification element to remove
   */
  removeNotification(notification) {
    if (notification && notification.parentNode) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }

  /**
   * Create a simple request button (IMDB/TMDb style)
   * @param {Object} options - Button configuration
   * @returns {HTMLElement} Button element
   */
  createRequestButton(options = {}) {
    const button = document.createElement('button');
    button.className = 'jellyseerr-request-button request';
    button.innerHTML = `
      <svg class="jellyseerr-button-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      <span>${options.text || 'Request on Jellyseerr'}</span>
    `;

    if (options.disabled) {
      button.disabled = true;
    }

    this.log('Request button created');
    return button;
  }

  /**
   * Update button appearance based on status
   * @param {HTMLElement} button - Button element
   * @param {Object} statusData - Status information
   */
  updateButtonStatus(button, statusData) {
    if (!button) return;

    button.classList.remove('loading', 'success', 'error', 'pending', 'available', 'downloading');
    button.classList.add(statusData.buttonClass || 'request');
    
    // Disable button for pending/requested status (Issue #3 fix)
    const shouldDisable = statusData.disabled || 
                         statusData.status === 'pending' || 
                         statusData.status === 'requested' ||
                         statusData.status === 'downloading';
    button.disabled = shouldDisable;

    let iconPath = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'; // Default plus icon

    // Use consistent icons with tab icons for each status
    switch (statusData.status) {
      case 'pending':
      case 'requested':
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z'; // Clock (matches tab)
        break;
      case 'downloading':
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 11l-4 4-4-4h3V9h2v4h3z'; // Download with circle (matches tab)
        break;
      case 'available':
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z'; // Plus icon (matches tab)
        break;
      case 'ready':
      case 'available_watch':
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'; // Checkmark (matches tab)
        break;
      case 'partial':
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'; // Checkmark since content is available (matches tab)
        break;
      case 'error':
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 7 9.5 10.5 12 7 14.5 8.5 16 12 13.5 15.5 16 17 14.5 13.5 12 17 9.5 15.5 8z'; // X (matches tab)
        break;
    }

    button.innerHTML = `
      <svg class="jellyseerr-button-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="${iconPath}"/>
      </svg>
      <span>${statusData.buttonText || 'Request on Jellyseerr'}</span>
    `;

    this.log('Button status updated:', statusData.status, statusData.buttonText);
  }

  /**
   * Create a flyout interface (RT style, adaptable for other sites)
   * @param {Object} options - Flyout configuration
   * @returns {Object} Flyout elements { flyout, tab, panel }
   */
  createFlyout(options = {}) {
    const flyoutId = `jellyseerr-flyout-${this.siteName.toLowerCase()}`;
    
    // Remove existing flyout if it exists
    const existingFlyout = document.getElementById(flyoutId);
    if (existingFlyout) {
      existingFlyout.remove();
    }

    // Create main flyout container
    const flyout = document.createElement('div');
    flyout.id = flyoutId;
    flyout.className = 'jellyseerr-flyout collapsed';
    
    // Create tab (always visible part)
    const tab = document.createElement('div');
    tab.className = 'jellyseerr-tab';
    tab.innerHTML = `
      <svg class="jellyseerr-tab-icon jellyseerr-connection-status checking" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path class="jellyseerr-icon-path" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span class="jellyseerr-tab-text">Jellyseerr</span>
    `;
    
    // Create content panel
    const panel = document.createElement('div');
    panel.className = 'jellyseerr-panel';
    
    // Add toggle functionality
    tab.addEventListener('click', () => {
      flyout.classList.toggle('collapsed');
      flyout.classList.toggle('expanded');
      this.log('Flyout toggled:', flyout.classList.contains('expanded') ? 'expanded' : 'collapsed');
    });
    
    // Assemble flyout
    flyout.appendChild(tab);
    flyout.appendChild(panel);
    
    this.log('Flyout created');
    return { flyout, tab, panel };
  }

  /**
   * Create flyout content (media info + status + button)
   * @param {Object} mediaData - Media information
   * @param {HTMLElement} panel - Panel element to populate
   * @returns {Object} Created elements { statusSection, button }
   */
  createFlyoutContent(mediaData, panel) {
    // Status section
    const statusSection = document.createElement('div');
    statusSection.className = 'jellyseerr-status-section';
    statusSection.innerHTML = `
      <div class="jellyseerr-media-info">
        <h3 class="jellyseerr-title">${mediaData.title || 'Unknown Title'}</h3>
        <p class="jellyseerr-year">${mediaData.year || 'Unknown Year'} • ${mediaData.mediaType === 'tv' ? 'TV Series' : 'Movie'}</p>
      </div>
      <div class="jellyseerr-status-indicator">
        <div class="jellyseerr-status-icon loading"></div>
        <span class="jellyseerr-status-text">Connecting to Jellyseerr...</span>
      </div>
    `;
    
    // Action button
    const button = document.createElement('button');
    button.className = 'jellyseerr-action-button loading';
    button.disabled = true;
    button.innerHTML = `
      <svg class="jellyseerr-button-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>Connecting to Jellyseerr...</span>
    `;
    
    // Assemble panel
    panel.appendChild(statusSection);
    panel.appendChild(button);
    
    this.log('Flyout content created for:', mediaData.title);
    return { 
      statusSection, 
      button, 
      statusIcon: statusSection.querySelector('.jellyseerr-status-icon'),
      statusText: statusSection.querySelector('.jellyseerr-status-text')
    };
  }

  /**
   * Update flyout status indicators
   * @param {Object} elements - Flyout elements from createFlyoutContent
   * @param {Object} statusData - Status information
   */
  updateFlyoutStatus(elements, statusData) {
    const { statusIcon, statusText, button } = elements;
    
    // Update status indicator
    if (statusIcon && statusText) {
      statusIcon.className = `jellyseerr-status-icon ${statusData.status || 'loading'}`;
      
      // Add monitoring indicator if available (Issue #4)
      let statusMessage = statusData.message || 'Connecting to Jellyseerr...';
      if (statusData.monitoring && statusData.monitoring.message) {
        statusMessage = `${statusData.monitoring.indicator} ${statusData.monitoring.message}`;
        this.log('Added monitoring indicator:', statusData.monitoring);
      }
      
      statusText.textContent = statusMessage;
    }
    
    // Update action button
    if (button) {
      this.updateButtonStatus(button, statusData);
    }
    
    this.log('Flyout status updated:', statusData.status);
  }

  /**
   * Update flyout tab icon based on connection status and optionally set tooltip
   * @param {HTMLElement} tab - Tab element
   * @param {string} status - Status: 'checking', 'available', 'pending', 'downloading', 'ready', 'error'
   * @param {Object} statusData - Optional status data with tooltip info
   */
  updateTabIcon(tab, status, statusData = null) {
    const iconElement = tab.querySelector('.jellyseerr-connection-status');
    const pathElement = tab.querySelector('.jellyseerr-icon-path');
    
    if (!iconElement || !pathElement) return;
    
    let statusClass, iconPath;
    
    switch (status) {
      case 'checking':
      case 'loading':
        statusClass = 'jellyseerr-tab-icon jellyseerr-connection-status checking';
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';
        break;
      case 'available':
        statusClass = 'jellyseerr-tab-icon jellyseerr-connection-status available';
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z';
        break;
      case 'pending':
      case 'requested':
        statusClass = 'jellyseerr-tab-icon jellyseerr-connection-status pending';
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z';
        break;
      case 'downloading':
        statusClass = 'jellyseerr-tab-icon jellyseerr-connection-status downloading';
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 11l-4 4-4-4h3V9h2v4h3z';
        break;
      case 'ready':
      case 'available_watch':
        statusClass = 'jellyseerr-tab-icon jellyseerr-connection-status ready';
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';
        break;
      case 'partial':
        statusClass = 'jellyseerr-tab-icon jellyseerr-connection-status partial';
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'; // Checkmark since content is available
        break;
      case 'error':
      default:
        statusClass = 'jellyseerr-tab-icon jellyseerr-connection-status error';
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 7 9.5 10.5 12 7 14.5 8.5 16 12 13.5 15.5 16 17 14.5 13.5 12 17 9.5 15.5 8z';
        break;
    }
    
    iconElement.setAttribute('class', statusClass);
    pathElement.setAttribute('d', iconPath);
    
    // Update tooltip with status message and monitoring info (Issue #4)
    if (statusData) {
      let tooltipText = statusData.message || `Jellyseerr - ${status}`;
      if (statusData.monitoring && statusData.monitoring.message) {
        tooltipText += ` ${statusData.monitoring.indicator} ${statusData.monitoring.message}`;
        this.log('Added monitoring indicator to tab tooltip:', statusData.monitoring);
      }
      tab.title = tooltipText;
    }
    
    this.log('Tab icon updated to status:', status);
  }

  /**
   * Inject shared CSS styles for UI components
   * @param {string} additionalCSS - Site-specific CSS to include
   */
  injectStyles(additionalCSS = '') {
    const styleId = `jellyseerr-styles-${this.siteName.toLowerCase()}`;
    
    if (document.getElementById(styleId)) {
      return; // Already injected
    }

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = this.getSharedCSS() + additionalCSS;
    document.head.appendChild(styleElement);
    
    this.log('Shared styles injected');
  }

  /**
   * Get shared CSS for all UI components
   * @returns {string} CSS string
   */
  getSharedCSS() {
    return `
      /* Jellyseerr Shared UI Components - Default Purple Theme */
      .jellyseerr-request-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-weight: 500;
        font-size: 0.875rem;
        padding: 0.5rem 1rem;
        border: 2px solid #8b5cf6;
        border-radius: 0.375rem;
        cursor: pointer;
        text-decoration: none;
        white-space: nowrap;
        min-width: 120px;
        position: relative;
        z-index: 9999;
        transition: all 0.15s ease-in-out;
        outline: none;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
      }

      .jellyseerr-request-button:hover:not(:disabled) {
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        border-color: #7c3aed;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
      }

      .jellyseerr-request-button:disabled {
        background: #6b7280;
        border-color: #6b7280;
        color: #d1d5db;
        cursor: not-allowed;
        opacity: 0.6;
      }

      .jellyseerr-request-button.pending {
        background: rgba(245, 158, 11, 0.8);
        border-color: #f59e0b;
      }

      .jellyseerr-request-button.downloading {
        background: rgba(59, 130, 246, 0.8);
        border-color: #3b82f6;
      }

      .jellyseerr-request-button.available {
        background: rgba(16, 185, 129, 0.8);
        border-color: #10b981;
      }

      .jellyseerr-request-button.error {
        background: rgba(239, 68, 68, 0.8);
        border-color: #ef4444;
      }

      .jellyseerr-button-icon {
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
        fill: currentColor;
        flex-shrink: 0;
      }

      /* Notifications */
      .jellyseerr-notification {
        position: fixed;
        top: 1.25rem;
        right: 1.25rem;
        background: #1f2937;
        border: 1px solid #374151;
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
        z-index: 10000;
        min-width: 300px;
        animation: slideIn 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        color: #f9fafb;
        opacity: 1;
        transform: translateX(0);
        transition: all 0.3s ease;
      }

      .jellyseerr-notification.success { border-left: 4px solid #10b981; }
      .jellyseerr-notification.error { border-left: 4px solid #ef4444; }
      .jellyseerr-notification.warning { border-left: 4px solid #f59e0b; }
      .jellyseerr-notification.info { border-left: 4px solid #3b82f6; }

      .jellyseerr-notification-title {
        font-weight: 600;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }

      .jellyseerr-notification-message {
        font-size: 0.8rem;
        color: #d1d5db;
        line-height: 1.4;
      }

      .jellyseerr-notification-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 1.2rem;
        line-height: 1;
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .jellyseerr-notification-close:hover {
        color: #f9fafb;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Flyout Components (imported from RT styles) */
      .jellyseerr-flyout {
        position: fixed;
        right: 0;
        top: 25%;
        transform: translateY(-50%);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
        transform: translateY(-50%) translateX(100%);
      }

      .jellyseerr-flyout.expanded {
        transform: translateY(-50%) translateX(0);
      }

      /* Default Jellyseerr brand theme - purple/violet gradient */
      .jellyseerr-tab {
        position: absolute;
        left: -60px;
        top: 50%;
        transform: translateY(-50%);
        width: 60px;
        height: 120px;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        border: 2px solid #8b5cf6;
        border-radius: 8px 0 0 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: -2px 0 12px rgba(139, 92, 246, 0.3);
        transition: all 0.2s ease;
        color: white;
        user-select: none;
      }

      .jellyseerr-tab:hover {
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        border-color: #7c3aed;
        transform: translateY(-50%) translateX(-4px);
        box-shadow: -6px 0 16px rgba(139, 92, 246, 0.4);
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

      .jellyseerr-panel {
        width: 320px;
        background: white;
        border-radius: 8px 0 0 8px;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
        border: 1px solid #e2e8f0;
        overflow: hidden;
      }

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

      .jellyseerr-status-icon.partial {
        background: #10b981; /* Green since content is partially available */
      }

      .jellyseerr-status-icon.error {
        background: #ef4444;
      }

      .jellyseerr-status-text {
        font-size: 14px;
        color: #475569;
        font-weight: 500;
      }

      /* Default Jellyseerr brand theme for action button */
      .jellyseerr-action-button {
        width: 100%;
        padding: 14px 20px;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        border: 2px solid #8b5cf6;
        color: white;
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
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        border-color: #7c3aed;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
      }

      .jellyseerr-action-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        opacity: 0.7;
      }

      /* Tab status colors */
      .jellyseerr-connection-status.checking {
        color: #cbd5e0 !important;
        animation: pulse 2s infinite;
      }

      .jellyseerr-connection-status.available {
        color: #10b981 !important;
      }

      .jellyseerr-connection-status.pending {
        color: #f59e0b !important;
      }

      .jellyseerr-connection-status.downloading {
        color: #3b82f6 !important;
        animation: pulse 1.5s infinite;
      }

      .jellyseerr-connection-status.ready {
        color: #10b981 !important;
      }

      .jellyseerr-connection-status.partial {
        color: #10b981 !important; /* Green like ready/available since content is available */
      }

      .jellyseerr-connection-status.error {
        color: #ef4444 !important;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      /* Dark mode support */
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
    `;
  }
}

// Export for use in content scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIComponents;
} else if (typeof window !== 'undefined') {
  window.UIComponents = UIComponents;
}