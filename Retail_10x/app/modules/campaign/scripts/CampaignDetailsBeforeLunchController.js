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
angular.module('campaignforelunchCtrl.controllers', [])

  .controller('campaignforelunchCtrl', ['$scope', '$state', 'serviceFactory','dashBoardService','campaignService','$filter', '$stateParams','usSpinnerService','productService',
    function ($scope, $state, serviceFactory,dashBoardService,campaignService,$filter,$stateParams,usSpinnerService,productService) {


    if (sessionStorage.user == undefined || sessionStorage.user == null||sessionStorage.user =="null") {
      $state.go('login');
    }

      $scope.id = $stateParams.id;


      $scope.List = [];
      $scope.showselectedstore=false;
      $scope.showselectearea=true;
      $scope.campaignDetailss=[];
      $scope.location_idarray=[];
      $scope.campaign_status = null;
      if ($stateParams.status) {
        $scope.campaign_status = $stateParams.status;
      }else {
        $scope.campaign_status = 'Pending';
      }

      $scope.SelectedCampaignDetail = function () {

        sessionStorage.cId=$scope.id

        campaignService.selectedcampaign().then(function (response) {

            $scope.selectedcampaignDetails = response.data;

          $scope.ary=[];

        $scope.CampaignLocationList=$scope.selectedcampaignDetails[0].campaign_location;

        $scope.storesforCampaign=[];
        $scope.storesforCampaignall=[];

            $scope.storeallLenghth=$scope.CampaignLocationList.length;

        for(var j=0;j<$scope.CampaignLocationList.length;j++){
          $scope.arrayofstores=$scope.CampaignLocationList[j].split("|");
          $scope.storeaftersplitting=$scope.arrayofstores[0];

          var storeobject={
            "storeName":$scope.arrayofstores[1],
            "id":$scope.arrayofstores[0]
          }
          $scope.storesforCampaign.push(storeobject);
        }

            for(var i=6;i<$scope.CampaignLocationList.length;i++){
              $scope.arrayofstores=$scope.CampaignLocationList[i].split("|");
              $scope.storeaftersplitting=$scope.arrayofstores[0];

              var storeobject={
                "storeName":$scope.arrayofstores[1],
                "id":$scope.arrayofstores[0]
              }
              $scope.storesforCampaignall.push(storeobject);

            }

        $scope.productListforCampaigns=$scope.selectedcampaignDetails[0].products;

        $scope.productsforCampaign=[];
        for(var k=0;k<$scope.productListforCampaigns.length;k++){
          $scope.arrayofproducts=$scope.productListforCampaigns[k].split("|");
          $scope.productaftersplitting=$scope.arrayofproducts[1];
          var productobject={
            "Name":$scope.arrayofproducts[0],
            "id":$scope.arrayofproducts[1]
          }

      $scope.productsforCampaign.push(productobject);

        }

         $scope.location_idarray=[];

        for(var m=0;m<$scope.selectedcampaignDetails[0].location.length;m++){

           for(var l=0;l<$scope.LocationList.length;l++){

            if($scope.LocationList[l].location==$scope.selectedcampaignDetails[0].location[m]){
               var locdata = {

            "id": $scope.LocationList[l].location_id,
            "locName": $scope.LocationList[l].location
          }

          $scope.location_idarray.push(locdata);
            }

        }

        }


          var startdate=new Date($scope.selectedcampaignDetails[0].start_date);

          var enddate=new Date($scope.selectedcampaignDetails[0].end_date);


        $scope.endDate=(enddate.getMonth()+1)+'/' + enddate.getUTCDate()+'/'+enddate.getFullYear();


           var campaignDetails = {
            "name": $scope.selectedcampaignDetails[0].campaign_name,
            "desc": $scope.selectedcampaignDetails[0].description,
            "retailer_id": sessionStorage.user,
            "start_date": moment(startdate).format("DD/MM/YYYY"),
            "end_date": $scope.endDate,
            "itemLocation": $scope.location_idarray,
            "products": $scope.productsforCampaign,
            "stores": $scope.storesforCampaign,
            "campaign_id":$scope.id
          }

          campaignService.Regiterdata(campaignDetails);

          $scope.accpetedaaray=[]
          $scope.accpetedaaray=response.data.products;

          $scope.accpetedaaray1=response.data.campaign_id;

            $scope.Luanchdate= $scope.selectedcampaignDetails[0].start_date;

            $scope.currentDateFormat = new Date();

            $scope.Luanchdate = $filter('date')($scope.Luanchdate, "yyyy-MM-dd");
            $scope.currentDateFormat = $filter('date')($scope.currentDateFormat, "yyyy-MM-dd");
            $scope.dateremaing=$scope.Luanchdate-$scope.currentDateFormat;

            var oneDay = 24*60*60*1000;	// hours*minutes*seconds*milliseconds
            var firstDate = new Date($scope.Luanchdate);
            var secondDate = new Date($scope.currentDateFormat);

            if(firstDate>secondDate)
            {
              $scope.showlaunchlable=true;
              $scope.showcampaignstatus=false;

              $scope.diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

            }
            else
            {
              $scope.diffDays=0;
              $scope.showcampaignstatus=true;
              $scope.showlaunchlable=false;
              $scope.campaignstatus=$scope.selectedcampaignDetails[0].status;
                 console.log("campaign statuus...",$scope.campaignstatus);

            }

          }, function (response) {
            console.log(response);
          }
        );
      }




    $scope.SelectedCampaignDetailforCPG = function () {

    sessionStorage.cId=$scope.id

    campaignService.selectedcampaignforCPG().then(function (response) {

    $scope.selectedcampaignDetails = response.data;

    $scope.ary=[];

    $scope.CampaignLocationList=$scope.selectedcampaignDetails[0].campaign_location;

    $scope.storesforCampaign=[];
    $scope.storesforCampaignall=[];

    $scope.storeallLenghth=$scope.CampaignLocationList.length;

    for(var j=0;j<$scope.CampaignLocationList.length;j++){
    $scope.arrayofstores=$scope.CampaignLocationList[j].split("|");
    $scope.storeaftersplitting=$scope.arrayofstores[0];

    var storeobject={
    "storeName":$scope.arrayofstores[1],
    "id":$scope.arrayofstores[0]
    }
    $scope.storesforCampaign.push(storeobject);
    }

    for(var i=6;i<$scope.CampaignLocationList.length;i++){
      $scope.arrayofstores=$scope.CampaignLocationList[i].split("|");
      $scope.storeaftersplitting=$scope.arrayofstores[0];

    var storeobject={
                "storeName":$scope.arrayofstores[1],
                "id":$scope.arrayofstores[0]
              }
              $scope.storesforCampaignall.push(storeobject);
            }
        $scope.productListforCampaigns=$scope.selectedcampaignDetails[0].products;
        $scope.productsforCampaign=[];
        for(var k=0;k<$scope.productListforCampaigns.length;k++){
          $scope.arrayofproducts=$scope.productListforCampaigns[k].split("|");
          $scope.productaftersplitting=$scope.arrayofproducts[1];
          var productobject={
            "Name":$scope.arrayofproducts[0],
            "id":$scope.arrayofproducts[1]
          }
      $scope.productsforCampaign.push(productobject);
        }
        $scope.location_idarray=[];
        for(var m=0;m<$scope.selectedcampaignDetails[0].location.length;m++){
        for(var l=0;l<$scope.LocationList.length;l++){
        if($scope.LocationList[l].location==$scope.selectedcampaignDetails[0].location[m]){
          var locdata = {
            "id": $scope.LocationList[l].location_id,
            "locName": $scope.LocationList[l].location
          }
          $scope.location_idarray.push(locdata);
        }
        }
        }


          var startdate=new Date($scope.selectedcampaignDetails[0].start_date);

          var enddate=new Date($scope.selectedcampaignDetails[0].end_date);


        $scope.endDate=(enddate.getMonth()+1)+'/' + enddate.getUTCDate()+'/'+enddate.getFullYear();


           var campaignDetails = {
            "name": $scope.selectedcampaignDetails[0].campaign_name,
            "desc": $scope.selectedcampaignDetails[0].description,
            "retailer_id": sessionStorage.user,
            "start_date": moment(startdate).format("DD/MM/YYYY"),
            "end_date": $scope.endDate,
            "itemLocation": $scope.location_idarray,
            "products": $scope.productsforCampaign,
            "stores": $scope.storesforCampaign,
            "campaign_id":$scope.id
          }

          campaignService.Regiterdata(campaignDetails);

          $scope.accpetedaaray=[]
          $scope.accpetedaaray=response.data.products;

          $scope.accpetedaaray1=response.data.campaign_id;

            $scope.Luanchdate= $scope.selectedcampaignDetails[0].start_date;

            $scope.currentDateFormat = new Date();

            $scope.Luanchdate = $filter('date')($scope.Luanchdate, "yyyy-MM-dd");
            $scope.currentDateFormat = $filter('date')($scope.currentDateFormat, "yyyy-MM-dd");
            $scope.dateremaing=$scope.Luanchdate-$scope.currentDateFormat;

            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            var firstDate = new Date($scope.Luanchdate);
            var secondDate = new Date($scope.currentDateFormat);

            if(firstDate>secondDate)
            {
              $scope.showlaunchlable=true;
              $scope.showcampaignstatus=false;

              $scope.diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

            }
            else
            {
              $scope.diffDays=0;
              $scope.showcampaignstatus=true;
              $scope.showlaunchlable=false;
              $scope.campaignstatus=$scope.selectedcampaignDetails[0].status;
              //console.log("campaign statuus...",$scope.campaignstatus);

            }

          }, function (response) {
            console.log(response);
          }
        );
      }





$scope.GetLocations = function () {
        campaignService.getitemLocations().then(function (response) {

            $scope.LocationList = response.data;

            console.log($scope.LocationList);

          }, function (response) {
            console.log(response);
          }
        );
      }

      $scope.cancelmodal=function(){

        angular.element(document).ready(function () {
          angular.element("#cancelcampaign").modal('show');

        });

      }

      $scope.campaigndelete = function () {

        sessionStorage.cId=$scope.id

        console.log("Selected Campaign cid ",sessionStorage.cId);


        angular.element(document).ready(function () {
          angular.element("#cancelcampaign").modal('hide');

        });


        campaignService.deleteCampaign().then(function (response) {

          $scope.message = response.data;
      $state.go('campaignListActive',{status: "Active"});

          }, function (response) {
            console.log(response);
          }
        );


      }


      $scope.flag = "campaign controller...."
      $scope.searchStore="";
      $scope.searchProduct=""

      $scope.nutella="data:image/jpeg;base64,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";

      $scope.init=function(){

        $scope.role=sessionStorage.role;

        if($scope.role=="cpg"){

          $scope.SelectedCampaignDetailforCPG();
          $scope.GetLocations();


        }
        else if($scope.role=="retailer"){

          $scope.SelectedCampaignDetail();
          $scope.GetLocations();
        }


      }

      $scope.init();
    }]);
