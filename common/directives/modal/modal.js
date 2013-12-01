angular.module('directives.modal', [])

    .factory('createModal', function($templateCache, $http, $timeout, $compile, $q) {
        "use strict";

        return function(options) {
            var modal = function(options) {
                var newScope = options.scope.$new();
                newScope.isShowing = false;

                // The defaults
                var defaults = {
                    type: "window"
                };

                // Extend the defaults with the options passed in
                var options = angular.extend(defaults, options);

                return $http.get('common/directives/modal/' + options.type + '.html', { cache: true }).then(function(response) {
                    console.log("got modal");
                    var modal = angular.element(response.data);

                    // Get the content html
                    return $http.get(options.url, { cache: true }).then(function(response) {
                        console.log("got content response");
                        var modalContent = angular.element(response.data);
                        modal.find('.mmodal-content').html(modalContent);
                        modal = $compile(modal)(newScope);

                        var deferred = $q.defer();

                        $timeout(function() {
                            $('body').append(modal);
                            $('.moverlay', modal).click(function() {
                                newScope.$apply(function() {
                                    modal.hide();
                                })
                            });
                            modal.show = function() {
                                newScope.isShowing = true;
                            }
                            modal.hide = function() {
                                newScope.isShowing = false;
                                $timeout(function() {
                                    modal.remove();
                                    newScope.$destroy();
                                }, 1000)
                            }
                            newScope.close = function() {
                                modal.hide();
                            }

                            console.log('resolving modal', modal);
                            deferred.resolve(modal);
                        }, 0);

                        return deferred.promise;
                    });
                });
            };
            return new modal(options);
        }
    })
//            show: function($scope) {
//                return $http.get('common/directives/modal/' + params.type + '.html', { cache: true }).then(function(response) {
//
//                    console.log("got modal");
//                    var modal = angular.element(response.data);
//
//                    // Get the content html
//                    $http.get(params.url, { cache: true }).then(function(response) {
//                        var modalContent = angular.element(response.data);
//                        modal.find('.mmodal-content').html(modalContent);
//
//                        $('body').append(modal);
//                        $compile(modal)(newScope);
//                    });
//                });
//            },
//            hide: function($scope) {
//
//            }
//        };
//
//    })
    .directive('modal', function ($templateCache, $http, $timeout, $compile) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element, attrs) {
                "use strict";
                $scope.isShowing = false;

                // The defaults
                var defaults = {
                    type: "window"
                };

                var gotModal = false;

                // Extend the defaults with the params passed in
                var params = angular.extend(defaults, $scope.$eval(attrs.modal));

                element.click(function() {
                    console.log("element clicked?");
                    $scope.$apply(function() {
                        loadTemplate();
                        open();
                    })
                })

                /**
                 * Loads the modal template, and modal content templates
                 */
                var loadTemplate = function() {
                    if(!gotModal) {
                        $http.get('common/directives/modal/' + params.type + '.html', { cache: true }).then(function(response) {
                            console.log("got modal");
                            var modal = angular.element(response.data);

                            // Get the content html
                            $http.get(params.url, { cache: true }).then(function(response) {
                                var modalContent = angular.element(response.data);
                                modal.find('.mmodal-content').html(modalContent);

                                $('body').append(modal);
                                $compile(modal)($scope);
                            });
                        });
                        gotModal = true;
                    }
                }

                /**
                 * Sets the modal to visible
                 */
                var open = function() {
                    $scope.isShowing = true;
                }
                /**
                 * Sets the modal to hidden
                 */
                $scope.close = function() {
                    $scope.isShowing = false;
                }
            }
        };
    })


