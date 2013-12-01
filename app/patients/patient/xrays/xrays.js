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

    .controller('XRayCtrl', ['$scope', '$location', '$routeParams', 'XRayModel', 'xrays', 'fileUploadUrl', 'HPOModel', 'HPOTagModel', 'SessionService', 'createModal',
        function ($scope, $location, $routeParams, XRayModel, xrays, fileUploadUrl, HPOModel, HPOTagModel, SessionService, createModal) {
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


        $scope.showXray = function(xray) {
            "use strict";
            $scope.xray = xray;
            $scope.hpoTags = HPOTagModel.index({
                object_id: xray.id,
                object_type: "xray"
            });
            createModal({url: 'app/patients/patient/xrays/modal_xray.tpl.html', scope: $scope, type: 'gallery'}).then(function(modal) {
                // Modal is open now
                modal.show();
            })
        }
        $scope.addHpoTag = function() {
            "use strict";
            var newHpoTag = new HPOTagModel({
                object_id: $scope.xray.id,
                object_type: 'xray'
            });
            $scope.hpoTags.push(newHpoTag);
        }
            $scope.hpoChosen = function(hpo, hpoTag) {
                "use strict";
                console.log("hpo chosen", hpoTag);
                hpoTag.hpo_id = hpo.id;
                hpoTag.hpo = hpo;
                console.log("hpo chosen", hpoTag);
            }
        $scope.removeHpoTag = function(hpoTag) {
                var index = $scope.hpoTags.indexOf(hpoTag);
                $scope.hpoTags.splice(index, 1);
            }
    }]);