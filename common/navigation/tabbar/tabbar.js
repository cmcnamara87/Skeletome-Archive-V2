angular.module('directives.navigation.tabbar', [])

// A simple directive to display a gravatar image given an email
    .directive('tabbar', ['$location', function ($location) {

        return {
            restrict: 'E',
            templateUrl: 'common/navigation/tabbar/tabbar.tpl.html',
            link: function ($scope, element, attrs) {
                $scope.$watch(function() {
                    return $location.path()
                }, function(newValue) {
                    // split it into its parts
                    var parts = newValue.split("/");
                    $scope.tab = parts[1];
                });

            }
        };
    }]);