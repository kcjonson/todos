
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

require(['./modules/Todos'], function(Todos){
	var TodosWidget = new Todos({
		el: $('#todos')
	});
});