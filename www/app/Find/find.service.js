(function() {
    'use strict';

    angular.module('Player').service('FindService', FindService);

    FindService.$inject = ['$http', 'API'];

    function FindService($http, API) {
        /*var service = {
            getUsers: getUsers,
            getEditorialData: getEditorialData
        };*/
        var service = {
          getSongs : getSongs
        };

        function getSongs() {
          return $http({
            method : "GET",
            url : API.url + '/recommendations'
          })
          .then(function (response) {
            return response;
          })
          .catch(function (error) {
            console.log("ERROR ON GET SONGS");
          });

        }
        /*function getUsers(){
        	return $http.get('https://jsonplaceholder.typicode.com/users')
	        	.then(function(response){
	        		return response.data;
	        	})
	        	.catch(function(){
	        		console.log('Error');
	        	});
        }*/

        return service;
    }

})();
