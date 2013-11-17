angular.module('directives.lookup', [])

// A simple directive to display a gravatar image given an email
    .directive('lookup', ['PatientModel', function (PatientModel) {

        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'common/directives/lookup/lookup.tpl.html',
            link: function ($scope, element, attrs) {
                $scope.inputChanged = function(term) {
                    $scope.results = PatientModel.query({
                        query: term
                    });
                }
            }
        };
    }]);