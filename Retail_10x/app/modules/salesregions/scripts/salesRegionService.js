'use strict';

angular.module('salesRegion.service', ['shared.serviceFactory'])
  .service('salesRegionService', ['$http', 'serviceFactory', '$q', function ($http, serviceFactory, $q) {

    var self = this;
    var state = null;
    var role = null;
    var doctorId = null;

    self.selectedsalesregion=null;
    self.regiondata=null;

    self.setregiondata=function(data){
      self.regiondata=data
    }

    self.getregiondata=function(){
      return self.regiondata;
    }

    self.setselectedsalesregion=function(value){
        self.selectedsalesregion=value;
    }

    self.getselectedsalesregion=function(){
      return self.selectedsalesregion;
    }

    
    self.GetSalesPerformance = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesPerformance', 'POST', data);

      return $http(request);
    };

    self.GetSalesPerformanceByStoreId = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesPerformanceByStoreId', 'POST', data);

      return $http(request);
    };


    self.report_basket_count = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('report_basket_count', 'POST', data);
      console.log(request);
      return $http(request);
    }


    self.getMapChartData1 = function () {
      var deferred = $q.defer();

      deferred.resolve(dataProvider);

      return deferred.promise;
    }

    self.getMapData1 = function () {
      var deferred = $q.defer();

      deferred.resolve(googleMapData);

      return deferred.promise;
    }


    self.getLineChart1Data = function () {
      var deferred = $q.defer();

      deferred.resolve(chartData1);

      return deferred.promise;
    }

    self.getLineChart2Data = function () {
      var deferred = $q.defer();

      deferred.resolve(chartData2);

      return deferred.promise;
    }


    self.getLineChart3Data = function () {
      var deferred = $q.defer();

      deferred.resolve(chartData3);

      return deferred.promise;
    }


    self.getPieChartData = function () {
      var deferred = $q.defer();

      deferred.resolve(amchartDataForPieChart);

      return deferred.promise;
    }


    self.getSerialChartData = function () {
      var deferred = $q.defer();

      deferred.resolve(SerialChartData);

      return deferred.promise;
    }


    self.getLineChart1Data = function () {
      return chartData1;
    }


    self.getLineChart2Data = function () {
      return chartData2;
    }


    self.getLineChart3Data = function () {
      return chartData3;
    }


    self.getMapChartData = function () {
      return dataProvider;
    }


    return self;


  }]);
