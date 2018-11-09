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


angular.module('Retails.allproductsDirective', [])

  .directive('allproductsDirective', ['$compile', '$window', '$timeout','$rootScope','productService','dashBoardService','$filter',
    function ($compile, $window, $timeout,$rootScope,productService,dashBoardService,$filter) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '=',
          chartheight:'=',
          sorttype:'='
          
        },
        templateUrl: 'modules/componets/views/allproductstemplate.html',

        link: function (scope, element, attrs) {

          scope.updatechart=true;

          scope.chartid = scope.id;
          scope.chartdata = scope.data;
          scope.height=scope.chartheight
          //console.log("sorttype...",scope.data);
          //scope.itemnumber=scope.itemnumber;
          //console.log("chart data...",scope.chartdata);
          scope.reporttime=scope.chartdata[0].reporttime;
          scope.comparetime=scope.chartdata[0].comapretime;
          scope.mfgId=sessionStorage.mfgId;
          var chart = false;
          var initChart = function () {
            if (chart) chart.destroy();
            var config = scope.config || {};
           
            chart = AmCharts.makeChart(scope.id, {
              "type": "serial",
              "theme": "light",
              "categoryField": "Product",
              "rotate": true,
              "startDuration": 1,
              "startEffect":"easeOutSine",
              "columnSpacing": 0,
              "autoMargins": false,
               "marginBottom": 0,
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
              "graphs": scope.graphs,
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
                      "fillAlpha": 2,
                      "offsetX": 0,
                      "offsetY": 0,
                      "verticalPadding": -1
                    },
              "titles": [],
              "dataProvider": scope.chartdata,
              "export": {
                  "enabled": true,
                  "fileName":"Products",
                  "exportFields": [
                        "Product",
                        "amtnumber",
                        "amtnumber1",
                        "DeptName",
                        "itemNumber",
                        "store",
                        "manufacturer",
                        "category",
                        "lastsoldDateRP"
                     ],
             "columnNames": {
                      "Product": "Product Name",
                      "amtnumber": "Sales Amount from "+scope.reporttime,
                      "amtnumber1": "Sales Amount from "+scope.comparetime,
                      "DeptName": "Department Name",
                      "itemNumber":"UPC",
                      "store":"Store",
                      "manufacturer":"Manufacturer",
                      "category":"Category",
                      "lastsoldDateRP":"Last date sold"

                    },
          "menu": [{
              "class": "export-main",
              "menu": [ {
                      "label": "Download As",
                      "menu": ["XLSX"],
                      "name": "Products"
                }]
            }]
  }
   });

            productService.setTopproductbarchartCsv(chart);
            chart.addListener("clickGraphItem", handleClick);
            
          };


          function handleClick(event){
                var dataobject={
                  "productName":event.item.category,
                  "deptId":event.item.dataContext.deptId,
                  "itemnumber":event.item.dataContext.itemNumber,
                  "deptName":event.item.dataContext.DeptName,
                  "category":event.item.dataContext.category,
                  "manufacturer":event.item.dataContext.manufacturer
                }
            //console.log("item clicked...",dataobject);
      $rootScope.$emit('productcliced', dataobject);
          }

          scope.comapretimearray=[];
          scope.reporttimearray=[];

        if(scope.sorttype.sortGroup=="QUANTITY"){
        for(var i=0;i<scope.chartdata.length;i++){
        scope.comapretimearray.push(parseFloat(scope.chartdata[i].ComparetimeQty));
        scope.reporttimearray.push(parseFloat(scope.chartdata[i].ReporttimeQty));
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
        scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].ReporttimeSales,2);
        scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].ComparetimeSales,2);
        }

        for(var i=0;i<scope.chartdata.length;i++){
        scope.chartdata[i].qtynumber=$filter('number')(scope.chartdata[i].ReporttimeQty,2);
        scope.chartdata[i].qtynumber1=$filter('number')(scope.chartdata[i].ComparetimeQty,2);
        }

             scope.graphs=[
                {
                  "balloonText": "[[reporttime]]<br>"
                                  +"Item: [[Product]]<br>"
                                  +"UPC: [[itemNumber]]<br>"
                                  +"Sales Amount: $[[amtnumber]]<br>"
                                  +"Quantity: [[qtynumber]] ([[sizeRP]])<br>"
                                  //+"Quantity: [[quantityRP]]<br>"
                                  +"MSU: [[msuRP]]<br>" 
                                  +"Last Sold Date: [[lastsoldDateRP]]<br>"
                                  +"Index: [[QtyIndex]]<br>",
                  "fillAlphas": 1,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                 "lineAlpha": 0.5,
                  "title": "ReporttimeSales",
                  "type": "column",
                  "showHandOnHover":true,
                  "valueField": "ReporttimeQty",
                   "labelText": "[[qtynumber]]",
                  "labelPosition": "right",
                   "labelOffset": 70,
                   "fixedColumnWidth": 12,
                   "labelsEnabled": true
                  
                },
                {
                  "balloonText": "[[comapretime]]<br>"
                                 +"Item: [[Product]]<br>"
                                 +"UPC: [[itemNumber]]<br>"
                                 +"Sales Amount: $[[amtnumber1]]<br>"
                                 +"Quantity: [[qtynumber1]] ([[sizeCP]])<br>"
                                 //+"Quantity: [[quantityCP]]<br>"
                                +"MSU: [[msuCP]]<br>" 
                                +"Last Sold Date: [[lastsoldDateCP]]",
                  "fillAlphas": 1,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.5,
                  "title": "ReporttimeSales",
                  "type": "column",
                  "showHandOnHover":true,
                  "valueField": "ComparetimeQty",
                   "labelText": "[[qtynumber1]]",
                  "labelPosition": "right",
                   "fixedColumnWidth": 12
                  
                }
              ];


            }//if ends


            else{
              for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[i].ComparetimeSales));
              scope.reporttimearray.push(parseFloat(scope.chartdata[i].ReporttimeSales));

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
                scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].ReporttimeSales,2);
                scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].ComparetimeSales,2);
              }

              scope.graphs=[
                {
              
                  "balloonText": "[[reporttime]]<br> "
                                 +"Item: [[Product]]<br>"
                                 +"UPC: [[itemNumber]]<br>"
                                 +"Sales Amount: $[[amtnumber]]<br>"
                                 //+"Quantity: [[quantityRP]]<br>"
                                 +"MSU: [[msuRP]]<br>" 
                                  +"Last Sold Date: [[lastsoldDateRP]]<br>"
                                 +"Index: [[Index]]<br>",
                  "fillAlphas": 1,
                  "fillColorsField": "color1",
                  //"id": "AmGraph-12",
                  "lineAlpha": 0.5,
                  "title": "ReporttimeSales",
                  "type": "column",
                  "fillColor":"#5555",
                  "showHandOnHover":true,
                  "valueField": "ReporttimeSales",
                   "labelText": "$[[amtnumber]]",
                  "labelPosition": "right",
                   "labelOffset": 70,
                   "fixedColumnWidth": 12
                },
                {
                  "balloonText": "[[comapretime]]<br>"
                                +"Item: [[Product]]<br>"
                                +"UPC: [[itemNumber]]<br>"
                                +"Sales Amount: $[[amtnumber1]]<br>"
                                //+"Quantity: [[quantityCP]]<br>"
                                +"MSU: [[msuCP]]<br>"
                                 +"Last Sold Date: [[lastsoldDateCP]]",
                  "fillAlphas": 0.8,
                  "fillColorsField": "color",
                 // "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "ComparetimeSales",
                  "type": "column",
                  "showHandOnHover":true,
                  "valueField": "ComparetimeSales",
                   "labelText": "$[[amtnumber1]]",
                  "labelPosition": "right",
                   "fixedColumnWidth": 12
                  
                }
              ]

            }


               $timeout(function () {
            initChart();
          }, 0);
             
           scope.$on('$destroy', function () {
            if(chart)
              chart.clear();
              productService.setTopproductbarchartCsv(null);
          });

        }//end watch


      }
    }])
