#!/usr/bin/env node

// global process

const { existsSync, readFileSync, realpathSync, readdirSync, createWriteStream, lstatSync, createReadStream } = require( 'fs' );
const path = require( 'path' );
const cp = require('child_process');
const archiver = require( 'archiver' );

const args = process.argv.slice( 2 );
const cwd = process.cwd();











buildZipFromPackage();

npmInstall();
npmBuild();

if ( hasComposerProductionDependencies() ) {
    composerInstall();
}
process.exit();

console.log( JSON.stringify({
    ...args,
    cwd,
    rp: realpathSync( cwd ),
    p: path.join( realpathSync( cwd ), 'jejej.ks' )
} ) );