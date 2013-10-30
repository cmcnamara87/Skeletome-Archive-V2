angular.module('directives.activities', [])

// A simple directive to display a gravatar image given an email
    .directive('activities', ['$location', '$rootScope', 'ShareModel', 'ActivityModel', function ($location, $rootScope, ShareModel, ActivityModel) {

        return {
            restrict: 'E',
            templateUrl: 'common/activities/activities.tpl.html',
            link: function ($scope, element, attrs) {

                $scope.share = null;
                $scope.activities = null;
                $scope.location = $location;

                $scope.$watch(function() {
                    var parts = $location.path().split("/");
                    return parts[1] + parts[2];
                }, function(newValue) {

                    console.log("Activity Aside: Fetching new Activity List");

                    var parts = $location.path().split('/');
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
            link: function ($scope, element, attrs) {
                $scope.adding = 'post';

            }
        };
    }])