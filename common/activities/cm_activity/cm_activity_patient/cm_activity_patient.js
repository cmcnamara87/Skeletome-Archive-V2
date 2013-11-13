angular.module('directives.activities.cmActivity.cmActivityPatient', [])

// A simple directive to display a gravatar image given an email
    .directive('cmActivityPatient', [function () {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'common/activities/cm_activity/cm_activity_patient/cm_activity_patient.tpl.html',
            link: function ($scope, el, tAttrs) {

            }
        };
    }]);