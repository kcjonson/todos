(function(){
	'use strict';
	
	
	var mongo = require("mongodb");
	
	
// Public API
	
	exports.startServer = function(params) {
		var server = params.server;
		 if (server) {

			 server.get('/api/todos/:id', function(request, response){

			 	console.log('Request for: /api/todos', request.params.id);
			 	
			 	getTodos(
			 		request.params.id, 
			 		function(data) {
						response.send(data);
				 	},
				 	function(error) {
					 	response.send(error);
				 	}
			 	);
			 });
		 }

	};
	
	
// Private 

	 function getTodos(id, successCallback, failureCallback) {
	 
	 
	 	var todosData = {
		 	id: id,
			todos: [
				{label: 'one'},
				{label: 'two'}
			]
		};
	 
	 
	 
		var db = new mongo.Db('todos', new mongo.Server('kevin.rf.lan', 27017), {w:1});
		db.open(function(err, db) {
			console.log('database open!');
			
			db.collection('todos', function(error, collection) {
				
				if (error) {
					console.log('Collection error: ', error);
				}
				
				collection.findOne({id: id}, function(error, document){
				
					if (error) {
						console.log(error);
					} else {
						console.log(document);
						//var todos = documents.todos;
						successCallback(document);
					}
					
					db.close();
				});
				
			
/*
				collection.insert(todosData, function(error){
						
					if (error) {
						console.log('Insert Error: ', error);
					};
					
					
					
					collection.find().toArray(function(error, documents){
						console.log(error, documents);
						
						db.close();
					});
					

						
					
				});
*/
			});
		});
	 
	 
	 
		 

		 
		 
	 }

	
	
	
}())