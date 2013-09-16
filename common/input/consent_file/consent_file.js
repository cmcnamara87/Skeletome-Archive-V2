angular.module('directives.input.consent_file', [])

// A simple directive to display a gravatar image given an email
    .directive('consentFile', [function () {
        return {
            restrict: 'E',
            require: '^record',
            templateUrl: 'common/input/consent_file/consent_file.tpl.html',
            scope: {
                value: '='
            },
            controller: ['$scope', function ($scope) {
            }],
            link: function($scope, iElement, iAttrs, RecordCtrl) {
                $scope.$watch(function() {
                    return RecordCtrl.getIsEditing();
                }, function(isEditing) {
                    $scope.isEditing = isEditing;
                });
            }
        };
    }]);