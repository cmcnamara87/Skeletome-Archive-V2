angular.module('directives.navigation.menubar', [])

// A simple directive to display a gravatar image given an email
    .directive('menubar', ['$location', 'MembershipModel', 'AuthService', 'PatientModel', 'ShareModel', 'GroupModel', function ($location, MembershipModel, AuthService, PatientModel, ShareModel, GroupModel) {

        return {
            restrict: 'E',
            templateUrl: 'common/navigation/menubar/menubar.tpl.html',
            controller: function($scope) {
            },
            link: function ($scope, element, attrs) {

                $scope.$watch(function() {
                    return $location.path();
                }, function(newValue, oldValue) {
                    // Need to determine the type of sidebar to show

                    // two types, top level pages, non top level pages
                    var parts = $location.path().split("/");
                    parts = parts.slice(1);

                    $scope.menubarType = null;

                    if(parts[0] == "groups" || parts[0] == "patients" || parts[0] == "user" || parts[0] == "feed") {
                        // top level pages
                        $scope.menubarType = parts[0];
                        $scope.menubarObjectId = parts[1];

                    } else {
                        // non-top level pages, we go from the end to work out how to do it
                        $scope.menubarType = parts[parts.length - 3];
                        $scope.menubarObjectId = parts[parts.length - 2];
                        $scope.menubarSelectedItem = parts[parts.length - 1];
                    }
                });


                $scope.$watch('menubarType', function(menubarType) {

                    if(menubarType == "group") {
                        $scope.group = GroupModel.get({id: $scope.menubarObjectId});
                    }
                    if(menubarType == "patient") {
                        $scope.patient = PatientModel.get({id: $scope.menubarObjectId});
                        $scope.shares = ShareModel.index({patient_id: $scope.menubarObjectId});

                    }
                    if (menubarType == "share") {
                        $scope.share = ShareModel.get({id: $scope.menubarObjectId});

                    }
                    if (menubarType == "patients") {
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