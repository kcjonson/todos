define([
	'jquery',
	'underscore',
	'backbone-loader',
	'modules/CategoryModel'
], function(
	$,
	_,
	Backbone,
	CategoryModel
){

	var categoriesCollection = Backbone.Collection.extend({
	 	model: CategoryModel
	});

	var todoModel = Backbone.RelationalModel.extend({
		urlRoot: 'api/todo',
		idAttribute: '_id',
		defaults: {
			'completed': false,
			'title': 'Untitled',
			'categories': [
				{_id: '531e56d8edb97900003c17f6'}
			]
		},
		relations: [
			{
				type: Backbone.HasMany,
				key: 'categories',
				relatedModel: CategoryModel,
				collectionType: categoriesCollection
			}
		]
	});


	// Even though the primary key is _id, we allow todos to exist without one
	// This is because the key is set in the database, but we want to display the 
	// todo before a round trip is made.  So, we set a "_creationId" that gets sent
	// along and not saved so we can identify the model as being the same once it comes back.

	todoModel.findModel = function(attributes) {
		var model = Backbone.Relational.store.find( this, attributes );
		if ( !model && _.isObject( attributes ) ) {
			var coll = Backbone.Relational.store.getCollection( this );
			model = coll.find( function(m) {
				var _creationId = m.get('_creationId');
				if (_creationId && _creationId == attributes._creationId) {
					m.unset('_creationId');
					delete attributes._creationId;
					return true;
				} else {
					return false;
				}
			});
		}		
		return model;
	};

	return todoModel;

});