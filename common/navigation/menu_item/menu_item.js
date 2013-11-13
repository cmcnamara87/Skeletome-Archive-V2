angular.module('directives.navigation.menu_item', [])

    .directive('menuItem', ['$location', '$rootScope', function ($location, $rootScope) {

        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {

                $scope.$watch(function() {
                    return $location.path()
                }, function(path) {
                    if("#" + path == attrs.href) {
                        element.addClass("selected");
                    } else {
                        element.removeClass("selected");
                    }
                });
            }
        };
    }]);