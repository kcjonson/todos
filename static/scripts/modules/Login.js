define([
	'jquery',
	'underscore',
	'backbone',
	'text!modules/Login.html'
], function(
	$,
	_,
	Backbone,
	templateString
){
	
	
	

	return Backbone.View.extend({

		tagName: "div",
		className: "Login",
		name: 'login',
		template: _.template(templateString),



	// Init

		initialize: function() {
			this.render();

			this._submitNode.addEventListener('click', _.bind(this._onSubmitClick, this));
		},

		render: function() {

			// Render Template
			this.$el.html(this.template());

			// Collect attach points
			if (this.$el) {
				$('[data-attach-point]', this.$el).each(_.bind(function(index, attachPointNode){
					var attachPointName = attachPointNode.attributes['data-attach-point'].value;
					this[attachPointName] = attachPointNode;
				}, this));
			};
		},


	// Public Functions

		show: function() {
			this.$el.removeClass('hidden');
		},

		hide: function() {
			this.$el.addClass('hidden');
		},

	// Event Handlers

		_onSubmitClick: function() {
			console.log('click');

			var data = {
				username: 'kevin',
				password: 'test'
			};

			$.ajax({
				type: 'POST',
				url: '/api/login/',
				data: {
					username: this._usernameNode.value,
					password: this._passwordNode.value
				},
				dataType: 'json',
       			async: false
			}).done(function(data, status){
				console.log('suc', data, status);
			}).fail(function(data, error){
			 	console.log('fail', data, error);
			});


		}

		
	});


	
});