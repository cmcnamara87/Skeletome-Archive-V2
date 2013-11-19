angular.module('patients.my_patients', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patients/my-patients', {
            templateUrl:'app/patients/my_patients/my_patients.tpl.html',
            controller:'MyPatientsCtrl',
            resolve:{
                patients: ['PatientModel', 'SessionService', '$q', function (PatientModel, SessionService, $q) {
                    return PatientModel.queryParams({embed: 1}, {'uid': SessionService.currentUser.uid}).$promise;
                }]
            }
        });

    }])

    .controller('MyPatientsCtrl', ['$scope', '$q', '$rootScope', '$location', 'SmodalService', 'PatientModel', 'ShareModel', 'GroupModel', 'patients',
        function ($scope, $q, $rootScope, $location, SmodalService, PatientModel, ShareModel, GroupModel, patients) {
            $scope.patients = patients;

            $scope.newPatient = new PatientModel({
                name_type: "name"
            });

            $scope.showCreatePatient = function() {
                SmodalService.show('createPatient');
            }
            $scope.createPatient = function(newPatient) {
                // Create a patient and then, create the shares
//                var groups = newPatient.groups;

                newPatient.$save(function(patient) {
                    // Do the sharing
//                    console.log("groups are ", groups);
//                    angular.forEach(groups, function(group) {
//                        var newShare = new ShareModel({
//                            patient_id: patient.id,
//                            group_id: group.id
//                        })
//                        newShare.$save();
//                    });

                    $location.path('/patient/' + patient.id + '/contact-information');
                })
            }




        $scope.showAutosharing = function() {
            SmodalService.show('autosharing');
        }


        $scope.showSharePatient = function(patient) {
            $scope.patientSharing = {};
            $scope.patientSharing.patient = patient;
            $scope.patientSharing.groups = [];
            SmodalService.show('sharePatient');
        }
        $scope.sharePatientWithGroups = function(patient, groups) {
            angular.forEach(groups, function(group, groupIndex) {
                var share = new ShareModel({
                    patient_id: patient.id,
                    group_id: group.id
                });
                share.$save(function(share) {
                    if(!angular.isDefined(patient.shares)) {
                        patient.shares = [];
                    }
                    patient.shares.push(share);
                });
            });
        }
        $scope.showDeletePatient = function(patient) {
            SmodalService.show('deletePatient');
            $scope.patientToDelete = patient;
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


    }]);

