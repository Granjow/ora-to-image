var path = require( 'path' ),
    oti = require( './app.js' );

oti.mergeOra( oti.samples.screen, function ( err, img ) {
    console.log( 'Okay, writing file.', path.join( __dirname, 'merged.jpg' ) );
    console.log( err, img );
    img.writeFile( path.join( __dirname, 'merged.jpg' ), function ( err ) {
        console.log( 'Write file: ', err );
    } );
} );

oti.oraToImage( oti.samples.screen, 'merged.png', function ( err ) {
    console.log( 'Success: ', !err );
} );