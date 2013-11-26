angular.module('user', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/:uid', {
            templateUrl: 'app/user/user.tpl.html',
            controller: 'UserCtrl',
            resolve: {
                memberships: function(MembershipModel, $route) {
                    "use strict";
                    return MembershipModel.index({'user_id': $route.current.params.uid}).$promise;
                },
                user: function(UserModel, $route, SessionService, $q) {
                    "use strict";
                    if($route.current.params.uid != SessionService.currentUser.uid) {
                        return UserModel.get({uid: $route.current.params.uid});
                    } else {
                        return $q.when(SessionService.currentUser);
                    }
                }
            }
        });
    }])

    .controller('UserCtrl', ['$scope', 'AuthService', 'SessionService', 'memberships', 'fileUploadUrl', '$location', 'user',
        function ($scope, AuthService, SessionService, memberships, fileUploadUrl, $location, user) {
        $scope.memberships = memberships;
        $scope.fileUploadUrl = fileUploadUrl;
        $scope.user = user;

        $scope.logout = function() {
            AuthService.logout().then(function() {
                "use strict";
                $location.path('/login');
            });
        }

        $scope.profilePictureUploaded = function(file, user) {
            "use strict";
            console.log("user profile file uploaded", file, user);
            // we have the file, add it to the user
            user.$setPicture(file);
            user.picture = file;
            AuthService.setCurrentUser(user);
        }

    }]);

