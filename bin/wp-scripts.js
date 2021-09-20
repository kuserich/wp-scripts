#!/usr/bin/env node

// global process
const { runScript } = require( '../utils' );

const args = process.argv.slice( 2 );
runScript( args[ 0 ], args.slice( 2 ) );
