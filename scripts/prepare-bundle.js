/**
 * Internal dependencies.
 */
const { UNUSED_COMPOSER_DEPENDENCIES, getProjectPath, runCommand } = require( '../utils' );

/**
 * Return true if the current package requires any composer production dependencies.
 * Notice that we are filtering the production dependencies from the `composer.json`
 * with a whitelist of dependencies that are added in `require` but which are not
 * needed in production (e.g. composer plugins).
 *
 * @param {Array} whitelist List of package names to skip.
 * @return    {boolean}                 True if package contains production dependencies.
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
		// Bail early and return true if the current key is not a whitelisted dependency.
		if ( ! whitelist.includes( key ) ) {
			return true;
		}
	}

	return false;
};

/**
 * Perform the `prepare` operation.
 * The `prepare` operation:
 *   i)   Installs NPM dependencies
 *   ii)  Builds bundle assets
 *   iii) Installs composer production dependencies
 *
 * Notice that this function is called at the bottom of this file.
 */
const prepareBundle = () => {
	console.log( 'Installing NPM dependencies...' );
	runCommand( 'npm', [ 'install' ] );
	console.log( 'Installed NPM dependencies.' );

	console.log( 'Building bundle assets...' );
	runCommand( 'npm', [ 'run', 'build' ] );
	console.log( 'Built bundle assets.' );

	// Only install composer dependencies if there are production dependencies.
	if ( hasComposerProductionDependencies() ) {
		console.log( 'Installing composer dependencies...' );
		// Make sure to optimize the autoloader.
		runCommand( 'composer', [ 'install', '--no-dev', '--optimize-autoloader' ] );
		console.log( 'Installed composer dependencies.' );
	}
};

// This file is invoked with `node` and must thus execute the script operation.
prepareBundle();
