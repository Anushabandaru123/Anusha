/**
 * @ngdoc controller
 * @name ProductModule.productController
 * @requires $scope
 * @requires $state
 * @requires product.serviceFactory
 * @description
 *
 *
 * */

angular.module('salesRegions.controllers', [])

  .controller('salesRegionsCtrl', ['$scope', '$state', 'serviceFactory', 'productService', 'salesRegionService', '$http', 'dashBoardService','$filter','$stateParams','$timeout','$rootScope',
    function ($scope, $state, serviceFactory, productService, salesRegionService, $http, dashBoardService,$filter,$stateParams,$timeout,$rootScope) {

    if (sessionStorage.user == undefined || sessionStorage.user == null||sessionStorage.user =="null") {
      $state.go('login');
    }
    
     // console.log('sent data:',$stateParams.storedata);
      $scope.storeObj=$stateParams.storedata;
      $scope.selectedvalue = "salesregion";
      $scope.selectoption = $scope.selectedvalue;
      salesRegionService.setselectedsalesregion($scope.selectoption);

      $scope.selectRegions = function () {

        $scope.selectoption = $scope.selectedvalue;

        if($scope.selectoption=="SalesRegions"){
            salesRegionService.setselectedsalesregion($scope.selectoption);
        }else{
            window.localStorage['selectedresion']=$scope.selectoption;
            salesRegionService.setselectedsalesregion($scope.selectoption);
            $state.go('storeComparision');
        }
      }

      var regionSelected;

      regionSelected= $rootScope.$on('regionselected', function (event, data) {
             console.log("region selected...",data.region);
             window.localStorage['selectedresion']=data.region;
            salesRegionService.setselectedsalesregion(data.region);
        //salesRegionService.setselectedsalesregion(data.region);
           $state.go('storeComparision');

      });

     

  $scope.topregionsbarchartfunction=function(){
      $scope.topregionchartid = dashBoardService.generateguid();
      $scope.topregionchartdata=[];
      $scope.showbarchart=true;
      }

      $scope.imgbar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACtJREFUSMdj+A8GDAgwKjAqwDAKcIH/cDAqMCqAKTAKcOUXaDCNCowKIAAAP/H8Lm4fPi4AAAAASUVORK5CYII=";

      $scope.imgline = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAACKxJREFUeJztnWeMFVUUx3+zy8oiKgtqUKwodhBL/GBZJMGaaIINe2JDxa4xKrERYyJW7CV2idEPRqNgCRqMJUbUYPuAsZGIBcUCKoLswvrh8MJbd+fOmfdm5t557/ySm/2w7838Z+5595x7bgPDMAzDMAzDMAyjiWj1LcAohFFAJ7AdsBT4x68coyhGAW8CPVWlC3gQGOxRl1EAI4Ff6F351eUtoM1cQOPyNLCH4//bAL8VpMUomOHE//Kry3xfAo186URnACtafCk0cmWV8nPLc1VheGEwMAddC/C8J41GTgwD3kNX+auBffzINPJgBPA5usrvBs7wI9PIg1HAQuIr/BvgO+Ar4ElgrB+ZRh6MBRYTX/lX+JNm5E0nktuP8/Fn+ZNm5M0RwAr6r/x/gWP8STPy5hQkkOuv8v8CJviTZuTNRcT7+1+xrl0iETARmIv4z6XAG8CRPkUpiIAbiK/8RcAu3tSVhAi4m/iXePvaz4RGC3Af8bq/ALb2pq5EnEZykuRkX+JiWA94hni9HwGbelNXMr4g2QA+96auL4OB14jXOhfYyJu6krEJujRpDzDEk8ZqkvL6LwDt3tSVkK3RG8A9wAZ+ZALJef1HgQHe1JWQYeiHSCvle2ASxQeFSXn9WzxoKjW7I4MhaSq/urwB7FyQ1j2wvH6mTEJmvdRa+ZWyCriZfN1CJ7As5v6W109JKzAdd6WupncFf5nw+TzdQlJe/+iM79fQDMPddeoGLgQ6gP3Wlg3XfvdAdJMqsnQLp2J5/cwYg9vf/4JUsos24BLgT8d1snILFzuub3n9lCT5+w+BrVJcb3NgpuN61W7hONK5BU1ev6jAs/Ro/P0TwKAarz+ObN1CK3C/4zqW109Bkr/vAi6g/qAtjVuYTrxbWA941vF9y+unQOPvx2V8T61bWIS4hdHAdcDDwK3APMd35rIuGDUSOI5s/X1atG5BWyyvr6QVuAn3y3ycYl6m1i0kFcvrK9H4+/MpPk+udQv9FcvrK0ny9z+Tvb9PyzjgM/SVP8+PzPAZCZwDTEVm55wO/E38i/wA2NKL0r4MAF5HZwAve9IYLAOBB4A16H9FjxFe8OTK7lWXR3wJDJEId/+4P39/HmH6z+3RGXHos5AL5SD0lf8zMnQaMnfgfoY5hGm83ngMXeV/Szj+3sUAZFpZf88wizDmHAZBB3AVsBKdAdzoR2bNjAGuR/r605Gegv3ykV/xbch4d5p+84U+xBrZsSuSqVtFuoqvlB2Ll2zUS4QEbbOordKt21RSWpBFmNpNi3qIH+B5jvD6+0YMA5EZrJplWJUyGwmQBiLr955FJlg8ChyKBU6loAO4EvgJfTLnSSRSNkrMFshkB+2w6F/IMuw8x+uNAkgb0S9GBniG+hBrZEMEHAC8hN6/fwmcjQVxpSBCJiWOQKL4CrVE9POQFS12JkEJiJAx+K9ZV4FLkIUPU6gtorfIvSRESJKlniRNJaIfXbB2IwNOpPaKt4i+AUjj1y2ib0C0Q7GViH4yFtE3FFoDuByL6BuSd0mu/OXUvrjSCJxJJBvAHd7UGbkT4V6u/C6wvjd1RiFEyAKMBayr+B+BaVjA13R0IOlgy+QZhmEYhmE0KBboNT57AmcCuyGzt94DHkLGc4wGJgKupf+VykuBQ/xJM4rgNJLT+zvY4E5j0oqsxHIdJ9OW8H+jxIxBN8L7Y7NuTzYUOAnYC3kRHyEncy3zKSpDtBN1Ns5VRaAcDvxO31/DEmSnkkZgIroWYIEvgb7YGzmAIe6FrECOmCkzh6I/JWWaH4n+0GzhNtubuvo5Hv1KrQX4PRmtcAbT+5iYuNKFrFIuG1PQb7E3B9jMj0x/bIN+8uvmnjTWQgRcgyPSRybyXoZspbunH5l+iYBL0VV+N+WZ/9gCzCD+Wb5Gdl5tatqRVczaX38P8BThz4BuQ3TGPcMnNGEz/3+2Qs4OSFP5ZTCCQbhXaL+DzOxqasYhu4rWUvkhG8EQ4G3cvZimnsQbIecEdRH/kuYC5yL+cwbu7mFIRjAcadrjtM5EXEPT0k7ytrO30PeEjhZkp/KQjWBb4CviNd5J7z0dmo4tkbMD4l7QP8AJju+HbASjgR8c2q6lySf3dOL29wuBsYrrhGgE+9L/2EUPkviZUrCeoIiQ5IbL379OulGvkIzAldfvwt2i1cRGSPQ8gfD7kLX6ew0hGIErr78cOCzLm60P3EXfpeIvIPsAhka9/l6DTyNw5fV/R9xCZrQBb8bcrAf4Dtk1LBSy8vcaijYCTV4/832YNDnyF/EfZUbIOUFZ+nsNRRlBC9KVi7tPbnl97RGoy4D3kd3ApiJ7AO5GMUOnefp7DXkbgSavP7yO6zvpdtxYU1Yj1jkb2TFsMhJIDqf2VmMzZCvaIYi/dx26nIW/15CXEQzCfZZC7nl916GM9ZY/kFbjCaTVOAqp2LhW4zB6pzrX4J7CtZDs/L2GrI2gA3defxYF5PVfdQjIq6xG0pqzkbODJiNNeJpr5OHvNWRlBMHk9cc7RIRa8vT3Guo1gpEElte/xCFmJpILGI/sJzwDeAU5zDnNMa9ZlH8pxt9rqNUIRiPdubjvXYOnHtf+SOJnMfAbkhs4IUFMO/JAxwJXI8byAdJjyMMA7s3oWbNCYwQDkAmpLTRRXj9CJlaOZ924+6vIyZ/1tBpTC3wGLUlGsLLqb1yPK5e8fqgMQtauHYs0dzOB79EZwAQPejUkGYGrZJ7XLyMjSD5F9GPCnvBQixFkntcvMxOJH/36CdjJnzQ1LUjXVlP5y7DzFfqwF/ICK8mfpcDDlGuhxjR0BvCaJ329CG15+HzgCETXhsivZI1XRenRuqmVuapQEpoBVOhG0shl5DPl5z7NVYXhjXZgEe7mfyWyVtFoUDqRUcq4hM/p/qQZRbE7MmBVnfiaDxzsU5RRPEORxFfok2wNwzAMwzAMwzAMwzAMwzAMw2hA/gOiulK7+Ir8UwAAAABJRU5ErkJggg==";

      $scope.imgmap = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADB+5NvAAAA6nRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9PkBBQ0RFSElKS0xNTk9QUVJTVFVWV1haW1xdXmBhYmNkZWZnaGprbG1ub3BxcnN0dXZ3eHp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJaXmJmbnJ2en6ChoqOkpaaoqqusrq+wsrO1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1dbX2Nrc3t/g4eLj5OXm5+jp6uvs7e7w8fLz9PX29/j5+vv8/f6wQlqMAAAFg0lEQVQYGe3B91/UZQAH8M8hCMcwR5hpKQ5MM/fKrMxMLTGt1HbO1DRRGgouBEPJLMtKNLWyRAi0ZRalpdkCCkgMT0GGyLzPX5H3vA7u+d78As/3frr3GwgICAgICAgIaLeQu+au3bpr15a1c4YFw+/6vJxzja2qs1/qBX+alttMJ01ZD8Bf7j9Dt/LugT/0OEhPrB90heEmX6AX/4yHwZ5vpFcNC2CotfTF+hIMtJw6LIRh5lipQ9NMGGRgFXWp6AdDdPqZzv4+lrE/q4jOvg+CEVZSqzi+L4SYhAvUWgQDRFdSVrsmBK06v1JHWXlXqLeVspLh0BhTStl6KNflKiUlfeFkwEVKyiOg2guU1A6Hi3H1lDwF1U5SEg87U3RPE+w2UHIcivWw0qEkBEKv3VdIS3o0BHMZHZq6QK25lKyDMO4yhf9GQkik5GGolU5JP9jcYqHdxR6wGUpJKtTKpUMxhF1stQ2ChQ6ZUKuIDl/AxmRhqyIIJ+lQALXq6HAQNt0pMcPmCB0qoVQwJYdg05WSMNh8RodmKBVJyXHYmErZqgDCKUrCoFQjHUohpLDVetiYyikxQSkLJYNg062EdoVRsBlBSTXUyqdkPYQhxRQKB0HYRkk+1DpBSZkZwk1JBeRfr0dCiCqnJBtqpVKWhBYhIWixnbLtUOsJyhomwsX9TZQtgFoDqXFpMJwMK6dGfyhWRg3LZGhMqaBGCVR7n1qNyZFo1eWNZmq9B9Xi6OxK8ggTbjCNTq2gszioFlFHVxV5RzPzrtJVjRnKHWUbHIZ6cWyD6VAvuIy6XewEA6RSt00wQqyVOjX1hSGOUqePYYx7qdMEGORH6vIVjDKbukyFUUznqMMpGGcGdXgABvqBPp2AkabQF+s4GCqTPhyCsWIb6NX1fjDYDnq1EUbraqEXJeEw3DP0Yg784Bt6lA1/GNJAD2oHwC8204ME+Efon3TrbDD8ZGIz3WgYCb/ZQTcS4T/mfLr4JQR+NLaRTuqGwa820Mlq+FdwHjVOmOAvERD6V1JyuTeECBgn+I5Za/bk/FnddDeEeZTMhDDVWpOfsyd+1uBgKBU2aeWB83W0K4yCsJetdkLoXkq7+vMZKyeFQoXwh1LyGqiRAcH8G+1Od4bwGTXq81KmhaNDei/PqaOr+RAGV1OoiIGwhK7qcpb1QTtFLTpppVtVAyE8RhvrDAh3Xadb1pMLo9B2sXtq6NHZUAhpvCERQmQ+Pap+OxZtE/tJM715B0Lwl2SmCcJBetN8OBb6he9spEf1JaczM3b0hHDz3/k3Qbh9Z0bm6ZJ6etTwRjh0GlVId6p+2vfavAm3miAbFguZqdf4J17d92Ml3SkYAV2mX6OzytxNcTFog5i4TbmVdFYzDTpMvk6N2uzVo4PQDkGjV2fXUqNuEnyKLKLk6r6ZZnSA+ZH9lZQUhcOXF+nw7fwwdJj5yVN0WAZfstji2FgoMvELtjgGX87SLisUyoTl0u4H+PI5WxQvMUOJ8KX/ssV++PIkHS6n3YkOG55eToeZ8KXTz5T9vmE02s80NukPyr6DbwMuUeu/A88OQjsMfu5gGbUu9IIOQ4rp4tKxpLiBQdApaNDsjVkWuvirP3SJzqRb1379ZOvih4Z2g0fd75y+JPnT87V06+Nu0Gt+Kb2o//fsV0fefys1MSF+1fIVq+ITElN3f3Dk63MXGuhF8aNog/B1FipVtqIz2sa88Fcqc/qpULTDmPRSKlCcMgLtFTQp+ZyVHWA9kzTBhI7p+fjuc01sh8YzOx+NhhoRk1fs/amKulXkvbt4vBmq9ZmycMtH3xbW0KOqgi8/3Pj8fT1hrIiYMQ/OfW5FQlJyWvquN9NSNieuXfr07KmjbgtFQEBAQEBAQEDb/Q+FHFVi9MUL1wAAAABJRU5ErkJggg==";

      $scope.List = [];
      $scope.showselectedstore=false;
      $scope.showselectearea=true;

      $scope.GetStoreList=function(){
         dashBoardService.GetStoreList().then(function (response) {
          for (var i=0;i<response.data.length;i++) {
            $scope.List.push(response.data[i]);
          }


          $scope.topSalesRegions();
            $scope.salespperformancebyallstores();
          
        }, function (response) {
          console.log(response);

        }
      );
      }

        $scope.ctrl = {
              'treeData':[],
              'treeDropdownstatus':false,
              'selected': {
                "id": 1,
                "name": "All Retailers",
                "retailerId":"All Retailers"
              }
            };

            $scope.ctrl.treeData = [
            {
              "id": 1,
              "name": "All Retailers",
              "retailerId":"All Retailers"
            }
            ]
             $scope.ctrl.treeData1 = [
            {
              "id": 1,
              "name": "All Retailers",
              "retailerId":"All Retailers"

            }
            ]

            $rootScope.selected=
            {
            "id": 1,
            "name": "All Retailers",
            "retailerId":"All Retailers"
          };

            $scope.savedvalue=dashBoardService.getsavestoreselected();

            if($scope.savedvalue==null){
            $scope.defaultstoreselected=$rootScope.selected;
            dashBoardService.setsavestoreselected($scope.defaultstoreselected);
            }

            $scope.retailerList=[];
            $scope.collection1=[{
              "id":1,
              "name":"All Retailers",
              "retailername":"All Retailers",
              "retailerId":"All Retailers"
            }]
            $scope.storesByRetailer=[{
              "normalId":1,
              "id":1,
              "name":"All Retailers",
              "retailername":"All Retailers",
              "retailerId":"All Retailers"
            }]
            
            $scope.ctrl.treeDropdownstatus=false;
            $scope.id=2;
      $scope.makeStoresList=function(retailerid,retailerName){
          dashBoardService.storeListforCPG().then(function (response) {
              $scope.storesList=response.data;
              //console.log("$scope.storesList",$scope.storesList);
               for(var i=0; i<$scope.getStoresData.length; i++){
            var storesssobject={
                 "id":   $scope.id,
                 "name": $scope.getStoresData[i].retailername,
                 "retailerId":$scope.getStoresData[i].retailerid,
                 "children": [],
               }
          for(var j=0;j<$scope.storesList.length;j++){
             if($scope.storesList[j].retailer_id == $scope.getStoresData[i].retailerid){
                 var id=$scope.storesByRetailer.length+1;
                 $scope.id=$scope.id+1;
                 var object={
                   "id":$scope.id ,
                   "name":$scope.storesList[j].store_name,
                   "storeid":$scope.storesList[j].store_id,
                   "retailerId":$scope.getStoresData[i].retailerid,
                   "retailerName": $scope.getStoresData[i].retailername,
                 }
                 //$scope.allstoresList.push($scope.storesList[j]);
                 $scope.storesByRetailer.push(object);
                 storesssobject.children.push(object);
               }}
               $scope.id=$scope.id+1;
               $scope.storesByRetailer.push(object);

               $scope.selectedOption = $scope.storesByRetailer[0];
               $scope.ctrl.treeData1.push(storesssobject);
               $scope.ctrl.treeDropdownstatus=false;
                var index=$scope.retailerData.length-1;
            if($scope.retailerData[index].retailer_name==$scope.getStoresData[i].retailername){

                   $timeout(function(){
                     // $scope.arrayid=$scope.arrarIdlength;
                   $scope.arrayid =1;
                  for(var i=0;i<$scope.retailerData.length;i++){
                    var findretailer=$filter('filter')($scope.ctrl.treeData1, 
                    {name : $scope.retailerData[i].retailer_name}, true);

                     $scope.arrayid=$scope.arrayid+1;
                     findretailer[0].id=$scope.arrayid;
                    for(var j=0;j<findretailer[0].children.length;j++){
                       $scope.arrayid=$scope.arrayid+1;
                      findretailer[0].children[j].id=$scope.arrayid;
                    }
                    $scope.ctrl.treeData.push(findretailer[0]);
                   }
                  $scope.ctrl.treeDropdownstatus=true;
                console.log("treedata...",$scope.ctrl.treeData);
                  },1400);
                   }
                 }
             }, function (response) {
              console.log(response);
            }
            );
            }

          $scope.retailerList=[];
          $scope.getStoresData=[];
      $scope.getStoresByRetailer=function(){

      for (var i = 0; i < $scope.retailerData.length;i++) {
        $scope.retailerList.push($scope.retailerData[i]);
        sessionStorage.retailer=$scope.retailerData[i].retailer_id;
        //$scope.makeStoresList($scope.retailerData[i].retailer_id,$scope.retailerData[i].retailer_name);
         $scope.getStoresData.push({
                   "retailerid":$scope.retailerData[i].retailer_id,
                   "retailername":$scope.retailerData[i].retailer_name
                 });
      }
      $timeout(function() {
                    $scope.makeStoresList();                   
                  }, 1000);

      // $timeout(function() {
      //       $scope.topSalesRegionsforcpg();
      //       $scope.salespperformancebyallstoresforcpg();
      // },100);

      }

       $scope.allstoresList=[];
      $scope.getAllstores=function(){
          dashBoardService.getallStoresforCPG().then(function(response){
            for(var i=0;i<response.data.length;i++){
              $scope.allstoresList.push(response.data[i]);
            }
            //console.log("store List...",$scope.storeList);
        },function(response){
           console.log("error msg..",response);
        });
        }

          $scope.RetailerIds=[];
      $scope.getAllRetailers=function(){
        dashBoardService.getRetailerforCPG().then(function (response) {
        $scope.retailerData=response.data;
        for(var i=0;i<$scope.retailerData.length;i++){
         $scope.RetailerIds.push($scope.retailerData[i].retailer_id.toString());
         }
       //console.log("retailerIds...",$scope.RetailerIds);
        productService.saveallRetailers($scope.RetailerIds);
          $scope.getStoresByRetailer();
          if($scope.selectedcpg.name=="All Retailers"){
                  $scope.geosalesDataforCpg();
                  $timeout(function() {
                    $scope.topSalesRegionsforcpg();
                    $scope.salespperformancebyallstoresforcpg();
              },500);
           }
        //$scope.allstoresList=[];
        //$scope.getStoresByRetailer();
      //   
        }, function (response) {
          console.log(response);
      }
      );
      }

      $scope.storesformap=[];
      $scope.storesbarchartfunction=function(){
      for(var i=0;i<$scope.topregions.length;i++){
      $scope.region=$scope.topregions[i].region;
      $scope.storesbyregionsforreporttime=function(){
     //console.log("top regions...",$scope.topregions);
        var data={
            "startTime": $scope.ReportstartDate,
            "endTime": $scope.Reportenddate,
            "bucketLevel" : "S",
            "filters" : { "location.regionName" : [$scope.region] }
          }
        $scope.showbarchart=false;
      dashBoardService.GetSalesPerformance(data).then(function (response) {
      $scope.StoresbyregionforRT=response.data.data;
      $scope.topregionchartid = dashBoardService.generateguid();
      for(var j=0;j<$scope.StoresbyregionforRT.length;j++){
          var object={
                  "storename": "STORE #"+$scope.StoresbyregionforRT[j].id,
                  "Sales": $scope.StoresbyregionforRT[j].amt,
                  "Sales1": $scope.StoresbyregionforCT[j].amt,
                  "color": "#4C98CF",
                  "color1": "#7F2891"
          }
        $scope.topregionchartdata.push(object);
        }
        $scope.showbarchart=true;
        }, function (response) {
          console.log(response);
        }
      );
      }
      var data={
        "startTime": $scope.ComparestartDate,
        "endTime": $scope.Compareenddate,
        "bucketLevel" : "S",
        "filters" : { "location.regionName" : [$scope.region] }
        }
        dashBoardService.GetSalesPerformance(data).then(function (response) {
          $scope.StoresbyregionforCT=response.data.data;
          $scope.storesbyregionsforreporttime();
      }, function (response) {
          console.log(response);
      }
        );
      }
      }

     $scope.geosalesData=function(){
           var data={
                  "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 4
                }
                $scope.showmap=false;
                $scope.geoSalesData=undefined;
                $scope.storeData=[];
                dashBoardService.getgeoSalesData(data).then(function (response) {
                 $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
          $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
     dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              var statesData=$scope.geoSalesData[0];
              for(var k=0;k<statesData.states.length;k++){
              var  data=statesData.states[0];
              //console.log("data[k]...",data);
              for(j =0;j<data.cities.length;j++) {
              for(i =0;i<data.cities[j].stores.length;i++){
                     $scope.storeData.push(data.cities[j].stores[i]);
                    //console.log("stores...",data.cities[j].stores[i]);
              }
            }
          }
          //console.log("storesdate...",$scope.storeData);
            }, function (response) {
             console.log(response);
           }
           );
        }// geoSalesData() END...
              $scope.geosalesDatabyStoreid=function(){
               var data={
                   "startTime": $scope.ReportstartDate,
                   "endTime": $scope.Reportenddate,
                  "geoLevel" : 4,
                  "storeId" : [$scope.data.selectedStoreId]
                }
               $scope.showmap=false;
               $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesData(data).then(function (response) {
                 $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
                 dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              }, function (response) {
               console.log(response);
             }
             );
              }

              $scope.geosalesDataforCpg=function(){
               var data={
                   "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 1,
                  "filters" :{
                    "retailerId" :$scope.RetailerIds,
                  "item.mfgId" : [$scope.mfgId]
                   }
                 }
                 $scope.showmap=false;
                 $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
               $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                  $scope.storeData=[];
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
            dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              var statesData=$scope.geoSalesData[0];
              /* for(var k=0;k<statesData.states.length;k++){
             var  data=statesData.states[0];
              //console.log("data[k]...",data);
              for(j =0;j<data.cities.length;j++) {
              for(i =0;i<data.cities[j].stores.length;i++){
                     $scope.storeData.push(data.cities[j].stores[i]);
                    //console.log("stores...",data.cities[j].stores[i]);
              }
            }
             }*/
              }, function (response) {
               console.log(response);
             }
             );
              }
          $scope.salespperformancebyallstores=function(){
          $scope.salespperformancebyallstoresbyRT=function(){      
               var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S"
               }
          $scope.topstoreschart=false;
    dashBoardService.getsalesdatafordepartments(data).then(function (response) {
        $scope.topstoresList=[];
        dashBoardService.settopstoresmaxvalue(0);
        $scope.topstoresListbyRT=response.data.data;
        $scope.topstoreschartid = dashBoardService.generateguid();
        for(var i=0;i<$scope.topstoresListbyRT.length;i++){
        if(i<5){
        for(var j=0;j<$scope.List.length;j++){
        if($scope.List[j].store_id==$scope.topstoresListbyRT[i].id){
        if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
        $scope.topstoresindex=0.00;
        if($scope.topstoresListbyRT[i].amt&&$scope.topstoresListbyCT){
        $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
        $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
        }
        if($scope.topstoresindex>=1){
        $scope.labelcolor="green";
        $scope.arrow="\u2191";
        }
        else{
        $scope.labelcolor="red";
        $scope.arrow="\u2193";
        }
        var amt=$scope.topstoresListbyRT[i].amt;
        var amt1=$scope.topstoresListbyCT[i].amt;
        var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.List[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.List[j].store_id,
                          "content":$scope.List[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                           "arrow":$scope.arrow
                        };
               $scope.topstoresList.push(topstoresobject);
        }
        else{
                  $scope.topstoresindex=0.00;
                  $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                    var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.List[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.List[j].store_id,
                          "content":$scope.List[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                           "arrow":$scope.arrow
                        };
               $scope.topstoresList.push(topstoresobject);
                }
             }
             }
           }
             }
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
               }
              var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S"
               }
               dashBoardService.getsalesdatafordepartments(data).then(function (response) {
              $scope.topstoresListbyCT= response.data.data;
              $scope.salespperformancebyallstoresbyRT();
            }, function (response) {
             console.log(response);
           }
           );
             }

             $scope.salespperformancebyallstoresforcpg=function(){
               $scope.salespperformancebyallstoresbyRTforcpg=function(){      
               var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
                "retailerId" : $scope.RetailerIds
                   }
               }
                $scope.topstoreschart=false;
               dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
               $scope.topstoresList=[];
               // console.log("stores...",$scope.List);
              dashBoardService.settopstoresmaxvalue(0);
              $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0&&parseFloat($scope.topstoresListbyCT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
            if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
            }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
               else{
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
             }
             }
             }
             }
             //console.log("top store List...",$scope.topstoresList);
             //console.log("stores...",$scope.List);
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
             }
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "retailerId" : $scope.RetailerIds
                   }
               }
               dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.salespperformancebyallstoresbyRTforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }

             $scope.topSalesRegions=function(){
               $scope.topregionsbyRT=function(){
              var data={
                  "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 2
                 }
                $scope.showbarchart=false;
                $scope.topsalesregionchart=false;
          dashBoardService.getgeoSalesData(data).then(function (response) {
           $scope.salesregionchartid = dashBoardService.generateguid();
           dashBoardService.setsalesregionmaxvalue(0);
           $scope.topregions=[];
           $scope.topregionbarchartdata=[];
           $scope.regionsbyRT=response.data.data[0].regions;
        for(var i=0;i<$scope.regionsbyRT.length;i++){
          $scope.topregionchartid = dashBoardService.generateguid();
        if($scope.regionsbyRT[i]&&$scope.regionsbyCT){
            $scope.salesregionindex=0.00;
            if($scope.regionsbyRT[i].amount){
        $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                 $scope.topregions.push(topregionobject);
                   var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject)         
                 }
                 else{
                   $scope.salesregionindex=0.00;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                 $scope.topregions.push(topregionobject);
                  var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject)         
                 }
               }
               console.log("top regions..",$scope.topregions);
               $scope.showbarchart=true;
               $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }
               var salesregiondataCT={
               "startTime": $scope.ComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2
            }
          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
             if(response.data.data){
              $scope.regionsbyCT=response.data.data[0].regions;
             }
             $scope.topregionsbyRT();
               }, function (response) {
                 console.log(response);
               }
               );
        }

        $scope.mfgId=sessionStorage.mfgId;

        $scope.topSalesRegionsforcpg=function(){
          $scope.topregionsbyRTforcpg=function(){
           var data={
                    "startTime": $scope.ReportstartDate,
                    "endTime": $scope.Reportenddate,
                    "geoLevel" : 2,
                    "filters" :{
                    "item.mfgId" : [$scope.mfgId],
                     "retailerId" : $scope.RetailerIds
                   }
                   }
                $scope.showbarchart=false;
                 $scope.topsalesregionchart=false;
                dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
             $scope.topregions=[];
             $scope.topregionbarchartdata=[];
             $scope.salesregionchartid = dashBoardService.generateguid();
              dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
              $scope.regionsbyRT=response.data.data[j].regions;
               for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
             $scope.salesregionindex=0.00;
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
            $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                $scope.topregions.push(topregionobject);

                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
              else{
                $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                $scope.salesregionindex=0.00;
                $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                }
              else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

              }
                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
               }
             }
               $scope.showbarchart=true;
                $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }

               var salesregiondataCT={
              "startTime": $scope.ComparestartDate,
              "endTime": $scope.Compareenddate,
            "geoLevel" : 2,
            "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                   "retailerId" : $scope.RetailerIds
                   }
                  }
          dashBoardService.getgeoSalesDataforCpg(salesregiondataCT).then(function (response) {
             $scope.regionsbyCT=response.data.data[0].regions;
             $scope.topregionsbyRTforcpg();
               }, function (response) {
                 console.log(response);
               }
               );
        }

  $scope.selectedproducts=[];
  $scope.selectedStoresforLinechart=[];

  $scope.makechart=function(data){

    console.log("data",data);
    for(var i=0;i<data.length;i++){
      $scope.chartid = dashBoardService.generateguid();
      $scope.data=[]
      $scope.data.push(data[i]);
      var object={
        "chartId":$scope.chartid,
        "data":$scope.data,

      }
      $scope.selectedproducts.push(object);
    }
for(var i=0;i<data.length;i++){
  $scope.Linechartid = dashBoardService.generateguid();
  $scope.Linechartdata=[]
  var dataline = {
    "lineColor": "rgb(66, 141, 201)",
    "value": data[i].expenses,
    "name":data[i].id,
  };
  $scope.Linechartdata.push(dataline);
  var dataline1 = {
    "lineColor": "rgb(66, 141, 201)",
    "value": data[i].income,
    "name":data[i].id,
  };
  $scope.Linechartdata.push(dataline1);
  var objectline={
    "chartId":$scope.Linechartid,
    "data":$scope.Linechartdata,
    "total":$scope.total,
    "spIndex":$scope.spIndex
  }
  $scope.selectedStoresforLinechart.push(objectline);
}
   // console.log(  $scope.selectedStoresforLinechart);
  }

  $scope.storeselected=function(data){
    if(data.status=='plus'){
      sessionStorage.storeId = parseInt(data.id);
       $scope.SalesPerformanceByStoreId(data.id);
       for(var i=0;i<$scope.storeList.length;i++){
         if($scope.storeList[i].id==data.id){
           $scope.storeList[i].status='minus';
         }
       }
    }
    else{
     // console.log($scope.selectedproducts);
      for(var j=0;j<$scope.selectedproducts.length;j++){
       // console.log($scope.selectedproducts[j].data);
        $scope.dataarray=$scope.selectedproducts[j].data;
        //console.log($scope.dataarray);
        for(var i=0;i<$scope.dataarray.length;i++){
          if($scope.dataarray[i].id==data.id){
            $scope.selectedproducts.splice(j,1);
            $scope.selectedStoresforLinechart.splice(j,1);
          }
        }
      }
     // console.log($scope.selectedproducts);
      for(var i=0;i<$scope.storeList.length;i++){
        if($scope.storeList[i].id==data.id){
          $scope.storeList[i].status='plus';
        }
      }
    }

  }

  $scope.selectedstores=[];
  $scope.SalesPerformanceByStoreId = function (storeid) {
  //  $scope.showspinner();
    $scope.SalesPerformanceByStoreIdbyRT = function () {
      var data = {
        "aggTimeUnit": "1d",
        "startTime": $scope.ReportstartDate,
        "endTime": $scope.Reportenddate,
        "bucketLevel" : "S"
      }
      dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
          $scope.total = '$' + response.data.total;
          $scope.productchartdata=[];
         // console.log("for report time...",response.data);
          $scope.rpIndextotal = parseFloat(response.data.total);
          if ($scope.spIndextotal == 0 || $scope.spIndextotal == null) {
            $scope.spIndex = 0;
          }
          else {
            $scope.spIndex = $scope.rpIndextotal / $scope.spIndextotal;
            $scope.spIndex = $scope.spIndex.toFixed(2);
          }
          for(var i=0;i<response.data.data.length;i++){
            var object={
              "id":response.data.data[i].id,
              "storename":"STORE #"+storeid,
              "income":response.data.data[i].amt,
              "expenses":$scope.Cpdata[i].amt,
              "color": "#4C98CF",
              "color1": "#7F2891"
            }
              $scope.productchartdata.push(object);
          }
          $scope.makechart($scope.productchartdata);
        }, function (response) {
          console.log(response);
        }
      );
    }

    var data = {
      "aggTimeUnit": "1d",
      "startTime": $scope.ComparestartDate,
      "endTime": $scope.Compareenddate,
      "bucketLevel" : "S"
    }
    dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
        $scope.spIndextotal = parseFloat(response.data.total);
       // console.log("for compare time...",response.data);
        $scope.Cpdata=response.data.data;
        $scope.SalesPerformanceByStoreIdbyRT();
      }, function (response) {
        console.log(response);
      }
    );
  }

  $scope.gotostore=function(sid,dataflag){
    $scope.selectedproducts=[];
        $scope.selectedvalue="west";
        $scope.selectoption='west';
        console.log("sid...",sid);
        if(dataflag=='withmap'){
          var newObject={
            "amount":sid.amount,
            "retailer":sid.retailer,
            "storeId":sid.storeId,
            "storeLongLat":sid.storeLongLat,
            "storeName":sid.storeName,
            "content":"STORE NO. "+sid.storeName,
            "retailerId":sid.retailerId.toString()
          }
          //console.log('withmap value :',sid);
          $state.go('storeComparision',{id: sid.id,storedata: newObject});
        }else {
        //console.log("store date...",$scope.storeData);
        var results=$filter('filter')($scope.storeData,{storeId:sid.storeId.toString()},true);
        //console.log('results :',results);
         if(results.length>0){
          sid.amount=results[0].amount;
          sid.storeName=results[0].storeName;
          sid.storeLongLat=results[0].storeLongLat;
         }
         //console.log("without map...",sid);
          $state.go('storeComparision', {id: sid.id,storedata: sid});
        }

        dashBoardService.settopstorecomparisionstatus(true);
    //$scope.selectedproducts=[];
    
   /* sessionStorage.storeId = parseInt($scope.id);
    $scope.SalesPerformanceByStoreId($scope.id);

     for(var i=0;i<$scope.storeList.length;i++){
       if($scope.storeList[i].id==$scope.id){
         $scope.storeList[i].status='minus';
       }
     }*/

  }

      var getstoredata;
      getstoredata=$rootScope.$on('getstoredata', function (event, data) {
       $scope.gotostore(data,'withOutMap value');
      });

        $scope.selectedgraph ='bar';
  $scope.selectgraph=function (graph) {

    $scope.selectedgraph =graph;
    if($scope.selectedgraph =='line'){
    }else if($scope.selectedgraph =='bar'){
    }
    else
    {
    }
  }


         /************* distributor login api calls ***********/

           $scope.BrandsList=[];
           $scope.BrandIdsList=[];
           $scope.allstoresList=[];
        $scope.getDistributorBrands=function(){
        dashBoardService.getDistributorBrands().then(function(response){
        
        for(var i=0;i<response.data.length;i++){
        $scope.BrandsList.push(response.data[i]);
        $scope.BrandIdsList.push(response.data[i].brand_id);
        }

        for(var i=0;i<$scope.BrandsList.length;i++){
        $scope.BrandsList[i].brand_name=$scope.BrandsList[i].brand_name.toUpperCase();
        }
        
        $scope.selectedBrand=$scope.BrandsList[0];
        $scope.selectedBrandId=$scope.BrandsList[0].brand_id;
        dashBoardService.setBrandidList($scope.BrandIdsList);

        $scope.brandportalApicalls();

        },function(response){
           console.log("error msg..",response);
        });
        }

        $scope.geosalesDataforDistributor=function(){
               var data={
                   "startTime": $scope.ReportstartDate,
                   "endTime": $scope.Reportenddate,
                   "geoLevel" : 1,
                   "filters" :{
                   "items.brandId" :$scope.BrandIdsList
                   }
                 }
                 $scope.showmap=false;
                 $scope.geoSalesData=undefined;
                 dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
                $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storeData=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
              $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
        dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;

              var statesData=$scope.geoSalesData[0];

               for(var k=0;k<statesData.states.length;k++){
             var  data=statesData.states[0];
              //console.log("data[k]...",data);
              for(j =0;j<data.cities.length;j++) {
              for(i =0;i<data.cities[j].stores.length;i++){
                     $scope.storeData.push(data.cities[j].stores[i]);
                    //console.log("stores...",data.cities[j].stores[i]);

              }
            }
          }
              }, function (response) {
               console.log(response);
             }
             );
            }


            $scope.topSalesRegionsfordistributor=function(){
          $scope.topregionsbyRTfordistributor=function(){
           var data={
                    "startTime": $scope.ReportstartDate,
                   "endTime": $scope.Reportenddate,
                  "geoLevel" : 2,
                   "filters" :{
                  "items.brandId" :$scope.BrandIdsList
                   }
                }
                $scope.showbarchart=false;
                 $scope.topsalesregionchart=false;
          dashBoardService.getsalesbyBrands(data).then(function(response) {
             $scope.topregions=[];
             $scope.topregionbarchartdata=[];
             $scope.salesregionchartid = dashBoardService.generateguid();
              dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
              $scope.regionsbyRT=response.data.data[j].regions;

               for(var i=0;i<$scope.regionsbyRT.length;i++){

        if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
             $scope.salesregionindex=0.00;

              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }

                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";

                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

                  }
            $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
              else{
                $scope.topregionchartid = dashBoardService.generateguid();
      
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                $scope.salesregionindex=0.00;
                $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

                  }

                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };

              $scope.topregionbarchartdata.push(salesregionobject) 
                }
               }
             }
               $scope.showbarchart=true;
                $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }

               var salesregiondataCT={
              "startTime": $scope.ComparestartDate,
              "endTime": $scope.Compareenddate,
              "geoLevel" : 2,
              "filters" :{
                 "items.brandId" :$scope.BrandIdsList
              }
               }
          dashBoardService.getsalesbyBrands(salesregiondataCT).then(function (response) {
             $scope.regionsbyCT=response.data.data[0].regions;
             $scope.topregionsbyRTfordistributor();
             
               }, function (response) {
                 console.log(response);
               }
               );
            }

    $scope.salespperformancebyallstoresfordistributor=function(){
    $scope.salespperformancebyallstoresbyRTfordistributor=function(){      
      var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S",
                "filters" :{
                "items.brandId" :$scope.BrandIdsList
                   }
               }
          $scope.topstoreschart=false;
        dashBoardService.getstoresbyBrands(data).then(function (response) {
        $scope.topstoresList=[];
        
        dashBoardService.settopstoresmaxvalue(0);
         
        $scope.topstoresListbyRT=response.data.data;
         
        $scope.topstoreschartid =dashBoardService.generateguid();
         
        for(var i=0;i<$scope.topstoresListbyRT.length;i++){
        if(i<5){
        
        for(var j=0;j<$scope.allstoresList.length;j++){
        
        if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
        
        if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
            $scope.topstoresindex=0.00;
        if($scope.topstoresListbyRT[i].amt){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
          }
        if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
        }
        else{
            $scope.labelcolor="red";
            $scope.arrow="\u2193";
        }
        var retailerfound=$filter('filter')($scope.storesByRetailer, 
          {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                  var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
               else{
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }

                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);

                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;

                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id

                        };
               $scope.topstoresList.push(topstoresobject);
               }
             }
             }
           }
             }
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
             }
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "items.brandId" :$scope.BrandIdsList
                   }
               }
               dashBoardService.getstoresbyBrands(data).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.salespperformancebyallstoresbyRTfordistributor();
            }, function (response) {
             console.log(response);
           }
           );
          }

            $scope.brandportalApicalls=function(){

               $scope.geosalesDataforDistributor();
               $scope.topSalesRegionsfordistributor();
               $scope.salespperformancebyallstoresfordistributor();
            }


         /************* end of distributor login api calls *******/

      /************************* start DATEpicker *****************/

      //dateRangePicker for CompareTimePeriod

      $scope.data={
       selectedStoreId:''
      }

      $scope.comparestart=  dashBoardService.getcomparestartdate();
      if($scope.comparestart==undefined){

       /* var Reportenddate = moment("2016-11-30");
        var ReportstartDate = moment("2016-11-01");
        //  var compareEnd=moment(end).subtract(1,'year');
        //  var compareStart=moment(start).subtract(1,'year');

         var compareEnd = moment(Reportenddate).subtract(1,'year');
         var compareStart = moment(ReportstartDate).subtract(1,'year');
*/

var ReportstartDate= moment().subtract(7, 'days');
    var Reportenddate=moment().subtract(1, 'days');
  var  compareEnd=moment(ReportstartDate).subtract(1,'days');
  var  compareStart=moment(ReportstartDate).subtract(7,'days');
    //compareEnd=moment(end).subtract(1,'year');
    //compareStart=moment(start).subtract(1,'year');
      }
      else{
        var compareStart= dashBoardService.getcomparestartdate();
          var compareEnd=dashBoardService.getcompareenddate();
        var ReportstartDate=  dashBoardService.getreportstartdate();
          var Reportenddate=dashBoardService.getreportenddate();
      }

      var start = moment(compareStart);
      var end = moment(compareEnd);
      function cmpare(start, end) {

        startDate = start;
        endDate = end;

        compareStart=start;
        compareEnd=end;


    dashBoardService.setcomparestartdate(start);
    dashBoardService.setcompareenddate(end);
    dashBoardService.setreportstartdate(ReportstartDate);
    dashBoardService.setreportenddate(Reportenddate);

    //  dashBoardService.setstatus(false);

        $scope.ComparestartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
        $scope.Compareenddate = end.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.compareTimePeriod = start.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');
        $scope.$applyAsync();

        if($scope.role=="cpg"){
            $scope.salespperformancebyallstoresforcpg();
            $scope.geosalesDataforCpg();
            $scope.topSalesRegionsforcpg();
            //$scope.topregionsbarchartfunction();
          }
          else if($scope.role=="retailer"){
            $scope.salespperformancebyallstores();
            $scope.geosalesData();
            $scope.topSalesRegions();
            //$scope.topregionsbarchartfunction();
          }
          else if($scope.role=="distributor"){
            $scope.brandportalApicalls();
          }
      }

      function cmpareinit(start, end) {

            startDate = start;
            endDate = end;

            compareStart=start;
            compareEnd=end;


            dashBoardService.setcomparestartdate(start);
            dashBoardService.setcompareenddate(end);
            dashBoardService.setreportstartdate(ReportstartDate);
            dashBoardService.setreportenddate(Reportenddate);

            $scope.ComparestartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
            $scope.Compareenddate = end.format('YYYYMMDD') + 'T235959.000-0000';
            $scope.SalesDataComparestartDate = start.format('YYYYMMDD') + 'T000000.000-0000';

            $scope.compareTimePeriod = start.format('MMM DD YYYY') + " - " + endDate.format('MMM DD YYYY');
            $scope.totalcomparetime=end.format('MMM Do YYYY')+"-"+end.format('MMM Do YYYY');

            $scope.$applyAsync();
          }
            end = moment(compareEnd);
            start = moment(compareStart);

      $scope.setcomparetimeforproduct=function(){

     end = moment(compareEnd);
          start = moment(compareStart);
      $('input[name="daterange"]').daterangepicker(
        {
          maxDate: new Date(),
          "opens":"left",
          locale: {
            format: 'MM/DD/YYYY'
          },
          startDate: start,
          endDate: end
        }
        , cmpare);

    }
   $timeout(function() {
    $scope.setcomparetimeforproduct();
   }, 10);
      cmpareinit(start, end);

      var startDate;
      var endDate;

      //DateRangePicker for ReportTime Period

      // DateRangePicker for ReportTime Period

      var startDate;
      var endDate;

      var end = moment(Reportenddate);
      var start = moment(ReportstartDate);

      function daterangepickerCallBacks(start, end,label) {
        $timeout(function() {
            $('#reportrange1 span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
            $('#reportrange1').data('daterangepicker').setStartDate(start);
            $('#reportrange1').data('daterangepicker').setEndDate(end);
          }, 10);
        startDate = start;
        endDate = end;

        ReportstartDate= start;
        Reportenddate=end;

    dashBoardService.settimeperiodlabel(label);
      

          /*compareEnd=moment(end).subtract(1,'year');
    compareStart=moment(start).subtract(1,'year');

  cmpareinit(compareStart,compareEnd);
    $scope.setcomparetimeforproduct();
*/


              if(label=="Last week"){
              if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);
              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[0];
            }
            else if(label=="This Month"){
               if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);
              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[1];
            }
            else if(label=="Last Month"){
               if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);
              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[2];
            }
        else if(label=="Quarter 1 (Jan-Mar)"){
               if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);
              }
              $scope.selectedtimeperiod=$scope.reporttimeranges[3];
            }
         else if(label=="Custom Range"){
          if($scope.reporttimeranges[7]==undefined){
                var obj={"name":"CUSTOM"}
                 $scope.reporttimeranges.push(obj);
             }
              $scope.selectedtimeperiod=$scope.reporttimeranges[7];
            }

          if($scope.selectedtimeperiod.name=="LAST 7 DAYS"){
          if($scope.lastsevendays==true){
          $scope.lastsevendays=false;
          compareEnd=moment(start).subtract(1,'days');
         compareStart=moment(start).subtract(7,'days');
        cmpareinit(compareStart,compareEnd);
          $timeout(function() {
          $scope.setcomparetimeforproduct();
          }, 10);
            }
            else{
compareEnd=moment(end).subtract(1,'year');
    compareStart=moment(start).subtract(1,'year');

   cmpareinit(compareStart,compareEnd);
        $timeout(function() {
          $scope.setcomparetimeforproduct();
          }, 10);
            }
          }
          else{

             compareEnd=moment(end).subtract(1,'year');
    compareStart=moment(start).subtract(1,'year');
   cmpareinit(compareStart,compareEnd);
       $timeout(function() {
          $scope.setcomparetimeforproduct();
          }, 10);

          }
     
    dashBoardService.setdashboardcacheStaus(false);
    dashBoardService.setproductscacheStatus(false);
    dashBoardService.setsalesregioncacheStatus(false);

       dashBoardService.setcomparestartdate(compareStart);
       dashBoardService.setcompareenddate(compareEnd);
       dashBoardService.setreportstartdate(start);
       dashBoardService.setreportenddate(end);

        //$scope.ReportstartDate = startDate;
        //$scope.Reportenddate = endDate;

        //  dashBoardService.setstatus(false);

          $scope.ReportstartDate = start;
          $scope.Reportenddate = end;
          $scope.ReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.Reportenddate = end.format('YYYYMMDD') + 'T235959.000-0000';

        var ReportstartDate = start.format('YYYYMMDD') + 'T000000.000-0000';
        var Reportenddate = end.format('YYYYMMDD') + 'T235959.000-0000';

        $scope.ReportTimePeriod = start.format('MMM DD YYYY') + ' - ' + end.format('MMM DD YYYY');
        $scope.$applyAsync();

        if($scope.role=="cpg"){
            $scope.salespperformancebyallstoresforcpg();
            $scope.geosalesDataforCpg();
            $scope.topSalesRegionsforcpg();
            //$scope.topregionsbarchartfunction();
          }
          else if($scope.role=="retailer"){
            $scope.salespperformancebyallstores();
            $scope.geosalesData();
            $scope.topSalesRegions();
            //$scope.topregionsbarchartfunction();
          }
          else if($scope.role=="distributor"){
            $scope.brandportalApicalls();
          }
      }

      function daterangepickerCallBackInit(startdate, enddate) {
        $timeout(function() {
          $('#reportrange1 span').html(startdate.format('MM/DD/YYYY') + ' - ' + enddate.format('MM/DD/YYYY'));
        }, 10);  
          startDate = startdate;
          endDate = enddate;

          ReportstartDate=startdate;
          Reportenddate=enddate;

          window.localStorage['comparetimestart']=compareStart;
          window.localStorage['comparetimeend']=compareEnd;
          window.localStorage['reporttimestart']=startdate;
          window.localStorage['reporttimeend']=enddate;

          dashBoardService.setcomparestartdate(compareStart);
          dashBoardService.setcompareenddate(compareEnd);
          dashBoardService.setreportstartdate(startdate);
          dashBoardService.setreportenddate(enddate);
          $scope.ReportstartDate = startDate;
          $scope.Reportenddate = endDate;
          $scope.SalesDataReportstartDate = startdate.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.ReportstartDate = startdate.format('YYYYMMDD') + 'T000000.000-0000';
          $scope.Reportenddate = enddate.format('YYYYMMDD') + 'T235959.000-0000';
          $scope.ReportTimePeriod = startdate.format('MMM DD YYYY') + ' - ' + enddate.format('MMM DD YYYY');
          $scope.totalreporttime=startdate.format('MMM Do YYYY')+"-"+enddate.format('MMM Do YYYY');

        }

        if(dashBoardService.gettimeperiodlabel()==undefined){
      dashBoardService.settimeperiodlabel("Last week");
     }

     $timeout(function() {
      $('#reportrange1').daterangepicker({
         maxDate: new Date(),
        startDate: start,
        endDate: end,
        "autoUpdateInput": false,
        "opens":"center",
        ranges: {
          'This Month': [moment().startOf('month'), moment().subtract(1,'days')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'Quarter 1 (Jan-Mar)': [moment().startOf('year').startOf('month'), moment().startOf('year').add(2, 'month').endOf('month')],
          'Quarter 2 (Apr-jun)': [moment().startOf('year').add(3, 'month').startOf('month'), moment().startOf('year').add(5, 'month').endOf('month')],
          'Quarter 3 (Jul-sep)': [moment().startOf('year').add(6, 'month').startOf('month'), moment().startOf('year').add(8, 'month').endOf('month')]
        }
      }, daterangepickerCallBacks)}, 10);

      daterangepickerCallBackInit(start, end);

      /**************************** END DATEPICKER  ***************************************/

      /*  */

      $scope.sign = "+";
      $scope.selectedStoreList = [];

      $scope.selectedStore = function (menuitem, data) {
        $scope.datasign = data;
        //console.log($scope.datasign);
        if ($scope.datasign == 'pluse') {
          $scope.selectedmenuitem = menuitem;
          if ($scope.selectedmenuitem == 'Store #3') {
            $scope.selectoption = menuitem;
          }
          //console.log("inside +");
          //console.log($scope.selectedmenuitem);
          // $scope.datasign="minus"
          $scope.sign = "-";
        }
        if ($scope.datasign == 'minus') {
          $scope.selectedmenuitem = menuitem;
         // console.log("inside -");
         // console.log($scope.selectedmenuitem);
          //  $scope.datasign="pluse"
          $scope.sign = "+";
        }
      }
      /*  */
      $scope.getRecord = function (id) {
          $scope.selectedStoreId=id;
          $scope.data.selectedStoreId=id;
      if($scope.data.selectedStoreId == "" || $scope.data.selectedStoreId=="ALL STORES") {
      dashBoardService.setstoreid("");
      dashBoardService.setdashboardcacheStaus(false);
      dashBoardService.setproductscacheStatus(false);
      dashBoardService.setsalesregioncacheStatus(false);
        }
        else {
          dashBoardService.setdashboardcacheStaus(false);
          dashBoardService.setproductscacheStatus(false);
          dashBoardService.setsalesregioncacheStatus(false);
          dashBoardService.setstoreid(  $scope.data.selectedStoreId);
          $scope.storeId =  $scope.data.selectedStoreId;
          sessionStorage.storeId = $scope.storeId;
        }
      }

      $scope.topStoreid=$stateParams.storedata;
     // console.log("state params....",$scope.topStoreid);
      $scope.topstorestatus= dashBoardService.gettopstorecomparisionstatus();
      if($scope.topstorestatus==true){
      //  $scope.salespperformancebyallstores();
        /*if($scope.topStoreid.id!=undefined||$scope.topStoreid.id!=null){

          $timeout(function() {
          $scope.gotostore($scope.topStoreid);
        },1000);

        }*/
      }
      $scope.role=sessionStorage.role;

        $scope.selectedtimeperiod={};
        $scope.reporttimeranges=[
                              {"name":"LAST 7 DAYS"},
                              {"name":"THIS MONTH"},
                              {"name":"LAST MONTH"},
                              {"name":"QUARTER 1 2017"},
                              {"name":"QUARTER 2 2017"},
                              {"name":"QUARTER 3 2017"},
                              {"name":"QUARTER 4 2017"}
                              ];
        $scope.selectedtimeperiod=$scope.reporttimeranges[0];
        $scope.timeperiodlabel=dashBoardService.gettimeperiodlabel();
        if($scope.timeperiodlabel){
        if($scope.timeperiodlabel=="Last week"){
        $scope.selectedtimeperiod=$scope.reporttimeranges[0];
        }
        else if($scope.timeperiodlabel=="This Month"){
        $scope.selectedtimeperiod=$scope.reporttimeranges[1];
        }
        else if($scope.timeperiodlabel=="Last Month"){
        $scope.selectedtimeperiod=$scope.reporttimeranges[2];
        }
        else if($scope.timeperiodlabel=="Custom Range"){
        if($scope.reporttimeranges[7]==undefined){
        var obj={"name":"CUSTOM"}
        $scope.reporttimeranges.push(obj);
        }
        $scope.selectedtimeperiod=$scope.reporttimeranges[7];
        }
        else if($scope.timeperiodlabel=="Quarter 1 (Jan-Mar)"){
        $scope.selectedtimeperiod=$scope.reporttimeranges[3];
        }
             else if($scope.timeperiodlabel=="Quarter 2 (Apr-jun)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[4];
            }
             else if($scope.timeperiodlabel=="Quarter 3 (Jul-sep)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[5];
            }
            else if($scope.timeperiodlabel=="Quarter 4 (Oct-Dec)"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[6];
            }
            }
            else{
               $scope.selectedtimeperiod=$scope.reporttimeranges[0];
            }
            
             $scope.timerange=function(value){
                if($scope.reporttimeranges.indexOf(7)){
                 $scope.reporttimeranges.splice(7, 1);
                }
            if(value.name=="LAST 7 DAYS"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[0];
              $scope.lastsevendays=true;
              $scope.starttime=moment().subtract(7,'days');
              $scope.endtime=moment().subtract(1,'days');
              daterangepickerCallBacks($scope.starttime,$scope.endtime,"Last week");
            }
            else if(value.name=="THIS MONTH"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[1];
              $scope.starttime=moment().startOf('month');
              $scope.endtime=moment().subtract(1,'days');
              daterangepickerCallBacks($scope.starttime,$scope.endtime,"This Month");
            }
            else if(value.name=="LAST MONTH"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[2];
              $scope.starttime=moment().subtract(1,'month').startOf('month');
              $scope.endtime=moment().subtract(1,'month').endOf('month');
              daterangepickerCallBacks($scope.starttime,$scope.endtime,"Last Month");
            }
            else if(value.name=="QUARTER 1 2017"){
            $scope.selectedtimeperiod=$scope.reporttimeranges[3];
            $scope.starttime=  moment().startOf('year').startOf('month');
            $scope.endtime= moment().startOf('year').add(2, 'month').endOf('month');
            daterangepickerCallBacks($scope.starttime,$scope.endtime,"Quarter 1 (Jan-Mar)");
            }
            else if(value.name=="QUARTER 2 2017"){
              $scope.selectedtimeperiod=$scope.reporttimeranges[4];
              $scope.starttime=moment().startOf('year').add(3, 'month').startOf('month'); 
              $scope.endtime=moment().startOf('year').add(5, 'month').endOf('month');
           daterangepickerCallBacks($scope.starttime,$scope.endtime,"Quarter 2 (Apr-jun)");
            }
            else if(value.name=="QUARTER 3 2017"){
           $scope.selectedtimeperiod=$scope.reporttimeranges[5];
           $scope.starttime=moment().startOf('year').add(6, 'month').startOf('month');
           $scope.endtime=moment().startOf('year').add(8, 'month').endOf('month');
           daterangepickerCallBacks($scope.starttime,$scope.endtime,"Quarter 3 (Jul-sep)");
            }
            else if(value.name=="QUARTER 4 2017"){
            $scope.selectedtimeperiod=$scope.reporttimeranges[6];
            $scope.starttime=moment().startOf('year').add(9, 'month').startOf('month');
            $scope.endtime=moment().subtract(1,'days');;
           daterangepickerCallBacks($scope.starttime,$scope.endtime,"Quarter 4 (Oct-Dec)");
            }
          }

         $scope.exportCharts=function(){
          var pdfevent={}
         $rootScope.$emit('pdfevent', pdfevent);
         }



        // ...................Brand api call for CPG....................

         $scope.CPGBrandsList=[
          {
            "brand_id":"",
            "brand_name":"All Brands"
           }];

           $scope.CPGBrandIdsList=[];
        
            $scope.getCPGBrands=function(){
        dashBoardService.getBrandsforCPG().then(function(response){
     
        for(var i=0;i<response.data.length;i++){

        $scope.CPGBrandsList.push(response.data[i]);
        //$scope.BrandIdsList.push(response.data[i].brandid);
          //console.log("BrandsList......", $scope.CPGBrandsList);
        if($scope.brandId){
          $scope.brandId=$scope.brandId+","+response.data[i].brandid;
        }
        else{
          $scope.brandId=response.data[i].brandid;
        }
        }

        sessionStorage.brandIdsList=$scope.brandId;

        for(var i=0;i<$scope.CPGBrandsList.length;i++){
        $scope.CPGBrandsList[i].brand_name=$scope.CPGBrandsList[i].brand_name;
        }
        
        $scope.selectedBrand=$scope.CPGBrandsList[0];
        $scope.selectedBrandId=$scope.CPGBrandsList[0].brandid;
        dashBoardService.saveselectedBrand($scope.selectedBrand);
       // dashBoardService.setBrandidList($scope.BrandIdsList);
        
        $scope.savedBrand=dashBoardService.getselectedBrand();

        if($scope.savedBrand!=null){
        
        if($scope.savedBrand.brand_name!="All Brands"){
        for(var i=0;i<$scope.CPGBrandsList.length;i++){

        if($scope.savedBrand.brandid==$scope.CPGBrandsList[i].brandid){
         $scope.selectedBrand=$scope.CPGBrandsList[i];
          $scope.selectedBrandId=$scope.savedBrand.brandid;
        }
        }
        }
        }
        else{
            dashBoardService.saveselectedBrand($scope.selectedBrand);
        }
        //$scope.brandportalApicallsforCPG();
        },function(response){
           console.log("error msg..",response);
        });
        }

      $scope.brandChange=function(brand){
          console.log("brand",brand);
          $scope.selectedBrand=brand;
           $scope.selecteRecord=dashBoardService.getselectedrecordfromdropdown();
          dashBoardService.saveselectedBrand($scope.selectedBrand);
          $scope.selectedBrandId=brand.brand_id; 
          if($scope.selectedBrand.brand_name =="All Brands"){
             if($scope.ctrl.selected.name == "All Retailers" && $scope.dma == ""){
              $scope.salespperformancebyallstoresforcpg();
               $scope.geosalesDataforCpg();
               $scope.topSalesRegionsforcpg();
            }
          }
         else{
          if($scope.ctrl.selected.name == "All Retailers" && $scope.dma == ""){
              $scope.geosalesDataforCpgwithBRAND();
              $scope.topSalesRegionsforcpgwithBRANDS();
              $scope.salespperformancebyallstoresforcpgwithBRAND();
          }else if($scope.ctrl.selected.name !== "All Retailers" && $scope.dma == ""){
               if($scope.selecteRecord.hasOwnProperty("children")){
                  sessionStorage.retailerId=$scope.retailerId;
                  $scope.geosalesDataforretailerwithBRAND();
                  $scope.topSalesRegionsforretailerwithBRANDS();
                  $scope.salespperformancebyretailerforcpgwithBRAND();
               }else{
                  $scope.salespperformancebyStoreforcpgwithBRAND();
                  $scope.topSalesRegionsforStorewithBRANDS();
                  $scope.geosalesDataforStorewithBRAND();
               }                  
          }else{
                 $scope.salespperformancebyDMAwithBRAND();
                 $scope.topSalesRegionsforDMAwithBRANDS();
                 $scope.geosalesDataforDMAwithBRAND();
             }

      }
    }
       
    

    // ....................DMA List for CPG...................


         $scope.dmaStoreList=[];
          $scope.dma=""
          $scope.getDmaList=function(value){
            sessionStorage.DMAsuggest = value;
              return dashBoardService.getDMAforCPG().then(function(response){
              $scope.dmaList=[];
              for(var i=0;i<response.data.length;i++){
              var dma={
                    //"id":$scope.id,
                    "name":response.data[i].dma_name,
                    "dmaId":response.data[i].dma_id,
                    "stores":response.data[i].stores
              }              
               $scope.dmaList.push(dma);
              
             }

               console.log("dmaListforCPG....",$scope.dmaList);
               return $scope.dmaList;
               $scope.dma=dashBoardService.getselectedDMA();
               console.log(" $scope.dma", $scope.dma);
             
              },function(error){
              });
             }

       
       $scope.selectDMA=function(value){
          $scope.ctrl.selected = {              
                "id": 1,
                "name": "All Retailers",
                "retailerId":"All Retailers"
              
            };
              dashBoardService.setsavestoreselected($scope.ctrl.selected);
              $scope.dmaStoreList=[];
              console.log("Dma selected",value);
              dashBoardService.saveselectedDMA(value);
              for(var i=0; i< $scope.dmaList.length; i++){
                if(value == $scope.dmaList[i].name){
                  for(var j=0; j< $scope.dmaList[i].stores.length;j++){
                    $scope.dmaStoreList.push($scope.dmaList[i].stores[j].toString());
                     sessionStorage.DMAID=$scope.dmaList[i].dmaId;
                     dashBoardService.saveselectedDMA($scope.dmaList[i]);
                   }
                }
              }
         
              $scope.dma=value;             
               console.log("selectedBrand",$scope.selectedBrand);
               console.log("ctrl.selected",$scope.RetailerIds);
               $scope.retailerId=$scope.ctrl.selected.retailerId;
               if($scope.selectedBrand.brand_name =="All Brands"){
                  $scope.salespperformancebyDMA();
                 $scope.topSalesRegionsforDMA();
                 $scope.geosalesDataforDMA();
                                                   
               }else{
                 $scope.salespperformancebyDMAwithBRAND();
                 $scope.topSalesRegionsforDMAwithBRANDS();
                 $scope.geosalesDataforDMAwithBRAND();
             }

         }





     $scope.getcpgrecord = function() {
       document.getElementById("dmaValue").value ="";
         $scope.dma="";
          dashBoardService.saveselectedDMA(null);
          $scope.selecteRecord=dashBoardService.getselectedrecordfromdropdown();

         // console.log("BrandSelected",$scope.BrandIdsList);
      if($scope.selecteRecord.name=="All Retailers"){
         if($scope.selectedBrand.brand_name =="All Brands"){
               $scope.salespperformancebyallstoresforcpg();
               $scope.geosalesDataforCpg();
               $scope.topSalesRegionsforcpg();
                    
           }else{
              $scope.geosalesDataforCpgwithBRAND();
              $scope.topSalesRegionsforcpgwithBRANDS();
              $scope.salespperformancebyallstoresforcpgwithBRAND();      
           }
         }
         else{
          if($scope.selecteRecord.hasOwnProperty("children")){
            // Retailer selected..........
            sessionStorage.user=$scope.selecteRecord.retailerId;
            $scope.retailerid=$scope.selecteRecord.retailerId;           
            if($scope.selectedBrand.brand_name =="All Brands"){
                  $scope.geosalesDataforretailer();
                  $scope.topSalesRegionsforretailer();
                  $scope.salespperformancebyretailerforcpg(); 
                    
            }else{
                  $scope.geosalesDataforretailerwithBRAND();
                  $scope.topSalesRegionsforretailerwithBRANDS();
                  $scope.salespperformancebyretailerforcpgwithBRAND();                              
           }
         }
          else{
            // store selected..............
            sessionStorage.user=$scope.selecteRecord.retailerId;
            $scope.storeId = $scope.selecteRecord.storeid;
            sessionStorage.storeId = $scope.storeId;
             if($scope.selectedBrand.brand_name =="All Brands"){
                  $scope.salespperformancebyStoreforcpg();
                  $scope.topSalesRegionsforStore();
                  $scope.geosalesDataforStore();  
                 
          }else{
                  $scope.salespperformancebyStoreforcpgwithBRAND();
                  $scope.topSalesRegionsforStorewithBRANDS();
                  $scope.geosalesDataforStorewithBRAND();   
            } 
          }
        }
         
      };




  // API integration for all retailer with brand...........

      $scope.geosalesDataforCpgwithBRAND=function(){
               var data={
                   "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 1,
                  "filters" :{
                    "retailerId" :$scope.RetailerIds,
                    "item.mfgId" : [$scope.mfgId],
                    "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                 }
                 $scope.showmap=false;
                 $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
               $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                  $scope.storeData=[];
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
            dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              var statesData=$scope.geoSalesData[0];
              
              }, function (response) {
               console.log(response);
             }
             );
              }

       
    $scope.topSalesRegionsforcpgwithBRANDS=function(){
          $scope.topregionsbyRTforcpg=function(){
           var data={
                    "startTime": $scope.ReportstartDate,
                    "endTime": $scope.Reportenddate,
                    "geoLevel" : 2,
                    "filters" :{
                    "item.mfgId" : [$scope.mfgId],
                     "retailerId" : $scope.RetailerIds,
                     "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                   }
                $scope.showbarchart=false;
                 $scope.topsalesregionchart=false;
                dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
             $scope.topregions=[];
             $scope.topregionbarchartdata=[];
             $scope.salesregionchartid = dashBoardService.generateguid();
              dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
              $scope.regionsbyRT=response.data.data[j].regions;
               for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
             $scope.salesregionindex=0.00;
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
            $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                $scope.topregions.push(topregionobject);

                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
              else{
                $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                $scope.salesregionindex=0.00;
                $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                }
              else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

              }
                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
               }
             }
               $scope.showbarchart=true;
                $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }

               var salesregiondataCT={
              "startTime": $scope.ComparestartDate,
              "endTime": $scope.Compareenddate,
            "geoLevel" : 2,
            "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                   "retailerId" : $scope.RetailerIds,
                   "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                  }
          dashBoardService.getgeoSalesDataforCpg(salesregiondataCT).then(function (response) {
             $scope.showbarchart=false;
                $scope.topsalesregionchart=false;
                 $scope.topregions=[];
             $scope.regionsbyCT=response.data.data[0].regions;
             $scope.topregionsbyRTforcpg();
               }, function (response) {
                 console.log(response);
               }
               );
        }



       $scope.salespperformancebyallstoresforcpgwithBRAND=function(){
               $scope.salespperformancebyallstoresbyRTforcpg=function(){      
               var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
                "retailerId" : $scope.RetailerIds,
                "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
               }
                $scope.topstoreschart=false;
               dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
               $scope.topstoresList=[];
               // console.log("stores...",$scope.List);
              dashBoardService.settopstoresmaxvalue(0);
              $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
            if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
            }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
               else{
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
             }
             }
             }
             }
             //console.log("top store List...",$scope.topstoresList);
             //console.log("stores...",$scope.List);
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
             }
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "retailerId" : $scope.RetailerIds,
                  "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
               }
               dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.salespperformancebyallstoresbyRTforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }




