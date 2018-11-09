
'use strict';

angular.module('campaign.service', ['shared.serviceFactory'])
  .service('campaignService', ['$http', 'serviceFactory','$q', function ($http, serviceFactory,$q) {

var self = this;
var campaignObject=null;

var campaignMode="create";

   self.updatecampaignMode=function(value){
     campaignMode=value;
   }

   self.getcampaignMode=function(){
    return campaignMode;
   }


  self.setcampaign = function(data){
      campaignObject = data;
    }

    self.getcampaign = function(){
     return campaignObject ;
    }


   
self.getCampignLinechartData = function() {
  var deferred = $q.defer();
  deferred.resolve(campignLinechartData);
  return deferred.promise;
}


    self.getitemLocations = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('itemLocations', 'GET');


      return $http(request);
    };

    self.CreateCampaign = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('createCampaign', 'POST', data);

      return $http(request);
    };

     self.CreateCampaignwithNewUrl = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('createCampaignNew', 'POST', data);

      return $http(request);
    };

     self.UpdateCampaignwithNewUrl = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('updateCampaignNew', 'POST', data);

      return $http(request);
    };

    self.RetailercampaignList = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('RetailercampaignList', 'GET');


      return $http(request);
    };


    self.GetTopTenProducts = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('TopTenProducts', 'POST', data);

      return $http(request);
    };

    self.UpdateCampaign = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('updateCampaign', 'POST', data);

      return $http(request);
    };

    self.deleteCampaign = function () {
      var request;
      if (self)
        request = serviceFactory.getPacket('deleteCampaign', 'DELETE');

      return $http(request);
    };

     self.deleteCampaignFile = function () {
      var request;
      if (self)
        request = serviceFactory.getPacket('deleteCampaignFile', 'DELETE');

      return $http(request);
    };

    

    self.GetProductSuggested = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('productsSuggested', 'GET');

      return $http(request);
    };

    

self.savecampaignrecord=function(data){
  self.campaignrecord=data;
}

self.getcampaignrecord=function(){
  return self.campaignrecord;
}

    self.Regiterdata = function(data){

      self.RegiterdDataDetails = data;

    };


    self.updateRegiterdata = function (data) {


      self.RegiterdupdateDetails = data;

    }

    self.getCampainupdateDetails=function() {

      return self.RegiterdupdateDetails;

    }

    self.getCampaignDetails=function() {

      return self.RegiterdDataDetails;

    }


    self.CpgcampaignList = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('cpgcampaignList', 'GET');


      return $http(request);
    };


    self.getCampaignDetails = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getCampaignDetails', 'GET');


      return $http(request);
    };

     self.getCampaignDetailsforCPG = function () {
      var request;
      if (self)
      request = serviceFactory.getPacket('getCampaignDetailsforCPG', 'GET');
      return $http(request);
    };

    self.getCampaignDetailsforDistributor = function () {
      var request;
      if (self)
      request = serviceFactory.getPacket('campaignDetailsforDistributor', 'GET');
      return $http(request);
    };

    self.selectedcampaign = function () {
      var request;
      if (self)
      request = serviceFactory.getPacket('selectedcampaign', 'GET');
      return $http(request);
    };

     self.selectedcampaignforCPG = function () {
      var request;
      if (self)
      request = serviceFactory.getPacket('selectedcampaignforcpg', 'GET');
      return $http(request);
    };

    self.getPromotionTypes = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getPromotionTypes', 'GET');


      return $http(request);
    };

    self.grant = function (data) {

      var request;
      if (self)
    request = serviceFactory.getPacket('grant', 'POST',data);


      return $http(request);
    };

    self.sendEmail = function (data) {

      var request;
      if (self)
    request = serviceFactory.getPacket('sendEmail', 'POST',data);

      return $http(request);
    };

    


 self.addCampaignFile = function (data) {

      var request;
      if (self)
    request = serviceFactory.getPacket('addCampaignFile', 'POST',data);

      return $http(request);
    };

    

      
   self.updateCampaignStatus = function (data) {

      var request;
      if (self)
      request = serviceFactory.getPacket('updateCampaignStatus', 'POST',data);

      return $http(request);
    };


}]);
