/**
 * Internal dependencies.
 */
const { UNUSED_COMPOSER_DEPENDENCIES, BUNDLE_IGNORE, GIT_IGNORE, NPM_IGNORE } = require( './constants' );
const { existsInProject, getProjectPath } = require( './file' );
const { runCommand } = require( './package' );
const { runScript } = require( './cli' );

/**
 * This file simply imports and re-exports every export from every
 * utility module in this package. This creates a single entrypoint
 * for all scripts to import utility functions from.
 */
module.exports = {
	UNUSED_COMPOSER_DEPENDENCIES,
	BUNDLE_IGNORE,
	GIT_IGNORE,
	NPM_IGNORE,
	existsInProject,
	getProjectPath,
	runCommand,
	runScript,
};
