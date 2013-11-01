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

    .controller('LoginCtrl', ['$scope', 'AuthService', 'SessionService', function ($scope, AuthService, SessionService) {

        console.log("session service", SessionService);
        $scope.currentUser = SessionService.currentUser;

        $scope.credentials = {
            mail: "skelarch@skeletome.org"
        };

        $scope.login = function(credentials) {
            AuthService.login(credentials, function() {
                console.log("Error logging in");
            });
        }

        $scope.logout = function() {
            AuthService.logout(function() {
                console.log("Success logging out");
            });
        }
    }])

    .controller('LogoutCtrl', ['$scope', 'AuthService', function ($scope, AuthService) {

        $scope.logout = function() {
            AuthService.logout(function() {
                console.log("Success logging out");
            });
        }
    }])


    .controller('RegisterCtrl', ['$scope', 'AuthService', 'UserModel', '$location', function ($scope, AuthService, UserModel, $location) {

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


