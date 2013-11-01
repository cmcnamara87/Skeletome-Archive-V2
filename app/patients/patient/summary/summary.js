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
                }]
            }
        });
    }])

    .controller('PatientSummaryCtrl', ['$scope', '$location', 'patient', 'diagnoses', function ($scope, $location, patient, diagnoses) {
        $scope.patient = patient;
        $scope.diagnoses = diagnoses;
    }]);