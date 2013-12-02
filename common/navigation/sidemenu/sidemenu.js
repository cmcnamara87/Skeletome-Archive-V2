angular.module('directives.navigation.sidemenu', [])

// A simple directive to display a gravatar image given an email
    .directive('sidemenu', ['$location', '$rootScope', 'AuthService', 'SessionService', function ($location, $rootScope, AuthService, SessionService) {

        return {
            restrict: 'E',
            templateUrl: 'common/navigation/sidemenu/sidemenu.tpl.html',
            link: function ($scope, element, attrs) {
                $scope.$on('$routeChangeSuccess', function(event, current, previous) {
                    // route changed
                    var parts = $location.path().split("/");

                    console.log("sidemenu", parts, event, current);
                    $scope.type = parts[1];
                    if($scope.type == "feed" || $scope.type == "patients" || $scope.type == "groups" || $scope.type == "search") {
                        $rootScope.showSidemenu = true;
                    } else if($scope.type == "user" && parts[2] == SessionService.currentUser.uid) {
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