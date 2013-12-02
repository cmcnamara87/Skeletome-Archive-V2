angular.module('directives.activities.cmActivity.cmActivityPatient', [])

// A simple directive to display a gravatar image given an email
    .directive('cmActivityPatient', ['XRayModel', 'GeneMutationModel', 'HPOTagModel', 'createModal',
        function (XRayModel, GeneMutationModel, HPOTagModel, createModal) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'common/activities/cm_activity/cm_activity_patient/cm_activity_patient.tpl.html',
            link: function ($scope, el, tAttrs) {

                $scope.patientInfo = "clinicalSummary";


                $scope.showXray = function(xray) {
                    "use strict";
                    var newScope = $scope.$new();
                    newScope.xray = xray;
                    newScope.hpoTags = HPOTagModel.index({
                        object_id: xray.id,
                        object_type: "xray"
                    });
                    createModal({url: 'app/patients/patient/xrays/modal_xray.tpl.html', scope: newScope, type: 'gallery'}).then(function(modal) {
                        // Modal is open now
                        modal.show();
                    })
                }

                $scope.$watch('patientInfo', function(patientInfo) {
                    "use strict";
                    console.log("patient info changed", patientInfo);
                    if(patientInfo == "xRays") {
                        if(!angular.isDefined($scope.activity.patient.xrays)) {
                            XRayModel.index({
                                patient_id: $scope.activity.patient.id
                            }, function(xrays) {
                                $scope.activity.patient.xrays = xrays;
                            })
                        }
                    } else if (patientInfo == "geneticReport") {
                        if(!angular.isDefined($scope.activity.patient.genetic_reports)) {
                            GeneMutationModel.index({
                                patient_id: $scope.activity.patient.id
                            }, function(geneMutations) {
                                $scope.activity.patient.genetic_reports = geneMutations;
                            });
                        }
                    }
                })
            }
        };
    }]);