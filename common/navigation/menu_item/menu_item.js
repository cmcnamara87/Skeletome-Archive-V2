angular.module('directives.navigation.menu_item', [])

    .directive('menuItem', ['$location', '$timeout', '$rootScope', function ($location, $timeout, $rootScope) {

        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {

                $timeout(function() {
                    $scope.$watch(function() {
                        return $location.path()
                    }, function(path) {
                        $timeout(function() {
                            $timeout(function() {
                                if("#" + path == attrs.href) {
                                    element.addClass("selected");
                                } else {
                                    element.removeClass("selected");
                                }
                            })
                        }, 0)
                    });
                }, 0)
            }
        };
    }]);