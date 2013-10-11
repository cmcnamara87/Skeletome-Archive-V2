angular.module('directives.input.cmStory', [])

// A simple directive to display a gravatar image given an email
    .directive('cmStory', ['ReplyModel', function (ReplyModel) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, el, tAttrs) {

                $scope.$addReplyToPost = function(text, post) {
                    var newReply = new ReplyModel({
                        post_id: post.id,
                        text: text
                    });
                    newReply.$save();
                    if(!angular.isDefined(post.replies)) {
                        post.replies = [];
                    }
                    post.replies.unshift(newReply);
                }
            }
        };
    }]);