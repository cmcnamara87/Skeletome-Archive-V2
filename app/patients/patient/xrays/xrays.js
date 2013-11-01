angular.module('patient.xrays', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/xrays', {
            templateUrl:'app/patients/patient/xrays/xrays.tpl.html',
            controller:'XRayCtrl',
            resolve:{
                xrays: ['XRayModel', '$route', '$q', function (XRayModel, $route, $q) {

                    var defer = $q.defer();

                    var xrays = XRayModel.index({
                        'patient_id': $route.current.params.patient_id
                    }, function() {
                        defer.resolve(xrays);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('XRayCtrl', ['$scope', '$location', '$routeParams', 'XRayModel', 'xrays', 'fileUploadUrl', function ($scope, $location, $routeParams, XRayModel, xrays, fileUploadUrl) {
        $scope.xrays = xrays;

        $scope.fileUploadUrl = fileUploadUrl;


        $scope.addXRay = function() {
            var newXRay = new XRayModel({
                 patient_id: $routeParams.patient_id
            });
            $scope.xrays.unshift(newXRay);
        }
        $scope.xrayUploaded = function(file, xray) {
            xray.file_url = file.full_url;
            xray.name = file.name;
            xray.fid = file.fid;
            xray.thumb_url = file.thumb_url;

            console.log("File uploaded, xray updated", xray);
        }
        $scope.removeXRay = function(xray) {
            var index = $scope.xrays.indexOf(xray);
            $scope.xrays.splice(xray, 1);
        }

    }]);