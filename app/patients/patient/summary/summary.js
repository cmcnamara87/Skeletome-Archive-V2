angular.module('patient.summary', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/summary', {
            templateUrl:'app/patients/patient/summary/summary.tpl.html',
            controller:'PatientSummaryCtrl',
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
                diagnoses: ['DiagnosisModel', '$route', '$q', function (DiagnosisModel, $route, $q) {
                    var defer = $q.defer();

                    var diagnoses = DiagnosisModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(diagnoses);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }],
                geneMutations: ['GeneMutationModel', '$route', '$q', function (GeneMutationModel, $route, $q) {
                    var defer = $q.defer();
                    var geneMutations = GeneMutationModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(geneMutations);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }],
                patientHpos: ['HPOTagModel', '$route', function (HPOTagModel, $route) {
                    return HPOTagModel.index({
                        object_id: $route.current.params.patient_id,
                        object_type: 'patient'
                    }).$promise;
                }],
                mentions: ['MentionModel', '$route', '$q', function(MentionModel, $route) {
                    "use strict";
                    return MentionModel.index({
                        content_id: $route.current.params.patient_id,
                        content_type: 'patient'
                    }).$promise;
                }]
            }
        });
    }])

    .controller('PatientSummaryCtrl', ['$scope', '$location', 'patient', 'diagnoses', 'geneMutations', 'patientHpos', 'mentions', function ($scope, $location, patient, diagnoses, geneMutations, patientHpos, mentions) {
        $scope.patient = patient;
        $scope.diagnoses = diagnoses;
        $scope.geneMutations = geneMutations;
        $scope.patientHpos = patientHpos;
        $scope.mentions = mentions;
    }]);
