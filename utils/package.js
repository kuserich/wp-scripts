/**
 * Built-in Node library to spawn child processes.
 *
 * @see    https://nodejs.org/api/child_process.html
 */
const cp = require( 'child_process' );

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
 * @return    {int}                  Status (exit code) returned by the
 * @example
 *
 * runCommand( 'npm', [ 'run', 'build' ] );
 */
const runCommand = ( command, args = [], options = {} ) => {
	const { status, stderr } = cp.spawnSync( command, args, options );
	if ( status !== 0 ) {
		const fullCommand = [ command, args.join( ' ' ) ].join( ' ' );
		console.error( `Process exited with code ${ status }` );
		console.error( `Command ${ fullCommand }` );
		console.error( stderr.toString( 'utf8' ) );
		process.exit();
	}
	return status;
};

module.exports = {
	runCommand,
};
