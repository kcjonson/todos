
require.config({
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }
});


require(['./modules/Router'], function(Router){
  new Router;
  Backbone.history.start();
});