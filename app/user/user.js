angular.module('user', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/:uid', {
            templateUrl: 'app/user/user.tpl.html',
            controller: 'UserCtrl',
            resolve: {
                memberships: function(MembershipModel, $route) {
                    "use strict";
                    return MembershipModel.index({'user_id': $route.current.params.uid}).$promise;
                }
            }
        });
    }])

    .controller('UserCtrl', ['$scope', 'AuthService', 'SessionService', 'memberships', 'fileUploadUrl',
        function ($scope, AuthService, SessionService, memberships, fileUploadUrl) {
        $scope.user = SessionService.currentUser;
        $scope.memberships = memberships;
        console.log("fileUploadUrl", fileUploadUrl);
        $scope.fileUploadUrl = fileUploadUrl;

        $scope.logout = function() {
            AuthService.logout();
        }

        $scope.profilePictureUploaded = function(file, user) {
            "use strict";
            // we have the file, add it to the user
            user.picture = file;
            SessionService.setCurrentUser(user);
        }

    }]);

