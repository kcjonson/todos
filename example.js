(function(){
	'use strict';
	
	var express = require('express');
	var todos = require('./lib/todos.js');
	var auth = require('./lib/auth.js');
	
	
	
	// Create Express Server
	var server = express();
	server.use(express.logger('dev'));
	server.use(express.bodyParser());
	server.use(express.cookieParser('testSecret'));
	server.use(express.cookieSession({
		key: 'todos.sess'
	}));
	

	// Authentication Routing Middleware
	server.use(function(request, response, next){
	  	//console.log('hello',);

	  	var url = request._parsedUrl.pathname;
	  	var authRequired = false;
	  	var errorResponse;

	  	// API Endpoints
	  	if (url.indexOf('/api/') >= 0 && url.indexOf('/api/login/') == -1) {
	  		authRequired = true;
	  		errorResponse = {
  				errorMessage: 'The endpoint you are trying to reach requires authentication',
  				errorType: 'REQUIRES_AUTHENTICATION'
  			}
	  	};

	  	// Pages 
	  	// if (url.indexOf('/todos.html') >= 0) {
	  	// 	authRequired = true;
	  	// 	errorResponse = "<h1>Error</h1><p>The page you are trying to reach requires authentication</p>";
	  	// };

	  	if (authRequired) {
	  		auth.requireLogin(request, response, function(error, user){
	  			if (error) {
		  			response.send(401, errorResponse);
	  			}
	  			next();
	  		});
	  	} else {
	  		next();
	  	};
	  	
	});

	// Router and Static Server
	server.use(server.router);
	server.use(express.static(__dirname + '/static'));

	// Todos Endpoints
	todos.startServer({
		server: server
	});

	// Auth Endpoints
	auth.startServer({
		server: server
	});
	
	
	server.listen(3000);
	console.log('Starting static content server on port 3000');

	
}());