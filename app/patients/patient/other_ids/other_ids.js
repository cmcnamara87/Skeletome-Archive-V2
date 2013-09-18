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
                }],
                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]

            }
        });
    }])

    .controller('IdentifierCtrl', ['$scope', '$location', '$routeParams', 'IdentifierModel', 'identifiers', function ($scope, $location, $routeParams, IdentifierModel, identifiers) {
        $scope.identifiers = identifiers;

        $scope.add = function() {
            var newIdentifier = new IdentifierModel({
                patient_id: $routeParams.patient_id
            });
            $scope.identifiers.unshift(newIdentifier);
        }
        $scope.remove = function(identifier) {
            var index = $scope.identifiers.indexOf(identifier);
            $scope.identifiers.splice(index, 1);
        }
    }]);