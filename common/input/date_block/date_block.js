angular.module('directives.input.date_block', [])

// A simple directive to display a gravatar image given an email
    .directive('dateBlock', [function () {
        return {
            restrict: 'E',
            require: '^field',
            templateUrl: 'common/input/date_block/date_block.tpl.html',
            scope: {
                value: '='
            },
            link: function($scope, iElement, iAttrs, FieldCtrl) {
                $scope.$watch(function() {
                    return FieldCtrl.getIsEditing();
                }, function(isEditing) {
                    $scope.isEditing = isEditing;
                    if(!isEditing) {
                        $scope.showDatePicker(false)
                    }
                });

                $('.dateblock-datepicker', iElement).datepicker().on('changeDate', function(ev){
                    $scope.$apply(function() {
                        console.log("event", ev);
                        $scope.value = $('.inputblock-input', iElement).val();
                        $scope.showDatePicker(false);
                    })
                });

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