angular.module('patient.summary_dashboard', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/summary-dashboard', {
            templateUrl:'app/patients/patient/summary_dashboard/summary_dashboard.tpl.html',
            controller:'SummaryDashboardCtrl',
            resolve:{
                patient: ['PatientModel', '$route', '$q', 'Page', function (PatientModel, $route, $q, Page) {

                    var defer = $q.defer();

                    var patient = PatientModel.get({
                        'id': $route.current.params.patient_id
                    }, function() {
                        Page.setObject(patient);
                        defer.resolve(patient);
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('SummaryDashboardCtrl', ['$scope', '$location', 'patient', function ($scope, $location, patient, Page) {
        $scope.patient = patient;
    }]);