angular.module('directives.navigation.menubar', [])

// A simple directive to display a gravatar image given an email
    .directive('menubar', ['$location', 'Page', function ($location, Page) {

        return {
            restrict: 'E',
            templateUrl: 'common/navigation/menubar/menubar.tpl.html',
            controller: function($scope) {
                $scope.$watch(function() {
                    return Page.getObject();
                }, function(newValue) {
                    $scope.page = Page.getObject();
                });
            },
            link: function ($scope, element, attrs) {

                $scope.$watch(function() {
                    return $location.path()
                }, function(newValue) {
                    // split it into its parts
                    var parts = newValue.split("/");
                    $scope.type = parts[1];

                    $scope.parts = parts.slice(1);

                });
            }
        };
    }]);