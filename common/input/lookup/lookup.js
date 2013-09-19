angular.module('directives.input.lookup', [])

// A simple directive to display a gravatar image given an email
    .directive('lookup', ['$timeout', '$injector', function ($timeout, $injector) {
        return {
            restrict: 'E',
//            require: '^field',
            templateUrl: 'common/input/lookup/lookup.tpl.html',
            scope: {
                model: '@',
                field: '@',
                selected: '='
            },
            controller: ['$scope', function ($scope, $timeout) {
            }],
            link: function($scope, iElement, iAttrs) {
//
//                $scope.$watch(function() {
//                    return FieldCtrl.getIsEditing();
//                }, function(isEditing) {
//                    $scope.isEditing = isEditing;
//                });

                $scope.selectedResult = null;
                $scope.selectedIndex = 0;

                $('input', iElement).keyup(function(e) {
                    if(e.keyCode == "13") {
                        // pressed enter
                        $scope.$apply(function() {
                            $scope.selectedResult = $scope.results[$scope.selectedIndex];

                            if(iAttrs.selected) {
                                $scope.selected = $scope.selectedResult;
                            }
                        })
                    }
                });

                $scope.searchChanged = function(search) {
                    $timeout(function() {
                        if($scope.search == search) {
                            console.log("Lookup: Searching now");
                            // they have stopped typing for 1/4 of a second
                            // so do the search
                            var query = {};
                            query[$scope.field] = search;

                            var ChosenModel = $injector.get($scope.model + "Model");

                            $scope.results = ChosenModel.index(query, function(results) {
                                console.log("Lookup: Results are ", results);
                            });
                        }
                    }, 500);
                }
            }
        };
    }]);