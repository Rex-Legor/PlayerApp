(function () {
  'use strict';

  angular.module("Player")
  .controller("FindController", FindController);

  FindController.$inject = ["$scope", "FindService"];

  function FindController ($scope, FindService){
    var vm = this;
    vm.songs = FindService.getSongs();
  }

})();
