const { UNUSED_COMPOSER_DEPENDENCIES, getProjectPath, runCommand } = require( '../utils' );

/**
 *
 * @param  whitelist
 * @return {boolean}
 */
const hasComposerProductionDependencies = ( whitelist = UNUSED_COMPOSER_DEPENDENCIES ) => {
	const composerJson = require( getProjectPath( 'composer.json' ) );

	// Bail early if there are no production requirements.
	if ( ! composerJson.require ) {
		return false;
	}

	// Return true if any of the required packages is not whitelisted.
	const keys = Object.keys( composerJson.require );
	for ( let i = 0; i < keys.length; i++ ) {
		const key = keys[ i ];
		if ( ! whitelist.includes( key ) ) {
			return true;
		}
	}

	return false;
};

const prepareBundle = () => {
	console.log( 'Installing NPM dependencies...' );
	runCommand( 'npm', [ 'install' ] );
	console.log( 'Installed NPM dependencies.' );

	console.log( 'Building bundle assets...' );
	runCommand( 'npm', [ 'run', 'build' ] );
	console.log( 'Built bundle assets.' );

	if ( hasComposerProductionDependencies() ) {
		console.log( 'Installing composer dependencies...' );
		runCommand( 'composer', [ 'install', '--no-dev', '--optimize-autoloader' ] );
		console.log( 'Installed composer dependencies.' );
	}
};

prepareBundle();
