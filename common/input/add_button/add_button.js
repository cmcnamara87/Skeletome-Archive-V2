angular.module('directives.input.add_button', [])

// A simple directive to display a gravatar image given an email
    .directive('addBlock', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/add_button/add_button.tpl.html',
            scope: {
                clickFn: '&'
            },
            link: function($scope, iElement, iAttrs) {
                $('.btn-add', iElement).click(function(event) {
                    $scope.clickFn();
                    event.stopPropagation();
                });
            }
        };
    }]);