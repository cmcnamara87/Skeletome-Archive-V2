angular.module('patient.contact_information', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/contact-information', {
            templateUrl:'app/patients/patient/contact_information/contact_information.tpl.html',
            controller:'ContactInformationCtrl',
            resolve:{
                patient: ['PatientModel', 'SessionService', '$route', '$q', function (PatientModel, SessionService, $route, $q) {

                    var defer = $q.defer();

                    if(SessionService.currentUser) {
                        var patient = PatientModel.get({
                            'id': $route.current.params.patient_id
                        }, function() {
                            console.log("logged in user", SessionService.currentUser.uid, patient.uid);
                            if(patient.uid == SessionService.currentUser.uid) {
                                patient.name_type = "name";
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
                }]
            }
        });
    }])

    .controller('ContactInformationCtrl',
        ['$scope', '$location', 'patient', 'addresses', 'identifiers', 'shares', 'consentFiles', 'fileUploadUrl', 'AddressModel', 'IdentifierModel', 'ConsentFileModel',
            function ($scope, $location, patient, addresses, identifiers, shares, consentFiles, fileUploadUrl, AddressModel, IdentifierModel, ConsentFileModel) {

        $scope.patient = patient;
        $scope.addresses = addresses;
        $scope.identifiers = identifiers;
        $scope.shares = shares;
        $scope.consentFiles = consentFiles;

        $scope.fileUploadUrl = fileUploadUrl;

        /**
         * Add a new identifier
         */
        $scope.addIdentifier = function() {
            var newIdentifier = new IdentifierModel({
                patient_id: $scope.patient.id
            });
            $scope.identifiers.unshift(newIdentifier);
        }
        $scope.removeIdentifier = function(identifier) {
            var index = $scope.identifiers.indexOf(identifier);
            $scope.identifiers.splice(index, 1);
        }

        /**
         * Add a new address
         */
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

        /**
         * Add a new consent form
         */
        $scope.addConsentFile = function() {
            var newConsentFile = new ConsentFileModel({
                patient_id: $scope.patient.id
            });
            $scope.consentFiles.unshift(newConsentFile);
        }
        $scope.consentFileUploaded = function(file, consentFile) {
            console.log("Got a file upload", file, consentFile);
            consentFile.file_url = file.full_url;
            consentFile.name = file.name;
            consentFile.fid = file.fid;
        }
        $scope.removeConsentFile = function(consentFile) {
            var index = $scope.consentFiles.indexOf(consentFile);
            $scope.consentFiles.splice(consentFile, 1);
        }
    }]);