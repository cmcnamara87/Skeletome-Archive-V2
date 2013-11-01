angular.module('directives.input.typeahead', [])

// A simple directive to display a gravatar image given an email
    .directive('typeahead', ['$timeout', 'GroupModel', function ($timeout, GroupModel) {
        return {
            restrict: 'E',
            templateUrl: 'common/input/typeahead/typeahead.tpl.html',
            scope: {
                multi: '@',
                /**
                 * The option function is given the text in the input
                 * Look like like  options-fn="findGroup(value)" --> NOTE! It must be 'value' as the name of the input
                 * Return: A promise that resolves to a list  of options to choose from for the input
                 */
                optionsFn: '&',

                /**
                 * Called when a new token is added
                 */
                tokenChosenFn: '&',
                tokens: '=model',
                placeholder: '@'
            },
            link: function($scope, iElement, iAttrs, FieldCtrl) {
                $scope.selectedIndex = 3;


                /**
                 * Remove a token
                 * @param token     The token to remove
                 */
                $scope.removeToken = function(token) {
                    if($scope.multi == "true") {
                        $scope.tokens.splice($scope.tokens.indexOf(token), 1);
                    } else {
                        $scope.tokens = null;
                    }
                }

                /**
                 * Adds a option to the list of tokens
                 * @param option
                 */
                $scope.addToken = function(option) {

                    if($scope.multi == "true") {
                        var found = false;
                        angular.forEach($scope.tokens, function(token) {
                            if(angular.isDefined(token.id)) {
                                if(token.id == option.id) {
                                    found = true;
                                }
                            } else if(angular.isDefined(token.uid)) {
                                if(token.uid == option.uid) {
                                    found = true;
                                }
                            }

                        });
                        if(!found) {
                            if(!$scope.tokens) {
                                console.log("Typeahead: Setting token list []");
                                $scope.tokens = [];
                            }
                            console.log("Typeahead: Adding token", option);
                            $scope.tokens.push(option);
                        } else {

                        }
                    } else {
                        $scope.tokens = option;
                    }

                    /**
                     * Call the function for when a token is chosen
                     */
                    if(iAttrs.tokenChosenFn) {
                        $scope.tokenChosenFn({
                            'token': option
                        });
                    }

                    $scope.input = "";
                    $scope.options = [];

                    console.log("tokens is", $scope.tokens);
                }

                /**
                 * Listen for enter key pressed in input
                 */
                $('input', iElement).keydown(function(e) {
                    if(e.keyCode == 27) {
                        if($scope.options && $scope.options.length) {
                            $scope.$apply(function() {
                                $scope.options = [];
                            });
                            e.preventDefault();
                            return false;
                        }
                    }

                    if($scope.options && $scope.options.length) {

                        if(e.keyCode == 13 || e.keyCode == 9) {

                            $scope.$apply(function() {
                                var selectedOption = $scope.options[$scope.selectedIndex];

                                $scope.addToken(selectedOption);
                            })
                            return false;
                        }
                        if(e.keyCode == 38) {
                            $scope.$apply(function() {
                                $scope.selectedIndex = Math.max(0, $scope.selectedIndex - 1);
                            });
                            return false;
                        }
                        if(e.keyCode == 40) {
                            $scope.$apply(function() {
                                $scope.selectedIndex = Math.min($scope.options.length - 1, $scope.selectedIndex + 1);
                            });
                            return false;
                        }
                    }
                });

                /**
                 * Typed something in the search box
                 * @param value
                 */
                $scope.inputChanged = function(value) {
                    console.log("Input changed");
                    if(!value.length) {
                        $scope.options = [];
                    } else {
                        $timeout(function() {
                            if(value == $scope.input) {
                                $scope.selectedIndex = 0;

                                if(value == "") {
                                    $scope.options = "";
                                } else {

                                    if(!angular.isDefined(iAttrs.optionsFn)) {
                                        var message = "No options function (options-fn) for typeahead specificed";
                                        throw message + "\n";
                                    }

                                    // The input value hasn't changed in 500ms (so the user
                                    // has probably stopped typing), so we can do a request.
                                    // This is just for rate limiting
                                    $scope.optionsFn({
                                        'value': value
                                    }).then(function(options) {
                                        if($scope.input != "") {
                                            $scope.options = options;
                                        }
                                    });
                                }
                            }
                        }, 200);
                    }

                }
            }
        };
    }]);