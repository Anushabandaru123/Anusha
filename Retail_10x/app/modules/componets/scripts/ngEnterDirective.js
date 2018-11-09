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


angular.module('Retails.ngEnter', [])

.directive('ngEnter' ,['$filter','$rootScope', function ($filter,$rootScope) {
    return function ($scope, element, attrs) {
        
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                $scope.$apply(function (){
                    $scope.$eval(attrs.ngEnter); 
                     $(".dropdown-menu input").trigger('keyup'); 
                    // document.getElementById("getdata").style.display= "block";                  
                });
 
                event.preventDefault();

            }
        });

     
      // element.bind("focus", function (event) {
      //       console.log("directive here")
      //       element.trigger('keyup');
      //       event.preventDefault();
      //   });
 }//return..
}])