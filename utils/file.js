/**
 * Node File System library.
 */
const { existsSync, readFileSync, readdirSync } = require( 'fs' );

/**
 * Node Path library.
 */
const path = require( 'path' );

const pathExists = ( fileOrFolder ) => existsSync( fileOrFolder );

/**
 * Return true if the given path resolves relative to the package root and false otherwise.
 * Path may be a file or a directory. Path must be relative to the package root.
 *
 * @function
 * @since 1.0.0
 * @param {string} fileOrFolder Relative path to a file or directory.
 * @return {boolean} True if the path exists, false otherwise.
 * @example
 *
 * existsInProject( 'package.json' );
 *
 * // => boolean true
 */
const existsInProject = ( fileOrFolder ) => pathExists( getProjectPath( fileOrFolder ) );

/**
 * Return the absolute path built from the current working directory
 * for a given relative path.
 *
 * @function
 * @since 1.0.0
 * @param {string} fileOrFolder Relative path to a file or directory.
 * @returns {string} Absolute path including package directory.
 */
const getProjectPath = ( fileOrFolder ) => path.join( process.cwd(), fileOrFolder );

const getScriptsDirPath = () => {
	return path.join( path.dirname( __dirname ), 'scripts' );
};

const getScriptPath = ( name ) => {
	return path.join( getScriptsDirPath(), `${ name }.js` );
};

module.exports = {
	pathExists,
	existsInProject,
	getProjectPath,
	getScriptsDirPath,
	getScriptPath,
};
