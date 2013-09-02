angular.module('patient.diagnoses', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/diagnoses', {
            templateUrl:'app/patients/patient/diagnoses/diagnoses.tpl.html',
            controller:'DiagnosesCtrl',
            resolve:{
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
                }]
            }
        });
    }])

    .controller('DiagnosesCtrl', ['$scope', '$location', 'diagnoses', function ($scope, $location, diagnoses) {
        console.log("in here");
        $scope.diagnoses = diagnoses;
    }]);