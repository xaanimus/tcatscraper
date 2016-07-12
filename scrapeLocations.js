const request = require('request'),
      DOMParser = require('xmldom').DOMParser;

var stopUrls = ["http://www.tcatbus.com/content/themes/3clicks-child-theme/kml/routeCornell.kml",
                "http://www.tcatbus.com/content/themes/3clicks-child-theme/kml/routeDowntown.kml",
                "http://www.tcatbus.com/content/themes/3clicks-child-theme/kml/routeCountry.kml"];

function iterNodelist(nodeList, f) {
    for (var i = 0; i < nodeList.length; i++) {
        f(nodeList.item(i));
    }
}

var stops = [];

function printStops() {
    console.log(JSON.stringify(stops, null, ' '));
}

function scrapeBody(body) {
    var doc = new DOMParser().parseFromString(body);
    var placemark = doc.getElementsByTagName("Placemark");
    
    iterNodelist(placemark, (elem) => {
        var stop = {};
        
        var nameTag = elem.getElementsByTagName("name")[0];
        var longTag = elem.getElementsByTagName("longitude")[0];
        var latTag = elem.getElementsByTagName("latitude")[0];

        var name = nameTag.textContent;
        stop.name = name;

        if (latTag && longTag) {
            var lat = latTag.textContent;
            var long = longTag.textContent;
            stop.lat = parseFloat(lat);
            stop.long = parseFloat(long);
        } else {
            var coordsTag = elem.getElementsByTagName("coordinates")[0];
            var coordsStr = coordsTag.textContent;
            
            var i = coordsStr.indexOf(",");
            var long = coordsStr.substring(0,i);
            long = parseFloat(long);
            
            coordsStr = coordsStr.substring(i+1);
            i = coordsStr.indexOf(",");
            var lat = coordsStr.substring(0,i);
            lat = parseFloat(lat);

            stop.lat = lat;
            stop.long = long;
        }

        stops.push(stop);
    });
}

request(stopUrls[0], function(err, res, body){
    if (!err && res.statusCode == 200) scrapeBody(body);
    request(stopUrls[0], function(err, res, body){
        if (!err && res.statusCode == 200) scrapeBody(body);
        request(stopUrls[0], function(err, res, body){
            if (!err && res.statusCode == 200) scrapeBody(body);
            printStops();
        });
    });
});
