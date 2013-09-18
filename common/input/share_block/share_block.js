angular.module('directives.input.share_block', [])

// A simple directive to display a gravatar image given an email
    .directive('shareBlock', ['GroupModel', 'ShareModel', function (GroupModel, ShareModel) {
        return {
            restrict: 'E',
            require: '^field',
            templateUrl: 'common/input/share_block/share_block.tpl.html',
            scope: {
                value: '='
            },
            controller: ['$scope', function ($scope) {
            }],
            link: function($scope, iElement, iAttrs, FieldCtrl) {

                $('.inputblock-lookup', iElement).keyup(function(e) {
                    if (e.keyCode == 13) {
                        // todo: make this work with moving the selected one up and down
                        $scope.value.group_id = $scope.lookupResults[0].id;
                        $scope.value.group = $scope.lookupResults[0];
                    }
                });

                $scope.$watch(function() {
                    return FieldCtrl.getIsEditing() && FieldCtrl.getIsEditable();
                }, function(isEditing) {
                    $scope.isEditing = isEditing;
                });

                $scope.lookupGroupNameChanged = function(groupName) {
                    console.log("group named changed");
                    GroupModel.index({name: groupName}, function(results) {
                        $scope.lookupResults = results;
                    });
                }
            }
        };
    }]);