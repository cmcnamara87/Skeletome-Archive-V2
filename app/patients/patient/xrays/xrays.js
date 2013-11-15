angular.module('patient.xrays', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/xrays', {
            templateUrl:'app/patients/patient/xrays/xrays.tpl.html',
            controller:'XRayCtrl',
            resolve:{
                xrays: ['XRayModel', '$route', function (XRayModel, $route) {

                    return XRayModel.index({
                        'patient_id': $route.current.params.patient_id
                    }).$promise;
                }]
            }
        });
    }])

    .controller('XRayCtrl', ['$scope', '$location', '$routeParams', 'XRayModel', 'xrays', 'fileUploadUrl', 'HPOModel', 'HPOTagModel', 'SessionService',
        function ($scope, $location, $routeParams, XRayModel, xrays, fileUploadUrl, HPOModel, HPOTagModel, SessionService) {
        $scope.xrays = xrays;

        SessionService.galleryImages = xrays;
        $scope.fileUploadUrl = fileUploadUrl;

        $scope.addXRay = function() {
            var newXRay = new XRayModel({
                 patient_id: $routeParams.patient_id
            });
            $scope.xrays.unshift(newXRay);

            console.log("unshifted");
        }
        $scope.xrayUploaded = function(file, xray) {
            xray.file_url = file.full_url;
            xray.name = file.name;
            xray.fid = file.fid;
            xray.thumb_url = file.thumb_url;

            console.log("File uploaded, xray updated", xray);
        }
        $scope.removeXRay = function(xray) {
            console.log("removing");
            var index = $scope.xrays.indexOf(xray);
            $scope.xrays.splice(xray, 1);
        }

        $scope.findHPO = function(value) {
            return HPOModel.index({
                name: value
            }).$promise;
        }

        $scope.xraySaved = function(xray) {
            "use strict";

            angular.forEach(xray.hpos, function(hpo, hpoIndex) {
                // save this relationship
                var newHPOTag = new HPOTagModel({
                    hpo_id: hpo.id,
                    object_id: xray.id,
                    object_type: 'xray'
                })
                newHPOTag.$save();
            })
        }
    }]);