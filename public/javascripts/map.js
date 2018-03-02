
var map;

var exports = module.exports = {};

exports.initMap = function initMap() {
    map = L.map('map').setView([51.505, -0.09], 13);
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});		
        map.addLayer(osm);   
}

exports.showMap = function showMap() {
    $('.mapcontainer').css('display', 'block');
    map.invalidateSize();
}

exports.hideMap = function hideMap() {
    $('.mapcontainer').css('display', 'none');
}

exports.addMarker = function addMarker(lat, long) {
    var marker = {};

    return marker;
}

exports.removeMarker = function removeMarker(marker) {

}

exports.addPath = function addPath(waypoints) {
    var path = {};
    
    return path;
}