myApp.directives.directive('routeChanger', function() {
    return {
        restrict: 'E',
        scope: {
        },
        template: '<div>{{ alertType }} {{ alertMessage }} {{ active }}</div>',
        replace: true,
        controller: function ($rootScope, $scope, $location) {

            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                $scope.alertType = "";
                $scope.alertMessage = "Loading...";
                $scope.active = "progress-striped active progress-warning";
            });
            $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
//                $scope.alertType = "alert-success";
//                $scope.alertMessage = "Successfully changed routes :)";
//                $scope.active = "progress-success";

                $scope.newLocation = $location.path();
            });
            $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
//                alert("ROUTE CHANGE ERROR: " + rejection);
//                $scope.alertType = "alert-error";
//                $scope.alertMessage = "Failed to change routes :(";
//                $scope.active = "";
            });
        },
        link: function(scope, elem, attrs) {
        }
    };
});