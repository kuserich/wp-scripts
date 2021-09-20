const { runCommand } = require( './package' );
const { existsInProject, getScriptPath, pathExists } = require( './file' );



const runScript = ( name, args = [] ) => {
    if ( ! name ) {
        console.error( `Script name must be provided.` );
        process.exit( 1 );
    }

    console.log( getScriptPath( name ) );
    if ( ! pathExists( getScriptPath( name ) ) ) {
        console.error( `Missing script: "${name}"` );
        process.exit( 1 );
    }

    runCommand( 'node', [ getScriptPath( name ), ...args ] );
}

module.exports = {
    runScript,
};
