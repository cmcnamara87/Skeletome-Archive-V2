angular.module('patients.group_patients', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/patients/group/:group_id', {
            templateUrl:'app/patients/group_patients/group_patients.tpl.html',
            controller:'PatientsGroupCtrl',
            resolve:{
                group: ['GroupModel', '$route', '$q', function(GroupModel, $route, $q) {
                    var defer = $q.defer();

                    GroupModel.get({id: $route.current.params.group_id}, function(group) {
                        defer.resolve(group);
                    }, function() {
                        defer.reject();
                    });
                    return defer.promise;
                }],
                patients: ['ShareModel', 'PatientModel', '$route', '$q', function (ShareModel, PatientModel, $route, $q) {

                    return PatientModel.query({
                        group_id: $route.current.params.group_id
                    }).$promise;
                }]
            }
        });
    }])

    .controller('PatientsGroupCtrl', ['$scope', '$location', 'patients', 'group', function ($scope, $location, patients, group) {
        $scope.patients = patients;
        $scope.group = group;
    }]);

