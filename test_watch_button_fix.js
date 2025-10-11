// Test Script for "Watch on Jellyfin" Button Fix
// Run this in the browser console to verify the fix works correctly

console.log('🧪 Testing "Watch on Jellyfin" button fix...');

// Mock window.open to track if redirect happens
const originalWindowOpen = window.open;
let redirectCalled = false;
let redirectUrl = '';

window.open = function(url, target) {
  console.log('📍 Redirect intercepted:', url, target);
  redirectCalled = true;
  redirectUrl = url;
  // Don't actually open the URL during testing
  return { focus: () => {} }; // Mock window object
};

// Test function to verify button behavior
async function testWatchButtonBehavior() {
  console.log('🔍 Looking for Jellyseerr elements...');
  
  // Find existing buttons or flyout
  const buttons = document.querySelectorAll('.jellyseerr-request-button, .jellyseerr-action-button');
  const flyouts = document.querySelectorAll('.jellyseerr-flyout');
  
  console.log(`Found ${buttons.length} buttons and ${flyouts.length} flyouts`);
  
  if (buttons.length === 0 && flyouts.length === 0) {
    console.log('❌ No Jellyseerr UI elements found. Make sure you\'re on a supported site with the extension active.');
    return false;
  }
  
  // Test each button
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const buttonText = button.querySelector('span')?.textContent || '';
    const hasWatchClass = button.classList.contains('watch');
    
    console.log(`🔘 Button ${i + 1}:`, {
      text: buttonText,
      hasWatchClass: hasWatchClass,
      isWatchButton: buttonText === 'Watch on Jellyfin' || hasWatchClass
    });
    
    // If this is a "Watch on Jellyfin" button, test clicking it
    if (buttonText === 'Watch on Jellyfin' || hasWatchClass) {
      console.log('🎯 Testing Watch on Jellyfin button click...');
      
      // Reset tracking variables
      redirectCalled = false;
      redirectUrl = '';
      
      // Measure response time
      const startTime = performance.now();
      
      // Click the button
      button.click();
      
      // Wait for redirect with timeout
      const maxWaitTime = 5000; // 5 seconds max
      const checkInterval = 50; // Check every 50ms
      let waited = 0;
      
      while (!redirectCalled && waited < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        waited += checkInterval;
      }
      
      const responseTime = performance.now() - startTime;
      
      if (redirectCalled) {
        console.log(`✅ SUCCESS: Button redirected in ${Math.round(responseTime)}ms to:`, redirectUrl);
        
        if (responseTime < 1000) {
          console.log('🚀 EXCELLENT: Response time under 1 second!');
        } else if (responseTime < 5000) {
          console.log('⚠️  SLOW: Response time over 1 second but under 5 seconds');
        } else {
          console.log('❌ VERY SLOW: Response time over 5 seconds');
        }
        
        return true;
      } else {
        console.log(`❌ FAILED: Button did not redirect within ${maxWaitTime}ms (may have made a request instead)`);
        return false;
      }
    }
  }
  
  console.log('ℹ️  No "Watch on Jellyfin" buttons found to test. This is normal if content is not yet available.');
  return true; // Not a failure, just nothing to test
}

// Check for debug functions
function checkDebugFunctions() {
  if (window.jellyseerr_debug) {
    console.log('🛠️  Debug functions available:', Object.keys(window.jellyseerr_debug));
    
    // Test status update if available
    const sites = Object.keys(window.jellyseerr_debug);
    if (sites.length > 0) {
      const site = sites[0];
      console.log(`🔄 Testing status update for ${site}...`);
      
      if (window.jellyseerr_debug[site].updateStatus) {
        window.jellyseerr_debug[site].updateStatus();
        console.log('✅ Status update triggered');
      }
    }
  } else {
    console.log('ℹ️  Debug functions not available (normal on some sites)');
  }
}

// Run tests
async function runAllTests() {
  console.log('🧪 Starting comprehensive test suite...\n');
  
  // Test 1: Check for debug functions
  console.log('📋 Test 1: Checking debug functions...');
  checkDebugFunctions();
  
  // Test 2: Test button behavior
  console.log('\n📋 Test 2: Testing button behavior...');
  const buttonTestPassed = await testWatchButtonBehavior();
  
  // Test 3: Check CSS styling
  console.log('\n📋 Test 3: Checking CSS styling...');
  const watchButtonStyles = document.querySelectorAll('.jellyseerr-request-button.watch, .jellyseerr-action-button.watch');
  if (watchButtonStyles.length > 0) {
    console.log(`✅ Found ${watchButtonStyles.length} buttons with watch styling`);
    watchButtonStyles.forEach((btn, i) => {
      const styles = window.getComputedStyle(btn);
      console.log(`   Button ${i + 1} background:`, styles.backgroundColor);
    });
  } else {
    console.log('ℹ️  No watch buttons currently visible (normal if content is not available)');
  }
  
  // Restore original window.open
  window.open = originalWindowOpen;
  
  console.log('\n🏁 Test suite completed!');
  console.log('\nℹ️  To manually test:');
  console.log('   1. Find content that shows "Watch on Jellyfin" button');
  console.log('   2. Click the button');
  console.log('   3. Verify it opens Jellyfin URL instead of re-requesting');
  
  return buttonTestPassed;
}

// Run the tests
runAllTests();