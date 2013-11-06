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
                }]
            }
        });
    }])

    .controller('ClinicalSummaryCtrl', ['$scope', '$location','$http', 'patient', 'recommendTagsUrl', function ($scope, $location, $http, patient, recommendTagsUrl) {
        $scope.patient = patient;



        $scope.patient.formattedSummary = angular.copy($scope.patient.clinical_summary);

        angular.forEach($scope.patient.patient_tags, function(patient_tag, tagIndex) {
            var re = new RegExp(patient_tag.name.toLowerCase(), "gi");

            $scope.patient.formattedSummary = $scope.patient.formattedSummary.replace(re, "<b><abbr title='" + patient_tag.tag.name + "'>" + patient_tag.name + "</abbr></b>");
        });

    }]);