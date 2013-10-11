angular.module('patients.group_patients', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patients/:group_id/:group_name', {
            templateUrl:'app/patients/group_patients/group_patients.tpl.html',
            controller:'PatientsGroupCtrl',
            resolve:{
                group: ['GroupModel', '$route', '$q', function(GroupModel, $route, $q) {
                    var defer = $q.defer();

                    GroupModel.get({id: $route.current.params.group_id}, function(group) {
                        defer.resolve(group);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }],
                patients: ['ShareModel', 'PatientModel', '$route', '$q', function (ShareModel, PatientModel, $route, $q) {
                    var defer = $q.defer();

                    var patients = [];

                    ShareModel.index({
                        group_id: $route.current.params.group_id
                    }, function(shares) {
                        // Get the patient for the shares
                        // todo: make this so only does 1 request, and sends all the ids
                        angular.forEach(shares, function(share, shareIndex) {
//                            PatientModel.get({id: share.patient_id}, function(patient) {
//                                patients.push(patient);
//                            }, function() {
//                                console.log("fail");
//                            });
                        });

                        defer.resolve(patients);

                    }, function() {

                    });

                    return defer.promise;
                }],
                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('PatientsGroupCtrl', ['$scope', '$location', 'patients', 'group', function ($scope, $location, patients, group) {
        $scope.patients = patients;
        $scope.group = group;
    }]);

