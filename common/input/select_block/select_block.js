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
                    console.log("list is now ", list);
                    if(list.length && $scope.value && initial) {
                        // we have the initial value
                        initial = false;
                        angular.forEach(list, function(item, itemIndex) {
                            if(item[$scope.editAttr] == $scope.value) {
                                $scope.selectedItem = item;
                                $scope.displayValue = item[$scope.displayAttr];
                            }
                        });
                    }
                }, true);

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