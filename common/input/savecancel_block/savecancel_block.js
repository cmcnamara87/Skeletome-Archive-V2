angular.module('directives.input.savecancel_block', [])

// A simple directive to display a gravatar image given an email
    .directive('savecancelBlock', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/savecancel_block/savecancel_block.tpl.html',
            link: function($scope, iElement, iAttrs) {
                $('.btn-save', iElement).click(function(event) {
                    $scope.$apply(function() {
                        $scope.save();
                    });
                    event.stopPropagation();
                });

                $('.btn-cancel', iElement).click(function(event) {
                    $scope.$apply(function() {
                        $scope.cancel();
                    });
                    event.stopPropagation();
                });

            }
        };
    }]);