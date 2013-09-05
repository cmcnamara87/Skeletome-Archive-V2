angular.module('directives.input.address_block', [])

// A simple directive to display a gravatar image given an email
    .directive('addressBlock', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/address_block/address_block.tpl.html',
            scope: {
                model: '=',
                value: '='
            },
            controller: ['$scope', 'AddressModel', function ($scope, AddressModel) {
                var that = this;

                $scope.lookupStreet = function(street) {
                    $scope.predictions = AddressModel.lookupAddress(street, "geocode");
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



//