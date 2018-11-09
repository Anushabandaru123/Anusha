'use strict';
/**
 * @ngdoc controller
 * @name campaignModule.CampaignCtrl
 * @requires $scope
 * @requires $state
 * @requires dashBoard.serviceFactory
 * @description
 * Campaign performs the authentication with help of Service and broadcasts the events to other modules
 *
 * */
angular.module('campaignList.controllers', [])

.controller('campaignListCtrl', ['$scope', '$state', 'serviceFactory','dashBoardService','campaignService','$filter', '$stateParams','usSpinnerService','productService','$rootScope',
    function ($scope, $state, serviceFactory,dashBoardService,campaignService,$filter,$stateParams,usSpinnerService,productService,$rootScope) {


    if (sessionStorage.user == undefined || sessionStorage.user == null||sessionStorage.user =="null") {
      $state.go('login');
    }

      $scope.List = [];
      $scope.showselectedstore=false;
      $scope.showselectearea=true;
      $scope.campaignDetailss=[];
      $scope.location_idarray=[];
      $scope.campaign_status = null;

       $scope.role=sessionStorage.role;


      if ($stateParams.status) {
        $scope.campaign_status = $stateParams.status;
      }else {

        if($scope.role=="retailer") {
          var pathname = window.location.pathname; // Returns path only
          var url      = window.location.href;     // Returns full URL

          var n=url.split("/");
          var word = n[n.length - 1];

          if(word=='campaignListActive'){
            $scope.campaign_status = 'Active';
          }
          if(word=='campaignListPending'){
            $scope.campaign_status = 'Pending';
          }
          if(word=='campaignListArchive'){
            $scope.campaign_status = 'Archive';

          }


        }
        else if ($scope.role=="cpg"){

           var pathname = window.location.pathname; // Returns path only
          var url      = window.location.href;     // Returns full URL

          var n=url.split("/");
          var word = n[n.length - 1];

          if(word=='campaignListActive'){
            $scope.campaign_status = 'Active';
          }
          if(word=='campaignListPending'){
            $scope.campaign_status = 'Pending';
          }
          if(word=='campaignListArchive'){
            $scope.campaign_status = 'Archive';

          }

        }
        else {
          var pathname = window.location.pathname; // Returns path only
          var url      = window.location.href;     // Returns full URL

          var n=url.split("/");
          var word = n[n.length - 1];

          if(word=='campaignListActive'){
            $scope.campaign_status = 'Active';
          }
          if(word=='campaignListPending'){
            $scope.campaign_status = 'Pending';
          }
          if(word=='campaignListArchive'){
            $scope.campaign_status = 'Archive';

          }
        }
        console.log("campaign status...",$scope.campaign_status);
      }


    $scope.CampainDetailLaunch=function (campaign , status) {


      if(status=='Active'){

    $state.go('CampaignLaunch-active',{id: campaign.campaign_id});

      }
      else {
        $state.go('CampaignLaunch-archieved',{id: campaign.campaign_id});
      }
    }


      $scope.CampainDetailBeforeLaunch=function(list){

       // console.log("list....",list);

        if(list.camp_status=="4"||list.camp_status=="3"){
          $state.go('sendinvite',{id:list.campaign_id});
        }
        else if(list.camp_status=="2"){

           $scope.selectedManufactures=[];


    $scope.capaignstartDate=moment(list.sdate).format("MM/DD/YYYY");

   $scope.campaignenddate=moment(list.edate).format("MM/DD/YYYY");

    $scope.deadlineDate=moment(list.deadline_date).format("MM/DD/YYYY");
    $scope.ProductData=[];

     for(var i=0;i<list.productsList.length;i++){

                var productParts=list.productsList[i].split("|");

                       var productObject=
                       {
                        "Name":productParts[0],
                        "id":productParts[1],
                        "mfgName":productParts[2],
                        "price":"13 OZ",
                        "size":"13 OZ"
                        }

           $scope.ProductData.push(productObject);
           var maanufacturerResult=$filter('filter')($scope.selectedManufactures,{Manufacturer : productParts[2]}, true);
            //console.log("manufacturerResult....",maanufacturerResult);
            if(maanufacturerResult.length==0){
              if(productParts[2]!=""){
                var manufacturer={
              "Manufacturer":productParts[2]
            }
            $scope.selectedManufactures.push(manufacturer);
              }
            }
               }
          $scope.stores=[];

         for(var i=0;i<list.campaignLocations.length;i++){
          var storeparts=list.campaignLocations[i].split("|");
            var storedata = {
                    "id": storeparts[0],
                    "storeName": storeparts[1]
                     }
          $scope.stores.push(storedata);
         }
         $scope.promotionList=[];
                   $scope.promotionTypesList
         for(var i=0;i<list.promotionTypes.length;i++){
           
        var results=$filter('filter')($scope.promotionTypesList,{promotion:list.promotionTypes[i]}, true);
     

            var promotionobject={
          "promotion":list.promotionTypes[i],
          "id":results[0].id
             }

          $scope.promotionList.push(promotionobject);
         }

        $scope.addsheetList=[];

     for(var i=0;i<list.files.length;i++){

           var addsheetfileobject={
      "orginalName":list.files[i].original_file_name,
      "guidName":"",
      "file_path":list.files[i].file_path,
      "file_id":list.files[i].file_id
     }
     $scope.addsheetList.push(addsheetfileobject);
     }





           $scope.campaignObjectdata={
         "campaignId":list.campaign_id,
         "campaignName" : list.CampaignsName,
         "campaignstartdate" : $scope.capaignstartDate,
         "campaignenddate" : $scope.campaignenddate,
         "campaigndeadlineSignupDate":$scope.deadlineDate,
         "description": list.description,
         "products": $scope.ProductData,
         "selectedManufactures":$scope.selectedManufactures,
         "selectedstores":$scope.stores,
         "promotionstypes":$scope.promotionList,
         "adsheets": $scope.addsheetList,
         "additionalsheets":$scope.additionalFilesList,
              
       };

campaignService.setcampaign($scope.campaignObjectdata);

         $state.go('SaveCampaigns',{id:list.campaign_id});
        }

        

       // $state.go('CampaignLaunchDetails', {id: campaign});

      }
      $scope.flag = "campaign controller...."
      $scope.searchStore="";
      $scope.searchProduct=""

      $scope.nutella="data:image/jpeg;base64,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";

      $scope.imgbar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACtJREFUSMdj+A8GDAgwKjAqwDAKcIH/cDAqMCqAKTAKcOUXaDCNCowKIAAAP/H8Lm4fPi4AAAAASUVORK5CYII=";
      $scope.imgline = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAACKxJREFUeJztnWeMFVUUx3+zy8oiKgtqUKwodhBL/GBZJMGaaIINe2JDxa4xKrERYyJW7CV2idEPRqNgCRqMJUbUYPuAsZGIBcUCKoLswvrh8MJbd+fOmfdm5t557/ySm/2w7838Z+5595x7bgPDMAzDMAzDMAyjiWj1LcAohFFAJ7AdsBT4x68coyhGAW8CPVWlC3gQGOxRl1EAI4Ff6F351eUtoM1cQOPyNLCH4//bAL8VpMUomOHE//Kry3xfAo186URnACtafCk0cmWV8nPLc1VheGEwMAddC/C8J41GTgwD3kNX+auBffzINPJgBPA5usrvBs7wI9PIg1HAQuIr/BvgO+Ar4ElgrB+ZRh6MBRYTX/lX+JNm5E0nktuP8/Fn+ZNm5M0RwAr6r/x/gWP8STPy5hQkkOuv8v8CJviTZuTNRcT7+1+xrl0iETARmIv4z6XAG8CRPkUpiIAbiK/8RcAu3tSVhAi4m/iXePvaz4RGC3Af8bq/ALb2pq5EnEZykuRkX+JiWA94hni9HwGbelNXMr4g2QA+96auL4OB14jXOhfYyJu6krEJujRpDzDEk8ZqkvL6LwDt3tSVkK3RG8A9wAZ+ZALJef1HgQHe1JWQYeiHSCvle2ASxQeFSXn9WzxoKjW7I4MhaSq/urwB7FyQ1j2wvH6mTEJmvdRa+ZWyCriZfN1CJ7As5v6W109JKzAdd6WupncFf5nw+TzdQlJe/+iM79fQDMPddeoGLgQ6gP3Wlg3XfvdAdJMqsnQLp2J5/cwYg9vf/4JUsos24BLgT8d1snILFzuub3n9lCT5+w+BrVJcb3NgpuN61W7hONK5BU1ev6jAs/Ro/P0TwKAarz+ObN1CK3C/4zqW109Bkr/vAi6g/qAtjVuYTrxbWA941vF9y+unQOPvx2V8T61bWIS4hdHAdcDDwK3APMd35rIuGDUSOI5s/X1atG5BWyyvr6QVuAn3y3ycYl6m1i0kFcvrK9H4+/MpPk+udQv9FcvrK0ny9z+Tvb9PyzjgM/SVP8+PzPAZCZwDTEVm55wO/E38i/wA2NKL0r4MAF5HZwAve9IYLAOBB4A16H9FjxFe8OTK7lWXR3wJDJEId/+4P39/HmH6z+3RGXHos5AL5SD0lf8zMnQaMnfgfoY5hGm83ngMXeV/Szj+3sUAZFpZf88wizDmHAZBB3AVsBKdAdzoR2bNjAGuR/r605Gegv3ykV/xbch4d5p+84U+xBrZsSuSqVtFuoqvlB2Ll2zUS4QEbbOordKt21RSWpBFmNpNi3qIH+B5jvD6+0YMA5EZrJplWJUyGwmQBiLr955FJlg8ChyKBU6loAO4EvgJfTLnSSRSNkrMFshkB+2w6F/IMuw8x+uNAkgb0S9GBniG+hBrZEMEHAC8hN6/fwmcjQVxpSBCJiWOQKL4CrVE9POQFS12JkEJiJAx+K9ZV4FLkIUPU6gtorfIvSRESJKlniRNJaIfXbB2IwNOpPaKt4i+AUjj1y2ib0C0Q7GViH4yFtE3FFoDuByL6BuSd0mu/OXUvrjSCJxJJBvAHd7UGbkT4V6u/C6wvjd1RiFEyAKMBayr+B+BaVjA13R0IOlgy+QZhmEYhmE0KBboNT57AmcCuyGzt94DHkLGc4wGJgKupf+VykuBQ/xJM4rgNJLT+zvY4E5j0oqsxHIdJ9OW8H+jxIxBN8L7Y7NuTzYUOAnYC3kRHyEncy3zKSpDtBN1Ns5VRaAcDvxO31/DEmSnkkZgIroWYIEvgb7YGzmAIe6FrECOmCkzh6I/JWWaH4n+0GzhNtubuvo5Hv1KrQX4PRmtcAbT+5iYuNKFrFIuG1PQb7E3B9jMj0x/bIN+8uvmnjTWQgRcgyPSRybyXoZspbunH5l+iYBL0VV+N+WZ/9gCzCD+Wb5Gdl5tatqRVczaX38P8BThz4BuQ3TGPcMnNGEz/3+2Qs4OSFP5ZTCCQbhXaL+DzOxqasYhu4rWUvkhG8EQ4G3cvZimnsQbIecEdRH/kuYC5yL+cwbu7mFIRjAcadrjtM5EXEPT0k7ytrO30PeEjhZkp/KQjWBb4CviNd5J7z0dmo4tkbMD4l7QP8AJju+HbASjgR8c2q6lySf3dOL29wuBsYrrhGgE+9L/2EUPkviZUrCeoIiQ5IbL379OulGvkIzAldfvwt2i1cRGSPQ8gfD7kLX6ew0hGIErr78cOCzLm60P3EXfpeIvIPsAhka9/l6DTyNw5fV/R9xCZrQBb8bcrAf4Dtk1LBSy8vcaijYCTV4/832YNDnyF/EfZUbIOUFZ+nsNRRlBC9KVi7tPbnl97RGoy4D3kd3ApiJ7AO5GMUOnefp7DXkbgSavP7yO6zvpdtxYU1Yj1jkb2TFsMhJIDqf2VmMzZCvaIYi/dx26nIW/15CXEQzCfZZC7nl916GM9ZY/kFbjCaTVOAqp2LhW4zB6pzrX4J7CtZDs/L2GrI2gA3defxYF5PVfdQjIq6xG0pqzkbODJiNNeJpr5OHvNWRlBMHk9cc7RIRa8vT3Guo1gpEElte/xCFmJpILGI/sJzwDeAU5zDnNMa9ZlH8pxt9rqNUIRiPdubjvXYOnHtf+SOJnMfAbkhs4IUFMO/JAxwJXI8byAdJjyMMA7s3oWbNCYwQDkAmpLTRRXj9CJlaOZ924+6vIyZ/1tBpTC3wGLUlGsLLqb1yPK5e8fqgMQtauHYs0dzOB79EZwAQPejUkGYGrZJ7XLyMjSD5F9GPCnvBQixFkntcvMxOJH/36CdjJnzQ1LUjXVlP5y7DzFfqwF/ICK8mfpcDDlGuhxjR0BvCaJ329CG15+HzgCETXhsivZI1XRenRuqmVuapQEpoBVOhG0shl5DPl5z7NVYXhjXZgEe7mfyWyVtFoUDqRUcq4hM/p/qQZRbE7MmBVnfiaDxzsU5RRPEORxFfok2wNwzAMwzAMwzAMwzAMwzAMw2hA/gOiulK7+Ir8UwAAAABJRU5ErkJggg==";
      $scope.imgmap = "data:image/png;base64,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";

      $scope.indexVal = 18.0;
      $scope.total = 219050.0


      $scope.stores =['store#1','store#2','store#3','srtore#4','store#5','store#6'];
      $scope.products =['Cardenas','Superfoods','groceryNonTax','product4','product5','product6'];

      $scope.selectedProduct="";
        $scope.showProduct=false;
      $scope.updateshowProduct=true;

       $scope.selectedProductarray=[];
      $scope.productid=[];
      $scope.productName=[];

      $scope.selectedstores=[];
      $scope.selectedstoresData=[];

      $scope.addStoreid=[];


$scope.imgbar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACtJREFUSMdj+A8GDAgwKjAqwDAKcIH/cDAqMCqAKTAKcOUXaDCNCowKIAAAP/H8Lm4fPi4AAAAASUVORK5CYII=";
$scope.imgline = "data:image/png;base64,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";
$scope.imgmap = "data:image/png;base64,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";

$scope.imagebuffer = "data:image/png;base64,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";

$scope.imagebuffer1 = "data:image/jpeg;base64,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";

 $scope.campaignsList=[];

$scope.getjatStyle = function (value) {
  if (value >= 1) {
    return "page_dashboard_box_index green";
  } else {
    return "page_dashboard_box_index red";
  }
};

     $scope.getindexStyle = function (value) {

        console.log('campaign data:',value);
        if (value >= 1) {
          return "page_dashboard_box_index green";
        } else {
          return "page_dashboard_box_index red";
        }
      }

  $scope.campaignchartId1 = dashBoardService.generateguid();
  $scope.campaignchartId2 = dashBoardService.generateguid();
  $scope.campaignchartId3 = dashBoardService.generateguid();

      /*campaignService.getCampignLinechartData().then(function (response) {
          $scope.dataProvider = response;
        }, function (response) {
          console.log(response);
        }
      );*/
                $scope.dashboardCampaingList=[];

                $scope.campaignrecords = [];

               $scope.showCampaignList=true;

                $scope.hideCampaignList=false;

              $scope.CampaignListofRetailer=function () {

               if($scope.campaign_status=="Archive"){
                sessionStorage.campaignStatus="Archived";
               }
               else{
               sessionStorage.campaignStatus=$scope.campaign_status

               }
                dashBoardService.RetailercampaignList().then(function (response) {

                  $scope.camprecords = [];
                  $scope.CampaignListDetails=response.data;

           if($scope.CampaignListDetails.length==0||$scope.CampaignListDetails=='Problem in Query'){
                    $scope.showCampaignList=false;
                    $scope.hideCampaignList=true;
                  }
                  else{
                    $scope.showCampaignList=true;
                    $scope.hideCampaignList=false;
                  }

 if($scope.CampaignListDetails!=undefined&&$scope.CampaignListDetails!='Problem in Query'){
   for(var i=0;i<$scope.CampaignListDetails.length;i++){

      $scope.CampaignLocationList=$scope.CampaignListDetails[i].campaign_location;

              $scope.storesforCampaign=[];
              for(var j=0;j<$scope.CampaignLocationList.length;j++){
                $scope.arrayofstores=$scope.CampaignLocationList[j].split("|");
                $scope.storeaftersplitting=$scope.arrayofstores[0];
                $scope.storesforCampaign.push($scope.storeaftersplitting);
              }

              $scope.productListforCampaigns=$scope.CampaignListDetails[i].products;

              $scope.productsforCampaign=[];
              for(var k=0;k<$scope.productListforCampaigns.length;k++){
                $scope.arrayofproducts=$scope.productListforCampaigns[k].split("|");
                $scope.productaftersplitting=$scope.arrayofproducts[1];
                $scope.productsforCampaign.push($scope.productaftersplitting);
              }

              var comparetimestartdate;
              var comparetimeendDate;

              var campaignstartDate=moment($scope.CampaignListDetails[i].start_date).format("YYYY-MM-DD");

              var campaignendDate=moment($scope.CampaignListDetails[i].end_date).utc().format("YYYY-MM-DD");

              comparetimeendDate=moment(campaignstartDate).subtract(1,'days').format("YYYY-MM-DD");

              var apienddate= moment(campaignendDate).format("YYYYMMDD");

              var apistartdate= moment(campaignstartDate).format("YYYYMMDD");

              var enddate=moment();

              if($scope.CampaignListDetails[i].status=='Active'){

               apienddate= moment(enddate).format("YYYYMMDD");

              }

              if($scope.CampaignListDetails[i].status=='Archived'){
                apienddate= moment(campaignendDate).format("YYYYMMDD");

                enddate=moment(campaignendDate);
              }

              var oneDay = 24*60*60*1000;

              var diffDays = Math.round(Math.abs((moment(enddate) - moment(campaignstartDate))/(oneDay)));

              comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');

              var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");

              var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");

             $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataapiComparetimestartdate= apicomparestartdate+ 'T000000.000-0000';

              $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';

              $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
              $scope.salesDataapiReporttimestartdate= apistartdate+ 'T000000.000-0000';

              $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';

             var date = new Date($scope.CampaignListDetails[i].start_date);
             $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();

             var endDate = new Date($scope.CampaignListDetails[i].end_date);

             
             // $scope.newendate=new Date($scope.CampaignListDetails[i].end_date).toISOString();
              
             $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getUTCDate()+'/'+endDate.getFullYear();
             
               //console.log("end date...",$scope.endDate);
             $scope.idchart =dashBoardService.generateguid();

             var campaingobject={

               "CampaignsName": $scope.CampaignListDetails[i].campaign_name,
               "sdate": $scope.startDate,
               "edate": $scope.endDate,
               "startsale": "",
               "endsale": "",
               "startunitsold": "",
               "endunitsold": "",
               "startcs": " ",
               "endcs": "",
               "startbs": "",
               "endbs": "",
               "id":$scope.idchart,
               "datachart":$scope.campaignSalesData,
               "description":$scope.CampaignListDetails[i].description,
               "total": $scope.salesDatatotal,
               "index":$scope.salesDataIndex,
               "campaign_id": $scope.CampaignListDetails[i].campaign_id,
               "stores":$scope.storesforCampaign,
               "products":$scope.productsforCampaign,
               "campaignLocations":$scope.CampaignLocationList,
               "productsList":$scope.productListforCampaigns,
               "comparestartDate":$scope.salesDataComparetimestartdate,
               "compareendDate":$scope.salesDataComparetimeenddate,
               "reportstartDate":$scope.salesDataReporttimestartdate,
               "reportendDate":$scope.salesDataReporttimeenddate,
               "campaignRatio":"",
               "campaignRatioStatus":"",
               "location":$scope.CampaignListDetails[i].location,
               "apistatus":"retailer",
               "retailer":$scope.CampaignListDetails[i].rid[0].split("|")[1],
               "retailerid":$scope.CampaignListDetails[i].rid[0].split("|")[0],
               "status":$scope.CampaignListDetails[i].status,
               "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
               "salesDatareporttime":$scope.salesDataapiReporttimestartdate,
               "showchart":true,
               "camp_status":$scope.CampaignListDetails[i].campaign_status,
               "deadline_date":$scope.CampaignListDetails[i].deadline_date,
               "promotionTypes":$scope.CampaignListDetails[i].promotionTypes,
               "files":$scope.CampaignListDetails[i].files

             }

             $scope.campaignrecords.push(campaingobject);

            }

            console.log($scope.campaignrecords);

                $scope.len=$scope.campaignrecords.length;

           }


          }, function (response) {
            console.log(response);
          }
          );
              }

              $scope.CampaignListofCpg=function () {

 if($scope.campaign_status=="Archive"){
                sessionStorage.campaignStatus="Archived";
               }
               else{
               sessionStorage.campaignStatus=$scope.campaign_status

               }
                dashBoardService.CpgcampaignList().then(function (response) {

                  $scope.camprecords = [];
                  $scope.CampaignListDetails=response.data;

                  if($scope.CampaignListDetails.length==0||$scope.CampaignListDetails=='Problem in Query'){
                    $scope.showCampaignList=false;

                    $scope.hideCampaignList=true;
                  }
                  else{
                    $scope.showCampaignList=true;
                    $scope.hideCampaignList=false;
                  }

    if($scope.CampaignListDetails!=undefined&&$scope.CampaignListDetails!='Problem in Query'){
           for(var i=0;i<$scope.CampaignListDetails.length;i++){

              if($scope.CampaignListDetails[i].campaign_status=="3"||$scope.CampaignListDetails[i].campaign_status=="4"){
             $scope.CampaignLocationList=$scope.CampaignListDetails[i].campaign_location;
              
                console.log($scope.CampaignListDetails[i]);
              $scope.storesforCampaign=[];
              for(var j=0;j<$scope.CampaignLocationList.length;j++){
                $scope.arrayofstores=$scope.CampaignLocationList[j].split("|");
                $scope.storeaftersplitting=$scope.arrayofstores[0];
                $scope.storesforCampaign.push($scope.storeaftersplitting);
              }
              $scope.productListforCampaigns=$scope.CampaignListDetails[i].products;
              $scope.productsforCampaign=[];
              for(var k=0;k<$scope.productListforCampaigns.length;k++){
                $scope.arrayofproducts=$scope.productListforCampaigns[k].split("|");
                $scope.productaftersplitting=$scope.arrayofproducts[1];
                $scope.productsforCampaign.push($scope.productaftersplitting);
              }

              var comparetimestartdate;
              var comparetimeendDate;
              var campaignstartDate=moment($scope.CampaignListDetails[i].start_date).format("YYYY-MM-DD");
              var campaignendDate=moment($scope.CampaignListDetails[i].end_date).utc().format("YYYY-MM-DD");

              comparetimeendDate=moment(campaignstartDate).subtract(1,'days').format("YYYY-MM-DD");

              var apienddate= moment(campaignendDate).format("YYYYMMDD");

              var apistartdate= moment(campaignstartDate).format("YYYYMMDD");

              var enddate=moment();

              if($scope.CampaignListDetails[i].status=='Active'){
               apienddate= moment(enddate).format("YYYYMMDD");

              }

              if($scope.CampaignListDetails[i].status=='Archived'){
                apienddate= moment(campaignendDate).format("YYYYMMDD");

                enddate=moment(campaignendDate);
              }

              var oneDay = 24*60*60*1000;

              var diffDays = Math.round(Math.abs((moment(enddate) - moment(campaignstartDate))/(oneDay)));

              comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');

              var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");

              var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");

             $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataapiComparetimestartdate= apicomparestartdate+ 'T000000.000-0000';

              $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';

              $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
              $scope.salesDataapiReporttimestartdate= apistartdate+ 'T000000.000-0000';

              $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';

             var date = new Date($scope.CampaignListDetails[i].start_date);
             $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();

             var endDate = new Date($scope.CampaignListDetails[i].end_date);


             $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getUTCDate()+'/'+endDate.getFullYear();
           

             $scope.idchart =dashBoardService.generateguid()

             var campaingobject={

               "CampaignsName": $scope.CampaignListDetails[i].campaign_name,
               "sdate": $scope.startDate,
               "edate": $scope.endDate,
               "startsale": "$5554",
               "endsale": "$8415",
               "startunitsold": "1805",
               "endunitsold": "2018",
               "startcs": " 10%",
               "endcs": "25%",
               "startbs": "18% ",
               "endbs": "62%",
               "id":$scope.idchart,
               "datachart":$scope.campaignSalesData,
               "description":$scope.CampaignListDetails[i].description,
               "total": $scope.salesDatatotal,
               "index":$scope.salesDataIndex,
               "campaign_id": $scope.CampaignListDetails[i].campaign_id,
               "stores":$scope.storesforCampaign,
               "products":$scope.productsforCampaign,
               "campaignLocations":$scope.CampaignLocationList,
               "productsList":$scope.productListforCampaigns,
               "comparestartDate":$scope.salesDataComparetimestartdate,
               "compareendDate":$scope.salesDataComparetimeenddate,
               "reportstartDate":$scope.salesDataReporttimestartdate,
               "reportendDate":$scope.salesDataReporttimeenddate,
               "campaignRatio":"",
               "campaignRatioStatus":"",
               "location":$scope.CampaignListDetails[i].location,
               "apistatus":"cpg",
               "retailer":$scope.CampaignListDetails[i].rid[0].split("|")[1],
               "retailerid":$scope.CampaignListDetails[i].rid[0].split("|")[0],
               "status":$scope.CampaignListDetails[i].status,
               "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
               "salesDatareporttime":$scope.salesDataapiReporttimestartdate,
               "showchart":true,
               "camp_status":$scope.CampaignListDetails[i].campaign_status,
               "deadline_date":$scope.CampaignListDetails[i].deadline_date,
               "promotionTypes":$scope.CampaignListDetails[i].promotionTypes,
               "files":$scope.CampaignListDetails[i].files

                
             }

             $scope.campaignrecords.push(campaingobject);

            }
          }

           $scope.len=$scope.campaignrecords.length;
           }
              }, function (response) {
                console.log(response);
              }
              );

              }

               $scope.CampaignListofDistributor=function () {

               if($scope.campaign_status=="Archive"){
                sessionStorage.campaignStatus="Archived";
               }
               else{
               sessionStorage.campaignStatus=$scope.campaign_status
               }
                dashBoardService.campaignListforDistributor().then(function (response) {
                  $scope.camprecords = [];
                  $scope.CampaignListDetails=response.data;
                  if($scope.CampaignListDetails.length==0||$scope.CampaignListDetails=='Problem in Query'){
                    $scope.showCampaignList=false;
                    $scope.hideCampaignList=true;
                  }
                  else{
                    $scope.showCampaignList=true;
                    $scope.hideCampaignList=false;
                  }

    if($scope.CampaignListDetails!=undefined&&$scope.CampaignListDetails!='Problem in Query'){
           for(var i=0;i<$scope.CampaignListDetails.length;i++){

              if($scope.CampaignListDetails[i].campaign_status=="3"||$scope.CampaignListDetails[i].campaign_status=="4"){
             $scope.CampaignLocationList=$scope.CampaignListDetails[i].campaign_location;
              
                console.log($scope.CampaignListDetails[i]);
              $scope.storesforCampaign=[];
              for(var j=0;j<$scope.CampaignLocationList.length;j++){
                $scope.arrayofstores=$scope.CampaignLocationList[j].split("|");
                $scope.storeaftersplitting=$scope.arrayofstores[0];
                $scope.storesforCampaign.push($scope.storeaftersplitting);
              }
              $scope.productListforCampaigns=$scope.CampaignListDetails[i].products;
              $scope.productsforCampaign=[];
              for(var k=0;k<$scope.productListforCampaigns.length;k++){
                $scope.arrayofproducts=$scope.productListforCampaigns[k].split("|");
                $scope.productaftersplitting=$scope.arrayofproducts[1];
                $scope.productsforCampaign.push($scope.productaftersplitting);
              }

              var comparetimestartdate;
              var comparetimeendDate;
              var campaignstartDate=moment($scope.CampaignListDetails[i].start_date).format("YYYY-MM-DD");
              var campaignendDate=moment($scope.CampaignListDetails[i].end_date).utc().format("YYYY-MM-DD");

              comparetimeendDate=moment(campaignstartDate).subtract(1,'days').format("YYYY-MM-DD");

              var apienddate= moment(campaignendDate).format("YYYYMMDD");

              var apistartdate= moment(campaignstartDate).format("YYYYMMDD");

              var enddate=moment();

              if($scope.CampaignListDetails[i].status=='Active'){
               apienddate= moment(enddate).format("YYYYMMDD");

              }

              if($scope.CampaignListDetails[i].status=='Archived'){
                apienddate= moment(campaignendDate).format("YYYYMMDD");

                enddate=moment(campaignendDate);
              }

              var oneDay = 24*60*60*1000;

              var diffDays = Math.round(Math.abs((moment(enddate) - moment(campaignstartDate))/(oneDay)));

              comparetimestartdate=moment(comparetimeendDate).subtract(diffDays,'days');

              var apicompareenddate= moment(apienddate).subtract(1,'year').format("YYYYMMDD");

              var apicomparestartdate= moment(apistartdate).subtract(1,'year').format("YYYYMMDD");

             $scope.salesDataComparetimestartdate   = apicomparestartdate+ 'T000000.000-0000';
              $scope.salesDataapiComparetimestartdate= apicomparestartdate+ 'T000000.000-0000';

              $scope.salesDataComparetimeenddate  =apicompareenddate + 'T235959.000-0000';

              $scope.salesDataReporttimestartdate   = apistartdate+ 'T000000.000-0000';
              $scope.salesDataapiReporttimestartdate= apistartdate+ 'T000000.000-0000';

              $scope.salesDataReporttimeenddate  =apienddate + 'T235959.000-0000';

             var date = new Date($scope.CampaignListDetails[i].start_date);
             $scope.startDate=(date.getMonth()+1)+'/' + date.getDate()+'/'+date.getFullYear();

             var endDate = new Date($scope.CampaignListDetails[i].end_date);


             $scope.endDate=(endDate.getMonth()+1)+'/' + endDate.getUTCDate()+'/'+endDate.getFullYear();
           

             $scope.idchart =dashBoardService.generateguid()

             var campaingobject={

               "CampaignsName": $scope.CampaignListDetails[i].campaign_name,
               "sdate": $scope.startDate,
               "edate": $scope.endDate,
               "startsale": "$5554",
               "endsale": "$8415",
               "startunitsold": "1805",
               "endunitsold": "2018",
               "startcs": " 10%",
               "endcs": "25%",
               "startbs": "18% ",
               "endbs": "62%",
               "id":$scope.idchart,
               "datachart":$scope.campaignSalesData,
               "description":$scope.CampaignListDetails[i].description,
               "total": $scope.salesDatatotal,
               "index":$scope.salesDataIndex,
               "campaign_id": $scope.CampaignListDetails[i].campaign_id,
               "stores":$scope.storesforCampaign,
               "products":$scope.productsforCampaign,
               "campaignLocations":$scope.CampaignLocationList,
               "productsList":$scope.productListforCampaigns,
               "comparestartDate":$scope.salesDataComparetimestartdate,
               "compareendDate":$scope.salesDataComparetimeenddate,
               "reportstartDate":$scope.salesDataReporttimestartdate,
               "reportendDate":$scope.salesDataReporttimeenddate,
               "campaignRatio":"",
               "campaignRatioStatus":"",
               "location":$scope.CampaignListDetails[i].location,
               "apistatus":"cpg",
               "retailer":$scope.CampaignListDetails[i].rid[0].split("|")[1],
               "retailerid":$scope.CampaignListDetails[i].rid[0].split("|")[0],
               "status":$scope.CampaignListDetails[i].status,
               "salesDatacomparetime":$scope.salesDataapiComparetimestartdate,
               "salesDatareporttime":$scope.salesDataapiReporttimestartdate,
               "showchart":true,
               "camp_status":$scope.CampaignListDetails[i].campaign_status,
               "deadline_date":$scope.CampaignListDetails[i].deadline_date,
               "promotionTypes":$scope.CampaignListDetails[i].promotionTypes,
               "files":$scope.CampaignListDetails[i].files
             }
             $scope.campaignrecords.push(campaingobject);
            }
          }
           $scope.len=$scope.campaignrecords.length;
           }
              }, function (response) {
                console.log(response);
              }
              );

              }

           var destroyFoo;

      destroyFoo=   $rootScope.$on('campaignSales', function (event, data) {

       for(var i=0;i<$scope.campaignrecords.length;i++){
        if($scope.campaignrecords[i].campaign_id==data.campaign_id){

                $scope.campaignrecords[i].datachart=data.chartData;
                $scope.campaignrecords[i].index=data.index;
                $scope.campaignrecords[i].total=data.total;
                $scope.campaignrecords[i].showchart=data.showchart;

        }
       }

      });

      var campaignRatio;

      campaignRatio=   $rootScope.$on('campaignRatio', function (event, data) {

               

       for(var i=0;i<$scope.campaignrecords.length;i++){
        if($scope.campaignrecords[i].campaign_id==data.campaign_id){

           $scope.campaignrecords[i].campaignRatio=data.ratio;
           $scope.campaignrecords[i].campaignRatioStatus=data.status;
        }
       }

       //console.log("campaign records...", $scope.campaignrecords);

      });

        $scope.getPromotionTypeList=function(){
    campaignService.getPromotionTypes().then(function(response){

      $scope.promotionTypesList=[];
      for(var i=0;i<response.data.length;i++){
        var promotionobject={
          "promotion":response.data[i].promotion_type,
          "id":response.data[i].promtion_type_id
        }

        $scope.promotionTypesList.push(promotionobject);

      }
   
    },function(error){

    });
   }

      $scope.init=function(){

        $scope.role=sessionStorage.role;

        if($scope.role=="cpg"){

        $scope.CampaignListofCpg();
        }
        else if($scope.role=="retailer"){
          $scope.getPromotionTypeList();
          $scope.CampaignListofRetailer();
        }
        else{
          $scope.CampaignListofDistributor();
        }

      }

      $scope.init();
}]);
