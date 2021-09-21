/**
 * Internal dependencies.
 */
const { UNUSED_COMPOSER_DEPENDENCIES } = require( './constants' );
const { getProjectPath } = require( './file' );


/**
 * Built-in Node library to spawn child processes.
 *
 * @see    https://nodejs.org/api/child_process.html
 */
const cp = require( 'child_process' );

/**
 * Return true if the current package requires any composer production dependencies.
 * Notice that we are filtering the production dependencies from the `composer.json`
 * with a whitelist of dependencies that are added in `require` but which are not
 * needed in production (e.g. composer plugins).
 *
 * @param {Array} whitelist List of package names to skip.
 * @return    {boolean}                 True if package contains production dependencies.
 */
const hasComposerProductionDependencies = ( whitelist = UNUSED_COMPOSER_DEPENDENCIES ) => {
	const composerJson = require( getProjectPath( 'composer.json' ) );

	// Bail early if there are no production requirements.
	if ( ! composerJson.require ) {
		return false;
	}

	// Return true if any of the required packages is not whitelisted.
	const keys = Object.keys( composerJson.require );
	for ( let i = 0; i < keys.length; i++ ) {
		const key = keys[ i ];
		// Bail early and return true if the current key is not a whitelisted dependency.
		if ( ! whitelist.includes( key ) ) {
			return true;
		}
	}

	return false;
};

/**
 * Run a command.
 *
 * This function is a wrapper to simplify running commands. This function
 * executes the given command with the given arguments and terminates the
 * process if an error occurs.
 *
 * @function
 * @since     1.0.0
 * @param {string} command Command to run.
 * @param {Array}  args    Command arguments.
 * @param {Object} options Options for the command.
 * @return    {number}                  Status (exit code) returned by the
 * @example
 *
 * runCommand( 'npm', [ 'run', 'build' ] );
 */
const runCommand = ( command, args = [], options = {} ) => {
	const { status } = cp.spawnSync( command, args, options );
	if ( status !== 0 ) {
		const fullCommand = [ command, args.join( ' ' ) ].join( ' ' );
		console.error( `Process exited with code ${ status }` );
		console.error( `Command: ${ fullCommand }` );
		process.exit();
	}
	return status;
};

module.exports = {
	runCommand,
};
