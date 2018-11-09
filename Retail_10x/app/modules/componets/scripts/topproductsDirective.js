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


angular.module('Retails.topproducts', ['product.controllers'])

  .directive('topproductsDirective', ['$compile', '$window', '$timeout','$rootScope','dashBoardService',
    function ($compile, $window, $timeout,$rootScope,dashBoardService) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '='
        },
        templateUrl: 'modules/componets/views/topproductstemplate.html',

        link: function (scope, element, attrs) {

          scope.chartid = scope.id;
          scope.chartdata = scope.data;

          console.log("data top products...",scope.data);

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
              //"marginTop": 10,
             // "marginBottom": 0,
             //"marginLeft": 0,
             // "marginRight": 0,
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
                  "balloonText": "[[reporttime]]<br>" 
                                 +"Item: [[storename]]<br>"
                                 +"UPC: [[itemNumber]]<br>"
                                 +"Sales Amount: $[[amt]]<br>"
                                // +"Quantity:[[quantityRP]]<br>"
                                 +"MSU: [[msuRP]]<br>"
                                 +"Last Sold Date: [[lastsoldDateRP]]<br>"
                                 +"Index: [[Index]]<br>",
                  "fillAlphas": 1,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.5,
                  "title": "amt",
                  "type": "column",
                  "valueField": "value",
                  "showHandOnHover":true,
                  "labelText": "[[Index]][[arrow]]",
                  "labelPosition": "right",  
                  "labelColorField": "labelcolor",
                  "labelOffset": 70,
                  "fixedColumnWidth": 12,
                  "labelsEnabled": true
                },
                {
                  "balloonText": "[[comapretime]]<br>"
                                 +"Item: [[storename]]<br>"
                                 +"UPC: [[itemNumber]]<br>"
                                 +"Sales Amount: $[[amt1]]<br>"
                                // +"Quantity: [[quantityCP]]<br>"
                                 +"MSU: [[msuCP]]<br>"
                                 +"Last Sold Date: [[lastsoldDateCP]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.5,
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
                  "position": "top",
                  "axisAlpha": 0,
                  "gridAlpha": 0,
                  "labelsEnabled": false,
                  "maximum":dashBoardService.gettopproductsmaxvalue()*1.2,
                  "minimum":0
                }
              ],
              "allLabels": [],
              "balloon": {
              "fillColor": "#000000",
              "color": "#ffffff",
              "fillAlpha": 1.0,
              "offsetX": 0,
              "offsetY": 0
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
              "deptId":event.item.dataContext.deptId,
              "itemnumber":event.item.dataContext.itemNumber,
              "deptName":event.item.dataContext.deptName,
              "category":event.item.dataContext.category,
              "manufacturer":event.item.dataContext.manufacturer
             }
          //$rootScope.$emit('topproductbarchartcallback', object);
          $rootScope.$emit('productcliced', object);
            }
          };

      function exportCharts() {
  // iterate through all of the charts and prepare their images for export
  var images = [];
  var pending = AmCharts.charts.length;
  for ( var i = 0; i < AmCharts.charts.length; i++ ) {
    var chart11 = AmCharts.charts[ i ];
    chart11.export.capture( {}, function() {
      this.toJPG( {}, function( data ) {
        images.push( {
          "image": data,
          "fit": [ 523.28, 769.89 ]
        } );
        pending--;
        if ( pending === 0 ) {
          // all done - construct PDF
          chart11.export.toPDF( {
            content: images
          }, function( data ) {
            this.download( data, "application/pdf", "amCharts.pdf" );
          } );
        }
      } );
    } );
  }
}

  var destroyFoo;
  destroyFoo= $rootScope.$on('pdfeventdashboard',function(event, data){
      exportCharts();
   });

    if(scope.chartdata.length>4){
          scope.chartheightlength=60* scope.chartdata.length;
          scope.chartheight=scope.chartheightlength+"px";
    }
    else {
          scope.chartheightlength=60*scope.chartdata.length;
          scope.chartheight=scope.chartheightlength+"px";
    }

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

             scope.maximumValue=dashBoardService.gettopproductsmaxvalue();
              if(scope.maximumValue!=null&&scope.maximumValue!='null'){
              if(scope.maxvalue>scope.maximumValue){
                     dashBoardService.settopproductsmaxvalue(scope.maxvalue);
              }
              }
              else{
               dashBoardService.settopproductsmaxvalue(scope.maxvalue);
              }
            
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
