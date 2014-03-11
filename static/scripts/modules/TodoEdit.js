define([
	'jquery',
	'underscore',
	'backbone',
	'text!modules/TodoEdit.html',
	'modules/TodoModel'
], function(
	$,
	_,
	Backbone,
	templateString,
	TodoModel
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
			
			this._submitNode.addEventListener("click", _.bind(this._onSubmitClick, this));
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

	// Private

		_onSubmitClick: function() {			
			var todosCollection = this._model.get('todos');
			var todoModel = new TodoModel({
				title: this._titleNode.value,
				description: this._descriptionNode.value,
				created: new Date(),
				_creationId: Math.random().toString(36).substr(2, 9)
			});
			todosCollection.add(todoModel);
			this._model.on("sync", _.bind(this._onModelSync, this));
			this._model.save();
		},

		_onModelSync: function() {
			this.undelegateEvents();
			this.remove();
		}

		
	});


	
});