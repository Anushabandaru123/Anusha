
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

  angular.module('categories.controllers',
    [])


    .controller('categoriesCtrl', ['$scope', '$state','productService','dashBoardService','$timeout','usSpinnerService', '$rootScope','$filter',
      function ($scope, $state,productService,dashBoardService,$timeout,usSpinnerService, $rootScope,$filter) {


      if (sessionStorage.user == undefined || sessionStorage.user == null||sessionStorage.user =="null") {
        $state.go('login');
      }

        $scope.selectData = function (departmentName , departmentId) {



        $scope.deptName = departmentName //$scope.split[0];
        $scope.deptid = departmentId//$scope.split[1];

          $scope.option =$scope.deptName;

          window.localStorage['namedeptcat']=$scope.deptName;

          $scope.xy = {

            "Name":$scope.deptName
          }


          window.localStorage['iddeptcat']= $scope.deptid;
         // $scope.salesperformancebyCategoriesforretailer();

         console.log("selected store id....",$scope.data.selectedStoreId);
        
       if($scope.data.selectedStoreId == ""|| $scope.data.selectedStoreId=="ALL STORES") {
         $scope.salesperformancebyCategoriesforretailer();
          }
        else{
          $scope.salesperformancebyCategoriesbystore();    
          }





        }

        $scope.selectdropdown = function () {

          $scope.spin=true;

          $scope.optionpname   = window.localStorage['pname'];
          $scope.option = window.localStorage['namedeptcat'];//window.localStorage['selectoption1'];
          $scope.depoptionName = window.localStorage['namedeptcat'];
          $scope.dpoptionid   = window.localStorage['iddeptcat'];


          $scope.xy = {

            "Name": $scope.depoptionName
          }

          $scope.selectedvalue1 = $scope.xy.Name;
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


                  $scope.selectedstoreidname=$scope.List[j].store_name;
                }
              }

            }, function (response) {

            }
          );
        }



        $scope.ListdeptProduct = [];

        $scope.selectdepartmentProducts = function () {

          $scope.listproducts=function () {

            var DataName = {
              "aggTimeUnit": "1d",
              "startTime": $scope.SalesDataReportstartDate,
              "endTime": $scope.Reportenddate,
              "bucketLevel": "L",
              "bucketType": "deptName"
            }

            productService.GetSalesPerformance(DataName).then(function (response) {
                var count=0;
                $scope.total = '$' + response.data.total;

                  
                for (var i = 0; i < response.data.data.length; i++) {

          var departmentname=response.data.data[i].id;
                          if(departmentname.length>0){

                  var object = {
                    "amount": response.data.data[i].amt,
                    "Name": response.data.data[i].id ,
                    "id": $scope.listdeptproductname[i].id,
                    "reporttime":$scope.totalreporttime,
                    "comapretime":$scope.totalcomparetime
                  };

                  $scope.ListdeptProduct.push(object);

                     }
                }

                $scope.$applyAsync();

                $scope.showpiechart=true;
                //  $scope.SalesPerformance=true;
              }, function (response) {

              }
            );

          }

          var DataId = {
            "aggTimeUnit": "1d",
            "startTime": $scope.SalesDataReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel": "L",
            "bucketType": "deptId"
          }

          productService.GetSalesPerformance(DataId).then(function (response) {
              var count=0;
              $scope.total = '$' + response.data.total;
              $scope.ListdeptProductid = [];

              $scope.listdeptproductname=response.data.data;


              $scope.listproducts();
              $scope.$applyAsync();
              $scope.showpiechart=true;

            }, function (response) {

            }
          );

        }



          //$scope.NoData=false;

  /**************************************/
            $scope.chartheight="400px";

        $scope.salesperformancebyCategoriesforretailer=function(){


          $scope.salesperformancebyCategoriesforretailerbyRT=function(){

            $scope.dpoptionid   = window.localStorage['iddeptcat'];

            var salesData={

              "aggTimeUnit":"1d",
              "startTime":$scope.SalesDataReportstartDate,
              "endTime":$scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "categoryDesc",
              "filters": {
                "item.deptId" : [$scope.dpoptionid]
              }


            }


            $scope.alltopDepartments=false;
            productService.GetSalesPerformance(salesData).then(function(response){

                $scope.CategoriesdatabyRT=response.data.data;

                $scope.Categoriesid=productService.generateguid();
                
                $scope.categoriesdata=[];
                $scope.length=0;

                  $scope.length=$scope.CategoriesdatabyRT.length;

   for (var i = 0; i < $scope.length; i++) {

                   $scope.indexvalue=0.00;

          var results = $filter('filter')($scope.CategoriesdatabyCT, {id : $scope.CategoriesdatabyRT[i].id}, true);

          if(results.length>0){

             if(results[0].amt>=0){

              $scope.indexvalue = $scope.CategoriesdatabyRT[i].amt / results[0].amt;
                       $scope.indexvalue=$scope.indexvalue.toFixed(2);

                     }
                     var amt=($scope.CategoriesdatabyRT[i].amt>=0)?$scope.CategoriesdatabyRT[i].amt:0;
                      var amt1=(results[0].amt>=0)?results[0].amt:0;

                     var data = {
                      "storename": $scope.CategoriesdatabyRT[i].id,
                      "amt": amt,
                      "amt1": amt1,
                      "color": "#4C98CF",
                      "color1": "#7F2891",
                      "reporttime":$scope.totalreporttime,
                      "comapretime":$scope.totalcomparetime,
                      "Index":$scope.indexvalue
                    }
                    $scope.categoriesdata.push(data);


                    }
          else{

           var amt=($scope.CategoriesdatabyRT[i].amt>=0)?$scope.CategoriesdatabyRT[i].amt:0;

                         var data = {
                      "storename": $scope.CategoriesdatabyRT[i].id,
                      "amt": amt,
                      "amt1": 0,
                      "color": "#4C98CF",
                      "color1": "#7F2891",
                      "reporttime":$scope.totalreporttime,
                      "comapretime":$scope.totalcomparetime,
                      "Index":$scope.indexvalue.toFixed(2)
                    }
                    $scope.categoriesdata.push(data);

          }


          }

          for(var k=0;k<$scope.CategoriesdatabyCT.length;k++){


               var results = $filter('filter')($scope.CategoriesdatabyRT, {id : $scope.CategoriesdatabyCT[k].id}, true);
      
                    if(results.length==0){
                      $scope.indexvalue=0.00;
                    var amt1=($scope.CategoriesdatabyCT[k].amt>=0)?$scope.CategoriesdatabyCT[k].amt:0;

                     var data = {
                      "storename": $scope.CategoriesdatabyCT[k].id,
                      "amt": 0,
                      "amt1": amt1,
                      "color": "#4C98CF",
                      "color1": "#7F2891",
                      "reporttime":$scope.totalreporttime,
                      "comapretime":$scope.totalcomparetime,
                      "Index":$scope.indexvalue.toFixed(2)
                    }
                    $scope.categoriesdata.push(data);

                    }
                 
            
          }

           $scope.alltopDepartments=true;

               $scope.chartlength=$scope.categoriesdata.length;

if( $scope.chartlength>20){
                    $scope.chartheightlength=40* $scope.chartlength;
                    console.log("height...",$scope.chartheightlength);
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                  else if($scope.chartlength>10){
                    $scope.chartheightlength=45*$scope.chartlength;
                    console.log("height...",$scope.chartheightlength);
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

              }, function (response) {

              }
            )
          }


          $scope.dpoptionid   = window.localStorage['iddeptcat'];


          var salesData={
            "aggTimeUnit":"1d",
            "startTime":$scope.SalesDataComparestartDate,
            "endTime":$scope.Compareenddate,
            "bucketLevel" : "L",
            "bucketType" : "categoryDesc",
            "filters": {
              "item.deptId" : [$scope.dpoptionid]
            }
          }

          productService.GetSalesPerformance(salesData).then(function(response){

              $scope.CategoriesdatabyCT=response.data.data;

            $scope.salesperformancebyCategoriesforretailerbyRT();

            }, function (response) {

            }
          )

        }


        $scope.salesperformancebyCategoriesbystore=function(){

           $scope.dpoptionid   = window.localStorage['iddeptcat'];

          $scope.salesperformancebyCategoriesbystoreRT=function(){
            var salesData={

              "aggTimeUnit":"1d",
              "startTime":$scope.SalesDataReportstartDate,
              "endTime":$scope.Reportenddate,
              "bucketLevel" : "L",
              "bucketType" : "categoryDesc",
              "filters": {
                "item.deptId" : [$scope.dpoptionid]
              }

            }

            $scope.alltopDepartments=false;
            productService.GetSalesPerformanceByStoreId(salesData).then(function(response){

                $scope.CategoriesdatabyRT=response.data.data;

                $scope.Categoriesid=productService.generateguid();
                $scope.categoriesdata=[];
                $scope.length=0;
                  $scope.length=$scope.CategoriesdatabyRT.length;


   for (var i = 0; i < $scope.length; i++) {

                   $scope.indexvalue=0.00;

          var results = $filter('filter')($scope.CategoriesdatabyCT, {id : $scope.CategoriesdatabyRT[i].id}, true);

          if(results.length>0){

             if(results[0].amt>=0){

              $scope.indexvalue = $scope.CategoriesdatabyRT[i].amt / results[0].amt;
                       $scope.indexvalue=$scope.indexvalue.toFixed(2);

                     }
                     var amt=($scope.CategoriesdatabyRT[i].amt>=0)?$scope.CategoriesdatabyRT[i].amt:0;
                      var amt1=(results[0].amt>=0)?results[0].amt:0;

                     var data = {
                      "storename": $scope.CategoriesdatabyRT[i].id,
                      "amt": amt,
                      "amt1": amt1,
                      "color": "#4C98CF",
                      "color1": "#7F2891",
                      "reporttime":$scope.totalreporttime,
                      "comapretime":$scope.totalcomparetime,
                      "Index":$scope.indexvalue
                    }
                    $scope.categoriesdata.push(data);


                    }
          else{

           var amt=($scope.CategoriesdatabyRT[i].amt>=0)?$scope.CategoriesdatabyRT[i].amt:0;

                         var data = {
                      "storename": $scope.CategoriesdatabyRT[i].id,
                      "amt": amt,
                      "amt1": 0,
                      "color": "#4C98CF",
                      "color1": "#7F2891",
                      "reporttime":$scope.totalreporttime,
                      "comapretime":$scope.totalcomparetime,
                      "Index":$scope.indexvalue.toFixed(2)
                    }
                    $scope.categoriesdata.push(data);

          }


          }

          for(var k=0;k<$scope.CategoriesdatabyCT.length;k++){


               var results = $filter('filter')($scope.CategoriesdatabyRT, {id : $scope.CategoriesdatabyCT[k].id}, true);
      
                    if(results.length==0){
                      $scope.indexvalue=0.00;
                    var amt1=($scope.CategoriesdatabyCT[k].amt>=0)?$scope.CategoriesdatabyCT[k].amt:0;

                     var data = {
                      "storename": $scope.CategoriesdatabyCT[k].id,
                      "amt": 0,
                      "amt1": amt1,
                      "color": "#4C98CF",
                      "color1": "#7F2891",
                      "reporttime":$scope.totalreporttime,
                      "comapretime":$scope.totalcomparetime,
                      "Index":$scope.indexvalue.toFixed(2)
                    }
                    $scope.categoriesdata.push(data);

                    }
                 
            
          }

          $scope.chartlength=$scope.categoriesdata.length;
               
if( $scope.chartlength>20){
                    $scope.chartheightlength=40* $scope.chartlength;
                    console.log("height...",$scope.chartheightlength);
                    $scope.chartheight=$scope.chartheightlength+"px";
                  }
                  else if($scope.chartlength>10){
                    $scope.chartheightlength=45*$scope.chartlength;
                    console.log("height...",$scope.chartheightlength);
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
            "bucketType" : "categoryDesc",
            "filters": {
              "item.deptId" : [$scope.dpoptionid]
            }
          }

          productService.GetSalesPerformanceByStoreId(salesData).then(function(response){

              $scope.CategoriesdatabyCT=response.data.data;

            $scope.salesperformancebyCategoriesbystoreRT();

            }, function (response) {

            }
          )

        }

        var categoriesselected;

        categoriesselected = $rootScope.$on('selectedcategoriesname', function (event, data) {

          window.localStorage['namecategories']=data.storename;

          $state.go('manufacturer');

        });


        $scope.chartid=productService.generateguid();
        $scope.chartid1=productService.generateguid();



        $scope.comparestart=  dashBoardService.getcomparestartdate();

        if($scope.comparestart==undefined){

         /* var Reportenddate = moment("2016-11-30");
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
          $scope.totalcomparetime=startDate.format('MMM Do YYYY')+"-"+endDate.format('MMM Do YYYY');

            if($scope.role=="retailer"){
              if ($scope.data.selectedStoreId == ""|| $scope.data.selectedStoreId=="ALL STORES") {
                 // console.log("call the all store api here");
      $scope.salesperformancebyCategoriesforretailer();
        }
      else{

        dashBoardService.setstoreid($scope.data.selectedStoreId);

                 $scope.storeId = $scope.data.selectedStoreId;
                sessionStorage.storeId = $scope.storeId;

                console.log("call the store api here....");
    $scope.salesperformancebyCategoriesbystore();



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
      $scope.salesperformancebyCategoriesforretailer();
        }
      else{

        dashBoardService.setstoreid($scope.data.selectedStoreId);

                 $scope.storeId = $scope.data.selectedStoreId;
                sessionStorage.storeId = $scope.storeId;

    $scope.salesperformancebyCategoriesbystore();

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




        $scope.showselectedstore=false;
        $scope.showselectearea=true;

        $scope.init=function(){
          $scope.storeid=dashBoardService.getstoreid();

          $scope.GetStoreList();
           $scope.selectdropdown();
           $scope.selectdepartmentProducts();
           if($scope.storeid!=null&&$scope.storeid!=undefined&&$scope.storeid!=""){
            sessionStorage.storeId = $scope.storeid;

              $scope.salesperformancebyCategoriesbystore();

          }
          else{

                 $scope.salesperformancebyCategoriesforretailer();
        //  $scope.salesperformancebyManufacturerforretailer();
          
         
          }

          
         
        }

        $scope.init();

         $scope.data={
         selectedStoreId:''
        }


   $scope.role=sessionStorage.role;

        $scope.getSelectedProduct = function (id) {

        $scope.data.selectedStoreId=id;

      if ($scope.data.selectedStoreId == ""|| $scope.data.selectedStoreId=="ALL STORES") {

      $scope.salesperformancebyCategoriesforretailer();

      dashBoardService.setdashboardcacheStaus(false);
         dashBoardService.setproductscacheStatus(false);
         dashBoardService.setsalesregioncacheStatus(false);

        }
      else{
       
        dashBoardService.setstoreid($scope.data.selectedStoreId);

                 $scope.storeId = $scope.data.selectedStoreId;
                sessionStorage.storeId = $scope.storeId;

    $scope.salesperformancebyCategoriesbystore();

    dashBoardService.setdashboardcacheStaus(false);
         dashBoardService.setproductscacheStatus(false);
         dashBoardService.setsalesregioncacheStatus(false);


               }
        }



      }]);
