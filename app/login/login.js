angular.module('login', ['security'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl:'app/login/login.tpl.html',
            controller:'LoginCtrl'
        });

        $routeProvider.when('/register', {
            templateUrl:'app/login/register.tpl.html',
            controller:'RegisterCtrl'
        });

        $routeProvider.when('/logout', {
            templateUrl:'app/login/logout.tpl.html',
            controller:'LogoutCtrl'
        });
    }])

    .controller('LoginCtrl', ['$location', '$scope', 'AuthService', 'SessionService', function ($location, $scope, AuthService, SessionService) {

        console.log("session service", SessionService);
        $scope.currentUser = SessionService.currentUser;

        $scope.credentials = {
//            mail: "skelarch@skeletome.org"
            mail: "skelarch@skeletome.org"
        };

        $scope.login = function(credentials) {
            AuthService.login(credentials).then(function(path) {
                "use strict";
                console.log("Login: Successful, redirecting", path);
                $location.path(path);
            }, function(reason) {
                "use strict";
                console.log("error reason", reason);
                $scope.error = reason.data[0];
            });
        }

        $scope.logout = function() {
            AuthService.logout(function() {
                console.log("Success logging out");
            });
        }
    }])

    .controller('LogoutCtrl', ['$scope', 'AuthService', function ($scope, $location, AuthService) {

        $scope.logout = function() {
            AuthService.logout().then(function() {
                "use strict";
                console.log("Logout: Logged out");
                $location.path('/login');
            })
        }
    }])


    .controller('RegisterCtrl', ['$scope', 'AuthService', 'UserModel', '$location', function ($scope, AuthService, UserModel, $location) {

        $scope.newUser = new UserModel({});

        $scope.register = function(user) {
            var newUser = new UserModel(user);
            AuthService.register(newUser, function(user) {
                console.log("registered", user);
                $location.path('/login');
            }, function(error) {
                console.log("error", error);
            })

        }
    }]);


