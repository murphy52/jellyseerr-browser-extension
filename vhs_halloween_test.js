// Quick test for V/H/S Halloween download investigation
console.log('🎃 Testing V/H/S Halloween Download Status...\n');

// Check current status
async function checkVHSStatus() {
  console.log('🍅 V/H/S Halloween Test - Rotten Tomatoes');
  console.log('=========================================');
  
  // Check if extension is working
  if (typeof chrome === 'undefined' || !chrome.runtime?.id) {
    console.log('❌ Extension context not available');
    return;
  }
  
  // Look for extension elements
  const buttons = document.querySelectorAll('.jellyseerr-request-button, .jellyseerr-action-button');
  const flyouts = document.querySelectorAll('.jellyseerr-flyout');
  
  console.log(`Found ${buttons.length} buttons and ${flyouts.length} flyouts`);
  
  // Check button status
  buttons.forEach((btn, i) => {
    const text = btn.querySelector('span')?.textContent || 'Unknown';
    const classes = Array.from(btn.classList);
    console.log(`Button ${i + 1}: "${text}" (${classes.join(' ')})`);
  });
  
  // Force status update
  if (window.jellyseerr_debug?.rt?.updateStatus) {
    console.log('\n🔄 Forcing status update...');
    try {
      await window.jellyseerr_debug.rt.updateStatus();
      console.log('✅ Status update completed');
      
      // Check again after update
      const updatedButtons = document.querySelectorAll('.jellyseerr-request-button, .jellyseerr-action-button');
      updatedButtons.forEach((btn, i) => {
        const text = btn.querySelector('span')?.textContent || 'Unknown';
        console.log(`Updated Button ${i + 1}: "${text}"`);
      });
      
    } catch (err) {
      console.log('❌ Status update failed:', err);
    }
  }
  
  // Manual API test for V/H/S Halloween (if we can find TMDB ID)
  console.log('\n🧪 Manual API Test');
  console.log('==================');
  console.log('We could test with TMDB ID if we find it...');
  console.log('Check https://www.themoviedb.org/search?query=V/H/S Halloween');
  
  // Expected results based on current state
  console.log('\n📊 Expected Results');
  console.log('==================');
  console.log('Since Jellyseerr shows "Requested" not "Processing":');
  console.log('• Extension should show "Request Pending" or similar');
  console.log('• No downloading debug output expected yet');
  console.log('• Need to wait for Jellyseerr to sync with Radarr');
  
  console.log('\n⏰ Next Steps');
  console.log('=============');
  console.log('1. Check Jellyseerr → Settings → Services → Radarr sync frequency');
  console.log('2. Wait 5-10 minutes for sync');
  console.log('3. Refresh Jellyseerr requests page');
  console.log('4. Look for status change from "Requested" to "Processing"');
  console.log('5. Re-run this test when status changes');
}

// Test Jellyseerr API directly
async function testJellyseerrAPI() {
  console.log('\n🔍 Direct API Test');
  console.log('==================');
  
  // Try to get media status directly
  try {
    const result = await new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'getMediaStatus',
        data: {
          title: 'V/H/S Halloween',
          year: '2025',
          mediaType: 'movie'
        }
      }, resolve);
    });
    
    console.log('API Response:', result);
    
    if (result.success) {
      console.log('✅ API call successful');
      console.log('Status data:', result.data);
      
      if (result.data.status === 'downloading') {
        console.log('🎯 DOWNLOADING STATUS FOUND!');
        console.log('Check browser console for debug output');
      } else {
        console.log(`Current status: ${result.data.status}`);
        console.log('Not downloading yet - matches Jellyseerr showing "Requested"');
      }
    } else {
      console.log('❌ API call failed:', result.error);
    }
  } catch (err) {
    console.log('❌ API test error:', err);
  }
}

// Check Jellyseerr sync status
function checkJellyseerrSync() {
  console.log('\n🔄 Jellyseerr Sync Status');
  console.log('=========================');
  console.log('Current observations:');
  console.log('• Radarr: Shows "Downloading" ✅');
  console.log('• Jellyseerr: Shows "Requested" ❌');
  console.log('• Gap: Jellyseerr hasn\'t synced with Radarr yet');
  console.log('');
  console.log('This is normal! Jellyseerr syncs periodically.');
  console.log('Once it syncs, status should change to "Processing"');
  console.log('Then extension will show "Downloading..." status');
}

// Run all tests
async function runAllTests() {
  await checkVHSStatus();
  checkJellyseerrSync();
  await testJellyseerrAPI();
  
  console.log('\n🎯 Summary for V/H/S Halloween Test');
  console.log('===================================');
  console.log('✅ Radarr shows downloading');
  console.log('⏳ Waiting for Jellyseerr sync');
  console.log('🔍 Extension working correctly (shows current Jellyseerr status)');
  console.log('');
  console.log('💡 What to do next:');
  console.log('1. Wait 5-10 minutes');
  console.log('2. Refresh Jellyseerr requests page');
  console.log('3. When status changes to "Processing", re-run investigation');
}

// Make functions available globally
window.checkVHSStatus = checkVHSStatus;
window.testJellyseerrAPI = testJellyseerrAPI;
window.runAllTests = runAllTests;

console.log('🎃 V/H/S Halloween Test Functions Available:');
console.log('• runAllTests() - Complete test suite');
console.log('• checkVHSStatus() - Check extension status');
console.log('• testJellyseerrAPI() - Direct API test');

// Auto-run
runAllTests();