angular.module('directives.displaypic', [])

// A simple directive to display a gravatar image given an email
    .directive('displaypic', [function () {

        return {
            restrict: 'E',
            scope: {
                user: '=',
                size: '@'
            },
            templateU: "/common/directives/displaypic/displaypic.tpl.html",
            link: function ($scope, element, attrs) {

            }
        };
    }]);