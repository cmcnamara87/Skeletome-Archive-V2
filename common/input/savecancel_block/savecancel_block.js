angular.module('directives.input.savecancel_block', [])

// A simple directive to display a gravatar image given an email
    .directive('savecancelBlock', [function () {
        return {
            restrict: 'E',
            scope: {
                saveFn: '&',
                cancelFn: '&',
                label: '@'
            },
            templateUrl: 'common/input/savecancel_block/savecancel_block.tpl.html',
            link: function($scope, iElement, iAttrs) {
                $('.btn-action-save', iElement).click(function(event) {
                    $scope.$apply(function() {
                        console.log("Buttons: Save clicked");
                        $scope.saveFn();
                    });
                    event.stopPropagation();
                });

                $('.btn-cancel', iElement).click(function(event) {
                    $scope.$apply(function() {
                        $scope.cancelFn();
                    });
                    event.stopPropagation();
                });

            }
        };
    }]);