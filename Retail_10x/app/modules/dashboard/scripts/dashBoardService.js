'use strict';
angular.module('dashBoard.service', ['shared.serviceFactory'])
  .service('dashBoardService', ['$http', 'serviceFactory', '$q','CacheFactory', function ($http, serviceFactory, $q,CacheFactory) {


    /**
     * @ngdoc service
     * @name DashBoardModule.dashBoardService
     * @requires $http
     * @requires dashBoard.serviceFactory
     * @description
     * dashBoardService performs the making the http requests and returns the response back to controller
     *
     * */

    var self = this;
    var state = null;
    var role = null;
    var doctorId = null;
    var reportTime=null;


        var comparestartDate=null;
        var compareenddate=null;
        var reportstartdate=null;
        var reportenddate=null;
        var storeid=null;
        var storeName=null;
        var inputchanged=null;
        self.inputchanged=false;
        self.dashboardcacheStaus=false;
        self.productscacheStatus=false;
        self.salesregioncacheStatus=false;
        self.selectedrecord=null;
        self.topstorecomparisionstatus=false;
        self.maxvalue=0;
        self.storemaxvalue=0;
        self.selectedtimeperiodlabel=null;
        self.paginationindex=null;
        self.donutchartindex=null;
        self.topproductsmaxvalue=0;
        self.worstsellersmaxvalue=0;
        self.salesregionmaxvalue=0;
        self.topstoresmaxvalue=0;
        self.campaignsalesmaxvalue=0;
        self.campaignshoppingtripsmaxvalue=0;
        self.campaignbasketsharemaxvalue=0;
        self.brandIdList=null;
        self.savestoreselected=null;
        self.brandselected=null;
        self.dmaselected=null;

        
        self.saveselectedDMA=function(dma){
          self.dmaselected=dma;
        }

        self.getselectedDMA=function(){
          return self.dmaselected;
        }



        self.saveselectedBrand=function(brand){
          self.brandselected=brand;
        }

        self.getselectedBrand=function(){
          return self.brandselected;
        }
        

        self.setBrandidList=function(list){
          self.brandIdList=list;
        }

        self.getBrandIdList=function(){
          return self.brandIdList;
        }

        self.setcampaignshoppingtripsmaxvalue=function(maxValue){
          self.campaignshoppingtripsmaxvalue=maxValue;
        }

        self.getcampaignshoppingtripsmaxvalue=function(){
          return self.campaignshoppingtripsmaxvalue;
        }


       self.setcampaignbasketsharemaxvalue=function(maxValue){
          self.campaignbasketsharemaxvalue=maxValue;
        }

        self.getcampaignbasketsharemaxvalue=function(){
          return self.campaignbasketsharemaxvalue;
        }


       // console.log("saved value...",self.savestoreselected);

        self.setcampaignsalesmaxvalue=function(maxValue){
          self.campaignsalesmaxvalue=maxValue;
        }

        self.getcampaignsalesmaxvalue=function(){
          return self.campaignsalesmaxvalue;
        }

        
           self.setreportTime=function(value){

                reportTime=value;
             }

             self.getreportTime=function(){
              
               return reportTime;
             }


             self.setsavestoreselected=function(value){

                self.savestoreselected=value;
             }

             self.getsavestoreselected=function(){
               return self.savestoreselected;
             }

         self.settopstoresmaxvalue=function(maxValue){
          self.topstoresmaxvalue=maxValue;
        }

        self.gettopstoresmaxvalue=function(){
          return self.topstoresmaxvalue;
        }


            self.setsalesregionmaxvalue=function(maxValue){
          self.salesregionmaxvalue=maxValue;
        }

        self.getsalesregionmaxvalue=function(){
          return self.salesregionmaxvalue;
        }

        self.setworstsellersmaxvalue=function(maxValue){
          self.worstsellersmaxvalue=maxValue;
        }

        self.getworstsellersmaxvalue=function(){
          return self.worstsellersmaxvalue;
        }

        self.settopproductsmaxvalue=function(maxValue){
          self.topproductsmaxvalue=maxValue;
        }

        self.gettopproductsmaxvalue=function(){
          return self.topproductsmaxvalue;
        }



        self.setdonutchartindex=function(value){
          self.donutchartindex=value;
          //console.log("sdonutchart index...",self.donutchartindex);
        }
        self.getdonutchartindex=function(value){
          return self.donutchartindex;
        }



             self.settimeperiodlabel=function(value){

                self.selectedtimeperiodlabel=value;
             }

             self.gettimeperiodlabel=function(){
               return self.selectedtimeperiodlabel;
             }


             self.setpaginationindex=function(value){

                self.paginationindex=value;
             }

             self.getpaginationindex=function(){
               return self.paginationindex;
             }

        self.setmaxvalue=function(maxValue){
          self.maxvalue=maxValue;
        }

        self.getmaxvalue=function(){
          return self.maxvalue;
        }


        self.setStoremaxvalue=function(storeMaxValue){
          self.storemaxvalue=storeMaxValue;
        }

        self.getStoremaxvalue=function(){
          return self.storemaxvalue;
        }




        self.settopstorecomparisionstatus=function(value){
          self.topstorecomparisionstatus=value;
        }

        self.gettopstorecomparisionstatus=function(){
          return self.topstorecomparisionstatus;
        }



        self.setrecordfromtreedropdown=function(obj){
          self.selectedrecord=obj;
        }

        self.getselectedrecordfromdropdown=function(){
          return self.selectedrecord;
        }


        self.setdashboardcacheStaus=function(status){

          self.dashboardcacheStaus=status;

        }

        self.getdashboardcacheStaus=function(){
          return self.dashboardcacheStaus;
        }


        self.setproductscacheStatus=function(status){

          self.productscacheStatus=status;

        }

        self.getproductscacheStatus=function(){
          return self.productscacheStatus;
        }


        self.setsalesregioncacheStatus=function(status){

          self.salesregioncacheStatus=status;

        }

        self.getsalesregioncacheStatus=function(){
          return self.salesregioncacheStatus;
        }







        if (!CacheFactory.get('bookCache')) {
        // or CacheFactory('bookCache', { ... });
        CacheFactory.createCache('bookCache', {
          deleteOnExpire: 'aggressive',
          recycleFreq: 60000
        });
      }



      var dashBoardCache;
      var  productsCache;

      self.createcache=function(){
        if (!CacheFactory.get('dashBoardCache')) {
       dashBoardCache = CacheFactory('dashBoardCache', {
         maxAge: 30 * 60 * 1000,
         deleteOnExpire: 'aggressive',
          onExpire: function (){
            if (CacheFactory.get('dashBoardCache')) {
              dashBoardCache.destroy();
            //  self.setstatus(false);
            }
          }
       });
           }
      }


      self.createproductscache=function(){
        if (!CacheFactory.get('productsCache')) {
       productsCache = CacheFactory('productsCache', {
         maxAge: 30* 60 * 1000,
         deleteOnExpire: 'aggressive',
         onExpire: function (){
           if (CacheFactory.get('productsCache')) {
             productsCache.destroy();
           }

         }

       });
           }
      }

       // Check to make sure the cache doesn't already exist


       self.setcacheData=function(key,value){
       //  profileCache.remove(key);
         dashBoardCache.put(key,value);
       }

       self.setproductscacheData=function(key,value){
       //  profileCache.remove(key);
         productsCache.put(key,value);
       }




           self.getcachedata=function(){
             return dashBoardCache;
           }


            self.destroyCache=function () {
              self.dashboardcacheStaus=false;
              if (CacheFactory.get('productsCache')) {
                productsCache.destroy();
              }
              if (CacheFactory.get('dashBoardCache')) {
                dashBoardCache.destroy();
                self.setdashboardcacheStaus(false);
                self.setproductscacheStatus(false);
                self.setsalesregioncacheStatus(false);
                 self.dashboardcacheStaus=false;
                 //console.log("destroying is done...");
              }
              //dashBoardCache.destroy();

            }



        //   var info = profileCache.info('/profiles/34');

            // console.log(info.isExpired); // false


             //profileCache.remove('/profiles/34');

        //  console.log(profileCache.get('/profiles/34')); // undefined

           //profileCache.destroy();

           //console.log(CacheFactory.get('profileCache')); // undefined

            //console.log( profileCache.info('/profiles/34'));


              //   console.log(info.isExpired);







        self.setstorename=function(name){
          self.storeName=name;
        }
        self.getstorename=function(){
          return self.storeName;
        }

        self.setstoreid=function(id){
          self.storeid=id;
        }

        self.getstoreid=function(){
           return self.storeid;
        }

        self.setcomparestartdate=function(date){
          self.comparestartDate=date;
        }

        self.getcomparestartdate=function(){

             return self.comparestartDate;
        }

          self.setcompareenddate=function(date){
            self.compareenddate=date;
          }

          self.getcompareenddate=function(){
               return self.compareenddate;
          }

          self.setreportstartdate=function(date){
            self.reportstartdate=date;
          }
          self.getreportstartdate=function(){
            return self.reportstartdate;
          }

          self.setreportenddate=function(date){
            self.reportenddate=date;
          }

          self.getreportenddate=function(){

            return self.reportenddate;
          }

          self.setstoreid=function(id){
            self.storeid=id;
          }
          self.getstoreid=function(){
            return self.storeid;
          }


    self.generateguid = function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    };


    //MAP CHART DATA PROVIDER...
    var dataProvider = {
      dataProvider: {
        map: "usaLow",
        getAreasFromMap: true,
        "images": [
          {
            "type": "circle",
            "width": 40,
            "height": 40,
            "latitude": "71.968599", "longitude": "140.901813",
          },
          {
            "type": "circle",
            "width": 30,
            "height": 30,
            "latitude": "82.968599", "longitude": "145.901813",
          },
          {
            "type": "circle",
            "width": 30,
            "height": 30,
            "latitude": "52.026844", "longitude": "-140.829699",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
          {
            "type": "circle",
            "width": 40,
            "height": 40,
            "latitude": "29.792798", "longitude": "-126.533801",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
          {
            "type": "circle",
            "width": 20,
            "height": 20,
            "latitude": "86.968599", "longitude": "-70.533801",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
          {
            "type": "circle",
            "width": 20,
            "height": 20,
            "latitude": "80", "longitude": "60.533801",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
          {
            "type": "circle",
            "width": 20,
            "height": 20,
            "latitude": "-65.026844", "longitude": "-8.829699",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
          {
            "type": "circle",
            "width": 20,
            "height": 20,
            "latitude": "-75.792798", "longitude": "19.533801",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
          {
            "type": "circle",
            "width": 25,
            "height": 25,
            "latitude": "-82.792798", "longitude": "128.901813",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
          {
            "type": "circle",
            "width": 20,
            "height": 20,
            "latitude": "-80.792798", "longitude": "-130.829699",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
          {
            "type": "circle",
            "width": 25,
            "height": 25,
            "latitude": "-84.792798", "longitude": "-115.829699",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
          {
            "type": "circle",
            "width": 18,
            "height": 18,
            "latitude": "-88.792798", "longitude": "-30.829699",
            // "balloonText":"<span style='font-size:14px;'><b>Some Data</b>: </span>"
          },
        ]
      }
    };


    var googleMapData = {
   dataProvider: {
     map: "usaLow",
     getAreasFromMap: true,
     "markers": [
       {
         "id": "circle",
         "content": 'store 1',
         "value": 7,
         "latitude": "45.236177", "longitude": "-112.870428",
       },
       {
         "id": "circle",
         "content": 'store 2',
         "value": 7,
         "latitude": "42.569222", "longitude": "-87.942449",
       },
       {
         "id": "circle",
         "content": 'store 3',
         "value": 8,
         "latitude": "42.171503", "longitude": "-71.188298",

       },
       {
         "id": "circle",
         "content": 'store 4',
         "value": 12.5,
         "latitude": "40.622248", "longitude": "-74.703923",

       },
       {
         "id": "circle",
         "content": 'store 5',
         "value": 8,
         "latitude": "37.046363", "longitude": "-120.692693",

       },
       {
         "id": "circle",
         "content": 'store 6',
         "value": 12.5,
         "latitude": "34.415926", "longitude": "-118.506414",

       },
       {
         "id": "circle",
         "content": 'store 7',
         "value": 7,
         "latitude": "32.444836", "longitude": "-101.598455",

       },
       {
         "id": "circle",
         "content": 'store 8',
         "value": 7,
         "latitude": "29.850127", "longitude": "-97.072093",

       },
       {
         "id": "circle",
         "content": 'store 9',
         "value": 9,
         "latitude": "27.127544", "longitude": "-81.229808",

       },
       {
         "id": "circle",
         "content": 'store 10',
         "value": 7,
         "latitude": "19.811147", "longitude": "-155.602455",

       },
       {
         "id": "circle",
         "content": 'store 11',
         "value": 7,
         "latitude": "67.501419", "longitude": "-148.725014",

       },
       {
         "id": "circle",
         "content": 'store 12',
         "value": 9,
         "latitude": "66.046131", "longitude": "-143.451577",
       },
     ]
   }
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


    self.getMapChartData = function () {
      return dataProvider;
    }


    self.GetStoreList = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('StoreList', 'GET');


      return $http(request);
    };

    

    self.GetAllStores= function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getAllStores', 'GET');


      return $http(request);
    };



    self.GetDepartmentList = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('DepartmentList', 'GET');

      return $http(request);
    };

    self.GetSalesPerformance = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesPerformance', 'POST', data);

      return $http(request);
    };

    self.GetShoppingTrips = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('ShoppingTrips', 'POST', data);

      return $http(request);
    };


    self.GetAvgBasket = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('AvgBasket', 'POST', data);

      return $http(request);
    };

    self.GetTopProducts = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('TopProducts', 'POST', data);

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

    self.GetSalesPerformanceByStoreId = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesPerformanceByStoreId', 'POST', data);

      return $http(request);
    };


     self.GetSalesPerformanceByStoreIdforallretailer = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesPerformanceByStoreIdforallretailer', 'POST', data);

      return $http(request);
    };

    self.GetTopProductsByStoreId = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('TopProductsByStoreId', 'POST', data);

      return $http(request);
    };


    self.GetTopTenProductsByStoreId = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('TopTenProductsByStoreId', 'POST', data);

      return $http(request);
    };


    self.GetShoppingTripsByStoreId = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('ShoppingTripsByStoreId', 'POST', data);

      return $http(request);
    };

    self.GetAvgBasketByStoreId = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('AvgBasketByStoreId', 'POST', data);

      return $http(request);
    };

    self.GettoptenDepartments = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('toptenDepartments', 'POST', data);

      return $http(request);
    };

     self.GethundredDepartments = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('GetHundredDepartments', 'POST', data);

      return $http(request);
    };


    self.GethundredDepartmentsByStoreId = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('GetHundredDepartmentsBystoreId', 'POST', data);

      return $http(request);
    };



    self.GettoptenDepartmentsByStoreId = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('toptenDepartmentsBystoreId', 'POST', data);

      return $http(request);
    };

    self.getGoogleMapData = function () {
      var deferred = $q.defer();

      deferred.resolve(googleMapData);

      return deferred.promise;
    }


    self.GetAllRetailers = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getRetailers', 'GET');


      return $http(request);
    };

    self.GetSalesPerformanceByAllRetailers = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesperformanceByAllRetailers', 'POST', data);

      return $http(request);
    };

     self.GetSalesPerformanceByAllRetailerswithoutsize = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesperformanceByAllRetailerswithoutsize', 'POST', data);

      return $http(request);
    };


    self.GetShareOfCategory = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('shareOfCategory', 'POST', data);

      return $http(request);
    };

    self.GetShareOfBasket = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('shareOfBasket', 'POST', data);

      return $http(request);
    };

    self.GettopPerformersByAllRetailer = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('topPerformersByAllRetailer', 'POST', data);

      return $http(request);
    };

