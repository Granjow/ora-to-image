### ORA?

Converts ORA ([OpenRaster][ORA]) files, which consist of multiple layers, to a single-layer image.
It can then be saved as PNG, JPG, or GIF.

ORA is used by [MyPaint](http://mypaint.org/), [Krita](https://krita.org/), and others.

### Usage

Direct conversion from ORA to PNG:

    require( 'ora-to-image' ).oraToImage( 'test/test.ora', 'merged.png', function ( err ) {
        console.log( 'Success: ', !err );
    } );

Manual processing of the returned image: (The callback function will receive a [Batch Image][BatchLWIP] from
lwip, which can be used to further process the image.)

    require( 'ora-to-image' ).mergeOra( 'test/test.ora', function ( err, img ) {
        img.writeFile( 'merged.jpg' );
    } );

[ORA]: https://en.wikipedia.org/wiki/OpenRaster
[BatchLWIP]: https://github.com/EyalAr/lwip#batch-operations