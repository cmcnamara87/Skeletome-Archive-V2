angular.module('directives.activities.cmActivity.cmActivityPost', [])

// A simple directive to display a gravatar image given an email
    .directive('cmActivityPost', [function () {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'common/activities/cm_activity/cm_activity_post/cm_activity_post.tpl.html',
            link: function ($scope, el, tAttrs) {

            }
        };
    }]);