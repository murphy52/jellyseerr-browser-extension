// Popup JavaScript

class PopupManager {
  constructor() {
    this.statusIndicator = document.getElementById('statusIndicator');
    this.configuredState = document.getElementById('configuredState');
    this.notConfiguredState = document.getElementById('notConfiguredState');
    this.errorState = document.getElementById('errorState');
    this.errorMessage = document.getElementById('errorMessage');
    this.serverUrlSpan = document.getElementById('serverUrl');
    this.openOptionsButton = document.getElementById('openOptions');
    this.testConnectionButton = document.getElementById('testConnection');
    
    this.init();
  }

  async init() {
    // Bind event listeners
    this.openOptionsButton.addEventListener('click', () => this.openOptions());
    this.testConnectionButton.addEventListener('click', () => this.testConnection());
    
    // Check status on load
    await this.checkStatus();
  }

  async checkStatus() {
    try {
      // Load settings from storage
      const settings = await chrome.storage.sync.get(['jellyseerrUrl', 'jellyseerrApiKey']);
      
      if (!settings.jellyseerrUrl || !settings.jellyseerrApiKey) {
        this.showNotConfiguredState();
        return;
      }

      // Update server URL display
      this.serverUrlSpan.textContent = this.formatServerUrl(settings.jellyseerrUrl);
      
      // Test connection
      this.setStatus('loading', 'Checking connection...');
      
      try {
        const response = await this.sendMessage({ action: 'testConnection' });
        
        if (response.success) {
          this.showConfiguredState();
          this.setStatus('connected', `Connected as ${response.data.user}`);
        } else {
          this.showErrorState(response.error || 'Connection failed');
          this.setStatus('error', 'Connection failed');
        }
      } catch (error) {
        this.showErrorState(error.message);
        this.setStatus('error', 'Connection error');
      }
      
    } catch (error) {
      console.error('Error checking status:', error);
      this.showErrorState('Failed to load extension status');
      this.setStatus('error', 'Error');
    }
  }

  showConfiguredState() {
    this.hideAllStates();
    this.configuredState.classList.remove('hidden');
    this.testConnectionButton.classList.remove('hidden');
  }

  showNotConfiguredState() {
    this.hideAllStates();
    this.notConfiguredState.classList.remove('hidden');
    this.setStatus('warning', 'Setup required');
  }

  showErrorState(message) {
    this.hideAllStates();
    this.errorState.classList.remove('hidden');
    this.errorMessage.textContent = message;
    this.testConnectionButton.classList.remove('hidden');
  }

  hideAllStates() {
    this.configuredState.classList.add('hidden');
    this.notConfiguredState.classList.add('hidden');
    this.errorState.classList.add('hidden');
    this.testConnectionButton.classList.add('hidden');
  }

  setStatus(type, text) {
    // Remove all status classes
    this.statusIndicator.classList.remove('connected', 'error', 'warning', 'loading');
    
    // Add new status class
    this.statusIndicator.classList.add(type);
    
    // Update status text
    this.statusIndicator.querySelector('.status-text').textContent = text;
  }

  formatServerUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  }

  async openOptions() {
    try {
      await chrome.runtime.openOptionsPage();
      window.close();
    } catch (error) {
      console.error('Error opening options page:', error);
    }
  }

  async testConnection() {
    this.testConnectionButton.disabled = true;
    this.testConnectionButton.textContent = 'Testing...';
    this.setStatus('loading', 'Testing connection...');
    
    try {
      const response = await this.sendMessage({ action: 'testConnection' });
      
      if (response.success) {
        this.setStatus('connected', `Connected as ${response.data.user}`);
        this.showConfiguredState();
      } else {
        this.setStatus('error', 'Connection failed');
        this.showErrorState(response.error || 'Connection test failed');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      this.setStatus('error', 'Connection error');
      this.showErrorState(error.message);
    } finally {
      this.testConnectionButton.disabled = false;
      this.testConnectionButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Test Connection
      `;
    }
  }

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PopupManager());
} else {
  new PopupManager();
}