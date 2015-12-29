Converts ORA ([OpenRaster][ORA]) files, which consist of multiple layers, to a single-layer image.
It can then be saved as PNG, JPG, etc.

ORA is used by [MyPaint](http://mypaint.org/), [Krita](https://krita.org/), and others.

Usage:

    // Manual processing of the returned image
    require( 'ora-to-image' ).mergeOra( 'test/test.ora', function ( err, img ) {
        img.writeFile( 'merged.jpg' );
    } );
    
    // Direct conversion from ORA to PNG
    require( 'ora-to-image' ).oraToPng( 'test/test.ora', 'merged.png', function ( err ) {
        console.log( 'Success: ', !!err );
    } );

[ORA]: https://en.wikipedia.org/wiki/OpenRaster