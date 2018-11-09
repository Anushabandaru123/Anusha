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


angular.module('Retails.typeaheadOpenOnFocus', [])

.directive('typeaheadOpenOnFocus', function () {
  return {
    require: ['ngModel'],
    link: function (scope, element, attr, ctrls) {
      element.bind('focus', function () {
        ctrls[0].getMatchesAsync(ctrls[0].$viewValue);
        scope.$apply();
      });
    }
  };
})