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


angular.module('Retails.couponbasketchart', [])

.directive('couponbasketchart', ['$compile','$timeout','$rootScope','productService','dashBoardService',
    function ($compile,$timeout,$rootScope,productService,dashBoardService) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
         id:'=',
          retailers: '=',
          reportstarttime:'=',
          reportendtime:'=',
          comparestarttime:'=',
          compareendtime:'=',
          product:'=',
          retailerid:'='
         
        },
        templateUrl: 'modules/componets/views/couponbasketsharechart-template.html',
        link: function (scope, element, attrs) {
          scope.chartid = scope.id;
          //scope.chartdata = scope.data;

          console.log("coming....");


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
              "startEffect":"easeOutSine",
            "categoryAxis": {
                  "inside": true,
                   "gridPosition": "start",
                   "gridAlpha": 0,
                   "axisAlpha": 0,
                   "tickPosition": "start",
                   "tickLength": 0,
                  "position": "left"
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
          };

         //api calls for sales

        
        scope.avgBasketFunction = function () {
       scope.avgBasketByRT = function () {
    var ShoppingTripsdata = {
      "aggTimeUnit": "1d",
           "startTime":scope.reportstarttime,
            "endTime":scope.reportendtime,
           "filters": {
            "item.upc" :scope.product[0].upc,
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
        }
        else{
           scope.ABtotal = 0.00;
        }
        if(scope.ABtotal>=1){
          scope.labelcolor="green";
          scope.arrow="\u2191";
        }
        else{
          scope.labelcolor="red";
          scope.arrow="\u2193";
        }

            if(scope.avgBasketTotalByRT&&scope.avgBasketTotalByCP){
          var basketshareobject={
            "name":scope.product[0].name,
            "income":scope.avgBasketTotalByRT.toFixed(2),
            "expenses":scope.avgBasketTotalByCP.toFixed(2),
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":scope.ABtotal,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
          }
          scope.basketSharedata.push(basketshareobject);
       }
       else if(scope.avgBasketTotalByRT){
        var basketshareobject={
            "name":scope.product[0].name,
            "income":scope.avgBasketTotalByRT.toFixed(2),
            "expenses":0.00,
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":scope.ABtotal,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
          }
          scope.basketSharedata.push(basketshareobject);
       }
       else if(scope.avgBasketTotalByCP){
          var basketshareobject={
            "name":scope.product[0].name,
            "income":0.00,
            "expenses":scope.avgBasketTotalByCP.toFixed(2),
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":scope.ABtotal,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
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
            "item.upc" :scope.product[0].upc
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
          scope.avgBasketByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": scope.reportstarttime,
              "endTime": scope.reportendtime,
               "rid" :scope.retailers,
              "filters": {
            "upcs" : scope.product[0].upc
        }
      }
        scope.basketSharedata=[];

    dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {

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
        }
        else{
           scope.ABtotal = 0.00;
        }

        if(scope.ABtotal>=1){
        scope.labelcolor="green";
        scope.arrow="\u2191";
        }
        else{
        scope.labelcolor="red";
        scope.arrow="\u2193";
        }

          if(scope.avgBasketTotalByRT&&scope.avgBasketTotalByCP){
          var basketshareobject={
            "name":scope.product[0].name,
            "income":scope.avgBasketTotalByRT.toFixed(2),
            "expenses":scope.avgBasketTotalByCP.toFixed(2),
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":scope.ABtotal,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
          }
          scope.basketSharedata.push(basketshareobject);
       }
       else if(scope.avgBasketTotalByRT){
        var basketshareobject={
            "name":scope.product[0].name,
            "income":scope.avgBasketTotalByRT.toFixed(2),
            "expenses":0.00,
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":scope.ABtotal,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
          }
          scope.basketSharedata.push(basketshareobject);
       }
       else if(scope.avgBasketTotalByCP){
          var basketshareobject={
            "name":scope.product[0].name,
            "income":0.00,
            "expenses":scope.avgBasketTotalByCP.toFixed(2),
            "color": "#4C98CF",
            "color1": "#7F2891",
            "index":scope.ABtotal,
            "labelcolor":scope.labelcolor,
            "arrow":scope.arrow,
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
              scope.chartdata=[];
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": scope.comparestarttime,
            "endTime": scope.compareendtime,
            "rid" :scope.retailers,
            "filters": {
            "upcs" : scope.product[0].upc
         }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
          scope.avgBasketTotalByCP = parseFloat(response.data.total);
          scope.avgBasketByRT();
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
         else{
          scope.name="Avg Basket";
          scope.mfgId=sessionStorage.mfgId;
          scope.ShareOfBasketByAllRetailer();
         }

        }//end link
      }
    }])
