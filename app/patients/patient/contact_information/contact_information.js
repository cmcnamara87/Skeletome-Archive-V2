angular.module('patient.contact_information', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/contact-information', {
            templateUrl:'app/patients/patient/contact_information/contact_information.tpl.html',
            controller:'ContactInformationCtrl',
            resolve:{
                patient: ['PatientModel', 'AuthService', '$route', '$q', function (PatientModel, AuthService, $route, $q) {

                    var defer = $q.defer();

                    if(AuthService.getUser()) {
                        var patient = PatientModel.get({
                            'id': $route.current.params.patient_id
                        }, function() {
                            if(patient.uid == AuthService.getUser().uid) {
                                defer.resolve(patient);
                            } else {
                                defer.reject();
                            }
                        });
                    } else {
                        defer.reject();
                    }

                    return defer.promise;
                }],
                addresses: ['AddressModel', '$route', '$q', function(AddressModel, $route, $q) {
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

    .controller('ContactInformationCtrl', ['$scope', '$location', 'patient', 'addresses', function ($scope, $location, patient, addresses) {
        $scope.patient = patient;
        $scope.addresses = addresses;
    }]);