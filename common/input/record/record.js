angular.module('directives.input.record', [])


    .directive('record', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/record/record.tpl.html',
            scope: {
                resource: '=',
                removeFn: '&',
                editable: '@'
            },
            transclude: true,
            controller: function($scope, $rootScope) {
                var controller = this;

                $scope.isNew = true;

                controller.getIsNew = function() {
                    return $scope.isNew;
                }
                controller.getIsEditable = function() {
                    return $scope.isEditable;
                }
                controller.backup = function() {
                    console.log('Record: Backing up');
                    controller.resourceBackup = {};
                    angular.copy($scope.resource, controller.resourceBackup);
                }
                controller.restore = function() {
                    console.log("Record: Restoring")
                    angular.copy(controller.resourceBackup, $scope.resource);
                }
                controller.save = function() {

                    if(angular.isDefined($scope.resource.id)) {
                        console.log("Record: Updating...");
                        $scope.resource.$update();
                    } else {
                        console.log("Record: Saving...");
                        $scope.resource.$save();
                    }
                }


                $scope.save = function() {
                    controller.save();
                    $scope.isNew = false;
                }
                $scope.cancel = function() {
                    $scope.removeFn();
                }
                $scope.remove = function() {
                    $scope.resource.$delete();
                    $scope.removeFn();
                }
            },

            link: function($scope, iElement, iAttrs) {

                $scope.$watch('editable', function(editable) {
                   if(editable == "false") {
                       $scope.isEditable = false;
                   } else {
                       $scope.isEditable = true;
                   }
                });

                $scope.isRemovable = false;
                iAttrs.$observe('removeFn', function(removeFn) {
                    console.log(removeFn);
                    if(removeFn) {
                        $scope.isRemovable = true;
                    } else {
                        $scope.isRemovable = false;
                    }
                });

                $scope.$watch('resource.id', function(id) {
                    if(id) {
                        $scope.isNew = false;
                    } else {
                        $scope.isNew = true;
                        setTimeout(function () {
                            console.log('setting focus');
                            $('input, textarea', iElement).eq(0).focus();
                        }, 0);

//                        setTimeout(function() {
//                            $('html').click(function() {
//                                $('html').unbind('click');
//                                $scope.$apply(function() {
//                                    $scope.save();
//                                });
//                            });
//                        }, 0);


                    }
                })





//                $('.btn-save', iElement).click(function(event) {
//                    $scope.$apply(function() {
//                        $scope.save();
//                    });
//                    $('html').unbind('click');
//                    event.stopPropagation();
//                });
//
//                $('.btn-cancel', iElement).click(function(event) {
//                    $scope.$apply(function() {
//                        $scope.cancel();
//                    });
//                    $('html').unbind('click');
//                    event.stopPropagation();
//                });
//
//                iElement.keyup(function(e) {
//                    if (e.keyCode == 27) {
//                        $('html').unbind('click');
//                        $scope.$apply(function() {
//                            $scope.cancel();
//                        })
//                    }
//                });


//                iElement.click(function(event){
//                    if($scope.isEditable && !$scope.isEditing) {
//                        $scope.$apply(function() {
//                            $scope.edit();
//                        })
//                    }
//
//                    // Don't propogate this click (we will manually call the html to click it)
//                    console.log("Record: Record clicked");
//                    event.stopPropagation();
//                });


                $scope.edit = function() {
                    $scope.isEditing = true;

                    // Select first input
                    setTimeout(function () {
                        $(':input', iElement).eq(0).focus();
                    }, 0);

                    // Create a backup
                    $scope.backup = {};
                    angular.copy($scope.resource, $scope.backup);

                    // Trigger HTML click (closes any other ones that are editing)
//                    $('html').click();



                    setTimeout(function() {
                        $('html').click(function() {
                            console.log("Record: Clicked outside the bounds of the record");
                            $('html').unbind('click');
                            $scope.$apply(function() {
                                console.log("saving");
                                $scope.save();
                            });

                        });
                    }, 500);
                    // Listen for the html being clicked, to close this one
//                    $('html').click(function() {
//                        console.log("HTML it was clicked");
//                        $('html').unbind('click');
//                        $scope.$apply(function() {
//                            if(angular.isDefined($scope.resource.id)) {
//                                $scope.save();
//                            } else {
//                                $scope.cancel();
//                            }
//                        });
//                    });

                }

                $scope.save = function() {
                    $scope.isEditing = false;
                    if($scope.resource.id) {
                        $scope.resource.$update();
                    } else {
                        $scope.resource.$save();
                    }
                }

                $scope.cancel = function() {
                    if(!angular.isDefined($scope.resource.id)) {
                        if($scope.removeFn) {
                            $scope.removeFn();
                        }
                    } else {
                        angular.copy($scope.backup, $scope.resource);
                    }
                    $scope.isEditing = false;
                }
            }
        };
    }]);

//angular.module('directives.input.record', [])
//
//// A simple directive to display a gravatar image given an email
//    .directive('record', [function () {
//        return {
//            restrict: 'A',
//            templateUrl: 'common/input/record/record.tpl.html',
//            controller: 'RecordCtrl',
//            link: function ($scope, iElement, iAttrs) {
//
//                $('.btn-save', iElement).click(function(event) {
//                    $scope.$apply(function() {
//                        $scope.save();
//                    });
//                    $('html').unbind('click');
//                    event.stopPropagation();
//                });
//
//                $('.btn-cancel', iElement).click(function(event) {
//                    $scope.$apply(function() {
//                        $scope.cancel();
//                    });
//                    $('html').unbind('click');
//                    event.stopPropagation();
//                });
////
//                iElement.click(function(event){
//                    alert("is editing");
//                    if(!$scope.isEditing) {
//
//                        // Trigger HTML click (closes any other ones that are editing)
//                        $('html').click();
//
//                        // Go into edit mode
//                        $scope.$apply(function() {
//                            $scope.edit();
//                        });
//
//                        // Listen for the html being clicked, to close this one
//                        $('html').click(function() {
//                            $('html').unbind('click');
//                            $scope.$apply(function() {
//                                $scope.cancel();
//                            });
//                        });
//                    }
//
//                    // Don't propogate this click (we will manually call the html to click it)
//                    event.stopPropagation();
//
//                });
//
//
//                $scope.edit = function() {
//                    $scope.isEditing = true;
//
//                    // Select first input
//                    setTimeout(function () {
//                        $('input', iElement).eq(0).focus();
//                    }, 0);
//
//                    // Create a backup
//                    $scope.backup = {};
//                    angular.copy($scope.resource, $scope.backup);
//                }
//
//                $scope.cancel = function() {
//                    if(!angular.isDefined($scope.resource.id)) {
//                        if($scope.removeFn) {
//                            $scope.removeFn();
//                        }
//                    } else {
//                        angular.copy($scope.backup, $scope.resource);
//                    }
//                    $scope.isEditing = false;
//                }
//
//            }
//        }
//    }])
//
//
//    .controller('RecordCtrl', ['$scope', function ($scope) {
//
//
////
////
////
//    }]);
//
////
