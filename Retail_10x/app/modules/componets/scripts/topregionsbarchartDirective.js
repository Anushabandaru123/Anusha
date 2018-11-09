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


angular.module('Retails.topregionbarchart', ['product.controllers'])

  .directive('topregionbarchartDirective', ['$compile', '$window', '$timeout','dashBoardService','$filter','$rootScope','productService',
    function ($compile, $window, $timeout,dashBoardService,$filter,$rootScope,productService) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

          id: '=',
          data: '=',
          storeswithretailer:'='
            
        },
        templateUrl: 'modules/componets/views/topregionbarcharttemplate.html',

        link: function (scope, element, attrs) {

          scope.chartid = scope.id;

          //console.log("stores data...",scope.data);

          //console.log("chart id...",scope.id);

         // console.log("stores with retailer...",scope.storeswithretailer);

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
              "columnSpacing": 0,
              //"columnWidth": 0.75,
                 "autoMargins": false,
              "marginTop": 10,
              "marginBottom": 0,
              "startEffect":"easeOutSine",
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
                  "balloonText": "Sales Amt: $[[amtnumber]]<br> Index: [[index]]",
                  "fillAlphas": 1,
                  "fillColorsField": "color1",
                  "id": "AmGraph-12",
                  "lineAlpha": 0.2,
                  "title": "Sales",
                  "type": "column",
                  "valueField": "Sales",
                  "labelText": "$[[amtnumber]]",
                  "labelPosition": "right",
                  "showHandOnHover":true,
                 "fixedColumnWidth": 11


                },
                {
                  "balloonText": "Sales Amt: $[[amtnumber1]]",
                  "fillAlphas": 1,
                  "fillColorsField": "color",
                  "id": "AmGraph-22",
                  "lineAlpha": 0.2,
                  "title": "Sales",
                  "type": "column",
                  "valueField": "Sales1",
                  "labelText": "$[[amtnumber1]]",
                  "labelPosition": "right",
                  "showHandOnHover":true,
                  "fixedColumnWidth": 11
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
                "enabled": true,
                 "menu": []
              }/*,
               "responsive": {
               "enabled": true
               }*/

            });
                chart.addListener("clickGraphItem", handleClick);
            function handleClick(event){
         var object={
          "amt":event.item.dataContext.Sales,
          "id":event.item.dataContext.storeid,
          "content":event.item.dataContext.storename,
          "storeId":event.item.dataContext.storeid,
          "retailer":event.item.dataContext.retailer,
          "retailerId":event.item.dataContext.retailerId
        }
          $rootScope.$emit('getstoredata', object);

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

         destroyFoo= $rootScope.$on('pdfevent',function(event, data){
            exportCharts();


           });

          scope.List=[];

          scope.chartheight="400px";

          scope.getstorelist=function(){
             dashBoardService.GetStoreList().then(function (response) {
          for (var i = 0; i < response.data.length; i++) {
            scope.List.push(response.data[i]);

          }

          for(var j=0;j<scope.List.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){

              if(scope.topregionchartdata[k].storeid==scope.List[j].store_id){
                scope.topregionchartdata[k].storename= scope.List[j].store_name.toUpperCase();
              }

            }
          }

        if(scope.topregionchartdata.length>10){
          scope.chartheightlength=50* scope.topregionchartdata.length;
          scope.chartheight=scope.chartheightlength+"px";
                  }
                 else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
                   else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }

                  else{

                    scope.chartheight="120px";
                  }

           scope.chartdata=scope.topregionchartdata;

           scope.comapretimearray=[];
              scope.reporttimearray=[];

             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

           $timeout(function () {
               initChart();
            }, 0);
         
        }, function (response) {
          console.log(response);

        }
      );
          }


          scope.storesbarchartfunction=function(){

             scope.region=scope.data.region;

          scope.storesbyregionsforreporttime=function(){

             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                 "bucketLevel" : "S",
                  "filters" : { 
                    "location.regionName" : [scope.region] }
                }

                dashBoardService.getsalesdatafordepartments(data).then(function (response) {

                   scope.topregionchartdata=[];
                   scope.unorderedList=[];

                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);

                  }

                     scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');

               scope.StoresbyregionforRT=scope.orderedList;

              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {
                
                 scope.indexvalue=0.00;

        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
         if(results){
        if(results.length>0){

        scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
        var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);


                  }
                  else{

                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);

                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);

        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

               scope.indexvalue=0.00;
             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);

                  }
          
              }
            }

             scope.getstorelist();

              }, function (response) {
               console.log(response);

             }
             );
          }

              var data={

                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                 "bucketLevel" : "S",
                  "filters" : { "location.regionName" : [scope.region] }
                }

                dashBoardService.getsalesdatafordepartments(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforreporttime();

              }, function (response) {
               console.log(response);

             }
             );
         }

                scope.mfgid=sessionStorage.mfgId;

      scope.storesbarchartfunctionforcpg=function(){

             scope.region=scope.data.region;

          scope.storesbyregionsforreporttime=function(){

             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                 "bucketLevel" : "S",
                  "filters" : {
                    "location.regionName" : [scope.region],
                     "items.mfgId" : [scope.mfgid],
                     "retailerId" :scope.allRetailers
                }
                }

                dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {

                   scope.topregionchartdata=[];
                    scope.unorderedList=[];

                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);

                  }
                     scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');

               scope.StoresbyregionforRT=scope.orderedList;

              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {

                 scope.indexvalue=0.00;

        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
        if(results){
        if(results.length>0){

           scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
                    var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
                  else{
                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);
                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);
        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){

                     scope.indexvalue=0.00;
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                 "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
        }
      }
              if(scope.topregionchartdata.length>10){
                    scope.chartheightlength=50* scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else{
                    scope.chartheight="120px";
                  }

          scope.allstoreswithretailer=scope.storeswithretailer;

           for(var j=0;j<scope.allstoreswithretailer.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){

              if(scope.topregionchartdata[k].storeid==scope.allstoreswithretailer[j].store_id){
                scope.topregionchartdata[k].storename= scope.allstoreswithretailer[j].retailer_name.toUpperCase()+" "+scope.allstoreswithretailer[j].store_name.toUpperCase();
                scope.topregionchartdata[k].retailer=scope.allstoreswithretailer[j].retailer_name;
                scope.topregionchartdata[k].retailerId=scope.allstoreswithretailer[j].retailer_id;
              }

            }
          }

             scope.chartdata=scope.topregionchartdata;
             scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

          $timeout(function () {
            initChart();
          }, 0);

              }, function (response) {
               console.log(response);
             }
             );
          }
              var data={
                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                  "bucketLevel" : "S",
                  "filters" : {
                  "location.regionName" : [scope.region],
                  "items.mfgId" : [scope.mfgid],
                  "retailerId" :scope.allRetailers
                }
                }
                dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforreporttime();
              }, function (response) {
               console.log(response);
             }
             );

         }


         scope.storesbarchartfunctionforcpgwithBRAND=function(){

             scope.region=scope.data.region;

          scope.storesbyregionsforreporttime=function(){

             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                 "bucketLevel" : "S",
                  "filters" : {
                    "location.regionName" : [scope.region],
                     "items.mfgId" : [scope.mfgid],
                     "retailerId" :scope.allRetailers,
                     "items.brandId" : [scope.selectedBrandID.toString()]
                }
                }

                dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {

                   scope.topregionchartdata=[];
                    scope.unorderedList=[];

                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);

                  }
                     scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');

               scope.StoresbyregionforRT=scope.orderedList;

              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {

                 scope.indexvalue=0.00;

        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
        if(results){
        if(results.length>0){

           scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
                    var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
                  else{
                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);
                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);
        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){

                     scope.indexvalue=0.00;
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                 "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
        }
      }
              if(scope.topregionchartdata.length>10){
                    scope.chartheightlength=50* scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else{
                    scope.chartheight="120px";
                  }

          scope.allstoreswithretailer=scope.storeswithretailer;

           for(var j=0;j<scope.allstoreswithretailer.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){

              if(scope.topregionchartdata[k].storeid==scope.allstoreswithretailer[j].store_id){
                scope.topregionchartdata[k].storename= scope.allstoreswithretailer[j].retailer_name.toUpperCase()+" "+scope.allstoreswithretailer[j].store_name.toUpperCase();
                scope.topregionchartdata[k].retailer=scope.allstoreswithretailer[j].retailer_name;
                scope.topregionchartdata[k].retailerId=scope.allstoreswithretailer[j].retailer_id;
              }

            }
          }

             scope.chartdata=scope.topregionchartdata;
             scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

          $timeout(function () {
            initChart();
          }, 0);

              }, function (response) {
               console.log(response);
             }
             );
          }
              var data={
                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                  "bucketLevel" : "S",
                  "filters" : {
                  "location.regionName" : [scope.region],
                  "items.mfgId" : [scope.mfgid],
                  "retailerId" :scope.allRetailers,
                  "items.brandId" : [scope.selectedBrandID.toString()]
                }
                }
                dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforreporttime();
              }, function (response) {
               console.log(response);
             }
             );

         }


          scope.storesbarchartfunctionforDMA=function(){

             scope.region=scope.data.region;

          scope.storesbyregionsforreporttime=function(){

             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                 "bucketLevel" : "S",
                  "filters" : {
                    "location.regionName" : [scope.region],
                     "items.mfgId" : [scope.mfgid],
                     "retailerId" :scope.allRetailers,
                     "storeId": scope.dmaStoreList
                }
                }

                dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {

                   scope.topregionchartdata=[];
                    scope.unorderedList=[];

                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);

                  }
                     scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');

               scope.StoresbyregionforRT=scope.orderedList;

              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {

                 scope.indexvalue=0.00;

        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
        if(results){
        if(results.length>0){

           scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
                    var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
                  else{
                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);
                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);
        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){

                     scope.indexvalue=0.00;
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                 "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
        }
      }
              if(scope.topregionchartdata.length>10){
                    scope.chartheightlength=50* scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else{
                    scope.chartheight="120px";
                  }

          scope.allstoreswithretailer=scope.storeswithretailer;

           for(var j=0;j<scope.allstoreswithretailer.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){

              if(scope.topregionchartdata[k].storeid==scope.allstoreswithretailer[j].store_id){
                scope.topregionchartdata[k].storename= scope.allstoreswithretailer[j].retailer_name.toUpperCase()+" "+scope.allstoreswithretailer[j].store_name.toUpperCase();
                scope.topregionchartdata[k].retailer=scope.allstoreswithretailer[j].retailer_name;
                scope.topregionchartdata[k].retailerId=scope.allstoreswithretailer[j].retailer_id;
              }

            }
          }

             scope.chartdata=scope.topregionchartdata;
             scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

          $timeout(function () {
            initChart();
          }, 0);

              }, function (response) {
               console.log(response);
             }
             );
          }
              var data={
                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                  "bucketLevel" : "S",
                  "filters" : {
                  "location.regionName" : [scope.region],
                  "items.mfgId" : [scope.mfgid],
                  "retailerId" :scope.allRetailers,
                   "storeId": scope.dmaStoreList
                }
                }
                dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforreporttime();
              }, function (response) {
               console.log(response);
             }
             );

         }

         scope.storesbarchartfunctionforDMAwithBRAND=function(){

             scope.region=scope.data.region;

          scope.storesbyregionsforreporttime=function(){

             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                 "bucketLevel" : "S",
                  "filters" : {
                    "location.regionName" : [scope.region],
                     "items.mfgId" : [scope.mfgid],
                     "retailerId" :scope.allRetailers,
                     "storeId": scope.dmaStoreList,
                     "items.brandId" : [scope.selectedBrandID.toString()]
                }
                }

                dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {

                   scope.topregionchartdata=[];
                    scope.unorderedList=[];

                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);

                  }
                     scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');

               scope.StoresbyregionforRT=scope.orderedList;

              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {

                 scope.indexvalue=0.00;

        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
        if(results){
        if(results.length>0){

           scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
                    var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
                  else{
                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);
                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);
        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){

                     scope.indexvalue=0.00;
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                 "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
        }
      }
              if(scope.topregionchartdata.length>10){
                    scope.chartheightlength=50* scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else{
                    scope.chartheight="120px";
                  }

          scope.allstoreswithretailer=scope.storeswithretailer;

           for(var j=0;j<scope.allstoreswithretailer.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){

              if(scope.topregionchartdata[k].storeid==scope.allstoreswithretailer[j].store_id){
                scope.topregionchartdata[k].storename= scope.allstoreswithretailer[j].retailer_name.toUpperCase()+" "+scope.allstoreswithretailer[j].store_name.toUpperCase();
                scope.topregionchartdata[k].retailer=scope.allstoreswithretailer[j].retailer_name;
                scope.topregionchartdata[k].retailerId=scope.allstoreswithretailer[j].retailer_id;
              }

            }
          }

             scope.chartdata=scope.topregionchartdata;
             scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

          $timeout(function () {
            initChart();
          }, 0);

              }, function (response) {
               console.log(response);
             }
             );
          }
              var data={
                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                  "bucketLevel" : "S",
                  "filters" : {
                  "location.regionName" : [scope.region],
                  "items.mfgId" : [scope.mfgid],
                  "retailerId" :scope.allRetailers,
                   "storeId": scope.dmaStoreList,
                    "items.brandId" : [scope.selectedBrandID.toString()]
                }
                }
                dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforreporttime();
              }, function (response) {
               console.log(response);
             }
             );

         }



      scope.storesbarchartfunctionforRetailerwithBRAND=function(){

             scope.region=scope.data.region;

          scope.storesbyregionsforreporttime=function(){

             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                 "bucketLevel" : "S",
                  "filters" : {
                    "location.regionName" : [scope.region],
                     "items.mfgId" : [scope.mfgid],
                     "items.brandId" : [scope.selectedBrandID.toString()]
                }
                }

                dashBoardService.getsalesdatafordepartments(data).then(function (response) {

                   scope.topregionchartdata=[];
                    scope.unorderedList=[];

                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);

                  }
                     scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');

               scope.StoresbyregionforRT=scope.orderedList;

              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {

                 scope.indexvalue=0.00;

        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
        if(results){
        if(results.length>0){

           scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
                    var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
                  else{
                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);
                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);
        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){

                     scope.indexvalue=0.00;
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                 "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
        }
      }
              if(scope.topregionchartdata.length>10){
                    scope.chartheightlength=50* scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else{
                    scope.chartheight="120px";
                  }

          scope.allstoreswithretailer=scope.storeswithretailer;

           for(var j=0;j<scope.allstoreswithretailer.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){

              if(scope.topregionchartdata[k].storeid==scope.allstoreswithretailer[j].store_id){
                scope.topregionchartdata[k].storename= scope.allstoreswithretailer[j].retailer_name.toUpperCase()+" "+scope.allstoreswithretailer[j].store_name.toUpperCase();
                scope.topregionchartdata[k].retailer=scope.allstoreswithretailer[j].retailer_name;
                scope.topregionchartdata[k].retailerId=scope.allstoreswithretailer[j].retailer_id;
              }

            }
          }

             scope.chartdata=scope.topregionchartdata;
             scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

          $timeout(function () {
            initChart();
          }, 0);

              }, function (response) {
               console.log(response);
             }
             );
          }
              var data={
                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                  "bucketLevel" : "S",
                  "filters" : {
                  "location.regionName" : [scope.region],
                  "items.mfgId" : [scope.mfgid],
                    "items.brandId" : [scope.selectedBrandID.toString()]
                }
                }
                dashBoardService.getsalesdatafordepartments(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforreporttime();
              }, function (response) {
               console.log(response);
             }
             );

         }
      

       scope.storesbarchartfunctionforRetailer=function(){

             scope.region=scope.data.region;

          scope.storesbyregionsforreporttime=function(){

             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                 "bucketLevel" : "S",
                  "filters" : {
                    "location.regionName" : [scope.region],
                     "items.mfgId" : [scope.mfgid]
                    
                }
                }

                dashBoardService.getsalesdatafordepartments(data).then(function (response) {

                   scope.topregionchartdata=[];
                    scope.unorderedList=[];

                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);

                  }
                     scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');

               scope.StoresbyregionforRT=scope.orderedList;

              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {

                 scope.indexvalue=0.00;

        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
        if(results){
        if(results.length>0){

           scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
                    var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
                  else{
                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);
                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);
        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){

                     scope.indexvalue=0.00;
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                 "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
        }
      }
              if(scope.topregionchartdata.length>10){
                    scope.chartheightlength=50* scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else{
                    scope.chartheight="120px";
                  }

          scope.allstoreswithretailer=scope.storeswithretailer;

           for(var j=0;j<scope.allstoreswithretailer.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){

              if(scope.topregionchartdata[k].storeid==scope.allstoreswithretailer[j].store_id){
                scope.topregionchartdata[k].storename= scope.allstoreswithretailer[j].retailer_name.toUpperCase()+" "+scope.allstoreswithretailer[j].store_name.toUpperCase();
                scope.topregionchartdata[k].retailer=scope.allstoreswithretailer[j].retailer_name;
                scope.topregionchartdata[k].retailerId=scope.allstoreswithretailer[j].retailer_id;
              }

            }
          }

             scope.chartdata=scope.topregionchartdata;
             scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

          $timeout(function () {
            initChart();
          }, 0);

              }, function (response) {
               console.log(response);
             }
             );
          }
              var data={
                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                  "bucketLevel" : "S",
                  "filters" : {
                  "location.regionName" : [scope.region],
                  "items.mfgId" : [scope.mfgid]
                   
                }
                }
                dashBoardService.getsalesdatafordepartments(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforreporttime();
              }, function (response) {
               console.log(response);
             }
             );

         }
         

         scope.storesbarchartfunctionforStore=function(){

             scope.region=scope.data.region;

          scope.storesbyregionsforreporttime=function(){

             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                 "bucketLevel" : "S",
                  "filters" : {
                    "location.regionName" : [scope.region],
                     "items.mfgId" : [scope.mfgid]
                    
                }
                }

                dashBoardService.getsalesdatafordepartmentsbystore(data).then(function (response) {

                   scope.topregionchartdata=[];
                    scope.unorderedList=[];

                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);

                  }
                     scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');

               scope.StoresbyregionforRT=scope.orderedList;

              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {

                 scope.indexvalue=0.00;

        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
        if(results){
        if(results.length>0){

           scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
                    var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
                  else{
                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);
                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);
        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){

                     scope.indexvalue=0.00;
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                 "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
        }
      }
              if(scope.topregionchartdata.length>10){
                    scope.chartheightlength=50* scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else{
                    scope.chartheight="120px";
                  }

          scope.allstoreswithretailer=scope.storeswithretailer;

           for(var j=0;j<scope.allstoreswithretailer.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){

              if(scope.topregionchartdata[k].storeid==scope.allstoreswithretailer[j].store_id){
                scope.topregionchartdata[k].storename= scope.allstoreswithretailer[j].retailer_name.toUpperCase()+" "+scope.allstoreswithretailer[j].store_name.toUpperCase();
                scope.topregionchartdata[k].retailer=scope.allstoreswithretailer[j].retailer_name;
                scope.topregionchartdata[k].retailerId=scope.allstoreswithretailer[j].retailer_id;
              }

            }
          }

             scope.chartdata=scope.topregionchartdata;
             scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

          $timeout(function () {
            initChart();
          }, 0);

              }, function (response) {
               console.log(response);
             }
             );
          }
              var data={
                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                  "bucketLevel" : "S",
                  "filters" : {
                  "location.regionName" : [scope.region],
                  "items.mfgId" : [scope.mfgid]
                   
                }
                }
                dashBoardService.getsalesdatafordepartmentsbystore(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforreporttime();
              }, function (response) {
               console.log(response);
             }
             );

         }
          

           scope.storesbarchartfunctionforStorewithBRAND=function(){

             scope.region=scope.data.region;

          scope.storesbyregionsforreporttime=function(){

             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                 "bucketLevel" : "S",
                  "filters" : {
                    "location.regionName" : [scope.region],
                     "items.mfgId" : [scope.mfgid],
                      "items.brandId" : [scope.selectedBrandID.toString()]
                    
                }
                }

                dashBoardService.getsalesdatafordepartmentsbystore(data).then(function (response) {

                   scope.topregionchartdata=[];
                    scope.unorderedList=[];

                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);

                  }
                     scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');

               scope.StoresbyregionforRT=scope.orderedList;

              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {

                 scope.indexvalue=0.00;

        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
        if(results){
        if(results.length>0){

           scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
                    var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
                  else{
                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);
                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);
        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){

                     scope.indexvalue=0.00;
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                 "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
        }
      }
              if(scope.topregionchartdata.length>10){
                    scope.chartheightlength=50* scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else{
                    scope.chartheight="120px";
                  }

          scope.allstoreswithretailer=scope.storeswithretailer;

           for(var j=0;j<scope.allstoreswithretailer.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){

              if(scope.topregionchartdata[k].storeid==scope.allstoreswithretailer[j].store_id){
                scope.topregionchartdata[k].storename= scope.allstoreswithretailer[j].retailer_name.toUpperCase()+" "+scope.allstoreswithretailer[j].store_name.toUpperCase();
                scope.topregionchartdata[k].retailer=scope.allstoreswithretailer[j].retailer_name;
                scope.topregionchartdata[k].retailerId=scope.allstoreswithretailer[j].retailer_id;
              }

            }
          }

             scope.chartdata=scope.topregionchartdata;
             scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

          $timeout(function () {
            initChart();
          }, 0);

              }, function (response) {
               console.log(response);
             }
             );
          }
              var data={
                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                  "bucketLevel" : "S",
                  "filters" : {
                  "location.regionName" : [scope.region],
                  "items.mfgId" : [scope.mfgid],
                  "items.brandId" : [scope.selectedBrandID.toString()]
                   
                }
                }
                dashBoardService.getsalesdatafordepartmentsbystore(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforreporttime();
              }, function (response) {
               console.log(response);
             }
             );

         }







             //for distributor stores
              scope.storesbarchartfunctionfordistributor=function(){
             scope.region=scope.data.region;
          scope.storesbyregionsforDistributorbyRT=function(){
             var data={

                  "startTime": scope.data.reportstartTime,
                  "endTime": scope.data.repportendTime,
                  "bucketLevel" : "S",
                  "filters" : {
                  "location.regionName" : [scope.region],
                  "items.brandId" :dashBoardService.getBrandIdList()
                }
                }
                dashBoardService.getstoresbyRegion(data).then(function (response) {
                   scope.topregionchartdata=[];
                    scope.unorderedList=[];
                  for(var j=0;j<response.data.data.length;j++){
                    var unorderobject={
                      "amt":parseFloat(response.data.data[j].amt),
                      "id":response.data.data[j].id
                    }
                    scope.unorderedList.push(unorderobject);
                  }
                  scope.StoresbyregionforRT=[]
                  scope.orderedList= $filter('orderBy')(scope.unorderedList, '-amt');
               scope.StoresbyregionforRT=scope.orderedList;
              for (var i = 0; i <scope.StoresbyregionforRT.length; i++) {
                 scope.indexvalue=0.00;
        var results = $filter('filter')(scope.StoresbyregionforCT,{id :scope.StoresbyregionforRT[i].id}, true);
        if(results){
        if(results.length>0){

           scope.indexvalue=scope.StoresbyregionforRT[i].amt/results[0].amt
         scope.indexvalue=scope.indexvalue.toFixed(2);
         
        var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;
                    var amt1=(results[0].amt>=0)?results[0].amt:0;

                   var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": amt1,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
                  else{
                    var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue
                }
                 scope.topregionchartdata.push(object);
                  }
                }
        else{

         var amt=(scope.StoresbyregionforRT[i].amt>=0)?scope.StoresbyregionforRT[i].amt:0;

                      var object={
                  "storename": "",
                  "Sales": amt,
                  "Sales1": 0,
                  "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforRT[i].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);
        }

        }

        if(scope.StoresbyregionforCT){

        for(var k=0;k<scope.StoresbyregionforCT.length;k++){

             var results = $filter('filter')(scope.StoresbyregionforRT,{id :scope.StoresbyregionforCT[k].id}, true);
    
                  if(results.length==0){

                     scope.indexvalue=0.00;
                   
             var amt1=(scope.StoresbyregionforCT[k].amt>=0)?scope.StoresbyregionforCT[k].amt:0;

                    var object={
                  "storename": "",
                  "Sales": 0,
                  "Sales1": amt1,
                 "color": "#4C98CF",
                  "color1": "#7F2891",
                  "storeid":scope.StoresbyregionforCT[k].id,
                  "index":scope.indexvalue,
                  "retailer":""
                }
                 scope.topregionchartdata.push(object);

                  }
        }
      }
              if(scope.topregionchartdata.length>10){
                    scope.chartheightlength=50* scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=5){
                    scope.chartheightlength=45*scope.topregionchartdata.length;
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else if(scope.topregionchartdata.length>=2){
                    scope.chartheightlength=45* (scope.topregionchartdata.length);
                    scope.chartheight=scope.chartheightlength+"px";
                  }
              else{
                    scope.chartheight="120px";
                  }

          scope.allstoreswithretailer=scope.storeswithretailer;
           for(var j=0;j<scope.allstoreswithretailer.length;j++){
            for(var k=0;k<scope.topregionchartdata.length;k++){
              if(scope.topregionchartdata[k].storeid==scope.allstoreswithretailer[j].store_id){
                scope.topregionchartdata[k].storename= scope.allstoreswithretailer[j].retailer_name.toUpperCase()+" "+scope.allstoreswithretailer[j].store_name.toUpperCase();
                scope.topregionchartdata[k].retailer=scope.allstoreswithretailer[j].retailer_name;
                scope.topregionchartdata[k].retailerId=scope.allstoreswithretailer[j].retailer_id;
              }
            }
          }

             scope.chartdata=scope.topregionchartdata;
             scope.comapretimearray=[];
              scope.reporttimearray=[];
             for(var i=0;i<scope.chartdata.length;i++){
                scope.comapretimearray.push(parseFloat(scope.chartdata[0].Sales1));
              scope.reporttimearray.push(parseFloat(scope.chartdata[0].Sales));

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
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].Sales,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].Sales1,2);
            }   

          $timeout(function () {
            initChart();
          }, 0);

              }, function (response) {
               console.log(response);
             }
             );
          }
              var data={
                  "startTime": scope.data.comparestartTime,
                  "endTime": scope.data.compareendTime,
                 "bucketLevel" : "S",
                  "filters" : {
                    "items.brandId" :dashBoardService.getBrandIdList(),
                   "location.regionName" : [scope.region]
                   
                    }
                }
                dashBoardService.getstoresbyRegion(data).then(function (response) {
                  scope.StoresbyregionforCT=response.data.data;
                 scope.storesbyregionsforDistributorbyRT();
              }, function (response) {
               console.log(response);
             }
             );

         }

           scope.role=sessionStorage.role;
             scope.dmaStoreList=[];
               if(scope.role=="cpg"){
                scope.allRetailers=productService.getallRetailers();
                  scope.selectedcpg=dashBoardService.getsavestoreselected(); 
                  console.log( "scope.selectedcpg", scope.selectedcpg);
                  scope.selecteddma=dashBoardService.getselectedDMA();
                  scope.savedBrand=dashBoardService.getselectedBrand();
                  scope.selectedBrandID=scope.savedBrand.brandid;
                  if(scope.selecteddma!= null){
                    console.log("scope.selecteddma",scope.selecteddma);
                     for(var i=0; i< scope.selecteddma.stores.length; i++){
                       scope.dmaStoreList.push(scope.selecteddma.stores[i].toString());
                     }
                    // dma selected.........
                      if(scope.savedBrand.brand_name =="All Brands"){
                         scope.storesbarchartfunctionforDMA();
                      }else{
                         scope.storesbarchartfunctionforDMAwithBRAND();
                      }   
                  }
                  else if(scope.selectedcpg.name=="All Retailers"){
                    if(scope.savedBrand.brand_name=="All Brands"){
                       scope.storesbarchartfunctionforcpg();
                    }else{
                      scope.storesbarchartfunctionforcpgwithBRAND();
                    }
                      
                  }else{
                    // retailer selected............
                    if(scope.selectedcpg.hasOwnProperty("children")){
                       if(scope.savedBrand.brand_name =="All Brands"){
                        scope.storesbarchartfunctionforRetailer();
                       }
                       else{
                         scope.storesbarchartfunctionforRetailerwithBRAND();
                       }
                    }else{
                      // store selected...........
                      if(scope.savedBrand.brand_name =="All Brands"){
                        scope.storesbarchartfunctionforStore();
                       }
                       else{
                        scope.storesbarchartfunctionforStorewithBRAND();
                       }
                    }
                  }
           

               }
               else if(scope.role=="distributor"){
                scope.storesbarchartfunctionfordistributor();
               }
               else{
         scope.storesbarchartfunction();

               }

        }//end watch


      }
    }])
