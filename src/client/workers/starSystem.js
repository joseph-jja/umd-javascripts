import MF from 'utils/mathFunctions';

const self = this,
    timeout = 100;

let center,
    resultPoints,
    planetPoints,
    sPlanetPoints,
    ePlanetPoints,
    planetPoint = 0,
    sPlanetPoint = 0,
    ePlanetPoint = 225,
    timerID;

class CelestialBody {

    constructor( color, radius, options = {} ) {

        this.color = color || 'red';
        this.radius = radius || 5;
        this.hiddenRadius = MF.add( this.radius, 1 );
        this.direction = options.direction && options.direction === 'clockwise' ? MF.add : MF.subtract;
        this.angle = options.startAngle || 0;
        this.speed = options.speed || 1;
    }

    setupPoints( xRadius = 30, yRadius ) {

        if ( xRadius !== yRadius && yRadius ) {
            this.points = MF.getEllipsePoints( xRadius, yRadius );
        } else {
            this.points = MF.getCirclePoints( xRadius );
        }
    }

    increment() {
        this.angle = this.direction( this.angle, this.speed );
        if ( this.angle < 0 ) {
            this.angle = 360;
        } else if ( this.angle > 360 ) {
            this.angle = 0;
        }
    }

    getCurrentPosition( center, isShown ) {

        return {
            x: ( this.direction( center.x, this.points[ this.angle ].x ) ),
            y: ( this.direction( center.y, this.points[ this.angle ].y ) ),
            diameter: ( isShown ? this.radius : this.hiddenRadius ),
            color: ( isShown ? this.color : 'black' )
        };
    }
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

        // stars
        const bigStar = new CelestialBody( '#FDB813', 24, {
            direction: 'counterClockwise',
            startAngle: 180
        } );
        bigStar.setupPoints( radius );

        const smallerStar = new CelestialBody( '#FDB813', 18, {
            direction: 'counterClockwise',
            startAngle: 0
        } );
        smallerStar.setupPoints( radius );

        const stars = [
            bigStar.getCurrentPosition( center, true ),
            smallerStar.getCurrentPosition( center, true ),
        ];

        // planets
        const planetRadius = Math.floor( MF.divide( radius, ( width > 600 ? 3 : 1.65 ) ) );
        const smallPlanet = new CelestialBody( '#17e3ea', 3, {
            direction: 'counterClockwise',
            startAngle: 90,
            speed: 5
        } );
        smallPlanet.setupPoints( planetRadius );

        planetPoints = MF.getCirclePoints( MF.add( planetRadius, 0 ) );
        const pradius = MF.add( planetRadius, ( width > 600 ? 28 : 17 ) );
        const xradius = MF.add( pradius, ( width > 600 ? 50 : 8 ) );
        sPlanetPoints = MF.getEllipsePoints( xradius, pradius );

        const ePradius = MF.add( radius, 75 );
        const exradius = MF.add( ePradius, 55 );
        ePlanetPoints = MF.getEllipsePoints( ePradius, exradius );

        const planet = [ smallPlanet.getCurrentPosition( stars[ 0 ], true ) ],
            sPlanet = getPlanet( stars[ 0 ].x, stars[ 0 ].y, sPlanetPoints[ sPlanetPoint ], false, 7 ),
            ePlanet = getPlanet( center.x, center.y, ePlanetPoints[ ePlanetPoint ], false, ( width > 600 ? 6 : 0 ) );

        postMessage( {
            stars: {
                white: stars
            },
            planets: {
                shownPlanet: planet.concat( sPlanet, ePlanet )
            }
        } );

        timerID = setInterval( () => {

            const black = [
                bigStar.getCurrentPosition( center, false ),
                smallerStar.getCurrentPosition( center, false ),
            ];
            bigStar.increment();
            smallerStar.increment();
            const blackPlanet = [ smallPlanet.getCurrentPosition( black[ 0 ], false ) ];
            const sBlackPlanet = getPlanet( black[ 0 ].x, black[ 0 ].y, sPlanetPoints[ sPlanetPoint ], true, 7 );
            const eBlackPlanet = getPlanet( center.x, center.y, ePlanetPoints[ ePlanetPoint ], true, ( width > 600 ? 6 : 0 ) );
            if ( sPlanetPoint < 3 ) {
                sPlanetPoint = 360;
            } else {
                sPlanetPoint -= 3;
            }
            if ( ePlanetPoint < 1 ) {
                ePlanetPoint = 360;
            } else {
                ePlanetPoint -= 1;
            }
            const white = [
                bigStar.getCurrentPosition( center, true ),
                smallerStar.getCurrentPosition( center, true ),
            ];
            smallPlanet.increment();
            const shownPlanet = [ smallPlanet.getCurrentPosition( white[ 0 ], true ) ];
            const sShownPlanet = getPlanet( white[ 0 ].x, white[ 0 ].y, sPlanetPoints[ sPlanetPoint ], false, 7 );
            const eShownPlanet = getPlanet( center.x, center.y, ePlanetPoints[ ePlanetPoint ], false, ( width > 600 ? 6 : 0 ) );

            // check if 2 circles intersect
            const mfCentersDistance = MF.distanceBetweenCirclesCenters( sShownPlanet[ 0 ].x, sShownPlanet[ 0 ].y, eShownPlanet[ 0 ].x, eShownPlanet[ 0 ].y );
            const centersDistance = Math.ceil( MF.square( mfCentersDistance ) );

            // radius + 5 in case they are near
            const radiusIntersect = MF.square( MF.add( 7, 6 ) ),
                radiusClose = MF.square( MF.add( 7, 5, 6, 5 ) );

            // touch
            if ( centersDistance === radiusIntersect ) {
                console.log( 'Touching %s %s %s %s', sShownPlanet[ 0 ].x, sShownPlanet[ 0 ].y, eShownPlanet[ 0 ].x, eShownPlanet[ 0 ].y );
            }
            if ( centersDistance === radiusClose ) {
                console.log( 'Close touching %s %s %s %s', sShownPlanet[ 0 ].x, sShownPlanet[ 0 ].y, eShownPlanet[ 0 ].x, eShownPlanet[ 0 ].y );
            }
            // intersect
            if ( centersDistance < radiusIntersect ) {
                console.log( 'Intersecting %s %s %s %s', sShownPlanet[ 0 ].x, sShownPlanet[ 0 ].y, eShownPlanet[ 0 ].x, eShownPlanet[ 0 ].y );
            }
            if ( centersDistance < radiusClose ) {
                console.log( 'Close intersecting %s %s %s %s', sShownPlanet[ 0 ].x, sShownPlanet[ 0 ].y, eShownPlanet[ 0 ].x, eShownPlanet[ 0 ].y );
            }

            postMessage( {
                stars: {
                    black,
                    white
                },
                planets: {
                    blackPlanet: blackPlanet.concat( sBlackPlanet, eBlackPlanet ),
                    shownPlanet: shownPlanet.concat( sShownPlanet, eShownPlanet )
                }
            } );

        }, timeout );
    } else if ( msg && msg.data && msg.data.stop ) {
        clearInterval( timerID );
    }
};
