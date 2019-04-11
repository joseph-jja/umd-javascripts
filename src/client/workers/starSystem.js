import MF from 'utils/mathFunctions';

const self = this,
    timeout = 100;

let center,
    resultPoints,
    planetPoints,
    sPlanetPoints,
    startPoint = 0,
    planetPoint = 0,
    sPlanetPoint = 0,
    timerID;

function getStars( points, hider ) {

    // Zeta Reticuli :P
    const color = ( hider ? 'black' : '#FDB813' );

    return [ {
        x: ( MF.subtract( center[ 0 ], points.x ) ),
        y: ( MF.subtract( center[ 1 ], points.y ) ),
        diameter: ( hider ? 25 : 24 ),
        color: color
    }, {
        x: ( MF.add( center[ 0 ], points.x ) ),
        y: ( MF.add( center[ 1 ], points.y ) ),
        diameter: ( hider ? 19 : 18 ),
        color: color
    } ];
}

function getPlanet( starX, starY, points, hider, diameter ) {

    const planetColor = ( hider ? 'black' : '#17e3ea' );

    return [ {
        x: ( MF.subtract( starX, points.x ) ),
        y: ( MF.subtract( starY, points.y ) ),
        diameter: ( hider ? MF.add( diameter, 1 ) : diameter ),
        color: planetColor
    } ];
}

onmessage = ( msg ) => {

    if ( msg && msg.data && msg.data.setWidthHeight ) {
        const width = msg.data.setWidthHeight[ 0 ],
            height = msg.data.setWidthHeight[ 1 ];

        center = MF.getRectangleCenter( width, height );

        const radius = MF.divide( MF.getRectangleCorner( width, height ), 1.25 );
        const planetRadius = Math.floor( MF.divide( radius, ( width > 600 ? 3 : 1.65 ) ) );

        resultPoints = MF.getCirclePoints( radius );
        planetPoints = MF.getCirclePoints( MF.add( planetRadius, 0 ) );
        const pradius = MF.add( planetRadius, ( width > 600 ? 28 : 17 ) );
        const xradius = MF.add( pradius, ( width > 600 ? 50 : 8 ) );
        sPlanetPoints = MF.getEllipsePoints( xradius, pradius );

        const stars = getStars( resultPoints[ startPoint ], false );

        const planet = getPlanet( stars[ 0 ].x, stars[ 0 ].y, planetPoints[ planetPoint ], false, 3 ),
            sPlanet = getPlanet( stars[ 0 ].x, stars[ 0 ].y, sPlanetPoints[ sPlanetPoint ], false, 7 );

        postMessage( {
            stars: {
                white: stars
            },
            planets: {
                shownPlanet: planet.concat( sPlanet )
            }
        } );

        timerID = setInterval( () => {

            const oldPoint = resultPoints[ startPoint ];
            const black = getStars( oldPoint, true );
            const blackPlanet = getPlanet( black[ 0 ].x, black[ 0 ].y, planetPoints[ planetPoint ], true, 3 );
            const sBlackPlanet = getPlanet( black[ 0 ].x, black[ 0 ].y, sPlanetPoints[ sPlanetPoint ], true, 7 );
            startPoint = ( startPoint <= 0 ? 360 : --startPoint );
            if ( planetPoint < 2 ) {
                planetPoint = 360;
            } else {
                planetPoint -= 3;
            }
            if ( sPlanetPoint < 1 ) {
                sPlanetPoint = 360;
            } else {
                sPlanetPoint -= 2;
            }
            const newPoint = resultPoints[ startPoint ];
            const white = getStars( newPoint, false );
            const shownPlanet = getPlanet( white[ 0 ].x, white[ 0 ].y, planetPoints[ planetPoint ], false, 3 );
            const sShownPlanet = getPlanet( white[ 0 ].x, white[ 0 ].y, sPlanetPoints[ sPlanetPoint ], false, 7 );

            postMessage( {
                stars: {
                    black,
                    white
                },
                planets: {
                    blackPlanet: blackPlanet.concat( sBlackPlanet ),
                    shownPlanet: shownPlanet.concat( sShownPlanet )
                }
            } );

        }, timeout );
    } else if ( msg && msg.data && msg.data.stop ) {
        clearInterval( timerID );
    }
};
