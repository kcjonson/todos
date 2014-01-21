(function(){
	'use strict';
	
	var express = require('express');
	var todos = require('./lib/todos.js');
	
	
	
	// Create Express Server
	var server = express();
	server.use(express.logger('dev'));
	server.use(express.static(__dirname + '/static'));
	server.use(server.router);
	
	
	todos.startServer({
		server: server
	});
	
	
	server.listen(3000);
	console.log('Starting static content server on port 3000');

	
	
}())