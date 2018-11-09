'use strict';
angular.module('admin.service', ['shared.serviceFactory'])
  .service('adminService', ['$http', 'serviceFactory', '$q','CacheFactory', function ($http, serviceFactory, $q,CacheFactory) {
 
var self = this;
 
 self.getManageUserforRetailer = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getManageUserforRetailer', 'GET');


      return $http(request);
    };

  self.getManageUserforCPG = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getManageUserforCPG', 'GET');


      return $http(request);
    };
    
  self.getManageUserforDistributor = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getManageUserforDistributor', 'GET');


      return $http(request);
    };    

  self.GetcategoriesList = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetcategoriesList', 'GET');


      return $http(request);
    };   

    self.GetcategoriesListforCPG = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetcategoriesListforcpg', 'GET');


      return $http(request);
    };   

    self.GetcategoriesListforDistributor = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getcategoriesByDistributor', 'GET');


      return $http(request);
    };   

  self.updateLogin = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('updateLogin', 'POST', data);

      return $http(request);
    };
  



}]);