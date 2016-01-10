Converts OpenRaster `.ora` files to PNG, JPG, or GIF.

![ORA screen](resources/screen.jpg)

### ORA?

[OpenRaster](https://en.wikipedia.org/wiki/OpenRaster) files consist of multiple layers, 
like .psd or .xcf files. ORA is an open file format.

ORA is used by [MyPaint](http://mypaint.org/), [Krita](https://krita.org/), and others.

### Usage

Direct conversion from ORA to PNG:

    require( 'ora-to-image' ).oraToImage( 'test.ora', 'merged.png', function ( err ) {
        console.log( 'Success: ', !err );
    } );

Manual processing of the returned image: (The callback function will receive a 
[Batch Image](https://github.com/EyalAr/lwip#batch-operations) from lwip, 
which can be used to further process the image.)

    require( 'ora-to-image' ).mergeOra( 'test.ora', function ( err, img ) {
        img.writeFile( 'merged.jpg' );
    } );

### Demo

An example ORA file is available in the package as `require( 'ora-to-image' ).samples.screen`,
so you can run the following command in order to generate the drawing on top:

    var oti = require( 'ora-to-image' );
    oti.mergeOra( oti.samples.screen, function ( err, img ) {
        img.writeFile( 'oraScreen.jpg' );
    } );