self.GettopPerformersByAllRetailerwithoutsize = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('topPerformersByAllRetailerwithoutsize', 'POST', data);

      return $http(request);
    };


    self.GettopDepartmentsByAllRetailer = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('toptenDepartmentsByAllRetailer', 'POST', data);

      return $http(request);
    };


    self.getStoreListBasedonretailer = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getStoreListBasedonretailer', 'GET');


      return $http(request);
    };


    self.getgeoSalesData = function (geosalesData) {
      if (geosalesData == undefined) {
        geosalesData = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('geoSalesData', 'POST',geosalesData);


      return $http(request);
    };


self.getgeoSalesDataforCpg = function (geosalesData) {
  if (geosalesData == undefined) {
    geosalesData = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('geoSalesDataforcpg', 'POST',geosalesData);
  return $http(request);
};


self.avgsalesData = function (avgsalesData) {
  if (avgsalesData == undefined) {
    avgsalesData = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('avgSaleschange', 'POST',avgsalesData);


  return $http(request);
};


self.avgsalesDataforcpg = function (avgsalesData) {
  if (avgsalesData == undefined) {
    avgsalesData = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('avgSaleschangeforcpg', 'POST',avgsalesData);


  return $http(request);
};



self.RetailercampaignList = function () {

  var request;
  if (self)
    request = serviceFactory.getPacket('RetailercampaignList', 'GET');

     //console.log(request);
   
  return $http(request);
};


self.CpgcampaignList = function () {

  var request;
  if (self)
    request = serviceFactory.getPacket('cpgcampaignList', 'GET');


  return $http(request);
};

self.getallitems=function(){
    var request;
  if (self)
    request = serviceFactory.getPacket('getItems', 'GET');
  return $http(request);
}

self.getbestselleres = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('sellerbyretailer', 'POST',data);


  return $http(request);
};

self.getbestselleresbyStore = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('sellersbystore', 'POST',data);


  return $http(request);
};

self.getworstselleres = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('worstsellerbyretailer', 'POST',data);


  return $http(request);
};

self.getworstselleresbystore = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('worstsellersbystore', 'POST',data);


  return $http(request);
};

