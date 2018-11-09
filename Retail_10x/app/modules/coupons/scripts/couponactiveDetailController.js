'use strict';
/**
 * @ngdoc controller
 * @name campaignModule.CampaignCtrl
 * @requires $scope
 * @requires $state
 * @requires dashBoard.serviceFactory
 * @description
 * Campaign performs the authentication with help of Service and broadcasts the events to other modules
 *
 * */
angular.module('couponDetailCtrl.controllers', [])


  .controller('couponDetailCtrl', ['$scope', '$state', 'serviceFactory', 'dashBoardService', 'couponService', '$filter', '$stateParams', 'usSpinnerService', 'productService', '$timeout','$rootScope',
    function ($scope, $state, serviceFactory, dashBoardService, couponService, $filter, $stateParams, usSpinnerService, productService, $timeout,$rootScope) {

      if (sessionStorage.user == undefined || sessionStorage.user == null || sessionStorage.user == "null") {
        $state.go('login');
      }

       $scope.couponId = $stateParams.id;
       sessionStorage.couponId=$scope.couponId;
       $scope.List = [];
       $scope.role= sessionStorage.role;
       $scope.mfgId=sessionStorage.mfgId;
       $scope.productId = "productId";
       $scope.basketId = "basketId";
       $scope.deptShareId = "deptShareId";
       $scope.id=$stateParams.id;
/*
      if($scope.role="cpg"){
    $scope.producthover="Sales Amt";
    $scope.ShoppingTripshover="Share of Category";
    $scope.avgbaskethover="Share of Basket";
        $scope.productshover="";

    $scope.shareofcategoryhover="%";
    $scope.shareofbaskethover="%";
    $scope.currencyDetail="$";
    $scope.currencydetailforshoppingtrips="";
    $scope.currencydetailforavgbasket=""

    }*/


    if($scope.role=="retailer"){
    $scope.producthover="Sales Amt";
    $scope.ShoppingTripshover="Shopping Trips";
    $scope.avgbaskethover="Avg Basket";
    $scope.productshover="";
    $scope.shareofcategoryhover="";
    $scope.shareofbaskethover="";
    $scope.currencyDetail="$";
    $scope.currencydetailforshoppingtrips="";
    $scope.currencydetailforavgbasket="$"
    }
    else if($scope.role="cpg"){
    $scope.producthover="Sales Amt";
    $scope.ShoppingTripshover="Share of Category";
    $scope.avgbaskethover="Share of Basket";
    $scope.productshover="";

    $scope.shareofcategoryhover="%";
    $scope.shareofbaskethover="%";
    $scope.currencyDetail="$";
    $scope.currencydetailforshoppingtrips="";
    $scope.currencydetailforavgbasket=""

    }

   // console.log("coupon status...",sessionStorage.couponStatus);

    if(sessionStorage.couponStatus=="Active"){
      $scope.coupon_status="Active";
      sessionStorage.couponStatus="Active";
    }
    else if(sessionStorage.couponStatus=="Archived"){
      $scope.coupon_status="Archive";
      sessionStorage.couponStatus="Archived";
    }
      // $scope.getcouponlistdata = couponService.getcouponlistData();
      //  console.log("coupon list data", $scope.getcouponlistdata);
      $scope.getindexStyle = function (value) {
      	if (value >= 1) {
      		return "page_dashboard_box_index green";
      	} else {
      		return "page_dashboard_box_index red";
      	}
      }

  $scope.idchart =dashBoardService.generateguid()
        $scope.camprecord={
               "couponName": "Nutella",
               "sdate": "07/07/2017",
               "edate": "09/07/2017",
               "CouponRatio": 13,
               "total": 351.21,
               "description":"Nutella Hazelnut Spread",
               "id":$scope.idchart,
               "index":0.85
             }

        $scope.startDate=$scope.camprecord.sdate;
        $scope.endDate=$scope.camprecord.edate;

        $scope.getcoupondetailsofRetailer=function(){
        couponService.couponDetailsofRetailer().then(function (response) {
         // console.log("response coming...",response);
          $scope.couponDetails=response.data[0];
          //console.log("coupon details...",$scope.couponDetails);
            $scope.couponstartDate=moment($scope.couponDetails.start_date).format("MM/DD/YYYY");
            $scope.couponExpirations=$scope.couponDetails.coupon_expiration;
            if($scope.couponExpirations[0].date){
              $scope.couponendate=moment($scope.couponExpirations[0].date).format("MM/DD/YYYY")
            }
            $scope.couponDiscount=$scope.couponDetails.coupon_discount[0];
            $scope.productListforCoupon=$scope.couponDetails.products;
            $scope.productsforCoupon=[];
            $scope.productsforapi=[];
            for(var k=0;k<$scope.productListforCoupon.length;k++){
                $scope.arrayofproducts=$scope.productListforCoupon[k].split("|");
                $scope.productaftersplitting=$scope.arrayofproducts[1];
                $scope.productName=$scope.arrayofproducts[0];
                //console.log("product name...",$scope.productName);
                $scope.productsforCoupon.push($scope.productaftersplitting);
              }
              var productobject={
                "upc":$scope.productsforCoupon,
                "name":$scope.productName
              }
              $scope.productsforapi.push(productobject);
              $scope.retailerList=$scope.couponDetails.retailers;
              $scope.retailerListforcoupon=[];
              for(var k=0;k<$scope.retailerList.length;k++){
                $scope.retailer=$scope.retailerList[k].split("|");
                 $scope.retailerListforcoupon.push($scope.retailer[0]);
              }
           
           var couponstartDate=moment($scope.couponDetails.start_date).format("YYYY-MM-DD");
           var couponendDate=moment($scope.couponDetails.date).format("YYYY-MM-DD");
           var comparetimestartdate;
           var comparetimeendDate;
        comparetimeendDate=moment(couponstartDate).subtract(1,'days').format("YYYY-MM-DD");
              var apienddate= moment(couponendDate).format("YYYYMMDD");
              var apistartdate= moment(couponstartDate).format("YYYYMMDD");
              var enddate=moment();
              if($scope.couponDetails.status=='Active'){
               apienddate= moment(enddate).subtract(1,'days').format("YYYYMMDD");
              }
              if($scope.couponDetails.status=='Archived'){
                apienddate= moment(couponendDate).format("YYYYMMDD");
                enddate=moment(couponendDate);
              }
              var oneDay = 24*60*60*1000;
              var diffDays = Math.round(Math.abs((moment(enddate)-moment(couponstartDate))/(oneDay)));
              comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');
              var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");
              var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");
             $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataapiComparetimestartdate= apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';
              $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
              $scope.salesDataapiReporttimestartdate= apistartdate+ 'T000000.000-0000';
              $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';
             var date = new Date($scope.couponDetails.start_date);
             $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();

             var endDate = new Date($scope.couponDetails.end_date);
             $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getUTCDate()+'/'+endDate.getFullYear();
             $scope.idchart =dashBoardService.generateguid();


          $scope.couponData={
            "couponName":$scope.couponDetails.coupon_title,
            "couponId":$scope.couponDetails.coupon_id,
            "status":$scope.couponDetails.status,
            "imagePath":$scope.couponDetails.image_path,
            "terms":$scope.couponDetails.terms,
            "sdate":$scope.couponstartDate,
            "edate":$scope.couponendate,
            "dicount":$scope.couponDiscount,
            "coupon_expiration":$scope.couponDetails.coupon_expiration,
            "couponStatus":$scope.couponDetails.coupon_status,
            "products":$scope.productsforCoupon,
            "ProductList":$scope.productListforCoupon,
            "retailerList":$scope.retailerList,
            "retailers":$scope.retailerListforcoupon,
            "StartDate":couponstartDate,
            "endDate":couponendDate,
            "startsale": "",
            "endsale": "",
            "startunitsold": "",
            "endunitsold": "",
            "startcs": " ",
            "endcs": "",
            "startbs": "",
            "endbs": "",
            "total": 0.00,
            "index":$scope.salesDataIndex,
            "comparestartDate":$scope.salesDataComparetimestartdate,
            "compareendDate":$scope.salesDataComparetimeenddate,
            "reportstartDate":$scope.salesDataReporttimestartdate,
            "reportendDate":$scope.salesDataReporttimeenddate,
            "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
            "salesDatareporttime":$scope.salesDataapiReporttimestartdate,
            "CouponRatio":0,
            "campaignRatioStatus":"",
            "showchart":true,
            "id":$scope.idchart,
            "productsforapi":$scope.productsforapi
           }

          // console.log("coupon object...",$scope.couponData);

           }, function (response) {
           console.log(response);
          }
          );

        }


        $scope.getcoupondetails=function(){

        couponService.couponDetails().then(function (response) {

         // console.log("response coming...",response);

          $scope.couponDetails=response.data[0];

          console.log("coupon details...",$scope.couponDetails);
               
            $scope.couponstartDate=moment($scope.couponDetails.start_date).format("MM/DD/YYYY");
           
            $scope.couponExpirations=$scope.couponDetails.coupon_expiration;

            if($scope.couponExpirations[0].date){
              
              $scope.couponendate=moment($scope.couponExpirations[0].date).format("MM/DD/YYYY")
            }

            $scope.couponDiscount=$scope.couponDetails.coupon_discount[0];

            $scope.productListforCoupon=$scope.couponDetails.products;

            $scope.productsforCoupon=[];
            $scope.productsforapi=[];



            for(var k=0;k<$scope.productListforCoupon.length;k++){
                $scope.arrayofproducts=$scope.productListforCoupon[k].split("|");
                $scope.productaftersplitting=$scope.arrayofproducts[1];
                $scope.productName=$scope.arrayofproducts[0];
                //console.log("product name...",$scope.productName);
                $scope.productsforCoupon.push($scope.productaftersplitting);
              }

              var productobject={
                "upc":$scope.productsforCoupon,
                "name":$scope.productName
              }

              $scope.productsforapi.push(productobject);
           
              $scope.retailerList=$scope.couponDetails.retailers;
              $scope.retailerListforcoupon=[];

              for(var k=0;k<$scope.retailerList.length;k++){
                $scope.retailer=$scope.retailerList[k].split("|");
                 $scope.retailerListforcoupon.push($scope.retailer[0]);
              }

          
           
           var couponstartDate=moment($scope.couponDetails.start_date).format("YYYY-MM-DD");
           var couponendDate=moment($scope.couponDetails.date).format("YYYY-MM-DD");

          // console.log("coupon start date...",couponstartDate);

              var comparetimestartdate;
              var comparetimeendDate;
               
        comparetimeendDate=moment(couponstartDate).subtract(1,'days').format("YYYY-MM-DD");

              var apienddate= moment(couponendDate).format("YYYYMMDD");

              var apistartdate= moment(couponstartDate).format("YYYYMMDD");

              var enddate=moment();

              if($scope.couponDetails.status=='Active'){

               apienddate= moment(enddate).subtract(1,'days').format("YYYYMMDD");

              }

              if($scope.couponDetails.status=='Archived'){
                apienddate= moment(couponendDate).format("YYYYMMDD");

                enddate=moment(couponendDate);
              }

              var oneDay = 24*60*60*1000;

              var diffDays = Math.round(Math.abs((moment(enddate)-moment(couponstartDate))/(oneDay)));

              comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');

              var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");

              var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");

             $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataapiComparetimestartdate= apicomparestartdate+ 'T000000.000-0000';

              $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';

              $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
              $scope.salesDataapiReporttimestartdate= apistartdate+ 'T000000.000-0000';

              $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';

             var date = new Date($scope.couponDetails.start_date);
             $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();

             var endDate = new Date($scope.couponDetails.end_date);
             $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getUTCDate()+'/'+endDate.getFullYear();
             $scope.idchart =dashBoardService.generateguid();


          $scope.couponData={
            "couponName":$scope.couponDetails.coupon_title,
            "couponId":$scope.couponDetails.coupon_id,
            "status":$scope.couponDetails.status,
            "imagePath":$scope.couponDetails.image_path,
            "terms":$scope.couponDetails.terms,
            "sdate":$scope.couponstartDate,
            "edate":$scope.couponendate,
            "dicount":$scope.couponDiscount,
            "coupon_expiration":$scope.couponDetails.coupon_expiration,
            "couponStatus":$scope.couponDetails.coupon_status,
            "products":$scope.productsforCoupon,
            "ProductList":$scope.productListforCoupon,
            "retailerList":$scope.retailerList,
            "retailers":$scope.retailerListforcoupon,
            "StartDate":couponstartDate,
            "endDate":couponendDate,
            "startsale": "",
            "endsale": "",
            "startunitsold": "",
            "endunitsold": "",
            "startcs": " ",
            "endcs": "",
            "startbs": "",
            "endbs": "",
            "total": 0.00,
            "index":$scope.salesDataIndex,
            "comparestartDate":$scope.salesDataComparetimestartdate,
            "compareendDate":$scope.salesDataComparetimeenddate,
            "reportstartDate":$scope.salesDataReporttimestartdate,
            "reportendDate":$scope.salesDataReporttimeenddate,
            "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
            "salesDatareporttime":$scope.salesDataapiReporttimestartdate,
            "CouponRatio":0,
            "campaignRatioStatus":"",
            "showchart":true,
            "id":$scope.idchart,
            "productsforapi":$scope.productsforapi
           }

          // console.log("coupon object...",$scope.couponData);

           }, function (response) {
           console.log(response);
          }
          );

        }


        var campaignRatio;

      campaignRatio=   $rootScope.$on('campaignRatio', function (event, data) {

        // console.log("data coming...",data);

           $scope.couponData.CouponRatio=data.ratio;
           $scope.couponData.campaignRatioStatus=data.status;

       //console.log("campaign records...", $scope.couponData);

      });


      var destroyFoo;

      destroyFoo=   $rootScope.$on('campaignSales', function (event, data) {

              //console.log("data coming...",data);

                $scope.couponData.datachart=data.chartData;
                $scope.couponData.index=data.index;
                $scope.couponData.total=data.total;
                $scope.couponData.showchart=data.showchart;

      // console.log("campaign records...", $scope.couponrecords);

      });



// ..............bar chart ..............

$scope.products=false;

       $scope.reportstartDate=$scope.reportstartDate;
       $scope.reportendDate=$scope.reportendDate;
       $scope.comparestartDate=$scope.comparestartDate;
       $scope.compareendDate=$scope.compareendDate;
        $scope.salesDatacomparetime=$scope.salesDatacomparetime;
           $scope.salesDatareporttime=$scope.salesDatareporttime;

      $scope.ProductsBarchartforRepporttime=function(){

        var salesDataObject={
          "aggTimeUnit":"1d",
            "startTime":$scope.salesDatareporttime,
           "endTime":$scope.reportendDate,
           "filters": {
            "item.upc" : $scope.productsList,
            "storeId" : $scope.storesforapicalls
        }
    }

    $scope.productChartData=[];
    $scope.products=false;

    dashBoardService.GetSalesPerformance(salesDataObject).then(function (response) {


        if(response.data&&response.data.total>0){
$scope.ProducttotalbyRP=response.data.total;


      if ($scope.ProducttotalbyCP == 0 || $scope.ProducttotalbyCP == null || isNaN($scope.avgBasketTotalByCP)) {
        $scope.ProductIndex = 0;
      }
      else {
        $scope.ProductIndex = $scope.ProducttotalbyRP / $scope.ProducttotalbyCP;
        $scope.ProductIndex = $scope.ProductIndex.toFixed(2);
      }

      //console.log("bar chart data...",response.data);

  
      var productobject={
        "color": "#4C98CF",
        "color1": "#7F2891",
        "name":Nutella,
        "income":20.5,
        "expenses": 18
        
      }

      $scope.productChartData.push(productobject);
    
      $scope.products=true;
        }
        else{
           $scope.products=true;
        }
      
    }, function (response) {
      console.log(response);
    }
    );

}


$scope.ProductsBarchartforComparetime=function(){

  var salesDataObject={
    "aggTimeUnit":"1d",

           "startTime":$scope.salesDatacomparetime,
            "endTime":$scope.compareendDate,
            "filters": {
           "item.upc" : $scope.productsList,
            "storeId" : $scope.storesforapicalls
        }
    }

    dashBoardService.GetSalesPerformance(salesDataObject).then(function (response) {

      $scope.ProducttotalbyCP=response.data.total;
      $scope.ProductsBarchartforRepporttime();
    }, function (response) {
      console.log(response);
    }
    );

}


$scope.topProductsFunctionByAllRetailerforcpg = function () {
        
            $scope.TopProductsbyReportTimeforcpg = function () {
              var data = {
                "aggTimeUnit": "1d",
                
                "startTime": $scope.salesDatareporttime,
               "endTime": $scope.reportendDate,
                "filters": {
                  "items.mfgId" : [$scope.mfgId],
                 "storeId" :$scope.storesforapicalls,
           "item.upc" : $scope.productsList
                }
              }
             $scope.productChartData=[];
    $scope.products=false;            
      dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
             
                    if(response.data&&response.data.total>0){

               $scope.ProducttotalbyRP=response.data.total;

      if ($scope.ProducttotalbyCP == 0 || $scope.ProducttotalbyCP == null || isNaN($scope.ProducttotalbyCP)) {
        $scope.ProductIndex = 0;
      }
      else {
        $scope.ProductIndex = $scope.ProducttotalbyRP / $scope.ProducttotalbyCP;
        $scope.ProductIndex = $scope.ProductIndex.toFixed(2);
      }

      var productobject={
        "name":nutella,
        "color": "#4C98CF",
        "color1": "#7F2891",
        "income":20.5,
        "expenses": 18
        
      }

      $scope.productChartData.push(productobject);

      $scope.products=true;
    }
     else{
           $scope.products=true;
        }
              }, function (response) {
                console.log(response);
              }
              );
            }

            var data = {
              "aggTimeUnit": "1d",
             "startTime": $scope.salesDatacomparetime,
              "endTime": $scope.compareendDate,
              "filters": {
                "items.mfgId" : [$scope.mfgId],
                 "storeId" :$scope.storesforapicalls,
           "item.upc" : $scope.productsList

              }
            }

            dashBoardService.GetSalesPerformanceByAllRetailerswithoutsize(data).then(function (response) {
      $scope.ProducttotalbyCP=response.data.total;
              $scope.TopProductsbyReportTimeforcpg();
            }, function (response) {
              console.log(response);
            }
            );

    }

$scope.avgBasketFunction = function () {
  $scope.avgBasketByRT = function () {
    var ShoppingTripsdata = {
      "aggTimeUnit": "1d",
           "startTime":$scope.reportstartDate,
            "endTime":$scope.reportendDate,
           "filters": {
            "item.upc" : $scope.productsList,
            "storeId" : $scope.storesforapicalls
        }

       }
       $scope.AvgBasket = false;
       $scope.basketSharedata=[];
       dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {

 if(response.data&&response.data.stats&&response.data.stats.avg){
        $scope.avgBasketTotal = response.data.stats.avg;
         $scope.avgBasketTotalByRT = parseFloat(response.data.stats.avg);
           if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)||isNaN($scope.avgBasketTotalByRT)) {
            $scope.ABtotal = 0.00;
          }
          else {
            $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
            $scope.ABtotal = $scope.ABtotal.toFixed(2);
          }

          var basketshareobject={
            "name":$scope.productname,
            "income":$scope.avgBasketTotalByRT.toFixed(2),
            "expenses":$scope.avgBasketTotalByCP.toFixed(2),
           "color": "#4C98CF",
            "color1": "#7F2891"
          }
          $scope.basketSharedata.push(basketshareobject);
            $scope.AvgBasket = true;
       }
       else{
                   $scope.AvgBasket = true;
       }


      }, function (response) {
        console.log(response);
      }
      );
   }

   var ShoppingTripsdata = {
    "aggTimeUnit": "1d",
        "startTime":$scope.comparestartDate,
            "endTime":$scope.compareendDate,
            "filters": {
            "item.upc" : $scope.productsList,
            "storeId" : $scope.storesforapicalls
        }
        }
        dashBoardService.GetAvgBasket(ShoppingTripsdata).then(function (response) {
          $scope.avgBasketTotalByCP = parseFloat(response.data.stats.avg);
          $scope.avgBasketByRT();

        }, function (response) {
          console.log(response);
          $scope.avgBasketByRT();
        }
        );

    }




    $scope.ShoppingTripsFunction = function () {
      $scope.ShoppingTripsbyRT = function () {
        var ShoppingTripsdata = {
          "aggTimeUnit": "1d",
                "startTime":$scope.reportstartDate,
           "endTime":$scope.reportendDate,
            "filters": {
              "terms" : {
            "item.upc" : $scope.productsList,
            "storeId" : $scope.storesforapicalls
        }
        }

       }

        $scope.ShoppingTrips = false;
      
       dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
         $scope.departmentshareData=[];


         if(response.data&&response.data.total>0){
            $scope.ShoppingTripsTotalbyRT = response.data.total;

                $scope.ShoppingTripsRTindex = parseFloat(response.data.total);

                if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null || isNaN($scope.avgBasketTotalByCP)) {
                  $scope.STIndex = 0;
                }
                else {
                  $scope.STIndex = $scope.ShoppingTripsTotalbyRT / $scope.ShoppingTripsCPindex;
                  $scope.STIndex = $scope.STIndex.toFixed(2);
                }

              if($scope.ShoppingTripsRTindex!="NaN" && $scope.ShoppingTripsCPindex!="NaN"){

                var departmentshareobject={
                  "name":$scope.productname,
                  "income":$scope.ShoppingTripsRTindex.toFixed(2),
                  "expenses": $scope.ShoppingTripsCPindex.toFixed(2),
                    "color": "#4C98CF",
                     "color1": "#7F2891"
                }


                $scope.departmentshareData.push(departmentshareobject);
              }

                $scope.ShoppingTrips = true;

         }
         else{
            $scope.ShoppingTrips = true;

         }
       
            }, function (response) {
              console.log(response);
            }
            );
   }

   var ShoppingTripsdata = {
    "aggTimeUnit": "1d",
               "startTime":$scope.comparestartDate,
            "endTime":$scope.compareendDate,
            "filters": {
              "terms" : {
            "item.upc" : $scope.productsList,
            "storeId" : $scope.storesforapicalls
        }
        }
        }

        dashBoardService.GetShoppingTrips(ShoppingTripsdata).then(function (response) {
          $scope.ShoppingTripsCPindex = parseFloat(response.data.total);
          $scope.ShoppingTripsbyRT();
        }, function (response) {
          console.log(response);
        }
        );
    }



    $scope.shareOfCategoryByAllRetailers= function () {
          $scope.shareOfCategoryByRT = function () {
            var ShoppingTripsdata = {

              "aggTimeUnit": "1d",
              "startTime": $scope.reportstartDate,
              "endTime": $scope.reportendDate,
              "rid" : $scope.camprecord.retailerid,
              "sid":$scope.storesforapicalls,
               "filters": {
            "upcs" : $scope.productsList
        }
            }

              $scope.ShoppingTrips = false;
             
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
           
         $scope.departmentshareData=[];

         if(response.data&&response.data.total>0){
            $scope.ShoppingTripsTotalbyRT = response.data.total;

                $scope.ShoppingTripsRTindex = parseFloat(response.data.total);

                if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null || isNaN($scope.avgBasketTotalByCP)) {
                  $scope.STIndex = 0;
                }
                else {
                  $scope.STIndex = $scope.ShoppingTripsTotalbyRT / $scope.ShoppingTripsCPindex;
                  $scope.STIndex = $scope.STIndex.toFixed(2);
                }

              if($scope.ShoppingTripsRTindex!="NaN" && $scope.ShoppingTripsCPindex!="NaN"){

                var departmentshareobject={
                  "name":$scope.productname,
                  "income":$scope.ShoppingTripsRTindex.toFixed(2),
                  "expenses":$scope.ShoppingTripsCPindex.toFixed(2),
                    "color": "#4C98CF",
                     "color1": "#7F2891"
                }


                $scope.departmentshareData.push(departmentshareobject);
              
               // console.log("detpartment share data...",$scope.departmentshareData);

              }

                $scope.ShoppingTrips = true;

         }
         else{
            $scope.ShoppingTrips = true;

         }

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {

            "aggTimeUnit": "1d",
            "startTime": $scope.comparestartDate,
            "endTime": $scope.compareendDate,
             "rid" :$scope.camprecord.retailerid,
             "sid":$scope.storesforapicalls,
              "filters": {
            "upcs" : $scope.productsList
        }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
$scope.ShoppingTripsCPindex = parseFloat(response.data.total);
          $scope.shareOfCategoryByRT();

          }, function (response) {
            console.log(response);
          }
          );
        }



        $scope.shareOfCategoryByAllRetailersBystore= function () {
          $scope.shareOfCategoryByRTforstore = function () {
            var ShoppingTripsdata = {

              "aggTimeUnit": "1d",
              "startTime": $scope.reportstartDate,
              "endTime": $scope.reportendDate,
              "rid" :$scope.camprecord.retailerid,
              "sid":$scope.storesforapicalls,
               "filters": {
            "upcs" : $scope.productsList
        }
            }

              $scope.ShoppingTrips = false;
              
            dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
            
         $scope.departmentshareData=[];

         if(response.data&&response.data.total>0){
            $scope.ShoppingTripsTotalbyRT = response.data.total;

                $scope.ShoppingTripsRTindex = parseFloat(response.data.total);

                if ($scope.ShoppingTripsCPindex == 0 || $scope.ShoppingTripsCPindex == null || isNaN($scope.avgBasketTotalByCP)) {
                  $scope.STIndex = 0;
                }
                else {
                  $scope.STIndex = $scope.ShoppingTripsTotalbyRT / $scope.ShoppingTripsCPindex;
                  $scope.STIndex = $scope.STIndex.toFixed(2);
                }

              if($scope.ShoppingTripsRTindex!="NaN" && $scope.ShoppingTripsCPindex!="NaN"){

               
                var departmentshareobject={
                  "name":$scope.productname,
                  "income":$scope.ShoppingTripsRTindex.toFixed(2),
                  "expenses": $scope.ShoppingTripsCPindex.toFixed(2),
                    "color": "#4C98CF",
                     "color1": "#7F2891"
                }


                $scope.departmentshareData.push(departmentshareobject);
              }

                $scope.ShoppingTrips = true;

         }
         else{
            $scope.ShoppingTrips = true;

         }
            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {

            "aggTimeUnit": "1d",
            "startTime": $scope.comparestartDate,
            "endTime": $scope.compareendDate,
             "rid" :$scope.camprecord.retailerid,
            "sid":$scope.storesforapicalls,
             "filters": {
            "upcs" : $scope.productsList
        }
          }
          dashBoardService.GetShareOfCategory(ShoppingTripsdata).then(function (response) {
         
$scope.ShoppingTripsCPindex = parseFloat(response.data.total);
          $scope.shareOfCategoryByRTforstore();

          }, function (response) {
            console.log(response);
          }
          );
        }


        $scope.ShareOfBasketByAllRetailer = function () {
          $scope.avgBasketByRT = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.reportstartDate,
              "endTime": $scope.reportendDate,
               "rid" :$scope.camprecord.retailerid,
               "sid":$scope.storesforapicalls,
              "filters": {
            "upcs" : $scope.productsList
        }
            }
                   $scope.basketSharedata=[];

            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {

          $scope.AvgBasket = false;
                   if(response.data&&response.data.total>0){

      $scope.avgBasketTotal = response.data.total;

                   $scope.avgBasketTotalByRT = parseFloat(response.data.total);
          if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
            $scope.ABtotal = 0;
          }
          else {
            $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
            $scope.ABtotal = $scope.ABtotal.toFixed(2);
          }
                var departmentshareobject={
                  "name":$scope.productname,
                   "income":$scope.avgBasketTotalByRT.toFixed(2),
                   "expenses":$scope.avgBasketTotalByCP.toFixed(2),
                   "color": "#4C98CF",
                   "color1": "#7F2891"
                }

                $scope.basketSharedata.push(departmentshareobject);

                $scope.AvgBasket = true;
              }
              else{
                $scope.AvgBasket = true;
              }

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.comparestartDate,
            "endTime": $scope.compareendDate,
            "rid" :$scope.camprecord.retailerid,
            "sid":$scope.storesforapicalls,
            "filters": {
            "upcs" : $scope.productsList
        }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
          $scope.avgBasketTotalByCP = parseFloat(response.data.total);

            $scope.avgBasketByRT();

          }, function (response) {
            console.log(response);
          }
          );

        }


        $scope.ShareOfBasketByAllRetailerBystore = function () {
          $scope.avgBasketByRTforstore = function () {
            var ShoppingTripsdata = {
              "aggTimeUnit": "1d",
              "startTime": $scope.reportstartDate,
              "endTime": $scope.reportendDate,
               "rid" :$scope.camprecord.retailerid,
              "sid":$scope.storesforapicalls,
              "filters": {
            "upcs" : $scope.productsList
        }
            }
                   $scope.basketSharedata=[];

            dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {

          $scope.AvgBasket = false;
                             if(response.data&&response.data.total>0){

       $scope.avgBasketTotal = response.data.total;

                   $scope.avgBasketTotalByRT = parseFloat(response.data.total);
          if ($scope.avgBasketTotalByCP == 0 || $scope.avgBasketTotalByCP == null || isNaN($scope.avgBasketTotalByCP)) {
            $scope.ABtotal = 0;
          }
          else {
            $scope.ABtotal = $scope.avgBasketTotalByRT / $scope.avgBasketTotalByCP;
            $scope.ABtotal = $scope.ABtotal.toFixed(2);
          }
                var departmentshareobject={
                  "name":$scope.productname,
                  "income":$scope.avgBasketTotalByRT.toFixed(2),
                   "expenses":$scope.avgBasketTotalByCP.toFixed(2),
                  "color": "#4C98CF",
                  "color1": "#7F2891"
                }

                $scope.basketSharedata.push(departmentshareobject);

                $scope.AvgBasket = true;
              }
              else{
                 $scope.AvgBasket = true;
              }

            }, function (response) {
              console.log(response);
            }
            );
          }

          var ShoppingTripsdata = {
            "aggTimeUnit": "1d",
            "startTime": $scope.comparestartDate,
            "endTime": $scope.compareendDate,
             "rid" :$scope.camprecord.retailerid,
            "sid":$scope.storesforapicalls,
            "filters": {
            "upcs" : $scope.productsList
        }
          }
          dashBoardService.GetShareOfBasket(ShoppingTripsdata).then(function (response) {
          $scope.avgBasketTotalByCP = parseFloat(response.data.total);

            $scope.avgBasketByRTforstore();

          }, function (response) {
            console.log(response);
          }
          );

        }

      $scope.getsalesDatabyStore=function(storeid){

       if(storeid!=null&&storeid!=''){
         $scope.storesforapicalls=[];
       $scope.storesforapicalls.push(storeid);
       var storeobj={
        "storeid":storeid
       }

        $rootScope.$emit('getstorerecordList', $scope.storesforapicalls);
        $rootScope.$emit('getstorerecordsalestable', $scope.storesforapicalls);


       if($scope.role=="cpg"){
      $scope.topProductsFunctionByAllRetailerforcpg();
      $scope.shareOfCategoryByAllRetailersBystore();
      $scope.ShareOfBasketByAllRetailerBystore();
      }
      else{
       $scope.ProductsBarchartforComparetime();
      $scope.avgBasketFunction();
      $scope.ShoppingTripsFunction();
      
      }
       }
       else{

        $scope.storesforapicalls=[];
        for(var i=0;i<$scope.stores.length;i++){
       $scope.storesforapicalls.push($scope.stores[i]);
        }
       
       var storeobj={
        "storeid":$scope.storesforapicalls
       }

        $rootScope.$emit('getstorerecordList', $scope.storesforapicalls);
        $rootScope.$emit('getstorerecordsalestable', $scope.storesforapicalls);


       if($scope.role=="cpg"){
        $scope.getcoupondetails();
     // $scope.topProductsFunctionByAllRetailerforcpg();
      //$scope.shareOfCategoryByAllRetailers();
      //$scope.ShareOfBasketByAllRetailer();
      }
      else{
       //$scope.ProductsBarchartforComparetime();
      //$scope.avgBasketFunction();
      //$scope.ShoppingTripsFunction();
      
      }
       }

      }


      $scope.init=function(){

        $scope.role=sessionStorage.role;
        if($scope.role=="cpg"){
          $scope.getcoupondetails();
        }                   
        else if($scope.role=="retailer"){
          $scope.getcoupondetailsofRetailer();
        }
      }

      $scope.init();

}]);