/**
 * Internal dependencies.
 */
const { SCRIPTS_DIR } = require( './constants' );

/**
 * Built-in Node library to interact with the file system.
 *
 * @see    https://nodejs.org/api/fs.html
 */
const { existsSync, readdirSync, statSync } = require( 'fs' );

/**
 * Built-in Node library containing utilities for working with file
 * and directory paths.
 *
 * @see    https://nodejs.org/api/path.html
 */
const path = require( 'path' );

/**
 * Return true if the given file or folder exists. Return false otherwise.
 *
 * This function is used as a wrapper around `existsSync` from `fs` so that
 * other modules that import this file need not import `fs` additionally.
 *
 * @function
 * @since      1.0.0
 * @param      {string}     fileOrFolder    Path to a file or a folder.
 * @returns    {boolean}                    If the file or folder exists.
 * @example
 *
 * pathExists( 'src' );
 *
 * // => boolean true
 *
 */
const pathExists = ( fileOrFolder ) => existsSync( fileOrFolder );

/**
 * Return true if the given path resolves relative to the package root and false otherwise.
 * Path may be a file or a directory. Path must be relative to the package root.
 *
 * @function
 * @since     1.0.0
 * @param     {string}     fileOrFolder    Relative path to a file or directory.
 * @return    {boolean}                    True if the path exists, false otherwise.
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
 * @since     1.0.0
 * @param     {string}    fileOrFolder    Relative path to a file or directory.
 * @return    {string}                    Absolute path including package directory.
 * @example
 *
 * getProjectPath( 'composer.json' );
 *
 * // => string '/Users/name/wp-blocks/wp-block-some/composer.json'
 */
const getProjectPath = ( fileOrFolder ) => path.join( process.cwd(), fileOrFolder );

/**
 * Return the path to the `scripts` directory of this NPM package.
 *
 * @function
 * @since     1.0.0
 * @return    {string}    Path to `scripts` directory.
 * @example
 *
 * getScriptsDirPath();
 *
 * // => string 'Users/name/wp-blocks/wp-block-some/node_modules/@sixach/sixa-wp-scripts/scripts'
 */
const getScriptsDirPath = () => {
	return path.join( path.dirname( __dirname ), SCRIPTS_DIR );
};

/**
 * Return a list of all files in the given directory.
 * This function is recursive and traverses subdirectories.
 *
 * @function
 * @since     1.0.0
 * @param     {string}    directoryPath    Path to traverse.
 * @param     {array}     foundFiles       All files found so far (for recursion).
 * @return    {array}                      All files in and below the given path.
 */
const getAllFilesInDirectory = ( directoryPath, foundFiles = [] ) => {
	const files = readdirSync( directoryPath );
	for ( let i = 0; i < files.length; i++ ) {
		const filePath = path.join( directoryPath, files[i] );
		if ( statSync( filePath ).isDirectory() ) {
			foundFiles = getAllFilesInDirectory( filePath, foundFiles );
		} else {
			foundFiles.push( filePath );
		}
	}
	return foundFiles;
};

/**
 * Build and return the path to the script with the given name.
 *
 * @function
 * @since     1.0.0
 * @param     {string}    name    Name of the script file.
 * @return    {string}            Absolute path to the script file in this package.
 * @example
 *
 * getScriptPath( 'bundle' );
 *
 * // => string 'Users/name/wp-blocks/wp-block-some/node_modules/@sixach/sixa-wp-scripts/scripts/bundle.js'
 */
const getScriptPath = ( name ) => {
	return path.join( getScriptsDirPath(), `${ name }.js` );
};

/**
 * Return a human readable format of the given size in bytes.
 *
 * @function
 * @since       1.0.0
 * @param       {int}       sizeInBytes    Integer value.
 * @returns     {string}                   Human readable file size.
 * @example
 *
 * getHumanReadableSize( 1126 );
 *
 * // => string '1.1kB'
 */
const getHumanReadableSize = ( sizeInBytes ) => {
	if ( sizeInBytes > 1024 ) {
		return `${Math.round( sizeInBytes / 1024 * 10) / 10}kB`;
	}
	return `${sizeInBytes}B`;
}

module.exports = {
	pathExists,
	existsInProject,
	getProjectPath,
	getScriptsDirPath,
	getScriptPath,
	getHumanReadableSize,
	getAllFilesInDirectory,
};
