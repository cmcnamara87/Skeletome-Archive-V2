angular.module('patient.consent', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/consent', {
            templateUrl:'app/patients/patient/consent/consent.tpl.html',
            controller:'ConsentCtrl',
            resolve:{

            }
        });
    }])

    .controller('ConsentCtrl', ['$scope', function ($scope) {

    }]);