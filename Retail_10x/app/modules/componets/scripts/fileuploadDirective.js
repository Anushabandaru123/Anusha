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


angular.module('Retails.fileuploadDirective', ['shared.serviceFactory'])

  .directive('fileuploadDirective', ['$compile', '$window','serviceFactory', '$timeout','$rootScope','$filter',
    function ($compile, $window,serviceFactory,$timeout,$rootScope,$filter) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {

         
        },
        templateUrl: '',

        link: function (scope, element, attrs) {

           var albumBucketName = 'r10x-ui';
var bucketRegion = 'us-west-2';
var IdentityPoolId = 'us-west-2:ce7e2304-3c6e-4d69-88c9-f416d709ddc8';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});


    scope.mode=serviceFactory.getMode();

    //console.log("mode....",scope.mode);

    if(scope.mode=="development"){
    scope.folderName="dev/";
   }
   else if(scope.mode=="production"){
    scope.folderName="prod/";

   }

 


/*function addPhoto(albumName) {
  var files = document.getElementById('firstfile').files;
  console.log("files...",files);
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];
  var fileName = file.name;
  var albumPhotosKey = encodeURIComponent(albumName) + '/';

  var photoKey = albumPhotosKey + fileName;
  s3.upload({
    Key: photoKey,
    Body: file,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
      return alert('There was an error uploading your photo: ', err.message);
    }
    alert('Successfully uploaded photo.');
    //viewAlbum(albumName);
  });
}*/

function addPhoto(albumName,files,filename) {


  var file = files[0];
  var fileName = filename;
  //var albumPhotosKey = encodeURIComponent(albumName) + '/';
  
  var albumPhotosKey = albumName + '/';


  var photoKey = albumPhotosKey + fileName;
  s3.upload({
    Key: photoKey,
    Body: file,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
      return alert('There was an error uploading your photo: ', err.message);
    }
   // alert('Successfully uploaded File.');

    var object={}

    $rootScope.$emit('stopspinner', object);
   // viewAlbum(albumName);
  });
}


function deleteFile(albumName,fileName) {
  var albumKey = encodeURIComponent(albumName)+ '/' ;

  //console.log("albumKey....",albumKey);

   var photoKey = albumKey + fileName;

   //console.log("photokey....",photoKey);

   var newkey=encodeURIComponent(photoKey);

   //console.log("newkey....",newkey);


  s3.listObjects({Prefix: photoKey}, function(err, data) {
    if (err) {
      return alert('There was an error deleting your album: ', err.message);
    }
    var objects = data.Contents.map(function(object) {
      return {Key: object.Key};
    });

    
    s3.deleteObjects({
      Delete: {Objects: objects, Quiet: true}
    }, function(err, data) {
      if (err) {
        return alert('There was an error deleting your album: ', err.message);
      }
     // alert('Successfully deleted album.');
      //listAlbums();
    });
  });
}


 var fileuploadevent;

      fileuploadevent= $rootScope.$on('addfile', function (event, data) {
        
        if(data.title=="addfile"){
          addPhoto(scope.folderName+"campaigns/"+data.campaignId,data.file,data.quidfileName);
        }
        else if(data.title=="deletefile"){
          deleteFile("campaigns",data.file,data.quidfileName)
        }

scope.$on('$destroy', function() {
                fileuploadevent();
              });

 });



        }//end watch


      }
    }])
