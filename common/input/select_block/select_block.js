angular.module('directives.input.select_block', [])

// A simple directive to display a gravatar image given an email
    .directive('selectBlock', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/select_block/select_block.tpl.html',
            scope: {
                model: '=',
                value: '=',
                editAttr: '@',
                displayAttr: '@',
                list: '='
            },
            controller: ['$scope', function ($scope) {
                var that = this;
                var initial = true;
                $scope.$watch('list', function(list) {
                    updateDisplay();
                }, true);
                $scope.$watch('editAttr', function(editAttr) {
                    updateDisplay();
                });
                $scope.$watch('displayAttr', function(displayAttr) {
                    updateDisplay();
                });

                function updateDisplay() {
                    if($scope.list && $scope.editAttr && $scope.displayAttr) {
                        angular.forEach($scope.list, function(item, itemIndex) {
                            if(item[$scope.editAttr] == $scope.value) {
                                $scope.selectedItem = item;
                                $scope.displayValue = item[$scope.displayAttr];
                            }
                        });
                    }
                }

                $scope.changed = function(selectedItem) {
                    console.log("edit display", $scope.editAttr, $scope.displayAttr);
                    $scope.value = selectedItem[$scope.editAttr];
                    $scope.displayValue = selectedItem[$scope.displayAttr];
                }
                $scope.edit = function() {
                    that.backup = angular.copy($scope.model);
                    $scope.isEditing = true;
                }
                $scope.cancel = function() {
                    $scope.model = that.backup;
                    $scope.isEditing = false;
                }
                $scope.save = function() {
                    $scope.isEditing = false;
                    $scope.model.$update(function() {
                        console.log("model updated");
                    });
                }
            }]
        };
    }]);