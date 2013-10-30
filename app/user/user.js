angular.module('user', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/:uid', {
            templateUrl: 'app/user/user.tpl.html',
            controller: 'UserCtrl',
            resolve: {
            }
        });
    }])

    .controller('UserCtrl', ['$scope', 'AuthService', function ($scope, AuthService) {
        $scope.logout = function() {
            AuthService.logout();
        }

    }]);

