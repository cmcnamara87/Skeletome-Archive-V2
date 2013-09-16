angular.module('directives.input.address_block', [])

// A simple directive to display a gravatar image given an email
    .directive('addressBlock', [function () {
        return {
            restrict: 'E',
            require: '?^record',
            templateUrl: 'common/input/address_block/address_block.tpl.html',
            scope: {
                value: '='
            },
            link: function($scope, iElement, iAttrs, RecordCtrl) {
                var backup = null;

                $scope.$watch(function() {
                    return RecordCtrl.getIsEditing();
                }, function(isEditing) {
                    $scope.isEditing = isEditing;
                });


            }
        };
    }]);



//