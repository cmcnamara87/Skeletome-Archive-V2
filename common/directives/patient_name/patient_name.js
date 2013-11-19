angular.module('directives.patient_name', [])

// A simple directive to display a gravatar image given an email
    .directive('patientName', ['PatientModel', function (PatientModel) {

        return {
            restrict: 'E',
            scope: {
                patient: '='
            },
            templateUrl: 'common/directives/patient_name/patient_name.tpl.html',
            link: function ($scope, element, attrs) {
            }
        };
    }]);