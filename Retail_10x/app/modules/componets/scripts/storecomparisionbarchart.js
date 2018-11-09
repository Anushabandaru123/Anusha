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


angular.module('Retails.storecomparisionDirective', ['product.controllers'])

  .directive('storecomparisionBarchart', ['$compile', '$window', '$timeout',
    function ($compile, $window, $timeout) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '='
        },
        templateUrl: 'modules/componets/views/storecomparisionTemplate.html',
        //  template: '<div id="scope.id"  style="min-width: 100%; height: 100px; margin: 0 auto"></div>',

        link: function (scope, element, attrs) {

          //  scope.chartid="1000";
          //  scope.id = scope.id;
          scope.chartid = scope.id;
          scope.chartdata = scope.data;


        //  console.log("welcome to directive id", scope.id);
        //  console.log("welcome to directive id", scope.chartid);
         // console.log("welcome to directive data", scope.chartdata);

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
                  "balloonText": "Sales Amount: $[[value]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "Income",
                  "type": "column",
                  "valueField": "income",
                  "showHandOnHover":true,
                  "labelText": "$[[value]]",
                  "labelPosition": "right",
                },
                {
                  "balloonText": "Sales Amount: $[[value]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "Expenses",
                  "type": "column",
                  "valueField": "expenses",
                  "showHandOnHover":true,
                  "labelText": "$[[value]]",
                  "labelPosition": "right",
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
              }/*,
               "responsive": {
               "enabled": true
               }*/


            });


          };
          $timeout(function () {
            initChart();
          }, 0);


        }//end watch


      }
    }])
