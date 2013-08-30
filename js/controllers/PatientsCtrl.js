myApp.contollers.controller('PatientsCtrl', function ($scope, patients, PatientModel, MembershipModel, ShareModel, Param, auth) {
    $scope.patients = patients;

    // Load the groups the user is in
    $scope.memberships = MembershipModel.query(Param.makeParams({user_id: auth.getUser().uid }), function() {
        angular.forEach($scope.memberships, function(membership, index) {
            membership.shares = ShareModel.query(Param.makeParams({group_id: membership.group_id}), function() {

                // Remove any shares that are owned by the current user
                for(var shareIndex = membership.shares.length - 1; shareIndex >= 0; shareIndex--) {
                    var share = membership.shares[shareIndex];

                    var owned = false;

                    angular.forEach($scope.patients, function(patient, patientIndex) {
                        if(share.patient_id == patient.id) {
                            membership.shares.splice(shareIndex, 1);
                            owned = true;
                        }
                    });

                    if(!owned) {
                        share.patient = PatientModel.get({id: share.patient_id});
                    }

                };
            });

        });
    });


    $scope.deletePatient = function(patient) {
        patient.$delete({id: patient.id});
        var index = $scope.patients.indexOf(patient);
        $scope.patients.splice(index, 1);
    }
});