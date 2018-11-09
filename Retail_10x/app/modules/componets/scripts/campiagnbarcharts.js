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


angular.module('Retails.campiagnbarcharts', [])

.directive('campiagnbarcharts', ['$compile', '$window', '$timeout','$rootScope','productService',
    function ($compile, $window, $timeout,$rootScope,productService) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          id : '=',
          data: '=',
           detail:'=',
           barchartname:'=',
           hover:'='
        },
        templateUrl: 'modules/componets/views/campiagnbarcharts-templete.html',
        link: function (scope, element, attrs) {
          scope.chartid = scope.id;
          scope.chartdata = scope.data;

          scope.currency=scope.detail;
          scope.name=scope.barchartname;

          //console.log("barchartname...",scope.chartdata);
          //console.log("hover...",scope.currency);

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
            		"gridPosition": "start",
            		"position": "left",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "ignoreAxisWidth": true,
                "autoWrap": true,
                "labelsEnabled": true
            	},
             "marginLeft": 120,
            	"graphs": [
            		{
            			"balloonText":scope.name+": "+scope.currency+"[[value]]",
                  "fillColorsField": "color1",
            			"fillAlphas": 1,
            			"lineAlpha": 0,
            			"title": "Income",
            			"type": "column",
            			"valueField": "income",
                  "showHandOnHover":true,
                  "fixedColumnWidth": 15
            		},
            		{
            			"balloonText":scope.name+": "+scope.currency+"[[value]]",
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
                  "maximum":scope.maxvalue,
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
                    "marginRight": 35,
                    }
                  }
                ]
                 }
            });
          };

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
              //console.log("coming...", scope.maxvalue);
             }

             else{
              scope.maxvalue=scope.reporttimemax*1.4;
              //console.log("coming...", scope.maxvalue);
             }


          $timeout(function () {
            initChart();
          }, 0);
        }//end link
      }
    }])
