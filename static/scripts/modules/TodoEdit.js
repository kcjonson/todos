define([
	'jquery',
	'underscore',
	'backbone',
	'text!modules/TodoEdit.html'
], function(
	$,
	_,
	Backbone,
	templateString
){
	
	
	

	return Backbone.View.extend({

		tagName: "div",
		className: "dialog TodoEdit",
		template: _.template(templateString),



	// Public 

		initialize: function() {
			this.render();
			
			if (arguments[0].model) {
				this._model = arguments[0].model;
			}
			
			// this._editNode.addEventListener('click', _.bind(this._onEditClick, this));
			// this._deleteNode.addEventListener('click', _.bind(this._onDeleteClick, this));
			// this._completeNode.addEventListener('change', _.bind(this._onCompleteChange, this));
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
		}

		
	});


	
});