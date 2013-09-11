angular.module('directives.input.address_block', [])

// A simple directive to display a gravatar image given an email
    .directive('addressBlock', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/address_block/address_block.tpl.html',
            scope: {
                value: '=',
                model: '=',
                isEditable: '=editable',
                delete: '&'
            },
            link: function($scope, iElement, iAttrs) {
                var backup = null;

                $scope.$watch('model', function(model) {
                    if(model && !angular.isDefined(model.id)) {
                        $scope.edit();
                    }
                });

                $scope.edit = function() {
                    backup = angular.copy($scope.model);
                    $scope.isEditing = true;

                    setTimeout(function() {
                        $('.addressblock-street input', iElement).focus();
                    }, 0);
                }
                $scope.cancel = function() {
                    $scope.model = backup;
                    $scope.isEditing = false;

                    console.log("model is", $scope.model);
                    if(!$scope.model.id) {
                        $scope.delete();
                    }
                }
                $scope.save = function() {
                    console.log("saving");
                    $scope.isEditing = false;
                    $scope.model.$update(function() {
                        console.log("model updated");
                    });
                }
            }
        };
    }]);



//