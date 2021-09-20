/**
 * Array of composer production dependencies to ignore during the
 * bundling process.
 *
 * @since    1.0.0
 * @type     {string[]}
 */
const UNUSED_COMPOSER_DEPENDENCIES = [ 'php', 'sixach/wp-composer-auto-npm' ];

/**
 * Name of the `.bundleignore` file.
 * The `.bundleignore` file contains a list of files that are excluded during
 * the bundling process (files that are not added in the final `.zip` archive)
 *
 * @since    1.0.0
 * @type     {string}
 */
const BUNDLE_IGNORE = '.bundleignore';

/**
 * Name of the `.npmignore` file.
 * The `.npmignore` file is used as the `.bundleignore` file if there is no
 * `.bundleignore` file available in the package.
 *
 * @since    1.0.0
 * @type    {string}
 */
const NPM_IGNORE = '.gitignore';

/**
 * Name of the `.gitignore` file.
 * The `.gitignore` file is used as the `.bundleignore` file if there is neither a
 * `.bundleignore` file nor an `.npmignore` file available in the package.
 *
 * @since    1.0.0
 * @type    {string}
 */
const GIT_IGNORE = '.gitignore';

/**
 * Name of the directory from this package that holds the script files.
 * Script files are the files that can be called via `sixa-wp-scripts`.
 *
 * @since    1.0.0
 * @type     {string}
 */
const SCRIPTS_DIR = 'scripts';

module.exports = {
	UNUSED_COMPOSER_DEPENDENCIES,
	BUNDLE_IGNORE,
	GIT_IGNORE,
	NPM_IGNORE,
	SCRIPTS_DIR,
};
