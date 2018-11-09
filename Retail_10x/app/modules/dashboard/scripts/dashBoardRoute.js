'use strict';
angular.module('dashBoard.route', [])
  .config(function ($stateProvider, $routeProvider) {
    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
      .state('dashBoard', {
        url: '/dashBoard',
        templateUrl: 'modules/dashboard/views/dashboardNew.html'

      });


  });
