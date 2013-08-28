myApp.directives.directive('sidebar', function() {
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'partials/sidebar.html',
        replace: true,
        controller: function ( $scope, auth, $location, GroupModel, PatientModel) {

            $scope.$watch(function() {
                return $location.path()
            }, function(newValue, oldValue) {

                // split it into its parts
                var parts = newValue.split("/");

                $scope.tab = parts[1];

                $scope.subs = parts.slice(2);

                if($scope.tab == "group") {
                    $scope.group = GroupModel.get({id: $scope.subs[0]});
                }
                if($scope.tab == "patient") {
                    if(!$scope.patient || $scope.subs[0] != $scope.patient.id) {
                        $scope.patient = PatientModel.get({id: $scope.subs[0]});
                    }

                }

                console.log("url changed to" + parts);
            });

        },
        link: function(scope, elem, attrs) {
        }
    };
});