angular.module('directives.input.cmEdit', [])

    .directive('cmEdit', [function () {
        return {
            restrict: 'E',
            transclude: true,
            template: "<div ng-show=\"$isEditing\" ng-transclude></div>"
        };
    }]);
