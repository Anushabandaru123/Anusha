
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

    angular.module('manufacturerDetail .controllers',
      [])


      .controller('manufacturerDetailCtrl', ['$scope', '$state','productService','dashBoardService','$timeout','usSpinnerService', '$rootScope','$filter',
        function ($scope, $state,productService,dashBoardService,$timeout,usSpinnerService, $rootScope,$filter) {


        if (sessionStorage.user == undefined || sessionStorage.user == null||sessionStorage.user =="null") {
          $state.go('login');
        }

          $scope.selectData = function (mfgName,mfgId) {


            $scope.deptName =  mfgName    // $scope.split[0];
            $scope.deptid =  mfgId      // $scope.split[1];

            $scope.option =$scope.deptName;

            window.localStorage['namemanufacture']=$scope.deptName;

            $scope.dataDepartmentProduct = $scope.selectedvalue1;

            $scope.xy = {

              "Name": $scope.deptName
            }


            //$scope.donutChartFunction();

            console.log("selected store id...",$scope.data.selectedStoreId);
       if( $scope.storeid==""|| $scope.storeid=="ALL STORES") {
       $scope.ManufacturerItemNameforretailer();
         
       }
       else{
       $scope.ManufacturerItemNameforretailerbystore();
       }
            

            //   $scope.salesperformancebyCategoriesforretailer();

          }

          $scope.selectdropdown = function () {

            $scope.spin=true;

            $scope.optionpname   = window.localStorage['pname'];
            $scope.option =   window.localStorage['namemanufacture']//window.localStorage['namecategories'];//window.localStorage['selectoption1'];
            $scope.depoptionName =  window.localStorage['namemanufacture'] //window.localStorage['namecategories'];// window.localStorage['namedeptcat'];
            $scope.dpoptionid   = window.localStorage['iddeptcat'];


            //   $scope.option   = window.localStorage['Namedept']
            $scope.xy = {

              "Name": $scope.depoptionName
            }


            $scope.selectedvalue1 = $scope.xy.Name;

            $scope.departName =  window.localStorage['namedeptcat'];
            $scope.categoriesName = window.localStorage['namecategories'];
          }


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
   
                    $scope.storeidselected=$scope.List[j].store_id;
                    $scope.selectedstoreidname=$scope.List[j].store_name;
                  }
                }

              }, function (response) {

              }
            );
          }



          /* for Left Nav Manufactire List*/

          $scope.chartheight="400px";
          $scope.salesperformancebyManufacturerforretailerList=function(){

            $scope.salesperformancebyManufacturerforretailerbyRT=function(){

              var salesData={
                "aggTimeUnit":"1d",
                "startTime":$scope.SalesDataReportstartDate,
                "endTime":$scope.Reportenddate,
                "bucketLevel" : "L",
                "bucketType" : "mfgName",
                "filters": {
                  "item.deptId" : [window.localStorage['iddeptcat']],
                  "item.categoryDesc" : [window.localStorage['namecategories']]
                }
              }

            
              productService.GetSalesPerformance(salesData).then(function(response){


                  $scope.manufacturerdatabyRT=response.data.data;

                  
                  $scope.manufacturerdataList=[];
                  $scope.length=0;

                  if($scope.manufacturerdatabyRT.length>$scope.manufacturerdatabyCT.length){
                    $scope.length=$scope.manufacturerdatabyRT.length;
                  }
                  else {
                    $scope.length=$scope.manufacturerdatabyCT.length;
                  }

                  for(var i=0;i<$scope.length;i++){
                    if($scope.manufacturerdatabyRT[i]&&$scope.manufacturerdatabyCT[i]){

                            var storename=$scope.manufacturerdatabyRT[i].id;
                            if(storename.length>0){
                      var data= {
                        "storename":$scope.manufacturerdatabyRT[i].id,
                        "amt":  $scope.manufacturerdatabyRT[i].amt,
                        "amt1": $scope.manufacturerdatabyCT[i].amt,
                        "color":"#4C98CF",
                        "color1":"#7F2891"
                      }
                      $scope.manufacturerdataList.push(data);
                    }
                  }
                    else if($scope.manufacturerdatabyRT[i]){
                      var storename=$scope.manufacturerdatabyRT[i].id;
                            if(storename.length>0){
                      var data= {
                        "storename":$scope.manufacturerdatabyRT[i].id,
                        "amt": $scope.manufacturerdatabyRT[i].amt,
                        "amt1": 0,
                        "color":"#4C98CF",
                        "color1":"#7F2891"
                      }
                      $scope.manufacturerdataList.push(data);

                      }
                    }
                    else if($scope.manufacturerdatabyCT[i]){
                      var storename=$scope.manufacturerdatabyCT[i].id;
                            if(storename.length>0){
                      var data= {
                        "storename":$scope.manufacturerdatabyCT[i].id,
                        "amt": 0,
                        "amt1": $scope.manufacturerdatabyCT[i].amt,
                        "color":"#4C98CF",
                        "color1":"#7F2891"
                      }
                      $scope.manufacturerdataList.push(data);
                      }

                    }
                  }

                  console.log("manufacturer data list..",$scope.manufacturerdataList);


                }, function (response) {

                }
              )
            }

            var salesData={
              "aggTimeUnit":"1d",
              "startTime":$scope.SalesDataComparestartDate,
              "endTime":$scope.Compareenddate,
              "bucketLevel" : "L",
              "bucketType" : "mfgName",
              "filters": {
                "item.deptId" : [window.localStorage['iddeptcat']],
                "item.categoryDesc" : [window.localStorage['namecategories']]
              }
            }


            productService.GetSalesPerformance(salesData).then(function(response){

                $scope.manufacturerdatabyCT=response.data.data;

                $scope.salesperformancebyManufacturerforretailerbyRT();

              }, function (response) {

              }
            )

          }


           $scope.salesperformancebyManufacturerListbystore=function(){

            $scope.salesperformancebyManufacturerforretailerbyRT=function(){

              var salesData={
                "aggTimeUnit":"1d",
                "startTime":$scope.SalesDataReportstartDate,
                "endTime":$scope.Reportenddate,
                "bucketLevel" : "L",
                "bucketType" : "mfgName",
                "filters": {
                  "item.deptId" : [window.localStorage['iddeptcat']],
                  "item.categoryDesc" : [window.localStorage['namecategories']]
                }
              }

            
              productService.GetSalesPerformanceByStoreId(salesData).then(function(response){


                  $scope.manufacturerdatabyRT=response.data.data;

                  

                  $scope.manufacturerdataList=[];
                  $scope.length=0;

                  if($scope.manufacturerdatabyRT.length>$scope.manufacturerdatabyCT.length){
                    $scope.length=$scope.manufacturerdatabyRT.length;
                  }
                  else {
                    $scope.length=$scope.manufacturerdatabyCT.length;
                  }

                  for(var i=0;i<$scope.length;i++){
                    if($scope.manufacturerdatabyRT[i]&&$scope.manufacturerdatabyCT[i]){

                            var storename=$scope.manufacturerdatabyRT[i].id;
                            if(storename.length>0){
                      var data= {
                        "storename":$scope.manufacturerdatabyRT[i].id,
                        "amt":  $scope.manufacturerdatabyRT[i].amt,
                        "amt1": $scope.manufacturerdatabyCT[i].amt,
                        "color":"#4C98CF",
                        "color1":"#7F2891"
                      }
                      $scope.manufacturerdataList.push(data);
                    }
                  }
                    else if($scope.manufacturerdatabyRT[i]){
                      var storename=$scope.manufacturerdatabyRT[i].id;
                            if(storename.length>0){
                      var data= {
                        "storename":$scope.manufacturerdatabyRT[i].id,
                        "amt": $scope.manufacturerdatabyRT[i].amt,
                        "amt1": 0,
                        "color":"#4C98CF",
                        "color1":"#7F2891"
                      }
                      $scope.manufacturerdataList.push(data);

                      }
                    }
                    else if($scope.manufacturerdatabyCT[i]){
                      var storename=$scope.manufacturerdatabyCT[i].id;
                            if(storename.length>0){
                      var data= {
                        "storename":$scope.manufacturerdatabyCT[i].id,
                        "amt": 0,
                        "amt1": $scope.manufacturerdatabyCT[i].amt,
                        "color":"#4C98CF",
                        "color1":"#7F2891"
                      }
                      $scope.manufacturerdataList.push(data);
                      }

                    }
                  }

                  console.log("manufacturer data list..",$scope.manufacturerdataList);



                }, function (response) {

                }
              )
            }

            var salesData={
              "aggTimeUnit":"1d",
              "startTime":$scope.SalesDataComparestartDate,
              "endTime":$scope.Compareenddate,
              "bucketLevel" : "L",
              "bucketType" : "mfgName",
              "filters": {
                "item.deptId" : [window.localStorage['iddeptcat']],
                "item.categoryDesc" : [window.localStorage['namecategories']]
              }
            }


            productService.GetSalesPerformanceByStoreId(salesData).then(function(response){

                $scope.manufacturerdatabyCT=response.data.data;

                $scope.salesperformancebyManufacturerforretailerbyRT();

              }, function (response) {

              }
            )

          }



          $scope.donutChartFunction = function () {

            $scope.donutChartHandlerforRT=function () {

              var donutChartData = {

                "aggTimeUnit":"1d",
                "startTime":$scope.SalesDataReportstartDate,
                "endTime":$scope.Reportenddate,
                "bucketLevel" : "L",
                "bucketType" : "brandName",
                "filters": {

                  "item.deptId" : [window.localStorage['iddeptcat']],
                  "item.categoryDesc" : [window.localStorage['namecategories']],
                  "item.mfgName" :  [window.localStorage['namemanufacture']]//["BUDGET SAVERS"]
                }
              }


              if (!$scope.spinneractive) {
                $scope.spin=true;
                usSpinnerService.spin('spinner-1');
              }

              $scope.showpiechart=false;
              productService.GetSalesPerformance(donutChartData).then(function (response) {
                  var count=0;

                  if ($scope.spinneractive) {

                    $scope.spin=false;
                    usSpinnerService.stop('spinner-1');

                  }
                  $scope.total = '$' + response.data.total;
                  $scope.donutchartData = [];

                  $scope.piechartid= productService.generateguid();

                  for (var i = 0; i < response.data.data.length; i++) {
                    if(i<10) {
                      var object = {"percent": response.data.data[i].amt, "title": response.data.data[i].id
                        /*,
                         "id": $scope.dountcharid[i].id*/};
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
              "aggTimeUnit":"1d",
              "startTime":$scope.SalesDataComparestartDate,
              "endTime":$scope.Compareenddate,
              "bucketLevel" : "L",
              "bucketType" : "brandName",
              "filters": {
                "item.deptId" : [window.localStorage['iddeptcat']],
                "item.categoryDesc" : [window.localStorage['namecategories']],
                "item.mfgName" :  window.localStorage['namemanufacture']// ["BUDGET SAVERS"]
              }
            }


            productService.GetSalesPerformance(donutChartData).then(function (response) {
                var count=0;
                $scope.total = '$' + response.data.total;

                $scope.dountcharid=response.data.data;

                $scope.donutChartHandlerforRT();

                $scope.$applyAsync();


              }, function (response) {

              }
            );

          }



          $scope.donutChartFunctionbystore = function () {


            $scope.donutChartHandlerforRTbystore=function () {

              var donutChartData = {

                "aggTimeUnit":"1d",
                "startTime":$scope.SalesDataReportstartDate,
                "endTime":$scope.Reportenddate,
                "bucketLevel" : "L",
                "bucketType" : "brandName",
                "filters": {

                  "item.deptId" : [window.localStorage['iddeptcat']],
                  "item.categoryDesc" : [window.localStorage['namecategories']],
                  "item.mfgName" :  [window.localStorage['namemanufacture']]//["BUDGET SAVERS"]
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

                  if ($scope.spinneractive) {

                    $scope.spin=false;
                    usSpinnerService.stop('spinner-1');

                  }
                  $scope.total = '$' + response.data.total;
                  $scope.donutchartData = [];

                  $scope.piechartid= productService.generateguid();


                  for (var i = 0; i < response.data.data.length; i++) {
                    if(i<10) {
                      var object = {
                        "percent": response.data.data[i].amt, 
                        "title": response.data.data[i].id
                        };
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
              "aggTimeUnit":"1d",
              "startTime":$scope.SalesDataComparestartDate,
              "endTime":$scope.Compareenddate,
              "bucketLevel" : "L",
              "bucketType" : "brandName",
              "filters": {
                "item.deptId" : [window.localStorage['iddeptcat']],
                "item.categoryDesc" : [window.localStorage['namecategories']],
                "item.mfgName" :  window.localStorage['namemanufacture']// ["BUDGET SAVERS"]
              }
            }

            productService.GetSalesPerformanceByStoreId(donutChartData).then(function (response) {
                var count=0;
                $scope.total = '$' + response.data.total;

                $scope.dountcharid=response.data.data;

                $scope.donutChartHandlerforRTbystore();

                $scope.$applyAsync();

              }, function (response) {

              }
            );

          }


          /* bar chart*/
          $scope.ManufacturerItemNameforretailer=function(){

            $scope.ManufacturerItemNameforretailerbyRT=function(){

              var salesData={
                "aggTimeUnit":"1d",
                "startTime":$scope.SalesDataReportstartDate,
                "endTime":$scope.Reportenddate,
                "bucketLevel" : "L",
                "bucketType" : "name",
                "filters": {
                  "item.deptId" : [window.localStorage['iddeptcat']],
                  "item.categoryDesc" : [window.localStorage['namecategories']],
                  "item.mfgName" :  [window.localStorage['namemanufacture']]
                }
              }

              $scope.alltopDepartments=false;
              productService.GetSalesPerformance(salesData).then(function(response){

                  $scope.manufacturerItemdatabyRT=response.data.data;

                  $scope.manufacturerid=productService.generateguid();

                  $scope.manufacturerdata=[];
                  $scope.length=0;

                    $scope.length=$scope.manufacturerItemdatabyRT.length;

    for (var i = 0; i < $scope.length; i++) {

                     $scope.indexvalue=0.00;

            var results = $filter('filter')($scope.manufacturerItemdatabyCT, {id : $scope.manufacturerItemdatabyRT[i].id}, true);

            if(results.length>0){

               if(results[0].amt>=0){

                $scope.indexvalue = $scope.manufacturerItemdatabyRT[i].amt / results[0].amt;
                         $scope.indexvalue=$scope.indexvalue.toFixed(2);

                       }
                       var amt=($scope.manufacturerItemdatabyRT[i].amt>=0)?$scope.manufacturerItemdatabyRT[i].amt:0;
                        var amt1=(results[0].amt>=0)?results[0].amt:0;

                        var data= {
                        "storename":$scope.manufacturerItemdatabyRT[i].id,
                        "amt": amt,
                        "amt1": amt1,
                        "color":"#4C98CF",
                        "color1":"#7F2891",
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                        "deptId":window.localStorage['iddeptcat'],
                         "DeptName":window.localStorage['namedeptcat'],
                         "upc":$scope.manufacturerItemdatabyRT[i].upc

                      }
                      $scope.manufacturerdata.push(data);

                      }
            else{

             var amt=($scope.manufacturerItemdatabyRT[i].amt>=0)?$scope.manufacturerItemdatabyRT[i].amt:0;

                          var data= {
                        "storename":$scope.manufacturerItemdatabyRT[i].id,
                        "amt": amt,
                        "amt1": 0,
                        "color":"#4C98CF",
                        "color1":"#7F2891",
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue.toFixed(2),
                         "deptId":window.localStorage['iddeptcat'],
                         "DeptName":window.localStorage['namedeptcat'],
                         "upc":$scope.manufacturerItemdatabyRT[i].upc


                      }
                      $scope.manufacturerdata.push(data);

            }


            }

            for(var k=0;k<$scope.manufacturerItemdatabyCT.length;k++){

                 var results = $filter('filter')($scope.manufacturerItemdatabyRT, {id : $scope.manufacturerItemdatabyCT[k].id}, true);
        
                      if(results.length==0){
                        $scope.indexvalue=0.00;
                      var amt1=($scope.manufacturerItemdatabyCT[k].amt>=0)?$scope.manufacturerItemdatabyCT[k].amt:0;

                       var data= {
                        "storename":$scope.manufacturerItemdatabyCT[k].id,
                        "amt": 0,
                        "amt1": amt1,
                        "color":"#4C98CF",
                        "color1":"#7F2891",
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue.toFixed(2),
                         "deptId":window.localStorage['iddeptcat'],
                         "DeptName":window.localStorage['namedeptcat'],
                          "upc":$scope.manufacturerItemdatabyCT[k].upc


                      }
                      $scope.manufacturerdata.push(data);

                      }
                   
              
            }


            $scope.chartlength=$scope.manufacturerdata.length;
               
if( $scope.chartlength>20){
                    $scope.chartheightlength=40* $scope.chartlength;
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                  else if($scope.chartlength>10){
                    $scope.chartheightlength=45*$scope.chartlength;
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.chartlength>=5){
                    $scope.chartheightlength=40*$scope.chartlength;
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                   else if( $scope.chartlength>=2){
                    $scope.chartheightlength=35* ($scope.chartlength+2);
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.chartheight="100px";
                  }

                   $scope.alltopDepartments=true;


                }, function (response) {

                }
              )
            }



       $scope.ManufacturerItemNameforretailerbyCT=function(){

            var salesData={
              "aggTimeUnit":"1d",
              "startTime":$scope.SalesDataComparestartDate,
              "endTime":$scope.Compareenddate,
              "bucketLevel" : "L",
              "bucketType" : "name",
              "filters": {
                "item.deptId" : [window.localStorage['iddeptcat']],
                "item.categoryDesc" : [window.localStorage['namecategories']],
                "item.mfgName" :  [window.localStorage['namemanufacture']]
              }
            }
            productService.GetSalesPerformance(salesData).then(function(response){

                $scope.manufacturerItemdatabyCT=response.data.data;

                $scope.ManufacturerItemNameforretailerbyRT();

              }, function (response) {

              }
            )
          }

              var salesData={
                "aggTimeUnit":"1d",
                "startTime":$scope.SalesDataReportstartDate,
                "endTime":$scope.Reportenddate,
                "bucketLevel" : "L",
                "bucketType" : "id",
                "filters": {
                  "item.deptId" : [window.localStorage['iddeptcat']],
                  "item.categoryDesc" : [window.localStorage['namecategories']],
                  "item.mfgName" :  [window.localStorage['namemanufacture']]
                }
              }


              productService.GetSalesPerformance(salesData).then(function(response){

                  $scope.manufactureritemnumbers=response.data.data;

             $scope.ManufacturerItemNameforretailerbyCT();

                }, function (response) {

                }
              )
            
          }


           $scope.ManufacturerItemNameforretailerbystore=function(){

            $scope.ManufacturerItemNameforretailerbyRTbystore=function(){

              var salesData={
                "aggTimeUnit":"1d",
                "startTime":$scope.SalesDataReportstartDate,
                "endTime":$scope.Reportenddate,
                "bucketLevel" : "L",
                "bucketType" : "name",
                "filters": {
                  "item.deptId" : [window.localStorage['iddeptcat']],
                  "item.categoryDesc" : [window.localStorage['namecategories']],
                  "item.mfgName" :  [window.localStorage['namemanufacture']]
                }
              }

              $scope.alltopDepartments=false;
              productService.GetSalesPerformanceByStoreId(salesData).then(function(response){

                  $scope.manufacturerItemdatabyRT=response.data.data;

                  $scope.manufacturerid=productService.generateguid();

                  $scope.manufacturerdata=[];
                  $scope.length=0;

                    $scope.length=$scope.manufacturerItemdatabyRT.length;


    for (var i = 0; i < $scope.length; i++) {

                     $scope.indexvalue=0.00;
            var results = $filter('filter')($scope.manufacturerItemdatabyCT, {id : $scope.manufacturerItemdatabyRT[i].id}, true);

            if(results.length>0){

               if(results[0].amt>=0){

                $scope.indexvalue = $scope.manufacturerItemdatabyRT[i].amt / results[0].amt;
                         $scope.indexvalue=$scope.indexvalue.toFixed(2);

                       }
                       var amt=($scope.manufacturerItemdatabyRT[i].amt>=0)?$scope.manufacturerItemdatabyRT[i].amt:0;
                        var amt1=(results[0].amt>=0)?results[0].amt:0;

                        var data= {
                        "storename":$scope.manufacturerItemdatabyRT[i].id,
                        "amt": amt,
                        "amt1": amt1,
                        "color":"#4C98CF",
                        "color1":"#7F2891",
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue,
                         "deptId":window.localStorage['iddeptcat'],
                         "DeptName":window.localStorage['namedeptcat']

                      }
                      $scope.manufacturerdata.push(data);


                      }
            else{

             var amt=($scope.manufacturerItemdatabyRT[i].amt>=0)?$scope.manufacturerItemdatabyRT[i].amt:0;

                          var data= {
                        "storename":$scope.manufacturerItemdatabyRT[i].id,
                        "amt": amt,
                        "amt1": 0,
                        "color":"#4C98CF",
                        "color1":"#7F2891",
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue.toFixed(2),
                         "deptId":window.localStorage['iddeptcat'],
                         "DeptName":window.localStorage['namedeptcat']

                      }
                      $scope.manufacturerdata.push(data);

            }


            }

            for(var k=0;k<$scope.manufacturerItemdatabyCT.length;k++){


                 var results = $filter('filter')($scope.manufacturerItemdatabyRT, {id : $scope.manufacturerItemdatabyCT[k].id}, true);
        
                      if(results.length==0){
                        $scope.indexvalue=0;
                      var amt1=($scope.manufacturerItemdatabyCT[k].amt>=0)?$scope.manufacturerItemdatabyCT[k].amt:0;

                       var data= {
                        "storename":$scope.manufacturerItemdatabyCT[k].id,
                        "amt": 0,
                        "amt1": amt1,
                        "color":"#4C98CF",
                        "color1":"#7F2891",
                        "reporttime":$scope.totalreporttime,
                        "comapretime":$scope.totalcomparetime,
                        "Index":$scope.indexvalue.toFixed(2),
                         "deptId":window.localStorage['iddeptcat'],
                         "DeptName":window.localStorage['namedeptcat']

                      }
                      $scope.manufacturerdata.push(data);

                      }
                   
              
            }

            $scope.chartlength=$scope.manufacturerdata.length;
               
if( $scope.chartlength>20){
                    $scope.chartheightlength=40* $scope.chartlength;
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                  else if($scope.chartlength>10){
                    $scope.chartheightlength=45*$scope.chartlength;
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                 else if($scope.chartlength>=5){
                    $scope.chartheightlength=40*$scope.chartlength;
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                   else if( $scope.chartlength>=2){
                    $scope.chartheightlength=35* ($scope.chartlength+2);
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }

                  else{

                    $scope.chartheight="100px";
                  }

                   $scope.alltopDepartments=true;


                }, function (response) {

                }
              )
            }

            var salesData={
              "aggTimeUnit":"1d",
              "startTime":$scope.SalesDataComparestartDate,
              "endTime":$scope.Compareenddate,
              "bucketLevel" : "L",
              "bucketType" : "name",
              "filters": {
                "item.deptId" : [window.localStorage['iddeptcat']],
                "item.categoryDesc" : [window.localStorage['namecategories']],
                "item.mfgName" :  [window.localStorage['namemanufacture']]
              }
            }

            productService.GetSalesPerformanceByStoreId(salesData).then(function(response){

                $scope.manufacturerItemdatabyCT=response.data.data;

                $scope.ManufacturerItemNameforretailerbyRTbystore();


              }, function (response) {

              }
            )

          }


          $scope.chartid=productService.generateguid();
          $scope.chartid1=productService.generateguid();


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



            if($scope.role=="retailer"){
                if ($scope.data.selectedStoreId == ""|| $scope.data.selectedStoreId=="ALL STORES") {
                   // console.log("call the all store api here");
                $scope.salesperformancebyManufacturerforretailerList();
           
        $scope.donutChartFunction();
        $scope.ManufacturerItemNameforretailer();
          }
        else{

          dashBoardService.setstoreid($scope.data.selectedStoreId);

                   $scope.storeId = $scope.data.selectedStoreId;
                  sessionStorage.storeId = $scope.storeId;

                  $scope.ManufacturerItemNameforretailerbystore();

                   $scope.donutChartFunctionbystore();
      $scope.ManufacturerItemNameforretailerbystore();

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

          $scope.setcomparetimeforproduct();

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

            ReportstartDate= start;
            Reportenddate=end;
      dashBoardService.settimeperiodlabel(label);
     


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

          
    if($scope.role=="retailer"){
                if ($scope.data.selectedStoreId == ""|| $scope.data.selectedStoreId=="ALL STORES") {
                   // console.log("call the all store api here");
        $scope.donutChartFunction();
        $scope.ManufacturerItemNameforretailer();
        $scope.salesperformancebyManufacturerforretailerList();

          }
        else{

          dashBoardService.setstoreid($scope.data.selectedStoreId);

                   $scope.storeId = $scope.data.selectedStoreId;
                  sessionStorage.storeId = $scope.storeId;

                  $scope.ManufacturerItemNameforretailerbystore();

                   $scope.donutChartFunctionbystore();
      $scope.ManufacturerItemNameforretailerbystore();


                 }
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

          $scope.role=sessionStorage.role;


          $scope.showselectedstore=false;
          $scope.showselectearea=true;

          $scope.init=function(){

           // $scope.SelectedCategoriesList();
              $scope.salesperformancebyManufacturerforretailerList();
            $scope.donutChartFunction();
            $scope.selectdropdown();
            $scope.GetStoreList();

             $scope.storeid=dashBoardService.getstoreid();

          if($scope.storeid!=null&&$scope.storeid!=undefined&&$scope.storeid!=""){
            sessionStorage.storeId = $scope.storeid;

              $scope.ManufacturerItemNameforretailerbystore();

          }
          else{

        $scope.ManufacturerItemNameforretailer();
         
          }
          
          }

          $scope.init();


          // $scope.init();

           $scope.data={
           selectedStoreId:''
          }


     $scope.role=sessionStorage.role;

          $scope.getSelectedProduct = function (id) {
        
          $scope.data.selectedStoreId=id;

        if ($scope.data.selectedStoreId == ""|| $scope.data.selectedStoreId=="ALL STORES") {
                   // console.log("call the all store api here");

        $scope.salesperformancebyManufacturerforretailerList();
        $scope.donutChartFunction();
        $scope.ManufacturerItemNameforretailer();


        dashBoardService.setdashboardcacheStaus(false);
         dashBoardService.setproductscacheStatus(false);
         dashBoardService.setsalesregioncacheStatus(false);
          }
        else{


          dashBoardService.setstoreid($scope.data.selectedStoreId);
                   
                   $scope.storeId = $scope.data.selectedStoreId;
                  sessionStorage.storeId = $scope.storeId;
                  $scope.salesperformancebyManufacturerListbystore();

                  console.log("call the store api here....");
                  $scope.donutChartFunctionbystore();
      $scope.ManufacturerItemNameforretailerbystore();
     

      dashBoardService.setdashboardcacheStaus(false);
         dashBoardService.setproductscacheStatus(false);
         dashBoardService.setsalesregioncacheStatus(false);



                 }
          }


           var productbarchartcallback;

       productbarchartcallback=   $rootScope.$on('topproductbarchartcallback', function (event, data) {
         
        window.localStorage['dataplus']= "plus";

        window.localStorage['checkflag']="";

          $scope.screen4 = data.productName;
          $scope.iddept=data.deptid;
          $scope.itemNum=data.itemNumber;
          $scope.Namedept=data.Namedept;
          window.localStorage['itemNum']= $scope.itemNum;
          window.localStorage['pname']= $scope.screen4;
          window.localStorage['iddept']=   $scope.iddept;
          window.localStorage['selectoption1']= $scope.Namedept;

          window.localStorage['s2']=true;

          window.localStorage['individualProduct']=true;




           console.log($scope.screen4)
        
          $state.go('individualDepartment');
          


        });



        }]);
