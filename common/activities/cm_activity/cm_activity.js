angular.module('directives.activities.cmActivity', ['directives.activities.cmActivity.cmComments'])

// A simple directive to display a gravatar image given an email
    .directive('cmActivity', ['ReplyModel', 'AuthService', function (ReplyModel, AuthService) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'common/activities/cm_activity/cm_activity.tpl.html',
            link: function ($scope, el, tAttrs) {

                $scope.$commentDisplayCount = 3;
                $scope.$commentDisplayDefault = 3;

                $scope.$addReplyToActivity = function(text, activity) {
                    var newReply = new ReplyModel({
                        activity_id: activity.id,
                        text: text,
                        uid: AuthService.getUser().uid,
                        user: AuthService.getUser()
                    });

                    newReply.$save();
                    $scope.newReply = {};

                    if(!angular.isDefined(activity.replies)) {
                        activity.replies = [];
                    }
                    activity.replies.push(newReply);
                }
            }
        };
    }]);