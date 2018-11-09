'use strict';

angular.module('header.controllers', [])
/**
 * @ngdoc controller
 * @name DashBoardModule.dashBoardController
 * @requires $scope
 * @requires $state
 * @requires dashBoard.serviceFactory
 * @description
 * dashBoard performs the authentication with help of Service and broadcasts the events to other modules
 *
 * */

 .controller('headerCtrl', ['$scope', '$state','$http','dashBoardService','productService',
   function ($scope, $state,  $http,dashBoardService,productService) {

 if (sessionStorage.user == undefined || sessionStorage.user == null) {
      $state.go('login');
    }
     $scope.role=sessionStorage.role;
     //console.log("role...",$scope.role);
     $scope.logopath=sessionStorage.logopath;
     /*$scope.imagepaths={
    "dashBoard": {FirstName: "first1", LastName: "last1"}
    "key2": {FirstName: "first2", LastName: "last2"}
    "key3": {FirstName: "first3", LastName: "last3"}
     }*/
     $scope.usertype = sessionStorage.setUserType;
    // console.log(" $scope.usertype",  sessionStorage.setUserType);
     $scope.dashabord="images/icon-dashboard-off.png";
     $scope.coupon="images/icon-coupon-off.png";
     $scope.campaign="images/icon-campaign-off.png";
     $scope.products="images/icon-products-off.png";
     $scope.sales="images/icon-salesregion-off.png";
     $scope.admin="images/icon-retailcenter-off.png";
     //console.log("logo path...",$scope.logopath);
     $scope.getActiveNavClass = function (url) {
      //console.log('checkUrl',$state.current.url);
      if($state.current.url=="/dashBoard"){
        $scope.dashabord="images/icon-dashboard-on.png";
      }
      else if($state.current.url=="/allproducts"||$state.current.url=="/Department"||$state.current.url=="/Product-detail"){
       $scope.products="images/icon-products-on.png";
      }
      else if($state.current.url=="/couponactiveList"||
        $state.current.url=="/couponPastList"||
        $state.current.url=="/coupon"||
        $state.current.url=="/couponUpcomingList"||
        $state.current.url=="/couponreports/:id"||
        $state.current.url=="/savecoupon"){
        $scope.coupon="images/icon-coupon-on.png";
      }
      else if($state.current.url=="/Campaigns"||
        $state.current.url=="/campaignList/:id"||
        $state.current.url=="/campaignStart"||
        $state.current.url=="/SaveCampaigns/:id"||
        $state.current.url=="/campaignUpdate"||
        $state.current.url=="/CampaignLaunchDetails/:id"||
        $state.current.url=="/CampaignLaunch"||
        $state.current.url=="/campaignListActive"||
        $state.current.url=="/campaignListArchive"||
        $state.current.url=="/campaignListPending"||
        $state.current.url=="/CampaignLaunch-active/:id"||
        $state.current.url=="/CampaignLaunch-archieved/:id"||
        $state.current.url=="/sendinvite/:id"){
        $scope.campaign="images/icon-campaign-on.png";
      }
       else if($state.current.url=="/manageUsers"){
        $scope.admin="images/icon-retailcenter-on.png";
      }
      else if($state.current.url=="/SalesRegions"||$state.current.url=="/storeComparision"){
        $scope.sales="images/icon-salesregion-on.png";
      }
      return ($state.current.url === url) ? 'active-menu' : '';
    }

     $scope.login=function () {
     //console.log("this function calling....????");
     //dashBoardService.setdashboardcacheStaus(false);
       dashBoardService.destroyCache();
       sessionStorage.clear();
       dashBoardService.setstoreid("");
       productService.setdeptDetail("");
       dashBoardService.saveselectedBrand(null);
         dashBoardService.saveselectedDMA(null);
         dashBoardService.setcomparestartdate(undefined);
          dashBoardService.settimeperiodlabel(undefined);
       $state.go('login');
     }

  }]);
