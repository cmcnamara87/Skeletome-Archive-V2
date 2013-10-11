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
                    }

                    /**
                     * Saves the resource
                     *
                     * Performs a save or an update depending on if the
                     * resource has an 'id' or not
                     */
                    scope.$save = function() {
                        scope.$isEditing = false;
                        var resource = scope[tAttrs.cmResource];
                        if(angular.isDefined(resource.id)) {
                            resource.$update();
                        } else {
                            resource.$save();
                        }
                    }

                    scope.$watch(tAttrs.cmResource + ".id", function(id) {
                        if(!id) {
                            scope.$isEditing = true;
                        }
                    })

                    /**
                     * Cancels editing the resource
                     */
                    scope.$cancel = function() {
                        scope.$isEditing = false;
                    }

                    transcludeFn(scope, function cloneConnectFn(cElement) {
                        el.append(cElement);
                    });

                }
            }
        };
    }]);
