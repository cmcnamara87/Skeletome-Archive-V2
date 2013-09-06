angular.module('directives.input.value_block', [])

// A simple directive to display a gravatar image given an email
    .directive('valueBlock', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/value_block/value_block.tpl.html',
            scope: {
                model: '=',
                value: '='
            },
            controller: ['$scope', function ($scope) {
                $scope.cancel = function() {
                    $scope.model = $scope.backup;
                    $scope.isEditing = false;
                }
                $scope.save = function() {
                    $scope.isEditing = false;
                    $scope.model.$update(function() {
                        console.log("model updated");
                    });
                }
            }],
            link: function($scope, iElement, iAttrs) {
                $('.value_input', iElement).blur(function() {
                    console.log("blur on value");
                    $scope.save();
                });

                $scope.edit = function() {
                    $scope.backup = angular.copy($scope.model);
                    $scope.isEditing = true;
                    console.log("trying to focus...");
                    setTimeout(function() {
                        $('.value_input', iElement).focus();
                    }, 100);

                }

            }
        };
    }]);