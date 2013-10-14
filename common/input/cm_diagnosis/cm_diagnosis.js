angular.module('directives.input.cmDiagnosis', [])

// A simple directive to display a gravatar image given an email
    .directive('cmDiagnosis', ['VoteModel', function (VoteModel) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, el, tAttrs) {

                $scope.usersVotesUp = [];
                $scope.usersVoteDown = [];

                $scope.$watch(tAttrs.cmDiagnosis + ".votes", function(votes) {
                    angular.forEach(votes, function(vote, voteIndex) {
                        if(vote.vote == 1) {
                            $scope.usersVotesUp.push(vote.user);
                        } else {
                            $scope.usersVoteDown.push(vote.user);
                        }
                    });
                });

                // Vote up
                $scope.voteUpDiagnosis = function(diagnosis) {

                    var newVote = new VoteModel({
                        diagnosis_id: diagnosis.id,
                        vote: 1
                    });
                    newVote.$save();
                    diagnosis.votes.unshift(newVote);
                    $scope.usersVotesUp.push(newVote.user);
                }

                // Vote down
                $scope.voteDownDiagnosis = function(diagnosis) {
                    var newVote = new VoteModel({
                        diagnosis_id: diagnosis.id,
                        vote: -1
                    });
                    newVote.$save();
                    diagnosis.votes.unshift(newVote);
                    $scope.usersVoteDown.push(newVote.user);
                }
            }
        };
    }]);