angular.module('group.patients', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/group/:group_id/patients', {
            templateUrl:'app/groups/group/patients/patients.tpl.html',
            controller:'GroupPatientsCtrl',
            resolve:{
                patients: ['PatientModel', 'ShareModel', '$route', '$q', function (PatientModel, ShareModel, $route, $q) {

                    return PatientModel.index({
                        group_id: $route.current.params.group_id
                    }).$promise;
                }]
            }
        });
    }])

    .controller('GroupPatientsCtrl', ['$scope', '$location', 'patients', 'PatientModel', function ($scope, $location, patients, PatientModel) {
        $scope.patients = patients;

        $scope.isMoreToLoad = true;
        var page = 0;
        $scope.loadMore = function() {
            page++;
            $scope.isMoreToLoad = true;
            $scope.isLoadingMore = true;
            PatientModel.queryParams({page: page}, {group_id: $scope.group.id}).$promise.then(function(patients) {
                "use strict";
                $scope.isLoadingMore = false;
                $scope.patients = $scope.patients.concat(patients);
                if(patients.length == 0) {
                    $scope.isMoreToLoad = false;
                }
            })
        }
    }]);

