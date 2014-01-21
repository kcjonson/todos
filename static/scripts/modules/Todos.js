define([
	'jquery',
	'underscore',
	'backbone',
	'text!modules/Todos.html',
	'modules/Todo',
	'modules/TodosModel'
], function(
	$,
	_,
	Backbone,
	templateString,
	Todo,
	TodosModel
){
	
	
	

	return Backbone.View.extend({

		initialize: function() {
			
			this._initializeTemplate();
			this._initializeModel();

		},
		
		_initializeModel: function() {		
			this._model = new TodosModel({
				id: "1"
			});
			this._model.on("change", _.bind(this._onModelChange, this));
			
			this._model.fetch();
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
		
		_onModelChange: function(model) {
			//console.log('Model Change', model, model.get('todos'));
			
			var todos = model.get('todos');
			if (todos) {
				todos.forEach(function(todo){
					this._createTodo(todo);
				}, this)
			}
			
		},
		
		_createTodo: function(todoModel) {
			var todoWidget = new Todo({
				model: todoModel
			});
			this._listNode.appendChild(todoWidget.el);
		}


		
		
	});


	
});