myApp.contollers.controller('ShareCtrl', function ($scope, patient, UserModel, GroupModel, ShareModel, $location) {
    $scope.patient = patient;
    $scope.users = UserModel.query();
    $scope.groups = GroupModel.query();

    $scope.addShare = function(group) {
        var share = new ShareModel({
            patient_id: patient.id,
            group_id: group.id
        });
        share.$save(function() {
            $location.path("/patient/" + patient.id);
        });
    }
});
