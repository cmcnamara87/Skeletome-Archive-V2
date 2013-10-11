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
                            console.log("logged in user", AuthService.getUser().uid, patient.uid);
                            if(patient.uid == AuthService.getUser().uid) {
                                defer.resolve(patient);
                            } else {
                                alert("not user");
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
                identifiers: ['IdentifierModel', '$route', '$q', function(IdentifierModel, $route, $q) {
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
                consentFiles: ['ConsentFileModel', '$route', '$q', function(ConsentFileModel, $route, $q) {
                    var defer = $q.defer();

                    var consentFiles = ConsentFileModel.index({
                        'patient_id': $route.current.params.patient_id
                    }, function() {
                        defer.resolve(consentFiles);
                    });

                    return defer.promise;
                }],
                shares: ['ShareModel', '$route', '$q', function(ShareModel, $route, $q) {
                    var defer = $q.defer();

                    var shares = ShareModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(shares);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }],
                currentUser: ['AuthService', function(AuthService) {
                    var user = AuthService.requireAuthenticated().then(function(user) {
                        console.log("hello world", user);
                    });
                    return user;
                }]
            }
        });
    }])

    .controller('ContactInformationCtrl', ['$scope', '$location', 'patient', 'addresses', 'identifiers', 'shares', 'consentFiles', 'AddressModel', 'IdentifierModel', function ($scope, $location, patient, addresses, identifiers, shares, consentFiles, AddressModel, IdentifierModel, currentUser) {
        console.log("current user", currentUser);
        $scope.user = currentUser;
        $scope.patient = patient;
        $scope.addresses = addresses;
        $scope.identifiers = identifiers;
        $scope.shares = shares;
        $scope.consentFiles = consentFiles;

        $scope.showAddAddress = function() {

        }
        $scope.addAddress = function() {
            var newAddress = new AddressModel({
                patient_id: $scope.patient.id
            });
            $scope.addresses.unshift(newAddress);
        }

        $scope.removeAddress = function(address) {
            var index = $scope.addresses.indexOf(address);
            $scope.addresses.splice(index, 1);
        }

    }]);