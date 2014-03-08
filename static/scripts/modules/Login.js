define([
	'jquery',
	'underscore',
	'backbone',
	'text!modules/Login.html'
], function(
	$,
	_,
	Backbone,
	templateString
){
	
	
	

	return Backbone.View.extend({

		tagName: "div",
		className: "Login",
		name: 'login',
		template: _.template(templateString),



	// Init

		initialize: function() {
			this.render();
			
			if (arguments[0].model) {
				this._model = arguments[0].model;
			}

		},

		render: function() {

			// Render Template
			this.$el.html(this.template());

			// Collect attach points
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};
		},


	// Public Functions

		show: function() {
			this.$el.removeClass('hidden');
		},

		hide: function() {
			this.$el.addClass('hidden');
		},

		
	});


	
});