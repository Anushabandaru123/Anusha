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


angular.module('Retails.topdepartments', ['product.controllers'])

  .directive('topdepartmentsDirective', ['$compile', '$window', '$timeout','$rootScope','$state',
    function ($compile, $window, $timeout,$rootScope,$state) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '=',
          index:'=',
          color:'='
        },
        templateUrl: 'modules/componets/views/topdepartmentstemplate.html',

        link: function (scope, element, attrs) {


          scope.chartid = scope.id;
          scope.chartdata = scope.data;

         // console.log("department data....",scope.data);


          var chart = false;

          /*var initChart = function () {
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
                "gridAlpha": 0,
                "gridPosition": "start",
                "position": "left"
              },
              "trendLines": [],
              "graphs": [
                {
                  "balloonText": "[[reporttime]]<br> [[storename]]: $[[amt]]<br> Index: [[Index]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "valueField": "value",
                  "showHandOnHover":true,
                  //"fixedColumnWidth": 15
                },
                {
                  "balloonText": "[[comapretime]]<br> [[storename]]: $[[amt1]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "valueField": "value1",
                  "showHandOnHover":true,
                 // "fixedColumnWidth": 15
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
                "enabled": true
              }

            });


            chart.addListener("clickGraphItem", handleClick)

            function handleClick(event){

              //alert(event.item.category + ": " + event.item.values.value +":"+event.item.dataContext.id);
            //  scope.selectLable(event.item.category,event.item.dataContext.id);
              var object ={
                "title":event.item.category,
                "id":event.item.dataContext.id
              }

              // scope.selectLable(dp.title,dp.id);

                  scope.role=sessionStorage.role;

                  //console.log("what is the role....",scope.role);
                  if(scope.role=="retailer"){
           $rootScope.$emit('selecteddonutchartdep', object);
                  }
            }

          };*/

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
              "marginTop": 50,
              "marginLeft":0,
              //"marginBottom":10,
              "allLabels": [{
                "text": scope.index,
                "color": scope.color,
                "bold" : true,
                "align": "center",
                "size": 15,
                "y": 130,

              }],
              "dataProvider":scope.chartdata,
              "graphs":[{}],
              "titleField": "title",
              "valueField": "value",
              "showHandOnHover":true,
              "fontSize": 11,
              "labelRadius": 10,
              "radius": "65%",
              "innerRadius": "45%",
              //"labelText": "[[title]]",
              "balloonText":"[[storename]]: $[[amt]]",
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
                  // "fontSize": 11,
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
                "export": {
                "enabled": true,
                 "menu": []
              },
                
              "pullOutOnlyOne":true,
              "startEffect":"easeOutSine",
              "pullOutEffect":"easeOutSine",
             "listeners": [{
                "event": "clickSlice",
                "method": function(e) {

                  var dp = e.dataItem.dataContext;

                  scope.selectoption1=dp.storename;

                  if(scope.selectoption1!="OTHERS"){

                    var object ={

                    "title":scope.selectoption1,
                    "id":dp.id

                  }

                   scope.role=sessionStorage.role;

                   if(scope.role=="retailer"){
                   // $rootScope.$emit('selecteddonutchartdep', object);
                   }
                    else{
                    // $state.go('products-department');
                  }


                    

                  }

                  

                  e.chart.validateData();
                }
              }]


            })

          };







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
