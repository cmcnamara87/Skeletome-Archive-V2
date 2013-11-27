angular.module('directives.navigation.submenubar', ['directives.navigation.submenubar.submenubar_item'])

// A simple directive to display a gravatar image given an email
    .directive('submenubar', ['$location', '$rootScope', 'PatientModel', function ($location, $rootScope, PatientModel) {

        return {
            restrict: 'E',
            templateUrl: 'common/navigation/submenubar/submenubar.tpl.html',
            link: function ($scope, element, attrs) {
                $scope.$on('$routeChangeSuccess', function(event, current, previous) {
                    // route changed
                    var parts = $location.path().split("/");

                    $scope.type = parts[1];
                    if($scope.type == "patient" || $scope.type == "group") {
                        $scope.id = parts[2];
                        console.log("Show sub menu bar");
                        if($scope.type == "patient") {
                            PatientModel.get({
                                id: $scope.id
                            }).$promise.then(function(patient) {
                                "use strict";
                                $scope.patient = patient;
                            });
                        }
                        $rootScope.showSubmenuBar = true;
                    } else {
                        console.log("Hide sub menu bar");
                        $rootScope.showSubmenuBar = false;
                    }
                });
            }
        };
    }]);