// Quick Diagnostic Script for Jellyseerr Browser Extension
// Run this in the browser console on any page to diagnose connection issues

console.log('🔍 Starting Jellyseerr Extension Diagnostic...\n');

// Test 1: Check if extension context exists
function testExtensionContext() {
  console.log('📋 Test 1: Extension Context');
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
    console.log('✅ Extension context is valid');
    console.log('   Extension ID:', chrome.runtime.id);
    return true;
  } else {
    console.log('❌ Extension context is invalid');
    console.log('   Make sure extension is loaded and page is refreshed');
    return false;
  }
}

// Test 2: Test basic communication
function testBasicCommunication() {
  return new Promise((resolve) => {
    console.log('\n📋 Test 2: Basic Communication');
    
    const timeout = setTimeout(() => {
      console.log('❌ Communication test timed out (5 seconds)');
      resolve(false);
    }, 5000);
    
    chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
      clearTimeout(timeout);
      
      if (chrome.runtime.lastError) {
        console.log('❌ Background script not responding:', chrome.runtime.lastError.message);
        console.log('   Possible causes:');
        console.log('   - Service worker is inactive/crashed');
        console.log('   - Extension was reloaded');
        console.log('   - Extension is not properly loaded');
        resolve(false);
      } else {
        console.log('✅ Background script is responding:', response);
        resolve(true);
      }
    });
  });
}

// Test 3: Check settings
function testSettings() {
  return new Promise((resolve) => {
    console.log('\n📋 Test 3: Extension Settings');
    
    chrome.storage.sync.get(['jellyseerrUrl', 'jellyseerrApiKey'], (result) => {
      if (chrome.runtime.lastError) {
        console.log('❌ Could not read settings:', chrome.runtime.lastError.message);
        resolve(false);
      } else {
        console.log('Settings status:');
        console.log('   Server URL:', result.jellyseerrUrl || '❌ NOT SET');
        console.log('   API Key:', result.jellyseerrApiKey ? '✅ SET' : '❌ NOT SET');
        
        const hasUrl = !!result.jellyseerrUrl;
        const hasApiKey = !!result.jellyseerrApiKey;
        
        if (hasUrl && hasApiKey) {
          console.log('✅ Settings appear to be configured');
          resolve(true);
        } else {
          console.log('⚠️ Settings incomplete - configure in extension options');
          resolve(false);
        }
      }
    });
  });
}

// Test 4: Test server connection
function testServerConnection() {
  return new Promise((resolve) => {
    console.log('\n📋 Test 4: Jellyseerr Server Connection');
    
    const timeout = setTimeout(() => {
      console.log('❌ Server connection test timed out (10 seconds)');
      resolve(false);
    }, 10000);
    
    chrome.runtime.sendMessage({ action: 'testConnection' }, (response) => {
      clearTimeout(timeout);
      
      if (chrome.runtime.lastError) {
        console.log('❌ Server connection test failed:', chrome.runtime.lastError.message);
        resolve(false);
      } else if (response && response.success) {
        console.log('✅ Server connection successful');
        console.log('   User:', response.data.user);
        console.log('   Server:', response.data.server);
        resolve(true);
      } else {
        console.log('❌ Server connection failed:', response ? response.error : 'No response');
        resolve(false);
      }
    });
  });
}

// Test 5: Check for Jellyseerr UI elements
function testUIElements() {
  console.log('\n📋 Test 5: UI Elements');
  
  const buttons = document.querySelectorAll('.jellyseerr-request-button, .jellyseerr-action-button');
  const flyouts = document.querySelectorAll('.jellyseerr-flyout');
  const notifications = document.querySelectorAll('.jellyseerr-notification');
  
  console.log('UI elements found:');
  console.log('   Buttons:', buttons.length);
  console.log('   Flyouts:', flyouts.length);
  console.log('   Notifications:', notifications.length);
  
  if (buttons.length > 0 || flyouts.length > 0) {
    console.log('✅ Extension UI is visible on this page');
    
    // Check button states
    buttons.forEach((btn, i) => {
      const text = btn.querySelector('span')?.textContent || 'Unknown';
      const classes = Array.from(btn.classList).join(' ');
      console.log(`   Button ${i + 1}: "${text}" (${classes})`);
    });
    
    return true;
  } else {
    console.log('ℹ️  No extension UI found on this page');
    console.log('   This may be normal if:');
    console.log('   - Site is not supported');
    console.log('   - No media content detected');
    console.log('   - Extension failed to initialize');
    return false;
  }
}

// Main diagnostic function
async function runDiagnostic() {
  console.log('🔍 Jellyseerr Extension Diagnostic Report');
  console.log('=====================================\n');
  
  const results = {
    context: false,
    communication: false,
    settings: false,
    server: false,
    ui: false
  };
  
  // Run tests sequentially
  results.context = testExtensionContext();
  
  if (results.context) {
    results.communication = await testBasicCommunication();
    
    if (results.communication) {
      results.settings = await testSettings();
      
      if (results.settings) {
        results.server = await testServerConnection();
      }
    }
  }
  
  results.ui = testUIElements();
  
  // Summary
  console.log('\n🏁 Diagnostic Summary');
  console.log('====================');
  console.log('Extension Context:    ', results.context ? '✅ OK' : '❌ FAILED');
  console.log('Background Script:    ', results.communication ? '✅ OK' : '❌ FAILED');
  console.log('Settings:            ', results.settings ? '✅ OK' : '❌ INCOMPLETE');
  console.log('Server Connection:   ', results.server ? '✅ OK' : '❌ FAILED');
  console.log('UI Elements:         ', results.ui ? '✅ VISIBLE' : 'ℹ️  NOT VISIBLE');
  
  // Recommendations
  console.log('\n💡 Recommendations');
  console.log('==================');
  
  if (!results.context) {
    console.log('🔧 Extension context invalid:');
    console.log('   1. Go to chrome://extensions/');
    console.log('   2. Make sure extension is enabled');
    console.log('   3. Click the reload button (🔄)');
    console.log('   4. Refresh this page');
  } else if (!results.communication) {
    console.log('🔧 Background script not responding:');
    console.log('   1. Go to chrome://extensions/');
    console.log('   2. Find your extension and click "Details"');
    console.log('   3. Look for "service worker" and click to inspect');
    console.log('   4. Check console for errors');
    console.log('   5. Try reloading the extension');
  } else if (!results.settings) {
    console.log('🔧 Settings incomplete:');
    console.log('   1. Right-click extension icon → Options');
    console.log('   2. Set Jellyseerr Server URL (e.g., http://localhost:5055)');
    console.log('   3. Set API Key from Jellyseerr settings');
    console.log('   4. Click "Test Connection"');
  } else if (!results.server) {
    console.log('🔧 Server connection failed:');
    console.log('   1. Check if Jellyseerr server is running');
    console.log('   2. Verify server URL is correct');
    console.log('   3. Verify API key is valid');
    console.log('   4. Check network/firewall settings');
  } else if (results.context && results.communication && results.settings && results.server) {
    console.log('✅ All systems appear to be working correctly!');
    if (!results.ui) {
      console.log('ℹ️  UI not visible - this may be normal for this page');
      console.log('   Try navigating to a movie/TV show page on IMDb, TMDb, etc.');
    }
  }
  
  console.log('\n📚 For detailed troubleshooting steps, see TROUBLESHOOTING.md');
  
  return results;
}

// Run the diagnostic
runDiagnostic();