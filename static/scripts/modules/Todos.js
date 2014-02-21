define([
	'jquery',
	'underscore',
	'backbone',
	'text!modules/Todos.html',
	'modules/Todo',
	'modules/TodosModel',
	'modules/TodoModel'
], function(
	$,
	_,
	Backbone,
	templateString,
	Todo,
	TodosModel,
	TodoModel
){
	
	
	

	return Backbone.View.extend({


	// Init

		initialize: function() {			
			this._initializeTemplate();
			this._initializeModel();
			
			this._submitNode.addEventListener("click", _.bind(this._onSubmitClick, this))
		},
		
		_initializeModel: function() {		
			this._model = new TodosModel({
				_id: "52fec37aab80e8610dfedab3"
			});
			this._model.on("change", _.bind(this._onModelChange, this));
			this._model.on("add:todos", _.bind(this._onTodoAdd, this));
			this._model.on("remove:todos", _.bind(this._onTodoRemove, this));		
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
		
		
	// Event Handlers
	
		_onTodoAdd: function(todo) {
			console.log('Todo Added', todo);
			this._createTodo(todo);

				
		},
		
		_onTodoRemove: function(todo) {
			console.log('Todo Removed', todo);
			//this._createTodo(todo);

				
		},
		
		_onModelChange: function(model) {
			console.log('Model Change', model, model.get('todos'));
			
			
		},
		
		_onSubmitClick: function() {
			console.log('click', this._textNode.value);
			
			var todosCollection = this._model.get('todos');
			var todoModel = new TodoModel({
				title: this._textNode.value,
				_creationId: Math.random().toString(36).substr(2, 9)
			});
			todosCollection.add(todoModel);
			this._model.save();
			
			this._textNode.value = "";
		},
		
		
	// Utilities 
		
		_createTodo: function(todoModel) {
			var todoWidget = new Todo({
				model: todoModel
			});
			this._listNode.appendChild(todoWidget.el);
		}


		
		
	});


	
});