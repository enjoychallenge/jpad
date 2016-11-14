goog.provide('example.ol3.index');

goog.require('ol.Map');
goog.require('ol.Overlay')
goog.require('ol.View');
goog.require('ol.Tile');
goog.require('ol.control.ScaleLine');
goog.require('ol.format.IGC');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');
goog.require('ol.source.WMTS');
goog.require('ol.style.Icon');
goog.require('ol.typedefs');


/**
 * The main function.
 */
example.ol3.index = function() {

  var raster = new ol.layer.Tile({
    source: new ol.source.OSM({
      crossOrigin: null
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
  var link = './../example.index.html';
  console.log(link);


};
goog.exportSymbol('main', example.ol3.index);
