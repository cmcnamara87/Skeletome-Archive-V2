'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
myApp.services = angular.module('myApp.services', ['ngResource']);


myApp.services.value('version', '0.1');

myApp.services.factory('baseUrl', function() {
    var baseUrl = "";
    if (!window.location.origin) {
        baseUrl = window.location.protocol+"//"+window.location.host;
    } else {
        baseUrl = window.location.origin;
    }

    if(baseUrl == "http://localhost:8888") {
        baseUrl += "/skelarchv2"

    }

    return baseUrl;
});

myApp.services.factory('fileUploadUrl', function(baseUrl) {
    console.log("test");
    return baseUrl + '/drupal/upload';
});
myApp.services.factory('recommendTagsUrl', function(baseUrl) {
    return baseUrl + '/drupal/recommend_tags';
});

myApp.services.factory('tokenUrl', function(baseUrl) {
    return baseUrl + '/drupal/services/session/token';
});
myApp.services.factory('connectUrl', function(baseUrl) {
    return baseUrl + '/drupal/api/system/connect.json';
});
myApp.services.factory('apiUrl', function(baseUrl) {
    var escapedUrl = baseUrl.replace(":8888","\\\:8888");
    console.log("escaped url", escapedUrl);
    return escapedUrl + '/drupal/api/';
});


myApp.services.factory('MenubarService', function() {
    return {
    }
});

myApp.services.factory('apiUrl2', function(baseUrl) {
    return baseUrl + '/drupal/api/';
});

myApp.services.factory('UserModel', function ($resource, apiUrl, Param, $http, apiUrl2) {

    var MyResource = $resource(apiUrl + 'user/:uid/:action', {
        uid: '@uid', //this binds the ID of the model to the URL param,
        action: '@action'
    }, {
        update: {method:'PUT'}
    });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    /**
     * Registers the user
     * @returns {promise} A promise that the user will be registered
     */
    MyResource.prototype.$register = function() {
        this.action = "register";
        return this.$save();
    }

    MyResource.prototype.$setPicture = function(file) {
        var that = this;
        console.log("UserModel: Setting picture");
        return $http.post(apiUrl2 + "user/" + this.uid + "/picture", file).then(function() {
            that.picture = file;
            return that;
        });
    }

    return MyResource;
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

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    MyResource.addDiagnosisOfDisorderToShare = function(disorder, share) {
        // Create a model for saving a new diagnosis (used in createDiagnosis)
        var newDiagnosis = new MyResource({
            disorder_id: disorder.id,
            share_id: share.id
        });

        newDiagnosis.$save(function() {
            share.diagnoses.unshift(newDiagnosis);
            newDiagnosis.voteUp();
        });

        return newDiagnosis;
    }

    MyResource.prototype.voteUp = function() {
        var that = this;
        var newVote = new VoteModel({
            diagnosis_id: this.id,
            vote: 1
        });
        newVote.$save();
        that.votes.unshift(newVote);
    }
    MyResource.prototype.voteDown = function() {
        var that = this;
        var newVote = new VoteModel({
            diagnosis_id: this.id,
            vote: -1
        });
        newVote.$save();
        this.votes.unshift(newVote);

    }

    MyResource.prototype.getVotes = function() {
        console.log("calling get votes");
        this.votes = VoteModel.query(Param.makeParams({diagnosis_id: this.id}));
    }

    return MyResource;
});

myApp.services.factory('XRayModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'xray/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        },
        {
            update: {method:'PUT'}
        });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    return MyResource;
});

myApp.services.factory('ListModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'list/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        },
        {
            update: {method:'PUT'}
        });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    return MyResource;
});

myApp.services.factory('VoteModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'vote/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
});

myApp.services.factory('DisorderModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'disorder/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
});
myApp.services.factory('ConsentFileModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'consentfile/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    }, {
        update: {method:'PUT'}
    });
    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
});

myApp.services.factory('PostTypeModel', function ($resource, apiUrl) {
    var MyResource = $resource(apiUrl + 'post_type/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    return MyResource;
});

myApp.services.factory('MembershipModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'membership/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    }, {
        update: {method:'PUT'}
    });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    return MyResource;
});


