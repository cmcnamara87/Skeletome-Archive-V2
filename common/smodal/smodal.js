angular.module('directives.smodal', [])

    // Display a modal
    .factory('SmodalService', ['$rootScope', function ($rootScope) {
        return {
            show: function(modalName) {
                $rootScope.$broadcast('modal', {name: modalName, show: true});
            },
            hide: function(modalName) {
                $rootScope.$broadcast('modal', {name: modalName, show: false});
            }
        }
    }])
    .directive('smodal', ['GroupModel', '$location', '$parse', function (GroupModel, $location, $parse) {
        return {
            restrict: 'E',
            templateUrl: 'common/smodal/smodal.tpl.html',
            transclude: true,
            scope: true,
            compile: function(tElement, tAttrs, transcludeFn) {

                return function (scope, el, tAttrs) {
                    scope.isShowing = false;
                    var $overlay = $("<div class='smodal-overlay'></div>");

                    /**
                     * Show the modal and add the overlay
                     */
                    scope.$open = function() {
                        scope.isShowing = true;
                        $('body').append($overlay);
                        setTimeout(function() {
                            var $inputs = $('input', tElement);
                            if($inputs.length) {
                                $('input', tElement).eq(0).focus();
                            } else {
                                $('.btn-action-selected', tElement).eq(0).focus();
                            }

                        }, 0)
                    }

                    /**
                     * Close the modal and remove the overlay
                     */
                    scope.$close = function() {
                        scope.isShowing = false;
                        $('.smodal-overlay').remove();
                    }

                    $('body').keydown(function(e) {
                        if(e.keyCode == 27) {
                            scope.$apply(function() {
                                scope.$close();
                            });
                            return false;
                        }
                    });



                    /**
                     * Listen for modal events
                     */
                    scope.$on('modal', function(event, args) {
                        if(args.name == tAttrs.name) {
                            if(args.show) {
                                scope.$open();
                            } else {
                                scope.$close();
                            }
                        }
                    })

                    scope.$on("$locationChangeStart", function(event){
                        console.log("Location path chagned", event);
                        scope.$close();
                    });

                    transcludeFn(scope, function cloneConnectFn(cElement) {
                        tElement.find('.smodal').append(cElement);

                        $('input, button', tElement).keydown(function(e) {
                            if(e.keyCode == 13 && e.metaKey) {
                                console.log("enter and meta");
                                // command + enter, submit the form (this is pretty icky :P)
                                var clickFunctionString = $('.btn-action-selected', tElement).attr('ng-click');
                                console.log("clickFunctionString", $('.btn-action-selected'), clickFunctionString);;
                                var expression = $parse(clickFunctionString);
                                expression(scope);
//                            expression.assign($scope, 'newValu');
                            }
                        });


                    });
                };
            }

            /*link: function ($scope, element, attrs) {

                $scope.test = "TESTING";
                $scope.shareChanged = function(group) {
                    GroupModel.index({name: group}, function(results) {
                        $scope.shareResults = results;
                    });
                }

                $scope.shareKeypressed = function(event) {
                    alert("alert");
                    console.log("event", event);

                }
//                scope.$watch(attrs.show, function(value) {
//                    if(value) {
//                        elem.modal('show');
//                    } else {
//                        elem.modal('hide');
//                    }
//                });
//
//                elem.on('hidden', function () {
//                    var toggle = scope.$eval(attrs.cmModal);
//
//                    if(toggle === true) {
//                        var toggleModel = $parse(attrs.cmModal);
//                        // This lets you SET the value of the 'parsed' model
//
//                        scope.$apply(function() {
//                            toggleModel.assign(scope, false);
//                        })
//
//                    }
//                })
            }*/
        };
    }]);
