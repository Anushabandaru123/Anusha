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


angular.module('Retails.storecomparision', [])

  .directive('storecompareDirective', ['$compile', '$window', '$timeout','$rootScope','productService','dashBoardService','$filter',
    function ($compile, $window, $timeout,$rootScope,productService,dashBoardService,$filter) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          id: '=',
          data:'=',
          dates:'=',
          storeid:'=',
          retailerid:'=',
        },
        templateUrl: 'modules/componets/views/storecomparetemplate.html',

        link: function (scope, element, attrs) {

           scope.chartid = scope.id;
           scope.chartdata=scope.data;
           scope.storeId=scope.storeid;
           //console.log("retailerId...",scope.retailerid);
             
             scope.reportdate=moment(scope.dates.reportstartdate).format("YYYY-MM-DD");
             scope.reportenddate=moment(scope.dates.reportenddate).format("YYYY-MM-DD");
              
              var chart = false;

              var initLineChart = function () {
              if (chart)chart.destroy();
            chart = AmCharts.makeChart(scope.chartid,
            {
                           type: "serial",
                           theme: "light",
                           dataProvider: scope.chartdata,

                           //pathToImages: "//cdn.amcharts.com/lib/3/images/",
                           dataDateFormat: "MM-DD-YYYY",
                           categoryField: "date",
                           categoryAxis: {
                             parseDates: true,
                             minPeriod: "DD",
                             gridAlpha: 0.1,
                             minorGridAlpha: 0.1,
                             axisAlpha: 0,
                             boldPeriodBeginning:false,
                             minorGridEnabled: true,
                              dateFormats : [{
                                 period: 'fff',
                                 format: 'JJ:NN:SS'
                                 }, {
                                 period: 'ss',
                                 format: 'JJ:NN:SS'
                                 }, {
                                 period: 'mm',
                                 format: 'JJ:NN'
                                 }, {
                                 period: 'hh',
                                 format: 'JJ:NN'
                                 }, {
                                 period: 'DD',
                                 format: 'MMM DD'
                                 }, {
                                 period: 'WW',
                                 format: 'MMM DD'
                                 }, {
                                 period: 'MM',
                                 format: 'MMM YYYY'
                                 }, {
                                 period: 'YYYY',
                                 format: 'MMM YYYY'
                                 }],
                             
                           
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
                             balloonText: "[[date]]<br><span style='font-size:14px;'>Sales Amt: $[[amtnumber]]</span>"
                           },
                             {
                               lineColor: "#428dc9",
                               valueField: "value2",
                               bullet: "round",
                               balloonText: "[[date1]]<br><span style='font-size:14px;'>Sales Amt: $[[amtnumber1]]</span>"
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

         for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].value,2);
            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].value2,2);
            }
         $timeout(function () {
           if (chart)
             chart.clear();
           initLineChart();
         }, 0);
         scope.$on('$destroy', function () {
           if (chart)
             chart.clear();
         });

         scope.SalesPerformanceByStoreId = function (storeid) {
    scope.SalesPerformanceByStoreIdbyRT = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": scope.reportStartDate,
        "endTime": scope.reportEndDate
      }
       sessionStorage.storeId = parseInt(scope.storeId);
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          scope.total = '$' + response.data.total;
          scope.linechartData=[];
          scope.rpIndextotal = parseFloat(response.data.total);
          if (scope.spIndextotal == 0||scope.spIndextotal == null) {
            scope.spIndex = 0;
          }
          else {
            scope.spIndex = scope.rpIndextotal /scope.spIndextotal;
            scope.spIndex = scope.spIndex.toFixed(2);
          }

          var dataobject={
              "storeid":  scope.storeId,
              "index":scope.spIndex,
               "total":scope.rpIndextotal,
               }
          $rootScope.$emit('storecomparisonindex', dataobject);


           scope.j=1;

          for(var i=0;i<=response.data.data.length;i++){

            if(i==0){
              scope.date=moment(scope.reportStartDate).utc().format("YYYY-MM-DD");
              scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
              scope.ResultDate1=moment(scope.compareStartDate).utc().format("MM-DD-YYYY");
             }
             else{
            scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
            scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
            scope.ResultDate1=moment(scope.compareStartDate).add(i,'days').utc().format("MM-DD-YYYY");
               scope.j++;
             }
             if(response.data.data&&scope.Cpdata){
          if(response.data.data[i]&&scope.Cpdata[i]){
             var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": scope.Cpdata[i].amt
                      }
              scope.linechartData.push(linechartdataobject);
          }
          else if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              scope.linechartData.push(linechartdataobject);
          }
          else if(scope.Cpdata[i]){
               var linechartdataobject = {
                        "id":scope.Cpdata[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2": scope.Cpdata[i]
                      }
              // scope.productchartdata.push(object);
              scope.linechartData.push(linechartdataobject);
          }
             }
             else{
              if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              scope.linechartData.push(linechartdataobject);
          }
             }
          }
          scope.chartdata=scope.linechartData;
          for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].value,2);
            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].value2,2);
            }
          $timeout(function () {
           if (chart)
             chart.clear();
           initLineChart();
         }, 0);
        }, function (response) {
          console.log(response);
        }
      );
    }
    var data = {
       "aggTimeUnit": "1d",
      "startTime": scope.compareStartDate,
      "endTime": scope.compareEndDate,
      
       }
           sessionStorage.storeId = parseInt(scope.storeId);
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
        scope.spIndextotal = parseFloat(response.data.total);
        //console.log("for compare time...",response.data);
        scope.Cpdata=response.data.data;
        scope.SalesPerformanceByStoreIdbyRT();
      }, function (response) {
        console.log(response);
      }
    );
  }
         scope.mfgid=sessionStorage.mfgId;
         scope.SalesPerformanceByStoreIdforcpg = function (storeid) {
  //  $scope.showspinner();
    scope.SalesPerformanceByStoreIdbyRT = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": scope.reportStartDate,
        "endTime": scope.reportEndDate,
        "filters": {
          "items.mfgId" : [scope.mfgid]
        }
      }
             sessionStorage.storeId = parseInt(scope.storeId);
               sessionStorage.user=scope.retailerid;
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          scope.total = '$' + response.data.total;
          scope.linechartData=[];
          console.log("for report time...",response.data);
          scope.rpIndextotal = parseFloat(response.data.total);
          if (scope.spIndextotal == 0||scope.spIndextotal == null) {
            scope.spIndex = 0;
          }
          else {
            scope.spIndex = scope.rpIndextotal /scope.spIndextotal;
            scope.spIndex = scope.spIndex.toFixed(2);
          }

           var dataobject={
              "storeid":  scope.storeId,
              "index":scope.spIndex,
               "total":scope.rpIndextotal,
               }
          $rootScope.$emit('storecomparisonindex', dataobject);
           scope.j=1;
          for(var i=0;i<=response.data.data.length;i++){
            if(i==0){
            scope.date=moment(scope.reportStartDate).utc().format("YYYY-MM-DD");
            scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
            scope.ResultDate1=moment(scope.compareStartDate).utc().format("MM-DD-YYYY");
             }
             else{
          scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
          scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
          scope.ResultDate1=moment(scope.compareStartDate).add(i,'days').utc().format("MM-DD-YYYY");
               scope.j++;
             }
         if(response.data.data&&scope.Cpdata){
          if(response.data.data[i]&&scope.Cpdata[i]){
             var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": scope.Cpdata[i].amt
                      }
              scope.linechartData.push(linechartdataobject);
          }
          else if(response.data.data[i]){

            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              scope.linechartData.push(linechartdataobject);
          }
          else if(scope.Cpdata[i]){
               var linechartdataobject = {
                        "id":scope.Cpdata[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2": scope.Cpdata[i]
                      }
              // scope.productchartdata.push(object);
              scope.linechartData.push(linechartdataobject);
          }
             }
             else{
              if(response.data.data[i]){

            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              scope.linechartData.push(linechartdataobject);
          }
             }
          }
          scope.chartdata=scope.linechartData;
          for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].value,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].value2,2);
            }

          $timeout(function () {
           if (chart)
             chart.clear();
           initLineChart();
         }, 0);
        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": scope.compareStartDate,
      "endTime": scope.compareEndDate,
       "filters": {
          "items.mfgId" : [scope.mfgid]
        }
    }
           sessionStorage.storeId = parseInt(scope.storeId);
            sessionStorage.user=scope.retailerid;
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
        scope.spIndextotal = parseFloat(response.data.total);
        //console.log("for compare time...",response.data);
        scope.Cpdata=response.data.data;
        scope.SalesPerformanceByStoreIdbyRT();
      }, function (response) {
        console.log(response);
      }
    );
  }

  scope.SalesPerformanceByStoreIdfordistributor = function (storeid) {
  //  $scope.showspinner();
    scope.SalesPerformanceByStoreIdbyRTfordistributor = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": scope.reportStartDate,
        "endTime": scope.reportEndDate,
        "filters": {
         "items.brandId" :dashBoardService.getBrandIdList()
        }
      }
             sessionStorage.storeId = parseInt(scope.storeId);
               sessionStorage.user=scope.retailerid;
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          scope.total = '$' + response.data.total;
          scope.linechartData=[];
          console.log("for report time...",response.data);
          scope.rpIndextotal = parseFloat(response.data.total);
          if (scope.spIndextotal == 0||scope.spIndextotal == null) {
            scope.spIndex = 0;
          }
          else {
            scope.spIndex = scope.rpIndextotal /scope.spIndextotal;
            scope.spIndex = scope.spIndex.toFixed(2);
          }

           var dataobject={
              "storeid":  scope.storeId,
              "index":scope.spIndex,
               "total":scope.rpIndextotal,
               }
          $rootScope.$emit('storecomparisonindex', dataobject);
           scope.j=1;
          for(var i=0;i<=response.data.data.length;i++){
            if(i==0){
            scope.date=moment(scope.reportStartDate).utc().format("YYYY-MM-DD");
            scope.ResultDate=moment(scope.date).format("MM-DD-YYYY");
            scope.ResultDate1=moment(scope.compareStartDate).utc().format("MM-DD-YYYY");
             }
             else{
          scope.nextDate=moment(scope.date).add(scope.j,'days').format("YYYY-MM-DD");
          scope.ResultDate=moment(scope.nextDate).format("MM-DD-YYYY");
          scope.ResultDate1=moment(scope.compareStartDate).add(i,'days').utc().format("MM-DD-YYYY");
               scope.j++;
             }
         if(response.data.data&&scope.Cpdata){
          if(response.data.data[i]&&scope.Cpdata[i]){
             var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": scope.Cpdata[i].amt
                      }
              scope.linechartData.push(linechartdataobject);
          }
          else if(response.data.data[i]){

            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              scope.linechartData.push(linechartdataobject);
          }
          else if(scope.Cpdata[i]){
               var linechartdataobject = {
                        "id":scope.Cpdata[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2": scope.Cpdata[i]
                      }
              // scope.productchartdata.push(object);
              scope.linechartData.push(linechartdataobject);
          }
             }
             else{
              if(response.data.data[i]){

            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": scope.ResultDate,
                        "date1":scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              scope.linechartData.push(linechartdataobject);
          }
             }
            
          }
          scope.chartdata=scope.linechartData;
          for(var i=0;i<scope.chartdata.length;i++){
            scope.chartdata[i].amtnumber=$filter('number')(scope.chartdata[i].value,2);

            scope.chartdata[i].amtnumber1=$filter('number')(scope.chartdata[i].value2,2);
            }
          $timeout(function () {
           if (chart)
             chart.clear();
           initLineChart();
         }, 0);
        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": scope.compareStartDate,
      "endTime": scope.compareEndDate,
       "filters": {
          "items.brandId" :dashBoardService.getBrandIdList()
        }
    }
      sessionStorage.storeId = parseInt(scope.storeId);
      sessionStorage.user=scope.retailerid;
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
        scope.spIndextotal = parseFloat(response.data.total);
        scope.Cpdata=response.data.data;
        scope.SalesPerformanceByStoreIdbyRTfordistributor();
      }, function (response) {
        console.log(response);
      }
    );
  }
       var linechartevent;
         linechartevent=$rootScope.$on('LinechartEventforstore', function (event, data) {
              //console.log("data...",data);
              scope.reportStartDate=data.reportStartDate;
              scope.reportEndDate=data.reportEndDate;
              scope.compareStartDate=data.compareStartDate;
              scope.compareEndDate=data.compareEndDate;
              scope.role=sessionStorage.role;

               if(scope.role=="cpg"){
                scope.SalesPerformanceByStoreIdforcpg(scope.storeId);
               }
               else if(scope.role=="distributor"){
              scope.SalesPerformanceByStoreIdfordistributor(scope.storeId);
               }
               else{
             scope.SalesPerformanceByStoreId(scope.storeId);
               }
         });

        }
      }
    }])
