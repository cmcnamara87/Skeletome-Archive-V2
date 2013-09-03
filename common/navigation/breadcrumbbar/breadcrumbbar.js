angular.module('directives.navigation.breadcrumbbar', [])

// A simple directive to display a gravatar image given an email
    .directive('breadcrumbbar', ['$location', 'PatientModel', function ($location, PatientModel) {
        return {
            restrict: 'E',
            template: '<div class="breadcrumbbar"><span ng-bind-html-unsafe="breadcrumbs"></span></div>',
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
                                $scope.breadcrumbs = "<a href='#/patients/my-patients'>My Patients<a/> > <a href='#/patient/" + patient.id + "/summary-dashboard'>" + patient.first_name + " " + patient.last_name + "</a> > <a href='#/patient/" + patient.id + "/community'>Community<a/>";
                            });
                        } else {
                            var myPatient = PatientModel.get({id: parts[1]}, function(patient) {
                                $scope.breadcrumbs = "<a href='#/patients/my-patients'>My Patients<a/> > <a href='#/patient/" + patient.id + "/summary-dashboard'>" + patient.first_name + " " + patient.last_name + "</a>";
                            });
                        }
                    }

                });

            }
        };
    }])