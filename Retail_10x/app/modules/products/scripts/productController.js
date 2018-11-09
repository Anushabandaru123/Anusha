
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

angular.module('product.controllers',['Retails.barchartDirective'])

  .directive('topproductbarchart',
    function (productService) {
      return {
        restrict: 'E',
        replace: true,

        template: '<div id="topproductbarchart" style="min-width: 310px;min-height:400px;margin: 0 auto"></div>',
        link: function ($scope, scope, $watch) {

          //  var chart12 = false;

          var chart12;

          var initChart = function () {
            if (chart12) chart12.destroy();
            var config = scope.config || {};

           
            chart12 = AmCharts.makeChart("topproductbarchart", {
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
                  "balloonText": "[[reporttime]]<br> [[storename]]: $[[value]]<br> Index: [[Index]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "showHandOnHover":true,
                  "valueField": "amt",
                   "labelText": "$[[value]]",
                  "labelPosition": "right",
                 

                },
                {
                  "balloonText": "[[comapretime]]<br> [[storename]]: $[[value]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "showHandOnHover":true,
                  "valueField": "amt1",
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
              "dataProvider": barChartDataforChart,
              "export": {
                "enabled": true
              }

            });

            productService.setTopproductbarchartCsv(chart12);
            chart12.addListener("clickGraphItem", handleClick);
           // chart11.addListener("clickGraphItem", handleClick)

            function handleClick(event){

              console.log(event);
              console.log(event.item);



         // alert(event.item.category + ": " + event.item.values.value +" : "+event.item.dataContext.itemNumber +" : "+event.item.dataContext.deptId +" : "+event.item.dataContext.deptName);




$scope.selectchart(event.item.category,event.item.dataContext.deptId,event.item.dataContext.itemNumber,event.item.dataContext.deptName);

            }


          };

          var barChartDataforChart;
          $scope.$watch('barChartData', function (newVal, oldVal) {

            if ($scope.barChartData === undefined) {

            }
            else {
              barChartDataforChart = $scope.barChartData;
              if(chart12)
                chart12.clear();
                productService.setTopproductbarchartCsv(null);

                  scope.comapretimearray=[];
              scope.reporttimearray=[];


             for(var i=0;i<$scope.barChartData.length;i++){
                scope.comapretimearray.push(parseFloat($scope.barChartData[0].amt1));
              scope.reporttimearray.push(parseFloat($scope.barChartData[0].amt));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax*1.5;
             }

             else{
              scope.maxvalue=scope.reporttimemax*1.5;

             }



              initChart();
            }

          });

          $scope.$on('$destroy', function () {
            if(chart12)
              chart12.clear();
              productService.setTopproductbarchartCsv(null);
          });
        }//end watch
      }
    })

  .directive('topdepartments',
    function (dashBoardService,productService,$rootScope,$state) {
      return {
        restrict: 'E',
        replace: true,

        template: '<div id="topdepartments" style=" min-width: 310px;margin: 0 auto"></div>',
        link: function ($scope, scope, $watch) {

          //  var chart12 = false;

          var chart;

          var initChart = function () {
            if (chart) chart.destroy();
            var config = scope.config || {};

           

            chart = AmCharts.makeChart("topdepartments", {
              "type": "serial",
              "theme": "light",
              "categoryField": "storename",
              "rotate": true,
              "startDuration": 1,
               "startEffect":"easeOutSine",
              "categoryAxis": {
                "gridAlpha":0,
                "gridPosition": "start",
                "position": "left"
              },
              "trendLines": [],
              "graphs": [
                {
                  "balloonText": "[[reporttime]]<br> [[storename]]: $[[value]]<br> Index: [[Index]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "valueField": "amt",
                   "labelText": "$[[value]]",
                  "labelPosition": "right",
                  "showHandOnHover":true,
                  
                },
                {
                  "balloonText": "[[comapretime]]<br> [[storename]]: $[[value]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "valueField": "amt1",
                   "labelText": "$[[value]]",
                  "labelPosition": "right",
                  "showHandOnHover":true,
                  
                }
              ],
              "guides": [],
              "valueAxes": [
                {
                  "id": "ValueAxis-1",
                  "position": "top",
                  "axisAlpha": 0,
                  "gridAlpha" : 0,
                  "labelsEnabled" : false,
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
              "dataProvider": barChartdataforTopDepartments,
              "export": {
                "enabled": true
              }

            });
             chart.addListener("clickGraphItem", departmentcallback)

            function departmentcallback(event){

              var object ={

                "title":event.item.category,
                "id":event.item.dataContext.id

              }

                  scope.role=sessionStorage.role;

                  if(scope.role=="retailer"){
           $rootScope.$emit('selecteddonutchartdep', object);

                  }
                  else{
                     $state.go('products-department');
                  }

            }

            productService.setTopdepartmentsCsv(chart);

          };
          var barChartdataforTopDepartments;
          $scope.$watch('deparmentbarchartData', function (newVal, oldVal) {

            if ($scope.deparmentbarchartData === undefined) {

            }
            else {
              barChartdataforTopDepartments = $scope.deparmentbarchartData;
                scope.comapretimearray=[];
              scope.reporttimearray=[];


             for(var i=0;i<$scope.deparmentbarchartData.length;i++){
                scope.comapretimearray.push(parseFloat($scope.deparmentbarchartData[0].amt1));
              scope.reporttimearray.push(parseFloat($scope.deparmentbarchartData[0].amt));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax*1.5;
             }

             else{
              scope.maxvalue=scope.reporttimemax*1.5;

             }
              if(chart)
                chart.clear();
                productService.setTopdepartmentsCsv(null);
              initChart();
            }

          });

          $scope.$on('$destroy', function () {
            //console.log('event destory ', chart12);
            if(chart)
              chart.clear();
              productService.setTopdepartmentsCsv(null);
            //console.log('event destory ', chart12);
          });
        }//end watch
      }
    })



  .directive('alldepartments',
    function (productService,$rootScope) {
      return {
        restrict: 'E',
        replace: true,

        template: '<div id="alldepartments" style="min-width: 310px;min-height: 100px; margin: 0 auto"></div>',
        link: function ($scope, scope, $watch,$rootScope) {

          //  var chart12 = false;

          var chart11;

          var initChart = function () {
            if (chart11) chart11.destroy();
            var config = scope.config || {};

            chart11 = AmCharts.makeChart("alldepartments", {
              "type": "serial",
              "theme": "light",
              "categoryField":'storename',
              "rotate": true,
              "startDuration": 1,
               "startEffect":"easeOutSine",
              "categoryAxis": {
                "gridPosition": "start",
                "position": "left",
                "gridAlpha" : 0
              
              },
              "trendLines": [],
              "graphs": [
                {
                  "balloonText": "[[reporttime]]<br> [[storename]]: $[[value]]<br> Index: [[Index]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "showHandOnHover":true,
                  "valueField": "amt",
                   "labelText": "$[[value]]",
                  "labelPosition": "right"
                   //"fixedColumnWidth": 10
                },
                {
                  "balloonText": "[[comapretime]]<br> [[storename]]: $[[value]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "showHandOnHover":true,
                  "valueField": "amt1",
                   "labelText": "$[[value]]",
                  "labelPosition": "right"
                  // "fixedColumnWidth": 10
                }
              ],
              "guides": [],
              "valueAxes": [
                {
                  "id": "ValueAxis-1",
                  "position": "top",
                  "axisAlpha": 0,
                  "gridAlpha" : 0,
                  "labelsEnabled" : false
                }
              ],
              "allLabels": [],
              "balloon": {
              "fillColor": "#000000",
               "color": "#ffffff",
               "fillAlpha": 1.0,
              
              },
              "titles": [],
              "dataProvider": barChartdataforTopDepartments,
              "export": {
                "enabled": true,
                menu:[]
              }


            });


        /*    function exportCSV() {
              chart11.export.toCSV({
                data: chart11.dataProvider
              }, function(data) {
                this.download(data, this.defaults.formats.CSV.mimeType, "amCharts.csv");
              });
            }*/


            chart11.addListener("clickGraphItem", handleClick);
           // chart11.addListener("clickGraphItem", handleClick)

            function handleClick(event){

             // alert(event.item.category + ": " + event.item.values.value +":"+event.item.dataContext.id);

              $scope.selectLable(event.item.category,event.item.dataContext.id);

            }
          };



          var barChartdataforTopDepartments;
          $scope.$watch('alldeparmentbarchartData', function (newVal, oldVal) {



            if ($scope.alldeparmentbarchartData === undefined) {

            }
            else {
              barChartdataforTopDepartments = $scope.alldeparmentbarchartData;
             // console.log($scope.alldeparmentbarchartData);
              if(chart11)
                chart11.clear();
              initChart();
            }



          });



          $scope.$on('$destroy', function () {
            //console.log('event destory ', chart12);

            if(chart11)
              chart11.clear();
            //console.log('event destory ', chart12);
          });
        }//end watch


      }


    })



  .directive('productdonutchart',
    function (productService) {
      return {
        restrict: 'E',
        replace:true,

      template: '<div id="productdonutchart" style="min-width: 100%; height: 400px; margin: 0 auto"></div>',
        link: function ($scope, scope, element, attrs) {

          var chart = false;

          var initChart = function(pieChartData) {
            if (chart) chart.destroy();
            var config = scope.config || {};

            chart = AmCharts.makeChart("productdonutchart", {
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
               "allLabels": [{
                "text": scope.donutchartindex,
                "color": scope.color,
                "bold" : true,
                "align": "center",
                "size": 20,
                "y": 190,

               

              }],
              "showHandOnHover":true,
              
              "dataProvider":pieChartData,

              "titleField": "title",
              "valueField": "percent",

              "fontSize": 14,
              "labelRadius": 10,
              "radius": "25%",
              "innerRadius": "45%",
              "labelText": " [[title]]",
              "export": {
                "enabled": true
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
                      "innerRadius": "40%"
                      
                    }
                  }
                ]
              },
              //  "baseColor":"#7a4436",
              "balloon": {
              "fillColor": "#000000",
               "color": "#ffffff",
               "fillAlpha": 1.0,
              
              },
              "pullOutOnlyOne":true,
              "startEffect":"easeOutSine",
              "pullOutEffect":"easeOutSine",
              //  "showBalloon":false,
              "listeners": [{
                "event": "clickSlice",
                "method": function(e) {

                  var dp = e.dataItem.dataContext;
                 //  alert(dp.title + ':'+dp.percent +':'+dp.id)

                  $scope.selectoption1=dp.title;
                  $scope.selectLable(dp.title,dp.id);

                  e.chart.validateData();
                }
              }]


            })
          };

          var donutChartDatatoDirective;
          $scope.$watch('donutchartData', function (newVal, oldVal) {

            if ($scope.donutchartData === undefined) {

            }
            else {
              //console.log("donutchart index in directive...",$scope.donutchartindex);
              scope.donutchartindex=$scope.donutchartindex;
              if(scope.donutchartindex>=1){
                scope.color="green";
              }
              else{
                scope.color="red";
              }
              donutChartDatatoDirective = $scope.donutchartData;
              if(chart)
                chart.clear();
              initChart(donutChartDatatoDirective);
            }

          });

        }//end watch
      }
    })





  .controller('productCtrl', ['$scope', '$state', 'serviceFactory','productService','dashBoardService','$http','$timeout','usSpinnerService', '$rootScope','CacheFactory','$filter',
    function ($scope, $state, serviceFactory,productService,dashBoardService,$http,$timeout,usSpinnerService, $rootScope,CacheFactory,$filter) {


    if (sessionStorage.user == undefined || sessionStorage.user == null||sessionStorage.user =="null") {
      $state.go('login');
    }

          $scope.nutella = "data:image/jpeg;base64,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";



     $scope.raffaello = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzAxNCA3OS4xNTY3OTcsIDIwMTQvMDgvMjAtMDk6NTM6MDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZTdiMTJiODAtMDI1Yy0xZDQyLTg4NmUtNmZmYmM0MzUyNjBlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNCMTk0ODdBOTlDNzExRTU4Mjc1QzM5NTcwNUEyRTlDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNCMTk0ODc5OTlDNzExRTU4Mjc1QzM5NTcwNUEyRTlDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmM2MGYyMTIyLWJiZDQtODA0MC1iMjYxLTAxNjJkMDVhOGFkOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplN2IxMmI4MC0wMjVjLTFkNDItODg2ZS02ZmZiYzQzNTI2MGUiLz4gPC9yZGY6RGVzY3JpcHRpb24+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RRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGii9fd9UtVwbzr7oqt6NUqtfdxDvHRYUV95x+Pt7tUsKK+8494e346Omijn934/wCGqdNFHOPgGq9NFfOcfhosKK+biPeOq2FFfNFFfN9VqlxRvotVvVXzVapRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFzRuOqVW5o30Wo6jX3fRaq9VG+i1HVXzfRaqdRo30WouaN9VouaNFUo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiiv/9k=";


      $scope.ticTac = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzAxNCA3OS4xNTY3OTcsIDIwMTQvMDgvMjAtMDk6NTM6MDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZTdiMTJiODAtMDI1Yy0xZDQyLTg4NmUtNmZmYmM0MzUyNjBlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE0QzUxNDg3OTUwRTExRTU4RUJFQ0FGOEI0MDI4MEE2IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE0QzUxNDg2OTUwRTExRTU4RUJFQ0FGOEI0MDI4MEE2IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdmMmJiMWFlLTUwMWQtY2Q0ZS05MmY5LTdlMmQ0OGRmYjMyMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplN2IxMmI4MC0wMjVjLTFkNDItODg2ZS02ZmZiYzQzNTI2MGUiLz4gPC9yZGY6RGVzY3JpcHRpb24+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";


      $scope.defaultProduct = "data:image/jpeg;base64,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";



      $scope.tide = "data:image/png;base64,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";




    $scope.GetProductList = function (value) {

        sessionStorage.productsuggested = value;

        return productService.GetProductSuggested().then(function (response) {


            $scope.listOfProducts = response.data;
            $scope.typeaheadList = [];

            for (var i = 0; i < response.data.length; i++) {

              var tictac = response.data[i].product.toLowerCase().indexOf('tictac');
              var nutella = response.data[i].product.toLowerCase().indexOf('nutella');
              var ferrero = response.data[i].product.toLowerCase().indexOf('ferrero');
              var tide = response.data[i].product.toLowerCase().indexOf('tide');

              var typeaheadobject = {
                "image": $scope.defaultProduct,
                "product": response.data[i].product,
                "upc": response.data[i].upc,
                "price": response.data[i].size,
                "deptId":response.data[i].deptId
              }

              if (nutella >= 0) {
                typeaheadobject = {
                  "image": $scope.nutella,
                  "product": response.data[i].product,
                  "upc": response.data[i].upc,
                  "price": response.data[i].size,
                  "deptId":response.data[i].deptId
                }

              }

              else if (ferrero >= 0) {
                typeaheadobject = {
                  "image": $scope.raffaello,
                  "product": response.data[i].product,
                  "upc": response.data[i].upc,
                  "price": response.data[i].size,
                  "deptId":response.data[i].deptId
                }
              }

              else if (tictac >= 0) {
                typeaheadobject = {

                  "image": $scope.ticTac,
                  "product": response.data[i].product,
                  "upc": response.data[i].upc,
                  "price": response.data[i].size,
                  "deptId":response.data[i].deptId
                }
              }
              else if (tide >= 0) {
                typeaheadobject = {

                  "image": $scope.tide,
                  "product": response.data[i].product,
                  "upc": response.data[i].upc,
                  "price": response.data[i].size,
                  "deptId":response.data[i].deptId
                }
              }


              $scope.typeaheadList.push(typeaheadobject);
            }


            return $scope.typeaheadList;

          }, function (response) {
            console.log(response);

          }
        );
      }


      $scope.productselected=function(value){
        console.log("selected product...",value);

       // console.log("typeheadList...",$scope.typeaheadList);

        for(var i=0;i<$scope.typeaheadList.length;i++){
          if($scope.typeaheadList[i].product==value){
            $scope.selectedproductfromtypeahead=$scope.typeaheadList[i];
          }
        }

        console.log("selected product ....",$scope.selectedproductfromtypeahead);

          for(var j=0;j<$scope.departmentList.length;j++){
            if($scope.departmentList[j].departmentNumber==parseInt($scope.selectedproductfromtypeahead.deptId)){
              $scope.departmentdescription=$scope.departmentList[j].departmentDescription;
            
window.localStorage['dataplus']= "plus";

        window.localStorage['checkflag']="";

        //   console.log("clicked lable", xyz);
        $scope.screen4 = $scope.selectedproductfromtypeahead.product;
        $scope.iddept=$scope.selectedproductfromtypeahead.deptId;
        $scope.itemNum=$scope.selectedproductfromtypeahead.upc;
        $scope.Namedept=$scope.departmentdescription;
        window.localStorage['itemNum']= $scope.itemNum;
        window.localStorage['pname']= $scope.screen4;
        window.localStorage['iddept']=   $scope.iddept;
        window.localStorage['selectoption1']= $scope.Namedept;

        window.localStorage['s2']=true;

        window.localStorage['individualProduct']=true;


        //  console.log($scope.screen4)
        $state.go('individualDepartment');

            }
          }


           



          

     
      }


       $scope.getDepartmentList=function(){

         dashBoardService.GetDepartmentList().then(function (response) {
        // console.log(" department List response....",response.data);
           $scope.departmentList=response.data;
           


         }, function (response) {
          console.log(response);
        }
        );


       }





      $rootScope.$emit('downloadcsvfile', {});

        $scope.selectoption="product";

      $scope.selectdropdown=function () {


      $scope.option=window.localStorage['selectoption1'];
      $scope.optionid= window.localStorage['iddept'];
      $scope.xy={

        "Name":$scope.option
      }
      $scope.selectedvalue1=$scope.xy.Name;

      //console.log($scope.xy.Name);

      $scope.subproductList($scope.optionid);

      }


      $scope.selectLable=function (xyz , deptid) {


         //   console.log("clicked lable", xyz);
        $scope.screen4 = xyz;
        $scope.iddept=deptid;
        window.localStorage['selectoption1']= $scope.screen4;
        window.localStorage['iddept']=   $scope.iddept;
        window.localStorage['s2']="";
        window.localStorage['checkflag'] ="screen3";
        window.localStorage['onlycategory']=true;
        window.localStorage['categoryselected']=xyz;
        //  console.log($scope.screen4)
        $state.go('individualDepartment');

      }



      $scope.selectchart=function (productName , deptid ,itemNumber ,Namedept) {



        window.localStorage['dataplus']= "plus";

        window.localStorage['checkflag']="";

        //   console.log("clicked lable", xyz);
        $scope.screen4 = productName;
        $scope.iddept=deptid;
        $scope.itemNum=itemNumber;
        $scope.Namedept=Namedept;
        window.localStorage['itemNum']= $scope.itemNum;
        window.localStorage['pname']= $scope.screen4;
        window.localStorage['iddept']=   $scope.iddept;
        window.localStorage['selectoption1']= $scope.Namedept;

        window.localStorage['s2']=true;

        //  console.log($scope.screen4)
        $state.go('individualDepartment');

         window.localStorage['individualProduct']=true;


      }


     /* $scope.option=window.localStorage['selectoption1'];*/


       $scope.List = [
           {
            "store_id":"",
            "store_name":"ALL STORES"
           }
           ];
      $scope.GetStoreList=function(){

      dashBoardService.GetStoreList().then(function (response) {
          for (var i = 0; i < response.data.length; i++) {
            $scope.List.push(response.data[i]);
          }
            $scope.selectedOption = $scope.List[0];
	   $scope.storeid=dashBoardService.getstoreid();
         for(var j=0;j<$scope.List.length;j++){
           if($scope.List[j].store_id==$scope.storeid){
              $scope.selectedOption = $scope.List[j];
             $scope.selectedstoreidname=$scope.List[j].store_name;
           }
         }

        }, function (response) {

        }
      );
    }


      $scope.productList1=[];
      $scope.subproductlists1=[];


      $scope.signvalue="+";
      $scope.selectedproductList=[];



      $scope.imgbar="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACtJREFUSMdj+A8GDAgwKjAqwDAKcIH/cDAqMCqAKTAKcOUXaDCNCowKIAAAP/H8Lm4fPi4AAAAASUVORK5CYII=";
      $scope.imgline="data:image/png;base64,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";
      $scope.imgmap="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADB+5NvAAAA6nRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9PkBBQ0RFSElKS0xNTk9QUVJTVFVWV1haW1xdXmBhYmNkZWZnaGprbG1ub3BxcnN0dXZ3eHp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJaXmJmbnJ2en6ChoqOkpaaoqqusrq+wsrO1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1dbX2Nrc3t/g4eLj5OXm5+jp6uvs7e7w8fLz9PX29/j5+vv8/f6wQlqMAAAFg0lEQVQYGe3B91/UZQAH8M8hCMcwR5hpKQ5MM/fKrMxMLTGt1HbO1DRRGgouBEPJLMtKNLWyRAi0ZRalpdkCCkgMT0GGyLzPX5H3vA7u+d78As/3frr3GwgICAgICAgIaLeQu+au3bpr15a1c4YFw+/6vJxzja2qs1/qBX+alttMJ01ZD8Bf7j9Dt/LugT/0OEhPrB90heEmX6AX/4yHwZ5vpFcNC2CotfTF+hIMtJw6LIRh5lipQ9NMGGRgFXWp6AdDdPqZzv4+lrE/q4jOvg+CEVZSqzi+L4SYhAvUWgQDRFdSVrsmBK06v1JHWXlXqLeVspLh0BhTStl6KNflKiUlfeFkwEVKyiOg2guU1A6Hi3H1lDwF1U5SEg87U3RPE+w2UHIcivWw0qEkBEKv3VdIS3o0BHMZHZq6QK25lKyDMO4yhf9GQkik5GGolU5JP9jcYqHdxR6wGUpJKtTKpUMxhF1stQ2ChQ6ZUKuIDl/AxmRhqyIIJ+lQALXq6HAQNt0pMcPmCB0qoVQwJYdg05WSMNh8RodmKBVJyXHYmErZqgDCKUrCoFQjHUohpLDVetiYyikxQSkLJYNg062EdoVRsBlBSTXUyqdkPYQhxRQKB0HYRkk+1DpBSZkZwk1JBeRfr0dCiCqnJBtqpVKWhBYhIWixnbLtUOsJyhomwsX9TZQtgFoDqXFpMJwMK6dGfyhWRg3LZGhMqaBGCVR7n1qNyZFo1eWNZmq9B9Xi6OxK8ggTbjCNTq2gszioFlFHVxV5RzPzrtJVjRnKHWUbHIZ6cWyD6VAvuIy6XewEA6RSt00wQqyVOjX1hSGOUqePYYx7qdMEGORH6vIVjDKbukyFUUznqMMpGGcGdXgABvqBPp2AkabQF+s4GCqTPhyCsWIb6NX1fjDYDnq1EUbraqEXJeEw3DP0Yg784Bt6lA1/GNJAD2oHwC8204ME+Efon3TrbDD8ZGIz3WgYCb/ZQTcS4T/mfLr4JQR+NLaRTuqGwa820Mlq+FdwHjVOmOAvERD6V1JyuTeECBgn+I5Za/bk/FnddDeEeZTMhDDVWpOfsyd+1uBgKBU2aeWB83W0K4yCsJetdkLoXkq7+vMZKyeFQoXwh1LyGqiRAcH8G+1Od4bwGTXq81KmhaNDei/PqaOr+RAGV1OoiIGwhK7qcpb1QTtFLTpppVtVAyE8RhvrDAh3Xadb1pMLo9B2sXtq6NHZUAhpvCERQmQ+Pap+OxZtE/tJM715B0Lwl2SmCcJBetN8OBb6he9spEf1JaczM3b0hHDz3/k3Qbh9Z0bm6ZJ6etTwRjh0GlVId6p+2vfavAm3miAbFguZqdf4J17d92Ml3SkYAV2mX6OzytxNcTFog5i4TbmVdFYzDTpMvk6N2uzVo4PQDkGjV2fXUqNuEnyKLKLk6r6ZZnSA+ZH9lZQUhcOXF+nw7fwwdJj5yVN0WAZfstji2FgoMvELtjgGX87SLisUyoTl0u4H+PI5WxQvMUOJ8KX/ssV++PIkHS6n3YkOG55eToeZ8KXTz5T9vmE02s80NukPyr6DbwMuUeu/A88OQjsMfu5gGbUu9IIOQ4rp4tKxpLiBQdApaNDsjVkWuvirP3SJzqRb1379ZOvih4Z2g0fd75y+JPnT87V06+Nu0Gt+Kb2o//fsV0fefys1MSF+1fIVq+ITElN3f3Dk63MXGuhF8aNog/B1FipVtqIz2sa88Fcqc/qpULTDmPRSKlCcMgLtFTQp+ZyVHWA9kzTBhI7p+fjuc01sh8YzOx+NhhoRk1fs/amKulXkvbt4vBmq9ZmycMtH3xbW0KOqgi8/3Pj8fT1hrIiYMQ/OfW5FQlJyWvquN9NSNieuXfr07KmjbgtFQEBAQEBAQEDb/Q+FHFVi9MUL1wAAAABJRU5ErkJggg==";


      $scope.imagebuffer="data:image/png;base64,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";

      $scope.imagebuffer1="data:image/jpeg;base64,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";



      $scope.exportCSV = function() {
        var a;
        if (productService.getTopproductbarchartCsv().dataProvider!=null) {
          a = $('<a/>', {
            style:'display:none',
            href:'data:application/octet-stream;base64,'+btoa(ConvertToCSV(productService.getTopproductbarchartCsv().dataProvider)),
            download:'top_productData.csv'
          }).appendTo('body')
          a[0].click()
          a.remove();
        }
        if (productService.getTopdepartmentsCsv().dataProvider!=null) {
          a = $('<a/>', {
            style:'display:none',
            href:'data:application/octet-stream;base64,'+btoa(ConvertToCSV(productService.getTopdepartmentsCsv().dataProvider)),
            download:'top_departmenData.csv'
          }).appendTo('body')
          a[0].click();
          a.remove;
        }
      }
      function ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
          }
          str += line + '\r\n';
        }
        return str;
      }

      /*  barchart for product screen  */


      $scope.spinneractive= false;

       $rootScope.$on('us-spinner:spin', function (event, key) {
         $scope.spinneractive= true;
       });

       $rootScope.$on('us-spinner:stop', function (event, key) {
         $scope.spinneractive= false;
       });


      //$scope.chartheight="400px";


      $scope.topPerformersFunction = function () {

        if (!$scope.spinneractive) {
          $scope.spin=true;
               usSpinnerService.spin('spinner-1');
               //$scope.startcounter++;
             }

        $scope.getTopProducts=function(){

          $scope.TopProductsbyReportTime=function(){
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "name",
              "filters": {
                "item.upc" : $scope.RTItemNames
              }
            }
            productService.GetSalesPerformance(data).then(function (response) {

                $scope.topProductsbyRT=response.data.data;

                $scope.spinneractive= true;

               if ($scope.spinneractive) {
                 $scope.spin=false;

                 usSpinnerService.stop('spinner-1');

               }


                  $scope.barChartData= [];

              if( $scope.topProductsbyRT.length>10){
                  $scope.chartheightlength=50* $scope.topProductsbyRT.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }
               else if( $scope.topProductsbyRT.length>=5){
                  $scope.chartheightlength=35* $scope.topProductsbyRT.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }
                 else if( $scope.topProductsbyRT.length>=2){
                  $scope.chartheightlength=35* ($scope.topProductsbyRT.length+2);
                  $scope.chartheight=$scope.chartheightlength+"px";
                }

                else{

                  $scope.chartheight="100px";
                }

                $scope.alltopDepartments=false;
              
                for (var i = 0; i < $scope.topProductsbyRT.length; i++) {

                   $scope.indexvalue=0;

                  for(var j=0; j < $scope.RTdata.length; j++){

                  if($scope.topProductsbyRT[i].id == $scope.RTdata[j].name){

                   // console.log($scope.topProductsbyRT[i].id + " is equal check" + $scope.RTdata[j].name)

                   if($scope.topProductsbyRT[i]&&$scope.topProductsbyCT[i]){

                     if($scope.topProductsbyCT[i].amt>=0){
             $scope.indexvalue = $scope.topProductsbyRT[i].amt / $scope.topProductsbyCT[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
                       var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1": $scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.RTdata[j].itemName,
                    'deptId':$scope.RTdata[j].deptId,
                    'deptName': $scope.RTdata[j].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);

                   }
                   else if($scope.topProductsbyRT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1":0,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.RTdata[j].itemName,
                    'deptId':$scope.RTdata[j].deptId,
                    'deptName': $scope.RTdata[j].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }
                   else if($scope.topProductsbyCT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": 0,
                    "amt1":$scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyCT[i].id,
                    'itemNumber':$scope.RTdata[j].itemName,
                    'deptId':$scope.RTdata[j].deptId,
                    'deptName': $scope.RTdata[j].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }


                  
                }


                  }

                }

                $scope.$applyAsync();
              //  console.log($scope.barChartData);
                $scope.alltopDepartments=true;
                dashBoardService.setproductscacheData('barChartData',$scope.barChartData);

              }, function (response) {
                console.log(response);
              }
            );
          }

          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "bucketLevel" : "L",
            "bucketType" : "name",
            "filters": {
              "item.upc" : $scope.RTItemNames
            }
          }
          productService.GetSalesPerformance(data).then(function (response) {

              $scope.topProductsbyCT=response.data.data;
              $scope.TopProductsbyReportTime();
            }, function (response) {
              console.log(response);
            }
          );


        }

        //first get the item names for both report and compare time period

          var TopProductsRpData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "criteria": "AMT"
          }
          productService.GetTopTenProducts(TopProductsRpData).then(function (response) {


            $scope.RTdata=[];
              $scope.RTItemNames=[];
              $scope.RTdeptId=[];
            $scope.RTdeptName=[];

            $scope.RTdata=response.data;

              for(var i=0;i<response.data.length;i++){
                $scope.RTItemNames.push(response.data[i].itemName);
                $scope.RTdeptId.push(response.data[i].deptId);
                $scope.RTdeptName.push(response.data[i].deptName);

              }
              $scope.getTopProducts();
            }, function (response) {

              console.log(response);

            }
          );
        //for compare time period
      }

          $scope.mfgId=sessionStorage.mfgId;




      $scope.topPerformersFunctionforcpgbyretailer = function () {

        if (!$scope.spinneractive) {
          $scope.spin=true;
               usSpinnerService.spin('spinner-1');
               //$scope.startcounter++;
             }

        $scope.getTopProducts=function(){

          $scope.TopProductsbyReportTime=function(){
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "name",
              "filters": {
                 "items.mfgId" : [$scope.mfgId],
                "item.upc" : $scope.RTItemNames
              }
            }
            productService.GetSalesPerformance(data).then(function (response) {

                $scope.topProductsbyRT=response.data.data;

                $scope.spinneractive= true;

               if ($scope.spinneractive) {
                 $scope.spin=false;

                 usSpinnerService.stop('spinner-1');

               }

                $scope.alltopDepartments=false;
                $scope.barChartData= [];
                for (var i = 0; i < $scope.topProductsbyRT.length; i++) {

                  $scope.indexvalue=0;

                  for(var j=0; j < $scope.RTdata.length; j++){

                  if($scope.topProductsbyRT[i].id == $scope.RTdata[j].name){

                  //  console.log($scope.topProductsbyRT[i].id + " is equal check" + $scope.RTdata[j].name)

                   if($scope.topProductsbyRT[i]&&$scope.topProductsbyCT[i]){


                     if($scope.topProductsbyCT[i].amt>=0){
             $scope.indexvalue = $scope.topProductsbyRT[i].amt / $scope.topProductsbyCT[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }



                       var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1": $scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.RTdata[j].itemName,
                    'deptId':$scope.RTdata[j].deptId,
                    'deptName': $scope.RTdata[j].deptName,
                      "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);

                   }
                   else if($scope.topProductsbyRT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1":0,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.RTdata[j].itemName,
                    'deptId':$scope.RTdata[j].deptId,
                    'deptName': $scope.RTdata[j].deptName,
                      "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }
                   else if($scope.topProductsbyCT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": 0,
                    "amt1":$scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyCT[i].id,
                    'itemNumber':$scope.RTdata[j].itemName,
                    'deptId':$scope.RTdata[j].deptId,
                    'deptName': $scope.RTdata[j].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }


                  
                }


                  }

                }

                $scope.$applyAsync();
              //  console.log($scope.barChartData);

              if($scope.barChartData.length>10){
          $scope.chartheightlength=40* $scope.barChartData.length;
          $scope.chartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.barChartData.length>=5){
                    $scope.chartheightlength=45*$scope.barChartData.length;
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.barChartData.length>=2){
                    $scope.chartheightlength=32* ($scope.barChartData.length+2);
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.chartheight="70px";
                  }


                $scope.alltopDepartments=true;
                dashBoardService.setproductscacheData('barChartData',$scope.barChartData);

              }, function (response) {
                console.log(response);
              }
            );
          }

          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "bucketLevel" : "L",
            "bucketType" : "name",
            "filters": {
               "items.mfgId" : [$scope.mfgId],
              "item.upc" : $scope.RTItemNames
            }
          }
          productService.GetSalesPerformance(data).then(function (response) {

              $scope.topProductsbyCT=response.data.data;
              $scope.TopProductsbyReportTime();
            }, function (response) {
              console.log(response);
            }
          );


        }

        //first get the item names for both report and compare time period

          var TopProductsRpData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "criteria": "AMT",
            "filters": {
                  "items.mfgId" : [$scope.mfgId]
                }
          }
          productService.GetTopTenProducts(TopProductsRpData).then(function (response) {


            $scope.RTdata=[];
              $scope.RTItemNames=[];
              $scope.RTdeptId=[];
            $scope.RTdeptName=[];

            $scope.RTdata=response.data;

              for(var i=0;i<response.data.length;i++){
                $scope.RTItemNames.push(response.data[i].itemName);
                $scope.RTdeptId.push(response.data[i].deptId);
                $scope.RTdeptName.push(response.data[i].deptName);

              }
              $scope.getTopProducts();
            }, function (response) {

              console.log(response);

            }
          );
        //for compare time period
      }


      $scope.topProductsFunctionByAllRetailer = function () {
          $scope.getTopProductsbycpg = function () {
            $scope.TopProductsbyReportTimeforcpg = function () {
              var data = {
                "aggTimeUnit": "1d",
                "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
                "bucketLevel": "L",
                "bucketType": "name",
                "filters": {
                  "items.mfgId" : [$scope.mfgId],
                  "item.upc": $scope.RTItemNames
                }
              }
              $scope.TopProducts = false;
              dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
               $scope.topProductsbyRT=response.data.data;

                $scope.spinneractive= true;

               if ($scope.spinneractive) {
                 $scope.spin=false;

                 usSpinnerService.stop('spinner-1');

               }

                $scope.alltopDepartments=false;
                $scope.barChartData= [];
                for (var i = 0; i < $scope.topProductsbyRT.length; i++) {

                  $scope.indexvalue=0;

                  for(var j=0; j < $scope.RTdata.length; j++){

                  if($scope.topProductsbyRT[i].id == $scope.RTdata[j].name){

                   // console.log($scope.topProductsbyRT[i].id + " is equal check" + $scope.RTdata[j].name)

                   if($scope.topProductsbyRT[i]&&$scope.topProductsbyCT[i]){


                     if($scope.topProductsbyCT[i].amt>=0){
             $scope.indexvalue = $scope.topProductsbyRT[i].amt / $scope.topProductsbyCT[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
                       var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1": $scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.RTdata[j].itemName,
                    'deptId':$scope.RTdata[j].deptId,
                    'deptName': $scope.RTdata[j].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);

                   }
                   else if($scope.topProductsbyRT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1":0,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.RTdata[j].itemName,
                    'deptId':$scope.RTdata[j].deptId,
                    'deptName': $scope.RTdata[j].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }
                   else if($scope.topProductsbyCT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": 0,
                    "amt1":$scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyCT[i].id,
                    'itemNumber':$scope.RTdata[j].itemName,
                    'deptId':$scope.RTdata[j].deptId,
                    'deptName': $scope.RTdata[j].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }
                }
                  }

                }

                $scope.$applyAsync();
               console.log("bar chart data...",$scope.barChartData);


                 if($scope.barChartData.length>10){
          $scope.chartheightlength=40* $scope.barChartData.length;
          $scope.chartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.barChartData.length>=5){
                    $scope.chartheightlength=45*$scope.barChartData.length;
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.barChartData.length>=2){
                    $scope.chartheightlength=32* ($scope.barChartData.length+2);
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.chartheight="70px";
                  }




                $scope.alltopDepartments=true;
                dashBoardService.setproductscacheData('barChartData',$scope.barChartData);

              }, function (response) {
                console.log(response);
              }
              );
            }

            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataComparestartDate,
              "endTime": $scope.Compareenddate,
              "bucketLevel": "L",
              "bucketType": "name",
              "filters": {
                "items.mfgId" : [$scope.mfgId],
                "item.upc": $scope.RTItemNames
              }
            }
            dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
               $scope.topProductsbyCT=response.data.data;
              $scope.TopProductsbyReportTimeforcpg();
            }, function (response) {
              console.log(response);
            }
            );
          }

        var TopProductsRpData = {
          "aggTimeUnit": "1d",
         "startTime": $scope.ReportstartDate,
              "endTime": $scope.Reportenddate,
          "criteria": "AMT",
          "filters": {
            "items.mfgId" : [$scope.mfgId]
          }
        }
        dashBoardService.GettopPerformersByAllRetailer(TopProductsRpData).then(function (response) {
          $scope.RTdata=[];
              $scope.RTItemNames=[];
              $scope.RTdeptId=[];
            $scope.RTdeptName=[];

            $scope.RTdata=response.data;

              for(var i=0;i<response.data.length;i++){
                $scope.RTItemNames.push(response.data[i].itemName);
                $scope.RTdeptId.push(response.data[i].deptId);
                $scope.RTdeptName.push(response.data[i].deptName);

              }
          $scope.getTopProductsbycpg();
        }, function (response) {
          console.log(response);

        }
        );
      //  }

    }



          sessionStorage.productsSize=100;




      $scope.TopProductsByStoreId = function () {


        if (!$scope.spinneractive) {
          $scope.spin=true;
               usSpinnerService.spin('spinner-1');
               //$scope.startcounter++;
             }

        $scope.getTopProducts=function(){

          $scope.TopProductsbyReportTime=function(){
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "name",
              "filters": {
                "item.upc" : $scope.RTItemNames
              }
            }
            productService.GetSalesPerformanceByStoreId(data).then(function (response) {

                $scope.topProductsbyRT=response.data.data;

                $scope.spinneractive= true;

               if ($scope.spinneractive) {
                 $scope.spin=false;

                 usSpinnerService.stop('spinner-1');

               }
                $scope.alltopDepartments=false;
                $scope.barChartData= [];

                /*for (var i = 0; i < $scope.topProductsbyRT.length; i++) {
                      var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $scope.topProductsbyRT[i].amt,
                        "amt1": $scope.topProductsbyCT[i].amt,
                        'storename': $scope.topProductsbyRT[i].id
                      };
                      $scope.barChartData.push(object);
                }*/

                    //console.log("RTdata...",$scope.RTdata);

                      if( $scope.topProductsbyRT.length>10){
                  $scope.chartheightlength=50* $scope.topProductsbyRT.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }
               else if( $scope.topProductsbyRT.length>=5){
                  $scope.chartheightlength=35* $scope.topProductsbyRT.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }
                 else if( $scope.topProductsbyRT.length>=2){
                  $scope.chartheightlength=35* ($scope.topProductsbyRT.length+2);
                  $scope.chartheight=$scope.chartheightlength+"px";
                }

                else{

                  $scope.chartheight="100px";
                }
                   // console.log("RTProducts...",$scope.topProductsbyRT);
                   // console.log("CTProducts...",$scope.topProductsbyCT);

                    //$scope.toptenproductsRT
                for (var i = 0; i < $scope.topProductsbyRT.length; i++) {


                  $scope.indexvalue=0;



                 // for(var j=0; j < $scope.RTdata.length; j++){

                  //if($scope.topProductsbyRT[i].id == $scope.RTdata[j].name){

                    //console.log($scope.topProductsbyRT[i].id + " is equal check" + $scope.RTdata[j].name)

                   if($scope.topProductsbyRT[i]&&$scope.topProductsbyCT[i]){

                     if($scope.topProductsbyCT[i].amt>=0){
             $scope.indexvalue = $scope.topProductsbyRT[i].amt / $scope.topProductsbyCT[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
                       var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1": $scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.toptenproductsRT[i].itemName,
                    'deptId':$scope.toptenproductsRT[i].deptId,
                    'deptName': $scope.toptenproductsRT[i].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);

                   }
                   else if($scope.topProductsbyRT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1":0,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.toptenproductsRT[i].itemName,
                    'deptId':$scope.toptenproductsRT[i].deptId,
                    'deptName': $scope.toptenproductsRT[i].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }
                   else if($scope.topProductsbyCT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": 0,
                    "amt1":$scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyCT[i].id,
                    'itemNumber':$scope.toptenproductsRT[i].itemName,
                    'deptId':$scope.toptenproductsRT[i].deptId,
                    'deptName': $scope.toptenproductsRT[i].deptName,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }


                  
               // }


                 // }

                }

                  if( $scope.barChartData.length>10){
                  $scope.chartheightlength=50* $scope.barChartData.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }
               else if( $scope.barChartData.length>=5){
                  $scope.chartheightlength=35* $scope.barChartData.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }
                 else if( $scope.barChartData.length>=2){
                  $scope.chartheightlength=35* ($scope.barChartData.length+2);
                  $scope.chartheight=$scope.chartheightlength+"px";
                }

                else{

                  $scope.chartheight="70px";
                }



                $scope.$applyAsync();
                $scope.alltopDepartments=true;
                dashBoardService.setproductscacheData('barChartData',$scope.barChartData);
              }, function (response) {
                console.log(response);
              }
            );
          }

          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "bucketLevel" : "L",
            "bucketType" : "name",
            "filters": {
              "item.upc" : $scope.RTItemNames
            }
          }
          productService.GetSalesPerformanceByStoreId(data).then(function (response) {

              $scope.topProductsbyCT=response.data.data;
              $scope.TopProductsbyReportTime();
            }, function (response) {
              console.log(response);
            }
          );


        }

        //first get the item names for both report and compare time period

        $scope.reportTimetopproduct=function(){
          var TopProductsRpData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "criteria": "AMT"

          }
          productService.GetTopTenProductsByStoreId(TopProductsRpData).then(function (response) {

              $scope.RTItemNames=[];
              $scope.toptenproductsRT=response.data;
            //  console.log("toptenproductsRT,.....",$scope.toptenproductsRT);

              for(var i=0;i<response.data.length;i++){
                $scope.RTItemNames.push(response.data[i].itemName);
              }
              $scope.getTopProducts();
            }, function (response) {

              console.log(response);

            }
          );
        }
        //for compare time period
        var TopProductsCpData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.ComparestartDate,
          "endTime": $scope.Compareenddate,
          "criteria": "AMT"

        }
        productService.GetTopTenProductsByStoreId(TopProductsCpData).then(function (response) {
            $scope.CTItemNames=[];
            for(var i=0;i<response.data.length;i++){
              $scope.CTItemNames.push(response.data[i].itemName);
            }
            $scope.reportTimetopproduct();
            $scope.$applyAsync();
          }, function (response) {
            console.log(response);
          }
        );
      }




