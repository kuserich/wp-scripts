#!/usr/bin/env node

// global process

const { existsSync, readFileSync, realpathSync, readdirSync, createWriteStream, lstatSync, createReadStream } = require( 'fs' );
const path = require( 'path' );
const cp = require('child_process');
const archiver = require( 'archiver' );

const args = process.argv.slice( 2 );
const cwd = process.cwd();

const hasProjectFile = ( fileName ) =>
    existsSync( getProjectFilePath( fileName ) );

const getProjectFilePath= ( fileName ) =>
    path.join( cwd, fileName );

const UNUSED_COMPOSER_DEPENDENCIES = [
    'php',
    'sixach/wp-composer-auto-npm',
];

const hasComposerProductionDependencies = ( whitelist = UNUSED_COMPOSER_DEPENDENCIES ) => {
    const composerJson = require( getProjectFilePath( 'composer.json' ) );

    // Bail early if there are no production requirements.
    if ( ! composerJson.require ) {
        return false;
    }

    // Return true if any of the required packages is not whitelisted.
    const keys = Object.keys( composerJson.require );
    for ( let i = 0; i < keys.length; i++ ) {
        const key = keys[i];
        if ( ! whitelist.includes( key ) ) {
            return true;
        }
    }

    return false;
}

const npmInstall = () => {
    console.log( 'Installing NPM dependencies...' );
    runCommand( 'npm', [ 'install' ] );
    console.log( 'Installed NPM dependencies.' );
}

const npmBuild = () => {
    console.log( 'Building bundle assets...' );
    runCommand( 'npm', [ 'run', 'build' ] );
    console.log( 'Built bundle assets.' );
}

const composerInstall = () => {
    console.log( 'Installing composer dependencies...' );
    runCommand( 'composer', [ 'install', '--no-dev', '--optimize-autoloader' ] );
    console.log( 'Installed composer dependencies.' );
}

const runCommand = ( command, args ) => {
    const { status, stderr, error } = cp.spawnSync( command, args );
    if ( status !== 0 ) {
        const fullCommand = [ command, args.join( ' ' ) ].join( ' ' );
        console.error( `Process exited with code ${status}` );
        console.error( `Command ${ fullCommand }` );
        console.error( stderr.toString('utf8') );
        process.exit();
    }
    return status;
}

const buildZipFromPackage = () => {
    // create a file to stream archive data to.
    console.log( getProjectFilePath( 'plugin.zip' ) );
    const output = createWriteStream( getProjectFilePath( 'plugin.zip' ) );
    const archive = archiver( 'zip' ); // TODO: can we use compression?

    archive.on( 'warning', function( warning ) {
        console.warn( warning.code );
        console.warn( warning.message );
    });

    archive.on( 'error', function( error ) {
        throw error;
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on( 'end', function() {
        console.log('Data has been drained');
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on( 'close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    // pipe archive data to the file
    archive.pipe( output );

    const filesToAdd = getZipFileList();
    for ( let i = 0; i < filesToAdd.length; i++ ) {
        const fileName = filesToAdd[i];
        const filePath = getProjectFilePath( fileName );
        if ( lstatSync( filePath ).isDirectory() ) {
            console.log( 'appending dir ' + filePath );
            archive.directory( filePath, fileName );
        } else {
            console.log( 'appending file ' + filePath );
            archive.append( createReadStream( filePath ), { name: fileName } );
        }
    }
    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
}

const getZipFileList = () => {
    const ignoredFiles = getIgnoredFiles();
    return readdirSync( cwd ).filter( file => ! ignoredFiles.includes( file ) );
}

const getIgnoredFiles = () => {
    var ignoreFile = '.bundleignore';
    if ( ! hasProjectFile( ignoreFile ) ) {
        ignoreFile = '.npmignore';
    } else if ( ! hasProjectFile( ignoreFile ) ) {
        ignoreFile = '.gitignore';
    } else if ( ! hasProjectFile( ignoreFile ) ) {
        // TODO: Add confirmation
        return [];
    }

    return readFileSync( getProjectFilePath( '.bundleignore' ) )
        .toString()
        .split("\n");
}

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