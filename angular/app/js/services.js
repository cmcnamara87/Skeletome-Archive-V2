'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
myApp.services = angular.module('myApp.services', ['ngResource']);


myApp.services.value('version', '0.1');

myApp.services.factory('baseUrl', function() {
    if (!window.location.origin) {
        return window.location.protocol+"//"+window.location.host;
    } else {
        return window.location.origin;
    }
});

myApp.services.factory('tokenUrl', function(baseUrl) {
    return baseUrl + '/drupal/services/session/token';
});
myApp.services.factory('connectUrl', function(baseUrl) {
    return baseUrl + '/drupal/api/system/connect.json';
});
myApp.services.factory('apiUrl', function(baseUrl) {
    return baseUrl + '/drupal/api/';
});
myApp.services.factory('apiUrl2', function(baseUrl) {
    return baseUrl + '/drupal/api/';
});

myApp.services.factory('UserModel', function ($resource, apiUrl) {
    return $resource(apiUrl + 'user/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    });
});

myApp.services.factory('Param', function ($resource, apiUrl) {
    return {
        makeParams: function(params) {
            var result = {};
            angular.forEach(params, function(value, key) {
                result['parameters[' + key + ']'] = value;
            });
            return result;
        }
    };
});


myApp.services.factory('DiagnosisModel', function ($resource, apiUrl, VoteModel, Param) {
    var MyResource = $resource(apiUrl + 'diagnosis/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });

    MyResource.prototype.tally = function() {
        var tally = 0;
        angular.forEach(this.votes, function(vote, voteIndex) {
            tally += parseInt(vote.vote);
        });
        return tally;
    }

    MyResource.addDiagnosisOfDisorderToShare = function(disorder, share) {
        // Create a model for saving a new diagnosis (used in createDiagnosis)
        var newDiagnosis = new MyResource({
            disorder_id: disorder.id,
            share_id: share.id
        });

        newDiagnosis.$save(function() {
            share.diagnoses.unshift(newDiagnosis);

            // Create a vote for the diagnosis
            newDiagnosis.votes = [];
            var newVote = new VoteModel({
                diagnosis_id: newDiagnosis.id,
                vote: 1
            });

            newVote.$save(function() {
                newDiagnosis.votes.unshift(newVote);
            });
        });

        return newDiagnosis;
    }

    MyResource.prototype.getVotes = function() {
        console.log("calling get votes");
        this.votes = VoteModel.query(Param.makeParams({diagnosis_id: this.id}));
    }

    return MyResource;
});

myApp.services.factory('XRayModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'xray/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        },
        {
            update: {method:'PUT'}
        });
    return MyResource;
});

myApp.services.factory('VoteModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'vote/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    return MyResource;
});

myApp.services.factory('DisorderModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'disorder/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    return MyResource;
});


myApp.services.factory('PostTypeModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'post_type/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    return MyResource;
});

myApp.services.factory('MembershipModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'membership/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    }, {
        update: {method:'PUT'}
    });
    return MyResource;
});


myApp.services.factory('PatientModel', function ($resource, apiUrl) {
    return $resource(apiUrl + 'patient/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    },
    {
        update: {method:'PUT'}
    });
});
myApp.services.factory('IdentifierModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'identifier/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    },
    {
        update: {method:'PUT'}
    });
    return MyResource;
});
myApp.services.factory('AddressModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'address/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        },
        {
            update: {method:'PUT'}
        });
    return MyResource;
});

myApp.services.factory('ShareModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'share/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });

    return MyResource;
});

myApp.services.factory('GroupModel', function ($resource, apiUrl) {
    return $resource(apiUrl + 'group/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    });
});

myApp.services.factory('PostModel', function ($resource, apiUrl) {
    return $resource(apiUrl + 'post/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    });
});
myApp.services.factory('ReplyModel', function ($resource, apiUrl) {
    return $resource(apiUrl + 'reply/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    });
});



myApp.services.factory('GeneMutationModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'gene_mutation/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        },
        {
            update: {method:'PUT'}
        });
    return MyResource;
});
myApp.services.factory('MutationTypeModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'mutation_type/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        });
    return MyResource;
});
myApp.services.factory('GeneModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'gene/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    return MyResource;
});


myApp.services.factory('auth', function($http, $q, $cookies, tokenUrl, connectUrl, apiUrl2) {

    var user = null;

    var storeSession = function(sessionResponse) {
        var sessionName = sessionResponse.session_name;
        var sessionId = sessionResponse.sessid;
        $cookies[sessionName] = sessionId;
    }
    var storeToken = function(token) {
        $http.defaults.headers.common['X-CSRF-Token'] = token;
    }

    return {
        login: function(credentials) {
            var defer = $q.defer();

            // login with credentials (username, password)
            $http.post(apiUrl2 + "user/login", credentials).success(function (data) {
                user = data.user;

                // Store the session in the cookie for future authentication
                storeSession(data);

                // Get the CSRF token (needed to make authenticated requests in the future)
                $http.post(tokenUrl).success(function (data) {
                    storeToken(data);

                    defer.resolve(user);
                });
            });

            return defer.promise;
        },
        logout: function() {
            var defer = $q.defer();
            $http.post(apiUrl2 + "user/logout", {}).success(function (data) {
                user = null;
                defer.resolve(data);
            });
            return defer.promise;
        },

        getUser: function() {
            return user;
        },

        checkCurrentUser: function() {
            console.log("calling current user");
            var defer = $q.defer();

            if(user) {
                defer.resolve(user);
            }

            // Get the CSRF token
            console.log("getting the token");
            $http.post(tokenUrl).success(function (data) {
                console.log("got the token url");
                storeToken(data);

                $http.post(connectUrl, {
                }).success(function (data) {

                    if(data.user.uid == 0) {
                        // anonymous user, no one logged in
                        user = null;
                        defer.reject();
                    } else {
                        storeSession(data);
                        user = data.user;
                        console.log("user is ", user);
                        defer.resolve(user);
                    }
                });
            });

            return defer.promise;
        }
    }

});

//

myApp.services.factory('currentUser', function($http, $q, tokenUrl) {
        var defer = $q.defer();

        $http.post(tokenUrl).success(function (data) {
            console.log("CSRF Token:", data);
            $http.defaults.headers.common['X-CSRF-Token'] = data;

            console.log("Getting current user...");
            $http.post(connectUrl, {
            }).success(function (data) {
                    console.log("got current user", data);
                defer.resolve(data);
            });
        });
        return defer.promise;
    });


