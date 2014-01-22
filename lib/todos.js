(function(){
	'use strict';
	
	
	var mongoDb = require("mongodb").Db;
	var mongoServer = require('mongodb').Server;
	var mongoId = require('mongodb').ObjectID;
	var database;
	
	
// Public API
	
	exports.startServer = function(params) {
		var server = params.server;
		 if (server) {
		  

			 server.get('/api/todos/:id', function(request, response){

			 	console.log('GET /api/todos/' + request.params.id);
			 	
			 	getList(
			 		request.params.id, 
			 		function(data) {
						response.send(data);
				 	},
				 	function(error) {
					 	response.send(error);
				 	}
			 	);
			 });
			 
			 
			 
			 server.put('/api/todos/:id', function(request, response){
			 	console.log('PUT /api/todos/' + request.params.id);
			 	
			 	saveList(
			 		request.body,
			 		function(data) {
						response.send(data);
				 	},
				 	function(error) {
					 	response.send(error);
				 	}
			 	)


			 });
			 
			 server.put('/api/todo/:id', function(request, response){
			 	console.log('PUT /api/todo/' + request.params.id);
			 	
/*
			 	saveTodos(
			 		request.body,
			 		function(data) {
						response.send(data);
				 	},
				 	function(error) {
					 	response.send(error);
				 	}
			 	)
*/


			 });
 
			 
		 }

	};
	
	
// Private 



	function saveList(listData, successCallback, failureCallback) {
		console.log('saveList', listData);
		
		getDatabase(
			function(database){				
				database.collection('lists', function(error, listsCollection) {
					if (error) {
						console.log('Collection error: ', error);
					} else {
						var listId = new mongoId(listData._id);
						saveTodos(
							listData.todos,
							function(todosIds){
								// Replace the actual todo list data with refs to DB ids.
								listData.todos = todosIds;
								
								delete listData.id;
								delete listData._id;
								
								console.log('saving', listData);
								
								listsCollection.findAndModify({_id: listId}, [], listData, {new: true}, function(error, item){
									console.log('success', error, item);
									successCallback({});
								});
	
							},
							function(errors) {
								console.log('foo', errors);
								failureCallback(errors);
							}
						)
						

					};
				});
			},
			function(error) {
				failureCallback(error);
			}
		);
	};
	
	function saveTodos(todosData, successCallback, failureCallback) {
		console.log('saveTodos', todosData);
		
		var todosIds = [];
		var errors = [];

		todosData.forEach(function(todoData, index){
			saveTodo(
				todoData, 
				function(todoId){
					todosIds.push(todoId);
					if (index + 1 == todosData.length) {
						successCallback(todosIds);
					}
				}, function(error){
					errors.push(error);
					if (index + 1 == todosData.length) {
						failureCallback(errors);
					}
				}
			);
		});

	};
	
	function saveTodo(todoData, successCallback, failureCallback) {
		console.log('saveTodo', todoData);
		getDatabase(
			function(database){
				database.collection('todos', function(error, todosCollection) {
					if (error) {
						failureCallback(error);
					} else {
						var todoId = todoData._id;
						if (todoId) {
							todoId = new mongoId(todoId);
						}
						delete todoData._id;
						todosCollection.findAndModify(
							{_id: todoId},
							[],
							todoData,
							{new: true},
							function(error, record){
								console.log(error, record);
								if (record) {
									successCallback(record);
								} else {
									failureCallback(error);
								}
							}
						)
					};
				});
			},
			function(error){
				faulureCallback(error);
			}
		);
	};
	
	
	function createList(successCallback, failureCallback) {
		
	};

	function getList(listId, successCallback, failureCallback) {
		console.log('getTodos');
	
		getDatabase(
			function(database){
				database.collection('lists', function(error, collection) {				
					if (error) {
						console.console.log('Collection error: ', error);
					} else {						
						// IDs cant be searched for as strings, must be created to MongoID objects :(
						listId = new mongoId(listId);					
						collection.findOne({_id: listId}, function(error, document){
							if (error) {
								console.console.log(error);
							} else {
								console.log('document', document);
								successCallback(document);
							};
						});
					};
				});
			},
			function(error) {
				failureCallback(error);
			}
		); 
		 
	 };
	 
	
	 
	 
	 function getDatabase(successCallback, failureCallback) {
		 
		 if (database) {
			 successCallback(database);
		 } else {
		 	console.log('Opening Database');
		 	var dbOpenStart = new Date();
			database = new mongoDb('todos', new mongoServer('localhost', 27017), {w:1});
			database.open(function(error, newDatabase) {
			 	if (!error) {
			 		console.log('Database open - ', new Date() - dbOpenStart, 'ms');
				 	database = newDatabase;
				 	successCallback(database);
			 	} else {
				 	failureCallback(error);
			 	}
			 });
		 }
		 
		 
	 }
	 

	
	
	
}())