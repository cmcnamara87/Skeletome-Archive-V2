angular.module('directives.navigation.breadcrumbbar', [])

// A simple directive to display a gravatar image given an email
    .directive('breadcrumbbar', ['$location', 'PatientModel', 'SessionService', function ($location, PatientModel, SessionService) {
        return {
            restrict: 'E',
            template: '<div class="breadcrumbbar">&nbsp; <span ng-bind-html-unsafe="breadcrumbs"></span></div>',
            replace: true,
            link: function ($scope, element, attrs) {

                $scope.breadcrumbs = "";

                $scope.$watch(function() {
                    return $location.path();
                }, function() {

                    var parts = $location.path().split("/");
                    var parts = parts.slice(1);

                    if(parts[0] == "patients") {
                        $scope.breadcrumbs = "My Patients";
                    } else if(parts[0] == "patient") {
                        if(parts[2] == "share") {
                            var myPatient = PatientModel.get({id: parts[1]}, function(patient) {
                                if(SessionService.currentUser && patient.uid == SessionService.currentUser.uid) {
                                    var root = "<a href='#/patients/my-patients'>My Patients<a/>";
                                } else {
                                    var root = "<a href='#/patients/my-patients'>My Groups<a/>";
                                }

                                $scope.breadcrumbs = root + " > <a href='#/patient/" + patient.id + "/summary-dashboard'> Patient #" + patient.id  + "</a> > <a href='#/patient/" + patient.id + "/community'>Community<a/>";
                            });
                        } else {
                            var myPatient = PatientModel.get({id: parts[1]}, function(patient) {
                                if(SessionService.currentUser && patient.uid == SessionService.currentUser.uid) {
                                    var root = "<a href='#/patients/my-patients'>My Patients<a/>";
                                } else {
                                    var root = "<a href='#/patients/my-patients'>My Groups<a/>";
                                }

                                if(patient.first_name) {
                                    $scope.breadcrumbs = root + " > <a href='#/patient/" + patient.id + "/summary-dashboard'> Patient #" + patient.id + "</a>";
                                } else {
                                    $scope.breadcrumbs = root + " > <a href='#/patient/" + patient.id + "/summary-dashboard'>Patient " + patient.id + "</a>";
                                }


                            });
                        }
                    }

                });

            }
        };
    }])