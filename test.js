var path = require( 'path' );

require( './app.js' ).mergeOra( 'test/test.ora', function ( err, img ) {
    console.log( 'Okay, writing file.', path.join( __dirname, 'merged.jpg' ) );
    console.log( err, img );
    img.writeFile( path.join( __dirname, 'merged.jpg' ), function ( err ) {
        console.log( 'Write file: ', err );
    } );
} );

require( './app.js' ).oraToImage( 'test/test.ora', 'merged.png', function ( err ) {
    console.log( 'Success: ', !err );
} );