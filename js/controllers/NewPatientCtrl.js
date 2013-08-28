myApp.contollers.controller('NewPatientCtrl', function ($scope, $location, PatientModel) {
    $scope.patient = {};

    $scope.createPatient = function(patient) {

        var patient = new PatientModel(patient);
        patient.$save(function() {
            $location.path("/patient/" + patient.id);
        });
    }

});
