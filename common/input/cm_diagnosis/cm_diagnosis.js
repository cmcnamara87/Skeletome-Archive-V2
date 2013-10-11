angular.module('directives.input.cmDiagnosis', [])

// A simple directive to display a gravatar image given an email
    .directive('cmDiagnosis', ['VoteModel', function (VoteModel) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, el, tAttrs) {

                // Vote up
                $scope.voteUpDiagnosis = function(diagnosis) {

                    var newVote = new VoteModel({
                        diagnosis_id: diagnosis.id,
                        vote: 1
                    });
                    newVote.$save();
                    diagnosis.votes.unshift(newVote);
                }

                $scope.getVotesUp = function(votes) {
                    var votesUp = [];
                    angular.forEach(votes, function(vote, voteIndex) {
                        if(vote.vote == 1) {
                            votesUp.push(vote);
                        }
                    });
                    return votesUp;
                }
                $scope.getVotesDown = function(votes) {
                    var votesDown = [];
                    angular.forEach(votes, function(vote, voteIndex) {
                        if(vote.vote == -1) {
                            votesDown.push(vote);
                        }
                    });
                    return votesDown;
                }

                // Vote down
                $scope.voteDownDiagnosis = function(diagnosis) {
                    var newVote = new VoteModel({
                        diagnosis_id: diagnosis.id,
                        vote: -1
                    });
                    newVote.$save();
                    diagnosis.votes.unshift(newVote);
                }
            }
        };
    }]);