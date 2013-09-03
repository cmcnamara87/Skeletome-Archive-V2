angular.module('patient.share.discussion', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/share/:share_id/discussion', {
            templateUrl:'app/patients/patient/share/discussion/discussion.tpl.html',
            controller:'DiscussionCtrl',
            resolve:{
                posts: ['PostModel', '$route', '$q', function (PostModel, $route, $q) {

                    var defer = $q.defer();

                    var posts = PostModel.index({
                        'share_id': $route.current.params.share_id
                    }, function() {
                        defer.resolve(posts);
                    });

                    return defer.promise;
                }],

                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('DiscussionCtrl', ['$scope', '$location', 'posts', function ($scope, $location, posts) {
        $scope.posts = posts;
    }]);