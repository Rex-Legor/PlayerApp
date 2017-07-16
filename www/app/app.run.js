(function(){
  'use strict';
angular.module('Player')

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.favoritos = [];
    $rootScope.token = null;

    FCMPlugin.getToken(function(token){
        $rootScope.token = token;
    });

      FCMPlugin.onNotification(function(data){
        if(data.wasTapped){
          //Notification was received on device tray and tapped by the user.
          alert( data.body );
        }else{
          //Notification was received in foreground. Maybe the user needs to be notified.
          alert( data.body );
        }
    });
  });
});

})();
