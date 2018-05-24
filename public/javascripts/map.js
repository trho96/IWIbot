
/*
Hier wird die Kartendarstellung verwaltet. Alle Funktionen im Frontend können so auf dieselbe Karte zugreifen
und diese modifizieren.
*/

var map;
var exports = module.exports = {};

//Initialisiert die Karte mit OSM MapTiles und Zentralposition auf die HS Karlsruhe
exports.initMap = function initMap() {
    map = L.map('map').setView([49.015032, 8.3903939], 15);
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});
    map.addLayer(osm);
};

//Blendet das Map-div ein und passt die Größe des Chats an
exports.showMap = function showMap() {
    $('.mapcontainer').css('display', 'block');
    $('.chatcontainer').css('max-height', 'calc(60vh - 150px');

    map.invalidateSize();
};

//Blendet das Map-div aus und passt die Größe des Chats an
exports.hideMap = function hideMap() {
    $('.mapcontainer').css('display', 'none');
    $('.chatcontainer').css('max-height', 'calc(100vh - 150px');
};

//Fügt einen Marker an Position (lat, lng) auf die Karte hinzu
exports.addMarker = function addMarker(lat, lng) {
    var marker = L.marker([lat, lng]).addTo(map);
    return marker;
};

//Entfernt einen Marker von der Karte
exports.removeMarker = function removeMarker(marker) {
    map.removeLayer(marker);
};

//Fügt eine Polyline auf die Karte hinzu. Die Wegpunkte werden in einem Array [[lat, lng], [lat, lng], ...] übergeben
exports.addPolyline = function addPolyline(waypoints) {
    var polyline = L.polyline(waypoints, {color: 'blue', dashArray: '10, 5', lineJoin: 'round'}).addTo(map);
    return polyline;
};

//Setzt den Mittelpunkt der Karte auf latlng ([lat, lng])
exports.setFocus = function setFocus(latlng) {
    map.panTo(latlng)
};

//Setzt den Kartenausschnitt so, dass die bounds eingehalten werden
exports.fitBounds = function fitBounds(bounds) {
    map.fitBounds(bounds);
};
