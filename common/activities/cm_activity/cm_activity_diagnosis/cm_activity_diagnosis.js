angular.module('directives.activities.cmActivity.cmActivityDiagnosis', [])

// A simple directive to display a gravatar image given an email
    .directive('cmActivityDiagnosis', ['VoteModel', 'SessionService', function (VoteModel, SessionService) {
        return {
            restrict: 'E',
            scope: {
                diagnosisPost: '='
            },
            templateUrl: 'common/activities/cm_activity/cm_activity_diagnosis/cm_activity_diagnosis.tpl.html',
            link: function ($scope, el, tAttrs) {

                $scope.isShowingVotes = false;
                $scope.votes = null;

                $scope.$watch(function() {
                    return $scope.diagnosisPost.votes_up - $scope.diagnosisPost.votes_down;
                }, function() {
                    var total = $scope.diagnosisPost.votes_up + $scope.diagnosisPost.votes_down
                    $scope.percentUp =  $scope.diagnosisPost.votes_up / total * 100;
                    $scope.percentDown =  $scope.diagnosisPost.votes_down / total * 100;
                })

                $scope.showVotes = function() {
                    $scope.isShowingVotes = true;
                    if(!$scope.votes) {
                        $scope.votes = VoteModel.index({
                            post_id: $scope.diagnosisPost.id
                        });
                    }
                }
                $scope.hideVotes = function() {
                    $scope.isShowingVotes = false;
                };

                $scope.vote = function(vote) {
                    var newVote = new VoteModel({
                        post_id: $scope.diagnosisPost.id,
                        vote: vote,
                        user: SessionService.currentUser
                    });
                    newVote.$save();
                    if($scope.votes) {
                        $scope.votes.push(newVote);
                    }
                    if(vote > 0) {
                        $scope.diagnosisPost.votes_up++;
                    } else {
                        $scope.diagnosisPost.votes_down++;
                    }
                }
            }
        };
    }]);