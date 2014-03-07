(function(){
	'use strict';
	
	var express = require('express');
	var todos = require('./lib/todos.js');
	var auth = require('./lib/auth.js');
	
	
	
	// Create Express Server
	var server = express();
	server.use(express.logger('dev'));
	//server.use(express.static(__dirname + '/static'));
	server.use(express.bodyParser());
	server.use(express.cookieParser('testSecret'));
	server.use(express.cookieSession({
		key: 'todos.sess'
	}));
	




	// server.get('/todos.html', function(request, response, next){
	// 	auth.requireLogin(request, response, function(){
	// 		next();
	// 	});
	// });


	server.use(function(request, response, next){
	  	//console.log('hello',);

	  	var url = request._parsedUrl.pathname;
	  	var authRequired = false;
	  	var errorResponse;

	  
	  	// API Endpoints
	  	if (url.indexOf('/api/') >= 0) {
	  		authRequired = true;
	  		errorResponse = {
  				error: 'The endpoint you are trying to reach requires authentication'
  			}
	  	};

	  	// Pages 
	  	if (url.indexOf('/todos.html') >= 0) {
	  		authRequired = true;
	  		errorResponse = "<h1>Error</h1><p>The page you are trying to reach requires authentication</p>";
	  	};


	  	if (authRequired) {
	  		auth.requireLogin(request, response, function(error, user){
	  			if (error) {
		  			response.send(errorResponse);
	  			}
	  			next();
	  		});
	  	} else {
	  		next();
	  	};
	  	
	});


	server.use(server.router);
	server.use(express.static(__dirname + '/static'));


	
	
	todos.startServer({
		server: server
	});
	
	
	server.listen(3000);
	console.log('Starting static content server on port 3000');

	
	
}())