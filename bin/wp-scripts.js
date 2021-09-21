#!/usr/bin/env node

/**
 * Internal dependencies.
 */
const { runScript } = require( '../utils' );

// Call the script passed in `sixa-wp-scripts` with the given arguments.
const args = process.argv.slice( 2 );
runScript( args[ 0 ], args.slice( 1 ) );
