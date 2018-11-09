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


angular.module('Retails.couponsaleschart', [])

.directive('couponsaleschart', ['$compile','$timeout','$rootScope','productService','dashBoardService',
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
          product:'='
        },
        templateUrl: 'modules/componets/views/couponsaleschart-templete.html',
        link: function (scope, element, attrs) {
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
            	
            	"graphs": [
            		{
            			"balloonText":"Sales Amt: $"+"[[value]]",
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
            			"balloonText":"Sales Amt: $"+"[[value]]",
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
                  "maximum":dashBoardService.getcampaignsalesmaxvalue()*1.2,
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

        scope.salesDataforRetailer=function(){
        scope.ProductsBarchartforRepporttime=function(){

        var salesDataObject={
            "aggTimeUnit":"1d",
            "startTime":scope.reportstarttime,
            "endTime":scope.reportendtime,
            "filters": {
            "item.upc" :scope.product[0].upc,
            "retailerId" : scope.retailers
         }
         }

    scope.productChartData=[];
    scope.products=false;

    dashBoardService.GetSalesPerformance(salesDataObject).then(function (response) {


             //console.log("bar chart data...",response.data);
        if(response.data&&response.data.total>0){
    scope.ProducttotalbyRP=response.data.total;

      if (scope.ProducttotalbyCP==0||scope.ProducttotalbyCP==null||isNaN(scope.ProducttotalbyCP)) {
        scope.ProductIndex = 0;
      }
      else {
        scope.ProductIndex=scope.ProducttotalbyRP/scope.ProducttotalbyCP;
        scope.ProductIndex =scope.ProductIndex.toFixed(2);
      }
    }
    else{
      scope.ProductIndex = 0;
    }


        if(scope.ProductIndex>=1){
                    scope.labelcolor="green";
                    scope.arrow="\u2191";
                  }
                  else{
                    scope.labelcolor="red";
                    scope.arrow="\u2193";
                  }

                  if(response.data.total&&scope.ProducttotalbyCP){

      var productobject={
        "color": "#4C98CF",
        "color1": "#7F2891",
        "name":scope.product[0].name,
        "income":scope.ProducttotalbyRP,
        "expenses": scope.ProducttotalbyCP,
        "index":scope.ProductIndex,
        "labelcolor":scope.labelcolor,
        "arrow":scope.arrow,
        
      }
      scope.productChartData.push(productobject);
      
      scope.products=true;
        }
        else if(response.data.total){

            scope.labelcolor="red";
            scope.arrow="\u2193";

        var productobject={
        "color": "#4C98CF",
        "color1": "#7F2891",
        "name":scope.product[0].name,
        "income":response.data.total,
        "expenses": 0.00,
        "index":0.00,
        "labelcolor":scope.labelcolor,
        "arrow":scope.arrow,

        
      }
      scope.productChartData.push(productobject);
      

        }
        else if(scope.ProducttotalbyCP){

          scope.labelcolor="red";
          scope.arrow="\u2193";

        var productobject={
        "color": "#4C98CF",
        "color1": "#7F2891",
        "name":scope.product[0].name,
        "income":0.00,
        "expenses": scope.ProducttotalbyCP,
        "index":0.00,
        "labelcolor":scope.labelcolor,
        "arrow":scope.arrow,
        
      }
      scope.productChartData.push(productobject);

        }

        scope.chartdata = scope.productChartData;

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

             scope.maximumValue=dashBoardService.getcampaignsalesmaxvalue();

                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){

                   if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setcampaignsalesmaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setcampaignsalesmaxvalue(scope.maxvalue);

                 }

             //console.log("max value...",dashBoardService.getcampaignsalesmaxvalue());
            console.log("chart data...",scope.chartdata);

        $timeout(function () {
            initChart();
          }, 0);
    
       
      
    }, function (response) {
      console.log(response);
    }
    );
    }
       //for compare time
  var salesDataObject={
          "aggTimeUnit":"1d",
           "startTime":scope.comparestarttime,
            "endTime":scope.compareendtime,
            "filters": {
           "item.upc" : scope.product[0].upc,
            "retailerId" : scope.retailers
        }
    }

    dashBoardService.GetSalesPerformance(salesDataObject).then(function (response) {

      scope.ProducttotalbyCP=response.data.total;
      scope.ProductsBarchartforRepporttime();
    }, function (response) {
      console.log(response);
    }
    );

    }

         

         


scope.topProductsFunctionByAllRetailerforcpg = function () {
        
            scope.TopProductsbyReportTimeforcpg = function () {
              var data = {
                "aggTimeUnit": "1d",
                
                "startTime": scope.reportstarttime,
               "endTime": scope.reportendtime,
                "filters": {
                  "items.mfgId" : [scope.mfgId],
                 "retailerId" :scope.retailers,
           "item.upc" : scope.product[0].upc
                }
              }
             scope.productChartData=[];
    scope.products=false;            
      dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
             
           //console.log("bar chart data...",response.data);
        if(response.data&&response.data.total>0){
    scope.ProducttotalbyRP=response.data.total;

      if (scope.ProducttotalbyCP==0||scope.ProducttotalbyCP==null||isNaN(scope.ProducttotalbyCP)) {
        scope.ProductIndex = 0;
      }
      else {
        scope.ProductIndex=scope.ProducttotalbyRP/scope.ProducttotalbyCP;
        scope.ProductIndex =scope.ProductIndex.toFixed(2);
      }
    }
    else {
      scope.ProductIndex = 0;
    }

       if(scope.ProductIndex>=1){
                    scope.labelcolor="green";
                    scope.arrow="\u2191";
                  }
                  else{
                    scope.labelcolor="red";
                    scope.arrow="\u2193";
                  }

       if(scope.ProducttotalbyRP&&scope.ProducttotalbyCP){
      var productobject={
        "color": "#4C98CF",
        "color1": "#7F2891",
        "name":scope.product[0].name,
        "income":scope.ProducttotalbyRP,
        "expenses": scope.ProducttotalbyCP,
        "index":scope.ProductIndex,
        "labelcolor":scope.labelcolor,
        "arrow":scope.arrow,
        
      }
      scope.productChartData.push(productobject);
      
      scope.products=true;
        }
        else if(scope.ProducttotalbyRP){

            scope.labelcolor="red";
            scope.arrow="\u2193";

      var productobject={
        "color": "#4C98CF",
        "color1": "#7F2891",
        "name":scope.product[0].name,
        "income":scope.ProducttotalbyRP,
        "expenses": 0.00,
        "index":0.00,
        "labelcolor":scope.labelcolor,
        "arrow":scope.arrow,
        
      }
      scope.productChartData.push(productobject);
        }
        else if(scope.ProducttotalbyCP){
           scope.labelcolor="red";
            scope.arrow="\u2193";

      var productobject={
        "color": "#4C98CF",
        "color1": "#7F2891",
        "name":scope.product[0].name,
        "income":0.00,
        "expenses":scope.ProducttotalbyCP,
        "index":0.00,
        "labelcolor":scope.labelcolor,
        "arrow":scope.arrow,
        
      }
      scope.productChartData.push(productobject);
        }

        scope.chartdata = scope.productChartData;

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

             scope.maximumValue=dashBoardService.getcampaignsalesmaxvalue();

                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){

                   if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.setcampaignsalesmaxvalue(scope.maxvalue);
                   }
                 }
                 else{
               dashBoardService.setcampaignsalesmaxvalue(scope.maxvalue);

                 }

             //console.log("max value...",dashBoardService.getcampaignsalesmaxvalue());
            console.log("chart data...",scope.chartdata);

        $timeout(function () {
            initChart();
          }, 0);



              }, function (response) {
                console.log(response);
              }
              );
            }

            var data = {
              "aggTimeUnit": "1d",
             "startTime": scope.comparestarttime,
              "endTime": scope.compareendtime,
              "filters": {
                "items.mfgId" : [scope.mfgId],
                 "retailerId" :scope.retailers,
           "item.upc" : scope.product[0].upc

              }
            }

        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
             scope.ProducttotalbyCP=response.data.total;
              scope.TopProductsbyReportTimeforcpg();
            }, function (response) {
              console.log(response);
            }
            );

         }

         scope.role=sessionStorage.role;
        

         if(scope.role=="retailer"){
          scope.salesDataforRetailer();

         }
         else{
           scope.mfgId=sessionStorage.mfgId;

           scope.topProductsFunctionByAllRetailerforcpg();

         }


        }//end link
      }
    }])
