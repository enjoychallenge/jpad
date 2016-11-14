goog.provide('example.extern.index');

goog.require('example.City');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('ol.Overlay')
goog.require('ol.Tile');
goog.require('ol.control.ScaleLine');
goog.require('ol.format.IGC');
goog.require('ol.layer.VectorTile');
goog.require('ol.source.WMTS');
goog.require('ol.style.Icon');
goog.require('ol.typedefs');


/**
 * The main function.
 */
example.extern.index = function() {

  var opts = {
    myTitle: 'Brno'
  };
  var city = new example.City(opts);
  var title = city.get('myTitle');
  goog.asserts.assertString(title);
  var el = goog.dom.getElement('output');
  goog.dom.setTextContent(el, JSON.stringify(opts));
};
goog.exportSymbol('main', example.extern.index);
