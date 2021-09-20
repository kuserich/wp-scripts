/**
 * Internal dependencies.
 */
const { runCommand } = require( './package' );
const { getScriptPath, pathExists } = require( './file' );

/**
 * Run the script with the given name and pass the given arguments.
 *
 * @function
 * @since       1.0.0
 * @param       {string}    name    Name of the script.
 * @param       {array}     args    Arguments for the script.
 * @example
 *
 * runScript( 'bundle' );
 */
const runScript = ( name, args = [] ) => {
	// Bail early and print an error if the script name is not provided.
	if ( ! name ) {
		console.error( `Script name must be provided.` );
		process.exit( 1 );
	}

	// Bail early and print an error if the script doesn't exist.
	if ( ! pathExists( getScriptPath( name ) ) ) {
		console.error( `Missing script: "${ name }"` );
		process.exit( 1 );
	}

	// Run the script.
	// Notice that we are passing an `stdio` option to the child process.
	// This allows us to retrieve and print stdout and stderr logs to the
	// console of the main process.
	runCommand(
		'node',
		[ getScriptPath( name ), ...args ],
		{ stdio: [ process.stdin, process.stdout, process.stderr ] }
	);
};

module.exports = {
	runScript,
};
