angular.module('directives.activities', ['directives.activities.cmActivity'])

// A simple directive to display a gravatar image given an email
    .directive('activities', ['$location', '$rootScope', 'ShareModel', 'ActivityModel', function ($location, $rootScope, ShareModel, ActivityModel) {

        return {
            restrict: 'E',
            templateUrl: 'common/activities/activities.tpl.html',
            link: function ($scope, element, attrs) {

                $scope.share = null;
                $scope.activities = null;
                $scope.location = $location;

                var oldParts = null;

                $scope.$on('$routeChangeSuccess', function(event, current, previous) {
                    // route changed
                    var parts = $location.path().split("/");

                    if(!oldParts || parts[0] != oldParts[0] || parts[1] != oldParts[1]) {
                        console.log("ROUTE DCHANGE SUCCESS");

                        var parts = $location.path().split("/");

                        console.log("Activity Aside: Fetching new Activity List");

                        $scope.type = parts[1];

                        if($scope.type == "patient" || $scope.type == "group") {
                            $rootScope.showActivities = true;
                            $scope.id = parts[2];
                            // we need to laod in activity
                            if($scope.type == "patient") {
                                // load in for all shares
                                ShareModel.index({
                                    patient_id: $scope.id
                                }, function(shares) {
                                    $scope.shares = shares;
                                    $scope.share = $scope.shares[0];
                                });
                            } else if($scope.type == "group") {
                                // load in the shares for a particular group
                            }
                        } else {
                            $rootScope.showActivities = false;
                        }
                    }

                    oldParts = parts;
                });



                $scope.$watch('share', function(share) {
                    // selected share changed
                    // lets get the activities
                    if(share) {
                        $scope.activities = null;
                        ActivityModel.index({
                            share_id: share.id
                        }, function(activities) {
                            $scope.activities = activities;
                        })
                    }
                })

            }
        };
    }])
    .directive('activityAdder', [function () {

        return {
            restrict: 'E',
            templateUrl: 'common/activities/adder.tpl.html',
            controller: ['$scope', '$q', '$routeParams', 'SessionService', 'GroupModel', 'ActivityModel', 'PostModel', 'ShareModel', function($scope, $q, $routeParams, SessionService, GroupModel, ActivityModel, PostModel, ShareModel) {
                $scope.newPost = new PostModel({});


                console.log("ropute params", $routeParams);
                $scope.$watch(function() {
                    return $routeParams.patient_id
                }, function(patient_id) {
                    console.log("patient id changed");
                    if(patient_id) {
                        $scope.allShares = ShareModel.index({
                            patient_id: $routeParams.patient_id
                        });
                    }
                })


                $scope.findPubMed = function(value) {

                }

                $scope.addPost = function(newPost) {

                    var shares = angular.copy(newPost.shares);

                    angular.forEach(shares, function(share, shareIndex) {
                        var newSharePost = angular.copy(newPost);
                        newSharePost.share_id = share.id;

                        // Create a temp activity
                        // and add it to the ui straight away
                        // this will make things look nice and faster
                        var tempActivity = new ActivityModel({
                            type: "post",
                            post: newSharePost,
                            share_id: share.id,
                            user: SessionService.currentUser
                        });


                        // If we are displaying activities for a group,
                        // only add the activity if...the group matches..
                        // e.g. if we are showing 'austgralian group 2'
                        // only add this activity if it is addressed to 'australian group 2'
                        if($scope.share.id == share.id) {
                            $scope.activities.unshift(tempActivity);
                        }

                        // Save the post
                        newSharePost.$save(function(post) {
                            // got back the saved post
                            // insert that into the temp activity cause there is going to be
                            // another delay, as we get the new actual activity
                            tempActivity.post = post;

                            // Now get the real activity using that posts id
                            // And merge that with our 'temp activity'
                            ActivityModel.index({
                                object_id: post.id,
                                type: 'post'
                            }, function(activities) {
                                var savedActivity = activities[0];
                                angular.copy(savedActivity, tempActivity);
                            });
                        });
                    });

                    $scope.newPost = new PostModel({
//                        shares: shares
                    });
                }


                $scope.findGroups = function(name) {
                    var defer = $q.defer();


                    // We have cached this data when the page loaded,
                    // so lets go through and find shares that match (no ajax needed)
                    var shareData = [];
                    angular.forEach($scope.allShares, function(share, shareIndex) {
                        if(share.group.name.toLowerCase().indexOf(name.toLowerCase()) != -1) {
                            shareData.push({id: share.id, name: share.group.name});
                        }
                    });

                    defer.resolve(shareData);

                    return defer.promise;
                }
            }],
            link: function ($scope, element, attrs) {
                $scope.adding = 'post';

            }
        };
    }])