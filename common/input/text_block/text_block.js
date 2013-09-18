angular.module('directives.input.text_block', [])

// A simple directive to display a gravatar image given an email
    .directive('textBlock', [function () {
        return {
            restrict: 'E',
            require: '^field',
            templateUrl: 'common/input/text_block/text_block.tpl.html',
            scope: {
                value: '='
            },
            controller: ['$scope', function ($scope) {
            }],
            link: function($scope, iElement, iAttrs, FieldCtrl) {
                $scope.$watch(function() {
                    return FieldCtrl.getIsEditing();
                }, function(isEditing) {
                    $scope.isEditing = isEditing;
                });
            }
        };
    }]);