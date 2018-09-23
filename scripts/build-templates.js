const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const _fs = Promise.promisifyAll(fs);

const BUILD_DIR = `${process.cwd()}/dist`;
const SRC_DIR = `${process.cwd()}/src`;
const CONTENT_DIR = `${SRC_DIR}/content`;
const COMPONENTS_DIR = `${SRC_DIR}/components`;

const NOOP = (content) => content;

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

// Builds a object filled with the json data inside of the `src/content` directory
const buildContent = async () => {
  try {
    const files = await readFilesInDir(CONTENT_DIR, content => JSON.parse(content), '.json');
    return files.reduce((res, curr) => ({ ...res, ...curr.template }), {});
  } catch (e) {
    console.error(`There was an error building content.`, e);
    process.exit(); // There is nothing we can do at this point.
  }
};

const main = async () => {
  const data = await buildContent();
  await ejs.renderFile(`${SRC_DIR}/index.ejs`, data, async (err, str) => {
    await _fs.writeFileAsync(`${BUILD_DIR}/index.html`, str, 'utf8')
      .then(() => console.log('File successfully written at', `${BUILD_DIR}/index.html`))
      .catch(e => console.error('ERROR:', e));
  });
};

main();
