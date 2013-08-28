myApp.directives.directive('editBlock', function() {
    return {
        restrict: 'E',
        scope: {
            isEditing: '=editMode',
            model: '='
        },
        template: '<span>\n    <button ng-show="!isEditing" class="btn btn-primary" ng-click="edit()">Edit </button>\n    \n    <span ng-show="isEditing">\n        <button class="btn btn-primary" ng-click="save()">Save </button></h2>\n        <button class="btn btn-primary" ng-click="cancel()">Cancel </button></h2>\n    </span>\n    \n</span>',
        replace: true,
        controller: function ( $scope, auth) {
            var that = this;

            $scope.$watch('model', function(value) {
                if(value) {
                    that.backup = angular.copy($scope.model);
                }
            })

            $scope.edit = function() {
                $scope.isEditing = true;
            }
            $scope.cancel = function() {
                $scope.isEditing = false;
                console.log("editing is", $scope.isEditing);
                $scope.model = that.backup;
            }
            $scope.save = function() {
                console.log($scope.model);
                $scope.model.$update(function() {
                    that.backup = angular.copy($scope.model);
                    $scope.isEditing = false;
                });
            }
        },
        link: function(scope, elem, attrs) {
        }
    };
});