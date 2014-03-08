define([
	'jquery',
	'underscore',
	'backbone',
	'./Todos',
	'./Login'
], function(
	$,
	_,
	Backbone,
	Todos,
	Login
){


	var views = {};

	return Backbone.Router.extend({

		routes: {
			'todos': 'todos',
			'': 'todos',
			'login': 'login'
		},

		initialize: function() {
			this.on('route', function(currentView) {
				for (var key in views) {
					if (views.hasOwnProperty(key)) {
						var v = views[key];
						if (v.name !== currentView) {
							v.hide();
						}
					}
				}
			})
		},

		todos: function() {
			//console.log('list')
			if (!views.todos) {
				views.todos = new Todos({
	 				el: $('#todos')
				});
				views.todos.on('authentication:error', _.bind(function(){
					this.navigate('login', {trigger: true});
				}, this));
			}
			views.todos.show();
		},

		login: function() {
			//console.log('login')
			if (!views.login) {
				views.login = new Login({
	 				el: $('#login')
				});
				views.login.on('authentication:done', _.bind(function(){
					this.navigate('todos', {trigger: true});
				}, this));
			}
			views.login.show();
		}



		
	});


	
});