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

const hasComposerProductionDependencies = ( whitelist = UNUSED_COMPOSER_DEPENDENCIES ) => {
    const composerJson = require( getProjectPath( 'composer.json' ) );

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