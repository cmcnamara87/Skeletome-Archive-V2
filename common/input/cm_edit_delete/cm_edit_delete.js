angular.module('directives.input.cmEditDelete', [])

// A simple directive to display a gravatar image given an email
    .directive('cmEditDelete', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/cm_edit_delete/cm_edit_delete.tpl.html',
            link: function($scope, iElement, iAttrs) {


                iAttrs.$observe('deleteEnabled', function(value) {
                    if(angular.isDefined(iAttrs.deleteEnabled)) {
                        $scope.deleteEnabled = $scope.$eval(value);
                    } else {
                        $scope.deleteEnabled = true;
                    }
                });

                iAttrs.$observe('editEnabled', function(value) {
                    if(angular.isDefined(iAttrs.editEnabled)) {
                        $scope.editEnabled = $scope.$eval(value);
                    } else {
                        $scope.editEnabled = true;
                    }
                });

                $('.btn-action-edit', iElement).click(function(event) {
                    $scope.$apply(function() {
                        $scope.$edit();
                    });
                    event.stopPropagation();
                });

                $('.btn-action-delete', iElement).click(function(event) {
                    $scope.$apply(function() {
//                        $scope.$cancel();
                        $scope.$remove();
                    });
                    event.stopPropagation();
                });

            }
        };
    }]);