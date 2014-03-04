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
		 
		 
		 	//createList();
		  

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
			 	);
			 });
			 
			 server.put('/api/todo/:id', function(request, response){
			 	console.log('PUT /api/todo/' + request.params.id);
				 saveTodo(
					request.body, 
					function(savedTodo){
						response.send(savedTodo);
					}, function(error){
						response.send(error);
					}
				);

			 });
			 
			 server.delete('/api/todo/:id', function(request, response){
			 	console.log('DELETE /api/todo/' + request.params.id, request.body);
			 	deleteTodo(
			 		request.params.id,
			 		function() {
						response.send('success');
				 	},
				 	function(error) {
				 		console.log(error);
					 	response.send(error);
				 	}
				 );
			 });
 
			 
		 }

	};
	
	
// Private 



	function saveList(unsavedList, successCallback, failureCallback) {
		console.log('saveList', unsavedList);
		
		getDatabase(
			function(database){				
				database.collection('lists', function(error, listsCollection) {
					if (error) {
						console.log('Collection error: ', error);
					} else {
						var listId = new mongoId(unsavedList._id);
						saveTodos(
							unsavedList.todos,
							function(savedTodos){
								// Replace the actual todo list data with refs to DB ids.
								
								var savedTodosIds = [];
								savedTodos.forEach(function(savedTodo){
									savedTodosIds.push(savedTodo._id);
								});
								
								unsavedList.todos = savedTodosIds;
								
								delete unsavedList._id;
								console.log('saving', unsavedList);
								

								listsCollection.findAndModify(
									{_id: listId},
									[['_id','asc']],
									unsavedList, 
									{
										'safe': true,
										'upsert': true,
										'new': true
									},
									function(error, savedList){
										//console.log('success', error, savedList);
										
										// Send the whole object down, not just IDs
										savedList.todos = savedTodos;
										successCallback(savedList);
									}
								);

	
							},
							function(errors) {
								console.log('Errors in saveList: ', errors);
								failureCallback(errors);
							}
						);
					};
				});
			},
			function(error) {
				failureCallback(error);
			}
		);
	};
	
	function saveTodos(unsavedTodos, successCallback, failureCallback) {
		console.log('saveTodos', unsavedTodos);
		
		var savedTodos = [];
		var errors = [];

		unsavedTodos.forEach(function(unsavedTodo, index){

			if (unsavedTodo._creationId) {
				var creationId = unsavedTodo._creationId;
				delete unsavedTodo._creationId;
			}

			saveTodo(
				unsavedTodo, 
				function(savedTodo){
					savedTodo._creationId = creationId;
					savedTodos.push(savedTodo);
					if (index + 1 == savedTodos.length) {
						successCallback(savedTodos);
					}
				}, function(error){
					errors.push(error);
					if (index + 1 == savedTodos.length) {
						failureCallback(errors);
					}
				}
			);
		});

	};
	
	
	// Hybrid CREATE || UPDATE function for a single todo.
	// If ID on date object then Update, otherwise create
	
	function saveTodo(todoData, successCallback, failureCallback) {
		console.log('saveTodo', todoData);
		getDatabase(
			function(database){
				database.collection('todos', function(error, todosCollection) {
					if (error) {
						failureCallback(error);
					} else {
						
						// Grab ID (Its stored automatically)
						var todoId = todoData._id;
						if (todoId) {
							todoId = new mongoId(todoId);
						}
						delete todoData._id;

						// Store Created as Date
						var created = todoData.created;
						if (created) {
							todoData.created = new Date(created);
						} else {
							todoData.created = new Date();
						}
						
						todosCollection.findAndModify(
							{_id: todoId},
							[['_id','asc']],
							todoData,
							{
								'safe': true,
								'upsert': true,
								'new': true
							},
							function(error, result) {
					            if (error) {
					            	console.log('Errors in saveTodo', error);
					            	failureCallback(error);
					            } else {
					                //console.log('Success: ' + JSON.stringify(result), result);
					                successCallback(result);
								}
							}
						);						
					};
				});
			},
			function(error){
				faulureCallback(error);
			}
		);
	};
	
	
	function deleteTodo(todoId, successCallback, failureCallback) {
		console.log('deleteTodo', todoId);
		
		getDatabase(
			function(database){
				database.collection('todos', function(error, todosCollection) {
					if (error) {
						failureCallback(error);
					} else {
					
						// TODO Delete from todos && delete from lists
						
						todoId = new mongoId(todoId);
						todosCollection.findAndRemove(
							{_id: todoId},
							[['_id','asc']],
							function(error, result) {
								if (!error) {
									removeFromList(
										todoId,
										result.containedIn,
										function(data){
											successCallback(data);
										},
										function(error){
											failureCallback(error);
										}
									);					
								} else {
									failureCallback(error);
								}
							}
						);
					}
				});
				
				function removeFromList(todoId, listId, successCallback, failureCallback) {
					console.log('Remove todo from list', todoId, listId);
					database.collection('lists', function(error, listsCollection) {
						if (error) {
							failureCallback(error);
						} else {
							listId = new mongoId(listId);
							listsCollection.update(
								{'_id': listId},
								{'$pull': {'todos': todoId}},   //CURRENTLY BROKEN
								{'mutli': true},
								function(error, data) {
									if (!error) {
										console.log(data);
										successCallback(data);
									} else {
										failureCallback(error);
									}
								}
							);

/*
							listsCollection.findAndModify(
								{'_id': listId},
								[['_id','asc']],
								function(error, result) {
									if (!error) {
										successCallback(result);
									} else {
										failureCallback(error);
									}
								}
							);
*/


						}
					});
				}
				
			}
		);
		
		
		

				
		
	};
	
	

	
	

	
	function createList(successCallback, failureCallback) {
		getDatabase(
			function(database){
				database.collection('lists', function(error, listsCollection) {
					if (error) {
						failureCallback(error);
					} else {
					
						var listData = {
							todos: []
						};

						
						listsCollection.insert(listData, {safe: true}, function(error, result) {
				            if (error) {
				            	console.log('Errors in create list', error);
				            	//failureCallback(error);
				            } else {
				                console.log('Success: ' + JSON.stringify(result[0]));
				                //successCallback(result[0]);
							}
						});						
					};
				});
			},
			function(error){
				//faulureCallback(error);
			}
		);

	};

	function getList(listId, successCallback, failureCallback) {
		console.log('getList: ', listId);
	
		getDatabase(
			function(database){
				database.collection('lists', function(error, collection) {				
					if (error) {
						console.console.log('Collection error: ', error);
					} else {						
						listId = new mongoId(listId);					
						collection.findOne({_id: listId}, function(error, document){
							if (error) {
								failureCallback(error);
							} else {
								//console.log('List Document', document, document.todos);
								getTodos(document.todos, function(todos){
									document.todos = todos;
									successCallback(document);
								}, function(errors){
									failureCallback(errors);
								});
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
	 
	 function getTodos(todosIds, successCallback, failureCallback) {
		 console.log('getTodos: ', todosIds);
		 getDatabase(
			function(database){
				database.collection('todos', function(error, collection) {				
					if (error) {
						console.console.log('Collection error: ', error);
					} else {					
						var todos = [];
						var errors = [];
						todosIds.forEach(function(todoId){
							collection.findOne({_id: todoId}, function(error, document){
								if (!error) {
									todos.push(document);
								} else {
									errors.push(error);
								}
								if ((todos.length + errors.length) >= todosIds.length) {
									if (errors.length < 1) {
										successCallback(todos);
									} else {
										failureCallback(errors);
									}
								}
							})
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