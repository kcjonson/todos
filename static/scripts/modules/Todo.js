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

		tagName: "li",
		className: "Todo",
		template: _.template(templateString),



	// Public 

		initialize: function() {
			this.render();
			//this._initializeTemplate();			
			if (arguments[0].model) {
				this._model = arguments[0].model;
				this._model.on("destroy", _.bind(this._onModelDestroy, this));
				this._model.on("change", _.bind(this._onModelChange, this));
				this._updateDisplay();
			}
			
			this._deleteNode.addEventListener('click', _.bind(this._onDeleteClick, this));
			this._completeNode.addEventListener('click', _.bind(this._onCompleteClick, this));
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



	// User Event Handlers

		_onDeleteClick: function() {
			//console.log('delete');
			this._model.destroy();
		},

		_onCompleteClick: function() {
			this._model.set('completed', true);
			this._model.save();
		},


	// Data Event Handlers

		_onModelChange: function() {
			console.log('Todo Model Change', this.model);
			this._updateDisplay();
		},

		_onModelDestroy: function() {
			console.log('Todo Model Destroy');
			this.undelegateEvents();
			this.remove();
		},


	// Private


		_updateDisplay: function() {
			this._titleNode.innerHTML = this.model.get('title');
			this.$el.toggleClass('completed', this.model.get('completed'));
		}
		

		


		
	});


	
});