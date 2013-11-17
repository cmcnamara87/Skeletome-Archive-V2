angular.module('group.patients', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/group/:group_id/patients', {
            templateUrl:'app/groups/group/patients/patients.tpl.html',
            controller:'GroupPatientsCtrl',
            resolve:{
                patients: ['PatientModel', 'ShareModel', '$route', '$q', function (PatientModel, ShareModel, $route, $q) {

                    return PatientModel.query({
                        group_id: $route.current.params.group_id
                    }).$promise;
                }]
            }
        });
    }])

    .controller('GroupPatientsCtrl', ['$scope', '$location', 'patients', function ($scope, $location, patients) {
        $scope.patients = patients;
    }]);

