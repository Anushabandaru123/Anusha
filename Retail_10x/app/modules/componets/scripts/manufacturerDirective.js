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


angular.module('Retails.manfacturerDirective', ['manufacturer .controllers'])

  .directive('manfacturerDirective', ['$compile', '$window', '$timeout','$rootScope','$filter',
    function ($compile, $window, $timeout,$rootScope,$filter) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '=',
           chartheight:'='
        },
        templateUrl: 'modules/componets/views/manufacturertemplate.html',

        link: function (scope, element, attrs ,manufacturerCtrl) {


          scope.chartid = scope.id;
          scope.chartdata = scope.data;

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
              "columnWidth": 0.75,
              "startEffect":"easeOutSine",
              "categoryAxis": {
                "gridPosition": "start",
                "position": "left",
                "gridAlpha" : 0
              },
              "trendLines": [],
              "graphs": [
                {
                  "balloonText": "[[reporttime]]<br>[[storename]]: $[[amtnumber]] <br> Index: [[Index]]",
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


              var object={
              "productName":event.item.category,
              "deptid":event.item.dataContext.deptId,
              "itemNumber":event.item.dataContext.upc,
              "Namedept":event.item.dataContext.DeptName

             }
          $rootScope.$emit('topproductbarchartcallback', object);


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
              scope.maxvalue=scope.comparetimemax*1.5;
             }

             else{
              scope.maxvalue=scope.reporttimemax*1.5;

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
