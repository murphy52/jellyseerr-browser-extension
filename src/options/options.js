// Options page JavaScript

class OptionsManager {
  constructor() {
    this.form = document.getElementById('settingsForm');
    this.serverUrlInput = document.getElementById('serverUrl');
    this.apiKeyInput = document.getElementById('apiKey');
    this.testButton = document.getElementById('testConnection');
    this.reloadButton = document.getElementById('reloadSettings');
    this.toggleButton = document.getElementById('toggleApiKey');
    this.statusDiv = document.getElementById('status');
    
    this.init();
  }

  async init() {
    // Load existing settings
    await this.loadSettings();
    
    // Bind event listeners
    this.form.addEventListener('submit', (e) => this.handleSave(e));
    this.testButton.addEventListener('click', () => this.testConnection());
    this.reloadButton.addEventListener('click', () => this.reloadSettings());
    this.toggleButton.addEventListener('click', () => this.toggleApiKeyVisibility());
    
    // Auto-save on input change (with debounce)
    let saveTimeout;
    [this.serverUrlInput, this.apiKeyInput].forEach(input => {
      input.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => this.autoSave(), 1000);
      });
    });
  }

  async loadSettings() {
    try {
      const settings = await chrome.storage.sync.get(['jellyseerrUrl', 'jellyseerrApiKey']);
      
      if (settings.jellyseerrUrl) {
        this.serverUrlInput.value = settings.jellyseerrUrl;
      }
      
      if (settings.jellyseerrApiKey) {
        this.apiKeyInput.value = settings.jellyseerrApiKey;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showStatus('error', 'Failed to load settings');
    }
  }

  async handleSave(event) {
    event.preventDefault();
    await this.saveSettings();
  }

  async autoSave() {
    // Only auto-save if both fields have values
    if (this.serverUrlInput.value.trim() && this.apiKeyInput.value.trim()) {
      await this.saveSettings(false); // Don't show success message for auto-save
    }
  }

  async saveSettings(showSuccess = true) {
    const serverUrl = this.serverUrlInput.value.trim();
    const apiKey = this.apiKeyInput.value.trim();

    // Basic validation
    if (!serverUrl || !apiKey) {
      this.showStatus('error', 'Both server URL and API key are required');
      return;
    }

    // Validate URL format
    try {
      new URL(serverUrl);
    } catch (error) {
      this.showStatus('error', 'Please enter a valid server URL');
      return;
    }

    try {
      // Save to storage
      await chrome.storage.sync.set({
        jellyseerrUrl: serverUrl,
        jellyseerrApiKey: apiKey
      });

      if (showSuccess) {
        this.showStatus('success', 'Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('error', 'Failed to save settings');
    }
  }

  async reloadSettings() {
    this.reloadButton.disabled = true;
    this.reloadButton.textContent = 'Reloading...';
    this.showStatus('loading', 'Forcing background script to reload settings...');

    try {
      // Tell background script to reload settings from storage
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'reloadSettings' }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });

      if (response.success) {
        this.showStatus('success', 'Settings reloaded successfully! Try your connection now.');
      } else {
        this.showStatus('error', response.error || 'Failed to reload settings');
      }
    } catch (error) {
      console.error('Settings reload error:', error);
      this.showStatus('error', `Failed to reload settings: ${error.message}`);
    } finally {
      this.reloadButton.disabled = false;
      this.reloadButton.textContent = 'Reload Settings';
    }
  }

  async testConnection() {
    const serverUrl = this.serverUrlInput.value.trim();
    const apiKey = this.apiKeyInput.value.trim();

    if (!serverUrl || !apiKey) {
      this.showStatus('error', 'Please enter both server URL and API key before testing');
      return;
    }

    // Validate URL format
    try {
      new URL(serverUrl);
    } catch (error) {
      this.showStatus('error', 'Please enter a valid server URL');
      return;
    }

    this.testButton.disabled = true;
    this.testButton.textContent = 'Testing...';
    this.showStatus('loading', 'Testing connection to Jellyseerr server...');

    try {
      // Save settings first (so background script can use them)
      await chrome.storage.sync.set({
        jellyseerrUrl: serverUrl,
        jellyseerrApiKey: apiKey
      });

      // Test the connection via background script
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'testConnection' }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });

      if (response.success) {
        this.showStatus('success', `Connected successfully! Welcome, ${response.data.user}`);
      } else {
        this.showStatus('error', response.error || 'Connection test failed');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      this.showStatus('error', `Connection failed: ${error.message}`);
    } finally {
      this.testButton.disabled = false;
      this.testButton.textContent = 'Test Connection';
    }
  }

  toggleApiKeyVisibility() {
    const isPassword = this.apiKeyInput.type === 'password';
    this.apiKeyInput.type = isPassword ? 'text' : 'password';
    this.toggleButton.textContent = isPassword ? 'Hide' : 'Show';
  }

  showStatus(type, message) {
    this.statusDiv.className = `status ${type}`;
    this.statusDiv.querySelector('.status-text').textContent = message;
    
    // Auto-hide status after 5 seconds (except for loading)
    if (type !== 'loading') {
      setTimeout(() => {
        this.statusDiv.className = 'status hidden';
      }, 5000);
    }
  }

  hideStatus() {
    this.statusDiv.className = 'status hidden';
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new OptionsManager());
} else {
  new OptionsManager();
}