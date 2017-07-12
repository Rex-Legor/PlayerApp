(function () {
  'use strict';

  angular.module("Player")
  .controller("FindController", FindController);

  FindController.$inject = ["$scope", "$rootScope","FindService"];

  function FindController ($scope, $rootScope, FindService){
    var vm = this;
    vm.songs = FindService.getSongs();
    vm.addFavoritos = addFavoritos;
    vm.discardSong = discardSong;

    function addFavoritos(){
      $rootScope.favoritos.push(vm.songs[0]);
      vm.songs.splice(0, 1);
    }

    function discardSong(){
      vm.songs.splice(0, 1);
    }
  }

})();
