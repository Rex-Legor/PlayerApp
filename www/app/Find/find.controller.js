(function () {
  'use strict';

  angular.module("Player")
  .controller("FindController", FindController);

  FindController.$inject = ["$scope", "$rootScope", "$ionicPlatform", "FindService"];

  function FindController ($scope, $rootScope, $ionicPlatform, FindService){
    var vm = this;
    vm.songs = [];
    vm.addFavoritos = addFavoritos;
    vm.discardSong = discardSong;
    vm.getSongs = getSongs;
    vm.deleteSong = deleteSong;
    $ionicPlatform.ready(onReady);

    function onReady() {
      vm.getSongs();
    }

    function getSongs() {
            FindService.getSongs()
            .then(function (response) {
              vm.songs = response.data;
            });
    }

    function addFavoritos(){
      $rootScope.favoritos.push(vm.songs[0]);
      vm.deleteSong();
    }

    function discardSong(){
      vm.deleteSong();
    }

    function deleteSong() {
      vm.songs.splice(0, 1);
    }


  }

})();
