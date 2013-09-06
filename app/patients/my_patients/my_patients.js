angular.module('patients.my_patients', [])

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

    .controller('MyPatientsCtrl', ['$scope', '$location', 'PatientModel', 'patients', function ($scope, $location, PatientModel, patients) {
        $scope.patients = patients;

        $scope.add = function() {

            console.log("adding patient");
            // create a new patient, redirect to the patient page
            var newPatient = new PatientModel({
            });
            newPatient.$save(function(patient) {
                $location.path('/patient/' + patient.id + '/contact-information');
            })
        }
    }]);

