import dom from "client/DOM/DOM";
import df from "commonUtils/dateFunctions";

function createFooter() {
    var month_array, day_of_week,
        dt = new Date(),
        lastmoddate, build_footer = "",
        moddate, ampm,
        monthstring, today, daynow;

    day_of_week = dt.weekDayShortNames;
    month_array = dt.monthShortNames;

    // last modified date
    lastmoddate = Date.parse( document.lastModified );

    if ( ( lastmoddate !== undefined ) && ( lastmoddate !== 0 ) ) {
        // the document.lastModified returns time in EST 
        // this will convert the time to PST as that is where I live
        moddate = new Date( lastmoddate - 3600 );

        // find out if that was AM or PM as we want 12 hour clock not 24
        ampm = ( moddate.getHours() > 12 ) ? " PM PST" : " AM PST";

        // this is the string that displays the month
        monthstring = day_of_week[ moddate.getDay() ] + ", " + month_array[ moddate.getMonth() ] + " " + moddate.getDate() + ", " + moddate.getFullYear();
        // + " at " +  moddate.getHours() + ":" + moddate.getMinutes() + ":" + moddate.getSeconds(); 

        // display the date
        build_footer = build_footer + "<li>";
        build_footer = build_footer + "Last modified on " + monthstring + ".";
        build_footer = build_footer + "</li>";
    }
    daynow = day_of_week[ dt.getDay() ] + ", " + month_array[ dt.getMonth() ] + " " + dt.getDate() + ", " + dt.getFullYear();

    build_footer = build_footer + "<li>";
    build_footer = build_footer + "Today is " + daynow;
    build_footer = build_footer + "</li>";

    build_footer = build_footer + "<li>";
    build_footer = build_footer + "Copyright " + dt.getFullYear();
    build_footer = build_footer + "</li>";

    return build_footer;
}

function setFooter( footerParent ) {
    var loc, ft;
    if ( footer ) {
        ft = dom.createElement( "ul", footerParent );
        if ( ft ) {
            ft.innerHTML = createFooter();
        }
    }
    // users with no query selector all go to home page to get nasty message
    if ( typeof document.querySelectorAll === 'undefined' ) {
        loc = window.location.pathname;
        loc = loc.substring( loc.lastIndexOf( "/" ) );

        // fish page 
        if ( loc.indexOf( "fish_pictures" ) !== -1 ) {
            // return to home page
            window.location.href = "../";
        } else if ( loc.indexOf( "index.html" ) === -1 && loc !== "/" ) {
            window.location.href = "index.html";
        }
    }
}

export default setFooter;
