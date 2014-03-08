(function(){
	'use strict';



	exports.startServer = function(params) {
		var server = params.server;

		if (server) {

			server.post('/api/login/', function(request, response){
			 	console.log('POST /api/login/' + request.body);

			 	if (_authenticateUser(request.body.username, request.body.password)) {
			 		request.session.authenticated = true;
					response.send({
						message: 'succeess'
					});
			 	} else {
			 		request.session.authenticated = false;
			 		response.send(401, {
		  				errorMessage: 'The username and password you provided are invalid',
		  				errorType: 'INVALID_CREDENTIALS'
		  			});
			 	}
			 	
			 });
		};
	};



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

	function _authenticateUser(username, password) {
		console.log('Authenticating User', username, password)
		return (username == 'kevin' && password == 'password');
	}



}());
