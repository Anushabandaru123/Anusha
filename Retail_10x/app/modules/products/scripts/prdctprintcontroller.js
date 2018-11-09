'use strict';

/**
 * @ngdoc controller
 * @name ProductModule.productController
 * @requires $scope
 * @requires $state
 * @requires product.serviceFactory
 * @description
 *
 *
 * */

angular.module('productprint.controllers',['Retails.barchartDirective'])

// .filter('startFrom', function () {
//   return function (input, start) {
    
//     console.log("coming to here....",input);
//     console.log("start.....",start);
//     if (input) {
//       start = +start;timeperiod.name
//       return input.slice(start);
//     }
//     return [];
//   };
// })

  .controller('printproductCtrl', ['$scope', '$state', 'serviceFactory','productService','dashBoardService','$http','$timeout','usSpinnerService', '$rootScope','CacheFactory','$filter','filterFilter',
    function ($scope, $state, serviceFactory,productService,dashBoardService,$http,$timeout,usSpinnerService, $rootScope,CacheFactory,$filter,filterFilter) {

          //console.log(" inside printproductCtrl",$scope.getprintvalue);
          $scope.getprintvalue = productService.getProductObject();
          console.log($scope.getprintvalue);
          $scope.daylast = $scope.getprintvalue.timeperiod.name;
          //$scope.reportdate=$scope.getprintvalue.reportdate.innertext;
          //console.log($scope.reportdate);
          $scope.manufacturerid=$scope.getprintvalue.manufacturerid;
          //console.log($scope.manufacturerid);
          $scope.selectedoption=$scope.getprintvalue.selectsort;
          $scope.categoriespiechartid=dashBoardService.generateguid();
          //console.log("categoriespiechartid",$scope.categoriespiechartid);
          $scope.manufacturerpiechartid= productService.generateguid();
          $scope.manufacturerbartchartid= productService.generateguid();
          setTimeout(function () {
          //console.log('print........');
          window.print();
          window.close();
          $state.go('allproducts');
          }, 3000);
          // angular.element("#myModal").modal();

    }]);
