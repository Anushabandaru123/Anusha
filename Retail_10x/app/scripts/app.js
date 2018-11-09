'use strict';

/**
 * @ngdoc overview
 * @name retail10xApp
 * @description
 * # retail10xApp
 *
 * Main module of the application.
 */
angular
  .module('retail10xApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.router',
    'ngAria',
    'ngMessages',
    'localisationModule',
    'shared.serviceFactory',
    'shared.services',
    'dashBoardModule',
    'loginModule',
    'productModule',
    'campaignModule',
    'Retails.barchartDirective',
    'Retails.piechartDirective',
    'Retails.campiagnbarcharts',
    'Retails.topSalesResion',
    'Retails.topStores',
    'salesRegionModule',
    'Retails.topdepartments',
    'Retails.mapchart',
    'Retails.topproducts',
    'Retails.salesperformance',
    'Retails.campignTable',
    'angularSpinner',
    'angular-cache',
    'Retails.singelstoreDirective',
    'cpg.dropdown',
    'Retails.productcompare',
    'Campaigns.salesperformance',
    'Retails.topregionbarchart',
    'Retails.salesregionmapDirective',
    'Retails.storecomparision',
    'ngIdle',
   // 'Retails.manfacturer',
    'Retails.categories',
    'department.controllers',
    'Retails.departmentsDirective',
    'Retails.departmentsdonutchartDirective',
    'Retails.manufacturedonutchartDirective',
    'manufacturerDetail .controllers',
    'Retails.manfacturerDirective',
    'Retails.allproductsDirective',
    'Retails.worstsellers',
    'Retails.topsalesregionbarchart',
    'Retails.topstoresbarchart',
    'Retails.departmentspiechartDirective',
    'Retails.alldepartmentsDirective',
    'Retails.categoriesunderdepartment',
    'Retails.categoriespiechartDirective',
    'Retails.manufacturerpiechartDirective',
    'Retails.manufacturersundercategories',
    'Retails.fileuploadDirective',
    'pubnub.angular.service',
    'Retails.chatService',
    'Retails.campiagnsaleschart',
    'Retails.campiagnahoppingtripschart',
    'Retails.campiagnbasketchart',
    'Retails.Couponbarcharts',
    'couponModule',
    'Retails.couponfileuploadDirective',
    'Retails.couponTable',
    'Coupons.salesperformance',
    'Retails.couponshoppingtripschart',
    'Retails.couponbasketchart',
    'Retails.couponsaleschart',
    'cpg.productdropdown',
    'Retails.multiselect-dropdown',
    'adminModule',
    'Retails.ngEnter'
  
  ])

  .config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
  IdleProvider.idle(900);
  IdleProvider.timeout(10);
  KeepaliveProvider.interval(10);



}])
  .run(['Idle','$http', function(Idle,$http) {
  Idle.watch();

 // $http.defaults.headers.common.Authorization =sessionStorage.token;

}])

  .config(function ($stateProvider, $urlRouterProvider,CacheFactoryProvider) {

       $stateProvider


      .state('manageUsers', {
        url: '/manageUsers',
        templateUrl: 'modules/admin/views/manageUsers.html'
     //templateUrl: 'modules/campaign/views/campaigns.html'
      })



      .state('Campaigns', {
        url: '/Campaigns',
        templateUrl: 'modules/campaign/views/campaignsnew.html'
     //templateUrl: 'modules/campaign/views/campaigns.html'
      })


      .state('SaveCampaigns', {
        url: '/SaveCampaigns/:id',
        templateUrl: 'modules/campaign/views/savecampaign.html'
      //  templateUrl: 'modules/campaign/views/campaign-details.html'
      })


       .state('sendinvite', {
        url: '/sendinvite/:id',
        templateUrl: 'modules/campaign/views/sendinvite.html'
      //  templateUrl: 'modules/campaign/views/campaign-details.html'
      })
  


      .state('CampaignsDetails', {
        url: '/CampaignsDetails',
        templateUrl: 'modules/campaign/views/campaign-details.html'
      })


      .state('products', {
        url: '/products',
        templateUrl: 'modules/products/views/product.html'
      })
      .state('allproducts', {
        url: '/allproducts',
        templateUrl: 'modules/products/views/allproducts.html'
      })

      .state('Brands', {
        url: '/Brands',
        templateUrl: 'views/Brands.html'
      })
      .state('SalesRegions', {
        url: '/SalesRegions',
        params : { id: null, storedata:null},
        templateUrl: 'modules/salesregions/views/salesRegions.html'
      })
      .state('ShareOfBasket', {
        url: '/ShareOfBasket',
        templateUrl: 'views/ShareOfBasket.html'
         // templateUrl: 'modules/campaign/views/northgatePresentation.html'
      })

      .state('individualDepartment', {
        url: '/Department',
        templateUrl: 'modules/products/views/individualdept.html'
      })

      .state('campaignListActive', {
        url: '/campaignListActive',
        params : { status:null},
        templateUrl: 'modules/campaign/views/campaignsList.html'
      })


      .state('campaignListArchive', {
        url: '/campaignListArchive',
        params : { status:null},
        templateUrl: 'modules/campaign/views/campaignArchiveList.html'
      })


      .state('campaignListPending', {
        url: '/campaignListPending',
        params : { status:null},
        templateUrl: 'modules/campaign/views/campaignPendingList.html'
      })

      .state('campaignStart', {
        url: '/campaignStart',
        templateUrl: 'modules/campaign/views/campaignstart.html'
      })

      .state('campaignUpdate', {
        url: '/campaignUpdate',
        templateUrl: 'modules/campaign/views/updatecampaign.html'
      })

      .state('CampaignLaunchDetails', {
        url: '/CampaignLaunchDetails/:id',
        templateUrl: 'modules/campaign/views/campaignDetailBeforeLaunch.html'
      })

      .state('CampaignLaunch-active', {
        url: '/CampaignLaunch-active/:id',

        templateUrl: 'modules/campaign/views/northgatePresentation.html'
      })

      .state('CampaignLaunch-archieved', {
        url: '/CampaignLaunch-archieved/:id',
        templateUrl: 'modules/campaign/views/campagnDetailArchive.html'
      })

       .state('storeComparision', {
        url: '/storeComparision',
        params :  { id: null, storedata:null},
        templateUrl: 'modules/salesregions/views/storeComparisionScreen.html'
      })

        .state('manufacturer', {
        url: '/manufacturer',
        templateUrl: 'modules/products/views/manufacturer.html'
      })

      .state('categories', {
        url: '/categories',
        templateUrl: 'modules/products/views/categoriesproductItem.html'
      })

     .state('departments', {
        url: '/departments',
        templateUrl: 'modules/products/views/departments.html'
      })


      .state('manufacturerDetails', {
        url: '/manufacturerDetails',
        templateUrl: 'modules/products/views/manufacturedetailscreen.html'
      })

      .state('products-department', {
        url: '/products-department',
        templateUrl: 'modules/products/views/productunderDepartment.html'
      })

      .state('products-print', {
        url: '/products-print',
        templateUrl: 'modules/products/views/allproductprint.html'
      })

      .state('individualPrdct-print', {
      url: '/individualPrdct-print',
      templateUrl: 'modules/products/views/individualPrdctprint.html'
      })

      .state('Product-detail', {
      url: '/Product-detail',
      templateUrl: 'modules/products/views/productdetail.html'
      })



      .state('coupon', {
      url: '/coupon',
      templateUrl: 'modules/coupons/views/coupon.html'
      })
       
       .state('savecoupon', {
      url: '/savecoupon',
      templateUrl: 'modules/coupons/views/savecoupon.html'
      })

       .state('couponactiveList', {
      url: '/couponactiveList',
      templateUrl: 'modules/coupons/views/couponactiveList.html'
      })
      
      .state('couponPastList', {
      url: '/couponPastList',
      templateUrl: 'modules/coupons/views/couponPastList.html'
      })

      .state('couponUpcomingList', {
      url: '/couponUpcomingList',
      templateUrl: 'modules/coupons/views/couponUpcomingList.html'
      })

      .state('couponReports', {
      url: '/couponreports/:id',
      templateUrl: 'modules/coupons/views/couponactiveDetail.html'
      })





      $urlRouterProvider.otherwise('/login');


  });
