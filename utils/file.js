

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