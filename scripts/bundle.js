/**
 * Internal dependencies.
 */
const { getProjectPath, BUNDLE_IGNORE, NPM_IGNORE, GIT_IGNORE, existsInProject } = require( '../utils' );

/**
 * Built-in Node library to interact with the file system.
 *
 * @see    https://nodejs.org/api/fs.html
 */
const { readFileSync, readdirSync, createWriteStream, lstatSync, createReadStream } = require( 'fs' );

/**
 * Node library to build archives.
 *
 * @see    https://www.archiverjs.com/docs/archiver
 */
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
 * @since       1.0.0
 * @return      {Array}    List of files to ignore during bundling.
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

	return readFileSync( getProjectPath( ignoreFile ) ).toString().split( '\n' );
};

/**
 * Return an array of files and directories to be included in the `.zip` archive.
 *
 * @function
 * @since     1.0.0
 * @return    {Array}    List of files and directories to add to the `.zip` archive.
 */
const getZipFileList = () => {
	const ignoredFiles = getIgnoredFiles();
	return readdirSync( process.cwd() ).filter( ( file ) => ! ignoredFiles.includes( file ) );
};

/**
 * Build a `.zip` archive from the current package.
 * Ignored files are not included in the `.zip` archive.
 *
 * @function
 * @since       1.0.0
 */
const buildZipFromPackage = () => {
	// Create a file to stream archive data to.
	const output = createWriteStream( getProjectPath( 'plugin.zip' ) );
	const archive = archiver( 'zip' ); // TODO: can we use compression?

	archive.on( 'warning', function ( warning ) {
		console.warn( warning.code );
		console.warn( warning.message );
	} );

	archive.on( 'error', function ( error ) {
		throw error;
	} );

	// listen for all archive data to be written
	// 'close' event is fired only when a file descriptor is involved
	output.on( 'close', function () {
		console.log( archive.pointer() + ' total bytes' );
		console.log( 'Archiver has been finalized and the output file descriptor has closed.' );
	} );

	// Pipe archive data to the file.
	archive.pipe( output );

	const filesToAdd = getZipFileList();
	for ( let i = 0; i < filesToAdd.length; i++ ) {
		const fileName = filesToAdd[ i ];
		const filePath = getProjectPath( fileName );
		if ( lstatSync( filePath ).isDirectory() ) {
			archive.directory( filePath, fileName );
		} else {
			archive.append( createReadStream( filePath ), { name: fileName } );
		}
	}
	// finalize the archive (ie we are done appending files but streams have to finish yet)
	// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
	archive.finalize();
};

// This file is invoked with `node` and must thus execute the script operation.
buildZipFromPackage();
