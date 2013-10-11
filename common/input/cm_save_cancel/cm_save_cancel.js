angular.module('directives.input.cmSaveCancel', [])

// A simple directive to display a gravatar image given an email
    .directive('cmSaveCancel', [function () {
        return {
            restrict: 'E',
//            scope: {
//                saveFn: '&',
//                cancelFn: '&',
//                saveLabel: '@',
//                cancelLabel: '@'
//            },
            templateUrl: 'common/input/cm_save_cancel/cm_save_cancel.tpl.html',
            link: function($scope, iElement, iAttrs) {

                $('.btn-action-save', iElement).click(function(event) {
                    $scope.$apply(function() {
                        $scope.$save();
                    });
                    event.stopPropagation();
                });

                $('.btn-action-cancel', iElement).click(function(event) {
                    $scope.$apply(function() {
                        $scope.$cancel();
                    });
                    event.stopPropagation();
                });

            }
        };
    }]);