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


angular.module('Retails.worstsellers', ['product.controllers'])

  .directive('worstsellersDirective', ['$compile', '$window', '$timeout','$rootScope','dashBoardService',
    function ($compile, $window, $timeout,$rootScope,dashBoardService) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '='
        },
        templateUrl: 'modules/componets/views/worstsellerstemplate.html',

        link: function (scope, element, attrs) {

          scope.chartid = scope.id;
          scope.chartdata = scope.data;

          //console.log("data top products...",scope.data);

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
               //"columnWidth": 0.75, 
              "startEffect":"easeOutSine",
               "columnSpacing": 0,
              "autoMargins": false,
              //"marginTop": 0,
              "marginBottom": 0,
             //"marginLeft": 0,
             //"marginRight": 0,
             "pullOutRadius": 0,
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
                  "balloonText": "[[reporttime]]<br> [[storename]]: $[[amt]]<br> Index: [[Index]]",
                  "fillAlphas": 1,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "valueField": "value",
                  "showHandOnHover":true,
                  "labelText": "[[Index]][[arrow]]",
                  "labelPosition": "right",
                  "labelColorField": "labelcolor",
                   "labelOffset": 40,
                  "fixedColumnWidth": 15
                },
                {
                  "balloonText": "[[comapretime]]<br> [[storename]]: $[[amt1]]",
                  "fillAlphas": 1,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "valueField": "value1",
                  "showHandOnHover":true,
                  "fixedColumnWidth": 15
                }
              ],
              "guides": [],
              "valueAxes": [
                {
                  "id": "ValueAxis-1",
                 // "position": "top",
                  "axisAlpha": 0,
                  "gridAlpha": 0,
                  "labelsEnabled": false,
                 "maximum":dashBoardService.getworstsellersmaxvalue()*1.9,
                  "minimum":0
                }
              ],
              "allLabels": [/*{
      "text": "Free label",
      "bold": true,
      "x": 20,
      "y": 20
    }*/
    ],
              "balloon": {
              "fillColor": "#000000",
               "color": "#ffffff",
               "fillAlpha": 1.0,
               "offsetX": 0,
                  "offsetY": 0,
                  "horizontalPadding":0,
                  "maxWidth":100
              
              },
              "titles": [],
              "dataProvider": scope.chartdata,
               "export": {
                "enabled": true,
                 "menu": []
              }

            });



                chart.addListener("clickGraphItem", handleClick);

            function handleClick(event){
 var object={
              "productName":event.item.category,
              "deptid":event.item.dataContext.deptId,
              "itemNumber":event.item.dataContext.itemNumber,
              "Namedept":event.item.dataContext.deptName,
              "category":event.item.dataContext.category


             }
          $rootScope.$emit('topproductbarchartcallback', object);


            }
          };

           scope.comapretimearray=[];
              scope.reporttimearray=[];


             for(var i=0;i<scope.chartdata.length;i++){

              scope.role=sessionStorage.role;

              /*if(scope.rol)*/

                scope.comapretimearray.push(parseFloat(scope.chartdata[i].value));
              scope.reporttimearray.push(parseFloat(scope.chartdata[i].value1));

             }
             scope.comparetimemax=Math.max.apply(Math,scope.comapretimearray);
             scope.reporttimemax=Math.max.apply(Math,scope.reporttimearray);

             if(scope.comparetimemax>scope.reporttimemax){
              scope.maxvalue=scope.comparetimemax;
             }

             else{
              scope.maxvalue=scope.reporttimemax;

             }

           // console.log("max value...",scope.maxvalue);


             scope.maximumValue=dashBoardService.getworstsellersmaxvalue();


          // console.log("maximum value from the service...",scope.maximumValue);

                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){
                  // console.log("update max value...");

                   if(scope.maxvalue>scope.maximumValue){
                  //  console.log("it is maximum",scope.maxvalue);
                     dashBoardService.setworstsellersmaxvalue(scope.maxvalue);
                   }

                 }
                 else{
                 // console.log("value is null set the maximum value...");
                
               dashBoardService.setworstsellersmaxvalue(scope.maxvalue);

                 }

                  /*for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].amt,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].expenses,2);
            }
*/

    //console.log("maximum value after the service...",dashBoardService.getworstsellersmaxvalue());

            
 $timeout(function () {
            initChart();
            if(scope.maxvalue>scope.maximumValue){

             $rootScope.$emit('updatestorebarchart', {});
            }
          }, 0);



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
