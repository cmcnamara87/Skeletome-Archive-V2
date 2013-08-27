myApp.directives.directive('textBlock', function() {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            value: '='
        },
        template: '<div>\n    \n    <span ng-dblclick="edit()" ng-show="!isEditing">{{ value }}</span>\n\n    <span ng-show="isEditing">\n        <textarea rows="20" class="form-control" ng-model="value"></textarea>\n    </span>\n\n    <!-- Editing controls -->\n    <span>\n        <span ng-show="!isEditing">\n            <button ng-click="edit()"><i class="icon icon-pencil"></i></button>\n        </span>\n        \n        <span ng-show="isEditing">\n            <button ng-click="save()" ><i class="icon icon-save"></i></button>\n            <button ng-click="cancel()"><i class="icon icon-remove"></i></button>    \n        </span>\n    </span>\n    \n</div>',
        replace: true,
        controller: function ( $scope, auth) {
            var that = this;

            $scope.edit = function() {
                that.backup = angular.copy($scope.model);
                $scope.isEditing = true;
            }
            $scope.cancel = function() {
                $scope.model = that.backup;
                $scope.isEditing = false;
            }
            $scope.save = function() {
                $scope.isEditing = false;
                $scope.model.$update(function() {
                   console.log("model updated");
                });
            }
        },
        link: function(scope, elem, attrs) {
        }
    };
});