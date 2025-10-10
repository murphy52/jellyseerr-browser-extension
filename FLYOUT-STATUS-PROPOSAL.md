# 📋 **Flyout Status Text Improvement Proposal**

## 🎯 **Current Issues**
- Status text often repeats button text ("Not requested" + "Request on Jellyseerr")
- Messages add no additional value ("Request pending approval" + "Request Pending")
- Toast messages handle success/error notifications
- Long error messages could break layout

## 💡 **Proposed Solutions**

### **Option 1: Action-Oriented Progress Indicators**
Replace redundant status with what the extension is doing:

| Status | Current Text | Proposed Text |
|--------|-------------|---------------|
| **Loading** | "Checking status..." | "Connecting to Jellyseerr..." |
| **Available** | "Not requested" | "Ready to request" |
| **Pending** | "Request pending approval" | "Awaiting approval" |
| **Downloading** | "Currently downloading" | "Download in progress" |
| **Ready** | "Ready to watch!" | "Available on Jellyfin" |
| **Error** | "Could not check..." | "Connection issue" |

### **Option 2: Useful Metadata**
Show additional context instead of status:

| Status | Useful Information |
|--------|-------------------|
| **Available** | Show TMDB ID or match confidence |
| **Pending** | Show request date or queue position |
| **Downloading** | Show progress % or ETA |
| **Ready** | Show server name or quality |
| **Error** | Show "Retry" or last attempt time |

### **Option 3: Contextual Actions**
Show next steps or available actions:

| Status | Contextual Text |
|--------|----------------|
| **Available** | "Click to add to queue" |
| **Pending** | "Request submitted [date]" |
| **Downloading** | "Will notify when ready" |
| **Ready** | "Click to watch now" |
| **Error** | "Check connection settings" |

## 🚨 **Edge Case Handling**

### **Long Text Management:**
- Truncate at ~30 characters with "..."
- Use tooltip for full message
- Fallback to icon-only for critical space

### **Error Messages:**
- Keep in flyout for persistent visibility
- Use short, actionable messages
- Link to settings or troubleshooting

## 🎨 **Design Considerations**

### **Visual Hierarchy:**
```
[Media Title]
[Year • Type]

[Status Icon] [Useful Context Text]  ← Enhanced
[Action Button]                      ← Consistent
```

### **Typography:**
- Smaller font size (12px vs 14px)
- Muted color (#64748b)
- Single line with ellipsis overflow

## 📊 **Recommended Implementation: Option 1**

**Rationale:**
- Provides clear feedback on extension activity
- Avoids redundancy with button text
- Short, consistent length
- No layout breaking
- Better UX for loading states

**Example Messages:**
- ✨ "Connecting to Jellyseerr..."
- 🎯 "Ready to request"
- ⏳ "Awaiting approval"
- 📥 "Download in progress"
- ✅ "Available on Jellyfin"
- ⚠️ "Connection issue"

## 🔧 **Implementation Plan**

1. **Update status message mapping** in `background.js`
2. **Keep error details in toasts** for better UX
3. **Add metadata option** as future enhancement
4. **Test with all 6 integrations** for consistency