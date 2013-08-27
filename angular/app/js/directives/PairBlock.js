myApp.directives.directive('pairBlock', function() {
    return {
        restrict: 'E',
        scope: {
            list: '=',
            model: '=',
            key: '=',
            value: '='
        },
        template: '<div>\n    <span ng-dblclick="edit()" ng-show="!isEditing">\n        <b>{{ key }}</b> {{ value }}\n    </span>\n\n    <span ng-show="isEditing">\n        <input type="text" ng-model="key"/>\n        <input type="text" ng-model="value"/>\n    </span>\n\n    <!-- Editing controls -->\n    <span>\n        <span ng-show="!isEditing">\n            <button ng-click="edit()">Edit</button>\n            <button ng-click="delete()">Delete</button>\n        </span>\n        \n        <span ng-show="isEditing">\n            <button ng-click="save()" >Save</button>\n            <button ng-click="cancel()">Cancel</button>    \n        </span>\n    </span>\n    \n\n</div>',
        replace: true,
        controller: function ( $scope, auth) {
            var that = this;

            $scope.edit = function() {
                that.backup = angular.copy($scope.model);
                $scope.isEditing = true;
            }
            $scope.delete = function() {
                var index = $scope.list.indexOf($scope.model);
                $scope.list.splice(index, 1);

                $scope.model.$delete(function() {
                    console.log("model deleted");
                });
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