$scope.TopProductsByStoreIdforcpg = function () {


        if (!$scope.spinneractive) {
          $scope.spin=true;
               usSpinnerService.spin('spinner-1');
               //$scope.startcounter++;
             }

        $scope.getTopProductsbystoreforcpg=function(){

          $scope.TopProductsbyReportTimebystoreforcpg=function(){
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "name",
              "filters": {
                "item.upc" : $scope.RTItemNames,
                  "items.mfgId" : [$scope.mfgId]
              }
            }
            productService.GetSalesPerformanceByStoreId(data).then(function (response) {

                $scope.topProductsbyRT=response.data.data;

                $scope.spinneractive= true;

               if ($scope.spinneractive) {
                 $scope.spin=false;

                 usSpinnerService.stop('spinner-1');

               }
                $scope.alltopDepartments=false;
                $scope.barChartData= [];

                /*for (var i = 0; i < $scope.topProductsbyRT.length; i++) {
                      var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $scope.topProductsbyRT[i].amt,
                        "amt1": $scope.topProductsbyCT[i].amt,
                        'storename': $scope.topProductsbyRT[i].id
                      };
                      $scope.barChartData.push(object);
                }*/

                    //console.log("RTdata...",$scope.RTdata);

                    //$scope.toptenproductsRT
                for (var i = 0; i < $scope.topProductsbyRT.length; i++) {

                  $scope.indexvalue=0;

                 // for(var j=0; j < $scope.RTdata.length; j++){

                  //if($scope.topProductsbyRT[i].id == $scope.RTdata[j].name){

                    //console.log($scope.topProductsbyRT[i].id + " is equal check" + $scope.RTdata[j].name)

                   if($scope.topProductsbyRT[i]&&$scope.topProductsbyCT[i]){

                     if($scope.topProductsbyCT[i].amt>=0){
             $scope.indexvalue = $scope.topProductsbyRT[i].amt / $scope.topProductsbyCT[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }


                       var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1": $scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.toptenproductsRT[i].itemName,
                    'deptId':$scope.toptenproductsRT[i].deptId,
                    'deptName': $scope.toptenproductsRT[i].deptName,
                     "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);

                   }
                   else if($scope.topProductsbyRT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": $scope.topProductsbyRT[i].amt,
                    "amt1":0,
                    'storename': $scope.topProductsbyRT[i].id,
                    'itemNumber':$scope.toptenproductsRT[i].itemName,
                    'deptId':$scope.toptenproductsRT[i].deptId,
                    'deptName': $scope.toptenproductsRT[i].deptName,
                     "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }
                   else if($scope.topProductsbyCT[i]){
                    var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": 0,
                    "amt1":$scope.topProductsbyCT[i].amt,
                    'storename': $scope.topProductsbyCT[i].id,
                    'itemNumber':$scope.toptenproductsRT[i].itemName,
                    'deptId':$scope.toptenproductsRT[i].deptId,
                    'deptName': $scope.toptenproductsRT[i].deptName,
                     "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };

                 // console.log("check data",object)
                  $scope.barChartData.push(object);
                   }


                  
               // }


                 // }

                }



                $scope.$applyAsync();
                if($scope.barChartData.length>10){
          $scope.chartheightlength=40* $scope.barChartData.length;
          $scope.chartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.barChartData.length>=5){
                    $scope.chartheightlength=45*$scope.barChartData.length;
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.barChartData.length>=2){
                    $scope.chartheightlength=32* ($scope.barChartData.length+2);
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.chartheight="70px";
                  }
                $scope.alltopDepartments=true;
                dashBoardService.setproductscacheData('barChartData',$scope.barChartData);
              }, function (response) {
                console.log(response);
              }
            );
          }

          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "bucketLevel" : "L",
            "bucketType" : "name",
            "filters": {
              "item.upc" : $scope.RTItemNames,
                "items.mfgId" : [$scope.mfgId]
            }
          }
          productService.GetSalesPerformanceByStoreId(data).then(function (response) {

              $scope.topProductsbyCT=response.data.data;
              $scope.TopProductsbyReportTimebystoreforcpg();
            }, function (response) {
              console.log(response);
            }
          );


        }

        //first get the item names for both report and compare time period

        $scope.reportTimetopproduct=function(){
          var TopProductsRpData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "criteria": "AMT",
            "filters":{
                "items.mfgId" : [$scope.mfgId]
            }

          }
          productService.GetTopTenProductsByStoreId(TopProductsRpData).then(function (response) {

              $scope.RTItemNames=[];
              $scope.toptenproductsRT=response.data;
              console.log("toptenproductsRT,.....",$scope.toptenproductsRT);

              for(var i=0;i<response.data.length;i++){
                $scope.RTItemNames.push(response.data[i].itemName);
              }
              $scope.getTopProductsbystoreforcpg();
            }, function (response) {

              console.log(response);

            }
          );
        }
        //for compare time period
        var TopProductsCpData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.ComparestartDate,
          "endTime": $scope.Compareenddate,
          "criteria": "AMT",
          "filters":{
                "items.mfgId" : [$scope.mfgId]
            }

        }
        productService.GetTopTenProductsByStoreId(TopProductsCpData).then(function (response) {
            $scope.CTItemNames=[];
            for(var i=0;i<response.data.length;i++){
              $scope.CTItemNames.push(response.data[i].itemName);
            }
            $scope.reportTimetopproduct();
            $scope.$applyAsync();
          }, function (response) {
            console.log(response);
          }
        );
      }





























      $scope.allproductshow=function(){

        $scope.alltopDepartments=false;
        $scope.barChartData= [];

          sessionStorage.productsSize=1000;
           

        if (!$scope.spinneractive) {
          $scope.spin=true;
               usSpinnerService.spin('spinner-1');
               //$scope.startcounter++;
             }

         if($scope.role=="retailer"){
        $scope.getallTopProducts=function(){

          $scope.TopProductsbyReportTime=function(){
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "name",
              "filters": {
                "item.upc" : $scope.RTItemNames
              }
            }
            productService.GetSalesPerformance(data).then(function (response) {

                $scope.topProductsbyRT=response.data.data;

                $scope.spinneractive= true;

               if ($scope.spinneractive) {

                  $scope.spin=false;
                 usSpinnerService.stop('spinner-1');

               }
                $scope.alltopDepartments=false;
                $scope.barChartData= [];



               

              /* for (var i = 0; i < $scope.topProductsbyRT.length; i++) {
                      var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $scope.topProductsbyRT[i].amt,
                        "amt1": $scope.topProductsbyCT[i].amt,
                        'storename': $scope.topProductsbyRT[i].id
                      };
                      $scope.barChartData.push(object);
                    $scope.alltopDepartments=true;
                    $scope.$applyAsync();
                }*/

                  /* if($scope.topProductsbyRT.length>0){
                     $scope.chartheight="3800px";
                   }*/

                   if($scope.topProductsbyRT.length>0){
                  $scope.chartheightlength=25*$scope.topProductsbyRT.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }


              for (var i = 0; i < $scope.topProductsbyRT.length; i++) {

                 $scope.indexvalue=0;


                for(var j=0; j < $scope.RTdata.length; j++){

                  if($scope.topProductsbyRT[i].id == $scope.RTdata[j].name){

                    //console.log($scope.topProductsbyRT[i].id + " is equal check" + $scope.RTdata[j].name)

                    if($scope.topProductsbyRT[i]&&$scope.topProductsbyCT[i]){


                       if($scope.topProductsbyCT[i].amt>=0){
             $scope.indexvalue = $scope.topProductsbyRT[i].amt / $scope.topProductsbyCT[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }



                      var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $scope.topProductsbyRT[i].amt,
                        "amt1": $scope.topProductsbyCT[i].amt,
                        'storename': $scope.topProductsbyRT[i].id,
                        'itemNumber':$scope.RTdata[j].itemName,
                        'deptId':$scope.RTdata[j].deptId,
                        'deptName': $scope.RTdata[j].deptName,
                         "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                      };

                      // console.log("check data",object)
                      $scope.barChartData.push(object);

                    }
                    else if($scope.topProductsbyRT[i]){
                      var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $scope.topProductsbyRT[i].amt,
                        "amt1":0,
                        'storename': $scope.topProductsbyRT[i].id,
                        'itemNumber':$scope.RTdata[j].itemName,
                        'deptId':$scope.RTdata[j].deptId,
                        'deptName': $scope.RTdata[j].deptName,
                         "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                      };

                      // console.log("check data",object)
                      $scope.barChartData.push(object);
                    }
                    else if($scope.topProductsbyCT[i]){
                      var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": 0,
                        "amt1":$scope.topProductsbyCT[i].amt,
                        'storename': $scope.topProductsbyCT[i].id,
                        'itemNumber':$scope.RTdata[j].itemName,
                        'deptId':$scope.RTdata[j].deptId,
                        'deptName': $scope.RTdata[j].deptName,
                         "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                      };

                      // console.log("check data",object)
                      $scope.barChartData.push(object);

                    }



                  }


                }

              }





             // $scope.barChartData.push(object);
                $scope.$applyAsync();
                $scope.alltopDepartments=true;


              }, function (response) {
                console.log(response);
              }
            );
          }

          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "bucketLevel" : "L",
            "bucketType" : "name",
            "filters": {
              "item.upc" : $scope.RTItemNames
            }
          }
          productService.GetSalesPerformance(data).then(function (response) {

              $scope.topProductsbyCT=response.data.data;
              $scope.TopProductsbyReportTime();
            }, function (response) {
              console.log(response);
            }
          );
        }

          var TopProductsRpData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "criteria": "AMT"
          }
          productService.GetTopTenProducts(TopProductsRpData).then(function (response) {

              /*$scope.RTItemNames=[];
              for(var i=0;i<response.data.length;i++){
                $scope.RTItemNames.push(response.data[i].itemName);
              }
*/

            $scope.RTdata=[];
            $scope.RTItemNames=[];
            $scope.RTdeptId=[];
            $scope.RTdeptName=[];

            $scope.RTdata=response.data;

            for(var i=0;i<response.data.length;i++){
              $scope.RTItemNames.push(response.data[i].itemName);
              $scope.RTdeptId.push(response.data[i].deptId);
              $scope.RTdeptName.push(response.data[i].deptName);

            }




              $scope.getallTopProducts();
            }, function (response) {
              console.log(response);

            }
          );



      }

      else if($scope.role=="cpg"){


          $scope.getallTopProductsforcpg=function(){
          $scope.TopProductsbyReportTimeforcpg=function(){
            var data = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "name",
              "filters": {
                "items.mfgId" : [$scope.mfgId],
                "item.upc" : $scope.RTItemNames
              }
            }
            dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {

                $scope.topProductsbyRT=response.data.data;

                $scope.spinneractive= true;

               if ($scope.spinneractive) {

                  $scope.spin=false;
                 usSpinnerService.stop('spinner-1');

               }
                $scope.alltopDepartments=false;
                $scope.barChartData= [];

              
                 /*if($scope.topProductsbyRT.length>0){
                  $scope.chartheightlength=25*$scope.topProductsbyRT.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }*/


                for (var i = 0; i < $scope.topProductsbyRT.length; i++) {

                   $scope.indexvalue=0;


                 if($scope.topProductsbyRT[i]&&$scope.topProductsbyCT[i]){

                  if($scope.topProductsbyCT[i].amt>=0){
             $scope.indexvalue = $scope.topProductsbyRT[i].amt / $scope.topProductsbyCT[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }



                   var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $scope.topProductsbyRT[i].amt,
                        "amt1": $scope.topProductsbyCT[i].amt,
                        'storename': $scope.topProductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                      };
                      $scope.barChartData.push(object);
                 }
                 else if($scope.topProductsbyRT[i]){
               var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": $scope.topProductsbyRT[i].amt,
                        "amt1": 0,
                        'storename': $scope.topProductsbyRT[i].id,
                        "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                      };
                      $scope.barChartData.push(object);
                 }
                 else if($scope.topProductsbyCT[i]){
                  var object = {
                        "color": "#4C98CF",
                        "color1": "#7F2891",
                        "amt": 0,
                        "amt1": $scope.topProductsbyCT[i].amt,
                        'storename': $scope.topProductsbyCT[i].id,
                        "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                      };
                      $scope.barChartData.push(object);
                 }
                }

                if(scope.barChartData.length>10){
          scope.chartheightlength=40* scope.barChartData.length;
          scope.chartheight=scope.chartheightlength+"px";
                  }
                 else if(scope.barChartData.length>=5){
                    scope.chartheightlength=45*scope.barChartData.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
                   else if(scope.barChartData.length>=2){
                    scope.chartheightlength=32* (scope.barChartData.length+2);
                    scope.chartheight=scope.chartheightlength+"px";
                  }

                  else{

                    $scope.chartheight="70px";
                  }

                $scope.$applyAsync();
                $scope.alltopDepartments=true;
              }, function (response) {
                console.log(response);
              }
            );
          }

          var data = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataComparestartDate,
            "endTime": $scope.Compareenddate,
            "bucketLevel" : "L",
            "bucketType" : "name",
            "filters": {
              "items.mfgId" : [$scope.mfgId],
              "item.upc" : $scope.RTItemNames
            }
          }
          dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {

              $scope.topProductsbyCT=response.data.data;
              $scope.TopProductsbyReportTimeforcpg();
            }, function (response) {
              console.log(response);
            }
          );
        }

          var TopProductsRpData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "criteria": "AMT",
             "filters": {
            "items.mfgId" : [$scope.mfgId]
          }
          }
          dashBoardService.GettopPerformersByAllRetailer(TopProductsRpData).then(function (response) {

              $scope.RTItemNames=[];
              for(var i=0;i<response.data.length;i++){
                $scope.RTItemNames.push(response.data[i].itemName);
              }
              $scope.getallTopProductsforcpg();
            }, function (response) {
              console.log(response);

            }
          );

      }
    }

      $scope.topProductsFunction = function () {

        $scope.topdeptsByReportTime=function(){

          var RTbarChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "deptName"
          }

          productService.GettoptenDepartments(RTbarChartData).then(function (response) {
              $scope.deparmentbarchartData = [];
              for (var i = 0; i < response.data.data.length; i++) {
 
               

                 $scope.indexvalue=0;

                  if($scope.topDepartmentsDatabyCP[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.topDepartmentsDatabyCP[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }

                  var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.topDepartmentsDatabyCP[i].amt,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue

                  };
                  $scope.deparmentbarchartData.push(object);
                
               
              }

               if($scope.deparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.deparmentbarchartData.length;
          $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.deparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.deparmentbarchartData.length;
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.deparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.deparmentbarchartData.length+2);
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.departmentchartheight="70px";
                  }

              $scope.$applyAsync();
            dashBoardService.setproductscacheData('deparmentbarchartData',$scope.deparmentbarchartData);


            }, function (response) {
              console.log(response);
            }
          );
        }

        var CPbarChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "deptName"
        }

        productService.GettoptenDepartments(CPbarChartData).then(function (response) {

            $scope.topDepartmentsDatabyCP=  response.data.data;

            $scope.topdeptsByReportTime();

            $scope.$applyAsync();

          }, function (response) {

            console.log(response);

          }
        );

      }//end of bar chartFunction


      $scope.topProductsFunctionforcpgbyretailer = function () {

        $scope.topdeptsByReportTime=function(){

          var RTbarChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "deptName",
            "filters": {
            "items.mfgId" : [$scope.mfgId]
          }
          }

          productService.GettoptenDepartments(RTbarChartData).then(function (response) {
              $scope.deparmentbarchartData = [];
              for (var i = 0; i < response.data.data.length; i++) {
                
                    $scope.indexvalue=0;

                  if($scope.topDepartmentsDatabyCP[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.topDepartmentsDatabyCP[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
                  var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.topDepartmentsDatabyCP[i].amt,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue

                  };
                  $scope.deparmentbarchartData.push(object);
               
              }

             // console.log("topdepartments...",$scope.deparmentbarchartData);

              if($scope.deparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.deparmentbarchartData.length;
          $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.deparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.deparmentbarchartData.length;
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.deparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.deparmentbarchartData.length+2);
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.departmentchartheight="70px";
                  }

                  // console.log("chart height...",$scope.departmentchartheight);

              $scope.$applyAsync();
            dashBoardService.setproductscacheData('deparmentbarchartData',$scope.deparmentbarchartData);


            }, function (response) {
              console.log(response);
            }
          );
        }

        var CPbarChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "deptName",
          "filters": {
            "items.mfgId" : [$scope.mfgId]
          }
        }

        productService.GettoptenDepartments(CPbarChartData).then(function (response) {

            $scope.topDepartmentsDatabyCP=  response.data.data;

            $scope.topdeptsByReportTime();

            $scope.$applyAsync();

          }, function (response) {

            console.log(response);

          }
        );

      }//end of bar chartFunction




      $scope.GettoptenDepartmentsByAllRetailer = function () {
      $scope.topdeptsByReportTimeforcpg = function () {
        var RTdonutChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel" : "L",
          "filters": {
            "items.mfgId" : [$scope.mfgId]
          },
          "bucketType" : "categoryDesc"
        }

        $scope.showpiechart = false;
        dashBoardService.GettopDepartmentsByAllRetailer(RTdonutChartData).then(function (response) {
$scope.deparmentbarchartData = [];
              for (var i = 0; i < response.data.data.length; i++) {
               

                  $scope.indexvalue=0;

                  if($scope.topDepartmentsDatabyCP[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.topDepartmentsDatabyCP[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }



                  var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.topDepartmentsDatabyCP[i].amt,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.deparmentbarchartData.push(object);
               
              }
              $scope.$applyAsync();

            //  console.log("topdepartments...",$scope.deparmentbarchartData);

              if($scope.deparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.deparmentbarchartData.length;
          $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.deparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.deparmentbarchartData.length;
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.deparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.deparmentbarchartData.length+2);
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.departmentchartheight="70px";
                  }

            console.log("categoris charts data...",$scope.deparmentbarchartData);

            dashBoardService.setproductscacheData('deparmentbarchartData',$scope.deparmentbarchartData);


        }, function (response) {
          console.log(response);
        }
        );
      }

      var CPdonutChartData = {
        "aggTimeUnit": "1d",
        "startTime": $scope.SalesDataComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "L",
        "filters": {
          "items.mfgId" : [$scope.mfgId]
        },
        "bucketType" : "categoryDesc"
      }

      dashBoardService.GettopDepartmentsByAllRetailer(CPdonutChartData).then(function (response) {
            $scope.topDepartmentsDatabyCP=  response.data.data;
        $scope.$applyAsync();
        $scope.topdeptsByReportTimeforcpg();
      }, function (response) {
        console.log(response);
      }
      );

    }

      $scope.TopDepartmentsByStoreId = function () {

        $scope.toDeptsBystoreidReporttime=function(){

          var topDeptDatabyReoprttime = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "deptName"
          }

          productService.GettoptenDepartmentsByStoreId(topDeptDatabyReoprttime).then(function (response) {

              $scope.deparmentbarchartData = [];

              for (var i = 0; i < response.data.data.length; i++) {


                $scope.indexvalue=0;

                  if($scope.topDepartmentsDatabyCP[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.topDepartmentsDatabyCP[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }

                  var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.topDepartmentsDatabyCP[i].amt,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.deparmentbarchartData.push(object);

              }

              if($scope.deparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.deparmentbarchartData.length;
          $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.deparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.deparmentbarchartData.length;
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.deparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.deparmentbarchartData.length+2);
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.departmentchartheight="70px";
                  }

           // console.log("chart height...",$scope.departmentchartheight);



              $scope.$applyAsync();
              dashBoardService.setproductscacheData('deparmentbarchartData',$scope.deparmentbarchartData);

            }, function (response) {

              console.log(response);

            }
          );

        }

        var topDeptDatabyComparetime = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "deptName"
        }

        productService.GettoptenDepartmentsByStoreId(topDeptDatabyComparetime).then(function (response) {
            $scope.topDepartmentsDatabyCP=  response.data.data;
            $scope.toDeptsBystoreidReporttime();

            $scope.$applyAsync();


          }, function (response) {

            console.log(response);

          }
        );

      }




      $scope.TopDepartmentsByStoreIdforcpg = function () {

        $scope.toDeptsBystoreidReporttimeforcpg=function(){

          var topDeptDatabyReoprttime = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "deptName",
             "filters": {
            "items.mfgId" : [$scope.mfgId]
          }
          }

          productService.GettoptenDepartmentsByStoreId(topDeptDatabyReoprttime).then(function (response) {

              $scope.deparmentbarchartData = [];

              for (var i = 0; i < response.data.data.length; i++) {


                $scope.indexvalue=0;

                  if($scope.topDepartmentsDatabyCP[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.topDepartmentsDatabyCP[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }

                  var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.topDepartmentsDatabyCP[i].amt,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.deparmentbarchartData.push(object);

              }

               if($scope.deparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.deparmentbarchartData.length;
          $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.deparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.deparmentbarchartData.length;
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.deparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.deparmentbarchartData.length+2);
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.departmentchartheight="70px";
                  }

          //console.log("chart height...",$scope.departmentchartheight);
        


              $scope.$applyAsync();
              dashBoardService.setproductscacheData('deparmentbarchartData',$scope.deparmentbarchartData);

            }, function (response) {

              console.log(response);

            }
          );

        }

        var topDeptDatabyComparetime = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "deptName",
           "filters": {
            "items.mfgId" : [$scope.mfgId]
          }
        }

        productService.GettoptenDepartmentsByStoreId(topDeptDatabyComparetime).then(function (response) {
            $scope.topDepartmentsDatabyCP=  response.data.data;
            $scope.toDeptsBystoreidReporttimeforcpg();

            $scope.$applyAsync();


          }, function (response) {

            console.log(response);

          }
        );

      }



























       $scope.ctrl = {
              'treeData':[],
              'treeDropdownstatus':false,
              'selected': {
                "id": 1,
                "name": "All",
                "retailerId":"All"

              }
            };

            $scope.ctrl.treeData = [
            {
              "id": 1,
              "name": "All",
              "retailerId":"All"
            }
            ]

             $scope.ctrl.treeData1 = [
            {
              "id": 1,
              "name": "All",
              "retailerId":"All"

            }
            ]

            $rootScope.selected={"id": 1,
            "name": "All",
            "retailerId":"All"};

            $scope.savedvalue=dashBoardService.getsavestoreselected();

            console.log("already saved value....",$scope.savedvalue);

            if($scope.savedvalue==null){
                 $scope.defaultstoreselected=$rootScope.selected;
            dashBoardService.setsavestoreselected($scope.defaultstoreselected);
            }


            $scope.retailerList=[];
            $scope.collection1=[{
              "id":1,
              "name":"All",
              "retailername":"All",
              "retailerId":"All"
            }]
            $scope.storesByRetailer=[{
              "normalId":1,
              "id":1,
              "name":"All",
              "retailername":"All",
              "retailerId":"All"
            }]


            $scope.id=2;
            $scope.ctrl.treeDropdownstatus=false;
            $scope.makeStoresList=function(retailerid,retailerName,status){
              dashBoardService.getStoreListBasedonretailer().then(function (response) {

                $scope.storesList=response.data;

                var storesssobject={
                 "id":   $scope.id,
                 "name": retailerName,
                 "retailerId":retailerid,
                 "children": [],
               }

               for(var j=0;j<$scope.storesList.length;j++){
                 var id=$scope.storesByRetailer.length+1;
                 $scope.id=$scope.id+1;
                 var object={
                   "id":$scope.id ,
                   "name":$scope.storesList[j].store_name,
                   "storeid":$scope.storesList[j].store_id,
                   "retailerId":retailerid
                 }
                 $scope.storesByRetailer.push(object);
                 storesssobject.children.push(object);

               }

               $scope.id=$scope.id+1;
               $scope.storesByRetailer.push(object);

               $scope.selectedOption = $scope.storesByRetailer[0];
               $scope.ctrl.treeData1.push(storesssobject);
               $scope.ctrl.treeDropdownstatus=false;

                var index=$scope.retailerData.length-1;

                 if($scope.retailerData[index].retailer_name==retailerName){

                   $timeout(function(){
                    $scope.arrayid=1;

                  for(var i=0;i<$scope.retailerData.length;i++){
                    var findretailer=$filter('filter')($scope.ctrl.treeData1, 
                    {name : $scope.retailerData[i].retailer_name}, true);
                    $scope.arrayid=$scope.arrayid+1;
                    findretailer[0].id=$scope.arrayid;
                    for(var j=0;j<findretailer[0].children.length;j++){

                         $scope.arrayid=$scope.arrayid+1;
                      findretailer[0].children[j].id=$scope.arrayid;
                    }
                   
                         $scope.ctrl.treeData.push(findretailer[0]);
                  }
                  
                      $scope.ctrl.treeDropdownstatus=true;
                        },1400);

                }
              

           

             }, function (response) {
              console.log(response);
            }
            );
            }

             $scope.allapicalled=false;

            $scope.getStoresByRetailer=function(){

              for (var i = 0; i < $scope.retailerData.length;i++) {
                $scope.retailerList.push($scope.retailerData[i]);
                sessionStorage.retailer=$scope.retailerData[i].retailer_id;
                if(i==$scope.retailerData.length-1){

                $scope.allapicalled=true;
              }
              else{
                 $scope.allapicalled=false;
              }
                $scope.makeStoresList($scope.retailerData[i].retailer_id,$scope.retailerData[i].retailer_name,$scope.allapicalled);

              }

            }


            $scope.getAllRetailers=function(){
              dashBoardService.GetAllRetailers().then(function (response) {
               $scope.retailerData=response.data;

               $scope.getStoresByRetailer();
             }, function (response) {
              console.log(response);

            }
            );
            }

      /*********************END product screen ************************/

      /******************** screen Departments  ***********/

      $scope.donutChartFunction = function () {

        $scope.donutChartHandlerforRT=function () {

          var donutChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "deptName"
          }


          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

          $scope.showpiechart=false;
          productService.GetSalesPerformance(donutChartData).then(function (response) {
              var count=0;

            $scope.spinneractive= true;

            if ($scope.spinneractive) {

              $scope.spin=false;
              usSpinnerService.stop('spinner-1');

            }
              $scope.total = '$' + response.data.total;
              $scope.donutchartData = [];

              $scope.piechartid= dashBoardService.generateguid();


              for (var i = 0; i < response.data.data.length; i++) {
                if(i<10) {
                  var object = {"percent": response.data.data[i].amt, 
                  "title": response.data.data[i].id ,
                    "id": $scope.dountcharid[i].id};
                  $scope.donutchartData.push(object);
                }else{
                  count = response.data.data[i].amt+count;
                }
                var object = {"percent": count, "title": "Others"};
                $scope.donutchartData.push(object);


              }

              console.log("donutchart data..",$scope.donutchartData);
              $scope.$applyAsync();
              $scope.showpiechart=true;

              //  $scope.SalesPerformance=true;
            }, function (response) {

            }
          );

        }

        var donutChartData = {
          "aggTimeUnit": "1d",
         "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "deptId"
        }


        $scope.showpiechart=false;
        productService.GetSalesPerformance(donutChartData).then(function (response) {
            var count=0;
            $scope.total = '$' + response.data.total;

            $scope.dountcharid=response.data.data;

          //  console.log("for Id",response.data);

          $scope.donutChartHandlerforRT();

            $scope.$applyAsync();
            $scope.showpiechart=true;

          }, function (response) {

          }
        );

      }


       $scope.donutChartFunctionforcpgbyretailer = function () {

        $scope.donutChartHandlerforRT=function () {

          var donutChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "categoryDesc",
             "filters": {
                  "items.mfgId" : [$scope.mfgId],
                }
          }


          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

          $scope.showpiechart=false;
          productService.GetSalesPerformance(donutChartData).then(function (response) {
              var count=0;

            $scope.spinneractive= true;

            if ($scope.spinneractive) {

              $scope.spin=false;
              usSpinnerService.stop('spinner-1');

            }
              $scope.total = '$' + response.data.total;
              $scope.donutchartData = [];

              $scope.piechartid= dashBoardService.generateguid();

              $scope.donutcharttotalbyRT=parseFloat(response.data.total);

               if($scope.donutcharttotalbyCP>0){
                $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotalbyCP;
                $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
               }
               else{
                  $scope.donutchartindex=0.00;

                  $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          
               }

               console.log("RT total....",response.data.total);

               console.log("chart index...", $scope.donutchartindex);


              for (var i = 0; i < response.data.data.length; i++) {
             
                  var object = {
                    "percent": response.data.data[i].amt,
                     "title": response.data.data[i].id 
                  
                  };
                  $scope.donutchartData.push(object);
              
              }
              $scope.$applyAsync();
              $scope.showpiechart=true;

              //  $scope.SalesPerformance=true;
            }, function (response) {

            }
          );

        }

        var donutChartData = {
          "aggTimeUnit": "1d",
         "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "categoryDesc",
           "filters": {
                  "items.mfgId" : [$scope.mfgId],
                }
        }


        $scope.showpiechart=false;
        productService.GetSalesPerformance(donutChartData).then(function (response) {
            var count=0;
            $scope.total = '$' + response.data.total;

            $scope.dountcharid=response.data.data;

             $scope.donutcharttotalbyCP=parseFloat(response.data.total);
           

           console.log("for CT total",response.data.total);

          $scope.donutChartHandlerforRT();

            $scope.$applyAsync();
            $scope.showpiechart=true;

          }, function (response) {

          }
        );

      }




      $scope.donutChartFunctionforcpg = function () {

        $scope.donutChartHandlerforRTforcpg=function () {

          var donutChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "categoryDesc",
             "filters": {
                  "items.mfgId" : [$scope.mfgId],
                }
          }


          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

          $scope.showpiechart=false;
          dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(donutChartData).then(function (response) {
              var count=0;

            $scope.spinneractive= true;

            if ($scope.spinneractive) {

              $scope.spin=false;
              usSpinnerService.stop('spinner-1');

            }
              $scope.total = '$' + response.data.total;
              $scope.donutchartData = [];
               $scope.donutcharttotalbyRT=parseFloat(response.data.total);

               if($scope.donutcharttotalbyCP>0){
                $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotalbyCP;
                $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
               }
               else{
                  $scope.donutchartindex=0.00;

                  $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          
               }

                console.log("RT total....",response.data.total);

               console.log("donut chart index...",$scope.donutchartindex);
           

              $scope.piechartid= dashBoardService.generateguid();


              for (var i = 0; i < response.data.data.length; i++) {
               
                  var object = {
                    "percent": response.data.data[i].amt,
                     "title": response.data.data[i].id 
                    
                  };
                  $scope.donutchartData.push(object);
               
              }
              $scope.$applyAsync();
              $scope.showpiechart=true;

                console.log("donutchart data..",$scope.donutchartData);


              //  $scope.SalesPerformance=true;
            }, function (response) {

            }
          );

        }

        var donutChartData = {
          "aggTimeUnit": "1d",
         "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "categoryDesc",
          "filters": {
                  "items.mfgId" : [$scope.mfgId],
            }
        }


        $scope.showpiechart=false;
        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(donutChartData).then(function (response) {
            var count=0;
            $scope.total = '$' + response.data.total;

            $scope.dountcharid=response.data.data;
            $scope.donutcharttotalbyCP=parseFloat(response.data.total);

             console.log("for CT total",response.data.total);


          $scope.donutChartHandlerforRTforcpg();

            $scope.$applyAsync();
            $scope.showpiechart=true;

          }, function (response) {

          }
        );

      }





      $scope.donutChartFunctionbyStoreIdforcpg = function () {

        $scope.donutChartstore=function () {

         
        var donutChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "categoryDesc",
           "filters": {
                  "items.mfgId" : [$scope.mfgId],
            }
        }


          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

        $scope.showpiechart=false;
        productService.GetSalesPerformanceByStoreId(donutChartData).then(function (response) {
            var count=0;

          $scope.spinneractive= true;

          if ($scope.spinneractive) {

            $scope.spin=false;
            usSpinnerService.stop('spinner-1');

          }

            $scope.total = '$' + response.data.total;
            //  $scope.SalesPerformance=false;
            $scope.donutchartData = [];
            console.log("RT total....",response.data.total);

            $scope.donutcharttotalbyRT=parseFloat(response.data.total);

               if($scope.donutcharttotalbyCP>0){
                $scope.donutchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotalbyCP;
                $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
               
               console.log("donut chart index...",$scope.donutchartindex);

               }
               else{
                  $scope.donutchartindex=0.00;
                  $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
               }

                

               console.log("donut chart index...",$scope.donutchartindex);

            $scope.piechartid= dashBoardService.generateguid();

            for (var i = 0; i < response.data.data.length; i++) {
            
                var object = {
                  "percent": response.data.data[i].amt,
                   "title": response.data.data[i].id
                  };
                $scope.donutchartData.push(object);
            }
            $scope.$applyAsync();
            $scope.showpiechart=true;

          }, function (response) {

          }
        );


      }

        var donutChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "categoryDesc",
           "filters": {
                  "items.mfgId" : [$scope.mfgId],
            }
        }

       // $scope.showpiechart=false;
        productService.GetSalesPerformanceByStoreId(donutChartData).then(function (response) {
            var count=0;
            $scope.total = '$' + response.data.total;
            $scope.donutcharttotalbyCP=parseFloat(response.data.total);
          $scope.storedountcharid=response.data.data;
            console.log("for CT total",response.data.total);
          $scope.donutChartstore();
            $scope.$applyAsync();

          }, function (response) {

          }
        );
      }








      $scope.donutChartFunctionbyStoreId = function () {

        $scope.donutChartstore=function () {

         
        var donutChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "deptName"
        }


          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

        $scope.showpiechart=false;
        productService.GetSalesPerformanceByStoreId(donutChartData).then(function (response) {
            var count=0;

          $scope.spinneractive= true;

          if ($scope.spinneractive) {

            $scope.spin=false;
            usSpinnerService.stop('spinner-1');

          }

            $scope.total = '$' + response.data.total;
            //  $scope.SalesPerformance=false;
            $scope.donutchartData = [];

            $scope.piechartid= dashBoardService.generateguid();

            $scope.donutcharttotalbyRT=parseFloat(response.data.total);

               if($scope.donutcharttotalbyCP>0){
                $scope.donuctchartindex=$scope.donutcharttotalbyRT/$scope.donutcharttotalbyCP;
                $scope.donuctchartindex=$scope.donuctchartindex.toFixed(2);
               }
               else{
                  $scope.donutchartindex=0.00;

                  $scope.donutchartindex=$scope.donutchartindex.toFixed(2);
          
               }

                console.log("RT total....",response.data.total);

               console.log("donut chart index...",$scope.donutchartindex);


            for (var i = 0; i < response.data.data.length; i++) {
              if(i<10) {
                var object = {"percent": response.data.data[i].amt, "title": response.data.data[i].id,
                  "id":$scope.storedountcharid[i].id};

                $scope.donutchartData.push(object);
              }else{
                count = response.data.data[i].amt+count;
              }
              var object = {"percent": count, "title": "Others"};
              $scope.donutchartData.push(object);
            }
            $scope.$applyAsync();
            $scope.showpiechart=true;

          }, function (response) {

          }
        );


      }

        var donutChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "deptId"
        }

       // $scope.showpiechart=false;
        productService.GetSalesPerformanceByStoreId(donutChartData).then(function (response) {
            var count=0;
            $scope.total = '$' + response.data.total;

          $scope.storedountcharid=response.data.data;

          $scope.donutChartstore();
          //  $scope.SalesPerformance=false;

            $scope.$applyAsync();
           // $scope.showpiechart=true;

          }, function (response) {

          }
        );
      }

      $scope.alltopProductsFunction = function () {


        $scope.alltopdeptsByReportTime=function(){

          var RTbarChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "deptName"
          }

          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

          productService.GetSalesPerformance(RTbarChartData).then(function (response) {
              $scope.alldeparmentbarchartData = [];


            $scope.spinneractive= true;

            if ($scope.spinneractive) {

              $scope.spin=false;
              usSpinnerService.stop('spinner-1');

            }


              for (var i = 0; i < response.data.data.length; i++) {
                if(i<24){

               $scope.indexvalue=0;
                if($scope.alltopDepartmentsDatabyCP[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.alltopDepartmentsDatabyCP[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }

                  var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.alltopDepartmentsDatabyCP[i].amt,
                    "id": $scope.alltopDepartmentsDatabyCP[i].id,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.alldeparmentbarchartData.push(object);
                
              }
            }

            if($scope.alldeparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.alldeparmentbarchartData.length;
          $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.alldeparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.alldeparmentbarchartData.length;
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.alldeparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.alldeparmentbarchartData.length+2);
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.alldepartmentchartheight="70px";
                  }
              $scope.$applyAsync();

            }, function (response) {
              console.log(response);
            }
          );
        }

        var CPbarChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "deptId"
        }

        productService.GetSalesPerformance(CPbarChartData).then(function (response) {

            $scope.alltopDepartmentsDatabyCP=  response.data.data;

          //  console.log("Id of bar chart",$scope.alltopDepartmentsDatabyCP)

            $scope.alltopdeptsByReportTime();

            $scope.$applyAsync();

          }, function (response) {

            console.log(response);

          }
        );

      }


       $scope.alltopProductsFunctionforcpgbyretailer = function () {


        $scope.alltopdeptsByReportTime=function(){

          var RTbarChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "categoryDesc",
             "filters": {
                  "items.mfgId" : [$scope.mfgId],
            }
          }

          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

          productService.GetSalesPerformance(RTbarChartData).then(function (response) {
              $scope.alldeparmentbarchartData = [];


            $scope.spinneractive= true;

            if ($scope.spinneractive) {

              $scope.spin=false;
              usSpinnerService.stop('spinner-1');

            }

         console.log("Rp data....",response.data.data)



              for (var i =0;i<response.data.data.length; i++) {

                $scope.indexvalue=0;
               
               // console.log("i value..."+i);
                if(response.data.data[i]&&$scope.alltopDepartmentsDatabyCPforbarchart[i]){
                     

                     if($scope.alltopDepartmentsDatabyCPforbarchart[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.alltopDepartmentsDatabyCPforbarchart[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
                
                  var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.alltopDepartmentsDatabyCPforbarchart[i].amt,
                    "id":   $scope.alltopDepartmentsDatabyCPforbarchart[i].id,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.alldeparmentbarchartData.push(object);

                }

                else if(response.data.data[i]){
                       var object = {
                    "color": "#ba5bbb",
                    "color1": "#428DB6",
                    "amt": response.data.data[i].amt,
                    "amt1": 0,
                    "id":response.data.data[i]. id,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.alldeparmentbarchartData.push(object);
                  }
                  else if($scope.alltopDepartmentsDatabyCPforbarchart[i]){
                  var object = {
                    "color": "#ba5bbb",
                    "color1": "#428DB6",
                    "amt": 0,
                    "amt1": $scope.alltopDepartmentsDatabyCPforbarchart[i].amt,
                    "id":   $scope.alltopDepartmentsDatabyCPforbarchart[i].id,
                    'storename': $scope.alltopDepartmentsDatabyCPforbarchart[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.alldeparmentbarchartData.push(object);

                  }


                 
              }


               if($scope.alldeparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.alldeparmentbarchartData.length;
          $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.alldeparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.alldeparmentbarchartData.length;
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.alldeparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.alldeparmentbarchartData.length+2);
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.alldepartmentchartheight="70px";
                  }
              $scope.$applyAsync();

            }, function (response) {
              console.log(response);
            }
          );
        }

        var CPbarChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "categoryDesc",
           "filters": {
                  "items.mfgId" : [$scope.mfgId],
            }
        }

        productService.GetSalesPerformance(CPbarChartData).then(function (response) {

            $scope.alltopDepartmentsDatabyCPforbarchart=  response.data.data;

          console.log("cp data....",$scope.alltopDepartmentsDatabyCP)

            $scope.alltopdeptsByReportTime();

            $scope.$applyAsync();

          }, function (response) {

            console.log(response);

          }
        );

      }




      $scope.alltopProductsFunctionforcpg = function () {


        $scope.alltopdeptsByReportTimeforcpg=function(){

          var RTbarChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "categoryDesc",
             "filters": {
                  "items.mfgId" : [$scope.mfgId],
            }
          }

          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

          dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(RTbarChartData).then(function (response) {
              $scope.alldeparmentbarchartData = [];


            $scope.spinneractive= true;

            if ($scope.spinneractive) {

              $scope.spin=false;
              usSpinnerService.stop('spinner-1');

            }


              for (var i =0;i<response.data.data.length; i++) {

                $scope.indexvalue=0;
               
               // console.log("i value..."+i);
                if(response.data.data[i]&& $scope.alltopDepartmentsDatabyCPforbarchart[i]){
                     

                     if($scope.alltopDepartmentsDatabyCPforbarchart[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.alltopDepartmentsDatabyCPforbarchart[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }



                     var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.alltopDepartmentsDatabyCPforbarchart[i].amt,
                    "id":   $scope.alltopDepartmentsDatabyCPforbarchart[i].id,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.alldeparmentbarchartData.push(object);

                }

                else if(response.data.data[i]){
                       var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": 0,
                    "id":response.data.data[i]. id,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.alldeparmentbarchartData.push(object);
                  }
                  else if($scope.alltopDepartmentsDatabyCPforbarchart[i]){
                  var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": 0,
                    "amt1": $scope.alltopDepartmentsDatabyCPforbarchart[i].amt,
                    "id":   $scope.alltopDepartmentsDatabyCPforbarchart[i].id,
                    'storename': $scope.alltopDepartmentsDatabyCPforbarchart[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.alldeparmentbarchartData.push(object);

                  }


                 
              }

               if($scope.alldeparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.alldeparmentbarchartData.length;
          $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.alldeparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.alldeparmentbarchartData.length;
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.alldeparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.alldeparmentbarchartData.length+2);
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.alldepartmentchartheight="70px";
                  }
              $scope.$applyAsync();

            }, function (response) {
              console.log(response);
            }
          );
        }

        var CPbarChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "categoryDesc",
           "filters": {
                  "items.mfgId" : [$scope.mfgId],
            }
        }

        dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(CPbarChartData).then(function (response) {

            $scope.alltopDepartmentsDatabyCPforbarchart= response.data.data;

          //console.log("Id of bar chart",$scope.alltopDepartmentsDatabyCPforbarchart);

            $scope.alltopdeptsByReportTimeforcpg();

            $scope.$applyAsync();

          }, function (response) {

            console.log(response);

          }
        );

      }


      $scope.alltopProductsFunctionbyStoreIdforcpg = function () {
        $scope.alltopdeptsByReportTime=function(){

          var RTbarChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "categoryDesc",
            "filters": {
                  "items.mfgId" : [$scope.mfgId],
            }
          }


          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

          productService.GetSalesPerformanceByStoreId(RTbarChartData).then(function (response) {
              $scope.alldeparmentbarchartData = [];

            $scope.spinneractive= true;

            if ($scope.spinneractive) {

              $scope.spin=false;
              usSpinnerService.stop('spinner-1');

            }


              for (var i = 0; i < response.data.data.length; i++) {

                $scope.indexvalue=0;


                if($scope.alltopDepartmentsDatabyCPforbarchart[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.alltopDepartmentsDatabyCPforbarchart[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
                
                  var object = {
                    "color": "#ba5bbb",
                    "color1": "#428DB6",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.alltopDepartmentsDatabyCPforbarchart[i].amt,
                    "id": $scope.alltopDepartmentsDatabyCPforbarchart[i].id,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.alldeparmentbarchartData.push(object);
                
              }

               if($scope.alldeparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.alldeparmentbarchartData.length;
          $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.alldeparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.alldeparmentbarchartData.length;
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.alldeparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.alldeparmentbarchartData.length+2);
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.alldepartmentchartheight="70px";
                  }
              $scope.$applyAsync();

            }, function (response) {
              console.log(response);
            }
          );
        }

        var CPbarChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "categoryDesc",
          "filters": {
                  "items.mfgId" : [$scope.mfgId],
            }
        }

        productService.GetSalesPerformanceByStoreId(CPbarChartData).then(function (response) {

            $scope.alltopDepartmentsDatabyCPforbarchart=  response.data.data;

            $scope.alltopdeptsByReportTime();

            $scope.$applyAsync();

          }, function (response) {

            console.log(response);

          }
        );


      }



      $scope.alltopProductsFunctionbyStoreId = function () {
        $scope.alltopdeptsByReportTime=function(){

          var RTbarChartData = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "deptName"
          }


          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

          productService.GetSalesPerformanceByStoreId(RTbarChartData).then(function (response) {
              $scope.alldeparmentbarchartData = [];

            $scope.spinneractive= true;

            if ($scope.spinneractive) {

              $scope.spin=false;
              usSpinnerService.stop('spinner-1');

            }


              for (var i = 0; i < response.data.data.length; i++) {

                $scope.indexvalue=0;


                if($scope.alltopDepartmentsDatabyCP[i].amt>=0){
             $scope.indexvalue = response.data.data[i].amt / $scope.alltopDepartmentsDatabyCP[i].amt;
               $scope.indexvalue=$scope.indexvalue.toFixed(2);
             }
                
                  var object = {
                    "color": "#4C98CF",
                    "color1": "#7F2891",
                    "amt": response.data.data[i].amt,
                    "amt1": $scope.alltopDepartmentsDatabyCP[i].amt,
                    "id": $scope.alltopDepartmentsDatabyCP[i].id,
                    'storename': response.data.data[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime,
                    "Index":$scope.indexvalue
                  };
                  $scope.alldeparmentbarchartData.push(object);
                
              }

               if($scope.alldeparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.alldeparmentbarchartData.length;
          $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.alldeparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.alldeparmentbarchartData.length;
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.alldeparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.alldeparmentbarchartData.length+2);
                    $scope.alldepartmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.alldepartmentchartheight="70px";
                  }
              $scope.$applyAsync();

            }, function (response) {
              console.log(response);
            }
          );
        }

        var CPbarChartData = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataComparestartDate,
          "endTime": $scope.Compareenddate,
          "bucketLevel": "L",
          "bucketType": "deptName"
        }

        productService.GetSalesPerformanceByStoreId(CPbarChartData).then(function (response) {

            $scope.alltopDepartmentsDatabyCP=  response.data.data;

            $scope.alltopdeptsByReportTime();

            $scope.$applyAsync();

          }, function (response) {

            console.log(response);

          }
        );


      }

      /**************************END********************************/


      /* ******   start screen individual product  ******** */

      $scope.ListdeptProduct = [];

      $scope.selectdepartmentProducts = function () {

        $scope.listproducts=function () {

          var DataName = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "deptName"
          }

          productService.GetSalesPerformance(DataName).then(function (response) {
              var count=0;
              $scope.total = '$' + response.data.total;


              for (var i = 0; i < response.data.data.length; i++) {
                // if(i<10) {
                var object = {"amount": response.data.data[i].amt, "Name": response.data.data[i].id ,
                  "id": $scope.listdeptproductname[i].id };

                $scope.ListdeptProduct.push(object);


              }

            $scope.$applyAsync();

            $scope.showpiechart=true;
            //  $scope.SalesPerformance=true;
            }, function (response) {

            }
          );

        }

        var DataId = {
          "aggTimeUnit": "1d",
          "startTime": $scope.SalesDataReportstartDate,
          "endTime": $scope.Reportenddate,
          "bucketLevel": "L",
          "bucketType": "deptId"
        }

        productService.GetSalesPerformance(DataId).then(function (response) {
            var count=0;
            $scope.total = '$' + response.data.total;
            $scope.ListdeptProductid = [];

            $scope.listdeptproductname=response.data.data;


            $scope.listproducts();
            $scope.$applyAsync();
            $scope.showpiechart=true;

          }, function (response) {

          }
        );

      }



      /* *************************************** End screen 4 & 5 ******************************************************/





      //dateRangePicker for CompareTimePeriod


      $scope.comparestart=  dashBoardService.getcomparestartdate();

if($scope.comparestart==undefined){

 /*var Reportenddate = moment("2016-11-30");
 var ReportstartDate = moment("2016-11-01");

    var compareEnd=moment(Reportenddate).subtract(1,'year');
    var compareStart=moment(ReportstartDate).subtract(1,'year');
*/

var ReportstartDate= moment().subtract(7, 'days');
    var Reportenddate=moment().subtract(1, 'days');

  var  compareEnd=moment(ReportstartDate).subtract(1,'days');
  var  compareStart=moment(ReportstartDate).subtract(7,'days');




   //var compareEnd = moment("2016-08-31");
   //var compareStart  = moment("2016-08-01");

}
else{
  var compareStart= dashBoardService.getcomparestartdate();
    var compareEnd=dashBoardService.getcompareenddate();
  var ReportstartDate=  dashBoardService.getreportstartdate();
    var Reportenddate=dashBoardService.getreportenddate();

}



    //  var end = moment().subtract(20, 'days');;
      //var start = moment().subtract(22, 'days');

      var end = moment(compareEnd);
      var start = moment(compareStart);


                var selectedId;

                $scope.data={
                 selectedStoreId:''
                }


      function cmpareProduct(start, end) {

        startDate = start;
        endDate = end;

        $scope.ComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Compareenddate = endDate.format('YYYYMMDD') + 'T235959.000-0000';
  $scope.SalesDataComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';

            compareStart=start;
            compareEnd=end;

        dashBoardService.setcomparestartdate(start);
        dashBoardService.setcompareenddate(end);
        dashBoardService.setreportstartdate(ReportstartDate);
        dashBoardService.setreportenddate(Reportenddate);

        dashBoardService.setdashboardcacheStaus(false);
        dashBoardService.setproductscacheStatus(false);
        dashBoardService.setsalesregioncacheStatus(false);

        $scope.compareTimePeriod = startDate.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');


        $scope.totalcomparetime=startDate.format('MMM Do YYYY')+"-"+endDate.format('MMM Do YYYY');

        if($scope.role=="cpg"){
  $scope.selecteRecord=   dashBoardService.getselectedrecordfromdropdown();


              if($scope.selecteRecord){
          if($scope.selecteRecord.name=="All"){
             $scope.topProductsFunctionByAllRetailer();
         $scope.GettoptenDepartmentsByAllRetailer();
         }
         else{
          if($scope.selecteRecord.hasOwnProperty("children")){
           sessionStorage.user=$scope.selecteRecord.retailerId;
           $scope.retailerid=$scope.selecteRecord.retailerId;

          $scope.topPerformersFunctionforcpgbyretailer();
          $scope.topProductsFunctionforcpgbyretailer();
         }
         else{

          sessionStorage.user=$scope.selecteRecord.retailerId;
          $scope.storeId = $scope.selecteRecord.storeid;
          sessionStorage.storeId = $scope.storeId;

          $scope.TopProductsByStoreId();
            $scope.TopDepartmentsByStoreId();
        }
      }
    }
    else {
       $scope.topPerformersFunction();
          $scope.topProductsFunction();
    }

        }
        else if($scope.role=="retailer"){
$scope.storeid=dashBoardService.getstoreid();
        if($scope.storeid!=null&&$scope.storeid!=undefined){
          sessionStorage.storeId = $scope.storeid;
          $timeout(function() {

            $scope.TopProductsByStoreId();
            $scope.TopDepartmentsByStoreId();
          },0);
        }
        else{
          $scope.topPerformersFunction();
          $scope.topProductsFunction();
        }
        $scope.$applyAsync();
        dashBoardService.setproductscacheStatus(true);

        }





        
      }


      function cmpareDepartment(start, end) {

        startDate = start;
        endDate = end;

        $scope.ComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Compareenddate = endDate.format('YYYYMMDD') + 'T235959.000-0000';
  $scope.SalesDataComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';


            compareStart=start;
            compareEnd=end;


        dashBoardService.setcomparestartdate(start);
        dashBoardService.setcompareenddate(end);
        dashBoardService.setreportstartdate(ReportstartDate);
        dashBoardService.setreportenddate(Reportenddate);

        dashBoardService.setdashboardcacheStaus(false);
        dashBoardService.setproductscacheStatus(false);
        dashBoardService.setsalesregioncacheStatus(false);

        $scope.compareTimePeriod = startDate.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');

        $scope.totalcomparetime=startDate.format('MMM Do YYYY')+"-"+endDate.format('MMM Do YYYY');


          if($scope.role=="retailer"){
        $scope.storeid=dashBoardService.getstoreid();
        if($scope.storeid!=null&&$scope.storeid!=undefined&&$scope.storeid!=""){
          sessionStorage.storeId = $scope.storeid;

          $timeout(function() {

            $scope.alltopProductsFunctionbyStoreId();
            $scope.donutChartFunctionbyStoreId();
          },0);


        }
        else {


        if ($scope.data.selectedStoreId == 'allStores'||$scope.data.selectedStoreId==undefined) {

          //$scope.SalesPerformanceByAllstores();
          $scope.donutChartFunction();
          $scope.alltopProductsFunction();
        }
        else {
          $scope.storeId = $scope.data.selectedStoreId;
          sessionStorage.storeId = $scope.storeId;
          $timeout(function() {

            $scope.alltopProductsFunctionbyStoreId();
            $scope.donutChartFunctionbyStoreId();
          },0);

        }
      }
      }
      else if($scope.role=="cpg"){
       // console.log("coming to if....");

$scope.selecteRecord=   dashBoardService.getselectedrecordfromdropdown();


             if($scope.selecteRecord){


          if($scope.selecteRecord.name=="All"){
              $scope.donutChartFunctionforcpg();
        $scope.alltopProductsFunctionforcpg();
         }
         else{
          if($scope.selecteRecord.hasOwnProperty("children")){
           sessionStorage.user=$scope.selecteRecord.retailerId;
           $scope.retailerid=$scope.selecteRecord.retailerId;

        $scope.donutChartFunctionforcpgbyretailer();
        $scope.alltopProductsFunctionforcpgbyretailer();
         }
         else{

          sessionStorage.user=$scope.selecteRecord.retailerId;
          $scope.storeId = $scope.selecteRecord.storeid;
          sessionStorage.storeId = $scope.storeId;

          $scope.alltopProductsFunctionbyStoreId();
            $scope.donutChartFunctionbyStoreId();
        }
      }
    }
    else{
      $scope.donutChartFunctionforcpg();
        $scope.alltopProductsFunctionforcpg();
    }

  
      }
       

      }








      function cmpareinit(start, end) {

        startDate = start;
        endDate = end;

        compareStart=start;
        compareEnd=end;


    dashBoardService.setcomparestartdate(start);
    dashBoardService.setcompareenddate(end);
    dashBoardService.setreportstartdate(ReportstartDate);
    dashBoardService.setreportenddate(Reportenddate);

        $scope.ComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Compareenddate = endDate.format('YYYYMMDD') + 'T235959.000-0000';
  $scope.SalesDataComparestartDate = startDate.format('YYYYMMDD') + 'T000000.000-0000';

        $scope.compareTimePeriod = startDate.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');
        $scope.totalcomparetime=startDate.format('MMM Do YYYY')+"-"+endDate.format('MMM Do YYYY');

        $scope.$applyAsync();
      }

        $scope.setcomparetimeforproduct=function(){

           end = moment(compareEnd);
           start = moment(compareStart);
          $('input[name="daterange"]').daterangepicker(
            {
               maxDate: new Date(),
              locale: {
                format: 'MM/DD/YYYY'
              },
              startDate: start,
              endDate: end
            }
            , cmpareProduct);
        }

        $scope.setcomparetimefordepartment=function(){

           end = moment(compareEnd);
           start = moment(compareStart);
          $('input[name="daterangedepartment"]').daterangepicker(
            {
               maxDate: new Date(),
              locale: {
                format: 'MM/DD/YYYY'
              },
              startDate: start,
              endDate: end
            }
            , cmpareDepartment);
        }


        $scope.setcomparetimeforproduct();
        $scope.setcomparetimefordepartment();

     

      cmpareinit(start, end);


      var startDate;
      var endDate;


      //DateRangePicker for ReportTime Period

      var startDate;
      var endDate;

      //var end = moment().subtract(17, 'days');;
      //var start = moment().subtract(19, 'days');

      var end = moment(Reportenddate);
      var start = moment(ReportstartDate);

      function daterangepickerCallBacksRTproduct(start, end,label) {

        $('#reporttime-product span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));

        startDate = start;
        endDate = end;

        $scope.ReportstartDate = startDate;
        $scope.Reportenddate = endDate;
      dashBoardService.settimeperiodlabel(label);

         ReportstartDate= start;
         Reportenddate=end;

         compareEnd=moment(end).subtract(1,'year');
    compareStart=moment(start).subtract(1,'year');

    cmpareinit(compareStart,compareEnd);
    $scope.setcomparetimeforproduct();


        dashBoardService.setcomparestartdate(compareStart);
        dashBoardService.setcompareenddate(compareEnd);
        dashBoardService.setreportstartdate(start);
        dashBoardService.setreportenddate(end);


        dashBoardService.setdashboardcacheStaus(false);
        dashBoardService.setproductscacheStatus(false);
        dashBoardService.setsalesregioncacheStatus(false);

        $scope.ReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Reportenddate = end.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.SalesDataReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';

        $scope.ReportTimePeriod = start.format('MMM DD YYYY') + ' - ' + end.format('MMM DD YYYY');


        $scope.totalreporttime=start.format('MMM Do YYYY')+"-"+end.format('MMM Do YYYY');

 if($scope.role=="cpg"){
  $scope.selecteRecord=   dashBoardService.getselectedrecordfromdropdown();


             if($scope.selecteRecord){
          if($scope.selecteRecord.name=="All"){
             $scope.topProductsFunctionByAllRetailer();
         $scope.GettoptenDepartmentsByAllRetailer();
         }
         else{
          if($scope.selecteRecord.hasOwnProperty("children")){
           sessionStorage.user=$scope.selecteRecord.retailerId;
           $scope.retailerid=$scope.selecteRecord.retailerId;

          $scope.topPerformersFunctionforcpgbyretailer();
          $scope.topProductsFunctionforcpgbyretailer();
         }
         else{

          sessionStorage.user=$scope.selecteRecord.retailerId;
          $scope.storeId = $scope.selecteRecord.storeid;
          sessionStorage.storeId = $scope.storeId;

          $scope.TopProductsByStoreId();
            $scope.TopDepartmentsByStoreId();
        }
      }
    }

    else{
       $scope.topPerformersFunction();
          $scope.topProductsFunction();
    }

        }
        else if($scope.role=="retailer"){
        $scope.storeid=dashBoardService.getstoreid();
        if($scope.storeid!=null&&$scope.storeid!=undefined){
          sessionStorage.storeId = $scope.storeid;
          $timeout(function() {

            $scope.TopProductsByStoreId();
            $scope.TopDepartmentsByStoreId();
          },0);
        }
        else{

        if ($scope.data.selectedStoreId== ""||$scope.data.selectedStoreId==undefined) {
          $scope.topPerformersFunction();
          $scope.topProductsFunction();
        }
        else {
          $scope.storeId = $scope.data.selectedStoreId;
          sessionStorage.storeId = $scope.storeId;
          $timeout(function() {
            $scope.TopProductsByStoreId();
            $scope.TopDepartmentsByStoreId();
          },0);

        }
          }


        $scope.$applyAsync();

        dashBoardService.setproductscacheStatus(true);
      }


      }


      function daterangepickerCallBacksRTproductInit(start, end) {

        $('#reporttime-product span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));



        startDate = start;
        endDate = end;

        $scope.ReportstartDate = startDate;
        $scope.Reportenddate = endDate;

        $scope.ReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Reportenddate = end.format('YYYYMMDD') + 'T235959.000-0000';
        $scope.SalesDataReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';

        $scope.ReportTimePeriod = start.format('MMM DD YYYY') + ' - ' + end.format('MMM DD YYYY');
        $scope.totalreporttime=start.format('MMM Do YYYY')+"-"+end.format('MMM Do YYYY');

        $scope.$applyAsync();

      }

      if(dashBoardService.gettimeperiodlabel()==undefined){
      dashBoardService.settimeperiodlabel("Last week");
     }


      $('#reporttime-product').daterangepicker({
         maxDate: new Date(),
        startDate: start,
        endDate: end,
        "autoUpdateInput": false,
        ranges: {
          'This Month': [moment().startOf('month'), moment()],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'Quarter 1 (Jan-Mar)': [moment().startOf('year').startOf('month'), moment().startOf('year').add(2, 'month').endOf('month')],
          'Quarter 2 (Apr-jun)': [moment().startOf('year').add(3, 'month').startOf('month'), moment().startOf('year').add(5, 'month').endOf('month')],
          'Quarter 3 (Jul-sep)': [moment().startOf('year').add(6, 'month').startOf('month'), moment().startOf('year').add(8, 'month').endOf('month')]
        }
      }, daterangepickerCallBacksRTproduct);

      daterangepickerCallBacksRTproductInit(start, end);


      function daterangepickerCallBacksRTdepartment(start, end) {

        $('#reporttime-department span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));

        startDate = start;
        endDate = end;

        $scope.ReportstartDate = startDate;
        $scope.Reportenddate = endDate;


        ReportstartDate= start;
        Reportenddate=end;

        compareEnd=moment(end).subtract(1,'year');
    compareStart=moment(start).subtract(1,'year');

    cmpareinit(compareStart,compareEnd);
    $scope.setcomparetimefordepartment();


       dashBoardService.setcomparestartdate(compareStart);
       dashBoardService.setcompareenddate(compareEnd);
       dashBoardService.setreportstartdate(start);
       dashBoardService.setreportenddate(end);


       dashBoardService.setdashboardcacheStaus(false);
       dashBoardService.setproductscacheStatus(false);
       dashBoardService.setsalesregioncacheStatus(false);

        $scope.ReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Reportenddate = end.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.SalesDataReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';

        $scope.ReportTimePeriodp = start.format('MMM DD YYYY') + ' - ' + end.format('MMM DD YYYY');
        $scope.totalreporttime=start.format('MMM Do YYYY')+"-"+end.format('MMM Do YYYY');
 

            if($scope.role=="retailer"){
        $scope.storeid=dashBoardService.getstoreid();
        if($scope.storeid!=null&&$scope.storeid!=undefined&&$scope.storeid!=""){
          sessionStorage.storeId = $scope.storeid;

          $timeout(function() {

            $scope.alltopProductsFunctionbyStoreId();
            $scope.donutChartFunctionbyStoreId();
          },0);


        }
        else {


        if ($scope.data.selectedStoreId == 'allStores'||$scope.data.selectedStoreId==undefined) {

          //$scope.SalesPerformanceByAllstores();
          $scope.donutChartFunction();
          $scope.alltopProductsFunction();
        }
        else {
          $scope.storeId = $scope.data.selectedStoreId;
          sessionStorage.storeId = $scope.storeId;
          $timeout(function() {

            $scope.alltopProductsFunctionbyStoreId();
            $scope.donutChartFunctionbyStoreId();
          },0);

        }
      }
      }
      else if($scope.role=="cpg"){
       // console.log("coming to if....");

$scope.selecteRecord=   dashBoardService.getselectedrecordfromdropdown();


             if($scope.selecteRecord){


          if($scope.selecteRecord.name=="All"){
              $scope.donutChartFunctionforcpg();
        $scope.alltopProductsFunctionforcpg();
         }
         else{
          if($scope.selecteRecord.hasOwnProperty("children")){
           sessionStorage.user=$scope.selecteRecord.retailerId;
           $scope.retailerid=$scope.selecteRecord.retailerId;

        $scope.donutChartFunctionforcpgbyretailer();
        $scope.alltopProductsFunctionforcpgbyretailer();
         }
         else{

          sessionStorage.user=$scope.selecteRecord.retailerId;
          $scope.storeId = $scope.selecteRecord.storeid;
          sessionStorage.storeId = $scope.storeId;

          $scope.alltopProductsFunctionbyStoreId();
            $scope.donutChartFunctionbyStoreId();
        }
      }
    }
    else{
      $scope.donutChartFunctionforcpg();
        $scope.alltopProductsFunctionforcpg();
    }
      }



      }

      function daterangepickerCallBacksRTdepartmentInit(start, end) {

        $('#reporttime-department span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));

        startDate = start;
        endDate = end;

        $scope.ReportstartDate = startDate;
        $scope.Reportenddate = endDate;

        ReportstartDate= start;
        Reportenddate=end;

        dashBoardService.setcomparestartdate(compareStart);
        dashBoardService.setcompareenddate(compareEnd);
        dashBoardService.setreportstartdate(start);
        dashBoardService.setreportenddate(end);

        $scope.ReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Reportenddate = end.format('YYYYMMDD') + 'T235959.000-0000';
        $scope.SalesDataReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';

        $scope.ReportTimePeriodp = start.format('MMM DD YYYY') + ' - ' + end.format('MMM DD YYYY');
        $scope.totalreporttime=start.format('MMM Do YYYY')+"-"+end.format('MMM Do YYYY');

        $scope.$applyAsync();

      }


      $('#reporttime-department').daterangepicker({
         maxDate: new Date(),
        startDate: start,
        endDate: end,
        "autoUpdateInput": false,
        ranges: {
          'This Month': [moment().startOf('month'), moment()],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'Quarter 1 (Jan-Mar)': [moment().startOf('year').startOf('month'), moment().startOf('year').add(2, 'month').endOf('month')],
          'Quarter 2 (Apr-jun)': [moment().startOf('year').add(3, 'month').startOf('month'), moment().startOf('year').add(5, 'month').endOf('month')],
          'Quarter 3 (Jul-sep)': [moment().startOf('year').add(6, 'month').startOf('month'), moment().startOf('year').add(8, 'month').endOf('month')]
        }
      }, daterangepickerCallBacksRTdepartment);

      daterangepickerCallBacksRTdepartmentInit(start, end);



      $scope.getSelectedProduct = function () {

          $scope.storeId = $scope.selectedStoreId;
          sessionStorage.storeId = $scope.storeId;

          $timeout(function() {

            $scope.getproductbyStoreId();
          },0);

      }

      $scope.alldepartment=function () {

        $scope.selectoption='Department'; //Detergents
             

             if($scope.role=="retailer"){
        $scope.storeid=dashBoardService.getstoreid();
        if($scope.storeid!=null&&$scope.storeid!=undefined&&$scope.storeid!=""){
          sessionStorage.storeId = $scope.storeid;

          $timeout(function() {

            $scope.alltopProductsFunctionbyStoreId();
            $scope.donutChartFunctionbyStoreId();
          },0);


        }
        else {

        $scope.donutChartFunction();
        $scope.alltopProductsFunction();
      }

         compareStart= dashBoardService.getcomparestartdate();
           compareEnd=dashBoardService.getcompareenddate();
         ReportstartDate=  dashBoardService.getreportstartdate();
           Reportenddate=dashBoardService.getreportenddate();

           cmpareinit(compareStart,compareEnd)
            daterangepickerCallBacksRTdepartmentInit(ReportstartDate,Reportenddate);
          }
          else if($scope.role=="cpg"){


               $state.go('products-department');

               $scope.donutChartFunctionforcpg();
               $scope.alltopProductsFunctionforcpg();

          }


      }


      $scope.getRecord = function (id) {

        $scope.selectedStoreId=id;
          $scope.data.selectedStoreId=id;

        if (  $scope.data.selectedStoreId == "" || $scope.data.selectedStoreId=="ALL STORES") {

          //$scope.SalesPerformanceByAllstores();


          $scope.topPerformersFunction();
          $scope.topProductsFunction();

  dashBoardService.setstoreid("");

  dashBoardService.setdashboardcacheStaus(false);
  dashBoardService.setproductscacheStatus(false);
  dashBoardService.setsalesregioncacheStatus(false);


        }
        
        else {

          dashBoardService.setdashboardcacheStaus(false);
          dashBoardService.setproductscacheStatus(false);
          dashBoardService.setsalesregioncacheStatus(false);


          dashBoardService.setstoreid(  $scope.data.selectedStoreId);
          $scope.storeId =  $scope.data.selectedStoreId;
          sessionStorage.storeId = $scope.storeId;
          $timeout(function() {

            $scope.TopProductsByStoreId();
            $scope.TopDepartmentsByStoreId();
          },0);

        }

        dashBoardService.setproductscacheStatus(true);

      }

      $scope.getSelectedRecord = function (id) {

          $scope.selectedStoreId=id;
            $scope.data.selectedStoreId=id;

            if (  $scope.data.selectedStoreId == "" || $scope.data.selectedStoreId=="ALL STORES") {

          $scope.donutChartFunction();
          $scope.alltopProductsFunction();
          //$scope.SalesPerformanceByAllstores();
          dashBoardService.setstoreid("");

          dashBoardService.setdashboardcacheStaus(false);
          dashBoardService.setproductscacheStatus(false);
          dashBoardService.setsalesregioncacheStatus(false);


        }
        else {

          dashBoardService.setdashboardcacheStaus(false);
          dashBoardService.setproductscacheStatus(false);
          dashBoardService.setsalesregioncacheStatus(false);

          dashBoardService.setstoreid(  $scope.data.selectedStoreId);
          $scope.storeId =   $scope.data.selectedStoreId;
          sessionStorage.storeId = $scope.storeId;
          $timeout(function() {

            $scope.alltopProductsFunctionbyStoreId();
            $scope.donutChartFunctionbyStoreId();
          },0);

        }
      }

      $scope.init=function () {

        $scope.inputstatus=dashBoardService.getproductscacheStatus();

        //console.log("input status..."+$scope.inputstatus);
        if($scope.inputstatus==false||$scope.inputstatus==undefined){

          dashBoardService.createproductscache();

        $scope.storeid=dashBoardService.getstoreid();
        $scope.role=sessionStorage.role;

        if($scope.role=="cpg"){
          $scope.getAllRetailers();


             $scope.selectedcpg=dashBoardService.getsavestoreselected();
            console.log("selected cpg....",$scope.selectedcpg);

            if($scope.selectedcpg.name=="All"){

                 $scope.donutChartFunctionforcpg();
            $scope.alltopProductsFunctionforcpg();

            }
            else{

              if($scope.selectedcpg.hasOwnProperty("children")){
                sessionStorage.user=$scope.selectedcpg.retailerId;
            $scope.retailerid=$scope.selectedcpg.retailerId;

            $scope.donutChartFunctionforcpgbyretailer();
        $scope.alltopProductsFunctionforcpgbyretailer();


              }
              else{

                 sessionStorage.user=$scope.selectedcpg.retailerId;
            $scope.storeId = $scope.selectedcpg.storeid;
            sessionStorage.storeId = $scope.storeId;

             $scope.alltopProductsFunctionbyStoreIdforcpg();
            $scope.donutChartFunctionbyStoreIdforcpg();


              }
            }


         

          

        }
        else{
          $scope.GetStoreList();
          $scope.getDepartmentList();

          console.log("storeid...",$scope.storeid);
if($scope.storeid!=null&&$scope.storeid!=undefined&&
          $scope.storeid!=""&&$scope.storeid!="ALL STORES"){
          sessionStorage.storeId = $scope.storeid;

          $timeout(function() {

            $scope.TopProductsByStoreId();
            $scope.TopDepartmentsByStoreId();
          },0);

        }
        else{
          $scope.topPerformersFunction();
          $scope.topProductsFunction();

        }
        }

        // dashBoardService.setstatus(false);
         dashBoardService.setproductscacheStatus(true);
        }
        else{

          if(CacheFactory.get('productsCache')){
                    $scope.role=sessionStorage.role;
                 if($scope.role=="cpg"){
                  $scope.getAllRetailers();
             $scope.selectedcpg=dashBoardService.getsavestoreselected();

            if($scope.selectedcpg.name=="All"){
                 $scope.donutChartFunctionforcpg();
            $scope.alltopProductsFunctionforcpg();
            }
            else{
              if($scope.selectedcpg.hasOwnProperty("children")){
                sessionStorage.user=$scope.selectedcpg.retailerId;
            $scope.retailerid=$scope.selectedcpg.retailerId;
            $scope.donutChartFunctionforcpgbyretailer();
        $scope.alltopProductsFunctionforcpgbyretailer();
              }
              else{
                 sessionStorage.user=$scope.selectedcpg.retailerId;
            $scope.storeId = $scope.selectedcpg.storeid;
            sessionStorage.storeId = $scope.storeId;
             $scope.alltopProductsFunctionbyStoreIdforcpg();
            $scope.donutChartFunctionbyStoreIdforcpg();
              }
            }

                 }
                 else if($scope.role=="retailer"){
                 // console.log(" coming...");
                  $scope.GetStoreList();
                  $scope.getDepartmentList();

                    var productsCache=CacheFactory.get('productsCache');
            $scope.alltopDepartments=false;
            $scope.deparmentbarchartData= productsCache.get('deparmentbarchartData');
            $scope.barChartData= productsCache.get('barChartData');


               if($scope.deparmentbarchartData.length>10){
          $scope.chartheightlength=40* $scope.deparmentbarchartData.length;
          $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.deparmentbarchartData.length>5){
                    $scope.chartheightlength=45*$scope.deparmentbarchartData.length;
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }
                   else if($scope.deparmentbarchartData.length>=2){
                    $scope.chartheightlength=32* ($scope.deparmentbarchartData.length+2);
                    $scope.departmentchartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.departmentchartheight="70px";
                  }


            
              if( $scope.barChartData.length>10){
                  $scope.chartheightlength=50* $scope.barChartData.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }
               else if( $scope.barChartData.length>=5){
                  $scope.chartheightlength=35* $scope.barChartData.length;
                  $scope.chartheight=$scope.chartheightlength+"px";
                }
                 else if( $scope.barChartData.length>=2){
                  $scope.chartheightlength=35* ($scope.barChartData.length+2);
                  $scope.chartheight=$scope.chartheightlength+"px";
                }

                else{

                  $scope.chartheight="100px";
                }
              $scope.alltopDepartments=true;
             $scope.spin=false;
                 }

           // console.log('cache exists');
           // console.log("chartheight...",$scope.chartheight);
          
          }
        }
      }


      $scope.init();


      $scope.getcpgrecord = function() {

       // console.log("is it coming to here also...");

          $scope.selecteRecord=   dashBoardService.getselectedrecordfromdropdown();

          if($scope.selecteRecord.name=="All"){
             $scope.topProductsFunctionByAllRetailer();
         $scope.GettoptenDepartmentsByAllRetailer();
         }
         else{
          if($scope.selecteRecord.hasOwnProperty("children")){
           sessionStorage.user=$scope.selecteRecord.retailerId;
           $scope.retailerid=$scope.selecteRecord.retailerId;

          $scope.topPerformersFunctionforcpgbyretailer();
          $scope.topProductsFunctionforcpgbyretailer();
         }
         else{

          sessionStorage.user=$scope.selecteRecord.retailerId;
          $scope.storeId = $scope.selecteRecord.storeid;
          sessionStorage.storeId = $scope.storeId;
           
          $scope.TopProductsByStoreIdforcpg();
            $scope.TopDepartmentsByStoreIdforcpg();
        }
      }
    };


$scope.getcpgrecordfordept = function() {

          $scope.selecteRecord=   dashBoardService.getselectedrecordfromdropdown();

          if($scope.selecteRecord.name=="All"){
              $scope.donutChartFunctionforcpg();
        $scope.alltopProductsFunctionforcpg();
         }
         else{
          if($scope.selecteRecord.hasOwnProperty("children")){
           sessionStorage.user=$scope.selecteRecord.retailerId;
           $scope.retailerid=$scope.selecteRecord.retailerId;

        $scope.donutChartFunctionforcpgbyretailer();
        $scope.alltopProductsFunctionforcpgbyretailer();
         }
         else{

          sessionStorage.user=$scope.selecteRecord.retailerId;
          $scope.storeId = $scope.selecteRecord.storeid;
          sessionStorage.storeId = $scope.storeId;

           $scope.alltopProductsFunctionbyStoreIdforcpg();
            $scope.donutChartFunctionbyStoreIdforcpg();
        }
      }
    };


         $scope.reporttimeranges=[
                              {"name":"LAST 7 DAYS"},
                              {"name":"THIS MONTH"},
                              {"name":"LAST MONTH"},
                              {"name":"QUARTER 1 2017"},
                              {"name":"QUARTER 2 2017"},
                              {"name":"QUARTER 3 2016"},
                              {"name":"QUARTER 4 2016"}
                              
                              ];

                               $scope.selectedtimeperiod=$scope.reporttimeranges[0];



 $scope.timeperiodlabel=dashBoardService.gettimeperiodlabel();
            
            if($scope.timeperiodlabel){
              if($scope.timeperiodlabel=="Last week"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[0];
            }
             else if($scope.timeperiodlabel=="This Month"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[1];
            }
            else if($scope.timeperiodlabel=="Last Month"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[2];
            }
             
            else if($scope.timeperiodlabel=="Custom Range"){

              if($scope.reporttimeranges[7]==undefined){

                var obj={"name":"CUSTOM"}
                 $scope.reporttimeranges.push(obj);
             }

              $scope.selectedtimeperiod=$scope.reporttimeranges[7];
            }
            else if($scope.timeperiodlabel=="Quarter 1 (Jan-Mar)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[3];
            }

             else if($scope.timeperiodlabel=="Quarter 2 (Apr-jun)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[4];
            }
             else if($scope.timeperiodlabel=="Quarter 3 (Jul-sep)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[5];
            }
            else if($scope.timeperiodlabel=="Quarter 4 (Oct-Dec)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[6];
            }
            }
            else{
               $scope.selectedtimeperiod=$scope.reporttimeranges[0];

            }



             $scope.timerange=function(value){
                     
            if($scope.reporttimeranges.indexOf(7)){
                $scope.reporttimeranges.splice(7, 1);

            }

             //if($scope.manufacturerList.length>1){
           
            if(value.name=="LAST 7 DAYS"){

              //$scope.selectedtimeperiod=value;

               $scope.selectedtimeperiod=$scope.reporttimeranges[0];
              $scope.lastsevendays=true;

              $scope.starttime=moment().subtract(7,'days');
              $scope.endtime=moment().subtract(1,'days');
              daterangepickerCallBack($scope.starttime,$scope.endtime,"Last week");

            }
            else if(value.name=="THIS MONTH"){

             $scope.selectedtimeperiod=$scope.reporttimeranges[1];

              $scope.starttime=moment().startOf('month');
              $scope.endtime=moment().subtract(1,'days');

              daterangepickerCallBack($scope.starttime,$scope.endtime,"This Month");

            }
            else if(value.name=="LAST MONTH"){
                $scope.selectedtimeperiod=$scope.reporttimeranges[2];


               $scope.starttime=moment().subtract(1,'month').startOf('month');
              $scope.endtime=moment().subtract(1,'month').endOf('month');

              console.log("start and end time...",$scope.starttime);
              daterangepickerCallBack($scope.starttime,$scope.endtime,"Last Month");

            }
            else if(value.name=="QUARTER 1 2017"){

          $scope.selectedtimeperiod=$scope.reporttimeranges[3];


               $scope.starttime=  moment().startOf('year').startOf('month');
              $scope.endtime= moment().startOf('year').add(2, 'month').endOf('month');
           daterangepickerCallBack($scope.starttime,$scope.endtime,"Quarter 1 (Jan-Mar)");

            }
            else if(value.name=="QUARTER 2 2017"){
               $scope.selectedtimeperiod=$scope.reporttimeranges[4];
            

              $scope.starttime=moment().startOf('year').add(3, 'month').startOf('month'); 
              $scope.endtime=moment().startOf('year').add(5, 'month').endOf('month');
           daterangepickerCallBack($scope.starttime,$scope.endtime,"Quarter 2 (Apr-jun)");

            }
            else if(value.name=="QUARTER 3 2016"){

           $scope.selectedtimeperiod=$scope.reporttimeranges[5];
   
                        
          $scope.starttime=moment().subtract(1,'year').startOf('year').add(6, 'month').startOf('month');
            $scope.endtime=moment().subtract(1,'year').startOf('year').add(8, 'month').endOf('month');

           daterangepickerCallBack($scope.starttime,$scope.endtime,"Quarter 3 (Jul-sep)");

            }
              else if(value.name=="QUARTER 4 2016"){

            $scope.selectedtimeperiod=$scope.reporttimeranges[6];
           
                        
          $scope.starttime=moment().subtract(1,'year').startOf('year').add(9, 'month').startOf('month');
            $scope.endtime=moment().subtract(1,'year').startOf('year').add(11, 'month').endOf('month');

           daterangepickerCallBack($scope.starttime,$scope.endtime,"Quarter 4 (Oct-Dec)");

            }

           
            
          }


            
    $scope.sortingoptions=[
    {
      "sortName":'Best Sales',
      "sortGroup":'SALES',
      "sortValue":'amt-desc'
    },
    {
      "sortName":' Worst Sales',
      "sortGroup":'SALES',
      "sortValue":'amt-asc'
    },
     {
      "sortName":'Quantity',
      "sortGroup":'QUANTITY',
      "sortValue":'qty-desc'
    }/*,
     {
      "sortName":'Worst Selling By Quantity',
      "sortGroup":'QUANTITY',
      "sortValue":'qty-asc'
    },

    {
      "sortName":'Ascending',
      "sortGroup":'NAME',
      "sortValue":'name-asc'
    }*/,
     {
      "sortName":'Alphabetical',
      "sortGroup":'NAME',
      "sortValue":'name-asc'
    }
   
   ];
    $scope.selectedoption=$scope.sortingoptions[0];

    sessionStorage.sortByValue=$scope.sortingoptions[0].sortValue;

          $scope.nutella = "data:image/jpeg;base64,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";

     $scope.raffaello = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzAxNCA3OS4xNTY3OTcsIDIwMTQvMDgvMjAtMDk6NTM6MDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZTdiMTJiODAtMDI1Yy0xZDQyLTg4NmUtNmZmYmM0MzUyNjBlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNCMTk0ODdBOTlDNzExRTU4Mjc1QzM5NTcwNUEyRTlDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNCMTk0ODc5OTlDNzExRTU4Mjc1QzM5NTcwNUEyRTlDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmM2MGYyMTIyLWJiZDQtODA0MC1iMjYxLTAxNjJkMDVhOGFkOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplN2IxMmI4MC0wMjVjLTFkNDItODg2ZS02ZmZiYzQzNTI2MGUiLz4gPC9yZGY6RGVzY3JpcHRpb24+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RRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGii9fd9UtVwbzr7oqt6NUqtfdxDvHRYUV95x+Pt7tUsKK+8494e346Omijn934/wCGqdNFHOPgGq9NFfOcfhosKK+biPeOq2FFfNFFfN9VqlxRvotVvVXzVapRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFzRuOqVW5o30Wo6jX3fRaq9VG+i1HVXzfRaqdRo30WouaN9VouaNFUo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiijRRRooo0UUaKKNFFGiiv/9k=";

      $scope.ticTac = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzAxNCA3OS4xNTY3OTcsIDIwMTQvMDgvMjAtMDk6NTM6MDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZTdiMTJiODAtMDI1Yy0xZDQyLTg4NmUtNmZmYmM0MzUyNjBlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE0QzUxNDg3OTUwRTExRTU4RUJFQ0FGOEI0MDI4MEE2IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE0QzUxNDg2OTUwRTExRTU4RUJFQ0FGOEI0MDI4MEE2IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdmMmJiMWFlLTUwMWQtY2Q0ZS05MmY5LTdlMmQ0OGRmYjMyMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplN2IxMmI4MC0wMjVjLTFkNDItODg2ZS02ZmZiYzQzNTI2MGUiLz4gPC9yZGY6RGVzY3JpcHRpb24+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";

      $scope.defaultProduct = "data:image/jpeg;base64,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";

      $scope.tide = "data:image/png;base64,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";

    $scope.GetProductList = function (value) {

        sessionStorage.productsuggested = value;

        return productService.GetProductSuggested().then(function (response) {


            $scope.listOfProducts = response.data;
            $scope.typeaheadList = [];

            for (var i = 0; i < response.data.length; i++) {

              var tictac = response.data[i].product.toLowerCase().indexOf('tictac');
              var nutella = response.data[i].product.toLowerCase().indexOf('nutella');
              var ferrero = response.data[i].product.toLowerCase().indexOf('ferrero');
              var tide = response.data[i].product.toLowerCase().indexOf('tide');

              var typeaheadobject = {
                "image": $scope.defaultProduct,
                "product": response.data[i].product,
                "upc": response.data[i].upc,
                "price": response.data[i].size,
                "deptId":response.data[i].deptId
              }

              if (nutella >= 0) {
                typeaheadobject = {
                  "image": $scope.nutella,
                  "product": response.data[i].product,
                  "upc": response.data[i].upc,
                  "price": response.data[i].size,
                  "deptId":response.data[i].deptId
                }

              }

              else if (ferrero >= 0) {
                typeaheadobject = {
                  "image": $scope.raffaello,
                  "product": response.data[i].product,
                  "upc": response.data[i].upc,
                  "price": response.data[i].size,
                  "deptId":response.data[i].deptId
                }
              }

              else if (tictac >= 0) {
                typeaheadobject = {

                  "image": $scope.ticTac,
                  "product": response.data[i].product,
                  "upc": response.data[i].upc,
                  "price": response.data[i].size,
                  "deptId":response.data[i].deptId
                }
              }
              else if (tide >= 0) {
                typeaheadobject = {

                  "image": $scope.tide,
                  "product": response.data[i].product,
                  "upc": response.data[i].upc,
                  "price": response.data[i].size,
                  "deptId":response.data[i].deptId
                }
              }


              $scope.typeaheadList.push(typeaheadobject);
            }


            return $scope.typeaheadList;

          }, function (response) {
            console.log(response);

          }
        );
      }




    }]);


