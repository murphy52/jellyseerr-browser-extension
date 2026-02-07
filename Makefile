NAME = jellyseerr-browser-extension
VERSION = $(shell grep '"version":' manifest.json | cut -d'"' -f4)
RELEASE_FILE = $(NAME)-v$(VERSION).xpi

# Files to include in the extension
FILES = manifest.json src/ icons/ README.md CHANGELOG.md

# Exclude macOS hidden files and development/git folders
EXCLUDES = -x "*.DS_Store" -x "__MACOSX" -x "*.git*" -x ".idea*" -x "screenshots/*" -x ".github*"

.PHONY: all clean release

all: release

release:
	@echo "Creating release $(RELEASE_FILE)..."
	@zip -r $(RELEASE_FILE) $(FILES) $(EXCLUDES)
	@echo "Release created successfully."

clean:
	@echo "Cleaning up..."
	@rm -f *.xpi
	@echo "Done."
