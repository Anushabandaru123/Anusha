'use strict';

angular.module('login.controllers', [])
/**
 * @ngdoc controller
 * @name loginModule.loginController
 * @requires $scope
 * @requires $state
 * @requires loginModule.serviceFactory
 * @description
 * loginController performs the authentication with help of loginService and broadcasts the events to other modules
 *
 * */


  .controller('loginCtrl', ['$scope', '$state','$location', 'serviceFactory', '$compile', 'loginService','$interval','dashBoardService',
    function ($scope, $state,$location, serviceFactory, $compile, loginService,$interval,dashBoardService) {
      $scope.user = {
        username: '',
        password: ''
      };

      $scope.status = '200';

      /**
       * @ngdoc method
       * @name loginModule.loginController#dataLogin
       * @methodOf loginModule.loginController
       * @description
       * Invokes serviceFactory and performs authentication
       */

      /* $scope.barcodevalue="4594234567010";

      JsBarcode("#barcode", $scope.barcodevalue, {
  format: "ean13",
  //lineColor: "#0aa",
  //width:4,
  height:40,
  displayValue: false
});*/


       sessionStorage.token=null;

        var interval;

       // $scope.current=$state.current;

         var url = $location.absUrl();
          console.log(url);

      var parseQueryString = function( queryString ) {
        var params = {}, queries, temp, i, l;

        // Split into key/value pairs
        queries = queryString.split("?");

        // Convert the array of strings into an object
        for ( i = 0, l = queries.length; i < l; i++ ) {
          temp = queries[i].split('=');
          params[temp[0]] = temp[1];
        }

        console.log(params)

        return params;

      };


      var prodId = parseQueryString(url);

    //  console.log("params....",prodId);

      $scope.cid=prodId.cid;

      //console.log("cid...",$scope.cid);

      $scope.startinterval=function(){
       
       interval= $interval(function () {

     //console.log("interval refreshing after 55 mins.....");
     $scope.refreshtoken();
  }, sessionStorage.expirytime);

      }

      $scope.destroyinterval=function(){
        $interval.cancel(interval);
      }


      $scope.dataLogin = function () {
        if ($scope.user.username && $scope.user.password) {
          var data = {
            'username': $scope.user.username,
            'password': $scope.user.password
          };

          loginService.Authenticate(data).then(function (response) {

            sessionStorage.token = response.data.token;
            $scope.expiresinMilliSeconds=response.data.expires;
                 // console.log("login",response.data);
                  sessionStorage.retailerId=response.data.user.retailerId;
                  sessionStorage.loginId=response.data.user.loginid;
                  sessionStorage.setUserType=response.data.user.user_type;
                  if(response.data.user.role=="cpg"){
                    //alert(response.data.user.role);

                       /*angular.element(document).ready(function () {
              angular.element("#myModal").modal();

            });*/

              dashBoardService.setsavestoreselected(null);

                   sessionStorage.logopath=response.data.user.logopath;

                    sessionStorage.role="cpg";
                    sessionStorage.username=$scope.user.username;
                    sessionStorage.user = response.data.user.mfgId;
                    sessionStorage.mfgId=response.data.user.mfgId;
                    sessionStorage.mfgName=response.data.user.mfgName;
                    sessionStorage.logopath=response.data.user.logopath;
                    sessionStorage.loginId=response.data.user.loginid;

                    var date = new Date($scope.expiresinMilliSeconds);
                    var currentdate = new Date();

                  var hours = Math.abs(date - currentdate) / 36e5;
               $scope.expirytimeinmintues=(Math.round(hours)*60)-5;
               $scope.expirytime=($scope.expirytimeinmintues*60*1000);
               sessionStorage.expirytime=$scope.expirytime;

                    $scope.destroyinterval();
                    $scope.startinterval();

                     if($scope.cid!=undefined||$scope.cid!=null){
                      $state.go('sendinvite',{id:$scope.cid});
                    }
                    else{
                       $state.go('dashBoard');
                    }

                    // $state.go('dashBoard');

                  }
                  else if(response.data.user.role=="retailer"){


                    sessionStorage.role="retailer";
                     sessionStorage.username=$scope.user.username;
                     sessionStorage.retailerName=response.data.user.retailerName;
                    sessionStorage.user = response.data.user.retailerId;
                      var date = new Date($scope.expiresinMilliSeconds);
                    var currentdate = new Date();

                    sessionStorage.logopath=response.data.user.logopath;

                    var hours = Math.abs(date - currentdate) / 36e5;

                $scope.expirytimeinmintues=(Math.round(hours)*60)-5;
                $scope.expirytime=($scope.expirytimeinmintues*60*1000);
                sessionStorage.expirytime=$scope.expirytime;

                      // sessionStorage.expirytime=5000;
                $scope.destroyinterval();
                    $scope.startinterval();

                    if($scope.cid!=undefined||$scope.cid!=null){
                      $state.go('sendinvite',{id:$scope.cid});
                    }
                    else{
                       $state.go('dashBoard');
                    }
                  }

                  else if(response.data.user.role=="distributor"){

                     sessionStorage.role="distributor";
                     sessionStorage.user = response.data.user.distributorId;
                     sessionStorage.distributorName=$scope.user.distributorName;
                     sessionStorage.distributorId=response.data.user.distributorId;
                     var date = new Date($scope.expiresinMilliSeconds);
                     var currentdate = new Date();
                     sessionStorage.logopath=response.data.user.logopath;
                     var hours = Math.abs(date - currentdate) / 36e5;
                     $scope.expirytimeinmintues=(Math.round(hours)*60)-5;
                     $scope.expirytime=($scope.expirytimeinmintues*60*1000);
                     sessionStorage.expirytime=$scope.expirytime;
                     $scope.destroyinterval();
                     $scope.startinterval();

                     $state.go('dashBoard');
                    
                  }


            }, function (response) {
              console.log("Login Failed ");

            angular.element(document).ready(function () {
              angular.element("#myModal").modal();

            });

              console.log(response);
            }
          );

        }
      };


    /*  $scope.expiryfromthesession=sessionStorage.expirytime;

      if($scope.expiryfromthesession){
        
          $scope.destroyinterval();
         $scope.startinterval();

      }
*/

      $scope.refreshtoken=function(){
       var data = {
          "username" : sessionStorage.username,
           "passport": "true"
           }

          loginService.refreshtoken(data).then(function (response) {

            // $scope.refreshtoken();
            sessionStorage.token = response.data.token;
              $scope.expiresinMilliSeconds=response.data.expires;

            var date = new Date($scope.expiresinMilliSeconds);
                    var currentdate = new Date();

                    var hours = Math.abs(date - currentdate) / 36e5;

                     $scope.expirytimeinmintues=(Math.round(hours)*60)-5;
               $scope.expirytime=($scope.expirytimeinmintues*60*1000);
                
                sessionStorage.expirytime=$scope.expirytime;

                // sessionStorage.expirytime=5000;

                   $scope.destroyinterval();
                   $scope.startinterval();

         }, function (response) {
              console.log("Login Failed 12");
          }
          );
      }

    }]);
