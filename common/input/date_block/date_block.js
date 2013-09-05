angular.module('directives.input.date_block', [])

// A simple directive to display a gravatar image given an email
    .directive('dateBlock', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/date_block/date_block.tpl.html',
            scope: {
                model: '=',
                value: '='
            },
            controller: ['$scope', function ($scope) {
                var that = this;

                $scope.edit = function() {
                    that.backup = angular.copy($scope.model);
                    $scope.isEditing = true;
                }
                $scope.cancel = function() {
                    $scope.model = that.backup;
                    $scope.isEditing = false;
                }
                $scope.save = function() {
                    $scope.isEditing = false;
                    $scope.model.$update(function() {
                        console.log("model updated");
                    });
                }
            }]
        };
    }]);