goog.provide('example.module.index');

goog.require('example.module.indexcfg');
goog.require('example.module.indexcfg.modaware');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.module.ModuleManager');
goog.require('goog.module.ModuleLoader');
goog.require('jpad');
goog.require('jpad.module');

/**
 * The main function.
 */
example.module.index = function() {
  
  var moduleInfos = example.module.indexcfg.INFOS;
  
  if (jpad.ENABLE_MODULES) {
    var moduleManager = goog.module.ModuleManager.getInstance();
    var moduleLoader = new goog.module.ModuleLoader();
    moduleLoader.setDebugMode(true);
    moduleManager.setLoader(moduleLoader);
    moduleManager.setAllModuleInfo(goog.global['PLOVR_MODULE_INFO']);
    var uris = goog.global['PLOVR_MODULE_URIS'];
    if (goog.DEBUG) {
      uris = goog.object.map(uris, function(uri) {
        return uri.replace('http://localhost:9810', '/_compile');
      });
    }
    moduleManager.setModuleUris(uris);
    jpad.module.setLoaded(moduleInfos.APP);
  }
  
  var btnel = goog.dom.getElement('btn');
  var fst = 'this message shoud be FIRST';
  var snd = 'this message shoud be SECOND';
  
  console.log('app is running with jpad.ENABLE_MODULES='+jpad.ENABLE_MODULES);
  goog.events.listenOnce(btnel, 'click', function(e) {
    e.preventDefault();
    console.log('inicial click');
    var moduleInfo = moduleInfos.DIALOG;
    console.log('loading module "'+moduleInfo.id+'"');
    jpad.module.execOnLoad(moduleInfo, function () {
      if(jpad.ENABLE_MODULES) {
        console.log(snd);
      } else {
        console.log(fst);
      }
      console.log('module "'+moduleInfo.id+'" loaded? '+
          jpad.module.isLoaded(moduleInfo));
    }, this);
    if(jpad.ENABLE_MODULES) {
      console.log(fst);
    } else {
      console.log(snd);
    }
  });


};


goog.exportSymbol('main', example.module.index);
