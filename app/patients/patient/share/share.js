angular.module('patient.share', ['patient.share.discussion', 'patient.share.diagnoses'])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/share/:share_id', {
            templateUrl:'app/patients/patient/share/share.tpl.html',
            controller:'ShareCtrl',
            resolve:{
                share: ['ShareModel', '$route', '$q', function (ShareModel, $route, $q) {

                    var defer = $q.defer();

                    var share = ShareModel.get({
                        'id': $route.current.params.share_id
                    }, function() {
                        defer.resolve(share);
                    });

                    return defer.promise;
                }],

                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('ShareCtrl', ['$scope', '$location', 'share', function ($scope, $location, share) {
        $scope.share = share;
    }]);