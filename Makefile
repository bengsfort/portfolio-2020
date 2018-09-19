# Directories

SOURCE_DIR := src
BUILD_DIR := dist

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)/*

.PHONY: start-server
start-server:
	parallel --ungroup --tty --jobs 0 ::: \
		"cd $(BUILD_DIR) && python -m SimpleHTTPServer 8080" \
		"yarn watch:sass"