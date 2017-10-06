const path = require('path');
const fs = require('fs-extra');
const dircompare = require('dir-compare');
const directoryTree = require('directory-tree');
const fileType = require('file-type');
const isBinaryPath = require('is-binary-path');
const readChunk = require('read-chunk');

/**
 * FileService is a utility service that allows us to interact with the
 * filesystem.
 * @class
 */
class FileService {
  /**
   * Returns true if the filename (path) exists.
   * @param {String} filename - the filename to check.
   * @returns {Boolean} true if the file exists.
   * @static
   */
  static exists(filename) {
    return fs.pathExistsSync(filename);
  }

  /**
   * Returns true if file is in a binary format.
   * @param {String} filename - the filename to check.
   * @returns {Boolean} true if the file exists.
   * @static
   */
  static isBinaryFile(filename) {
    return isBinaryPath(filename);
  }

  /**
   * Reads a file and returns the string contents.
   * @param {String} filename - the filename to read.
   * @returns {String} content of the file.
   * @throws Error if the file is not found.
   * @static
   */
  static read(filename) {
    try {
      return fs.readFileSync(filename, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`${filename} not found`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Writes `source` to `filename`.
   * @param {String} source - the data for the file
   * @param {String} filename - the filename to write the content in.
   * @throws Error if the file already exists.
   * @static
   */
  static write(filename, source) {
    try {
      fs.outputFileSync(filename, source, {flag: 'wx'});
    } catch (error) {
      if (error.code === 'EEXIST') {
        throw new Error(`${filename} exists`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Overwrites the `filename` with the contents from `source`.
   * @param {String} source - the data for the file
   * @param {String} filename - the filename to write the content in.
   * @static
   */
  static overwrite(filename, source) {
    fs.outputFileSync(filename, source, {flag: 'w'});
  }

  /**
   * Copies a file or a directory from `source` to `destination`.
   * @param {String} source - the source directory.
   * @param {String} destination - the destination directory.
   * @param {Object} options
   * @static
   */
  static copy(source, destination, options = { overwrite: false}) {
    const {overwrite} = options;
    fs.copySync(source, destination, { overwrite });
  }

  /**
   * Moves a file or directory
   * @param {String} source - source to move.
   * @param {String} destination - the destination where to move.
   * @param {Object} options
   * @static
   */
  static move(source, destination, options = { overwrite: false}) {
    const {overwrite} = options;
    fs.moveSync(source, destination, { overwrite });
  }

  /**
   * Returns an object with the extension and mimetype. Reads up to the 4100
   * byte (the magic number). https://www.npmjs.com/package/file-type
   * Ex. {ext: 'png', mime: 'image/png'}
   * @param {String} filename - the filename to check.
   * @static
   */
  static getFileType(filename) {
    return fileType(readChunk.sync(filename, 0, 4100)) || {};
  }

  /**
   * Returns the full path to the filename.
   * @param {String} relative - the relative to file.
   * @returns {String} the fullpath to the file.
   * @static
   */
  static getFullPath(relative) {
    return path.resolve(relative);
  }

  /**
   * Returns all given path segments together.
   * @param {String} paths - sequence of path segments
   * @returns {String} the fullpath to the file.
   * @static
   */
  static joinPath(...paths) {
    // TODO(jerome): normalize seems to create deploy/deploy.sh
    return paths.join('/');
  }

  // --------------------------------------------------
  // Directory
  // --------------------------------------------------

  /**
   * Removes a directory.
   * @param {String} directory - path for the directory.
   * @static
   */
  static removeDirectory(directory) {
    fs.rmdirSync(directory);
  }

  /**
   * Removes a directory contents but keeps the directory there.
   * Creates the directory if it doesn't exist.
   * @param {String} directory - path for the directory.
   * @static
   */
  static removeDirectoryContents(directory) {
    fs.emptyDirSync(directory);
  }

  /**
   * Creates a directory (like mkdir -p).
   * @param {String} directory - path for the directory.
   * @static
   */
  static createDirectory(directory) {
    fs.ensureDirSync(directory);
  }

  /**
   * Returns an object representing all files in the tree.
   * @param {String} directory - path for the directory.
   * @returns {Object} tree structure.
   * @static
   */
  static tree(directory) {
    return directoryTree(directory);
  }

  /**
   * Returns a diff object which contains:
   * ex. {added: [], removed: [], changed: [], unchanged: []}
   * @param {String} source - the source directory.
   * @param {String} destination - the destination directory.
   * @returns {Object} differences with added, removed, changed, unchanged.
   * @static
   */
  static getDirectoryDiff(source, destination) {
    // Ensure the destination directory exists.
    this.createDirectory(destination);

    // This is the overall diff that we'll be accumulating.
    const initial = {added: [], removed: [], changed: [], unchanged: []};
    const result = dircompare.compareSync(source, destination, {
      compareSize: true,
    });

    const accumulate = (all, diff) => {
      const {relativePath, name1, name2, state, type1, type2} = diff;

      // Remove the beginning `/` so we have truly relative paths.
      // Using filter to take out undefined paths will support the root
      // directory where `path` is undefined.
      const relative = relativePath.substring(1);
      const file1 = _.filter([relative, name1]).join('/');
      const file2 = _.filter([relative, name2]).join('/');

      if (type1 === 'directory' || type2 === 'directory') {
        // Skip all directories, they will be handled by the files.
      } else if (state === 'equal') {
        // File was unchanged.
        all.unchanged.push(file2);
      } else if (type1 === 'missing') {
        // File was removed.
        all.removed.push(file2);
      } else if (type2 === 'missing') {
        // File was added.
        all.added.push(file1);
      } else {
        // File was changed.
        all.changed.push(file1);
      }

      return all;
    };

    return _.reduce(result.diffSet, accumulate, initial);
  }

}


module.exports = FileService;
