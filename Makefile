# Directories

SOURCE_DIR := src
SCRIPTS_DIR := scripts
BUILD_DIR := dist

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)/*

.PHONY: build-templates
build-templates:
	node $(SCRIPTS_DIR)/build-templates.js

.PHONY: build-styles
build-styles:
	npm run build:sass

.PHONY: build
build:
	parallel --ungroup --tty --jobs 0 ::: \
		"make build-styles" \
		"make build-templates" && cp -R ./dist ./docs

.PHONY: start-server
start-server:
	parallel --ungroup --tty --jobs 0 ::: \
		"cd $(BUILD_DIR) && python -m SimpleHTTPServer 8080" \
		"watchman-make -p 'src/**/*.scss' -t build-styles" \
		"watchman-make -p 'src/**/*.ejs' -t build-templates"
