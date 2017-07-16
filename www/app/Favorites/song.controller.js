(function () {
  'use strict';

  angular.module("Player")
  .controller("SongDetailController", SongDetailController);

  SongDetailController.$inject = ["$scope", "$rootScope", "$ionicPlatform", "$stateParams"];

  function SongDetailController ($scope, $rootScope, $ionicPlatform, $stateParams){
    var vm = this;
    var audio = new Audio();
    vm.playSong = playSong;
    vm.song = null;
    vm.openUrl = openUrl;

    $ionicPlatform.ready(onReady);

    function onReady() {
      vm.song = $rootScope.favoritos[$stateParams.songIndex];
    }

    function openUrl(url) {
      window.open(url, '_system');
    }

    function playSong() {
        audio.src = vm.song.preview_url;
        audio.play();
    }
  }

})();
