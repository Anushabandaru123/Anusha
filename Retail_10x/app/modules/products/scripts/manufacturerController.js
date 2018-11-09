
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

angular.module('manufacturer .controllers',
  [])


  .controller('manufacturerCtrl', ['$scope', '$state','productService','dashBoardService','$timeout','usSpinnerService', '$rootScope','$filter',
    function ($scope, $state,productService,dashBoardService,$timeout,usSpinnerService, $rootScope,$filter) {


    if (sessionStorage.user == undefined || sessionStorage.user == null||sessionStorage.user =="null") {
      $state.go('login');
    }

      $scope.selectData = function (catName , catId) {



        $scope.deptName = catName//$scope.split[0];
        $scope.deptid = catId//$scope.split[1];

        $scope.option =$scope.deptName;

        $scope.categoriesName = window.localStorage['namedeptcat'];
        window.localStorage['namecategories']=$scope.deptName;
        $scope.depoptionName=window.localStorage['namecategories']

        $scope.xy = {

          "Name": $scope.deptName
        }

      if($scope.data.selectedStoreId==""||$scope.data.selectedStoreId=="ALL STORES") {
        $scope.donutChartFunction();
      }
      else{
        $scope.donutChartFunctionbyStoreId();

      }



       

        
     //   $scope.salesperformancebyCategoriesforretailer();

      }

      $scope.selectdropdown = function () {

        $scope.spin=true;

        $scope.optionpname   = window.localStorage['pname'];
        $scope.option = window.localStorage['namecategories'];//window.localStorage['selectoption1'];
        $scope.depoptionName =window.localStorage['namecategories'];
        $scope.categoriesName = window.localStorage['namedeptcat'];
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


      $scope.donutChartFunction = function () {


        $scope.donutChartHandlerforRT=function () {

          var donutChartData = {

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

          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
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

              $scope.dountchardataRT=response.data.data;

              for (var i = 0; i<$scope.dountchardataRT.length; i++) {
               // if(i<10) {
                    if($scope.dountchardataRT[i].amt>0){

                      var object = {
                    "percent": $scope.dountchardataRT[i].amt,
                   "amt":$filter('number')($scope.dountchardataRT[i].amt,2),
                    "title": $scope.dountchardataRT[i].id,
                     "id":$scope.dountchardataRT[i].id
                    };
                  $scope.donutchartData.push(object);

                    }
              }
              $scope.$applyAsync();
              $scope.showpiechart=true;

              console.log("total response...",$scope.donutchartData);

              //  $scope.SalesPerformance=true;
            }, function (response) {

            }
          );

        }

        var donutChartData = {
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

        productService.GetSalesPerformance(donutChartData).then(function (response) {
            var count=0;
            $scope.total = '$' + response.data.total;

            $scope.dountchardataCT=response.data.data;

            $scope.donutChartHandlerforRT();

            $scope.$applyAsync();


          }, function (response) {

          }
        );

      }


      






       $scope.donutChartFunctionbyStoreId = function () {

        $scope.donutChartstore=function () {


          var donutChartData = {

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


          if (!$scope.spinneractive) {
            $scope.spin=true;
            usSpinnerService.spin('spinner-1');
            //$scope.startcounter++;
          }

          $scope.showpiechart=false;
          productService.GetSalesPerformanceByStoreId(donutChartData).then(function (response) {
              var count=0;

              $scope.spinneractive= true;

              if ($scope.spinneractive) {

                $scope.spin=false;
                usSpinnerService.stop('spinner-1');

              }

              $scope.total = '$' + response.data.total;
              //  $scope.SalesPerformance=false;
              $scope.donutchartData = [];

              $scope.piechartid= dashBoardService.generateguid();
              $scope.dountchardataRT=response.data.data;


              for (var i = 0; i <$scope.dountchardataRT.length; i++) {
                //if(i<10) {

                 if($scope.dountchardataRT[i].amt>0){
                  var object = 
                  {
                  "percent": $scope.dountchardataRT[i].amt,
                  "amt":$filter('number')($scope.dountchardataRT[i].amt,2),
                  "title": $scope.dountchardataRT[i].id,
                  "id":$scope.dountchardataRT[i].id,
                  };

                  $scope.donutchartData.push(object);
               


           /* }else{
                  count = $scope.dountchardataRT[i].amt+count;
                }
                var object = {"percent": count, "title": "Others"};
                $scope.donutchartData.push(object);*/
              }
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
          "endTime":$scope.Reportenddate,
          "bucketLevel" : "L",
          "bucketType" : "mfgName",
          "filters": {
            "item.deptId" : [window.localStorage['iddeptcat']],
            "item.categoryDesc" : [window.localStorage['namecategories']]
          }
        }

        
        productService.GetSalesPerformanceByStoreId(donutChartData).then(function (response) {
            var count=0;
            $scope.total = '$' + response.data.total;

            $scope.dountchardataCT=response.data.data;

            $scope.donutChartstore();
            //  $scope.SalesPerformance=false;

            $scope.$applyAsync();
           

          }, function (response) {

          }
        );
      }



/*****************************************************/

      /* categories List  of left side code*/

      $scope.SelectedCategoriesList=function(){

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

              $scope.alltopDepartments=true;

              $scope.categoriesdata=[];
              $scope.length=0;

              if($scope.CategoriesdatabyRT.length > $scope.CategoriesdatabyCT.length){
                $scope.length=$scope.CategoriesdatabyRT.length;
              }
              else {
                $scope.length=$scope.CategoriesdatabyCT.length;
              }


              for(var i=0;i<$scope.length;i++) {
                if ($scope.CategoriesdatabyRT[i] && $scope.CategoriesdatabyCT[i]) {

                  var storename=$scope.CategoriesdatabyRT[i].id;
                        if(storename.length>0){
                  var data = {
                    "storename": $scope.CategoriesdatabyRT[i].id,
                    "amt": $scope.CategoriesdatabyRT[i].amt,
                    "amt1": $scope.CategoriesdatabyCT[i].amt,
                    "color": "#4C98CF",
                    "color1": "#7F2891"
                  }
                  $scope.categoriesdata.push(data);
                }
              }
                else if($scope.CategoriesdatabyRT[i])
                {

                   var storename=$scope.CategoriesdatabyRT[i].id;
                        if(storename.length>0){
                  var data = {
                    "storename": $scope.CategoriesdatabyRT[i].id,
                    "amt": $scope.CategoriesdatabyRT[i].amt,
                    "amt1": 0,
                    "color": "#4C98CF",
                    "color1": "#7F2891"
                  }
                  $scope.categoriesdata.push(data);

                    }
                }
                else if($scope.CategoriesdatabyCT[i]){
                   var storename=$scope.CategoriesdatabyRT[i].id;
                        if(storename.length>0){
                  var data= {
                    "storename":$scope.CategoriesdatabyCT[i].id,
                    "amt": 0,
                    "amt1": $scope.CategoriesdatabyCT[i].amt,
                    "color":"#4C98CF",
                    "color1":"#7F2891"
                  }
                  $scope.categoriesdata.push(data);
                    }

                }
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




      /* by store Id*/


     
      /*******************************************/

      var selectedmanufacture;

      selectedmanufacture = $rootScope.$on('selecteddonutchartManufacture', function (event, data) {


         window.localStorage['namemanufacture']=data.title;

        $state.go('manufacturerDetails');

      });


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
    $scope.donutChartFunction();
      }
    else{

      dashBoardService.setstoreid($scope.data.selectedStoreId);
               
               $scope.storeId = $scope.data.selectedStoreId;
              sessionStorage.storeId = $scope.storeId;

  $scope.donutChartFunctionbyStoreId();

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

    
      if($scope.role=="retailer"){
            if ($scope.data.selectedStoreId == ""|| $scope.data.selectedStoreId=="ALL STORES") {
               // console.log("call the all store api here");
    $scope.donutChartFunction();
      }
    else{

      dashBoardService.setstoreid($scope.data.selectedStoreId);
               
               $scope.storeId = $scope.data.selectedStoreId;
              sessionStorage.storeId = $scope.storeId;

             // console.log("call the store api here....");
  $scope.donutChartFunctionbyStoreId();



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

        $scope.SelectedCategoriesList();
        $scope.selectdropdown();
        $scope.GetStoreList();

         $scope.storeid=dashBoardService.getstoreid();


          if($scope.storeid!=null&&$scope.storeid!=undefined&&$scope.storeid!=""){
            sessionStorage.storeId = $scope.storeid;

              $scope.donutChartFunctionbyStoreId();

          }
          else{

        $scope.donutChartFunction();
         
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
               // console.log("call the all store api here");

    $scope.donutChartFunction();

    dashBoardService.setdashboardcacheStaus(false);
         dashBoardService.setproductscacheStatus(false);
         dashBoardService.setsalesregioncacheStatus(false);

      }
    else{

      dashBoardService.setstoreid($scope.data.selectedStoreId);
               
               $scope.storeId = $scope.data.selectedStoreId;
              sessionStorage.storeId = $scope.storeId;

  $scope.donutChartFunctionbyStoreId();

  dashBoardService.setdashboardcacheStaus(false);
         dashBoardService.setproductscacheStatus(false);
         dashBoardService.setsalesregioncacheStatus(false);



             }
      }



    }]);
