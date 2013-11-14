angular.module('directives.mentions', [])

// A simple directive to display a gravatar image given an email
    .directive('mentions', [function () {

        return {
            restrict: 'E',
            scope: {
                text: '=',
                mentions: '='
            },
            link: function ($scope, element, attrs) {

//                element.css({
//                    'padding': '14px',
//                    'line-height': '28px',
//                    'display': 'block'
//                });
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

                var markup = function(text, mentions) {
                    var formattedText = text;

                    angular.forEach(mentions, function(mention, mentionIndex) {
                        var re = new RegExp('\\b(' + mention.name + ')\\b', "gi");
                        formattedText = formattedText.replace(re, "<a href='#' title='" + mention[mention.mentioned_type].name + "'>$1</a>");
                    });
                    element.html(formattedText);
                }

            }
        };
    }]);