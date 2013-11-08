angular.module('directives.input.cmFacepile', ['directives.input.cmUserIcon'])

// A simple directive to display a gravatar image given an email
    .directive('cmFacepile', [function () {
        return {
            restrict: 'E',
            scope: {
                users: '=',
                limit: '@'
            },
            templateUrl: 'common/input/cm_facepile/cm_facepile.tpl.html',
            link: function($scope, iElement, iAttrs) {
            }
        };
    }]);