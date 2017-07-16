(function () {
    'use strict';

angular.module('Player')

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $stateProvider
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'app/Find/tabs.html',
    })

    .state('tab.find', {
        url: '/find',
        views: {
          'tab-find': {
            templateUrl: 'app/Find/tab-find.html',
            controller: "FindController",
            controllerAs: "vm"
          }
        }
      })

    .state('tab.favorites', {
      url: '/favorites',
      views: {
        'tab-favorites': {
          templateUrl: 'app/Favorites/tab-favorites.html',
        }
      }
    })

    .state('tab.song-detail', {
      url: '/song/:songIndex',
      views: {
        'tab-favorites': {
          templateUrl: 'app/Favorites/tab-song-detail.html',
          controller: 'SongDetailController',
          controllerAs: "vm"
        }
      }
    });

  // Each tab has its own nav history stack:


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/find');
  $ionicConfigProvider.tabs.position('bottom');
});

})();
