angular.module('group.patients', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/group/:group_id/patients', {
            templateUrl:'app/groups/group/patients/patients.tpl.html',
            controller:'GroupPatientsCtrl',
            resolve:{
                shares: ['PatientModel', 'ShareModel', '$route', '$q', function (PatientModel, ShareModel, $route, $q) {

                    var defer = $q.defer();

                    var shares = ShareModel.index({
                        'group_id':  $route.current.params.group_id
                    }, function() {
                        // Get all the patients
                        angular.forEach(shares, function(share, shareIndex) {
                            share.patient = PatientModel.get({
                                'id': share.patient_id
                            });
                        });
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

    .controller('GroupPatientsCtrl', ['$scope', '$location', 'shares', function ($scope, $location, shares) {
        $scope.shares = shares;
    }]);

