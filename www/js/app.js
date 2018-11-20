// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova','ngStorage'])

.run(function($ionicPlatform,$rootScope, $cordovaBarcodeScanner, $ionicPopup,$localStorage, $cordovaSQLite,$ionicTabsDelegate,$http) {
  
  var db

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
    
     db = $cordovaSQLite.openDB({ name: "test_table" , iosDatabaseLocation: 'default'})

  })
 
  if (!$localStorage.x){
    $localStorage.x=0
  }

   $rootScope.Scan=function(){
      $rootScope.scan_values={}
      $cordovaBarcodeScanner.scan()

      .then(function(barcodeData) {
        console.log(barcodeData.text)
        
        db.sqlBatch([
          'CREATE TABLE IF NOT EXISTS test_table (x,Text)',
        [ 'INSERT INTO test_table VALUES (?,?)', [$localStorage.x,barcodeData.text] ],
        ], function() {
        console.log('Populated database OK')
        }, function(error) {
        console.log('SQL batch ERROR: ' + error.message)
        })
        $rootScope.scan_values = barcodeData.text
        $localStorage.x = $localStorage.x+1
       $ionicTabsDelegate.select(5)
      })

    }



  $rootScope.CreateQR=function(){
      if($localStorage.data){
        $rootScope.data = $localStorage.data
      }else
      {
        $rootScope.data = {}
      }
      var myPopup_1 = $ionicPopup.show({
      template: 
              [
              '<input type="text" ng-model = "data.name" placeholder="Your Name">'+
              '<input type="text" ng-model = "data.company "placeholder="Your Company">'+
              '<input type="text" ng-model = "data.position" placeholder="Your Position">'+
              '<input type="text" ng-model = "data.email" placeholder="Your Email">'
              ],
      title: ['Enter Name Card'],
      subTitle : 'foobar',
      scope: $rootScope,
      buttons:[
        {
          text:'Cancel'
        },
        {
          text:'Save',
          type: 'button-positive',
          onTap: function(e) {
            $localStorage.data = $rootScope.data
            $p = {
              "c_data" :$localStorage.data.name
            }
            console.log($localStorage.data)
            console.log($p)
            $ionicTabsDelegate.select(2)
            $http.post("https://myqr.thaicrowd.com/api/v1/qr.save",$p).then(function(response){
              console.log(response)
              $scope.resp=response
            },function(error){
              console.log("Error")
            }
              )


          }

        }
      
      ]
    })

      }



})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.myqr', {
    cache: false,
    url: '/myqr',
    views: {
      'tab-myqr': {
        templateUrl: 'templates/tab-myqr.html',
        controller: 'MyqrCtrl'
      }
    }
  })

    .state('tab.history', {
    cache: false,
    url: '/history',
    views: {
      'tab-history': {
        templateUrl: 'templates/tab-history.html',
        controller: 'HistoryCtrl'
      }
    }
  })

  .state('tab.scan', {
    url: '/scan',
    views: {
      'tab-scan': {
        templateUrl: 'templates/tab-scan.html'
       // controller: 'ScanCtrl'
      } 
    }
  })

  .state('tab.afterscan', {
    cache: false,
    url: '/afterscan',
    views: {
      'tab-afterscan': {
        templateUrl: 'templates/tab-afterscan.html',
        controller: 'AfterScanCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
