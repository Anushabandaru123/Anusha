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


angular.module('Retails.topstoresbarchart', ['product.controllers'])

  .directive('topstoresbarchartDirective', ['$compile', '$window', '$timeout','$rootScope','dashBoardService',
    function ($compile, $window, $timeout,$rootScope,dashBoardService) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '='
        },
        templateUrl: 'modules/componets/views/topstoresbarcharttemplate.html',
        link: function (scope, element, attrs) {
          scope.chartid = scope.id;
          scope.chartdata = scope.data;
         // console.log("top stores data directive...",scope.data);
          var chart = false;
          var initChart = function () {
            if (chart) chart.destroy();
            var config = scope.config || {};
            chart = AmCharts.makeChart(scope.chartid, {
              "type": "serial",
              "theme": "light",
              "categoryField": "content",
              "rotate": true,
              "startDuration": 1,
               //"columnWidth": 0.75, 
              "startEffect":"easeOutSine",
               "columnSpacing": 0,
              "autoMargins": false,
             // "marginTop": 0,
              "marginBottom": 0,
            // "marginLeft": 0,
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
                  "balloonText": "[[content]]: $[[amt]]<br> Index: [[Index]]",
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
                   "labelOffset": 70,
                  "labelColorField": "labelcolor",
                 "fixedColumnWidth": 12
                },
                {
                  "balloonText": "[[content]]: $[[amt1]]",
                  "fillAlphas": 1,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "amt",
                  "type": "column",
                  "valueField": "value1",
                  "showHandOnHover":true,
                  "fixedColumnWidth": 12
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
                  "maximum":dashBoardService.gettopstoresmaxvalue()*2.0,
                  "minimum":0
                }
              ],
              "allLabels": [],
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
          "amt":event.item.dataContext.value,
          "id":event.item.dataContext.storeid,
          "content":event.item.dataContext.storename,
          "storeId":event.item.dataContext.storeid,
          "retailer":event.item.dataContext.retailerName,
          "retailerId":event.item.dataContext.retailerId
           }

           console.log("object...",object);
           $rootScope.$emit('getstoredata', object)
            }
          };
              scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
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
             scope.maximumValue=dashBoardService.gettopstoresmaxvalue();
             //console.log("maximum value from the service...",scope.maximumValue);
                 if(scope.maximumValue!=null&&scope.maximumValue!='null'){
                  // console.log("update max value...");
                   if(scope.maxvalue>scope.maximumValue){
                   // console.log("it is maximum");
                     dashBoardService.settopstoresmaxvalue(scope.maxvalue);
                   }
                 }
                 else{
                 // console.log("value is null set the maximum value...");
               dashBoardService.settopstoresmaxvalue(scope.maxvalue);
                 }
                // console.log("maximum value...",dashBoardService.gettopstoresmaxvalue());
        if(scope.chartdata.length>10){
          scope.chartheightlength=40* scope.chartdata.length;
          scope.chartheight=scope.chartheightlength+"px";
                  }
                 else if(scope.chartdata.length>=5){
                    scope.chartheightlength=50*scope.chartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
                   else if(scope.chartdata.length>=2){
                    scope.chartheightlength=35* (scope.chartdata.length+2);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
                  else{
                    scope.chartheight="100px";
                  }
                //  console.log("chartheight....",scope.chartheight);

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
