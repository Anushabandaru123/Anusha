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


angular.module('Retails.salesperformance', ['product.controllers','individualproduct.controllers'])

  .directive('salesperformanceDirective', ['$compile', '$window', '$timeout',
    function ($compile, $window, $timeout) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          id: '=',
          data: '=',
          detail:'='
        },
        templateUrl: 'modules/componets/views/salesperformancetemplate.html',

        link: function (scope, element, attrs) {


          scope.chartid = scope.id;
          scope.chartdata = scope.data;
          scope.currency=scope.detail;

         //console.log("data...",scope.data);

          var chart = false;

          var initLineChart = function () {

            if (chart)chart.destroy();

            chart = AmCharts.makeChart(scope.chartid, {
              "type": "serial",
              "marginRight": 10,
              "marginLeft": 10,
              "marginTop": -10,
              "autoMarginOffset": 0,
              "graphs": [{
                "id": "g1",
                //"bullet": "round",//square
                "fillAlphas": 0.1,
                //"fillColorsField": "lineColor",
                //"lineColorField": "lineColor",
                lineColor: "#ba5bbb",

               // "bulletBorderAlpha": 1,
                //"bulletColor": "#41C4F0",
                //"bulletBorderColor": "#41C4F0",
               // "bulletSize": 4,
               // "hideBulletsCount": 50,
                "lineThickness": 2,
                "title": "line chart",
                "type": "smoothedLine",
                "useLineColorForBulletBorder": true,
                "valueField": "value",
               "balloonText": "<span style='font-size:18px;'>"+scope.currency+"[[value]]</span>"

                //"balloonText": "<span style='font-size:18px;'>[[currency]][[value]]</span>"
              },
              {
                "id": "g2",
                //"bullet": "round",//square
                "fillAlphas": 0.1,
                //"fillColorsField": "lineColor",
                //"lineColorField": "#428dc9",
               lineColor: "#428dc9",

                //"bulletBorderAlpha": 1,
                //"bulletColor": "#41C4F0",
                //"bulletBorderColor": "#41C4F0",
               // "bulletSize": 4,
               // "hideBulletsCount": 50,
                "lineThickness": 2,
                "type": "smoothedLine",
                "title": "line chart",
                "useLineColorForBulletBorder": true,
                "valueField": "value2",
               "balloonText": "<span style='font-size:18px;'>"+scope.currency+"[[value]]</span>"

                //"balloonText": "<span style='font-size:18px;'>[[currency]][[value]]</span>"
              }],


              "valueAxes": [{
                "axisAlpha": 0,
                "gridAlpha": 0,
                "labelsEnabled": false,
               // "minimum":0,
                "maximum":scope.maxvalue
              }],

              "categoryAxis": {
                "axisAlpha": 0,
                "gridAlpha": 0,
                "labelsEnabled": false,

              },

              "categoryField": "id",

              "dataProvider": scope.chartdata,
                "export": {
                "enabled": true,
                 "menu": []
              }
            });
          }




 /*var initLineChart = function () {

                       if (chart)chart.destroy();

                       chart = AmCharts.makeChart(scope.chartid,
                         {

                           type: "serial",
                           theme: "light",
                           dataProvider: scope.chartdata,
                           dataDateFormat: "YYYY-MM-DD",
                           categoryField: "date",
                           categoryAxis: {
                             parseDates: true,
                             minPeriod: "DD",
                             gridAlpha: 0.1,
                             minorGridAlpha: 0.1,
                             axisAlpha: 0,
                             minorGridEnabled: true,
                           },
                           valueAxes: [{
                             tickLength: 0,
                             axisAlpha: 0,
                             showFirstLabel: false,
                             showLastLabel: false,
                             labelsEnabled : false
                              
                           }],

                           graphs: [{
                             lineColor: "#428dc9",
                             valueField: "value",
                             bullet: "round",
                             balloonText: "[[date]]<br><b><span style='font-size:14px;'>"+scope.currency+"[[value]]</span></b>"
                           },
                             {
                               lineColor: "#ba5bbb",
                               valueField: "value2",
                               bullet: "round",
                               balloonText: "[[date1]]<br><b><span style='font-size:14px;'>"+scope.currency+"[[value]]</span></b>"
                             }

                           ],

                           chartCursor: {},

                         }
                       );
           chart.addListener("rendered", zoomChart);

           zoomChart();
           function zoomChart(){
           }
         }*/

           scope.comapretimearray=[];
              scope.reporttimearray=[];


        for(var i=0;i<scope.chartdata.length;i++){
            scope.comapretimearray.push(parseFloat(scope.chartdata[i].value2));
              scope.reporttimearray.push(parseFloat(scope.chartdata[i].value));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);
           
             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax*1.2;
             }

             else{
              scope.maxvalue=scope.reporttimemax*1.2;

             }




          $timeout(function () {
            if (chart)
              chart.clear();
            initLineChart();
          }, 0);


          scope.$on('$destroy', function () {
            if (chart)
              chart.clear();
          });


        }
      }
    }])
