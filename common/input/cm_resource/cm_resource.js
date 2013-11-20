angular.module('directives.input.cmResource', [])

    .directive('cmResource', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: true,
//            template: "<div ng-transclude></div>",
            compile: function(tElement, tAttrs, transcludeFn) {

                return function (scope, el, tAttrs) {

                    el.addClass('resource');

                    var backup = {};
                    /**
                     * Stores if we are editing the resource
                     * @type {boolean}
                     */
                    scope.$isEditing = false;

                    /**
                     * Saves the resource
                     *
                     * Performs a save or an update depending on if the
                     * resource has an 'id' or not
                     */
                    scope.$save = function() {
                        scope.$isEditing = false;
                        el.removeClass('is-editing');

                        cleanup();

                        var resource = scope[tAttrs.cmResource];
                        if(angular.isDefined(resource.id)) {
                            resource.$update(function(resource) {
                                "use strict";
                                if(angular.isDefined(tAttrs.savedFn)) {
                                    var savedFn = $parse(tAttrs.savedFn);
                                    if (!angular.isFunction(savedFn)) {
                                        var message = "The expression on the cmResource directive does not point to a valid saved function - saved-fn.";
                                        throw message + "\n";
                                    }
                                    savedFn(scope);
                                }
                            });
                        } else {
                            resource.$save(function(resource) {
                                "use strict";
                                if(angular.isDefined(tAttrs.savedFn)) {
                                    var savedFn = $parse(tAttrs.savedFn);
                                    if (!angular.isFunction(savedFn)) {
                                        var message = "The expression on the cmResource directive does not point to a valid saved function - saved-fn.";
                                        throw message + "\n";
                                    }
                                    savedFn(scope);
                                }
                            });
                        }
                    }

                    /**
                     * Puts the resource in 'edit mode'
                     */
                    scope.$edit = function() {

                        // backup the resource
                        var resource = $parse(tAttrs.cmResource)(scope);
                        angular.copy(resource, backup);

                        scope.$isEditing = true;
                        el.addClass('is-editing');

                        // todo: work out how to make this better
                        // the timeout is so we dont catch the propagation of the click
                        // from when you click the 'add'  button

//                        setTimeout(function() {
//                            "use strict";
//                            $('body').click(function() {
//                                "use strict";
//                                scope.$apply(function() {
//                                    scope.$cancel();
//                                })
//                            });
//                        }, 500);
//
//                        el.click(function(event) {
//                            "use strict";
//                            event.stopPropagation();
//                        });
                    }

                    var cleanup = function() {
//                        "use strict";
//                        $('body').unbind('click');
                    }



                    "use strict";
                    scope.$watch(tAttrs.cmResource + ".id", function(id, oldId) {
                        if(!id) {
                            scope.$edit();
                        } else {
                            console.log("has an iD");
//                            scope.$cancel();
                        }
                    });




                    scope.$remove = function() {
                        // no id, remove the element

                        if(!angular.isDefined(tAttrs.removeFn)) {
                            var message = "No remove function for cmResource specificed";
                            throw message + "\n";
                        }

                        var removeFn = $parse(tAttrs.removeFn);

                        if (!angular.isFunction(removeFn)) {
                            var message = "The expression on the cmResource directive does not point to a valid remove function.";
                            throw message + "\n";
                        }

                        var resource = scope[tAttrs['cmResource']];
                        if(resource.id) {
                            resource.$remove();
                        }


                        removeFn(scope);
                    }

                    /**
                     * Cancels editing the resource
                     */
                    scope.$cancel = function() {
                        if(angular.isDefined(scope[tAttrs['cmResource']].id)) {
                            scope.$isEditing = false;
                            el.removeClass('is-editing');

                            // remove backup
                            var resource = $parse(tAttrs.cmResource)(scope);
                            angular.copy(backup, resource);
                        } else {
                            scope.$remove();
                        }
                        cleanup();
                    }

                    transcludeFn(scope, function cloneConnectFn(cElement) {
                        el.append(cElement);
                    });

                }
            }
        };
    }]);
