'use strict';

 
  /**
   * @ngdoc controller
   * @name DashBoardModule.dashBoardController
   * @requires $scope
   * @requires $state
   * @requires dashBoard.serviceFactory
   * @description
   * dashBoard performs the app calls for dashbaord with help of Service and broadcasts the events to other modules
   *
   * */

 angular.module('admin.controllers', ['Retails.multiselect-dropdown'])
   .controller('adminCtrl', ['$scope', '$state', 'serviceFactory','dashBoardService','adminService', '$http', '$timeout', 'usSpinnerService', '$rootScope','CacheFactory','$filter',
    function ($scope, $state, serviceFactory,dashBoardService,adminService, $http, $timeout, usSpinnerService, $rootScope,CacheFactory,$filter) {
            
      if (sessionStorage.user == undefined || sessionStorage.user == null || sessionStorage.user == "null") {
        $state.go('login');
      }
     
      $scope.userlist=[];
      $scope.categoryDescription=[];
      $scope.selectedCategory = [];
      //$scope.setEditFlag=true;
      
    $scope.edituser=function(user){
         $scope.selectedCategory=[]
         $scope.categoryDescription=[]
         $scope.setEditFlag=true;
         //console.log("user",user);
         document.getElementById("edituser_"+ user.login_id).style.display = "block";
         document.getElementById("user_"+ user.login_id).style.display = "none";
             
        for(var i=0; i<$scope.userlist.length; i++){
             if(user.login_id === $scope.userlist[i].login_id){
                  $scope.getFname=$scope.userlist[i].first_name;
                  $scope.getLname=$scope.userlist[i].last_name;
                  $scope.getMobile=$scope.userlist[i].mobile;
                  $scope.getEmail=$scope.userlist[i].email;
                  $scope.getDesignation=$scope.userlist[i].designation;
                  $scope.countrycode=$scope.getMobile.slice(0, 3);
                  // console.log(" $scope.countrycode", $scope.countrycode);
                  $scope.getnumber=$scope.getMobile.slice( 3);
                  // console.log(" $scope.getnumber", $scope.getnumber);
             }
            else{               
                document.getElementById("user_"+$scope.userlist[i].login_id).style.display = "block";
                document.getElementById("edituser_"+ $scope.userlist[i].login_id).style.display = "none";
             }  
          }
                       
            for(var i=0; i<user.categories.length; i++){
              if(user.categories[i].category_description !='0'){
                $scope.selectedCategory.push(user.categories[i]);
                //console.log(".....", $scope.selectedCategory);
             }
           }
      }
      // $scope.crossbtnclick=function(){
      //    $scope.setEditFlag=true;
      // }
    $scope.cancelbtnclick=function(user){
        // $scope.setEditFlag=true;
         // document.getElementById("myForm").reset();
         document.getElementById("edituser_"+user.login_id).style.display = "none";
         document.getElementById("user_"+user.login_id).style.display = "block";
         document.getElementById("btnClick"+user.login_id).style.backgroundColor  = "rgba(255, 255, 255, 0.15)";
         document.getElementById("btnClick"+user.login_id).style.color = "grey";
         document.getElementById("btnClick"+user.login_id).style.border = "1px solid grey";
         $state.reload();
      }

    $scope.getuserList= function(){     
         adminService.getManageUserforRetailer().then(function (response){
          // console.log("getManageUserforRetailer",response.data);
           for(var i=0; i<response.data.length;i++){
              if(response.data[i].user_type =="O"){
              $scope.userlist.push(response.data[i]);   

             }
           }
          // console.log("$scope.userlist",$scope.userlist);
         })
      }


     $scope.getuserListforCPG= function(){
         adminService.getManageUserforCPG().then(function (response){
          // console.log("getManageUserforCPG",response.data);
           for(var i=0; i<response.data.length;i++){
            if(response.data[i].user_type =="O"){
              $scope.userlist.push(response.data[i]);
            }
           }
           //console.log("$scope.userlist",$scope.userlist);
         })
      }  

     $scope.getuserListforDistributor= function(){
         adminService.getManageUserforDistributor().then(function (response){
           console.log("getManageUserforDistributor",response.data);
           for(var i=0; i<response.data.length;i++){
            if(response.data[i].user_type =="O"){
              $scope.userlist.push(response.data[i]);
            }
           }
           //console.log("$scope.userlist",$scope.userlist);
         })
      }  

    $scope.getcategories= function(){
         adminService.GetcategoriesList().then(function (response){        
           $scope.getcategory=[];
           for(var i=0; i<response.data.length; i++){
            if(response.data[i].category_description!= ""){
             $scope.getcategory.push(response.data[i]);
            }
           }
             //console.log("GetcategoriesList",$scope.getcategory);
         })
      }

     $scope.getcategoriesforCPG= function(){
         adminService.GetcategoriesListforCPG().then(function (response){ 
         console.log("category",response);       
           $scope.getcategory=[];
           for(var i=0; i<response.data.length; i++){
            if(response.data[i].category_description!= ""){
             $scope.getcategory.push(response.data[i]);
            }
           }
             //console.log("GetcategoriesList",$scope.getcategory);
         })
      }
      
       $scope.getcategoriesforDistributor= function(){
         adminService.GetcategoriesListforDistributor().then(function (response){        
           $scope.getcategory=[];
           for(var i=0; i<response.data.length; i++){
            if(response.data[i].category_description!= ""){
             $scope.getcategory.push(response.data[i]);
            }
           }
            // console.log("GetcategoriesList",$scope.getcategory);
         })
      }  

    $scope.changebtncolor=function(data){     
        document.getElementById("btnClick"+data.login_id).style.backgroundColor = "#F15A24";
        document.getElementById("btnClick"+data.login_id).style.color = "white";
        document.getElementById("btnClick"+data.login_id).style.border = "#F15A24";
         
      }
      
   $scope.CheckMobileFlag=true;
   var phoneno = /^[0-9-+]+$/;
   $scope.errorMessage = "Invalid Entry";

   $scope.UpdateUser=function(userdata){          
      for(var j=0; j<$scope.userlist.length; j++){
          if(userdata.login_id == $scope.userlist[j].login_id){
            $scope.loginId = $scope.userlist[j].login_id;
            var mobile=document.getElementById("phone"+userdata.login_id).value;
            var ctrycode=document.getElementById("countrycode"+userdata.login_id).value;
            $scope.getFname= document.getElementById("fname"+userdata.login_id).value;
            $scope.getLname= document.getElementById("lname"+userdata.login_id).value;
            $scope.getEmail= document.getElementById("email"+userdata.login_id).value;       
            $scope.getDesignation= document.getElementById("role"+userdata.login_id).value;
            $scope.getMobile= ctrycode+mobile;
            console.log("$scope.getMobile",$scope.getMobile);
         }
    } 
   
   if($scope.getFname != "" && $scope.getLname != "" && $scope.getEmail!="" && $scope.getMobile!="" && $scope.getDesignation!="") {       
      if($scope.getMobile.match(phoneno) && $scope.getMobile.length >9 ) {  
          $scope.CheckMobileFlag=true;  
            var data={
                  "login_id":   $scope.loginId,
                  "first_name": $scope.getFname ,
                  "last_name": $scope.getLname,
                  "email": $scope.getEmail,
                  "mobile": $scope.getMobile,
                  "designation": $scope.getDesignation,
                  "categories" : $scope.categoryDescription
              }
           adminService.updateLogin(data).then(function (response) {
                  console.log("Update login",response);
                  $scope.userlist =[];
                  $scope.setEditFlag=true;
                  document.getElementById("edituser_"+userdata.login_id).style.display = "none";
                  document.getElementById("user_"+userdata.login_id).style.display = "block";
                  if($scope.role =="retailer"){
                       $scope.getuserList();
                  }
                  else if($scope.role =="cpg"){
                      $scope.getuserListforCPG();
                  }
                  else if($scope.role =="distributor"){
                       $scope.getuserListforDistributor();
                  }
             })
         }  
        else{  
               $scope.CheckMobileFlag=false;  
             }
      }else{
        // $scope.msg="Please Fill All Fields.";
        alert("Please Fill All Fields");
      }   
         }

  $scope.getelement=function(data){
     $scope.changebtncolor(data);
      $scope.categoryDescription=[]; 
      // console.log(".....", $scope.selectedCategory);
        for(var i=0; i<$scope.selectedCategory.length; i++){
           for(var j=0; j<$scope.getcategory.length; j++){
              if($scope.selectedCategory[i].category_description === $scope.getcategory[j].category_description){
                  $scope.categoryDescription.push({
                         "min_category_id":$scope.getcategory[j].min_category_id,
                         "major_category_id":$scope.getcategory[j].major_category_id,
                         "sub_category_id":$scope.getcategory[j].sub_category_id
                       });
                  }
               }
           }
   }

  $scope.selectedCategorysettings = {
        scrollableHeight: '400px',
        scrollable: true,
        enableSearch: true
    };

 $scope.example2settings = {
        displayProp: 'id'
    };
   
    
 // $(document).ready(function() {
 //        $('#framework').multiselect({
 //          nonSelectedText:'select option',
 //          enableFiltering:true,
 //          buttonWidth:'400px',
 //        });
 //    });


      $scope.init=function(){
         $scope.role=sessionStorage.role;
         if($scope.role=="retailer"){
            $scope.getuserList();
            $scope.getcategories();
         }
         else if($scope.role=="cpg"){
            $scope.getuserListforCPG();
            $scope.getcategoriesforCPG();
         }
         else{
            $scope.getuserListforDistributor();
            $scope.getcategoriesforDistributor();
         }
       }

      $scope.init();

   }]);    