// API integration for  retailer with brand...........

 $scope.geosalesDataforretailerwithBRAND=function(){
               var data={
                   "aggTimeUnit":"1d",
                   "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 1,
                  "filters" :{
                    "item.mfgId" : [$scope.mfgId],
                    "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                 }
                 $scope.showmap=false;
                 $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesData(data).then(function (response) {
               $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                  $scope.storeData=[];
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
            dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              var statesData=$scope.geoSalesData[0];
              
              }, function (response) {
               console.log(response);
             }
             );
              }


  $scope.topSalesRegionsforretailerwithBRANDS=function(){
          $scope.topregionsbyRTforcpg=function(){
           var data={
                   "aggTimeUnit":"1d",
                    "startTime": $scope.ReportstartDate,
                    "endTime": $scope.Reportenddate,
                    "geoLevel" : 2,
                    "filters" :{
                    "item.mfgId" : [$scope.mfgId],                    
                     "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                   }
                $scope.showbarchart=false;
                 $scope.topsalesregionchart=false;
                dashBoardService.getgeoSalesData(data).then(function (response) {
             $scope.topregions=[];
             $scope.topregionbarchartdata=[];
             $scope.salesregionchartid = dashBoardService.generateguid();
              dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
              $scope.regionsbyRT=response.data.data[j].regions;
               for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
             $scope.salesregionindex=0.00;
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
            $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                $scope.topregions.push(topregionobject);

                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
              else{
                $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                $scope.salesregionindex=0.00;
                $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                }
              else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

              }
                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
               }
             }
               $scope.showbarchart=true;
                $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }

               var salesregiondataCT={
                "aggTimeUnit":"1d",
              "startTime": $scope.ComparestartDate,
              "endTime": $scope.Compareenddate,
            "geoLevel" : 2,
            "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                   "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                  }
          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
             $scope.showbarchart=false;
                $scope.topsalesregionchart=false;
                 $scope.topregions=[];
             $scope.regionsbyCT=response.data.data[0].regions;
             $scope.topregionsbyRTforcpg();
               }, function (response) {
                 console.log(response);
               }
               );
        }


      $scope.salespperformancebyretailerforcpgwithBRAND=function(){
               $scope.salespperformancebyallstoresbyRTforcpg=function(){      
               var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
                "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
               }
                $scope.topstoreschart=false;
               dashBoardService.GetSalesPerformance(data).then(function (response) {
               $scope.topstoresList=[];
               // console.log("stores...",$scope.List);
              dashBoardService.settopstoresmaxvalue(0);
              $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
            if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
            }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
               else{
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
             }
             }
             }
             }
             //console.log("top store List...",$scope.topstoresList);
             //console.log("stores...",$scope.List);
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
             }
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
               }
               dashBoardService.GetSalesPerformance(data).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.salespperformancebyallstoresbyRTforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }



       // API integration for store with brand..............
          
       $scope.geosalesDataforStorewithBRAND=function(){
               var data={
                   "aggTimeUnit":"1d",
                   "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 1,
                  "filters" :{
                    "item.mfgId" : [$scope.mfgId],
                    "storeId" : [$scope.storeId.toString()],
                    "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                 }
                 $scope.showmap=false;
                 $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesData(data).then(function (response) {
               $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                  $scope.storeData=[];
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
            dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              var statesData=$scope.geoSalesData[0];
              
              }, function (response) {
               console.log(response);
             }
             );
              }


  $scope.topSalesRegionsforStorewithBRANDS=function(){
          $scope.topregionsbyRTforcpg=function(){
           var data={
                    "aggTimeUnit":"1d",
                    "startTime": $scope.ReportstartDate,
                    "endTime": $scope.Reportenddate,
                    "geoLevel" : 2,
                    "filters" :{
                    "item.mfgId" : [$scope.mfgId], 
                    "storeId" : [$scope.storeId.toString()],                   
                     "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                   }
                $scope.showbarchart=false;
                 $scope.topsalesregionchart=false;
                dashBoardService.getgeoSalesData(data).then(function (response) {
             $scope.topregions=[];
             $scope.topregionbarchartdata=[];
             $scope.salesregionchartid = dashBoardService.generateguid();
              dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
              $scope.regionsbyRT=response.data.data[j].regions;
               for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
             $scope.salesregionindex=0.00;
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
            $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                $scope.topregions.push(topregionobject);

                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
              else{
                $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                $scope.salesregionindex=0.00;
                $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                }
              else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

              }
                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
               }
             }
               $scope.showbarchart=true;
                $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }

               var salesregiondataCT={
                  "aggTimeUnit":"1d",
                  "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                  "geoLevel" : 2,
                  "filters" :{
                      "item.mfgId" : [$scope.mfgId],
                      "storeId" : [$scope.storeId.toString()],
                      "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                       }
                  }
          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
             $scope.regionsbyCT=response.data.data[0].regions;
             $scope.topregionsbyRTforcpg();
               }, function (response) {
                 console.log(response);
               }
               );
        }



   

      $scope.salespperformancebyStoreforcpgwithBRAND=function(){
               $scope.salespperformancebyallstoresbyRTforcpg=function(){      
               var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
                "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
               }
                $scope.topstoreschart=false;
               dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
               $scope.topstoresList=[];
               // console.log("stores...",$scope.List);
              dashBoardService.settopstoresmaxvalue(0);
              $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
            if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
            }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
               else{
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
             }
             }
             }
             }
             //console.log("top store List...",$scope.topstoresList);
             //console.log("stores...",$scope.List);
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
             }
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
               }
               dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.salespperformancebyallstoresbyRTforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }



      // Api integration for DMA with Brand.................  



