'use strict';

/**
 * @ngdoc controller
 * @name cpg.dropdown
 * @requires $scope
 * @requires $state
 * @description
 *
 *
 * */


angular.module('cpg.dropdown', [])

.directive('treeDropdown',['$compile','dashBoardService','$timeout','$rootScope',
    function ($compile,dashBoardService,$timeout,$rootScope) {
    var template = "<div  class='select form-control' ng-click='openTree()'  ><p>{{selected.name}}</p></div>";
   template += "<div class='list' ng-show='isOpen'></div>";

    return {
        restrict: 'E',
        scope: {

            data: '=',
            selected: '=selectdata',
            callback:'&'

        },

        template: template,
        controller: function($scope, $element){

        // $scope.selected=$scope.data[0];
          //console.log("selected...",$scope.selected);
          if($scope.selected==undefined){
        //  $scope.selected=  $rootScope.selected;
          }
         // console.log("selected  after...",$scope.selected);
        //  var ctrl=this;
            //ctrl = $scope;
            $scope.isOpen = false;
            $scope.openTree = function(){
                $scope.isOpen = $scope.isOpen? false:true;
            }
            $scope.childClick = function(obj){
                setSelected($scope, obj);
                $scope.isOpen = false;
                $scope.$apply();
            }
        },
        link: function(scope, element, attrs, ngModel) {
        //   scope.selected=scope.data[0];
          //console.log("data...",scope.data);
         scope.savedvalue=dashBoardService.getsavestoreselected();
        scope.selected= scope.savedvalue;
       // console.log("saved service value...",scope.savedvalue);

           if(scope.selected==undefined){
           // console.log("coming to here.....");
           //scope.selected=  $rootScope.selected;
           }
         // console.log("selected  after...",scope.selected);
            var list =  angular.element(element[0].querySelector('.list'));
            scope.$watchGroup(['data', 'selected'], function(newValues, oldValues, scope) {
                list.html('');

                if(!scope.selected){
              // console.log("comin to here....");
              scope.savedvalue=dashBoardService.getsavestoreselected();
              scope.selected= scope.savedvalue;
                  /*var object= {
                          "id": 1,
                  		"name": "All",
                      "retailerId":"All"

                   	}*/
                    setSelectedall(scope,  scope.savedvalue);
                }
                var options = getOptions(scope, scope.data, 0);
                list.append($compile(options)(scope));
            });

            // Close on click outside the dropdown...
            angular.element(document).bind('click', function(event){
                if (element !== event.target && !element[0].contains(event.target)) {
                    scope.$apply(function(){
                        scope.isOpen = false;
                    })
                }
            });
        }
    };

    function getOptions(scope, data, level){
      
     //console.log("level...",level);
       //console.log("data...",data);

        var optionUL = angular.element("<ul></ul>");

        angular.forEach(data, function(obj){

            //console.log("obj...",obj);
            var optionLI = angular.element("<li></li>");
            // if(obj.name=="DMA"){
            //   var optionA = angular.element("<p style='margin-top:4px;color:#D3D3D3;' class='level-"+level+"'>"+obj.name+"</p>");

            // }
            if(obj.name=="RETAILER"){
            var optionA = angular.element("<p style='margin-top:4px;color:#D3D3D3;' class='level-"+level+"'>"+obj.name+"</p>");

            }
            else{

              //console.log(obj.hasOwnProperty("name"));

             if(obj.hasOwnProperty("name")){
            var optionA = angular.element("<p  ng-class='{selected:selected.id=="+obj.id+"}' class='level-"+level+"'>"+obj.name+"</p>");

             }
             else{
               var optionA = angular.element("<p ng-class='{selected:selected.id=="+obj.id+"}' class='level-"+level+"'>"+obj.name+"</p>");

             }

 
            }
            optionLI.append(optionA);
            // Set selected option if selected id or object exist..
            //console.log("obj...",obj);
            if(scope.selected==obj){
                //setSelected (scope, obj);
            }
            optionA.bind("click", function(){
                scope.childClick(obj);
            })

            if(obj.children){
                optionLI.append(getOptions(scope, obj.children, level+1));
            }
            optionUL.append(optionLI);
        })

        return optionUL;
    }

   function setSelected(scope, obj){
    
   // console.log("onj.....",obj);
        if(obj){
// obj.name!="DMA"&&
          if(obj.name!="ALL Retailer"){
             scope.selected= obj;
            //console.log("selected...",scope.selected);
            //console.log("obj...",obj);
            obj=scope.selected;
            dashBoardService.setrecordfromtreedropdown(obj);
            dashBoardService.setsavestoreselected(obj);
            scope.callback();
          }
           
        } else {
            scope.selected = null;
        }
        }

function setSelectedall(scope, obj){
  // console.log("obj.....",obj);
        if(obj){
            scope.selected= obj;
          // console.log("selected...",scope.selected);
            //console.log("obj...",obj);
            obj=scope.selected;
            dashBoardService.setrecordfromtreedropdown(obj);
            //scope.callback();
        } else {

            scope.selected = null;
        }
}


}])
