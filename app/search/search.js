angular.module('search', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/search', {
            templateUrl: 'app/search/search.tpl.html',
            controller: 'SearchCtrl'
        });
    }])

    .controller('SearchCtrl', function ($scope, PatientModel, DisorderModel, HPOModel) {
        var test = new Array();
        test.push(149);

        $scope.disorders = [];

        $scope.findDisorders = function(name) {
            "use strict";
            return DisorderModel.index({
                name: name
            }).$promise;
        }
        $scope.findHpos = function(name) {
            "use strict";
            return HPOModel.index({
                name: name
            }).$promise;
        }

        $scope.$watch('disorders', function(disorders) {
            "use strict";
            search();
        }, true);

        $scope.$watch('hpos', function(hpos) {
            "use strict";
            console.log("hpos are now", $scope.hpos);
            search();
        }, true)


        var search = function() {
            "use strict";
            var hpo_ids = [];
            angular.forEach($scope.hpos, function(hpo, hpoIndex) {
                hpo_ids.push(hpo.id);
            });
            var disorder_ids = [];
            angular.forEach($scope.disorders, function(disorder, disorderIndex) {
                disorder_ids.push(disorder.id);
            });

            var params = {};
            if(hpo_ids.length) {
                params.hpo_id = JSON.stringify(hpo_ids)
            }
            if(disorder_ids.length) {
                params.disorder_id = JSON.stringify(disorder_ids)
            }
            $scope.patients = PatientModel.queryParams({embed: 1}, params);
        }

        // Find all patients
        // with a disorder
        // with a hpo term
    });

