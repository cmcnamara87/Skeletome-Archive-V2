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
                        console.log("Getting user (not current session user", SessionService.currentUser.uid);
                        return UserModel.get({uid: $route.current.params.uid});
                    } else {
                        console.log("Getting current session user");
                        return $q.when(SessionService.currentUser);
                    }
                }
            }
        });
    }])

    .controller('UserCtrl', ['$scope', 'AuthService', 'SessionService', 'memberships', 'fileUploadUrl', '$location', 'user', 'SmodalService',
        function ($scope, AuthService, SessionService, memberships, fileUploadUrl, $location, user, SmodalService) {
            $scope.memberships = memberships;
            $scope.fileUploadUrl = fileUploadUrl;
            $scope.user = user;
            $scope.profilePicture = null;

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
                $scope.profilePicture = file;
            }

            $scope.changeProfilePicture = function() {
                "use strict";
                SmodalService.show('picture');
            }
            $scope.saveProfilePicture = function() {
                "use strict";
                $scope.user.picture = $scope.profilePicture;
                $scope.user.$setPicture($scope.profilePicture);
                SessionService.currentUser.picture = $scope.profilePicture;
                $scope.profilePicture = null;
            }

    }]);

