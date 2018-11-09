'use strict';

/**
 * @ngdoc controller
 * @name components.topdepartmentsDirective
 * @requires $scope
 * @requires $state
 * @requires product.controller
 * @description
 *
 *
 * */


angular.module('Retails.topStores', [])

.directive('topStores' ,['dashBoardService','$filter','$rootScope', function (dashBoardService,$filter,$rootScope) {
 return {
   restrict: 'E',
   replace: true,
   scope: {
       data: '=',
        callstore: '&'
   },
   templateUrl: 'modules/componets/views/top-stores.html',
   link: function (scope, element) {
      var initMap = function () {

      }//initMap...END..

      scope.role=sessionStorage.role;

      scope.getstorefunction=function(list){
        console.log("cominng...",list);
        var object={
          "amt":list.amt,
          "id":list.id,
          "content":list.content,
          "storeId":list.id,
          "retailer":list.retailerName
        }

                  $rootScope.$emit('getstoredata', object);

      }

      setTimeout(function() {
        initMap();
      }, 100);


   }//link function..
 }//return..
}])