$scope.geosalesDataforDMAwithBRAND=function(){
               var data={
                   "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 1,
                  "filters" :{
                    "storeId":$scope.dmaStoreList,
                    "item.mfgId" : [$scope.mfgId],
                    "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                 }
                 $scope.showmap=false;
                 $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
               $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                  $scope.storeData=[];
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
            dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              var statesData=$scope.geoSalesData[0];
              
              }, function (response) {
               console.log(response);
             }
             );
              }

       
$scope.topSalesRegionsforDMAwithBRANDS=function(){
          $scope.topregionsbyRTforcpg=function(){
           var data={
                    "startTime": $scope.ReportstartDate,
                    "endTime": $scope.Reportenddate,
                    "geoLevel" : 2,
                    "filters" :{
                    "item.mfgId" : [$scope.mfgId],
                     "storeId":$scope.dmaStoreList,
                     "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                   }
                $scope.showbarchart=false;
                 $scope.topsalesregionchart=false;
                dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
             $scope.topregions=[];
             $scope.topregionbarchartdata=[];
             $scope.salesregionchartid = dashBoardService.generateguid();
              dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
              $scope.regionsbyRT=response.data.data[j].regions;
               for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
             $scope.salesregionindex=0.00;
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
            $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                $scope.topregions.push(topregionobject);

                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
              else{
                $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                $scope.salesregionindex=0.00;
                $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                }
              else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

              }
                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
               }
             }
               $scope.showbarchart=true;
                $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }

               var salesregiondataCT={
                "startTime": $scope.ComparestartDate,
                "endTime": $scope.Compareenddate,
                "geoLevel" : 2,
                 "filters" :{
                   "item.mfgId" : [$scope.mfgId],
                   "storeId":$scope.dmaStoreList,
                   "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
                  }
          dashBoardService.getgeoSalesDataforCpg(salesregiondataCT).then(function (response) {
             $scope.showbarchart=false;
                $scope.topsalesregionchart=false;
                 $scope.topregions=[];
             $scope.regionsbyCT=response.data.data[0].regions;
             $scope.topregionsbyRTforcpg();
               }, function (response) {
                 console.log(response);
               }
               );
        }



       $scope.salespperformancebyDMAwithBRAND=function(){
               $scope.salespperformancebyallstoresbyRTforcpg=function(){      
               var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
               "storeId":$scope.dmaStoreList,
                "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
               }
                $scope.topstoreschart=false;
               dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
               $scope.topstoresList=[];
               // console.log("stores...",$scope.List);
              dashBoardService.settopstoresmaxvalue(0);
              $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
            if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
            }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
               else{
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
             }
             }
             }
             }
             //console.log("top store List...",$scope.topstoresList);
             //console.log("stores...",$scope.List);
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
             }
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                   "storeId":$scope.dmaStoreList,
                  "items.brandId" : [$scope.selectedBrand.brandid.toString()]
                   }
               }
               dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.salespperformancebyallstoresbyRTforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }




    // Api integration for DMA................

    $scope.geosalesDataforDMA=function(){
               var data={
                   "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 1,
                  "filters" :{
                    "storeId":$scope.dmaStoreList,
                    "item.mfgId" : [$scope.mfgId],
                     "retailerId" :$scope.RetailerIds,
                    
                   }
                 }
                 $scope.showmap=false;
                 $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
               $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                  $scope.storeData=[];
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
            dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              var statesData=$scope.geoSalesData[0];
              
              }, function (response) {
               console.log(response);
             }
             );
              }

       
