angular.module('directives.input.cmDisplay', [])

    .directive('cmDisplay', [function () {
        return {
            restrict: 'E',
            transclude: true,
            template: "<div ng-show=\"!$isEditing\" ng-transclude></div>"
        };
    }]);
