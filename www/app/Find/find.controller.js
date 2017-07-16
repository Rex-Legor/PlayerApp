(function () {
  'use strict';

  angular.module("Player")
  .controller("FindController", FindController);

  FindController.$inject = ["$scope", "$rootScope", "$ionicPlatform", "FindService"];

  function FindController ($scope, $rootScope, $ionicPlatform, FindService){
    var vm = this;
    var audio = new Audio();
    vm.songs = [];
    vm.addFavoritos = addFavoritos;
    vm.pushSongs = pushSongs;
    vm.deleteSong = deleteSong;
    vm.playSong = playSong;
    vm.createPushotification = createPushotification;

    $ionicPlatform.ready(onReady);

    function onReady() {
      vm.pushSongs();
    }

    function playSong() {
        audio.src = vm.songs[0].preview_url;
        audio.play();
        console.log("playing " + vm.songs[0].title);
    }

    function pushSongs() {
        FindService.getSongs()
        .then(function (response) {
          vm.songs = vm.songs.concat(response.data);
        });
    }

    function addFavoritos(image, song_name){
      $rootScope.favoritos.push(vm.songs[0]);
      vm.deleteSong();
      vm.createPushotification($rootScope.token, image, song_name);
    }

    function deleteSong() {
      vm.songs.splice(0, 1);
      vm.playSong();
      if(vm.songs.length < 3){
        vm.pushSongs();
      }
    }

    function createPushotification(token, image, song_name) {
      FindService.createPushotification(token, image, song_name).
      then(function () {
        console.log("sending notification");
      });
    }

  }

})();
