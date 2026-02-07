NAME = jellyseerr-browser-extension
VERSION = $(shell grep '"version":' manifest.base.json | cut -d'"' -f4)
RELEASE_FILE_CHROME = $(NAME)-v$(VERSION)-chrome.zip
RELEASE_FILE_FIREFOX = $(NAME)-v$(VERSION)-firefox.xpi

DIST_DIR = dist
CHROME_DIST = $(DIST_DIR)/chrome
FIREFOX_DIST = $(DIST_DIR)/firefox

# Files to include in the extension
COMMON_FILES = src icons README.md CHANGELOG.md

# Exclude macOS hidden files and development/git folders for zip
EXCLUDES = -x "*.DS_Store" -x "__MACOSX" -x "*.git*" -x ".idea*" -x "screenshots/*" -x ".github*"

.PHONY: all clean build-chrome build-firefox release-chrome release-firefox release

build: build-chrome build-firefox

build-chrome: clean-chrome
	@echo "Building Chrome extension (unpacked)..."
	@mkdir -p $(CHROME_DIST)
	@cp -R $(COMMON_FILES) $(CHROME_DIST)/
	@node -e "const base = require('./manifest.base.json'); const chrome = require('./manifest.chrome.json'); const merged = {...base, ...chrome}; if (chrome.background) merged.background = chrome.background; console.log(JSON.stringify(merged, null, 2));" > $(CHROME_DIST)/manifest.json
	@echo "Chrome build completed in $(CHROME_DIST)"

build-firefox: clean-firefox
	@echo "Building Firefox extension (unpacked)..."
	@mkdir -p $(FIREFOX_DIST)
	@cp -R $(COMMON_FILES) $(FIREFOX_DIST)/
	@node -e "const base = require('./manifest.base.json'); const firefox = require('./manifest.firefox.json'); const merged = {...base, ...firefox}; if (firefox.background) merged.background = firefox.background; console.log(JSON.stringify(merged, null, 2));" > $(FIREFOX_DIST)/manifest.json
	@echo "Firefox build completed in $(FIREFOX_DIST)"

release-chrome: build-chrome
	@echo "Creating Chrome release $(RELEASE_FILE_CHROME)..."
	@cd $(CHROME_DIST) && zip -r ../../$(RELEASE_FILE_CHROME) . $(EXCLUDES)
	@echo "Chrome release created: $(RELEASE_FILE_CHROME)"

release-firefox: build-firefox
	@echo "Creating Firefox release $(RELEASE_FILE_FIREFOX)..."
	@cd $(FIREFOX_DIST) && zip -r ../../$(RELEASE_FILE_FIREFOX) . $(EXCLUDES)
	@echo "Firefox release created: $(RELEASE_FILE_FIREFOX)"

release: release-chrome release-firefox
	@echo "All releases created successfully!"

clean-chrome:
	@rm -rf $(CHROME_DIST)

clean-firefox:
	@rm -rf $(FIREFOX_DIST)

clean:
	@echo "Cleaning up..."
	@rm -rf $(DIST_DIR) *.xpi *.zip
	@echo "Done."

# Development targets
dev-chrome: build-chrome
	@echo "Load unpacked extension from: $(CHROME_DIST)"
	@echo "chrome://extensions/ -> Enable Developer Mode -> Load unpacked"

dev-firefox: build-firefox
	@echo "Load temporary extension from: $(FIREFOX_DIST)"
	@echo "about:debugging#/runtime/this-firefox -> Load Temporary Add-on"

.DEFAULT_GOAL := build