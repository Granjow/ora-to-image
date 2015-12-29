var fs = require( 'fs' ),
    os = require( 'os' ),
    path = require( 'path' ),
    unzip = require( 'unzip' ),
    lwip = require( 'lwip' );

console.log( 'Temp dir: ', os.tmpdir() );

var tempDir = path.join( os.tmpdir(), 'whiteboard_' + (new Date().getTime()) );
console.log( 'Temp dir: ', tempDir );

fs.mkdirSync( tempDir );

var file = path.join( __dirname, 'test', 'test.ora' );
console.log( file );


fs.createReadStream( file ).pipe( unzip.Extract( { path: tempDir } ) ).on( 'close', function ( args ) {
    console.log( 'unzip finished.', args );


    var xml2js = require( 'xml2js' );
    var data = xml2js.parseString( fs.readFileSync( path.join( tempDir, 'stack.xml' ) ), function(err,stack) {

        console.log(require('util' ).inspect(stack,{depth:null,colors:true}));


        console.log( stack.image.stack[ 0 ].layer[ 0 ]['$' ].x );

        var x = parseInt(stack.image.stack[ 0 ].layer[ 0 ]['$' ].x ),
            y = parseInt(stack.image.stack[ 0 ].layer[ 0 ]['$' ].y );

        var layer = function ( name ) {
            return path.join( tempDir, 'data', name );
        };

        lwip.open( layer( 'background.png' ), function ( err, img ) {
            lwip.open( layer( 'layer000.png' ), function ( err, lay ) {
                img.batch()
                    .paste( x, y, lay )
                    .writeFile( layer( 'merge.jpg' ), function ( err ) {
                        console.log( err );
                    } );
            } );
        } );
    } );

} );
