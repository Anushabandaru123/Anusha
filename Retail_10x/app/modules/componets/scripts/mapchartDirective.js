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


angular.module('Retails.mapchart', [])

.directive('googleMapComponent' ,['dashBoardService','salesRegionService','$filter','$window','productService', function (dashBoardService,salesRegionService,$filter,$window,productService) {
 return {
   restrict: 'E',
   replace: true,
   scope: {
       data: '=',
       callstore: '&'
   },
   template: "<div style='height: 260px;width: 100%'></div>",
   link: function (scope, element) {
     var map;
     var initMap = function (data,mapstate) {
          if(mapstate==1){
           // console.log("data...",scope.reportTime);
            salesRegionService.setregiondata(data);
               map=null;
               var markers =[];
               var  i;
               var ltLg = data.countryLongLat.split(',');
               var mapCenter = new google.maps.LatLng(ltLg[1],ltLg[0]);//(42.873325, -109.614095);
               var mapOptions = {
                 center: mapCenter,
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
              //console.log("states data....",data.states);
               for (i = 0; i < data.states.length; i++) {
                 ltLg = data.states[i].stateLongLat.split(',');
                 var amount=$filter('number')(data.states[i].amount,2)
                 var marker = new google.maps.Marker({
                   position: new google.maps.LatLng(ltLg[1],ltLg[0]),
                   content: "<a id='linkContent' value='"+data.states[i].state+"' style='cursor:pointer;' >"+data.states[i].state.toUpperCase()+": $"+amount+"</a>",
                   draggable: false,
                   title: data.states[i].state,
                   icon: {
                     path: google.maps.SymbolPath.CIRCLE,
                     strokeColor: "#00cc00",
                     strokeOpacity: 0.7,
                     strokeWeight: 2,
                     fillColor: "#00cc00",
                     fillOpacity: 0.6,
                     scale: 10//data.markers[i].value //pixels
                   },
                   map : map
                 });
                 var infowindow = new google.maps.InfoWindow();
                 google.maps.event.addListener(marker, 'mouseover', (function (marker, i, infowindow) {
                   return function () {
                     infowindow.setContent(this.content);
                     infowindow.setPosition(this.center);
                     infowindow.open(map, this);
                   };
                 })(marker, i, infowindow));
        google.maps.event.addListener(marker, 'mouseout', (function (marker, i, infowindow) {
              return function () {
                     
              infowindow.close();
                   };
                 })(marker, i, infowindow));
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {

              scope.role=sessionStorage.role;
             // console.log("role...",scope.role);
        if(scope.role=="cpg"){
          scope.allRetailers=productService.getallRetailers();
          scope.reportTime=dashBoardService.getreportTime();
          var queryObj={
               "startTime": scope.reportTime.reportstartTime,
               "endTime": scope.reportTime.reportendTime,
               "geoLevel" : 4,
               "filters" :{
               "item.mfgId" : [sessionStorage.mfgId],
               "location.state" : [this.title],
               // [$('a#linkContent')[0].attributes.value.nodeValue],
                "retailerId" :scope.allRetailers

              }
              }
             dashBoardService.getgeoSalesDataforCpg(queryObj).then(function (response) {
             scope.StoresData={
             map: "usaLow",
             getAreasFromMap: true,
             "markers": []
             };
             scope.geoStoreData=response.data.data;
            initMap(scope.geoStoreData[0], 4);
            }, function (response) {
          console.log(response);
          })
        }
        else if(scope.role=="distributor"){
        scope.reportTime=dashBoardService.getreportTime();
        var queryObj={
              "startTime": scope.reportTime.reportstartTime,
              "endTime": scope.reportTime.reportendTime,
              "geoLevel" : 4,
              "filters" :{
              "items.brandId" :dashBoardService.getBrandIdList(),
              "location.state" : [$('a#linkContent')[0].attributes.value.nodeValue]
              }
              }
            dashBoardService.getgeosalesDataByBrands(queryObj).then(function (response) {
            scope.StoresData={
              map: "usaLow",
              getAreasFromMap: true,
              "markers": []
              };
              scope.geoStoreData=response.data.data;
             //console.log("to stores for map....",scope.geoStoreData);
            initMap(scope.geoStoreData[0], 4);
            }, function (response) {
              console.log(response);
            })
        }
        else{
          scope.reportTime=dashBoardService.getreportTime();
     var queryObj={
              "startTime": scope.reportTime.reportstartTime,
                "endTime": scope.reportTime.reportendTime,
               "geoLevel" : 4,
                "filters" :{
               "location.state" : [$('a#linkContent')[0].attributes.value.nodeValue]
                   }
                   }
      dashBoardService.getgeoSalesData(queryObj).then(function (response) {
                   scope.StoresData={
                   map: "usaLow",
                   getAreasFromMap: true,
                   "markers": []
                            };
                      scope.geoStoreData=response.data.data;
                     // console.log("to stores for map....",scope.geoStoreData);
                    initMap(scope.geoStoreData[0], 4);
                          }, function (response) {
                              console.log(response);
                          })
                     }
                   };
                 })(marker, i));
               }//loop..
            }//..IF..    

          else if(mapstate==4){
            //console.log("initmap 4 called",mapstate);
               map=null;
               var markers =[];
               var  i,j;
               var role=sessionStorage.role;
               if(role=="retailer"){
                // console.log("data....",data)
              var datacenter=data.states[0].cities[0].stores[0];
              var ltLg = datacenter.storeLongLat.split(',');
              var mapCenter = new google.maps.LatLng(ltLg[1],ltLg[0]);//(42.873325, -109.614095);
               var mapOptions = {
                 center: mapCenter,
                 zoom: 7,
                 mapTypeId: 'roadmap',
                 fullscreenControl: true,
                 mapTypeControl: false,
                 zoomControl:true,
                 streetViewControl: false,
                 mapTypeControlOptions: {
                 style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                 position: google.maps.ControlPosition.TOP_RIGHT
                 }
               };
              map = new google.maps.Map(element[0], mapOptions);
              var statesData=data;
              for(var k=0;k<statesData.states.length;k++){
              data=statesData.states[0];
              console.log("data[k]...",data);
              for(j =0;j<data.cities.length;j++) {
              for(i =0;i<data.cities[j].stores.length;i++){
               //console.log("cities....",data.cities[j].stores[i]);
               ltLg =data.cities[j].stores[i].storeLongLat.split(',');
               var amount=$filter('number')(data.cities[j].stores[i].amount,2)
                if(role=="retailer"){
                    var retiler="";
                    }
                    else{
                     var retiler=data.cities[j].stores[i].retailer.toUpperCase();
                    }
                    var marker = new google.maps.Marker({
                      position: new google.maps.LatLng(ltLg[1],ltLg[0]),
                      content: "<a id='linkContent' style='cursor:pointer;' >"+retiler+" STORE "+data.cities[j].stores[i].storeName+": $"+amount+"</a>",
                      draggable: false,
                      title: "store "+data.cities[j].stores[i].storeName,
                      icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        strokeColor: "#00cc00",
                        strokeOpacity: 0.7,
                        strokeWeight: 2,
                        fillColor: "#00cc00",
                        fillOpacity: 0.6,
                        scale: 10//data.markers[i].value //pixels
                      },
                      map : map
                    });
                   var infowindow = new google.maps.InfoWindow();
                    google.maps.event.addListener(marker, 'mouseover', (function (marker, i, infowindow) {
                      return function () {
                        infowindow.setContent(this.content);
                        infowindow.setPosition(this.center);
                        infowindow.open(map, this);
                      };
                    })(marker, i, infowindow));
                    google.maps.event.addListener(marker, 'mouseout', (function (marker, i, infowindow) {
                      return function () {
                        infowindow.close();
                      };
                    })(marker, i, infowindow));
                   var temp ;
                    google.maps.event.addListener(infowindow, 'domready', (function (infowindow, i, j) {
                      return function () {
                        console.log("cities....",data.cities[j]);
                        temp = data.cities[j].stores[i];
                      };
                    })(infowindow, i, j));
                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                      return function () {
                        // scope.callstore({args:temp});
                       };
                    })(marker, i));
                  }//loop..
                } 
              }
              }
            else {
                    data=data.states[0];
              var ltLg = data.stateLongLat.split(',');
              var mapCenter = new google.maps.LatLng(ltLg[1],ltLg[0]);//(42.873325, -109.614095);
              var mapOptions = {
                 center: mapCenter,
                 zoom: 7,
                 mapTypeId: 'roadmap',
                 fullscreenControl: true,
                 mapTypeControl: false,
                 zoomControl:false,
                 streetViewControl: false,
                 mapTypeControlOptions: {
                   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                   position: google.maps.ControlPosition.TOP_RIGHT
                 }
               };
               map = new google.maps.Map(element[0], mapOptions);
              for (j =0;j<data.cities.length;j++){
              for (i =0;i<data.cities[j].stores.length;i++){
              ltLg = data.cities[j].stores[i].storeLongLat.split(',');
                  var role=sessionStorage.role;
                  var amount=$filter('number')(data.cities[j].stores[i].amount,2)
                    if(role=="retailer"){
                    var retiler="";
                    }
                    else{
                     var retiler=data.cities[j].stores[i].retailer.toUpperCase();
                    }
                    var marker = new google.maps.Marker({
                      position: new google.maps.LatLng(ltLg[1],ltLg[0]),
                      content: "<a id='linkContent' style='cursor:pointer;' >"+retiler+" STORE "+data.cities[j].stores[i].storeName+": $"+amount+"</a>",
                      draggable: false,
                      title: "store "+data.cities[j].stores[i].storeName,
                      icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        strokeColor: "#00cc00",
                        strokeOpacity: 0.7,
                        strokeWeight: 2,
                        fillColor: "#00cc00",
                        fillOpacity: 0.6,
                        scale: 10//data.markers[i].value //pixels
                      },
                      map : map
                    });
                   var infowindow = new google.maps.InfoWindow();
                    google.maps.event.addListener(marker, 'mouseover', (function (marker, i, infowindow) {
                      return function () {
                        infowindow.setContent(this.content);
                        infowindow.setPosition(this.center);
                        infowindow.open(map, this);
                      };
                    })(marker, i, infowindow));
                    google.maps.event.addListener(marker, 'mouseout', (function (marker, i, infowindow) {
                      return function () {
                        infowindow.close();
                      };
                    })(marker, i, infowindow));
                   var temp ;
                    google.maps.event.addListener(infowindow, 'domready', (function (infowindow, i, j) {
                      return function () {
                        temp = data.cities[j].stores[i];
                      };
                    })(infowindow, i, j));
                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                      return function () {
                         scope.callstore({args:temp});
                       };
                    })(marker, i));
                  }//loop..
                } 
                   }
               
  // back button function.....
             function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        // controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);
        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '10px';
        controlText.innerHTML = 'Back';
        controlUI.appendChild(controlText);
        // Setup the click event listeners.
        controlUI.addEventListener('click', function() {
    setTimeout(function() {
        initMap(scope.data, 1);
     }, 100);
        });

      }
       if(sessionStorage.role!="retailer"){

         var url = window.location.href; 
         var n=url.split("/");
          var word = n[n.length - 1];
          if(word!="storeComparision"){
            //initMap(scope.data, 4);
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv); 
          }
       
       }
       }//..IF..  
         }//initMap...END..

     setTimeout(function() {
      if(sessionStorage.role=="retailer"){
        initMap(scope.data, 4);
      }
      else if(sessionStorage.role=="cpg"){
          var url = window.location.href; 
         var n=url.split("/");
          var word = n[n.length - 1];
          if(word=="storeComparision"){
            initMap(scope.data, 4);
          }
          else{
            console.log("coming into else..");
            initMap(scope.data, 1);
          }
        
      }
      else{

          var url = window.location.href; 
         var n=url.split("/");
          var word = n[n.length - 1];
          if(word=="storeComparision"){
            initMap(scope.data, 4);
          }
          else{
            initMap(scope.data, 1);
          }
        //initMap(scope.data, 1);
      }
     }, 100);

   }//link function..
 }//return..
}])


