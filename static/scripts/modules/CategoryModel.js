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
	
	
	var categoryModel =  Backbone.RelationalModel.extend({
		urlRoot: 'api/category',
		idAttribute: '_id'
	});

	return categoryModel;
	
});