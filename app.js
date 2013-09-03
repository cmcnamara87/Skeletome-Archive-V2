'use strict';


var myApp = angular.module('myApp', [
        'myApp.filters',
        'myApp.services',
        'myApp.directives',
        'myApp.controllers',
        'ngCookies',
        'patients',
        'groups',
        'feed',
        'directives.navigation']).
    config(['$routeProvider', function($routeProvider) {

        /**
         * Not logged in page
         */
//        $routeProvider.when('/home', {
//            templateUrl: 'partials/home/home.html',
//            controller: 'FeedCtrl'
//        });


        /**
         * Not logged in page
         */
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            resolve: {
                currentUser: ['AuthService', '$q', function(AuthService, $q) {
                    var defer = $q.defer();

                    AuthService.requireAuthenticated().then(function(user) {
                        defer.resolve(user);
                    }, function() {
                        defer.resolve(null)
                    });

                    return defer.promise
                }]
            }

        });


        /**
         * User Page
         */
        $routeProvider.when('/user', {
            templateUrl: 'partials/user/user.html',
            controller: 'UserCtrl'
        });

        /**
         * Patient Pages
         */
//        $routeProvider.when('/patients', {
//            templateUrl: 'partials/patient/patients.html',
//            controller: 'PatientsCtrl',
//            resolve: {
//                patients: function($q, $route, PatientModel, auth, Param, $location) {
//                    console.log("resolving patients");
//                    var defer = $q.defer();
//                    auth.checkCurrentUser().then(function() {
//                        console.log("got current user");
//                        var patients = PatientModel.query(Param.makeParams({
//                            'uid': auth.getUser().uid
//                        }), function() {
//                            defer.resolve(patients);
//                        }, function() {
//                            defer.reject();
//                        });
//                    }, function() {
//                        $location.path("/splash");
//                    });
//
//                    return defer.promise;
//                }
//            }
//        });
//
//        $routeProvider.when('/patients/my-patients', {
//            templateUrl: 'partials/patients/my_patients.html',
//            controller: 'PatientsCtrl',
//            resolve: {
//                patients: function($q, $route, PatientModel, auth, Param, $location) {
//                    console.log("resolving patients");
//                    var defer = $q.defer();
//                    auth.checkCurrentUser().then(function() {
//                        console.log("got current user");
//                        var patients = PatientModel.query(Param.makeParams({
//                            'uid': auth.getUser().uid
//                        }), function() {
//                            defer.resolve(patients);
//                        }, function() {
//                            defer.reject();
//                        });
//                    }, function() {
//                        $location.path("/splash");
//                    });
//
//                    return defer.promise;
//                }
//            }
//        });

        $routeProvider.when('/patients/community-patients', {
            templateUrl: 'partials/patients/community_patients.html',
            controller: 'PatientsCtrl',
            resolve: {
                patients: function($q, $route, PatientModel, auth, Param, $location) {
                    console.log("resolving patients");
                    var defer = $q.defer();
                    auth.checkCurrentUser().then(function() {
                        console.log("got current user");
                        var patients = PatientModel.query(Param.makeParams({
                            'uid': auth.getUser().uid
                        }), function() {
                            defer.resolve(patients);
                        }, function() {
                            defer.reject();
                        });
                    }, function() {
                        $location.path("/splash");
                    });

                    return defer.promise;
                }
            }
        });



        $routeProvider.when('/patient', {
            templateUrl: 'partials/patient/new_patient.html',
            controller: 'NewPatientCtrl'
        });
        $routeProvider.when('/patient/:patient_id/case-summary', {
            templateUrl: 'partials/patient/case_summary.html',
            controller: 'PatientCtrl',
            resolve: {
                patient: function($q, $route, PatientModel) {
                    console.log("resolving patient");
                    var defer = $q.defer();

                    var patient = PatientModel.get({
                        'id': $route.current.params.patient_id
                    }, function() {
                        defer.resolve(patient);
                    });
                    return defer.promise;
                },
                user: function(auth) {
                    return auth.checkCurrentUser();
                }
            }
        });
//        $routeProvider.when('/patient/:patient_id/case-details', {
//            templateUrl: 'partials/patient/case_details.html',
//            controller: 'PatientCtrl',
//            resolve: {
//                patient: function($q, $route, PatientModel) {
//                    console.log("resolving patient");
//                    var defer = $q.defer();
//
//                    var patient = PatientModel.get({
//                        'id': $route.current.params.patient_id
//                    }, function() {
//                        defer.resolve(patient);
//                    });
//                    return defer.promise;
//                },
//                user: function(auth) {
//                    return auth.checkCurrentUser();
//                }
//            }
//        });

//        $routeProvider.when('/patient/:patient_id/patient-details', {
//            templateUrl: 'partials/patient/patient_details.html',
//            controller: 'PatientCtrl',
//            resolve: {
//                patient: function($q, $route, PatientModel) {
//                    console.log("resolving patient");
//                    var defer = $q.defer();
//
//                    var patient = PatientModel.get({
//                        'id': $route.current.params.patient_id
//                    }, function() {
//                        defer.resolve(patient);
//                    });
//                    return defer.promise;
//                }
//            }
//        });
//        $routeProvider.when('/patient/:patient_id/community', {
//            templateUrl: 'partials/patient/community.html',
//            controller: 'PatientCtrl',
//            resolve: {
//                patient: function($q, $route, PatientModel) {
//                    console.log("resolving patient");
//                    var defer = $q.defer();
//
//                    var patient = PatientModel.get({
//                        'id': $route.current.params.patient_id
//                    }, function() {
//                        defer.resolve(patient);
//                    });
//                    return defer.promise;
//                }
//            }
//        });
//
//
//        $routeProvider.when('/patient/:patient_id', {
//            templateUrl: 'partials/patient/patient.html',
//            controller: 'PatientCtrl',
//            resolve: {
//                patient: function($q, $route, PatientModel) {
//                    console.log("resolving patient");
//                    var defer = $q.defer();
//
//                    var patient = PatientModel.get({
//                        'id': $route.current.params.patient_id
//                    }, function() {
//                        console.log("got the model");
//                        defer.resolve(patient);
//                    });
//                    return defer.promise;
//                }
//            }
//        });
//
//
//
//        $routeProvider.when('/patient/:patient_id/share', {
//            templateUrl: 'partials/patient/share.html',
//            controller: 'ShareCtrl',
//            resolve: {
//                patient: function($q, $route, PatientModel) {
//                    var defer = $q.defer();
//
//                    var patient = PatientModel.get({
//                        'id': $route.current.params.patient_id
//                    }, function() {
//                        defer.resolve(patient);
//                    }, function() {
//                        defer.reject();
//                    });
//
//                    return defer.promise;
//                }
//            }
//        });

        /**
         * Group Pages
         */
        $routeProvider.when('/groups', {
            templateUrl: 'partials/group/groups.html',
            controller: 'GroupsCtrl',
            resolve: {
                memberships: function($q, MembershipModel, Param, auth) {
                    var defer = $q.defer();
//
                    var memberships = MembershipModel.query(Param.makeParams({user_id: auth.getUser().uid }), function(data) {
                        console.log("user is", auth.getUser().uid);
                        console.log("memberships", memberships);
                        defer.resolve(memberships);
                    }, function(data) {
                        defer.reject();
                    });
                    return defer.promise;
                }
            }
        });
//        $routeProvider.when('/groups/my-groups', {
//            templateUrl: 'partials/group/my_groups.html',
//            controller: 'GroupsCtrl',
//            resolve: {
//                memberships: function($q, MembershipModel, Param, auth) {
//                    var defer = $q.defer();
////
//                    var memberships = MembershipModel.query(Param.makeParams({user_id: auth.getUser().uid }), function(data) {
//                        console.log("user is", auth.getUser().uid);
//                        console.log("memberships", memberships);
//                        defer.resolve(memberships);
//                    }, function(data) {
//                        defer.reject();
//                    });
//                    return defer.promise;
//                }
//            }
//        });
//        $routeProvider.when('/groups/all-groups', {
//            templateUrl: 'partials/group/all_groups.html',
//            controller: 'GroupsCtrl',
//            resolve: {
//                memberships: function($q, MembershipModel, Param, auth) {
//                    var defer = $q.defer();
////
//                    var memberships = MembershipModel.query(Param.makeParams({user_id: auth.getUser().uid }), function(data) {
//                        console.log("user is", auth.getUser().uid);
//                        console.log("memberships", memberships);
//                        defer.resolve(memberships);
//                    }, function(data) {
//                        defer.reject();
//                    });
//                    return defer.promise;
//                }
//            }
//        });

        $routeProvider.when('/group/:group_id', {
            templateUrl: 'partials/group/group.html',
            controller: 'GroupCtrl',
            resolve: {
                currentGroup: function($q, $route, GroupModel) {
                    var defer = $q.defer();

                    var group = GroupModel.get({
                        'id': $route.current.params.group_id
                    }, function() {
                        defer.resolve(group);
                    });

                    return defer.promise;
                }
            }
        });
        $routeProvider.when('/group', {
            templateUrl: 'partials/group/new_group.html',
            controller: 'NewGroupCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/login'
        });
    }]);

myApp.run(function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
    });
});
myApp.run(function($rootScope, $location, $anchorScroll, $routeParams) {
    //when the route is changed scroll to the proper element.
    $rootScope.$on('$viewContentLoaded', function(newRoute, oldRoute) {
        console.log("ROUTE CHANGED! SCROLL TO" + $location.hash());
//        $location.hash($routeParams.scrollTo);

            $anchorScroll();


    });
});



// Declare app level module which depends on filters, and services


