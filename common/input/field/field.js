angular.module('directives.input.field', [])

    .directive('field', [function () {
        return {
            restrict: 'E',
            require: '^record',
            templateUrl: 'common/input/field/field.tpl.html',
            scope: true,
            transclude: true,
            controller: function($scope, $rootScope) {
                var controller = this;

                $scope.isEditing = false;
                $scope.isEditable = true;

                controller.getIsEditing = function() {
                    return $scope.isEditing;
                }
                controller.getIsEditable = function() {
                    return $scope.isEditable;
                }

                $scope.broadcastStopEditing = function() {
                    controller.sendBroadcast = true;
                    $rootScope.$broadcast('stopEditing');
                }

                $scope.$on('stopEditing', function(event, args) {
                    if(controller.sendBroadcast) {
                        controller.sendBroadcast = false;
                    } else {
                        // Stop any editing here!
                        $scope.isEditing = false;
                    }
                });

            },

            link: function($scope, iElement, iAttrs, RecordCtrl) {

                iAttrs.$observe('editable', function(isEditable) {
                    if(isEditable) {
                        $scope.isEditable = isEditable == "true";
                    }
                })

                // Work out if editing, we need to find out from the record,
                // if its a new resource
                $scope.$watch(function() {
                    return RecordCtrl.getIsNew()
                }, function(isNew) {
                    if(isNew) {
                        $scope.isEditing = true;
                    } else {
                        $scope.isEditing = false;
                    }
                    $scope.isNew = isNew;
                });


                iElement.click(function(event){
                    if($scope.isEditable && !$scope.isEditing) {
                        $scope.$apply(function() {
                            // Tell other fields to stop editing
                            $scope.broadcastStopEditing();

                            // Create a backup
                            RecordCtrl.backup();

                            // Editing is true
                            $scope.isEditing = true;

                            $('html').click(function() {
                                $('html').unbind('click');
                                $scope.$apply(function() {
                                    $scope.save();
                                });
                            });

                            iElement.keyup(function(e) {
                                if (e.keyCode == 27) {
                                    $('html').unbind('click');
                                    $scope.$apply(function() {
                                        $scope.cancel();
                                    })
                                }
                            });

                            iElement.keydown(function(e) {
                                if ((e.keyCode == 10 || e.keyCode == 13) && e.metaKey) {
                                    $scope.$apply(function() {
                                        $scope.save();
                                    })
                                }
                            });

                            // Give focus to first input
                            setTimeout(function () {
                                $(':input', iElement).eq(0).focus();
                            }, 0);

                        })
                    }
                    event.stopPropagation();
                });

                $scope.edit = function() {
                }

                $scope.save = function() {
                    console.log("Field: Saving");
                    $scope.isEditing = false;
                    RecordCtrl.save();
                }
                $scope.cancel = function() {
                    RecordCtrl.restore();
                    $scope.isEditing = false;
                }
            }
        };
    }]);
