var fs = require( 'fs' ),
    os = require( 'os' ),
    path = require( 'path' ),
    util = require( 'util' ),
    unzip = require( 'unzip' ),
    fsextra = require( 'fs-extra' ),
    lwip = require( 'lwip' ),
    Q = require( 'q' );

function mergedOra( oraPath ) {

    var deferred = Q.defer(),
        tempDir = path.join( os.tmpdir(), 'whiteboard_' + (new Date().getTime()) );

    fs.mkdirSync( tempDir );

    // ORA is a zip. Extract it and read the content description in stack.xml.
    fs.createReadStream( oraPath ).pipe( unzip.Extract( { path: tempDir } ) ).on( 'close', function () {

        // stack.xml contains a list of layers. Stack them.
        require( 'xml2js' ).parseString( fs.readFileSync( path.join( tempDir, 'stack.xml' ) ), function ( err, stack ) {

            var layer = function ( data ) {
                return path.join( tempDir, data.src );
            };

            // Convert the XML object to a usable list and reverse it (background comes first, rest ist pasted on top)
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

            if ( layerData.length == 0 ) {
                deferred.reject( 'No layers found.' );
            } else {

                // First, load the background image. Then, paste all other layers on top.
                lwip.open( layer( layerData[ 0 ] ), function ( err, background ) {
                    if ( err ) {
                        deferred.reject( 'Could not open background layer' );

                    } else {

                        var jobs = [],
                            backgroundBatch = background.batch();

                        // Create a job for each layer. The job asynchronously loads the image and
                        // pastes it on top of the background image.
                        layerData.forEach( ( data, ix ) => {
                            if ( ix > 0 ) {
                                jobs.push( () => {
                                    var deferred = Q.defer();
                                    console.log( 'Processing ' + oraPath + ':', util.inspect( data, {
                                        depth: null,
                                        colors: true
                                    } ) );
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

                        // Run all jobs sequentially.
                        var allMerged = jobs.reduce( Q.when, Q( true ) );

                        // When all jobs are done, do some cleanup and resolve the promise.
                        allMerged.then( () => {
                            fsextra.remove( tempDir, function ( err ) {
                                if ( err ) {
                                    console.warn( 'Could not remove temporary directory ' + tempDir, err );
                                }
                            } );
                            deferred.resolve( backgroundBatch )
                        } );

                    }
                } );
            }

        } );

    } );

    return deferred.promise;
}

module.exports = {

    /**
     * Create a lwip batch object (see https://github.com/EyalAr/lwip#batch-operations) of the merged layers.
     * @param {string} oraPath Path to the ORA file
     * @param {function(err:string, image:Object)} callback
     */
    mergeOra: function ( oraPath, callback ) {
        mergedOra( oraPath ).then(
            ( batchImage ) => callback( null, batchImage ),
            ( reason ) => callback( reason, null )
        );
    },
    /**
     * Converts an ORA file to PNG, JPG, GIF (See lwip for supported formats)
     * @param {string} oraPath Path to the ORA file
     * @param {string} pngPath Path to the output image file
     * @param {function(err:string)} callback
     */
    oraToImage: function ( oraPath, pngPath, callback ) {
        mergedOra( oraPath ).then(
            ( batchImage ) => batchImage.writeFile( pngPath, callback ),
            ( reason ) => callback( reason )
        );
    },
    samples: {
        screen: path.join( __dirname, 'resources', 'oraScreen.ora' )
    }
};