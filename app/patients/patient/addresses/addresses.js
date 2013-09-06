angular.module('patient.addresses', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/addresses', {
            templateUrl:'app/patients/patient/addresses/addresses.tpl.html',
            controller:'PatientAddressesCtrl',
            resolve:{
                addresses: ['AddressModel', '$route', '$q', function (AddressModel, $route, $q) {
                    var defer = $q.defer();
                    var addresses = AddressModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(addresses);
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

    .controller('PatientAddressesCtrl', ['$scope', '$location', '$routeParams', 'AddressModel', 'addresses', function ($scope, $location, $routeParams, AddressModel, addresses) {
        $scope.addresses = addresses;

        $scope.add = function() {
            var newAddress = new AddressModel({
                patient_id: $routeParams.patient_id
            });

            $scope.addresses.unshift(newAddress);
        }
    }]);