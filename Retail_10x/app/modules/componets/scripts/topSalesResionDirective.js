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


angular.module('Retails.topSalesResion', [])

.directive('topSalesResion' ,['dashBoardService','$filter', function (dashBoardService,$filter) {
 return {
   restrict: 'E',
   replace: true,
   scope: {
       data: '='
   },
    templateUrl: 'modules/componets/views/top-sales-resion.html',
   link: function (scope, element) {
      var map;
      var initMap = function () {


      }//initMap...END..

      setTimeout(function() {
        initMap();
      }, 100);

   }//link function..
 }//return..
}])