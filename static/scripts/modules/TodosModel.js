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

	return Backbone.RelationalModel.extend({
		urlRoot: 'api/todos',
		idAttribute: '_id',

		relations: [
			{
				type: Backbone.HasMany,
				key: 'todos',
				relatedModel: TodoModel,
				collectionType: todosCollection,
				reverseRelation: {
					key: 'containedIn'
				},
				collectionKey: '_id'
			}
		]

	});


	
});