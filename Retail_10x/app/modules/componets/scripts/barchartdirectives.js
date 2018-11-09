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




angular.module('Retails.barchartDirective', [])

  .directive('productchartbar', ['$compile', '$window', '$timeout','$rootScope','productService','dashBoardService','$filter',
    function ($compile, $window, $timeout,$rootScope,productService,dashBoardService,$filter) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '=',
          itemnumber:'='
        },
        templateUrl: 'modules/componets/views/barcharttemplate.html',

        link: function (scope, element, attrs) {
          scope.updatechart=true;
          scope.chartid = scope.id;
          scope.chartdata = scope.data;
          scope.itemnumber=scope.itemnumber;
          scope.mfgId=sessionStorage.mfgId;
         // console.log("chart data...",scope.chartdata);
      scope.totalreporttime=scope.chartdata[0].reporttime;
      scope.totalcomparetime=scope.chartdata[0].comapretime;




          var chart = false;

          var initChart = function () {
            if (chart) chart.destroy();
            var config = scope.config || {};
            chart = AmCharts.makeChart(scope.id, {
              "type": "serial",
              "theme": "light",
              "categoryField": "storename",
              "rotate": true,
              "startDuration": 1,
               "columnWidth": 0.75,
              "startEffect":"easeOutSine",
              "categoryAxis": {
                "gridPosition": "start",
                "position": "left",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "labelsEnabled": false
              },
              "trendLines": [],
              "graphs": [
                {
                  "balloonText": "Sales Amt: $[[value]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "Income",
                  "type": "column",
                  "valueField": "income",
                  "labelText": "$[[value]]",
                  "labelPosition": "right",
                  "showHandOnHover":true,
                  "fixedColumnWidth": 15
                },
                {
                  "balloonText": "Sales Amt: $[[value]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "Expenses",
                  "type": "column",
                  "valueField": "expenses",
                  "labelText": "$[[value]]",
                  "labelPosition": "right",
                  "showHandOnHover":true,
                  "fixedColumnWidth": 15
                }
              ]


              ,
              "guides": [],
              "valueAxes": [
                {
                  "id": "ValueAxis-1",
                  "position": "top",
                  "axisAlpha": 0,
                  "gridAlpha": 0,
                  "labelsEnabled": false,
                   "maximum":dashBoardService.getmaxvalue()*1.7,
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
                "enabled": true,
                 "fileName":"Products",
                "exportFields": [
            "productName",
            "name",
          "amtnumber",
          "amtnumber1",
           "unitSoldbyRp",
          "unitSoldbyCp"
          ],
          "columnNames": {
    "productName": "Product Name",
    "name": "Upc",
    "amtnumber": "Sales Amount from "+scope.totalreporttime,
    "amtnumber1": "Sales Amount from "+scope.totalcomparetime,
    "unitSoldbyRp":"Report Time Units Sold",
    "unitSoldbyCp":"Compare Time Units Sold"
  },
      "menu": [ {
      "class": "export-main",
      "menu": [ {
        "label": "Download As",
         
        "menu": [ "XLSX"]
      }]
    } ]
              },

               "responsive": {
               "enabled": false,
               "rules": [
                  {
                    //"Width": 100,
                    "overrides": {
                      //"marginRight": 65,
                    }
                  }
                ]
               }
            });
          };

          scope.myupdateDoneListener =$rootScope.$on('updatebarchart', function (event, data) {

             $timeout(function() {
             initChart();

             }, 0);
            

     });

              scope.comapretimearray=[];
              scope.reporttimearray=[];

             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[i].income));
              scope.reporttimearray.push(parseFloat(scope.chartdata[i].expenses));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }
             else{
              scope.maxvalue=scope.reporttimemax;
             }
             scope.maximumValue=dashBoardService.getmaxvalue();
              if(scope.maximumValue!=null&&scope.maximumValue!='null'){
              if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setmaxvalue(scope.maxvalue);
              }
              }
            else{
               dashBoardService.setmaxvalue(scope.maxvalue);
                 }
                 //console.log("maximum value...",dashBoardService.getmaxvalue());
         for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);
                scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
              }
                
               $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){
             $rootScope.$emit('updatebarchart', {});
            }
          }, 0);


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
        "filters": {
            "item.upc" : [upc]
        }
        }
        dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
          scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
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
        "filters": {
            "item.upc" : [upc]
        }
        }
        dashBoardService.GetAvgBasketByStoreId(ShoppingTripsdata).then(function (response) {
          scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
          scope.avgBasketByRT();

        }, function (response) {
          console.log(response);
        }
        );
    }




  scope.avgBasketforDistributor = function (upc) {
  scope.avgBasketforDistributorByRT = function () {
    var ShoppingTripsdataRT = {
          "aggTimeUnit": "1d",
           "startTime": scope.reportStartDate,
            "endTime": scope.reportEndDate,
           "filters": {
            "item.upc" : [upc]
        }

       }

       productService.getAvgBasketforDistributor(ShoppingTripsdataRT).then(function (response) {

        scope.avgBasketTotal = response.data.stats.avg;

          scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);

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
        "filters": {
            "item.upc" : [upc]
        }
        }
        productService.getAvgBasketforDistributor(ShoppingTripsdata).then(function (response) {
          scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
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
          "filters": {
          "terms" : {
          "item.upc" : [upc]
          }
        }
       }
       productService.getShoppingTripsforDistributor(ShoppingTripsdataRT).then(function (response) {
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
        productService.getShoppingTripsforDistributor(ShoppingTripsdata).then(function (response) {
          scope.ShoppingTripsCPindex = parseFloat(response.data.total);
          scope.ShoppingTripsforDistributorbyRT();
        }, function (response) {
          console.log(response);
        }
        );
    }



             scope.rid="000";

    scope.shareOfCategoryByAllRetailers= function (upc) {
          scope.shareOfCategoryByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": scope.reportStartDate,
              "endTime": scope.reportEndDate,
              "rid" : scope.rid,
              "filters":{
               "upcs": [upc]
               }
            }

      dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {

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
            "rid" : scope.rid,
             "filters":{
          "upcs": [upc]
            }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
         scope.avgBasketTotalByCP = parseFloat(response.data.total);
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
              "rid" : scope.rid,
              "filters": {
              "upcs" : [upc]
              }
              }

            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
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
            "rid" : scope.rid,
            "filters": {
            "upcs" : [upc]
        }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
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
              "rid" : scope.rid,
              "filters":{
               "upcs": [scope.itemnumber],
                "storeIds": scope.dmaStoreList
               }
               }

             
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {

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
          "rid" : scope.rid,
          "filters":{
          "upcs": [scope.itemnumber],
           "storeIds": scope.dmaStoreList
            }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
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
              "rid" : scope.rid,
              "filters": {
              "upcs" : [upc],
              "storeId": scope.dmaStoreList
             }
            }

            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
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
            "rid" : scope.rid,
            "filters": {
            "upcs" : [upc],
            "storeId": scope.dmaStoreList
          }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
          scope.ShoppingTripsCPindex = parseFloat(response.data.total);
            scope.avgBasketByRTforDMA();
          }, function (response) {
            console.log(response);
          }
          );
        }


             scope.selectedItemsDataAraayforbarchart=[];
          scope.getproductBasedonstoreid =function (inputData) {
          scope.getproductforRT = function () {

                var data = {
                  "aggTimeUnit": "1d",
                  "startTime": scope.salesdataapireporttime,
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

         $rootScope.$emit('spindexbarchart', indexobject);

                scope.barchartData=[];

                var barchartDataObject={
                  "name":scope.itemnumber,
                  "income": scope.rpIndextotal,
                  "expenses": scope.spIndextotal,
                  "color": "#ba5bbb",
                  "color1": "#428DB6",
                  "unitSoldbyRp":$filter('number')(scope.totalunitsold,2),
                  "unitSoldbyCp": $filter('number')(scope.unitsoldbycp,2)
                     
                }


                scope.selectedItemsDataAraayforbarchart.push(barchartDataObject);
                scope.chartdata=scope.selectedItemsDataAraayforbarchart;

                   scope.avgBasketFunctionbystore(scope.itemnumber);
                   scope.ShoppingTripsFunctionbystore(scope.itemnumber);

                    scope.comapretimearray=[];
              scope.reporttimearray=[];


             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].income));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].expenses));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }

             else{
              scope.maxvalue=scope.reporttimemax;

             }


             scope.maximumValue=dashBoardService.getmaxvalue();

                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){

                   if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setmaxvalue(scope.maxvalue);
                   }

                 }
                 else{
                
               dashBoardService.setmaxvalue(scope.maxvalue);

                 }

                  for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);
                scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
              }

                    $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){
              
             $rootScope.$emit('updatebarchart', {});
            }
          }, 0);

                  }, function (response) {
                    console.log(response);
                  }
                );

              }

              var data1 = {
                "aggTimeUnit": "1d",
                "startTime": scope.salesdataapicomparetime,
                "endTime": inputData.compareEndDate,
                "filters": {
                  "item.upc": scope.itemnumber
                }
              }

              productService.GetSalesPerformanceByStoreId(data1).then(function (response) {

                  scope.ProductsbyCT = response.data.data;
                scope.spIndextotal = parseFloat(response.data.total);
                if(response.data){
              scope.unitsoldbycp=response.data.totalSoldQty;
                    }
                  scope.getproductforRT();

                }, function (response) {
                  console.log(response);
                }
              );
          }

          scope.getproductforAllstores =function (inputData) {

              scope.getproductforRT = function () {

                var data = {
                  "aggTimeUnit": "1d",
                  "startTime": scope.salesdataapireporttime,
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

         $rootScope.$emit('spindexbarchart', indexobject);

                scope.barchartData=[];

                var barchartDataObject={
                  "name":scope.itemnumber,
                  "income": scope.rpIndextotal,
                  "expenses": scope.spIndextotal,
                  "color": "#ba5bbb",
                  "color1": "#428DB6",
                  "unitSoldbyRp":$filter('number')(scope.totalunitsold,2),
                  "unitSoldbyCp": $filter('number')(scope.unitsoldbycp,2)
                }

                scope.avgBasketFunction(scope.itemnumber);
                scope.ShoppingTripsFunction(scope.itemnumber);

                scope.selectedItemsDataAraayforbarchart.push(barchartDataObject);
                scope.chartdata=scope.selectedItemsDataAraayforbarchart;

 scope.comapretimearray=[];
              scope.reporttimearray=[];

             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].income));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].expenses));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }

             else{
              scope.maxvalue=scope.reporttimemax;

             }

             scope.maximumValue=dashBoardService.getmaxvalue();

                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){

                   if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setmaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setmaxvalue(scope.maxvalue);
                 }

                  for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);
                scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
              }

               $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){
              
             $rootScope.$emit('updatebarchart', {});
            }
          }, 0);
                  }, function (response) {
                    console.log(response);
                  }
                );

              }

              var data1 = {
                "aggTimeUnit": "1d",
                "startTime": scope.salesdataapicomparetime,
                "endTime": inputData.compareEndDate,
                "filters": {
                  "item.upc": scope.itemnumber
                }
              }

              productService.GetSalesPerformance(data1).then(function (response) {

                  scope.ProductsbyCT = response.data.data;
                scope.spIndextotal = parseFloat(response.data.total);

                  scope.getproductforRT();
                  if(response.data){
                              scope.unitsoldbycp=response.data.totalSoldQty
                            }

                }, function (response) {
                  console.log(response);
                }
              );
          }


          scope.getproductforAllstoresforcpgbyretailer =function (inputData) {

              scope.getproductforRT = function () {

                var data = {
                  "aggTimeUnit": "1d",
                  "startTime": scope.salesdataapireporttime,
                  "endTime": inputData.reportEndDate,
                  "filters": {
                    "item.upc": scope.itemnumber
                    // "items.mfgId" : [scope.mfgId]
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

         $rootScope.$emit('spindexbarchart', indexobject);

                scope.barchartData=[];

                var barchartDataObject={
                  "name":scope.itemnumber,
                  "income": scope.rpIndextotal,
                  "expenses": scope.spIndextotal,
                  "color": "#ba5bbb",
                  "color1": "#428DB6",
                  "unitSoldbyRp":$filter('number')(scope.totalunitsold,2),
                  "unitSoldbyCp": $filter('number')(scope.unitsoldbycp,2)
                }

                 scope.shareOfCategoryByAllRetailers(scope.itemnumber);
                scope.ShareOfBasketByAllRetailer(scope.itemnumber);


                scope.selectedItemsDataAraayforbarchart.push(barchartDataObject);
                scope.chartdata=scope.selectedItemsDataAraayforbarchart;

 scope.comapretimearray=[];
              scope.reporttimearray=[];

             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].income));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].expenses));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }

             else{
              scope.maxvalue=scope.reporttimemax;

             }
             scope.maximumValue=dashBoardService.getmaxvalue();

                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){

                   if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setmaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setmaxvalue(scope.maxvalue);

                 }

                  for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);
                scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
              }

$timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){
              
             $rootScope.$emit('updatebarchart', {});
            }
          }, 0);

                  }, function (response) {
                    console.log(response);
                  }
                );

              }

              var data1 = {
                "aggTimeUnit": "1d",
                "startTime": scope.salesdataapicomparetime,
                "endTime": inputData.compareEndDate,
                "filters": {
                  "item.upc": scope.itemnumber
                   //"items.mfgId" : [scope.mfgId]
                }
              }

              productService.GetSalesPerformance(data1).then(function (response) {

                  scope.ProductsbyCT = response.data.data;
                scope.spIndextotal = parseFloat(response.data.total);

                  scope.getproductforRT();
                  if(response.data){
                              scope.unitsoldbycp=response.data.totalSoldQty
                            }

                }, function (response) {
                  console.log(response);
                }
              );
          }


    scope.getproductBySelectedItemforcpg = function (inputData) {
       scope.getproductforRTforcpg = function () {

         var data = {
                     "aggTimeUnit": "1d",
                   "startTime": scope.salesdataapireporttime,
                  "endTime": inputData.reportEndDate,
                     "filters":{
                     "item.upc": scope.itemnumber
                     //"items.mfgId" : [scope.mfgId]
                     }
                    }

        productService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
                scope.ProductsbyRT = response.data.data;
                scope.rpIndextotal = parseFloat(response.data.total);

                scope.totalunitsold=response.data.totalSoldQty;

                if(scope.spIndextotal ==0||scope.spIndextotal==null) {
                  scope.spIndex = 0;
                }
                else {
                  scope.spIndex = scope.rpIndextotal/scope.spIndextotal;
                  scope.spIndex = scope.spIndex.toFixed(2);
                }

                
                var indexobject={
          "upc":scope.itemnumber,
          "spindex":scope.spIndex,
          "total":scope.rpIndextotal,
           "unitsold":scope.totalunitsold
         }

         $rootScope.$emit('spindexbarchart', indexobject);

                scope.barchartData=[];

                var barchartDataObject={
                  "name":scope.itemnumber,
                  "income": scope.rpIndextotal,
                  "expenses": scope.spIndextotal,
                  "color": "#ba5bbb",
                  "color1": "#428DB6",
                  "unitSoldbyRp":$filter('number')(scope.totalunitsold,2),
                  "unitSoldbyCp": $filter('number')(scope.unitsoldbycp,2)
                }

                scope.selectedItemsDataAraayforbarchart.push(barchartDataObject);
                scope.chartdata=scope.selectedItemsDataAraayforbarchart;
              scope.comapretimearray=[];
              scope.reporttimearray=[];

             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].income));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].expenses));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);
             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }
             else{
              scope.maxvalue=scope.reporttimemax;
             }
             scope.maximumValue=dashBoardService.getmaxvalue();
                if(scope.maximumValue!=null&&scope.maximumValue!='null'){
                if(scope.maxvalue>scope.maximumValue){
                    dashBoardService.setmaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setmaxvalue(scope.maxvalue);
                 }
            for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);
                scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
              }

            $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){
              
             $rootScope.$emit('updatebarchart', {});
            }
          }, 0);

                scope.shareOfCategoryByAllRetailers(scope.itemnumber);
                scope.ShareOfBasketByAllRetailer(scope.itemnumber);

                   }, function (response) {
                        console.log(response);
                    }
                  );
                }

                        var data1 = {
                          "aggTimeUnit": "1d",
                         "startTime": scope.salesdataapicomparetime,
                            "endTime": inputData.compareEndDate,
                          "filters": {
                            "item.upc": scope.itemnumber
                            //"items.mfgId" : [scope.mfgId]
                          }
                        }

              productService.GetSalesPerformanceByAllRetailerswithoutsize(data1).then(function (response) {

                scope.ProductsbyCT = response.data.data;
                scope.spIndextotal = parseFloat(response.data.total);
                      if(response.data){
                              scope.unitsoldbycp=response.data.totalSoldQty
                            }
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
                     "startTime": scope.salesdataapireporttime,
                     "endTime": inputData.reportEndDate,
                     "filters":{
                     "item.upc": scope.itemnumber,
                     "items.mfgId" : [scope.mfgId],
                      "storeId": inputData.storeid
                     }
                    }

        productService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
                scope.ProductsbyRT = response.data.data;
                scope.rpIndextotal = parseFloat(response.data.total);

                scope.totalunitsold=response.data.totalSoldQty;

                if(scope.spIndextotal ==0||scope.spIndextotal==null) {
                  scope.spIndex = 0;
                }
                else {
                  scope.spIndex = scope.rpIndextotal/scope.spIndextotal;
                  scope.spIndex = scope.spIndex.toFixed(2);
                }

                
                var indexobject={
          "upc":scope.itemnumber,
          "spindex":scope.spIndex,
          "total":scope.rpIndextotal,
           "unitsold":scope.totalunitsold
         }

         $rootScope.$emit('spindexbarchart', indexobject);

                scope.barchartData=[];

                var barchartDataObject={
                  "name":scope.itemnumber,
                  "income": scope.rpIndextotal,
                  "expenses": scope.spIndextotal,
                  "color": "#ba5bbb",
                  "color1": "#428DB6",
                  "unitSoldbyRp":$filter('number')(scope.totalunitsold,2),
                  "unitSoldbyCp": $filter('number')(scope.unitsoldbycp,2)
                }

                scope.selectedItemsDataAraayforbarchart.push(barchartDataObject);
                scope.chartdata=scope.selectedItemsDataAraayforbarchart;
              scope.comapretimearray=[];
              scope.reporttimearray=[];

             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].income));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].expenses));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);
             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }
             else{
              scope.maxvalue=scope.reporttimemax;
             }
             scope.maximumValue=dashBoardService.getmaxvalue();
                if(scope.maximumValue!=null&&scope.maximumValue!='null'){
                if(scope.maxvalue>scope.maximumValue){
                    dashBoardService.setmaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setmaxvalue(scope.maxvalue);
                 }
            for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);
                scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
              }

            $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){
              
             $rootScope.$emit('updatebarchart', {});
            }
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
                         "startTime": scope.salesdataapicomparetime,
                          "endTime": inputData.compareEndDate,
                          "filters": {
                          "item.upc": scope.itemnumber,
                          "items.mfgId" : [scope.mfgId],
                           "storeId": inputData.storeid
                          }
                        }

              productService.GetSalesPerformanceByAllRetailerswithoutsize(data1).then(function (response) {

                scope.ProductsbyCT = response.data.data;
                scope.spIndextotal = parseFloat(response.data.total);
                if(response.data){
                      scope.unitsoldbycp=response.data.totalSoldQty
                }
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
                     "startTime": scope.salesdataapireporttime,
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

         $rootScope.$emit('spindexbarchart', indexobject);
                scope.barchartData=[];
                var barchartDataObject={
                  "name":scope.itemnumber,
                  "income": scope.rpIndextotal,
                  "expenses": scope.spIndextotal,
                  "color": "#ba5bbb",
                  "color1": "#428DB6",
                  "unitSoldbyRp":$filter('number')(scope.totalunitsold,2),
                  "unitSoldbyCp": $filter('number')(scope.unitsoldbycp,2)
                }

              scope.selectedItemsDataAraayforbarchart.push(barchartDataObject);
              scope.chartdata=scope.selectedItemsDataAraayforbarchart;
              scope.comapretimearray=[];
              scope.reporttimearray=[];

             for(var i=0;i<scope.chartdata.length;i++){
              scope.comapretimearray.push(parseFloat(scope.chartdata[0].income));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].expenses));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);
             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }
             else{
              scope.maxvalue=scope.reporttimemax;
             }
             scope.maximumValue=dashBoardService.getmaxvalue();
                if(scope.maximumValue!=null&&scope.maximumValue!='null'){
                if(scope.maxvalue>scope.maximumValue){
                    dashBoardService.setmaxvalue(scope.maxvalue);
                }
                 }
                 else{
               dashBoardService.setmaxvalue(scope.maxvalue);
                 }
            for(var i=0;i<scope.chartdata.length;i++){
                scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].income,2);
                scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
              }

            $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){
              
             $rootScope.$emit('updatebarchart', {});
            }
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
                         "startTime": scope.salesdataapicomparetime,
                            "endTime": inputData.compareEndDate,
                          "filters": {
                            "item.upc": scope.itemnumber
                            
                          }
                        }

              productService.GetSalesPerformanceByAllRetailerswithoutsize(data1).then(function (response) {

                scope.ProductsbyCT = response.data.data;
                scope.spIndextotal = parseFloat(response.data.total);
                      if(response.data){
                              scope.unitsoldbycp=response.data.totalSoldQty
                            }
                            scope.getproductforRTfordistributor();
                          }, function (response) {
                            console.log(response);
                          }
                        );
                      }






             var destroyFoo;

         destroyFoo=   $rootScope.$on('myCustomEvent', function (event, data) {

              dashBoardService.setmaxvalue(0);
              scope.reportStartDate=data.reportStartDate
              scope.reportEndDate=data.reportEndDate
              scope.compareStartDate=data.compareStartDate
              scope.compareEndDate=data.compareEndDate
              scope.salesdataapireporttime=data.salesDatastartdate;
              scope.salesdataapicomparetime=data.salesDataenddate;

    scope.totalreporttime=moment(scope.reportStartDate).format('MMM Do YYYY')+"-"+moment(scope.reportEndDate).format('MMM Do YYYY');
    scope.totalcomparetime=moment(scope.compareStartDate).format('MMM Do YYYY')+"-"+moment(scope.compareEndDate).format('MMM Do YYYY');

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
      if(data.method=="allretailer"){
      scope.selectedItemsDataAraayforbarchart=[];
      scope.getproductBySelectedItemforcpg(data);
       }
      else if(data.method=="retailer"){
          scope.selectedItemsDataAraayforbarchart=[];
          scope.rid=sessionStorage.user;
          scope.getproductforAllstoresforcpgbyretailer(data);
         }
      else if (data.method=="store"){
          scope.selectedItemsDataAraayforbarchart=[];
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
           scope.getproductBySelectedItemfordistributor (data);

         }

         });

         scope.$on('$destroy', function() {
                destroyFoo();
                scope.myupdateDoneListener();
              });
           }//end watch

      }
    }])
