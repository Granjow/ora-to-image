var fs = require( 'fs' ),
    lwip = require( 'lwip' );

lwip.open( 'background.png', function ( err, img ) {
    lwip.open( 'layer000.png', function ( err, lay ) {
        img.batch()
            .paste( 0, 0, lay )
            .writeFile( 'merge.jpg', function ( err ) {
                console.log( err );
            } );
    } );
} );