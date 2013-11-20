angular.module('user', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/:uid', {
            templateUrl: 'app/user/user.tpl.html',
            controller: 'UserCtrl',
            resolve: {
                user: function(UserModel, $route) {
                    "use strict";
                    return UserModel.get({'uid': $route.current.params.uid});
                },
                memberships: function(MembershipModel, $route) {
                    "use strict";
                    return MembershipModel.index({'user_id': $route.current.params.uid}).$promise;
                }
            }
        });
    }])

    .controller('UserCtrl', ['$scope', 'AuthService', 'user', 'memberships', function ($scope, AuthService, user, memberships) {
        $scope.user = user;
        $scope.memberships = memberships;

        $scope.logout = function() {
            AuthService.logout();
        }

    }]);

