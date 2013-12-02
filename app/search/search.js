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

        var page = 0;

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
            page = 0;
            doSearch().then(function(patients) {
                $scope.patients = patients;
                if(patients.length > 5) {
                    $scope.isMoreToLoad = true;
                }
            });
        }
        var doSearch = function() {
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
            return PatientModel.queryParams({embed: 1, page: page}, params).$promise;
        }

        $scope.loadMore = function() {
            "use strict";
            page++;

            $scope.isLoadingMore = true;
            doSearch().then(function(patients) {
                $scope.isLoadingMore = false;
                $scope.patients = $scope.patients.concat(patients);
                if(patients.length == 0) {
                    $scope.isMoreToLoad = false;
                }
            });
        }

        // Find all patients
        // with a disorder
        // with a hpo term
    });

