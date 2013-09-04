angular.module('directives.navigation.loadingroute', [])

// A simple directive to display a gravatar image given an email
    .directive('loadingroute', ['$location', '$rootScope', function ($location, $rootScope) {

        return {
            restrict: 'E',
            templateUrl: 'common/navigation/loadingroute/loadingroute.tpl.html',
            link: function ($scope, element, attrs) {

                $scope.loading = false;

                $rootScope.$on("$routeChangeStart", function (event, next, current) {
                    $scope.loading = true;
                });
                $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
                    $scope.loading = false;
                });
                $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
                    $scope.loading = true;
                });

            }
        };
    }]);