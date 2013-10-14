angular.module('directives.input.cmLabellist')

// A simple directive to display a gravatar image given an email
    .directive('cmLabellist', [function () {
        return {
            restrict: 'E',
            scope: {
                list: '=',
                limit: '@',
                displayFn: '&'
            },
            templateUrl: 'common/input/cm_labellist/cm_labellist.tpl.html',
            link: function($scope, iElement, iAttrs) {

            }
        };
    }]);