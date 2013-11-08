angular.module('directives.input.cmUserIcon', [])

// A simple directive to display a gravatar image given an email
    .directive('cmUserIcon', [function () {
        return {
            restrict: 'E',
            scope: {
                user: '='
            },
            templateUrl: 'common/input/cm_user_icon/cm_user_icon.tpl.html',
            link: function($scope, iElement, iAttrs) {
                $scope.color = '#'+Math.floor(Math.random()*16777215).toString(16);
            }
        };
    }]);