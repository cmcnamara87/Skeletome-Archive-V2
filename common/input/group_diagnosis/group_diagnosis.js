angular.module('directives.input.group_diagnosis', [])

// A simple directive to display a gravatar image given an email
    .directive('groupDiagnosis', [function () {
        return {
            restrict: 'E',
            require: '^field',
            templateUrl: 'common/input/group_diagnosis/group_diagnosis.tpl.html',
            scope: {
                diagnosis: '='
            },
            controller: ['$scope', function ($scope) {
            }],
            link: function($scope, iElement, iAttrs, FieldCtrl) {
                $scope.$watch(function() {
                    return FieldCtrl.getIsEditing();
                }, function(isEditing) {
                    $scope.isEditing = isEditing;
                });

                // Put the disorder in when its selected
                $scope.disorder = null;
                $scope.$watch('disorder.id', function(disorder_id) {
                    if(disorder_id) {
                        $scope.diagnosis.disorder_id = disorder_id;
                    }
                })

            }
        };
    }]);