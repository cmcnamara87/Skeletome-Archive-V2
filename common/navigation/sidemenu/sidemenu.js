angular.module('directives.navigation.sidemenu', [])

// A simple directive to display a gravatar image given an email
    .directive('sidemenu', ['$location', '$rootScope', 'AuthService', function ($location, $rootScope, AuthService) {

        return {
            restrict: 'E',
            templateUrl: 'common/navigation/sidemenu/sidemenu.tpl.html',
            link: function ($scope, element, attrs) {
                $scope.$on('$routeChangeSuccess', function(event, current, previous) {
                    // route changed
                    var parts = $location.path().split("/");

                    $scope.type = parts[1];
                    if($scope.type == "feed" || $scope.type == "patients" || $scope.type == "groups" || $scope.type == "user" || $scope.type == "search") {
                        $rootScope.showSidemenu = true;
                    } else {
                        $rootScope.showSidemenu = false;
                    }
                });

                $scope.logout = function() {
                    "use strict";
                    AuthService.logout();
                }
            }
        };
    }]);