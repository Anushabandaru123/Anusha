  'use strict';

  angular.module('dashBoard.controllers', [])
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


   .controller('dashBoardCtrl', ['$scope', '$state', 'serviceFactory', 'dashBoardService', '$http', '$timeout', 'usSpinnerService', '$rootScope','CacheFactory','$filter','couponService','productService',
    function ($scope, $state, serviceFactory, dashBoardService, $http, $timeout, usSpinnerService, $rootScope,CacheFactory,$filter,couponService,productService) {

     
       //console.log("sessionStorage.user ",sessionStorage.user );
       if (sessionStorage.user == undefined || sessionStorage.user == null||sessionStorage.user =="null") {
        $state.go('login');
      }
      $scope.showpiechart = false;
      $scope.departmentSpinner=false;
      $scope.ReportstartDate = "";
      $scope.Reportenddate = "";
      $scope.mfgId=sessionStorage.mfgId;
      $scope.idchart =dashBoardService.generateguid()
      $scope.idchart1 =dashBoardService.generateguid()
      $scope.idchart2 =dashBoardService.generateguid()

        /**
         * @ngdoc method
         * @name DashBoardModule.dashBoardController#dataLogin
         * @methodOf DashBoardModule.dashBoardController
         * @description
         * Invokes serviceFactory and performs authentication
         */
        //SalesPerformanceByAllstores
        $scope.spinneractive = false;

        $rootScope.$on('us-spinner:spin', function (event, key) {
          $scope.spinneractive = true;
        });

        $rootScope.$on('us-spinner:stop', function (event, key) {
          $scope.spinneractive = false;
        });

        $scope.showspinner = function () {
          $scope.spin=true;
          if (!$scope.spinneractive) {
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }
        }

        $scope.hidespinner = function () {
          $scope.spin=false;
          $scope.spinneractive = true;
          //console.log('coming ???');
          if($scope.spinneractive) {
            usSpinnerService.stop('spinner-1');
          }
        }
        if($scope.spinneractive){
         $scope.hidespinner();
       }

            //salesperformancebycomparetimeforallstores
            $scope.salesperformancebycomparetimeforAllStores=function(){

             var compareTimedata = {
               "aggTimeUnit": "1d",
               "startTime": $scope.SalesDataComparestartDate,
               "endTime": $scope.Compareenddate,
               "bucketLevel": "S"
             }
        // $scope.SalesPerformance = false;

        dashBoardService.GetSalesPerformance(compareTimedata).then(function (response) {
          // console.log("GetSalesPerformance response.....",response);
         $scope.spIndextotal = parseFloat(response.data.total);
         if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
           $scope.spIndex = 0;
         }
         else {
           $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
           $scope.spIndex = $scope.spIndex.toFixed(2);
         }
         $scope.$applyAsync();
               //dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
              // dashBoardService.setcacheData('spIndex',$scope.spIndex);
              dashBoardService.setcacheData('total',response.data.total);
              // $scope.SalesPerformance = true;
            }, function (response) {
             console.log(response);
           }
           );
      }


        $scope.SalesPerformanceByRetailer = function () {
          $scope.SalesPerformancespinner=true;
          $scope.SalesPerformanceByRetailerbyRT = function () {
            $scope.SalesPerformance = false;
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate
            }
            dashBoardService.GetSalesPerformance(data).then(function (response) {
            $scope.total =  response.data.total;
            if($scope.total){
             $filter('number')($scope.total, $scope.total.length)
            }
              $scope.rpIndextotal = parseFloat(response.data.total);
              if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
                // console.log("rp index total...",$scope.rpIndextotal);
                $scope.spIndex = 0;
              }
              else {
                 //console.log("rp index total...",$scope.rpIndextotal);
                $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
                $scope.spIndex = $scope.spIndex.toFixed(2);
              }
             // console.log("spindex...",$scope.spIndex );
              if(isNaN($scope.spIndex)){
                $scope.spIndex =0.00;
                $scope.spIndex = $scope.spIndex.toFixed(2);
              }
              $scope.salesperformanceId = dashBoardService.generateguid();
              $scope.LineChartData1 = [];
              $scope.j=1;
              if(response.data.data==undefined||$scope.Cpdata==undefined){
                 $scope.SalesPerformancespinner=false;
              }
        for(var i=0;i<response.data.data.length;i++) {
            if(i==0){
          $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
          $scope.ResultDate=$scope.date;
          $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
          $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
          $scope.ResultDate=$scope.nextDate;
          $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
          $scope.j++;
        }

        if(response.data.data&&$scope.Cpdata){
        if(response.data.data[i]&&$scope.Cpdata[i]){

                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if($scope.Cpdata[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": $scope.Cpdata[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
              }
              $scope.SalesPerformance = true;
              dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
              dashBoardService.setcacheData('spIndex',$scope.spIndex);
              dashBoardService.setcacheData('total',response.data.total);
              $scope.SalesPerformancespinner=false;

            }, function (response) {
              console.log(response);
              $scope.LineChartData1 = [];
            }
            );
          }
          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate

          }
          dashBoardService.GetSalesPerformance(data).then(function (response) {
            $scope.spIndextotal = parseFloat(response.data.total);
                    $scope.Cpdata=response.data.data;
            $scope.SalesPerformanceByRetailerbyRT();
          }, function (response) {
            console.log(response);
          }
          );
        }

        $scope.currencyDetail="$";
        $scope.currencydetailforshoppingtrips="";
        $scope.SalesPerformanceByRetailerforcpg = function () {
        $scope.SalesPerformancespinner=true;
        $scope.SalesPerformanceByRetailerbyRT = function () {
          $scope.SalesPerformance =false;
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "filters" :{
              "item.mfgId" : [$scope.mfgId]
              }
            }
            dashBoardService.GetSalesPerformance(data).then(function (response) {
              $scope.total =  response.data.total;
              if($scope.total){
              $filter('number')($scope.total, $scope.total.length)
             }
              $scope.rpIndextotal = parseFloat(response.data.total);
              if($scope.spIndextotal ==0||$scope.spIndextotal == null) {
                $scope.spIndex = 0;
              }
              else {
                $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
                $scope.spIndex = $scope.spIndex.toFixed(2);
              }
              if(isNaN($scope.spIndex)){
                $scope.spIndex =0.00;
                $scope.spIndex = $scope.spIndex.toFixed(2);
              }
              $scope.salesperformanceId = dashBoardService.generateguid();
              $scope.LineChartData1 = [];
              if(response.data.data==undefined||$scope.Cpdata==undefined){
              $scope.SalesPerformancespinner=false;
              }
             $scope.j=1;
            for(var i=0;i<response.data.data.length;i++) {
            if(i==0){
            $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
            $scope.ResultDate=$scope.date;
            $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
            else{
            $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
            $scope.ResultDate=$scope.nextDate;
            $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
            $scope.j++;
             }
          if(response.data.data&&$scope.Cpdata){
          if(response.data.data[i]&&$scope.Cpdata[i]){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if($scope.Cpdata[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": $scope.Cpdata[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
              }
              $scope.$applyAsync();
              $scope.SalesPerformance = true;
              dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
              dashBoardService.setcacheData('spIndex',$scope.spIndex);
              dashBoardService.setcacheData('total',response.data.total);
              $scope.SalesPerformancespinner=false;
            }, function (response) {
              console.log(response);
              $scope.LineChartData1 = [];
            }
            );
          }
          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "filters" :{
              "item.mfgId" : [$scope.mfgId]
            }
          }
          dashBoardService.GetSalesPerformance(data).then(function (response) {
            $scope.spIndextotal = parseFloat(response.data.total);
            $scope.Cpdata=response.data.data;
            $scope.SalesPerformanceByRetailerbyRT();
          }, function (response) {
            console.log(response);
          }
          );
        }

        $scope.SalesPerformanceByStoreId = function () {
        $scope.SalesPerformancespinner=true;
        $scope.SalesPerformanceByStoreIdbyRT = function () {
        $scope.SalesPerformance = false;
        var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate
            }
        dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
        $scope.total =  response.data.total;
        if($scope.total){
        $filter('number')($scope.total, $scope.total.length)
        }
        $scope.rpIndextotal = parseFloat(response.data.total);
        if($scope.spIndextotal==0||$scope.spIndextotal==null) {
          $scope.spIndex = 0;
      }
      else {
        $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
        $scope.spIndex = $scope.spIndex.toFixed(2);
       }
      if(isNaN($scope.spIndex)){
        $scope.spIndex =0.00;
        $scope.spIndex = $scope.spIndex.toFixed(2);
      }
        $scope.salesperformanceId = dashBoardService.generateguid();
        $scope.LineChartData1 = [];
      if(response.data.data==undefined||$scope.Cpdata==undefined){
        $scope.SalesPerformancespinner=false;
      }
        $scope.j=1;
      for (var i=0;i<response.data.data.length;i++) {
      if(i==0){
      $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
      $scope.ResultDate=$scope.date;
      $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if($scope.Cpdata[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": $scope.Cpdata[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
              }
              $scope.$applyAsync();
              $scope.SalesPerformance = true;
              dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
              dashBoardService.setcacheData('spIndex',$scope.spIndex);
              dashBoardService.setcacheData('total',response.data.total);
          $scope.SalesPerformancespinner=false;
            }, function (response) {
              console.log(response);
              $scope.LineChartData1 = [];
            }
            );
          }
          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
          }
          dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
            $scope.spIndextotal = parseFloat(response.data.total);
            $scope.Cpdata=response.data.data;
            $scope.SalesPerformanceByStoreIdbyRT();
          }, function (response) {
            console.log(response);
          }
          );
        }
  //ShoppingTrips api calls
  $scope.ShoppingTripsFunction = function () {
    $scope.ShoppingTripsspinner=true;
    $scope.ShoppingTripsbyRT = function () {
      var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate
      }
      $scope.ShoppingTrips = false;
      dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
        $scope.shoppingtripsId = dashBoardService.generateguid();
        $scope.ShoppingTripsTotal = response.data.total;
        if($scope.ShoppingTripsTotal){
          $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
        }
        $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
        if($scope.ShoppingTripsCPindex==0||$scope.ShoppingTripsCPindex == null) {
           $scope.stIndex = 0;
        }
        else{
           $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
           $scope.stIndex = $scope.stIndex.toFixed(2);
        }
        if(isNaN($scope.stIndex)){
           $scope.stIndex =0.00;
           $scope.stIndex = $scope.stIndex.toFixed(2);
        }

        $scope.ShoppingTripsLineChartData1 = [];
        $scope.LineChartData2 = [];
        $scope.j=1;
        if(response.data.data==undefined||$scope.shoppintripsCpData==undefined){
        $scope.ShoppingTripsspinner=false;
        }
        for(var i=0;i<response.data.data.length;i++) {
        if(i==0){
          $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
          $scope.ResultDate=$scope.date;
          $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
        }
        else{
            $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
            $scope.ResultDate=$scope.nextDate;
            $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
            $scope.j++;
             }
        if(response.data.data&&$scope.shoppintripsCpData){
        if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
        var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].count,
                  "value2": $scope.shoppintripsCpData[i].count,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
              else if(response.data.data[i]){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].count,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.shoppintripsCpData[i].count,
                  "id": $scope.shoppintripsCpData[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].count,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
              }
              $scope.$applyAsync();
              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);
              $scope.ShoppingTripsspinner=false;
            }, function (response) {
              console.log(response);
              $scope.LineChartData2 = [];
            }
            );
    }
    var ShoppingTripsdata = {
      "aggTimeUnit": "1d",
      "startTime": $scope.ComparestartDate,
      "endTime": $scope.Compareenddate
    }
    dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
      $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
      $scope.shoppintripsCpData=response.data.data;

      $scope.ShoppingTripsbyRT();
    }, function (response) {
      console.log(response);
    }
    );
  }

  $scope.GetShoppingTripsByStoreId = function () {
    $scope.ShoppingTripsspinner=true;
    $scope.ShoppingTripsStoreidbyRT = function () {
      var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate
      }
      $scope.ShoppingTrips = false;
      dashBoardService.GetShoppingTripsByStoreId(ShoppingTripsdata).then(function (response) {
        $scope.shoppingtripsId = dashBoardService.generateguid();
        $scope.ShoppingTripsTotal = response.data.total;
        if($scope.ShoppingTripsTotal){
         $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
        }
        $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
        if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
          $scope.stIndex = 0;
        }
        else {
          $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
          $scope.stIndex = $scope.stIndex.toFixed(2);
        }
      if(isNaN($scope.stIndex)){
          $scope.stIndex =0.00;
          $scope.stIndex = $scope.stIndex.toFixed(2);
      }
        $scope.ShoppingTripsLineChartData1 = [];
        $scope.LineChartData2 = [];
        $scope.j=1;
        $scope.j=1;
    if(response.data.data==undefined||$scope.shoppintripsCpData==undefined){
        $scope.ShoppingTripsspinner=false;
    }
    for (var i =0;i<response.data.data.length;i++) {
    if(i==0){
        $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
        $scope.ResultDate=$scope.date;
        $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
    }
    else{
        $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
        $scope.ResultDate=$scope.nextDate;
        $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
        $scope.j++;
    }
    if(response.data.data&&$scope.shoppintripsCpData){
    if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
              var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].count,
                  "value2": $scope.shoppintripsCpData[i].count,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
              else if(response.data.data[i]){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].count,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.shoppintripsCpData[i].count,
                  "id": $scope.shoppintripsCpData[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].count,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
              }
        
        $scope.$applyAsync();
        $scope.ShoppingTrips = true;
        dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
        dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
        dashBoardService.setcacheData('stIndex',$scope.stIndex);
        $scope.ShoppingTripsspinner=false;
      }, function (response) {
        console.log(response);
        $scope.LineChartData2 = [];
      }
      );
    }
    var ShoppingTripsdata = {
      "aggTimeUnit": "1d",
      "startTime": $scope.ComparestartDate,
      "endTime": $scope.Compareenddate,
    }
    dashBoardService.GetShoppingTripsByStoreId(ShoppingTripsdata).then(function (response) {
      $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
      $scope.shoppintripsCpData=response.data.data;
      $scope.ShoppingTripsStoreidbyRT();
    }, function (response) {
      console.log(response);
    }
    );

        }//end shopping trips api calls
  //avgBasket api calls
  $scope.avgBasketFunction = function () {
    $scope.AvgBasketspinner=true;
    $scope.avgBasketByRT = function () {
      var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate
      }
      $scope.AvgBasket = false;
      dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
        $scope.AvgBasketId = dashBoardService.generateguid();
        $scope.LineChartData3 = [];
        if(response.data.stats){
         $scope.avgBasketTotal = response.data.stats.avg;
        }
        if(response.data.stats==undefined){
          $scope.AvgBasketspinner=false;
        }
        if($scope.avgBasketTotal){
          $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
          $scope.avgBasketTotal=$scope.avgBasketTotal.toFixed(2);
        }
        $scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
        if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
           $scope.ABtotal =0.00;
          $scope.ABtotal = $scope.ABtotal.toFixed(2);
        }
        else {
          $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
          $scope.ABtotal = $scope.ABtotal.toFixed(2);
        }
        if(isNaN($scope.ABtotal)){
          $scope.ABtotal =0.00;
          $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }
        $scope.j=1;
        if(response.data.data==undefined||$scope.avgBasketDataByCP==undefined){
        $scope.AvgBasketspinner=false;
        }
        for (var i = 0; i < response.data.data.length; i++) {
        if(i==0){
          $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
          $scope.ResultDate=$scope.date;
          $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
        }
        else{
          $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
          $scope.ResultDate=$scope.nextDate;
          $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
          $scope.j++;
             }
          if(response.data.data&&$scope.avgBasketDataByCP){
          if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
          if($scope.avgBasketDataByCP[i].stats.avg!=null){
          if(response.data.data[i].stats.avg!=null){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].stats.avg.toFixed(2),
            "value2": $scope.avgBasketDataByCP[i].stats.avg.toFixed(2),
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
              }
            }
            }
          else if(response.data.data[i]){
           if(response.data.data[i].stats.avg){
             var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].stats.avg.toFixed(2),
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
           }
            }
            else if($scope.avgBasketDataByCP[i]){
          var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].stats.avg.toFixed(2),
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
          else{
          if(response.data.data[i]){
          if(response.data.data[i].stats.avg){
             var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].stats.avg.toFixed(2),
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
        }
         }
        }
        }
        $scope.$applyAsync();
        $scope.AvgBasket = true;
        dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
        dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
        dashBoardService.setcacheData('ABtotal',$scope.ABtotal);
        $scope.AvgBasketspinner=false;
      }, function (response) {
        console.log(response);
          $scope.LineChartData3 = [];
      }
      );
    }

    var ShoppingTripsdata = {
      "aggTimeUnit": "1d",
      "startTime": $scope.ComparestartDate,
      "endTime": $scope.Compareenddate
    }
    dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
      if(response.data.stats){
       $scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
      }
      else{
         $scope.avgBasketTotalByCP=0;
      }
      $scope.avgBasketDataByCP=response.data.data;
      $scope.avgBasketByRT();
    }, function (response) {
      $scope.AvgBasketspinner=false;
      $scope.LineChartData3 = [];
      console.log(response);
    }
    );
  }


  $scope.GetAvgBasketByStoreId = function () {
    $scope.AvgBasketspinner=true;
    $scope.GetAvgBasketByStoreIdByRT = function () {
      var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate
      }
      $scope.AvgBasket = false;
      dashBoardService.GetAvgBasketByStoreId(ShoppingTripsdata).then(function (response) {
        $scope.AvgBasketId = dashBoardService.generateguid();
            $scope.LineChartData3 = [];
        if(response.data.stats){
                  $scope.avgBasketTotal = response.data.stats.avg;
        }
        if(response.data.stats==undefined){
          $scope.AvgBasketspinner=false;
        }
    if($scope.avgBasketTotal){
      $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
      $scope.avgBasketTotal=$scope.avgBasketTotal.toFixed(2);
      }
    $scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
    if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
         $scope.ABtotal =0.00;
          $scope.ABtotal = $scope.ABtotal.toFixed(2);
    }
    else {
          $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
          $scope.ABtotal = $scope.ABtotal.toFixed(2);
        }
      if(response.data.data==undefined||$scope.avgBasketDataByCP==undefined){
                 $scope.AvgBasketspinner=false;
        }
        $scope.j=1;
    for (var i =0;i<response.data.data.length;i++) {
        if(i==0){
          $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
          $scope.ResultDate=$scope.date;
          $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
        }
       else{
       $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
       $scope.ResultDate=$scope.nextDate;
        $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
        $scope.j++;
        }
      if(response.data.data&&$scope.avgBasketDataByCP){
      if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
      if(response.data.data[i].stats.avg!=null&&$scope.avgBasketDataByCP[i].stats.avg!=null){
            var object = { 
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].stats.avg.toFixed(2),
            "value2": $scope.avgBasketDataByCP[i].stats.avg.toFixed(2),
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
        }
        }
        else if(response.data.data[i]){
        if(response.data.data[i].stats.avg){
        var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].stats.avg.toFixed(2),
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
        }
        }
        else if($scope.avgBasketDataByCP[i]){
        var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].stats.avg.toFixed(2),
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
        }
        }
        else{
        if(response.data.data[i]){
        if(response.data.data[i].stats.avg){
        var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].stats.avg.toFixed(2),
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
        }
        }
        }
        }
       
        $scope.$applyAsync();
        $scope.AvgBasket = true;
        dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
        dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
        dashBoardService.setcacheData('ABtotal',$scope.ABtotal);
        $scope.AvgBasketspinner=false;
      }, function (response) {
        console.log(response);
         $scope.LineChartData3 = [];
      }
      );
    }
    var ShoppingTripsdata = {
      "aggTimeUnit": "1d",
      "startTime": $scope.ComparestartDate,
      "endTime": $scope.Compareenddate,
    }
    dashBoardService.GetAvgBasketByStoreId(ShoppingTripsdata).then(function (response) {
      if(response.data.stats){
      $scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
       }
      $scope.avgBasketDataByCP=response.data.data;
      $scope.GetAvgBasketByStoreIdByRT();
    }, function (response) {
      console.log(response);
      $scope.AvgBasketspinner=false;
    }
    );
    }//end of avgBasket api calls
  //top products api call
  sessionStorage.productsSize=5;
  sessionStorage.salesdatasize=5;
  $scope.noTopProductsLabel=false;
  $scope.topProductsFunction = function () {
      $scope.TopProductsspinner=true;
      sessionStorage.sortByValue="amt-desc";
        var data = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "upc"
        }
        $scope.TopProducts = false;
        dashBoardService.getbestsellersByRetailer(data).then(function (response) {
         // console.log("getbestselleres",response);
          $scope.topProductsbyRT = response.data.data;
          $scope.topproductsId = dashBoardService.generateguid();
          $scope.barChartData = [];
          $scope.upcsforcomparetime=[];
           if($scope.topProductsbyRT.length>0){
          for (var i=0;i<5;i++) {
               $scope.upcsforcomparetime.push($scope.topProductsbyRT[i].id);
            }
          }
          $scope.TopProductsbyComparetime($scope.upcsforcomparetime);
              }, function (response) {
                console.log(response);
              }
              );
  
$scope.TopProductsbyComparetime = function (upcs) {
  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
    "filters": {
    "items.upc" : upcs
    }
  }
  dashBoardService.GetSalesPerformance(data).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    //$scope.TopProductsbyReportTime();
    if($scope.topProductsbyRT==undefined||$scope.topProductsbyCT==undefined){
              $scope.TopProductsspinner=false;
          }
         if($scope.topProductsbyRT.length==0){
            $scope.noTopProductsLabel=true;
          }
          //console.log("response...",response);
        //  console.log("department list...",$scope.departmentList);
          dashBoardService.settopproductsmaxvalue(0);
          for (var i = 0; i < 5; i++) {
          $scope.indexvalue=0.00;
          $scope.generatedId = dashBoardService.generateguid();
          if($scope.topProductsbyRT[i]){
          var results = $filter('filter')($scope.topProductsbyCT,{id : $scope.topProductsbyRT[i].id}, true);
          var departmentFound=$filter('filter')($scope.departmentList,{departmentNumber:parseInt($scope.topProductsbyRT[i].deptId)});
         // console.log("department found...",departmentFound);
          //console.log("departmentList...",$scope.departmentList);
          //console.log("item...",$scope.topProductsbyRT[i]);
          if(results){
          if(results.length>0){
          if(results[0].amt>=0){
            $scope.indexvalue = $scope.topProductsbyRT[i].amt / results[0].amt;
            $scope.indexvalue=$scope.indexvalue.toFixed(2);
          }
          if($scope.indexvalue>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
          }
          else{
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
          }
          var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
          var amt1=(results[0].amt>=0)?results[0].amt:0;
          var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
          var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
          var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }
          var object = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.productName,
                          "reporttime":$scope.totalreporttime,
                          "comapretime":$scope.totalcomparetime,
                          "Index":$scope.indexvalue,
                          "itemNumber":$scope.topProductsbyRT[i].upc,
                          "deptId":$scope.topProductsbyRT[i].deptId,
                          "deptName": departmentFound[0].departmentDescription,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "quantityRP":$scope.topProductsbyRT[i].soldQuantity+" ("+$scope.topProductsbyRT[i].size+")",
                          "msuRP":$scope.topProductsbyRT[i].msu,
                          "quantityCP":results[0].soldQuantity+" ("+results[0].size+")",
                          "msuCP":results[0].msu,
                          "lastsoldDateRP":lastsoldDateRP,
                          "lastsoldDateCP":lastsoldDateCP
                        };
            var barchartobject={
                    "data":[object],
                    "chartid":$scope.generatedId
                  }
                $scope.barChartData.push(object);
            }
            else{
                var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
                var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
                var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }
                var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.productName,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.topProductsbyRT[i].upc,
                        "deptId":$scope.topProductsbyRT[i].deptId,
                        "deptName": departmentFound[0].departmentDescription,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow,
                        "quantityRP":$scope.topProductsbyRT[i].soldQuantity+" ("+$scope.topProductsbyRT[i].size+")",
                        "msuRP":$scope.topProductsbyRT[i].msu,
                        "lastsoldDateRP":lastsoldDateRP,
                        "lastsoldDateCP":0
                      };
                      var barchartobject={
                          "data":object,
                          "chartid":$scope.generatedId
                        }
                        $scope.barChartData.push(object);
                      }
                    }
                      else{
              var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
              var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
                  $scope.labelcolor="red";
                  $scope.arrow="\u2193";
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }
              var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.productName,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.topProductsbyRT[i].upc,
                        "deptId":$scope.topProductsbyRT[i].deptId,
                        "deptName": departmentFound[0].departmentDescription,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow,
                        "quantityRP":$scope.topProductsbyRT[i].soldQuantity+" ("+$scope.topProductsbyRT[i].size+")",
                        "msuRP":$scope.topProductsbyRT[i].msu,
                        "lastsoldDateRP":lastsoldDateRP,
                        "lastsoldDateCP":0
                      };
                      var barchartobject={
                          "data":object,
                          "chartid":$scope.generatedId
                        }
                        $scope.barChartData.push(object);
                    }
                  }
                }
                $scope.$applyAsync();
                $scope.TopProducts = true;
                $scope.TopProductsspinner=false;
                dashBoardService.setcacheData('barChartData',$scope.barChartData);
  }, function (response) {
    console.log(response);
  }
  );
}
  }

  $scope.worstsellersbyretailer=function(){
        $scope.worstsalesspinner=true;
        sessionStorage.sortByValue="amt-asc";
     $scope.worstsellersbyRT = function () {
        var data = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "name"
        }
        $scope.worstsellers = false;
        dashBoardService.getworstselleres(data).then(function (response) {
          $scope.worstproductsbyRT = response.data.data;
          $scope.worstsellersId = dashBoardService.generateguid();
          $scope.worstsellersdata = [];
          if($scope.worstproductsbyRT==undefined||$scope.worstProductsbyCT==undefined){
          $scope.worstsalesspinner=false;
          }
          if($scope.worstproductsbyRT.length==0){
          $scope.noTopProductsLabel=true;
          }
          dashBoardService.setworstsellersmaxvalue(0);
          for (var i =0;i<5;i++) {
            $scope.indexvalue=0.00;
          if($scope.worstproductsbyRT[i]){
          var results =$filter('filter')($scope.worstProductsbyCT,{id : $scope.worstproductsbyRT[i].id}, true);
          var departmentFound=$filter('filter')($scope.departmentList,{departmentNumber:parseInt($scope.worstproductsbyRT[i].deptId)});
          if(results){
          if(results.length>0){
          if(results[0].amt){
            $scope.indexvalue = $scope.worstproductsbyRT[i].amt / results[0].amt;
            $scope.indexvalue=$scope.indexvalue.toFixed(2);
          }
          if($scope.indexvalue>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
         }
         else{
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
        }
          var amt=$scope.worstproductsbyRT[i].amt;
          var amt1=results[0].amt;
          var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                        var object = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":-amt,
                          "value1":-amt1,
                          'storename': $scope.worstproductsbyRT[i].id,
                          "reporttime":$scope.totalreporttime,
                          "comapretime":$scope.totalcomparetime,
                          "Index":$scope.indexvalue,
                          "itemNumber":$scope.worstproductsbyRT[i].upc,
                          "deptId":$scope.worstproductsbyRT[i].deptId,
                          "deptName": departmentFound[0].departmentDescription,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                        $scope.worstsellersdata.push(object);
                      }
                      else{
                      var amt=$scope.worstproductsbyRT[i].amt;
                       var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                       $scope.labelcolor="red";
                       $scope.arrow="\u2193";
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":-amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": departmentFound[0].departmentDescription,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow
                      };
                        $scope.worstsellersdata.push(object);
                      }
                    }
                      else{
                       var amt=$scope.worstproductsbyRT[i].amt;
                       var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                       $scope.labelcolor="red";
                       $scope.arrow="\u2193";
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":-amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": departmentFound[0].departmentDescription,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow
                      };
                        $scope.worstsellersdata.push(object);
                    }
                  }
                }
           // console.log("worst sellers chart data...",$scope.worstsellersdata);
                $scope.$applyAsync();
                $scope.worstsellers = true;
                $scope.worstsalesspinner=false;
                dashBoardService.setcacheData('worstsellersdata',$scope.worstsellersdata);
              }, function (response) {
                console.log(response);
              }
              );
  }
  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "name"
  }
  dashBoardService.getworstselleres(data).then(function (response) {
    $scope.worstProductsbyCT = response.data.data;
    $scope.worstsellersbyRT();
  }, function (response) {
    console.log(response);
  }
  );

  }

  $scope.worstsellersbystore=function(){
   $scope.worstsalesspinner=true;
        sessionStorage.sortByValue="amt-asc";
     $scope.worstsellersbyRTforstore = function () {
        var data = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "name"
        }
        $scope.worstsellers = false;
        dashBoardService.getworstselleresbystore(data).then(function (response) {
          $scope.worstproductsbyRT = response.data.data;
          $scope.worstsellersId = dashBoardService.generateguid();
          $scope.worstsellersdata = [];
          if($scope.worstproductsbyRT==undefined||$scope.worstProductsbyCT==undefined){
            $scope.worstsalesspinner=false;
          }
          if($scope.worstproductsbyRT.length==0){
            $scope.noTopProductsLabel=true;
          }
          dashBoardService.setworstsellersmaxvalue(0);
                //console.log("response...",response.data);
               // console.log("department List....",$scope.departmentList);
          for (var i =0;i<5;i++) {
            $scope.indexvalue=0.00;
          if($scope.worstproductsbyRT[i]){
              var results = $filter('filter')($scope.worstProductsbyCT,{id : $scope.worstproductsbyRT[i].id}, true);
              var departmentFound=$filter('filter')($scope.departmentList,{departmentNumber:parseInt($scope.worstproductsbyRT[i].deptId)});
                  // console.log("department found..",departmentFound);
          if(results){
          if(results.length>0){
          if(results[0].amt){
            $scope.indexvalue = $scope.worstproductsbyRT[i].amt / results[0].amt;
            $scope.indexvalue=$scope.indexvalue.toFixed(2);
          }
          if($scope.indexvalue>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191"
          }
          else{
            $scope.labelcolor="red";
            $scope.arrow="\u2193"
         }
        var amt=$scope.worstproductsbyRT[i].amt;
        var amt1=results[0].amt;
        var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
        var object = {
                      "color": "#4C98CF",
                      "color1": "#7F2891",
                      "amt": $filter('number')(amt,2),
                      "amt1":$filter('number')(amt1,2),
                      "value":-amt,
                      "value1":-amt1,
                      'storename': $scope.worstproductsbyRT[i].id,
                      "reporttime":$scope.totalreporttime,
                      "comapretime":$scope.totalcomparetime,
                      "Index":$scope.indexvalue,
                      "itemNumber":$scope.worstproductsbyRT[i].upc,
                      "deptId":$scope.worstproductsbyRT[i].deptId,
                      "deptName": departmentFound[0].departmentDescription,
                      "labelcolor":$scope.labelcolor,
                      "arrow":$scope.arrow
                        };
                        $scope.worstsellersdata.push(object);
                      }
                      else{
                      var amt=$scope.worstproductsbyRT[i].amt;
                       var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                       $scope.labelcolor="red";
                      $scope.arrow="\u2193"
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":-amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": departmentFound[0].departmentDescription,
                        "labelcolor":$scope.labelcolor,
                         "arrow":$scope.arrow
                      };
                        $scope.worstsellersdata.push(object);
                      }
                    }
                      else{
                       var amt=$scope.worstproductsbyRT[i].amt;
                       var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                       $scope.labelcolor="red";
                       $scope.arrow="\u2193"
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":-amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": departmentFound[0].departmentDescription,
                        "labelcolor":$scope.labelcolor,
                         "arrow":$scope.arrow
                      };
                        $scope.worstsellersdata.push(object);
                    }
                  }
                }
               // console.log("bar chart data...",$scope.worstsellersdata);
                $scope.$applyAsync();
                $scope.worstsellers = true;
                $scope.worstsalesspinner=false;
                dashBoardService.setcacheData('worstsellersdata',$scope.worstsellersdata);
              }, function (response) {
                console.log(response);
              }
              );
  }
  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "name"
  }
  dashBoardService.getworstselleresbystore(data).then(function (response) {
    $scope.worstProductsbyCT = response.data.data;
    $scope.worstsellersbyRTforstore();
  }, function (response) {
    console.log(response);
  }
  );
  }

  $scope.TopProductsByStoreId = function () {
    $scope.TopProductsspinner=true;
        var data = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "upc"
        }
        $scope.TopProducts = false;
        dashBoardService.getbestsellersByStore(data).then(function (response) {
          $scope.topProductsbyRT=null;
          $scope.topProductsbyRT = response.data.data;
          $scope.topproductsId = dashBoardService.generateguid();
          $scope.barChartData = [];
          $scope.upcsforcomparetime=[];
          for (var i=0;i<5;i++) {
          $scope.upcsforcomparetime.push($scope.topProductsbyRT[i].id);
          }
          $scope.TopProductsbyComparetimeforstore($scope.upcsforcomparetime);
              }, function (response) {
                console.log(response);
              }
              );
  $scope.TopProductsbyComparetimeforstore = function (upcs) {
  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
    "filters": {
    "items.upc" : upcs
     }
     }
  dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
   $scope.topProductsbyCT=null;
   $scope.topProductsbyCT = response.data.data;
   if($scope.topProductsbyRT==undefined||$scope.topProductsbyCT==undefined){
   $scope.TopProductsspinner=false;
   }
   for (var i =0;i<5;i++) {
        $scope.indexvalue=0.00;
        $scope.generatedId = dashBoardService.generateguid();
        dashBoardService.settopproductsmaxvalue(0);
        if($scope.topProductsbyRT[i]){
        var results = $filter('filter')($scope.topProductsbyCT,{id : $scope.topProductsbyRT[i].id}, true);
        var departmentFound=$filter('filter')($scope.departmentList,{departmentNumber:parseInt($scope.topProductsbyRT[i].deptId)});
        if(results){
        if(results.length>0){
        if(results[0].amt>=0){
          $scope.indexvalue = $scope.topProductsbyRT[i].amt / results[0].amt;
          $scope.indexvalue=$scope.indexvalue.toFixed(2);
        }
       if($scope.indexvalue>=1){
          $scope.labelcolor="green";
          $scope.arrow="\u2191";
        }
       else{
          $scope.labelcolor="red";
          $scope.arrow="\u2193";
      }
        var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
        var amt1=(results[0].amt>=0)?results[0].amt:0;
        var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
        var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
        var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
        if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }
                        var object = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.productName,
                          "reporttime":$scope.totalreporttime,
                          "comapretime":$scope.totalcomparetime,
                          "Index":$scope.indexvalue,
                          "itemNumber":$scope.topProductsbyRT[i].upc,
                          "deptId":$scope.topProductsbyRT[i].deptId,
                          "deptName": departmentFound[0].departmentDescription,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "quantityRP":$scope.topProductsbyRT[i].soldQuantity+" ("+$scope.topProductsbyRT[i].size+")",
                          "msuRP":$scope.topProductsbyRT[i].msu,
                          "quantityCP":results[0].soldQuantity+" ("+results[0].size+")",
                          "msuCP":results[0].msu,
                          "lastsoldDateRP":lastsoldDateRP,
                          "lastsoldDateCP":lastsoldDateCP

                        };
                        $scope.barChartData.push(object);
                      }
                      else{
             var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
             var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
             var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
            $scope.labelcolor="red";
            if($scope.topProductsbyRT[i].name){
            if($scope.topProductsbyRT[i].name!=""){
             $scope.productName=$scope.topProductsbyRT[i].name;
            }
            else{
             $scope.productName=$scope.topProductsbyRT[i].id;
            }
            }
            else{
            $scope.productName=$scope.topProductsbyRT[i].id;
             }
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.productName,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.topProductsbyRT[i].upc,
                        "deptId":$scope.topProductsbyRT[i].deptId,
                        "deptName": departmentFound[0].departmentDescription,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow,
                        "quantityRP":$scope.topProductsbyRT[i].soldQuantity+" ("+$scope.topProductsbyRT[i].size+")",
                        "msuRP":$scope.topProductsbyRT[i].msu,
                        "lastsoldDateRP":lastsoldDateRP,
                        "lastsoldDateCP":0
                      };
                        $scope.barChartData.push(object);
                      }
                    }
            else{
            var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
            var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
            var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
            $scope.labelcolor="red";
            if($scope.topProductsbyRT[i].name){
            if($scope.topProductsbyRT[i].name!=""){
             $scope.productName=$scope.topProductsbyRT[i].name;
            }
            else{
             $scope.productName=$scope.topProductsbyRT[i].id;
            }
            }
            else{
            $scope.productName=$scope.topProductsbyRT[i].id;
             }
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.productName,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.topProductsbyRT[i].upc,
                        "deptId":$scope.topProductsbyRT[i].deptId,
                        "deptName": departmentFound[0].departmentDescription,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow,
                        "quantityRP":$scope.topProductsbyRT[i].soldQuantity+" ("+$scope.topProductsbyRT[i].size+")",
                        "msuRP":$scope.topProductsbyRT[i].msu,
                        "lastsoldDateRP":lastsoldDateRP,
                        "lastsoldDateCP":0
                      };
                        $scope.barChartData.push(object);
                    }
                  }
                }
                $scope.TopProducts = true;
                $scope.TopProductsspinner=false;
                dashBoardService.setcacheData('barChartData',$scope.barChartData);
               }, function (response) {
                 console.log(response);
                 }
                 );
                }
               }

  //top departments api calls

  $scope.arrangeDepartmentchartData=function(data){
    for(var i=0;i<data.length;i++){
      for(var j=0;j<$scope.departmentList.length;j++){
        if(data[i].storename==$scope.departmentList[j].departmentDescription){
          data[i].id=$scope.departmentList[j].departmentNumber;
        }
      }
    }

    $scope.$applyAsync();
    $scope.showpiechart = true;

    var donutindex={
      'index':$scope.donutchartindex,
      'color':$scope.indexcolor
    }
    //console.log("top departments data...",$scope.showpiechart);
    dashBoardService.setdonutchartindex(donutindex);
    dashBoardService.setcacheData('topdepartmentsData',$scope.topdepartmentsData);
  }


  $scope.TopDepartments = function () {
    $scope.showpiechartspinner=true;
    $scope.topdeptsByReportTime = function () {
      var RTdonutChartData = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataReportstartDate,
        "endTime": $scope.Reportenddate,
        "bucketLevel": "L",
        "bucketType": "deptName"
      }
      $scope.showpiechart = false;
      dashBoardService.GethundredDepartments(RTdonutChartData).then(function (response) {
        $scope.topdepartmentsData = [];
        $scope.topdepartmentsId = dashBoardService.generateguid();
        $scope.topDepartmentsDatabyRP=response.data.data;
        //console.log("response by RT....",$scope.topDepartmentsDatabyRP);
        $scope.donutcharttotalbyRT=response.data.total;
        if($scope.donutcharttotal>0){
           $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;
           $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
        }
        else{
            $scope.donutchartindex=0.00;
            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
              }
          // console.log("donut chart index....",$scope.donutchartindex);
        if($scope.donutchartindex>=1){
          $scope.indexcolor="green";
        }
        else{
          $scope.indexcolor="red";
        }
        if($scope.topDepartmentsDatabyRP==undefined||$scope.topDepartmentsDatabyCP==undefined){
          $scope.showpiechartspinner=false;
        }
        for (var i =0;i<$scope.topDepartmentsDatabyRP.length;i++) {
          if(i<10){
         $scope.indexvalue=0.00;
         var results = $filter('filter')($scope.topDepartmentsDatabyCP, {id : $scope.topDepartmentsDatabyRP[i].id}, true);
             if(results){
         if(results.length>0){
           if(results[0].amt>=0){
             $scope.indexvalue = $scope.topDepartmentsDatabyRP[i].amt / results[0].amt;
             $scope.indexvalue=$scope.indexvalue.toFixed(2);
           }
           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
            "amt1": $filter('number')(results[0].amt,2),
            "value":$scope.topDepartmentsDatabyRP[i].amt,
            "value1":results[0].amt,
            "storename": $scope.topDepartmentsDatabyRP[i].id,
            "reporttime":$scope.totalreporttime,
            "id": "",
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);


        }
        else{
           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
            "amt1": 0.00,
            "value":$scope.topDepartmentsDatabyRP[i].amt,
            "value1":0.00,
            "storename": $scope.topDepartmentsDatabyRP[i].id,
            "reporttime":$scope.totalreporttime,
            "id": "",
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);

        }
      }
        else{

          var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
            "amt1": 0.00,
            "value":$scope.topDepartmentsDatabyRP[i].amt,
            "value1":0.00,
            "storename": $scope.topDepartmentsDatabyRP[i].id,
            "reporttime":$scope.totalreporttime,
            "id": "",
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
      }
    }
     if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
     }
   // console.log("top departments data...",$scope.topdepartmentsData);
     $scope.departmentSpinner=false;
      $scope.showpiechartspinner=false;
      $scope.arrangeDepartmentchartData($scope.topdepartmentsData);
                
      }, function (response) {
                console.log(response);
              }
              );
    }

    var CPdonutChartData = {
      "aggTimeUnit": "1d",
      "startTime": $scope.SalesDataComparestartDate,
      "endTime": $scope.Compareenddate,
      "bucketLevel": "L",
      "bucketType": "deptName"
    }

       
    dashBoardService.GethundredDepartments(CPdonutChartData).then(function (response) {
      $scope.topDepartmentsDatabyCP = response.data.data;
     // console.log("response by ct....",$scope.topDepartmentsDatabyCP);
      $scope.$applyAsync();
      $scope.donutcharttotal=response.data.total;
      $scope.topdeptsByReportTime();
    }, function (response) {
      $scope.departmentSpinner=false;
      $scope.topdepartmentsData = [];
      console.log(response);
    }
    );

  }


  $scope.TopDepartmentsByStoreId = function () {

        $scope.showpiechartspinner=true;

    $scope.toDeptsBystoreidReporttime = function () {
      var topDeptDatabyReoprttime = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataReportstartDate,
        "endTime": $scope.Reportenddate,
        "bucketLevel": "L",
        "bucketType": "deptName"
      }
      $scope.showpiechart = false;
      dashBoardService.GethundredDepartmentsByStoreId(topDeptDatabyReoprttime).then(function (response) {
        $scope.topdepartmentsData = [];
        $scope.topdepartmentsId = dashBoardService.generateguid();
        $scope.topDepartmentsDatabyRP=response.data.data;
        $scope.donutcharttotalbyRT=response.data.total;
        if($scope.donutcharttotal>0){
          $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;
          $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
        }
        else{
          $scope.donutchartindex=0.00;
          $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
        }
        if($scope.donutchartindex>=1){
          $scope.indexcolor="green";
        }
        else{
          $scope.indexcolor="red";
        }
        if($scope.topDepartmentsDatabyRP==undefined||$scope.topDepartmentsDatabyCP==undefined){
           $scope.showpiechartspinner=false;
        }
        for (var i=0;i<$scope.topDepartmentsDatabyRP.length;i++) {
          if(i<10){
         $scope.indexvalue=0.00;
         var results = $filter('filter')($scope.topDepartmentsDatabyCP, {id : $scope.topDepartmentsDatabyRP[i].id}, true);
         if(results){
         if(results.length>0){
           if(results[0].amt>=0){
             $scope.indexvalue = $scope.topDepartmentsDatabyRP[i].amt / results[0].amt;
             $scope.indexvalue=$scope.indexvalue.toFixed(2);
           }
           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
            "amt1": $filter('number')(results[0].amt,2),
            "value":$scope.topDepartmentsDatabyRP[i].amt,
            "value1":results[0].amt,
            "storename": $scope.topDepartmentsDatabyRP[i].id,
            "reporttime":$scope.totalreporttime,
            "id": "",
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
        else{
           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
            "amt1": 0.00,
            "value":$scope.topDepartmentsDatabyRP[i].amt,
            "value1":0.00,
            "storename": $scope.topDepartmentsDatabyRP[i].id,
            "reporttime":$scope.totalreporttime,
            "id": "",
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
      }
        else{
          var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
            "amt1": 0.00,
            "value":$scope.topDepartmentsDatabyRP[i].amt,
            "value1":0.00,
            "storename": $scope.topDepartmentsDatabyRP[i].id,
            "reporttime":$scope.totalreporttime,
            "id": "",
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
      }
    }
      if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
     }
      /*for(var k=0;k<$scope.topDepartmentsDatabyCP.length;k++){
       var results = $filter('filter')($scope.topDepartmentsDatabyRP, {id : $scope.topDepartmentsDatabyCP[k].id}, true);
       
       if(results.length==0){
        $scope.indexvalue=0;
        console.log($scope.topDepartmentsDatabyCP[k].id);
        console.log("result...",results);

        var object = {
          "color": "#4C98CF",
          "color1": "#7F2891",
          "amt": 0,
          "amt1": $scope.topDepartmentsDatabyCP[k].amt,
          "storename": $scope.topDepartmentsDatabyCP[k].id,
          "reporttime":$scope.totalreporttime,
          "id": "",
          "comapretime":$scope.totalcomparetime,
          "Index":$scope.indexvalue
        };
        $scope.topdepartmentsData.push(object);
      }
      
    }*/

       $scope.arrangeDepartmentchartData($scope.topdepartmentsData);
        $scope.showpiechartspinner=false;
        //$scope.$applyAsync();
        //$scope.showpiechart = true;
        //dashBoardService.setcacheData('topdepartmentsData',$scope.topdepartmentsData);

      }, function (response) {
        console.log(response);
      }
      );
    }
    var topDeptDatabyComparetime = {
      "aggTimeUnit": "1d",
      "startTime": $scope.SalesDataComparestartDate,
      "endTime": $scope.Compareenddate,
      "bucketLevel": "L",
      "bucketType": "deptName"
    }

    dashBoardService.GethundredDepartmentsByStoreId(topDeptDatabyComparetime).then(function (response) {
      $scope.topDepartmentsDatabyCP=null;
      $scope.topDepartmentsDatabyCP = response.data.data;
       $scope.donutcharttotal=response.data.total;
      $scope.toDeptsBystoreidReporttime();
      $scope.$applyAsync();
    }, function (response) {
      //console.log(response);
      $scope.departmentSpinner=false;
      $scope.topdepartmentsData = [];
    }
    );
        }//end of donut chartFunction
        var departmentselected;
        departmentselected = $rootScope.$on('selecteddonutchartdep', function (event, data) {
          window.localStorage['namedeptcat']=data.title;
          window.localStorage['iddeptcat']=data.id;
          $state.go('categories');
        });

        $scope.getDepartmentList=function(){
         dashBoardService.GetDepartmentList().then(function (response) {
           $scope.departmentList=response.data;
         }, function (response) {
          console.log(response);
        }
        );
       }
           //storelist api calls
           $scope.options = [{ name: "a", id: 1 }, { name: "b", id: 2 }];
           $scope.List = [
           {
            "store_id":"",
            "store_name":"ALL STORES"
           }
           ];
           
           $scope.GetStoreList=function(){
             dashBoardService.GetStoreList().then(function (response) {
               for (var i = 0; i < response.data.length; i++) {
                 $scope.List.push(response.data[i]);
               }
               $scope.selectedOption = $scope.List[0];
               $scope.storeid=dashBoardService.getstoreid();
               window.localStorage["storeId"]=$scope.storeid;
               for(var j=0;j<$scope.List.length;j++){
                 if($scope.List[j].store_id==$scope.storeid){
                   $scope.storeidselected=$scope.List[j].store_id;
                      $scope.selectedOption = $scope.List[j];
                     $scope.selectedstoreidname=$scope.List[j].store_name;
                   }
                 }
               }, function (response) {
                 console.log(response);
               }
               );
           }

          $scope.topSalesRegions=function(){
            $scope.topregionsbyRT=function(){
            var data={
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 2
            }

            $scope.topsalesregionchart=false;
          dashBoardService.getgeoSalesData(data).then(function (response) {
             $scope.topregions=[];
             $scope.regionsbyRT=response.data.data[0].regions;
             dashBoardService.setsalesregionmaxvalue(0);
             $scope.salesregionchartid = dashBoardService.generateguid();
             for(var i=0;i<$scope.regionsbyRT.length;i++){
             if($scope.regionsbyRT&&$scope.regionsbyCT){
             if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
                $scope.salesregionindex=0.00
             if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
             $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
             }

              if($scope.salesregionindex>=1){
                 $scope.labelcolor="green";
                 $scope.arrow="\u2191";
              }
              else{
                 $scope.labelcolor="red";
                 $scope.arrow="\u2193";
              }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                  if($scope.regionsbyRT[i]){
                    $scope.salesregionindex=0.00;
                  $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
              if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                  }
                }
              }
              else{
              if($scope.regionsbyRT[i]){
                  $scope.salesregionindex=0.00;
                  $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
              if($scope.salesregionindex>=1){
                  $scope.labelcolor="green";
                  $scope.arrow="\u2191";
              }
              else{
                  $scope.labelcolor="red";
                  $scope.arrow="\u2193";
              }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                  }
              }
             }
                  $scope.topsalesregionchart=true;
               }, function (response) {
                 console.log(response);
               }
               );
            }
              var salesregiondataCT={
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2
            }

          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
             $scope.topregionsbyRT();
             if(response.data.data){
              if(response.data.data[0]){
              $scope.regionsbyCT=response.data.data[0].regions;
              }
             }
             else{
              $scope.regionsbyCT=undefined;
             }
               }, function (response) {
                 console.log(response);
               }
               );
        }

         $scope.topSalesRegionsbystore=function(){
         $scope.topregionsbyRTbystore=function(){
           var data={
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 2,
             "filters" :{
            "storeId" : [$scope.data.selectedStoreId]
          }
          }

           $scope.topsalesregionchart=false;
          dashBoardService.getgeoSalesData(data).then(function (response) {
             $scope.topregions=[];
             $scope.regionsbyRT=response.data.data[0].regions;
             dashBoardService.setsalesregionmaxvalue(0);
              $scope.salesregionchartid = dashBoardService.generateguid();
             for(var i=0;i<$scope.regionsbyRT.length;i++){
             if($scope.regionsbyRT&&$scope.regionsbyCT){
             if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
                $scope.salesregionindex=0.00
             if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                  if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                  if($scope.regionsbyRT[i]){
                  $scope.salesregionindex=0.00;
                  $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
              if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                  }
                }
              }
              else{
                 if($scope.regionsbyRT[i]){
                    $scope.salesregionindex=0.00;
                  $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
              if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                  }
              }
            }
                  $scope.topsalesregionchart=true;
               }, function (response) {
                 console.log(response);
               }
               );
         }

          var salesregiondataCT={

            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "geoLevel" : 2,
            "filters" :{
            "storeId" : [$scope.data.selectedStoreId]
          }
          }

          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
             if(response.data.data){
              console.log("response.data....",response.data.data);
              if(response.data.data[0]){
              $scope.regionsbyCT=response.data.data[0].regions;
              }
             }
                else{
              $scope.regionsbyCT=undefined;
             }
             $scope.topregionsbyRTbystore();
               }, function (response) {
                 console.log(response);
               }
               );
        }

    $scope.topSalesRegionsforcpg=function(){

    $scope.topregionsbyRTforallretailer=function(){
     var data={
      "aggTimeUnit":"1d",
      "startTime": $scope.ReportstartDate,
      "endTime": $scope.Reportenddate,
      "geoLevel" : 2,
      "filters" :{
      "item.mfgId" : [$scope.mfgId],
      "retailerId" : $scope.RetailerIds
      }
    }
    $scope.topsalesregionchart=false;
    dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {

             $scope.topregions=[];
             $scope.regionsbyRT=response.data.data[0].regions;
             dashBoardService.setsalesregionmaxvalue(0);
             $scope.salesregionchartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT&&$scope.regionsbyCT){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
              $scope.salesregionindex=0.00
            if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                  if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                   if($scope.regionsbyRT[i]){
                     $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
              if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
          }
        }
      }
        else{
        if($scope.regionsbyRT[i]){
              $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
        if($scope.salesregionindex>=1){
              $scope.labelcolor="green";
              $scope.arrow="\u2191";
        }
        else{
              $scope.labelcolor="red";
              $scope.arrow="\u2193";
        }
            var amt=$scope.regionsbyRT[i].amount;
            var amt1=0.00;
            var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                   }
              }
             }
             $scope.topsalesregionchart=true;
          }, function (response) {
           console.log(response);
         }
         );
        }

    var salesregiondataCT={
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2,
              "filters" :{
              "item.mfgId" : [$scope.mfgId],
              "retailerId" : $scope.RetailerIds
             }
            }
          dashBoardService.getgeoSalesDataforCpg(salesregiondataCT).then(function (response) {
             if(response.data.data){
              if(response.data.data[0]){
              $scope.regionsbyCT=response.data.data[0].regions;
              }
             }
             $scope.topregionsbyRTforallretailer();
               }, function (response) {
                 console.log(response);
               }
               );
          }

  $scope.topSalesRegionsforcpgbyretailer=function(){

             $scope.topregionsbyRTforretailerforcpg=function(){
           var data={
            "aggTimeUnit":"1d",
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 2,
            "filters" :{
            "item.mfgId" : [$scope.mfgId]
           }
          }

          $scope.topsalesregionchart=false;
          dashBoardService.getgeoSalesData(data).then(function (response) {
              $scope.topregions=[];
             $scope.regionsbyRT=response.data.data[0].regions;
             dashBoardService.setsalesregionmaxvalue(0);
             $scope.salesregionchartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT&&$scope.regionsbyCT){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
               $scope.salesregionindex=0.00
            
            if($scope.regionsbyRT[i].amount){
            $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
            }
            if($scope.salesregionindex>=1){
              $scope.labelcolor="green";
              $scope.arrow="\u2191";

            }
            else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
            }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow

                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                   if($scope.regionsbyRT[i]){
                     $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                   }
                }
              }
              else{
                if($scope.regionsbyRT[i]){
                     $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
              if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                   }
              }
             }
             $scope.topsalesregionchart=true;
               }, function (response) {
                 console.log(response);
               }
               );
             }

            var salesregiondataCT={
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2,
              "filters" :{
              "item.mfgId" : [$scope.mfgId]
             }
            }

          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
             $scope.topregionsbyRTforretailerforcpg();
              if(response.data.data){
                if(response.data.data[0]){
               $scope.regionsbyCT=response.data.data[0].regions;
                }
                }
               }, function (response) {
                 console.log(response);
               }
               );
             }

        $scope.topSalesRegionsforcpgbystore=function(){

          $scope.topregionsbyRTforstoreforcpg=function(){

           var data={
            "aggTimeUnit":"1d",
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 2,
            "filters" :{
            "item.mfgId" : [$scope.mfgId],
            "storeId" : [$scope.storeId.toString()]
           }
          }
          $scope.topsalesregionchart=false;
          dashBoardService.getgeoSalesData(data).then(function (response) {
            $scope.topregions=[];
             $scope.regionsbyRT=response.data.data[0].regions;
             dashBoardService.setsalesregionmaxvalue(0);
             $scope.salesregionchartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT&&$scope.regionsbyCT){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
              $scope.salesregionindex=0.00
            
            if($scope.regionsbyRT[i].amount){
            $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
            }
            if($scope.salesregionindex>=1){
               $scope.labelcolor="green";
               $scope.arrow="\u2191";
            }
            else{
                $scope.labelcolor="red";
                $scope.arrow="\u2193";
            }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow

                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                   if($scope.regionsbyRT[i]){
                     $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
           if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                   }
                }
              }
              else{
          if($scope.regionsbyRT[i]){
              $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
         if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
          $scope.topregions.push(salesregionobject);
            }
            }
            }
             $scope.topsalesregionchart=true;
               }, function (response) {
                 console.log(response);
               }
               );
              }

              var salesregiondataCT={
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2,
              "filters" :{
        "item.mfgId" : [$scope.mfgId],
        "storeId" : [$scope.storeId.toString()]
            }
            }

          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
              if(response.data.data){
                if(response.data.data[0]){
                $scope.regionsbyCT=response.data.data[0].regions;
                }
             }
             $scope.topregionsbyRTforstoreforcpg();
               }, function (response) {
                 console.log(response);
               }
               );
        }
      $scope.storesformap=[];

           $scope.geosalesData=function(){
             var data={

              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "geoLevel" : 4
            }
            $scope.showmap=false;
            $scope.geoSalesData=undefined;
            dashBoardService.getgeoSalesData(data).then(function (response) {
             $scope.topStoresData={
               map: "usaLow",
               getAreasFromMap: true,
               "markers": []
             };
             $scope.topstores=[];
             $scope.storeList=[];
             $scope.storesformap=[];
             if(response.data.data){
              if(response.data.data.length>0){
                  $scope.geoSalesData=response.data.data;
             
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
          console.log("geosalesData[0]....",$scope.geoSalesData[0])
             dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }
             }
             else{
               $scope.geoSalesData=[];
             }
                 $scope.showmap=true;
               }, function (response) {
                 console.log(response);

               }
               );
          }// geoSalesData() END...

        $scope.geosalesDatabyStoreid=function(){
         var data={

          "startTime": $scope.ReportstartDate,
          "endTime": $scope.Reportenddate,
          "geoLevel" : 4,
          "filters" :{ 
          "storeId" : [$scope.data.selectedStoreId.toString()],
           "item.brandId" : $scope.BrandIdsList
        }

        }
         $scope.showmap=false;
         $scope.geoSalesData=undefined;
        dashBoardService.getgeoSalesData(data).then(function (response) {
         $scope.topStoresData={
           map: "usaLow",
           getAreasFromMap: true,
           "markers": []
         };
         $scope.topstores=[];
         $scope.storeList=[];
         $scope.storesformap=[];
           if(response.data.data){
              if(response.data.data.length>0){
                  $scope.geoSalesData=response.data.data;
                $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
            dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }
             }
             else{
               $scope.geoSalesData=[];
             }
              $scope.showmap=true;
                }, function (response) {
                 console.log(response);
               }
               );
      }

      $scope.geosalesDataforCpg=function(){
       var data={
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "geoLevel" : 1,
        "filters" :{
        "item.mfgId" : [$scope.mfgId],
        "retailerId" : $scope.RetailerIds
        }
      }

      $scope.showmap=false;
      $scope.geoSalesData=undefined;
      dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
        $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       $scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
      if(response.data.data.length>0){
          $scope.geoSalesData=response.data.data;
          $scope.reporttimeforGeosalesregion={
                "reportstartTime":$scope.ReportstartDate,
                "reportendTime":$scope.Reportenddate
        }
          dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
      }
      else{
          $scope.geoSalesData=[];
        }
      }
      else{
          $scope.geoSalesData=[];
        }
          $scope.showmap=true;
      }, function (response) {
          console.log(response);

      }
      );
      }

           $scope.geosalesDatabyretailerforcpg=function(){
             var data={
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "geoLevel" : 1,
              "filters" :{
              "item.mfgId" : [$scope.mfgId]
             }
            }

            $scope.showmap=false;
            $scope.geoSalesData=undefined;
            dashBoardService.getgeoSalesData(data).then(function (response) {
             $scope.topStoresData={
               map: "usaLow",
               getAreasFromMap: true,
               "markers": []
             };
             $scope.topstores=[];
             $scope.storeList=[];
             $scope.storesformap=[];
             if(response.data.data){
             if(response.data.data.length>0){
                $scope.geoSalesData=response.data.data;
                $scope.reporttimeforGeosalesregion={
                "reportstartTime":$scope.ReportstartDate,
                "reportendTime":$scope.Reportenddate
             }
              dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }
             }
             else{
               $scope.geoSalesData=[];
             }
                 $scope.showmap=true;
               }, function (response) {
                 console.log(response);
               }
               );
          }

          $scope.geosalesDatabyStoreidforcpg=function(){
         var data={
          "startTime": $scope.ReportstartDate,
          "endTime": $scope.Reportenddate,
          "geoLevel" : 1,
          "filters" :{
          "item.mfgId" : [$scope.mfgId],
          "storeId" : [$scope.storeId.toString()]
           }
           }
         $scope.showmap=false;
         $scope.geoSalesData=undefined;
        dashBoardService.getgeoSalesData(data).then(function (response) {
         $scope.topStoresData={
           map: "usaLow",
           getAreasFromMap: true,
           "markers": []
         };
         $scope.topstores=[];
         $scope.storeList=[];
         $scope.storesformap=[];
         if(response.data.data){
         if(response.data.data.length>0){
         $scope.geoSalesData=response.data.data;
         $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
         dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
         }
        else{
            $scope.geoSalesData=[];
        }
        }
        else{
          $scope.geoSalesData=[];
        }
        $scope.showmap=true;
        }, function (response) {
          console.log(response);
        }
        );
      }

       $scope.salespperformancebyallstores=function(){

       $scope.salespperformancebyallstoresbyRT=function(){
       var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S"
               }
               $scope.topstoreschart=false;
      dashBoardService.GetSalesPerformance(data).then(function (response) {
        $scope.topstoresList=[];
        dashBoardService.settopstoresmaxvalue(0);
        $scope.topstoresListbyRT=response.data.data;
        $scope.topstoreschartid = dashBoardService.generateguid();
        for(var i=0;i<$scope.topstoresListbyRT.length;i++){
        if(i<5){
        for(var j=0;j<$scope.List.length;j++){
        if($scope.List[j].store_id==$scope.topstoresListbyRT[i].id){
        if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
        if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
        $scope.topstoresindex=0.00;
        if($scope.topstoresListbyRT[i].amt>0&&$scope.topstoresListbyCT[i].amt>0){
       $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
       $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
                   if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                        var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.List[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.List[j].store_id,
                          "content":$scope.List[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topstoresList.push(topstoresobject);
                   }
                   else{
                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
               if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                       var amt=$scope.topstoresListbyRT[i].amt;
                      var amt1=0.00;
                        var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.List[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.List[j].store_id,
                          "content":$scope.List[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topstoresList.push(topstoresobject);
                   }
            }
          else{  

           if($scope.topstoresListbyRT[i]){
            $scope.topstoresindex=0.00;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
            if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                       var amt=$scope.topstoresListbyRT[i].amt;
                      var amt1=0.00;
                        var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.List[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.List[j].store_id,
                          "content":$scope.List[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topstoresList.push(topstoresobject);
       }
       }
       }
       }
      }
      }
            $scope.topstoreschart=true;
            }, function (response) {
             console.log(response);
           }
           );
             }
              var data={
                 "aggTimeUnit":"1d",
                "startTime": $scope.SalesDataComparestartDate,
                 "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S"
               }
               dashBoardService.GetSalesPerformance(data).then(function (response) {
                      $scope.topstoresListbyCT= response.data.data;
                       $scope.salespperformancebyallstoresbyRT();
            }, function (response) {
             console.log(response);
           }
           );
             }

             $scope.salespperformancebyallstoresbystore=function(){
               $scope.salespperformancebyallstoresbyRTforstore=function(){
                var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S"
               }
               $scope.topstoreschart=false;
               dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
                 $scope.topstoresList=[];
                 dashBoardService.settopstoresmaxvalue(0);
                 $scope.topstoresListbyRT=response.data.data;
                 $scope.topstoreschartid = dashBoardService.generateguid();
      for(var i=0;i<$scope.topstoresListbyRT.length;i++){
      if(i<5){
      for(var j=0;j<$scope.List.length;j++){
      if($scope.List[j].store_id==$scope.topstoresListbyRT[i].id){
      if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
      if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
        //console.log($scope.topstoresListbyRT[i].amt);
      $scope.topstoresindex=0.00;
      if($scope.topstoresListbyRT[i].amt>0&&$scope.topstoresListbyCT[i].amt>0){
        $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
        $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
        }
                   if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                        var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.List[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.List[j].store_id,
                          "content":$scope.List[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                           "arrow":$scope.arrow
                        };
              $scope.topstoresList.push(topstoresobject);
                   }
                   else{
                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
               if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

                  }
                       var amt=$scope.topstoresListbyRT[i].amt;
                      var amt1=0.00;
                        var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.List[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.List[j].store_id,
                          "content":$scope.List[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                           "arrow":$scope.arrow
                        };
              $scope.topstoresList.push(topstoresobject);
                   }
                 }
               else{  
                 if($scope.topstoresListbyRT[i]){
                 $scope.topstoresindex=0.00;
                 $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
               if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                       var amt=$scope.topstoresListbyRT[i].amt;
                      var amt1=0.00;
                        var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.List[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.List[j].store_id,
                          "content":$scope.List[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                           "arrow":$scope.arrow
                        };
              $scope.topstoresList.push(topstoresobject);
       }
       }
       }
       }
       }
       }
            $scope.topstoreschart=true;
            }, function (response) {
             console.log(response);
           }
           );
               }
               var data={
                 "aggTimeUnit":"1d",
                "startTime": $scope.SalesDataComparestartDate,
                 "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S"
               }
               dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
              $scope.topstoresListbyCT= response.data.data;
              $scope.salespperformancebyallstoresbyRTforstore();
            }, function (response) {
             console.log(response);
           }
           );
             }

             $scope.salespperformancebyallstoresforcpg=function(){
              $scope.topstoresbyRTforallretailer=function(){
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "retailerId" : $scope.RetailerIds
                }
              }
              $scope.topstoreschart=false;
              dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
                $scope.topstoresList=[];
                dashBoardService.settopstoresmaxvalue(0);
                $scope.topstoresListbyRT=response.data.data;
                $scope.topstoreschartid = dashBoardService.generateguid();
    for(var i=0;i<$scope.topstoresListbyRT.length;i++){
    if(i<5){
    for(var j=0;j<$scope.allstoresList.length;j++){
    if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
    var retailerfound=$filter('filter')($scope.storesByRetailer, 
    {storeid : parseInt($scope.topstoresListbyRT[i].id)}, true);
    if(retailerfound.length>0){
    if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
    if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
    $scope.topstoresindex=0.00;
    if(parseFloat($scope.topstoresListbyRT[i].amt)>0&&parseFloat($scope.topstoresListbyCT[i].amt)>0){
    $scope.topstoresindex=parseFloat($scope.topstoresListbyRT[i].amt)/parseFloat($scope.topstoresListbyCT[i].amt);
    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
    }
    if($scope.topstoresindex>=1){
       $scope.labelcolor="green";
       $scope.arrow="\u2191";
    }
    else{
      $scope.labelcolor="red";
      $scope.arrow="\u2193";
    }
      var amt=$scope.topstoresListbyRT[i].amt;
      var amt1=$scope.topstoresListbyCT[i].amt;
      var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }else{

                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                   var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }
                      }
            else{
            if($scope.topstoresListbyRT[i]){
          $scope.topstoresindex=0.00;
          $scope.topstoresindex=$scope.topstoresindex.toFixed(2);

                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                   var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };

                     $scope.topstoresList.push(topstoresobject);
                    }
                      }
                    }
                   }
                 }
               }
               }
               $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
            }

                var comparetimedata={
                 "aggTimeUnit":"1d",
                "startTime": $scope.SalesDataComparestartDate,
                 "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "retailerId" : $scope.RetailerIds
                }
               }
               dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(comparetimedata).then(function (response) {
                  $scope.topstoresListbyCT= response.data.data;
                  $scope.topstoresbyRTforallretailer();
            }, function (response) {
             console.log(response);
           }
           );
             }

             $scope.salespperformancebyallstoresforcpgbyretailer=function(){

              $scope.topstoresbyRTforretailerforcpg=function(){

               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId]
                }
              }
              $scope.topstoreschart=false;
              dashBoardService.GetSalesPerformance(data).then(function (response) {
             $scope.topstoresList=[];
             dashBoardService.settopstoresmaxvalue(0);
             $scope.topstoresListbyRT=response.data.data;
             $scope.topstoreschartid = dashBoardService.generateguid();
             for(var i=0;i<$scope.topstoresListbyRT.length;i++){
             if(i<5){
             for(var j=0;j<$scope.allstoresList.length;j++){
             if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
             var retailerfound=$filter('filter')($scope.storesByRetailer, 
              {storeid : parseInt($scope.topstoresListbyRT[i].id)}, true);
             if(retailerfound.length>0){
             if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
             if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
             $scope.topstoresindex=0.00;
             if(parseFloat($scope.topstoresListbyRT[i].amt)>0&&parseFloat($scope.topstoresListbyCT[i].amt)>0){
             $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
             $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
             }
             if($scope.topstoresindex>=1){
             $scope.labelcolor="green";
             $scope.arrow="\u2191";
             }
             else{
             $scope.labelcolor="red";
             $scope.arrow="\u2193";
                  }
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }else{
                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };

                     $scope.topstoresList.push(topstoresobject);

                   }
                  }
              else{

                if($scope.topstoresListbyRT[i]){
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
              var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                $scope.topstoresList.push(topstoresobject);
              }
              }
              }
              }
              }
              }
              }
               $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
            }
                var comparetimedata={
                 "aggTimeUnit":"1d",
                "startTime": $scope.SalesDataComparestartDate,
                 "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId]
                }
               }
               dashBoardService.GetSalesPerformance(comparetimedata).then(function (response) {
                  $scope.topstoresListbyCT= response.data.data;
                  $scope.topstoresbyRTforretailerforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }

             $scope.salespperformancebyallstoresforcpgbystore=function(){
              $scope.topstoresbyRTforstoreforcpg=function(){
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId]
                }
              }
               $scope.topstoreschart=false;
              dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
              $scope.topstoresList=[];
            dashBoardService.settopstoresmaxvalue(0);
            $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            var retailerfound=$filter('filter')($scope.storesByRetailer, 
           {storeid : parseInt($scope.topstoresListbyRT[i].id)}, true);
        if(retailerfound.length>0){
        if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
        if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0&&parseFloat($scope.topstoresListbyCT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
          }
        if($scope.topstoresindex>=1){
          $scope.labelcolor="green";
          $scope.arrow="\u2191";
         }
        else{
          $scope.labelcolor="red";
          $scope.arrow="\u2193";
         }
        var amt=$scope.topstoresListbyRT[i].amt;
        var amt1=$scope.topstoresListbyCT[i].amt;
        var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }else{
                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };
                     $scope.topstoresList.push(topstoresobject);
                   }
                    }
              else{
              if($scope.topstoresListbyRT[i]){
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                      }
                    }
                    }
                   }
                 }
               }
               }
               $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
            }

            var comparetimedata={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataComparestartDate,
                 "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                 "item.mfgId" : [$scope.mfgId]
                }
               }
               dashBoardService.GetSalesPerformance(comparetimedata).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.topstoresbyRTforstoreforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }

             /* ++++++++++++ Brand Portal api calls +++++++++++ */

             $scope.ctrl = {
              'treeData':[],
              'treeDropdownstatus':false
              // 'selected': {
              //   "id": 1,
              //   "name": "All Retailers",
              //   "retailerId":"All Retailers"
              // }
            };
             $scope.ctrl.selected = {
               "id": 1,
                "name": "All Retailers",
                "retailerId":"All Retailers"
              }

            $scope.ctrl.treeData = [
            {
              "id": 1,
              "name": "All Retailers",
              "retailerId":"All Retailers"
            }
            ]
             $scope.ctrl.treeData1 = [
            {
              "id": 1,
              "name": "All Retailers",
              "retailerId":"All Retailers"

            }
            ]

            $rootScope.selected=
            {
            "id": 1,
            "name": "All Retailers",
            "retailerId":"All Retailers"
          };

            $scope.savedvalue=dashBoardService.getsavestoreselected();

            if($scope.savedvalue==null){
            $scope.defaultstoreselected=$rootScope.selected;
            dashBoardService.setsavestoreselected($scope.defaultstoreselected);
            }

            $scope.retailerList=[];
            $scope.collection1=[{
              "id":1,
              "name":"All Retailers",
              "retailername":"All Retailers",
              "retailerId":"All Retailers"
            }]
            $scope.storesByRetailer=[{
              "normalId":1,
              "id":1,
              "name":"All Retailers",
              "retailername":"All Retailers",
              "retailerId":"All Retailers"
            }]
            
            $scope.ctrl.treeDropdownstatus=false;
               
              $scope.dmaStoreList=[];
              $scope.dma="";
          $scope.getDmaList=function(value){
            sessionStorage.DMAsuggest = value;
             return dashBoardService.getDMAforCPG().then(function(response){
               $scope.dmaList=[];
               
              for(var i=0;i<response.data.length;i++){
              var dma={
                    //"id":$scope.id,
                    "name":response.data[i].dma_name,
                    "dmaId":response.data[i].dma_id,
                    "stores":response.data[i].stores
              }
               // $scope.ctrl.treeData.push(dma);
               $scope.dmaList.push(dma);
                // $scope.id=$scope.id+1;
             }

              console.log("dmaListforCPG....",$scope.dmaList);
               return $scope.dmaList;

               $scope.dma=dashBoardService.getselectedDMA();
               console.log(" $scope.dma", $scope.dma);
             
              },function(error){
              });
             }


            $scope.selectDMA=function(value){
               $scope.ctrl.selected = {              
                "id": 1,
                "name": "All Retailers",
                "retailerId":"All Retailers"
              
            };
             dashBoardService.setsavestoreselected($scope.ctrl.selected);
             
              $scope.dmaStoreList=[];
              console.log("/////",value);
              dashBoardService.saveselectedDMA(value);
              for(var i=0; i< $scope.dmaList.length; i++){
                if(value == $scope.dmaList[i].name){
                  for(var j=0; j< $scope.dmaList[i].stores.length;j++){
                  $scope.dmaStoreList.push($scope.dmaList[i].stores[j].toString());
                   dashBoardService.saveselectedDMA($scope.dmaList[i]);
                }}
              }
         
              $scope.dma=value;             
               console.log("selectedBrand",$scope.selectedBrand);
               console.log("ctrl.selected",$scope.ctrl.selected);
               $scope.retailerId=$scope.ctrl.selected.retailerId;
               if($scope.selectedBrand.brand_name =="All Brands"){
                      $scope.SalesPerformanceByDMA();
                      $scope.shareOfCategoryByDMA();
                      $scope.ShareOfBasketByDMA();
                      $scope.topProductsFunctionByDMA();
                      $scope.GetCategoriesforDMA();
                      $scope.geosalesDataforDMA();
                      $scope.topSalesRegionsforDMA();
                      $scope.topstoresforDMA();                                  
             }else{
                  $scope.bestsellersbySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.SalesPerformanceBySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.categoriesbySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.topsalesRegionsBySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.topstoresbySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.geosalesdatabySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.shareOfCategoryByAllRetailersforBRANDwithDMA($scope.selectedBrand.brandid);
                  $scope.ShareOfBasketByAllRetailerforBRANDwithDMA($scope.selectedBrand.brandid); 
             }

            }

             $scope.id=2;
            

        $scope.makeStoresList=function(){
              dashBoardService.storeListforCPG().then(function (response) {
              $scope.storesList=response.data;
              for(var i=0; i<$scope.getStoresData.length; i++){
              console.log("$scope.storesList",$scope.storesList);
            var storesssobject={
                 "id":   $scope.id,
                 "name": $scope.getStoresData[i].retailername,
                 "retailerId":$scope.getStoresData[i].retailerid,
                 "children": [],
               }
          for(var j=0;j<$scope.storesList.length;j++){
            if($scope.storesList[j].retailer_id == $scope.getStoresData[i].retailerid){
                 var id=$scope.storesByRetailer.length+1;
                 $scope.id=$scope.id+1;
                 var object={
                   "id":$scope.id ,
                   "name":$scope.storesList[j].store_name,
                   "storeid":$scope.storesList[j].store_id,
                   "retailerId":$scope.getStoresData[i].retailerid,
                   "retailerName": $scope.getStoresData[i].retailername
                 }
                 //$scope.allstoresList.push($scope.storesList[j]);
                 $scope.storesByRetailer.push(object);
                 storesssobject.children.push(object);
               }}
               $scope.id=$scope.id+1;
               $scope.storesByRetailer.push(object);

               $scope.selectedOption = $scope.storesByRetailer[0];
               $scope.ctrl.treeData1.push(storesssobject);
               $scope.ctrl.treeDropdownstatus=false;
                var index=$scope.retailerData.length-1;
            if($scope.retailerData[index].retailer_name==$scope.getStoresData[i].retailername){

                   $timeout(function(){
                     // $scope.arrayid=$scope.arrarIdlength;
                   $scope.arrayid =1;
                  for(var i=0;i<$scope.retailerData.length;i++){
                    var findretailer=$filter('filter')($scope.ctrl.treeData1, 
                    {name : $scope.retailerData[i].retailer_name}, true);

                     $scope.arrayid=$scope.arrayid+1;
                     findretailer[0].id=$scope.arrayid;
                    for(var j=0;j<findretailer[0].children.length;j++){
                       $scope.arrayid=$scope.arrayid+1;
                      findretailer[0].children[j].id=$scope.arrayid;
                    }
                    $scope.ctrl.treeData.push(findretailer[0]);
                   }
                  $scope.ctrl.treeDropdownstatus=true;
                console.log("treedata...",$scope.ctrl.treeData);
                // $scope.selectedcpg=dashBoardService.getsavestoreselected();
                //  $scope.selecteddma=dashBoardService.getselectedDMA();   
                  // if($scope.selectedcpg.name=="All Retailers" && $scope.selecteddma ==null){
                     $scope.cpgFunctions();
                  // }
                       
                  },1400);
                 }
                   }
             }, function (response) {
              console.log(response);
            }
            );
            }

            $scope.allapicalled=false;
            $scope.getStoresData=[];
            $scope.getStoresByRetailer=function(){
            for(var i = 0; i < $scope.retailerData.length;i++){
              $scope.retailerList.push($scope.retailerData[i]);
              sessionStorage.retailer=$scope.retailerData[i].retailer_id;
             // console.log("retailername...",$scope.retailerData[i].retailer_name);
             if(i==$scope.retailerData.length-1){
                $scope.allapicalled=true;
              }
              else{
                $scope.allapicalled=false;
              }
                 $scope.getStoresData.push({
                   "retailerid":$scope.retailerData[i].retailer_id,
                   "retailername":$scope.retailerData[i].retailer_name
                 });
                  console.log("$scope.getStoresData",$scope.getStoresData);

              //$scope.makeStoresList($scope.retailerData[i].retailer_id,$scope.retailerData[i].retailer_name,$scope.allapicalled);
              }

                  $timeout(function() {
                    $scope.makeStoresList();                   
                  }, 1000);
            }
            $scope.RetailerIds=[];
            $scope.getAllRetailers=function(){
            dashBoardService.getRetailerforCPG().then(function (response) {
            $scope.retailerData=response.data;
            //console.log("retailers data...",$scope.retailerData);
            for(var i=0;i<$scope.retailerData.length;i++){
              $scope.RetailerIds.push($scope.retailerData[i].retailer_id.toString());
            }
             productService.saveallRetailers($scope.RetailerIds);
           // console.log("retailerIds...",$scope.RetailerIds);

           //console.log("selected cpg...",$scope.selectedcpg);
           $scope.savedBrand=dashBoardService.getselectedBrand();
          // if($scope.selectedcpg.name=="All Retailers"){
          //   if($scope.savedBrand.brand_name=="ALL BRANDS"){
                
            // }else{
            //   $scope.SalesPerformanceBySingleBrandforcpg($scope.savedBrand.brandid);
            //   $scope.bestsellersbySingleBrandforCPG($scope.savedBrand.brandid);
            //   $scope.categoriesbySingleBrandforCPG($scope.savedBrand.brandid);
            //   $scope.topsalesRegionsBySingleBrandforCPG($scope.savedBrand.brandid);
            //   $scope.topstoresbySingleBrandforCPG($scope.savedBrand.brandid);
            //   $scope.geosalesdatabySingleBrandforCPG($scope.savedBrand.brandid);
            //   $scope.shareOfCategoryByAllRetailersforBRAND($scope.savedBrand.brandid);
            //   $scope.ShareOfBasketByAllRetailerforBRAND($scope.savedBrand.brandid);
            // }

            
           // }
            //$scope.allstoresList=[];
            $scope.getStoresByRetailer();
            }, function (response) {
              console.log(response);
            }
            );
            }

            $scope.SalesPerformanceByAllRetailer = function () {
              $scope.SalesPerformancespinner=true;
              $scope.SalesPerformanceByRetailerbyRT = function () {
                $scope.SalesPerformance = false;
                var data = {
                  "aggTimeUnit": "1d",
                  "startTime": $scope.SalesDataReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "filters": {
                   "items.mfgId" : [$scope.mfgId],
                   "retailerId" :$scope.RetailerIds 
                 }
               }
               dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
                $scope.total = response.data.total;
                $scope.LineChartData1 = [];
                $scope.SalesPerformancespinner=false;
                $filter('number')($scope.total, $scope.total.length)

                $scope.rpIndextotal = parseFloat(response.data.total);
                if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
                  $scope.spIndex = 0;
                }
                else {
                  $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
                  $scope.spIndex = $scope.spIndex.toFixed(2);
                }
                $scope.salesperformanceId = dashBoardService.generateguid();
               
                 $scope.j=1;
              for (var i = 0; i < response.data.data.length; i++) {

                if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");

             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){

                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if($scope.Cpdata[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": $scope.Cpdata[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
              }
                $scope.$applyAsync();
                $scope.SalesPerformance = true;
                dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
                dashBoardService.setcacheData('spIndex',$scope.spIndex);
                dashBoardService.setcacheData('total','$' + response.data.total);

              }, function (response) {
                console.log(response);
              }
              );
             }
             var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "filters": {
               "items.mfgId" : [$scope.mfgId],
               "retailerId" :$scope.RetailerIds 
             }
           }
           dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
            $scope.spIndextotal = parseFloat(response.data.total);
           $scope.Cpdata=response.data.data;
            $scope.SalesPerformanceByRetailerbyRT();
          }, function (response) {
            console.log(response);
          }
          );
         }

         $scope.shareOfCategoryByAllRetailers= function () {

          $scope.ShoppingTripsspinner=true;
          $scope.shareOfCategoryByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
              "filters":{
                "rids":$scope.RetailerIds 
              }
            }
            $scope.ShoppingTrips = false;
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
              $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $scope.ShoppingTripsspinner=false;
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
               $scope.j=1;
              for (var i=0;i<response.data.data.length;i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
            if(response.data.data&&$scope.shoppintripsCpData){
            if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
               if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
               }
             
              }
              else if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                   var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
              else if($scope.shoppintripsCpData[i]){
                
                //console.log("coming...");
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                  var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
             }
              }
               console.log("LineChartData2...",$scope.LineChartData2);
              $scope.$applyAsync();
              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters":{
                "rids":$scope.RetailerIds 
              }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
            $scope.shoppintripsCpData=response.data.data;
            $scope.shareOfCategoryByRT();
          }, function (response) {
            console.log(response);
          }
          );
        }

        $scope.shareOfCategoryByRetailerforCpg= function (id) {
        $scope.ShoppingTripsspinner=true;
        $scope.shareOfCategoryByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" :id.toString()
            }
            $scope.ShoppingTrips = false;
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
              $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $scope.ShoppingTripsspinner=false;
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
              $scope.j=1;
              for (var i = 0; i < response.data.data.length; i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.shoppintripsCpData){
              if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
            
             if(parseFloat(response.data.data[i].percentage)>0){
              var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
             }
              }
              else if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object); 
                }
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                  var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
             }
              }

              $scope.$applyAsync();
              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);

            }, function (response) {
              console.log(response);
            }
            );
          }
          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : id.toString()
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
            $scope.shoppintripsCpData=response.data.data;
            $scope.shareOfCategoryByRT();
          }, function (response) {
            console.log(response);
          }
          );
        }

        $scope.ShareOfBasketByAllRetailer = function () {

          $scope.AvgBasketspinner=true;
          $scope.avgBasketByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
                "filters":{
                "rids":$scope.RetailerIds 
              }
            }
            $scope.AvgBasket = false;
            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
             
              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
              $scope.LineChartData3 = [];
              $scope.AvgBasketspinner=false;

              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }
                $scope.j=1;
        for (var i=0;i<response.data.data.length;i++){
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
            if(response.data.data&&$scope.avgBasketDataByCP){
            if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if(response.data.data[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
             else{
              if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
             }
        }
    
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters":{
            "rids":$scope.RetailerIds 
            }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
            $scope.avgBasketTotalByCP = parseFloat(response.data.total);
            $scope.avgBasketDataByCP=response.data.data;

            $scope.avgBasketByRT();

          }, function (response) {
            console.log(response);
            $scope.LineChartData3 = [];
            $scope.AvgBasketspinner=false;
          }
          );
        }


        $scope.ShareOfBasketByRetailerforCpg = function (id) {

              $scope.AvgBasketspinner=true;

          $scope.avgBasketByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : id.toString()
            }
            $scope.AvgBasket = false;
            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {

              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
              $scope.LineChartData3 = [];
               $scope.AvgBasketspinner=false;

              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }
               $scope.j=1;
        for (var i = 0; i < response.data.data.length; i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");

             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }

            if(response.data.data&&$scope.avgBasketDataByCP){
            if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
            else if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
             }
             else{

              if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
             }
        }
    
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : id.toString()
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
            $scope.avgBasketTotalByCP = parseFloat(response.data.total);
            $scope.avgBasketDataByCP=response.data.data;

            $scope.avgBasketByRT();

          }, function (response) {
             $scope.LineChartData3 = [];
             $scope.AvgBasketspinner=false;
            console.log(response);
          }
          );

        }


        $scope.topProductsFunctionByAllRetailer = function () {
          $scope.TopProductsspinner=true;
          
            $scope.TopProductsbyReportTimeforcpgforretailer = function () {
              var data = {
                "aggTimeUnit": "1d",
                "startTime": $scope.SalesDataReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel": "L",
                "bucketType": "upc",
                "filters": {
                  "items.mfgId" : [$scope.mfgId],
                   "retailerId":$scope.RetailerIds 
                }

               
             
              }
              $scope.TopProducts = false;
              dashBoardService.getbestselleresbyallretailer(data).then(function (response) {
                $scope.topProductsbyRT = response.data.data;
              
                $scope.topproductsId = dashBoardService.generateguid();
               dashBoardService.settopproductsmaxvalue(0);  
                  $scope.barChartData = [];
                  $scope.TopProductsspinner=false;
                  for (var i = 0; i < $scope.topProductsbyRT.length; i++) {
                   $scope.indexvalue=0.00;
                var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyRT[i].upc},true);
                   if(categoryfound.length>0){
                   }
                   else{

                    var obj={
                      "category_description":""
                    }
                    categoryfound.push(obj);
                   }
                 $scope.generatedId = dashBoardService.generateguid();
                 
                 var results = $filter('filter')($scope.topProductsbyCT,{id : $scope.topProductsbyRT[i].id}, true);
                 if(results){
                 if(results.length>0){

                   if(results[0].amt>=0){
                    $scope.indexvalue = $scope.topProductsbyRT[i].amt / results[0].amt;
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);
                  }

                   if($scope.indexvalue>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";

                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
                  var amt1=(results[0].amt>=0)?results[0].amt:0;

              var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');

          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')(amt,2),
              "amt1":$filter('number')(amt1,2),
              "value":amt,
              "value1":amt1,
              'storename': $scope.productName,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue,
              "itemNumber":$scope.topProductsbyRT[i].upc,
              "deptId":$scope.topProductsbyRT[i].deptId,
              "deptName": $scope.topProductsbyRT[i].deptName,
              "category":categoryfound[0].category_description,
              "labelcolor":$scope.labelcolor,
              "arrow":$scope.arrow,
              "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
              "msuRP":$scope.topProductsbyRT[i].msu,
              "quantityCP":results[0].quantity+" ("+results[0].size+")",
              "msuCP":results[0].msu,
              "lastsoldDateRP":lastsoldDateRP,
              "lastsoldDateCP":lastsoldDateCP

            };
             $scope.barChartData.push(object);
          }
          else{
            var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
              var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');

            $scope.labelcolor="red";
            $scope.arrow="\u2193";

              if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber":$scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
         
            $scope.barChartData.push(object);

          }
        }
          else{

           var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
            $scope.labelcolor="red";
            $scope.arrow="\u2193";

          var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
             
             if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber":$scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);
        }
     // }

      }

     /* for(var k=0;k<$scope.topProductsbyCT.length;k++){

          var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyCT[k].upc},true);
   

       $scope.generatedId = dashBoardService.generateguid();


       var results = $filter('filter')($scope.topProductsbyRT, {id : $scope.topProductsbyCT[k].id}, true);
       
       if(results.length==0){
        $scope.indexvalue=0.00;
        var amt1=($scope.topProductsbyCT[k].amt>=0)?$scope.topProductsbyCT[k].amt:0;

        var object = {
          "color": "#4C98CF",
          "color1": "#7F2891",
          "amt": 0,
          "amt1":$filter('number')(amt1,2),
          "value":amt,
          "value1":0,
          'storename': $scope.topProductsbyCT[k].id,
          "reporttime":$scope.totalreporttime,
          "comapretime":$scope.totalcomparetime,
          "Index":$scope.indexvalue,
         "itemNumber":$scope.topProductsbyCT[k].upc,
          "deptId":$scope.topProductsbyCT[k].deptId,
          "deptName": $scope.topProductsbyCT[k],
           "category":categoryfound[0].category_description
        };
         
          $scope.barChartData.push(object);


      }
      
    }*/

                  $scope.$applyAsync();
                  $scope.TopProducts = true;

                  dashBoardService.setcacheData('barChartData',$scope.barChartData);

                }, function (response) {
                  console.log(response);
                }
                );
  }

  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
    "filters": {
      "items.mfgId" : [$scope.mfgId],
      "retailerId":$scope.RetailerIds
     
    }
  }
  dashBoardService.getbestselleresbyallretailer(data).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    $scope.TopProductsbyReportTimeforcpgforretailer();
  }, function (response) {
    console.log(response);
  }
  );

      }

      $scope.topProductsFunctionByRetailerforCpg = function () {
         $scope.TopProductsspinner=true;
          $scope.TopProductsbyReportTime = function () {
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel": "L",
              "bucketType": "upc",
              "filters": {
                "items.mfgId" : [$scope.mfgId]
                
              }
            }
            $scope.TopProducts = false;

            dashBoardService.getbestselleresbyretailerforcpg(data).then(function (response) {
              $scope.topProductsbyRT = response.data.data;
              $scope.hidespinner();
              $('#userLoaderDiv').hide();

              $scope.topproductsId = dashBoardService.generateguid();
               dashBoardService.settopproductsmaxvalue(0);
                  $scope.barChartData = [];
                  $scope.TopProductsspinner=false;
      for (var i = 0; i < $scope.topProductsbyRT.length; i++) {
        var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyRT[i].upc},true);
              if(categoryfound.length>0){
                }
              else{
              var obj={
                      "category_description":""
                    }
                    categoryfound.push(obj);
                }


                   $scope.indexvalue=0.00;
                $scope.generatedId = dashBoardService.generateguid();
                  
                 var results = $filter('filter')($scope.topProductsbyCT,{id : $scope.topProductsbyRT[i].id}, true);
                 if(results){
                 if(results.length>0){

                   if(results[0].amt>=0){

                    $scope.indexvalue = $scope.topProductsbyRT[i].amt / results[0].amt;
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);

                  }

                  if($scope.indexvalue>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";

                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

                  }
                  var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
                  var amt1=(results[0].amt>=0)?results[0].amt:0;
         var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
         var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');

        if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":$filter('number')(amt1,2),
            "value":amt,
            "value1":amt1,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber":$scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "quantityCP":results[0].quantity+" ("+results[0].size+")",
            "msuCP":results[0].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":lastsoldDateCP

          };
            $scope.barChartData.push(object);
        }
        else{

           var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
          $scope.labelcolor="red";
         var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
        
         if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

         var object = {
          "color": "#4C98CF",
          "color1": "#7F2891",
          "amt": $filter('number')(amt,2),
          "amt1":0.00,
          "value":amt,
          "value1":0,
          'storename': $scope.productName,
          "reporttime":$scope.totalreporttime,
          "comapretime":$scope.totalcomparetime,
          "Index":$scope.indexvalue,
          "itemNumber":$scope.topProductsbyRT[i].upc,
          "deptId":$scope.topProductsbyRT[i].deptId,
          "deptName": $scope.topProductsbyRT[i].deptName,
          "category":categoryfound[0].category_description,
          "labelcolor":$scope.labelcolor,
          "arrow":$scope.arrow,
          "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
          "msuRP":$scope.topProductsbyRT[i].msu,
          "lastsoldDateRP":lastsoldDateRP,
          "lastsoldDateCP":0
        };
          $scope.barChartData.push(object);
        }
      }
        else{

         var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
          $scope.labelcolor="red";
         var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
           
           if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }


         var object = {
          "color": "#4C98CF",
          "color1": "#7F2891",
          "amt": $filter('number')(amt,2),
          "amt1":0.00,
          "value":amt,
          "value1":0,
          'storename': $scope.productName,
          "reporttime":$scope.totalreporttime,
          "comapretime":$scope.totalcomparetime,
          "Index":$scope.indexvalue,
          "itemNumber":$scope.topProductsbyRT[i].upc,
          "deptId":$scope.topProductsbyRT[i].deptId,
          "deptName": $scope.topProductsbyRT[i].deptName,
          "category":categoryfound[0].category_description,
          "labelcolor":$scope.labelcolor,
          "arrow":$scope.arrow,
          "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
          "msuRP":$scope.topProductsbyRT[i].msu,
          "lastsoldDateRP":lastsoldDateRP,
          "lastsoldDateCP":0

        };
          $scope.barChartData.push(object);
      }
    }

    /*for(var k=0;k<$scope.topProductsbyCT.length;k++){

      $scope.generatedId = dashBoardService.generateguid();

           var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyCT[k].upc},true);


     var results = $filter('filter')($scope.topProductsbyRT, {id : $scope.topProductsbyCT[k].id}, true);
     
     if(results.length==0){
      $scope.indexvalue=0.00;
      var amt1=($scope.topProductsbyCT[k].amt>=0)?$scope.topProductsbyCT[k].amt:0;

      var object = {
        "color": "#4C98CF",
        "color1": "#7F2891",
       "amt": 0,
         "amt1":$filter('number')(amt1,2),
          "value":amt,
           "value1":0,
        'storename': $scope.topProductsbyCT[k].id,
        "reporttime":$scope.totalreporttime,
        "comapretime":$scope.totalcomparetime,
        "Index":$scope.indexvalue,
        "itemNumber":$scope.topProductsbyCT[k].upc,
          "deptId":$scope.topProductsbyCT[k].deptId,
          "deptName": $scope.topProductsbyCT[k],
         "category":categoryfound[0].category_description
      };
      
      $scope.barChartData.push(object);


    }
    
  }*/

                  $scope.$applyAsync();
                  $scope.TopProducts = true;

                  dashBoardService.setcacheData('barChartData',$scope.barChartData);

                }, function (response) {
                  console.log(response);
                }
                );
  }
  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
    "filters": {
      "items.mfgId" : [$scope.mfgId]
      
    }
  }
  dashBoardService.getbestselleresbyretailerforcpg(data).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    $scope.TopProductsbyReportTime();
  }, function (response) {
    console.log(response);
  }
  );
      }

      $scope.topProductsFunctionByByStoreforcpg = function () {

          $scope.TopProductsspinner=true;
       
          $scope.TopProductsbyReportTime = function () {
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel": "L",
              "bucketType": "upc",
              "filters": {
                "items.mfgId" : [$scope.mfgId]
                              
              }
            }
            $scope.TopProducts = false;
            dashBoardService.getbestselleresbystoreforcpg(data).then(function (response) {
              $scope.topProductsbyRT = response.data.data;
              $scope.hidespinner();
              $scope.topproductsId = dashBoardService.generateguid();
              $scope.barChartData = [];
              $scope.TopProductsspinner=false;
        for (var i = 0;i<$scope.topProductsbyRT.length;i++){
           var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyRT[i].upc},true);
               
                 if(categoryfound.length>0){
                   }
                   else{
                    var obj={
                      "category_description":""
                    }
                    categoryfound.push(obj);
                   }
                $scope.indexvalue=0.00;
                $scope.generatedId = dashBoardService.generateguid();
                dashBoardService.settopproductsmaxvalue(0);  
                 
                 var results = $filter('filter')($scope.topProductsbyCT,{id : $scope.topProductsbyRT[i].id}, true);
                 if(results){
                 if(results.length>0){
                   if(results[0].amt>=0){
                    $scope.indexvalue = $scope.topProductsbyRT[i].amt / results[0].amt;
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);
                  }
                  if($scope.indexvalue>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

                  }
                  var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
                  var amt1=(results[0].amt>=0)?results[0].amt:0;

          var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
         var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
         var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')(amt,2),
              "amt1":$filter('number')(amt1,2),
              "value":amt,
              "value1":amt1,
              'storename': $scope.productName,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue,
              "itemNumber":$scope.topProductsbyRT[i].upc,
              "deptId":$scope.topProductsbyRT[i].deptId,
              "deptName": $scope.topProductsbyRT[i].deptName,
              "category":categoryfound[0].category_description,
              "labelcolor":$scope.labelcolor,
              "arrow":$scope.arrow,
              "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
              "msuRP":$scope.topProductsbyRT[i].msu,
              "quantityCP":results[0].quantity+" ("+results[0].size+")",
              "msuCP":results[0].msu,
              "lastsoldDateRP":lastsoldDateRP,
              "lastsoldDateCP":lastsoldDateCP


            };
               $scope.barChartData.push(object);
          }
          else{
            var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
           var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
           $scope.labelcolor="red";
           $scope.arrow="\u2193";
          var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
            
                
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber": $scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);

          }
        }
          else{
           var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
           var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
           $scope.labelcolor="red";
           $scope.arrow="\u2193";
          var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
           if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber": $scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);
        }

      }

      /*for(var k=0;k<$scope.topProductsbyCT.length;k++){


                  var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyCT[k].upc},true);
   

       $scope.generatedId = dashBoardService.generateguid();



       var results = $filter('filter')($scope.topProductsbyRT, {id : $scope.topProductsbyCT[k].id}, true);
       
       if(results.length==0){
        $scope.indexvalue=0.00;
        var amt1=($scope.topProductsbyCT[k].amt>=0)?$scope.topProductsbyCT[k].amt:0;
        var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyCT[k].id}, true);


        var object = {
          "color": "#4C98CF",
          "color1": "#7F2891",
          "amt": 0,
          "amt1":$filter('number')(amt1,2),
          "value":amt,
          "value1":0,
          'storename': $scope.topProductsbyCT[k].id,
          "reporttime":$scope.totalreporttime,
          "comapretime":$scope.totalcomparetime,
          "Index":$scope.indexvalue,
          "itemNumber":$scope.topProductsbyCT[k].upc,
          "deptId":$scope.topProductsbyCT[k].deptId,
          "deptName": $scope.topProductsbyCT[k],
           "category":categoryfound[0].category_description
        };
        
          $scope.barChartData.push(object);

      }
      
    }
*/
                  $scope.$applyAsync();
                  $scope.TopProducts = true;
    
                  dashBoardService.setcacheData('barChartData',$scope.barChartData);

                }, function (response) {
                  console.log(response);
                }
                );
        }

  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
    "filters": {
     "items.mfgId" : [$scope.mfgId]
   
     
   }
  }
  dashBoardService.getbestselleresbystoreforcpg(data).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    $scope.TopProductsbyReportTime();
  }, function (response) {
    console.log(response);
  }
  );
 
      }

 /******** worst sellers for cpg*******************/
$scope.worstsellersbyallreatiler = function () {
          
          $scope.worstsalesspinner=true;
            $scope.worstsellersbyreporttimebyallreatiler = function () {
              var data = {
                "aggTimeUnit": "1d",
                "startTime": $scope.SalesDataReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel": "L",
                "bucketType": "name",
                "filters": {
                  "items.mfgId" : [$scope.mfgId]
                }
              }
              $scope.worstsellers = false;
             
              dashBoardService.getworstselleresbyallretailer(data).then(function (response) {
               $scope.worstproductsbyRT = response.data.data;
               $scope.worstsellersId = dashBoardService.generateguid();
               $scope.worstsellersdata = [];

            if($scope.worstproductsbyRT==undefined||$scope.worstProductsbyCT==undefined){
                 $scope.worstsalesspinner=false;
              }
            if($scope.worstproductsbyRT.length==0){
                 $scope.noTopProductsLabel=true;
            }
                dashBoardService.setworstsellersmaxvalue(0);
             for (var i = 0; i < 5; i++) {

               $scope.indexvalue=0.00;
                 if($scope.worstproductsbyRT[i]){
                 var results = $filter('filter')($scope.worstProductsbyCT,{id : $scope.worstproductsbyRT[i].id}, true);
               var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.worstproductsbyRT[i].upc},true);

                  if(categoryfound.length>0){
                   }
                   else{
                    //console.log("id name...",$scope.worstproductsbyRT[i].id);
                    var obj={
                      "category_description":""
                    }
                    categoryfound.push(obj);
                   }

                   if(results){
                 if(results.length>0){
                   if(results[0].amt){
                    $scope.indexvalue = $scope.worstproductsbyRT[i].amt / results[0].amt;
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);
                  }
                  else{
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);
                  }

                  if($scope.indexvalue>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.worstproductsbyRT[i].amt;
                  var amt1=results[0].amt;

                        var object = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.worstproductsbyRT[i].id,
                          "reporttime":$scope.totalreporttime,
                          "comapretime":$scope.totalcomparetime,
                          "Index":$scope.indexvalue,
                          "itemNumber":$scope.worstproductsbyRT[i].upc,
                          "deptId":$scope.worstproductsbyRT[i].deptId,
                          "deptName": $scope.worstproductsbyRT[i].deptName,
                          "category":categoryfound[0].category_description,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                        $scope.worstsellersdata.push(object);
                      }
                      else{
                        $scope.indexvalue=$scope.indexvalue.toFixed(2);
                        var amt=$scope.worstproductsbyRT[i].amt;
                        $scope.labelcolor="red";
                        $scope.arrow="\u2193";

                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": $scope.worstproductsbyRT[i].deptName,
                        "category":categoryfound[0].category_description,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow
                      };
                        $scope.worstsellersdata.push(object);
                      }
                    }
                      else{

                        $scope.indexvalue=$scope.indexvalue.toFixed(2);

                       var amt=$scope.worstproductsbyRT[i].amt;
                       $scope.labelcolor="red";
                       $scope.arrow="\u2193";

                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": $scope.worstproductsbyRT[i].deptName,
                        "category":categoryfound[0].category_description,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow

                       
                      };
                     
                        $scope.worstsellersdata.push(object);
                    }
                  }
                }
                $scope.$applyAsync();
                $scope.worstsellers = true;
                $scope.worstsalesspinner=false;

                dashBoardService.setcacheData('worstsellersdata',$scope.worstsellersdata);

                }, function (response) {
                  console.log(response);
                }
                );
            }

  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "name",
    "filters": {
      "items.mfgId" : [$scope.mfgId]
     
    }
  }
  dashBoardService.getworstselleresbyallretailer(data).then(function (response) {
    $scope.worstProductsbyCT = response.data.data;
    $scope.worstsellersbyreporttimebyallreatiler();
  }, function (response) {
    console.log(response);
  }
  );
  }

      $scope.worstsellersbyretailerforcpg = function () {

         $scope.worstsalesspinner=true;

          $scope.worstsellersbyreporttimeforretailer = function () {
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel": "L",
              "bucketType": "name",
              "filters": {
                "items.mfgId" : [$scope.mfgId]
                
              }
            }

              $scope.worstsellers = false;

            dashBoardService.getworstselleresbyretailerforcpg(data).then(function (response) {
              $scope.worstproductsbyRT = response.data.data;
              $scope.worstsellersId = dashBoardService.generateguid();
              $scope.worstsellersdata = [];
          if($scope.worstproductsbyRT==undefined||$scope.worstProductsbyCT==undefined){
              $scope.worstsalesspinner=false;
            }
          if($scope.worstproductsbyRT.length==0){
              $scope.noTopProductsLabel=true;
            }
            dashBoardService.setworstsellersmaxvalue(0);
             for(var i =0; i<5;i++){
               $scope.indexvalue=0.00;
               if($scope.worstproductsbyRT[i]){
             var results = $filter('filter')($scope.worstProductsbyCT,{id : $scope.worstproductsbyRT[i].id}, true);
             var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.worstproductsbyRT[i].upc},true);
              if(categoryfound.length>0){
                }
              else{
                var obj={
                    "category_description":""
                    }
                    categoryfound.push(obj);
              }

              if(results){
              if(results.length>0){
              if(results[0].amt){
                  $scope.indexvalue = $scope.worstproductsbyRT[i].amt / results[0].amt;
                  $scope.indexvalue=$scope.indexvalue.toFixed(2);
              }
              if($scope.indexvalue>=1){
                   $scope.labelcolor="green";
                  $scope.arrow="\u2191";
              }
              else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
              }
                  var amt=$scope.worstproductsbyRT[i].amt;
                  var amt1=results[0].amt;

                        var object = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.worstproductsbyRT[i].id,
                          "reporttime":$scope.totalreporttime,
                          "comapretime":$scope.totalcomparetime,
                          "Index":$scope.indexvalue,
                          "itemNumber":$scope.worstproductsbyRT[i].upc,
                          "deptId":$scope.worstproductsbyRT[i].deptId,
                          "deptName": $scope.worstproductsbyRT[i].deptName,
                          "category":categoryfound[0].category_description,
                          "labelcolor":$scope.labelcolor,
                           "arrow":$scope.arrow
                        };
                        $scope.worstsellersdata.push(object);
                      }
                      else{

                       var amt=$scope.worstproductsbyRT[i].amt;
                       $scope.indexvalue=$scope.indexvalue.toFixed(2);
                      $scope.labelcolor="red";
                      $scope.arrow="\u2193";

                       var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                       
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": $scope.worstproductsbyRT[i].deptName,
                        "category":categoryfound[0].category_description,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow
                       
                      };
                        $scope.worstsellersdata.push(object);
                      }
                    }
                      else{
                       var amt=$scope.worstproductsbyRT[i].amt;
                       $scope.indexvalue=$scope.indexvalue.toFixed(2);
                       $scope.labelcolor="red";
                       $scope.arrow="\u2193";
                       var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": $scope.worstproductsbyRT[i].deptName,
                        "category":categoryfound[0].category_description,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow
                      };
                        $scope.worstsellersdata.push(object);
                    }
                  }
                }
               // console.log("bar chart data...",$scope.worstsellersdata);
                $scope.$applyAsync();
                $scope.worstsellers = true;
                $scope.worstsalesspinner=false;
                dashBoardService.setcacheData('worstsellersdata',$scope.worstsellersdata);
                }, function (response) {
                  console.log(response);
                }
                );
               }

  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "name",
    "filters": {
      "items.mfgId" : [$scope.mfgId]
      
    }
  }
  dashBoardService.getworstselleresbyretailerforcpg(data).then(function (response) {
    $scope.worstProductsbyCT = response.data.data;
    $scope.worstsellersbyreporttimeforretailer();
  }, function (response) {
    console.log(response);
  }
  );
      }

      $scope.worstsellersbystoreforcpg = function () {
         $scope.worstsalesspinner=true;
          $scope.worstsellersbyreporttimeforstore = function () {
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel": "L",
              "bucketType": "name",
              "filters": {
              "items.mfgId" : [$scope.mfgId]
              }
            }
              $scope.worstsellers = false;
           
            dashBoardService.getworstselleresbystoreforcpg(data).then(function (response) {
            $scope.worstproductsbyRT = response.data.data;

          $scope.worstsellersId = dashBoardService.generateguid();
          $scope.worstsellersdata = [];
          if($scope.worstproductsbyRT==undefined||$scope.worstProductsbyCT==undefined){
            $scope.worstsalesspinner=false;
          }
          if($scope.worstproductsbyRT.length==0){
            $scope.noTopProductsLabel=true;
           }
            dashBoardService.setworstsellersmaxvalue(0);
         for (var i=0;i<5;i++) {
               $scope.indexvalue=0.00;
         if($scope.worstproductsbyRT[i]){
          var results = $filter('filter')($scope.worstProductsbyCT,{id : $scope.worstproductsbyRT[i].id}, true);
          var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.worstproductsbyRT[i].upc},true);
                if(categoryfound.length>0){
                   }
                else{
                 var obj={
                      "category_description":""
                  }
                categoryfound.push(obj);
                }
                if(results){
                 if(results.length>0){
                   if(results[0].amt){
                    $scope.indexvalue = $scope.worstproductsbyRT[i].amt / results[0].amt;
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);
                  }
                   if($scope.indexvalue>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.worstproductsbyRT[i].amt;
                  var amt1=results[0].amt;
                  var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                  var object = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.worstproductsbyRT[i].id,
                          "reporttime":$scope.totalreporttime,
                          "comapretime":$scope.totalcomparetime,
                          "Index":$scope.indexvalue,
                          "itemNumber":$scope.worstproductsbyRT[i].upc,
                          "deptId":$scope.worstproductsbyRT[i].deptId,
                          "deptName": $scope.worstproductsbyRT[i].deptName,
                          "category":categoryfound[0].category_description,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                        $scope.worstsellersdata.push(object);
                      }
                      else{
                     var amt=$scope.worstproductsbyRT[i].amt;
                     $scope.indexvalue=$scope.indexvalue.toFixed(2); 
                     $scope.labelcolor="red"; 
                     $scope.arrow="\u2193";
                     var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": $scope.worstproductsbyRT[i].deptName,
                        "category":categoryfound[0].category_description,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow
                      };
                        $scope.worstsellersdata.push(object);
                      }
                    }
                      else{
                      var amt=$scope.worstproductsbyRT[i].amt;
                     $scope.indexvalue=$scope.indexvalue.toFixed(2); 
                     $scope.labelcolor="red"; 
                     $scope.arrow="\u2193";
 
                       var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.worstproductsbyRT[i].id}, true);
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.worstproductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":$scope.worstproductsbyRT[i].upc,
                        "deptId":$scope.worstproductsbyRT[i].deptId,
                        "deptName": $scope.worstproductsbyRT[i].deptName,
                        "category":categoryfound[0].category_description,
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow
                      };
                        $scope.worstsellersdata.push(object);
                    }
                  }
                }
                //console.log("bar chart data...",$scope.worstsellersdata);
                $scope.$applyAsync();
                $scope.worstsellers = true;
                $scope.worstsalesspinner=false;
                dashBoardService.setcacheData('worstsellersdata',$scope.worstsellersdata);
                }, function (response) {
                  console.log(response);
                }
                );
             }

  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "name",
    "filters": {
     "items.mfgId" : [$scope.mfgId]
     
   }
  }
  dashBoardService.getworstselleresbystoreforcpg(data).then(function (response) {
     $scope.worstProductsbyCT = response.data.data;
    $scope.worstsellersbyreporttimeforstore();
  }, function (response) {
    console.log(response);
  }
  );
 
      }

 /******* end of worst sellers for cpg**************/

      $scope.GettoptenDepartmentsByAllRetailer = function () {
        $scope.showpiechartspinner=true;
        $scope.topdeptsByReportTimeforcpgbyretailer = function () {
          var RTdonutChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel" : "L",
            "filters": {
              "items.mfgId" : [$scope.mfgId],
              "retailerId" :$scope.RetailerIds
            },
            "bucketType" : "categoryDesc"
          }

          $scope.showpiechart = false;
         // console.log("status....",$scope.showpiechart );
         dashBoardService.GettopDepartmentsByAllRetailer(RTdonutChartData).then(function (response) {
          $scope.topdepartmentsData = [];
          $scope.showpiechartspinner=false;
          $scope.topdepartmentsId = dashBoardService.generateguid();
          $scope.topDepartmentsDatabyRP=response.data.data;

            $scope.donutcharttotalbyRT=response.data.total;

          if($scope.donutcharttotal>0){
               $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;

            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
              }
              else{
                $scope.donutchartindex=0.00;
                  $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
              }
               if($scope.donutchartindex>=1){
              $scope.indexcolor="green";
            }
            else{
              $scope.indexcolor="red";
            }

          for (var i = 0; i < $scope.topDepartmentsDatabyRP.length; i++) {

           $scope.indexvalue=0.00;

           var results = $filter('filter')($scope.topDepartmentsDatabyCP, {id : $scope.topDepartmentsDatabyRP[i].id}, true);
           if(results){
           if(results.length>0){

             if(results[0].amt>=0){
               $scope.indexvalue = $scope.topDepartmentsDatabyRP[i].amt / results[0].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }

             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
             "amt1": $filter('number')(results[0].amt,2),
             "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":results[0].amt,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
          else{

            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
            "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
            "amt1": 0.00,
            "value":$scope.topDepartmentsDatabyRP[i].amt,
            "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);

          }
        }
          else{

            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
            "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
            "amt1": 0.00,
            "value":$scope.topDepartmentsDatabyRP[i].amt,
            "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }

        if($scope.topDepartmentsDatabyCP){
        for(var k=0;k<$scope.topDepartmentsDatabyCP.length;k++){

         var results = $filter('filter')($scope.topDepartmentsDatabyRP, {id : $scope.topDepartmentsDatabyCP[k].id}, true);
         
         if(results.length==0){
          $scope.indexvalue=0.00;
          
          var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": 0.00,
            "amt1":$filter('number')($scope.topDepartmentsDatabyCP[k].amt,2),
            "value":0,
            "value1":$scope.topDepartmentsDatabyCP[k].amt,
            "storename": $scope.topDepartmentsDatabyCP[k].id,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
      }
    }

    if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
     }
            $scope.$applyAsync();
            $scope.showpiechart = true;
         
            dashBoardService.setcacheData('topdepartmentsData',$scope.topdepartmentsData);

          }, function (response) {
            console.log(response);
          }
          );
       }

       var CPdonutChartData = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "filters": {
          "items.mfgId" : [$scope.mfgId],
          "retailerId" :$scope.RetailerIds
        },
        "bucketType" : "categoryDesc"
      }

      dashBoardService.GettopDepartmentsByAllRetailer(CPdonutChartData).then(function (response) {
        $scope.topDepartmentsDatabyCP = response.data.data;
        $scope.$applyAsync();
         $scope.donutcharttotal=response.data.total;
        $scope.topdeptsByReportTimeforcpgbyretailer();
      }, function (response) {
        console.log(response);
      }
      );

    }


    $scope.GettoptenDepartmentsByRetailerforCpg = function () {
            $scope.showpiechartspinner=true;
  
      $scope.topdeptsByReportTime = function () {
        var RTdonutChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel" : "L",
          "filters": {
            "items.mfgId" : [$scope.mfgId]
          },
          "bucketType" : "categoryDesc"
        }

        $scope.showpiechart = false;
        dashBoardService.GettoptenDepartments(RTdonutChartData).then(function (response) {
          $scope.topdepartmentsData = [];
          $scope.showpiechartspinner=false;
          $scope.topdepartmentsId = dashBoardService.generateguid();
          $scope.topDepartmentsDatabyRP=response.data.data;
          $scope.donutcharttotalbyRT=response.data.total;
          if($scope.donutcharttotal>0){
          $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;
          $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          }
          else{
                $scope.donutchartindex=0.00;
                  $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          }
          if($scope.donutchartindex>=1){
              $scope.indexcolor="green";
          }
          else{
              $scope.indexcolor="red";
          }

          for (var i = 0; i < $scope.topDepartmentsDatabyRP.length; i++) {

           $scope.indexvalue=0.00;

           var results = $filter('filter')($scope.topDepartmentsDatabyCP, {id : $scope.topDepartmentsDatabyRP[i].id}, true);
           if(results){
           if(results.length>0){

             if(results[0].amt>=0){
               $scope.indexvalue = $scope.topDepartmentsDatabyRP[i].amt / results[0].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }

             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": $filter('number')(results[0].amt,2),
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":results[0].amt,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);

          }
        }
          else{

            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }

        }
        if($scope.topDepartmentsDatabyCP){

        for(var k=0;k<$scope.topDepartmentsDatabyCP.length;k++){

         var results = $filter('filter')($scope.topDepartmentsDatabyRP, {id : $scope.topDepartmentsDatabyCP[k].id}, true);
         
         if(results.length==0){
          $scope.indexvalue=0.00;
          
          var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
             "amt": 0.00,
            "amt1":$filter('number')($scope.topDepartmentsDatabyCP[k].amt,2),
            "value":0,
            "value1":$scope.topDepartmentsDatabyCP[k].amt,
            "storename": $scope.topDepartmentsDatabyCP[k].id,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
      }
    }
    if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
     }

            $scope.$applyAsync();
            $scope.showpiechart = true;
   
            dashBoardService.setcacheData('topdepartmentsData',$scope.topdepartmentsData);

          }, function (response) {
            console.log(response);
          }
          );
      }

      var CPdonutChartData = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "filters": {
          "items.mfgId" : [$scope.mfgId]
        },
        "bucketType" : "categoryDesc"
      }

      dashBoardService.GettoptenDepartments(CPdonutChartData).then(function (response) {
        $scope.topDepartmentsDatabyCP = response.data.data;
        $scope.$applyAsync();
         $scope.donutcharttotal=response.data.total;
        $scope.topdeptsByReportTime();
      }, function (response) {
        console.log(response);
      }
      );
    }

        ///retailer functions for cpg.............................

        $scope.SalesPerformanceByStoreIdForCpg = function () {

          //$scope.showspinner();
          $scope.SalesPerformancespinner=true;
          $scope.SalesPerformanceByStoreIdbyRTforCpg = function () {
            $scope.SalesPerformance = false;
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "filters": {
                "items.mfgId" : [$scope.mfgId]
              }
            }
            dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
              $scope.total =  response.data.total;
               $scope.SalesPerformancespinner=false;

              $filter('number')($scope.total, $scope.total.length)

              $scope.rpIndextotal = parseFloat(response.data.total);
              if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
                $scope.spIndex = 0;
              }
              else {
                $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
                $scope.spIndex = $scope.spIndex.toFixed(2);
              }
              $scope.salesperformanceId = dashBoardService.generateguid();
              $scope.LineChartData1 = [];
              $scope.j=1;
              for (var i = 0; i < response.data.data.length; i++) {

                if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");

             }
             else{
               
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
                $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");

               $scope.j++;

             }

             if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){

                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if($scope.Cpdata[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": $scope.Cpdata[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
              }
              $scope.$applyAsync();
              $scope.SalesPerformance = true;
             

             // $scope.hidespinner();
              dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
              dashBoardService.setcacheData('spIndex',$scope.spIndex);
              dashBoardService.setcacheData('total',response.data.total);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "filters": {
              "items.mfgId" : [$scope.mfgId]
            }
          }
          dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
            $scope.spIndextotal = parseFloat(response.data.total);
                $scope.Cpdata=response.data.data;

            $scope.SalesPerformanceByStoreIdbyRTforCpg();
          }, function (response) {
            console.log(response);
          }
          );
        }


        $scope.shareOfCategoryByStoreforCpg= function () {
          $scope.ShoppingTripsspinner=true;
          $scope.shareOfCategoryByRTforCpg = function () {


            var ShoppingTripsdata = {

              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : sessionStorage.user.toString(),
              "sid" : sessionStorage.storeId.toString()

            }

            $scope.ShoppingTrips = false;
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
              $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              if(response.data==undefined||$scope.shoppintripsCpData==undefined){
                $scope.ShoppingTripsspinner=false;
              }
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
              $scope.j=1;
              for(var i =0;i<response.data.data.length;i++) {
            if(i==0){
            $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
            $scope.ResultDate=$scope.date;
            $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
              $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
              $scope.ResultDate=$scope.nextDate;
              $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
              $scope.j++;
             }

             if(response.data.data&&$scope.shoppintripsCpData){
               
              if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
             if(parseFloat(response.data.data[i].percentage)>0){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
             }
              }
              else if(response.data.data[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                 }
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
            }
             }
              }
              $scope.$applyAsync();
              $scope.ShoppingTrips = true;

             $scope.ShoppingTripsspinner=false;

              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);


            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {

            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : sessionStorage.user.toString(),
            "sid" : sessionStorage.storeId.toString()

          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
        $scope.shoppintripsCpData=response.data.data;

            $scope.shareOfCategoryByRTforCpg();
          }, function (response) {
            console.log(response);
          }
          );
        }
        $scope.ShareOfBasketByStoreforCpg = function () {

          $scope.AvgBasketspinner=true;
          $scope.avgBasketByRTforCpg = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : sessionStorage.user.toString(),
              "sid" : sessionStorage.storeId.toString()

            }

            $scope.AvgBasket = false;
            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
              $scope.LineChartData3 = [];
              if(response.data==undefined||$scope.avgBasketDataByCP==undefined){
              $scope.AvgBasketspinner=false;
              }
              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }
               $scope.j=1;
             for (var i =0;i<response.data.data.length;i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }

            if(response.data.data&&$scope.avgBasketDataByCP){
            if(response.data.data[i]&&$scope.avgBasketDataByCP){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
          else if(response.data.data[i]){
          var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){
          var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
          else{
          if(response.data.data[i]){
          var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
           }
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              $scope.AvgBasketspinner=false;

              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : sessionStorage.user.toString(),
            "sid" : sessionStorage.storeId.toString()
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
            $scope.avgBasketTotalByCP = parseFloat(response.data.total);
            $scope.avgBasketDataByCP=response.data.data;
            $scope.avgBasketByRTforCpg();
          }, function (response) {
            console.log(response);
            $scope.LineChartData3 = [];
          }
          );
        }
        $scope.GettoptenDepartmentsByStoreforCpg = function () {

          $scope.showpiechartspinner=true;
          $scope.topdeptsByReportTimeforcpg = function () {
            var RTdonutChartData = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "categoryDesc",
              "filters": {
                "items.mfgId" : [$scope.mfgId]
              }
            }

            $scope.showpiechart = false;
            dashBoardService.GettoptenDepartmentsByStoreId(RTdonutChartData).then(function (response) {
              $scope.topdepartmentsData = [];
              $scope.topdepartmentsId = dashBoardService.generateguid();
              $scope.topDepartmentsDatabyRP=response.data.data;
               $scope.donutcharttotalbyRT=response.data.total;
              if($scope.donutcharttotal>0){
               $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;
            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
              }
              else{
                $scope.donutchartindex=0.00;
                  $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
              }
               if($scope.donutchartindex>=1){
              $scope.indexcolor="green";
            }
            else{
              $scope.indexcolor="red";
            }

          for (var i = 0;i<$scope.topDepartmentsDatabyRP.length;i++) {
           $scope.indexvalue=0.00;
           var results = $filter('filter')($scope.topDepartmentsDatabyCP, {id : $scope.topDepartmentsDatabyRP[i].id}, true);
            if(results){
           if(results.length>0){
          if(results[0].amt>=0){
              $scope.indexvalue = $scope.topDepartmentsDatabyRP[i].amt / results[0].amt;
              $scope.indexvalue=$scope.indexvalue.toFixed(2);
          }
             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": $filter('number')(results[0].amt,2),
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":results[0].amt,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
          else{
             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }
        if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
       }
            $scope.$applyAsync();
            $scope.showpiechart = true;
            $scope.showpiechartspinner=false;
            dashBoardService.setcacheData('topdepartmentsData',$scope.topdepartmentsData);
          }, function (response) {
            console.log(response);
          }
          );
          }

          var CPdonutChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "bucketLevel" : "L",
            "bucketType" : "categoryDesc",
            "filters": {
              "items.mfgId" : [$scope.mfgId]
            }
          }

          dashBoardService.GettoptenDepartmentsByStoreId(CPdonutChartData).then(function (response) {
          console.log("data wt is coming...",response.data.data);
            $scope.topDepartmentsDatabyCP = response.data.data;
            $scope.$applyAsync();
            $scope.donutcharttotal=response.data.total;
            $scope.topdeptsByReportTimeforcpg();
          }, function (response) {
            console.log(response);
          }
          );

        }

        $scope.getallitems=function(){
      dashBoardService.getallitems().then(function (response) {
        $scope.allitems=response.data;
      },function(response){
      });
        }

        $scope.cpgFunctions=function(){
          dashBoardService.createcache();
          $scope.selectedcpg=dashBoardService.getsavestoreselected();
          $scope.selecteddma=dashBoardService.getselectedDMA(); 
          $scope.savedBrand=dashBoardService.getselectedBrand();
         // $scope.selectedBrand= $scope.savedBrand; 
         $scope.CampaignListofCpg(); 
          if($scope.selectedcpg.name=="All Retailers" && $scope.selecteddma ==null){ 
             if($scope.savedBrand.brand_name =="All Brands"){               
                    $scope.SalesPerformanceByAllRetailer();
                    $scope.shareOfCategoryByAllRetailers();
                    $scope.ShareOfBasketByAllRetailer();
                    $scope.topProductsFunctionByAllRetailer();
                    //$scope.worstsellersbyallreatiler();
                    $scope.GettoptenDepartmentsByAllRetailer();
                    $scope.geosalesDataforCpg();
                    $scope.topSalesRegionsforcpg();
                  
                    $scope.topstoresforAllRetailersforCPG();
               }else{
                      $scope.SalesPerformanceBySingleBrandforcpg($scope.selectedBrand.brandid);
                      $scope.bestsellersbySingleBrandforCPG($scope.selectedBrand.brandid);
                      $scope.categoriesbySingleBrandforCPG($scope.selectedBrand.brandid);
                      $scope.topsalesRegionsBySingleBrandforCPG($scope.selectedBrand.brandid);
                      $scope.topstoresbySingleBrandforCPG($scope.selectedBrand.brandid);
                      $scope.geosalesdatabySingleBrandforCPG($scope.selectedBrand.brandid);
                      $scope.shareOfCategoryByAllRetailersforBRAND($scope.selectedBrand.brandid);
                      $scope.ShareOfBasketByAllRetailerforBRAND($scope.selectedBrand.brandid); 
               }     
          }
         else if($scope.selecteddma !=null){
           if($scope.savedBrand.brand_name =="All Brands"){
                      $scope.SalesPerformanceByDMA();
                      $scope.shareOfCategoryByDMA();
                      $scope.ShareOfBasketByDMA();
                      $scope.topProductsFunctionByDMA();
                      $scope.GetCategoriesforDMA();
                      $scope.geosalesDataforDMA();
                      $scope.topSalesRegionsforDMA();
                      $scope.topstoresforDMA();                                  
             }else{
                   $scope.bestsellersbySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.SalesPerformanceBySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.categoriesbySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.topsalesRegionsBySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.topstoresbySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.geosalesdatabySingleBrandwithDMA($scope.selectedBrand.brandid);
                  $scope.shareOfCategoryByAllRetailersforBRANDwithDMA($scope.selectedBrand.brandid);
                  $scope.ShareOfBasketByAllRetailerforBRANDwithDMA($scope.selectedBrand.brandid); 
             }
         }else{
             $scope.getcpgrecord();
         }
          
        }

        $scope.dashboardCampaingList=[];
        $scope.camprecords = [];
        $scope.showCampaignList=true;
        $scope.hideCampaignList=false;

        $scope.CampaignListofRetailer=function () {
          sessionStorage.campaignStatus="Active";
          dashBoardService.RetailercampaignList().then(function (response) {
            $scope.camprecords = [];
            $scope.CampaignListDetails=response.data;
          if($scope.CampaignListDetails.length==0||$scope.CampaignListDetails=='Problem in Query'){
                $scope.showCampaignList=false;
                $scope.hideCampaignList=true;
          }
          else{
                $scope.showCampaignList=true;
                $scope.hideCampaignList=false;
          }
          if($scope.CampaignListDetails!=undefined&&$scope.CampaignListDetails!='Problem in Query'){
          for(var i=0;i<$scope.CampaignListDetails.length;i++){
          if(i<2){
          $scope.CampaignLocationList=$scope.CampaignListDetails[i].campaign_location;
          $scope.storesforCampaign=[];
          for(var j=0;j<$scope.CampaignLocationList.length;j++){
             $scope.arrayofstores=$scope.CampaignLocationList[j].split("|");
             $scope.storeaftersplitting=$scope.arrayofstores[0];
             $scope.storesforCampaign.push($scope.storeaftersplitting);
          }
           $scope.productListforCampaigns=$scope.CampaignListDetails[i].products;
           $scope.productsforCampaign=[];
        for(var k=0;k<$scope.productListforCampaigns.length;k++){
           $scope.arrayofproducts=$scope.productListforCampaigns[k].split("|");
           $scope.productaftersplitting=$scope.arrayofproducts[1];
           $scope.productsforCampaign.push($scope.productaftersplitting);
        }

        var comparetimestartdate;
        var comparetimeendDate;
        var campaignstartDate=moment($scope.CampaignListDetails[i].start_date).format("YYYY-MM-DD");
        var campaignendDate=moment($scope.CampaignListDetails[i].end_date).utc().format("YYYY-MM-DD");
        comparetimeendDate=moment(campaignstartDate).subtract(1,'days').format("YYYY-MM-DD");
        var apienddate= moment(campaignendDate).format("YYYYMMDD");
        var apistartdate= moment(campaignstartDate).format("YYYYMMDD");
        var enddate=moment();
        if($scope.CampaignListDetails[i].status=='Active'){
        apienddate= moment(enddate).format("YYYYMMDD");
        }
        if($scope.CampaignListDetails[i].status=='Archived'){
        apienddate= moment(campaignendDate).format("YYYYMMDD");
          enddate=moment(campaignendDate);
        }
              var oneDay = 24*60*60*1000;
              var diffDays = Math.round(Math.abs((moment(enddate) - moment(campaignstartDate))/(oneDay)));
              comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');
              var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");
              var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");
              $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataapiComparetimestartdate = apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';
              $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
              $scope.salesDataapiReporttimestartdate = apistartdate+ 'T000000.000-0000';
              $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';
                     var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
                        "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
              var d = new Date();
              var date = new Date($scope.CampaignListDetails[i].start_date);
              $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();
              //console.log("startdate...",$scope.startDate);
              $scope.startDate1=(monthNames[date.getMonth()])+' ' + date.getDate();
              var endDate = new Date($scope.CampaignListDetails[i].end_date);
              $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getDate()+'/'+endDate.getFullYear();
              $scope.endDate1=(monthNames[endDate.getMonth()])+' ' + endDate.getUTCDate();
              $scope.idchart =dashBoardService.generateguid()
              var campaingobject={
                       "CampaignsName": $scope.CampaignListDetails[i].campaign_name,
                       "sdate": $scope.startDate,
                       "sdate1": $scope.startDate1,
                       "edate": $scope.endDate,
                       "edate1": $scope.endDate1,
                       "startsale": "$5554",
                       "endsale": "$8415",
                       "startunitsold": "1805",
                       "endunitsold": "2018",
                       "startcs": " 10%",
                       "endcs": "25%",
                       "startbs": "18% ",
                       "endbs": "62%",
                       "id":$scope.idchart,
                       "datachart":$scope.campaignSalesData,
                       "description":$scope.CampaignListDetails[i].description,
                       "total": $scope.salesDatatotal,
                       "index":$scope.salesDataIndex,
                       "campaign_id": $scope.CampaignListDetails[i].campaign_id,
                       "stores":$scope.storesforCampaign,
                       "products":$scope.productsforCampaign,
                       "campaignLocations":$scope.CampaignLocationList,
                       "productsList":$scope.productListforCampaigns,
                       "comparestartDate":$scope.salesDataComparetimestartdate,
                       "compareendDate":$scope.salesDataComparetimeenddate,
                       "reportstartDate":$scope.salesDataReporttimestartdate,
                       "reportendDate":$scope.salesDataReporttimeenddate,
                       "campaignRatio":$scope.campaignsRatiodata,
                       "campaignRatioStatus":"",
                       "location":$scope.CampaignListDetails[i].location,
                       "status":$scope.CampaignListDetails[i].status,
                       "apistatus":"retailer",
                       "retailer":$scope.CampaignListDetails[i].rid[0].split("|")[1],
                       "retailerid":$scope.CampaignListDetails[i].rid[0].split("|")[0],
                       "status":$scope.CampaignListDetails[i].status,
                       "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
                       "salesDatareporttime":$scope.salesDataapiReporttimestartdate
                     }
                     $scope.camprecords.push(campaingobject);
                }
          }
        }
      }, function (response) {
        console.log(response);
      }
      );
  }

  $scope.CampaignListofCpg=function () {
   sessionStorage.campaignStatus="Active";
   dashBoardService.CpgcampaignList().then(function (response) {
     $scope.camprecords = [];
     $scope.CampaignListDetails=response.data;
     if($scope.CampaignListDetails.length==0||$scope.CampaignListDetails=='Problem in Query'){
      $scope.showCampaignList=false;
      $scope.hideCampaignList=true;
    }
    else{
      $scope.showCampaignList=true;
      $scope.hideCampaignList=false;
    }

    if($scope.CampaignListDetails!=undefined&&$scope.CampaignListDetails!='Problem in Query'){
      for(var i=0;i<$scope.CampaignListDetails.length;i++){
        if(i<2){
          $scope.CampaignLocationList=$scope.CampaignListDetails[i].campaign_location;
          $scope.storesforCampaign=[];
          for(var j=0;j<$scope.CampaignLocationList.length;j++){
            $scope.arrayofstores=$scope.CampaignLocationList[j].split("|");
            $scope.storeaftersplitting=$scope.arrayofstores[0];
            $scope.storesforCampaign.push($scope.storeaftersplitting);
          }
          $scope.productListforCampaigns=$scope.CampaignListDetails[i].products;
          $scope.productsforCampaign=[];
          for(var k=0;k<$scope.productListforCampaigns.length;k++){
            $scope.arrayofproducts=$scope.productListforCampaigns[k].split("|");
            $scope.productaftersplitting=$scope.arrayofproducts[1];
            $scope.productsforCampaign.push($scope.productaftersplitting);
          }

          var comparetimestartdate;
          var comparetimeendDate;
          var campaignstartDate=moment($scope.CampaignListDetails[i].start_date).format("YYYY-MM-DD");
          var campaignendDate=moment($scope.CampaignListDetails[i].end_date).format("YYYY-MM-DD");
          comparetimeendDate=moment(campaignstartDate).subtract(1,'days').format("YYYY-MM-DD");
          var apienddate= moment(campaignendDate).format("YYYYMMDD");
          var apistartdate= moment(campaignstartDate).format("YYYYMMDD");
          var enddate=moment();
          if($scope.CampaignListDetails[i].status=='Active'){
           apienddate= moment(enddate).format("YYYYMMDD");
         }
         if($scope.CampaignListDetails[i].status=='Archived'){
          apienddate= moment(campaignendDate).format("YYYYMMDD");
          enddate=moment(campaignendDate);
         }
        var oneDay = 24*60*60*1000;
        var diffDays = Math.round(Math.abs((moment(enddate) - moment(campaignstartDate))/(oneDay)));
        comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');
        var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");
        var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");
        $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
        $scope.salesDataapiComparetimestartdate = apicomparestartdate+ 'T000000.000-0000';
        $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';
            $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
                      $scope.salesDataapiReporttimestartdate = apistartdate+ 'T000000.000-0000';

                      $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';

                     var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
                        "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

                     var d = new Date();
                   
                  var date = new Date($scope.CampaignListDetails[i].start_date);

            $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();
                     
              $scope.startDate1=(monthNames[date.getMonth()])+' ' + date.getDate();

                var endDate = new Date($scope.CampaignListDetails[i].end_date);
              $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getDate()+'/'+endDate.getFullYear();

                $scope.endDate1=(monthNames[endDate.getMonth()])+' ' + endDate.getUTCDate();

                      $scope.idchart =dashBoardService.generateguid()

        var campaingobject={

         "CampaignsName": $scope.CampaignListDetails[i].campaign_name,
         "sdate": $scope.startDate,
         "sdate1": $scope.startDate1,
         "edate": $scope.endDate,
         "edate1": $scope.endDate1,
         "startsale": "$5554",
         "endsale": "$8415",
         "startunitsold": "1805",
         "endunitsold": "2018",
         "startcs": " 10%",
         "endcs": "25%",
         "startbs": "18% ",
         "endbs": "62%",
         "id":$scope.idchart,
         "datachart":$scope.campaignSalesData,
         "description":$scope.CampaignListDetails[i].description,
         "total": $scope.salesDatatotal,
         "index":$scope.salesDataIndex,
         "campaign_id": $scope.CampaignListDetails[i].campaign_id,
         "stores":$scope.storesforCampaign,
         "products":$scope.productsforCampaign,
         "campaignLocations":$scope.CampaignLocationList,
         "productsList":$scope.productListforCampaigns,
         "comparestartDate":$scope.salesDataComparetimestartdate,
         "compareendDate":$scope.salesDataComparetimeenddate,
         "reportstartDate":$scope.salesDataReporttimestartdate,
         "reportendDate":$scope.salesDataReporttimeenddate,
         "campaignRatio":$scope.campaignsRatiodata,
         "campaignRatioStatus":"",
         "location":$scope.CampaignListDetails[i].location,
         "status":$scope.CampaignListDetails[i].status,
         "apistatus":"cpg",
         "retailer":$scope.CampaignListDetails[i].rid[0].split("|")[1],
         "retailerid":$scope.CampaignListDetails[i].rid[0].split("|")[0],
         "status":$scope.CampaignListDetails[i].status,
         "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
         "salesDatareporttime":$scope.salesDataapiReporttimestartdate
       }
       $scope.camprecords.push(campaingobject);
     }
   }
  }
  }, function (response) {
    console.log(response);
  }
  );
  }

   $scope.CampaignListofDistributor=function () {
   sessionStorage.campaignStatus="Active";
   dashBoardService.campaignListforDistributor().then(function (response) {
     $scope.camprecords = [];
     $scope.CampaignListDetails=response.data;
     if($scope.CampaignListDetails.length==0||$scope.CampaignListDetails=='Problem in Query'){
      $scope.showCampaignList=false;
      $scope.hideCampaignList=true;
    }
    else{
      $scope.showCampaignList=true;
      $scope.hideCampaignList=false;
    }

    if($scope.CampaignListDetails!=undefined&&$scope.CampaignListDetails!='Problem in Query'){
      for(var i=0;i<$scope.CampaignListDetails.length;i++){
        if(i<2){
          $scope.CampaignLocationList=$scope.CampaignListDetails[i].campaign_location;
          $scope.storesforCampaign=[];
          for(var j=0;j<$scope.CampaignLocationList.length;j++){
            $scope.arrayofstores=$scope.CampaignLocationList[j].split("|");
            $scope.storeaftersplitting=$scope.arrayofstores[0];
            $scope.storesforCampaign.push($scope.storeaftersplitting);
          }
          $scope.productListforCampaigns=$scope.CampaignListDetails[i].products;
          $scope.productsforCampaign=[];
          for(var k=0;k<$scope.productListforCampaigns.length;k++){
            $scope.arrayofproducts=$scope.productListforCampaigns[k].split("|");
            $scope.productaftersplitting=$scope.arrayofproducts[1];
            $scope.productsforCampaign.push($scope.productaftersplitting);
          }

          var comparetimestartdate;
          var comparetimeendDate;
          var campaignstartDate=moment($scope.CampaignListDetails[i].start_date).format("YYYY-MM-DD");
          var campaignendDate=moment($scope.CampaignListDetails[i].end_date).format("YYYY-MM-DD");
          comparetimeendDate=moment(campaignstartDate).subtract(1,'days').format("YYYY-MM-DD");
          var apienddate= moment(campaignendDate).format("YYYYMMDD");
          var apistartdate= moment(campaignstartDate).format("YYYYMMDD");
          var enddate=moment();
          if($scope.CampaignListDetails[i].status=='Active'){
           apienddate= moment(enddate).format("YYYYMMDD");
         }
         if($scope.CampaignListDetails[i].status=='Archived'){
          apienddate= moment(campaignendDate).format("YYYYMMDD");
          enddate=moment(campaignendDate);
         }
        var oneDay = 24*60*60*1000;
        var diffDays = Math.round(Math.abs((moment(enddate) - moment(campaignstartDate))/(oneDay)));
        comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');
        var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");
        var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");
        $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
        $scope.salesDataapiComparetimestartdate = apicomparestartdate+ 'T000000.000-0000';
        $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';
            $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
                      $scope.salesDataapiReporttimestartdate = apistartdate+ 'T000000.000-0000';

                      $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';

                     var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
                        "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

                     var d = new Date();
                   
                  var date = new Date($scope.CampaignListDetails[i].start_date);

            $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();
                     
              $scope.startDate1=(monthNames[date.getMonth()])+' ' + date.getDate();

                var endDate = new Date($scope.CampaignListDetails[i].end_date);
              $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getDate()+'/'+endDate.getFullYear();

                $scope.endDate1=(monthNames[endDate.getMonth()])+' ' + endDate.getUTCDate();

                      $scope.idchart =dashBoardService.generateguid()

        var campaingobject={

         "CampaignsName": $scope.CampaignListDetails[i].campaign_name,
         "sdate": $scope.startDate,
         "sdate1": $scope.startDate1,
         "edate": $scope.endDate,
         "edate1": $scope.endDate1,
         "startsale": "$5554",
         "endsale": "$8415",
         "startunitsold": "1805",
         "endunitsold": "2018",
         "startcs": " 10%",
         "endcs": "25%",
         "startbs": "18% ",
         "endbs": "62%",
         "id":$scope.idchart,
         "datachart":$scope.campaignSalesData,
         "description":$scope.CampaignListDetails[i].description,
         "total": $scope.salesDatatotal,
         "index":$scope.salesDataIndex,
         "campaign_id": $scope.CampaignListDetails[i].campaign_id,
         "stores":$scope.storesforCampaign,
         "products":$scope.productsforCampaign,
         "campaignLocations":$scope.CampaignLocationList,
         "productsList":$scope.productListforCampaigns,
         "comparestartDate":$scope.salesDataComparetimestartdate,
         "compareendDate":$scope.salesDataComparetimeenddate,
         "reportstartDate":$scope.salesDataReporttimestartdate,
         "reportendDate":$scope.salesDataReporttimeenddate,
         "campaignRatio":$scope.campaignsRatiodata,
         "campaignRatioStatus":"",
         "location":$scope.CampaignListDetails[i].location,
         "status":$scope.CampaignListDetails[i].status,
         "apistatus":"cpg",
         "retailer":$scope.CampaignListDetails[i].rid[0].split("|")[1],
         "retailerid":$scope.CampaignListDetails[i].rid[0].split("|")[0],
         "status":$scope.CampaignListDetails[i].status,
         "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
         "salesDatareporttime":$scope.salesDataapiReporttimestartdate
       }
       $scope.camprecords.push(campaingobject);
     }
   }
  }
  }, function (response) {
    console.log(response);
  }
  );
  }

  var destroyFoo;
  destroyFoo=$rootScope.$on('campaignSales', function (event, data) {
         for(var i=0;i<$scope.camprecords.length;i++){
          if($scope.camprecords[i].campaign_id==data.campaign_id){
            $scope.camprecords[i].datachart=data.chartData;
            $scope.camprecords[i].index=data.index;
            $scope.camprecords[i].total=data.total;
          }
        }
      });


  var campaignRatio;

  campaignRatio=   $rootScope.$on('campaignRatio', function (event, data) {

        for(var i=0;i<$scope.camprecords.length;i++){
          if($scope.camprecords[i].campaign_id==data.campaign_id){
               $scope.camprecords[i].campaignRatio=data.ratio;
               $scope.camprecords[i].campaignRatioStatus=data.status;
             }
           }

         });


    /********* coupon List api calls *********/ 
             $scope.coupon_status="Active";
              sessionStorage.couponStatus="Active";

      $scope.getCouponListforRetailer=function(){
         couponService.couponListofRetailer().then(function(response){
         $scope.couponrecords=[];
        for(var i=0;i<2;i++){
            $scope.couponstartDate=moment(response.data[i].start_date).format("MM/DD/YYYY");
            $scope.couponExpirations=response.data[i].coupon_expiration;
            if($scope.couponExpirations[0].date){
              $scope.couponendate=moment($scope.couponExpirations[0].date).format("MM/DD/YYYY")
            }
            $scope.couponDiscount=response.data[i].coupon_discount[0];
            $scope.productListforCoupon=response.data[i].products;
            $scope.productListforCoupon=response.data[i].products;
            $scope.productsforCoupon=[];
            $scope.productsforapi=[];
            for(var k=0;k<$scope.productListforCoupon.length;k++){
                $scope.arrayofproducts=$scope.productListforCoupon[k].split("|");
                $scope.productaftersplitting=$scope.arrayofproducts[1];
                $scope.productName=$scope.arrayofproducts[0];
                //console.log("product name...",$scope.productName);
                $scope.productsforCoupon.push($scope.productaftersplitting);
              }

              var productobject={
                "upc":$scope.productsforCoupon,
                "name":$scope.productName
              }

              $scope.productsforapi.push(productobject);
           
              $scope.retailerList=response.data[i].retailers;
              $scope.retailerListforcoupon=[];

              for(var k=0;k<$scope.retailerList.length;k++){
                $scope.retailer=$scope.retailerList[k].split("|");
                 $scope.retailerListforcoupon.push($scope.retailer[0]);
              }
           
           var couponstartDate=moment(response.data[i].start_date).format("YYYY-MM-DD");
           var couponendDate=moment(response.data[i].date).format("YYYY-MM-DD");

              var comparetimestartdate;
              var comparetimeendDate;
               
        comparetimeendDate=moment(couponstartDate).subtract(1,'days').format("YYYY-MM-DD");

              var apienddate= moment(couponendDate).format("YYYYMMDD");

              var apistartdate= moment(couponstartDate).format("YYYYMMDD");

              var enddate=moment();

              if(response.data[i].status=='Active'){

               apienddate= moment(enddate).subtract(1,'days').format("YYYYMMDD");

              }

              if(response.data[i].status=='Archived'){
                apienddate= moment(couponendDate).format("YYYYMMDD");

                enddate=moment(couponendDate);
              }

              var oneDay = 24*60*60*1000;

              var diffDays = Math.round(Math.abs((moment(enddate)-moment(couponstartDate))/(oneDay)));

              comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');

              var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");

              var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");

             $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataapiComparetimestartdate= apicomparestartdate+ 'T000000.000-0000';

              $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';

              $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
              $scope.salesDataapiReporttimestartdate= apistartdate+ 'T000000.000-0000';

              $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';

           $scope.couponcomparetime=moment(apicomparestartdate).format('MMM Do YYYY')+" - "+moment(apicompareenddate).format('MMM Do YYYY');
            $scope.ccouponreporttime=moment(apistartdate).format('MMM Do YYYY')+" - "+moment(apienddate).format('MMM Do YYYY');
             var date = new Date(response.data[i].start_date);
             $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();

             var endDate = new Date(response.data[i].end_date);
             $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getUTCDate()+'/'+endDate.getFullYear();
             $scope.idchart =dashBoardService.generateguid();

           
           var couponObject={
            "couponName":response.data[i].coupon_title,
            "couponId":response.data[i].coupon_id,
            "status":response.data[i].status,
            "imagePath":response.data[i].image_path,
            "terms":response.data[i].terms,
            "sdate":$scope.couponstartDate,
            "edate":$scope.couponendate,
            "dicount":$scope.couponDiscount,
            "coupon_expiration":response.data[i].coupon_expiration,
            "couponStatus":response.data[i].coupon_status,
            "products":$scope.productsforCoupon,
            "ProductList":$scope.productListforCoupon,
            "retailerList":$scope.retailerList,
            "retailers":$scope.retailerListforcoupon,
            "StartDate":couponstartDate,
            "endDate":couponendDate,
            "comparestartDate":$scope.salesDataComparetimestartdate,
            "compareendDate":$scope.salesDataComparetimeenddate,
            "reportstartDate":$scope.salesDataReporttimestartdate,
            "reportendDate":$scope.salesDataReporttimeenddate,
            "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
            "salesDatareporttime":$scope.salesDataapiReporttimestartdate,
            "campaignRatio":0,
            "campaignRatioStatus":"",
            "productsforapi":$scope.productsforapi
           }

           $scope.couponrecords.push(couponObject);
            }
        },function(response){
           console.log("error msg..",response);
        });
      }


          $scope.getCouponList=function(){

         couponService.couponList().then(function(response){

        $scope.couponrecords=[];

        for(var i=0;i<2;i++){

            $scope.couponstartDate=moment(response.data[i].start_date).format("MM/DD/YYYY");
           
            $scope.couponExpirations=response.data[i].coupon_expiration;

            if($scope.couponExpirations[0].date){
              
              $scope.couponendate=moment($scope.couponExpirations[0].date).format("MM/DD/YYYY")
            }

            $scope.couponDiscount=response.data[i].coupon_discount[0];

            $scope.productListforCoupon=response.data[i].products;

           $scope.productListforCoupon=response.data[i].products;

            $scope.productsforCoupon=[];
            $scope.productsforapi=[];

            for(var k=0;k<$scope.productListforCoupon.length;k++){
                $scope.arrayofproducts=$scope.productListforCoupon[k].split("|");
                $scope.productaftersplitting=$scope.arrayofproducts[1];
                $scope.productName=$scope.arrayofproducts[0];
                //console.log("product name...",$scope.productName);
                $scope.productsforCoupon.push($scope.productaftersplitting);
              }

              var productobject={
                "upc":$scope.productsforCoupon,
                "name":$scope.productName
              }

              $scope.productsforapi.push(productobject);
           
              $scope.retailerList=response.data[i].retailers;
              $scope.retailerListforcoupon=[];

              for(var k=0;k<$scope.retailerList.length;k++){
                $scope.retailer=$scope.retailerList[k].split("|");
                 $scope.retailerListforcoupon.push($scope.retailer[0]);
              }
           
           var couponstartDate=moment(response.data[i].start_date).format("YYYY-MM-DD");
           var couponendDate=moment(response.data[i].date).format("YYYY-MM-DD");

              var comparetimestartdate;
              var comparetimeendDate;
               
            comparetimeendDate=moment(couponstartDate).subtract(1,'days').format("YYYY-MM-DD");

              var apienddate= moment(couponendDate).format("YYYYMMDD");

              var apistartdate= moment(couponstartDate).format("YYYYMMDD");

              var enddate=moment();

              if(response.data[i].status=='Active'){

               apienddate= moment(enddate).subtract(1,'days').format("YYYYMMDD");

              }

              if(response.data[i].status=='Archived'){
                apienddate= moment(couponendDate).format("YYYYMMDD");

                enddate=moment(couponendDate);
              }

              var oneDay = 24*60*60*1000;

              var diffDays = Math.round(Math.abs((moment(enddate)-moment(couponstartDate))/(oneDay)));

              comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');

              var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");

              var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");

             $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataapiComparetimestartdate= apicomparestartdate+ 'T000000.000-0000';

              $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';

              $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
              $scope.salesDataapiReporttimestartdate= apistartdate+ 'T000000.000-0000';

              $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';

            $scope.couponcomparetime=moment(apicomparestartdate).format('MMM Do YYYY')+" - "+moment(apicompareenddate).format('MMM Do YYYY');
            $scope.ccouponreporttime=moment(apistartdate).format('MMM Do YYYY')+" - "+moment(apienddate).format('MMM Do YYYY');

             var date = new Date(response.data[i].start_date);
             $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();

             var endDate = new Date(response.data[i].end_date);
             $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getUTCDate()+'/'+endDate.getFullYear();
             $scope.idchart =dashBoardService.generateguid();
           
           var couponObject={
            "couponName":response.data[i].coupon_title,
            "couponId":response.data[i].coupon_id,
            "status":response.data[i].status,
            "imagePath":response.data[i].image_path,
            "terms":response.data[i].terms,
            "sdate":$scope.couponstartDate,
            "edate":$scope.couponendate,
            "dicount":$scope.couponDiscount,
            "coupon_expiration":response.data[i].coupon_expiration,
            "couponStatus":response.data[i].coupon_status,
            "products":$scope.productsforCoupon,
            "ProductList":$scope.productListforCoupon,
            "retailerList":$scope.retailerList,
            "retailers":$scope.retailerListforcoupon,
            "StartDate":couponstartDate,
            "endDate":couponendDate,
            "comparestartDate":$scope.salesDataComparetimestartdate,
            "compareendDate":$scope.salesDataComparetimeenddate,
            "reportstartDate":$scope.salesDataReporttimestartdate,
            "reportendDate":$scope.salesDataReporttimeenddate,
            "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
            "salesDatareporttime":$scope.salesDataapiReporttimestartdate,
            "campaignRatio":0,
            "campaignRatioStatus":"",
            "productsforapi":$scope.productsforapi
           }
           $scope.couponrecords.push(couponObject);
            }
        },function(response){
           console.log("error msg..",response);
        });
      }

      var couponRatio;
      couponRatio=   $rootScope.$on('couponRatio', function (event, data) {
       for(var i=0;i<$scope.couponrecords.length;i++){
        if($scope.couponrecords[i].couponId==data.couponId){
           $scope.couponrecords[i].campaignRatio=data.ratio;
           $scope.couponrecords[i].campaignRatioStatus=data.status;
        }
       }
      });
      $scope.CouponDetailBeforeLaunch=function(listItem){
        //if($scope.role=="cpg"){
          //console.log("list item...",listItem)
       $state.go('couponReports',{id:listItem.couponId});
        //}
      }

   /* end of coupon list api calls ***********/

   /********************** DMA API CALLS *****************/

   $scope.SalesPerformanceByDMA = function () {
      $scope.SalesPerformancespinner=true;
   $scope.SalesPerformanceByDMART = function () {
        $scope.SalesPerformance = false;
                var data = {
                  "aggTimeUnit": "1d",
                  "startTime": $scope.SalesDataReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "filters": {
                    "items.mfgId" : [$scope.mfgId],
                   "storeId":$scope.dmaStoreList,
                    "retailerId" : $scope.RetailerIds
                 }
               }
               dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {

                 $scope.total = response.data.total;
                 $scope.LineChartData1 = [];
                 $scope.SalesPerformancespinner=false;
                 $filter('number')($scope.total, $scope.total.length)

                $scope.rpIndextotal = parseFloat(response.data.total);
                if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
                  $scope.spIndex = 0;
                }
                else {
                  $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
                  $scope.spIndex = $scope.spIndex.toFixed(2);
                }
                $scope.salesperformanceId = dashBoardService.generateguid();
               
                 $scope.j=1;
              for (var i=0;i<response.data.data.length;i++) {

                if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");

             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){

                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if($scope.Cpdata[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": $scope.Cpdata[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
              }
                $scope.$applyAsync();
                $scope.SalesPerformance = true;
                dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
                dashBoardService.setcacheData('spIndex',$scope.spIndex);
                dashBoardService.setcacheData('total','$' + response.data.total);

              }, function (response) {
                console.log(response);
              }
              );
             }
             var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "filters": {
                "items.mfgId" : [$scope.mfgId],
                "storeId":$scope.dmaStoreList,
                "retailerId" : $scope.RetailerIds

             }
             }
           dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
            $scope.spIndextotal = parseFloat(response.data.total);
            $scope.Cpdata=response.data.data;
            $scope.SalesPerformanceByDMART();
          }, function (response) {
            console.log(response);
          }
          );
         }


          $scope.shareOfCategoryByDMA= function () {

          $scope.ShoppingTripsspinner=true;
          $scope.shareOfCategoryByDMART = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
              "filters": {
              "storeIds" : $scope.dmaStoreList,
                "rids" : $scope.RetailerIds
              }
            }
            $scope.ShoppingTrips = false;
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
             
              $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $scope.ShoppingTripsspinner=false;
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
               $scope.j=1;
               //console.log("responseCT...",$scope.ShoppingTripsCPindex);
               //console.log("responseRT....",$scope.ShoppingTripsRTindex);
               //console.log("stIndex...",$scope.stIndex);

               if($scope.ShoppingTripsCPindex==0&&$scope.ShoppingTripsRTindex==0){
                  $scope.LineChartData2 = [];
               }
               else{

              for (var i = 0; i < response.data.data.length; i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.shoppintripsCpData){
            if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             
              }
              else if(response.data.data[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                   var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
             }
              }
               }

              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);
            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters": {
            "storeIds" : $scope.dmaStoreList,
            "rids" : $scope.RetailerIds
            }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
            $scope.shoppintripsCpData=response.data.data;
            $scope.shareOfCategoryByDMART();
          }, function (response) {
            console.log(response);
          }
          );
        }

        $scope.ShareOfBasketByDMA= function () {

          $scope.AvgBasketspinner=true;
          $scope.avgBasketByDMART = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
              "filters": {
              "storeIds" : $scope.dmaStoreList,
                "rids" : $scope.RetailerIds
             }
             }
            $scope.AvgBasket = false;
            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
             
              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
               $scope.LineChartData3 = [];
               $scope.AvgBasketspinner=false;

              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }

                $scope.j=1;
                
        for (var i=0;i<response.data.data.length;i++) {

              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.avgBasketDataByCP){
               if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
            else if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
             else{
              if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
             }
           }
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters": {
            "storeIds" : $scope.dmaStoreList,
                "rids" : $scope.RetailerIds
            }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
            $scope.avgBasketTotalByCP = parseFloat(response.data.total);
            $scope.avgBasketDataByCP=response.data.data;
            $scope.avgBasketByDMART();
          }, function (response) {
            console.log(response);
            $scope.LineChartData3 = [];
            $scope.AvgBasketspinner=false;
          }
          );
         }



          $scope.topProductsFunctionByDMA = function () {
          $scope.TopProductsspinner=true;
          
            $scope.TopProductsbyReportTimeforDMA = function () {
              var data = {
                "aggTimeUnit": "1d",
                "startTime": $scope.SalesDataReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel": "L",
                "bucketType": "upc",
                "filters": {
                  "items.mfgId" : [$scope.mfgId],
                  "storeId" : $scope.dmaStoreList,
                  "retailerId" : $scope.RetailerIds
                }
                }
              $scope.TopProducts = false;
              dashBoardService.getbestselleresbyallretailer(data).then(function (response) {
                $scope.topProductsbyRT = response.data.data;
              
                $scope.topproductsId = dashBoardService.generateguid();
               dashBoardService.settopproductsmaxvalue(0);  
                  $scope.barChartData = [];
                  $scope.TopProductsspinner=false;
                  for (var i = 0; i < $scope.topProductsbyRT.length; i++) {
                   $scope.indexvalue=0.00;
                var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyRT[i].upc},true);
                   if(categoryfound.length>0){
                   }
                   else{

                    var obj={
                      "category_description":""
                    }
                    categoryfound.push(obj);
                   }
                 $scope.generatedId = dashBoardService.generateguid();
                 
                 var results = $filter('filter')($scope.topProductsbyCT,{id : $scope.topProductsbyRT[i].id}, true);
                 if(results){
                 if(results.length>0){

                   if(results[0].amt>=0){
                    $scope.indexvalue = $scope.topProductsbyRT[i].amt / results[0].amt;
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);
                  }

                   if($scope.indexvalue>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";

                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
                  var amt1=(results[0].amt>=0)?results[0].amt:0;
             var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
         var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');

           if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')(amt,2),
              "amt1":$filter('number')(amt1,2),
              "value":amt,
              "value1":amt1,
              'storename': $scope.productName,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue,
              "itemNumber":$scope.topProductsbyRT[i].upc,
              "deptId":$scope.topProductsbyRT[i].deptId,
              "deptName": $scope.topProductsbyRT[i].deptName,
              "category":categoryfound[0].category_description,
              "labelcolor":$scope.labelcolor,
              "arrow":$scope.arrow,
              "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
              "msuRP":$scope.topProductsbyRT[i].msu,
              "quantityCP":results[0].quantity+" ("+results[0].size+")",
              "msuCP":results[0].msu,
              "lastsoldDateRP":lastsoldDateRP,
              "lastsoldDateCP":lastsoldDateCP

            };
             $scope.barChartData.push(object);
          }
          else{
            var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
            var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber":$scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);
          }
        }
          else{
           var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
            var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber":$scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);
        }
     // }
      }
          $scope.$applyAsync();
          $scope.TopProducts = true;
          dashBoardService.setcacheData('barChartData',$scope.barChartData);
                }, function (response) {
                  console.log(response);
                }
                );
                }
  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
    "filters": {
    "items.mfgId" : [$scope.mfgId],
    "storeId" : $scope.dmaStoreList,
    "retailerId" : $scope.RetailerIds
  }
  }
  dashBoardService.getbestselleresbyallretailer(data).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    $scope.TopProductsbyReportTimeforDMA();
  }, function (response) {
    console.log(response);
  }
  );
  }

       $scope.GetCategoriesforDMA = function () {
        $scope.showpiechartspinner=true;
        $scope.GetCategoriesforDMAbyRT= function () {
          var RTdonutChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel" : "L",
            "bucketType" : "categoryDesc",
            "filters": {
            "items.mfgId" : [$scope.mfgId],
            "storeId" : $scope.dmaStoreList,
            "retailerId" : $scope.RetailerIds
            }
          }
          $scope.showpiechart = false;
         dashBoardService.GettopDepartmentsByAllRetailer(RTdonutChartData).then(function (response) {
          $scope.topdepartmentsData = [];
          $scope.showpiechartspinner=false;
          $scope.topdepartmentsId = dashBoardService.generateguid();
          $scope.topDepartmentsDatabyRP=response.data.data;
          $scope.donutcharttotalbyRT=response.data.total;
          if($scope.donutcharttotal>0){
            $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;
            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          }
          else{
            $scope.donutchartindex=0.00;
            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          }
          if($scope.donutchartindex>=1){
              $scope.indexcolor="green";
          }
          else{
              $scope.indexcolor="red";
          }
          for (var i = 0; i < $scope.topDepartmentsDatabyRP.length; i++) {
           $scope.indexvalue=0.00;
           var results = $filter('filter')($scope.topDepartmentsDatabyCP, {id : $scope.topDepartmentsDatabyRP[i].id}, true);
           if(results){
           if(results.length>0){
           if(results[0].amt>=0){
               $scope.indexvalue = $scope.topDepartmentsDatabyRP[i].amt / results[0].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": $filter('number')(results[0].amt,2),
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":results[0].amt,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }

        if($scope.topDepartmentsDatabyCP){
        for(var k=0;k<$scope.topDepartmentsDatabyCP.length;k++){
         var results = $filter('filter')($scope.topDepartmentsDatabyRP, {id : $scope.topDepartmentsDatabyCP[k].id}, true);
         if(results.length==0){
          $scope.indexvalue=0.00;
          var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": 0.00,
            "amt1":$filter('number')($scope.topDepartmentsDatabyCP[k].amt,2),
            "value":0,
            "value1":$scope.topDepartmentsDatabyCP[k].amt,
            "storename": $scope.topDepartmentsDatabyCP[k].id,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
      }
    }

    if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
     }
            $scope.$applyAsync();
            $scope.showpiechart = true;
            dashBoardService.setcacheData('topdepartmentsData',$scope.topdepartmentsData);
          }, function (response) {
            console.log(response);
          }
          );
       }

       var CPdonutChartData = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "bucketType" : "categoryDesc",
        "filters": {
        "items.mfgId" : [$scope.mfgId],
        "storeId" : $scope.dmaStoreList,
        "retailerId" : $scope.RetailerIds
        }
        }

      dashBoardService.GettopDepartmentsByAllRetailer(CPdonutChartData).then(function (response) {
        $scope.topDepartmentsDatabyCP = response.data.data;
         $scope.donutcharttotal=response.data.total;
        $scope.GetCategoriesforDMAbyRT();
      }, function (response) {
        console.log(response);
      }
      );
    }



    //dma api call for map


    $scope.geosalesDataforDMA=function(){
       var data={
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "geoLevel" : 1,
        "filters" :{
          "item.mfgId" : [$scope.mfgId],
          "storeId" : $scope.dmaStoreList,
            "retailerId" : $scope.RetailerIds
        }
      }

      $scope.showmap=false;
      $scope.geoSalesData=undefined;
      dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
        $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       $scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
      if(response.data.data.length>0){
      $scope.geoSalesData=response.data.data;
      $scope.reporttimeforGeosalesregion={
            "reportstartTime":$scope.ReportstartDate,
            "reportendTime":$scope.Reportenddate
      }
        dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
      }
      else{
          $scope.geoSalesData=[];
      }
      }
      else{
         $scope.geoSalesData=[];
      }
         $scope.showmap=true;
      }, function (response) {
          console.log(response);
      }
      );
      }


    $scope.topSalesRegionsforDMA=function(){

    $scope.topregionsbyRTforDMA=function(){
     var data={
      "aggTimeUnit":"1d",
      "startTime": $scope.ReportstartDate,
      "endTime": $scope.Reportenddate,
      "geoLevel" : 2,
      "filters" :{
      "item.mfgId" : [$scope.mfgId],
      "storeId" : $scope.dmaStoreList,
      "retailerId" : $scope.RetailerIds
      }
      }
    $scope.topsalesregionchart=false;
    dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
             $scope.topregions=[];
             $scope.regionsbyRT=response.data.data[0].regions;
             dashBoardService.setsalesregionmaxvalue(0);
             $scope.salesregionchartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.regionsbyRT.length;i++){
              if($scope.regionsbyRT&&$scope.regionsbyCT){
                if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
                      $scope.salesregionindex=0.00
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                  if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                   if($scope.regionsbyRT[i]){
                     $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
            if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
          }
        }
      }
        else{
        if($scope.regionsbyRT[i]){
              $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
        if($scope.salesregionindex>=1){
              $scope.labelcolor="green";
              $scope.arrow="\u2191";
        }
        else{
              $scope.labelcolor="red";
              $scope.arrow="\u2193";
        }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
           $scope.topregions.push(salesregionobject);
            }
            }
            }
             $scope.topsalesregionchart=true;
          }, function (response) {
           console.log(response);
         }
         );
        }

    var salesregiondataCT={
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2,
              "filters" :{
              "item.mfgId" : [$scope.mfgId],
              "storeId" : $scope.dmaStoreList,
            "retailerId" : $scope.RetailerIds
             }
             }
    dashBoardService.getgeoSalesDataforCpg(salesregiondataCT).then(function (response) {
             if(response.data.data){
              if(response.data.data[0]){
              $scope.regionsbyCT=response.data.data[0].regions;
              }
             }
             $scope.topregionsbyRTforDMA();
               }, function (response) {
                 console.log(response);
               }
               );
        }
        // dma api call for all stores
        $scope.topstoresforDMA=function(){
              $scope.topstoresbyRTforDMA=function(){
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "storeId" : $scope.dmaStoreList,
                   "retailerId" : $scope.RetailerIds
                }
              }
              $scope.topstoreschart=false;
              dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
                $scope.topstoresList=[];
                dashBoardService.settopstoresmaxvalue(0);
                $scope.topstoresListbyRT=response.data.data;
                $scope.topstoreschartid = dashBoardService.generateguid();
                for(var i=0;i<$scope.topstoresListbyRT.length;i++){
                if(i<5){
                for(var j=0;j<$scope.allstoresList.length;j++){
                if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
                var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt($scope.topstoresListbyRT[i].id)}, true);
                if(retailerfound.length>0){
            if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
    if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
            $scope.topstoresindex=0.00;
            if($scope.topstoresListbyRT[i].amt){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var amt=$scope.topstoresListbyRT[i].amt;
                   var amt1=$scope.topstoresListbyCT[i].amt;
                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };

                     $scope.topstoresList.push(topstoresobject);
                   }else{

                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                   var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }
                      }
            else{
            if($scope.topstoresListbyRT[i]){
          $scope.topstoresindex=0.00;
          $scope.topstoresindex=$scope.topstoresindex.toFixed(2);

                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };

                $scope.topstoresList.push(topstoresobject);
              }
              }
              }
              }
              }
              }
              }
               $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
            }
            var comparetimedata={
                "aggTimeUnit":"1d",
                "startTime": $scope.SalesDataComparestartDate,
                "endTime": $scope.Compareenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
                "storeId" : $scope.dmaStoreList,
                 "retailerId" : $scope.RetailerIds
                }
               }
          dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(comparetimedata).then(function (response) {
                  $scope.topstoresListbyCT= response.data.data;
                  $scope.topstoresbyRTforDMA();
            }, function (response) {
             console.log(response);
           }
           );
          }
   /************* END OF DMA API CALLS ******************/


  /******** distributor login api calls **************/

      $scope.BrandsList=[
          {
            "brand_id":"",
            "brand_name":"All Brands"
           }];

           $scope.BrandIdsList=[];
           $scope.allstoresList=[];
      $scope.getAllstores=function(){
          dashBoardService.getallStoresforCPG().then(function(response){
            for(var i=0;i<response.data.length;i++){
              $scope.allstoresList.push(response.data[i]);
            }
            //console.log("store List...",$scope.storeList);
        },function(response){
           console.log("error msg..",response);
        });
        }

        $scope.brandId;
        $scope.getDistributorBrands=function(){
        dashBoardService.getDistributorBrands().then(function(response){
        for(var i=0;i<response.data.length;i++){
        $scope.BrandsList.push(response.data[i]);
        $scope.BrandIdsList.push(response.data[i].brand_id);
        if($scope.brandId){
          $scope.brandId=$scope.brandId+","+response.data[i].brand_id;
        }
        else{
          $scope.brandId=response.data[i].brand_id;
        }
        }
        sessionStorage.brandIdsList=$scope.brandId;

        for(var i=0;i<$scope.BrandsList.length;i++){
        $scope.BrandsList[i].brand_name=$scope.BrandsList[i].brand_name.toUpperCase();
        }
        $scope.selectedBrand=$scope.BrandsList[0];
        $scope.selectedBrandId=$scope.BrandsList[0].brand_id;
        dashBoardService.setBrandidList($scope.BrandIdsList);

        $scope.savedBrand=dashBoardService.getselectedBrand();

        if($scope.savedBrand!=null){
        
        if($scope.savedBrand.brand_name!="ALL BRANDS"){
        for(var i=0;i<$scope.BrandsList.length;i++){

        if($scope.savedBrand.brand_id==$scope.BrandsList[i].brand_id){
         $scope.selectedBrand=$scope.BrandsList[i];
          $scope.selectedBrandId=$scope.savedBrand.brand_id;
        }
        }
        }
        }
        else{
            dashBoardService.saveselectedBrand($scope.selectedBrand);
        }
        $scope.brandportalApicalls();
        },function(response){
           console.log("error msg..",response);
        });
        }


      $scope.getCPGBrands=function(){
        dashBoardService.getBrandsforCPG().then(function(response){
     
        for(var i=0;i<response.data.length;i++){

        $scope.BrandsList.push(response.data[i]);
        $scope.BrandIdsList.push(response.data[i].brandid);
          console.log("BrandsList......", $scope.BrandsList);
        if($scope.brandId){
          $scope.brandId=$scope.brandId+","+response.data[i].brandid;
        }
        else{
          $scope.brandId=response.data[i].brandid;
        }
        }

        sessionStorage.brandIdsList=$scope.brandId;

        for(var i=0;i<$scope.BrandsList.length;i++){
        $scope.BrandsList[i].brand_name=$scope.BrandsList[i].brand_name;
        }
        
        $scope.selectedBrand=$scope.BrandsList[0];
        $scope.selectedBrandId=$scope.BrandsList[0].brandid;
        //dashBoardService.saveselectedBrand($scope.selectedBrand);
        dashBoardService.setBrandidList($scope.BrandIdsList);
        
        $scope.savedBrand=dashBoardService.getselectedBrand();

        if($scope.savedBrand!=null){
        
        if($scope.savedBrand.brand_name!="All Brands"){
        for(var i=0;i<$scope.BrandsList.length;i++){

        if($scope.savedBrand.brandid==$scope.BrandsList[i].brandid){
         $scope.selectedBrand=$scope.BrandsList[i];
          $scope.selectedBrandId=$scope.savedBrand.brandid;
        }
        }
        }
        }
        else{
            dashBoardService.saveselectedBrand($scope.selectedBrand);
        }
        //$scope.brandportalApicallsforCPG();
        },function(response){
           console.log("error msg..",response);
        });
        }





      $scope.salesPerformancebyBrandsLinechartdata=function(ctData,rtData,ctTotal,rtTotal){

            if(rtTotal){
             $filter('number')(rtTotal, rtTotal.length)
            }
            $scope.rpIndextotal = parseFloat(rtTotal);
            if(ctTotal==0||ctTotal==null) {
                $scope.spIndex = 0;
              }
              else {
                $scope.spIndex =rtTotal / ctTotal;
                $scope.spIndex =$scope.spIndex.toFixed(2);
              }

               if(isNaN($scope.spIndex)){
               
                 $scope.spIndex =0.00;
                 $scope.spIndex = $scope.spIndex.toFixed(2);
               
              }
          $scope.salesperformanceId = dashBoardService.generateguid();
          $scope.LineChartData1 = [];

          $scope.j=1;
          for (var i = 0; i < rtData.length; i++) {

          if(i==0){
            $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
            $scope.ResultDate=$scope.date;
            $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
          }
          else{
            $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
            $scope.ResultDate=$scope.nextDate;
            $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
            $scope.j++;
          }

        if(rtData&&ctData){
         if(rtData[i]&&ctData[i]){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": rtData[i].amt,
                  "value2": ctData[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": rtData[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(rtData[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": rtData[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": rtData[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(ctData[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": ctData[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": ctData[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(rtData[i]){
              var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": rtData[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": rtData[i].id
                };
                $scope.LineChartData1.push(object);
              }
              }
              }
              $scope.SalesPerformancespinner=false;
              $scope.SalesPerformance = true;
            }
        
        $scope.SalesPerformanceByAllBrands=function(){
        $scope.SalesPerformancespinner=true;
        $scope.salesPerformanceByallBrandReporttime=function(){
          $scope.SalesPerformance = false;
          var reporttimeRequestData= {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "filters": {
              "items.brandId" : $scope.BrandIdsList
              }
            }
        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(reporttimeRequestData).then(function(response){
              $scope.total = response.data.total;
              if(response.data.data==undefined||$scope.CTBrandsData==undefined){
                 $scope.SalesPerformancespinner=false;
              }
              $scope.RTBrandsData=response.data.data;
              $scope.salesPerformancebyBrandsLinechartdata($scope.RTBrandsData,$scope.CTBrandsData,$scope.spIndextotal,$scope.total);
        },function(response){
           console.log("error msg..",response);
        });
         }

       var comparetimeRequestData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "filters": {
              "items.brandId" : $scope.BrandIdsList
            }
          }
        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(comparetimeRequestData).then(function(response){
          $scope.spIndextotal = parseFloat(response.data.total);
          $scope.CTBrandsData=response.data.data;
          $scope.salesPerformanceByallBrandReporttime();
        },function(response){
           console.log("error msg..",response);
        });
        }

        $scope.SalesPerformanceBySingleBrand=function(brand){
        $scope.SalesPerformancespinner=true;
        $scope.salesPerformanceBysingleBrandReporttime=function(){
          $scope.SalesPerformance = false;
          var reporttimeRequestData= {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "filters": {
              "items.brandId" : [brand]
              }
            }
        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(reporttimeRequestData).then(function(response){
              $scope.total = response.data.total;
              if(response.data.data==undefined||$scope.CTBrandsData==undefined){
                 $scope.SalesPerformancespinner=false;
              }
              $scope.RTBrandsData=response.data.data;
              $scope.salesPerformancebyBrandsLinechartdata($scope.RTBrandsData,$scope.CTBrandsData,$scope.spIndextotal,$scope.total);
        },function(response){
           console.log("error msg..",response);
        });
         }

       var comparetimeRequestData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "filters": {
              "items.brandId" : [brand]
            }
          }

        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(comparetimeRequestData).then(function(response){
          $scope.spIndextotal = parseFloat(response.data.total);
          $scope.CTBrandsData=response.data.data;
          $scope.salesPerformanceBysingleBrandReporttime();
        },function(response){
           console.log("error msg..",response);
        });
         
        }

        $scope.shareOfCategoryforDistributor=function(){
        $scope.ShoppingTripsspinner=true;
        $scope.shareOfCategoryforDistributorbyRT=function(){

          var reporttimeRequestData= {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
              "filters": {
              "items.brandId" : $scope.BrandIdsList
              }
            }
            $scope.ShoppingTrips = false;
      dashBoardService.GetShareOfCategoryforDistributor(reporttimeRequestData).then(function(response){
       // console.log("SC RT...",response);
        $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $scope.ShoppingTripsspinner=false;
              $filter('number')($scope.ShoppingTripsTotal,$scope.ShoppingTripsTotal.length)
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
              $scope.j=1;
              for (var i=0;i<response.data.data.length;i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
              $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.shoppintripsCpData){
              if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
             if(parseFloat(response.data.data[i].percentage)>0){
               var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].id,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
             }
              }
              else if(response.data.data[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].id,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                 }
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].id,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
            if(parseFloat(response.data.data[i].percentage)>0){
               var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].id,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
            }
              }
             }
              }
              $scope.$applyAsync();
              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);
          },function(response){
           console.log("error msg..",response);
        });
         }
           var comparetimeRequestData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters": {
            "items.brandId" : $scope.BrandIdsList
            }
            }
      dashBoardService.GetShareOfCategoryforDistributor(comparetimeRequestData).then(function(response){
        $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
    $scope.shoppintripsCpData=response.data.data;
        $scope.shareOfCategoryforDistributorbyRT();
      },function(response){
           console.log("error msg..",response);
        });
        }


        $scope.shareOfCategoryforDistributorbySingleBrand=function(brand){
          $scope.ShoppingTripsspinner=true;
         $scope.shareOfCategoryforBrandByRT=function(){
          var reporttimeRequestData= {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
              "filters": {
              "brandIds" : [brand.toString()]
              }
            }
            $scope.ShoppingTrips = false;
      dashBoardService.GetShareOfCategoryforDistributor(reporttimeRequestData).then(function(response){
             $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $scope.ShoppingTripsspinner=false;
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
              $scope.j=1;
              for (var i = 0; i < response.data.data.length; i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
              $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.shoppintripsCpData){
              if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
              var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].id,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
              }
              else if(response.data.data[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].id,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].id,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{

              if(response.data.data[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].id,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
             }
              }
              $scope.$applyAsync();
              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);
          },function(response){
           console.log("error msg..",response);
        });
         }

         var comparetimeRequestData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters": {
            "brandIds" : [brand.toString()]
            }
            }
      dashBoardService.GetShareOfCategoryforDistributor(comparetimeRequestData).then(function(response){
     $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
    $scope.shoppintripsCpData=response.data.data;
        $scope.shareOfCategoryforBrandByRT();
      },function(response){
           console.log("error msg..",response);
        });
        }


        $scope.ShareOfBasketByDistributor=function(){
          $scope.AvgBasketspinner=true;
        $scope.shareofbasketbyDistributorbyRT=function(){
            var reporttimeRequestData= {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
              "filters": {
              "items.brandId" : $scope.BrandIdsList
              }
              }
              $scope.AvgBasket = false;
      dashBoardService.GetShareOfBasketforDistributor(reporttimeRequestData).then(function(response){
          //console.log("SB RT ...",response);
              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
               $scope.LineChartData3 = [];
               $scope.AvgBasketspinner=false;
              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }
                $scope.j=1;
        for (var i =0;i<response.data.data.length;i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.avgBasketDataByCP){
               if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if(response.data.data[i]){
                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){
                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
             else{
              if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
        }
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);
          },function(response){
           console.log("error msg..",response);
         });
          }

           var comparetimeRequestData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters": {
            "items.brandId" : $scope.BrandIdsList
            }
            }
      dashBoardService.GetShareOfBasketforDistributor(comparetimeRequestData).then(function(response){
          $scope.avgBasketTotalByCP = parseFloat(response.data.total);
          $scope.avgBasketDataByCP=response.data.data;
          $scope.shareofbasketbyDistributorbyRT();
      },function(response){
           console.log("error msg..",response);
      });
        }

        $scope.ShareOfBasketBySingleBrand=function(brand){
          $scope.AvgBasketspinner=true;
          $scope.shareofbasketbyBrandRT=function(){
          var reporttimeRequestData= {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
              "filters": {
              "brandIds" : [brand.toString()]
              }
              }
          $scope.AvgBasket = false;
      dashBoardService.GetShareOfBasketforDistributor(reporttimeRequestData).then(function(response){
           $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
               $scope.LineChartData3 = [];
               $scope.AvgBasketspinner=false;

              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }
                $scope.j=1;
        for (var i = 0; i < response.data.data.length; i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.avgBasketDataByCP){
               if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if(response.data.data[i]){
          var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
             else{
              if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
        }
    
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);
          },function(response){
           console.log("error msg..",response);
         });
          }

         var comparetimeRequestData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters": {
            "brandIds" : [brand.toString()]
            }
            }
      dashBoardService.GetShareOfBasketforDistributor(comparetimeRequestData).then(function(response){
          $scope.avgBasketTotalByCP =parseFloat(response.data.total);
          $scope.avgBasketDataByCP=response.data.data;
          $scope.shareofbasketbyBrandRT();
      },function(response){
           console.log("error msg..",response);
      });
      }


        $scope.bestsellerschartdata=function(ctData,rtData){

        for (var i =0;i<rtData.length;i++) {
            $scope.indexvalue=0.00;
            $scope.generatedId=dashBoardService.generateguid();
        if(rtData){
            var results = $filter('filter')(ctData,{id:rtData[i].id},true);
            if(results){
            if(results.length>0){
            if(results[0].amt>=0){
              $scope.indexvalue = rtData[i].amt / results[0].amt;
              $scope.indexvalue=$scope.indexvalue.toFixed(2);
            }
            if($scope.indexvalue>=1){
              $scope.labelcolor="green";
              $scope.arrow="\u2191";
            }
            else{
              $scope.labelcolor="red";
              $scope.arrow="\u2193";
            }
              var amt=(rtData[i].amt>=0)?rtData[i].amt:0;
              var amt1=(results[0].amt>=0)?results[0].amt:0;
                 // var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
            
         var lastsoldDateRP=moment(rtData[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
         var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
               
          if(rtData[i].name){
          if(rtData[i].name!=""){
            $scope.productName=rtData[i].name;
          }
          else{
             $scope.productName=rtData[i].id;
          }
          }
          else{
            $scope.productName=rtData[i].id;
          }


            var object = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.productName,
                          "reporttime":$scope.totalreporttime,
                          "comapretime":$scope.totalcomparetime,
                          "Index":$scope.indexvalue,
                          "itemNumber":rtData[i].upc,
                          "deptId":rtData[i].deptId,
                          "deptName": "",
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "quantityRP":rtData[i].quantity+" ("+rtData[i].size+")",
                          "msuRP":rtData[i].msu,
                          "quantityCP":results[0].quantity+" ("+results[0].size+")",
                          "msuCP":results[0].msu,
                          "lastsoldDateRP":lastsoldDateRP,
                          "lastsoldDateCP":lastsoldDateCP
                        };
                var barchartobject={
                    "data":[object],
                    "chartid":$scope.generatedId
                  }
                $scope.barChartData.push(object);
             }
            else{
            var amt=(rtData[i].amt>=0)?rtData[i].amt:0;
            var lastsoldDateRP=moment(rtData[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
                    
          if(rtData[i].name){
          if(rtData[i].name!=""){
            $scope.productName=rtData[i].name;
          }
          else{
             $scope.productName=rtData[i].id;
          }
          }
          else{
            $scope.productName=rtData[i].id;
          }

                      // var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
                       $scope.labelcolor="red";
                       $scope.arrow="\u2193";
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.productName,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":rtData[i].upc,
                        "deptId":rtData[i].deptId,
                        "deptName": "",
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow,
                        "quantityRP":rtData[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
                        "msuRP":rtData[i].msu,
                        "lastsoldDateRP":lastsoldDateRP,
                        "lastsoldDateCP":0
                       
                };
              var barchartobject={
                      "data":object,
                      "chartid":$scope.generatedId
                    }
                        $scope.barChartData.push(object);
                  }
                  }
                  else{
                      var amt=(rtData[i].amt>=0)?rtData[i].amt:0;
                var lastsoldDateRP=moment(rtData[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
        if(rtData[i].name){
          if(rtData[i].name!=""){
            $scope.productName=rtData[i].name;
          }
          else{
             $scope.productName=rtData[i].id;
          }
          }
          else{
            $scope.productName=rtData[i].id;
          }
                      // var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
                       $scope.labelcolor="red";
                       $scope.arrow="\u2193";
                       var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $filter('number')(amt,2),
                        "amt1":0.00,
                        "value":amt,
                        "value1":0,
                        'storename': $scope.productName,
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "itemNumber":rtData[i].upc,
                        "deptId":rtData[i].deptId,
                        "deptName": "",
                        "labelcolor":$scope.labelcolor,
                        "arrow":$scope.arrow,
                        "quantityRP":rtData[i].quantity+" ("+rtData[i].size+")",
                        "msuRP":rtData[i].msu,
                        "lastsoldDateRP":lastsoldDateRP,
                        "lastsoldDateCP":0
                       
                      };
                      var barchartobject={
                          "data":object,
                          "chartid":$scope.generatedId

                        }
                        $scope.barChartData.push(object);
                    }
                  }
                }
                $scope.TopProductsspinner=false;
                $scope.TopProducts = true;
        }


        $scope.bestsellersbyAllBrands=function(){
          $scope.TopProductsspinner=true;

          $scope.bestsellersByallBrandsRT=function(){
            var reporttimeRequest = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "upc",
          "filters": {
             "items.brandId" : $scope.BrandIdsList
             }
           }
         $scope.TopProducts = false;
        
         dashBoardService.getbestselleresbyallretailer(reporttimeRequest).then(function(response){
          console.log("getbestselleresbyallretailer",response);
          $scope.topProductsbyRT = response.data.data;
          
          if($scope.topProductsbyRT==undefined||$scope.topProductsbyCT==undefined){
                 $scope.TopProductsspinner=false;
          }
          
          if($scope.topProductsbyRT.length==0){
                $scope.noTopProductsLabel=true;
          }
          $scope.topproductsId = dashBoardService.generateguid();
          dashBoardService.settopproductsmaxvalue(0);
          $scope.barChartData = [];
          
          $scope.bestsellerschartdata($scope.topProductsbyCT,$scope.topProductsbyRT);
          
        },function(response){
           console.log("error msg..",response);
        });
          }

          var comparetimerequest = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
     "filters": {
             "items.brandId" : $scope.BrandIdsList
             }
  }
  dashBoardService.getbestselleresbyallretailer(comparetimerequest).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    //console.log("response CT...",$scope.topProductsbyCT);
    $scope.bestsellersByallBrandsRT();
  }, function (response) {
    console.log(response);
  }
  );
  }

     $scope.bestsellersbySingleBrand=function(brand){
          $scope.TopProductsspinner=true;

          $scope.bestsellersBysingleBrandRT=function(){
            var reporttimeRequest = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "upc",
          "filters": {
             "items.brandId" : [brand]
             }
           }
         $scope.TopProducts = false;
        
         dashBoardService.getbestselleresbyallretailer(reporttimeRequest).then(function(response){
          
          $scope.topProductsbyRT = response.data.data;
          
          if($scope.topProductsbyRT==undefined||$scope.topProductsbyCT==undefined){
                 $scope.TopProductsspinner=false;
          }
          
          if($scope.topProductsbyRT.length==0){
                $scope.noTopProductsLabel=true;
          }
          $scope.topproductsId = dashBoardService.generateguid();
          dashBoardService.settopproductsmaxvalue(0);
          $scope.barChartData = [];
          
          $scope.bestsellerschartdata($scope.topProductsbyCT,$scope.topProductsbyRT);
          
        },function(response){
           console.log("error msg..",response);
        });
          }

          var comparetimerequest = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
     "filters": {
             "items.brandId" : [brand]
             }
  }
  dashBoardService.getbestselleresbyallretailer(comparetimerequest).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    //console.log("response CT...",$scope.topProductsbyCT);
    $scope.bestsellersBysingleBrandRT();
  }, function (response) {
    console.log(response);
  }
  );
  }

  $scope.topcategoriesbyBrandschartdata=function(ctData,rtData){
           $scope.topdepartmentsData=[];
      if($scope.donutcharttotal>0){
        $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;
        $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
      }
      else{
        $scope.donutchartindex=0.00;
        $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
      }
      if($scope.donutchartindex>=1){
          $scope.indexcolor="green";
     }
      else{
          $scope.indexcolor="red";
      }
          for (var i =0;i<rtData.length;i++) {
           $scope.indexvalue=0.00;
           var results = $filter('filter')(ctData, {id : rtData[i].id}, true);
           if(results){
           if(results.length>0){

             if(results[0].amt>=0){
               $scope.indexvalue = rtData[i].amt / results[0].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }

             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')(rtData[i].amt,2),
             "amt1": $filter('number')(results[0].amt,2),
             "value":rtData[i].amt,
              "value1":results[0].amt,
              "storename": rtData[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);

          }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')(rtData[i].amt,2),
              "amt1": 0.00,
              "value":rtData[i].amt,
              "value1":0.00,
              "storename": rtData[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')(rtData[i].amt,2),
              "amt1": 0.00,
              "value":rtData[i].amt,
              "value1":0.00,
              "storename": rtData[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }
        if(ctData){
        for(var k=0;k<ctData.length;k++){
         var results = $filter('filter')(rtData,{id :ctData[k].id},true);
         if(results.length==0){
          $scope.indexvalue=0.00;
          var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": 0.00,
            "amt1":$filter('number')(ctData[k].amt,2),
            "value":0,
            "value1":ctData[k].amt,
            "storename": ctData[k].id,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
      }
    }
    if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
     }
     $scope.showpiechart = true;
     $scope.showpiechartspinner=false;
     //console.log("categories...",$scope.topdepartmentsData);
  }


    $scope.categoriesbyAllBrands=function(){
    $scope.showpiechartspinner=true;
    sessionStorage.itemssize=1000;
    
    $scope.categoriesbyAllBrandsRT=function(){
       var reporttimeRequest= {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel" : "L",
            "filters": {
              "items.brandId" :$scope.BrandIdsList
            },
            "bucketType" : "categoryDesc"
          }
          $scope.showpiechart = false;

        dashBoardService.gettopcategoriesbyBrands(reporttimeRequest).then(function (response) {
              $scope.donutcharttotalbyRT=response.data.total;
              $scope.topDepartmentsDatabyRP=response.data.data;
              $scope.topdepartmentsId = dashBoardService.generateguid();
              $scope.topcategoriesbyBrandschartdata($scope.topDepartmentsDatabyCP,$scope.topDepartmentsDatabyRP)

        }, function (response) {
             console.log(response);
        }
        );
        }

        var comparetimeRequest = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "filters": {
          "items.brandId" : $scope.BrandIdsList
        },
        "bucketType" : "categoryDesc"
      }

      dashBoardService.gettopcategoriesbyBrands(comparetimeRequest).then(function (response) {
        $scope.topDepartmentsDatabyCP = response.data.data;
         $scope.donutcharttotal=response.data.total;
        $scope.categoriesbyAllBrandsRT();
      }, function (response) {
        console.log(response);
      }
      );

   }

   $scope.categoriesbySingleBrand=function(brand){
    $scope.showpiechartspinner=true;
    sessionStorage.itemssize=1000;
    
    $scope.categoriesbySingleBrandRT=function(){
    
       var reporttimeRequest= {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel" : "L",
            "filters": {
              "items.brandId" :[brand]
            },
            "bucketType" : "categoryDesc"
          }
          $scope.showpiechart = false;

      dashBoardService.gettopcategoriesbyBrands(reporttimeRequest).then(function (response) {
          $scope.donutcharttotalbyRT=response.data.total;
          $scope.topDepartmentsDatabyRP=response.data.data;
          $scope.topdepartmentsId = dashBoardService.generateguid();
          $scope.topcategoriesbyBrandschartdata($scope.topDepartmentsDatabyCP,$scope.topDepartmentsDatabyRP)

        }, function (response) {
             console.log(response);
        }
        );
        }
        var comparetimeRequest = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "filters": {
          "items.brandId" : [brand]
        },
        "bucketType" : "categoryDesc"
      }
      dashBoardService.gettopcategoriesbyBrands(comparetimeRequest).then(function (response) {
         $scope.topDepartmentsDatabyCP = response.data.data;
         $scope.donutcharttotal=response.data.total;
         $scope.categoriesbySingleBrandRT();
      }, function (response) {
        console.log(response);
      }
      );
     }

     $scope.topsalesregionsbyBrandschartData=function(ctData,rtData){
          $scope.topregions=[];
             $scope.regionsbyRT=rtData;
             $scope.regionsbyCT=ctData;
             dashBoardService.setsalesregionmaxvalue(0);
             $scope.salesregionchartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT&&$scope.regionsbyCT){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
                $scope.salesregionindex=0.00
            if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
             $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
            }
                  if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                   if($scope.regionsbyRT[i]){
                     $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                   
               if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
          }
        }
      }
        else{
        if($scope.regionsbyRT[i]){
              $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                   }
              }
             }
             $scope.topsalesregionchart=true;
           }

     $scope.topsalesRegionsByAllBrands=function(){

      $scope.topsalesRegionsByAllbrandsRt=function(){
        var reporttimeRequest= {
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 2,
            "filters": {
              "items.brandId" :$scope.BrandIdsList
            }
          }
          $scope.topsalesregionchart=false;
      dashBoardService.getsalesbyBrands(reporttimeRequest).then(function (response) {
       //console.log("response RT...",response);
       $scope.regionsbyRTBrands=response.data.data[0].regions;
       $scope.topsalesregionsbyBrandschartData($scope.regionsbyCTBrands,$scope.regionsbyRTBrands);
      }, function (response) {
        console.log(response);
      }
      );
      }
     var comparetimeRequest = {
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "geoLevel" : 2,
        "filters": {
          "items.brandId" : $scope.BrandIdsList
        }
      }
      dashBoardService.getsalesbyBrands(comparetimeRequest).then(function (response) {
              if(response.data.data){
              if(response.data.data[0]){
              $scope.regionsbyCTBrands=response.data.data[0].regions;
              }
              }
          $scope.topsalesRegionsByAllbrandsRt();
         // console.log("response CT...",response);
      }, function (response) {
        console.log(response);
      }
      );
      }



      $scope.topsalesRegionsBySingleBrand=function(brand){

      $scope.topsalesRegionsBySingleBrandRt=function(){
       
        var reporttimeRequest= {
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 2,
            "filters": {
              "items.brandId" :[brand]
            }
          }

          $scope.topsalesregionchart=false;

      dashBoardService.getsalesbyBrands(reporttimeRequest).then(function (response) {
      // console.log("response RT...",response);

       $scope.regionsbyRTBrands=response.data.data[0].regions;

       $scope.topsalesregionsbyBrandschartData($scope.regionsbyCTBrands,$scope.regionsbyRTBrands);
     
         
      }, function (response) {
        console.log(response);
      }
      );
      }

     var comparetimeRequest = {
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "geoLevel" : 2,
        "filters": {
          "items.brandId" : [brand]
        }
      }
      dashBoardService.getsalesbyBrands(comparetimeRequest).then(function (response) {
              if(response.data.data){
              if(response.data.data[0]){
              $scope.regionsbyCTBrands=response.data.data[0].regions;
              }
              }
          $scope.topsalesRegionsBySingleBrandRt();
          //console.log("response CT...",response);
      }, function (response) {
        console.log(response);
      }
      );
      }

      $scope.topsstoresbyBrandschartData=function(ctData,rtData){
          
          $scope.topstoresListbyRT=rtData;
          $scope.topstoresListbyCT=ctData;
          $scope.topstoreschartid = dashBoardService.generateguid();
         //console.log("all stores...",$scope.allstoresList);
        for(var i=0;i<$scope.topstoresListbyRT.length;i++){
        
        if(i<5){
        for(var j=0;j<$scope.allstoresList.length;j++){
        if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
        if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
        if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
            $scope.topstoresindex=0.00;
        if($scope.topstoresListbyRT[i].amt){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
          }
        if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
          }
        else{
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
          }
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;

                  var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id


                        };
                     $scope.topstoresList.push(topstoresobject);
                   }else{
                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                  var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }
                      }
            else{
            if($scope.topstoresListbyRT[i]){
          $scope.topstoresindex=0.00;
          $scope.topstoresindex=$scope.topstoresindex.toFixed(2);

            if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
            }
            else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
            }
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                  var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };
                     $scope.topstoresList.push(topstoresobject);
              }
              }
              }
              }
              }
              }

              //console.log("top store list...",$scope.topstoresList);
      $scope.topstoreschart=true;
      }

      $scope.topstoresbyAllBrands=function(){
      $scope.topstoresbyAllBrandsRT=function(){
      
      var reporttimeRequest= {
            "aggTimeUnit":"1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel":"S",
            "filters": {
              "items.brandId" :$scope.BrandIdsList
            }
          }   
          $scope.topstoreschart=false;
      dashBoardService.getstoresbyBrands(reporttimeRequest).then(function (response) {
          $scope.topstoresbrandsbyRT=response.data.data;
          //console.log("Top stores by rt...",$scope.topstoresbrandsbyRT);
          $scope.topstoresList=[];
          dashBoardService.settopstoresmaxvalue(0);
          $scope.topsstoresbyBrandschartData($scope.topstoresbyBrandsbyCT,$scope.topstoresbrandsbyRT)
      }, function (response) {
        console.log(response);
      }
      );
        }
      var comparetimeRequest = {
        "aggTimeUnit":"1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel":"S",
        "filters": {
          "items.brandId" :$scope.BrandIdsList
        }
      }
      dashBoardService.getstoresbyBrands(comparetimeRequest).then(function (response) {
           $scope.topstoresbyBrandsbyCT= response.data.data;
           //console.log("Top stores by ct...",$scope.topstoresbyBrandsbyCT);
           $scope.topstoresbyAllBrandsRT();
      }, function (response) {
        console.log(response);
      }
      );
      }


       $scope.topstoresbySingleBrand=function(brand){
      $scope.topstoresbySingleBrandRT=function(){
      
      var reporttimeRequest= {
            "aggTimeUnit":"1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel":"S",
            "filters": {
              "items.brandId" :[brand]
            }
          }   
      
          $scope.topstoreschart=false;
          dashBoardService.getstoresbyBrands(reporttimeRequest).then(function (response) {
          $scope.topstoresbrandsbyRT=response.data.data;
          $scope.topstoresList=[];
          dashBoardService.settopstoresmaxvalue(0);
          $scope.topsstoresbyBrandschartData($scope.topstoresbyBrandsbyCT,$scope.topstoresbrandsbyRT)

      }, function (response) {
        console.log(response);
      }
      );
        }
             
      var comparetimeRequest = {
        "aggTimeUnit":"1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel":"S",
        "filters": {
          "items.brandId" :[brand]
        }
      }

      dashBoardService.getstoresbyBrands(comparetimeRequest).then(function (response) {
           $scope.topstoresbyBrandsbyCT= response.data.data;
           $scope.topstoresbySingleBrandRT();
      }, function (response) {
        console.log(response);
      }
      );

      }

        $scope.geosalesdatabyAllBrands=function(){
          
            var reporttimeRequest= {
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 1,
            "filters": {
            "items.brandId" :$scope.BrandIdsList
            }
          }  

          $scope.showmap=false;
          $scope.geoSalesData=undefined;

           dashBoardService.getgeosalesDataByBrands(reporttimeRequest).then(function (response) {
            $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       //$scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
              if(response.data.data.length>0){
                  $scope.geoSalesData=response.data.data;
          $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
              dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }
             }
             else{
               $scope.geoSalesData=[];
             }
              $scope.showmap=true;
      }, function (response) {
        console.log(response);
      }
      );
      }


      $scope.geosalesdatabySingleBrand=function(brand){
          
            var reporttimeRequest= {
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 1,
            "filters": {
              "items.brandId" :[brand]
            }
          }

           $scope.showmap=false;
          $scope.geoSalesData=undefined;  

           dashBoardService.getgeosalesDataByBrands(reporttimeRequest).then(function (response) {
             
             $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       //$scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
              if(response.data.data.length>0){
                  $scope.geoSalesData=response.data.data;
              
          $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }

              dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }

             }
             else{
               $scope.geoSalesData=[];
             }
              $scope.showmap=true;

      }, function (response) {
        console.log(response);
      }
      );
      }
      
        
        $scope.brandChange=function(brand){
        $scope.selectedBrand=brand;
        dashBoardService.saveselectedBrand($scope.selectedBrand);
        $scope.selectedBrandId=brand.brand_id;
        if($scope.role=="distributor"){
           $scope.brandportalApicalls();
         }else if($scope.role =="cpg"){
         // $scope.brandIdsList.push(brand.brandid);
           $scope.brandportalApicallsforCPG(brand.brandid);
         }
       
        }

        $scope.brandportalApicalls=function(){

          if($scope.selectedBrand.brand_name=="ALL BRANDS"){
            $scope.SalesPerformanceByAllBrands();
            $scope.bestsellersbyAllBrands();
            $scope.categoriesbyAllBrands();
            $scope.topsalesRegionsByAllBrands();
            $scope.topstoresbyAllBrands();
            $scope.geosalesdatabyAllBrands();
            $scope.shareOfCategoryforDistributor();
            $scope.ShareOfBasketByDistributor();
          }
          else {
            $scope.SalesPerformanceBySingleBrand($scope.selectedBrandId);
            $scope.bestsellersbySingleBrand($scope.selectedBrandId);
            $scope.categoriesbySingleBrand($scope.selectedBrandId);
            $scope.topsalesRegionsBySingleBrand($scope.selectedBrandId);
            $scope.topstoresbySingleBrand($scope.selectedBrandId);
            $scope.geosalesdatabySingleBrand($scope.selectedBrandId);
            $scope.shareOfCategoryforDistributorbySingleBrand($scope.selectedBrandId);
            $scope.ShareOfBasketBySingleBrand($scope.selectedBrandId); 
          }
          
        }

      $scope.brandportalApicallsforCPG=function(brand){
        $scope.selectedRetailer=dashBoardService.getsavestoreselected();
        console.log("$scope.dma", $scope.dmaStoreList);
        console.log("$scope.ctrl.selected",$scope.ctrl.selected);
        console.log($scope.selectedBrand.brandid);
        $scope.retailerId=$scope.ctrl.selected.retailerId;
        if($scope.selectedBrand.brand_name =="All Brands"){
           $scope.cpgFunctions();
        }
        else if($scope.ctrl.selected.name == "All Retailers" ){
          if($scope.dma == "" || $scope.dma == undefined){
              $scope.SalesPerformanceBySingleBrandforcpg(brand);
              $scope.bestsellersbySingleBrandforCPG(brand);
              $scope.categoriesbySingleBrandforCPG(brand);
              $scope.topsalesRegionsBySingleBrandforCPG(brand);
              $scope.topstoresbySingleBrandforCPG(brand);
              $scope.geosalesdatabySingleBrandforCPG(brand);
              $scope.shareOfCategoryByAllRetailersforBRAND(brand);
              $scope.ShareOfBasketByAllRetailerforBRAND(brand); 
            }else{
                  $scope.SalesPerformanceBySingleBrandwithDMA(brand);
                  $scope.categoriesbySingleBrandwithDMA(brand);
                  $scope.bestsellersbySingleBrandwithDMA(brand);
                  $scope.topsalesRegionsBySingleBrandwithDMA(brand);
                  $scope.topstoresbySingleBrandwithDMA(brand);
                  $scope.geosalesdatabySingleBrandwithDMA(brand);
                  $scope.shareOfCategoryByAllRetailersforBRANDwithDMA(brand);
                  $scope.ShareOfBasketByAllRetailerforBRANDwithDMA(brand); 
             } 

          }else if($scope.ctrl.selected.name !== "All Retailers" && $scope.dma == ""){
               if($scope.selectedRetailer.hasOwnProperty("children")){
                  sessionStorage.retailerId=$scope.retailerId;
                  $scope.SalesPerformanceByBRANDforRetailer($scope.retailerid);
                  $scope.shareOfCategoryByBRANDforRetailer($scope.retailerid);
                  $scope.ShareOfBasketByBRANDforRetailer($scope.retailerid);
                  $scope.topProductsFunctionByBRANDforRetailer($scope.retailerid);
                  $scope.GetCategoriesforBRANDforRetailer($scope.retailerid);
                  $scope.geosalesDataforBRANDforRetailer($scope.retailerid);
                  $scope.topSalesRegionsforBRANDforRetailer($scope.retailerid);
                  $scope.topstoresforBRANDforRetailer($scope.retailerid);
               }else{
                  $scope.SalesPerformanceByStoreIdForCpgBRAND();
                  $scope.shareOfCategoryByStoreforCpgBRAND();
                  $scope.ShareOfBasketByStoreforCpgBRAND();
                  $scope.GettoptenDepartmentsByStoreforCpgBRAND();
                  $scope.topProductsFunctionByByStoreforcpgBRAND();
                  $scope.topSalesRegionsforcpgbystoreBRAND();
                  $scope.salespperformancebyallstoresforcpgbystoreBRAND();
                  $scope.geosalesDatabyStoreidforcpgBRAND();
               }                  
          }
            // }
        }

         




  
  
  /******** end of distributor api calls *************/

       $scope.reporttimeranges=[
                              {"name":"LAST 7 DAYS"},
                              {"name":"THIS MONTH"},
                              {"name":"LAST MONTH"},
                              {"name":"QUARTER 1 2017"},
                              {"name":"QUARTER 2 2017"},
                              {"name":"QUARTER 3 2017"},
                              {"name":"QUARTER 4 2017"}
                              
                              ];

          $scope.selectedtimeperiod=$scope.reporttimeranges[0];

          $scope.timeperiodlabel=dashBoardService.gettimeperiodlabel();
            
            if($scope.timeperiodlabel){
              if($scope.timeperiodlabel=="Last week"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[0];
            }
             else if($scope.timeperiodlabel=="This Month"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[1];
            }
            else if($scope.timeperiodlabel=="Last Month"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[2];
            }
             
            else if($scope.timeperiodlabel=="Custom Range"){

              if($scope.reporttimeranges[7]==undefined){

                var obj={"name":"CUSTOM"}
                 $scope.reporttimeranges.push(obj);
             }

              $scope.selectedtimeperiod=$scope.reporttimeranges[7];
            }
            else if($scope.timeperiodlabel=="Quarter 1 (Jan-Mar)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[3];
            }

             else if($scope.timeperiodlabel=="Quarter 2 (Apr-jun)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[4];
            }
             else if($scope.timeperiodlabel=="Quarter 3 (Jul-sep)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[5];
            }
            else if($scope.timeperiodlabel=="Quarter 4 (Oct-Dec)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[6];
            }
            }
            else{
               $scope.selectedtimeperiod=$scope.reporttimeranges[0];

            }
             $scope.timerange=function(value){
                     
                if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);

              }

           
            if(value.name=="LAST 7 DAYS"){

               $scope.selectedtimeperiod=$scope.reporttimeranges[0];

              $scope.lastsevendays=true;

              $scope.starttime=moment().subtract(7,'days');
              $scope.endtime=moment().subtract(1,'days');

              daterangepickerCallBack($scope.starttime,$scope.endtime,"Last week");

            }
            else if(value.name=="THIS MONTH"){

             $scope.selectedtimeperiod=$scope.reporttimeranges[1];

              $scope.starttime=moment().startOf('month');
              $scope.endtime=moment().subtract(1,'days');

              daterangepickerCallBack($scope.starttime,$scope.endtime,"This Month");

            }
            else if(value.name=="LAST MONTH"){
                $scope.selectedtimeperiod=$scope.reporttimeranges[2];


               $scope.starttime=moment().subtract(1,'month').startOf('month');
              $scope.endtime=moment().subtract(1,'month').endOf('month');

              daterangepickerCallBack($scope.starttime,$scope.endtime,"Last Month");

            }
            else if(value.name=="QUARTER 1 2017"){

          $scope.selectedtimeperiod=$scope.reporttimeranges[3];

               $scope.starttime=  moment().startOf('year').startOf('month');
              $scope.endtime= moment().startOf('year').add(2, 'month').endOf('month');
           daterangepickerCallBack($scope.starttime,$scope.endtime,"Quarter 1 (Jan-Mar)");

            }
            else if(value.name=="QUARTER 2 2017"){
               $scope.selectedtimeperiod=$scope.reporttimeranges[4];
            

              $scope.starttime=moment().startOf('year').add(3, 'month').startOf('month'); 
              $scope.endtime=moment().startOf('year').add(5, 'month').endOf('month');
           daterangepickerCallBack($scope.starttime,$scope.endtime,"Quarter 2 (Apr-jun)");

            }
            else if(value.name=="QUARTER 3 2017"){

           $scope.selectedtimeperiod=$scope.reporttimeranges[5];
   
                        
          $scope.starttime=moment().startOf('year').add(6, 'month').startOf('month');
          $scope.endtime=moment().startOf('year').add(8, 'month').endOf('month');

           daterangepickerCallBack($scope.starttime,$scope.endtime,"Quarter 3 (Jul-sep)");

            }
              else if(value.name=="QUARTER 4 2017"){

            $scope.selectedtimeperiod=$scope.reporttimeranges[6];
                        
            $scope.starttime=moment().startOf('year').add(9, 'month').startOf('month');
            $scope.endtime=moment().subtract(1,'days');

           daterangepickerCallBack($scope.starttime,$scope.endtime,"Quarter 4 (Oct-Dec)");

            }
            
          }


  var reportStart;
  var reportEnd;
  var  compareStart;
  var compareEnd;

  var selectedId;

  $scope.data={
   selectedStoreId:''
  }

  function daterangepickerCallBackInit(startdate, enddate) {
    $('#reportrange span').html(startdate.format('MM/DD/YYYY') + ' - ' + enddate.format('MM/DD/YYYY'));
    startDate = startdate;
    endDate = enddate;

          // compareEnd=moment(enddate).subtract(1,'year');
          //compareStart=moment(startdate).subtract(1,'year');

          //  cmpareTimeInit(compareStart,compareEnd);
          //  $scope.comparetimeFunction();
          reportStart=startdate;
          reportEnd=enddate;


          window.localStorage['comparetimestart']=compareStart;
          window.localStorage['comparetimeend']=compareEnd;
          window.localStorage['reporttimestart']=startdate;
          window.localStorage['reporttimeend']=enddate;

          dashBoardService.setcomparestartdate(compareStart);
          dashBoardService.setcompareenddate(compareEnd);
          dashBoardService.setreportstartdate(startdate);
          dashBoardService.setreportenddate(enddate);

          $scope.ReportstartDate = startDate;
          $scope.Reportenddate = endDate;

          $scope.SalesDataReportstartDate = startdate.format('YYYYMMDD') + 'T000000.000-0000';

          $scope.ReportstartDate = startdate.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.Reportenddate = enddate.format('YYYYMMDD') + 'T235959.000-0000';

          $scope.ReportTimePeriod = startdate.format('MMM DD YYYY') + ' - ' + enddate.format('MMM DD YYYY');
          
          $scope.totalreporttime=startdate.format('MMM Do YYYY')+" - "+enddate.format('MMM Do YYYY');

        }

        function cmpare(start, end) {
          startDate = start;
          endDate = end;
           $scope.role=sessionStorage.role;

       //  reportEnd=moment(endDate).add(1,'year');
        //  reportStart=moment(startDate).add(1,'year');

           //cmpareTimeInit(compareStart,compareEnd);
        //   $scope.comparetimeFunction();

        // daterangepickerCallBackInit(reportStart,reportEnd);

        $scope.ComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Compareenddate = endDate.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.SalesDataComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.compareTimePeriod = startDate.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');
        
        $scope.totalcomparetime=startDate.format('MMM Do YYYY')+" - "+endDate.format('MMM Do YYYY');

        $scope.$applyAsync();
        window.localStorage['comparetimestart']=start;
        window.localStorage['comparetimeend']=end;
        window.localStorage['reporttimestart']=$scope.ReportstartDate;
        window.localStorage['reporttimeend']=$scope.Reportenddate;


        compareStart=start;
        compareEnd=end;

        dashBoardService.setdashboardcacheStaus(false);
        dashBoardService.setproductscacheStatus(false);
        dashBoardService.setsalesregioncacheStatus(false);


        dashBoardService.setcomparestartdate(start);
        dashBoardService.setcompareenddate(end);
        dashBoardService.setreportstartdate(reportStart);
        dashBoardService.setreportenddate(reportEnd);


        

        if($scope.role=="cpg"){

          if($scope.selecteRecord==undefined){
           $scope.cpgFunctions();
          // $scope.salespperformancebyallstoresforcpg();
           
         }
         else{

              $scope.selecteddma=dashBoardService.getselectedDMA();            
             $scope.savedBrand=dashBoardService.getselectedBrand();
             $scope.selectedBrand= $scope.savedBrand;


          if( $scope.selecteddma!= null){

             $scope.dma= $scope.selecteddma.name;
             sessionStorage.user=$scope.selectedcpg.retailerId;
             $scope.retailerid=$scope.selectedcpg.retailerId;
             $scope.dmaStoreList=[];
             for(var i=0;i<$scope.selecteddma.stores.length;i++){
               $scope.dmaStoreList.push($scope.selecteddma.stores[i].toString());
             }

           if($scope.savedBrand.brand_name =="All Brands"){
                      $scope.SalesPerformanceByDMA();
                      $scope.shareOfCategoryByDMA();
                      $scope.ShareOfBasketByDMA();
                      $scope.topProductsFunctionByDMA();
                      $scope.GetCategoriesforDMA();
                      $scope.geosalesDataforDMA();
                      $scope.topSalesRegionsforDMA();
                      $scope.topstoresforDMA();                                  
             }else{
                  $scope.SalesPerformanceBySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.categoriesbySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.topsalesRegionsBySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.topstoresbySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.geosalesdatabySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.shareOfCategoryByAllRetailersforBRANDwithDMA($scope.savedBrand.brandid);
                  $scope.ShareOfBasketByAllRetailerforBRANDwithDMA($scope.savedBrand.brandid); 
             }

         }




         //   if($scope.selecteRecord.hasOwnProperty("dmaId")){
         //  $scope.dmaStoreList=[];
         //  for(var i=0;i<$scope.selecteRecord.stores.length;i++){
         //    $scope.dmaStoreList.push($scope.selecteRecord.stores[i].toString());
         //  }
         //  $scope.SalesPerformanceByDMA();
         //  $scope.shareOfCategoryByDMA();
         //  $scope.ShareOfBasketByDMA();
         //  $scope.topProductsFunctionByDMA();
         //  $scope.GetCategoriesforDMA();
         //  $scope.geosalesDataforDMA();
         //  $scope.topSalesRegionsforDMA();
         // $scope.topstoresforDMA();
         // }
         else{

          if($scope.selecteRecord.name=="All Retailers"){
           $scope.cpgFunctions();
          // $scope.salespperformancebyallstoresforcpg();
           
          
         }
         else{
          if($scope.selecteRecord.hasOwnProperty("children")){
          // console.log("calling retailer  api");

           sessionStorage.user=$scope.selecteRecord.retailerId;
           $scope.retailerid=$scope.selecteRecord.retailerId;


           if($scope.savedBrand.brand_name =="All Brands"){
                    $scope.SalesPerformanceByRetailerforcpg();
                    $scope.shareOfCategoryByRetailerforCpg($scope.retailerid);
                    $scope.ShareOfBasketByRetailerforCpg($scope.retailerid);
                    $scope.GettoptenDepartmentsByRetailerforCpg();
                    $scope.topProductsFunctionByRetailerforCpg();
                    $scope.topSalesRegionsforcpgbyretailer();
                    $scope.salespperformancebyallstoresforcpgbyretailer();
                    $scope.geosalesDatabyretailerforcpg();
           }else{
                   $scope.SalesPerformanceByBRANDforRetailer($scope.retailerid);
                   $scope.shareOfCategoryByBRANDforRetailer($scope.retailerid);
                   $scope.ShareOfBasketByBRANDforRetailer($scope.retailerid);
                   $scope.topProductsFunctionByBRANDforRetailer($scope.retailerid);
                   $scope.GetCategoriesforBRANDforRetailer($scope.retailerid);
                   $scope.geosalesDataforBRANDforRetailer($scope.retailerid);
                   $scope.topSalesRegionsforBRANDforRetailer($scope.retailerid);
                   $scope.topstoresforBRANDforRetailer($scope.retailerid);
           }

          //  $scope.SalesPerformanceByRetailerforcpg();
          //  $scope.shareOfCategoryByRetailerforCpg($scope.retailerid);
          //  $scope.ShareOfBasketByRetailerforCpg($scope.retailerid);
          //  $scope.GettoptenDepartmentsByRetailerforCpg();
          //  $scope.topProductsFunctionByRetailerforCpg();
          // // $scope.worstsellersbyretailerforcpg();
          //  $scope.topSalesRegionsforcpgbyretailer();
          //  $scope.salespperformancebyallstoresforcpgbyretailer();
          //  $scope.geosalesDatabyretailerforcpg();
         }
         else{
          sessionStorage.user=$scope.selecteRecord.retailerId;
          $scope.storeId = $scope.selecteRecord.storeid;
          sessionStorage.storeId = $scope.storeId;
          if($scope.savedBrand.brand_name =="All Brands"){
                  $scope.SalesPerformanceByStoreIdForCpg();
                  $scope.shareOfCategoryByStoreforCpg();
                  $scope.ShareOfBasketByStoreforCpg();
                  $scope.GettoptenDepartmentsByStoreforCpg();
                  $scope.topProductsFunctionByByStoreforcpg();
                  //$scope.worstsellersbystoreforcpg();
                  $scope.topSalesRegionsforcpgbystore();
                  $scope.salespperformancebyallstoresforcpgbystore();
                  $scope.geosalesDatabyStoreidforcpg();
          }else{
                  $scope.SalesPerformanceByStoreIdForCpgBRAND();
                  $scope.shareOfCategoryByStoreforCpgBRAND();
                  $scope.ShareOfBasketByStoreforCpgBRAND();
                  $scope.GettoptenDepartmentsByStoreforCpgBRAND();
                  $scope.topProductsFunctionByByStoreforcpgBRAND();
                  //$scope.worstsellersbystoreforcpg();
                  $scope.topSalesRegionsforcpgbystoreBRAND();
                  $scope.salespperformancebyallstoresforcpgbystoreBRAND();
                  $scope.geosalesDatabyStoreidforcpgBRAND();
          } 

          // $scope.SalesPerformanceByStoreIdForCpg();
          // $scope.shareOfCategoryByStoreforCpg();
          // $scope.ShareOfBasketByStoreforCpg();
          // $scope.GettoptenDepartmentsByStoreforCpg();
          // $scope.topProductsFunctionByByStoreforcpg();
          // //$scope.worstsellersbystoreforcpg();
          // $scope.topSalesRegionsforcpgbystore();
          // $scope.salespperformancebyallstoresforcpgbystore();
          // $scope.geosalesDatabyStoreidforcpg();
          }
          }
          }
          }
          }

          else if($scope.role=="retailer"){
          $scope.storeid=dashBoardService.getstoreid();
          if($scope.storeid!=null&&$scope.storeid!=undefined){
          if($scope.storeid==""){
          window.localStorage['storeId']=$scope.data.selectedStoreId;

                  $scope.SalesPerformanceByRetailer();
                  $scope.ShoppingTripsFunction();
                  $scope.avgBasketFunction();
                  $scope.topProductsFunction();
                  //$scope.worstsellersbyretailer();
                  $scope.TopDepartments();
                  $scope.salespperformancebyallstores();
                  $scope.geosalesData();
                  $scope.topSalesRegions();
                }
                else{
                  sessionStorage.storeId = $scope.storeid;
                  $scope.SalesPerformanceByStoreId();
                  $scope.GetShoppingTripsByStoreId();
                  $scope.GetAvgBasketByStoreId();
                  $scope.TopProductsByStoreId();
                  //$scope.worstsellersbystore();
                  $scope.TopDepartmentsByStoreId();
                  $scope.salespperformancebyallstoresbystore();
                  $scope.geosalesDatabyStoreid();
                  $scope.topSalesRegionsbystore();

                }
              }
              else{

               if ($scope.data.selectedStoreId == undefined||$scope.data.selectedStoreId=="") {

                $scope.SalesPerformanceByRetailer();
                $scope.ShoppingTripsFunction();
                $scope.avgBasketFunction();
                $scope.topProductsFunction();
                //$scope.worstsellersbyretailer();
                $scope.TopDepartments();
                $scope.salespperformancebyallstores();
                $scope.geosalesData();
                $scope.topSalesRegions();

              }
              else {
                window.localStorage['storeId']=$scope.data.selectedStoreId;

                $scope.storeId = $scope.data.selectedStoreId;
                sessionStorage.storeId = $scope.storeId;
                $scope.SalesPerformanceByStoreId();
                $scope.GetShoppingTripsByStoreId();
                $scope.GetAvgBasketByStoreId();
                $scope.TopProductsByStoreId();
                //$scope.worstsellersbystore();
                $scope.TopDepartmentsByStoreId();
                $scope.geosalesDatabyStoreid();
                $scope.salespperformancebyallstoresbystore();
                $scope.topSalesRegionsbystore();

              }
            }
          }
          else if($scope.role=="distributor"){
            $scope.brandportalApicalls();
          }
          dashBoardService.setdashboardcacheStaus(true);
        }

        function cmpareTimeInit(start, end) {

          startDate = start;
          endDate = end;
          $scope.ComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.Compareenddate = endDate.format('YYYYMMDD') + 'T235959.000-0000';

          $scope.SalesDataComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.compareTimePeriod = startDate.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');
          $scope.totalcomparetime=startDate.format('MMM Do YYYY')+" - "+endDate.format('MMM Do YYYY');
          $scope.setCompareTime=startDate.format('MM/DD/YYYY') + "-" + endDate.format('MM/DD/YYYY');
          console.log("$scope.setCompareTime",$scope.setCompareTime);
          $scope.$applyAsync();
        }


  //DateRangePicker for ReportTime Period

  var startDate;
  var endDate;
  $scope.comparestart=  dashBoardService.getcomparestartdate();

  if($scope.comparestart==undefined){
  // var end = moment("2016-11-30");
   //var start = moment("2016-11-01");
  var start= moment().subtract(7, 'days');
    var end=moment().subtract(1, 'days');
   compareEnd=moment(start).subtract(1,'days');
   compareStart=moment(start).subtract(7,'days');
     //compareEnd = moment("2016-08-31");
    // compareStart = moment("2016-08-01");
  }
  else{
   var end = moment(dashBoardService.getreportenddate());
   var start = moment(dashBoardService.getreportstartdate());
     //  var compareEnd=moment(end).subtract(1,'year');
     //  var compareStart=moment(start).subtract(1,'year');
     compareEnd = moment(dashBoardService.getcompareenddate());
     compareStart = moment(dashBoardService.getcomparestartdate());
   }
   $scope.comparetimeFunction = function () {
    $('input[name="daterange"]').daterangepicker(
    {
       maxDate: new Date(),
       "opens":"left",
      locale: {
        format: 'MM/DD/YYYY'
      },
      startDate: compareStart,
      endDate: compareEnd
    }, cmpare);

  }
  $timeout(function() {
  $scope.comparetimeFunction();
  }, 100);
  cmpareTimeInit(compareStart, compareEnd);
  function daterangepickerCallBack(startdate, enddate,label) {
    $scope.role=sessionStorage.role;
    //$timeout(function() {
    $('#reportrange span').html(startdate.format('MM/DD/YYYY') + ' - ' + enddate.format('MM/DD/YYYY'));
    startDate = startdate;
    endDate = enddate;
    //compareEnd=moment(enddate).subtract(1,'year');
    //compareStart=moment(startdate).subtract(1,'year');
$('#reportrange').data('daterangepicker').setStartDate(startdate);
$('#reportrange').data('daterangepicker').setEndDate(enddate);
      //}, 10); 

    dashBoardService.settimeperiodlabel(label);

       if(label=="Last week"){
              if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);

              }

              $scope.selectedtimeperiod=$scope.reporttimeranges[0];
            }
            else if(label=="This Month"){
               if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);

              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[1];
            }
            else if(label=="Last Month"){
               if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);

              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[2];
            }
             else if(label=="Quarter 1 (Jan-Mar)"){
               if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);

              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[3];
            }
            else if(label=="Custom Range"){


              if($scope.reporttimeranges[7]==undefined){

                var obj={"name":"CUSTOM"}
                 $scope.reporttimeranges.push(obj);
             }
                     
              $scope.selectedtimeperiod=$scope.reporttimeranges[7];
        
            }



          if($scope.selectedtimeperiod.name=="LAST 7 DAYS"){

            if($scope.lastsevendays==true){

              $scope.lastsevendays=false;

             compareEnd=moment(startdate).subtract(1,'days');
    compareStart=moment(startdate).subtract(7,'days');

   cmpareTimeInit(compareStart,compareEnd);
   $timeout(function() {
    $scope.comparetimeFunction();
  }, 100);
            }
            else{
compareEnd=moment(enddate).subtract(1,'year');
    compareStart=moment(startdate).subtract(1,'year');

   cmpareTimeInit(compareStart,compareEnd);
    $timeout(function() {
    $scope.comparetimeFunction();
  }, 100);
            }
         
          }
          else{

             compareEnd=moment(enddate).subtract(1,'year');
    compareStart=moment(startdate).subtract(1,'year');

   cmpareTimeInit(compareStart,compareEnd);
    $timeout(function() {
    $scope.comparetimeFunction();
  }, 100);

          }
     
    
    reportStart=startdate;
    reportEnd=enddate;


    window.localStorage['comparetimestart']=compareStart;
    window.localStorage['comparetimeend']=compareEnd;
    window.localStorage['reporttimestart']=startdate;
    window.localStorage['reporttimeend']=enddate;

    dashBoardService.setcomparestartdate(compareStart);
    dashBoardService.setcompareenddate(compareEnd);
    dashBoardService.setreportstartdate(startdate);
    dashBoardService.setreportenddate(enddate);

    $scope.ReportstartDate = startDate;
    $scope.Reportenddate = endDate;

    dashBoardService.setdashboardcacheStaus(false);
    dashBoardService.setproductscacheStatus(false);
    dashBoardService.setsalesregioncacheStatus(false);

          //dashBoardService.setstatus()

          $scope.ReportstartDate = startdate.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.Reportenddate = enddate.format('YYYYMMDD') + 'T235959.000-0000';

          $scope.SalesDataReportstartDate = startdate.format('YYYYMMDD') + 'T000000.000-0000';

          $scope.ReportTimePeriod = startdate.format('MMM DD YYYY') + ' - ' + enddate.format('MMM DD YYYY');
          $scope.totalreporttime=startdate.format('MMM Do YYYY')+" - "+enddate.format('MMM Do YYYY');

          

          if($scope.role=="cpg"){

           // console.log("selected cpg...",$scope.selecteRecord);
            //$scope.brandportalApicalls();
                $scope.getCPGBrands();
            if($scope.selecteRecord==undefined){
             $scope.cpgFunctions();
             $scope.salespperformancebyallstoresforcpg();
           }
           else{


            $scope.selecteddma=dashBoardService.getselectedDMA();            
             $scope.savedBrand=dashBoardService.getselectedBrand();
             $scope.selectedBrand= $scope.savedBrand;


          if( $scope.selecteddma!= null){

             $scope.dma= $scope.selecteddma.name;
             sessionStorage.user=$scope.selectedcpg.retailerId;
             $scope.retailerid=$scope.selectedcpg.retailerId;
             $scope.dmaStoreList=[];
             for(var i=0;i<$scope.selecteddma.stores.length;i++){
               $scope.dmaStoreList.push($scope.selecteddma.stores[i].toString());
             }

           if($scope.savedBrand.brand_name =="All Brands"){
                      $scope.SalesPerformanceByDMA();
                      $scope.shareOfCategoryByDMA();
                      $scope.ShareOfBasketByDMA();
                      $scope.topProductsFunctionByDMA();
                      $scope.GetCategoriesforDMA();
                      $scope.geosalesDataforDMA();
                      $scope.topSalesRegionsforDMA();
                      $scope.topstoresforDMA();                                  
             }else{
                  $scope.SalesPerformanceBySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.categoriesbySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.topsalesRegionsBySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.topstoresbySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.geosalesdatabySingleBrandwithDMA($scope.savedBrand.brandid);
                  $scope.shareOfCategoryByAllRetailersforBRANDwithDMA($scope.savedBrand.brandid);
                  $scope.ShareOfBasketByAllRetailerforBRANDwithDMA($scope.savedBrand.brandid); 
             }

         }

         //     if($scope.selecteRecord.hasOwnProperty("dmaId")){
         //  $scope.dmaStoreList=[];
         //  for(var i=0;i<$scope.selecteRecord.stores.length;i++){
         //    $scope.dmaStoreList.push($scope.selecteRecord.stores[i].toString());
         //  }
         //  $scope.SalesPerformanceByDMA();
         //  $scope.shareOfCategoryByDMA();
         //  $scope.ShareOfBasketByDMA();
         //  $scope.topProductsFunctionByDMA();
         //  $scope.GetCategoriesforDMA();
         //  $scope.geosalesDataforDMA();
         //  $scope.topSalesRegionsforDMA();
         //  $scope.topstoresforDMA();
         // }
         else{
         
            if($scope.selecteRecord.name=="All Retailers"){
             $scope.cpgFunctions();
             //$scope.salespperformancebyallstoresforcpg();
           }
           else{
            if($scope.selecteRecord.hasOwnProperty("children")){

             sessionStorage.user=$scope.selecteRecord.retailerId;
             $scope.retailerid=$scope.selecteRecord.retailerId;

             if($scope.savedBrand.brand_name =="All Brands"){
                    $scope.SalesPerformanceByRetailerforcpg();
                    $scope.shareOfCategoryByRetailerforCpg($scope.retailerid);
                    $scope.ShareOfBasketByRetailerforCpg($scope.retailerid);
                    $scope.GettoptenDepartmentsByRetailerforCpg();
                    $scope.topProductsFunctionByRetailerforCpg();
                    $scope.topSalesRegionsforcpgbyretailer();
                    $scope.salespperformancebyallstoresforcpgbyretailer();
                    $scope.geosalesDatabyretailerforcpg();
           }else{
                   $scope.SalesPerformanceByBRANDforRetailer($scope.retailerid);
                   $scope.shareOfCategoryByBRANDforRetailer($scope.retailerid);
                   $scope.ShareOfBasketByBRANDforRetailer($scope.retailerid);
                   $scope.topProductsFunctionByBRANDforRetailer($scope.retailerid);
                   $scope.GetCategoriesforBRANDforRetailer($scope.retailerid);
                   $scope.geosalesDataforBRANDforRetailer($scope.retailerid);
                   $scope.topSalesRegionsforBRANDforRetailer($scope.retailerid);
                   $scope.topstoresforBRANDforRetailer($scope.retailerid);
           }
             // $scope.SalesPerformanceByRetailerforcpg ();
             // $scope.shareOfCategoryByRetailerforCpg($scope.retailerid);
             // $scope.ShareOfBasketByRetailerforCpg($scope.retailerid);
             // $scope.GettoptenDepartmentsByRetailerforCpg();
             // $scope.topProductsFunctionByRetailerforCpg();
             // //$scope.worstsellersbyretailerforcpg();
             // $scope.salespperformancebyallstoresforcpgbyretailer();
             // $scope.topSalesRegionsforcpgbyretailer();
             // $scope.geosalesDatabyretailerforcpg();
           }
           else{

            sessionStorage.user=$scope.selecteRecord.retailerId;
            $scope.storeId = $scope.selecteRecord.storeid;
            sessionStorage.storeId = $scope.storeId;

            if($scope.savedBrand.brand_name =="All Brands"){
                  $scope.SalesPerformanceByStoreIdForCpg();
                  $scope.shareOfCategoryByStoreforCpg();
                  $scope.ShareOfBasketByStoreforCpg();
                  $scope.GettoptenDepartmentsByStoreforCpg();
                  $scope.topProductsFunctionByByStoreforcpg();
                  //$scope.worstsellersbystoreforcpg();
                  $scope.topSalesRegionsforcpgbystore();
                  $scope.salespperformancebyallstoresforcpgbystore();
                  $scope.geosalesDatabyStoreidforcpg();
          }else{
                  $scope.SalesPerformanceByStoreIdForCpgBRAND();
                  $scope.shareOfCategoryByStoreforCpgBRAND();
                  $scope.ShareOfBasketByStoreforCpgBRAND();
                  $scope.GettoptenDepartmentsByStoreforCpgBRAND();
                  $scope.topProductsFunctionByByStoreforcpgBRAND();
                  //$scope.worstsellersbystoreforcpg();
                  $scope.topSalesRegionsforcpgbystoreBRAND();
                  $scope.salespperformancebyallstoresforcpgbystoreBRAND();
                  $scope.geosalesDatabyStoreidforcpgBRAND();
          } 
            // $scope.SalesPerformanceByStoreIdForCpg();
            // $scope.shareOfCategoryByStoreforCpg();
            // $scope.ShareOfBasketByStoreforCpg();
            // $scope.GettoptenDepartmentsByStoreforCpg();
            // $scope.topProductsFunctionByByStoreforcpg();
            // //$scope.worstsellersbystoreforcpg();
            // $scope.salespperformancebyallstoresforcpgbystore();
            // $scope.topSalesRegionsforcpgbystore();
            // $scope.geosalesDatabyStoreidforcpg();
          }
          }
        }
          }
          }

          else if($scope.role=="retailer"){

            $scope.storeid=dashBoardService.getstoreid();
            if($scope.storeid!=null&&$scope.storeid!=undefined){
              if($scope.storeid==""){
                window.localStorage['storeId']=$scope.data.selectedStoreId;
                $scope.SalesPerformanceByRetailer();
                $scope.ShoppingTripsFunction();
                $scope.avgBasketFunction();
                $scope.topProductsFunction();
                //$scope.worstsellersbyretailer();
                $scope.TopDepartments();
                $scope.salespperformancebyallstores();
                $scope.geosalesData();
                $scope.topSalesRegions();

              }
              else{
                sessionStorage.storeId = $scope.storeid;
                $scope.SalesPerformanceByStoreId();
                $scope.GetShoppingTripsByStoreId();
                $scope.GetAvgBasketByStoreId();
                $scope.TopProductsByStoreId();
                //$scope.worstsellersbystore();
                $scope.TopDepartmentsByStoreId();
                $scope.geosalesDatabyStoreid();
                $scope.topSalesRegionsbystore();
                $scope.salespperformancebyallstoresbystore();
              }
            }
            else{

             if ($scope.data.selectedStoreId == undefined||$scope.data.selectedStoreId=="") {
               $scope.SalesPerformanceByRetailer();
               $scope.ShoppingTripsFunction();
               $scope.avgBasketFunction();
               $scope.topProductsFunction();
               //$scope.worstsellersbyretailer();
               $scope.TopDepartments();
               $scope.geosalesData();
               $scope.topSalesRegions();
               $scope.salespperformancebyallstores();
             }
             else {
              window.localStorage['storeId']=$scope.data.selectedStoreId;

              $scope.storeId = $scope.data.selectedStoreId;
              sessionStorage.storeId = $scope.storeId;
              $scope.SalesPerformanceByStoreId();
              $scope.GetShoppingTripsByStoreId();
              $scope.GetAvgBasketByStoreId();
              $scope.TopProductsByStoreId();
              //$scope.worstsellersbystore();
              $scope.TopDepartmentsByStoreId();
              $scope.geosalesDatabyStoreid();
              $scope.topSalesRegionsbystore();
              $scope.salespperformancebyallstoresbystore();

            }
          }
        }
        else if($scope.role=="distributor"){
            $scope.brandportalApicalls();
          }
        dashBoardService.setdashboardcacheStaus(true);
        }
        if(dashBoardService.gettimeperiodlabel()==undefined){
           dashBoardService.settimeperiodlabel("Last week");
          }

     $timeout(function() {
      $('#reportrange').daterangepicker({

         maxDate: new Date(),
        startDate: start,
        endDate: end,
        "autoUpdateInput": false,
        "opens":"center",
        //"alwaysShowCalendars":false,
        ranges: {
          'This Month': [moment().startOf('month'), moment().subtract(1,'days')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'Quarter 1 (Jan-Mar)': [moment().startOf('year').startOf('month'), moment().startOf('year').add(2, 'month').endOf('month')],
          'Quarter 2 (Apr-jun)': [moment().startOf('year').add(3, 'month').startOf('month'), moment().startOf('year').add(5, 'month').endOf('month')],
          'Quarter 3 (Jul-sep)': [moment().startOf('year').add(6, 'month').startOf('month'), moment().startOf('year').add(8, 'month').endOf('month')]

        }
      }, daterangepickerCallBack)}, 10);

     $timeout(function() {
      daterangepickerCallBackInit(start, end);
      }, 10);
      /*function getQuarter() {
  var d =  new Date(); // If no date supplied, use today
  var q = [4,1,2,3];
  console.log("floor value..",Math.floor(d.getMonth() / 3))
  return q[Math.floor(d.getMonth() / 3)];
}

$scope.quarter=getQuarter();*/
//console.log("quarter...",$scope.quarter);

      $scope.getjatStyle = function (value) {
        if (value >= 1) {
          return "page_dashboard_box_index green";
        } else {
          return "page_dashboard_box_index red";
        }
      };

      $scope.getmapData=function(){
        var promise = dashBoardService.getMapChartData1();
        promise.then(function (response) {
          $scope.showmap=false;
          $scope.mapId = dashBoardService.generateguid();
          $scope.mapchartData = response.dataProvider;
          $scope.showmap=true;
          //$scope.$applyAsync();
        }, function (failed) {
        });
      }

      $scope.getmapData();
      var promise = dashBoardService.getGoogleMapData();
      promise.then(function (response) {
        $scope.mapId = dashBoardService.generateguid();
        $scope.mapchartData = response.dataProvider;
        $scope.$applyAsync();

      }, function (failed) {
      });
      $scope.getMapObject=function(){
        return dashBoardService.getGoogleMapData().$$state.value.dataProvider;
      };
      $scope.retaileportalfunctions=function(){
        $scope.inputstatus=dashBoardService.getdashboardcacheStaus();
        if($scope.inputstatus==false||$scope.inputstatus==undefined){
                  dashBoardService.createcache();
                  $scope.storeid=dashBoardService.getstoreid();
                  if($scope.storeid!=null&&$scope.storeid!=undefined){
                   if($scope.storeid=='allStores'||$scope.storeid==""){
                     window.localStorage['storeId']=$scope.data.selectedStoreId;
                     $scope.SalesPerformanceByRetailer();
                     $scope.ShoppingTripsFunction();
                     $scope.avgBasketFunction();
                     $scope.topProductsFunction();
                     $scope.TopDepartments();
                   }
                   else{
                     sessionStorage.storeId = $scope.storeid;
                     $scope.SalesPerformanceByStoreId();
                     $scope.GetShoppingTripsByStoreId();
                     $scope.GetAvgBasketByStoreId();
                     $scope.TopProductsByStoreId();
                     $scope.TopDepartmentsByStoreId();
                   }
                 }
                 else{
                   if ($scope.data.selectedStoreId== 'allStores') {
                     window.localStorage['storeId']=$scope.data.selectedStoreId;
                     $scope.salesperformancebycomparetimeforAllStores();
                     $scope.SalesPerformanceByRetailer();

       // $scope.SalesPerformanceByAllstores();
     }
     else if ($scope.data.selectedStoreId == undefined||$scope.data.selectedStoreId=='') {
       $scope.SalesPerformanceByRetailer();
       $scope.ShoppingTripsFunction();
       $scope.avgBasketFunction();
       $scope.topProductsFunction();
       $timeout(function () {
        $scope.TopDepartments();
      }, 0);
      // $scope.TopDepartments();
    }
    else {
     window.localStorage['storeId']=$scope.data.selectedStoreId;

     $scope.storeId = $scope.data.selectedStoreId;
     sessionStorage.storeId = $scope.storeId;
     $scope.SalesPerformanceByStoreId();
     $scope.GetShoppingTripsByStoreId();
     $scope.GetAvgBasketByStoreId();
     $scope.TopProductsByStoreId();
     $scope.TopDepartmentsByStoreId();
   }
  }
  dashBoardService.setdashboardcacheStaus(true);
  }
  else{
    if(CacheFactory.get('dashBoardCache')){
              var dashBoardCache=CacheFactory.get('dashBoardCache');
              if(dashBoardCache.get('LineChartData1')){
               console.log('working');
                  //$scope.hidespinner();
                }
               //$scope.showspinner();
               $scope.SalesPerformance=false;
               $scope.ShoppingTrips=false;
               $scope.AvgBasket=false;
               $scope.TopProducts=false;
               $scope.showpiechart=false;
             //linchartdata1
             $scope.salesperformanceId = dashBoardService.generateguid();
             $scope.LineChartData1= dashBoardCache.get('LineChartData1');
             $scope.spIndex= dashBoardCache.get('spIndex');
             $scope.total=dashBoardCache.get('total');
            if($scope.LineChartData1==undefined){
              $scope.LineChartData1=[];
            }
            //LineChartData2
            $scope.shoppingtripsId = dashBoardService.generateguid();
            $scope.LineChartData2= dashBoardCache.get('LineChartData2');
            $scope.stIndex= dashBoardCache.get('stIndex');
            $scope.ShoppingTripsTotal=dashBoardCache.get('ShoppingTripsTotal');
            if($scope.LineChartData2==undefined){
              $scope.LineChartData2=[];
            }
             //LineChartData3
             $scope.AvgBasketId = dashBoardService.generateguid();
             $scope.LineChartData3= dashBoardCache.get('LineChartData3');
             $scope.ABtotal= dashBoardCache.get('ABtotal');
             $scope.avgBasketTotal=dashBoardCache.get('avgBasketTotal');
            if($scope.LineChartData3==undefined){
              $scope.LineChartData3=[];
            }
            //TopProducts
            $scope.topproductsId = dashBoardService.generateguid();
            $scope.barChartData= dashBoardCache.get('barChartData');
            if($scope.barChartData==undefined){
              $scope.barChartData=[];
            }
              //topdepartments
           $scope.topdepartmentsId = dashBoardService.generateguid();
           $scope.topdepartmentsData= dashBoardCache.get('topdepartmentsData');
           if(dashBoardService.getdonutchartindex()){
           $scope.donutchartindex= dashBoardService.getdonutchartindex().index;
           $scope.indexcolor=dashBoardService.getdonutchartindex().color;
            }
          if($scope.topdepartmentsData==undefined){
              $scope.topdepartmentsData=[];
              }
              $scope.SalesPerformance=true;
              $scope.ShoppingTrips=true;
              $scope.AvgBasket=true;
              $scope.TopProducts=true;
              $scope.showpiechart=true;
              $scope.spin=false;
            }
          }
          }

       

      

        $scope.getcpg=function(selectedOption){
          if(selectedOption.name!="All Retailers"&&selectedOption.name!=undefined){
            sessionStorage.user=selectedOption.retailerId;
            $scope.storeId = selectedOption.id;
            sessionStorage.storeId = $scope.storeId;
            $scope.SalesPerformanceByStoreIdForCpg();
            $scope.shareOfCategoryByStoreforCpg();
            $scope.ShareOfBasketByStoreforCpg();
            $scope.GettoptenDepartmentsByStoreforCpg();
            $scope.topProductsFunctionByByStoreforcpg();
            $scope.CampaignListofRetailer();
          }
          else{
            $scope.cpgFunctions();
          }
        }
         $scope.getcpgrecord = function() {
          $scope.dma="";
          document.getElementById("dmaValue").value ="";
          dashBoardService.saveselectedDMA(null);
          $scope.selecteRecord=dashBoardService.getsavestoreselected();
          //$scope.selecteddata=$scope.selecteRecord.name;
         // console.log("BrandSelected",$scope.BrandIdsList);
      if($scope.selecteRecord.name=="All Retailers"){
          if($scope.selectedBrand.brand_name =="All Brands"){
           $scope.cpgFunctions();
           $scope.CampaignListofCpg();
         }else{
              $scope.SalesPerformanceBySingleBrandforcpg($scope.selectedBrand.brandid);
              $scope.bestsellersbySingleBrandforCPG($scope.selectedBrand.brandid);
              $scope.categoriesbySingleBrandforCPG($scope.selectedBrand.brandid);
              $scope.topsalesRegionsBySingleBrandforCPG($scope.selectedBrand.brandid);
              $scope.topstoresbySingleBrandforCPG($scope.selectedBrand.brandid);
              $scope.geosalesdatabySingleBrandforCPG($scope.selectedBrand.brandid);
              $scope.shareOfCategoryByAllRetailersforBRAND($scope.selectedBrand.brandid);
              $scope.ShareOfBasketByAllRetailerforBRAND($scope.selectedBrand.brandid); 
         }
           //$scope.salespperformancebyallstoresforcpg();
         }
         else{
          if($scope.selecteRecord.hasOwnProperty("children")){
            // console.log("calling retailer  api");
            sessionStorage.user=$scope.selecteRecord.retailerId;
            $scope.retailerid=$scope.selecteRecord.retailerId;
             $scope.selectedretailer= {
                  "retailer_name":$scope.selecteRecord.name,
                  "retailer_id":$scope.selecteRecord.retailerId
                }
            var selectedretailer=$filter('filter')($scope.ctrl.treeData, {name :$scope.selectedretailer.retailer_name}, true);
            dashBoardService.setsavestoreselected(selectedretailer[0]);
            productService.setsavestoreselected(selectedretailer[0]);
           
           if($scope.selectedBrand.brand_name =="All Brands"){
                    $scope.SalesPerformanceByRetailerforcpg();
                    $scope.shareOfCategoryByRetailerforCpg($scope.retailerid);
                    $scope.ShareOfBasketByRetailerforCpg($scope.retailerid);
                    $scope.GettoptenDepartmentsByRetailerforCpg();
                    $scope.topProductsFunctionByRetailerforCpg();
                    //$scope.worstsellersbyretailerforcpg();
                    $scope.topSalesRegionsforcpgbyretailer();
                    //$scope.CampaignListofRetailer();
                    $scope.salespperformancebyallstoresforcpgbyretailer();
                    $scope.geosalesDatabyretailerforcpg();
           }else{
                   $scope.SalesPerformanceByBRANDforRetailer($scope.retailerid);
                   $scope.shareOfCategoryByBRANDforRetailer($scope.retailerid);
                   $scope.ShareOfBasketByBRANDforRetailer($scope.retailerid);
                   $scope.topProductsFunctionByBRANDforRetailer($scope.retailerid);
                   $scope.GetCategoriesforBRANDforRetailer($scope.retailerid);
                   $scope.geosalesDataforBRANDforRetailer($scope.retailerid);
                   $scope.topSalesRegionsforBRANDforRetailer($scope.retailerid);
                   $scope.topstoresforBRANDforRetailer($scope.retailerid);
           }

         }
          else{
            sessionStorage.user=$scope.selecteRecord.retailerId;
            $scope.storeId = $scope.selecteRecord.storeid;
            sessionStorage.storeId = $scope.storeId;
            $scope.selectedretailer= {
                    "retailer_name":$scope.selecteRecord.retailerName,
                    "retailer_id":$scope.selecteRecord.retailerId
                  }
            var storelistfounded=$filter('filter')($scope.ctrl.treeData, {name :$scope.selecteRecord.retailerName}, true);      
            var storefounded=$filter('filter')(storelistfounded[0].children, {name:$scope.selecteRecord.name}, true);
            dashBoardService.setsavestoreselected(storefounded[0]); 
             productService.setsavestoreselected(storefounded[0]);
                  
             if($scope.selectedBrand.brand_name =="All Brands"){
                  $scope.SalesPerformanceByStoreIdForCpg();
                  $scope.shareOfCategoryByStoreforCpg();
                  $scope.ShareOfBasketByStoreforCpg();
                  $scope.GettoptenDepartmentsByStoreforCpg();
                  $scope.topProductsFunctionByByStoreforcpg();
                  //$scope.worstsellersbystoreforcpg();
                  $scope.topSalesRegionsforcpgbystore();
                  $scope.salespperformancebyallstoresforcpgbystore();
                  $scope.geosalesDatabyStoreidforcpg();
          }else{
                  $scope.SalesPerformanceByStoreIdForCpgBRAND();
                  $scope.shareOfCategoryByStoreforCpgBRAND();
                  $scope.ShareOfBasketByStoreforCpgBRAND();
                  $scope.GettoptenDepartmentsByStoreforCpgBRAND();
                  $scope.topProductsFunctionByByStoreforcpgBRAND();
                  //$scope.worstsellersbystoreforcpg();
                  $scope.topSalesRegionsforcpgbystoreBRAND();
                  $scope.salespperformancebyallstoresforcpgbystoreBRAND();
                  $scope.geosalesDatabyStoreidforcpgBRAND();
          } 
          }
        }
         // }
      };

      $scope.getRecord = function (id) {
        selectedId=id;
        $scope.data.selectedStoreId=id;
        if ($scope.data.selectedStoreId == ""|| $scope.data.selectedStoreId=="ALL STORES") {
         dashBoardService.setstoreid("");
         $scope.SalesPerformanceByRetailer();
         $scope.ShoppingTripsFunction();
         $scope.avgBasketFunction();
         $scope.topProductsFunction();
         $scope.TopDepartments();
         $scope.geosalesData();
         $scope.topSalesRegions();
         $scope.salespperformancebyallstores();
        // $scope.worstsellersbyretailer();
         dashBoardService.setdashboardcacheStaus(false);
         dashBoardService.setproductscacheStatus(false);
         dashBoardService.setsalesregioncacheStatus(false);
     }
     else {
       dashBoardService.setdashboardcacheStaus(false);
       dashBoardService.setproductscacheStatus(false);
       dashBoardService.setsalesregioncacheStatus(false);
       dashBoardService.setstoreid($scope.data.selectedStoreId);
       for(var i=0;i<$scope.List.length;i++){
         if($scope.List[i].store_id==$scope.data.selectedStoreId){
           dashBoardService.setstorename($scope.List[i].store_name)
         }
       }
       $scope.storeId = $scope.data.selectedStoreId;
       sessionStorage.storeId = $scope.storeId;
            $timeout(function () {
            $scope.SalesPerformanceByStoreId()
            $scope.GetShoppingTripsByStoreId();
            $scope.GetAvgBasketByStoreId();
            $scope.TopProductsByStoreId();
           // $scope.worstsellersbystore();
            $scope.TopDepartmentsByStoreId();
             $scope.geosalesDatabyStoreid();
                $scope.topSalesRegionsbystore();
                $scope.salespperformancebyallstoresbystore();
            }, 0);
            }
        dashBoardService.setdashboardcacheStaus(true);
       }

      dashBoardService.settopstorecomparisionstatus(false);
        $scope.gotostore=function(sid,dataflag){//dataflag= [withmap,withoutmap]
          $scope.selectedproducts=[];
          $scope.selectedvalue="west";
          $scope.selectoption='west';

          if(dataflag=='withmap'){
            var newObject={
              "amount":sid.amount,
              "retailer":sid.retailer,
              "storeId":sid.storeId,
              "storeLongLat":sid.storeLongLat,
              "storeName":sid.storeName,
              "content":"STORE NO. "+sid.storeName
            }
            //console.log('withmap value :',sid);
            $state.go('storeComparision',{id: sid.id,storedata: newObject});
          }else {
            //console.log('withOutMap value :',sid);
            $state.go('storeComparision', {id: sid.id,storedata: sid});
          }
          dashBoardService.settopstorecomparisionstatus(true);
        }
        var getstoredata;
        getstoredata=$rootScope.$on('getstoredata', function (event, data) {
         $scope.gotostore(data,'withOutMap value');
       });
        $scope.imagebuffer = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABVlBMVEX///8iS5v0ejH+8gD/9on/95f/+KP/+8r//Nv//Nf/95D/+a//9oX/+r//9oD/9Wn/+8///eD/9GP/+Kr/+bT/9F0AO5X/+rv/9XD/80P///v/9nj/95v/9ov/8zT//eT/8y3/9E7/80YANZP///X+9QD/+8YZRpkAPpb/8y/0dijzcDMRQ5j0cyD/8hwAM5Lw8vfzbQ7T2OfByN21vteFlcD1hkr1j1r96N/e4u1acq6nstDy9PhRa6r2nXBkerL1hC5+j72eqsz6yrEyVaD0fjr718L2lGP5vZ/9fCctUp+Uocf83RH6zBlugrb3qIL4siL84M798eT83BFWU432kyv4r475waSsZmh+W3/6zbXzZQD70BegY25CYKXScE73pyVDUJPcc0h5WoC4amCNX3j5wB4AJI31kCvndj68al1qV4jWcUujZG32lhL4tSL1gwD5w4C5UriFAAAgJElEQVR42tWd+V8aybbAW1BccEMUFBdUWsG2QXFfIkaNu9FI5uqMkzjJ3Lm5s9x3573//5dX55xeqruquhtEk5z5fOajHQW/nLVObZr27KJ39yU7ekdHZqcqcZLK2OzIaO9Ecr5b175v6RqeHLGpVDI91DPc9V3CJcen49FlYTyZ+p7oEiPxZmQk8T0oU8+Oxp8io9ncN42Xno0/XWbS32j8ySVbgWdBDn97muwciPKXV1CimevgN6W+iXCsab+E0lYS34oiU6NBbNPTC1NMxiyZnbW/GoPHC0SqeoHx/DfANzijhltAstnZGZQRXugR8gKnEnOk+2u735gcb3oa4JANeIaGhgb8wp7ZqLOACdqUvdjY13TIwSmp8ogO2ZBslMm4KPAYSZGTKKWq/GqMXbMqPKQDOCLr7+/vBWl3Bb9nz4mUMIFSATnzNUo6fUBmnEx5Fh3CAVp7++RkD5MOr8CjyUlgRU6GSZRMlTJzHX3xKqBDhgfaY3hMdxbcJJFNMEn4BR4S6aSFCbpkkJYm/W8w8bIBRqo+wgPlWXTABjBpJkmSYfYfCTwkUsBESlIlQYqMlZdzx9yQ/71ZXgDrRDymPEZnwSHZMJMsSR8KfQ2PEdTGZJRMlahJZq2QQ3zvM/BCJcCwwOeoD7TXjrojOELr65tH6XQFvydWi5NRgi7bUZOuIn3v1fcSEWZEysfhgfKQzmLr7Bxk0u0XeIiowImUqEoOUsY49OxqnFfyMeucRDymPKSz2BhMV1dXiiQPYn3NnhIocBIlUyVATpK1yhk7nxdwXMnH1AfGSXhAh3CIxqB0lJwt9C3BAidSMl0CJJkrKFLB2P+MfPmKN34uTDl8oD4wTgeP0VlsOb1++3B/d1Pb3DiOxYxY7Hhjs3Zzd/9wW2f/RpxECaq0IUGRFuPUgjeuLjxbbswKCvTwgfoIz6JjcPWTs9pGtVoulw0mMVvgG/asWt2onZ3UERN0aUOitXKMghrnnwewX+Qb4fiS6Hs2HjPC2/uawdhcLpkw0KpRu7+1KBESfDLJMY6IjD3PkQRnfYDMQL18fWiciJerH9XKYXA8ZrVcO2K65CB5RjRVL+JM611QbqAQX1w+UB/gnW1UI9NxlBtnAIk+yTG290pNtdJiZ+yWK9DL1wW+V79neLHmhEHe1y1F8oxoqoIau54rxlQqpEA0UC+fnjupNY1nQ9ZOSJEOI5kqqdETVFsYbxIBCuT49PtYw8YpM9fje51jDFBjslWAPR7AsVlLgWSgDl/97onq4xRZvqvbjJapWmqcHfMgtmhE1csDooWSAhMJMFCb76ZqxFonRvXGZrRNtZ2C6thCpdVZo9/vghBCJ20DfRY+YryzbNU21cletFSvM7a3FhBcEC0UPJApEAwU/O+s5Xxkq2eM0TZV8EawVL8ztrfQRAHQsdB00lZg7sEox55HyrGTnK1GzlK9iD0tCzIsxqAL2hZqKbC+WY09n1RPwR1JjbalgjPyiBMtShMIaLkghlBS4PMYKO+OZ7Ya0VJtZ+QRn5A0+jjABQQEF7QtFBS4UY49t5Q3SI22pfb2IyIfUudbUKp5ANFCSYGxFxCjep9zLVWK2PXkYpsAIcaQCzILBQ8sx15GyqcYVC1nhHjjR2yuDJcDWi6Y12/LRuylxDBuMW9Q2pAgVpoBnPUFGR7wxSzUDapkqRRvbEQu3Iw8JdP7AClJ1Mqxl5VqTQ9E7Gl+vOQBhDq0K/UiMVSMqbqe6mJ1qgJxvtkowyoZjKI2IMYYw4i9vBgxljYAMUuIEFH56qaxaMP5MCvVfIC31djXkTLGGx7RXQ0Yj0811/itYC3K8qBtonn9pCnARb805YwWIhoqy4tDHsTeZlr3MFyCWtQKMqDBh2oTbL9/+vvLh/dXFRqDXb3/8OXvT783wVk94RFZjerJGZGn33KeKIOAHU0CAty7D5U5Eud1re+v3r77vUFKRKRw0wGI3mgTddpmxBdGWbHNKhky0UYAFxdfv3vvIfML/OP7d68bgXQQWQHHynBvQB1odH4Qo8x4PwHON+aDDO/LVRAdR3n19+vFRnyRJQ2qUSchZ/Cu2NegjVKUaWfDJaxFU9Gj6OLiu6sIdC7l1afIigRELODSEx3t/mgTxU6HBCdk40ECrEcEZOqbi8Q3VOE0+SWqIst1QnSjjWuno40sQsBUT1EGAfP1aHl+8fcP4Xgjk8OwjN2ryA9qRm+NAQUcpkWINpj4nVfpjj6i8DhhJ9SiG0Yk/QXzVUZ6hrtz8iUBUkaYh6uWN++OuUcbOcoZElcMHWV0eG2UnBCjTC5Ksb0Ye6vkqwz1ZLty8qjtMr6NLXrYjNO7o9s6+1neQ8o1hsi5Im+niZB1CIKNTqCNsjB6FgXwnZSvMtCRTeWCghrP+G4RZ6KqsdO7hy3ntx7K3sEUBVRyRa+dBgebAdFGk5HD6OLrKz/f9EBHXypKH4hnvPrfY56NpGZIA2pStNPxwMV4go06Thjug4t/8wpcGJ3ok69/fbWydrn/CF8plt72yH7P/wEbFG3AFf12GrTsdsZVoWWjmAmZE24akRU4NToxr2bbKRYyJTNz6O2TcCL3oxO/jxinjitadlqJMN4f5BozXhu9L4c1Uv7L+MbGE2q29R0T2IptIIVt2eo4JrOeUd726uX1RRG+uhE+4eoRZ6dsIMWV4OqMMcWHmdHxdlAh2mhAqreC+f+p9LYMbCWXjeRCWPrg86FtZsltS/BbJVS35BOu1i07ZWNFKMFdJc6EJnsKM24czUkzoZ2oKJjL2HbX9wQ2FPNSbqTWYqDtdbPg/BaqWxbnjE2yUzvvc8FGpURnzTYfZsBG/YnCZcup2A72MlI2ksyKf20A50Cv9pdM/ofh2Z3sIy7fg53ywSZEiYOCCkUbdZOwgm119+AxiI2k6J9aJsGXWCkURXUravA6lDZOsOGU2BUcSEmFVpix46gBSdg4FROVw3YYhY3+6nVvL4gfoq8uSdS9JY8DEE/dYMMrcUi6MUShQv3hZ6HA0LwB7/D6sVAoRWHj/uq8HxCHr9s+wLYSPFXVU2w4bAcbnxLzQd0njwq783otkO1NAYJCVDaLEH5Z2EmEeeLC90rmATzdUEXyYyfY+JTYG1AjcirMDuYVRR6xZaKrzeOF157UxI/sDkv+D2OVPVUnKww2UiWKf/OERIW6lI0l4aUm2bi/WverEMrXVwX/zxbgPQPqjbKuUGJaOS6sLNgq9Pc8IAk/kY37q9P+jTHw8NKUqjugZCzfeZXoFDbTAdneUuGwt1RuK7SAjYuk/g1hOFXtt9G20ho8/jmoa+MoEXOiOusPuIMKq5whE1253C+2jM1S4SuZkcLbrWakP5v+b1DTxqtEd4gxrowzrCKFcgZtdPlNppVs5IW7spoUjfTa/17FHeoExKIqka9OvYRJPs6gCjGhtLUaj9noviZTIY6ZClIjzcXn3gd04cpnjhL7x/lYk5VO+FqpglWk8HS31HrAR03mhZihRSNdWqapTOxshITTdMKXMEak7RknzuCuhjfFZwJMCp0ceHogRFKnEzD3OoAQBopuwnDNlM/laSHOwGe6XGg1YGbfWyB656gFizGdTsDcVYASN6A6lcSaYUnR7cSZZzHSYmFXkzohhfYVMZK6nYC5T4sBbX4n1qjM1DVSrGeYCnFSfK+lRmouXS9T3JZshJWme28nwD9Ahe0aVdjKYZRvKNYkJqiukUTTrM9IE2k00qWWKc8sZTIH29bHWVGM7S8COwFzXxZj9iAudnpz9nCyhXL7cHf6M8Ya0UzdxQujgpGCk66VWsNWyOwd7K5IV/3z6yi2C8GdgLnXsC3j9O5kSzJs0LmU6Jppv1iTTllGiul+v9gatuXA3bWOOR2a0k7ApEP4oXa0pZ4TzM9TSvREU6EP7BhpSpp/n8aGjRL5qTw49n0sBnYCBsImP3UumvrHwQlPureNdLU5Iy3K2eBjHh5TzNlkpV6PRmolFuGIjOWV1bXdw8PdtdVt5/XFaJr2zQA56T4rLRIbGN1Kps5Hp9QzbnKvdzsBSU9veXd9p63ARgOlkmmy/2WWHg9fkRaFpD/gc0O7Jk3jwCPTlApLq6ELAcXzBKRe73QC3BVr27vXsoFOsbR0Se6GM1F8bep1QytXMCPVpfk3kiz5bGll5ZW/GytIWl51UyegYk9drawXC8qBTmmPqsFEhzdf5D1FIrgh5gqsdtbNwFii+Fca7pCsXpuFTIYZ0ZqqkuGr7pK0E5Cw65K1NwUz0HZQ491+R8x6mmyWG04k0EiL6jhp7qyvHcrfr7Tr8F1kTCf2CHtvPHOM8qobS1grVKwWS2FRYQkiju53RGq5TXMlmzO6F4zUYSOzU6i4YAXRVzu81Zk7ilw/05sepF6Con9BL7YXwWMot9iOWOEH1pqQDX1Foo+NRA5Iwx3mf6b33wsr/pmYkd7kINfKE71+yXmzlVKUqE5vPZzwZURPoFmwsiENDR22oo9N8Rdxwx1tOVMMqDBnJwaFLqxgEsU9x9wjlscmVtiWIy7woWbYE2hYNsxjcx31dimykVwqjJTSrzByNq9twor0MLblC6VDRwWk9n8fOiLXrenjCj+nKMXQta5i29qSjgO4SlJsXJOT5OLxqU5F81zp0NuRBzhvUIf+0rSDr2isQKOs/7ZOzmrH1Z9PpOMAztsltQJ2ubu9vSFkUzWYi2+sn4rcC6MCgUpTjnCUK21ZRYMNjJSKjfbWVwNG/1hJShpKZEGu962ETgxYDi0mkeDfyA1TP8qtaqb8obS9Y0LJRqPrWsDoP6PJh0GZXT5IXRfCm7AZcuiV6INw/HT1rFPVuMFU94XSYRWb1dgCI321FFR1C1HI3OMKnTeZSHanaapmX9E0TVWgSTnDCyeY6k4etkNplwbnN+R+Vpz3UA0Y/VtVt/9fzTduzNyLxkfZRVvLiGOzzM7B5YH4IjTPONg3TMHUrdtSzqp16mBMdqST2c5u5fIS4zRg9G9X3d4wlHE1uLZUbMDkJJVjaWdFUXBgLMth69ubLjq5upuSBSy/6MrfllXdV/Xo36m615b4Dtuhm0Qjdw3Q5MR4lrm0X2qnKKvT84NiJyPrNE6AkGZ+5we79AfVxHldHiy9VfdaAQstVhItHSw3AUgmJ6iQinGpDikEpKyGG0+YcCp+Ox2ms/OD6lVeGwEhfIlrXezumEuFx4M1LoauNhAXV6VeWHAaFkI+xhCQw+kLX+3d43QSrXQIyxO6U/qdoZjnkY4DPFW3ShoYUaPJCa2pohuxhISEIcCavvAmxH6npCHCDovwRk5Y3QqtusU1e8ta2IhaanIrBfUbCPA7SsIBp39itzCIsKaYOQ+vuoU1e//G+vZVA71JyjrXpvINhCkjGkzaU1CelD/iLPqwSpoEJIuUfiolNO4Cqu42+Zo9K8I2oEIr6xTUb7BrykIArBruFAhnubKUI8xtKHbHhVbd2/71iPTxSlXIqpNMoaDIOkJVAVUAM4tLNhQpSQeTNZuwnScc0zyNtjDC0Kpb2/HXnBRhJW0dM7O/vru6rSmGhnvinL5iKaf1G/XjnIxwQSTsYyVN7lhqpEFVd0mT2pYVYUXAzLoi8NNnIpn4Ui8tw8HkPUyUcoQVe3bZTziMhHIVnqjn3KyqW2gKkkLEGsG8VnUL6DNpZHaW0sjmMRD2BRDO8jqU5wottOoWpgIoAIp6z9gdhDfyrPPYwJwCDQ2rG1LCeAOEgVV3QW6k1FsQ9W7VZTIjxc+koSUE+BtH5Y0wHYb6YYSqW7BGGgZdyocCcmt8ozU8O0tr30L8MM4TymNphKr7QJ6li4pugMx+6TNpZHYWfyNXNTYVsXQ6cj6MUHWXpM23FXWckcwabjcwO8tGL6xoWkEjNU4V+XAsak0ToeoWUKgMOFAb6Zr8M1nNRGDLFDKPB7vWDOmmYcgz/qykLu2U16URqm7B36gMyKjikmQkq/pMxAkUz0RzrhozbhR1afSxRXjVLS8DxIkzd6JYvv5CPvFVBLali31ZI/6ozIpmxdgi6vgwQtUtRH7KCeJ0uTNRvCqf2hZTSDFTWHq8PlzdVgw+Nw1cozgoGx9GHeNHqLqF4pPcraA2UgGePhNhWqC4L1374Ag0zmABn3SMPyHr0+RPytKqWzEvalXdj9L2kMRI95XjftKukEIyK8H9A2akrKa0F0b1e/s0EXttVHU/tgX0uoU6hNxNYqR2+0ay6hmfLynTpzhrhXYLob+6xQhlvTZfv9QiFPqlVHUXglpjQnlCJOLvOJOfiqltQetOjeffGrdj/nuXIimuhqY1mN5+6aDQ86bBhV5uvNct2BaSiHpyVzOYcu0K/QDfEha+hYClBvqUgWWppOftn7eQFzURet3CZAaRHJhKI1VNbReVkUloIVCpAbnNW7Tx8xZiYSpLiIFV9768PKFataQ20kv51LYQsLlOsH/vAL0HqvBOmvDj3FIMOyFK0wVV3QojJZ0ICsaRt6gnd4Ze0b/YLSmb6UKHkVpQ5ZibLHzpcIw76cNJiG66MM7/OD6PWnXL+xdiEeT8vZKh4bK0knNzxRtpnxTtrXzrrqLl0uEot5XTmy4gmJ7/aH4u/vCHEanqFgPgoXQI78zQi8nVeqUlRbrVXu3JS4qqs7FETBYTsrUYdqfm/ONn4/z8TzNa1S3vX4j5xW3+iwtKDzWFXS/DHtWDQlE6EKFZpA0+lHrXYnSJwZS63sfmr3+d//LPH386j1J1ZyKO1R0jFYeG9EqSt2FVKezjVIy7MezjyEISSvOyNVFJK9T8+K9fP5//8sO5eR5YdV8ohoaX8oLGMdJdU16/70Qf3uMiIdrIXn7g6m7fmihtQRpqbqsffyTC0nlg1X0p79qTQkpqI1X0L7TogJk1u2Kjbd2SQDMmXZuYJkd0dFg8j1B1y5ehb2eUM1SvVAElcpeNPix7mze5YVq6NlFYX2oN82OmYf508ePHf53fBHQwS0H9C7GT5kwgSTxUXr+3BXa6rf2lnBv2i+tLU/41wrgNX3+o/njx62+//FaMUnUr+heiGzqznPvyoWF0wiXMFNb5ceUTa8eFfLG+sM4bHbFePf+teGH+dRyl130hV4ipHhoWFN2pqBONSxhHc2Vum2Wf44a+dd7iWn1yxE3DOD82zqP0uhX9C0lwKloTw9fK8rrUAKC9B9o4zaWcbChZqy/st6CMaJemEaruQ/l4R1LIFouXBzttBXHhkNOditIMNksUle7K7hZEbveakw2Tij0zjplGrrrl/Qt5jWDKF7W53anwXunSNQ1P7qvcESD81i7h7Ii4WJqCmVqn0oRX3UJ5YimkgeTNjQFDpp3Mwp5VpzqHNdtGqtz3JO5do7LmqByx163oX2gNzN3TKGFeuobaM3Hs7PLTbqrn56QDp6DpgMOGZHvX/PsPLTPVqxF73fL+RWPrL2jXNiWMx4x0TWKpUDxw+hn1jeovP/318dhwNqwH7T/M+feQWue2UG8/tOpW9C9UdZ7a3LP2kSRrj0v2gSlFaHWXMoXSzuUq1zM9q57/8/Of//lo/sew0j3sIe1R7SHl9gHPwglY9tk7UNRGqLoV/QtJzRZSgQ24B5Auw5lubHD55nHnen131dfHPzLKxm8//PHD59/+MA3PPuBRxXb1tGimfYM0UVoNr7qF+G6N+huYyHV3bWdDz66sn5VZgDj//CuOCv75pxFlL7e4H59qU5YSI1TdBdX4IboOuV3bgYcCalv2hVlsUPeLaf7r/OPH6oNdkwbsx/eYKW2ypOMgy0Z41a3oXzQyk1v07NqeUJw9vnV0E3OuO0Md/vGZ6dA5U6Ej4EwF9yBRrE3dWHNXDa+6D5QL0MKTN02ZFS52vbuGZhL8liE91fVAi865Fif44U+xv/4wI56LIZ5tQrGm/nN41V2Sxp98WPJGtAI3Zebf+QUHUc/M4ro72T185z99/vOX/yn9J+LZJm7S52INKPEotOpW9C+mKXmrZ6j3DnZXPVNmk8pzlP8hXd5zjvmQU6E3zvSrj6PzHtYWWnWvS4eG3RT3ly9KoTPU4ln+PkDVwSYG1DS+g6ICThasCOdEoRJzoVW3vMU3aYey3YtCyTRhT3JmqW1fuVVM706oAN8GHRHtU2HAOVHuxUee49pSQVX3q4D+RQVWQTgbnC7XL3dVM9R6Z7p/JuCo76vAM7CVZ30lI53X1teZD6i69wL6F6koN2nm5xPjY2FnmVeCAY+in9cmPXOvL2BXN50rquhf0Nx5RXXKZqqvY3Qh0mHtleCTYZVn7rUHXUvCKzG06vbXc0XaVG3/+SO+Cxly3cM9Q5Xop9FXIhxAL1WhHnglgqNEOnqgLajqdus5a5XS9bbv1Mfx5CDcnZsaTLaPxBuTMECjplLhQPAVXe4RtPnQqhtyOrKV9rgckIi3QsIAY2VoXkjPL01FPIN2IrTqXv63NL/NtgTwKuQmAQwzjZxBKxxCO5kN73VL81uuJYBvQwDdc4Qnop4jzCkRz4Lu71Kv65YuALFzwEgrAN+F3QXRxFnQvvO8R8cDVphkVpvLb1H54v8IBXzgz/P2XKnTFfVM9o7wdd3Oltr7m433c/FWydz78Putal4b5VQ4FFBlpDx36MyHVt0WG24XNrzn6j+FL9xC8RaPribO1XfP8mfBBg+AD6q6c7UNz1Zoyd0IzcXQCNexVLcwjsruRuiPfL/FUFjVLV4ctPgpPvdkD/wUQYHVIz3fLbfRsMt0JtzbjdNhVbdkqfRi7MuTTHVu7kuUO4PKN+7FCH4bTUe/Uy4VUHWvya6ciHTPTDDf20j3BWEmVNwzMx3ajRz0HLip2DZYkl454TC+bYoxKl/MOH7SXUHOicK96qqbXwQhv0/nS7xBSPbjX2IR73sy6nnlfU/jDdzZNaisuulQpK1q4J1dn97PRYaE29cauLNrK+DOrkj3rmWDzjKEMNOmhRyybRnr39HvXYu16N61iFd1jjiHwMuq7mJxmVsEEXz5Wuzdh3jA5Xn4Tx8+xRq6O+824O680WiAZKd9iqrbvHilBR51L95/+PZqznsB4pxz/+Gn143ef3jruf/Qd9uqFlU6lWcZthWsBQXH0e9ahasqX//33Ze376+uKiBXVx/efnn3j9fN3GF5G3SHZXdkQq2fpjV2hAMKi9aQYqPhy2Rf4B7SSa0BqQhnGcIxHtb5gFpu42vclhszjDoHKNwlO9YIoJbnzjKkDVXX3CTzVuyr3Ad8XPdcefy0+4Bp2W8JWkxv/Buq9JSuf407nTdZJRNwp/Ng44BaUbZZTB/Ei8drL33rcfUGrx5XAnZorZF8NmndrX7/wnerHwXfrT7UArhcqjOJ9wLD/Tpwd/ULXs5txLYgxkAlIwecfhqbPpjsGZ2xbmJLwG16ePexfvpSaqzWdAyiWKo5gFwibCbK2Gz2zBfefQz3c3cQ4mAXs9Sj6kuo0ag+WC6ItSjkQT9gvlnALHc9wwKHmMySM+r1zfILxNA6WSgbD3KAnIk2FUb9V5fYN1iPwhXWE7YzYsB5XjUaZQgxjgtCsS0AZp/ighM+xCELkSwV1fis3lit1XXXQglwyAeYflqU6eER8Rbr8f5211JBjSfHz2Wq5eNbS4GWhUKMgVqUB5x4apLo9SLC9aTgjGSpnZg3cvfl52AsMwNFD+y0LJS5IARRL2ALMj2PWJninJFZKqgRTFW/a7k7lqtnOpZplgJdF5yqtBbQexMjIrqWyhg70VSBsdxS/d0hH3lgMkEWii7IZ4mnm6gQbiDeMGcES0U12qYKjGcts9WycWbzgYGSAskFPTHmqUFGmjRsZyQ1WqZqMx5ttMBYjerGg8NnhVBUoOCCT0sTXpmP+52R1NhDanQYc7c31bLxpPRXvbnNcXygwB5LgT4XfEqiF6UrHqBGjhEUudksJMM7BfV5+VQKbL5UU1SoFS8iqpEFVS8jKbJ+3wQk4B3VSX1ePgihqEAP4LSutVpm5GpkpsoxgiIBUn+4MaJTMrrYzYkOeKA+ng8MFEKoX4Ej2jNIT1xQo4/RUSSEnVz96OYYJ4cDm0vlcvX4BpTH43n4mIH6PbBlI/qAeMObqs1IiiRNkk/m9Nv7m02mTVjka9is8JWBd24ZmzdHt3qOfI/wSH0cn2igLY4xHmf03IZTqSyAqRIj+iMo0oFEVSJmTt86OTq7u6ltbm6AbG7Wbu7Ojk624J8YHNI5eKA+8j+Lb3ZqwavAMV17PvFePQmJg2d0IZm5EiXDBE5Y2QasJPgNoDHDtOmYcbp4PJ/fQBtr/DYuvjvtwVRtRjJWslb0SaRkmIwTQFMWbJ6+7AI0gAM69D2yTjJPl89noM9noU5DakjJiIpESKZJomSYxImkvOAzYAPdAR1qD/BQfSy+SPlGtReQvriUkYdEc0VKhkmciOoIPQA2Bgd0lnGidaL6pHxR5wefrMZRgXGBxVVUJFprOzNXpGSYxAmgKH1IhTJssTE4ogPtgXWCebL4uSDwjWsvJoP+965wikRNAiXoEjCBk4H6JE1sYJlEh9rj1Od/j+lu7SVFWCMLjDYkmqtFidqcIFKPwMMOgCM6NE4bT8LXupFS5Nw4HpdBjoG1jgyRKgmzfRJAEdUVfDI52W7BWXSAJ1NfPN6f015e8iMSRkuTRMkwiZOB9gKrI/AtewxsYJkDQ6A8W3si30he+zrSLVntbEESJWICJ4D6BR4PEBzSYWyR4MVnurSvJ4PS3S4M0qZETgYKpF4ZQrQR+BGgm5qWGSfwdWtfV7rlS55hRQLLIQxzbBZBCdURejTL2Bgc6k6+C2OgS/v6ku9XLQZCTOBEUhRkIoHHC9NqOFh5pmvfhuTSQdtgcIUJI/UJPQ74vemk9i1J93ikFWxhVFz90q19c5JtxSYEKztktW9T9OFWQI4M57RvWHJ940/C65/XvgNJpQeaohtI57XvR/LD/Y1snxnrzX5PdK4ysx0DUyFsU6Mdfd8lHB9/Up3DiR44Ro0mjnD6aqC/JzHcmXqBjP7/xKbQRh+o3YQAAAAASUVORK5CYII=";
        $scope.nutella="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEhIVFRUVFxUVFhUVFRUVGBUYFRUWFxUVGBcYHSggGB0lHRUVITEhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGhAQGSsgICUrLS41LS0uKy0tLS0tLS0tLi0tLSstLi0vLS0rLy0tLSsvLS0tLSstLS0tLSstLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAAAQMEBQYHAgj/xABOEAABAwIDAwcEDQoFAwUAAAABAAIDBBEFEiEGMUEHEyJRYXGRMlKBsRQjM0Jyc4KhsrPB0fAVNENUYoOSosLSJDVTk+EWRMMIJWOU8f/EABoBAQADAQEBAAAAAAAAAAAAAAABAgMEBQb/xAAwEQACAgEDAgMGBQUAAAAAAAAAAQIRAxIhMQRRBRNBIjJxgZHRFGGhsfAkNEJS4f/aAAwDAQACEQMRAD8A7gFKgKUAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAQFKgKUAREQBERAF5e8AXJAHavStq2BrwA7ddAUn4rENxzdwuqRxbzYnnv0Uczl0aB6lAJ4j5v+UAdiE3CEDvcF5NZU+ZGPlEqqHj8BTnHWhJQFTUn/SH8Snnqnzo/Byq5h1qMw60BT5+o86PwK9tqZuJZ4FQXDrUXQFVtXJ+z86qNqzxsrSx6kyHqKAyDansVUSLFOjd+CvUbH+d9qAygeF6VnF5Q14FXaEEoiIAiIgCIiAIiICApUBSgCIiAIiIAqNVuCrKjU8EBaSH8egqm932+pepN/wCPNcqMu70H6IQkOfr6f6yPsXgSnTtt89/uXgnpfKH1rlRjf5P7r+v7kBV586fJ+ckfYqfsk2v2A/zWVON3k90f0nLx735LfrEILk1R+l/KqrKg/juurR43/vVXa38fIQFcTH1fOLqWym3o/puqLftb9AqWbvQPq0JLoPVRh9R+xWt/tVZh08f6UBVi8tvp9SvlYQ+W30+pZBCAiIgCIiAIiIAiIgARQFKAIiIAiIgCoVAJsq60rbXG5HStw+kdaZ9nTSA+4x6XNxucbj5usKG6RaMXJ0bG9pv4eoq3m3eg/RarUTSRxtaJXHKLZpAHl1uLtxJ7iFr9XtjNGbOghlHWyR0R/hc1w4eco1IusUnwbJ775Q+teraE+R+69Ui1Z3KRAD0qScH9h0Mg3k+eDx6l6i5QaLS8dS22XfFfyb28lx6ymtdx5M+xscR8nui+k5VWjT5LfrCtXbt5QadOUWDd8E3vSTwb2r3Ht3h/+sRu3xTDcb+Yp1LuV8ufY2pw3/vFVH4/gWrnbvDv1jzv0cx8r5C8v5QsOH6V57oJzwt5iWhol2Nqbw72/QKhu70D6srUXco9CNwqHbt0D+At76ytJOVCmGjaWqd3tiaN1uL77uxNSJ8uXY3o7vx5oVw3j6fWPuXPY+UKWQ2jogB1yz24W3NYfWszTY3USC5cxnwG3I9Lyb+AUakT5UvU26FpztNtNfUsiudbPY7LS1fMVUjnw1DrxSyEksk0GQk7mnQDqNusroqlOys4uLCIikoEREAREQBERAQFKgKUAREQBEVKqqGRsdI9waxgLnOO4AC5KAw22O0Qo4MwGeaQ5IY95e86DQa2FwT6BvIWE2YwY08bpJ3Z6iY55nnU3OuQHqF/HssrXB4nVU5xKoaQLZaWN36OP/UI8517+nutG0+OhjS0HVZSZ1QhS0rn1+xa7T46G3AK5xXYhJM/m49Sd56vTwCpYxiTnusNSer1KKaQQtOozHefsCzuzsjBRRmKXCaKIAzZ5HcenlF+wNsfnXiomw4eTHIO6WT71rlTWl3FWpkKWTT9WZ6aopvemYfvCrOSri4Pm/j/AOFh3OVIuQgyM1br0HyfKd9ygV7vOd4lY3MmZKIsyns4+cfEqW1yxgcpzITZsFJiditwwDFxcAlcwEivqLEXNIsUIaTO2VuHx1MJjdxFweo8CsrsJjr5GupKg/4mDQk/pY9zZB1ncD6DxWi7J7Sh1muOq2DGqd5LKumNp4dW9UjffMPWCLq8ZUc84WtLOjosdgGLsqoGTx6Bw1ad7HDRzD2g/esitjjarZhERCAiIgCIiAgKUCIAiIgC1ba0c/JFSH3K3P1A85jXWiiPY54JPZGRxW0rVqmYeyKkneDGz0Nia8Dxkd4qsuC+Pkw+0GNCNpA7gFy3HcVLidbk/MsttXiOZ7uoXWlSyEm5XO2eljikiWS2149apvkJ3leCVTc9C7ZUL15L1RLl5upoo5FRzl4Xm6XU0VslF5ul0Is9pdeLpdBZ7ugK8XUgoLLyjqiwggrpux+02azXFcoaVlcFqix4IUFuUd02ek5irs33GrvccGzNaSHDqzNBB7Q1bwucYFU52QniJIj/ADt/5XR1tDg4cy9oIiK5iEREAREQAIgRAEREAWBqMPZLJMHXBuNWmx8lvoPpWeWNg92l7x9FqEp0c3x/kyldcw1DDe9hI1zf5m5r+C1Gfk0xJu6OJ/wJW/15V3eskDQSTYAEkngBqSsNQ7S0UzgyGrp5Hu8ljJo3ONgTo0G50BPoVHBG66iaOJS7B4mP+zee58LvU9WcuxeJDfRT+hmb1XX0BTY7Svk5llTA+Ufo2yxufpv6IN1kU8tE/iZP0PmR+y9cN9FU+iCU+pqpHZ+s/U6n/wCvN/avqBQ4poHnvsfLxwOr40lT/sS/2rycFqv1Wo/2Jf7V3HlD2qlomxCJjC6XP0n3Ibkybmi1yc/Xw4qjyb4tPUwSyTyF7hLYGwFhkabAAAAaqtK6Ory8nkee0tP8RxP8i1X6rUf7Ev8Aan5Fqv1Wo/2Jf7V9LSyhoLnODQN5JAA7yVaU2MU8jssdRE93mtkY4+AKtoOZZJNWonzo/BaoAuNLUBoBJcYJQABqSSW2A7VQpaGWRzY42Oc9xs1rRckngAvozag/4Kq+Im+rcuO7Efn9N8a1Zy2aR6HR4FnxTm3Wn7GqPo5AS0tIcCQQd4INiPFbLDycYq7/ALUjtdLAP61b4p+cy/HSfWFfRFZWxwxmSV7WMba7nGw13DtPYkPa5J6/p106x6Lbl/z7nDoOSjEjvEDPhTf2NK2LCeSKa456pjb2Rtc8+LsvqW3t5QcOIdac9FpdYxvaXW4NzAAnsVtsFtNBPPJBFzric02aQNAtmAygBxO9/gFeonG8XVRi5ODSX5fczFFs9FStY1pc8hzOk+3nDcALBbWsVih1j+Gz6QWVV0qOGTb5CIikgIiIAiIgIClAiAIiIAsbD7tL3t+i1ZJY6H3aX5P0WoC3x0e0yjrjk+gV8kbPYdNUVEcFObSyksacxaAHNIeXEa5cua/ZfevrfG/cpPgP+iV8zck3+bUnwpPqZEJLbbbY6fDJWMkc14eM8ckdwDlNnCx1a4G3iNerc8WxmSrwrD5ZnF0jXVMTnHe7mzGGuPWcuW54m5V5/wCoryqHuqPXCsDTj/2ai+Pq/wDxfcqZPdZ6Hhf93D5/szo/I1+bTfHf+Nq5rtMf8ZVfHz/WuXRORupZzM7C4BwkD7EgdEtAv3XaVzfaCVr6qoe0gtdNM5pG4h0jiCO8FYy9xHvdJH+vzbdjJ7c4ZPFUPklaQyZ8jojmacwuCTYEkeUN9lS2WwepleyWJhMUcrOcdna0NylrnXBcCejqtr5YPJpO6X1RL3yZMz0VTGCMznPAF9elCGg+PqU6fbop+LmugWSlfH5c0altPjstfUWbcsL8sMXDU2aSN2Y8Sd1+pMb2QqaWMTSc2W3AJjfmLCd1xYcdLi6wtLCDI1kjubBcGuc4E5NbElu/TitixnZOGmYJHV0b8xGVsbMznX4gB+4dajnc6W44XDHB0u2lu/mjN7O7TvnoaummcXPZTSuY86lzMhBDjxIuNeIPYtb2F/zCm+NHqKudnKSPLVvjke7JSVGa8WQdJlhrnPh2FW+wX+YU3xg9RRttopGEIRz6FW1/OmY/EPzmT45/1hWxcoeMyVVYYGElkTuajYPfPByvdbiS64HYB1la9Wn/ABMnxz/rCrvEJH02ISPc27oqlz7HTNllLh6CLa9qquKOjQnKEuWouv0M3jPJ1UQUxqDIxxYM0kYBu1vEhx0dbedBuO/jc8jA/wAc/wCIf9ZEshtdyiwzUroadj80rcry8ABjT5QFicxI06tVYcjH58/4h/1kSuktSo4XPqJ9FlfUKnvXwOu4l5Ufw2fSCyixlf5Ufw2/SCya6D5MIiIAiIgCIiAgKVAUoAiIgCx8Q9uk+T9ELIKxi91k+T9EIChijMzXN62uHiLLgew+B0tNV0tWKuV4JkdGw0jmmQBuRxaWSPFgZBc9h6jbv9aFiZMDpX5c1NCcgsy8bOgCcxDdOjrrpx1Qk5jymex8W9hmmq42254N52OpGcvMIFi2I23t3+e1MFwykdhUVHJWwCYSySwyASiN2YtFi57G6HO0X4FzN9wD0obKUPRtTMbl8nLmZltl8nKRl9zZu80dSo/9EYf0R7GFmXyjnJbNuWkgDPYA5GgjcQLbtFDVl8eSWOanF00cpwvYaqnPtXNOZexlErS0GwO4dLcQbFu4jrV7UcmVaHODeac0Ehri+xcL6Ei2l+pblj+MU2ExOip2gyvObK975DfK1oc9znFxs1jQBfc0dl7rYLah9dDIZGta+Nwaclw1wcLtNiTY6Eb+Cy8uL2PXfjHV1q2+hT222YNbAxrXBssWrc18puAHNJG7cDe3BaThfJ9WxzwyOEVmSRvJEmtmvBNtOxddcvBV3jT3OPD4jmxQ8uNV9zne3Gw/OOdU01g5xu+I7nuO9zTwJ4jiStaoeT2tkI6MbGn35kaRbrAZcrrteej6QqtHGLXGl9T296PGmXxeK9RjhoVP4mAo9kWwUM1NCQ6SaN7XSO0zOLSBuvlaL7tfSsFsrye1MFVFPJJCWxuzENLyToRpdg610ME9ilspHAKfLRnHxDNFTV+9z+xzmfkwlMjpXVMbQXuf5LjYF17cFmdoNiY65zpxJzU5d0hYPGUABjXtuCHZQDf9ojWwWyVdWALk3I1A7e5aezH5KeeY5S4vc3rcAB1DTgRfu61SSjBbmebxbPGUZuXG3C/j4JwzkrhaHeyJnSEghuQc2Gk++1vcjw71tGzWyNLRyc5C1+ctLC5zy7okgkW0G9o4K7wTFm1DC4CxGh6teo/YsnHvCmCi1aJn4hnzx3m2n9Poea4dOP4bfWsksdWeXH8IfasitDkCIiAIiIAiIgIClQFKAIiIArKP3WT5PqCvVYsPtz+5vqQFOq3qyqalkbS97g1oBJJIAAG8kncO1XlRvXMuVLFPaGRtd0pZfJtqWMBaLj4TmuHaAeCpOWk1xw1syWKcplLHcMLpHA2ytYR4ufYAdwPcsRQbf1lQ8sgpM1gXE8685N9i4jK0ajcbXWo7JYO+bK1kIdK912Suu5kTWEc5nbu000OpzCy6jLQwUFFKGkNaGPc953veWkAnrJNgB3ALOKcuTfJoxrZbnEcVxWWeQue4vc4nefErYdlNrnUEJY2EPMji9zs72Fx8ltgBawAt4rTKd+hsNbdIkgDuGuovw4qq+cnVxLnEWvwAGlgo4NqUuToVPyoVQJzxRZd9wXjLrxc5xv4K8oeVNxJ5yncQLm7HXNhvJDhf51o9bicNniNga2UML2PF8rmXtkcNQLk/NposawPY5rhdlxmaRoLG4zX4jeO3UKE2Hih2O04TtnDWHm2se128ZhobamxF9R2rbsPHQXDtisTeKtkUVg175JGtOtva3G38IsuxUmKhrAZLMv0ib3YBa514elaxnS9pnHmgoyqPYu5nEK0lcetXL5Wm+o0uN41tvVtINQCbE9ZA4LSzCzB7R4wymYHP3vOVosTc2J1t3LXcDq4JGTy1hLY43tbFZ2R5MmZ2ToWzk5c1ze3S38Ng2lMJjySgOLgcvHLcWa8a7wVrsMrmzxQjI6KYtiMYibYMzdMHe4ut0s181wsZyTlRy5Jxc9PP5GybIbTmWcU1PTMZAASXZnZgAPKII4nr1Pit9j3qwwnCoadmSGMMB1Nhq49bjvKv2b1qlSOmCaVMiq90j+EPUVkVj5/dI/hfYVkFJYIiIAiIgCIiAgKVAUoAiIgCx/6Z/c31LILGyvAnIvqWtPzuGn8KA1/a3E3xPja0luYk6e+LSOj3WutT2lwg1zTFHlE8cjiy5t0XuzBrraizbH/8CyG0+NHnXiQR81ESQ2Rme5abXGoINyNx4rG7O7WVElYebgbIJhlDNGOY1g0kMgG4aZrji0DXQ8TevJs/Uv0mqTyTXCNrwrC6fDKZ7nuaABzk8xFs7uJt1XNg0dfElcZ232rkr5NAWU7D7XGd54Z3W0LuzgDYcSekV+IS1MoZPCGhj7CJ7cw0tdxa4WcTcgG2gvbjexxbZ+ind0mGItFg6nyxhwvuLS0tNusBVn1uOMtPB1xwO9UtzlFJSknTRosXmx0aCAXHxHpIWWbgVRPHzzKaQsA0e1ps6w323u7xxXSaeloKdueOmzEsGYPJdcNLT7mTkzXAPeNFkqKvcWGV5tmPRA0Y1oDQGi/dc9ZKzl1cOUzdJpbI4TIT5DrdEnonQgm17i1+A0UySF1gTfSzRwsNwAHDfou0T4u8StddhuQCSxrjYAk9KwO78cFYuxyS8bgI2F5AcWxtBs61ukb7rqF1kGrpk6JdjzsrgcMEMUgjBmc1r3Pc3pguaCQL6sABtYLJvka6N7fK6D9N5IINhb5vQryoYXXuTci28qzgpHB2YkDx18T16+kr52Wdzbk5Pm9yqSfJg6GWWV72ZSH2zSjcIwRvce3XXwvvUbUVwEQbA4vkzZjIDoGNBBbfcbkjQeN1ebR1RppIpXRh0cgLbke+Yb2PeHafBKwO0OK8/lLAOkbNIFgCN7Ow9navexZJTjGTVXuc/TeG4oXJ+18T1s+XVQ1cWmPKDe9h+1m4k66dhWTq8SdRyNniZEXC7QXhxJBFiQb9Em2pA+ZYamMsFPI5jD0ZAZHAXAEjQG3I6iw36swWOe6Wo6TjljGmcg20NrMFrvdv6I9Nhqt3q12tjXH0fTxbklu/0+B2TZHaVtax3RySRiIvbe49tia9paeIvmb8m/FbAFoXJfROHsioyFjJOaijafMhaWg677AtF+JDlvgXfB3E48sVGbSPUnusfefouWQWHfWxipihzt5xwe4Mv0srWm7iOA1GvaswrGQREQBERAEREBAUqApQBERAFqW38jI4xI82a60Zd5rrksv1Xu7Xrt1rbVaYthsdRC+CZuaORpa4eog8CDYg8CAoatUWi6dnz3jOISyWa6UyNaSW5td4tcne70k2WQ2T20bRMcTSte5/lPEmV1h5LAC02A10vqSStc2rwGagqXU8hJHlRv3CVnBw7eBHA9licKsOGd6qUa9DsUPLBSm2emqG93NOt4vC8Hb3CH6mOoYTvtH9zyFyCymyiVSVSSZCxJcWjrw2swQ2DnzHd5UUutuvKPxdZZvKPhOXLzjg0bh7Hlt4ZVwtFEFGHuxSJli1ctnZ59scDfvOoNwRTzt19DVQG1OBab3W0AdDUOGnYW2PguPopqP+q+hKx1/k/qdol28wk39seCeIgm0/lXim2+wthvzsriN3tEn3LjSLH8Ph1KehWR5W1WzsWLbe4RURmKYSvYdbc04EEbi03BB7VrrMewhgs0VrgNwDIBu3ak3PpXP0W7lfKEcWnZNnU6blKoIojDHRzlpuTmMQLid5ccxud3gFh/8ArijY7MzDS4//AC1T7ADcAwMLQP2RotERLJWNI6LLyuVFrRUsEdtBdz3gDqsMqz+BbTVM8JlnkDQBqGAMaNOvf4lcbWb2dw2prpo6SN7rONzcnJGwWzSOG7S47yQOKlSZSWKKVnTOTGmNRXT12vNxsMDHH373ua59uvK1rdf211MKywTCoqWBlPC2zIxYdZO9zieJJJJPWVfLZKjinK2ERFJUIiIAiIgIClQFKAIiIAiIgNf222WixCnMT+jI3pRSWuY3fa07iOI7QCPnLG8HnpJTDUMMbxe1/JePOY73ze3xsdF9WrXtrRDJEY5omSt6ntDtesdR7QqyjZrjyOOx8zAKcqzWN4dDHIckcjW33B97fxAk+Kx3sNh8mUjse23quFlpZ1+dEtsqZVkvyPYAmoZc+9sSR1Em9vtUT4WRbJKyS+8NDhl7Dca+hRpZZZYP1MdlTKrz8nS9Q8VIw+TqUUy2qPcssqiyv/ye/qT2A/qSmTa7lhZLK+9gvXpmHk++t6L+pKZGuK9SwyqQxZyLBGDWWoawdWhd6G+V8yv8PoqTOBlkkbxL+hfuaNbd9lOllXliYPCcHlqJBHEwvcdzW+sncB2nRd/2A2RZh8JBs6aSxleOzyWN/Zbc95JPFe9lDBHGGwxMjB35Ra/wjvJ71srCtYxo5M2Vy29D0iIrmAREQBERAEREBAUoEQBEUICUREB4kOixFfSZrrMrw+MFCUznWK4G117tHgtZqtmoz7wd665U0IPBYubCuxUaNVM5M/ZcHh6l6GzfwvEfcunnB+xBhHYlMm49jmJ2cdwc7+X7lB2bf5zvm+5dSbhHYvYwgdSUxcexytuzkg3Pf8y9nZ+U+/k8Sup/kkdSn8kjqSmLicodsw873PPyivI2QPEH0kldbGFBevySOpKY1R7HLKXZMDhbuCz2G7PMYb5fSt3GFDqVRuGgcEojWi0wuny7lsEDtFbwU1ldsbZWRnJ2VEUBSpKhEUICUREAREQEBSiIAhREAUFEQAIiIDy5UXIiEopFFKKCSQvShEAUoiAlSFKIQeghRFIAXtEQgkIERASiIgIUoiAhERAf/9k=";
        $scope.linechartData12 =[{
          "lineColor": "rgb(66, 141, 201)",
          "id": "1",
          "value": 2500
        }, {
          "id": "2",
          "value": 3000
        }, {
          "id": "3",
          "value": 1500
        }
        ];
        $scope.campaigndetail=function(campaign){
         $state.go('CampaignLaunch-active',{id: campaign.campaign_id});
       }
       var productbarchartcallback;
       productbarchartcallback=   $rootScope.$on('topproductbarchartcallback', function (event, data) {
         if($scope.role=="retailer"){
          window.localStorage['dataplus']= "plus";
          window.localStorage['checkflag']="";
          $scope.screen4 = data.productName;
          $scope.iddept=data.deptid;
          $scope.itemNum=data.itemNumber;
          $scope.Namedept=data.Namedept;
          window.localStorage['itemNum']= $scope.itemNum;
          window.localStorage['pname']= $scope.screen4;
          window.localStorage['iddept']=   $scope.iddept;
          window.localStorage['selectoption1']= $scope.Namedept;
          window.localStorage['s2']=true;
          window.localStorage['individualProduct']=true;
          $state.go('Product-detail');
         }
         else if($scope.role=="cpg"){
          $scope.screen4 = data.productName;
          $scope.iddept=data.deptid;
          $scope.itemNum=data.itemNumber;
          $scope.Namedept=data.Namedept;
          window.localStorage['itemNum']= $scope.itemNum;
          window.localStorage['pname']= $scope.screen4;
          window.localStorage['iddept']=   $scope.iddept;
          window.localStorage['selectoption1']= $scope.Namedept;
          window.localStorage["categoryselected"]=data.category;
          window.localStorage['s2']=true;
          window.localStorage['individualProduct']=true;
          $state.go('Product-detail');
         }
        });

       $scope.exportCharts=function(){
          var pdfevent={}
         $rootScope.$emit('pdfeventdashboard', pdfevent);
         }

     /*  $scope.productId =  dashBoardService.generateguid();
       $scope.productId1 =  dashBoardService.generateguid();
       $scope.productId2 =  dashBoardService.generateguid();*/

       var productclicked;

        productclicked= $rootScope.$on('productcliced', function (event, data) {
          sessionStorage.selectedUPC=data.itemnumber;
          if($scope.role=="retailer"){
             productService.DeptDataforRetailer().then(function (response) {
               // console.log("DeptDataforRetailer",response.data[0]);
               productService.setCategoryforRetailer(response.data[0].categoryName);
               $scope.data1=response.data[0];
               productService.setdeptDetail($scope.data1);  
              $scope.selectchart(data.productName,data.deptId,data.itemnumber,data.deptName);             
               });
          }
           else if($scope.role=="cpg"){
              // productService.DeptDataforCPG().then(function (response) {
              //  //console.log("DeptDataforcpg",response.data[0]);
               // productService.setdeptDetail(response.data[0]);  
               $scope.productclickedcategory=data.category;
               productService.setselectedCategory(data.category);
               $scope.selectchart(data.productName,data.deptId,data.itemnumber,data.deptName);             
               // });
          }
          else {
              // productService.DeptDataforDistribiter().then(function (response) {
               // console.log("DeptDatafordistributer",response.data[0]);
               // productService.setdeptDetail(response.data[0]);  
               $scope.productclickedcategory=data.category;
               productService.setselectedCategory(data.category);
               $scope.selectchart(data.productName,data.deptId,data.itemnumber,data.deptName);             
               // });
          }
        });

        $scope.$on('$destroy', productclicked);

      $scope.selectchart=function (productName , deptid ,itemNumber ,Namedept) {


      if($scope.role=="retailer"){
        window.localStorage['dataplus']= "plus";
        window.localStorage['checkflag']="";
        $scope.screen4 = productName;
        $scope.iddept=deptid;
        $scope.itemNum=itemNumber;
        $scope.Namedept=Namedept;
        window.localStorage['itemNum']= $scope.itemNum;
        window.localStorage['pname']= $scope.screen4;
        window.localStorage['iddept']=   $scope.iddept;
        window.localStorage['selectoption1']= $scope.Namedept;
        window.localStorage['s2']=true;
        window.localStorage['individualProduct']=true;
        $state.go('Product-detail');
         }
        else if($scope.role=="cpg"||$scope.role=="distributor"){
        $scope.screen4 = productName;
        $scope.iddept=deptid;
        $scope.itemNum=itemNumber;
        $scope.Namedept=Namedept;
        window.localStorage['itemNum']= $scope.itemNum;
        window.localStorage['pname']= $scope.screen4;
        window.localStorage['iddept']=   $scope.iddept;
        window.localStorage['selectoption1']= $scope.Namedept;
        window.localStorage["categoryselected"]=$scope.productclickedcategory;
        window.localStorage['s2']=true;
        window.localStorage['individualProduct']=true;
        $state.go('Product-detail');
         }
      }


     // DMA API CALL WITH RETAILER AND ALL BRANDS................

  $scope.SalesPerformanceByDMAforRetailer = function (RetailerId) {
      $scope.SalesPerformancespinner=true;
   $scope.SalesPerformanceByDMAforRetailerRT = function () {
        $scope.SalesPerformance = false;
                var data = {
                  "aggTimeUnit": "1d",
                  "startTime": $scope.SalesDataReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "filters": {
                    "items.mfgId" : [$scope.mfgId],
                    "storeId":$scope.dmaStoreList,
                   "items.brandId":$scope.BrandIdsList
                 }
               }
               dashBoardService.GetSalesPerformance(data).then(function (response) {

                 $scope.total = response.data.total;
                 $scope.LineChartData1 = [];
                 $scope.SalesPerformancespinner=false;
                 $filter('number')($scope.total, $scope.total.length)

                $scope.rpIndextotal = parseFloat(response.data.total);
                if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
                  $scope.spIndex = 0;
                }
                else {
                  $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
                  $scope.spIndex = $scope.spIndex.toFixed(2);
                }
                $scope.salesperformanceId = dashBoardService.generateguid();
               
                 $scope.j=1;
              for (var i=0;i<response.data.data.length;i++) {

                if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");

             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){

                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if($scope.Cpdata[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": $scope.Cpdata[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
              }
                $scope.$applyAsync();
                $scope.SalesPerformance = true;
                dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
                dashBoardService.setcacheData('spIndex',$scope.spIndex);
                dashBoardService.setcacheData('total','$' + response.data.total);

              }, function (response) {
                console.log(response);
              }
              );
             }
             var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "filters": {
                "items.mfgId" : [$scope.mfgId],
              "storeId":$scope.dmaStoreList,
              "items.brandId" : $scope.BrandIdsList
             }
             }
           dashBoardService.GetSalesPerformance(data).then(function (response) {
            $scope.spIndextotal = parseFloat(response.data.total);
            $scope.Cpdata=response.data.data;
            $scope.SalesPerformanceByDMART();
          }, function (response) {
            console.log(response);
          }
          );
         }

         
          $scope.shareOfCategoryByDMAforRetailer= function (retailerId) {

          $scope.ShoppingTripsspinner=true;
          $scope.shareOfCategoryByDMART = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" :retailerId,
              "filters": {
              "storeIds" : $scope.dmaStoreList,
                "brandIds" : $scope.BrandIdsList
               
              }
            }
            $scope.ShoppingTrips = false;
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
             
              $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $scope.ShoppingTripsspinner=false;
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
               $scope.j=1;
               //console.log("responseCT...",$scope.ShoppingTripsCPindex);
               //console.log("responseRT....",$scope.ShoppingTripsRTindex);
               //console.log("stIndex...",$scope.stIndex);

               if($scope.ShoppingTripsCPindex==0&&$scope.ShoppingTripsRTindex==0){
                  $scope.LineChartData2 = [];
               }
               else{

              for (var i = 0; i < response.data.data.length; i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.shoppintripsCpData){
            if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             
              }
              else if(response.data.data[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                   var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
             }
              }
               }

              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);
            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : retailerId,
            "filters": {
            "storeIds" : $scope.dmaStoreList,
            "brandIds" : $scope.BrandIdsList
            
            }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
            $scope.shoppintripsCpData=response.data.data;
            $scope.shareOfCategoryByDMART();
          }, function (response) {
            console.log(response);
          }
          );
        }


      $scope.ShareOfBasketByDMAforRetailer= function (Retailers) {
         sessionStorage.retailerId=Retailers;
          $scope.AvgBasketspinner=true;
          $scope.avgBasketByDMART = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : Retailers,
              "filters": {
              "storeIds" : $scope.dmaStoreList,
              "brandIds" : $scope.BrandIdsList
                
             }
             }
            $scope.AvgBasket = false;
            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
             
              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
               $scope.LineChartData3 = [];
               $scope.AvgBasketspinner=false;

              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }

                $scope.j=1;
                
        for (var i=0;i<response.data.data.length;i++) {

              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.avgBasketDataByCP){
               if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
            else if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
             else{
              if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
             }
           }
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : Retailers,
            "filters": {
            "storeIds" : $scope.dmaStoreList,
            "brandIds" : $scope.BrandIdsList
                
            }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
            $scope.avgBasketTotalByCP = parseFloat(response.data.total);
            $scope.avgBasketDataByCP=response.data.data;
            $scope.avgBasketByDMART();
          }, function (response) {
            console.log(response);
            $scope.LineChartData3 = [];
            $scope.AvgBasketspinner=false;
          }
          );
         }

 $scope.topProductsFunctionByDMAforRetailer = function (RetailerId) {
          $scope.TopProductsspinner=true;
          
            $scope.TopProductsbyReportTimeforDMA = function () {
              var data = {
                "aggTimeUnit": "1d",
                "startTime": $scope.SalesDataReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel": "L",
                "bucketType": "upc",
                "filters": {
                  "items.mfgId" : [$scope.mfgId],
                  "storeId" : $scope.dmaStoreList,
                   "items.brandId" : $scope.BrandIdsList
                  
                }
                }
              $scope.TopProducts = false;
              dashBoardService.GettoptenDepartments(data).then(function (response) {
                $scope.topProductsbyRT = response.data.data;
              
                $scope.topproductsId = dashBoardService.generateguid();
               dashBoardService.settopproductsmaxvalue(0);  
                  $scope.barChartData = [];
                  $scope.TopProductsspinner=false;
                  for (var i = 0; i < $scope.topProductsbyRT.length; i++) {
                   $scope.indexvalue=0.00;
                var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyRT[i].upc},true);
                   if(categoryfound.length>0){
                   }
                   else{

                    var obj={
                      "category_description":""
                    }
                    categoryfound.push(obj);
                   }
                 $scope.generatedId = dashBoardService.generateguid();
                 
                 var results = $filter('filter')($scope.topProductsbyCT,{id : $scope.topProductsbyRT[i].id}, true);
                 if(results){
                 if(results.length>0){

                   if(results[0].amt>=0){
                    $scope.indexvalue = $scope.topProductsbyRT[i].amt / results[0].amt;
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);
                  }

                   if($scope.indexvalue>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";

                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
                  var amt1=(results[0].amt>=0)?results[0].amt:0;
             var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
         var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');

           if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')(amt,2),
              "amt1":$filter('number')(amt1,2),
              "value":amt,
              "value1":amt1,
              'storename': $scope.productName,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue,
              "itemNumber":$scope.topProductsbyRT[i].upc,
              "deptId":$scope.topProductsbyRT[i].deptId,
              "deptName": $scope.topProductsbyRT[i].deptName,
              "category":categoryfound[0].category_description,
              "labelcolor":$scope.labelcolor,
              "arrow":$scope.arrow,
              "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
              "msuRP":$scope.topProductsbyRT[i].msu,
              "quantityCP":results[0].quantity+" ("+results[0].size+")",
              "msuCP":results[0].msu,
              "lastsoldDateRP":lastsoldDateRP,
              "lastsoldDateCP":lastsoldDateCP

            };
             $scope.barChartData.push(object);
          }
          else{
            var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
            var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber":$scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);
          }
        }
          else{
           var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
            var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber":$scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);
        }
     // }
      }
          $scope.$applyAsync();
          $scope.TopProducts = true;
          dashBoardService.setcacheData('barChartData',$scope.barChartData);
                }, function (response) {
                  console.log(response);
                }
                );
                }
  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
    "filters": {
    "items.mfgId" : [$scope.mfgId],
    "storeId" : $scope.dmaStoreList,
    "items.brandId" : $scope.BrandIdsList
   
  }
  }
  dashBoardService.GettoptenDepartments(data).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    $scope.TopProductsbyReportTimeforDMA();
  }, function (response) {
    console.log(response);
  }
  );
  }


 $scope.GetCategoriesforDMAforRetailer = function (RetailerId) {
        $scope.showpiechartspinner=true;
        $scope.GetCategoriesforDMAbyRT= function () {
          var RTdonutChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel" : "L",
            "bucketType" : "categoryDesc",
            "filters": {
            "items.mfgId" : [$scope.mfgId],
            "storeId" : $scope.dmaStoreList,
            "items.brandId" : $scope.BrandIdsList
           
            }
          }
          $scope.showpiechart = false;
         dashBoardService.GettoptenDepartments(RTdonutChartData).then(function (response) {
          $scope.topdepartmentsData = [];
          $scope.showpiechartspinner=false;
          $scope.topdepartmentsId = dashBoardService.generateguid();
          $scope.topDepartmentsDatabyRP=response.data.data;
          $scope.donutcharttotalbyRT=response.data.total;
          if($scope.donutcharttotal>0){
            $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;
            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          }
          else{
            $scope.donutchartindex=0.00;
            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          }
          if($scope.donutchartindex>=1){
              $scope.indexcolor="green";
          }
          else{
              $scope.indexcolor="red";
          }
          for (var i = 0; i < $scope.topDepartmentsDatabyRP.length; i++) {
           $scope.indexvalue=0.00;
           var results = $filter('filter')($scope.topDepartmentsDatabyCP, {id : $scope.topDepartmentsDatabyRP[i].id}, true);
           if(results){
           if(results.length>0){
           if(results[0].amt>=0){
               $scope.indexvalue = $scope.topDepartmentsDatabyRP[i].amt / results[0].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": $filter('number')(results[0].amt,2),
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":results[0].amt,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }

        if($scope.topDepartmentsDatabyCP){
        for(var k=0;k<$scope.topDepartmentsDatabyCP.length;k++){
         var results = $filter('filter')($scope.topDepartmentsDatabyRP, {id : $scope.topDepartmentsDatabyCP[k].id}, true);
         if(results.length==0){
          $scope.indexvalue=0.00;
          var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": 0.00,
            "amt1":$filter('number')($scope.topDepartmentsDatabyCP[k].amt,2),
            "value":0,
            "value1":$scope.topDepartmentsDatabyCP[k].amt,
            "storename": $scope.topDepartmentsDatabyCP[k].id,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
      }
    }

    if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
     }
            $scope.$applyAsync();
            $scope.showpiechart = true;
            dashBoardService.setcacheData('topdepartmentsData',$scope.topdepartmentsData);
          }, function (response) {
            console.log(response);
          }
          );
       }

       var CPdonutChartData = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "bucketType" : "categoryDesc",
        "filters": {
        "items.mfgId" : [$scope.mfgId],
        "storeId" : $scope.dmaStoreList,
        "items.brandId" : $scope.BrandIdsList
       
        }
        }

      dashBoardService.GettoptenDepartments(CPdonutChartData).then(function (response) {
        $scope.topDepartmentsDatabyCP = response.data.data;
         $scope.donutcharttotal=response.data.total;
        $scope.GetCategoriesforDMAbyRT();
      }, function (response) {
        console.log(response);
      }
      );
    }


    $scope.geosalesDataforDMAforRetailer=function(RetailerId){
       var data={
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "geoLevel" : 1,
        "filters" :{
          "item.mfgId" : [$scope.mfgId],
          "storeId" : $scope.dmaStoreList,
           "items.brandId" : $scope.BrandIdsList
          
      }
    }

      $scope.showmap=false;
      $scope.geoSalesData=undefined;
      dashBoardService.getgeoSalesData(data).then(function (response) {
        $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       $scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
      if(response.data.data.length>0){
      $scope.geoSalesData=response.data.data;
      $scope.reporttimeforGeosalesregion={
            "reportstartTime":$scope.ReportstartDate,
            "reportendTime":$scope.Reportenddate
      }
        dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
      }
      else{
          $scope.geoSalesData=[];
      }
      }
      else{
         $scope.geoSalesData=[];
      }
         $scope.showmap=true;
      }, function (response) {
          console.log(response);
      }
      );
      }

$scope.topSalesRegionsforDMAforRetailer=function(RetailerId){

    $scope.topregionsbyRTforDMA=function(){
     var data={
      "aggTimeUnit":"1d",
      "startTime": $scope.ReportstartDate,
      "endTime": $scope.Reportenddate,
      "geoLevel" : 2,
      "filters" :{
      "item.mfgId" : [$scope.mfgId],
      "storeId" : $scope.dmaStoreList,
      "items.brandId" : $scope.BrandIdsList
   
      }
      }

    $scope.topsalesregionchart=false;

    dashBoardService.getgeoSalesData(data).then(function (response) {

             $scope.topregions=[];
             $scope.regionsbyRT=response.data.data[0].regions;
             dashBoardService.setsalesregionmaxvalue(0);
             $scope.salesregionchartid = dashBoardService.generateguid();

            for(var i=0;i<$scope.regionsbyRT.length;i++){
              
              if($scope.regionsbyRT&&$scope.regionsbyCT){
                if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
                      $scope.salesregionindex=0.00
            
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }

                  if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";

                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                   if($scope.regionsbyRT[i]){
                     $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
            if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
          }
        }
      }
        else{
        if($scope.regionsbyRT[i]){
              $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
        if($scope.salesregionindex>=1){
              $scope.labelcolor="green";
              $scope.arrow="\u2191";
        }
        else{
              $scope.labelcolor="red";
              $scope.arrow="\u2193";
        }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow

                        };

           $scope.topregions.push(salesregionobject);
            }
            }
            }
             $scope.topsalesregionchart=true;

          }, function (response) {
           console.log(response);

         }
         );
        }

    var salesregiondataCT={
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2,
              "filters" :{
              "item.mfgId" : [$scope.mfgId],
              "storeId" : $scope.dmaStoreList,
               "items.brandId" : $scope.BrandIdsList
            
             }
             }
    dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
             if(response.data.data){
              if(response.data.data[0]){
              $scope.regionsbyCT=response.data.data[0].regions;
              }
             }
             $scope.topregionsbyRTforDMA();
               }, function (response) {
                 console.log(response);
               }
               );
        }

         $scope.topstoresforDMAforRetailer=function(retailerid){
              $scope.topstoresbyRTforDMA=function(){
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "storeId" : $scope.dmaStoreList,
                   "items.brandId" : $scope.BrandIdsList
                   
                }
              }
              $scope.topstoreschart=false;
              dashBoardService.GetSalesPerformance(data).then(function (response) {
                $scope.topstoresList=[];
                dashBoardService.settopstoresmaxvalue(0);
                $scope.topstoresListbyRT=response.data.data;
                $scope.topstoreschartid = dashBoardService.generateguid();
                for(var i=0;i<$scope.topstoresListbyRT.length;i++){
                if(i<5){
                for(var j=0;j<$scope.allstoresList.length;j++){
                if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
                var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt($scope.topstoresListbyRT[i].id)}, true);
                if(retailerfound.length>0){
            if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
    if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
            $scope.topstoresindex=0.00;
            if($scope.topstoresListbyRT[i].amt){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var amt=$scope.topstoresListbyRT[i].amt;
                   var amt1=$scope.topstoresListbyCT[i].amt;
                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };

                     $scope.topstoresList.push(topstoresobject);
                   }else{

                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                   var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }
                      }
            else{
            if($scope.topstoresListbyRT[i]){
          $scope.topstoresindex=0.00;
          $scope.topstoresindex=$scope.topstoresindex.toFixed(2);

                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };

                $scope.topstoresList.push(topstoresobject);
              }
              }
              }
              }
              }
              }
              }
               $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
            }

            var comparetimedata={
                "aggTimeUnit":"1d",
                "startTime": $scope.SalesDataComparestartDate,
                "endTime": $scope.Compareenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
                "storeId" : $scope.dmaStoreList,
                 "items.brandId" : $scope.BrandIdsList
                 
                }
               }
          dashBoardService.GetSalesPerformance(comparetimedata).then(function (response) {
                  $scope.topstoresListbyCT= response.data.data;
                  $scope.topstoresbyRTforDMA();
            }, function (response) {
             console.log(response);
           }
           );
          }

      // API Integration for selected retrailer with brand..........
       
       $scope.SalesPerformanceByBRANDforRetailer = function (RetailerId) {
      $scope.SalesPerformancespinner=true;
   $scope.SalesPerformanceByDMAforRetailerRT = function () {
        $scope.SalesPerformance = false;
                var data = {
                  "aggTimeUnit": "1d",
                  "startTime": $scope.SalesDataReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "filters": {
                    "items.mfgId" : [$scope.mfgId],
                   "items.brandId": [$scope.selectedBrand.brandid.toString()]
                 }
               }
               dashBoardService.GetSalesPerformance(data).then(function (response) {

                 $scope.total = response.data.total;
                 $scope.LineChartData1 = [];
                 $scope.SalesPerformancespinner=false;
                 $filter('number')($scope.total, $scope.total.length)

                $scope.rpIndextotal = parseFloat(response.data.total);
                if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
                  $scope.spIndex = 0;
                }
                else {
                  $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
                  $scope.spIndex = $scope.spIndex.toFixed(2);
                }
                $scope.salesperformanceId = dashBoardService.generateguid();
               
                 $scope.j=1;
              for (var i=0;i<response.data.data.length;i++) {

                if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");

             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){

                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if($scope.Cpdata[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": $scope.Cpdata[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
              }
                $scope.$applyAsync();
                $scope.SalesPerformance = true;
                dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
                dashBoardService.setcacheData('spIndex',$scope.spIndex);
                dashBoardService.setcacheData('total','$' + response.data.total);

              }, function (response) {
                console.log(response);
              }
              );
             }
             var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "filters": {
                "items.mfgId" : [$scope.mfgId],
                "items.brandId" :  [$scope.selectedBrand.brandid.toString()]
             }
             }
           dashBoardService.GetSalesPerformance(data).then(function (response) {
            $scope.spIndextotal = parseFloat(response.data.total);
            $scope.Cpdata=response.data.data;
            $scope.SalesPerformanceByDMAforRetailerRT();
          }, function (response) {
            console.log(response);
          }
          );
         }


         $scope.shareOfCategoryByBRANDforRetailer= function (retailerId) {

          $scope.ShoppingTripsspinner=true;
          $scope.shareOfCategoryByDMART = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" :retailerId.toString(),
              "filters": {
                "brandIds" :  [$scope.selectedBrand.brandid]
               
              }
            }
            $scope.ShoppingTrips = false;
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
             
              $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $scope.ShoppingTripsspinner=false;
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
               $scope.j=1;
               //console.log("responseCT...",$scope.ShoppingTripsCPindex);
               //console.log("responseRT....",$scope.ShoppingTripsRTindex);
               //console.log("stIndex...",$scope.stIndex);

               if($scope.ShoppingTripsCPindex==0&&$scope.ShoppingTripsRTindex==0){
                  $scope.LineChartData2 = [];
               }
               else{

              for (var i = 0; i < response.data.data.length; i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.shoppintripsCpData){
            if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             
              }
              else if(response.data.data[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                   var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
             }
              }
               }

              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);
            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : retailerId.toString(),
            "filters": {
            "brandIds" : [$scope.selectedBrand.brandid]
            
            }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
            $scope.shoppintripsCpData=response.data.data;
            $scope.shareOfCategoryByDMART();
          }, function (response) {
            console.log(response);
          }
          );
        }

        $scope.ShareOfBasketByBRANDforRetailer= function (Retailers) {
         sessionStorage.retailerId=Retailers;
          $scope.AvgBasketspinner=true;
          $scope.avgBasketByDMART = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : Retailers.toString(),
              "filters": {
              "brandIds" :  [$scope.selectedBrand.brandid]
                
             }
             }
            $scope.AvgBasket = false;
            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
             
              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
               $scope.LineChartData3 = [];
               $scope.AvgBasketspinner=false;

              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }

                $scope.j=1;
                
        for (var i=0;i<response.data.data.length;i++) {

              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
             if(response.data.data&&$scope.avgBasketDataByCP){
               if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
            else if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
             else{
              if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
             }
           }
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : Retailers.toString(),
            "filters": {
            "brandIds" :  [$scope.selectedBrand.brandid]
                
            }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
            $scope.avgBasketTotalByCP = parseFloat(response.data.total);
            $scope.avgBasketDataByCP=response.data.data;
            $scope.avgBasketByDMART();
          }, function (response) {
            console.log(response);
            $scope.LineChartData3 = [];
            $scope.AvgBasketspinner=false;
          }
          );
         }


        $scope.topProductsFunctionByBRANDforRetailer = function (RetailerId) {
          $scope.TopProductsspinner=true;
          
            $scope.TopProductsbyReportTimeforDMA = function () {
              var data = {
                "aggTimeUnit": "1d",
                "startTime": $scope.SalesDataReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel": "L",
                "bucketType": "upc",
                "filters": {
                  "items.mfgId" : [$scope.mfgId],
                   "items.brandId" :  [$scope.selectedBrand.brandid.toString()]
                  
                }
                }
              $scope.TopProducts = false;
              dashBoardService.GettoptenDepartments(data).then(function (response) {
                $scope.topProductsbyRT = response.data.data;
              
                $scope.topproductsId = dashBoardService.generateguid();
               dashBoardService.settopproductsmaxvalue(0);  
                  $scope.barChartData = [];
                  $scope.TopProductsspinner=false;
                  for (var i = 0; i < $scope.topProductsbyRT.length; i++) {
                   $scope.indexvalue=0.00;
                var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyRT[i].upc},true);
                   if(categoryfound.length>0){
                   }
                   else{

                    var obj={
                      "category_description":""
                    }
                    categoryfound.push(obj);
                   }
                 $scope.generatedId = dashBoardService.generateguid();
                 
                 var results = $filter('filter')($scope.topProductsbyCT,{id : $scope.topProductsbyRT[i].id}, true);
                 if(results){
                 if(results.length>0){

                   if(results[0].amt>=0){
                    $scope.indexvalue = $scope.topProductsbyRT[i].amt / results[0].amt;
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);
                  }

                   if($scope.indexvalue>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";

                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
                  var amt1=(results[0].amt>=0)?results[0].amt:0;
             var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
         var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');

           if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')(amt,2),
              "amt1":$filter('number')(amt1,2),
              "value":amt,
              "value1":amt1,
              'storename': $scope.productName,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue,
              "itemNumber":$scope.topProductsbyRT[i].upc,
              "deptId":$scope.topProductsbyRT[i].deptId,
              "deptName": $scope.topProductsbyRT[i].deptName,
              "category":categoryfound[0].category_description,
              "labelcolor":$scope.labelcolor,
              "arrow":$scope.arrow,
              "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
              "msuRP":$scope.topProductsbyRT[i].msu,
              "quantityCP":results[0].quantity+" ("+results[0].size+")",
              "msuCP":results[0].msu,
              "lastsoldDateRP":lastsoldDateRP,
              "lastsoldDateCP":lastsoldDateCP

            };
             $scope.barChartData.push(object);
          }
          else{
            var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
            var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber":$scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);
          }
        }
          else{
           var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
            var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber":$scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);
        }
     // }
      }
          $scope.$applyAsync();
          $scope.TopProducts = true;
          dashBoardService.setcacheData('barChartData',$scope.barChartData);
                }, function (response) {
                  console.log(response);
                }
                );
                }
  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
    "filters": {
    "items.mfgId" : [$scope.mfgId],
    "items.brandId" :  [$scope.selectedBrand.brandid.toString()]
   
  }
  }
  dashBoardService.GettoptenDepartments(data).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    $scope.TopProductsbyReportTimeforDMA();
  }, function (response) {
    console.log(response);
  }
  );
  }

  $scope.GetCategoriesforBRANDforRetailer = function (RetailerId) {
        $scope.showpiechartspinner=true;
        $scope.GetCategoriesforDMAbyRT= function () {
          var RTdonutChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel" : "L",
            "bucketType" : "categoryDesc",
            "filters": {
            "items.mfgId" : [$scope.mfgId],
            "items.brandId" :  [$scope.selectedBrand.brandid.toString()]
           
            }
          }
          $scope.showpiechart = false;
         dashBoardService.GettoptenDepartments(RTdonutChartData).then(function (response) {
          $scope.topdepartmentsData = [];
          $scope.showpiechartspinner=false;
          $scope.topdepartmentsId = dashBoardService.generateguid();
          $scope.topDepartmentsDatabyRP=response.data.data;
          $scope.donutcharttotalbyRT=response.data.total;
          if($scope.donutcharttotal>0){
            $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;
            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          }
          else{
            $scope.donutchartindex=0.00;
            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          }
          if($scope.donutchartindex>=1){
              $scope.indexcolor="green";
          }
          else{
              $scope.indexcolor="red";
          }
          for (var i = 0; i < $scope.topDepartmentsDatabyRP.length; i++) {
           $scope.indexvalue=0.00;
           var results = $filter('filter')($scope.topDepartmentsDatabyCP, {id : $scope.topDepartmentsDatabyRP[i].id}, true);
           if(results){
           if(results.length>0){
           if(results[0].amt>=0){
               $scope.indexvalue = $scope.topDepartmentsDatabyRP[i].amt / results[0].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": $filter('number')(results[0].amt,2),
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":results[0].amt,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }

        if($scope.topDepartmentsDatabyCP){
        for(var k=0;k<$scope.topDepartmentsDatabyCP.length;k++){
         var results = $filter('filter')($scope.topDepartmentsDatabyRP, {id : $scope.topDepartmentsDatabyCP[k].id}, true);
         if(results.length==0){
          $scope.indexvalue=0.00;
          var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": 0.00,
            "amt1":$filter('number')($scope.topDepartmentsDatabyCP[k].amt,2),
            "value":0,
            "value1":$scope.topDepartmentsDatabyCP[k].amt,
            "storename": $scope.topDepartmentsDatabyCP[k].id,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue
          };
          $scope.topdepartmentsData.push(object);
        }
      }
    }

    if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
     }
            $scope.$applyAsync();
            $scope.showpiechart = true;
            dashBoardService.setcacheData('topdepartmentsData',$scope.topdepartmentsData);
          }, function (response) {
            console.log(response);
          }
          );
       }

       var CPdonutChartData = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "bucketType" : "categoryDesc",
        "filters": {
        "items.mfgId" : [$scope.mfgId],
        "items.brandId" :  [$scope.selectedBrand.brandid.toString()]
       
        }
        }

      dashBoardService.GettoptenDepartments(CPdonutChartData).then(function (response) {
        $scope.topDepartmentsDatabyCP = response.data.data;
         $scope.donutcharttotal=response.data.total;
        $scope.GetCategoriesforDMAbyRT();
      }, function (response) {
        console.log(response);
      }
      );
    }

    
    $scope.geosalesDataforBRANDforRetailer=function(RetailerId){
       var data={
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "geoLevel" : 1,
        "filters" :{
          "item.mfgId" : [$scope.mfgId],
          "items.brandId" : [$scope.selectedBrand.brandid.toString()]
          
      }
    }

      $scope.showmap=false;
      $scope.geoSalesData=undefined;
      dashBoardService.getgeoSalesData(data).then(function (response) {
        $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       $scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
      if(response.data.data.length>0){
      $scope.geoSalesData=response.data.data;
      $scope.reporttimeforGeosalesregion={
            "reportstartTime":$scope.ReportstartDate,
            "reportendTime":$scope.Reportenddate
      }
        dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
      }
      else{
          $scope.geoSalesData=[];
      }
      }
      else{
         $scope.geoSalesData=[];
      }
         $scope.showmap=true;
      }, function (response) {
          console.log(response);
      }
      );
      } 

      $scope.topSalesRegionsforBRANDforRetailer=function(RetailerId){

    $scope.topregionsbyRTforDMA=function(){
     var data={
      "aggTimeUnit":"1d",
      "startTime": $scope.ReportstartDate,
      "endTime": $scope.Reportenddate,
      "geoLevel" : 2,
      "filters" :{
      "item.mfgId" : [$scope.mfgId],
      "items.brandId" :  [$scope.selectedBrand.brandid.toString()]
   
      }
      }

    $scope.topsalesregionchart=false;

    dashBoardService.getgeoSalesData(data).then(function (response) {

             $scope.topregions=[];
             $scope.regionsbyRT=response.data.data[0].regions;
             dashBoardService.setsalesregionmaxvalue(0);
             $scope.salesregionchartid = dashBoardService.generateguid();

            for(var i=0;i<$scope.regionsbyRT.length;i++){
              
              if($scope.regionsbyRT&&$scope.regionsbyCT){
                if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
                      $scope.salesregionindex=0.00
            
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }

                  if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";

                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                   if($scope.regionsbyRT[i]){
                     $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
            if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
          }
        }
      }
        else{
        if($scope.regionsbyRT[i]){
              $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
        if($scope.salesregionindex>=1){
              $scope.labelcolor="green";
              $scope.arrow="\u2191";
        }
        else{
              $scope.labelcolor="red";
              $scope.arrow="\u2193";
        }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow

                        };

           $scope.topregions.push(salesregionobject);
            }
            }
            }
             $scope.topsalesregionchart=true;

          }, function (response) {
           console.log(response);

         }
         );
        }

    var salesregiondataCT={
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2,
              "filters" :{
              "item.mfgId" : [$scope.mfgId],
               "items.brandId" :  [$scope.selectedBrand.brandid.toString()]
            
             }
             }
    dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
             if(response.data.data){
              if(response.data.data[0]){
              $scope.regionsbyCT=response.data.data[0].regions;
              }
             }
             $scope.topregionsbyRTforDMA();
               }, function (response) {
                 console.log(response);
               }
               );
        }


$scope.topstoresforBRANDforRetailer=function(retailerid){
              $scope.topstoresbyRTforDMA=function(){
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "items.brandId" :  [$scope.selectedBrand.brandid.toString()]
                   
                }
              }
              $scope.topstoreschart=false;
              dashBoardService.GetSalesPerformance(data).then(function (response) {
                $scope.topstoresList=[];
                dashBoardService.settopstoresmaxvalue(0);
                $scope.topstoresListbyRT=response.data.data;
                $scope.topstoreschartid = dashBoardService.generateguid();
                for(var i=0;i<$scope.topstoresListbyRT.length;i++){
                if(i<5){
                for(var j=0;j<$scope.allstoresList.length;j++){
                if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
                var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt($scope.topstoresListbyRT[i].id)}, true);
                if(retailerfound.length>0){
            if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
    if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
            $scope.topstoresindex=0.00;
            if($scope.topstoresListbyRT[i].amt){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var amt=$scope.topstoresListbyRT[i].amt;
                   var amt1=$scope.topstoresListbyCT[i].amt;
                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };

                     $scope.topstoresList.push(topstoresobject);
                   }else{

                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                   var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }
                      }
            else{
            if($scope.topstoresListbyRT[i]){
          $scope.topstoresindex=0.00;
          $scope.topstoresindex=$scope.topstoresindex.toFixed(2);

                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };

                $scope.topstoresList.push(topstoresobject);
              }
              }
              }
              }
              }
              }
              }
               $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
            }

            var comparetimedata={
                "aggTimeUnit":"1d",
                "startTime": $scope.SalesDataComparestartDate,
                "endTime": $scope.Compareenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
                 "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                 
                }
               }
          dashBoardService.GetSalesPerformance(comparetimedata).then(function (response) {
                  $scope.topstoresListbyCT= response.data.data;
                  $scope.topstoresbyRTforDMA();
            }, function (response) {
             console.log(response);
           }
           );
          }


     // API integration for store with brand............

      $scope.SalesPerformanceByStoreIdForCpgBRAND = function () {

          //$scope.showspinner();
          $scope.SalesPerformancespinner=true;
          $scope.SalesPerformanceByStoreIdbyRTforCpg = function () {
            $scope.SalesPerformance = false;
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "filters": {
                "items.mfgId" : [$scope.mfgId],
                "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                
              }
            }
            dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
              $scope.total =  response.data.total;
               $scope.SalesPerformancespinner=false;

              $filter('number')($scope.total, $scope.total.length)

              $scope.rpIndextotal = parseFloat(response.data.total);
              if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
                $scope.spIndex = 0;
              }
              else {
                $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
                $scope.spIndex = $scope.spIndex.toFixed(2);
              }
              $scope.salesperformanceId = dashBoardService.generateguid();
              $scope.LineChartData1 = [];
              $scope.j=1;
              for (var i = 0; i < response.data.data.length; i++) {

                if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");

             }
             else{
               
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
                $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");

               $scope.j++;

             }

             if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){

                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             else if($scope.Cpdata[i]){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.Cpdata[i].amt,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": $scope.Cpdata[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
             else{
              if(response.data.data[i]){
             var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].amt,
                  "value2": 0,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                  "id": response.data.data[i].id
                };
                $scope.LineChartData1.push(object);
             }
             }
              }
              $scope.$applyAsync();
              $scope.SalesPerformance = true;
             

             // $scope.hidespinner();
              dashBoardService.setcacheData('LineChartData1',$scope.LineChartData1);
              dashBoardService.setcacheData('spIndex',$scope.spIndex);
              dashBoardService.setcacheData('total',response.data.total);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "filters": {
              "items.mfgId" : [$scope.mfgId],
              "items.brandId" : [$scope.selectedBrand.brandid.toString()]
            
            }
          }
          dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
            $scope.spIndextotal = parseFloat(response.data.total);
                $scope.Cpdata=response.data.data;

            $scope.SalesPerformanceByStoreIdbyRTforCpg();
          }, function (response) {
            console.log(response);
          }
          );
        }



 $scope.shareOfCategoryByStoreforCpgBRAND= function () {
          $scope.ShoppingTripsspinner=true;
          $scope.shareOfCategoryByRTforCpg = function () {


            var ShoppingTripsdata = {

              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : sessionStorage.user.toString(),
              "sid" : sessionStorage.storeId.toString(),
              "filters":{
                "brandIds": [$scope.selectedBrand.brandid]
              }
             

            }

            $scope.ShoppingTrips = false;
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
              $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              if(response.data==undefined||$scope.shoppintripsCpData==undefined){
                $scope.ShoppingTripsspinner=false;
              }
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
              $scope.j=1;
              for(var i =0;i<response.data.data.length;i++) {
            if(i==0){
            $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
            $scope.ResultDate=$scope.date;
            $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
              $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
              $scope.ResultDate=$scope.nextDate;
              $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
              $scope.j++;
             }

             if(response.data.data&&$scope.shoppintripsCpData){
               
              if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
             if(parseFloat(response.data.data[i].percentage)>0){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
             }
              }
              else if(response.data.data[i]){
              if(parseFloat(response.data.data[i].percentage)>0){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                 }
              }
              else if($scope.shoppintripsCpData[i]){
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                   "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                   "value2": 0,
                  "id": response.data.data[i].time,
                   "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
            }
             }
              }
              $scope.$applyAsync();
              $scope.ShoppingTrips = true;

             $scope.ShoppingTripsspinner=false;

              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);


            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {

            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : sessionStorage.user.toString(),
            "sid" : sessionStorage.storeId.toString(),
            "filters":{
                "brandIds": [$scope.selectedBrand.brandid]
              }
           


          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
        $scope.shoppintripsCpData=response.data.data;

            $scope.shareOfCategoryByRTforCpg();
          }, function (response) {
            console.log(response);
          }
          );
        }
        $scope.ShareOfBasketByStoreforCpgBRAND = function () {

          $scope.AvgBasketspinner=true;
          $scope.avgBasketByRTforCpg = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : sessionStorage.user.toString(),
              "sid" : sessionStorage.storeId.toString(),
              "filters":{
                "brandIds": [$scope.selectedBrand.brandid]
              }
              


            }

            $scope.AvgBasket = false;
            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
              $scope.LineChartData3 = [];
              if(response.data==undefined||$scope.avgBasketDataByCP==undefined){
              $scope.AvgBasketspinner=false;
              }
              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }
               $scope.j=1;
             for (var i =0;i<response.data.data.length;i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }

            if(response.data.data&&$scope.avgBasketDataByCP){
            if(response.data.data[i]&&$scope.avgBasketDataByCP){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
          else if(response.data.data[i]){
          var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){
          var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
          else{
          if(response.data.data[i]){
          var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
           }
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              $scope.AvgBasketspinner=false;

              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : sessionStorage.user.toString(),
            "sid" : sessionStorage.storeId.toString(),
            "filters":{
                "brandIds": [$scope.selectedBrand.brandid]
              }
           

          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
            $scope.avgBasketTotalByCP = parseFloat(response.data.total);
            $scope.avgBasketDataByCP=response.data.data;
            $scope.avgBasketByRTforCpg();
          }, function (response) {
            console.log(response);
            $scope.LineChartData3 = [];
          }
          );
        }
        $scope.GettoptenDepartmentsByStoreforCpgBRAND = function () {

          $scope.showpiechartspinner=true;
          $scope.topdeptsByReportTimeforcpg = function () {
            var RTdonutChartData = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "categoryDesc",
              "filters": {
                "items.mfgId" : [$scope.mfgId],
                "items.brandId": [$scope.selectedBrand.brandid.toString()]

              }
            }

            $scope.showpiechart = false;
            dashBoardService.GettoptenDepartmentsByStoreId(RTdonutChartData).then(function (response) {
              $scope.topdepartmentsData = [];
              $scope.topdepartmentsId = dashBoardService.generateguid();
              $scope.topDepartmentsDatabyRP=response.data.data;
               $scope.donutcharttotalbyRT=response.data.total;
              if($scope.donutcharttotal>0){
               $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotal;
            $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
              }
              else{
                $scope.donutchartindex=0.00;
                  $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
              }
               if($scope.donutchartindex>=1){
              $scope.indexcolor="green";
            }
            else{
              $scope.indexcolor="red";
            }

          for (var i = 0;i<$scope.topDepartmentsDatabyRP.length;i++) {
           $scope.indexvalue=0.00;
           var results = $filter('filter')($scope.topDepartmentsDatabyCP, {id : $scope.topDepartmentsDatabyRP[i].id}, true);
            if(results){
           if(results.length>0){
          if(results[0].amt>=0){
              $scope.indexvalue = $scope.topDepartmentsDatabyRP[i].amt / results[0].amt;
              $scope.indexvalue=$scope.indexvalue.toFixed(2);
          }
             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": $filter('number')(results[0].amt,2),
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":results[0].amt,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
          else{
             var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }
          else{
            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')($scope.topDepartmentsDatabyRP[i].amt,2),
              "amt1": 0.00,
              "value":$scope.topDepartmentsDatabyRP[i].amt,
              "value1":0.00,
              "storename": $scope.topDepartmentsDatabyRP[i].id,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue
            };
            $scope.topdepartmentsData.push(object);
          }
        }
        if($scope.topdepartmentsData.length==1){
      $scope.topdepartmentsData[0].colorfield="#ba5bbb";
       }
            $scope.$applyAsync();
            $scope.showpiechart = true;
            $scope.showpiechartspinner=false;
            dashBoardService.setcacheData('topdepartmentsData',$scope.topdepartmentsData);
          }, function (response) {
            console.log(response);
          }
          );
          }

          var CPdonutChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "bucketLevel" : "L",
            "bucketType" : "categoryDesc",
            "filters": {
              "items.mfgId" : [$scope.mfgId],
              "items.brandId": [$scope.selectedBrand.brandid.toString()]
            
            }
          }

          dashBoardService.GettoptenDepartmentsByStoreId(CPdonutChartData).then(function (response) {
          console.log("data wt is coming...",response.data.data);
            $scope.topDepartmentsDatabyCP = response.data.data;
            $scope.$applyAsync();
            $scope.donutcharttotal=response.data.total;
            $scope.topdeptsByReportTimeforcpg();
          }, function (response) {
            console.log(response);
          }
          );

        }

      $scope.topProductsFunctionByByStoreforcpgBRAND = function () {

          $scope.TopProductsspinner=true;
       
          $scope.TopProductsbyReportTime = function () {
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel": "L",
              "bucketType": "upc",
              "filters": {
                "items.mfgId" : [$scope.mfgId],
                 "items.brandId": [$scope.selectedBrand.brandid.toString()]
                              
              }
            }
            $scope.TopProducts = false;
            dashBoardService.getbestselleresbystoreforcpg(data).then(function (response) {
              $scope.topProductsbyRT = response.data.data;
              $scope.hidespinner();
              $scope.topproductsId = dashBoardService.generateguid();
              $scope.barChartData = [];
              $scope.TopProductsspinner=false;
        for (var i = 0;i<$scope.topProductsbyRT.length;i++){
           var categoryfound=$filter('filter')($scope.allitems,{upc:$scope.topProductsbyRT[i].upc},true);
               
                 if(categoryfound.length>0){
                   }
                   else{
                    var obj={
                      "category_description":""
                    }
                    categoryfound.push(obj);
                   }
                $scope.indexvalue=0.00;
                $scope.generatedId = dashBoardService.generateguid();
                dashBoardService.settopproductsmaxvalue(0);  
                 
                 var results = $filter('filter')($scope.topProductsbyCT,{id : $scope.topProductsbyRT[i].id}, true);
                 if(results){
                 if(results.length>0){
                   if(results[0].amt>=0){
                    $scope.indexvalue = $scope.topProductsbyRT[i].amt / results[0].amt;
                    $scope.indexvalue=$scope.indexvalue.toFixed(2);
                  }
                  if($scope.indexvalue>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

                  }
                  var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
                  var amt1=(results[0].amt>=0)?results[0].amt:0;

          var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
         var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
         var lastsoldDateCP=moment(results[0].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

            var object = {
              "color": "#4C98CF",
              "color1": "#7F2891",
              "amt": $filter('number')(amt,2),
              "amt1":$filter('number')(amt1,2),
              "value":amt,
              "value1":amt1,
              'storename': $scope.productName,
              "reporttime":$scope.totalreporttime,
              "comapretime":$scope.totalcomparetime,
              "Index":$scope.indexvalue,
              "itemNumber":$scope.topProductsbyRT[i].upc,
              "deptId":$scope.topProductsbyRT[i].deptId,
              "deptName": $scope.topProductsbyRT[i].deptName,
              "category":categoryfound[0].category_description,
              "labelcolor":$scope.labelcolor,
              "arrow":$scope.arrow,
              "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
              "msuRP":$scope.topProductsbyRT[i].msu,
              "quantityCP":results[0].quantity+" ("+results[0].size+")",
              "msuCP":results[0].msu,
              "lastsoldDateRP":lastsoldDateRP,
              "lastsoldDateCP":lastsoldDateCP


            };
               $scope.barChartData.push(object);
          }
          else{
            var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
           var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
           $scope.labelcolor="red";
           $scope.arrow="\u2193";
          var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
            
                
          if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber": $scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);

          }
        }
          else{
           var amt=($scope.topProductsbyRT[i].amt>=0)?$scope.topProductsbyRT[i].amt:0;
           var topitemsresults = $filter('filter')($scope.topitemsData,{name : $scope.topProductsbyRT[i].id}, true);
           $scope.labelcolor="red";
           $scope.arrow="\u2193";
          var lastsoldDateRP=moment($scope.topProductsbyRT[i].lastSoldDate.split(".")[0]).format('MMM Do YYYY');
              
           if($scope.topProductsbyRT[i].name){
          if($scope.topProductsbyRT[i].name!=""){
            $scope.productName=$scope.topProductsbyRT[i].name;
          }
          else{
             $scope.productName=$scope.topProductsbyRT[i].id;
          }
          }
          else{
            $scope.productName=$scope.topProductsbyRT[i].id;
          }

           var object = {
            "color": "#4C98CF",
            "color1": "#7F2891",
            "amt": $filter('number')(amt,2),
            "amt1":0.00,
            "value":amt,
            "value1":0,
            'storename': $scope.productName,
            "reporttime":$scope.totalreporttime,
            "comapretime":$scope.totalcomparetime,
            "Index":$scope.indexvalue,
            "itemNumber": $scope.topProductsbyRT[i].upc,
            "deptId":$scope.topProductsbyRT[i].deptId,
            "deptName": $scope.topProductsbyRT[i].deptName,
            "category":categoryfound[0].category_description,
            "labelcolor":$scope.labelcolor,
            "arrow":$scope.arrow,
            "quantityRP":$scope.topProductsbyRT[i].quantity+" ("+$scope.topProductsbyRT[i].size+")",
            "msuRP":$scope.topProductsbyRT[i].msu,
            "lastsoldDateRP":lastsoldDateRP,
            "lastsoldDateCP":0

          };
            $scope.barChartData.push(object);
        }

      }

   
                  $scope.$applyAsync();
                  $scope.TopProducts = true;
    
                  dashBoardService.setcacheData('barChartData',$scope.barChartData);

                }, function (response) {
                  console.log(response);
                }
                );
        }

  var data = {
    "aggTimeUnit": "1d",
    "startTime": $scope.SalesDataComparestartDate,
    "endTime": $scope.Compareenddate,
    "bucketLevel": "L",
    "bucketType": "upc",
    "filters": {
     "items.mfgId" : [$scope.mfgId],
      "items.brandId": [$scope.selectedBrand.brandid.toString()]
   
     
   }
  }
  dashBoardService.getbestselleresbystoreforcpg(data).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    $scope.TopProductsbyReportTime();
  }, function (response) {
    console.log(response);
  }
  );
 
      }

   $scope.topSalesRegionsforcpgbystoreBRAND=function(){

          $scope.topregionsbyRTforstoreforcpg=function(){

           var data={
            "aggTimeUnit":"1d",
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 2,
            "filters" :{
            "item.mfgId" : [$scope.mfgId],
            "storeId" : [$scope.storeId.toString()],
             "items.brandId": [$scope.selectedBrand.brandid.toString()]
            
           }
          }
          $scope.topsalesregionchart=false;
          dashBoardService.getgeoSalesData(data).then(function (response) {
            $scope.topregions=[];
             $scope.regionsbyRT=response.data.data[0].regions;
             dashBoardService.setsalesregionmaxvalue(0);
             $scope.salesregionchartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT&&$scope.regionsbyCT){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
              $scope.salesregionindex=0.00
            
            if($scope.regionsbyRT[i].amount){
            $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
            }
            if($scope.salesregionindex>=1){
               $scope.labelcolor="green";
               $scope.arrow="\u2191";
            }
            else{
                $scope.labelcolor="red";
                $scope.arrow="\u2193";
            }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow

                        };
                $scope.topregions.push(salesregionobject);
                }
                else{
                   if($scope.regionsbyRT[i]){
                     $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
           if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
                $scope.topregions.push(salesregionobject);
                   }
                }
              }
              else{
          if($scope.regionsbyRT[i]){
              $scope.salesregionindex=0.00;
              $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
         if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
          $scope.topregions.push(salesregionobject);
            }
            }
            }
             $scope.topsalesregionchart=true;
               }, function (response) {
                 console.log(response);
               }
               );
              }

              var salesregiondataCT={
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2,
              "filters" :{
                 "item.mfgId" : [$scope.mfgId],
                 "storeId" : [$scope.storeId.toString()],
                  "items.brandId": [$scope.selectedBrand.brandid.toString()]
       
            }
            }

          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
              if(response.data.data){
                if(response.data.data[0]){
                $scope.regionsbyCT=response.data.data[0].regions;
                }
             }
             $scope.topregionsbyRTforstoreforcpg();
               }, function (response) {
                 console.log(response);
               }
               );
        }
       

        $scope.salespperformancebyallstoresforcpgbystoreBRAND=function(){
              $scope.topstoresbyRTforstoreforcpg=function(){
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                   "items.brandId": [$scope.selectedBrand.brandid.toString()]
                }
              }
               $scope.topstoreschart=false;
              dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
              $scope.topstoresList=[];
            dashBoardService.settopstoresmaxvalue(0);
            $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            var retailerfound=$filter('filter')($scope.storesByRetailer, 
           {storeid : parseInt($scope.topstoresListbyRT[i].id)}, true);
        if(retailerfound.length>0){
        if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
        if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
          }
        if($scope.topstoresindex>=1){
          $scope.labelcolor="green";
          $scope.arrow="\u2191";
         }
        else{
          $scope.labelcolor="red";
          $scope.arrow="\u2193";
         }
        var amt=$scope.topstoresListbyRT[i].amt;
        var amt1=$scope.topstoresListbyCT[i].amt;
        var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }else{
                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };
                     $scope.topstoresList.push(topstoresobject);
                   }
                    }
              else{
              if($scope.topstoresListbyRT[i]){
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                      }
                    }
                    }
                   }
                 }
               }
               }
               $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
            }

            var comparetimedata={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataComparestartDate,
                 "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                 "item.mfgId" : [$scope.mfgId],
                  "items.brandId": [$scope.selectedBrand.brandid.toString()]
                }
               }
               dashBoardService.GetSalesPerformance(comparetimedata).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.topstoresbyRTforstoreforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }


        $scope.geosalesDatabyStoreidforcpgBRAND=function(){
         var data={
          "startTime": $scope.ReportstartDate,
          "endTime": $scope.Reportenddate,
          "geoLevel" : 1,
          "filters" :{
          "item.mfgId" : [$scope.mfgId],
          "storeId" : [$scope.storeId.toString()],
          "items.brandId": [$scope.selectedBrand.brandid.toString()]
          
           }
           }
         $scope.showmap=false;
         $scope.geoSalesData=undefined;
        dashBoardService.getgeoSalesData(data).then(function (response) {
         $scope.topStoresData={
           map: "usaLow",
           getAreasFromMap: true,
           "markers": []
         };
         $scope.topstores=[];
         $scope.storeList=[];
         $scope.storesformap=[];
         if(response.data.data){
         if(response.data.data.length>0){
         $scope.geoSalesData=response.data.data;
         $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
         dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
         }
        else{
            $scope.geoSalesData=[];
        }
        }
        else{
          $scope.geoSalesData=[];
        }
        $scope.showmap=true;
        }, function (response) {
          console.log(response);
        }
        );
      }      


    
         $scope.shareOfCategoryByAllRetailersforBRAND= function (id) {

          $scope.ShoppingTripsspinner=true;
          $scope.shareOfCategoryByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
              "filters":{
                "rids":$scope.RetailerIds,
                 "brandIds": [$scope.selectedBrand.brandid] 
              }
            }
            $scope.ShoppingTrips = false;
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
              $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $scope.ShoppingTripsspinner=false;
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
               $scope.j=1;
              for (var i=0;i<response.data.data.length;i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
            if(response.data.data&&$scope.shoppintripsCpData){
            if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
               if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
               }
             
              }
              else if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                   var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
              else if($scope.shoppintripsCpData[i]){
                
                //console.log("coming...");
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                  var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
             }
              }
               console.log("LineChartData2...",$scope.LineChartData2);
              $scope.$applyAsync();
              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters":{
                "rids":$scope.RetailerIds,
                "brandIds": [$scope.selectedBrand.brandid] 
              }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
            $scope.shoppintripsCpData=response.data.data;
            $scope.shareOfCategoryByRT();
          }, function (response) {
            console.log(response);
          }
          );
        }



      $scope.ShareOfBasketByAllRetailerforBRAND = function (id) {

          $scope.AvgBasketspinner=true;
          $scope.avgBasketByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
                "filters":{
                "rids":$scope.RetailerIds,
                 "brandIds": [$scope.selectedBrand.brandid]  
              }
            }
            $scope.AvgBasket = false;
            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
             
              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
              $scope.LineChartData3 = [];
              $scope.AvgBasketspinner=false;

              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }
                $scope.j=1;
        for (var i=0;i<response.data.data.length;i++){
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
            if(response.data.data&&$scope.avgBasketDataByCP){
            if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if(response.data.data[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
             else{
              if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
             }
        }
    
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters":{
            "rids":$scope.RetailerIds,
             "brandIds": [$scope.selectedBrand.brandid]  
            }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
            $scope.avgBasketTotalByCP = parseFloat(response.data.total);
            $scope.avgBasketDataByCP=response.data.data;

            $scope.avgBasketByRT();

          }, function (response) {
            console.log(response);
            $scope.LineChartData3 = [];
            $scope.AvgBasketspinner=false;
          }
          );
        }


 
    // BRAND api with DMA................
          $scope.SalesPerformanceBySingleBrandwithDMA=function(brand){
        $scope.SalesPerformancespinner=true;
        $scope.salesPerformanceBysingleBrandReporttime=function(){
          $scope.SalesPerformance = false;
          var reporttimeRequestData= {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "filters": {
              "items.brandId" : [$scope.selectedBrand.brandid.toString()],
              "storeId":$scope.dmaStoreList,
               "retailerId":$scope.RetailerIds
              }
            }
        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(reporttimeRequestData).then(function(response){
              $scope.total = response.data.total;
              if(response.data.data==undefined||$scope.CTBrandsData==undefined){
                 $scope.SalesPerformancespinner=false;
              }
              $scope.RTBrandsData=response.data.data;
              $scope.salesPerformancebyBrandsLinechartdata($scope.RTBrandsData,$scope.CTBrandsData,$scope.spIndextotal,$scope.total);
        },function(response){
           console.log("error msg..",response);
        });
         }

       var comparetimeRequestData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "filters": {
              "items.brandId" : [$scope.selectedBrand.brandid.toString()],
               "storeId":$scope.dmaStoreList,
               "retailerId":$scope.RetailerIds
            }
          }

        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(comparetimeRequestData).then(function(response){
          $scope.spIndextotal = parseFloat(response.data.total);
          $scope.CTBrandsData=response.data.data;
          $scope.salesPerformanceBysingleBrandReporttime();
        },function(response){
           console.log("error msg..",response);
        });
         
        }

         $scope.bestsellersbySingleBrandwithDMA=function(brand){
          $scope.TopProductsspinner=true;

          $scope.bestsellersBysingleBrandRT=function(){
            var reporttimeRequest = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "upc",
          "filters": {
             "items.brandId" : [$scope.selectedBrand.brandid.toString()],
              "storeId":$scope.dmaStoreList,
              "retailerId":$scope.RetailerIds
             }
           }
         $scope.TopProducts = false;
        
         dashBoardService.getbestselleresbyallretailer(reporttimeRequest).then(function(response){
          
          $scope.topProductsbyRT = response.data.data;
          
          if($scope.topProductsbyRT==undefined||$scope.topProductsbyCT==undefined){
                 $scope.TopProductsspinner=false;
          }
          
          if($scope.topProductsbyRT.length==0){
                $scope.noTopProductsLabel=true;
          }
          $scope.topproductsId = dashBoardService.generateguid();
          dashBoardService.settopproductsmaxvalue(0);
          $scope.barChartData = [];
          
          $scope.bestsellerschartdata($scope.topProductsbyCT,$scope.topProductsbyRT);
          
        },function(response){
           console.log("error msg..",response);
        });
          }

          var comparetimerequest = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "bucketLevel": "L",
            "bucketType": "upc",
             "filters": {
                 "items.brandId" : [$scope.selectedBrand.brandid.toString()],
                  "storeId":$scope.dmaStoreList,
                  "retailerId":$scope.RetailerIds
             }
  }
  dashBoardService.getbestselleresbyallretailer(comparetimerequest).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    //console.log("response CT...",$scope.topProductsbyCT);
    $scope.bestsellersBysingleBrandRT();
  }, function (response) {
    console.log(response);
  }
  );
  }



   $scope.categoriesbySingleBrandwithDMA=function(brand){
    $scope.showpiechartspinner=true;
    sessionStorage.itemssize=1000;
    
    $scope.categoriesbySingleBrandRT=function(){
    
       var reporttimeRequest= {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel" : "L",
            "filters": {
              "items.brandId" :[brand],
               "storeId":$scope.dmaStoreList,
               "retailerId":$scope.RetailerIds
            },
            "bucketType" : "categoryDesc"
          }
          $scope.showpiechart = false;

      dashBoardService.gettopcategoriesbyBrands(reporttimeRequest).then(function (response) {
          $scope.donutcharttotalbyRT=response.data.total;
          $scope.topDepartmentsDatabyRP=response.data.data;
          $scope.topdepartmentsId = dashBoardService.generateguid();
          $scope.topcategoriesbyBrandschartdata($scope.topDepartmentsDatabyCP,$scope.topDepartmentsDatabyRP)

        }, function (response) {
             console.log(response);
        }
        );
        }

        var comparetimeRequest = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "filters": {
          "items.brandId" : [brand],
           "storeId":$scope.dmaStoreList,
           "retailerId":$scope.RetailerIds
        },
        "bucketType" : "categoryDesc"
      }

      dashBoardService.gettopcategoriesbyBrands(comparetimeRequest).then(function (response) {
         $scope.topDepartmentsDatabyCP = response.data.data;
         $scope.donutcharttotal=response.data.total;
         $scope.categoriesbySingleBrandRT();
      }, function (response) {
        console.log(response);
      }
      );
     }
     

      $scope.topsalesRegionsBySingleBrandwithDMA=function(brand){

      $scope.topsalesRegionsBySingleBrandRt=function(){
       
        var reporttimeRequest= {
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 2,
            "filters": {
              "items.brandId" :[brand],
              "storeId":$scope.dmaStoreList,
              "retailerId":$scope.RetailerIds
            }
          }

          $scope.topsalesregionchart=false;

      dashBoardService.getsalesbyBrands(reporttimeRequest).then(function (response) {
      // console.log("response RT...",response);

       $scope.regionsbyRTBrands=response.data.data[0].regions;

       $scope.topsalesregionsbyBrandschartData($scope.regionsbyCTBrands,$scope.regionsbyRTBrands);
     
         
      }, function (response) {
        console.log(response);
      }
      );
      }

     var comparetimeRequest = {
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "geoLevel" : 2,
        "filters": {
          "items.brandId" : [brand],
          "storeId":$scope.dmaStoreList,
          "retailerId":$scope.RetailerIds
        }
      }
      dashBoardService.getsalesbyBrands(comparetimeRequest).then(function (response) {
              if(response.data.data){
              if(response.data.data[0]){
              $scope.regionsbyCTBrands=response.data.data[0].regions;
              }
              }
          $scope.topsalesRegionsBySingleBrandRt();
          //console.log("response CT...",response);
      }, function (response) {
        console.log(response);
      }
      );
      }


      $scope.topstoresbySingleBrandwithDMA=function(brand){
      $scope.topstoresbySingleBrandRT=function(){
      
      var reporttimeRequest= {
            "aggTimeUnit":"1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel":"S",
            "filters": {
              "items.brandId" :[brand],
              "storeId":$scope.dmaStoreList,
              "retailerId":$scope.RetailerIds
            }
          }   
      
          $scope.topstoreschart=false;
          dashBoardService.getstoresbyBrands(reporttimeRequest).then(function (response) {
          $scope.topstoresbrandsbyRT=response.data.data;
          $scope.topstoresList=[];
          dashBoardService.settopstoresmaxvalue(0);
          $scope.topsstoresbyBrandschartData($scope.topstoresbyBrandsbyCT,$scope.topstoresbrandsbyRT)

      }, function (response) {
        console.log(response);
      }
      );
        }
             
      var comparetimeRequest = {
        "aggTimeUnit":"1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel":"S",
        "filters": {
          "items.brandId" :[brand],
          "storeId":$scope.dmaStoreList,
          "retailerId":$scope.RetailerIds
        }
      }

      dashBoardService.getstoresbyBrands(comparetimeRequest).then(function (response) {
           $scope.topstoresbyBrandsbyCT= response.data.data;
           $scope.topstoresbySingleBrandRT();
      }, function (response) {
        console.log(response);
      }
      );

      }



      $scope.geosalesdatabySingleBrandwithDMA=function(brand){
          
            var reporttimeRequest= {
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 1,
            "filters": {
              "items.brandId" :[brand],
              "storeId":$scope.dmaStoreList,
              "retailerId":$scope.RetailerIds
            }
          }

           $scope.showmap=false;
          $scope.geoSalesData=undefined;  

           dashBoardService.getgeosalesDataByBrands(reporttimeRequest).then(function (response) {
             
             $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       //$scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
              if(response.data.data.length>0){
                  $scope.geoSalesData=response.data.data;
              
          $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }

              dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }

             }
             else{
               $scope.geoSalesData=[];
             }
              $scope.showmap=true;

      }, function (response) {
        console.log(response);
      }
      );
      }

       $scope.ShareOfBasketByAllRetailerforBRANDwithDMA = function (id) {

          $scope.AvgBasketspinner=true;
          $scope.avgBasketByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
                "filters":{
                 "brandIds": [$scope.selectedBrand.brandid],
                 "storeId":$scope.dmaStoreList ,
                 "rids":$scope.RetailerIds
              }
            }
            $scope.AvgBasket = false;
            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
             
              $scope.AvgBasketId = dashBoardService.generateguid();
              $scope.avgBasketTotal =  response.data.total;
              $scope.LineChartData3 = [];
              $scope.AvgBasketspinner=false;

              $filter('number')($scope.avgBasketTotal, $scope.avgBasketTotal.length)
              $scope.avgBasketTotalByRT = parseFloat(response.data.total);
              if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
                $scope.ABtotal = 0;
              }
              else {
                $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
                $scope.ABtotal = $scope.ABtotal.toFixed(2);
              }
                $scope.j=1;
        for (var i=0;i<response.data.data.length;i++){
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
            if(response.data.data&&$scope.avgBasketDataByCP){
            if(response.data.data[i]&&$scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if(response.data.data[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
            else if($scope.avgBasketDataByCP[i]){
            var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": 0,
            "value2": $scope.avgBasketDataByCP[i].per,
            "id": $scope.avgBasketDataByCP[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };
          $scope.LineChartData3.push(object);
            }
             }
             else{
              if(response.data.data[i]){

                var object = {
            "lineColor": "rgb(66, 141, 201)",
            "value": response.data.data[i].per,
            "value2": 0,
            "id": response.data.data[i].time,
            "date": $scope.ResultDate,
            "date1":$scope.ResultDate1,
          };

          $scope.LineChartData3.push(object);
            }
             }
        }
    
              $scope.$applyAsync();
              $scope.AvgBasket = true;
              dashBoardService.setcacheData('LineChartData3',$scope.LineChartData3);
              dashBoardService.setcacheData('avgBasketTotal',$scope.avgBasketTotal);
              dashBoardService.setcacheData('ABtotal',$scope.ABtotal);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters":{
             "storeId":$scope.dmaStoreList,
             "brandIds": [$scope.selectedBrand.brandid] ,
             "rids":$scope.RetailerIds 
            }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
            $scope.avgBasketTotalByCP = parseFloat(response.data.total);
            $scope.avgBasketDataByCP=response.data.data;

            $scope.avgBasketByRT();

          }, function (response) {
            console.log(response);
            $scope.LineChartData3 = [];
            $scope.AvgBasketspinner=false;
          }
          );
        }

        $scope.shareOfCategoryByAllRetailersforBRANDwithDMA= function (id) {

          $scope.ShoppingTripsspinner=true;
          $scope.shareOfCategoryByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
              "rid" : "000",
              "filters":{
                "storeId":$scope.dmaStoreList,
                "brandIds": [$scope.selectedBrand.brandid],
                "rids":$scope.RetailerIds 
              }
            }
            $scope.ShoppingTrips = false;
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
              $scope.shoppingtripsId = dashBoardService.generateguid();
              $scope.ShoppingTripsTotal = response.data.total;
              $scope.LineChartData2 = [];
              $scope.ShoppingTripsspinner=false;
              $filter('number')($scope.ShoppingTripsTotal, $scope.ShoppingTripsTotal.length)
              $scope.ShoppingTripsRTindex = parseFloat(response.data.total);
              if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null) {
                $scope.stIndex = 0;
              }
              else {
                $scope.stIndex = $scope.ShoppingTripsRTindex / $scope.ShoppingTripsCPindex;
                $scope.stIndex = $scope.stIndex.toFixed(2);
              }
              $scope.ShoppingTripsLineChartData1 = [];
               $scope.j=1;
              for (var i=0;i<response.data.data.length;i++) {
              if(i==0){
               $scope.date=moment($scope.ReportstartDate).format("YYYY-MM-DD");
               $scope.ResultDate=$scope.date;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=$scope.nextDate;
               $scope.ResultDate1=moment($scope.ResultDate).subtract(1,'year').format("YYYY-MM-DD");
               $scope.j++;
             }
            if(response.data.data&&$scope.shoppintripsCpData){
            if(response.data.data[i]&&$scope.shoppintripsCpData[i]){
               if(parseFloat(response.data.data[i].percentage)>0){
                 var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
               }
             
              }
              else if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                   var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
              else if($scope.shoppintripsCpData[i]){
                
                //console.log("coming...");
          var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value":0,
                  "value2": $scope.shoppintripsCpData[i].percentage,
                  "id": $scope.shoppintripsCpData[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
              }
             }
             else{
              if(response.data.data[i]){
                if(parseFloat(response.data.data[i].percentage)>0){
                  var object = {
                  "lineColor": "rgb(66, 141, 201)",
                  "value": response.data.data[i].percentage,
                  "value2": 0,
                  "id": response.data.data[i].time,
                  "date": $scope.ResultDate,
                  "date1":$scope.ResultDate1,
                };
                $scope.LineChartData2.push(object);
                }
              }
             }
              }
               console.log("LineChartData2...",$scope.LineChartData2);
              $scope.$applyAsync();
              $scope.ShoppingTrips = true;
              dashBoardService.setcacheData('LineChartData2',$scope.LineChartData2);
              dashBoardService.setcacheData('ShoppingTripsTotal',$scope.ShoppingTripsTotal);
              dashBoardService.setcacheData('stIndex',$scope.stIndex);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ComparestartDate,
            "endTime": $scope.Compareenddate,
            "rid" : "000",
            "filters":{
                "storeId":$scope.dmaStoreList,
                "brandIds": [$scope.selectedBrand.brandid] ,
                "rids":$scope.RetailerIds
              }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
            $scope.shoppintripsCpData=response.data.data;
            $scope.shareOfCategoryByRT();
          }, function (response) {
            console.log(response);
          }
          );
        }


           $scope.topstoresforAllRetailersforCPG=function(){
              $scope.topstoresbyRTforDMA=function(){
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.SalesDataReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                   "retailerId" : $scope.RetailerIds
                }
              }
              $scope.topstoreschart=false;
              dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
                $scope.topstoresList=[];
                dashBoardService.settopstoresmaxvalue(0);
                $scope.topstoresListbyRT=response.data.data;
                $scope.topstoreschartid = dashBoardService.generateguid();
                for(var i=0;i<$scope.topstoresListbyRT.length;i++){
                if(i<5){
                for(var j=0;j<$scope.allstoresList.length;j++){
                if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
                var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt($scope.topstoresListbyRT[i].id)}, true);
                if(retailerfound.length>0){
            if($scope.topstoresListbyRT&&$scope.topstoresListbyCT){
    if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT[i]){
            $scope.topstoresindex=0.00;
            if($scope.topstoresListbyRT[i].amt){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var amt=$scope.topstoresListbyRT[i].amt;
                   var amt1=$scope.topstoresListbyCT[i].amt;
                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };

                     $scope.topstoresList.push(topstoresobject);
                   }else{

                    $scope.topstoresindex=0.00;
                    $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                   var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
                     $scope.topstoresList.push(topstoresobject);
                   }
                      }
            else{
            if($scope.topstoresListbyRT[i]){
          $scope.topstoresindex=0.00;
          $scope.topstoresindex=$scope.topstoresindex.toFixed(2);

                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                     var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":retailerfound[0].retailerName,
                          "content":retailerfound[0].retailerName.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };

                $scope.topstoresList.push(topstoresobject);
                console.log(" $scope.topstoresList", $scope.topstoresList);
              }
              }
              }
              }
              }
              }
              }
               $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
            }

            var comparetimedata={
                "aggTimeUnit":"1d",
                "startTime": $scope.SalesDataComparestartDate,
                "endTime": $scope.Compareenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
                 "retailerId" : $scope.RetailerIds
                }
               }
          dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(comparetimedata).then(function (response) {
                  $scope.topstoresListbyCT= response.data.data;
                  $scope.topstoresbyRTforDMA();
            }, function (response) {
             console.log(response);
           }
           );
          }


   // Brand api calls..........

   $scope.SalesPerformanceBySingleBrandforcpg=function(brand){
        $scope.SalesPerformancespinner=true;
        $scope.salesPerformanceBysingleBrandReporttime=function(){
          $scope.SalesPerformance = false;
          var reporttimeRequestData= {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "filters": {
              "item.mfgId" : [$scope.mfgId],
              "items.brandId" : [brand],
              "retailerId" : $scope.RetailerIds
              }
            }
        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(reporttimeRequestData).then(function(response){
              $scope.total = response.data.total;
              if(response.data.data==undefined||$scope.CTBrandsData==undefined){
                 $scope.SalesPerformancespinner=false;
              }
              $scope.RTBrandsData=response.data.data;
              $scope.salesPerformancebyBrandsLinechartdata($scope.RTBrandsData,$scope.CTBrandsData,$scope.spIndextotal,$scope.total);
        },function(response){
           console.log("error msg..",response);
        });
         }

       var comparetimeRequestData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "filters": {
               "item.mfgId" : [$scope.mfgId],
              "items.brandId" : [brand],
              "retailerId" : $scope.RetailerIds
            }
          }

        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(comparetimeRequestData).then(function(response){
          $scope.spIndextotal = parseFloat(response.data.total);
          $scope.CTBrandsData=response.data.data;
          $scope.salesPerformanceBysingleBrandReporttime();
        },function(response){
           console.log("error msg..",response);
        });
         
        }


 $scope.bestsellersbySingleBrandforCPG=function(brand){
          $scope.TopProductsspinner=true;

          $scope.bestsellersBysingleBrandRT=function(){
            var reporttimeRequest = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "upc",
          "filters": {
              "item.mfgId" : [$scope.mfgId],
              "items.brandId" : [brand],
              "retailerId" : $scope.RetailerIds
             }
           }
         $scope.TopProducts = false;
        
         dashBoardService.getbestselleresbyallretailer(reporttimeRequest).then(function(response){
          
          $scope.topProductsbyRT = response.data.data;
          
          if($scope.topProductsbyRT==undefined||$scope.topProductsbyCT==undefined){
                 $scope.TopProductsspinner=false;
          }
          
          if($scope.topProductsbyRT.length==0){
                $scope.noTopProductsLabel=true;
          }
          $scope.topproductsId = dashBoardService.generateguid();
          dashBoardService.settopproductsmaxvalue(0);
          $scope.barChartData = [];
          
          $scope.bestsellerschartdata($scope.topProductsbyCT,$scope.topProductsbyRT);
          
        },function(response){
           console.log("error msg..",response);
        });
          }

          var comparetimerequest = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "upc",
           "filters": {
             "item.mfgId" : [$scope.mfgId],
              "items.brandId" : [brand],
              "retailerId" : $scope.RetailerIds
             }
  }
  dashBoardService.getbestselleresbyallretailer(comparetimerequest).then(function (response) {
    $scope.topProductsbyCT = response.data.data;
    //console.log("response CT...",$scope.topProductsbyCT);
    $scope.bestsellersBysingleBrandRT();
  }, function (response) {
    console.log(response);
  }
  );
  }

$scope.categoriesbySingleBrandforCPG=function(brand){
    $scope.showpiechartspinner=true;
    sessionStorage.itemssize=1000;
    
    $scope.categoriesbySingleBrandRT=function(){
    
       var reporttimeRequest= {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel" : "L",
            "filters": {
              "items.brandId" :[brand],
              "item.mfgId" : [$scope.mfgId],
               "retailerId" : $scope.RetailerIds
            },
            "bucketType" : "categoryDesc"
          }
          $scope.showpiechart = false;

      dashBoardService.gettopcategoriesbyBrands(reporttimeRequest).then(function (response) {
          $scope.donutcharttotalbyRT=response.data.total;
          $scope.topDepartmentsDatabyRP=response.data.data;
          $scope.topdepartmentsId = dashBoardService.generateguid();
          $scope.topcategoriesbyBrandschartdata($scope.topDepartmentsDatabyCP,$scope.topDepartmentsDatabyRP)

        }, function (response) {
             console.log(response);
        }
        );
        }



        var comparetimeRequest = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "filters": {
          "items.brandId" : [brand],
          "item.mfgId" : [$scope.mfgId],
          "retailerId" : $scope.RetailerIds
        },
        "bucketType" : "categoryDesc"
      }

      dashBoardService.gettopcategoriesbyBrands(comparetimeRequest).then(function (response) {
         $scope.topDepartmentsDatabyCP = response.data.data;
         $scope.donutcharttotal=response.data.total;
         $scope.categoriesbySingleBrandRT();
      }, function (response) {
        console.log(response);
      }
      );
     }


$scope.topsalesRegionsBySingleBrandforCPG=function(brand){

      $scope.topsalesRegionsBySingleBrandRt=function(){
       
        var reporttimeRequest= {
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 2,
            "filters": {
              "items.brandId" :[brand],
              "item.mfgId" : [$scope.mfgId],
          "retailerId" : $scope.RetailerIds
            }
          }

          $scope.topsalesregionchart=false;

      dashBoardService.getsalesbyBrands(reporttimeRequest).then(function (response) {
      // console.log("response RT...",response);

       $scope.regionsbyRTBrands=response.data.data[0].regions;

       $scope.topsalesregionsbyBrandschartData($scope.regionsbyCTBrands,$scope.regionsbyRTBrands);
     
         
      }, function (response) {
        console.log(response);
      }
      );
      }

     var comparetimeRequest = {
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "geoLevel" : 2,
        "filters": {
          "items.brandId" : [brand],
          "item.mfgId" : [$scope.mfgId],
          "retailerId" : $scope.RetailerIds
        }
      }
      dashBoardService.getsalesbyBrands(comparetimeRequest).then(function (response) {
              if(response.data.data){
              if(response.data.data[0]){
              $scope.regionsbyCTBrands=response.data.data[0].regions;
              }
              }
          $scope.topsalesRegionsBySingleBrandRt();
          //console.log("response CT...",response);
      }, function (response) {
        console.log(response);
      }
      );
      }

 $scope.topstoresbySingleBrandforCPG=function(brand){
      $scope.topstoresbySingleBrandRT=function(){
      
      var reporttimeRequest= {
            "aggTimeUnit":"1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel":"S",
            "filters": {
              "items.brandId" :[brand],
               "item.mfgId" : [$scope.mfgId],
              "retailerId" : $scope.RetailerIds
            }
          }   
      
          $scope.topstoreschart=false;
          dashBoardService.getstoresbyBrands(reporttimeRequest).then(function (response) {
          $scope.topstoresbrandsbyRT=response.data.data;
          $scope.topstoresList=[];
          dashBoardService.settopstoresmaxvalue(0);
          $scope.topsstoresbyBrandschartData($scope.topstoresbyBrandsbyCT,$scope.topstoresbrandsbyRT)

      }, function (response) {
        console.log(response);
      }
      );
        }
             
      var comparetimeRequest = {
        "aggTimeUnit":"1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel":"S",
        "filters": {
          "items.brandId" :[brand],
           "item.mfgId" : [$scope.mfgId],
          "retailerId" : $scope.RetailerIds
        }
      }

      dashBoardService.getstoresbyBrands(comparetimeRequest).then(function (response) {
           $scope.topstoresbyBrandsbyCT= response.data.data;
           $scope.topstoresbySingleBrandRT();
      }, function (response) {
        console.log(response);
      }
      );

      }

  $scope.geosalesdatabySingleBrandforCPG=function(brand){
          
            var reporttimeRequest= {
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 1,
            "filters": {
              "items.brandId" :[brand],
               "item.mfgId" : [$scope.mfgId],
              "retailerId" : $scope.RetailerIds
            }
          }

           $scope.showmap=false;
          $scope.geoSalesData=undefined;  

           dashBoardService.getgeosalesDataByBrands(reporttimeRequest).then(function (response) {
             
             $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       //$scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
              if(response.data.data.length>0){
                  $scope.geoSalesData=response.data.data;
              
          $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }

              dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }

             }
             else{
               $scope.geoSalesData=[];
             }
              $scope.showmap=true;

      }, function (response) {
        console.log(response);
      }
      );
      }
      



 $scope.init=function(){
          $scope.role=sessionStorage.role;
          if($scope.role=="cpg"){
             $scope.getCPGBrands();
             $scope.selectedcpg=dashBoardService.getsavestoreselected();           
             $scope.selecteRecord= $scope.selectedcpg;          
             // $scope.getDmaList();
             $scope.getAllRetailers(); 
             $scope.getAllstores();
             $scope.getallitems();
             //$scope.GetStoreList();
             $scope.getCouponList();
             $scope.selecteddma=dashBoardService.getselectedDMA();
            
             console.log("selecteddma...",$scope.selecteddma);
             $scope.savedBrand=dashBoardService.getselectedBrand();
             $scope.selectedBrand= $scope.savedBrand;
             console.log("getselectedbrand...",$scope.savedBrand);

             if($scope.selecteddma!= null){
             $scope.dma= $scope.selecteddma.name;
             sessionStorage.user=$scope.selectedcpg.retailerId;
             $scope.retailerid=$scope.selectedcpg.retailerId;
             $scope.dmaStoreList=[];
             for(var i=0;i<$scope.selecteddma.stores.length;i++){
             $scope.dmaStoreList.push($scope.selecteddma.stores[i].toString());
             }
           // if($scope.selectedBrand.brand_name =="All Brands"){
           //            $scope.SalesPerformanceByDMA();
           //            $scope.shareOfCategoryByDMA();
           //            $scope.ShareOfBasketByDMA();
           //            $scope.topProductsFunctionByDMA();
           //            $scope.GetCategoriesforDMA();
           //            $scope.geosalesDataforDMA();
           //            $scope.topSalesRegionsforDMA();
           //            $scope.topstoresforDMA();                                  
           //   }else{
           //        $scope.SalesPerformanceBySingleBrandwithDMA($scope.selectedBrand.brandid);
           //        $scope.categoriesbySingleBrandwithDMA($scope.selectedBrand.brandid);
           //        $scope.topsalesRegionsBySingleBrandwithDMA($scope.selectedBrand.brandid);
           //        $scope.topstoresbySingleBrandwithDMA($scope.selectedBrand.brandid);
           //        $scope.geosalesdatabySingleBrandwithDMA($scope.selectedBrand.brandid);
           //        $scope.shareOfCategoryByAllRetailersforBRANDwithDMA($scope.selectedBrand.brandid);
           //        $scope.ShareOfBasketByAllRetailerforBRANDwithDMA($scope.selectedBrand.brandid); 
           //   }

         }
       
       else if($scope.selectedcpg.name=="All Retailers"){          
              // $scope.cpgFunctions();

         }
      else{
          // $scope.savedBrand=dashBoardService.getselectedBrand();
          // $scope.selectedBrand= $scope.savedBrand;
             console.log("getselectedbrand...",$scope.savedBrand);
          if($scope.selectedcpg.hasOwnProperty("children")){
            sessionStorage.user=$scope.selectedcpg.retailerId;
            $scope.retailerid=$scope.selectedcpg.retailerId;
            $scope.CampaignListofCpg();
           //  if($scope.savedBrand.brand_name =="All Brands"){
           //          $scope.SalesPerformanceByRetailerforcpg();
           //          $scope.shareOfCategoryByRetailerforCpg($scope.retailerid);
           //          $scope.ShareOfBasketByRetailerforCpg($scope.retailerid);
           //          $scope.GettoptenDepartmentsByRetailerforCpg();
           //          $scope.topProductsFunctionByRetailerforCpg();
           //          $scope.topSalesRegionsforcpgbyretailer();
           //          $scope.salespperformancebyallstoresforcpgbyretailer();
           //          $scope.geosalesDatabyretailerforcpg();
           // }else{
           //         $scope.SalesPerformanceByBRANDforRetailer($scope.retailerid);
           //         $scope.shareOfCategoryByBRANDforRetailer($scope.retailerid);
           //         $scope.ShareOfBasketByBRANDforRetailer($scope.retailerid);
           //         $scope.topProductsFunctionByBRANDforRetailer($scope.retailerid);
           //         $scope.GetCategoriesforBRANDforRetailer($scope.retailerid);
           //         $scope.geosalesDataforBRANDforRetailer($scope.retailerid);
           //         $scope.topSalesRegionsforBRANDforRetailer($scope.retailerid);
           //         $scope.topstoresforBRANDforRetailer($scope.retailerid);
           // }

         }
          else{
            sessionStorage.user=$scope.selectedcpg.retailerId;
            $scope.storeId = $scope.selectedcpg.storeid;
            sessionStorage.storeId = $scope.storeId;
          //   if($scope.savedBrand.brand_name =="All Brands"){
          //         $scope.SalesPerformanceByStoreIdForCpg();
          //         $scope.shareOfCategoryByStoreforCpg();
          //         $scope.ShareOfBasketByStoreforCpg();
          //         $scope.GettoptenDepartmentsByStoreforCpg();
          //         $scope.topProductsFunctionByByStoreforcpg();
          //         $scope.topSalesRegionsforcpgbystore();
          //         $scope.salespperformancebyallstoresforcpgbystore();
          //         $scope.geosalesDatabyStoreidforcpg();
          // }else{
          //         $scope.SalesPerformanceByStoreIdForCpgBRAND();
          //         $scope.shareOfCategoryByStoreforCpgBRAND();
          //         $scope.ShareOfBasketByStoreforCpgBRAND();
          //         $scope.GettoptenDepartmentsByStoreforCpgBRAND();
          //         $scope.topProductsFunctionByByStoreforcpgBRAND();
          //         //$scope.worstsellersbystoreforcpg();
          //         $scope.topSalesRegionsforcpgbystoreBRAND();
          //         $scope.salespperformancebyallstoresforcpgbystoreBRAND();
          //         $scope.geosalesDatabyStoreidforcpgBRAND();
          // } 

            $scope.CampaignListofCpg();
          }
         }
         //}
             //$scope.cpgFunctions();
             //$timeout(function(){
           }
           else if($scope.role=="retailer"){
            $scope.GetStoreList();
            $scope.getDepartmentList();
            $scope.getCouponListforRetailer();
            $scope.retaileportalfunctions();
            $scope.geosalesData();
            $scope.topSalesRegions();
            $scope.CampaignListofRetailer();
            $scope.salespperformancebyallstores();
            //$scope.worstsellersbyretailer();
          }
          else if($scope.role=="distributor"){
             dashBoardService.createcache();
             $scope.getDistributorBrands();
             $scope.getAllstores();
             $scope.CampaignListofDistributor();
          }
        }


      
  $scope.init();
     }]);
