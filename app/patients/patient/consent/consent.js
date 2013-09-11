angular.module('patient.consent', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/consent', {
            templateUrl:'app/patients/patient/consent/consent.tpl.html',
            controller:'ConsentCtrl',
            resolve:{
                patient: ['PatientModel', '$route', '$q', function (PatientModel, $route, $q) {

                    var defer = $q.defer();

                    var patient = PatientModel.get({
                        'id': $route.current.params.patient_id
                    }, function() {
                        defer.resolve(patient);
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
                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('ConsentCtrl', ['$scope', 'ConsentFileModel', 'consentFiles', 'patient', function ($scope, ConsentFileModel, consentFiles, patient) {

        $scope.consentFiles = consentFiles;

        $scope.isShowingUploadForm = false;

        $scope.showUpload = function() {
            $scope.isShowingUploadForm = true;
        }

        $scope.consentUploaded = function(file) {
            console.log("Got the file, should upload urls now", file);

            // createa new conset file
            var consentFile = new ConsentFileModel({
                patient_id: patient.id,
                file_url: file.full_url,
                name: file.name
            });

            consentFile.$save(function() {
                $scope.consentFiles.unshift(consentFile);
            })
        }
    }]);