angular.module('patient.genetic_reports', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/genetic-reports', {
            templateUrl:'app/patients/patient/genetic_reports/genetic_reports.tpl.html',
            controller:'GeneticReportsCtrl',
            resolve:{
                mutations: ['GeneMutationModel', '$route', '$q', function (GeneMutationModel, $route, $q) {
                    var defer = $q.defer();
                    var mutations = GeneMutationModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(mutations);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('GeneticReportsCtrl', ['$scope', '$location', '$routeParams', 'GeneMutationModel', 'GeneModel', 'MutationTypeModel', 'mutations', function ($scope, $location, $routeParams, GeneMutationModel, GeneModel, MutationTypeModel, mutations) {
        $scope.mutations = mutations;

        // Get a list of genes
        $scope.genes = GeneModel.index();

        $scope.mutationTypes = MutationTypeModel.index();

        $scope.addGeneticReport = function() {

            var newGeneMutationModel = new GeneMutationModel({
                patient_id: $routeParams.patient_id
            });

            $scope.mutations.push(newGeneMutationModel);
        }

        $scope.save = function(mutation) {
            mutation.$save();
        }
    }]);