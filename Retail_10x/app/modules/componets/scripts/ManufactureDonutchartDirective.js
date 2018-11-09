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


angular.module('Retails.manufacturedonutchartDirective', [])

  .directive('manufacturedonutchartDirective', ['$compile', '$window', '$timeout','$rootScope','productService','dashBoardService',
    function ($compile, $window, $timeout,$rootScope,productService,dashBoardService) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '=',
          departmentdata:'='
        },
        templateUrl: 'modules/componets/views/manufactureDonutchartemplate.html',

        link: function (scope, element, attrs) {

          scope.chartid = scope.id;
          scope.chartdata = scope.data;

          scope.mfgId=sessionStorage.mfgId;
          var chart = false;


          var initChart = function() {
            if (chart) chart.destroy();
            var config = scope.config || {};


            chart = AmCharts.makeChart(scope.chartid, {
              "type": "pie",
              "theme": "light",
              "addClassNames": true,
              "innerRadius": "30%",
  "defs": {
    "filter": [{
      "id": "shadow",
      "width": "200%",
      "height": "200%",
      "feOffset": {
        "result": "offOut",
        "in": "SourceAlpha",
        "dx": 0,
        "dy": 0
      },
      "feGaussianBlur": {
        "result": "blurOut",
        "in": "offOut",
        "stdDeviation": 5
      },
      "feBlend": {
        "in": "SourceGraphic",
        "in2": "blurOut",
        "mode": "normal"
      }
    }]
  },
              "marginTop": 10,
              "marginBottom":10,
              "showHandOnHover":true,
              "allLabels": [{
                "text": "",
                "color": "green",
                "bold" : true,
                "align": "center",
                "size": 20,
                "y": 190,
                "showHandOnHover":true,

              }],
              "dataProvider":scope.chartdata,
              //"outlineColor":"",
             

              "titleField": "title",
              "valueField": "percent",
              "depth3D": 20,
              "angle": 20,
              "fontSize": 12,
              "labelRadius": 10,
              "radius": "15%",
              "innerRadius": "45%",
              "labelText": "[[title]]",
               "balloonText":"Sales Amt: $[[amt]]",




              "export": {
                "enabled": false
              },

              "responsive": {
                "enabled": true,
                "addDefaultRules": false,
                "rules": [
                  {
                    "maxWidth": 400,
                    "overrides": {
                      "fontSize": 6,
                      "labelRadius": 5,
                      "radius": "20%",
                      "innerRadius": "40%",
                      "allLabels": [{
                        "text": "1.02",
                        "color": "green",
                        "bold" : true,
                        "align": "center",
                        "size": 10,
                        "y": 210,
                        "showHandOnHover":true,

                      }]
                    }
                  }
                ]
              },
              "pullOutOnlyOne":true,
               "balloon": {
              "fillColor": "#000000",
               "color": "#ffffff",
               "fillAlpha": 1.0,
              
              },

              "startEffect":"easeOutSine",
              "pullOutEffect":"easeOutSine",
              "listeners": [{
                "event": "clickSlice",
                "method": function(e) {

                  var dp = e.dataItem.dataContext;

                  scope.selectoption1=dp.id;

                  var object ={

                    "title":scope.selectoption1,

                  }

                  $rootScope.$emit('selecteddonutchartManufacture', object);

                  e.chart.validateData();
                }
              }]

            });
          };



          if(scope.chartdata.length>20){
             scope.chartheight=scope.chartdata.length*28;

            scope.chartheightinpx=scope.chartheight+"px";

          }
          else if(scope.chartdata.length>10){
             scope.chartheight=scope.chartdata.length*45;

            scope.chartheightinpx=scope.chartheight+"px";

          }
          else{
            scope.chartheightinpx=450+"px";
          }

          console.log("chartheight...",scope.chartheightinpx);

          
          for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].title=scope.chartdata[i].title.toUpperCase();
          }

          console.log("chartdata after....",scope.chartdata);


          $timeout(function () {
            initChart();
          }, 0);

        }//end watch


      }
    }])
