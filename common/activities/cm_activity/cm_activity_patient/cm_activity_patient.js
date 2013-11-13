angular.module('directives.activities.cmActivity.cmActivityPatient', [])

// A simple directive to display a gravatar image given an email
    .directive('cmActivityPatient', ['XRayModel', 'GeneMutationModel', function (XRayModel, GeneMutationModel) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'common/activities/cm_activity/cm_activity_patient/cm_activity_patient.tpl.html',
            link: function ($scope, el, tAttrs) {


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