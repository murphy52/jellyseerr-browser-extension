# 🧪 **Jellyseerr Extension Testing Checklist - v2.0.0**

## 📋 **Pre-Testing Setup**
- [ ] Extension loaded in developer mode  
- [ ] Jellyseerr server URL and API key configured
- [ ] Test connection successful in extension options
- [ ] Browser dev tools open (F12) for console monitoring

---

## 🎬 **IMDB Integration Testing**

**Test URLs:**
- Movie: `https://www.imdb.com/title/tt0111161/` (The Shawshank Redemption)
- TV Show: `https://www.imdb.com/title/tt0903747/` (Breaking Bad)

**Checklist:**
- [ ] Extension script loads (`🎬 [IMDB] Integration script loaded!`)
- [ ] Flyout tab appears on right side
- [ ] Tab has appropriate styling (no specific color theme)
- [ ] Click tab expands flyout panel
- [ ] Title extraction works correctly
- [ ] IMDB ID extraction works (tt numbers)
- [ ] Year extraction works
- [ ] Status checking works (shows available/pending/etc)
- [ ] Request button functionality
- [ ] Status updates after request

---

## 🍅 **Rotten Tomatoes Integration Testing**

**Test URLs:**
- Movie: `https://www.rottentomatoes.com/m/the_shawshank_redemption`
- TV Show: `https://www.rottentomatoes.com/tv/breaking_bad`

**Checklist:**
- [ ] Extension script loads (`🍅 [Rotten Tomatoes] Integration script loaded!`)
- [ ] Flyout tab appears with RT red/orange theme
- [ ] Tab has red gradient styling
- [ ] Click tab expands flyout panel
- [ ] Title extraction works correctly
- [ ] Year extraction works
- [ ] IMDB ID extraction works (from RT's external links)
- [ ] Status checking works
- [ ] Request button has RT styling
- [ ] SPA navigation detection (if applicable)

---

## 🎭 **TheMovieDB Integration Testing**

**Test URLs:**
- Movie: `https://www.themoviedb.org/movie/278-the-shawshank-redemption`
- TV Show: `https://www.themoviedb.org/tv/1396-breaking-bad`

**Checklist:**
- [ ] Extension script loads (`🎬 [TMDb] Integration script loaded!`)
- [ ] Flyout tab appears with TMDb blue theme
- [ ] Tab has blue gradient styling
- [ ] Click tab expands flyout panel
- [ ] Title extraction works correctly
- [ ] Year extraction works
- [ ] TMDb ID extraction works (from URL)
- [ ] IMDB ID extraction works (from external links)
- [ ] Perfect matching accuracy (TMDb is primary source)
- [ ] Status checking works
- [ ] Request button has blue styling

---

## 🍿 **Letterboxd Integration Testing**

**Test URLs:**
- Film: `https://letterboxd.com/film/the-shawshank-redemption/`
- Film: `https://letterboxd.com/film/pulp-fiction/`

**Checklist:**
- [ ] Extension script loads (`🍿 [Letterboxd] Integration script loaded!`)
- [ ] Flyout tab appears with clean styling
- [ ] Tab has minimalist design matching Letterboxd
- [ ] Click tab expands flyout panel
- [ ] Title extraction works correctly
- [ ] Year extraction works
- [ ] TMDb ID extraction works (from external links)
- [ ] IMDB ID extraction works (from external links)
- [ ] Status checking works
- [ ] Request button functionality
- [ ] Film-only content handling (no TV shows)

---

## 🟡 **Metacritic Integration Testing**

**Test URLs:**
- Movie: `https://www.metacritic.com/movie/the-shawshank-redemption/`
- TV Show: `https://www.metacritic.com/tv/breaking-bad/`

**Checklist:**
- [ ] Extension script loads (`🟡 [Metacritic] Integration script loaded!`)
- [ ] Flyout tab appears with yellow theme
- [ ] Tab has yellow gradient styling matching Metacritic
- [ ] Click tab expands flyout panel
- [ ] Title extraction works correctly
- [ ] Year extraction works
- [ ] IMDB ID extraction works (from external links)
- [ ] Status checking works
- [ ] Request button has yellow styling
- [ ] Both movie and TV show pages work

---

## 📊 **Trakt Integration Testing** ⭐ **NEW**

**Test URLs:**
- Movie: `https://trakt.tv/movies/the-shawshank-redemption-1994`
- TV Show: `https://app.trakt.tv/shows/peacemaker-2022`
- Movie (app): `https://app.trakt.tv/movies/pulp-fiction-1994`

**Checklist:**
- [ ] Extension script loads (`📊 [Trakt] Integration script loaded!`)
- [ ] Works on both `trakt.tv` and `app.trakt.tv` domains
- [ ] Flyout tab appears with purple/pink gradient theme
- [ ] Tab has red-to-purple gradient styling
- [ ] Click tab expands flyout panel
- [ ] Title extraction from URL slug works (SPA fallback)
- [ ] TMDb ID extraction works (from external links)
- [ ] IMDB ID extraction works (from external links)
- [ ] **SPA Navigation Testing**: 
  - [ ] Navigate between different shows/movies
  - [ ] Flyout updates automatically with new content
  - [ ] No page refresh required
  - [ ] Console shows navigation detection logs
- [ ] Status checking works
- [ ] Request button has purple gradient styling

---

## 🔄 **Cross-Site Consistency Testing**

**Shared Functionality:**
- [ ] All sites use BaseIntegration class
- [ ] All sites use flyout UI theme
- [ ] Status icons consistent across sites (green/orange/blue/red)
- [ ] Error handling consistent
- [ ] Debug functions available (`window.jellyseerr_debug`)
- [ ] Notification system works on all sites
- [ ] Auto-retry logic works on all sites

**Theme Consistency:**
- [ ] Each site has unique, brand-appropriate colors
- [ ] Hover effects work on all flyout tabs
- [ ] Flyout panels have consistent layout
- [ ] Status indicators use consistent colors
- [ ] Button styling matches each site's theme

---

## 🚨 **Error Handling Testing**

**Test Scenarios:**
- [ ] Invalid Jellyseerr server URL
- [ ] Invalid API key
- [ ] Network connectivity issues
- [ ] Server temporarily down
- [ ] Media not found in database
- [ ] Rate limiting errors
- [ ] CORS errors

**Expected Behavior:**
- [ ] Appropriate error messages shown
- [ ] Flyout doesn't break/crash
- [ ] Status icons show error state (red)
- [ ] Extension remains functional after errors
- [ ] Console errors are helpful for debugging

---

## 📱 **Browser Compatibility**

**Chrome/Edge:**
- [ ] Extension loads properly
- [ ] All integrations work
- [ ] Performance is good
- [ ] No console errors

**Firefox:**
- [ ] Extension loads properly  
- [ ] All integrations work
- [ ] Performance is good
- [ ] No console errors

---

## ✅ **Final Validation**

- [ ] All 6 integrations working
- [ ] No debug modes enabled in production
- [ ] No console.error messages in normal operation
- [ ] Extension manifest valid
- [ ] All required files present
- [ ] Version numbers consistent
- [ ] README documentation complete
- [ ] No test/debug files in release

---

## 🎯 **Release Readiness**

When all checkboxes above are completed:
- [ ] All tests passing ✅
- [ ] Code reviewed and cleaned ✅  
- [ ] Documentation updated ✅
- [ ] Ready for stable tag 🚀

**Testing completed by:** _____________  
**Date:** _____________  
**Version:** v1.4.0  
**Notes:** _____________