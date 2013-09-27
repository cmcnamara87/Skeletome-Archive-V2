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

    .controller('MyPatientsCtrl', ['$scope', '$q', '$rootScope', '$location', 'SmodalService', 'PatientModel', 'ShareModel', 'GroupModel', 'patients', function ($scope, $q, $rootScope, $location, SmodalService, PatientModel, ShareModel, GroupModel, patients) {
        $scope.patients = patients;

        $scope.showAutosharing = function() {
            SmodalService.show('autosharing');
        }

        $scope.newPatient = new PatientModel();
        $scope.showCreatePatient = function() {
            SmodalService.show('createPatient');
        }

        $scope.showDeletePatient = function(patient) {
            SmodalService.show('deletePatient');
            $scope.deleteToPatient = patient;
        }
        $scope.deletePatient = function(patient) {
            var index = $scope.patients.indexOf(patient);
            $scope.patients.splice(index, 1);
            patient.$remove();
        }

        $scope.findGroup = function(value) {
            var defer = $q.defer();

            GroupModel.index({name: value}, function(groups) {
                defer.resolve(groups);
            }, function() {
                defer.reject();
            });

            return defer.promise;
        }

        setTimeout(function() {
            $('input[type=text]').eq(0).focus();
        }, 0);


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

