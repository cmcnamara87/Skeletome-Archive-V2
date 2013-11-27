angular.module('directives.mentions', [])

// A simple directive to display a gravatar image given an email
    .directive('mentions', ['apiUrl2', '$compile', '$http', 'DiagnosisModel', function (apiUrl2, $compile, $http, DiagnosisModel) {

        return {
            restrict: 'E',
            scope: {
                text: '=',
                mentions: '='
            },
            templateUrl: 'common/directives/mentions/mentions.tpl.html',
            link: function ($scope, element, attrs) {

                element.addClass('mentions');

                $scope.$watch('mentions', function(mentions) {
                    // mentions changed
                    markup($scope.text, mentions);
                });

                $scope.$watch('text', function(text, oldText) {
                    // text changed

                    if(oldText != null) {
                        // we had some old text, its just being updated
                        setTimeout(function() {
                            if($scope.text == text) {
                                // hasnt changed for 0.5 seconds
                                // run the update
                                markup(text, $scope.mentions);
                            }
                        }, 200);
                    } else {
                        markup(text, $scope.mentions);
                    }
                })

                $scope.mentionClicked = function(index) {
                    "use strict";
                    $scope.disorder = null;
                    var mention = $scope.mentions[index];
                    console.log("mention is", mention);

                    // Get the data
                    if(mention.mentioned_type == "disorder") {
                        $http.get(apiUrl2 + "disorder/" + mention.disorder.id + "/description").then(function(repsonse) {
                            $scope.disorder = repsonse.data;
                        });
                        $scope.diagnoses = DiagnosisModel.index({
                            disorder_id: mention.disorder.id
                        })
                    }
                }

                var markup = function(text, mentions) {
                    var formattedText = text;

                    angular.forEach(mentions, function(mention, mentionIndex) {
//                        href='" + apiUrl2 + "disorder/" + mention[mention.mentioned_type].id + "/description'
                        var re = new RegExp('\\b(' + mention.name + ')\\b', "gi");
                        formattedText = formattedText.replace(re, "<a href ng-click='mentionClicked(" + mentionIndex + ")' title='" + mention[mention.mentioned_type].name + "'>$1</a>");
                    });
                    element.find('.mentions-text').html($compile(formattedText)($scope));
                }

            }
        };
    }]);