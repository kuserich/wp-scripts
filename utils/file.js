/**
 * Internal dependencies.
 */
const { BUNDLE_IGNORE, GIT_IGNORE, NPM_IGNORE } = require( './constants' );

/**
 * Node File System library.
 */
const { existsSync, readFileSync, readdirSync } = require( 'fs' );

/**
 * Node Path library.
 */
const path = require( 'path' );

/**
 * Node Process Library.
 */
const cp = require('child_process');

/**
 * Node Archive Library.
 */
const archiver = require( 'archiver' );

/**
 * Return true if the given path resolves relative to the package root and false otherwise.
 * Path may be a file or a directory. Path must be relative to the package root.
 *
 * @function
 * @since 1.0.0
 * @param {string} path Relative path to a file or directory.
 * @return {boolean} True if the path exists, false otherwise.
 * @example
 *
 * existsInProject( 'package.json' );
 *
 * // => boolean true
 */
const existsInProject = ( path ) =>
    existsSync( getProjectPath( path ) );

/**
 * Return the absolute path built from the current working directory
 * for a given relative path.
 *
 * @function
 * @since 1.0.0
 * @param {string} path Relative path to a file or directory.
 * @returns {string} Absolute path including package directory.
 */
const getProjectPath = ( path ) =>
    path.join( process.cwd(), path );

/**
 * Return an array of files and directories to be included in the `.zip` archive.
 *
 * @function
 * @since 1.0.0
 * @returns {array} List of files and directories to add to the `.zip` archive.
 */
const getZipFileList = () => {
    const ignoredFiles = getIgnoredFiles();
    return readdirSync( process.cwd ).filter( file => ! ignoredFiles.includes( file ) );
}

/**
 * Return an array of files to ignore during bundling.
 * These files will be excluded when the `.zip` archive is created.
 *
 * The files to ignore are read from a `.bundleignore` file. If no such file is
 * available in the package, the list of files is read from `.npmignore`. If no
 * such file is available either, this function attempts to read the list of files
 * from `.gitignore`.
 *
 * @function
 * @since 1.0.0
 * @returns {array} List of files to ignore during bundling.
 */
const getIgnoredFiles = () => {
    let ignoreFile = BUNDLE_IGNORE;
    if ( ! existsInProject( ignoreFile ) ) {
        ignoreFile = NPM_IGNORE;
    } else if ( ! existsInProject( ignoreFile ) ) {
        ignoreFile = GIT_IGNORE;
    } else if ( ! existsInProject( ignoreFile ) ) {
        // TODO: Add confirmation
        return [];
    }

    return readFileSync( getProjectPath( ignoreFile ) )
        .toString()
        .split("\n");
}