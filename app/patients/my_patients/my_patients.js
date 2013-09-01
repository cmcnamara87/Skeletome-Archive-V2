angular.module('patients', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patients/my-patients', {
            templateUrl:'app/patients/my_patients/my_patients.tpl.html',
            controller:'MyPatientsCtrl',
            resolve:{
                patients: ['PatientModel', 'auth', '$q', 'Param', function (PatientModel, auth, $q, Param) {

                    var defer = $q.defer();

                    console.log("hello world");
                    auth.checkCurrentUser().then(function() {
                        console.log("got current user");
                        var patients = PatientModel.index({
                            'uid': auth.getUser().uid
                        }, function() {
                            defer.resolve(patients);
                        }, function() {
                            defer.reject();
                        });

                    }, function() {
                        $location.path("/splash");
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('MyPatientsCtrl', ['$scope', '$location', 'patients', function ($scope, $location, patients) {
        $scope.patients = patients;
    }]);

