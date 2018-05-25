// we try to get the coordinates of the browser, and if it fails, we try to
// get the coordinates of the city the browser is in, using the wikical api.
// If it fails, use config.default_location
// Then, we get the nearest events from wikical and display them.

var coordinates = config.default_location;

// used to avoid querying the wikical api more than once
var cardsUpdated = false;
var imagesUpdated = false;

var EARTH_RADIUS = 6372.795;

function aprox_geod_distance(lat1, lon1, lat2, lon2) {
    // Calculates the approximate distance between two points
    // on earth equivalent sphere. Result is in km.
    var lat_1 = Math.PI * lat1/180.00;
    var lat_2 = Math.PI * lat2/180.00;
    var lon_1 = Math.PI * lon1/180.00;
    var lon_2 = Math.PI * lon2/180.00;
    var theta = lon_1-lon_2;
    var distance = EARTH_RADIUS*Math.acos(Math.sin(lat_1) * Math.sin(lat_2) +
       Math.cos(lat_1) * Math.cos(lat_2) * Math.cos(theta));
    return distance;
}

function get_distance(evento)
{
    if ( !(coordinates.lat&&coordinates.lon&&evento.latitude&&evento.longitude) ) {
        return;
    }
    return aprox_geod_distance(coordinates.lat, coordinates.lon,
                               evento.latitude, evento.longitude)
        .toFixed(1);
}

var updateImages = function(event_ids) {
    if (imagesUpdated) {
        return;
    }
    imagesUpdated = true;
    $.ajax({
        type: "GET",
        url: 'https://wikical.com/api/endpoint/event/cover_pictures/?size=350&event_ids='+event_ids,
        async:true,
        crossDomain:true,
        timeout: 10000,
        success: function(data, status, xhr){
            $('.card').each(function(){
                var event_id = $(this).data('event-id');
                if (event_id in data)
                {
                    var image_data = data[event_id];
                    var image_element = $(this).find('.card-img-top');
                    image_element.attr('src', image_data.url);
                    image_element.attr('alt', image_data.title);
                }
            });
        },
        // https://stackoverflow.com/a/5225624
        error: function(xhr, textStatus) {
            if(textStatus === 'timeout') {
                console.log('timeout requesting event_cover_pictures');
            } else {
                console.log('error requesting event_cover_pictures: ' + textStatus);
            }
        }
    });
};

// https://stackoverflow.com/a/29022150
function updateCards() {
    if (cardsUpdated) {
        return;
    }
    cardsUpdated = true;
    // Set also the call for action link
    $('a#call-for-action').attr('href', 'https://wikical.com/events/?query='+
            encodeURIComponent(config.lookup_query+' @' + coordinates.lat + ',' + coordinates.lon + '*15'));
    // Get the data from wikical and writes the content of the cards on the page
    $.ajax({
        type: "GET",
        url: 'https://wikical.com/events/?view=json&jsonp=?&limit=9&query=' +
            encodeURIComponent(config.lookup_query+'# @' + coordinates.lat + ',' + coordinates.lon + '*15'),
        jsonp: "callback",
        dataType : 'jsonp',
        async:true,
        crossDomain:true,
        timeout: 10000,
        success: function(data, status, xhr) {
            var event_ids = [];
            $.each(data, function(nr, evento) {
                event_ids.push(evento.id);
                $('#card' + (nr + 1)+'.card').data('event-id', evento.id.toString());
                $('#card' + (nr + 1) + ' .card-text').text(evento.title+' – '+
                        moment(evento.start, 'YYYY-MM-DD').format('LL'));
                $('#card' + (nr + 1) + ' .event-link').attr('href', evento.url);
                var distance = get_distance(evento);
                if (!!distance)
                {
                    $('#card' + (nr + 1) + ' .card-event-distance').text(
                            distance+' km');
                    $('#card' + (nr + 1) + ' a.card-event-directions').
                        attr('href',
                            'http://maps.google.com/maps?q='+
                            evento.latitude+','+evento.longitude);
                }
            });
            updateImages(event_ids.slice(0,9).join(","));
        },
        // https://stackoverflow.com/a/5225624
        error: function(xhr, textStatus) {
            if(textStatus === 'timeout') {
                console.log('timeout requesting events');
            } else {
                console.log('error requesting events: ' + textStatus);
            }
        }
    });
}


function setCoordinatesFromGeoAPI() {
    // Alternative: Google API, see https://stackoverflow.com/a/37276372
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function (event) {
        // https://stackoverflow.com/a/4467327
        try {
            var position = JSON.parse(this.responseText);
            coordinates.lat = position.latitude;
            coordinates.lon = position.longitude;
            updateCards();
        } catch(e) {
            console.log(e);
        }
    });
    xhr.addEventListener("error", updateCards);
    xhr.addEventListener("abort", updateCards);
    xhr.open("GET", "https://freegeoip.net/json/", true);
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
    xhr.timeout = 10000;
    xhr.ontimeout = function (e) {
        console.log('freegeoip timed out after 10 seconds with error: ' + e);
    };
    xhr.send();
}

if ("geolocation" in navigator) {
    // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
    var geo_options = {
        enableHighAccuracy: true,
        maximumAge        : 5 * 60 * 1000,
        timeout           : 15000
    };

    navigator.geolocation.getCurrentPosition(
            function (position) {
                coordinates.lat = position.coords.latitude;
                coordinates.lon = position.coords.longitude;
                updateCards();
            },
            function (error) {
                console.log('Requiring position failed with ERROR(' + error.code + '): ' + error.message);
                setCoordinatesFromGeoAPI();
            },
            geo_options);
} else {
    setCoordinatesFromGeoAPI();
}
