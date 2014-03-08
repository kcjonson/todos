(function(){
	'use strict';


	exports.requireLogin = function(request, response, callback) {

		var authenticated;
		var user;
		var error;

		// Already Authenticated
		if (request.session.authenticated == true) {
			authenticated = true;
		} else {
			if (false) {
				request.session.authenticated = true;
				authenticated = true;
			} else {
				request.session.authenticated = false;
				authenticated = false;
				error = 'Unable to authenticate user';
			}
		}


		if (authenticated) {
			callback(null, user);
		} else {
			callback(error, null);
		}

	};


}());
