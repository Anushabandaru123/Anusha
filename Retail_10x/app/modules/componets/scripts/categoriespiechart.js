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


angular.module('Retails.categoriespiechartDirective', ['department.controllers'])

  .directive('categoriespiechartDirective', ['$compile', '$window', '$timeout','$rootScope','productService','dashBoardService',
    function ($compile, $window, $timeout,$rootScope,productService,dashBoardService) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '=',
          departmentdata:'=',
          index:'=',
          color:'='
        },
        templateUrl: 'modules/componets/views/categoriespiecharttemplate.html',
        link: function (scope, element, attrs) {

          scope.chartid = scope.id;
          scope.chartdata = scope.data;

          scope.mfgId=sessionStorage.mfgId;

         //console.log("data......",scope.chartdata);

          //scope.index=scope.index.toFixed(2);

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
              "marginTop": 0,
              "marginBottom":0,
              "allLabels": [{
                "text": scope.index,
                "color": scope.color,
                "bold" : true,
                "align": "center",
                "size": 20,
                "y": 130,
              }],
              "dataProvider":scope.chartdata,
               "graphs":[{
               }],
              "titleField": "title",
              "valueField": "percent",
              "showHandOnHover":true,
              "fontSize": 11,
              "labelRadius": 10,
              "radius": "65%",
              "innerRadius": "45%",
              "labelText": "[[title]]",
               "balloonText":"[[title]]: $[[amt]]",
               "labelsEnabled": false,
               "colorField": "colorfield",
              "export": {
                "enabled": false
              },
              "responsive": {
                "enabled": true,
                "rules": [
                  {
                    "maxWidth": 400,
                    "overrides": {
                      //"fontSize": 6,
                      "labelRadius": 5,
                      "radius": "40%",
                      "innerRadius": "40%"
                      
                    }
                  }
                ]
              },
               "balloon": {
              "fillColor": "#000000",
               "color": "#ffffff",
               "fillAlpha": 1.0,
              
              },
                
              "pullOutOnlyOne":true,
              "startEffect":"easeOutSine",
              "pullOutEffect":"easeOutSine",
             "listeners": [{
                "event": "clickSlice",
                "method": function(e) {

                  var dp = e.dataItem.dataContext;

                  scope.selectoption1=dp.title;

                  if(scope.selectoption1!="OTHERS"){

                    var object ={

                    "title":scope.selectoption1,
                    "id":dp.id

                  }

                $rootScope.$emit('categorypiechartcallback', object);

                  }

                  

                  e.chart.validateData();
                }
              }]


            })

          };

          $timeout(function () {
            initChart();
          }, 0);


        }//end watch


      }
    }])
