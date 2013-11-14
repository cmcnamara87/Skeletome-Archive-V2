angular.module('patient.clinical_summary', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/clinical-summary', {
            templateUrl:'app/patients/patient/clinical_summary/clinical_summary.tpl.html',
            controller:'ClinicalSummaryCtrl',
            resolve:{
                patient: ['PatientModel', '$route', '$q', function (PatientModel, $route, $q) {

                    var defer = $q.defer();

                    var patient = PatientModel.get({
                        'id': $route.current.params.patient_id
                    }, function() {
                        defer.resolve(patient);
                    });

                    return defer.promise;
                }],
                patientHPOs: ['HPOPatientModel', '$route', '$q', function (HPOPatientModel, $route, $q) {

                    var defer = $q.defer();

                    var patientHPOs = HPOPatientModel.index({
                        'patient_id': $route.current.params.patient_id
                    }, function(patientHPOs) {
                        defer.resolve(patientHPOs);
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('ClinicalSummaryCtrl', ['$scope', '$q', '$location','$http', 'patient', 'patientHPOs', 'HPOModel', 'HPOPatientModel', function ($scope, $q, $location, $http, patient, patientHPOs, HPOModel, HPOPatientModel) {
        $scope.patient = patient;
        $scope.patientHPOs = patientHPOs;

        $scope.newHpos = [];
        $scope.showNewHpos = false;

        /**
         * Add a new address
         */
        $scope.addPatientHPO = function() {
            var newPatientHPO = new HPOPatientModel({
                patient_id: $scope.patient.id
            });
            $scope.patientHPOs.unshift(newPatientHPO);
        }

        $scope.showNewHPO = function() {
            "use strict";
            $scope.showNewHpos = true;
        }

        $scope.findHPO = function(value) {
            var defer = $q.defer();
            var hpos = HPOModel.index({
                name: value
            }, function(hpos) {
                defer.resolve(hpos);
            }, function(error){
                console.log("HPO ERROR", error);
            });
            return defer.promise;
        }
        $scope.hpoChosen = function(hpo, patientHPO) {
            // Find the gene mutations that match the gene
            patientHPO.hpo_id = hpo.id;
            patientHPO.hpo = hpo;
        }

        $scope.saveNewHpos = function(newHpos) {
            "use strict";
            angular.forEach(newHpos, function(newHpo, newHpoIndex) {
                var newPatientHPO = new HPOPatientModel(newHpo);
                newPatientHPO.patient_id = $scope.patient.id
                newPatientHPO.$save();
                $scope.patientHPOs.unshift(newPatientHPO);
            });
        }

        $scope.removePatientHPO = function(patientHPO) {
            var index = $scope.patientHPOs.indexOf(patientHPO);
            $scope.patientHPOs.splice(index, 1);
        }

//
//
    }]);