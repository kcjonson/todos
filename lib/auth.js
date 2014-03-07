(function(){
	'use strict';


	exports.requireLogin = function(request, response, callback) {

		var authenticated = true;
		var user = null;
		var error = true;


		if (authenticated) {
			callback(null, user);
		} else {
			callback(error, null);
		}

	};


}());
