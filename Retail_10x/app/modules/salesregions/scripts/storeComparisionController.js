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

angular.module('salesRegionsstorecomparision.controllers', [])

  .directive("mapSalesStore", function (salesRegionService) {
    return {
      restrict: 'E',
      replace: true,

      template: "<div id='storeChartdiv' style='cursor: pointer; height: 200px'></div>",
      link: function ($scope, scope, $watch) {

        var chart = false;
        var initMapChart = function () {

          if (chart)chart.destroy();
          chart = AmCharts.makeChart("storeChartdiv", {

            type: "map",
            "dataProvider": mapchartDatatoDirective,
            "imagesSettings": {
              "alpha": 0.8,
              "color": "#00cc00"
            }, "zoomControl": {
              "zoomControlEnabled": false,
              "panControlEnabled": false,
              "homeButtonEnabled": false,
              "maxZoomLevel": 1,
              "minZoomLevel": 1,
            },
            "areasSettings": {
              "autoZoom": false,
              "color": "#CDCDCD",
              "colorSolid": "#5EB7DE",
              "selectedColor": "#5EB7DE",
              "outlineColor": "#666666",
              "rollOverColor": "#88CAE7",
              "rollOverOutlineColor": "#FFFFFF",
              "selectable": false,

            },
            "responsive": {
              "enabled": true
            }
          });

        }//initChart()...END..

        var mapchartDatatoDirective;
        $scope.$watch('mapchartData', function (newVal, oldVal) {
        if ($scope.mapchartData === undefined) {
          }
        else {
            mapchartDatatoDirective = $scope.mapchartData;
            initMapChart();
          }
        });
      }
    }
  })


  .controller('storecomparisionCtrl', ['$scope', '$state', 'serviceFactory', 'productService', 'salesRegionService', '$http', 'dashBoardService','$filter','$stateParams','$timeout','$rootScope',
    function ($scope, $state, serviceFactory, productService, salesRegionService, $http, dashBoardService,$filter,$stateParams,$timeout,$rootScope) {
    
    if (sessionStorage.user == undefined || sessionStorage.user == null||sessionStorage.user =="null") {
      $state.go('login');
    }

       $scope.topregions=[
       {
        "region":"ALL SALES REGIONS",
        "amt":0
      }
        ];

         $scope.selectedvalue=$scope.topregions[0];

      //console.log('sent data:',$stateParams.storedata);
      $scope.storeObj=$stateParams.storedata;
      
     // $scope.selectoption = $scope.selectedvalue;

        $scope.topSalesRegions=function(){

              var data={
                  "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 2
                 }
        dashBoardService.getgeoSalesData(data).then(function (response) {
          // $scope.topregions=[];
          //console.log(response.data.data[0]);

      for(var j=0;j<response.data.data.length;j++){
      if(response.data.data[j]){
          $scope.regionsbyRT=response.data.data[j].regions;
          }
          else{
            $scope.regionsbyRT=[];
          }
       for(var i=0;i<$scope.regionsbyRT.length;i++){
          var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
               }
        $scope.topregions.push(topregionobject);
        }
      }

      $scope.selectedregion=salesRegionService.getselectedsalesregion();
      if($scope.selectedregion=="SalesRegions"||$scope.selectedregion==null){
      }
      else{
        for(var i=0;i<$scope.topregions.length;i++){
          if($scope.selectedregion==$scope.topregions[i].region){
            $scope.selectedvalue=$scope.topregions[i];
          }
        }
      }
            }, function (response) {
             console.log(response);
           }
           );
        }

        $scope.mfgId=sessionStorage.mfgId;

        $scope.topSalesRegionsforcpg=function(){
           var data={
                    "startTime": $scope.ReportstartDate,
                   "endTime": $scope.Reportenddate,
                  "geoLevel" : 2,
                   "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                   "retailerId" :$scope.RetailerIds,

                   }
                }

            dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
              dashBoardService.setsalesregionmaxvalue(0);
               for(var j=0;j<response.data.data.length;j++){
      if(response.data.data[j]){
          $scope.regionsbyRT=response.data.data[j].regions;
          }
          else{
            $scope.regionsbyRT=[];
          }
               for(var i=0;i<$scope.regionsbyRT.length;i++){
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount
                }
                $scope.topregions.push(topregionobject);
               }
             }

        $scope.selectedregion=salesRegionService.getselectedsalesregion();
      $scope.selectedregion=salesRegionService.getselectedsalesregion();
      if($scope.selectedregion=="SalesRegions"||$scope.selectedregion==null){
      }
      else{
        for(var i=0;i<$scope.topregions.length;i++){
          if($scope.selectedregion==$scope.topregions[i].region){
            $scope.selectedvalue=$scope.topregions[i];
          }
        }
      }

           // $timeout(function(){
          console.log("selected value...",$scope.selectedvalue);
            if($scope.selectedvalue.region=="ALL SALES REGIONS"){
             $scope.salespperformancebyallstoresforcpg();
            }
            else{
              $scope.salespperformancebyallstoresforcpgbyregion();
            }
            //},100);

            }, function (response) {
             console.log(response);
           }
           );
          }



      $scope.selectRegions = function (selectedvalue) {
        $scope.selectoption = selectedvalue;
        $scope.selectedvalue=selectedvalue;
     /*if($scope.selectoption=="salesregion"){
        $state.go('SalesRegions');
     }*/

     $scope.selectedproducts=[];
  $scope.selectedStoresforLinechart=[];
    // console.log("selected value...",$scope.selectoption);
     if($scope.role=="retailer"){
      if($scope.selectoption.region=="ALL SALES REGIONS"){
               $scope.salespperformancebyallstores();
            }
            else{
              $scope.salespperformancebyallstoresbyregion();
            }
         }
     else if($scope.role=="cpg"){
      if($scope.selectoption.region=="ALL SALES REGIONS"){
             $scope.salespperformancebyallstoresforcpg();
            }
            else{
              $scope.salespperformancebyallstoresforcpgbyregion();
            }
     }
     else if($scope.role=="distributor"){
      if($scope.selectedvalue.region=="ALL SALES REGIONS"){
             $scope.salespperformancebyallstoresfordistributor();
            }
            else{
              $scope.salespperformancebyallstoresforDistributorbyregion();
            }
         }
      }

      $scope.topregionsbarchartfunction=function(){
        $scope.topregionchartid = dashBoardService.generateguid();

              $scope.showbarchart=true;
      }


      $scope.imgbar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACtJREFUSMdj+A8GDAgwKjAqwDAKcIH/cDAqMCqAKTAKcOUXaDCNCowKIAAAP/H8Lm4fPi4AAAAASUVORK5CYII=";

      $scope.imgline = "data:image/png;base64,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";

      $scope.imgmap = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADB+5NvAAAA6nRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9PkBBQ0RFSElKS0xNTk9QUVJTVFVWV1haW1xdXmBhYmNkZWZnaGprbG1ub3BxcnN0dXZ3eHp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJaXmJmbnJ2en6ChoqOkpaaoqqusrq+wsrO1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1dbX2Nrc3t/g4eLj5OXm5+jp6uvs7e7w8fLz9PX29/j5+vv8/f6wQlqMAAAFg0lEQVQYGe3B91/UZQAH8M8hCMcwR5hpKQ5MM/fKrMxMLTGt1HbO1DRRGgouBEPJLMtKNLWyRAi0ZRalpdkCCkgMT0GGyLzPX5H3vA7u+d78As/3frr3GwgICAgICAgIaLeQu+au3bpr15a1c4YFw+/6vJxzja2qs1/qBX+alttMJ01ZD8Bf7j9Dt/LugT/0OEhPrB90heEmX6AX/4yHwZ5vpFcNC2CotfTF+hIMtJw6LIRh5lipQ9NMGGRgFXWp6AdDdPqZzv4+lrE/q4jOvg+CEVZSqzi+L4SYhAvUWgQDRFdSVrsmBK06v1JHWXlXqLeVspLh0BhTStl6KNflKiUlfeFkwEVKyiOg2guU1A6Hi3H1lDwF1U5SEg87U3RPE+w2UHIcivWw0qEkBEKv3VdIS3o0BHMZHZq6QK25lKyDMO4yhf9GQkik5GGolU5JP9jcYqHdxR6wGUpJKtTKpUMxhF1stQ2ChQ6ZUKuIDl/AxmRhqyIIJ+lQALXq6HAQNt0pMcPmCB0qoVQwJYdg05WSMNh8RodmKBVJyXHYmErZqgDCKUrCoFQjHUohpLDVetiYyikxQSkLJYNg062EdoVRsBlBSTXUyqdkPYQhxRQKB0HYRkk+1DpBSZkZwk1JBeRfr0dCiCqnJBtqpVKWhBYhIWixnbLtUOsJyhomwsX9TZQtgFoDqXFpMJwMK6dGfyhWRg3LZGhMqaBGCVR7n1qNyZFo1eWNZmq9B9Xi6OxK8ggTbjCNTq2gszioFlFHVxV5RzPzrtJVjRnKHWUbHIZ6cWyD6VAvuIy6XewEA6RSt00wQqyVOjX1hSGOUqePYYx7qdMEGORH6vIVjDKbukyFUUznqMMpGGcGdXgABvqBPp2AkabQF+s4GCqTPhyCsWIb6NX1fjDYDnq1EUbraqEXJeEw3DP0Yg784Bt6lA1/GNJAD2oHwC8204ME+Efon3TrbDD8ZGIz3WgYCb/ZQTcS4T/mfLr4JQR+NLaRTuqGwa820Mlq+FdwHjVOmOAvERD6V1JyuTeECBgn+I5Za/bk/FnddDeEeZTMhDDVWpOfsyd+1uBgKBU2aeWB83W0K4yCsJetdkLoXkq7+vMZKyeFQoXwh1LyGqiRAcH8G+1Od4bwGTXq81KmhaNDei/PqaOr+RAGV1OoiIGwhK7qcpb1QTtFLTpppVtVAyE8RhvrDAh3Xadb1pMLo9B2sXtq6NHZUAhpvCERQmQ+Pap+OxZtE/tJM715B0Lwl2SmCcJBetN8OBb6he9spEf1JaczM3b0hHDz3/k3Qbh9Z0bm6ZJ6etTwRjh0GlVId6p+2vfavAm3miAbFguZqdf4J17d92Ml3SkYAV2mX6OzytxNcTFog5i4TbmVdFYzDTpMvk6N2uzVo4PQDkGjV2fXUqNuEnyKLKLk6r6ZZnSA+ZH9lZQUhcOXF+nw7fwwdJj5yVN0WAZfstji2FgoMvELtjgGX87SLisUyoTl0u4H+PI5WxQvMUOJ8KX/ssV++PIkHS6n3YkOG55eToeZ8KXTz5T9vmE02s80NukPyr6DbwMuUeu/A88OQjsMfu5gGbUu9IIOQ4rp4tKxpLiBQdApaNDsjVkWuvirP3SJzqRb1379ZOvih4Z2g0fd75y+JPnT87V06+Nu0Gt+Kb2o//fsV0fefys1MSF+1fIVq+ITElN3f3Dk63MXGuhF8aNog/B1FipVtqIz2sa88Fcqc/qpULTDmPRSKlCcMgLtFTQp+ZyVHWA9kzTBhI7p+fjuc01sh8YzOx+NhhoRk1fs/amKulXkvbt4vBmq9ZmycMtH3xbW0KOqgi8/3Pj8fT1hrIiYMQ/OfW5FQlJyWvquN9NSNieuXfr07KmjbgtFQEBAQEBAQEDb/Q+FHFVi9MUL1wAAAABJRU5ErkJggg==";

      $scope.List = [];
      $scope.showselectedstore=false;
      $scope.showselectearea=true;
      $scope.getstoreList=function(){
         dashBoardService.GetStoreList().then(function (response) {
          for (var i = 0; i < response.data.length; i++) {
            $scope.List.push(response.data[i]);
          }
        }, function (response) {
          console.log(response);
        }
      );
      }

          $scope.storesformap=[];
      $scope.salespperformancebyallstores=function(){
        $scope.masked=true;
           var data={
                 "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S"
               }
               dashBoardService.getsalesdatafordepartments(data).then(function (response) {
               $scope.topstoresList=[];
              for(var i=0;i<response.data.data.length;i++){
                for(var j=0;j<$scope.List.length;j++){
                  if($scope.List[j].store_id==response.data.data[i].id){
                var storObj = {
                 "id":response.data.data[i].id,
                 "amt":parseInt(Math.round(response.data.data[i].amt)),
                 "content": $scope.List[j].store_name.toUpperCase(),
                 "value":0, 
                 "status":'plus'
               }
               $scope.topstoresList.push(storObj);
             }
             }
             }
             $scope.storealreadyselected();

             }, function (response) {
               console.log(response);
             }
             );
             }

             $scope.salespperformancebyallstoresbyregion=function(){
              $scope.masked=true;
           var data={
                 "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                  "filters" :{
                  "location.regionName" : [$scope.selectedvalue.region]
                   }
               }
               dashBoardService.getsalesdatafordepartments(data).then(function (response) {
               $scope.topstoresList=[];
              for(var i=0;i<response.data.data.length;i++){
                for(var j=0;j<$scope.List.length;j++){
                  if($scope.List[j].store_id==response.data.data[i].id){
                var storObj = {
                 "id":response.data.data[i].id,
                 "amt":parseInt(Math.round(response.data.data[i].amt)),
                 "content": $scope.List[j].store_name.toUpperCase(),
                 "value":0, 
                 "status":'plus'
               }
               $scope.topstoresList.push(storObj);
             }
             }
             }
             $scope.storealreadyselected();
             }, function (response) {
               console.log(response);
             }
             );
             }

             $scope.salespperformancebyallstoresforcpg=function(){
                var data={
                 "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgid],
                   "retailerId" : $scope.RetailerIds
                   }
               }
               dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {
               $scope.topstoresList=[];
          for(var i=0;i<response.data.data.length;i++){
          for(var j=0;j<$scope.allstoresList.length;j++){
          if($scope.allstoresList[j].store_id==response.data.data[i].id){
                var storObj = {
                 "id":response.data.data[i].id,
                 "amt":parseInt(Math.round(response.data.data[i].amt)),
                 "content": $scope.allstoresList[j].store_name.toUpperCase(),
                 "value":0,
                 "status":'plus',
                 "retailerName":$scope.allstoresList[j].retailer_name,
                 "retailerId":$scope.allstoresList[j].retailer_id
             }
               $scope.topstoresList.push(storObj);
             }
             }
             }
              //console.log("top store list...",$scope.topstoresList);
              $scope.storealreadyselected();
             }, function (response) {
               console.log(response);
             }
             );
             }

             $scope.salespperformancebyallstoresforcpgbyregion=function(){
              //console.log("region selected...",$scope.selectedvalue);
                var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ReportstartDate,
                 "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                 "item.mfgId" : [$scope.mfgid],
                 "location.regionName" : [$scope.selectedvalue.region],
                 "retailerId" : $scope.RetailerIds
                   }
               }
               dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {
               $scope.topstoresList=[];
              for(var i=0;i<response.data.data.length;i++){
              for(var j=0;j<$scope.allstoresList.length;j++){
              if($scope.allstoresList[j].store_id==response.data.data[i].id){
                var storObj = {
                 "id":response.data.data[i].id,
                 "amt":parseInt(Math.round(response.data.data[i].amt)),
                 "content": $scope.allstoresList[j].store_name.toUpperCase(),
                 "value":0,
                 "status":'plus',
                 "retailerName":$scope.allstoresList[j].retailer_name,
                 "retailerId":$scope.allstoresList[j].retailer_id
               }
               $scope.topstoresList.push(storObj);
             }
             }
             }
              $scope.storealreadyselected();
             }, function (response) {
               console.log(response);
             }
             );
             }

             $scope.storesByRetailer=[];

      $scope.makeStoresList=function(retailerid,retailerName){
      dashBoardService.getStoreListBasedonretailer().then(function (response) {
              $scope.storesList=response.data;
              for(var j=0;j<$scope.storesList.length;j++){
              var object={
                   "name":$scope.storesList[j].store_name,
                   "storeid":$scope.storesList[j].store_id,
                   "retailerId":retailerid,
                   "retailerName": retailerName,
                 }
              $scope.storesByRetailer.push(object);
               }
              // console.log("store by retailer....",$scope.storesByRetailer);
             }, function (response) {
              console.log(response);
            }
            );
            }
              $scope.retailerList=[];
      $scope.getStoresByRetailer=function(){
          for(var i=0;i<$scope.retailerData.length;i++) {
              $scope.retailerList.push($scope.retailerData[i]);
              sessionStorage.retailer=$scope.retailerData[i].retailer_id;
              $scope.makeStoresList($scope.retailerData[i].retailer_id,$scope.retailerData[i].retailer_name);
            }
           $timeout(function() {
            //console.log("selected value...",$scope.selectedvalue);
            if($scope.selectedvalue.region=="ALL SALES REGIONS"){
             $scope.salespperformancebyallstoresforcpg();
            }
            else{
              $scope.salespperformancebyallstoresforcpgbyregion();
            }
            },100);
            }
            $scope.RetailerIds=[];
          $scope.getAllRetailers=function(){
          dashBoardService.getRetailerforCPG().then(function (response) {
          $scope.retailerData=response.data;
          //$scope.allstoresList=[];
          //$scope.getStoresByRetailer();
          for(var i=0;i<$scope.retailerData.length;i++){
          $scope.RetailerIds.push($scope.retailerData[i].retailer_id.toString());
          }
          //console.log("retailerIds...",$scope.RetailerIds);
          productService.saveallRetailers($scope.RetailerIds);
          $scope.topSalesRegionsforcpg();
          }, function (response) {
            console.log(response);
          }
          );
          }

          $scope.allstoresList=[];
      $scope.getAllstores=function(){
          dashBoardService.getallStoresforCPG().then(function(response){
            for(var i=0;i<response.data.length;i++){
              $scope.allstoresList.push(response.data[i]);
            }
        },function(response){
           console.log("error msg..",response);
        });
        }
  $scope.selectedproducts=[];
  $scope.selectedStoresforLinechart=[];
  $scope.makechart=function(data,linechartdata,storeid,storename){
  $scope.reportdateobject={
          "reportstartdate":$scope.ReportstartDate,
          "reportenddate": $scope.Reportenddate,
          "comparestartdate": $scope.ComparestartDate,
          "compareenddate": $scope.Compareenddate,
        }
      $scope.chartid = dashBoardService.generateguid();
      $scope.Linechartid = dashBoardService.generateguid();
      $scope.data=[]
    if($scope.role=="retailer"){
      var object={
        "chartId":$scope.chartid,
        "data":data,
        "dates":$scope.reportdateobject,
        "storeid":storeid,
        "storename":storename,
        "index":$scope.spIndex,
      }
      $scope.selectedproducts.push(object);
    var objectline={
    "chartId":$scope.Linechartid,
    "data":linechartdata,
    "total":$scope.total,
    "spIndex":$scope.spIndex,
    "dates":$scope.reportdateobject,
    'storeid':storeid,
    "storename":storename
  }
  $scope.selectedStoresforLinechart.push(objectline);
    }
    else if($scope.role=="cpg"||$scope.role=="distributor"){
      var retailerfound=$filter('filter')($scope.allstoresList, 
                    {store_id : parseInt(storeid)}, true);
      var object={
        "chartId":$scope.chartid,
        "data":data,
        "dates":$scope.reportdateobject,
        "storeid":storeid,
        "storename":retailerfound[0].store_name,
        "index":$scope.spIndex,
        "retailer":retailerfound[0].retailer_name,
        "retailerId":retailerfound[0].retailer_id
      }
    $scope.selectedproducts.push(object);
    var objectline={
    "chartId":$scope.Linechartid,
    "data":linechartdata,
    "total":$scope.total,
    "spIndex":$scope.spIndex,
    "dates":$scope.reportdateobject,
    'storeid':storeid,
    "storename":retailerfound[0].store_name,
    "retailer":retailerfound[0].retailer_name,
    "retailerId":retailerfound[0].retailer_id
  }
  $scope.selectedStoresforLinechart.push(objectline);
  //console.log("selected products for line chart...",$scope.selectedStoresforLinechart);
    }
    /*else if($scope.role=="distributor"){
    }
      */
  }

  $scope.storeselected=function(data){
    console.log("data...",data);
    if(data.status=='plus'){
      $scope.masked=true;
      sessionStorage.storeId = parseInt(data.id);
    if($scope.role=="cpg"){
       sessionStorage.user=data.retailerId;
        $scope.selectedstores.push(data.id.toString());
      $scope.SalesPerformanceByStoreIdforcpg(data.id,data.content);
      $scope.geosalesDataforCpg($scope.selectedstores);
     }
     else if($scope.role=="distributor"){
      sessionStorage.user=data.retailerId;
       $scope.selectedstores.push(data.id.toString());
      $scope.SalesPerformanceByDistributor(data.id,data.content);
      $scope.geosalesdatabyAllBrands($scope.selectedstores);
     }
     else{
      $scope.selectedstores.push(data.id.toString());
      $scope.geosalesDatabyStoreid($scope.selectedstores)
      $scope.SalesPerformanceByStoreId(data.id,data.content);
       }
      for(var i=0;i<$scope.topstoresList.length;i++){
      if($scope.topstoresList[i].id==data.id){
         $scope.topstoresList[i].status='minus';
      }
    }
    }
    else{
      for(var j=0;j<$scope.selectedproducts.length;j++){
          if($scope.selectedproducts[j].storeid==data.id){
            $scope.selectedproducts.splice(j,1);
            $scope.selectedStoresforLinechart.splice(j,1);
          }
      }
      for(var i=0;i<$scope.topstoresList.length;i++){
        if($scope.topstoresList[i].id==data.id){
          $scope.topstoresList[i].status='plus';
        }
      }

       for(var j=0;j<$scope.selectedstores.length;j++){
          if(parseInt($scope.selectedstores[j])==data.id){
            $scope.selectedstores.splice(j,1);
          }
      }

       if($scope.role=="cpg"){
        $scope.geosalesDataforCpg($scope.selectedstores);
       //sessionStorage.user=data.retailerId;
      //$scope.SalesPerformanceByStoreIdforcpg(data.id,data.content);
     }
     else if($scope.role=="distributor"){
      $scope.geosalesdatabyAllBrands($scope.selectedstores);
      //sessionStorage.user=data.retailerId;
      //$scope.SalesPerformanceByDistributor(data.id,data.content);
     }
     else{
      $scope.geosalesDatabyStoreid($scope.selectedstores)
       }
    }

  }

 


  $scope.SalesPerformanceByStoreId = function (storeid,storename) {
  //  $scope.showspinner();
    $scope.SalesPerformanceByStoreIdbyRT = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate
       
      }
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          $scope.total =  response.data.total;
          $scope.productchartdata=[];
          $scope.linechartData=[];
          //console.log("for report time...",response.data);
          $scope.rpIndextotal = parseFloat(response.data.total);
          if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
            $scope.spIndex = 0;
          }
          else {
            $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
            $scope.spIndex = $scope.spIndex.toFixed(2);
          }
           $scope.j=1;
           var object={
              "storename":"STORE123 #"+storeid,
               "income":$scope.total,
              "expenses":$scope.comparetimetotal,
              "color": "#4C98CF",
              "color1": "#7F2891"
            }
              $scope.productchartdata.push(object);

          for(var i=0;i<=response.data.data.length;i++){
            if(i==0){
               $scope.date=moment($scope.ReportstartDate).utc().format("YYYY-MM-DD");
               $scope.ResultDate=moment($scope.date).format("MM-DD-YYYY");
              $scope.ResultDate1=moment($scope.ComparestartDate).utc().format("MM-DD-YYYY");
             }
             else{
               $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
               $scope.ResultDate=moment($scope.nextDate).format("MM-DD-YYYY");
              $scope.ResultDate1=moment($scope.ComparestartDate).utc().add(i,'days').format("MM-DD-YYYY");
               $scope.j++;
             }
             if(response.data.data&&$scope.Cpdata){
           if(response.data.data[i]&&$scope.Cpdata[i]){
             var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": $scope.Cpdata[i].amt
                      }
              $scope.linechartData.push(linechartdataobject);
          }
          else if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              $scope.linechartData.push(linechartdataobject);
          }
          else if($scope.Cpdata[i]){
               var linechartdataobject = {
                        "id":$scope.Cpdata[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2": $scope.Cpdata[i].amt
                      }
              $scope.linechartData.push(linechartdataobject);
          }
          }
          else{
              if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              $scope.linechartData.push(linechartdataobject);
          }
          }
          }

          $scope.makechart($scope.productchartdata,$scope.linechartData,storeid,storename);
               $scope.masked=false;
               $scope.linechartapicallstatus=true;
               $scope.barchartapicallstatus=true;
        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": $scope.ComparestartDate,
      "endTime": $scope.Compareenddate
      
    }
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
        $scope.spIndextotal = parseFloat(response.data.total);
        $scope.comparetimetotal=response.data.total;
        //console.log("for compare time...",response.data);
        $scope.Cpdata=response.data.data;
        $scope.SalesPerformanceByStoreIdbyRT();
      }, function (response) {
        console.log(response);
      }
    );
  }


       $scope.mfgid=sessionStorage.mfgId;

    $scope.SalesPerformanceByStoreIdforcpg = function (storeid,storename) {
       //  $scope.showspinner();
    $scope.SalesPerformanceByStoreIdbyRT = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "filters": {
          "items.mfgId" : [$scope.mfgid]
        }
      }
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          $scope.total=response.data.total;
          $scope.productchartdata=[];
          $scope.linechartData=[];
          $scope.rpIndextotal = parseFloat(response.data.total);
          if ($scope.spIndextotal==0||$scope.spIndextotal== null) {
            $scope.spIndex = 0;
          }
          else {
            $scope.spIndex=$scope.rpIndextotal/$scope.spIndextotal;
            $scope.spIndex=$scope.spIndex.toFixed(2);
          }
           $scope.j=1;
           var object={
              "storename":"STORE #"+storeid,
             "income":$scope.total,
              "expenses":$scope.comparetimetotal,
              "color": "#4C98CF",
              "color1": "#7F2891"
            }
             $scope.productchartdata.push(object);
          for(var i=0;i<=response.data.data.length;i++){
            if(i==0){
               $scope.date=moment($scope.ReportstartDate).utc().format("YYYY-MM-DD");
               $scope.ResultDate=moment($scope.date).format("MM-DD-YYYY");
               $scope.ResultDate1=moment($scope.ComparestartDate).utc().format("MM-DD-YYYY");
             }
             else{
          $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
          $scope.ResultDate=moment($scope.nextDate).format("MM-DD-YYYY");
          $scope.ResultDate1=moment($scope.ComparestartDate).add(i,'days').utc().format("MM-DD-YYYY");
               $scope.j++;
             }

            if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){
             var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": $scope.Cpdata[i].amt
                      }
              
              $scope.linechartData.push(linechartdataobject);
          }
          else if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              
              $scope.linechartData.push(linechartdataobject);
          }
          else if($scope.Cpdata[i]){
               var linechartdataobject = {
                        "id":$scope.Cpdata[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2": $scope.Cpdata[i].amt
                      }
              $scope.linechartData.push(linechartdataobject);
             }
             }
             else{
              if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              $scope.linechartData.push(linechartdataobject);
             }
             }
          }
          $scope.makechart($scope.productchartdata,$scope.linechartData,storeid,storename);
               $scope.masked=false;
               $scope.linechartapicallstatus=true;
               $scope.barchartapicallstatus=true;
        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": $scope.ComparestartDate,
      "endTime": $scope.Compareenddate,
      "filters": {
          "items.mfgId" : [$scope.mfgid]
        }
    }
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
         $scope.spIndextotal = parseFloat(response.data.total);
         $scope.comparetimetotal=response.data.total;
         $scope.Cpdata=response.data.data;
         $scope.SalesPerformanceByStoreIdbyRT();
      }, function (response) {
        console.log(response);
      }
    );
  }




  $scope.geosalesDatabyStoreid=function(storeId){
               var data={
                   "startTime": $scope.ReportstartDate,
                   "endTime": $scope.Reportenddate,
                  "geoLevel" : 4,
                  "filters" :{ 
                  "storeId" : storeId
                  }
                }
               $scope.showmap=false;
               $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesData(data).then(function (response) {
                 $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
                 dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              }, function (response) {
               console.log(response);
             }
             );
              }

      $scope.geosalesDataforCpg=function(storeId){
       var data={
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "geoLevel" : 4,
        "filters" :{
        "item.mfgId" : [$scope.mfgId],
        "storeId" : storeId,
        "retailerId" : $scope.RetailerIds
        }
      }

      $scope.showmap=false;
      $scope.geoSalesData=undefined;
      dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
        $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       $scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
              if(response.data.data.length>0){
                  $scope.geoSalesData=response.data.data;
              
          $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
              dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }
             }
             else{
               $scope.geoSalesData=[];
             }
              $scope.showmap=true;

               }, function (response) {
                 console.log(response);

               }
               );
    }

    $scope.geosalesdatabyAllBrands=function(storeId){
          
            var reporttimeRequest= {
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "geoLevel" : 4,
            "filters": {
            "items.brandId" :$scope.BrandIdsList,
             "storeId" : storeId
            }
          }  

          $scope.showmap=false;
          $scope.geoSalesData=undefined;

           dashBoardService.getgeosalesDataByBrands(reporttimeRequest).then(function (response) {
            $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       //$scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
              if(response.data.data.length>0){
                  $scope.geoSalesData=response.data.data;
          $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
              dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }
             }
             else{
               $scope.geoSalesData=[];
             }
              $scope.showmap=true;
      }, function (response) {
        console.log(response);
      }
      );
      }


       $scope.selectedstores=[];

     $scope.gotostore=function(sid){
    
     // console.log('sales goto- withmap value :',sid);
      $scope.id = sid.storeId;
      $scope.storeObj=sid ;
      $scope.storename=sid.content;
      $scope.$apply();
   

    $scope.selectedproducts=[];
    //$scope.selectedvalue="west";
    $scope.selectoption='west';
    sessionStorage.storeId = parseInt($scope.id);
    $scope.masked=true;

    $scope.selectedstores.push($scope.id.toString())

    
     if($scope.role=="cpg"){
      sessionStorage.user=sid.retailerId;
      $scope.savedBrand=dashBoardService.getselectedBrand();
      if($scope.savedBrand.brand_name =="All Brands"){
      $scope.SalesPerformanceByStoreIdforcpg($scope.id,$scope.storename);
      $scope.geosalesDataforCpg($scope.selectedstores);
     }else{
      $scope.SalesPerformanceByStoreIdforcpgwithBRAND($scope.id,$scope.storename);
      $scope.geosalesDataforCpgwithBRAND($scope.selectedstores);
     }
     }
     else if($scope.role=="retailer"){
      $scope.SalesPerformanceByStoreId($scope.id,$scope.storename);
      $scope.geosalesDatabyStoreid($scope.selectedstores);
     }
     else if($scope.role=="distributor"){
      sessionStorage.user=sid.retailerId;
      $scope.SalesPerformanceByDistributor($scope.id,$scope.storename);
      $scope.geosalesdatabyAllBrands($scope.selectedstores);
     }
     for(var i=0;i<$scope.topstoresList.length;i++){
       if($scope.topstoresList[i].id==$scope.id){
         $scope.topstoresList[i].status='minus';
       }
     }
  }

  /********** distributor login api calls *************/

            $scope.BrandsList=[];

           $scope.BrandIdsList=[];

           $scope.allstoresList=[];

        $scope.getDistributorBrands=function(){
        dashBoardService.getDistributorBrands().then(function(response){
        
        for(var i=0;i<response.data.length;i++){
        $scope.BrandsList.push(response.data[i]);
        $scope.BrandIdsList.push(response.data[i].brand_id);
        }
        for(var i=0;i<$scope.BrandsList.length;i++){
        $scope.BrandsList[i].brand_name=$scope.BrandsList[i].brand_name.toUpperCase();
        }
        $scope.selectedBrand=$scope.BrandsList[0];
        $scope.selectedBrandId=$scope.BrandsList[0].brand_id;
        dashBoardService.setBrandidList($scope.BrandIdsList);

         $scope.brandportalApicalls();
        
        },function(response){
           console.log("error msg..",response);
        });
        }

          $scope.topSalesRegionsforDistributor=function(){
           var data={
                    "startTime": $scope.ReportstartDate,
                    "endTime": $scope.Reportenddate,
                    "geoLevel" : 2,
                    "filters" :{
                    "items.brandId" :$scope.BrandIdsList
                   }
                   }

            dashBoardService.getsalesbyBrands(data).then(function (response) {
            dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
          if(response.data.data[j]){
          $scope.regionsbyRT=response.data.data[j].regions;
          }
          else{
            $scope.regionsbyRT=[];
          }
          for(var i=0;i<$scope.regionsbyRT.length;i++){
              var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount
              }
              $scope.topregions.push(topregionobject);
            }
            }
      $scope.selectedregion=salesRegionService.getselectedsalesregion();
      if($scope.selectedregion=="SalesRegions"||$scope.selectedregion==null){
      }
      else{
        for(var i=0;i<$scope.topregions.length;i++){
          if($scope.selectedregion==$scope.topregions[i].region){
            $scope.selectedvalue=$scope.topregions[i];
          }
        }
      }
      if($scope.selectedvalue.region=="ALL SALES REGIONS"){
             $scope.salespperformancebyallstoresfordistributor();
            }
            else{
              $scope.salespperformancebyallstoresforDistributorbyregion();
            }
            }, function (response) {
             console.log(response);
           }
           );
          }

          $scope.salespperformancebyallstoresfordistributor=function(){
                var data={
                 "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "items.brandId" :$scope.BrandIdsList
                   }
               }
               dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {
               $scope.topstoresList=[];
          for(var i=0;i<response.data.data.length;i++){
          for(var j=0;j<$scope.allstoresList.length;j++){
          if($scope.allstoresList[j].store_id==response.data.data[i].id){
                var storObj = {
                 "id":response.data.data[i].id,
                 "amt":parseInt(Math.round(response.data.data[i].amt)),
                 "content": $scope.allstoresList[j].store_name.toUpperCase(),
                 "value":0,
                 "status":'plus',
                 "retailerName":$scope.allstoresList[j].retailer_name,
                 "retailerId":$scope.allstoresList[j].retailer_id
             }
               $scope.topstoresList.push(storObj);
             }
             }
             }
              //console.log("top store list...",$scope.topstoresList);
              $scope.storealreadyselected();
             }, function (response) {
               console.log(response);
             }
             );
             }

             $scope.salespperformancebyallstoresforDistributorbyregion=function(){
   
                var data={
                 "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "items.brandId" :$scope.BrandIdsList,
                  "location.regionName" : [$scope.selectedvalue.region]
                   }
               }
               dashBoardService.getsalesdatafordepartmentsforcpg(data).then(function (response) {
               $scope.topstoresList=[];
          for(var i=0;i<response.data.data.length;i++){
          for(var j=0;j<$scope.allstoresList.length;j++){
          if($scope.allstoresList[j].store_id==response.data.data[i].id){
                var storObj = {
                 "id":response.data.data[i].id,
                 "amt":parseInt(Math.round(response.data.data[i].amt)),
                 "content": $scope.allstoresList[j].store_name.toUpperCase(),
                 "value":0,
                 "status":'plus',
                 "retailerName":$scope.allstoresList[j].retailer_name,
                 "retailerId":$scope.allstoresList[j].retailer_id
               }
               $scope.topstoresList.push(storObj);
             }
             }
             }
              $scope.storealreadyselected();
             }, function (response) {
               console.log(response);
             }
             );
             }


    $scope.SalesPerformanceByDistributor = function (storeid,storename) {
    $scope.SalesPerformanceByDistributorbyRT = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "filters": {
          "items.brandId" :$scope.BrandIdsList
        }
      }
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          $scope.total=response.data.total;
          $scope.productchartdata=[];
          $scope.linechartData=[];
          $scope.rpIndextotal = parseFloat(response.data.total);
          if ($scope.spIndextotal==0||$scope.spIndextotal== null) {
            $scope.spIndex = 0;
          }
          else {
            $scope.spIndex=$scope.rpIndextotal/$scope.spIndextotal;
            $scope.spIndex=$scope.spIndex.toFixed(2);
          }
           $scope.j=1;
           var object={
              "storename":"STORE #"+storeid,
             "income":$scope.total,
              "expenses":$scope.comparetimetotal,
              "color": "#4C98CF",
              "color1": "#7F2891"
            }
             $scope.productchartdata.push(object);
          for(var i=0;i<=response.data.data.length;i++){
            if(i==0){
               $scope.date=moment($scope.ReportstartDate).utc().format("YYYY-MM-DD");
               $scope.ResultDate=moment($scope.date).format("MM-DD-YYYY");
               $scope.ResultDate1=moment($scope.ComparestartDate).utc().format("MM-DD-YYYY");
             }
             else{
          $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
          $scope.ResultDate=moment($scope.nextDate).format("MM-DD-YYYY");
          $scope.ResultDate1=moment($scope.ComparestartDate).add(i,'days').utc().format("MM-DD-YYYY");
               $scope.j++;
             }
            if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){
             var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": $scope.Cpdata[i].amt
                      }
              
              $scope.linechartData.push(linechartdataobject);
          }
          else if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              
              $scope.linechartData.push(linechartdataobject);
          }
          else if($scope.Cpdata[i]){
               var linechartdataobject = {
                        "id":$scope.Cpdata[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2": $scope.Cpdata[i].amt
                      }
              $scope.linechartData.push(linechartdataobject);
             }
             }
             else{
              if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              $scope.linechartData.push(linechartdataobject);
             }
             }
          }
          $scope.makechart($scope.productchartdata,$scope.linechartData,storeid,storename);
               $scope.masked=false;
               $scope.linechartapicallstatus=true;
               $scope.barchartapicallstatus=true;
        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": $scope.ComparestartDate,
      "endTime": $scope.Compareenddate,
      "filters": {
         "items.brandId" :$scope.BrandIdsList
        }
    }
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
         $scope.spIndextotal = parseFloat(response.data.total);
         $scope.comparetimetotal=response.data.total;
         $scope.Cpdata=response.data.data;
         $scope.SalesPerformanceByDistributorbyRT();
      }, function (response) {
        console.log(response);
      }
    );
  }

          $scope.brandportalApicalls=function(){
            $scope.topSalesRegionsforDistributor();
            //console.log("selected region...",$scope.selectedvalue.region);
          /*if($scope.selectedvalue.region=="ALL SALES REGIONS"){
             $scope.salespperformancebyallstoresfordistributor();
            }
            else{
              $scope.salespperformancebyallstoresforDistributorbyregion();
            }*/

               //$scope.geosalesDataforDistributor();
               //$scope.topSalesRegionsfordistributor();
               //$scope.salespperformancebyallstoresfordistributor();
            }

 /********** end of distributor login api calls **********/

      /************************* start DATEpicker *****************/
      //dateRangePicker for CompareTimePeriod
      $scope.data={
       selectedStoreId:''
      }
      $scope.comparestart=  dashBoardService.getcomparestartdate();
      if($scope.comparestart==undefined){

var ReportstartDate= moment().subtract(7, 'days');
    var Reportenddate=moment().subtract(1, 'days');
  var  compareEnd=moment(ReportstartDate).subtract(1,'days');
  var  compareStart=moment(ReportstartDate).subtract(7,'days');

      }
      else{
        var compareStart= dashBoardService.getcomparestartdate();
          var compareEnd=dashBoardService.getcompareenddate();
        var ReportstartDate=  dashBoardService.getreportstartdate();
          var Reportenddate=dashBoardService.getreportenddate();

      }

      var start = moment(compareStart);
      var end = moment(compareEnd);
      function cmpare(start, end) {

        startDate = start;
        endDate = end;

        compareStart=start;
        compareEnd=end;

    dashBoardService.setcomparestartdate(start);
    dashBoardService.setcompareenddate(end);
    dashBoardService.setreportstartdate(ReportstartDate);
    dashBoardService.setreportenddate(Reportenddate);

        $scope.ComparestartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Compareenddate = end.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.compareTimePeriod = start.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');
        $scope.$applyAsync();

        if($scope.role=="cpg"||$scope.role=="distributor"){
              var dataobject={
                             "compareStartDate":  $scope.ComparestartDate,
                             "compareEndDate":$scope.Compareenddate,
                             "reportEndDate":$scope.Reportenddate,
                             "reportStartDate":$scope.ReportstartDate,
                           }

           if($scope.selectedStoresforLinechart.length>0){
                if($scope.selectedgraph =='line'){
       $rootScope.$emit('LinechartEventforstore', dataobject);
       $scope.linechartapicallstatus=true;
       $scope.barchartapicallstatus=false;

         }
     else{
       $rootScope.$emit('barcharteventforstore', dataobject);
       $scope.barchartapicallstatus=true;
       $scope.linechartapicallstatus=false;
      }
      }
      }
      else if($scope.role=="retailer"){
                   var dataobject={
                             "compareStartDate":  $scope.ComparestartDate,
                             "compareEndDate":$scope.Compareenddate,
                             "reportEndDate":$scope.Reportenddate,
                             "reportStartDate":$scope.ReportstartDate,
                           }

           if($scope.selectedStoresforLinechart.length>0){
                if($scope.selectedgraph =='line'){
       $rootScope.$emit('LinechartEventforstore', dataobject);
       $scope.linechartapicallstatus=true;
       $scope.barchartapicallstatus=false;

         }
     else{
       $rootScope.$emit('barcharteventforstore', dataobject);
       $scope.barchartapicallstatus=true;
       $scope.linechartapicallstatus=false;
   }
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

            $scope.ComparestartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
            $scope.Compareenddate = end.format('YYYYMMDD') + 'T235959.000-0000';
            $scope.SalesDataComparestartDate = start.format('YYYYMMDD') + 'T000000.000-0000';

            $scope.compareTimePeriod = start.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');
            $scope.totalcomparetime=end.format('MMM Do YYYY')+"-"+end.format('MMM Do YYYY');

            $scope.$applyAsync();
          }

            $scope.setcomparetimeforproduct=function(){

 end = moment(compareEnd);
          start = moment(compareStart);
      $('input[name="daterange"]').daterangepicker(
        {
           maxDate: new Date(),
           "opens":"left",
          locale: {
            format: 'MM/DD/YYYY'
          },
          startDate: start,
          endDate: end
        }
        , cmpare);
    }
     $timeout(function() {
        $scope.setcomparetimeforproduct();
    }, 10);
     cmpareinit(start, end);

      var startDate;
      var endDate;

      var startDate;
      var endDate;

      var end = moment(Reportenddate);
      var start = moment(ReportstartDate);

      function daterangepickerCallBacks(start, end,label) {
      $timeout(function() {
      $('#reportrange span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
      $('#reportrange').data('daterangepicker').setStartDate(start);
      $('#reportrange').data('daterangepicker').setEndDate(end);
      }, 10);
        startDate = start;
        endDate = end;

        ReportstartDate= start;
        Reportenddate=end;
         dashBoardService.settimeperiodlabel(label);

       if(label=="Last week"){
       if($scope.reporttimeranges.indexOf(7)){
       $scope.reporttimeranges.splice(7, 1);
       }
       $scope.selectedtimeperiod=$scope.reporttimeranges[0];
            }
            else if(label=="This Month"){
               if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);
              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[1];
            }
            else if(label=="Last Month"){
               if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);
              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[2];
            }
             else if(label=="Quarter 1 (Jan-Mar)"){
               if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);
              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[3];
            }
            else if(label=="Custom Range"){
              if($scope.reporttimeranges[7]==undefined){
                var obj={"name":"CUSTOM"}
                 $scope.reporttimeranges.push(obj);
             }
              $scope.selectedtimeperiod=$scope.reporttimeranges[7];
            }

          if($scope.selectedtimeperiod.name=="LAST 7 DAYS"){
            if($scope.lastsevendays==true){
              $scope.lastsevendays=false;
             compareEnd=moment(start).subtract(1,'days');
    compareStart=moment(start).subtract(7,'days');

   cmpareinit(compareStart,compareEnd);
    $timeout(function() {
        $scope.setcomparetimeforproduct();
    }, 10);
            }
            else{
compareEnd=moment(end).subtract(1,'year');
    compareStart=moment(start).subtract(1,'year');

   cmpareinit(compareStart,compareEnd);
    $timeout(function() {
        $scope.setcomparetimeforproduct();
    }, 10);         }
         
          }
          else{

             compareEnd=moment(end).subtract(1,'year');
    compareStart=moment(start).subtract(1,'year');

   cmpareinit(compareStart,compareEnd);
   $timeout(function() {
        $scope.setcomparetimeforproduct();
    }, 10);

          }

           dashBoardService.setdashboardcacheStaus(false);
    dashBoardService.setproductscacheStatus(false);
    dashBoardService.setsalesregioncacheStatus(false);

       dashBoardService.setcomparestartdate(compareStart);
       dashBoardService.setcompareenddate(compareEnd);
       dashBoardService.setreportstartdate(start);
       dashBoardService.setreportenddate(end);

          $scope.ReportstartDate = start;
          $scope.Reportenddate = end;
          $scope.ReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.Reportenddate = end.format('YYYYMMDD') + 'T235959.000-0000';

        var ReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
        var Reportenddate = end.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.ReportTimePeriod = start.format('MMM DD YYYY') + ' - ' + end.format('MMM DD YYYY');
        $scope.$applyAsync();

        if($scope.role=="cpg"||$scope.role=="distributor"){

             var dataobject={
                             "compareStartDate":  $scope.ComparestartDate,
                             "compareEndDate":$scope.Compareenddate,
                             "reportEndDate":$scope.Reportenddate,
                             "reportStartDate":$scope.ReportstartDate,
                           }


           if($scope.selectedStoresforLinechart.length>0){

            //console.log("selected store...",$scope.selectedStoresforLinechart);
        if($scope.selectedgraph =='line'){
       $rootScope.$emit('LinechartEventforstore', dataobject);
       $scope.linechartapicallstatus=true;
       $scope.barchartapicallstatus=false;
         }
     else{
       $rootScope.$emit('barcharteventforstore', dataobject);
       $scope.barchartapicallstatus=true;
       $scope.linechartapicallstatus=false;

   }
  }
    }
          else if($scope.role=="retailer"){

            var dataobject={
                             "compareStartDate":  $scope.ComparestartDate,
                             "compareEndDate":$scope.Compareenddate,
                             "reportEndDate":$scope.Reportenddate,
                             "reportStartDate":$scope.ReportstartDate,
                           }

           if($scope.selectedStoresforLinechart.length>0){

           // console.log("selected store...",$scope.selectedStoresforLinechart);
        if($scope.selectedgraph =='line'){
       $rootScope.$emit('LinechartEventforstore', dataobject);
       $scope.linechartapicallstatus=true;
       $scope.barchartapicallstatus=false;
         }
     else{
       $rootScope.$emit('barcharteventforstore', dataobject);
       $scope.barchartapicallstatus=true;
       $scope.linechartapicallstatus=false;
      }
      }
      }
      }
      function daterangepickerCallBackInit(startdate, enddate) {
        $timeout(function() {
    $('#reportrange span').html(startdate.format('MM/DD/YYYY') + ' - ' + enddate.format('MM/DD/YYYY'));
    }, 10);
    startDate = startdate;
    endDate = enddate;

          ReportstartDate=startdate;
          Reportenddate=enddate;
          window.localStorage['comparetimestart']=compareStart;
          window.localStorage['comparetimeend']=compareEnd;
          window.localStorage['reporttimestart']=startdate;
          window.localStorage['reporttimeend']=enddate;
          dashBoardService.setcomparestartdate(compareStart);
          dashBoardService.setcompareenddate(compareEnd);
          dashBoardService.setreportstartdate(startdate);
          dashBoardService.setreportenddate(enddate);

          $scope.ReportstartDate = startDate;
          $scope.Reportenddate = endDate;
          $scope.SalesDataReportstartDate = startdate.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.ReportstartDate = startdate.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.Reportenddate = enddate.format('YYYYMMDD') + 'T235959.000-0000';
          $scope.ReportTimePeriod = startdate.format('MMM DD YYYY') + ' - ' + enddate.format('MMM DD YYYY');
          $scope.totalreporttime=startdate.format('MMM Do YYYY')+"-"+enddate.format('MMM Do YYYY');
        }

