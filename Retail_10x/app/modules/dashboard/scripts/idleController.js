'use strict';

angular.module('idle.controllers', ['ngIdle'])
/**
 * @ngdoc controller
 * @name DashBoardModule.dashBoardController
 * @requires $scope
 * @requires $state
 * @requires dashBoard.serviceFactory
 * @description
 * dashBoard performs the app calls for dashbaord with help of Service and broadcasts the events to other modules
 *
 * */



 .controller('idleCtrl', ['$scope', 'Idle','Keepalive','$uibModal','$state','$timeout','dashBoardService',
  function ($scope, Idle,Keepalive,$uibModal,$state,$timeout,dashBoardService) {

         $scope.started = false;

        // console.log("is it loading....");

      function closeModals() {
        if ($scope.warning) {
          $scope.warning.close();
          $scope.warning = null;
        }

        if ($scope.timedout) {
          $scope.timedout.close();
          $scope.timedout = null;
        }
      }

      $scope.$on('IdleStart', function() {
        closeModals();

     /*   $scope.warning = $uibModal.open({
          templateUrl: 'warning-dialog.html',
          windowClass: 'modal-danger'
        });*/

        angular.element(document).ready(function () {
              angular.element("#timeoutalert").modal('show');

            });


           //$('#timeoutalert').modal('show');


      });

      $scope.$on('IdleEnd', function() {
        closeModals();
      });

      $scope.$on('IdleTimeout', function() {
        //closeModals();

        // $('#timeoutalert').modal('hide');

         angular.element(document).ready(function () {
              angular.element("#timeoutalert").modal('hide');

            });

         sessionStorage.user=null;

         angular.element(document).ready(function () {
              angular.element("#timeout").modal('show');

            });

         //backdrop: 'static'

        // $('#timeout').modal('show');

        /*$scope.timedout = $uibModal.open({
          templateUrl: 'timedout-dialog.html',
          windowClass: 'modal-danger'
        });*/




      });

      //$scope.start = function() {
        closeModals();
        Idle.watch();
        $scope.started = true;
     // };

      $scope.stop = function() {
        closeModals();
        Idle.unwatch();
        $scope.started = false;

      };

      $scope.redirect=function(){
       // closeModals();

        /* $timeout(function () {
          $scope.gotologin();
        }, 0);

         window.location.reload();*/

         //$('#timeout').modal('hide');

         //$('#timeout').modal('hide');


         angular.element(document).ready(function () {
              angular.element("#timeout").modal('hide');

            });
$('body').removeClass('modal-open');
$('.modal-backdrop').remove();

dashBoardService.destroyCache();


        $state.go("login");
      }


       $scope.gotologin= function () {

        window.location.reload();

        $state.go('login');
      //  window.location.reload();



    //    $route.reload();



      }



  }])
 .config(function(IdleProvider, KeepaliveProvider) {
      IdleProvider.idle(900);
      IdleProvider.timeout(10);
      KeepaliveProvider.interval(10);
    });
 
  
   
              
