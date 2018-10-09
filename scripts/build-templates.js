const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const _fs = Promise.promisifyAll(fs);

'use strict';

const BUILD_DIR = `${process.cwd()}/dist`;
const SRC_DIR = `${process.cwd()}/src`;
const CONTENT_DIR = `${SRC_DIR}/content`;
const COMPONENTS_DIR = `${SRC_DIR}/components`;

const NOOP = (content) => content;

/**
 * @typedef {Object} Chain
 * @property {Function<Function>} add
 *    Add the callback to the chain, the callback receiving a snapshot of the
 *    current state of the data and returning a reference to the original chain.
 * @property {Function} commit
 *    Commits the current snapshot of the data as the final result, returning
 *    it and thus terminating the chain.
 */

/**
 * Allows chaining calls to manipulate a piece of data.
 * @param {any} value
 * @return {Chain}
 */
const chain = (value) => {
  let data = value;
  return {
    /**
     * Adds a callback to the chain, modifying the current data snapshot.
     * @param {Function<any>} cb A callback receiving the current data. Should return the modified data.
     * @return {Chain} A reference to the current chain.
     */
    map(cb) {
      data = cb(data);
      return this;
    },

    /**
     * Returns the current data snapshot, thus terminating the chain.
     */
    commit() {
      return data;
    },
  };
}

/**
 * @typedef {Object} FileDescription
 * @property {string} file The file name.
 * @property {any} content The content of the file.
 */

/**
 * Reads a file, optionally modifies it and then returns an object describing it.
 * @param {string} filepath The path to the file.
 * @param {(content: string) => any} modifier The modifying function.
 * @returns {FileDescription}
 */
const readFile = async (filepath, modifier = NOOP) => {
  try {
    const file = await _fs.readFileAsync(filepath);
    const template = modifier(file.toString());
    return { filepath, template };
  } catch (e) {
    console.warn(`File ${filepath} could not be parsed:`, e);
    return {};
  }
};

// Reads all files in a given directory and optionally modifies them or filters via an extension.
const readFilesInDir = async (dir, modifier = NOOP, ext = '') => {
  try {
    let files = await _fs.readdirAsync(dir);
    if (ext !== '') {
      files = files.filter(file => path.extname(file) === ext);
    }

    const data = await Promise.all(files.map(file => readFile(path.join(dir, file), modifier)));
    return data.filter(result => result !== {});
  } catch (e) {
    console.error(`There was an error reading the files in ${dir}:`, e);
    return [];
  }
};

// Adds an ID slug to each project based on the title
const addProjectSlugs = (data) => {
  const { projects } = data;
  return Object.assign({}, data, {
    projects: projects.map(project => Object.assign({}, project, {
      slug: project.title.toLowerCase().trim()
        .replace(/&/g, '') // remove &'s
        .replace(/[\s\W-]+/g, '-'), // Replace whitespaces and non-word chars with -
    })),
  });
};

// Removes all projects with the `hidden` prop
const removeHiddenProjects = (data) => {
  const { projects } = data;
  const filteredProjects = projects.filter(project => !project.hidden);
  return Object.assign({}, data, { projects: filteredProjects });
};

// Iterate through the data and get all of the project types
const getWithProjectFilters = (data) => {
  const { projects } = data;
  const filters = ['All'];
  // Iterate through the projects to build the filter list
  projects.map(project => {
    if (!project.type) {
      return;
    }
    // Split the filters by the | character
    const split = project.type.split('|');
    // Iterate through each filter to see if it already exists in the list
    split.map(filter => {
      const exists = filters.some(existing => filter === existing);
      if (!exists) {
        filters.push(filter);
      }
    });
  });

  return Object.assign({}, data, { filters });
};

// Builds a object filled with the json data inside of the `src/content` directory
const buildContent = async () => {
  try {
    const files = await readFilesInDir(CONTENT_DIR, content => JSON.parse(content), '.json');
    const data = files.reduce((res, curr) => ({ ...res, ...curr.template }), {});

    // chain will call each function passed in with a snapshot of the current
    // state of the data (the result of the previous .add)
    return chain(data)
      .map(removeHiddenProjects)
      .map(getWithProjectFilters)
      .map(addProjectSlugs)
      .commit();
  } catch (e) {
    console.error(`There was an error building content.`, e);
    process.exit(); // There is nothing we can do at this point.
  }
};

const main = (async () => {
  const data = await buildContent();
  await ejs.renderFile(`${SRC_DIR}/index.ejs`, data, async (err, str) => {
    await Promise.all([
      _fs.writeFileAsync(`${BUILD_DIR}/index.html`, str, 'utf8')
        .then(() => console.log('File successfully written at', `${BUILD_DIR}/index.html`))
        .catch(e => console.error('ERROR:', e)),
      _fs.writeFileAsync(`${SRC_DIR}/.content.json`, JSON.stringify(data, null, 2), 'utf8')
        .then(() => console.log(`Exported data to`, `${SRC_DIR}/.content.json`))
        .catch(e => console.error('ERROR:', e))
    ]);
  });
})();
