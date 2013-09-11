angular.module('directives.input.date_block', [])

// A simple directive to display a gravatar image given an email
    .directive('dateBlock', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/date_block/date_block.tpl.html',
            scope: {
                model: '=',
                value: '=',
                isEditable: '=editable'
            },
            link: function($scope, iElement, iAttrs) {
                var backup = null;

                $('.dateblock-datepicker', iElement).datepicker().on('changeDate', function(ev){
                    $scope.$apply(function() {
                        console.log("event", ev);
                        $scope.value = $('.inputblock-input', iElement).val();
                    })
                });

                $scope.edit = function() {
                    if(!$scope.isEditable) {
                        return;
                    }

                    backup = angular.copy($scope.model);
                    $scope.isEditing = true;
                    setTimeout(function() {
                        $('.inputblock-input', iElement).focus();
                    }, 0);

                }

                $scope.cancel = function() {
                    $scope.model = backup;
                    $scope.showDatePicker(false);
                    $scope.isEditing = false;

                }
                $scope.save = function() {
                    $scope.isEditing = false;
                    $scope.model.$update(function() {
                        console.log("model updated");
                    });
                }


                $scope.showDatePicker = function(show) {
                    if(show) {
                        setTimeout(function() {
                            $('.dateblock-datepicker', iElement).datepicker('show');
                        }, 0);
                    } else {
                        setTimeout(function() {
                            $('.dateblock-datepicker', iElement).datepicker('hide');
                        }, 0)

                    }
                }
            }
        };
    }]);