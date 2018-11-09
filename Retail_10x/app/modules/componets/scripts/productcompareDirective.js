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


angular.module('Retails.productcompare', [])

  .directive('productcompareDirective', ['$compile', '$window', '$timeout','$rootScope','productService','dashBoardService','$filter',
    function ($compile, $window, $timeout,$rootScope,productService,dashBoardService,$filter) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data:'=',
          itemnumber:'=',
          dates:'=',
          unitsold:'='

        },
        templateUrl: 'modules/componets/views/productcomparetemplate.html',

        link: function (scope, element, attrs) {

           scope.chartid = scope.id;
           scope.chartdata=scope.data;
             scope.itemnumber=scope.itemnumber;
            // console.log("chartdata123...",scope.chartid);
             //console.log("chartdata...",scope.data);

             scope.reportdate=moment(scope.dates.reportstartdate).format("YYYY-MM-DD");
             scope.reportenddate=moment(scope.dates.reportenddate).format("YYYY-MM-DD");

                     var chart = false;

                     var initLineChart = function () {

                       if (chart)chart.destroy();

                       chart = AmCharts.makeChart(scope.chartid,
                         {

                           type: "serial",
                           theme: "light",
                           dataProvider: scope.chartdata,

                           pathToImages: "//cdn.amcharts.com/lib/3/images/",
                           dataDateFormat: "MM-DD-YYYY",
                           categoryField: "date",
                           categoryAxis: {
                             parseDates: true,
                             minPeriod: "DD",
                             gridAlpha: 0.1,
                             minorGridAlpha: 0.1,
                             axisAlpha: 0,
                             minorGridEnabled: true,
                             boldPeriodBeginning:false,
                             dateFormats : [{
                                 period: 'fff',
                                 format: 'JJ:NN:SS'
                                 }, {
                                 period: 'ss',
                                 format: 'JJ:NN:SS'
                                 }, {
                                 period: 'mm',
                                 format: 'JJ:NN'
                                 }, {
                                 period: 'hh',
                                 format: 'JJ:NN'
                                 }, {
                                 period: 'DD',
                                 format: 'MMM DD'
                                 }, {
                                 period: 'WW',
                                 format: 'MMM DD'
                                 }, {
                                 period: 'MM',
                                 format: 'MMM YYYY'
                                 }, {
                                 period: 'YYYY',
                                 format: 'MMM YYYY'
                                 }],
                             
/*
                             guides: [{
                               date :scope.reportdate,
                               label : "Start Date",
                               position : "bottom",
                               lineAlpha : 1,
                               labelRotation : 90,
                               lineColor : "#428dc9",
                               inside: true,
                             },
                               {
                                 date : scope.reportenddate,
                                 label : "End Date",
                                 position : "top",
                                 lineAlpha : 1,
                                 labelRotation : 90,
                                 lineColor : "#428dc9",
                                 inside: true,
                               }]*/
                           },


                           valueAxes: [{

                             tickLength: 0,
                             axisAlpha: 0,
                             showFirstLabel: false,
                             showLastLabel: false
                              
                           }],


                           graphs: [{
                             lineColor: "#ba5bbb",
                             valueField: "value",
                             bullet: "round",
                             balloonText: "[[date]]<br><span style='font-size:14px;'>Sales Amt: $[[amt]]|[[unitSoldbyRp]] units</span>"
                           },
                             {
                               lineColor: "#428dc9",
                               valueField: "value2",
                               bullet: "round",
                               balloonText: "[[date1]]<br><span style='font-size:14px;'>Sales Amt: $[[amt1]]|[[unitSoldbyCp]] units</span>"
                             }

                           ],

                           chartCursor: {},
                            "balloon": {
              "fillColor": "#000000",
               "color": "#ffffff",
               "fillAlpha": 1.0,
              
              },
               "export": {
                "enabled": true,
                "fileName":"Products",

  "exportFields": [
          "productName",
          "name",
          "date3",
          "date1",
          "amt",
          "amt1",
          "unitSoldbyRp",
          "unitSoldbyCp",
          "RetailRT",
          "RetailCT"
          
          ],
    "columnNames": {
      "productName":"Product Name",
    "name": "Upc",
    "date3": "Report Time Period",
    "date1": "Compare Time Period",
    "amt": "Report Time Sales Amount",
    "amt1":"Compare Time Sales Amount",
    "unitSoldbyRp":"Report Time Units Sold",
    "unitSoldbyCp":"Compare Time Units Sold",
    "RetailRT":"Report Time Retail",
    "RetailCT":"Compare Time Retail"
  },
                 "menu": [ {
      "class": "export-main",
      "menu": [ {
        "label": "Download As",
        "menu": ["XLSX"]
      }]
    } ]
              },

                         }
                       );
           //chart.addListener("rendered", zoomChart);

           zoomChart();
           function zoomChart(){
           }
         }

         for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata[i].date3=scope.chartdata[i].date;
             }

         $timeout(function () {
           if (chart)
             chart.clear();
           initLineChart();
         }, 0);


         scope.$on('$destroy', function () {
           if (chart)
             chart.clear();
         });


scope.avgBasketFunction = function (upc) {
  scope.avgBasketByRT = function () {
    var ShoppingTripsdataRT = {
          "aggTimeUnit": "1d",
           "startTime": scope.reportStartDate,
            "endTime": scope.reportEndDate,
           "filters": {
            "item.upc" : [upc]
        }
       }
       
       dashBoardService.GetAvgBasket(ShoppingTripsdataRT).then(function (response) {
        scope.avgBasketTotal = response.data.stats.avg;
        scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
        if(scope.avgBasketTotalByCP ==0||scope.avgBasketTotalByCP==null || isNaN(scope.avgBasketTotalByCP)) {
            scope.ABtotal = 0;
        }
        else {
        scope.ABtotal=scope.avgBasketTotalByRT/scope.avgBasketTotalByCP;
        scope.ABtotal= scope.ABtotal.toFixed(2);
          }

         var avgobject={
          "upc":upc,
          "avgbasket":scope.ABtotal
         }
         $rootScope.$emit('avgbasket', avgobject);
      }, function (response) {
        console.log(response);
      }
      );
   }

   var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
        "startTime": scope.compareStartDate,
        "endTime": scope.compareEndDate,
        "filters": {
            "item.upc" : [upc]
        }
        }
        dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
      if(response.data.stats){
      scope.avgBasketTotalByCP =parseFloat(response.data.stats.avg);
      }        
      scope.avgBasketByRT();
        }, function (response) {
          console.log(response);
        }
        );
      }


    scope.avgBasketFunctionbystore = function (upc) {
  scope.avgBasketByRT = function () {
    var ShoppingTripsdataRT = {
          "aggTimeUnit": "1d",
           "startTime": scope.reportStartDate,
            "endTime": scope.reportEndDate,
           "filters": {
            "item.upc" : [upc]
        }
       }
       dashBoardService.GetAvgBasketByStoreId(ShoppingTripsdataRT).then(function (response) {
        scope.avgBasketTotal = response.data.stats.avg;
        scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
        if(scope.avgBasketTotalByCP ==0||scope.avgBasketTotalByCP==null||isNaN(scope.avgBasketTotalByCP)) {
            scope.ABtotal = 0;
          }
        else {
        if(scope.avgBasketTotalByRT){
          scope.ABtotal =scope.avgBasketTotalByRT /scope.avgBasketTotalByCP;
          scope.ABtotal = scope.ABtotal.toFixed(2);
        }
        else{
          scope.ABtotal = 0.00;
          scope.ABtotal = scope.ABtotal.toFixed(2);
        }
        }
         var avgobject={
          "upc":upc,
          "avgbasket":scope.ABtotal
         }
         $rootScope.$emit('avgbasket', avgobject);
      }, function (response) {
        console.log(response);
      }
      );
   }

   var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
        "startTime": scope.compareStartDate,
        "endTime": scope.compareEndDate,
        "filters": {
            "item.upc" : [upc]
        }
        }
        dashBoardService.GetAvgBasketByStoreId(ShoppingTripsdata).then(function (response) {
      if(response.data.stats){
          scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
            }
          scope.avgBasketByRT();
        }, function (response) {
          console.log(response);
        }
        );
    }


  
        scope.avgBasketforcpg = function (upc) {
      scope.avgBasketforDistributorByRT = function () {
    var ShoppingTripsdataRT = {
           "aggTimeUnit": "1d",
           "startTime":scope.reportStartDate,
           "endTime":scope.reportEndDate,
           "filters": {
           "item.upc" : [upc],
           "retailerId" :scope.allRetailers
        }
       }
       productService.getAvgBasketforDistributor(ShoppingTripsdataRT).then(function (response) {
          scope.avgBasketTotal = response.data.stats.avg;
          scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
          if (scope.avgBasketTotalByCP == 0 || scope.avgBasketTotalByCP == null || isNaN(scope.avgBasketTotalByCP)) {
            scope.ABtotal = 0;
          }
        else {
            scope.ABtotal =scope.avgBasketTotalByRT /scope.avgBasketTotalByCP;
            scope.ABtotal =scope.ABtotal.toFixed(2);
          }
            var avgobject={
          "upc":upc,
          "avgbasket":scope.ABtotal
         }
         $rootScope.$emit('avgbasket', avgobject);
      }, function (response) {
        console.log(response);
      }
      );
   }
   var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
        "startTime": scope.compareStartDate,
        "endTime": scope.compareEndDate,
        "filters": {
        "item.upc" : [upc],
        "retailerId" :scope.allRetailers
        }
        }
        productService.getAvgBasketforDistributor(ShoppingTripsdata).then(function (response) {
          if(response.data.stats){
          scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
           }
          scope.avgBasketforDistributorByRT();
        }, function (response) {
          console.log(response);
        }
        );
    }

        scope.avgBasketforDistributor = function (upc) {
      scope.avgBasketforDistributorByRT = function () {
    var ShoppingTripsdataRT = {
      "aggTimeUnit": "1d",
           "startTime":scope.reportStartDate,
            "endTime":scope.reportEndDate,
            "rid" : "000",
           "filters": {
            "item.upc" : [upc]
        }
       }
       productService.getAvgBasketforDistributor(ShoppingTripsdataRT).then(function (response) {
          scope.avgBasketTotal = response.data.stats.avg;
          scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
          if (scope.avgBasketTotalByCP == 0 || scope.avgBasketTotalByCP == null || isNaN(scope.avgBasketTotalByCP)) {
            scope.ABtotal = 0;
          }
          else {
            scope.ABtotal = scope.avgBasketTotalByRT / scope.avgBasketTotalByCP;
            scope.ABtotal = scope.ABtotal.toFixed(2);
          }
            var avgobject={
          "upc":upc,
          "avgbasket":scope.ABtotal
         }
         $rootScope.$emit('avgbasket', avgobject);
      }, function (response) {
        console.log(response);
      }
      );
   }
   var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
        "startTime": scope.compareStartDate,
         "endTime": scope.compareEndDate,
         "rid" : "000",
        "filters": {
        "item.upc" : [upc]
        }
        }
        productService.getAvgBasketforDistributor(ShoppingTripsdata).then(function (response) {
          if(response.data.stats){
          scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
           }
          scope.avgBasketforDistributorByRT();
        }, function (response) {
          console.log(response);
        }
        );
    }

    scope.ShoppingTripsFunction = function (upc) {
      scope.ShoppingTripsbyRT = function () {
        var ShoppingTripsdataRT = {
          "aggTimeUnit": "1d",
          "startTime": scope.reportStartDate,
          "endTime": scope.reportEndDate,
          "filters": {
          "terms" : {
          "item.upc" : [upc]
          }
        }
       }

  dashBoardService.GetShoppingTrips(ShoppingTripsdataRT).then(function (response) {
  scope.ShoppingTripsTotalbyRT = response.data.total;
  scope.ShoppingTripsRTindex = parseFloat(response.data.total);
  if(scope.ShoppingTripsCPindex==0||scope.ShoppingTripsCPindex==null||isNaN(scope.ShoppingTripsCPindex)) {
    scope.STIndex = 0;
   }
  else {
    scope.STIndex =scope.ShoppingTripsTotalbyRT/scope.ShoppingTripsCPindex;
    scope.STIndex = scope.STIndex.toFixed(2);
  }

  var shoppingtripsobject={
    "upc":upc,
    "shoppingtrips":scope.STIndex
  }

 $rootScope.$emit('shoppingtrips', shoppingtripsobject);

  }, function (response) {
    console.log(response);
  }
  );
  }

   var ShoppingTripsdata = {
       "aggTimeUnit": "1d",
       "startTime": scope.compareStartDate,
       "endTime": scope.compareEndDate,
       "filters": {
       "terms" : {
       "item.upc" : [upc]
      }
      }
      }
  dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
    scope.ShoppingTripsCPindex = parseFloat(response.data.total);
    scope.ShoppingTripsbyRT();
  }, function (response) {
    console.log(response);
  }
  );
  }



    scope.ShoppingTripsFunctionbystore = function (upc) {
      scope.ShoppingTripsbyRT = function () {
        var ShoppingTripsdataRT = {
          "aggTimeUnit": "1d",
       "startTime": scope.reportStartDate,
            "endTime": scope.reportEndDate,
          "filters": {
          "terms" : {
            "item.upc" : [upc]
          }
        }
       }

       dashBoardService.GetShoppingTripsByStoreId(ShoppingTripsdataRT).then(function (response) {
        scope.ShoppingTripsTotalbyRT = response.data.total;
        scope.ShoppingTripsRTindex = parseFloat(response.data.total);
        if(scope.ShoppingTripsCPindex == 0||scope.ShoppingTripsCPindex == null || isNaN(scope.ShoppingTripsCPindex)) {
        scope.STIndex = 0;
        }
        else {
        scope.STIndex = scope.ShoppingTripsTotalbyRT /scope.ShoppingTripsCPindex;
        scope.STIndex = scope.STIndex.toFixed(2);
        }
      var shoppingtripsobject={
          "upc":upc,
          "shoppingtrips":scope.STIndex
         }
         $rootScope.$emit('shoppingtrips', shoppingtripsobject);
            }, function (response) {
              console.log(response);
            }
            );
          }

   var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
       "startTime": scope.compareStartDate,
        "endTime": scope.compareEndDate,
        "filters": {
            "terms" : {
            "item.upc" : [upc]
          }
        }
        }
        dashBoardService.GetShoppingTripsByStoreId(ShoppingTripsdata).then(function (response) {
          scope.ShoppingTripsCPindex = parseFloat(response.data.total);
          scope.ShoppingTripsbyRT();
        }, function (response) {
          console.log(response);
        }
        );
    }

    scope.ShoppingTripsforDistributor = function (upc) {
      scope.ShoppingTripsforDistributorbyRT = function () {
        var ShoppingTripsdataRT = {
          "aggTimeUnit": "1d",
       "startTime": scope.reportStartDate,
            "endTime": scope.reportEndDate,
            "rid" : "000",
          "filters": {
           "terms" : {
            "item.upc" : [upc]
          }
        }

       }

       productService.getShoppingTripsforDistributor(ShoppingTripsdataRT).then(function (response) {
        scope.ShoppingTripsTotalbyRT = response.data.total;
        scope.ShoppingTripsRTindex = parseFloat(response.data.total);

        if (scope.ShoppingTripsCPindex==0||scope.ShoppingTripsCPindex== null || isNaN(scope.ShoppingTripsCPindex)) {
          scope.STIndex = 0;
        }
        else {
        scope.STIndex = scope.ShoppingTripsTotalbyRT /scope.ShoppingTripsCPindex;
        scope.STIndex = scope.STIndex.toFixed(2);
        }

      var shoppingtripsobject={
          "upc":upc,
          "shoppingtrips":scope.STIndex
         }
         $rootScope.$emit('shoppingtrips', shoppingtripsobject);
            }, function (response) {
              console.log(response);
            }
            );
        }

   var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
       "startTime": scope.compareStartDate,
        "endTime": scope.compareEndDate,
        "rid" : "000",
        "filters": {
            "terms" : {
            "item.upc" : [upc]
          }
        }
        }
        productService.getShoppingTripsforDistributor(ShoppingTripsdata).then(function (response) {
          scope.ShoppingTripsCPindex = parseFloat(response.data.total);
          scope.ShoppingTripsforDistributorbyRT();
        }, function (response) {
          console.log(response);
        }
        );
    }

        scope.ShoppingTripsforcpg = function (upc) {
      scope.ShoppingTripsforDistributorbyRT = function () {
        var ShoppingTripsdataRT = {
          "aggTimeUnit": "1d",
       "startTime": scope.reportStartDate,
            "endTime": scope.reportEndDate,
          "filters": {
           "terms" : {
            "item.upc" : [upc],
             "retailerId" :scope.allRetailers
          }
        }
       }
       productService.getShoppingTripsforDistributor(ShoppingTripsdataRT).then(function (response) {
        scope.ShoppingTripsTotalbyRT = response.data.total;
        scope.ShoppingTripsRTindex = parseFloat(response.data.total);
        if (scope.ShoppingTripsCPindex==0||scope.ShoppingTripsCPindex== null || isNaN(scope.ShoppingTripsCPindex)) {
          scope.STIndex = 0;
        }
        else {
        scope.STIndex = scope.ShoppingTripsTotalbyRT /scope.ShoppingTripsCPindex;
        scope.STIndex = scope.STIndex.toFixed(2);
        }

      var shoppingtripsobject={
          "upc":upc,
          "shoppingtrips":scope.STIndex
         }
         $rootScope.$emit('shoppingtrips', shoppingtripsobject);
            }, function (response) {
              console.log(response);
            }
            );
        }

   var ShoppingTripsdata = {
        "aggTimeUnit": "1d",
        "startTime": scope.compareStartDate,
        "endTime": scope.compareEndDate,
        "filters": {
        "terms" : {
        "item.upc" : [upc],
        "retailerId" :scope.allRetailers
          }
        }
        }
        productService.getShoppingTripsforDistributor(ShoppingTripsdata).then(function (response) {
          scope.ShoppingTripsCPindex = parseFloat(response.data.total);
          scope.ShoppingTripsforDistributorbyRT();
        }, function (response) {
          console.log(response);
        }
        );
    }



    scope.rid="000"

     scope.shareOfCategoryByAllRetailers= function (upc) {
          scope.shareOfCategoryByRT = function () {
            var ShoppingTripsdata = {

              "aggTimeUnit": "1d",
              "startTime": scope.reportStartDate,
              "endTime": scope.reportEndDate,
              // "rid" : scope.rid,
              "filters": {
               "item.upc" : [upc]
        }
            }
             
        dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
          scope.avgBasketTotal = response.data.stats.avg;
          scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
          if(scope.avgBasketTotalByCP ==0||scope.avgBasketTotalByCP==null || isNaN(scope.avgBasketTotalByCP)) {
            scope.ABtotal = 0;
          }
          else {
            scope.ABtotal =scope.avgBasketTotalByRT /scope.avgBasketTotalByCP;
            scope.ABtotal = scope.ABtotal.toFixed(2);
          }

         var avgobject={
          "upc":upc,
          "avgbasket":scope.ABtotal
         }

         $rootScope.$emit('avgbasket', avgobject);
            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {

            "aggTimeUnit": "1d",
           "startTime": scope.compareStartDate,
           "endTime": scope.compareEndDate,
            // "rid" : scope.rid,
            "filters": {
           "item.upc" : [upc]
        }
          }
          dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
            // scope.avgBasketTotalByCP = parseFloat(response.data.total);
             if(response.data.stats){
               scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
            }
      
          scope.shareOfCategoryByRT();
          }, function (response) {
            console.log(response);
          }
          );
        }

        scope.ShareOfBasketByAllRetailer = function (upc) {
          scope.avgBasketByRTforcpg = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": scope.reportStartDate,
            "endTime": scope.reportEndDate,
             "filters": {
                  "terms" : {
                      "item.upc" : [upc]
                     }
                 }
            }

            dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
          scope.ShoppingTripsTotalbyRT = response.data.total;
          scope.ShoppingTripsRTindex = parseFloat(response.data.total);

          if (scope.ShoppingTripsCPindex == 0||scope.ShoppingTripsCPindex == null || isNaN(scope.ShoppingTripsCPindex)) {
                  scope.STIndex = 0;
                }
        else {
            scope.STIndex = scope.ShoppingTripsTotalbyRT /scope.ShoppingTripsCPindex;
            scope.STIndex = scope.STIndex.toFixed(2);
                }

                 var shoppingtripsobject={
          "upc":upc,
          "shoppingtrips":scope.STIndex
         }

         $rootScope.$emit('shoppingtrips', shoppingtripsobject);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": scope.compareStartDate,
              "endTime": scope.compareEndDate,
            "filters": {
                  "terms" : {
                      "item.upc" : [upc]
                     }
                 }
          }
          dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
          scope.ShoppingTripsCPindex = parseFloat(response.data.total);

            scope.avgBasketByRTforcpg();

          }, function (response) {
            console.log(response);
          }
          );
        }


        scope.shareOfCategoryByDMA= function (upc) {
          scope.shareOfCategoryByRTforDMA = function () {
            var ShoppingTripsdata = {

              "aggTimeUnit": "1d",
              "startTime": scope.reportStartDate,
              "endTime": scope.reportEndDate,
              // "rid" : scope.rid,
              "filters":{
               "item.upc": [scope.itemnumber],
                "storeId": scope.dmaStoreList
               }
               }

             
            productService.getAvgBasketforDistributor(ShoppingTripsdata).then(function (response) {

          scope.avgBasketTotal = response.data.total;

          scope.avgBasketTotalByRT = parseFloat(response.data.total);

          if (scope.avgBasketTotalByCP ==0||scope.avgBasketTotalByCP == null || isNaN(scope.avgBasketTotalByCP)) {
            scope.ABtotal = 0;
          }
          else {
            scope.ABtotal =scope.avgBasketTotalByRT /scope.avgBasketTotalByCP;
            scope.ABtotal = scope.ABtotal.toFixed(2);
          }

         var avgobject={
          "upc":upc,
          "avgbasket":scope.ABtotal
         }

         $rootScope.$emit('avgbasket', avgobject);
            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {

            "aggTimeUnit": "1d",
           "startTime": scope.compareStartDate,
           "endTime": scope.compareEndDate,
          // "rid" : scope.rid,
          "filters":{
          "item.upc": [scope.itemnumber],
           "storeId": scope.dmaStoreList
            }
          }
             productService.getAvgBasketforDistributor(ShoppingTripsdata).then(function (response) {
         scope.avgBasketTotalByCP = parseFloat(response.data.total);
          scope.shareOfCategoryByRTforDMA();
          }, function (response) {
            console.log(response);
          }
          );
        }




        scope.ShareOfBasketByDMA = function (upc) {
          scope.avgBasketByRTforDMA = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": scope.reportStartDate,
              "endTime": scope.reportEndDate,
              // "rid" : scope.rid,
              "filters": {
                "terms":{
              "item.upc" : [upc],
              "storeId": scope.dmaStoreList
             }}
            }

             productService.getShoppingTripsforDistributor(ShoppingTripsdata).then(function (response) {
          scope.ShoppingTripsTotalbyRT = response.data.total;
          scope.ShoppingTripsRTindex = parseFloat(response.data.total);
          if(scope.ShoppingTripsCPindex==0||scope.ShoppingTripsCPindex == null || isNaN(scope.ShoppingTripsCPindex)) {
                  scope.STIndex = 0;
          }
        else {
          scope.STIndex = scope.ShoppingTripsTotalbyRT /scope.ShoppingTripsCPindex;
          scope.STIndex = scope.STIndex.toFixed(2);
                }
          var shoppingtripsobject={
          "upc":upc,
          "shoppingtrips":scope.STIndex
         }
         $rootScope.$emit('shoppingtrips', shoppingtripsobject);

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": scope.compareStartDate,
            "endTime": scope.compareEndDate,
            // "rid" : scope.rid,
            "filters": {
              "terms":{
            "item.upc" : [upc],
            "storeId": scope.dmaStoreList
          }}
          }
          productService.getShoppingTripsforDistributor(ShoppingTripsdata).then(function (response) {
          scope.ShoppingTripsCPindex = parseFloat(response.data.total);
            scope.avgBasketByRTforDMA();
          }, function (response) {
            console.log(response);
          }
          );
        }


      scope.selectedItemsDataAraayforLinechart=[];
      scope.getproductBasedonstoreid =function (inputData) {

         scope.reportdate=inputData.reportStartDate;
        scope.reportenddate=inputData.reportEndDate;
           console.log("itemnumber",scope.itemnumber);
          scope.getproductforRT = function () {

            var data = {
              "aggTimeUnit": "1d",
              "startTime": inputData.reportStartDate,
              "endTime": inputData.reportEndDate,
              "filters": {
                "item.upc": scope.itemnumber
              }
            }

            productService.GetSalesPerformanceByStoreId(data).then(function (response) {
            scope.ProductsbyRT = response.data.data;
            scope.rpIndextotal = parseFloat(response.data.total);
            scope.totalunitsold=response.data.totalSoldQty;

            if (scope.spIndextotal == 0 || scope.spIndextotal == null) {
              scope.spIndex = 0;
            }
            else {
              scope.spIndex = scope.rpIndextotal / scope.spIndextotal;
              scope.spIndex = scope.spIndex.toFixed(2);
            }

            var indexobject={
          "upc":scope.itemnumber,
          "spindex":scope.spIndex,
          "total":scope.rpIndextotal,
          "unitsold":scope.totalunitsold
         }

         $rootScope.$emit('spindex', indexobject);
          scope.linechartData=[];
          var a = moment(inputData.reportStartDate);
                var b = moment(inputData.reportEndDate);
              var days = b.diff(a, 'days');

             scope.j=1;

                for(var i=0;i<scope.ProductsbyRT.length;i++){

                   if(i==0){
               scope.date=moment(inputData.reportStartDate).utc().format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
               scope.ResultDate1=moment(inputData.compareStartDate).utc().format("MM-DD-YYYY");
             }
             else{
               
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
               scope.ResultDate1=moment(inputData.compareStartDate).add(i,'days').format("MM-DD-YYYY");
               scope.j++;
             }

            if(scope.ProductsbyCT&&scope.ProductsbyRT){

              if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){

                var linechartdataobject = {

                   "date": scope.ResultDate,
                   "date1":scope.ResultDate1,
                   "lineColor": "rgb(66, 141, 201)",
                   "value": scope.ProductsbyRT[i].amt,
                   "value2": scope.ProductsbyCT[i].amt,
                    "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                    "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                    "name": scope.itemnumber,
                    "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                    "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }
                     scope.linechartData.push(linechartdataobject);

                    }
            else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
                  else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
                  
                     var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0.00,
                        "value2":scope.ProductsbyCT[i].amt,
                        "amt": 0.00,
                       "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                         "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
                    else{
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2":0,
                        "amt": 0.00,
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                        "unitSoldbyCp":0
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
              }
              else{
                if(scope.ProductsbyRT[i]){

                  var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                }
              }


                /* if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){
                   var linechartdataobject={

                           "date": scope.ResultDate,
                           "date1":scope.ResultDate1,
                           "lineColor": "rgb(66, 141, 201)",
                           "value": scope.ProductsbyRT[i].amt,
                           "value2":  scope.ProductsbyCT[i].amt,
                           "amt":$filter('number')(scope.ProductsbyRT[i].amt,2),
                           "amt1":$filter('number')(scope.ProductsbyCT[i].amt,2),
                           "name":scope.itemnumber,
                           "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                           "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)



                   }
                  scope.linechartData.push(linechartdataobject);

                 }
                 else if(scope.ProductsbyRT[i]){
                   var linechartdataobject={
                             "date": scope.ResultDate,
                             "date1":scope.ResultDate1,
                             "lineColor": "rgb(66, 141, 201)",
                             "value": scope.ProductsbyRT[i].amt,
                             "value2":0,
                           "amt":$filter('number')(scope.ProductsbyRT[i].amt,2),
                             "amt1":0.00,
                             "name":scope.itemnumber,
                           "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                             "unitSoldbyCp":0
                   }
                  scope.linechartData.push(linechartdataobject);

                 }
                 else if(scope.ProductsbyCT[i]){
                   var linechartdataobject={
                             "date": scope.ResultDate,
                             "date1":scope.ResultDate1,
                             "lineColor": "rgb(66, 141, 201)",
                             "value": 0,
                             "value2":scope.ProductsbyCT[i].amt,
                             "amt": 0.00,
                           "amt1":$filter('number')(scope.ProductsbyCT[i].amt,2),
                             "name":scope.itemnumber,
                              "unitSoldbyRp":0,
                           "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                   }
                  scope.linechartData.push(linechartdataobject);

                 }*/
               }
               scope.chartdata=scope.linechartData;
              $rootScope.$emit('chartdata', scope.chartdata);
              //console.log("chart data.....",scope.chartdata);
               for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata.date3=scope.chartdata[i].date;
             }
            scope.avgBasketFunctionbystore(scope.itemnumber);
            scope.ShoppingTripsFunctionbystore(scope.itemnumber);

             $timeout(function () {
               initLineChart();
             }, 0);

              }, function (response) {
                console.log(response);
              }
            );

          }

          var data1 = {
            "aggTimeUnit": "1d",
            "startTime": inputData.compareStartDate,
            "endTime": inputData.compareEndDate,
            "filters": {
              "item.upc": scope.itemnumber
            }
          }

          productService.GetSalesPerformanceByStoreId(data1).then(function (response) {

              scope.ProductsbyCT = response.data.data;
              if(response.data){
              scope.unitsoldbycp=response.data.totalSoldQty
                            }
            scope.spIndextotal = parseFloat(response.data.total);

              scope.getproductforRT();

            }, function (response) {
              console.log(response);
            }
          );
      }
      

      scope.getproductforAllstores =function (inputData) {

        scope.reportdate=inputData.reportStartDate;
        scope.reportenddate=inputData.reportEndDate;
          scope.getproductforRT = function () {

            var data = {
              "aggTimeUnit": "1d",
              "startTime": inputData.reportStartDate,
              "endTime": inputData.reportEndDate,
              "filters": {
                "item.upc": scope.itemnumber
              }
            }


            productService.GetSalesPerformance(data).then(function (response) {

              scope.ProductsbyRT = response.data.data;
            scope.rpIndextotal = parseFloat(response.data.total);
            scope.totalunitsold=response.data.totalSoldQty;

            if (scope.spIndextotal == 0 || scope.spIndextotal == null) {
              scope.spIndex = 0;
            }
            else {
              scope.spIndex = scope.rpIndextotal / scope.spIndextotal;
              scope.spIndex = scope.spIndex.toFixed(2);
            }


            var indexobject={
          "upc":scope.itemnumber,
          "spindex":scope.spIndex,
           "total":scope.rpIndextotal,
          "unitsold":scope.totalunitsold
         }

         $rootScope.$emit('spindex', indexobject);


          scope.linechartData=[];

          var a = moment(inputData.reportStartDate);
                var b = moment(inputData.reportEndDate);
              var days = b.diff(a, 'days');

             scope.j=1;




               for(var i=0;i<scope.ProductsbyRT.length;i++){

                 if(i==0){
               scope.date=moment(inputData.reportStartDate).utc().format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
                scope.ResultDate1=moment(inputData.compareStartDate).utc().format("MM-DD-YYYY");

             }
             else{
               
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
                scope.ResultDate1=moment(inputData.compareStartDate).add(i,'days').format("MM-DD-YYYY");

               scope.j++;

             }

if(scope.ProductsbyCT&&scope.ProductsbyRT){

              if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){

                var linechartdataobject = {

                   "date": scope.ResultDate,
                   "date1":scope.ResultDate1,
                   "lineColor": "rgb(66, 141, 201)",
                   "value": scope.ProductsbyRT[i].amt,
                   "value2": scope.ProductsbyCT[i].amt,
                    "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                    "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                    "name": scope.itemnumber,
                    "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                    "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }
                     scope.linechartData.push(linechartdataobject);

                    }
            else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
                  else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
                  
                     var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0.00,
                        "value2":scope.ProductsbyCT[i].amt,
                        "amt": 0.00,
                       "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                         "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }

                      scope.linechartData.push(linechartdataobject);

                    }

                    else{
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2":0,
                        "amt": 0.00,
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                        "unitSoldbyCp":0
                      }

                      scope.linechartData.push(linechartdataobject);

                    }

              }
              else{
                if(scope.ProductsbyRT[i]){

                  var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);

                }
                
              }


               }

                scope.chartdata=scope.linechartData;
                $rootScope.$emit('chartdata', scope.chartdata);
                scope.avgBasketFunction(scope.itemnumber);
                scope.ShoppingTripsFunction(scope.itemnumber);

            //console.log("chartdata...",scope.chartdata);

            for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata.date3=scope.chartdata[i].date;
             }


             $timeout(function () {
               initLineChart();
             }, 0);

              }, function (response) {
                console.log(response);
              }
            );

          }

          var data1 = {
            "aggTimeUnit": "1d",
            "startTime": inputData.compareStartDate,
            "endTime": inputData.compareEndDate,
            "filters": {
              "item.upc": scope.itemnumber
            }
          }

          productService.GetSalesPerformance(data1).then(function (response) {

              scope.ProductsbyCT = response.data.data;
                if(response.data){
              scope.unitsoldbycp=response.data.totalSoldQty
                            }
            scope.spIndextotal = parseFloat(response.data.total);

              scope.getproductforRT();

            }, function (response) {
              console.log(response);
            }
          );
      }


      scope.getproductforAllstoresforcpgbyretailer =function (inputData) {

        scope.reportdate=inputData.reportStartDate;
        scope.reportenddate=inputData.reportEndDate;
          scope.getproductforRT = function () {

            var data = {
              "aggTimeUnit": "1d",
              "startTime": inputData.reportStartDate,
              "endTime": inputData.reportEndDate,
              "filters": {
                "item.upc": scope.itemnumber
                //"items.mfgId" : [scope.mfgId]
              }
            }

            productService.GetSalesPerformance(data).then(function (response) {
            scope.ProductsbyRT = response.data.data;
            scope.rpIndextotal = parseFloat(response.data.total);
            scope.totalunitsold=response.data.totalSoldQty;

            if (scope.spIndextotal == 0 || scope.spIndextotal == null) {
              scope.spIndex = 0;
            }
            else {
              scope.spIndex = scope.rpIndextotal / scope.spIndextotal;
              scope.spIndex = scope.spIndex.toFixed(2);
            }

            var indexobject={
          "upc":scope.itemnumber,
          "spindex":scope.spIndex,
          "total":scope.rpIndextotal,
          "unitsold":scope.totalunitsold
         }

         $rootScope.$emit('spindex', indexobject);
          scope.linechartData=[];
          var a = moment(inputData.reportStartDate);
                var b = moment(inputData.reportEndDate);
              var days = b.diff(a, 'days');
             scope.j=1;

               for(var i=0;i<scope.ProductsbyRT.length;i++){

                 if(i==0){
               scope.date=moment(inputData.reportStartDate).utc().format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
                scope.ResultDate1=moment(inputData.compareStartDate).utc().format("MM-DD-YYYY");

             }
             else{
               
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
                scope.ResultDate1=moment(inputData.compareStartDate).add(i,'days').format("MM-DD-YYYY");
               scope.j++;

             }

            if(scope.ProductsbyCT&&scope.ProductsbyRT){

            if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){

                var linechartdataobject = {

                   "date": scope.ResultDate,
                   "date1":scope.ResultDate1,
                   "lineColor": "rgb(66, 141, 201)",
                   "value": scope.ProductsbyRT[i].amt,
                   "value2": scope.ProductsbyCT[i].amt,
                    "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                    "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                    "name": scope.itemnumber,
                    "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                    "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }
                     scope.linechartData.push(linechartdataobject);

                    }
            else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
                  else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
                  
                     var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0.00,
                        "value2":scope.ProductsbyCT[i].amt,
                        "amt": 0.00,
                       "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                         "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }

                      scope.linechartData.push(linechartdataobject);

                    }

                    else{
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2":0,
                        "amt": 0.00,
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                        "unitSoldbyCp":0
                      }

                      scope.linechartData.push(linechartdataobject);
                    }
              }
              else{
                if(scope.ProductsbyRT[i]){

                  var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                }
              }

               }
                scope.chartdata=scope.linechartData;
                $rootScope.$emit('chartdata', scope.chartdata);
               scope.shareOfCategoryByAllRetailers(scope.itemnumber);
                scope.ShareOfBasketByAllRetailer(scope.itemnumber);

              for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata.date3=scope.chartdata[i].date;
             }


             $timeout(function () {
               initLineChart();
             }, 0);

              }, function (response) {
                console.log(response);
              }
            );

          }

          var data1 = {
            "aggTimeUnit": "1d",
            "startTime": inputData.compareStartDate,
            "endTime": inputData.compareEndDate,
            "filters": {
              "item.upc": scope.itemnumber
              //"items.mfgId" : [scope.mfgId]
            }
          }

          productService.GetSalesPerformance(data1).then(function (response) {

              scope.ProductsbyCT = response.data.data;
                if(response.data){
              scope.unitsoldbycp=response.data.totalSoldQty
                            }
            scope.spIndextotal = parseFloat(response.data.total);

              scope.getproductforRT();

            }, function (response) {
              console.log(response);
            }
          );
      }



      scope.getproductBySelectedItemforcpg = function (inputData) {
       scope.getproductforRTforcpg = function () {

         var data = {
                  "aggTimeUnit": "1d",
                  "startTime": inputData.reportStartDate,
                  "endTime": inputData.reportEndDate,
                  "filters":{
                  "item.upc": scope.itemnumber,
                  "retailerId" :scope.allRetailers
                     //"items.mfgId" : [scope.mfgId]
                     }
                    }

    productService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
            scope.ProductsbyRT = response.data.data;
            scope.rpIndextotal = parseFloat(response.data.total);
            scope.totalunitsold=response.data.totalSoldQty;

            if(scope.spIndextotal ==0||scope.spIndextotal ==null) {
              scope.spIndex = 0;
            }
            else {
              scope.spIndex = scope.rpIndextotal / scope.spIndextotal;
              scope.spIndex = scope.spIndex.toFixed(2);
            }

            var indexobject={
          "upc":scope.itemnumber,
          "spindex":scope.spIndex,
           "total":scope.rpIndextotal,
          "unitsold":scope.totalunitsold
         }
         $rootScope.$emit('spindex', indexobject);
          scope.linechartData=[];
          var a = moment(inputData.reportStartDate);
              var b = moment(inputData.reportEndDate);
              var days = b.diff(a, 'days');
             scope.j=1;
               for(var i=0;i<scope.ProductsbyRT.length;i++){
           if(i==0){
               scope.date=moment(inputData.reportStartDate).utc().format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
                scope.ResultDate1=moment(inputData.compareStartDate).utc().format("MM-DD-YYYY");

             }
             else{
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
                scope.ResultDate1=moment(inputData.compareStartDate).add(i,'days').format("MM-DD-YYYY");
               scope.j++;
             }

                 if(scope.ProductsbyCT&&scope.ProductsbyRT){

              if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){

                var linechartdataobject = {

                   "date": scope.ResultDate,
                   "date1":scope.ResultDate1,
                   "lineColor": "rgb(66, 141, 201)",
                   "value": scope.ProductsbyRT[i].amt,
                   "value2": scope.ProductsbyCT[i].amt,
                    "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                    "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                    "name": scope.itemnumber,
                    "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                    "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }
                     scope.linechartData.push(linechartdataobject);

                    }
            else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
                  else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
                  
                     var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0.00,
                        "value2":scope.ProductsbyCT[i].amt,
                        "amt": 0.00,
                       "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                         "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }

                      scope.linechartData.push(linechartdataobject);

                    }

                    else{
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2":0,
                        "amt": 0.00,
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                        "unitSoldbyCp":0
                      }

                      scope.linechartData.push(linechartdataobject);

                    }

              }
              else{
                if(scope.ProductsbyRT[i]){

                  var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                }
              }
               }
                scope.chartdata=scope.linechartData;
                  $rootScope.$emit('chartdata', scope.chartdata);
                for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata.date3=scope.chartdata[i].date;
             }

             $timeout(function () {
               initLineChart();
             }, 0);

                 scope.ShoppingTripsforcpg(scope.itemnumber);
                scope.avgBasketforcpg(scope.itemnumber);

                   }, function (response) {
                        console.log(response);
                    }
                  );

                }

                var data1 = {
                          "aggTimeUnit": "1d",
                          "startTime": inputData.compareStartDate,
                          "endTime": inputData.compareEndDate,
                          "filters": {
                            "item.upc": scope.itemnumber,
                            "retailerId" :scope.allRetailers
                            //"items.mfgId" : [scope.mfgId]
                          }
                        }

                        productService.GetSalesPerformanceByAllRetailerswithoutsize(data1).then(function (response) {
                scope.ProductsbyCT = response.data.data;
                  if(response.data){
              scope.unitsoldbycp=response.data.totalSoldQty
                            }
               scope.spIndextotal = parseFloat(response.data.total);

            scope.getproductforRTforcpg();
          }, function (response) {
            console.log(response);
        }
        );
        }


      scope.getproductBySelectedItemforDMA = function (inputData) {
       scope.getproductforRTforDMA = function () {

         var data = {
              "aggTimeUnit": "1d",
              "startTime": inputData.reportStartDate,
              "endTime": inputData.reportEndDate,
              "filters":{
              "item.upc": scope.itemnumber,
             // "items.mfgId" : [scope.mfgId],
              "storeId": inputData.storeid
              }
             }
          productService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
            scope.ProductsbyRT = response.data.data;
            scope.rpIndextotal = parseFloat(response.data.total);
            scope.totalunitsold=response.data.totalSoldQty;

            if(scope.spIndextotal==0||scope.spIndextotal==null) {
              scope.spIndex =0;
            }
            else {
              scope.spIndex =scope.rpIndextotal/scope.spIndextotal;
              scope.spIndex =scope.spIndex.toFixed(2);
            }


            var indexobject={
          "upc":scope.itemnumber,
          "spindex":scope.spIndex,
          "total":scope.rpIndextotal,
          "unitsold":scope.totalunitsold
         }

         $rootScope.$emit('spindex', indexobject);
          scope.linechartData=[];
          var a = moment(inputData.reportStartDate);
                var b = moment(inputData.reportEndDate);
              var days = b.diff(a, 'days');
             scope.j=1;

          for(var i=0;i<scope.ProductsbyRT.length;i++){

           if(i==0){
               scope.date=moment(inputData.reportStartDate).utc().format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
               scope.ResultDate1=moment(inputData.compareStartDate).utc().format("MM-DD-YYYY");
             }
             else{
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
               scope.ResultDate1=moment(inputData.compareStartDate).add(i,'days').format("MM-DD-YYYY");
               scope.j++;
             }

              if(scope.ProductsbyCT&&scope.ProductsbyRT){

              if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){
                var linechartdataobject = {
                   "date": scope.ResultDate,
                   "date1":scope.ResultDate1,
                   "lineColor": "rgb(66, 141, 201)",
                   "value": scope.ProductsbyRT[i].amt,
                   "value2": scope.ProductsbyCT[i].amt,
                    "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                    "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                    "name": scope.itemnumber,
                    "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                    "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }
                     scope.linechartData.push(linechartdataobject);
                    }
            else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
                  else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
                     var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0.00,
                        "value2":scope.ProductsbyCT[i].amt,
                        "amt": 0.00,
                       "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                         "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
                    else{
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2":0,
                        "amt": 0.00,
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                        "unitSoldbyCp":0
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
              }
              else{
                if(scope.ProductsbyRT[i]){

                  var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                }
              }
               }
                scope.chartdata=scope.linechartData;
                 $rootScope.$emit('chartdata', scope.chartdata);
                for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata.date3=scope.chartdata[i].date;
               }

             $timeout(function () {
               initLineChart();
             }, 0);

                scope.shareOfCategoryByDMA(scope.itemnumber);
                scope.ShareOfBasketByDMA(scope.itemnumber);

                   }, function (response) {
                        console.log(response);
                    }
                  );

                }

        var data1 = {
            "aggTimeUnit": "1d",
            "startTime": inputData.compareStartDate,
            "endTime": inputData.compareEndDate,
            "filters": {
            "item.upc": scope.itemnumber,
            //"items.mfgId" : [scope.mfgId],
            "storeId": inputData.storeid
            }
            }

      productService.GetSalesPerformanceByAllRetailerswithoutsize(data1).then(function (response) {
          scope.ProductsbyCT = response.data.data;
          if(response.data){
            scope.unitsoldbycp=response.data.totalSoldQty
            }
          scope.spIndextotal = parseFloat(response.data.total);
            scope.getproductforRTforDMA();
          }, function (response) {
            console.log(response);
        }
        );
        }






    scope.getproductBySelectedItemfordistributor = function (inputData) {
       scope.getproductforRTfordistributor = function () {
         var data = {
                     "aggTimeUnit": "1d",
                   "startTime": inputData.reportStartDate,
                  "endTime": inputData.reportEndDate,
                     "filters":{
                     "item.upc": scope.itemnumber
                     }
                    }

                    productService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
               scope.ProductsbyRT = response.data.data;
            scope.rpIndextotal = parseFloat(response.data.total);
              scope.totalunitsold=response.data.totalSoldQty;

            if (scope.spIndextotal == 0 || scope.spIndextotal == null) {
              scope.spIndex = 0;
            }
            else {
              scope.spIndex = scope.rpIndextotal / scope.spIndextotal;
              scope.spIndex = scope.spIndex.toFixed(2);
            }

            var indexobject={
          "upc":scope.itemnumber,
          "spindex":scope.spIndex,
           "total":scope.rpIndextotal,
          "unitsold":scope.totalunitsold
         }

         $rootScope.$emit('spindex', indexobject);
          scope.linechartData=[];
          var a = moment(inputData.reportStartDate);
                var b = moment(inputData.reportEndDate);
              var days = b.diff(a, 'days');
             scope.j=1;
               for(var i=0;i<scope.ProductsbyRT.length;i++){
           if(i==0){
               scope.date=moment(inputData.reportStartDate).utc().format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
                scope.ResultDate1=moment(inputData.compareStartDate).utc().format("MM-DD-YYYY");
             }
             else{
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
                scope.ResultDate1=moment(inputData.compareStartDate).add(i,'days').format("MM-DD-YYYY");
               scope.j++;
             }
                 if(scope.ProductsbyCT&&scope.ProductsbyRT){
              if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){
                var linechartdataobject = {
                   "date": scope.ResultDate,
                   "date1":scope.ResultDate1,
                   "lineColor": "rgb(66, 141, 201)",
                   "value": scope.ProductsbyRT[i].amt,
                   "value2": scope.ProductsbyCT[i].amt,
                    "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                    "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                    "name": scope.itemnumber,
                    "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                    "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }
                     scope.linechartData.push(linechartdataobject);

                    }
            else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
                  else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
                     var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0.00,
                        "value2":scope.ProductsbyCT[i].amt,
                        "amt": 0.00,
                       "amt1": $filter('number')(scope.ProductsbyCT[i].amt,2),
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                         "unitSoldbyCp": $filter('number')(scope.ProductsbyCT[i].soldQuantity,2)
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
                    else{
                      var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2":0,
                        "amt": 0.00,
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":0,
                        "unitSoldbyCp":0
                      }
                      scope.linechartData.push(linechartdataobject);
                    }
              }
              else{
                if(scope.ProductsbyRT[i]){

                  var linechartdataobject = {
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": scope.ProductsbyRT[i].amt,
                        "value2":0.00,
                       "amt": $filter('number')(scope.ProductsbyRT[i].amt,2),
                        "amt1":0.00,
                        "name": scope.itemnumber,
                         "unitSoldbyRp":$filter('number')(scope.ProductsbyRT[i].soldQuantity,2),
                         "unitSoldbyCp": 0
                      }
                      scope.linechartData.push(linechartdataobject);
                }
              }
               }
                scope.chartdata=scope.linechartData;
                  $rootScope.$emit('chartdata', scope.chartdata);
                for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata.date3=scope.chartdata[i].date;
             }

             $timeout(function () {
               initLineChart();
             }, 0);

                scope.ShoppingTripsforDistributor(scope.itemnumber);
                scope.avgBasketforDistributor(scope.itemnumber);

                   }, function (response) {
                        console.log(response);
                    }
                  );
                }
                        var data1 = {
                          "aggTimeUnit": "1d",
                          "startTime": inputData.compareStartDate,
                          "endTime": inputData.compareEndDate,
                          "filters": {
                            "item.upc": scope.itemnumber
                           
                          }
                        }

            productService.GetSalesPerformanceByAllRetailerswithoutsize(data1).then(function (response) {
              scope.ProductsbyCT = response.data.data;
              if(response.data){
              scope.unitsoldbycp=response.data.totalSoldQty
              }
              scope.spIndextotal = parseFloat(response.data.total);
              scope.getproductforRTfordistributor();
                }, function (response) {
                  console.log(response);
                }
                );
                }







         var destroyFoo;

      destroyFoo= $rootScope.$on('LinechartEvent', function (event, data) {


              scope.reportStartDate=data.reportStartDate
              scope.reportEndDate=data.reportEndDate
              scope.compareStartDate=data.compareStartDate
              scope.compareEndDate=data.compareEndDate
              scope.salesdataapireporttime=data.salesDatastartdate;
              scope.salesdataapicomparetime=data.salesDataenddate;


            scope.role=sessionStorage.role;
         scope.mfgId=sessionStorage.mfgId;
         if(scope.role=="retailer"){
           if(data.method=="allstores"){

         scope.selectedItemsDataAraayforbarchart=[];
         scope.getproductforAllstores(data);

       }
       else{
            scope.selectedItemsDataAraayforbarchart=[];
            scope.getproductBasedonstoreid(data);
       }
         }
         else if(scope.role=="cpg"){

          //console.log("coming into cpg...",data);

     if(data.method=="allretailer"){


      scope.allRetailers=productService.getallRetailers();
      scope.selectedItemsDataAraayforbarchart=[];
      scope.getproductBySelectedItemforcpg(data);

}
else if(data.method=="retailer"){
  scope.rid=sessionStorage.user;
scope.selectedItemsDataAraayforbarchart=[];
         scope.getproductforAllstoresforcpgbyretailer(data);

}
else if (data.method=="store"){
  scope.selectedItemsDataAraayforbarchart=[];
  scope.storeID=data.storeid;
            scope.getproductBasedonstoreid(data);
          }

    else if(data.method=="dma"){
      scope.selectedItemsDataAraayforbarchart=[];

      scope.dmaStoreList=data.storeid;
      scope.getproductBySelectedItemforDMA(data);
     }
    }
  
    else if(scope.role=="distributor"){
            scope.selectedItemsDataAraayforbarchart=[];
           scope.getproductBySelectedItemfordistributor(data);

         }
      });

      scope.$on('$destroy', function() {
            destroyFoo();
          });
        }
      }
    }])
