angular.module('patient.other_ids', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/other-ids', {
            templateUrl:'app/patients/patient/other_ids/other_ids.tpl.html',
            controller:'IdentifierCtrl',
            resolve:{
                identifiers: ['IdentifierModel', '$route', '$q', function (IdentifierModel, $route, $q) {
                    var defer = $q.defer();
                    var identifiers = IdentifierModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(identifiers);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('IdentifierCtrl', ['$scope', '$location', 'identifiers', function ($scope, $location, identifiers) {
        $scope.identifiers = identifiers;
    }]);