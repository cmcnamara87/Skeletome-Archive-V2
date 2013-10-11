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
                xrays: ['XRayModel', '$route', '$q', function (XRayModel, $route, $q) {

                    var defer = $q.defer();

                    var xrays = XRayModel.index({
                        'patient_id': $route.current.params.patient_id
                    }, function() {
                        defer.resolve(xrays);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }],
                mutations: ['GeneMutationModel', '$route', '$q', function (GeneMutationModel, $route, $q) {
                    var defer = $q.defer();
                    var mutations = GeneMutationModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(mutations);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }],
                diagnoses: ['DiagnosisModel', '$route', '$q', function (DiagnosisModel, $route, $q) {
                    console.log("resvoling diagnoses");
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
                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('ClinicalSummaryCtrl', ['$scope', '$location', 'patient','xrays','mutations','diagnoses', function ($scope, $location, patient, xrays, mutations, diagnoses) {
        $scope.patient = patient;
        $scope.xrays = xrays;
        $scope.mutations = mutations;
        $scope.diagnoses = diagnoses;
    }]);