$scope.topSalesRegionsforDMA=function(){
          $scope.topregionsbyRTforcpg=function(){
           var data={
                    "startTime": $scope.ReportstartDate,
                    "endTime": $scope.Reportenddate,
                    "geoLevel" : 2,
                    "filters" :{
                    "item.mfgId" : [$scope.mfgId],
                     "storeId":$scope.dmaStoreList,
                      "retailerId" :$scope.RetailerIds,
                    
                   }
                   }
                $scope.showbarchart=false;
                 $scope.topsalesregionchart=false;
                dashBoardService.getgeoSalesDataforCpg(data).then(function (response) {
             $scope.topregions=[];
             $scope.topregionbarchartdata=[];
             $scope.salesregionchartid = dashBoardService.generateguid();
              dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
              $scope.regionsbyRT=response.data.data[j].regions;
               for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
             $scope.salesregionindex=0.00;
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
            $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                $scope.topregions.push(topregionobject);

                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
              else{
                $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                $scope.salesregionindex=0.00;
                $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                }
              else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

              }
                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
               }
             }
               $scope.showbarchart=true;
                $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }

               var salesregiondataCT={
                "startTime": $scope.ComparestartDate,
                "endTime": $scope.Compareenddate,
                "geoLevel" : 2,
                 "filters" :{
                   "item.mfgId" : [$scope.mfgId],
                   "storeId":$scope.dmaStoreList,
                    "retailerId" :$scope.RetailerIds,
                  
                   }
                  }
          dashBoardService.getgeoSalesDataforCpg(salesregiondataCT).then(function (response) {
             $scope.showbarchart=false;
                $scope.topsalesregionchart=false;
                 $scope.topregions=[];
             $scope.regionsbyCT=response.data.data[0].regions;
             $scope.topregionsbyRTforcpg();
               }, function (response) {
                 console.log(response);
               }
               );
        }



       $scope.salespperformancebyDMA=function(){
               $scope.salespperformancebyallstoresbyRTforcpg=function(){      
               var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId],
                "storeId":$scope.dmaStoreList,
                "retailerId" :$scope.RetailerIds,
               
                   }
               }
                $scope.topstoreschart=false;
               dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
               $scope.topstoresList=[];
               // console.log("stores...",$scope.List);
              dashBoardService.settopstoresmaxvalue(0);
              $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
            if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
            }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
               else{
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
             }
             }
             }
             }
             //console.log("top store List...",$scope.topstoresList);
             //console.log("stores...",$scope.List);
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
             }
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId],
                  "storeId":$scope.dmaStoreList,
                  "retailerId" :$scope.RetailerIds,
    
                   }
               }
               dashBoardService.GetSalesPerformanceByAllRetailers(data).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.salespperformancebyallstoresbyRTforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }

