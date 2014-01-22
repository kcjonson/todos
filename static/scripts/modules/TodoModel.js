define([
	'jquery',
	'underscore',
	'backbone-loader'
], function(
	$,
	_,
	Backbone
){

	return Backbone.RelationalModel.extend({
		urlRoot: 'api/todo',
		idAttribute: '_id'
	});

});