angular.module('patient.clinical_summary', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/clinical-summary', {
            templateUrl:'app/patients/patient/clinical_summary/clinical_summary.tpl.html',
            controller:'ClinicalSummaryCtrl',
            resolve:{
                patient: ['PatientModel', '$route', '$q', function (PatientModel, $route, $q) {
                    return PatientModel.get({
                        'id': $route.current.params.patient_id
                    }).$promise;
                }],
                patientHPOs: ['HPOTagModel', '$route', '$q', function (HPOTagModel, $route, $q) {
                    return HPOTagModel.index({
                        object_id: $route.current.params.patient_id,
                        object_type: 'patient'
                    }).$promise;
                }]
            }
        });
    }])

    .controller('ClinicalSummaryCtrl', ['$scope', '$q', '$location','$http', 'patient', 'patientHPOs', 'HPOModel', 'HPOTagModel', function ($scope, $q, $location, $http, patient, patientHPOs, HPOModel, HPOTagModel) {
        $scope.patient = patient;
        $scope.patientHPOs = patientHPOs;

        $scope.newHpos = [];
        $scope.showNewHpos = false;

        /**
         * Add a patient hpo relationship
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
            return HPOModel.index({
                name: value
            }).$promise;
        }
        $scope.hpoChosen = function(hpo, patientHPO) {
            // Find the gene mutations that match the gene
            patientHPO.hpo_id = hpo.id;
            patientHPO.hpo = hpo;
        }

        $scope.saveNewHpos = function(newHpos) {
            "use strict";
            angular.forEach(newHpos, function(newHpo, newHpoIndex) {
                var newPatientHPO = new HPOTagModel({
                    object_id: $scope.patient.id,
                    object_type: 'patient',
                    hpo_id: newHpo.id
                });
                newPatientHPO.$save();
                newPatientHPO.hpo = newHpo;
                $scope.patientHPOs.unshift(newPatientHPO);
            });
            $scope.newHpos = [];
            $scope.showNewHpos = false;
        }
        $scope.cancelNewHpos = function() {
            "use strict";
            $scope.showNewHpos = false;
            $scope.newHpos = [];
        }

        $scope.removePatientHPO = function(patientHPO) {
            var index = $scope.patientHPOs.indexOf(patientHPO);
            $scope.patientHPOs.splice(index, 1);
        }

//
//
    }]);