// API integration for  retailer ...........

 $scope.geosalesDataforretailer=function(){
               var data={
                  "aggTimeUnit":"1d",
                   "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 1,
                  "filters" :{
                    "item.mfgId" : [$scope.mfgId]                   
                   }
                 }
                 $scope.showmap=false;
                 $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesData(data).then(function (response) {
               $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                  $scope.storeData=[];
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
            dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              var statesData=$scope.geoSalesData[0];
              
              }, function (response) {
               console.log(response);
             }
             );
              }


  $scope.topSalesRegionsforretailer=function(){
          $scope.topregionsbyRTforcpg=function(){
           var data={
                     "aggTimeUnit":"1d",
                    "startTime": $scope.ReportstartDate,
                    "endTime": $scope.Reportenddate,
                    "geoLevel" : 2,
                    "filters" :{
                    "item.mfgId" : [$scope.mfgId]                   
                     
                   }
                   }
                $scope.showbarchart=false;
                 $scope.topsalesregionchart=false;
                dashBoardService.getgeoSalesData(data).then(function (response) {
             $scope.topregions=[];
             $scope.topregionbarchartdata=[];
             $scope.salesregionchartid = dashBoardService.generateguid();
              dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
              $scope.regionsbyRT=response.data.data[j].regions;
               for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
             $scope.salesregionindex=0.00;
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
            $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                $scope.topregions.push(topregionobject);

                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
              else{
                $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                $scope.salesregionindex=0.00;
                $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                }
              else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

              }
                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
               }
             }
               $scope.showbarchart=true;
                $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }

               var salesregiondataCT={
                "aggTimeUnit":"1d",
              "startTime": $scope.ComparestartDate,
              "endTime": $scope.Compareenddate,
            "geoLevel" : 2,
            "filters" :{
                  "item.mfgId" : [$scope.mfgId]
                  
                   }
                  }
          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
          
              $scope.showbarchart=false;
                $scope.topsalesregionchart=false;
                 $scope.topregions=[];
           
             $scope.regionsbyCT=response.data.data[0].regions;
             $scope.topregionsbyRTforcpg();
         }, function (response) {
                 console.log(response);
               }
               );
        }


      $scope.salespperformancebyretailerforcpg=function(){
               $scope.salespperformancebyallstoresbyRTforcpg=function(){      
               var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId]
               
                   }
               }
                $scope.topstoreschart=false;
               dashBoardService.GetSalesPerformance(data).then(function (response) {
               $scope.topstoresList=[];
               // console.log("stores...",$scope.List);
              dashBoardService.settopstoresmaxvalue(0);
              $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
            if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
            }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
               else{
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
             }
             }
             }
             }
             //console.log("top store List...",$scope.topstoresList);
             //console.log("stores...",$scope.List);
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
             }
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId]
               
                   }
               }
               dashBoardService.GetSalesPerformance(data).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.salespperformancebyallstoresbyRTforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }


      
       // API integration for store..............
          
       $scope.geosalesDataforStore=function(){
               var data={
                   "aggTimeUnit":"1d",
                   "startTime": $scope.ReportstartDate,
                  "endTime": $scope.Reportenddate,
                  "geoLevel" : 1,
                  "filters" :{
                    "item.mfgId" : [$scope.mfgId],
                    "storeId" : [$scope.storeId.toString()]
                    
                   }
                 }
                 $scope.showmap=false;
                 $scope.geoSalesData=undefined;
                dashBoardService.getgeoSalesData(data).then(function (response) {
               $scope.topStoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                 };
                  $scope.storeData=[];
                 $scope.topstores=[];
                 $scope.storeList=[];
                 $scope.storesformap=[];
                 $scope.geoSalesData=response.data.data;
                 $scope.reporttimeforGeosalesregion={
                  "reportstartTime":$scope.ReportstartDate,
                  "reportendTime":$scope.Reportenddate
                 }
            dashBoardService.setreportTime($scope.reporttimeforGeosalesregion);
              $scope.showmap=true;
              var statesData=$scope.geoSalesData[0];
              
              }, function (response) {
               console.log(response);
             }
             );
              }


  $scope.topSalesRegionsforStore=function(){
          $scope.topregionsbyRTforcpg=function(){
           var data={
                    "aggTimeUnit":"1d",
                    "startTime": $scope.ReportstartDate,
                    "endTime": $scope.Reportenddate,
                    "geoLevel" : 2,
                    "filters" :{
                    "item.mfgId" : [$scope.mfgId], 
                    "storeId" : [$scope.storeId.toString()]                   
                     
                   }
                   }
                $scope.showbarchart=false;
                 $scope.topsalesregionchart=false;
                dashBoardService.getgeoSalesData(data).then(function (response) {
             $scope.topregions=[];
             $scope.topregionbarchartdata=[];
             $scope.salesregionchartid = dashBoardService.generateguid();
              dashBoardService.setsalesregionmaxvalue(0);
            for(var j=0;j<response.data.data.length;j++){
              $scope.regionsbyRT=response.data.data[j].regions;
               for(var i=0;i<$scope.regionsbyRT.length;i++){
            if($scope.regionsbyRT[i]&&$scope.regionsbyCT[i]){
             $scope.salesregionindex=0.00;
              if($scope.regionsbyRT[i].amount){
             $scope.salesregionindex=$scope.regionsbyRT[i].amount/$scope.regionsbyCT[i].amount;
            $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                  }
                   if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
            $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,
                }
                $scope.topregions.push(topregionobject);

                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=$scope.regionsbyCT[i].amount;
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
              else{
                $scope.topregionchartid = dashBoardService.generateguid();
                var topregionobject={
                  "region":$scope.regionsbyRT[i].region,
                  "amt":$scope.regionsbyRT[i].amount,
                  "id":$scope.topregionchartid,
                  "reportstartTime": $scope.ReportstartDate,
                  "repportendTime": $scope.Reportenddate,
                  "comparestartTime": $scope.ComparestartDate,
                  "compareendTime": $scope.Compareenddate,

                }
                $scope.topregions.push(topregionobject);
                $scope.salesregionindex=0.00;
                $scope.salesregionindex=$scope.salesregionindex.toFixed(2);
                if($scope.salesregionindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                }
              else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";

              }
                 var amt=$scope.regionsbyRT[i].amount;
                  var amt1=0.00
                        var salesregionobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.regionsbyRT[i].region,
                          "Index":$scope.salesregionindex,
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow
                        };
              $scope.topregionbarchartdata.push(salesregionobject) 
                }
               }
             }
               $scope.showbarchart=true;
                $scope.topsalesregionchart=true;
            }, function (response) {
             console.log(response);
           }
           );
              }

               var salesregiondataCT={
                  "aggTimeUnit":"1d",
                  "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                  "geoLevel" : 2,
                  "filters" :{
                      "item.mfgId" : [$scope.mfgId],
                      "storeId" : [$scope.storeId.toString()]
                     
                       }
                  }
          dashBoardService.getgeoSalesData(salesregiondataCT).then(function (response) {
            $scope.showbarchart=false;
                $scope.topsalesregionchart=false;
                 $scope.topregions=[];
              $scope.regionsbyCT=response.data.data[0].regions;
             $scope.topregionsbyRTforcpg();
           
             
               }, function (response) {
                 console.log(response);
               }
               );
        }



   

      $scope.salespperformancebyStoreforcpg=function(){
               $scope.salespperformancebyallstoresbyRTforcpg=function(){      
               var data={
                "aggTimeUnit":"1d",
                "startTime": $scope.ReportstartDate,
                "endTime": $scope.Reportenddate,
                "bucketLevel" : "S",
                "filters" :{
                "item.mfgId" : [$scope.mfgId]
               
                   }
               }
                $scope.topstoreschart=false;
               dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
               $scope.topstoresList=[];
               // console.log("stores...",$scope.List);
              dashBoardService.settopstoresmaxvalue(0);
              $scope.topstoresListbyRT=response.data.data;
            $scope.topstoreschartid = dashBoardService.generateguid();
            for(var i=0;i<$scope.topstoresListbyRT.length;i++){
            if(i<5){
            for(var j=0;j<$scope.allstoresList.length;j++){
            if($scope.allstoresList[j].store_id==$scope.topstoresListbyRT[i].id){
            if($scope.topstoresListbyRT[i]&&$scope.topstoresListbyCT){
            $scope.topstoresindex=0.00;
            if(parseFloat($scope.topstoresListbyRT[i].amt)>0){
            $scope.topstoresindex=$scope.topstoresListbyRT[i].amt/$scope.topstoresListbyCT[i].amt;
            $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  }
            if($scope.topstoresindex>=1){
            $scope.labelcolor="green";
            $scope.arrow="\u2191";
            }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=$scope.topstoresListbyCT[i].amt;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
               else{
                $scope.topstoresindex=0.00;
                $scope.topstoresindex=$scope.topstoresindex.toFixed(2);
                  if($scope.topstoresindex>=1){
                    $scope.labelcolor="green";
                    $scope.arrow="\u2191";
                  }
                  else{
                    $scope.labelcolor="red";
                    $scope.arrow="\u2193";
                  }
                   var retailerfound=$filter('filter')($scope.storesByRetailer, 
                    {storeid : parseInt(response.data.data[i].id)}, true);
                  var amt=$scope.topstoresListbyRT[i].amt;
                  var amt1=0.00;
                var topstoresobject = {
                          "color": "#4C98CF",
                          "color1": "#7F2891",
                          "amt": $filter('number')(amt,2),
                          "amt1":$filter('number')(amt1,2),
                          "value":amt,
                          "value1":amt1,
                          'storename': $scope.allstoresList[j].store_name,
                          "Index":$scope.topstoresindex,
                          "storeid":$scope.allstoresList[j].store_id,
                          "retailerName":$scope.allstoresList[j].retailer_name,
                          "content":$scope.allstoresList[j].retailer_name.toUpperCase()+" "+$scope.allstoresList[j].store_name.toUpperCase(),
                          "labelcolor":$scope.labelcolor,
                          "arrow":$scope.arrow,
                          "retailerId":$scope.allstoresList[j].retailer_id
                        };
               $scope.topstoresList.push(topstoresobject);
               }
             }
             }
             }
             }
             //console.log("top store List...",$scope.topstoresList);
             //console.log("stores...",$scope.List);
              $scope.topstoreschart=true;
             }, function (response) {
               console.log(response);
             }
             );
             }
               var data={
                 "aggTimeUnit":"1d",
                 "startTime": $scope.ComparestartDate,
                  "endTime": $scope.Compareenddate,
                 "bucketLevel" : "S",
                 "filters" :{
                  "item.mfgId" : [$scope.mfgId]
                 
                   }
               }
               dashBoardService.GetSalesPerformanceByStoreId(data).then(function (response) {
                $scope.topstoresListbyCT= response.data.data;
                $scope.salespperformancebyallstoresbyRTforcpg();
            }, function (response) {
             console.log(response);
           }
           );
             }








