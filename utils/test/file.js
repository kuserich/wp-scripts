const { pathExists, getAllFilesInDirectory } = require( '../file' );

const { fs } = require( 'memfs' );
const { mkdirSync, openSync, closeSync, readdirSync } = fs;

jest.mock( 'fs' );

// Build test filesystem
beforeAll(() => {
    mkdirSync( '/tmp/dir/nested', {recursive: true } );
    closeSync( openSync( '/tmp/file11', 'w' ) );
    closeSync( openSync( '/tmp/file12', 'w' ) );
    closeSync( openSync( '/tmp/dir/file21', 'w' ) );
    closeSync( openSync( '/tmp/dir/file22', 'w' ) );
    closeSync( openSync( '/tmp/dir/nested/file31', 'w' ) );
});

describe( 'pathExists', () => {
    it( 'Should return true for an existing path', () => {
        expect( pathExists( '/tmp' ) ).toBe( true );
    });
    it( 'Should return false for an inexistent path', () => {
        expect( pathExists( '/somethingthat/doesnot.exist' ) ).toBe( false );
    });
});

describe( 'getAllFilesInDirectory', () => {
    it( 'Should return all files in a directory recursively', () => {
        const directory = '/tmp';
        const expectedEntries = [
            '/tmp/dir/file21',
            '/tmp/dir/file22',
            '/tmp/dir/nested/file31',
            '/tmp/file11',
            '/tmp/file12',
        ];
        expect( getAllFilesInDirectory( directory ) ).toStrictEqual( expectedEntries );
    });
});