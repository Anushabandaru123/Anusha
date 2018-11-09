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


angular.module('Retails.campiagnahoppingtripschart', [])

.directive('campiagnshoppingtripschart', ['$compile','$timeout','$rootScope','productService','dashBoardService',
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
        templateUrl: 'modules/componets/views/campiagnshoppingtripschart-templete.html',
        link: function (scope, element, attrs) {
         scope.chartid = scope.id;
          //scope.chartdata = scope.data;

          scope.chartid = scope.id;


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
       // window.location.href = event.serialDataItem.dataContext.url;
       console.log("item...",event.serialDataItem);

        var dataobject={
                  "productName":event.serialDataItem.category,
                  "deptId":event.serialDataItem.dataContext.deptId,
                  "itemnumber":event.serialDataItem.dataContext.upc,
                  "deptName":event.serialDataItem.dataContext.DeptName,
                  "category":event.serialDataItem.dataContext.category,
                  "manufacturer":event.serialDataItem.dataContext.manufacturer
                }

                console.log("obj...",dataobject);
            //console.log("item clicked...",dataobject);
      $rootScope.$emit('productselected', dataobject);
      }
    }]
              },
             //"marginLeft": 120,
            	"graphs": [
            		{
            			"balloonText":scope.name+": "+"[[value]]",
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
            			"balloonText":scope.name+": "+"[[value]]",
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
                  "maximum":dashBoardService.getcampaignshoppingtripsmaxvalue()*1.2,
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
                //console.log("obj...",dataobject);
            //console.log("item clicked...",dataobject);
      $rootScope.$emit('productselected', dataobject);
          }
          };

         //api calls for sales

         scope.ShoppingTripsFunction = function () {
      scope.ShoppingTripsbyRT = function () {
        var ShoppingTripsdata = {
          "aggTimeUnit": "1d",
          "startTime":scope.reportstarttime,
          "endTime":scope.reportendtime,
          "filters": {
          "terms" : {
          "item.upc" : scope.product.upc,
          "storeId" : scope.stores
          }
          }
          }
      
       dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
         scope.departmentshareData=[];

         if(response.data&&response.data.total>0){
            scope.ShoppingTripsTotalbyRT = response.data.total;
            scope.ShoppingTripsRTindex = parseFloat(response.data.total);
         if(scope.ShoppingTripsCPindex==0||scope.ShoppingTripsCPindex==null||isNaN(scope.ShoppingTripsCPindex)) {
            scope.STIndex = 0;
         }
        else {
            scope.STIndex = scope.ShoppingTripsTotalbyRT/scope.ShoppingTripsCPindex;
            scope.STIndex = scope.STIndex.toFixed(2);
        }
       if(scope.STIndex>=1){
            scope.labelcolor="green";
            scope.arrow="\u2191";
        }
      else{
          scope.labelcolor="red";
          scope.arrow="\u2193";
       }
    if(scope.ShoppingTripsRTindex!="NaN"&&scope.ShoppingTripsCPindex!="NaN"){

                var departmentshareobject={
                  "name":scope.product.productName,
                  "income":scope.ShoppingTripsRTindex.toFixed(2),
                  "expenses":scope.ShoppingTripsCPindex.toFixed(2),
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "index":scope.STIndex,
                  "labelcolor":scope.labelcolor,
                   "arrow":scope.arrow,
                   "upc":scope.product.upc
                }
                scope.departmentshareData.push(departmentshareobject);
              }
              scope.ShoppingTrips = true;
         }
         else{
            scope.labelcolor="red";
            scope.arrow="\u2193";
           var departmentshareobject={
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
                scope.departmentshareData.push(departmentshareobject);
         }
         scope.chartdata = scope.departmentshareData;
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
             scope.maximumValue=dashBoardService.getcampaignshoppingtripsmaxvalue();
            if(scope.maximumValue!=null&&scope.maximumValue!='null'){
            if(scope.maxvalue>scope.maximumValue){
              dashBoardService.setcampaignshoppingtripsmaxvalue(scope.maxvalue);
            }
            }
            else{
              dashBoardService.setcampaignshoppingtripsmaxvalue(scope.maxvalue);
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
              "terms" : {
            "item.upc" :scope.product.upc,
            "storeId" :scope.stores
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



    scope.shareOfCategoryByAllRetailers= function () {

     sessionStorage.user=scope.retailerid;

    scope.shareOfCategoryByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": scope.reportstarttime,
              "endTime": scope.reportendtime,
              "filters": {
              "terms" : {
              "item.upc" : scope.product.upc,
               "storeId" : scope.stores
              }
              }
              }
             
        dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
         scope.departmentshareData=[];
         if(response.data&&response.data.total>0){
          scope.ShoppingTripsTotalbyRT = response.data.total;
          scope.ShoppingTripsRTindex = parseFloat(response.data.total);
      if (scope.ShoppingTripsCPindex==0||scope.ShoppingTripsCPindex==null||isNaN(scope.ShoppingTripsCPindex)) {
          scope.STIndex = 0;
      }
      else {
          scope.STIndex = scope.ShoppingTripsTotalbyRT/scope.ShoppingTripsCPindex;
          scope.STIndex = scope.STIndex.toFixed(2);
      }
      if(scope.STIndex>=1){
          scope.labelcolor="green";
          scope.arrow="\u2191";
      }
      else{
          scope.labelcolor="red";
          scope.arrow="\u2193";
      }

    if(scope.ShoppingTripsRTindex!="NaN"&&scope.ShoppingTripsCPindex!="NaN"){

                var departmentshareobject={
                  "name":scope.product.productName,
                  "income":scope.ShoppingTripsRTindex.toFixed(2),
                  "expenses":scope.ShoppingTripsCPindex.toFixed(2),
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "index":scope.STIndex,
                  "labelcolor":scope.labelcolor,
                  "arrow":scope.arrow,
                  "upc":scope.product.upc
                }
                scope.departmentshareData.push(departmentshareobject);
              }
              scope.ShoppingTrips = true;
         }
         else{
           var departmentshareobject={
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
                scope.departmentshareData.push(departmentshareobject);
         }
          scope.chartdata = scope.departmentshareData;
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
             scope.maximumValue=dashBoardService.getcampaignshoppingtripsmaxvalue();
              if(scope.maximumValue!=null&&scope.maximumValue!='null'){
              if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setcampaignshoppingtripsmaxvalue(scope.maxvalue);
              }
              }
              else{
               dashBoardService.setcampaignshoppingtripsmaxvalue(scope.maxvalue);
              }
             //console.log("max value...",dashBoardService.getcampaignsalesmaxvalue());
            // console.log("chart data...",scope.chartdata);
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
            "terms" : {
            "item.upc" : scope.product.upc,
               "storeId" : scope.stores
            }
          }
          }
          dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
           scope.ShoppingTripsCPindex = parseFloat(response.data.total);
          scope.shareOfCategoryByRT();
          }, function (response) {
            console.log(response);
          }
          );
        }



        scope.shareOfCategoryByDistributor= function () {

     sessionStorage.user=scope.retailerid;

    scope.shareOfCategoryByRTforDistributor = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": scope.reportstarttime,
              "endTime": scope.reportendtime,
              "filters": {
              "terms" : {
              "item.upc" : scope.product.upc,
               "storeId" : scope.stores
              }
              }
              }
             
        dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
         scope.departmentshareData=[];
         if(response.data&&response.data.total>0){
          scope.ShoppingTripsTotalbyRT = response.data.total;
          scope.ShoppingTripsRTindex = parseFloat(response.data.total);
      if (scope.ShoppingTripsCPindex==0||scope.ShoppingTripsCPindex==null||isNaN(scope.ShoppingTripsCPindex)) {
          scope.STIndex = 0;
      }
      else {
          scope.STIndex = scope.ShoppingTripsTotalbyRT/scope.ShoppingTripsCPindex;
          scope.STIndex = scope.STIndex.toFixed(2);
      }
      if(scope.STIndex>=1){
          scope.labelcolor="green";
          scope.arrow="\u2191";
      }
      else{
          scope.labelcolor="red";
          scope.arrow="\u2193";
      }

    if(scope.ShoppingTripsRTindex!="NaN"&&scope.ShoppingTripsCPindex!="NaN"){

                var departmentshareobject={
                  "name":scope.product.productName,
                  "income":scope.ShoppingTripsRTindex.toFixed(2),
                  "expenses":scope.ShoppingTripsCPindex.toFixed(2),
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "index":scope.STIndex,
                  "labelcolor":scope.labelcolor,
                  "arrow":scope.arrow,
                  "upc":scope.product.upc
                }
                scope.departmentshareData.push(departmentshareobject);
              }
              scope.ShoppingTrips = true;
         }
         else{
           var departmentshareobject={
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
                scope.departmentshareData.push(departmentshareobject);
         }
          scope.chartdata = scope.departmentshareData;
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
             scope.maximumValue=dashBoardService.getcampaignshoppingtripsmaxvalue();
              if(scope.maximumValue!=null&&scope.maximumValue!='null'){
              if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setcampaignshoppingtripsmaxvalue(scope.maxvalue);
              }
              }
              else{
               dashBoardService.setcampaignshoppingtripsmaxvalue(scope.maxvalue);
              }
             //console.log("max value...",dashBoardService.getcampaignsalesmaxvalue());
            // console.log("chart data...",scope.chartdata);
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
            "terms" : {
            "item.upc" : scope.product.upc,
               "storeId" : scope.stores
            }
          }
          }
          dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
           scope.ShoppingTripsCPindex = parseFloat(response.data.total);
          scope.shareOfCategoryByRTforDistributor();
          }, function (response) {
            console.log(response);
          }
          );
        }





         scope.role=sessionStorage.role;
         if(scope.role=="retailer"){
          scope.name="Shopping Trips";
          scope.ShoppingTripsFunction();
         }
         else if(scope.role=="cpg"){
          scope.name="Shopping Trips";
          scope.mfgId=sessionStorage.mfgId;
          scope.shareOfCategoryByAllRetailers();
         }
         else{
           scope.name="Shopping Trips";
           scope.shareOfCategoryByDistributor();
         }
      var shoppingtrips;
     shoppingtrips=$rootScope.$on('shoppingtripsevent',function(event,data){
     scope.stores=[];
     for(var i=0;i<data.length;i++){
     scope.stores.push(data[i]);
     }
     if(scope.role=="retailer"){
      scope.name="Shopping Trips";
      scope.ShoppingTripsFunction();
    }
    else if($scope.role=="cpg"){
      scope.name="Shopping Trips";
      scope.mfgId=sessionStorage.mfgId;
      scope.shareOfCategoryByAllRetailers();
         }
         else{
           scope.name="Shopping Trips";
            scope.shareOfCategoryByDistributor();
         }

     });

        }//end link
      }
    }])
