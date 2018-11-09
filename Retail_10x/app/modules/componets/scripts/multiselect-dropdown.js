'use strict';

/**
 * @ngdoc controller
 * @name components.topdepartmentsDirective
 * @requires $scope
 * @requires $state
 * @requires product.controller
 * @description
 *
 *
 * */


angular.module('Retails.multiselect-dropdown', [])

.directive('ngDropdownMultiselect' ,['$filter', '$document', '$compile', '$parse',
 function ($filter, $document, $compile, $parse) {
 return {
        restrict: 'AE',
        scope: {
            selectedModel: '=',
            options: '=',
            extraSettings: '=',
            events: '=',
            searchFilter: '=?',
            translationTexts: '=',
            groupBy: '@'
        },
    template: function (element, attrs) {
            var checkboxes = attrs.checkboxes ? true : false;
            var groups = attrs.groupBy ? true : false;

            var template = '<div class="multiselect-parent btn-group dropdown-multiselect">';
            template += '<button class="dropdown-toggle" ng-class="settings.buttonClasses" ng-click="toggleDropdown()" >{{getButtonText()}}&nbsp;<span class="caret"></span></button>';
            template += '<ul class="dropdown-menu dropdown-menu-form" ng-style="{display: open ? \'block\' : \'none\', height : settings.scrollable ? settings.scrollableHeight : \'auto\' }" style="overflow: scroll" >';           
            template += '<li role="presentation" ng-repeat="option in options ">';
            template += '<a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">';
            if (checkboxes) {
                template += '<div class="checkbox"><label><input class="checkboxInput" type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /> {{getPropertyForObject(option, settings.displayProp)}}</label></div></a>';
            } else {
                template += '<span data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}"></span> {{getPropertyForObject(option, settings.displayProp)}}</a>';
            }

            template += '</li>';
            template += '<li class="divider" ng-show="settings.selectionLimit > 1"></li>';
            template += '<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';
            template += '</ul>';
            template += '</div>';

            element.html(template);
        },
   link: function ($scope, $element, $attrs) {
     var $dropdownTrigger = $element.children()[0];
      var initMap = function () {

      }//initMap...END..

        $document.bind('click', function(event){
          var isClickedElementChildOfPopup = $element
            .find(event.target)
            .length > 0;
            
            if (isClickedElementChildOfPopup)
              return;
            
             $scope.open = false;
            $scope.$apply();
         });

        $scope.toggleDropdown = function () {
                $scope.open = !$scope.open;
               

            };

            $scope.checkboxClick = function ($event, id) {
                $scope.setSelectedItem(id);
                event.stopImmediatePropagation();
            };

             $scope.externalEvents = {
                onItemSelect: angular.noop,
                onItemDeselect: angular.noop,
                onSelectAll: angular.noop,
                onDeselectAll: angular.noop,
                onInitDone: angular.noop,
                onMaxSelectionReached: angular.noop
            };

            $scope.settings = {
                dynamicTitle: true,
                scrollable: false,
                scrollableHeight: '300px',
                closeOnBlur: true,
                displayProp: 'category_description',
                idProp: 'category_description',
                externalIdProp: 'category_description',
                enableSearch: false,
                selectionLimit: 0,
                showCheckAll: true,
                showUncheckAll: true,
                closeOnSelect: false,
                buttonClasses: 'btn btn-default admininputbox dropdwnbtnfont',
                closeOnDeselect: false,
                groupBy: $attrs.groupBy || undefined,
                groupByTextProvider: null,
                smartButtonMaxItems: 0,
                smartButtonTextConverter: angular.noop
            };

            $scope.texts = {
                
                selectionOf: '/',
                buttonDefaultText: 'select',
                dynamicButtonTextSuffix: 'checked'
            };

            

            angular.extend($scope.settings, $scope.extraSettings || []);
            angular.extend($scope.externalEvents, $scope.events || []);
            angular.extend($scope.texts, $scope.translationTexts);

            $scope.singleSelection = $scope.settings.selectionLimit === 1;

            function getFindObj(id) {
                var findObj = {};

                if ($scope.settings.externalIdProp === '') {
                    findObj[$scope.settings.idProp] = id;
                } else {
                    findObj[$scope.settings.externalIdProp] = id;
                }

                return findObj;
            }

            function clearObject(object) {
                for (var prop in object) {
                    delete object[prop];
                }
            }

            if ($scope.singleSelection) {
                if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
                    clearObject($scope.selectedModel);
                }
            }

           

             $scope.totalSelected=[];
            $scope.getButtonText = function () {
                if ($scope.settings.dynamicTitle && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && _.keys($scope.selectedModel).length > 0))) {
                    
                      

                        if ($scope.singleSelection) {
                            $scope.totalSelected=($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
                        } else {
                          for(var i=0; i<$scope.selectedModel.length; i++){
                            $scope.totalSelected=(angular.isDefined($scope.selectedModel[i]) ? $scope.selectedModel[i].category_description : 0);
                         }
                       }

                        if ($scope.totalSelected === 0) {
                            return $scope.texts.buttonDefaultText;
                        } else {
                          // console.log($scope.totalSelected);
                         
                            return $scope.totalSelected;
                        
                            // return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
                    }
                    // }
                } else {
                    return $scope.texts.buttonDefaultText;
                }
            };

            $scope.getPropertyForObject = function (object, property) {

                if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                    return object[property];
                }

                return '';
            };

           

            $scope.setSelectedItem = function (id, dontRemove) {
                var findObj = getFindObj(id);
                var finalObj = null;

                if ($scope.settings.externalIdProp === '') {
                    finalObj = _.find($scope.options, findObj);
                } else {
                    finalObj = findObj;
                }

                if ($scope.singleSelection) {
                    clearObject($scope.selectedModel);
                    angular.extend($scope.selectedModel, finalObj);
                    $scope.externalEvents.onItemSelect(finalObj);
                    if ($scope.settings.closeOnSelect) $scope.open = false;

                    return;
                }

                dontRemove = dontRemove || false;

                var exists = _.findIndex($scope.selectedModel, findObj) !== -1;

                if (!dontRemove && exists) {
                    $scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
                    $scope.externalEvents.onItemDeselect(findObj);
                } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
                    $scope.selectedModel.push(finalObj);

                    $scope.externalEvents.onItemSelect(finalObj);
                }
                if ($scope.settings.closeOnSelect) $scope.open = false;
                console.log("$scope.selectedModel",$scope.selectedModel);
            };

            $scope.isChecked = function (id) {
                if ($scope.singleSelection) {
                    return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
                }

                return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
            };

            $scope.externalEvents.onInitDone();
       





   }//link function..
 };//return..
}])