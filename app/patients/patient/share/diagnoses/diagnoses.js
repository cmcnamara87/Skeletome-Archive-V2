angular.module('patient.share.diagnoses', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/share/:share_id/diagnoses', {
            templateUrl:'app/patients/patient/share/diagnoses/diagnoses.tpl.html',
            controller:'DiagnosesCtrl',
            resolve:{
                diagnoses: ['DiagnosisModel', '$route', '$q', function (DiagnosisModel, $route, $q) {

                    var defer = $q.defer();

                    var diagnoses = DiagnosisModel.index({
                        'share_id': $route.current.params.share_id
                    }, function() {
                        defer.resolve(diagnoses);
                    });

                    return defer.promise;
                }],

                disorders: ['DisorderModel', '$route', '$q', function (DisorderModel, $route, $q) {
                    var defer = $q.defer();

                    var disorders = DisorderModel.index({
                    }, function() {
                        defer.resolve(disorders);
                    });

                    return defer.promise;
                }],

                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('DiagnosesCtrl', ['$scope', '$location', '$routeParams', 'DiagnosisModel', 'diagnoses', 'disorders', function ($scope, $location, $routeParams, DiagnosisModel, diagnoses, disorders) {
        $scope.diagnoses = diagnoses;

        $scope.disorders = disorders;

        $scope.add = function() {
            var newDiagnosis = new DiagnosisModel({
                share_id: $routeParams.share_id
            });

            $scope.diagnoses.unshift(newDiagnosis);
        }
    }]);