if(dashBoardService.gettimeperiodlabel()==undefined){
      dashBoardService.settimeperiodlabel("Last week");
     }
     
      $timeout(function() {
      $('#reportrange').daterangepicker({
         maxDate: new Date(),
        startDate: start,
        endDate: end,
        "autoUpdateInput": false,
        "opens":"center",
        ranges: {
          'This Month': [moment().startOf('month'), moment().subtract(1,'days')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'Quarter 1 (Jan-Mar)': [moment().startOf('year').startOf('month'), moment().startOf('year').add(2, 'month').endOf('month')],
          'Quarter 2 (Apr-jun)': [moment().startOf('year').add(3, 'month').startOf('month'), moment().startOf('year').add(5, 'month').endOf('month')],
          'Quarter 3 (Jul-sep)': [moment().startOf('year').add(6, 'month').startOf('month'), moment().startOf('year').add(8, 'month').endOf('month')]
        }
      }, daterangepickerCallBacks)}, 10);

              daterangepickerCallBackInit(start, end);
      $scope.selectedgraph ='line';
  $scope.selectgraph=function (graph) {

    $scope.selectedgraph =graph;

    if($scope.selectedgraph =='line'){
          if($scope.linechartapicallstatus==false){
             if($scope.selectedStoresforLinechart.length>0){
               var dataobject={
                             "compareStartDate":  $scope.ComparestartDate,
                              "compareEndDate":$scope.Compareenddate,
                             "reportEndDate":$scope.Reportenddate,
                             "reportStartDate":$scope.ReportstartDate,
                           }
              $rootScope.$emit('LinechartEventforstore', dataobject);
              $scope.linechartapicallstatus=true;
             }

             }

        }else if($scope.selectedgraph =='bar'){
          if($scope.barchartapicallstatus==false){
          if($scope.selectedproducts.length>0){
          
            var dataobject={
                            "compareStartDate":  $scope.ComparestartDate,
                             "compareEndDate":$scope.Compareenddate,
                             "reportEndDate":$scope.Reportenddate,
                             "reportStartDate":$scope.ReportstartDate,
                           }

           $rootScope.$emit('barcharteventforstore', dataobject);
           $scope.barchartapicallstatus=true;
          }
        }
      }
  }


      /**************************** END DATEPICKER  ***************************************/


      /*  */

      $scope.sign = "+";
      $scope.selectedStoreList = [];

       var linechartindex;

    linechartindex=$rootScope.$on('storecomparisonindex', function (event, data) {
     for(var i=0;i<$scope.selectedStoresforLinechart.length;i++){
      if($scope.selectedStoresforLinechart[i].storeid==data.storeid){
        $scope.selectedStoresforLinechart[i].spIndex=data.index;
        $scope.selectedStoresforLinechart[i].total=data.total;
      }
     }
         });

     var linechartindexbarchart;

    linechartindexbarchart=$rootScope.$on('storecomparisonindexbarchart', function (event, data) {
     for(var i=0;i<$scope.selectedproducts.length;i++){
      if($scope.selectedproducts[i].storeid==data.storeid){
        $scope.selectedproducts[i].index=data.index;
      }
     }
         });

      $scope.selectedStore = function (menuitem, data) {
        $scope.datasign = data;
        if ($scope.datasign == 'pluse') {
          $scope.selectedmenuitem = menuitem;
          if ($scope.selectedmenuitem == 'Store #3') {
            $scope.selectoption = menuitem;
          }
          $scope.sign = "-";
        }
        if ($scope.datasign == 'minus') {
          $scope.selectedmenuitem = menuitem;
          $scope.sign = "+";
        }
      }


      $scope.getRecord = function (id) {
        $scope.selectedStoreId=id;
          $scope.data.selectedStoreId=id;
        if($scope.data.selectedStoreId==""||$scope.data.selectedStoreId=="ALL STORES") {
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
        }
      }


        $scope.storealreadyselected=function(){
      $scope.topStoreid=$stateParams.storedata;
      $scope.topstorestatus= dashBoardService.gettopstorecomparisionstatus();
      if($scope.topstorestatus==true&&$scope.topStoreid){
        if($scope.topStoreid.storeId!=undefined||$scope.topStoreid.storeId!=null){
          $timeout(function() {
          $scope.gotostore($scope.topStoreid);
        },200);
        }
      }
      else if($scope.topstorestatus==false||$scope.topstorestatus==undefined){
       $timeout(function() {
        if($scope.topstoresList[0]){
          var object={
      "amt":$scope.topstoresList[0].amt,
      "content":$scope.topstoresList[0].content,
      "storeId":$scope.topstoresList[0].id,
      "id":$scope.topstoresList[0].id,
      "retailerId":$scope.topstoresList[0].retailerId
       }

       //console.log("first store/////",object)
          $scope.gotostore(object);
        }
        else{
          $scope.masked=false;
        }
        },2000);
      }
    }


      $scope.role=sessionStorage.role;

      
       $scope.getindexStyle = function (value) {
        if (value >= 1) {
          return "page_dashboard_box_index green";
        } else {
          return "page_dashboard_box_index red";
        }
      };

        

$scope.selectedtimeperiod={};

             $scope.reporttimeranges=[
                              {"name":"LAST 7 DAYS"},
                              {"name":"THIS MONTH"},
                              {"name":"LAST MONTH"},
                              {"name":"QUARTER 1 2017"},
                              {"name":"QUARTER 2 2017"},
                              {"name":"QUARTER 3 2017"},
                              {"name":"QUARTER 4 2017"}
                              
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

            if(value.name=="LAST 7 DAYS"){
               $scope.selectedtimeperiod=$scope.reporttimeranges[0];
              $scope.lastsevendays=true;
              $scope.starttime=moment().subtract(7,'days');
              $scope.endtime=moment().subtract(1,'days');
              daterangepickerCallBacks($scope.starttime,$scope.endtime,"Last week");
            }
            else if(value.name=="THIS MONTH"){
             $scope.selectedtimeperiod=$scope.reporttimeranges[1];
              $scope.starttime=moment().startOf('month');
              $scope.endtime=moment().subtract(1,'days');
              daterangepickerCallBacks($scope.starttime,$scope.endtime,"This Month");
            }
            else if(value.name=="LAST MONTH"){
             $scope.selectedtimeperiod=$scope.reporttimeranges[2];
             $scope.starttime=moment().subtract(1,'month').startOf('month');
             $scope.endtime=moment().subtract(1,'month').endOf('month');
              daterangepickerCallBacks($scope.starttime,$scope.endtime,"Last Month");

            }
            else if(value.name=="QUARTER 1 2017"){

          $scope.selectedtimeperiod=$scope.reporttimeranges[3];
               $scope.starttime=  moment().startOf('year').startOf('month');
              $scope.endtime= moment().startOf('year').add(2, 'month').endOf('month');
           daterangepickerCallBacks($scope.starttime,$scope.endtime,"Quarter 1 (Jan-Mar)");

            }
            else if(value.name=="QUARTER 2 2017"){
               $scope.selectedtimeperiod=$scope.reporttimeranges[4];

              $scope.starttime=moment().startOf('year').add(3, 'month').startOf('month'); 
              $scope.endtime=moment().startOf('year').add(5, 'month').endOf('month');
           daterangepickerCallBacks($scope.starttime,$scope.endtime,"Quarter 2 (Apr-jun)");

            }
            else if(value.name=="QUARTER 3 2017"){

           $scope.selectedtimeperiod=$scope.reporttimeranges[5];
                        
          $scope.starttime=moment().startOf('year').add(6, 'month').startOf('month');
            $scope.endtime=moment().startOf('year').add(8, 'month').endOf('month');

           daterangepickerCallBacks($scope.starttime,$scope.endtime,"Quarter 3 (Jul-sep)");
            }
              else if(value.name=="QUARTER 4 2017"){

            $scope.selectedtimeperiod=$scope.reporttimeranges[6];
                        
          $scope.starttime=moment().startOf('year').add(9, 'month').startOf('month');
            $scope.endtime=moment().subtract(1,'days');;

           daterangepickerCallBacks($scope.starttime,$scope.endtime,"Quarter 4 (Oct-Dec)");

            }

          }



  // ...................Brand api call for CPG....................

         $scope.CPGBrandsList=[
          {
            "brand_id":"",
            "brand_name":"All Brands"
           }];

           $scope.CPGBrandIdsList=[];
        
            $scope.getCPGBrands=function(){
        dashBoardService.getBrandsforCPG().then(function(response){
     
        for(var i=0;i<response.data.length;i++){

        $scope.CPGBrandsList.push(response.data[i]);
        //$scope.BrandIdsList.push(response.data[i].brandid);
          //console.log("BrandsList......", $scope.CPGBrandsList);
        if($scope.brandId){
          $scope.brandId=$scope.brandId+","+response.data[i].brandid;
        }
        else{
          $scope.brandId=response.data[i].brandid;
        }
        }

        sessionStorage.brandIdsList=$scope.brandId;

        for(var i=0;i<$scope.CPGBrandsList.length;i++){
        $scope.CPGBrandsList[i].brand_name=$scope.CPGBrandsList[i].brand_name;
        }
        
        $scope.selectedBrand=$scope.CPGBrandsList[0];
        $scope.selectedBrandId=$scope.CPGBrandsList[0].brandid;
        dashBoardService.saveselectedBrand($scope.selectedBrand);
       // dashBoardService.setBrandidList($scope.BrandIdsList);
        
        $scope.savedBrand=dashBoardService.getselectedBrand();

        if($scope.savedBrand!=null){
        
        if($scope.savedBrand.brand_name!="All Brands"){
        for(var i=0;i<$scope.CPGBrandsList.length;i++){

        if($scope.savedBrand.brandid==$scope.CPGBrandsList[i].brandid){
         $scope.selectedBrand=$scope.CPGBrandsList[i];
          $scope.selectedBrandId=$scope.savedBrand.brandid;
        }
        }
        }
        }
        else{
            dashBoardService.saveselectedBrand($scope.selectedBrand);
        }
        //$scope.brandportalApicallsforCPG();
        },function(response){
           console.log("error msg..",response);
        });
        }

      $scope.brandChange=function(brand){
          console.log("brand",brand);
          $scope.selectedBrand=brand;
          dashBoardService.saveselectedBrand($scope.selectedBrand);
          $scope.selectedBrandId=brand.brand_id; 
          $scope.getAllRetailers();
          

      }



      $scope.SalesPerformanceByStoreIdforcpgwithBRAND = function (storeid,storename) {
       //  $scope.showspinner();
    $scope.SalesPerformanceByStoreIdbyRT = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "filters": {
          "items.mfgId" : [$scope.mfgid],
          "items.brandId" : [$scope.selectedBrand.brandid.toString()]
        }
      }
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          $scope.total=response.data.total;
          $scope.productchartdata=[];
          $scope.linechartData=[];
          $scope.rpIndextotal = parseFloat(response.data.total);
          if ($scope.spIndextotal==0||$scope.spIndextotal== null) {
            $scope.spIndex = 0;
          }
          else {
            $scope.spIndex=$scope.rpIndextotal/$scope.spIndextotal;
            $scope.spIndex=$scope.spIndex.toFixed(2);
          }
           $scope.j=1;
           var object={
              "storename":"STORE #"+storeid,
             "income":$scope.total,
              "expenses":$scope.comparetimetotal,
              "color": "#4C98CF",
              "color1": "#7F2891"
            }
             $scope.productchartdata.push(object);
          for(var i=0;i<=response.data.data.length;i++){
            if(i==0){
               $scope.date=moment($scope.ReportstartDate).utc().format("YYYY-MM-DD");
               $scope.ResultDate=moment($scope.date).format("MM-DD-YYYY");
               $scope.ResultDate1=moment($scope.ComparestartDate).utc().format("MM-DD-YYYY");
             }
             else{
          $scope.nextDate=moment($scope.date).add($scope.j,'days').format("YYYY-MM-DD");
          $scope.ResultDate=moment($scope.nextDate).format("MM-DD-YYYY");
          $scope.ResultDate1=moment($scope.ComparestartDate).add(i,'days').format("MM-DD-YYYY");
               $scope.j++;
             }

            if(response.data.data&&$scope.Cpdata){
             if(response.data.data[i]&&$scope.Cpdata[i]){
             var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": $scope.Cpdata[i].amt
                      }
              
              $scope.linechartData.push(linechartdataobject);
          }
          else if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              
              $scope.linechartData.push(linechartdataobject);
          }
          else if($scope.Cpdata[i]){
               var linechartdataobject = {
                        "id":$scope.Cpdata[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": 0,
                        "value2": $scope.Cpdata[i].amt
                      }
              $scope.linechartData.push(linechartdataobject);
             }
             }
             else{
              if(response.data.data[i]){
            var linechartdataobject = {
                        "id":response.data.data[i].id,
                        "date": $scope.ResultDate,
                        "date1":$scope.ResultDate1,
                        "lineColor": "rgb(66, 141, 201)",
                        "value": response.data.data[i].amt,
                        "value2": 0
                      }
              $scope.linechartData.push(linechartdataobject);
             }
             }
          }
           $scope.selectedproducts=[];
           $scope.selectedStoresforLinechart=[];
          $scope.makechart($scope.productchartdata,$scope.linechartData,storeid,storename);
               $scope.masked=false;
               $scope.linechartapicallstatus=true;
               $scope.barchartapicallstatus=true;
        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": $scope.ComparestartDate,
      "endTime": $scope.Compareenddate,
      "filters": {
          "items.mfgId" : [$scope.mfgid],
            "items.brandId" : [$scope.selectedBrand.brandid.toString()]
        }
    }
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
         $scope.spIndextotal = parseFloat(response.data.total);
         $scope.comparetimetotal=response.data.total;
         $scope.Cpdata=response.data.data;
         $scope.SalesPerformanceByStoreIdbyRT();

      }, function (response) {
        console.log(response);
      }
    );
  }


 $scope.geosalesDataforCpgwithBRAND=function(storeId){
       var data={
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "geoLevel" : 4,
        "filters" :{
        "item.mfgId" : [$scope.mfgId],
        "storeId" : storeId,
        "retailerId" : $scope.RetailerIds,
        "items.brandId" : [$scope.selectedBrand.brandid.toString()]
        }
      }

      $scope.showmap=false;
      $scope.geoSalesData=undefined;
      dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
        $scope.topStoresData={
         map: "usaLow",
         getAreasFromMap: true,
         "markers": []
       };
       $scope.topstores=[];
       $scope.storeList=[];
       $scope.storesformap=[];
      if(response.data.data){
              if(response.data.data.length>0){
                  $scope.geoSalesData=response.data.data;
              
          $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
              dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              }
              else{
               $scope.geoSalesData=[];
              }
             }
             else{
               $scope.geoSalesData=[];
             }
              $scope.showmap=true;

               }, function (response) {
                 console.log(response);

               }
               );
    }

       



$scope.init=function(){
         if($scope.role=="cpg"){
           $scope.getAllstores();
           $scope.getAllRetailers();
            $scope.getCPGBrands();
           
           //$scope.topSalesRegionsforcpg();

           /*$timeout(function(){
            console.log("selected value...",$scope.selectedvalue);
            if($scope.selectedvalue.region=="ALL SALES REGIONS"){
             $scope.salespperformancebyallstoresforcpg();
            }
            else{
              $scope.salespperformancebyallstoresforcpgbyregion();
            }
            },100);*/

          }
          else if($scope.role=="distributor"){
            $scope.getDistributorBrands();
           $scope.getAllstores();
          }
          else if($scope.role=="retailer"){
            $scope.getstoreList();
            $scope.topSalesRegions();
            $timeout(function(){
          if($scope.selectedvalue.region=="ALL SALES REGIONS"){
               $scope.salespperformancebyallstores();
            }
            else{
              $scope.salespperformancebyallstoresbyregion();
            }
             },1000);
          }
      }


$scope.init();



    }]);

'use strict';
