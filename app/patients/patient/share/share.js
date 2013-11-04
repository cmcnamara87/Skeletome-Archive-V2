angular.module('patient.share', ['patient.share.discussion', 'patient.share.diagnoses'])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/share/:share_id', {
            templateUrl:'app/patients/patient/share/share.tpl.html',
            controller:'ShareCtrl',
            resolve:{
                activities: ['ActivityModel', '$route', '$q', function (ActivityModel, $route, $q) {
                    var defer = $q.defer();
                    var activity = ActivityModel.index({
                        share_id: $route.current.params.share_id
                    }, function() {
                        defer.resolve(activity);
                    });

                    return defer.promise;
                }],
                share: ['ShareModel', '$route', '$q', function (ShareModel, $route, $q) {

                    var defer = $q.defer();

                    var share = ShareModel.get({
                        'id': $route.current.params.share_id
                    }, function() {
                        defer.resolve(share);
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('ShareCtrl', ['$scope', '$location', '$q', '$route', 'PostModel', 'ActivityModel', 'ReplyModel', 'AuthService', 'DisorderModel', 'DiagnosisModel', 'share', 'activities', function ($scope, $location,$q, $route, PostModel, ActivityModel, ReplyModel, AuthService, DisorderModel,DiagnosisModel, share, activities) {
        $scope.share = share;
        $scope.activities = activities;
        $scope.patient_id = $route.current.params.patient_id;

        $scope.newDiagnosis = {};
        $scope.newPost = {};

        $scope.adding = "post";

//        angular.forEach($scope.activities, function(activity, activityIndex) {
//            var newReply = new ReplyModel({
//                text: 'My favourite number is: ' + Math.random()*100,
//                activity_id: activity.id
//            })
//            newReply.$save();
//        });

        $scope.addDiagnosis = function(disorder) {
            var newDiagnosis = new DiagnosisModel({
                disorder_id: disorder.id,
                disorder: disorder,
                share_id: $scope.share.id,
                patient_id: $scope.patient_id
            });

            // Create a temp activity
            // and add it to the ui straight away
            // this will make things look nice and faster
            var tempActivity = new ActivityModel({
                type: "diagnosis",
                diagnosis: newDiagnosis,
                share_id: $scope.share.id,
                user: AuthService.getUser()
            });
            $scope.activities.unshift(tempActivity);

            // Save the post
            newDiagnosis.$save(function() {
                // got back the saved post
                // insert that into the temp activity cause there is going to be
                // another delay, as we get the new actual activity
                tempActivity.diagnosis = newDiagnosis;

                // Now get the real activity using that posts id
                // And merge that with our 'temp activity'
                ActivityModel.index({
                    object_id: newDiagnosis.id,
                    type: 'diagnosis'
                }, function(activities) {
                    var savedActivity = activities[0];
                    angular.copy(savedActivity, tempActivity);
                });
            });

            $scope.newDiagnosis.disorders = [];
        }
        $scope.findDisorder = function(value) {
            var defer = $q.defer();
            DisorderModel.index({
                name: value
            }, function(disorders) {
                defer.resolve(disorders)
            });
            return defer.promise;
        }

        /**
         * Adds a new post
         */
        $scope.addPost = function(text) {
            var newPost = new PostModel({
                text: text,
                share_id: $scope.share.id
            });

            // Create a temp activity
            // and add it to the ui straight away
            // this will make things look nice and faster
            var tempActivity = new ActivityModel({
                type: "post",
                post: newPost,
                share_id: $scope.share.id,
                user: AuthService.getUser()
            });
            $scope.activities.unshift(tempActivity);

            // Save the post
            newPost.$save(function(post) {
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

            $scope.newPost = {};
        }

        $scope.removeAddress = function(address) {
            var index = $scope.addresses.indexOf(address);
            $scope.addresses.splice(index, 1);
        }
    }]);