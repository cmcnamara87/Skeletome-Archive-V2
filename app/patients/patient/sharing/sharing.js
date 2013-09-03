angular.module('patient.sharing', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/sharing', {
            templateUrl:'app/patients/patient/sharing/sharing.tpl.html',
            controller:'SharingCtrl',
            resolve:{
                shares: ['ShareModel', '$route', '$q', function (ShareModel, $route, $q) {
                    var defer = $q.defer();
                    var shares = ShareModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(shares);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }],
                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('SharingCtrl', ['$scope', '$location', 'shares', function ($scope, $location, shares) {
        $scope.shares = shares;
    }]);