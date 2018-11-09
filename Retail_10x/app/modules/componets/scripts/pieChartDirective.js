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


angular.module('Retails.piechartDirective', ['product.controllers'])


  .directive('piechartDirective', ['$compile', '$window', '$timeout',
    function ($compile, $window, $timeout) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '='
        },

        templateUrl: 'modules/componets/views/piecharttemplate.html',
        link: function (scope, element, attrs) {

          scope.chartid = scope.id;
          scope.chartdata = scope.data;

          var chart;
          var initChart = function () {
            if (chart) chart.destroy();
            var config = scope.config || {};

            chart = AmCharts.makeChart(scope.chartid, {
              "type": "pie",
              "labelsEnabled": true,
              "pullOutRadius": 0,
              "theme": "light",
              "allLabels": scope.allLabels,
             
              "dataProvider": scope.chartdata,
              "titleField": "title",
              "valueField": "percent",
              "labelRadius": 12
              ,

              "radius": "20%",
               "balloon": {
              "fillColor": "#000000",
               "color": "#ffffff",
               "fillAlpha": 1.0,
              
              },
              "innerRadius": "60%",
              "labelText": "[[title]]<br>[[percent]]%  |  $[[value]]",
              "export": {
                "enabled": true
              }
            })
          };
          $timeout(function () {

            if (chart)
              chart.clear();
            initChart();

          }, 0);

          if (scope.chartdata.length > 20) {
            scope.allLabels = [{
              "text": "18%",
              "color": "green",
              "align": "center",
              "size": 20,
              "y": 550,
              "bold": true,
              "showHandOnHover":true,

            }, {
              "text": "1.2",
              "color": "green",
              "align": "center",
              "size": 12,
              "y": 570,
              "showHandOnHover":true,

            }];
            scope.chartstyle = "min-width: 100%; height: 1120px; margin: 0 auto";
          }
          else {

            scope.allLabels = [{
              "text": "18%",
              "color": "green",
              "align": "center",
              "size": 20,
              "y": 180,
              "bold": true,

            }, {
              "text": "1.2",
              "color": "green",
              "align": "center",
              "size": 12,
              "y": 210,

            }];
            scope.chartstyle = "min-width: 100%; height: 400px; margin: 0 auto";

          }

          scope.$on('$destroy', function () {
            console.log('event destory ', chart);
            if (chart)
              chart.clear();
            console.log('event destory ', chart);
          });


        }//end watch
      }
    }]);
