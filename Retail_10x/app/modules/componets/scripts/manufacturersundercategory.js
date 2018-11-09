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


angular.module('Retails.manufacturersundercategories', ['manufacturer .controllers'])

  .directive('manufacturersundercategoriesDirective', ['$compile', '$window', '$timeout','$rootScope','$filter',
    function ($compile, $window, $timeout,$rootScope,$filter) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '=',
           chartheight:'='
        },
        templateUrl: 'modules/componets/views/manufacturersundercategorytemplate.html',

        link: function (scope, element, attrs ) {

          scope.chartid = scope.id;
          scope.chartdata = scope.data;
          scope.v1 =scope.chartdata.amt;

          var chart = false;

          var initChart = function () {
            if (chart) chart.destroy();
            var config = scope.config || {};

            chart = AmCharts.makeChart(scope.chartid, {
              "type": "serial",
              "theme": "light",
              "categoryField": "storename",
              "rotate": true,
              "startDuration": 1,
              "startEffect":"easeOutSine",
             "columnSpacing": 2,
              "marginBottom": 0,
              "categoryAxis": {
                  "inside": true,
                   "gridPosition": "start",
                   "gridAlpha": 0,
                   "axisAlpha": 0,
                   "tickPosition": "start",
                   "tickLength": 0,
                  "position": "left"
              },
              "trendLines": [],
              "graphs": [
                {
                  "balloonText": "[[reporttime]] <br>[[storename]]: $[[amtnumber]] <br> Index: [[Index]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "showHandOnHover":true,
                  "valueField": "amt",
                  "labelText": "$[[amtnumber]]",
                  "labelPosition": "right",
                  "fixedColumnWidth": 15

                },
                {
                  "balloonText": "[[comapretime]]<br>[[storename]]: $[[amtnumber1]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "showHandOnHover":true,
                  "valueField": "amt1",
                  "labelText": "$[[amtnumber1]]",
                  "labelPosition": "right",
                  "fixedColumnWidth": 15
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
                "enabled": false
              }

            });

            chart.addListener("clickGraphItem", handleClick);

            function handleClick(event){

            //  console.log(event);
             // console.log(event.item);
              //console.log(event.item.category);

              var object ={
                "storename":event.item.category

              }
            }

          };
           
              scope.comapretimearray=[];
              scope.reporttimearray=[];


             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[i].amt1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[i].amt));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax*1.9;
             }

             else{
              scope.maxvalue=scope.reporttimemax*1.9;

             }

          for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].amt,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].amt1,2);
            }



          $timeout(function () {
            if (chart)
              chart.clear();
            initChart();
          }, 0);


          scope.$on('$destroy', function () {
            if (chart)
              chart.clear();
          });


        }
      }
    }])
