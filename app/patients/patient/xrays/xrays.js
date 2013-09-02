angular.module('patient.xrays', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/xrays', {
            templateUrl:'app/patients/patient/xrays/xrays.tpl.html',
            controller:'XRayCtrl',
            resolve:{
                xrays: ['XRayModel', '$route', '$q', function (XRayModel, $route, $q) {

                    var defer = $q.defer();

                    var xrays = XRayModel.index({
                        'id': $route.current.params.patient_id
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

    .controller('XRayCtrl', ['$scope', '$location', 'xrays', function ($scope, $location, xrays) {
        $scope.xrays = xrays;
    }]);