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

                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('DiagnosesCtrl', ['$scope', '$location', 'diagnoses', function ($scope, $location, diagnoses) {
        $scope.diagnoses = diagnoses;
    }]);