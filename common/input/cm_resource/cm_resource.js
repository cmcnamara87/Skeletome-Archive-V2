angular.module('directives.input.cmResource', [])

    .directive('cmResource', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: true,
//            template: "<div ng-transclude></div>",
            compile: function(tElement, tAttrs, transcludeFn) {

                return function (scope, el, tAttrs) {

                    el.addClass('resource');

                    /**
                     * Stores if we are editing the resource
                     * @type {boolean}
                     */
                    scope.$isEditing = false;

                    /**
                     * Puts the resource in 'edit mode'
                     */
                    scope.$edit = function() {
                        scope.$isEditing = true;
                        el.addClass('is-editing');
                    }

                    /**
                     * Saves the resource
                     *
                     * Performs a save or an update depending on if the
                     * resource has an 'id' or not
                     */
                    scope.$save = function() {
                        scope.$isEditing = false;
                        el.removeClass('is-editing');

                        var resource = scope[tAttrs.cmResource];
                        if(angular.isDefined(resource.id)) {
                            resource.$update();
                        } else {
                            resource.$save();
                        }
                    }

                    scope.$watch(tAttrs.cmResource + ".id", function(id) {
                        if(!id) {
                            console.log("no id, editing is true");
                            scope.$edit();
                        }
                    })

                    scope.$remove = function() {
                        // no id, remove the element
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
                        } else {
                            scope.$remove();
                        }
                    }

                    transcludeFn(scope, function cloneConnectFn(cElement) {
                        el.append(cElement);
                    });

                }
            }
        };
    }]);
