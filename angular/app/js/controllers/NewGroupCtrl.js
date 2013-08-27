myApp.contollers.controller('NewGroupCtrl', function ($scope, $location, GroupModel) {
    $scope.groups = {};

    $scope.createGroup = function(group) {

        var group = new GroupModel(group);
        group.$save(function() {
            $location.path("/group/" + group.id);
        });
    }
});