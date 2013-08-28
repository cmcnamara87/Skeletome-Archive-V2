myApp.contollers.controller('FeedCtrl', function ($scope, ShareModel, PatientModel) {
    $scope.shares = ShareModel.query({}, function() {
        angular.forEach($scope.shares, function(share, shareIndex) {
            // Load the patient
            share.patient = PatientModel.get({id: share.patient_id});
        });
    });
});