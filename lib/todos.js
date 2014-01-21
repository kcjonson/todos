(function(){
	'use strict';
	
	
	
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
		 
		 successCallback({
		 	id: id,
			todos: [
				{label: 'one'},
				{label: 'two'}
			]
		 })
		 
		 
	 }

	
	
	
}())