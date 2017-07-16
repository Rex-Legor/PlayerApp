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
          getSongs : getSongs,
          createPushotification: createPushotification
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

        function createPushotification(token, image, song_name){
          console.log("Sending: "+token + image + song_name);
          return $http({
            method : "POST",
            url : API.push_url + '/self-push',
            data: {'token': token, 'image': image, 'song_name': song_name}
          })
          .then(function (response) {
            return response;
          })
          .catch(function (error) {
            console.log("ERROR ON PUSH");
          });
        }

        return service;
    }

})();
