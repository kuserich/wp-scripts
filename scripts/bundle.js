const { getProjectPath } = require( '../utils' );

const { readFileSync, readdirSync, createWriteStream, lstatSync, createReadStream } = require( 'fs' );
const archiver = require( 'archiver' );


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
 *
 */
const buildZipFromPackage = () => {
    // create a file to stream archive data to.
    console.log( getProjectPath( 'plugin.zip' ) );
    const output = createWriteStream( getProjectPath( 'plugin.zip' ) );
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
        const filePath = getProjectPath( fileName );
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

buildZipFromPackage();