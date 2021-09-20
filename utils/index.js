const { UNUSED_COMPOSER_DEPENDENCIES, BUNDLE_IGNORE, GIT_IGNORE, NPM_IGNORE } = require( './constants' );

const { existsInProject, getProjectPath } = require( './file' );

const { runCommand } = require( './package' );
const { runScript } = require( './cli' );

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
