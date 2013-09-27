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

    .controller('MyPatientsCtrl', ['$scope', '$rootScope', '$location', 'SmodalService', 'PatientModel', 'ShareModel', 'patients', function ($scope, $rootScope, $location, SmodalService, PatientModel, ShareModel, patients) {
        $scope.patients = patients;

        $scope.showAutosharing = function() {
            SmodalService.show('autosharing');
        }

        $scope.newPatient = new PatientModel();
        $scope.showCreatePatient = function() {
            SmodalService.show('createPatient');
        }

        $scope.deletePatient = function(patient) {
            var index = $scope.patients.indexOf(patient);
            $scope.patients.splice(index, 1);
            patient.$remove();
        }
        $scope.createPatient = function(newPatient) {
            // Create a patient and then, create the shares
            var groups = newPatient.groups;

            newPatient.$save(function(patient) {
                // Do the sharing
                console.log("groups are ", groups);
                angular.forEach(groups, function(group) {
                    var newShare = new ShareModel({
                        patient_id: patient.id,
                        group_id: group.id
                    })
                    newShare.$save();
                });

                $location.path('/patient/' + patient.id + '/contact-information');
            })
        }
    }]);

