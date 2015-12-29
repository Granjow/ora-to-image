require( './app.js' ).mergeOra( 'test/test.ora', function ( err, img ) {
    img.writeFile( 'merged.jpg' );
} );

require( './app.js' ).oraToPng( 'test/test.ora', 'merged.png', function ( err ) {
    console.log( 'Success: ', !!err );
} );