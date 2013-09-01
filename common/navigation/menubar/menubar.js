angular.module('directives.navigation.menubar', [])

// A simple directive to display a gravatar image given an email
    .directive('menubar', ['$location', function ($location) {

        return {
            restrict: 'E',
            templateUrl: 'common/navigation/menubar/menubar.tpl.html',
            link: function ($scope, element, attrs) {
                $scope.$watch(function() {
                    return $location.path()
                }, function(newValue) {
                    // split it into its parts
                    var parts = newValue.split("/");
                    $scope.type = parts[1];

                    console.log(parts);
                });
            }
        };
    }]);