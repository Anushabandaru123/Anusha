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

angular.module('individualPrdctPrint.controllers',['Retails.barchartDirective'])

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

  .controller('printindividualProductCtrl', ['$scope', '$state', 'serviceFactory','productService','dashBoardService','$http','$timeout','usSpinnerService', '$rootScope','CacheFactory','$filter','filterFilter',
    function ($scope, $state, serviceFactory,productService,dashBoardService,$http,$timeout,usSpinnerService, $rootScope,CacheFactory,$filter,filterFilter) {



           console.log(" inside printindividualProductCtrl",$scope.getindividualproduct);

          $scope.getprintvalue = productService.getindividualproduct();

          console.log($scope.getprintvalue);

         $scope.daylast = $scope.getprintvalue.selectedtimeperiod.name;

          
setTimeout(function () {
     console.log('print........');
      window.print();
      window.close();
       $state.go('individualDepartment');
    }, 3000);



             // angular.element("#myModal").modal();
          








    }]);
