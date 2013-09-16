angular.module('directives.input.test', [])

// A simple directive to display a gravatar image given an email
    .directive('test', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/test/test.tpl.html',
            scope: false,
            controller: ['$scope', function ($scope) {
            }]
        };
    }]);