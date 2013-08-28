myApp.contollers.controller('GroupCtrl', function ($scope, currentGroup, UserModel, MembershipModel, Param) {
    $scope.group = currentGroup;

    var param = {};
    param['group_id'] = currentGroup.id;

    var string = "";

    $scope.members = MembershipModel.query(Param.makeParams({ group_id: currentGroup.id }));

    $scope.users = UserModel.query();


    $scope.addMembership = function(user) {
        var membership = new MembershipModel({
            user_id: user.uid,
            group_id: currentGroup.id
        });
        membership.$save(function(response) {
            $scope.members.push(membership);
        });
    }
});