goog.provide('app.wp.index');

goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');


/**
 * The main function.
 */
app.wp.index = function() {

  var raster = new ol.layer.Tile({
    source: new ol.source.OSM({
      crossOrigin: null,
      url: 'http://{a-c}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
    })
  });

  var view = new ol.View({
    center: [1877730, 6361175],
    maxZoom: 13,
    minZoom: 6,
    zoom: 8
  });

  new ol.Map({
    layers: [raster],
    target: document.getElementById('map'),
    view: view
  });


};
goog.exportSymbol('main', app.wp.index);
