angular.module('patient.community', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/community', {
            templateUrl:'app/patients/patient/community/community.tpl.html',
            controller:'CommunityCtrl',
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

    .controller('CommunityCtrl', ['$scope', '$routeParams', '$location', 'shares', function ($scope, $routeParams, $location, shares) {
        console.log("route params", $routeParams);
        $scope.patient_id = $routeParams.patient_id;
        $scope.shares = shares;
    }]);