$scope.init=function(){
         if($scope.role=="cpg"){
           $scope.selectedcpg=dashBoardService.getsavestoreselected();           
            $scope.selecteRecord= $scope.selectedcpg; 
           $scope.getAllRetailers();
            $scope.getAllstores();
            $scope.getCPGBrands();
            $scope.selectedcpg=dashBoardService.getsavestoreselected();           
            $scope.selecteRecord= $scope.selectedcpg;  
            $scope.savedBrand=dashBoardService.getselectedBrand();
            $scope.selectedBrand= $scope.savedBrand;        
           $scope.selecteddma=dashBoardService.getselectedDMA();
            if( $scope.selecteddma!= null){

             $scope.dma= $scope.selecteddma.name;
             sessionStorage.user=$scope.selectedcpg.retailerId;
             $scope.retailerid=$scope.selectedcpg.retailerId;
             $scope.dmaStoreList=[];
               for(var i=0;i<$scope.selecteddma.stores.length;i++){
               $scope.dmaStoreList.push($scope.selecteddma.stores[i].toString());
             }}
          }
          else if($scope.role=="retailer"){
            $scope.GetStoreList();
            $scope.geosalesData();
            //$scope.topSalesRegions();
            //$scope.salespperformancebyallstores();
            //$scope.topregionsbarchartfunction();
          }
          else if($scope.role=="distributor"){
            $scope.getAllstores();
            $scope.getDistributorBrands();
          }
      }

        $scope.init();






    }]);

'use strict';
