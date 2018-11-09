
'use strict';

angular.module('product.service', ['shared.serviceFactory'])
  .service('productService', ['$http', 'serviceFactory','$q', function ($http, serviceFactory,$q) {

    var self = this;
    var state = null;
    var role = null;
    var doctorId = null;
    var topproductbarchartCsv = null;
    var topdepartmentsCsv = null;
    var productObject=null;
    var individualproduct=null;
    var productdetail=null;
    var selectedproduct=null;
    var deptDetail=null;
    var selectedCategory=null;
    var category=null;
    var allRetailers=null;
    self.savedropdownselected=null;

    self.saveallRetailers=function(value){
      allRetailers=value;
    }

    self.getallRetailers=function(){
       return allRetailers;
    }

    self.setsavestoreselected=function(value){
          self.savedropdownselected=value;
    }

    self.getsavestoreselected=function(){
      return self.savedropdownselected;
    }
    
    self.setCategoryforRetailer = function(data){
      category = data;
       console.log("category",category);
    }

    self.getCategoryforRetailer = function(){
     return category ;
    }
   
   self.setselectedCategory = function(data){
      selectedCategory = data;
      // console.log("selectedCategory",selectedCategory);
    }

    self.getselectedCategory = function(){
     return selectedCategory ;
    }


    self.setdeptDetail = function(data){
      deptDetail = data;
      //console.log("deptDetail",deptDetail);
    }

    self.getdeptDetail = function(){
     return deptDetail ;
    }

    self.setselectedproduct = function(data){
      selectedproduct = data;
    }

    self.getselectedproduct = function(){
     return selectedproduct ;
    }
    
    self.setproductdetail = function(data){
      productdetail = data;
    }

    self.getproductdetail = function(){
     return productdetail ;
    }


    self.setindividualproduct = function(data){
      individualproduct = data;
    }

    self.getindividualproduct = function(){
     return individualproduct ;
    }


    self.setProductObject = function(data){
      productObject = data;
    }

    self.getProductObject = function(){
     return productObject ;
    }


    self.setTopproductbarchartCsv = function(data){
      topproductbarchartCsv = data;
    }
    self.getTopproductbarchartCsv = function(){
      return topproductbarchartCsv;
    }

    self.setTopdepartmentsCsv = function(data){
      topdepartmentsCsv = data;
    }
    self.getTopdepartmentsCsv = function(){
      return topdepartmentsCsv;
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



    self.GetTopProducts = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('TopProducts', 'POST', data);

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


    self.GetSalesPerformanceByStoreId = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesPerformanceByStoreId', 'POST', data);

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


    var amchartDataForPieChart={amchartDataForPieChart:[{
      "title": "PRODUCE",
      "percent":6,
      "value": 100

    }, {
      "title": "MEAT/FISH",
      "percent":10,
      "value": 500
    },
      {
        "title": "HOUSEHOLD " +
        "PRODUCTS",
        "percent":30,
        "value": 600
      },
      {
        "title": "TOILETRIES",
        "percent":24,
        "value": 100

      },
      {
        "title": "Milk",
        "percent":4,
        "value": 122

      },
      {
        "title": "Chocolate",
        "percent":4,
        "value": 100

      },
      {
        "title": "Movies",
        "percent":18,
        "value": 250

      },
      {
        "title": "Petrol",
        "percent":10,
        "value": 362

      },
      {
        "title": "HARDWARE",
        "percent":12,
        "value": 453
      },
      {
        "title": "PET",
        "percent":12,
        "value": 144
      },{
        "title": "BAKERY",
        "percent":12,
        "value": 315
      } ,
      {
        "title": "SPIRITS",
        "percent":12,
        "value": 435
      }
      ,
      {
        "title": "DETERGENTS",
        "percent":2,
        "value": 135
      }
      ,{
        "title": "DRINKS",
        "percent":12,
        "value": 435
      },
      {
        "title": "CEREAL",
        "percent":4,
        "value": 834
      }]};


    var SerialChartData={SerialChartData:[
      {
        "storename": " store M",
        "income": 33.5,
        "expenses": 18.1,
        "color":"#ba5bbb",
        "color1":"#428DB6"

      },
      {
        "storename": " store l",
        "income": 26.2,
        "expenses": 52.8,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      },
      {
        "storename":" store k",
        "income": 30.1,
        "expenses": 23.9,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      },
      {
        "storename":" store j",
        "income": 39.5,
        "expenses": 25.1,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      },
      {
        "storename": " store I",
        "income": 32.6,
        "expenses": 25,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      },
      {
        "storename": " store h",
        "income": 26.6,
        "expenses": 35,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      },
      {
        "storename": " store g ",
        "income": 48.6,
        "expenses": 26,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      }
      ,{
        "storename":" store f",
        "income": 29.6,
        "expenses": 27,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      }
      ,
      {
        "storename": " store d",
        "income": 24.6,
        "expenses": 25,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      },
      {
        "storename": " store c",
        "income": 28.6,
        "expenses": 35,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      },
      {
        "storename":" store B",
        "income": 29.6,
        "expenses": 29,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      },
      {
        "storename": " store A",
        "income": 50.6,
        "expenses": 27,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      }
      ,
      {
        "storename": " store P",
        "income": 35.6,
        "expenses": 12,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      }
      ,
      {
        "storename": " store Q",
        "income": 57.6,
        "expenses": 27,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      }
      ,
      {
        "storename": " store R",
        "income": 60.6,
        "expenses": 17,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      }
      ,
      {
        "storename": " store X",
        "income": 10.6,
        "expenses": 37,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      }
      ,
      {
        "storename": " store Y",
        "income": 50.6,
        "expenses": 27,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      },
      {
        "storename": " store z",
        "income": 20.6,
        "expenses": 47,
        "color":"#ba5bbb",
        "color1":"#428DB6"
      }

    ]};








    

    self.report_basket_count=function(data){
      if(data== undefined){
        data={};
      }
      var request;
      if(self)
        request=serviceFactory.getPacket('report_basket_count','POST',data);
      console.log(request);
      return $http(request);
    }

    self.getPieChartData=function(){
      var deferred = $q.defer();

      deferred.resolve(amchartDataForPieChart);

      return deferred.promise;
    }


    self.getSerialChartData=function(){
      var deferred = $q.defer();

      deferred.resolve(SerialChartData);

      return deferred.promise;
    }

    self.GettoptenDepartments = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('toptenDepartments', 'POST', data);

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

    self.GetTopTenProducts = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('TopTenProducts', 'POST', data);

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
    

     self.GetSalesPerformanceByAllRetailerswithoutsize = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesperformanceByAllRetailerswithoutsize', 'POST', data);

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

     self.GetProductSuggested = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('productsSuggested', 'GET');

      return $http(request);
    };

    self.GetProductSuggestedforcpg = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('productsSuggestedforcpg', 'GET');

      return $http(request);
    };

    self.getproductSuggested=function(){
       var request;
      if (self)
        request = serviceFactory.getPacket('productsuggested', 'GET');

      return $http(request);
    }

    

    self.GetProductSuggestedforDistributor= function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('productsSuggestedforDistributor', 'GET');

      return $http(request);
    };

    self.getManufactureList = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetmanufacturerList', 'GET');

      return $http(request);
    };

    self.getManufactureListbyFilter = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetmanufacturerListByFilter', 'GET');

      return $http(request);
    };


    self.getCategoriesList = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetcategoriesList', 'GET');

      return $http(request);
    };

    self.getCategoriesListbyFilter = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetcategoriesListByFilter', 'GET');

      return $http(request);
    };

    self.getManufactureListbyDepartment = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetmanufacturerListByDepartment', 'GET');

      return $http(request);
    };


    self.getManufactureListbyCategory = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetmanufacturerListByCategory', 'GET');

      return $http(request);
    };

    self.GetSalesperformancebyretailerbasedonsize = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesPerformancebyretailerbasedonsize', 'POST', data);

      return $http(request);
    };

     self.GetSalesperformancebystorebasedonsize = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('SalesPerformanceByStoreIdbaseonsize', 'POST', data);

      return $http(request);
    };

     self.getcategoriesListforcpg = function () {
     
      var request;
      if (self)
        request = serviceFactory.getPacket('GetcategoriesListforcpg', 'GET');

      return $http(request);
    };

    self.getcategoriesListforcpgbasedonretailer = function () {
     
      var request;
      if (self)
        request = serviceFactory.getPacket('GetcategoriesListforcpgbasedonretailer', 'GET');

      return $http(request);
    };

     self.getManufactureListforcpg = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetmanufacturerList', 'GET');

      return $http(request);
    };

     self.getitemsbycategory = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('itemsbycategory', 'POST',data);

      return $http(request);
    };

     self.getCategoriesbasedonstore = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('getCategoriesbasedonstore', 'POST',data);

      return $http(request);
    };

    

 self.getsalesdatabyfilter = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('salesdatafilter', 'POST',data);

      return $http(request);
    };

    self.getsalesdatabyfilterbystore = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('salesdatafilterbystore', 'POST',data);

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

    self.getsalesdatafordepartmentsbystore = function (data) {

      if (data == undefined) {
        data = {};
       }
      var request;
      if (self)
        request = serviceFactory.getPacket('salesdatafordepartmentsbystore', 'POST',data);

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

    self.getallCategoriesbyBrands= function () {
     
      var request;
      if (self)
        request = serviceFactory.getPacket('getcategoriesByDistributor', 'GET');

      return $http(request);
    };
    

      self.getProducts=function(data,apikey){
       
      if (data == undefined) {
        data = {};
       }
        var request;
      if (self)
      request = serviceFactory.getPacket(apikey, 'POST', data);
      return $http(request);
       
      }

      self.getShoppingTripsforDistributor=function(data){
       
      if (data == undefined) {
        data = {};
       }
        var request;
      if (self)
      request = serviceFactory.getPacket('ShoppingTripsfordistributor', 'POST', data);
      return $http(request);
       
      }

      self.getAvgBasketforDistributor=function(data){
       
      if (data == undefined) {
        data = {};
       }
        var request;
      if (self)
      request = serviceFactory.getPacket('AvgBasketfordistributor', 'POST', data);
      return $http(request);
       
      }

      self.getItemsforDistributor=function(){
       
      var request;
      
      if (self)
      request = serviceFactory.getPacket('getitemsfordistributor', 'GET');
      return $http(request);
       
      }


       self.DeptDataforRetailer = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('DeptDataforRetailer', 'GET');

        return $http(request);
       };

     self.DeptDataforCPG = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('DeptDataforCPG', 'GET');

      return $http(request);
    };

    self.DeptDataforDistribiter = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('DeptDataforDistribiter', 'GET');

      return $http(request);
    };

     self.RetailerProductbyDepartment = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('RetailerProductbyDepartment', 'POST', data);

      return $http(request);
    };
     

      self.RetailerProductbyStore = function (data) {
      if (data == undefined) {
        data = {};
      }
      var request;
      if (self)
        request = serviceFactory.getPacket('RetailerProductbyStore', 'POST', data);

      return $http(request);
    };


     self.ProductsSuggestedforallretailer = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('productsSuggestedforallreatilers', 'GET');

      return $http(request);
    };

    self.getCategoriesListforallretailers = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('GetcategoriesListforallretailers', 'GET');

      return $http(request);
    };


    
    //   self.RetailerProductbyDepartmentforcpg = function (data) {
    //   if (data == undefined) {
    //     data = {};
    //   }
    //   var request;
    //   if (self)
    //     request = serviceFactory.getPacket('RetailerProductbyDepartmentforcpg', 'POST', data);

    //   return $http(request);
    // };

     self.getcategorywithDMA = function () {

      var request;
      if (self)
        request = serviceFactory.getPacket('getcategorywithDMA', 'GET');

      return $http(request);
    };


    return self;
   


  }]);
