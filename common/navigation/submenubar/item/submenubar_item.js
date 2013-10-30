angular.module('directives.navigation.submenubar.submenubar_item', [])

    .directive('submenubarItem', ['$location', '$rootScope', function ($location, $rootScope) {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                url: '@'
            },
            templateUrl: 'common/navigation/submenubar/item/submenubar_item.tpl.html',
            link: function ($scope, element, attrs) {

                $scope.$watch(function() {
                    return $location.path()
                }, function(path) {
                    if("#" + path == $scope.url) {
                        $scope.active = true;
                    } else {
                        $scope.active = false;
                    }
                });
            }
        };
    }]);