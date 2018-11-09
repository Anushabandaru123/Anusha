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
angular.module('savecampaign.controllers', [])


  .controller('savecampaignCtrl', ['$scope', '$state', 'serviceFactory', 'dashBoardService', 'campaignService', '$filter', '$stateParams', 'usSpinnerService', 'productService', '$timeout',
    function ($scope, $state, serviceFactory, dashBoardService, campaignService, $filter, $stateParams, usSpinnerService, productService, $timeout) {

           $scope.products=[];
           $scope.stores=[];
           $scope.promotionTypes=[];


         $scope.getsavevalue = campaignService.getcampaign();
               
           console.log("data",$scope.getsavevalue);

           $scope.spinner=false;


                $scope.cid = $stateParams.id;


               $scope.sendinvite = function(){

                $scope.spinner=true;

                var sendemaildata={
                      "emailCode": "INVITE_CAMPAIGN_PRODUCT_EMAIL",
                      "campaign_id": $scope.cid.toString()
                       } 

                campaignService.sendEmail(sendemaildata).then(function(response){
 
                  $state.go('sendinvite',{id:$scope.cid});

                },function(response){
                  $state.go('sendinvite');
                })
               
               }

               $scope.edit=function(){
               	campaignService.updatecampaignMode("update");
               $state.go('Campaigns');
               }

            $scope.cancelmodal=function(){

           angular.element(document).ready(function () {
              angular.element("#cancelcampaign").modal('show');

            });

        }

        $scope.campaigndelete = function () {

           angular.element(document).ready(function () {
              angular.element("#cancelcampaign").modal('hide');

            });

        sessionStorage.cId=$scope.cid;

        campaignService.deleteCampaign().then(function (response) {

            $scope.message = response.data;

            /*angular.element(document).ready(function () {
              angular.element("#cancelcampaign").modal('hide');

            });*/

            $state.go('campaignListActive',{status: 'Active'});

          }, function (response) {
            console.log(response);
          }
        );


      }

               

        $scope.getcampaignDetails=function(){

        $scope.showspinner=true;

        campaignService.getCampaignDetails().then(function(response){

        $scope.campaignData=response.data[0];
        $scope.products=$scope.campaignData.products;

        $scope.retailers=$scope.campaignData.rid;

        for(var i=0;i<$scope.products.length;i++){

        var productParts=$scope.products[i].split("|");

      var productObject=
          {
          "PrdctTitle": $scope.retailers[0].split("|")[1],
          "prdctName":productParts[0],
          "retailerName":$scope.retailers[0].split("|")[1],
          "upc":productParts[1],
      }
      $scope.ProductData.push(productObject);
      }

    console.log("api response...",$scope.campaignData);
         },function(response){

        });
        }

          $scope.init=function(){
            sessionStorage.cId=$scope.cid;

           // $scope.getcampaignDetails();
          }

          $scope.init();

    }]);
