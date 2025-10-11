// Performance Test for Optimized Watch Button
// Run this in browser console to test the performance improvement

console.log('🚀 Testing Watch Button Performance...\n');

// Override window.open to measure timing
let redirectStartTime = null;
let redirectEndTime = null;
const originalWindowOpen = window.open;

window.open = function(url, target) {
  redirectEndTime = performance.now();
  const responseTime = redirectEndTime - redirectStartTime;
  
  console.log(`⚡ REDIRECT TRIGGERED in ${Math.round(responseTime)}ms`);
  console.log(`📍 URL: ${url}`);
  
  if (responseTime < 500) {
    console.log('🎉 EXCELLENT: Under 500ms - Very fast!');
  } else if (responseTime < 1000) {
    console.log('✅ GOOD: Under 1 second');  
  } else if (responseTime < 5000) {
    console.log('⚠️  SLOW: Over 1 second');
  } else {
    console.log('❌ VERY SLOW: Over 5 seconds');
  }
  
  // Restore original function and don't actually open
  setTimeout(() => {
    window.open = originalWindowOpen;
  }, 100);
  
  return { focus: () => {} }; // Mock window object
};

// Find and test watch buttons
async function testWatchButtonPerformance() {
  const buttons = document.querySelectorAll('.jellyseerr-request-button, .jellyseerr-action-button');
  
  if (buttons.length === 0) {
    console.log('❌ No extension buttons found. Make sure you\'re on a supported page with the extension active.');
    return;
  }
  
  let watchButtonFound = false;
  
  for (const button of buttons) {
    const buttonText = button.querySelector('span')?.textContent || '';
    const hasWatchClass = button.classList.contains('watch');
    
    if (buttonText === 'Watch on Jellyfin' || hasWatchClass) {
      watchButtonFound = true;
      console.log(`🔘 Found watch button: "${buttonText}"`);
      console.log('🎯 Clicking button to measure performance...');
      
      redirectStartTime = performance.now();
      button.click();
      
      // Wait up to 10 seconds for response
      const maxWait = 10000;
      const startWait = performance.now();
      
      while (redirectEndTime === null && (performance.now() - startWait) < maxWait) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      if (redirectEndTime === null) {
        console.log('❌ Button did not trigger redirect within 10 seconds');
        console.log('💡 This might indicate the button is making an API request instead');
      }
      
      break; // Only test the first watch button found
    }
  }
  
  if (!watchButtonFound) {
    console.log('ℹ️  No "Watch on Jellyfin" buttons found on this page');
    console.log('   This is normal if:');
    console.log('   - Content is not yet available on Jellyfin');
    console.log('   - Extension is still loading status');
    console.log('   - You\'re on an unsupported page');
  }
}

// Quick diagnostic of extension state
function quickDiagnostic() {
  console.log('📋 Quick Diagnostic:');
  
  // Check if extension is active
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
    console.log('✅ Extension context is valid');
  } else {
    console.log('❌ Extension context invalid');
    return false;
  }
  
  // Check for UI elements
  const buttons = document.querySelectorAll('.jellyseerr-request-button, .jellyseerr-action-button');
  const flyouts = document.querySelectorAll('.jellyseerr-flyout');
  
  console.log(`🔘 Found ${buttons.length} buttons and ${flyouts.length} flyouts`);
  
  // List button states
  buttons.forEach((btn, i) => {
    const text = btn.querySelector('span')?.textContent || 'Unknown';
    const classes = Array.from(btn.classList).join(' ');
    console.log(`   Button ${i + 1}: "${text}" (${classes})`);
  });
  
  return true;
}

// Run the test
async function runPerformanceTest() {
  console.log('🚀 Watch Button Performance Test');
  console.log('================================\n');
  
  if (!quickDiagnostic()) {
    return;
  }
  
  console.log('\n🎯 Testing button performance...\n');
  
  await testWatchButtonPerformance();
  
  console.log('\n✨ Performance test completed!');
  console.log('\n💡 Expected results after optimization:');
  console.log('   - Watch buttons should respond in under 500ms');
  console.log('   - No long API calls should be made on button click');
  console.log('   - Immediate visual feedback should be shown');
}

// Run the test
runPerformanceTest();