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

			var data = {
				username: this._usernameNode.value,
				password: this._passwordNode.value
			};

			$.ajax({
				type: 'POST',
				url: '/api/login/',
				data: data,
				dataType: 'json',
       			async: false
			})
			.done(_.bind(this._onSubmitDone, this))
			.fail(_.bind(this._onSubmitFail, this));


		},

		_onSubmitDone: function(data) {
			this._errorNode.innerHTML = '';
			this.trigger('authentication:done')
		},

		_onSubmitFail: function(data) {
			var errorMessage = data.responseJSON.errorMessage;
			this._errorNode.innerHTML = errorMessage;
		}

		
	});


	
});