myApp.services.factory('PatientModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'patient/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    },
    {
        update: {method:'PUT'}
    });

    MyResource.index = function(object, success, failure) {
        console.log("making params");
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    MyResource.queryParams = function(query, params) {
        var params = Param.makeParams(params);
        angular.extend(params, query);
        return MyResource.query(params);
    }

    MyResource.prototype.fullName = function() {
        return this.first_name + " " + this.last_name;
    }

    return MyResource;
});

myApp.services.factory('HPOModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'hpo/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    },
    {
        update: {method:'PUT'}
    });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }


    return MyResource;
});

myApp.services.factory('HPOTagModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'hpo_tag/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    },
    {
        update: {method:'PUT'}
    });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
});
myApp.services.factory('MentionModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'mention/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    },
    {
        update: {method:'PUT'}
    });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
});

myApp.services.factory('IdentifierModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'identifier/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    },
    {
        update: {method:'PUT'}
    });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    return MyResource;
});
myApp.services.factory('AddressModel', ['$resource', 'apiUrl', 'baseUrl', 'Param', '$http', '$q', function ($resource, apiUrl, baseUrl, Param, $http, $q) {
    var MyResource = $resource(apiUrl + 'address/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        },
        {
            update: {method:'PUT'}
        });
    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    MyResource.lookupAddress = function(input, type) {
        var defer = $q.defer();

        $http.get(baseUrl + "/drupal/api/addresslookup?parameters[input]=" + input + "&parameters[type]=" + type).success(function(data) {
            defer.resolve(data);
        });

        return defer.promise;
    }

    return MyResource;
}]);

myApp.services.factory('ActivityModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'activity/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
});

myApp.services.factory('ShareModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'share/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
});


myApp.services.factory('SuperResource', function($resource, $cacheFactory, apiUrl) {

    var superResource = function(objectName) {
        var resource = $resource(apiUrl + url + '/:id', {
            id: '@id' //this binds the ID of the model to the URL param
        }, {
            update: {method:'PUT'}
        });

        return {

        }

    }
    return superResource;
})

myApp.services.factory('GroupModel', function (CacheTest, $resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'group/:id', {
            id: '@id' //this binds the ID of the model to the URL param
        },
        {
            update: {method:'PUT', cache: CacheTest},
            'save':   {method:'POST', cache: CacheTest},
            'get':    {method:'GET', cache: CacheTest}
        }
    );

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
});


myApp.services.factory('CacheTest', function ($cacheFactory, $rootScope) {
    var cache = $cacheFactory('group');

    cache.bloop = cache.put;

    cache.put = function(key, value) {
        console.log("key, value", key, value);
        return cache.bloop(key, value);
    }
//    setTimeout(function() {
//        console.log("cahce info", cache.info());
//
//        var groupstored = cache.get("http://localhost:8888/skelarchv2/drupal/api/group/3");
//        console.log("cahce info", groupstored);
//        var object =  angular.fromJson(groupstored[1]);
//        groupstored[1] = angular.toJson({yo: 'test'});
//
//        console.log("new", groupstored);
//
//        console.log("stored", cache.get("http://localhost:8888/skelarchv2/drupal/api/group/3"));
//
//    }, 2000);
    return cache;
});

myApp.services.factory('PostModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'post/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    });
    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
});
myApp.services.factory('ReplyModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'reply/:id', {
        id: '@id' //this binds the ID of the model to the URL param
    });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;

});



myApp.services.factory('GeneticReportModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'genetic_report/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        },
        {
            update: {method:'PUT'}
        });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    return MyResource;
});
myApp.services.factory('GeneMutationModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'gene_mutation/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        },
        {
            update: {method:'PUT'}
        });

    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    return MyResource;
});
myApp.services.factory('MutationTypeModel', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'mutation_type/:id', {
            id: '@id' //this binds the ID of the model to the URL param,
        });
    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }

    return MyResource;
});
myApp.services.factory('GeneModel', ['$resource', 'apiUrl', 'Param', function ($resource, apiUrl, Param) {
    var MyResource = $resource(apiUrl + 'gene/:id', {
        id: '@id' //this binds the ID of the model to the URL param,
    });
    MyResource.index = function(object, success, failure) {
        return MyResource.query(Param.makeParams(object), success, failure);
    }
    return MyResource;
}]);


