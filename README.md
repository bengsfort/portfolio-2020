# Matt Bengston 2018 Portfolio

## Requirements

- Yarn (`brew install yarn`) for managing required packages
- Node (`brew install node`) for template and image scripts
- Parallel (`brew install parallel`) for running things in parallel
- Python (`brew install python`) for running things in parallel
- Watchman (`brew install watchman`) for watching files

## Commands

`make` is used primarily as it allows us to easily take advantage of stuff like `parallel` for super fast rebuilds when watching, but most of the commands also are mirrored in the `package.json` file and can be used via `yarn run <command>` or `yarn <command>`.

- `make clean`: Clean the build and deployment directory.
- `make build`: Build all styles, templates, and optimise assets.
- `make start-dev`: Starts a dev server then watches for changes, rebuilding as necessary.