angular.module('directives.disorder_modal', [])

// A simple directive to display a gravatar image given an email
    .directive('disorderModal', [function () {

        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'common/directives/disorder_modal/disorder_modal.tpl.html',
            link: function ($scope, element, attrs) {
                $scope.inputChanged = function(term) {
                    $scope.results = PatientModel.query({
                        query: term
                    });
                }
            }
        };
    }]);