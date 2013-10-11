angular.module('patient.share.discussion', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/share/:share_id/discussion', {
            templateUrl:'app/patients/patient/share/discussion/discussion.tpl.html',
            controller:'DiscussionCtrl',
            resolve:{
                posts: ['PostModel', 'ReplyModel', '$route', '$q', function (PostModel, ReplyModel, $route, $q) {
                    var defer = $q.defer();
                    var posts = PostModel.index({
                        share_id: $route.current.params.share_id
                    }, function() {
                        defer.resolve(posts);
                    });

                    return defer.promise;
                }],
                diagnoses: ['DiagnosisModel', '$route', '$q', function (DiagnosisModel, $route, $q) {
                    var defer = $q.defer();
                    var diagnoses = DiagnosisModel.index({
                        'share_id': $route.current.params.share_id
                    }, function() {
                        defer.resolve(diagnoses);
                    });

                    return defer.promise;
                }],


                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('DiscussionCtrl', ['$scope', '$location','$routeParams', 'PostModel', 'ReplyModel', 'posts', 'diagnoses', function ($scope, $location, $routeParams, PostModel, ReplyModel, posts, diagnoses) {
        $scope.posts = posts;
        $scope.diagnoses = diagnoses;

//        angular.forEach($scope.posts, function(post, postIndex) {
//            var reply = new ReplyModel({
//                post_id: post.id,
//                text: "I Agree with this post"
//            });
//            reply.$save();
//        })

//        var newPost = new PostModel({
//            share_id: $routeParams.share_id,
//            text: "One miore post",
//            type_id: 1
//        })
//        newPost.$save();

        $scope.add = function() {
            var newPost = new PostModel({
                share_id: $routeParams.share_id
            })

            $scope.posts.unshift(newPost);
        }
    }]);