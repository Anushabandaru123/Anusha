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
angular.module('savecoupon.controllers', [])

  .controller('savecouponCtrl', ['$scope', '$state', 'serviceFactory', 'dashBoardService', 'couponService', '$filter', '$stateParams', 'usSpinnerService', 'productService', '$timeout',
    function ($scope, $state, serviceFactory, dashBoardService, couponService, $filter, $stateParams, usSpinnerService, productService, $timeout) {

         $scope.getsavevalue = couponService.getcoupon();

          $scope.role=sessionStorage.role;
               $scope.image=[];
               console.log("data",$scope.getsavevalue);
               if($scope.getsavevalue.image[0].file_path){
                $scope.imagePath=$scope.getsavevalue.image[0].file_path;
                $scope.image=$scope.getsavevalue.image;
               }
               else{

                $scope.imageSplit=$scope.getsavevalue.image.split("/");

               console.log("image split...",$scope.imageSplit[5]);

                 var addsheetfileobject={
      "orginalName":$scope.imageSplit[5],
      "guidName":$scope.imageSplit[5],
      "file_path":$scope.getsavevalue.image,
      }
           
               $scope.image.push(addsheetfileobject);
               
                 
                $scope.imagePath=$scope.getsavevalue.image;
               }
            
            
               $scope.editcoupon = function(){
               	  couponService.updatecouponMode("update");
                  var CouponEditdata={
                      "couponId": $scope.getsavevalue.couponId,
                      "selectedretailer":$scope.getsavevalue.selectedretailer,
                      "productname": $scope.getsavevalue.productname, 
                      "image":$scope.image,
                      "startdate":$scope.getsavevalue.startdate,
                      "enddate":$scope.getsavevalue.enddate,
                      "coupon_discount":$scope.getsavevalue.coupon_discount,
                      "coupon_expiration":$scope.getsavevalue.coupon_expiration,
                      "terms":$scope.getsavevalue.terms
                      };

               	 couponService.setEditcoupon(CouponEditdata);
               	 console.log("editdata...",CouponEditdata);
                  
               	 $state.go('coupon');
                 }
           
           $scope.postcoupon = function(){

                  var dataobject={
                      "provider_type":sessionStorage.role,
                       "provider_id": parseInt(sessionStorage.user), 
                     "coupon_id": $scope.getsavevalue.couponId,
                     "coupon_status": "3"
                      }

                couponService.updateCouponStatus(dataobject).then(function (response) {
                     console.log("response...",response);
                     $state.go("couponUpcomingList");
                }, function (response) {

                console.log(response);
               }
               );
                
               }

               $scope.coupondeletemodal=function(){

           angular.element(document).ready(function () {
              angular.element("#cancelcampaign").modal('show');

            });

         }


               $scope.deleteCoupon=function(){

                angular.element(document).ready(function () {
              angular.element("#cancelcampaign").modal('hide');

            });
                sessionStorage.couponId=$scope.getsavevalue.couponId;
                 couponService.Deletecoupon().then(function (response) {
                       console.log("response...",response);
                     $state.go("couponUpcomingList");

                 }, function (response) {
                console.log(response);
               }
               );

               }


    }]);
