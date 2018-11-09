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


angular.module('cpg.productdropdown', [])

.directive('productDropdown',['$compile','productService','$timeout','$rootScope',
    function ($compile,productService,$timeout,$rootScope) {
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

          if($scope.selected==undefined){
          }
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
         scope.savedvalue=productService.getsavestoreselected();
        scope.selected= scope.savedvalue;

           if(scope.selected==undefined){
           }
            var list =  angular.element(element[0].querySelector('.list'));
            scope.$watchGroup(['data', 'selected'], function(newValues, oldValues, scope) {
                list.html('');

                if(!scope.selected){
                  console.log("coming to here...");
              scope.savedvalue=productService.getsavestoreselected();
              scope.selected= scope.savedvalue;
                    setSelectedall (scope,  scope.savedvalue);
                }
                var options = getOptions(scope, scope.data, 0);
                list.append($compile(options)(scope));
            });

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
      
        var optionUL = angular.element("<ul></ul>");
        angular.forEach(data, function(obj){

            var optionLI = angular.element("<li></li>");
            if(obj.name=="DMA"){
              var optionA = angular.element("<p style='margin-top:4px;color:#D3D3D3;' class='level-"+level+"'>"+obj.name+"</p>");
            }
            else if(obj.name=="RETAILER"){
            var optionA = angular.element("<p style='margin-top:4px;color:#D3D3D3;' class='level-"+level+"'>"+obj.name+"</p>");
            }
            else{
             if(obj.hasOwnProperty("name")){
            var optionA = angular.element("<p  ng-class='{selected:selected.id=="+obj.id+"}' class='level-"+level+"'>"+obj.name+"</p>");
             }
             else{
               var optionA = angular.element("<p ng-class='{selected:selected.id=="+obj.id+"}' class='level-"+level+"'>"+obj.name+"</p>");
             }
            }
            optionLI.append(optionA);
            if(scope.selected==obj){
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
        if(obj){

          if(obj.name!="DMA"&&obj.name!="RETAILER"){
             scope.selected= obj;
            obj=scope.selected;
        productService.setsavestoreselected(obj);
            //dashBoardService.setrecordfromtreedropdown(obj);
           // dashBoardService.setsavestoreselected(obj);
            scope.callback();
          }
           
        } else {
            scope.selected = null;
        }
        }

function setSelectedall(scope, obj){
        if(obj){
            scope.selected= obj;
            obj=scope.selected;
        productService.setsavestoreselected(obj);
            //dashBoardService.setrecordfromtreedropdown(obj);
        } else {

            scope.selected = null;
        }
        }


}])
