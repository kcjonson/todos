(function(){
	'use strict';
	
	
	
// Public API
	
	exports.startServer = function(params) {
		var server = params.server;
		 if (server) {

			 server.get('/api/todos', function(request, response){

			 	console.log('req');
			 	
			 	
			 	getTodos(
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

	 function getTodos(successCallback, failureCallback) {
		 
		 successCallback({
			 todos: [
			 	{label: 'one'},
			 	{label: 'two'}
			 ]
		 })
		 
		 
	 }

	
	
	
}())