'use strict';
angular.module('coupon.service', ['shared.serviceFactory'])
  .service('couponService', ['$http', 'serviceFactory', '$q','CacheFactory', function ($http, serviceFactory, $q,CacheFactory) {
 

var self = this;
var couponObject=null;
var EditcouponObject=null;
// var EditListObject=null;
var couponMode="create";

   self.updatecouponMode=function(value){
     couponMode=value;
   }

 self.getcouponMode=function(){
    return couponMode;
   }



self.setcoupon = function(data){
      couponObject = data;
    }

self.getcoupon = function(){
     return couponObject ;
    }

self.setEditcoupon = function(data){
      EditcouponObject = data;
    }  

self.getEditcoupon = function(data){
     return EditcouponObject ;
    }         

// self.setcouponlistData = function(data){
//       EditListObject = data;
//     }  

// self.getcouponlistData = function(data){
//      return EditListObject ;
//     }   

self.GetCouponSuggested = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('productsSuggestedforcpg', 'GET');

      return $http(request);
    };

    self.GetProductSuggestedforRetailer = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('productsSuggested', 'GET');

      return $http(request);
    };


self.getitemLocations = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('itemLocations', 'GET');


      return $http(request);
    };


self.getCouponDiscountTypes = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getCouponDiscountTypes', 'GET');


      return $http(request);
    };
    

self.getCouponExpirationTypeDetails = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getCouponExpirationTypeDetails', 'GET');


      return $http(request);
    };


 

    self.createCouponApi = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('createCoupon', 'POST', data);

      return $http(request);
    };
     

     self.updateCoupon = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('updateCoupon', 'POST', data);

      return $http(request);
    };

    self.couponList = function () {
     
      var request;
      if (self)
        request = serviceFactory.getPacket('couponList', 'GET');

      return $http(request);
    };

    self.couponListofRetailer = function () {
     
      var request;
      if (self)
        request = serviceFactory.getPacket('retailercouponList', 'GET');

      return $http(request);
    };

    self.couponDetails = function () {
     
      var request;
      if (self)
        request = serviceFactory.getPacket('coupondetails', 'GET');

      return $http(request);
    };

     self.Deletecoupon= function () {
     
      var request;
      if (self)
        request = serviceFactory.getPacket('deleteCoupon', 'DELETE');

      return $http(request);
    };


    self.couponDetailsofRetailer = function () {
     
      var request;
      if (self)
        request = serviceFactory.getPacket('retailercoupondetails', 'GET');

      return $http(request);
    };

    


self.updateCouponStatus = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('updateCouponStatus', 'POST', data);

      return $http(request);
    };

     self.getRetailersByUpc = function () {
     
      var request;
      if (self)
        request = serviceFactory.getPacket('getRetailersBaseonUPC', 'GET');

      return $http(request);
    };
    

 }]);