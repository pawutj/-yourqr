angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MyqrCtrl', function($scope,$rootScope) {
  $scope.data = $rootScope.data
})

.controller('HistoryCtrl', function($scope, $cordovaSQLite) {
  $scope.blogJson={}
  var db = $cordovaSQLite.openDB({name: "test_table", iosDatabaseLocation: 'default'})
      db.executeSql('SELECT  * FROM test_table', [], function(rs) {
      // console.log(rs.rows.item())
      // $scope.count = rs.rows.item(0)
      var all_rows = [];
       for (i=0; i<rs.rows.length; ++i){
           all_rows.push(rs.rows.item(i))
         }
        $scope.blogJson = JSON.stringify(all_rows)
        console.log(all_rows)
        console.log($scope.blogJson)
    }, function(error) {
      console.log('SELECT SQL statement ERROR: ' + error.message);
    })

})

.controller('AfterScanCtrl', function($scope,$rootScope) {
  $scope.values = $rootScope.scan_values
})


.controller('ScanCtrl', function($scope, $cordovaBarcodeScanner) {
  
  // $cordovaBarcodeScanner
  //     .scan()
  //     .then(function(barcodeData) {
  //       // Success! Barcode data is here
  //     }
});
