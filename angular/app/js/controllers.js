'use strict';

/* Controllers */
myApp.contollers = angular.module('myApp.controllers', []);
//    ).controller(function ($http, $cookies, PatientModel) {
//
//        console.log("Getting CSRF Token...");
//        $http.post('http://localhost:8888/skelarchv2/drupal/services/session/token', {
//            }).success(function (data) {
//                var token = data;
//
//                console.log("CSRF Token:", token);
//
//                console.log($http.defaults.headers);
//                $http.defaults.headers.common['X-CSRF-Token'] = token;
//
//                console.log("Getting current user...");
//                $http.post('http://localhost:8888/skelarchv2/drupal/api/system/connect.json', {
//                }).success(function (data) {
//
//                        console.log("Current user:",  data);
//                        var sessionName = data.session_name;
//                        var sessionId = data.sessid;
//                        $cookies[sessionName] = sessionId;
//
//                        var patient = new PatientModel({
//                            first_name: "Craig",
//                            last_name: 'McNamara',
//                            dob: '18/11/1987',
//                            gender: 'Male',
//                            ethnicity: 'Caucasian',
//                            clinical_summary: 'Is awesome',
//                            uid: 1,
//                            modified: 1312988453,
//                            created: 1312988453
//                        });
//
//                        patient.$save(function(p) {
//                            console.log("patient is", patient);
//                            console.log("p is", p);
//                        });
//
//
////                        $http.post('http://localhost:8888/skelarchv2/drupal/api/patient', {
////
////                        }).success(function (data) {
////                            console.log(data);
////                        });
//                    });
//
//            });
//
//
//    }).
//    controller('MyCtrl2', ['$http', function ($http) {
//        $http.post('http://localhost:8888/skelarchv2/drupal/api/note', {
//            subject: "second note of mine",
//            uid: 1,
//            note: "NUMBER 2",
//            modified: 1312988453,
//            created: 1312988453
//        }).success(function (data) {
//                console.log(data);
//            });
//    }]).


