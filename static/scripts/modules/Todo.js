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
			
			this._initializeTemplate();
			
			if (arguments[0].model) {
				this._model = arguments[0].model;
				this._model.on("destroy", _.bind(this._onModelDestroy, this));
				this._updateDisplay();
			}
			
			this._deleteNode.addEventListener('click', _.bind(this._onDeleteClick, this));
			
		},
		
		_initializeTemplate: function() {
		
			// Consume template string
			if (templateString) {
				var templateDom = _.template(templateString);
				this.$el.html(templateDom);
			};
			
			// Collect attach points
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};
		},

		_updateDisplay: function() {
			this._titleNode.innerHTML = this.model.get('title');
		},
		
		_onModelChange: function() {
			console.log('Todo Model Change', this.model);
			this._updateDisplay();
		},

		_onModelDestroy: function() {
			console.log('Todo Model Destroy');
			this.undelegateEvents();
			this.remove();
		},
		
		_onDeleteClick: function() {
			console.log('delete');
			this._model.destroy();
		}

		
	});


	
});