angular.module('patients', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patients/my-patients', {
            templateUrl:'app/patients/my_patients/my_patients.tpl.html',
            controller:'MyPatientsCtrl',
            resolve:{
                patients: ['PatientModel', 'AuthService', '$q', function (PatientModel, AuthService, $q) {

                    var defer = $q.defer();

                    if(AuthService.getUser()) {
                        var patients = PatientModel.index({
                            'uid': AuthService.getUser().uid
                        }, function() {
                            defer.resolve(patients);
                        }, function() {

                        });
                    } else {
                        defer.reject();
                    }

                    return defer.promise;
                }],
                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('MyPatientsCtrl', ['$scope', '$location', 'patients', function ($scope, $location, patients, MenubarService) {
        $scope.patients = patients;

    }]);

