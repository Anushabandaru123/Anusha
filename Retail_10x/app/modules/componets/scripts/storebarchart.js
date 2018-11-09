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


angular.module('Retails.singelstoreDirective', ['product.controllers'])

  .directive('storechartbar', ['$compile', '$window', '$timeout','$rootScope','dashBoardService','$filter',
    function ($compile, $window, $timeout,$rootScope,dashBoardService,$filter) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          id: '=',
          data: '=',
          storeid:'=',
          retailerid:'='
        },
        templateUrl: 'modules/componets/views/singlestoretemplate.html',

        link: function (scope, element, attrs) {

          scope.chartid = scope.id;
          scope.chartdata = scope.data;
          scope.storeId=scope.storeid;

          //console.log("retailerId...",scope.retailerid);

          var chart = false;

          var initChart = function () {
            if (chart) chart.destroy();
            var config = scope.config || {};

            chart = AmCharts.makeChart(scope.id, {
              "type": "serial",
              "theme": "light",
             // "categoryField": "storename",
              "rotate": true,
              "startDuration": 1,
              "startEffect":"easeOutSine",
              "categoryAxis": {
                "gridPosition": "start",
                "position": "left",
                "gridAlpha": 0,
                "labelsEnabled": false
              },

              "trendLines": [],
              "graphs": [
                {
                  "balloonText": "Sales Amt: $[[amtnumber]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "income",
                  "type": "column",
                  "valueField": "income",
                  "showHandOnHover":true,
                  "labelText": "$[[amtnumber]]",
                  "labelPosition": "right",
                  //"fixedColumnWidth": 15,
                  //"columnWidth":20
                },
                {
                  "balloonText": "Sales Amt: $[[amtnumber1]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "expenses",
                  "type": "column",
                  "valueField": "expenses",
                  "showHandOnHover":true,
                  "labelText": "$[[amtnumber1]]",
                  "labelPosition": "right",
                 // "fixedColumnWidth": 15,
                 // "columnWidth":20

                }
              ],
              "guides": [],
              "valueAxes": [
                {
                  "id": "ValueAxis-1",
                  "position": "top",
                  "axisAlpha": 0,
                  "gridAlpha": 0,
                  "labelsEnabled": false,
                  "maximum":dashBoardService.getStoremaxvalue()*1.2,
                  "minimum":0
                }
              ],

              "allLabels": [],
               "balloon": {
              "fillColor": "#000000",
               "color": "#ffffff",
               "fillAlpha": 1.0,
              
              },
              "titles": [],
              "dataProvider": scope.chartdata,
              "export": {
                "enabled": false
              },
             
              /* "responsive": {
                "enabled": true,
                "rules": [
                  {
                    "Width": 100,
                    "overrides": {
                      "marginRight": 65,
                    }
                  }
                ]
              }*/

            });
          };

            scope.myupdateDoneListenerforstore =$rootScope.$on('updatestorebarchart', function (event, data) {
             $timeout(function() {
             initChart();
             }, 0);
     });


             scope.comapretimearray=[];
              scope.reporttimearray=[];

             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].expenses));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].income));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }
             else{
              scope.maxvalue=scope.reporttimemax;
             }
             scope.maximumValue=dashBoardService.getStoremaxvalue();
                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){
                   if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setStoremaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setStoremaxvalue(scope.maxvalue);
                 }

                  for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
            }

            
 $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){
             $rootScope.$emit('updatestorebarchart', {});
            }
          }, 0);


          scope.SalesPerformanceByStoreId = function (storeid) {
         scope.SalesPerformanceByStoreIdbyRT = function () {
         var data = {
             "aggTimeUnit": "1d",
             "startTime": scope.reportStartDate,
             "endTime": scope.reportEndDate
             }
             sessionStorage.storeId = parseInt(scope.storeId);

      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          scope.total = '$' + response.data.total;
          scope.productchartdata=[];
          scope.linechartData=[];
          scope.rpIndextotal = parseFloat(response.data.total);
          if (scope.spIndextotal == 0||scope.spIndextotal == null) {
            scope.spIndex = 0;
          }
          else {
            scope.spIndex = scope.rpIndextotal / scope.spIndextotal;
            scope.spIndex = scope.spIndex.toFixed(2);
          }
           var dataobject={
              "storeid":  scope.storeId,
              "index":scope.spIndex
               }
          $rootScope.$emit('storecomparisonindexbarchart', dataobject);

          var object={
              "storename":"STORE #"+storeid,
              "income":scope.spIndextotal,
              "expenses":response.data.total,
              "color": "#ba5bbb",
              "color1": "#428DB6"
            }
              scope.productchartdata.push(object);
          scope.chartdata=scope.productchartdata;
           for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].expenses));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].income));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }
             else{
              scope.maxvalue=scope.reporttimemax;
             }
              scope.maximumValue=dashBoardService.getStoremaxvalue();
                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){
                   if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setStoremaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setStoremaxvalue(scope.maxvalue);
                 }
                 for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
            }

           $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){

             $rootScope.$emit('updatestorebarchart', {});
            }
          }, 0);



        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": scope.compareStartDate,
      "endTime": scope.compareEndDate

    }
           sessionStorage.storeId = parseInt(scope.storeId);

    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
        scope.spIndextotal = parseFloat(response.data.total);
       // console.log("for compare time...",response.data);
        scope.Cpdata=response.data.data;
        scope.SalesPerformanceByStoreIdbyRT();
      }, function (response) {
        console.log(response);
      }
    );
  }


       scope.mfgid=sessionStorage.user;

  scope.SalesPerformanceByStoreIdforcpg = function (storeid) {
  //  $scope.showspinner();
    scope.SalesPerformanceByStoreIdbyRT = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": scope.reportStartDate,
        "endTime": scope.reportEndDate,
         "filters": {
          "items.mfgId" : [scope.mfgid]
        }
      }
             sessionStorage.storeId = parseInt(scope.storeId);
             sessionStorage.user=scope.retailerid;
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          scope.total = '$' + response.data.total;
          scope.productchartdata=[];
          scope.linechartData=[];
        //  console.log("for report time...",response.data);
          scope.rpIndextotal = parseFloat(response.data.total);
          if (scope.spIndextotal == 0||scope.spIndextotal == null) {
            scope.spIndex = 0;
          }
          else {
            scope.spIndex = scope.rpIndextotal / scope.spIndextotal;
            scope.spIndex = scope.spIndex.toFixed(2);
          }

           var object={
              "storename":"STORE #"+storeid,
              "income":scope.spIndextotal,
              "expenses":response.data.total,
              "color": "#ba5bbb",
              "color1": "#428DB6"
            }
              scope.productchartdata.push(object);
          scope.chartdata=scope.productchartdata;
           for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].expenses));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].income));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }
             else{
              scope.maxvalue=scope.reporttimemax;
             }
              scope.maximumValue=dashBoardService.getStoremaxvalue();
                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){
                   if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setStoremaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setStoremaxvalue(scope.maxvalue);
                 }
           for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);
            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
            }
           $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){

             $rootScope.$emit('updatestorebarchart', {});
            }
          }, 0);


        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": scope.compareStartDate,
      "endTime": scope.compareEndDate,
       "filters": {
          "items.mfgId" : [scope.mfgid]
        }
    }

           sessionStorage.storeId = parseInt(scope.storeId);
           sessionStorage.user=scope.retailerid;
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
        scope.spIndextotal = parseFloat(response.data.total);
        //console.log("for compare time...",response.data);
        scope.Cpdata=response.data.data;
        scope.SalesPerformanceByStoreIdbyRT();
      }, function (response) {
        console.log(response);
      }
    );
  }




  scope.SalesPerformanceByStoreIdfordistributor = function (storeid) {
  //  $scope.showspinner();
    scope.SalesPerformanceByStoreIdbyRTfordistributor = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": scope.reportStartDate,
        "endTime": scope.reportEndDate,
         "filters": {
          "items.brandId" :dashBoardService.getBrandIdList()
        }
      }
             sessionStorage.storeId = parseInt(scope.storeId);
             sessionStorage.user=scope.retailerid;
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          scope.total = '$' + response.data.total;
          scope.productchartdata=[];
          scope.linechartData=[];
          scope.rpIndextotal = parseFloat(response.data.total);
          if (scope.spIndextotal == 0||scope.spIndextotal == null) {
            scope.spIndex = 0;
          }
          else {
            scope.spIndex = scope.rpIndextotal / scope.spIndextotal;
            scope.spIndex = scope.spIndex.toFixed(2);
          }
           var object={
              "storename":"STORE #"+storeid,
              "income":scope.spIndextotal,
              "expenses":response.data.total,
              "color": "#ba5bbb",
              "color1": "#428DB6"
            }
              scope.productchartdata.push(object);
          scope.chartdata=scope.productchartdata;
           for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].expenses));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].income));
             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);
             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }
             else{
              scope.maxvalue=scope.reporttimemax;
             }
              scope.maximumValue=dashBoardService.getStoremaxvalue();
                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){
                   if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setStoremaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setStoremaxvalue(scope.maxvalue);
                 }
           for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);
            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
            }
           $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){
             $rootScope.$emit('updatestorebarchart', {});
            }
          }, 0);
        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": scope.compareStartDate,
      "endTime": scope.compareEndDate,
       "filters": {
          "items.brandId" :dashBoardService.getBrandIdList()
        }
        }
           sessionStorage.storeId = parseInt(scope.storeId);
           sessionStorage.user=scope.retailerid;
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
        scope.spIndextotal = parseFloat(response.data.total);
        scope.Cpdata=response.data.data;
        scope.SalesPerformanceByStoreIdbyRTfordistributor();
      }, function (response) {
        console.log(response);
      }
    );
  }

             var barchartevent;
         barchartevent=   $rootScope.$on('barcharteventforstore', function (event, data) {
              scope.reportStartDate=data.reportStartDate;
              scope.reportEndDate=data.reportEndDate;
              scope.compareStartDate=data.compareStartDate;
              scope.compareEndDate=data.compareEndDate;
              scope.role=sessionStorage.role;
               if(scope.role=="cpg"){
                scope.SalesPerformanceByStoreIdforcpg(scope.storeId);
               }
               else if(scope.role=="distributor"){
                scope.SalesPerformanceByStoreIdfordistributor(scope.storeId);
               }
               else{
             scope.SalesPerformanceByStoreId(scope.storeId);
               }





         });




        }//end watch


      }
    }])
