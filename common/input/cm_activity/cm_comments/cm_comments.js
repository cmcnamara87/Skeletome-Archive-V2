angular.module('directives.input.cmActivity.cmComments', [])

// A simple directive to display a gravatar image given an email
    .directive('cmComments', ['ReplyModel', 'SessionService', function (ReplyModel, SessionService) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'common/input/cm_activity/cm_comments/cm_comments.tpl.html',
            link: function ($scope, el, tAttrs) {

                $scope.COMMENT_DISPLAY_DEFAULT = 3;

                $scope.commentDisplayCount = $scope.COMMENT_DISPLAY_DEFAULT;

                $scope.newComment = new ReplyModel({
                    activity_id: $scope.activity.id,
                    uid: SessionService.currentUser.uid,
                    user: SessionService.currentUser
                });

                $scope.showMore = function() {
                    $scope.commentDisplayCount = $scope.activity.replies.length;
                }
                $scope.showLess = function() {
                    $scope.commentDisplayCount = $scope.COMMENT_DISPLAY_DEFAULT;
                }

                $('input', el).keyup(function(event) {
                    if(event.which == "13") {

                        $scope.$apply(function() {
                            $scope.newComment.$save();
                            if(!angular.isDefined($scope.activity.replies)) {
                                $scope.activity.replies = [];
                            }
                            $scope.activity.replies.push($scope.newComment);

                            // Reset comment
                            $scope.newComment = new ReplyModel({
                                activity_id: $scope.activity.id,
                                uid: SessionService.currentUser.uid,
                                user: SessionService.currentUser
                            });

                        })




                    }
                })
            }
        };
    }]);