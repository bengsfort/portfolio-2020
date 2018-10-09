# Directories

SOURCE_DIR := src
SCRIPTS_DIR := scripts
BUILD_DIR := dist
DEPLOY_DIR := docs
MODULES_DIR := node_modules/.bin

# Tasks

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)/* && rm -rf $(DEPLOY_DIR)/*

.PHONY: build-js
build-js:
	$(MODULES_DIR)/rollup -c

.PHONY: build-templates
build-templates:
	node $(SCRIPTS_DIR)/build-templates.js

.PHONY: build-styles
build-styles:
	$(MODULES_DIR)/node-sass ./src/scss/main.scss ./dist/css/styles.css

.PHONY: optimize-png
optimize-png:
	node $(SCRIPTS_DIR)/optimize-images.js

.PHONY: build
build:
	parallel --ungroup --jobs 0 ::: \
		"make build-styles" \
		"make build-templates" \
		"make optimize-png" \
		"make build-js"

.PHONY: deploy
deploy:
	make build && cp -R ./$(BUILD_DIR)/* ./$(DEPLOY_DIR) && echo "Copied files to $(DEPLOY_DIR)."

# Use rollup for watching the JS as it uses cacheing for faster build times
.PHONY: start-dev
start-dev:
	parallel --tty --jobs 0 ::: \
		"cd $(BUILD_DIR) && python -m SimpleHTTPServer 3000" \
		"$(MODULES_DIR)/rollup -c -w" \
		"watchman-make -p '$(SOURCE_DIR)/**/*.scss' -t build-styles" \
		"watchman-make -p '$(SOURCE_DIR)/**/*.ejs' '$(SOURCE_DIR)/content/*.json' -t build-templates" \
		"watchman-make -p '$(SOURCE_DIR)/assets/*.png' -t optimize-png"
