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

    .controller('PatientSummaryCtrl',
        ['$scope', '$location', 'patient', 'diagnoses', 'geneMutations', 'patientHpos', 'mentions', '$http', 'apiUrl2', 'createModal', 'DiagnosisModel', 'PatientModel',
            function ($scope, $location, patient, diagnoses, geneMutations, patientHpos, mentions, $http, apiUrl2, createModal, DiagnosisModel, PatientModel) {
        $scope.patient = patient;
        $scope.diagnoses = diagnoses;
        $scope.geneMutations = geneMutations;
        $scope.patientHpos = patientHpos;
        $scope.mentions = mentions;

        $scope.showDisorderModal = function(disorder) {
            "use strict";
            $scope.disorder = null;

            // Create a new sub-scope for the modal
            var newScope = $scope.$new();
            $http.get(apiUrl2 + "disorder/" + disorder.id + "/description").then(function(repsonse) {
                newScope.disorder = repsonse.data;
            });
            newScope.diagnoses = DiagnosisModel.index({
                disorder_id: disorder.id
            })
            createModal({scope: newScope, url: 'common/directives/mentions/modal_disorder.tpl.html'}).then(function(modal) {
                console.log("resolved");
                modal.show();
            });
        }

         $scope.showHpoModal = function(hpo) {
             "use strict";
             var newScope = $scope.$new();
             newScope.patients = null;
             createModal({scope: newScope, url: 'common/directives/mentions/modal_hpo.tpl.html'}).then(function(modal) {
                 modal.show();
             });

             PatientModel.queryParams({embed: 1}, {
                 hpo_id: hpo.id
             }).$promise.then(function(patients) {
                 newScope.patients = patients;
             });
         }

    }]);
