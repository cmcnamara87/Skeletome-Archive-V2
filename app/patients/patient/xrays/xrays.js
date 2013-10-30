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

    .controller('XRayCtrl', ['$scope', '$location', '$routeParams', 'XRayModel', 'xrays', function ($scope, $location, $routeParams, XRayModel, xrays) {
        $scope.xrays = xrays;

        $scope.add = function() {
            var newXRay = new XRayModel({
                 patient_id: $routeParams.patient_id
            });
            $scope.xrays.unshift(newXRay);
        }
    }]);