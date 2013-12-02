angular.module('directives.mentions', [])

// A simple directive to display a gravatar image given an email
    .directive('mentions', ['apiUrl2', '$compile', '$http', 'DiagnosisModel', 'createModal', 'PatientModel',
        function (apiUrl2, $compile, $http, DiagnosisModel, createModal, PatientModel) {

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

                    $scope.mention = $scope.mentions[index];

                    // Get the data
                    if($scope.mention.mentioned_type == "disorder") {
                        var newScope = $scope.$new();
                        newScope.disorder = null;
                        $http.get(apiUrl2 + "disorder/" + $scope.mention.disorder.id + "/description").then(function(repsonse) {
                            newScope.disorder = repsonse.data;
                        });
                        newScope.diagnoses = DiagnosisModel.index({
                            disorder_id: $scope.mention.disorder.id
                        })
                        createModal({scope: newScope, url: 'common/directives/mentions/modal_disorder.tpl.html'}).then(function(modal) {
                            console.log("resolved");
                            modal.show();
                        });
                    } else if ($scope.mention.mentioned_type == "hpo") {
                        var newScope = $scope.$new();
                        newScope.patients = null;
                        newScope.hpo = $scope.mention.hpo;
                        createModal({scope: newScope, url: 'common/directives/mentions/modal_hpo.tpl.html'}).then(function(modal) {
                            console.log("resolved");
                            modal.show();
                        });

                        PatientModel.queryParams({embed: 1}, {
                            hpo_id: $scope.mention.hpo.id
                        }).$promise.then(function(patients) {
                            newScope.patients = patients;
                        });
                    }


                }

                var markup = function(text, mentions) {
                    var formattedText = text;

                    angular.forEach(mentions, function(mention, mentionIndex) {
//                        href='" + apiUrl2 + "disorder/" + mention[mention.mentioned_type].id + "/description'
                        var re = new RegExp('\\b(' + mention.name + ')\\b', "gi");
                        formattedText = formattedText.replace(re, "<a href ng-click='mentionClicked(" + mentionIndex + ")' title='" + mention[mention.mentioned_type].name + "'>$1</a>");
                    });
                    var $formattedText = angular.element("<div>" + formattedText + "</div>");
                    element.find('.mentions-text').html($formattedText);
                    // Compile the formatted text
                    $compile($formattedText)($scope);
                }

            }
        };
    }]);