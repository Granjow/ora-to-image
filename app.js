var fs = require( 'fs' ),
    os = require( 'os' ),
    path = require( 'path' ),
    util = require( 'util' ),
    unzip = require( 'unzip' ),
    lwip = require( 'lwip' ),
    Q = require( 'q' );

console.log( 'Temp dir: ', os.tmpdir() );

var tempDir = path.join( os.tmpdir(), 'whiteboard_' + (new Date().getTime()) );
console.log( 'Temp dir: ', tempDir );

fs.mkdirSync( tempDir );

var file = path.join( __dirname, 'test', 'test.ora' );


fs.createReadStream( file ).pipe( unzip.Extract( { path: tempDir } ) ).on( 'close', function () {

    require( 'xml2js' ).parseString( fs.readFileSync( path.join( tempDir, 'stack.xml' ) ), function ( err, stack ) {

        var layer = function ( data ) {
            return path.join( tempDir, data.src );
        };

        var layerData = stack.image.stack[ 0 ].layer.map( ( entry ) => {
            var data = entry[ '$' ];
            return {
                src: data.src,
                x: parseInt( data.x ),
                y: parseInt( data.y ),
                visible: data.visibility === 'visible'
            };
        } );
        layerData.reverse();

        console.log( util.inspect( layerData, { depth: null, colors: true } ) );


        if ( layerData.length > 0 ) {
            lwip.open( layer( layerData[ 0 ] ), function ( err, background ) {
                if ( !err ) {

                    var jobs = [],
                        backgroundBatch = background.batch();

                    layerData.forEach( ( data, ix ) => {
                        if ( ix >  0 ) {
                            console.log( 'Creating job for ' + data.src );
                            jobs.push( () => {
                                var deferred = Q.defer();
                                console.log( 'Processing:', util.inspect( data, { depth: null, colors: true } ) );
                                lwip.open( layer( data ), function ( err, layer ) {
                                    if ( !err ) {
                                        backgroundBatch.paste( data.x, data.y, layer );
                                    } else {
                                        console.error( err );
                                    }
                                    deferred.resolve( true );
                                } );
                                return deferred.promise;
                            } );
                        }
                    } );

                    var allMerged = jobs.reduce( Q.when, Q( true ) );

                    allMerged.then( () => backgroundBatch.writeFile( path.join( tempDir, 'merged.png' ), function ( err ) {
                        if ( err ) {
                            console.error( err );
                        } else {
                            console.log( 'Merged.' );
                        }
                    } ) );

                }
            } );
        }

    } );

} );
