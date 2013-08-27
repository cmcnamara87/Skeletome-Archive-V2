myApp.contollers.controller('GroupsCtrl', function ($scope, memberships, GroupModel, MembershipModel, auth) {

    $scope.memberships = memberships;

    $scope.groups = GroupModel.query();

    $scope.joinGroup = function(group) {
        var membership = new MembershipModel({
            user_id: auth.getUser().uid,
            group_id: group.id
        });

        membership.$save(function(response) {
            $scope.memberships.push(membership);
        });
    }

    $scope.leaveGroup = function(membership) {

        membership.$delete();

        var index = $scope.memberships.indexOf(membership);
        $scope.memberships.splice(index, 1);
    }

});