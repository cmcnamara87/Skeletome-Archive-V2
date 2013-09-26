angular.module('directives.input.typeahead', [])

// A simple directive to display a gravatar image given an email
    .directive('typeahead', ['$timeout', 'GroupModel', function ($timeout, GroupModel) {
        return {
            restrict: 'E',
            templateUrl: 'common/input/typeahead/typeahead.tpl.html',
            scope: {
                multi: '@',
                bleh: '@'
            },
            link: function($scope, iElement, iAttrs, FieldCtrl) {
                $scope.selectedIndex = 0;
                $scope.selectedOptions = [];


                /**
                 * Listen for enter key pressed in input
                 */
                $('#input').keydown(function(e) {
                    if($scope.options && $scope.options.length) {
                        if(e.keyCode == 13 || e.keyCode == 9) {
                            $scope.$apply(function() {
                                var selectedOption = $scope.options[$scope.selectedIndex];
                                $scope.selectedOptions.push(selectedOption);

                                $scope.input = "";
                                $scope.options = [];
                            })
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

                                // The input value hasn't changed in 500ms (so the user
                                // has probably stopped typing), so we can do a request.
                                // This is just for rate limiting
                                GroupModel.index({name: value}, function(options) {
                                    if($scope.input.length) {
                                        $scope.options = options;
                                    }
                                });
                            }
                        }, 250);
                    }

                }
            }
        };
    }]);