'use strict';
angular.module('login.route', [])
  .config(function ($stateProvider) {
    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
      .state('login', {
        url: '/login',
        templateUrl: 'modules/login/views/login.html',
        controller: 'loginCtrl'
      });
  });
