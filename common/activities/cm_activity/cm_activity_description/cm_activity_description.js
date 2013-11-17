angular.module('directives.activities.cmActivity.cmActivityDescription', [])

// A simple directive to display a gravatar image given an email
    .directive('cmActivityDescription', [function () {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'common/activities/cm_activity/cm_activity_description/cm_activity_description.tpl.html',
            link: function ($scope, el, tAttrs) {

            }
        };
    }]);