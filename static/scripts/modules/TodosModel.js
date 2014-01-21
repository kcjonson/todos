define([
	'jquery',
	'underscore',
	'backbone-loader'
], function(
	$,
	_,
	Backbone
){
	

	
	
	var todoModel = Backbone.RelationalModel.extend({

	});
	
	
	var todosCollection = Backbone.Collection.extend({
		model: todoModel
	});
	

	

	return Backbone.RelationalModel.extend({
		urlRoot: 'api/todos',

		relations: [
			{
				type: Backbone.HasMany,
				key: 'todos',
				relatedModel: todoModel,
				includeInJSON: Backbone.Model.prototype.idAttribute,
				collectionType: todosCollection,
				reverseRelation: {
					key: 'containedIn',
					includeInJSON: 'id'
				}
			}
		]

	});


	
});