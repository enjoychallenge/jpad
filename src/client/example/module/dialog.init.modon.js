goog.require('jpad.module');
goog.require('jpad');
goog.require('example.module.dialog.Controller');

/**
 * Init for TECH module.
 * This is called by goog.module.* when the model should be loaded
 * @fileoverview
 */
(function() {
  goog.asserts.assert(jpad.ENABLE_MODULES);
  var moduleInfo = example.module.indexcfg.INFOS.DIALOG;
  var controller = example.module.dialog.Controller.getInstance();
  moduleInfo.controller = controller;
  controller.init(goog.bind(jpad.module.setLoaded, this, moduleInfo));
})();