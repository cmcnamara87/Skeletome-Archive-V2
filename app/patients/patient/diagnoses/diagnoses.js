angular.module('patient.diagnoses', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/diagnoses', {
            templateUrl:'app/patients/patient/diagnoses/diagnoses.tpl.html',
            controller:'PatientDiagnosesCtrl',
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
                }],
                disorders: ['DisorderModel', '$route', '$q', function(DisorderModel, $route, $q) {
                    var defer = $q.defer();
                    var disorders = DisorderModel.index({
                    }, function() {
                        defer.resolve(disorders);
                    }, function() {
                        defer.reject();
                    });
                    return defer.promise;

                }]
            }
        });
    }])

    .controller('PatientDiagnosesCtrl', ['$scope', '$location', '$routeParams', 'DiagnosisModel', 'diagnoses', 'disorders', function ($scope, $location, $routeParams, DiagnosisModel, diagnoses, disorders) {
        console.log("in here");
        $scope.diagnoses = diagnoses;
        $scope.disorders = disorders;

        $scope.addDiagnosis = function() {
            var newDiagnosis = new DiagnosisModel({
                patient_id: $routeParams.patient_id
            })
            $scope.diagnoses.unshift(newDiagnosis);
        }

        $scope.remove = function(diagnosis) {
            var index = $scope.diagnoses.indexOf(diagonsis);
            $scope.diagnoses.splice(index, 1);
        }
    }]);