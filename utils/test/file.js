const { pathExists, getProjectPath, existsInProject, getHumanReadableSize, getAllFilesInDirectory } = require( '../file' );

const { fs } = require( 'memfs' );
const { mkdirSync, openSync, closeSync } = fs;

jest.mock( 'fs' );

// Build test filesystem
beforeAll( () => {
	mkdirSync( process.cwd(), { recursive: true } );
	closeSync( openSync( `${ process.cwd() }/projectfile`, 'w' ) );
	mkdirSync( '/tmp/dir/nested', { recursive: true } );
	closeSync( openSync( '/tmp/file11', 'w' ) );
	closeSync( openSync( '/tmp/file12', 'w' ) );
	closeSync( openSync( '/tmp/dir/file21', 'w' ) );
	closeSync( openSync( '/tmp/dir/file22', 'w' ) );
	closeSync( openSync( '/tmp/dir/nested/file31', 'w' ) );
} );

describe( 'pathExists', () => {
	it( 'Should return true for an existing path', () => {
		expect( pathExists( '/tmp' ) ).toBe( true );
	} );
	it( 'Should return false for an inexistent path', () => {
		expect( pathExists( '/somethingthat/doesnot.exist' ) ).toBe( false );
	} );
} );

describe( 'existsInProject', () => {
	it( 'Should return true if the given path exists in the project path', () => {
		const fileName = 'projectfile';
		expect( existsInProject( fileName ) ).toBe( true );
	} );
	it( 'Should return false if the given path does not exists in the project path', () => {
		const fileName = 'somethingthat/doesnot.exist';
		expect( existsInProject( fileName ) ).toBe( false );
	} );
} );

describe( 'getProjectPath', () => {
	it( 'Should return project root when given an empty string', () => {
		const projectRoot = process.cwd();
		expect( getProjectPath( '' ) ).toEqual( projectRoot );
	} );
	it( 'Should return project path when given a string value', () => {
		const projectRoot = process.cwd();
		const fileName = 'filename';
		expect( getProjectPath( fileName ) ).toEqual( `${ projectRoot }/${ fileName }` );
	} );
} );

describe( 'getHumanReadableSize', () => {
	it( 'Should return byte value for values under 1024', () => {
		expect( getHumanReadableSize( 0 ) ).toBe( '0B' );
		expect( getHumanReadableSize( 1023 ) ).toBe( '1023B' );
	} );
	it( 'Should return kilobyte value for values from 1024 and below 1024^2', () => {
		expect( getHumanReadableSize( 1024 ) ).toBe( '1KB' );
		expect( getHumanReadableSize( 1048400 ) ).toBe( '1023.8KB' );
	} );
	it( 'Should return megabyte value for values above 1024^2', () => {
		expect( getHumanReadableSize( 2621440 ) ).toBe( '2.5MB' );
	} );
} );

describe( 'getAllFilesInDirectory', () => {
	it( 'Should return all files in a directory recursively', () => {
		const directory = '/tmp';
		const expectedEntries = [ '/tmp/dir/file21', '/tmp/dir/file22', '/tmp/dir/nested/file31', '/tmp/file11', '/tmp/file12' ];
		expect( getAllFilesInDirectory( directory ) ).toStrictEqual( expectedEntries );
	} );
} );
