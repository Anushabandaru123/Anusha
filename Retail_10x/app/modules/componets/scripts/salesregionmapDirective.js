'use strict';

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


angular.module('Retails.salesregionmapDirective', ['product.controllers'])


  .directive('salesregionmapDirective', ['$compile', '$window', '$timeout','salesRegionService',
    function ($compile, $window, $timeout,salesRegionService) {
      return {
      restrict: 'E',
      replace: true,
      scope: {
        alldata:'=',
        storedata:'='
      },
      template: "<div style='align:center;height: 260px;width: 100%'></div>",
      link: function (scope, element) {
        var mapData=null;
        var initMap = function (data) {
          //console.log('*dir scope data :=',data);
          var map;
          var mapOptions;
          var mapCenter = null;
          map=null;
          mapOptions = null;

          if (data && data.storeLongLat) {

          mapCenter = new google.maps.LatLng(data.storeLongLat.split(",")[1], data.storeLongLat.split(",")[0]);
          }
          else if(data){

            console.log("map data....",data);
            var data={
             "amount": data.amt,
             "retailer":data.retailer,
             "storeId":data.id,
             "storeLongLat":"-117.314902,34.075577",
             "storeName":data.content.split(".")[1]
            }


          mapCenter = new google.maps.LatLng(data.storeLongLat.split(",")[1], data.storeLongLat.split(",")[0]);
         

          }
          else{

            scope.regiondata=salesRegionService.getregiondata();

             //console.log("region data...",scope.regiondata);

             if(scope.regiondata){
               var data={
             "amount": scope.regiondata.amount,
             "retailer":"carnicerias jimenez",
             "storeId":"15",
             "storeLongLat":scope.regiondata.countryLongLat,
             "storeName":scope.regiondata.country
            }


          mapCenter = new google.maps.LatLng(data.storeLongLat.split(",")[1], data.storeLongLat.split(",")[0]);
         
             }
             else{
              var data={
             "amount": "1312426.83",
             "retailer":"carnicerias jimenez",
             "storeId":"15",
             "storeLongLat":"-117.314902,34.075577",
             "storeName":""
            }

          mapCenter = new google.maps.LatLng(data.storeLongLat.split(",")[1], data.storeLongLat.split(",")[0]);

             }
            

          }

          mapOptions = {
            center: mapCenter,//new google.maps.LatLng(data.latitude, data.longitude),
            zoom: 2,
            mapTypeId: 'roadmap',
            fullscreenControl: true,
            mapTypeControl: true,
            zoomControl:true,
            streetViewControl: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              position: google.maps.ControlPosition.TOP_RIGHT
            }
          };
          map = new google.maps.Map(element[0], mapOptions);

          //console.log("data....",data);

              var role=sessionStorage.role;
              if(role=="retailer"){
              var retailer=""
              }
              else{
                var retailer=data.retailer.toUpperCase();

              }
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(data.storeLongLat.split(",")[1],data.storeLongLat.split(",")[0]),
              content: retailer+" STORE "+data.storeName+": $"+data.amount,
              draggable: false,
              title: retailer+" STORE "+data.storeName,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeColor: "#00cc00",
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: "#00cc00",
                fillOpacity: 0.6,
                scale: 10 //pixels
              },
              map : map
            });

            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', (function (marker, infowindow) {
              return function () {
                infowindow.setContent(this.content);
                infowindow.setPosition(this.center);
                infowindow.open(map, this);
              };
            })(marker, infowindow));
            google.maps.event.addListener(marker, 'dblclick', (function (marker) {
              return function () {
                map.setZoom(map.getZoom()+1);
              };
            })(marker));

        }//initMap...END..
        // if (scope.storedata) {
        //   mapData = scope.storedata;
        // }else {
        //   mapData = scope.alldata.markers[5];
        // }

        mapData = scope.storedata;

        setTimeout(function() {
            initMap(mapData);
        }, 100);
        // google.maps.event.addDomListener(window, 'change', function() {
        //   initMap(mapData);
        //  });

      }//link function..
    }//return..

    }]);
