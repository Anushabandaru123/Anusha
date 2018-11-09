'use strict';

angular.module('daterangepicker.controllers', [])
/**
 * @ngdoc controller
 * @name DashBoardModule.dateRangePickerCtrl
 * @requires $scope
 * @requires $state
 * @requires dashBoard.serviceFactory
 * @description
 * daterangepicker controller performs the static daterange pickers across the all th sreens using Service and broadcasts the events to other modules
 *
 * */


  .controller('dateRangePickerCtrl', ['$scope', '$state', 'serviceFactory', 'dashBoardService', '$http',
    function ($scope, $state, serviceFactory, dashBoardService, $http) {

      if (sessionStorage.user == undefined || sessionStorage.user == null) {
        $state.go('login');
      }


      /**
       * @ngdoc method
       * @name DashBoardModule.dateRangePickerCtrl#daterange
       * @methodOf DashBoardModule.dateRangePickerCtrl
       * @description
       * Invokes serviceFactory and performs statice dateranges
       */


//dateRangePicker for CompareTimePeriod

      function cmpare(start, end) {

        startDate = start;
        endDate = end;

        $scope.ComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Compareenddate = endDate.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.compareTimePeriod = startDate.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');
        $scope.$applyAsync();



      }

      function cmpareTimeInit(start, end) {

        startDate = start;
        endDate = end;
        $scope.ComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Compareenddate = endDate.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.compareTimePeriod = startDate.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');
        $scope.$applyAsync();

      }


//DateRangePicker for ReportTime Period

      var startDate;
      var endDate;

      var end = moment().subtract(17, 'days');
      var start = moment().subtract(19, 'days');

//  var compareEnd=moment(end).subtract(1,'year');
//  var compareStart=moment(start).subtract(1,'year');

      var compareEnd = moment().subtract(20, 'days');
      var compareStart = moment().subtract(22, 'days');

      $scope.comparetimeFunction = function () {
        $('input[name="daterange"]').daterangepicker(
          {
            locale: {
              format: 'MM/DD/YYYY'
            },
            startDate: compareStart,
            endDate: compareEnd
          }, cmpare);

      }
      $scope.comparetimeFunction();
      cmpareTimeInit(compareStart, compareEnd);

      function daterangepickerCallBack(startdate, enddate) {
        $('#reportrange span').html(startdate.format('MM/DD/YYYY') + ' - ' + enddate.format('MM/DD/YYYY'));
        startDate = startdate;
        endDate = enddate;

        // compareEnd=moment(enddate).subtract(1,'year');
        //compareStart=moment(startdate).subtract(1,'year');

        //  cmpareTimeInit(compareStart,compareEnd);
        //  $scope.comparetimeFunction();

        $scope.ReportstartDate = startDate;
        $scope.Reportenddate = endDate;

        $scope.ReportstartDate = startdate.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Reportenddate = enddate.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.ReportTimePeriod = startdate.format('MMM DD YYYY') + '-' + enddate.format('MMM DD YYYY');

      }

      $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        "autoUpdateInput": false,
        ranges: {
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'Quarter 1 (Jan-Mar)': [moment().startOf('year').startOf('month'), moment().startOf('year').add(2, 'month').endOf('month')],
          'Quarter 2 (Apr-jun)': [moment().startOf('year').add(3, 'month').startOf('month'), moment().startOf('year').add(5, 'month').endOf('month')],
          'Quarter 3 (Jul-sep)': [moment().startOf('year').add(6, 'month').startOf('month'), moment().startOf('year').add(8, 'month').endOf('month')]
        }
      }, daterangepickerCallBack);

      daterangepickerCallBack(start, end);

      $scope.List = [];

      dashBoardService.GetStoreList().then(function (response) {
           console.log("is it loading from here");
          for (var i = 0; i < response.data.length; i++) {
            $scope.List.push(response.data[i]);
          }
        }, function (response) {
          console.log(response);

        }
      );

      $scope.getRecord = function () {
      }



    }]);
