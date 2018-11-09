'use strict';
angular.module('login.service', ['shared.serviceFactory'])
  .service('loginService', ['$http', 'serviceFactory', function ($http, serviceFactory) {

    var self = this;
    self.timeout = 30000;
    var state = null;
    var role = null;

  self.loginUrl = "http://retail10xcardenaspr-env.us-west-2.elasticbeanstalk.com/"+'login',



      console.log("service is loaded...",sessionStorage.username);

    self.Authenticate = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;


 /*request = {
          method: 'POST',
          url: self.loginUrl,
          data: data,
          timeout: self.timeout,


            headers: { "Content-Type": "application/json",

             authToken: sessionStorage.token }

          ,
          cache: true
        };*/

      if (self)
        request = serviceFactory.getPacket('authenticate', 'POST', data);

      return $http(request);
    };


    self.Logout = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('logout', 'POST', data);

      return $http(request);
    };

    self.refreshtoken = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('TokenRefresh', 'POST', data);

      return $http(request);
    };


    return self;


  }]);
