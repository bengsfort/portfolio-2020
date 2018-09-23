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
	parallel --ungroup --tty --jobs 0 ::: \
		"make build-styles" \
		"make build-templates" \
		"make optimize-png" && cp -R ./$(build) ./$(DEPLOY_DIR)

.PHONY: start-dev
start-dev:
	parallel --ungroup --tty --jobs 0 ::: \
		"cd $(BUILD_DIR) && python -m SimpleHTTPServer 8080" \
		"watchman-make -p '$(SOURCE_DIR)/**/*.scss' -t build-styles" \
		"watchman-make -p '$(SOURCE_DIR)/**/*.ejs' -t build-templates" \
		"watchman-make -p '$(SOURCE_DIR)/assets/*.png' -t optimize-png"
