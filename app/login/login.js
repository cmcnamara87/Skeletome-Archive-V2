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

        $routeProvider.when('/forgot', {
            templateUrl:'app/login/forgot.tpl.html',
            controller:'LoginCtrl'
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
                if(reason.status != "401") {
                    $scope.error = reason.data[0];
                } else {
                    $scope.error = "Incorrect username or password.";
                }

            });
        }

        $scope.reset = function(mail) {
            "use strict";
            AuthService.resetPassword(mail).then(function() {
                $scope.success = "Password reset email sent.";
            }, function() {
                $scope.error = "Failed to send reset password email.";
            })

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


