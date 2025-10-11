// Issue #6 Investigation Tool: Download Progress Testing
// Run this in the browser console to help investigate download progress capabilities

console.log('🔍 Issue #6: Investigating Download Progress Capabilities\n');

async function investigateDownloadProgress() {
  console.log('📊 Issue #6 Investigation: Download Progress Data');
  console.log('=================================================\n');
  
  // Check if extension is working
  if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
    console.log('❌ Extension context not available');
    return;
  }
  
  // Look for buttons in downloading state
  const buttons = document.querySelectorAll('.jellyseerr-request-button, .jellyseerr-action-button');
  let downloadingButtons = [];
  
  console.log('🔍 Scanning for downloading buttons...');
  
  buttons.forEach((btn, i) => {
    const text = btn.querySelector('span')?.textContent || 'Unknown';
    const classes = Array.from(btn.classList);
    const isDownloading = text.toLowerCase().includes('downloading') || classes.includes('downloading');
    
    console.log(`Button ${i + 1}: "${text}" (${classes.join(' ')})`);
    
    if (isDownloading) {
      downloadingButtons.push({ button: btn, text, classes });
      console.log(`   ⬇️  DOWNLOADING BUTTON FOUND!`);
    }
  });
  
  if (downloadingButtons.length === 0) {
    console.log('\nℹ️  No downloading buttons found on this page');
    console.log('   To test download progress:');
    console.log('   1. Request a movie/show that will start downloading');
    console.log('   2. Wait for it to enter "downloading" status');
    console.log('   3. Run this script again');
    console.log('   4. Check browser console for debug logs');
    return;
  }
  
  console.log(`\n✅ Found ${downloadingButtons.length} downloading button(s)`);
  console.log('\n🔍 Triggering status update to capture debug data...');
  
  // Try to get current media data and force a status update
  if (window.jellyseerr_debug) {
    const sites = Object.keys(window.jellyseerr_debug);
    if (sites.length > 0) {
      const site = sites[0];
      console.log(`🔄 Triggering status update for ${site}...`);
      
      if (window.jellyseerr_debug[site].updateStatus) {
        try {
          await window.jellyseerr_debug[site].updateStatus();
          console.log('✅ Status update triggered');
          console.log('\n👀 Check the browser console for:');
          console.log('   🔍 [DEBUG] DOWNLOADING STATUS DETECTED - Investigating available data for Issue #6');
          console.log('   🔍 [DEBUG] Full mediaDetails object: {...}');
          console.log('   🔍 [DEBUG] Found progress field... (if any)');
        } catch (err) {
          console.log('❌ Failed to trigger status update:', err);
        }
      }
      
      // Also try to get status directly
      if (window.jellyseerr_debug[site].getStatus) {
        try {
          console.log('\n🔍 Getting status directly...');
          const status = await window.jellyseerr_debug[site].getStatus();
          console.log('Direct status result:', status);
        } catch (err) {
          console.log('❌ Failed to get direct status:', err);
        }
      }
    }
  } else {
    console.log('⚠️  Debug functions not available');
    console.log('   Extension may still be initializing or site not supported');
  }
  
  console.log('\n📋 What to Look For:');
  console.log('====================');
  console.log('In the browser console, look for these debug messages:');
  console.log('• 🔍 [DEBUG] DOWNLOADING STATUS DETECTED');
  console.log('• 🔍 [DEBUG] Full mediaDetails object: {...}');
  console.log('• 🔍 [DEBUG] Found progress field \'progress\': XX');
  console.log('• 🔍 [DEBUG] Found speed field \'speed\': XX MB/s');
  console.log('• 🔍 [DEBUG] Found ETA field \'eta\': XX minutes');
  
  console.log('\n🎯 Expected Results:');
  console.log('===================');
  console.log('✅ BEST CASE: Progress fields found in API response');
  console.log('⚠️  LIMITED: Some download info but no progress');
  console.log('❌ BASIC: Only status=3, no additional info');
  
  console.log('\n📝 Next Steps Based on Results:');
  console.log('==============================');
  console.log('1. Document what fields are available');
  console.log('2. Implement progress bar if data exists');
  console.log('3. Enhance UI with available information');
  console.log('4. Update Issue #6 with findings');
}

// Test if content is currently downloading
function checkCurrentDownloadStatus() {
  console.log('\n🔍 Current Download Status Check');
  console.log('================================');
  
  // Look for visual indicators of downloading
  const downloadingElements = document.querySelectorAll('[class*="downloading"], [class*="download"]');
  const downloadingText = document.evaluate(
    "//*[contains(text(), 'Downloading') or contains(text(), 'downloading')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
    null
  );
  
  console.log(`Found ${downloadingElements.length} elements with 'download' in class name`);
  
  let downloadingTextElements = [];
  let node;
  while (node = downloadingText.iterateNext()) {
    downloadingTextElements.push(node);
  }
  
  console.log(`Found ${downloadingTextElements.length} elements with 'downloading' text`);
  
  if (downloadingElements.length === 0 && downloadingTextElements.length === 0) {
    console.log('ℹ️  No downloading content detected on current page');
  } else {
    console.log('✅ Downloading content may be present - good for testing!');
  }
}

// Manual API test function
async function testDownloadAPI() {
  console.log('\n🧪 Manual Download API Test');
  console.log('============================');
  
  console.log('This function can be used to test specific TMDB IDs');
  console.log('Usage: testDownloadAPI(550) // Fight Club');
  console.log('Look for status=3 responses in background console');
}

// Instructions
function showInstructions() {
  console.log('\n📚 Issue #6 Investigation Instructions');
  console.log('=====================================');
  console.log('1. Find content that is actively downloading in your *arr setup');
  console.log('2. Navigate to that content\'s page (IMDb, TMDb, etc.)');
  console.log('3. Wait for extension to load and show "Downloading..." status');
  console.log('4. Run: investigateDownloadProgress()');
  console.log('5. Check console for debug output');
  console.log('6. Document findings in Issue #6');
  console.log('\nOther useful functions:');
  console.log('• checkCurrentDownloadStatus() - Check if page has downloading content');
  console.log('• testDownloadAPI() - Instructions for manual API testing');
}

// Run initial investigation
console.log('🚀 Starting Issue #6 Investigation...\n');

checkCurrentDownloadStatus();
showInstructions();

// Auto-run if downloading content detected
setTimeout(() => {
  const hasDownloading = document.querySelectorAll('[class*="downloading"], [class*="download"]').length > 0;
  if (hasDownloading) {
    console.log('\n🎯 Downloading content detected - running investigation...');
    investigateDownloadProgress();
  }
}, 2000);

// Make functions globally available
window.investigateDownloadProgress = investigateDownloadProgress;
window.checkCurrentDownloadStatus = checkCurrentDownloadStatus;
window.testDownloadAPI = testDownloadAPI;

console.log('\n💡 Functions available:');
console.log('• investigateDownloadProgress()');
console.log('• checkCurrentDownloadStatus()');  
console.log('• testDownloadAPI()');
console.log('\nRun investigateDownloadProgress() when you see downloading content!');