self.getbestselleresbyallretailer = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('bestsellersbyallretailer', 'POST',data);


  return $http(request);
};
self.getbestselleresbyretailerforcpg = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('bestsellersbyretailerforcpg', 'POST',data);


  return $http(request);
};
self.getbestselleresbystoreforcpg = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('bestsellersbystoreforcpg', 'POST',data);


  return $http(request);
};

self.getworstselleresbyallretailer = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('worstsellersbyallretailer', 'POST',data);


  return $http(request);
};
self.getworstselleresbyretailerforcpg = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('worstsellersbyretailerforcpg', 'POST',data);


  return $http(request);
};
self.getworstselleresbystoreforcpg = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('worstsellersbystoreforcpg', 'POST',data);


  return $http(request);
};


self.getsalesdatafordepartments = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('salesdatafordepartments', 'POST',data);

      return $http(request);
    };

    self.getsalesdatafordepartmentsforcpg = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('salesdatafordepartmentsforcpg', 'POST',data);

      return $http(request);
    };

    

     self.getstoresbyRegion = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('topstoresByRegion','POST',data);

      return $http(request);
    };

    self.getsalesdatafordepartmentsbystore = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('salesdatafordepartmentsbystore', 'POST',data);

      return $http(request);
    };

    self.gettopcategoriesbyBrands = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('itemsbycategory', 'POST',data);

      return $http(request);
    };

     self.getsalesbyBrands = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('topsalesRegionsByBrands', 'POST',data);

      return $http(request);
    };

    self.getstoresbyBrands = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('topstoresByBrands', 'POST',data);

      return $http(request);
    };

    self.getgeosalesDataByBrands = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('geosalesDataByBrands', 'POST',data);

      return $http(request);
    };


    self.getDistributorBrands = function () {
    var request;
    
    if (self)
    
    request = serviceFactory.getPacket('DistributorBrands', 'GET');
    
    return $http(request);
    };

   self.GetShareOfCategoryforDistributor = function (data){

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('shareOfCategoryforDistributor', 'POST',data);

      return $http(request);
    };

   self.GetShareOfBasketforDistributor = function (data){

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('shareOfBasketforDistributor', 'POST',data);

      return $http(request);
      };

       self.getDmaList = function () {
    var request;
    
    if (self)
    
    request = serviceFactory.getPacket('dmaList', 'GET');
    
    return $http(request);
    };

  self.campaignListforDistributor = function () {
  var request;
  if (self)
  request = serviceFactory.getPacket('campaignListforDistributor', 'GET');
  return $http(request);
   };

   self.storeListforCPG=function(){
     var request;
  if (self)
  request = serviceFactory.getPacket('StoreListforCPG', 'GET');
  return $http(request);
   }

    self.getallStoresforCPG=function(){
     var request;
  if (self)
  request = serviceFactory.getPacket('getAllStoresforCPG', 'GET');
  return $http(request);
   }

   self.dmaListforCPG=function(){
      var request;
  if (self)
  request = serviceFactory.getPacket('dmaListforCPG', 'GET');
  return $http(request);
   }

   self.getRetailerforCPG=function(){
      var request;
  if (self)
  request = serviceFactory.getPacket('getRetailersforCPG', 'GET');
  return $http(request);
   }

self.getBrandsforCPG=function(){
      var request;
  if (self)
  request = serviceFactory.getPacket('getBrandsforCPG', 'GET');
  return $http(request);
   }

 self.getDMAforCPG=function(){
      var request;
  if (self)
  request = serviceFactory.getPacket('getDMAforCPG', 'GET');
  return $http(request);
   } 
   
   
   self.getbestsellersByRetailer = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('SalesPerformancebyretailerbasedonsize', 'POST',data);


  return $http(request);
};

 self.getbestsellersByStore = function (data) {
  if (data == undefined) {
    data = {};
  }
  var request;
  if (self)
    request = serviceFactory.getPacket('SalesPerformanceByStoreIdbaseonsize', 'POST',data);


  return $http(request);
};
 

  return self;


  }]);
