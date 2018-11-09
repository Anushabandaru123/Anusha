'use strict';

angular.module('Retails.couponTable', [])

.directive('couponTable',['$compile', '$window', '$timeout','dashBoardService','$rootScope',
    function ($compile, $window, $timeout,dashBoardService,$rootScope) {
  return{
    restrict : 'E',
    transclude : true,
    scope : {
      data : '=',
      id:'='
    },
    templateUrl : "modules/componets/views/campign-sales-table.html",

   link: function (scope, element, attrs) {

   // console.log("table data...",scope.data);

          scope.campaignid = scope.id;
          scope.chartdata = scope.data;
            //scope.stores=scope.data.stores;
            scope.mfgId=sessionStorage.mfgId;

          scope.salesdataapidate="20000101T000000.000-0800";

          scope.sdate="20000101T000000.000-0800";

                var campaignstartdate=new Date(scope.data.sdate);

            var salesstartdate=moment(campaignstartdate).subtract(1,'days').format("YYYYMMDD");
            scope.salesstartdate=salesstartdate+'T235959.000-0000';


              if(scope.data.status=="Active"){
            var salesenddate=moment().format("YYYYMMDD");
            scope.salesenddate=salesenddate+'T235959.000-0000';


          }
          else if(scope.data.status=="Archived"){
             var salesenddate=moment(scope.data.edate).format("YYYYMMDD");
            scope.salesenddate=salesenddate+'T235959.000-0000';
          }

                 scope.role=sessionStorage.role;

       scope.spin=false;


       scope.salesDatalinechartforCampaigns=function(){
              scope.spin=true;
              scope.salesDataforcampaignsforreporttime=function () {

                var salesDataObject={
                  "aggTimeUnit":"1d",
               "startTime":scope.salesdataapidate,
                "endTime": scope.salesenddate,
               "filters": {
                "item.upc" :scope.data.products ,
                "retailerId" : scope.data.retailers
              }
            }

            dashBoardService.GetSalesPerformance(salesDataObject).then(function (response) {

                  scope.data.endsale=parseFloat(response.data.total);

                  if(response.data){
                  scope.data.endunitsold=response.data.totalSoldQty;
                  }
                  else{
                  scope.data.endunitsold=0.00;
                  }

                      scope.spin=false;

           }, function (response) {
            console.log(response);
          }
          );
              }

              var salesDataObjectforcomparetime={
                "aggTimeUnit":"1d",
                "startTime":scope.salesdataapidate,
                "endTime":scope.salesstartdate,
                "filters": {
                  "item.upc" :scope.data.products ,
                 "retailerId" : scope.data.retailers
                }
              }
              dashBoardService.GetSalesPerformance(salesDataObjectforcomparetime).then(function (response) {
                
                  scope.data.startsale=parseFloat(response.data.total);

             if(response.data){
 scope.data.startunitsold=response.data.totalSoldQty;

}
else{
        scope.data.startunitsold=0.00;

}
                scope.salesDataforcampaignsforreporttime();

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
               "startTime":scope.salesdataapidate,
                "endTime": scope.salesenddate,
               "filters": {
                "item.upc" :scope.data.products ,
                 "retailerId" : scope.data.retailers,
                "items.mfgId" : [scope.mfgId]
              }
            }

            dashBoardService.GetSalesPerformance(salesDataObject).then(function (response) {

                  scope.data.endsale=parseFloat(response.data.total);

             if(response.data){
                  scope.data.endunitsold=response.data.totalSoldQty;
                  }
                  else{
                  scope.data.endunitsold=0.00;
                  }

               scope.spin=false;
           }, function (response) {
            console.log(response);
          }
          );
              }

              var salesDataObjectforcomparetime={
                "aggTimeUnit":"1d",
                "startTime":scope.salesdataapidate,
                "endTime":scope.salesstartdate,
                "filters": {
                  "item.upc" :scope.data.products ,
                 "retailerId" : scope.data.retailers,
                "items.mfgId" : [scope.mfgId]
                }
              }
              dashBoardService.GetSalesPerformance(salesDataObjectforcomparetime).then(function (response) {
                
                  scope.data.startsale=parseFloat(response.data.total);
                if(response.data){
                 scope.data.startunitsold=response.data.totalSoldQty;

                  }
              else{
                 scope.data.startunitsold=0.00;

               }
                scope.salesDataforcampaignsforreporttime();

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
                "startTime":scope.salesdataapidate,
                "endTime": scope.salesenddate,
               "filters": {
                "item.upc" :scope.data.products ,
                 "retailerId" : scope.data.retailers,
                 "items.mfgId" : [scope.mfgId]
              }
            }

            dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(salesDataObject).then(function (response) {

                  scope.data.endsale=parseFloat(response.data.total);
                        if(response.data){
                  scope.data.endunitsold=response.data.totalSoldQty;
                  }
                  else{
                  scope.data.endunitsold=0.00;
                  }

                  scope.spin=false;

           }, function (response) {
            console.log(response);
          }
          );
              }

             var salesDataObjectforcomparetime={
                "aggTimeUnit":"1d",
              "startTime":scope.salesdataapidate,
                "endTime":scope.salesstartdate,
                "filters": {
                  "item.upc" :scope.data.products ,
                 "retailerId" : scope.data.retailers,
                "items.mfgId" : [scope.mfgId]
                }
              }

              dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(salesDataObjectforcomparetime).then(function (response) {
                
                  scope.data.startsale=parseFloat(response.data.total);

                 if(response.data){
                 scope.data.startunitsold=response.data.totalSoldQty;

                  }
              else{
                 scope.data.startunitsold=0.00;

               }
                scope.salesDataforcampaignsforreporttimeforcpg();

                }, function (response) {
                  console.log(response);
                }
              );
            }

             
scope.topProductsFunction = function () {
  
    scope.TopProductsbyReportTime = function () {
       var data = {
        "aggTimeUnit":"1d",
        "startTime":scope.sdate,
        "endTime": scope.salesstartdate,

      "criteria" : "QTY",
    "filters": {
      "item.upc" :scope.data.products ,
      "retailerId" : scope.data.retailers
            }
             }

      
      dashBoardService.GetTopProducts(data).then(function (response) {
        scope.topProductsbyRT = response.data;
         if(scope.topProductsbyRT){
          if(scope.topProductsbyRT[0]){

           scope.data.startunitsold=scope.topProductsbyRT[0].qty;
          }
           else{
          scope.data.startunitsold=0.00;
         }
         }
        
         else{
          scope.data.startunitsold=0.00;
         }

              }, function (response) {
                console.log(response);
              }
              );
    }

    var data = {
        "aggTimeUnit":"1d",
        "startTime":scope.sdate,
        "endTime":scope.salesenddate,
      "criteria" : "QTY",
    "filters": {
     "item.upc" :scope.data.products ,
    "retailerId" : scope.data.retailers

            }
             }
    dashBoardService.GetTopProducts(data).then(function (response) {
      scope.topProductsbyCT = response.data;

if(scope.topProductsbyCT[0]!=undefined){
 scope.data.endunitsold=scope.topProductsbyCT[0].qty;

}
else{
    scope.data.endunitsold=99.00;

    }

      scope.TopProductsbyReportTime();
    }, function (response) {
      console.log(response);
    }
    );
  }

  scope.topProductsFunctionforcpgbyretailer = function () {
  
    scope.TopProductsbyReportTime = function () {
       var data = {
        "aggTimeUnit":"1d",
        "startTime":scope.sdate,
        "endTime": scope.salesstartdate,

      "criteria" : "QTY",
    "filters": {
      "item.upc" :scope.data.products ,
      "retailerId" : scope.data.retailers,
      "items.mfgId" : [scope.mfgId]
            }
             }
      
      dashBoardService.GetTopProducts(data).then(function (response) {
        scope.topProductsbyRT = response.data;
        if(scope.topProductsbyRT){
          if(scope.topProductsbyRT[0]){

           scope.data.startunitsold=scope.topProductsbyRT[0].qty;
          }
           else{
          scope.data.startunitsold=0.00;
         }
         }
        
         else{
          scope.data.startunitsold=0.00;
         }

              }, function (response) {
                console.log(response);
              }
              );
    }

    var data = {
        "aggTimeUnit":"1d",
        "startTime":scope.sdate,
        "endTime":scope.salesenddate,
      "criteria" : "QTY",
    "filters": {
     "item.upc" :scope.data.products ,
     "retailerId" : scope.data.retailers,
     "items.mfgId" : [scope.mfgId]

            }
             }
    dashBoardService.GetTopProducts(data).then(function (response) {
      scope.topProductsbyCT = response.data;

if(scope.topProductsbyCT[0]!=undefined){
 scope.data.endunitsold=scope.topProductsbyCT[0].qty;

}
else{
        scope.data.endunitsold=99.00;

}

      scope.TopProductsbyReportTime();
    }, function (response) {
      console.log(response);
    }
    );
  }


  scope.topProductsFunctionforcpg = function () {
    scope.TopProductsbyReportTimeforcpg = function () {
       var data = {
        "aggTimeUnit":"1d",
        "startTime":scope.sdate,
        "endTime": scope.salesstartdate,

      "criteria" : "QTY",
    "filters": {
      "item.upc" :scope.data.products ,
      "retailerId" : scope.data.retailers,
      "items.mfgId" : [scope.mfgId]
            }
             }
      
      dashBoardService.GettopPerformersByAllRetailerwithoutsize(data).then(function (response) {
        scope.topProductsbyRT = response.data;

        scope.data.startunitsold=scope.topProductsbyRT[0].qty;

              }, function (response) {
                console.log(response);
              }
              );
    }

    var data = {
        "aggTimeUnit":"1d",
        "startTime":scope.sdate,
        "endTime":scope.salesenddate,
      "criteria" : "QTY",
    "filters": {
    "item.upc" :scope.data.products ,
    "retailerId" : scope.data.retailers,
    "items.mfgId" : [scope.mfgId]
            }
             }
    dashBoardService.GettopPerformersByAllRetailerwithoutsize(data).then(function (response) {
      scope.topProductsbyCT = response.data;

      if(scope.topProductsbyCT){
          if(scope.topProductsbyCT[0]){

           scope.data.startunitsold=scope.topProductsbyCT[0].qty;
          }
           else{
          scope.data.startunitsold=0.00;
         }
         }
         else{
          scope.data.startunitsold=0.00;
         }

      scope.TopProductsbyReportTimeforcpg();
    }, function (response) {
      console.log(response);
    }
    );
  }

          if(scope.role=="cpg"){
           if(scope.data.apistatus=="retailer"){
              scope.salesDatalinechartforCampaignsforcpgbyretailer();
           }
            else if(scope.data.apistatus=="cpg"){
          scope.salesDatalinechartforCampaignsforcpg();
              }
              else{
                 scope.salesDatalinechartforCampaignsforcpg();
        }

         }else{
          scope.salesDatalinechartforCampaigns();
         }


         var destroySalestable;

destroySalestable=$rootScope.$on('getstorerecordsalestable', function (event, data) {

        scope.stores=[];

        for(var i=0;i<data.length;i++){
          scope.stores.push(data[i]);
        }

       if(scope.role=="cpg"){
       // console.log("role...",scope.role);
           if(scope.data.apistatus=="retailer"){
              scope.salesDatalinechartforCampaignsforcpgbyretailer();
           }
            else if(scope.data.apistatus=="cpg"){
          scope.salesDatalinechartforCampaignsforcpg();
              }
              else{
                 scope.salesDatalinechartforCampaignsforcpg();
              }
         }else{
           scope.salesDatalinechartforCampaigns();
         }

      });


      scope.$on('$destroy', function() {
            destroySalestable();
          });
           
        }

      }
}]);
