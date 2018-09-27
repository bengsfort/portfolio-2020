# Directories

SOURCE_DIR := src
SCRIPTS_DIR := scripts
BUILD_DIR := dist
DEPLOY_DIR := docs

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)/* && rm -rf $(DEPLOY_DIR)/*

.PHONY: build-templates
build-templates:
	node $(SCRIPTS_DIR)/build-templates.js

.PHONY: build-styles
build-styles:
	npm run build:sass

.PHONY: optimize-png
optimize-png:
	node $(SCRIPTS_DIR)/optimize-images.js

.PHONY: build
build:
	parallel --jobs 0 ::: \
		"make build-styles" \
		"make build-templates" \
		"make optimize-png"

.PHONY: deploy
deploy:
	make build && cp -R ./$(BUILD_DIR)/* ./$(DEPLOY_DIR) && echo "Copied files to $(DEPLOY_DIR)."

.PHONY: start-dev
start-dev:
	parallel --tty --jobs 0 ::: \
		"cd $(BUILD_DIR) && python -m SimpleHTTPServer 3000" \
		"watchman-make -p '$(SOURCE_DIR)/**/*.scss' -t build-styles" \
		"watchman-make -p '$(SOURCE_DIR)/**/*.ejs' '$(SOURCE_DIR)/content/*.json' -t build-templates" \
		"watchman-make -p '$(SOURCE_DIR)/assets/*.png' -t optimize-png"
