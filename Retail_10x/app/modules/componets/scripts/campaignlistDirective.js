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


 angular.module('Campaigns.salesperformance', ['product.controllers','individualproduct.controllers'])

 .directive('campaignlistDirective', ['$compile', '$window', '$timeout','dashBoardService','$rootScope','$filter',
  function ($compile, $window, $timeout,dashBoardService,$rootScope,$filter) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        id: '=',
        data: '=',
        record:'='
      },
      templateUrl: 'modules/componets/views/campaignListtemplate.html',

      link: function (scope, element, attrs) {

        scope.chartid = scope.id;
        scope.chartdata = scope.data;
        scope.stores=scope.record.stores;
        scope.mfgId=sessionStorage.mfgId;
      //console.log("compare start data...",scope.record.salesDatacomparetime);
      //console.log("compare end data...",scope.record.retailerid);

        var chart = false;

        var initLineChart = function () {

         if (chart)chart.destroy();

         chart = AmCharts.makeChart(scope.chartid,
         {

                   type: "serial",
                   theme: "light",
                   dataProvider: scope.chartdata,

  pathToImages: "http://cdn.amcharts.com/lib/3/images/",
  dataDateFormat: "MM-DD-YYYY",
  categoryField: "date",
  categoryAxis: {
    parseDates: true,
    minPeriod: "DD",
    gridAlpha: 0.1,
    minorGridAlpha: 0.1,
    axisAlpha: 0,
    minorGridEnabled: true,
   //  guides: scope.guides,


  },

  valueAxes: [{

    tickLength: 0,
    axisAlpha: 0,
    showFirstLabel: false,
    showLastLabel: false,
  }],


  graphs: [{
    lineColor: "#ba5bbb",
    valueField: "value",
    bullet: "round",
    balloonText: "[[date]]<br><span style='font-size:12px;'>Sales Amt: $[[amtnumber]]</span>"
  },
  {
    lineColor: "#428dc9",
    valueField: "value1",
    bullet: "round",
    balloonText: "[[date1]]<br><span style='font-size:12px;'>Sales Amt: $[[amtnumber1]]</span>"
  }
  ],
  chartCursor: {},
    "balloon": {
              "fillColor": "#000000",
               "color": "#ffffff",
               "fillAlpha": 1.0,
              }
       }
        );
         chart.addListener("rendered", zoomChart);
         zoomChart();
         function zoomChart(){
             }
           }
           scope.$on('$destroy', function () {
            if (chart)
              chart.clear();
          });
          scope.role=sessionStorage.role;
        var campaignstartdate=new Date(scope.record.sdate);
        var campaignenddate=new Date(scope.record.edate);
        scope.campaignstartdate=
        moment(campaignstartdate).format("YYYY-MM-DD");
        if(scope.record.status=="Active"){
        scope.campaignenddate=
        moment().format("YYYY-MM-DD");
        }
        else if(scope.record.status=="Archived"){
        scope.campaignenddate=
        moment(campaignenddate).format("YYYY-MM-DD");
        }
        if(scope.record.status=="Active"){
        scope.todayDate=moment().format("YYYY-MM-DD");
        scope.guides=[{
      date : scope.campaignstartdate,
      //date : "2016-,
      label : "Start Date",
      position : "top",
      lineAlpha : 1,
      labelRotation : 90,
      lineColor : "#428dc9",
      inside: true
    },
     {
      date : scope.todayDate,
      label : "Today",
      position : "top",
      lineAlpha : 1,
      labelRotation : 90,
      lineColor : "red",
      inside: true
    }];
        }
        else{
          scope.guides=[{
      date : scope.campaignstartdate,
      label : "Start Date",
      position : "top",
      lineAlpha : 1,
      labelRotation : 90,
      lineColor : "#428dc9",
      inside: true,
    },
    {
      date : scope.campaignenddate,
      label : "End Date",
      position : "top",
      lineAlpha : 1,
      labelRotation : 90,
      lineColor : "#428dc9",
      inside: true,
    }];
        }

         scope.avgSaleschange=function(salestotal){
              var avgsalesData={
              "campaignStartTime":scope.record.reportstartDate,
               "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores
              }
            }
          dashBoardService.avgsalesData(avgsalesData).then(function (response) {

            var a = moment(scope.campaignstartdate,'YYYY-MM-DD');
            var b = moment(scope.campaignenddate, 'YYYY-MM-DD');
            var days = b.diff(a, 'days');
            scope.totalsales=days*parseFloat(response.data.dailyAverage);
            scope.percent="";
            scope.status="";
            scope.salesamtRT=parseFloat(salestotal);
            if(scope.totalsales>0&&scope.salesamtRT>0){
            if(scope.salesamtRT>scope.totalsales){
            scope.increase=scope.salesamtRT-scope.totalsales;
            scope.average=(scope.salesamtRT+scope.totalsales)/2;
            scope.increase=scope.increase/scope.average;
            scope.increasepercent=(scope.increase*100);
            scope.record.campaignRatio=scope.increasepercent.toFixed();
            scope.percent=scope.increasepercent.toFixed();
            scope.status="increase";
            }
            else{
             scope.decrease=scope.totalsales-scope.salesamtRT;
             scope.average=(scope.salesamtRT+scope.totalsales)/2;
              // console.log("decrease...",scope.decrease);
               //console.log("average...",scope.average);
             scope.decrease=scope.decrease/scope.average;
             scope.decreasepercent=(scope.decrease*100);
             scope.record.campaignRatio=scope.decreasepercent.toFixed();
             scope.percent=scope.decreasepercent.toFixed();
             scope.status="decrease";
             }
             }
             else{
              scope.percent=0.00;
              scope.status="increase";
              }
              if(isNaN(scope.percent)){
                scope.percent=0.00;
                scope.status="increase";
                  }
              var object={
              "campaign_id":scope.record.campaign_id,
              "ratio":scope.percent,
              "status":scope.status
             }
              //console.log("ratio object...",object);
             $rootScope.$emit('campaignRatio', object);
               }, function (response) {
                console.log(response);
               }
             );
            }


             scope.avgSaleschangeforcpg=function(salestotal){
              var avgsalesData={
              "campaignStartTime":scope.record.reportstartDate,
               "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores,
                 "items.mfgId" : [scope.mfgId]
              }
            }
          dashBoardService.avgsalesDataforcpg(avgsalesData).then(function (response) {
            var a = moment(scope.campaignstartdate,'YYYY-MM-DD');
            var b = moment(scope.campaignenddate, 'YYYY-MM-DD');
            var days = b.diff(a, 'days');
            scope.totalsales=days*parseFloat(response.data.dailyAverage);
            scope.percent="";
            scope.status="";
            scope.salesamtRT=parseFloat(salestotal);
            if(scope.totalsales>0&&scope.salesamtRT>0){
            if(scope.salesamtRT>scope.totalsales){
              scope.increase=scope.salesamtRT-scope.totalsales;
              scope.average=(scope.salesamtRT+scope.totalsales)/2;
              scope.increase=scope.increase/scope.average;
              scope.increasepercent=(scope.increase*100);
              scope.record.campaignRatio=scope.increasepercent.toFixed();
              scope.percent=scope.increasepercent.toFixed();
              scope.status="increase";
            }
            else{
             scope.decrease=scope.totalsales-scope.salesamtRT;
             scope.average=(scope.salesamtRT+scope.totalsales)/2;
             //console.log("decrease...",scope.decrease);
             //console.log("average...",scope.average);
             scope.decrease=scope.decrease/scope.average;
             scope.decreasepercent=(scope.decrease*100);
             scope.record.campaignRatio=scope.decreasepercent.toFixed();
             scope.percent=scope.decreasepercent.toFixed();
             scope.status="decrease";
                  }
                     }
                     else{
                      scope.percent=0.00;
                      scope.status="increase";
                     }
                  if(isNaN(scope.percent)){
                    scope.percent=0.00;
                    scope.status="increase";
                  }
              var object={
              "campaign_id":scope.record.campaign_id,
              "ratio":scope.percent,
              "status":scope.status
             }
          $rootScope.$emit('campaignRatio', object);
               }, function (response) {
          console.log(response);
               }
             );
            }

            scope.spin=false;
          scope.salesDatalinechartforCampaigns=function(){
            scope.spin=true;
          scope.salesDataforcampaignsforreporttime=function () {
              var salesDataObject={
                "aggTimeUnit":"1d",
                "startTime":scope.record.salesDatareporttime,
                "endTime": scope.record.reportendDate,
                "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores
                }
               }
            scope.campaignSalesData=[];
            dashBoardService.GetSalesPerformance(salesDataObject).then(function (response) {
             scope.salesDatatotal=response.data.total;
             scope.ProductsbyRT = response.data.data;
             scope.salesDataIndex=parseFloat(response.data.total)
             /scope.salesDatatotalforcampaignsforcomparetime;
             scope.salesDataIndex=scope.salesDataIndex.toFixed(2);
             scope.linechartData=[];
             if(isNaN(scope.salesDataIndex)){
              scope.salesDataIndex=0.00;
             }
             scope.spin=false;
             scope.length=0;
             if(scope.ProductsbyRT!=undefined){
             if(scope.ProductsbyCT.length>0||scope.ProductsbyRT.length>0){
             if(scope.ProductsbyCT.length>=scope.ProductsbyRT.length){
              scope.length=scope.ProductsbyCT.length;
             }
             else{
             scope.length=scope.ProductsbyRT.length;
             }
           scope.j=1;
           var a = moment(scope.record.reportstartDate);
           var b = moment(scope.record.reportendDate);
           var days = b.diff(a, 'days');
           for(var i=0;i<days;i++){
           if(i==0){
               scope.date=moment(scope.record.reportstartDate).format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
               scope.ResultDate1=moment(scope.ResultDate).subtract(1,'year').format("MM-DD-YYYY");
             }
             else{
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
               scope.ResultDate1=moment(scope.ResultDate).subtract(1,'year').format("MM-DD-YYYY");
               scope.j++;
             }
             if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){
               var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value": scope.ProductsbyRT[i].amt,
                 "value1":  scope.ProductsbyCT[i].amt
               }
             }
             else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
               var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value": scope.ProductsbyRT[i].amt,
                 "value1":0
               }
             }
             else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
               var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value":0,
                 "value1": scope.ProductsbyCT[i].amt
               }
             }
             else{
              var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value":0,
                 "value1": 0
               }
             }
             scope.linechartData.push(linechartdataobject);
           }
           scope.chartdata=scope.linechartData;
           scope.showchart=true;
             }
             else{
              scope.chartdata=[];
            scope.salesDataIndex=0.00;
            scope.salesDatatotal=0.00;
             scope.showchart=false;
             }
           }
           else{
            scope.chartdata=[];
            scope.salesDataIndex=0.00;
            scope.salesDatatotal=0.00;
            scope.showchart=false;
              
           }
           for(var i=0;i<scope.chartdata.length;i++){
          scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].value,2);
          scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].value1,2);
            }

               $timeout(function () {
            if (chart)
              chart.clear();
            initLineChart();
          }, 0);

          var object={
            "index":scope.salesDataIndex,
            "campaign_id":scope.record.campaign_id,
            "chartData":scope.chartdata,
            "total":scope.salesDatatotal,
            "showchart":scope.showchart
          }
          scope.avgSaleschange(scope.salesDatatotal);
          //console.log("object....",object);
          $rootScope.$emit('campaignSales', object);
        }, function (response) {
          console.log(response);
        }
        );
          }


          var salesDataObjectforcomparetime={
            "aggTimeUnit":"1d",
              "startTime":scope.record.salesDatacomparetime,
              "endTime":scope.record.compareendDate,
               "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores
              }
            }



            dashBoardService.GetSalesPerformance(salesDataObjectforcomparetime).then(function (response) {
              scope.salesDatatotalforcampaignsforcomparetime=parseInt(response.data.total);

              scope.ProductsbyCT = response.data.data;
              scope.salesDataforcampaignsforreporttime();

        if(scope.ProductsbyCT && scope.ProductsbyCT.length==0){

        }
        else{

        }

            }, function (response) {
              console.log(response);
            }
            );

          }


          scope.salesDatalinechartforCampaignsforcpgbyretailer=function(){
               scope.spin=true;
            scope.salesDataforcampaignsforreporttime=function () {

              var salesDataObject={
                "aggTimeUnit":"1d",
                "startTime":scope.record.salesDatareporttime,
               "endTime": scope.record.reportendDate,
               "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores,
                "items.mfgId" : [scope.mfgId]
              }
            }

            scope.campaignSalesData=[];

            dashBoardService.GetSalesPerformance(salesDataObject).then(function (response) {

             scope.salesDatatotal=response.data.total;
             scope.ProductsbyRT = response.data.data;

             scope.salesDataIndex=parseFloat(response.data.total)
             /scope.salesDatatotalforcampaignsforcomparetime;

             scope.salesDataIndex=scope.salesDataIndex.toFixed(2);

             scope.linechartData=[];

             if(isNaN(scope.salesDataIndex)){
              scope.salesDataIndex=0.00;
             }


          scope.spin=false;
                              
             scope.length=0;
             if(scope.ProductsbyRT!=undefined){

              if(scope.ProductsbyCT.length>0||scope.ProductsbyRT.length>0){
           if(scope.ProductsbyCT.length>=scope.ProductsbyRT.length){
              scope.length=scope.ProductsbyCT.length;
            }
            else{
             scope.length=scope.ProductsbyRT.length;

           }
           scope.j=1;

           var a = moment(scope.record.reportstartDate);
                var b = moment(scope.record.reportendDate);
              var days = b.diff(a, 'days');

           for(var i=0;i<days;i++){

             if(i==0){
               scope.date=moment(scope.record.reportstartDate).format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
              scope.ResultDate1=moment(scope.ResultDate).subtract(1,'year').format("MM-DD-YYYY");

             }
             else{
               
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
            scope.ResultDate1=moment(scope.ResultDate).subtract(1,'year').format("MM-DD-YYYY");

               scope.j++;

             }


             if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){
               var linechartdataobject={

                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value": scope.ProductsbyRT[i].amt,
                 "value1":  scope.ProductsbyCT[i].amt
               }
             }
             else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
               var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value": scope.ProductsbyRT[i].amt,
                 "value1":0
               }
             }

             else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
               var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value":0,
                 "value1": scope.ProductsbyCT[i].amt
               }
             }
             else{
              var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value":0,
                 "value1": 0
               }
             }

             scope.linechartData.push(linechartdataobject);
             scope.showchart=true;


           }

           scope.chartdata=scope.linechartData;

             }
             else{
              scope.chartdata=[];
            scope.salesDataIndex=0.00;
            scope.salesDatatotal=0.00;
            scope.showchart=false;
             }
           }
           else{

            scope.chartdata=[];
            scope.salesDataIndex=0.0;
            scope.salesDatatotal=0.0;
            scope.showchart=false;
              
           }

           for(var i=0;i<scope.chartdata.length;i++){
       scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].value,2);

     scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].value1,2);
            }

               $timeout(function () {
            if (chart)
              chart.clear();
            initLineChart();
          }, 0);

          var object={
            "index":scope.salesDataIndex,
            "campaign_id":scope.record.campaign_id,
            "chartData":scope.chartdata,
            "total":scope.salesDatatotal,
            "showchart":scope.showchart
          }
          scope.avgSaleschangeforcpg(scope.salesDatatotal);

          $rootScope.$emit('campaignSales', object);


         
        }, function (response) {
          console.log(response);
        }
        );

          }


          var salesDataObjectforcomparetime={
            "aggTimeUnit":"1d",
              "startTime":scope.record.salesDatacomparetime,
              "endTime":scope.record.compareendDate,
               "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores,
                "items.mfgId" : [scope.mfgId]
              }
            }

            dashBoardService.GetSalesPerformance(salesDataObjectforcomparetime).then(function (response) {
              scope.salesDatatotalforcampaignsforcomparetime=parseInt(response.data.total);

              scope.ProductsbyCT = response.data.data;
              scope.salesDataforcampaignsforreporttime();

        if(scope.ProductsbyCT && scope.ProductsbyCT.length==0){

        }
        else{
        }

            }, function (response) {
              console.log(response);
            }
            );

          }


          scope.salesDatalinechartforCampaignsforcpg=function(){
                scope.spin=true;
            scope.salesDataforcampaignsforreporttimeforcpg=function () {

             var salesDataObject={
              "aggTimeUnit":"1d",
                "startTime":scope.record.salesDatareporttime,
               "endTime": scope.record.reportendDate,
               "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores,
                "items.mfgId" : [scope.mfgId]
              }
            }

            scope.campaignSalesData=[];
            dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(salesDataObject).then(function (response) {
               //console.log("response...",response);
             scope.salesDatatotal=response.data.total;
             scope.ProductsbyRT = response.data.data;
             scope.salesDataIndex=parseFloat(response.data.total)
             /scope.salesDatatotalforcampaignsforcomparetime;
             scope.salesDataIndex=scope.salesDataIndex.toFixed(2);
             scope.linechartData=[];
             scope.length=0;
             //console.log("response ct...",scope.ProductsbyCT);
             //console.log("response rt...",scope.ProductsbyRT);
             if(scope.ProductsbyRT){
              if(scope.ProductsbyCT.length>=scope.ProductsbyRT.length){
              scope.length=scope.ProductsbyCT.length;
             }
            else{
             scope.length=scope.ProductsbyCT.length;
             }
             }
           scope.j=1;
           var a = moment(scope.record.reportstartDate);
           var b = moment(scope.record.reportendDate);
           var days = b.diff(a, 'days');
              if(scope.ProductsbyRT){
                 for(var i=0;i<days;i++){

             if(i==0){
               scope.date=moment(scope.record.reportstartDate).format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
              scope.ResultDate1=moment(scope.ResultDate).subtract(1,'year').format("MM-DD-YYYY");
             }
             else{
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
               scope.ResultDate1=moment(scope.ResultDate).subtract(1,'year').format("MM-DD-YYYY");
               scope.j++;
             }
             if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){
               var linechartdataobject={

                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value": scope.ProductsbyRT[i].amt,
                 "value1":  scope.ProductsbyCT[i].amt
               }
             }
             else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
               var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value": scope.ProductsbyRT[i].amt,
                 "value1":0
               }
             }
             else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
               var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value":0,
                 "value1": scope.ProductsbyCT[i].amt
               }
             }
             else{
              var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value":0,
                 "value1": 0
               }
             }
             scope.linechartData.push(linechartdataobject);
             scope.showchart=true;
           }
              }
           scope.chartdata=scope.linechartData;
           for(var i=0;i<scope.chartdata.length;i++){
           scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].value,2);
           scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].value1,2);
            }

           $timeout(function () {
            if (chart)
              chart.clear();
            initLineChart();
          }, 0);


           var object={
            "index":scope.salesDataIndex,
            "campaign_id":scope.record.campaign_id,
            "chartData":scope.chartdata,
            "total":scope.salesDatatotal,
            "showchart":scope.showchart
          }
          $rootScope.$emit('campaignSales', object);
          scope.avgSaleschangeforcpg(scope.salesDatatotal);

           scope.spin=false;


        }, function (response) {
          console.log(response);
        }
        );
          }

          var salesDataObjectforcomparetime={
            "aggTimeUnit":"1d",
               "startTime":scope.record.salesDatacomparetime,
               "endTime":scope.record.compareendDate,
               "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores,
                "items.mfgId" : [scope.mfgId]
              }
            }


            dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(salesDataObjectforcomparetime).then(function (response) {
              scope.salesDatatotalforcampaignsforcomparetime=parseInt(response.data.total);

              scope.salesDataforcampaignsforreporttimeforcpg();

              scope.ProductsbyCT = response.data.data;

            }, function (response) {
              console.log(response);
            }
            );

          }


           scope.salesDatalinechartforDistributor=function(retailerId){
               scope.spin=true;
            scope.salesDataforDistributorforreporttime=function (retailer) {

              var salesDataObject={
                "aggTimeUnit":"1d",
                "startTime":scope.record.salesDatareporttime,
               "endTime": scope.record.reportendDate,
               "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores
              }
            }

            scope.campaignSalesData=[];
              sessionStorage.user=retailer;
            dashBoardService.GetSalesPerformance(salesDataObject).then(function (response) {

             scope.salesDatatotal=response.data.total;
             scope.ProductsbyRT = response.data.data;

             scope.salesDataIndex=parseFloat(response.data.total)
             /scope.salesDatatotalforcampaignsforcomparetime;

             scope.salesDataIndex=scope.salesDataIndex.toFixed(2);

             scope.linechartData=[];

             if(isNaN(scope.salesDataIndex)){
              scope.salesDataIndex=0.00;
             }

          scope.spin=false;
                              
             scope.length=0;
             if(scope.ProductsbyRT!=undefined){

              if(scope.ProductsbyCT.length>0||scope.ProductsbyRT.length>0){
           if(scope.ProductsbyCT.length>=scope.ProductsbyRT.length){
              scope.length=scope.ProductsbyCT.length;
            }
            else{
             scope.length=scope.ProductsbyRT.length;

           }
           scope.j=1;

           var a = moment(scope.record.reportstartDate);
                var b = moment(scope.record.reportendDate);
              var days = b.diff(a, 'days');

           for(var i=0;i<days;i++){

    if(i==0){
               scope.date=moment(scope.record.reportstartDate).format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");

            scope.ResultDate1=moment(scope.ResultDate).subtract(1,'year').format("MM-DD-YYYY");

             }
             else{
               
               scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
               scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
              scope.ResultDate1=moment(scope.ResultDate).subtract(1,'year').format("MM-DD-YYYY");

               scope.j++;

             }


             if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]){
               var linechartdataobject={

                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value": scope.ProductsbyRT[i].amt,
                 "value1":  scope.ProductsbyCT[i].amt
               }
             }
             else if(scope.ProductsbyRT[i]&&scope.ProductsbyCT[i]==undefined){
               var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value": scope.ProductsbyRT[i].amt,
                 "value1":0
               }
             }

             else if(scope.ProductsbyCT[i]&&scope.ProductsbyRT[i]==undefined){
               var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value":0,
                 "value1": scope.ProductsbyCT[i].amt
               }
             }
             else{
              var linechartdataobject={
                 "date": scope.ResultDate,
                  "date1":scope.ResultDate1,
                 "lineColor": "rgb(66, 141, 201)",
                 "value":0,
                 "value1": 0
               }
             }
             scope.linechartData.push(linechartdataobject);
           }
           scope.chartdata=scope.linechartData;
           scope.showchart=true;
             }
             else{
              scope.chartdata=[];
            scope.salesDataIndex=0.00;
            scope.salesDatatotal=0.00;
             scope.showchart=false;
             }
           }
           else{
            scope.chartdata=[];
            scope.salesDataIndex=0.00;
            scope.salesDatatotal=0.00;
            scope.showchart=false;
           }
        for(var i=0;i<scope.chartdata.length;i++){
          scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].value,2);
          scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].value1,2);
            }
          $timeout(function () {
            if (chart)
              chart.clear();
            initLineChart();
          }, 0);

          var object={
            "index":scope.salesDataIndex,
            "campaign_id":scope.record.campaign_id,
            "chartData":scope.chartdata,
            "total":scope.salesDatatotal,
            "showchart":scope.showchart
          }
          scope.avgSaleschange(scope.salesDatatotal);
          //console.log("object....",object);
          $rootScope.$emit('campaignSales', object);
        }, function (response) {
          console.log(response);
        }
        );
          }
          var salesDataObjectforcomparetime={
            "aggTimeUnit":"1d",
              "startTime":scope.record.salesDatacomparetime,
              "endTime":scope.record.compareendDate,
               "filters": {
                "item.upc" :scope.record.products ,
                "storeId" : scope.stores
              }
            }
           sessionStorage.user=retailerId;
            dashBoardService.GetSalesPerformance(salesDataObjectforcomparetime).then(function (response) {
              scope.salesDatatotalforcampaignsforcomparetime=parseInt(response.data.total);
              scope.ProductsbyCT = response.data.data;
              scope.salesDataforDistributorforreporttime(retailerId);
              if(!scope.ProductsbyCT){
              scope.ProductsbyCT=[];
              }
            else{
              // console.log("ct response..",scope.ProductsbyCT);
            }
            }, function (response) {
              console.log(response);
            }
            );
          }
          if(scope.role=="cpg"){
            sessionStorage.user=scope.record.retailerid;
            /*if(scope.record.apistatus=="retailer"){
             scope.salesDatalinechartforCampaigns();
           }
           else if(scope.record.apistatus=="cpg"){
            scope.salesDatalinechartforCampaignsforcpg();
          }
          else{
             scope.salesDatalinechartforCampaignsforcpg();
          }*/
           scope.salesDatalinechartforCampaigns();
        }
        else if(scope.role=="retailer"){
          scope.salesDatalinechartforCampaigns();
        }
        else{
      // sessionStorage.user=scope.record.retailerid;
       scope.salesDatalinechartforDistributor(scope.record.retailerid);
        }
          var destroyStore;
          destroyStore=   $rootScope.$on('getstorerecordList', function (event, data) {
            scope.stores=[];
       for(var i=0;i<data.length;i++){
        scope.stores.push(data[i]);
      }
      if(scope.role=="cpg"){
        sessionStorage.user=scope.record.retailerid;
        /*if(scope.record.apistatus=="retailer"){
         scope.salesDatalinechartforCampaignsforcpgbyretailer();
       }
       else if(scope.record.apistatus=="cpg"){
        scope.salesDatalinechartforCampaignsforcpg();
      }
      else{
             scope.salesDatalinechartforCampaignsforcpg();
          }*/
           scope.salesDatalinechartforCampaigns();
    }
    else if(scope.role=="retailer"){
     scope.salesDatalinechartforCampaigns();
   }
   else{
      // sessionStorage.user=scope.record.retailerid;
       scope.salesDatalinechartforDistributor(scope.record.retailerid);
   }
 });
          scope.$on('$destroy', function() {
            destroyStore();
          });


        }
      }
    }])
