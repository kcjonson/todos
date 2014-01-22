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
				_id: "52e034adcf8fabbc24f7ecff"
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
		
		
	// Event Handlers
		
		_onModelChange: function(model) {
			//console.log('Model Change', model, model.get('todos'));
			
			var todos = model.get('todos');
			if (todos) {
				todos.forEach(function(todo){
					this._createTodo(todo);
				}, this)
			}
			
		},
		
		_onSubmitClick: function() {
			console.log('click');

			var todosCollection = this._model.get('todos');
			var todoModel = new TodoModel({
				title: 'Foo'
			});
			todosCollection.add(todoModel);


			this._model.save();
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