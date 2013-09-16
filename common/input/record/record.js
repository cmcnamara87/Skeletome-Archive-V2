angular.module('directives.input.record', [])
//
//// A simple directive to display a gravatar image given an email
    .directive('bloop', [function() {
        return {
            restrict: 'A',
            templateUrl: 'common/input/record/record_table.tpl.html',
            scope: {
                resource: '='
            },
            transclude: true,
            controller: function($scope) {
                var controller = this;

                console.log("record table controller");
                $scope.isEditing = false;

                controller.getIsEditing = function() {
                    return $scope.isEditing;
                }
            }
        }
    }])

    .directive('record', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/input/record/record.tpl.html',
            scope: {
                resource: '=',
                removeFn: '&'
            },
            transclude: true,
            controller: function($scope) {
                var controller = this;

                $scope.isEditing = false;

                controller.getIsEditing = function() {
                    return $scope.isEditing;
                }
            },

            link: function($scope, iElement, iAttrs) {

                $scope.$watch('resource', function(resource) {
                    if(resource && !resource.id) {
                        console.log("set editing", resource);
                        $scope.edit();
                    }
                })
                $('.btn-save', iElement).click(function(event) {
                    $scope.$apply(function() {
                        $scope.save();
                    });
                    $('html').unbind('click');
                    event.stopPropagation();
                });

                $('.btn-cancel', iElement).click(function(event) {
                    $scope.$apply(function() {
                        $scope.cancel();
                    });
                    $('html').unbind('click');
                    event.stopPropagation();
                });
//
                iElement.keyup(function(e) {
                    if (e.keyCode == 27) {
                        $('html').unbind('click');
                        $scope.$apply(function() {
                            $scope.cancel();
                        })
                    }
                });


                iElement.click(function(event){
                    if(!$scope.isEditing) {
                        $scope.$apply(function() {
                            $scope.edit();
                        })
                    }

                    // Don't propogate this click (we will manually call the html to click it)
                    event.stopPropagation();
                });


                $scope.edit = function() {
                    $scope.isEditing = true;

                    // Select first input
                    setTimeout(function () {
                        $('input', iElement).eq(0).focus();
                    }, 0);

                    // Create a backup
                    $scope.backup = {};
                    angular.copy($scope.resource, $scope.backup);

                    // Trigger HTML click (closes any other ones that are editing)
//                    $('html').click();



                    setTimeout(function() {
                        $('html').click(function() {
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

                    return;

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
