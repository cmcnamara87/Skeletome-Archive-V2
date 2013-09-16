angular.module('directives.input.value_block', [])

// A simple directive to display a gravatar image given an email
    .directive('valueBlock', [function () {
        return {
            restrict: 'E',
            require: '^record',
            templateUrl: 'common/input/value_block/value_block.tpl.html',
            scope: {
                value: '='
            },
            controller: ['$scope', function ($scope) {
            }],
            link: function($scope, iElement, iAttrs, RecordCtrl) {
                $scope.$watch(function() {
                    return RecordCtrl.getIsEditing();
                }, function(isEditing) {
                    $scope.isEditing = isEditing;
                });
            }
        };
    }]);