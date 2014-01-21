define([
	'jquery',
	'underscore',
	'backbone',
	'modules/TodoModel',
], function(
	$,
	_,
	Backbone,
	TodoModel
){
	
	
	

	return Backbone.Model.extend({
		urlRoot: 'api/todos'



	});


	
});