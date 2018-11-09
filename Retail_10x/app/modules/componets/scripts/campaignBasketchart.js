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


angular.module('Retails.campiagnbasketchart', [])

.directive('campiagnbasketchart', ['$compile','$timeout','$rootScope','productService','dashBoardService',
    function ($compile,$timeout,$rootScope,productService,dashBoardService) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
         id:'=',
          stores: '=',
          reportstarttime:'=',
          reportendtime:'=',
          comparestarttime:'=',
          compareendtime:'=',
          product:'=',
          retailerid:'='
         
        },
        templateUrl: 'modules/componets/views/campiagnbasketsharechart-templete.html',
        link: function (scope, element, attrs) {
          scope.chartid = scope.id;
          //scope.chartdata = scope.data;

          var chart = false;
          var initChart = function () {
            if (chart) chart.destroy();
            var config = scope.config || {};
            chart = AmCharts.makeChart(scope.chartid, {
            	"type": "serial",
              "theme": "light",
            	"categoryField": "name",
            	"rotate": true,
            	"startDuration": 1,
              "columnWidth": 0.75, 
              "addClassNames": true,
              "startEffect":"easeOutSine",
              "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": false
  },
            "categoryAxis": {
                  "inside": true,
                   "gridPosition": "start",
                   "gridAlpha": 0,
                   "axisAlpha": 0,
                   "tickPosition": "start",
                   "tickLength": 0,
                  "position": "left",
                   "listeners": [{
      "event": "clickItem",
      "method": function(event) {
        var dataobject={
                  "productName":event.serialDataItem.category,
                  "deptId":event.serialDataItem.dataContext.deptId,
                  "itemnumber":event.serialDataItem.dataContext.upc,
                  "deptName":event.serialDataItem.dataContext.DeptName,
                  "category":event.serialDataItem.dataContext.category,
                  "manufacturer":event.serialDataItem.dataContext.manufacturer
                }
      $rootScope.$emit('productselected', dataobject);
      }
    }]
              },
             //"marginLeft": 120,
            	"graphs": [
            		{
            			"balloonText":scope.name+": $"+"[[value]]",
                  "fillColorsField": "color1",
            			"fillAlphas": 1,
            			"lineAlpha": 0,
            			"title": "Income",
            			"type": "column",
            			"valueField": "income",
                  "showHandOnHover":true,
                   "labelText": "[[index]][[arrow]]",
                  "labelPosition": "right",  
                  "labelColorField": "labelcolor",
                  "labelOffset": 70,
                   "labelsEnabled": true,
                  "fixedColumnWidth": 15
            		},
            		{
            			"balloonText":scope.name+": $"+"[[value]]",
                  "fillColorsField": "color",
            			"fillAlphas": 0.8,
            			"lineAlpha": 0,
            			"title": "Expenses",
            			"type": "column",
            			"valueField": "expenses",
                  "showHandOnHover":true,
                  "fixedColumnWidth": 15
            		}
            	],
            	"valueAxes": [
            		{
            			"id": "ValueAxis-1",
            			"position": "top",
                  "axisAlpha": 0,
                  "gridAlpha": 0,
                  "labelsEnabled": false,
                  "maximum":dashBoardService.getcampaignbasketsharemaxvalue()*1.2,
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
                	"enabled": false,
                  "rules": [
                  {
                    "Width": 100,
                    "overrides": {
                    //"marginRight": 35,
                    }
                  }
                ]
                 }
            });
             chart.addListener("clickGraphItem", handleClick);
            function handleClick(event){
                var dataobject={
                  "productName":event.item.category,
                  "deptId":event.item.dataContext.deptId,
                  "itemnumber":event.item.dataContext.upc,
                  "deptName":event.item.dataContext.DeptName,
                  "category":event.item.dataContext.category,
                  "manufacturer":event.item.dataContext.manufacturer
                }
      $rootScope.$emit('productselected', dataobject);
          }
          };
         //api calls for sales
        scope.avgBasketFunction = function () {
       scope.avgBasketByRT = function () {
    var ShoppingTripsdata = {
      "aggTimeUnit": "1d",
           "startTime":scope.reportstarttime,
            "endTime":scope.reportendtime,
           "filters": {
            "item.upc" :scope.product.upc,
            "storeId" :scope.stores
        }

       }
       scope.basketSharedata=[];
       dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
 if(response.data&&response.data.stats&&response.data.stats.avg){
        scope.avgBasketTotal = response.data.stats.avg;
         scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
      if(scope.avgBasketTotalByCP==0||scope.avgBasketTotalByCP==null||isNaN(scope.avgBasketTotalByCP)||isNaN(scope.avgBasketTotalByRT)) {
            scope.ABtotal = 0.00;
          }
          else {
            scope.ABtotal = scope.avgBasketTotalByRT/scope.avgBasketTotalByCP;
            scope.ABtotal = scope.ABtotal.toFixed(2);
          }

           if(scope.ABtotal>=1){
                    scope.labelcolor="green";
                    scope.arrow="\u2191";
                  }
                  else{
                    scope.labelcolor="red";
                    scope.arrow="\u2193";
                  }


          var basketshareobject={
            "name":scope.product.productName,
            "income":scope.avgBasketTotalByRT.toFixed(2),
            "expenses":scope.avgBasketTotalByCP.toFixed(2),
           "color": "#4C98CF",
            "color1": "#7F2891",
            "index":scope.ABtotal,
              "labelcolor":scope.labelcolor,
                   "arrow":scope.arrow,
                    "upc":scope.product.upc
          }
          scope.basketSharedata.push(basketshareobject);
       }
       else{

          scope.labelcolor="red";
          scope.arrow="\u2193";
           var basketshareobject={
            "name":scope.product.productName,
            "income":0.00,
            "expenses":0.00,
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":0.00,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
             "upc":scope.product.upc
          }
          scope.basketSharedata.push(basketshareobject);
       }
        scope.chartdata = scope.basketSharedata;
          scope.comapretimearray=[];
          scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
              scope.comapretimearray.push(parseFloat(scope.chartdata[i].expenses));
              scope.reporttimearray.push(parseFloat(scope.chartdata[i].income));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax*1.4;
             }
             else{
              scope.maxvalue=scope.reporttimemax*1.4;
             }
             scope.maximumValue=dashBoardService.getcampaignbasketsharemaxvalue();

            if(scope.maximumValue!=null&&scope.maximumValue!='null'){

            if(scope.maxvalue>scope.maximumValue){
             dashBoardService.setcampaignbasketsharemaxvalue(scope.maxvalue);
            }
            }
            else{
            dashBoardService.setcampaignbasketsharemaxvalue(scope.maxvalue);
            }
        $timeout(function () {
            initChart();
          }, 0);
      }, function (response) {
        console.log(response);
      }
      );
   }

   var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime":scope.comparestarttime,
            "endTime":scope.compareendtime,
            "filters": {
            "item.upc" :scope.product.upc,
            "storeId" : scope.stores
        }
        }
        dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
          scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
          scope.avgBasketByRT();

        }, function (response) {
          console.log(response);
          scope.avgBasketByRT();
        }
        );
    }

     scope.ShareOfBasketByAllRetailer = function () {
       sessionStorage.user=scope.retailerid;
          scope.avgBasketByRTforcpg = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": scope.reportstarttime,
              "endTime": scope.reportendtime,
              "filters": {
              "item.upc" :scope.product.upc,
              "storeId" :scope.stores
             }
             }
             scope.basketSharedata=[];
        dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
        if(response.data&&response.data.stats&&response.data.stats.avg){
        scope.avgBasketTotal = response.data.stats.avg;
         scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
        if(scope.avgBasketTotalByCP==0||scope.avgBasketTotalByCP==null||isNaN(scope.avgBasketTotalByCP)||isNaN(scope.avgBasketTotalByRT)) {
            scope.ABtotal = 0.00;
        }
        else {
            scope.ABtotal = scope.avgBasketTotalByRT/scope.avgBasketTotalByCP;
            scope.ABtotal = scope.ABtotal.toFixed(2);
        }
        if(scope.ABtotal>=1){
            scope.labelcolor="green";
            scope.arrow="\u2191";
        }
        else{
            scope.labelcolor="red";
            scope.arrow="\u2193";
        }

          var basketshareobject={
            "name":scope.product.productName,
            "income":scope.avgBasketTotalByRT.toFixed(2),
            "expenses":scope.avgBasketTotalByCP.toFixed(2),
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":scope.ABtotal,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
             "upc":scope.product.upc
          }
          scope.basketSharedata.push(basketshareobject);
         }
       else{
        scope.labelcolor="red";
        scope.arrow="\u2193";
           var basketshareobject={
            "name":scope.product.productName,
            "income":0.00,
            "expenses":0.00,
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":0.00,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
             "upc":scope.product.upc
          }
          scope.basketSharedata.push(basketshareobject);
       }
          scope.chartdata = scope.basketSharedata;
          scope.comapretimearray=[];
          scope.reporttimearray=[];
      for(var i=0;i<scope.chartdata.length;i++){
              scope.comapretimearray.push(parseFloat(scope.chartdata[i].expenses));
              scope.reporttimearray.push(parseFloat(scope.chartdata[i].income));
       }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax*1.4;
             }
             else{
              scope.maxvalue=scope.reporttimemax*1.4;
             }
             scope.maximumValue=dashBoardService.getcampaignbasketsharemaxvalue();
            if(scope.maximumValue!=null&&scope.maximumValue!='null'){
            if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setcampaignbasketsharemaxvalue(scope.maxvalue);
            }
            }
            else{
            dashBoardService.setcampaignbasketsharemaxvalue(scope.maxvalue);
            }
        $timeout(function () {
            initChart();
          }, 0);
       
            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": scope.comparestarttime,
            "endTime": scope.compareendtime,
            "filters": {
              "item.upc" :scope.product.upc,
              "storeId" :scope.stores
              }
              }
          dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
          scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
            scope.avgBasketByRTforcpg();
          }, function (response) {
            console.log(response);
          }
          );
        }

        scope.ShareOfBasketByDistributor = function () {
       sessionStorage.user=scope.retailerid;
          scope.avgBasketByRTfordistributor = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": scope.reportstarttime,
              "endTime": scope.reportendtime,
              "filters": {
              "item.upc" :scope.product.upc,
              "storeId" :scope.stores
             }
             }
             scope.basketSharedata=[];
        dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
        if(response.data&&response.data.stats&&response.data.stats.avg){
        scope.avgBasketTotal = response.data.stats.avg;
         scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
        if(scope.avgBasketTotalByCP==0||scope.avgBasketTotalByCP==null||isNaN(scope.avgBasketTotalByCP)||isNaN(scope.avgBasketTotalByRT)) {
            scope.ABtotal = 0.00;
        }
        else {
            scope.ABtotal = scope.avgBasketTotalByRT/scope.avgBasketTotalByCP;
            scope.ABtotal = scope.ABtotal.toFixed(2);
        }
        if(scope.ABtotal>=1){
            scope.labelcolor="green";
            scope.arrow="\u2191";
        }
        else{
            scope.labelcolor="red";
            scope.arrow="\u2193";
        }

          var basketshareobject={
            "name":scope.product.productName,
            "income":scope.avgBasketTotalByRT.toFixed(2),
            "expenses":scope.avgBasketTotalByCP.toFixed(2),
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":scope.ABtotal,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
             "upc":scope.product.upc
          }
          scope.basketSharedata.push(basketshareobject);
         }
       else{
        scope.labelcolor="red";
        scope.arrow="\u2193";
           var basketshareobject={
            "name":scope.product.productName,
            "income":0.00,
            "expenses":0.00,
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":0.00,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
             "upc":scope.product.upc
          }
          scope.basketSharedata.push(basketshareobject);
       }
          scope.chartdata = scope.basketSharedata;
          scope.comapretimearray=[];
          scope.reporttimearray=[];
      for(var i=0;i<scope.chartdata.length;i++){
              scope.comapretimearray.push(parseFloat(scope.chartdata[i].expenses));
              scope.reporttimearray.push(parseFloat(scope.chartdata[i].income));
       }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax*1.4;
             }
             else{
              scope.maxvalue=scope.reporttimemax*1.4;
             }
             scope.maximumValue=dashBoardService.getcampaignbasketsharemaxvalue();
            if(scope.maximumValue!=null&&scope.maximumValue!='null'){
            if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setcampaignbasketsharemaxvalue(scope.maxvalue);
            }
            }
            else{
            dashBoardService.setcampaignbasketsharemaxvalue(scope.maxvalue);
            }
        $timeout(function () {
            initChart();
          }, 0);
       
            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": scope.comparestarttime,
            "endTime": scope.compareendtime,
            "filters": {
              "item.upc" :scope.product.upc,
              "storeId" :scope.stores
              }
              }
          dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
          scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
            scope.avgBasketByRTfordistributor();
          }, function (response) {
            console.log(response);
          }
          );
        }

     scope.role=sessionStorage.role;
         if(scope.role=="retailer"){
           scope.name="Avg Basket";
         scope.avgBasketFunction();
         }
         else if(scope.role=="cpg"){
          scope.name="Avg Basket";
           scope.mfgId=sessionStorage.mfgId;
           scope.ShareOfBasketByAllRetailer();
         }
         else{
          scope.name="Avg Basket";
              scope.ShareOfBasketByDistributor();
         }
          var basketShare;
  basketShare=$rootScope.$on('basketshareevent',function(event,data){
      scope.stores=[];
       for(var i=0;i<data.length;i++){
        scope.stores.push(data[i]);
      }
      if(scope.role=="retailer"){
           scope.name="Avg Basket";
         scope.avgBasketFunction();

         }
         else if(scope.role=="cpg"){
           scope.name="Avg Basket";
           scope.mfgId=sessionStorage.mfgId;
           scope.ShareOfBasketByAllRetailer();
         }
         else{
          scope.name="Avg Basket";
          scope.ShareOfBasketByDistributor();
         }
     });
        }//end link
      }
    }])
