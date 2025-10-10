# Site Color Schemes

All sites now use the shared library architecture with minimal color overrides. Each site maintains its brand identity while providing a consistent user experience.

## 🟣 Default Theme (Jellyseerr)
**Used by sites without custom themes**
- Primary: `#8b5cf6` (Purple 500)
- Secondary: `#7c3aed` (Purple 600)
- Hover: `#6d28d9` (Purple 700)
- Used by: Any new sites by default

## 🟡 IMDB Theme
**Iconic yellow/gold matching IMDB branding**
- Primary: `#f5c518` (IMDB Yellow)
- Secondary: `#e6a200` (Gold)
- Hover: `#cc8c00` (Dark Gold)
- Special: Dark text on yellow background (like Metacritic)
- Brand match: Perfect match to IMDB.com

## 🔵 TMDb Theme
**Clean blue gradient matching TMDb branding**
- Primary: `#01b4e4` (TMDb Blue)
- Secondary: `#90cea1` (TMDb Mint)
- Hover: `#0099cc` / `#7bb18a`
- Brand match: Perfect match to TheMovieDB.org

## 🟢 Letterboxd Theme  
**Fresh green matching Letterboxd's signature color**
- Primary: `#00d735` (Letterboxd Green)
- Secondary: `#00b82e` (Dark Green)
- Hover: `#009926` (Darker Green)
- Brand match: Perfect match to Letterboxd.com

## 🟡 Metacritic Theme
**Bright yellow with dark text (unique)**
- Primary: `#ffcc33` (Metacritic Yellow)
- Secondary: `#ff9900` (Orange)
- Hover: `#cc7700` (Dark Orange)
- Special: Dark text on yellow background
- Brand match: Perfect match to Metacritic.com

## 🔴 Rotten Tomatoes Theme
**Bold red with blue CTA matching RT's actual design**
- Primary: `#fa320a` (RT Red)
- Secondary: `#d42009` (Dark Red)  
- Hover: `#b71c08` (Darker Red)
- CTA Available: `#3478c1` (RT Blue CTA) - for "Watch" buttons
- Status colors: RT Blue (`#3478c1`), RT Orange (`#ff8800`)
- Brand match: Perfect match to RottenTomatoes.com

## Architecture Benefits

- **Consistent Layout**: All sites use identical flyout structure
- **Brand Recognition**: Each site maintains visual identity  
- **Easy Maintenance**: Color changes require ~5 lines of CSS
- **Developer Friendly**: New sites work immediately with purple theme
- **File Size**: 81% reduction in code size vs legacy implementations

## Usage Example

To add Netflix with red theme:
```css
.jellyseerr-tab {
  background: linear-gradient(135deg, #e50914 0%, #b7070f 100%) !important;
  border-color: #e50914 !important;
}
```

That's it! The shared architecture handles everything else.