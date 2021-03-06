// libs first
import * as dom from 'client/dom/DOM';
import * as css from 'client/dom/CSS';
import * as events from 'client/dom/events';
import * as ajax from 'client/net/ajax';
import selector from 'client/dom/selector';
import * as xml from 'client/browser/xml';

// components
import footer from 'client/components/footer';
import * as menu from 'client/components/menu';


let jsonData = {};

function onFishTabsChanged() {
    const spanTags = selector( "#fishdataContentArea span.selection-tied" ),
        selectOption = selector( "#fish_tabs" ).get( 0 );

    let optionsindex, sloc, optn, selectedSpan;

    for ( let i = 0, end = spanTags.length; i < end; i++ ) {
        spanTags.get( i ).style.display = 'none';
    }

    optionsindex = selectOption.selectedIndex;
    optn = selectOption[ optionsindex ];
    sloc = optn.value;

    selectedSpan = selector( '#' + sloc ).get( 0 );
    selectedSpan.style.display = 'block';
}

function processJSON() {
    const parent = selector( "#fish_tabs" ).get( 0 ),
        container = selector( '#fishdataContentArea' ).get( 0 );

    parent.innerHTML = '';
    let fish = jsonData[ 'tropical_fish' ][ 'fish_data' ];
    for ( let i = 0, len = fish.length; i < len; i += 1 ) {
        const name = fish[ i ][ 'name' ][ '#text' ];
        const data = fish[ i ][ 'comment' ][ '#text' ];
        const option = dom.createElement( 'option', parent );
        option.value = name.toLowerCase().replace( /\ /g, '-' );
        option.text = name;
        const span = dom.createElement( 'span', container, {
            "id": name.toLowerCase().replace( /\ /g, '-' ),
            'innerHTML': data
        } );
        css.addClass( span, 'selection-tied' );
        if ( i > 0 ) {
            span.style.display = 'none';
        }
    }
    events.addEvent( parent, 'change', onFishTabsChanged );
}

function getXMLDocument() {
    if ( this.xmlhttp.readyState === 4 ) {
        const xmlDOC = xml.getAsXMLDocument( this.xmlhttp.responseText );
        jsonData = xml.xml2json( xmlDOC );
        processJSON();
    }
}

function doPageLoad() {
    ajax.get( getXMLDocument, "tropical_fish.xml", null );

    menu.basicMenu();
    footer( 'footer' );
}

events.addOnLoad( doPageLoad );
