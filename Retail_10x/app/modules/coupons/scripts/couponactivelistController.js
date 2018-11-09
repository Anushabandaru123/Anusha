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
angular.module('couponListCtrl.controllers', [])


  .controller('couponListCtrl', ['$scope', '$state', 'serviceFactory', 'dashBoardService', 'couponService', '$filter', '$stateParams', 'usSpinnerService', 'productService', '$timeout','$rootScope',
    function ($scope, $state, serviceFactory, dashBoardService, couponService, $filter, $stateParams, usSpinnerService, productService, $timeout,$rootScope) {


      if (sessionStorage.user == undefined || sessionStorage.user == null || sessionStorage.user == "null") {
        $state.go('login');
      }

        $scope.currentstate=$state.current.name;

        //console.log("current state...",$scope.currentstate);

         if($scope.currentstate=="couponUpcomingList"){
          $scope.coupon_status="Pending";
            sessionStorage.couponStatus="Pending";
         }
         else if($scope.currentstate=="couponactiveList"){
          $scope.coupon_status="Active";
                sessionStorage.couponStatus="Active";
         }
         else if($scope.currentstate=="couponPastList"){
           $scope.coupon_status="Archive";
           sessionStorage.couponStatus="Archived";

         }

      $scope.List = [];
      
      $scope.idchart =dashBoardService.generateguid();

      if($scope.currentstate!="couponUpcomingList"){
          $scope.couponrecords= [
      /*{
         "couponName": "Nutella",
         "sdate": "07/07/2017",
         "edate": "09/07/2017",
         "CouponRatio": 18,
         "total": 305,
         "description":"Nutella Hazelnut Spread",
         "id":$scope.idchart
       },
       {
         "couponName": "Tic Tac Campaign",
         "sdate": "2/25/2017",
         "edate": "3/15/2017",
         "CouponRatio": 2,
         "total": 742.57,
         "description":"Tic Tac Big Pack Freshmint"
       }*/
         ];
      }

       $scope.getCouponListofRetailer=function(){
         couponService.couponListofRetailer().then(function(response){
        //console.log("response...",response);
        $scope.couponrecords=[];
        for(var i=0;i<response.data.length;i++){
            $scope.couponstartDate=moment(response.data[i].start_date).format("MM/DD/YYYY");
            $scope.couponExpirations=response.data[i].coupon_expiration;
            if($scope.couponExpirations[0].date){
              $scope.couponendate=moment($scope.couponExpirations[0].date).format("MM/DD/YYYY")
            }
            $scope.couponDiscount=response.data[i].coupon_discount[0];
            $scope.productListforCoupon=response.data[i].products;
            $scope.productsforCoupon=[];
            for(var k=0;k<$scope.productListforCoupon.length;k++){
                $scope.arrayofproducts=$scope.productListforCoupon[k].split("|");
                $scope.productaftersplitting=$scope.arrayofproducts[1];
                $scope.productsforCoupon.push($scope.productaftersplitting);
              }
           
              $scope.retailerList=response.data[i].retailers;
              $scope.retailerListforcoupon=[];

              for(var k=0;k<$scope.retailerList.length;k++){
                $scope.retailer=$scope.retailerList[k].split("|");
                 $scope.retailerListforcoupon.push($scope.retailer[0]);
              }
           var couponstartDate=moment(response.data[i].start_date).format("YYYY-MM-DD");
           var couponendDate=moment(response.data[i].date).format("YYYY-MM-DD");
          // console.log("coupon start date...",couponstartDate);
              var comparetimestartdate;
              var comparetimeendDate;
        comparetimeendDate=moment(couponstartDate).subtract(1,'days').format("YYYY-MM-DD");
              var apienddate= moment(couponendDate).format("YYYYMMDD");
              var apistartdate= moment(couponstartDate).format("YYYYMMDD");
              var enddate=moment();
              if(response.data[i].status=='Active'){
               apienddate= moment(enddate).subtract(1,'days').format("YYYYMMDD");
              }

              if(response.data[i].status=='Archived'){
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
              var date = new Date(response.data[i].start_date);
              $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();
              var endDate = new Date(response.data[i].end_date);
              $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getUTCDate()+'/'+endDate.getFullYear();
              $scope.idchart =dashBoardService.generateguid();

           
           var couponObject={
            "couponName":response.data[i].coupon_title,
            "couponId":response.data[i].coupon_id,
            "status":response.data[i].status,
            "imagePath":response.data[i].image_path,
            "terms":response.data[i].terms,
            "sdate":$scope.couponstartDate,
            "edate":$scope.couponendate,
            "dicount":$scope.couponDiscount,
            "coupon_expiration":response.data[i].coupon_expiration,
            "couponStatus":response.data[i].coupon_status,
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
            "total": 0,
            "index":0.00,
            "comparestartDate":$scope.salesDataComparetimestartdate,
            "compareendDate":$scope.salesDataComparetimeenddate,
            "reportstartDate":$scope.salesDataReporttimestartdate,
            "reportendDate":$scope.salesDataReporttimeenddate,
            "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
            "salesDatareporttime":$scope.salesDataapiReporttimestartdate,
            "campaignRatio":0,
            "campaignRatioStatus":"",
            "showchart":true
           }

           if($scope.coupon_status=="Pending"){
            if(couponObject.couponStatus=="3"||response.data[i].provider_type=="retailer"){
              $scope.couponrecords.push(couponObject);
            }
           }
           else{
           $scope.couponrecords.push(couponObject);
           }
            }
           console.log("coupon records...",$scope.couponrecords);
          $scope.len=$scope.couponrecords.length;
        },function(response){
           console.log("error msg..",response);
        });
      }

        $scope.getCouponList=function(){
         couponService.couponList().then(function(response){
        $scope.couponrecords=[];
        for(var i=0;i<response.data.length;i++){
        $scope.couponstartDate=moment(response.data[i].start_date).format("MM/DD/YYYY");
        $scope.couponExpirations=response.data[i].coupon_expiration;
        if($scope.couponExpirations[0].date){
        $scope.couponendate=moment($scope.couponExpirations[0].date).format("MM/DD/YYYY")
        }
        $scope.couponDiscount=response.data[i].coupon_discount[0];
        $scope.productListforCoupon=response.data[i].products;
        $scope.productsforCoupon=[];
        for(var k=0;k<$scope.productListforCoupon.length;k++){
        $scope.arrayofproducts=$scope.productListforCoupon[k].split("|");
        $scope.productaftersplitting=$scope.arrayofproducts[1];
        $scope.productsforCoupon.push($scope.productaftersplitting);
        }
        $scope.retailerList=response.data[i].retailers;
        $scope.retailerListforcoupon=[];
        for(var k=0;k<$scope.retailerList.length;k++){
        $scope.retailer=$scope.retailerList[k].split("|");
        $scope.retailerListforcoupon.push($scope.retailer[0]);
        }
        var couponstartDate=moment(response.data[i].start_date).format("YYYY-MM-DD");
        var couponendDate=moment(response.data[i].date).format("YYYY-MM-DD");
        var comparetimestartdate;
        var comparetimeendDate;
        comparetimeendDate=moment(couponstartDate).subtract(1,'days').format("YYYY-MM-DD");
        var apienddate= moment(couponendDate).format("YYYYMMDD");
        var apistartdate= moment(couponstartDate).format("YYYYMMDD");
        var enddate=moment();
        if(response.data[i].status=='Active'){
        apienddate= moment(enddate).subtract(1,'days').format("YYYYMMDD");
        }
        if(response.data[i].status=='Archived'){
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
              var date = new Date(response.data[i].start_date);
              $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();
              var endDate = new Date(response.data[i].end_date);
              $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getUTCDate()+'/'+endDate.getFullYear();
              $scope.idchart =dashBoardService.generateguid();
           var couponObject={
            "couponName":response.data[i].coupon_title,
            "couponId":response.data[i].coupon_id,
            "status":response.data[i].status,
            "imagePath":response.data[i].image_path,
            "terms":response.data[i].terms,
            "sdate":$scope.couponstartDate,
            "edate":$scope.couponendate,
            "dicount":$scope.couponDiscount,
            "coupon_expiration":response.data[i].coupon_expiration,
            "couponStatus":response.data[i].coupon_status,
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
            "total": 0,
            "index":0.00,
            "comparestartDate":$scope.salesDataComparetimestartdate,
            "compareendDate":$scope.salesDataComparetimeenddate,
            "reportstartDate":$scope.salesDataReporttimestartdate,
            "reportendDate":$scope.salesDataReporttimeenddate,
            "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
            "salesDatareporttime":$scope.salesDataapiReporttimestartdate,
            "campaignRatio":0,
            "campaignRatioStatus":"",
            "showchart":true
           }
         if($scope.coupon_status=="Pending"){
         if(couponObject.couponStatus=="3"||response.data[i].provider_type=="cpg"){
            $scope.couponrecords.push(couponObject);
           }
           }
           else{
           $scope.couponrecords.push(couponObject);
           }
            }
             $scope.len=$scope.couponrecords.length;
        },function(response){
           console.log("error msg..",response);
        });
      }
      var destroyFoo;
      destroyFoo=   $rootScope.$on('campaignSales', function (event, data) {
            //console.log("data coming...",data);
       for(var i=0;i<$scope.couponrecords.length;i++){
        if($scope.couponrecords[i].couponId==data.couponId){
                $scope.couponrecords[i].datachart=data.chartData;
                $scope.couponrecords[i].index=data.index;
                $scope.couponrecords[i].total=data.total;
                $scope.couponrecords[i].showchart=data.showchart;
        }
       }
      });
      var campaignRatio;
      campaignRatio=   $rootScope.$on('campaignRatio', function (event, data) {
       for(var i=0;i<$scope.couponrecords.length;i++){
        if($scope.couponrecords[i].couponId==data.couponId){
           $scope.couponrecords[i].campaignRatio=data.ratio;
           $scope.couponrecords[i].campaignRatioStatus=data.status;
        }
       }
      });
      $scope.postcoupon=function(item){
         if($scope.role=="cpg"||$scope.role=="retailer"){
            $scope.selectedretailers=[];
         for(var k=0;k<item.retailerList.length;k++){
            $scope.retailer=item.retailerList[k].split("|");
            var storedata = {
                "id": $scope.retailer[0],
                "retailerName": $scope.retailer[1]
                }
            $scope.selectedretailers.push(storedata);
            }
            var startDate=moment(item.StartDate).format("MM/DD/YYYY");
            $scope.selectedProductarray=[];
            for(var i=0;i<item.ProductList.length;i++){
              var productParts=item.ProductList[i].split("|");
              var dataproduct = {
              "id": productParts[1],
              "Name": productParts[0],
              "price": "13 OZ",
              "size":"13 OZ"
            }
            $scope.selectedProductarray.push(dataproduct);
              }
          $scope.couponDiscount=[];
          $scope.couponDiscount.push(item.dicount);
          if(item.coupon_expiration[0].expiration_id==1){
          item.coupon_expiration[0].date=moment(item.coupon_expiration[0].date).format("MM/DD/YYYY");
          }
         $scope.CouponObjectdata={
          "provider_type":sessionStorage.role,
          "provider_name":sessionStorage.username, 
          "provider_id": parseInt(sessionStorage.user),
          "couponId": item.couponId,
          "selectedretailer":$scope.selectedretailers,
          "terms":item.terms,
          "image":item.imagePath,
          "startdate":startDate,
          "productname": $scope.selectedProductarray, 
          "coupon_discount":$scope.couponDiscount,
          "coupon_expiration":item.coupon_expiration,
       };
       couponService.setcoupon($scope.CouponObjectdata);
      $state.go('savecoupon',{id:item.couponId});
      }
    }
      $scope.CouponDetailBeforeLaunch=function(listItem){
       $state.go('couponReports',{id:listItem.couponId});
      }
      $scope.init=function(){
        $scope.role=sessionStorage.role;
        if($scope.role=="cpg"){
          $scope.getCouponList();
        }                   
        else if($scope.role=="retailer"){
          $scope.getCouponListofRetailer();
        }
      }
      $scope.init();

 }]);