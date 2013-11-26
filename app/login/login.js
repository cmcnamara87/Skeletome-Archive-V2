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

    .controller('LoginCtrl', ['$location', '$scope', 'AuthService', 'SessionService',
        function ($location, $scope, AuthService, SessionService) {

        $scope.credentials = {
        };

        $scope.login = function(credentials) {
            AuthService.login(credentials).then(function(path) {
                "use strict";
                console.log("Login: Successful, redirecting");
                $location.path(SessionService.pathAfterLogin);
            }, function(reason) {
                "use strict";
                console.log("error reason", reason);
                $scope.error = reason.data[0];
            });
        }
    }])

    .controller('RegisterCtrl', ['$scope', 'AuthService', 'UserModel', '$location', function ($scope, AuthService, UserModel, $location) {

        $scope.newUser = new UserModel({});

        $scope.register = function(user) {
            var newUser = new UserModel(user);
            AuthService.register(newUser).then(function() {
                "use strict";
                AuthService.login({
                    mail: user.mail,
                    password: user.pass
                }).then(function() {
                   $location.path('/feed');
                });

            }, function(reason) {
                "use strict";
                $scope.error = reason;
            });


        }
    }]);


