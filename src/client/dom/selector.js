// support for IE8 and above
// simple module to select elements based on css style selectors
// internally calls documenet.getElementById or querySelectorAll based on regex 
// this is done in a UMD format
import * as typeCheck from 'commonUtils/typeCheck';

var rquickExpr = /^#(?:([\w-]+)|(\w+)|\.([\w-]+))$/;

export default function selector( expr, parent ) {

    var result, y, self = {},
        pObj;

    self.length = 0;
    self.objectName = 'selector';

    pObj = parent || document;

    // if it is not a string and it is an object
    if ( !typeCheck.isString( expr ) && typeCheck.isObject( expr ) ) {
        if ( expr.hasOwnProperty( 'objectName' ) && expr.objectName === 'selector' ) {
            // can't select a selector object
            return expr;
        }
    }

    if ( rquickExpr.test( expr ) ) {
        // remove the leading # and return array of 1 or 0
        result = ( pObj.nodeName.toLowerCase() !== 'document' ) ? pObj.querySelector( expr ) : pObj.getElementById( expr.substring( 1 ) );
        result = ( result ? [ result ] : [] );
    } else {
        let qEle = expr;
        if ( expr instanceof HTMLElement ) {
            qEle = expr.nodeName.toLowerCase();
        }
        result = pObj.querySelectorAll( qEle );
        result = ( result && result.length > 0 ? result : [] );
    }

    self.length = result.length;

    self.get = function ( i ) {
        return result[ i ];
    };

    for ( y = 0; y < self.length; y++ ) {
        self[ y ] = result[ y ];
    }
    return self;
}
