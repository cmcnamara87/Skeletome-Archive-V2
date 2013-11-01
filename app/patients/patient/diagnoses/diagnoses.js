angular.module('patient.diagnoses', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/diagnoses', {
            templateUrl:'app/patients/patient/diagnoses/diagnoses.tpl.html',
            controller:'PatientDiagnosesCtrl',
            resolve:{
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

    .controller('PatientDiagnosesCtrl', ['$scope', '$q', '$location', '$routeParams', 'DiagnosisModel', 'DisorderModel', 'diagnoses', function ($scope, $q, $location, $routeParams, DiagnosisModel, DisorderModel, diagnoses) {
        console.log("in here");
        $scope.diagnoses = diagnoses;

        $scope.addDiagnosis = function() {
            var newDiagnosis = new DiagnosisModel({
                patient_id: $routeParams.patient_id
            })
            $scope.diagnoses.unshift(newDiagnosis);
        }
        $scope.findDisorder = function(value) {
            var defer = $q.defer();

            var disorders = DisorderModel.index({
                name: value
            }, function() {
                defer.resolve(disorders);
            }, function() {
                defer.reject();
            });

            return defer.promise;
        }
        $scope.diagnosisChosen = function(disorder, diagnosis) {
            diagnosis.disorder_id = disorder.id;
        }

        $scope.removeDiagnosis = function(diagnosis) {
            var index = $scope.diagnoses.indexOf(diagnosis);
            $scope.diagnoses.splice(index, 1);
        }
    }]);