angular.module('directives.navigation.menubar', [])

// A simple directive to display a gravatar image given an email
    .directive('menubar', ['$location', 'Page', 'MembershipModel', 'AuthService', function ($location, Page, MembershipModel, AuthService) {

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
                }, function(newValue, oldValue) {
                    // split it into its parts
                    var parts = newValue.split("/");
                    $scope.type = parts[1];

                    // Save it minus the "#"
                    $scope.parts = parts.slice(1);

                    // Load the looping ones
                    if($scope.parts[0] == "patients" && oldValue != "patients") {
                        // We need to get the memberships
                        $scope.$watch(function() {
                            return AuthService.getUser()
                        }, function(user) {
                           if(user) {
                               $scope.memberships = MembershipModel.index({user_id: AuthService.getUser().uid});
                           }
                        });
                    }

                });
            }
        };
    }]);