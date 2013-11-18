angular.module('directives.navigation.menubar', [])

// A simple directive to display a gravatar image given an email
    .directive('menubar', ['$location', '$window', 'PatientModel', 'GroupModel', function ($location, $window, PatientModel, GroupModel) {

        return {
            restrict: 'E',
            templateUrl: 'common/navigation/menubar/menubar.tpl.html',
            link: function ($scope, element, attrs) {

                var oldParts = null;

                $scope.findPatient = function(query) {
                    "use strict";
                    return PatientModel.query({
                        query: query
                    }).$promise;
                }
                $scope.patientFound = function(patient) {
                    "use strict";
                    var myPatient = patient;
                    $scope.search = null;
                    $location.path("/patient/" + myPatient.id + "/summary");

                }

                $scope.$on('$routeChangeSuccess', function(event, current, previous) {
                    // route changed
                    var parts = $location.path().split("/");



                    if(!oldParts || parts[0] != oldParts[0] || parts[1] != oldParts[1]) {
                        $scope.tab = parts[1];

                        if($scope.tab == "patient" || $scope.tab == "group") {
                            // its a patient, show the dark menu

                            $scope.id = parts[2];

                            if($scope.tab == "patient") {
                                // load the patient
                                $scope.content = true;
                                $scope.patient = PatientModel.get({id: $scope.id}, function() {

                                });
                            } else {
                                $scope.content = true;
                                $scope.group = GroupModel.get({id: $scope.id}, function() {
                                });
                            }
                        } else {
                            $scope.content = false;
                        }
                    }
//
//                    if(parts[0] == "feed") {
//                        $rootScope.isFeed = true;
//                    } else {
//                        $rootScope.isFeed = false;
//                    }


                    oldParts = parts;
                });

                /**
                 * Goes back to previous page
                 */
                $scope.back = function() {
                    console.log("going back");
                    if($scope.tab == "patient") {
                        console.log("going back");
                        $location.path('/patients/my-patients')
                    } else {
                        $location.path('/groups/my-groups')
                    }
                }
            }
        };
    }]);
//
//angular.module('directives.navigation.menubar', [])
//
//// A simple directive to display a gravatar image given an email
//    .directive('menubar', ['$location', 'MembershipModel', 'SessionService', 'PatientModel', 'ShareModel', 'GroupModel', function ($location, MembershipModel, SessionService, PatientModel, ShareModel, GroupModel) {
//
//        return {
//            restrict: 'E',
//            templateUrl: 'common/navigation/menubar/menubar.tpl.html',
//            controller: function($scope) {
//            },
//            link: function ($scope, element, attrs) {
//
//                $scope.$watch(function() {
//                    return $location.path();
//                }, function(newValue, oldValue) {
//                    // Need to determine the type of sidebar to show
//
//                    // two types, top level pages, non top level pages
//                    var parts = $location.path().split("/");
//                    parts = parts.slice(1);
//
//                    $scope.menubarType = null;
//
//                    console.log("menu bar types", parts);
//
//                    if(parts[0] == "groups" || parts[0] == "patients" || parts[0] == "user" || parts[0] == "feed") {
//                        // top level pages
//                        $scope.menubarType = parts[0];
//                        $scope.menubarObjectId = parts[1];
//                    } else {
//                        // non-top level pages, we go from the end to work out how to do it
//
//                        $scope.menubarType = parts[0];
//                        $scope.menubarObjectId = parts[1];
//                        $scope.menubarSelectedItem = parts[2];
//
//                        // get out the selected item id if its there
//                        if(parts.length == 4) {
//                            $scope.menubarSelectedId = parts[3];
//                        }
//
//                    }
//                });
//
//
//                $scope.$watch('menubarType', function(menubarType) {
//
//                    if(menubarType == "group") {
//                        $scope.group = GroupModel.get({id: $scope.menubarObjectId});
//                    }
//                    if(menubarType == "patient") {
//                        $scope.patient = PatientModel.get({id: $scope.menubarObjectId});
//                        $scope.shares = ShareModel.index({patient_id: $scope.menubarObjectId});
//
//                    }
//                    if (menubarType == "share") {
//                        $scope.share = ShareModel.get({id: $scope.menubarObjectId});
//
//                    }
//                    if (menubarType == "patients") {
//                        $scope.memberships = MembershipModel.index({user_id: SessionService.currentUser.uid});
//                    }
//                });
//            }
//        };
//    }]);