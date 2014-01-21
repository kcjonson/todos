define([
	'jquery',
	'underscore',
	'backbone',
	'text!modules/Todo.html'
], function(
	$,
	_,
	Backbone,
	templateString
){
	
	
	

	return Backbone.View.extend({

		initialize: function() {

			var templateDom = _.template(templateString);
			this.$el.html(templateDom);

		}

		
	});


	
});