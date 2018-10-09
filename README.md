# Matt Bengston 2018 Portfolio

## Requirements

- Yarn (`brew install yarn`) for managing required packages
- Node (`brew install node`) for template and image scripts
- Parallel (`brew install parallel`) for running things in parallel
- Python (`brew install python`) for running things in parallel
- Watchman (`brew install watchman`) for watching files

## Commands

`make` is used primarily as it allows us to easily take advantage of stuff like `parallel` for super fast rebuilds when watching.

- `make clean`: Clean the build and deployment directory.
- `make build`: Build all styles, templates, and optimise assets.
- `make deploy`: Build everything, and then copy it into the `docs` folder for github pages deployments (will be changed in the future).
- `make start-dev`: Starts a dev server then watches for changes, rebuilding as necessary.

## How it works

This static single-page site generator functions off of a main template file and some json files for content. When building, it reads all json files in `src/content`, concats all of those into a single data object which is then passed to the main template. The data can then be used 1:1 in the templates along with a few helper properties as well (added in `scripts/build-templates.js`).

Once the template is built, it is tossed into the `dist` folder, which during dev mode is running in a python server. Since the site is deployed via github pages, the deploy step copies the files into `docs`, which is served by Github pages.

## Project structure

- `Makefile`: The file defining all of the `make` commands for the project.
- `rollup.config.js`: The client-side javascript bundler (Rollup.js) config file.
- `scripts/`: Helper build scripts used to build the project.
- `docs/`: Directory that github pages deploys. `make deploy` will copy the build here automatically.
- `src/`: Main source code.
  - `assets/`: Image and video assets. Images here will get optimised + minified during builds.
  - `components/`: EJS templates for specific sections/blocks of the site.
  - `content/`: Content folder containing the `*.json` objects that are used as data for the EJS templates.
  - `js/`: Client-side javascript. Rollup builds this into a single bundle with `main.js` as the entrypoint.
  - `scss/`: Styles for the site.
  - `third_party/`: Third party libraries the project depends on (ie. Bootstrap)
  - `index.ejs`: Main EJS template file.