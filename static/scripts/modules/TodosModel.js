define([
	'jquery',
	'underscore',
	'backbone-loader',
	'modules/TodoModel'
], function(
	$,
	_,
	Backbone,
	TodoModel
){
	
	var todosCollection = Backbone.Collection.extend({
		model: TodoModel
	});

	var todosModel =  Backbone.RelationalModel.extend({
		urlRoot: 'api/todos',
		idAttribute: '_id',

		relations: [
			{
				type: Backbone.HasMany,
				key: 'todos',
				relatedModel: TodoModel,
				collectionType: todosCollection,
				reverseRelation: {
					key: 'containedIn',
					includeInJSON: '_id'
				}
			}
		]

	});

	return todosModel;
	
});